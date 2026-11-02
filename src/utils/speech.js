// Text-to-Speech (TTS) utility using native Web Speech API
// Works seamlessly on iOS Safari, Chrome, and desktop browsers

export function speakText(text, lang = 'en', options = {}) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser');
    return;
  }

  // Cancel any currently speaking audio
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang === 'de' ? 'de-DE' : 'en-US';
  
  // Speed control: slow mode (0.65) or standard learning rate (0.9)
  if (options.slow) {
    utterance.rate = 0.65;
  } else if (options.rate) {
    utterance.rate = options.rate;
  } else {
    utterance.rate = 0.9;
  }

  utterance.pitch = options.pitch || 1.0;

  // Attempt to pick a natural voice if available
  const voices = window.speechSynthesis.getVoices();
  const targetPrefix = lang === 'de' ? 'de' : 'en';
  const matchingVoice = voices.find(
    (v) =>
      v.lang.startsWith(targetPrefix) &&
      (v.name.includes('Google') ||
        v.name.includes('Siri') ||
        v.name.includes('Natural') ||
        v.name.includes('Premium') ||
        v.name.includes('Daniel') ||
        v.name.includes('Samantha'))
  );

  if (matchingVoice) {
    utterance.voice = matchingVoice;
  }

  window.speechSynthesis.speak(utterance);
}
