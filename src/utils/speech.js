// Text-to-Speech (TTS) utility using native Web Speech API
// Works seamlessly on iOS Safari, Chrome, and desktop browsers

export function speakText(text, lang = 'en') {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser');
    return;
  }

  // Cancel any currently speaking audio
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang === 'de' ? 'de-DE' : 'en-US';
  utterance.rate = 0.9; // slightly slower for better learning pronunciation
  utterance.pitch = 1.0;

  // Attempt to pick a natural voice if available
  const voices = window.speechSynthesis.getVoices();
  const targetPrefix = lang === 'de' ? 'de' : 'en';
  const matchingVoice = voices.find(v => v.lang.startsWith(targetPrefix) && (v.name.includes('Google') || v.name.includes('Siri') || v.name.includes('Natural') || v.name.includes('Premium')));
  
  if (matchingVoice) {
    utterance.voice = matchingVoice;
  }

  window.speechSynthesis.speak(utterance);
}
