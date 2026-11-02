// Google Gemini Live API Client with Bi-directional Audio Streaming
// Uses WebSocket over Google AI BidiGenerateContent endpoint (v1beta)
// Native 16kHz PCM Input & 24kHz PCM Output with hardware downsampling

export class GeminiLiveClient {
  constructor(options = {}) {
    this.apiKey = options.apiKey || '';
    this.model = options.model || 'models/gemini-3.8-live';
    this.voiceName = options.voiceName || 'Kore'; // Kore, Aoede, Puck, Fenrir, Charon
    this.systemInstruction = options.systemInstruction || 'You are Emma, a friendly language tutor.';

    this.onStatusChange = options.onStatusChange || (() => {});
    this.onTranscript = options.onTranscript || (() => {});
    this.onAudioLevel = options.onAudioLevel || (() => {}); // for tutor mouth
    this.onUserAudioLevel = options.onUserAudioLevel || (() => {}); // for user mic meter
    this.onError = options.onError || (() => {});

    this.ws = null;
    this.audioContext = null;
    this.micStream = null;
    this.processorNode = null;
    this.inputSource = null;
    this.analyser = null;

    // Audio Output Playback state
    this.playbackContext = null;
    this.scheduledTime = 0;
    this.activeSources = [];
    this.isConnected = false;
    this.isMuted = false;

    // Client-side Voice Activity Detection (VAD)
    this.userHasSpoken = false;
    this.silenceTimer = null;
  }

  async connect() {
    if (!this.apiKey) {
      throw new Error('API Key is missing');
    }

    this.onStatusChange('connecting');

    const url = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${this.apiKey}`;
    this.ws = new WebSocket(url);

    this.ws.onopen = async () => {
      this.isConnected = true;
      this.onStatusChange('connected');
      this.sendInitialSetup();
      await this.startAudioRecording();
    };

    this.ws.onmessage = async (event) => {
      let data;
      try {
        if (event.data instanceof Blob) {
          const text = await event.data.text();
          data = JSON.parse(text);
        } else {
          data = JSON.parse(event.data);
        }
      } catch (e) {
        console.error('Error parsing live WS message:', e);
        return;
      }
      this.handleServerMessage(data);
    };

    this.ws.onerror = (err) => {
      console.error('Gemini Live WebSocket error:', err);
      this.onError('Ошибка соединения с Gemini Live');
      this.disconnect();
    };

    this.ws.onclose = (event) => {
      this.isConnected = false;
      this.onStatusChange('disconnected');
      this.cleanup();

      if (event.code === 1008) {
        this.onError('Неверный или неподдерживаемый API-ключ (код 1008). Убедитесь, что ключ создан в Google AI Studio и скопирован без пробелов.');
      } else if (event.code !== 1000 && event.reason) {
        this.onError(`Соединение закрыто (${event.code}): ${event.reason}`);
      }
    };
  }

  sendInitialSetup() {
    const setupMessage = {
      setup: {
        model: this.model,
        generationConfig: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: this.voiceName,
              },
            },
          },
        },
        inputAudioTranscription: {},
        outputAudioTranscription: {},
        systemInstruction: {
          parts: [{ text: this.systemInstruction }],
        },
      },
    };

    this.ws.send(JSON.stringify(setupMessage));
  }

  sendInitialGreeting() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    const greetingMsg = {
      clientContent: {
        turns: [
          {
            role: 'user',
            parts: [{ text: 'Hello! I am ready to practice. Please introduce yourself and give a warm 1-sentence welcome.' }],
          },
        ],
        turnComplete: true,
      },
    };
    this.ws.send(JSON.stringify(greetingMsg));
  }

  handleServerMessage(msg) {
    if (msg.setupComplete) {
      this.sendInitialGreeting();
      return;
    }

    // 1. Audio output chunks from model
    const parts = msg.serverContent?.modelTurn?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.mimeType?.startsWith('audio/pcm')) {
          this.playAudioChunk(part.inlineData.data);
        }
        if (part.text) {
          this.onTranscript({ role: 'tutor', text: part.text });
        }
      }
    }

    // 2. Transcriptions
    if (msg.serverContent?.inputTranscription?.text) {
      this.onTranscript({ role: 'user', text: msg.serverContent.inputTranscription.text });
    }
    if (msg.serverContent?.outputTranscription?.text) {
      this.onTranscript({ role: 'tutor', text: msg.serverContent.outputTranscription.text });
    }

    // 3. User Interruption
    if (msg.serverContent?.interrupted) {
      this.stopPlayback();
    }
  }

  // Linear Interpolation Box Downsampler
  downsampleBuffer(buffer, inputSampleRate, outputSampleRate = 16000) {
    if (inputSampleRate === outputSampleRate) {
      return buffer;
    }
    const ratio = inputSampleRate / outputSampleRate;
    const newLength = Math.round(buffer.length / ratio);
    const result = new Float32Array(newLength);
    let offsetResult = 0;
    let offsetBuffer = 0;

    while (offsetResult < result.length) {
      const nextOffsetBuffer = Math.round((offsetResult + 1) * ratio);
      let accum = 0;
      let count = 0;
      for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
        accum += buffer[i];
        count++;
      }
      result[offsetResult] = count > 0 ? accum / count : 0;
      offsetResult++;
      offsetBuffer = nextOffsetBuffer;
    }

    return result;
  }

  async startAudioRecording() {
    try {
      this.micStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      const inputSampleRate = this.audioContext.sampleRate;
      this.inputSource = this.audioContext.createMediaStreamSource(this.micStream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;

      // 4096 frames ensures smooth downsampling windows without choking WebSocket
      this.processorNode = this.audioContext.createScriptProcessor(4096, 1, 1);

      this.processorNode.onaudioprocess = (e) => {
        if (!this.isConnected || !this.ws || this.ws.readyState !== WebSocket.OPEN) return;
        if (this.isMuted) {
          this.onUserAudioLevel(0);
          return;
        }

        const rawData = e.inputBuffer.getChannelData(0);

        // Audio Level meter for user mic
        let sum = 0;
        for (let i = 0; i < rawData.length; i++) {
          sum += Math.abs(rawData[i]);
        }
        const level = Math.min(100, Math.round((sum / rawData.length) * 600));
        this.onUserAudioLevel(level);

        // Client-side VAD: detect user voice and silence trigger
        if (level > 12) {
          this.userHasSpoken = true;
          if (this.silenceTimer) {
            clearTimeout(this.silenceTimer);
            this.silenceTimer = null;
          }
        } else if (this.userHasSpoken && !this.silenceTimer) {
          // User spoke and then fell silent for 750ms -> notify Gemini of turn completion
          this.silenceTimer = setTimeout(() => {
            if (this.userHasSpoken) {
              this.userHasSpoken = false;
              this.silenceTimer = null;
              this.sendAudioStreamEnd();
            }
          }, 750);
        }

        // Resample hardware sample rate (e.g. 48000Hz or 44100Hz) down to pristine 16000Hz
        const resampled = this.downsampleBuffer(rawData, inputSampleRate, 16000);

        // Convert Float32 to 16-bit PCM little-endian
        const pcm16 = new Int16Array(resampled.length);
        for (let i = 0; i < resampled.length; i++) {
          const s = Math.max(-1, Math.min(1, resampled[i]));
          pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
        }

        const base64Data = this.arrayBufferToBase64(pcm16.buffer);

        // Standard Gemini Live API v1beta Realtime Audio packet
        const audioMsg = {
          realtimeInput: {
            audio: {
              mimeType: 'audio/pcm;rate=16000',
              data: base64Data,
            },
          },
        };

        this.ws.send(JSON.stringify(audioMsg));
      };

      this.inputSource.connect(this.analyser);
      this.analyser.connect(this.processorNode);

      // Connect to zero-gain mute node to prevent mic loopback into speakers
      const muteGain = this.audioContext.createGain();
      muteGain.gain.value = 0;
      this.processorNode.connect(muteGain);
      muteGain.connect(this.audioContext.destination);
    } catch (err) {
      console.error('Microphone recording error:', err);
      this.onError('Не удалось получить доступ к микрофону. Проверьте разрешения в браузере.');
    }
  }

  // Force trigger answer turn
  sendAudioStreamEnd() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    try {
      const endMsg = {
        realtimeInput: {
          audioStreamEnd: true,
        },
      };
      this.ws.send(JSON.stringify(endMsg));
    } catch (_) {}
  }

  // Send real-time text to live tutor
  sendTextMessage(text) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    try {
      const textMsg = {
        clientContent: {
          turns: [
            {
              role: 'user',
              parts: [{ text }],
            },
          ],
          turnComplete: true,
        },
      };
      this.ws.send(JSON.stringify(textMsg));
      this.onTranscript({ role: 'user', text });
    } catch (e) {
      console.error('Error sending text message to Live AI:', e);
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (muted) {
      this.onUserAudioLevel(0);
    }
  }

  playAudioChunk(base64Data) {
    if (!this.playbackContext) {
      this.playbackContext = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: 24000,
      });
      this.scheduledTime = this.playbackContext.currentTime;
    }

    if (this.playbackContext.state === 'suspended') {
      this.playbackContext.resume();
    }

    const pcmData = this.base64ToInt16Array(base64Data);
    const floatData = new Float32Array(pcmData.length);
    let sum = 0;
    for (let i = 0; i < pcmData.length; i++) {
      floatData[i] = pcmData[i] / 32768.0;
      sum += Math.abs(floatData[i]);
    }

    // Drive tutor avatar mouth lip-sync from model audio volume
    const tutorLvl = Math.min(100, Math.round((sum / pcmData.length) * 450));
    this.onAudioLevel(tutorLvl);

    const audioBuffer = this.playbackContext.createBuffer(1, floatData.length, 24000);
    audioBuffer.getChannelData(0).set(floatData);

    const source = this.playbackContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.playbackContext.destination);

    const startTime = Math.max(this.playbackContext.currentTime, this.scheduledTime);
    source.start(startTime);
    this.scheduledTime = startTime + audioBuffer.duration;

    this.activeSources.push(source);
    source.onended = () => {
      this.activeSources = this.activeSources.filter((s) => s !== source);
      if (this.activeSources.length === 0) {
        this.onAudioLevel(0);
      }
    };
  }

  stopPlayback() {
    for (const source of this.activeSources) {
      try {
        source.stop();
      } catch (_) {}
    }
    this.activeSources = [];
    if (this.playbackContext) {
      this.scheduledTime = this.playbackContext.currentTime;
    }
    this.onAudioLevel(0);
  }

  disconnect() {
    this.isConnected = false;
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
    if (this.ws) {
      try {
        this.ws.close();
      } catch (_) {}
      this.ws = null;
    }
    this.stopPlayback();
    this.cleanup();
    this.onStatusChange('disconnected');
    this.onAudioLevel(0);
    this.onUserAudioLevel(0);
  }

  cleanup() {
    if (this.micStream) {
      this.micStream.getTracks().forEach((track) => track.stop());
      this.micStream = null;
    }
    if (this.processorNode) {
      this.processorNode.disconnect();
      this.processorNode = null;
    }
    if (this.inputSource) {
      this.inputSource.disconnect();
      this.inputSource = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }

  arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  base64ToInt16Array(base64) {
    const binary = window.atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new Int16Array(bytes.buffer);
  }
}
