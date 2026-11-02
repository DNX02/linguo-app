// Advanced Speech Engine with Studio Neural Human Voice + iOS Siri/System Fallback
// Provides 100% natural, human-like voice for English and German

let currentAudio = null;
let cachedVoices = [];

function initVoices() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    cachedVoices = window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => {
      cachedVoices = window.speechSynthesis.getVoices();
    };
  }
}

initVoices();

/**
 * Play native device voice (iOS Siri / Google / System TTS)
 */
export function speakSystemVoice(text, lang = 'en', options = {}) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang === 'de' ? 'de-DE' : 'en-US';

  if (options.slow) {
    utterance.rate = 0.65;
  } else if (options.rate) {
    utterance.rate = options.rate;
  } else {
    utterance.rate = 0.9;
  }

  utterance.pitch = options.pitch || 1.0;

  const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
  const targetPrefix = lang === 'de' ? 'de' : 'en';

  // Priority scoring for the most natural human-sounding voices
  const naturalVoice = voices.find((v) => {
    if (!v.lang.startsWith(targetPrefix)) return false;
    const n = v.name.toLowerCase();
    return (
      n.includes('siri') ||
      n.includes('premium') ||
      n.includes('enhanced') ||
      n.includes('natural') ||
      n.includes('google') ||
      n.includes('samantha') ||
      n.includes('daniel') ||
      n.includes('anna') ||
      n.includes('katja')
    );
  });

  if (naturalVoice) {
    utterance.voice = naturalVoice;
  }

  window.speechSynthesis.speak(utterance);
}

/**
 * Play Studio Neural Audio (Cloud Human Voice)
 * Falls back to System Voice if offline or on network error
 */
export function speakText(text, lang = 'en', options = {}) {
  if (typeof window === 'undefined') return;

  const cleanText = text.trim();
  if (!cleanText) return;

  // Stop any currently playing audio or speech
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }

  const voiceEngine = localStorage.getItem('linguo_voice_engine') || 'studio'; // 'studio' or 'system'

  // If user explicitly chose system voice or browser is offline
  if (voiceEngine === 'system' || !navigator.onLine) {
    speakSystemVoice(cleanText, lang, options);
    return;
  }

  // Studio Neural Voice via Google Neural Audio CDN
  const targetLang = lang === 'de' ? 'de' : 'en';
  const encodedQuery = encodeURIComponent(cleanText);
  const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${targetLang}&client=tw-ob&q=${encodedQuery}`;

  const audio = new Audio(audioUrl);
  currentAudio = audio;

  // Rate adjustment for slow mode
  if (options.slow) {
    audio.playbackRate = 0.75;
  } else if (options.rate) {
    audio.playbackRate = options.rate;
  } else {
    audio.playbackRate = 1.0;
  }

  audio.play().catch((err) => {
    // If blocked by browser policy or network, seamlessly fallback to system voice
    console.warn('Neural audio playback fallback to system voice:', err.message);
    speakSystemVoice(cleanText, lang, options);
  });
}
