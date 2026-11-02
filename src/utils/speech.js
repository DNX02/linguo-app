// Studio Neural Human-like Speech Engine with Multi-Tier Fallback
// Tier 1: Real Cloud Neural Human Voice (Studio MP3 via Cloudflare CDN)
// Tier 2: Enhanced Native Siri / Google Neural / Microsoft Natural
// With persistent local audio caching for instant zero-latency playback

let currentAudio = null;
const audioCache = new Map();

// Load persistent audio cache from localStorage
try {
  const saved = localStorage.getItem('linguo_tts_cache');
  if (saved) {
    const parsed = JSON.parse(saved);
    Object.entries(parsed).forEach(([k, v]) => audioCache.set(k, v));
  }
} catch (_) {}

function saveCache(key, url) {
  audioCache.set(key, url);
  try {
    const obj = {};
    // Keep max 150 recent entries in localStorage
    const entries = Array.from(audioCache.entries()).slice(-150);
    entries.forEach(([k, v]) => { obj[k] = v; });
    localStorage.setItem('linguo_tts_cache', JSON.stringify(obj));
  } catch (_) {}
}

/**
 * Fetch real Cloud Neural Studio Voice
 */
async function fetchNeuralAudioUrl(text, lang = 'en') {
  const cacheKey = `${lang}:${text.trim().toLowerCase()}`;
  if (audioCache.has(cacheKey)) {
    return audioCache.get(cacheKey);
  }

  let voice = 'en-US';
  if (lang === 'de') voice = 'de-DE';
  else if (lang === 'fr') voice = 'fr-FR';
  else if (lang === 'es') voice = 'es-ES';

  try {
    const postRes = await fetch('https://api.soundoftext.com/sounds', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        engine: 'Google',
        data: { text: text.trim(), voice }
      })
    });

    if (!postRes.ok) throw new Error('TTS creation failed');
    const { id } = await postRes.json();
    if (!id) throw new Error('No sound id returned');

    // Poll for completion (usually takes < 150ms)
    for (let i = 0; i < 6; i++) {
      const getRes = await fetch(`https://api.soundoftext.com/sounds/${id}`);
      if (getRes.ok) {
        const data = await getRes.json();
        if (data.status === 'Done' && data.location) {
          saveCache(cacheKey, data.location);
          return data.location;
        }
      }
      await new Promise((r) => setTimeout(r, 150));
    }
  } catch (err) {
    console.warn('Neural audio fetch warning:', err);
  }

  return null;
}

/**
 * Get native system voices asynchronously (resolves empty voices in Chrome/Safari)
 */
function getSystemVoices() {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return resolve([]);
    }
    const current = window.speechSynthesis.getVoices();
    if (current && current.length > 0) return resolve(current);

    const timer = setTimeout(() => {
      resolve(window.speechSynthesis.getVoices() || []);
    }, 400);

    window.speechSynthesis.onvoiceschanged = () => {
      clearTimeout(timer);
      resolve(window.speechSynthesis.getVoices() || []);
    };
  });
}

/**
 * Pick the best possible human-sounding voice on the local device
 */
async function selectBestLocalVoice(lang) {
  const voices = await getSystemVoices();
  if (!voices || voices.length === 0) return null;

  let targetLang = 'en';
  if (lang === 'de') targetLang = 'de';
  else if (lang === 'fr') targetLang = 'fr';
  else if (lang === 'es') targetLang = 'es';

  // 1. Natural / Online / Siri / Google Enhanced voices
  const tier1 = voices.find((v) => {
    if (!v.lang.toLowerCase().startsWith(targetLang)) return false;
    const name = v.name.toLowerCase();
    return (
      name.includes('natural') ||
      name.includes('online') ||
      name.includes('siri') ||
      name.includes('enhanced') ||
      name.includes('google')
    );
  });
  if (tier1) return tier1;

  // 2. High quality named voices (Samantha, Daniel, Anna, Katja)
  const tier2 = voices.find((v) => {
    if (!v.lang.toLowerCase().startsWith(targetLang)) return false;
    const name = v.name.toLowerCase();
    return (
      name.includes('samantha') ||
      name.includes('daniel') ||
      name.includes('karen') ||
      name.includes('anna') ||
      name.includes('katja') ||
      name.includes('conrad')
    );
  });
  if (tier2) return tier2;

  // 3. Any voice matching language (avoid desktop robotic if possible)
  const nonDesktop = voices.find(
    (v) => v.lang.toLowerCase().startsWith(targetLang) && !v.name.toLowerCase().includes('desktop')
  );
  if (nonDesktop) return nonDesktop;

  return voices.find((v) => v.lang.toLowerCase().startsWith(targetLang)) || null;
}

/**
 * Native Speech Fallback
 */
export async function speakSystemVoice(text, lang = 'en', options = {}) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  let utterLang = 'en-US';
  if (lang === 'de') utterLang = 'de-DE';
  else if (lang === 'fr') utterLang = 'fr-FR';
  else if (lang === 'es') utterLang = 'es-ES';
  utterance.lang = utterLang;

  if (options.slow) {
    utterance.rate = 0.7;
  } else if (options.rate) {
    utterance.rate = options.rate;
  } else {
    utterance.rate = 0.92;
  }

  utterance.pitch = options.pitch || 1.0;

  const bestVoice = await selectBestLocalVoice(lang);
  if (bestVoice) {
    utterance.voice = bestVoice;
  }

  window.speechSynthesis.speak(utterance);
}

/**
 * Primary Speak Function: Studio Neural Voice (Real Human MP3) with seamless fallback
 */
export async function speakText(text, lang = 'en', options = {}) {
  if (typeof window === 'undefined') return;

  const cleanText = text.trim();
  if (!cleanText) return;

  // Stop any currently playing sound
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }

  const voiceEngine = typeof localStorage !== 'undefined' ? localStorage.getItem('linguo_voice_engine') : 'studio';
  if (voiceEngine === 'system') {
    await speakSystemVoice(cleanText, lang, options);
    return;
  }

  // Attempt real Studio Neural Audio first
  if (navigator.onLine) {
    try {
      const audioUrl = await fetchNeuralAudioUrl(cleanText, lang);
      if (audioUrl) {
        const audio = new Audio(audioUrl);
        currentAudio = audio;

        if (options.slow) {
          audio.playbackRate = 0.75;
        } else if (options.rate) {
          audio.playbackRate = options.rate;
        }

        await audio.play();
        return;
      }
    } catch (err) {
      console.warn('Neural audio play failed, using fallback voice:', err);
    }
  }

  // Fallback to high quality device voice
  await speakSystemVoice(cleanText, lang, options);
}
