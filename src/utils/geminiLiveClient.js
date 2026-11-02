// Google Gemini Live API Client with Bi-directional Audio Streaming
// Uses WebSocket over Google AI BidiGenerateContent endpoint
// Native 16kHz PCM Input & 24kHz PCM Output

export class GeminiLiveClient {
  constructor(options = {}) {
    this.apiKey = options.apiKey || '';
    this.model = options.model || 'models/gemini-2.0-flash-exp';
    this.voiceName = options.voiceName || 'Kore'; // Kore, Aoede, Puck, Fenrir, Charon
    this.systemInstruction = options.systemInstruction || 'You are Emma, a friendly language tutor.';

    this.onStatusChange = options.onStatusChange || (() => {});
    this.onTranscript = options.onTranscript || (() => {});
    this.onAudioLevel = options.onAudioLevel || (() => {});
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
  }

  async connect() {
    if (!this.apiKey) {
      throw new Error('API Key is missing');
    }

    this.onStatusChange('connecting');

    const url = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${this.apiKey}`;
    this.ws = new WebSocket(url);

    this.ws.onopen = async () => {
      this.isConnected = true;
      this.onStatusChange('connected');
      this.sendInitialSetup();
      await this.startAudioRecording();
    };

    this.ws.onmessage = async (event) => {
      let data;
      if (event.data instanceof Blob) {
        const text = await event.data.text();
        data = JSON.parse(text);
      } else {
        data = JSON.parse(event.data);
      }
      this.handleServerMessage(data);
    };

    this.ws.onerror = (err) => {
      console.error('Gemini Live WebSocket error:', err);
      this.onError('Ошибка соединения с Gemini Live');
      this.disconnect();
    };

    this.ws.onclose = () => {
      this.isConnected = false;
      this.onStatusChange('disconnected');
      this.cleanup();
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
        systemInstruction: {
          parts: [{ text: this.systemInstruction }],
        },
      },
    };

    this.ws.send(JSON.stringify(setupMessage));
  }

  handleServerMessage(msg) {
    // 1. Check for audio output chunks
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
    if (msg.serverContent?.inputTranscription) {
      this.onTranscript({ role: 'user', text: msg.serverContent.inputTranscription.text });
    }
    if (msg.serverContent?.outputTranscription) {
      this.onTranscript({ role: 'tutor', text: msg.serverContent.outputTranscription.text });
    }

    // 3. User Interruption: stop ongoing playback
    if (msg.serverContent?.interrupted) {
      this.stopPlayback();
    }
  }

  async startAudioRecording() {
    try {
      this.micStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: 16000,
      });

      this.inputSource = this.audioContext.createMediaStreamSource(this.micStream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;

      // Script processor for PCM chunks
      this.processorNode = this.audioContext.createScriptProcessor(2048, 1, 1);

      this.processorNode.onaudioprocess = (e) => {
        if (!this.isConnected || !this.ws || this.ws.readyState !== WebSocket.OPEN) return;

        const inputData = e.inputBuffer.getChannelData(0);
        
        // Audio Level meter
        let sum = 0;
        for (let i = 0; i < inputData.length; i++) {
          sum += Math.abs(inputData[i]);
        }
        const level = Math.min(100, Math.round((sum / inputData.length) * 500));
        this.onAudioLevel(level);

        // Convert Float32 to 16-bit PCM little-endian
        const pcm16 = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          const s = Math.max(-1, Math.min(1, inputData[i]));
          pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
        }

        const base64Data = this.arrayBufferToBase64(pcm16.buffer);
        const audioMsg = {
          realtimeInput: {
            mediaChunks: [
              {
                mimeType: 'audio/pcm;rate=16000',
                data: base64Data,
              },
            ],
          },
        };

        this.ws.send(JSON.stringify(audioMsg));
      };

      this.inputSource.connect(this.analyser);
      this.analyser.connect(this.processorNode);
      this.processorNode.connect(this.audioContext.destination);
    } catch (err) {
      console.error('Microphone recording error:', err);
      this.onError('Не удалось получить доступ к микрофону');
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
    for (let i = 0; i < pcmData.length; i++) {
      floatData[i] = pcmData[i] / 32768.0;
    }

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
  }

  disconnect() {
    this.isConnected = false;
    if (this.ws) {
      try {
        this.ws.close();
      } catch (_) {}
      this.ws = null;
    }
    this.stopPlayback();
    this.cleanup();
    this.onStatusChange('disconnected');
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
