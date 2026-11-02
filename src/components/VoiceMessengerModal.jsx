import React, { useState, useEffect, useRef } from 'react';
import { speakText } from '../utils/speech';
import { sounds } from '../utils/sounds';
import { haptics } from '../utils/haptics';
import { gamification } from '../utils/gamification';
import './VoiceMessengerModal.css';

const TUTOR_PROFILES = {
  en: { name: 'Emma', flag: '🇺🇸', role: 'Репетитор английского', avatar: '👩‍🏫', lang: 'en' },
  de: { name: 'Lukas', flag: '🇩🇪', role: 'Репетитор немецкого', avatar: '👨‍🏫', lang: 'de' },
  fr: { name: 'Amélie', flag: '🇫🇷', role: 'Репетитор французского', avatar: '👩‍🎨', lang: 'fr' },
  es: { name: 'Carlos', flag: '🇪🇸', role: 'Репетитор испанского', avatar: '👨‍🎨', lang: 'es' },
};

const SAMPLE_REPLIES = {
  en: [
    { text: "Hello! It's so great to hear your voice! How has your day been so far?", ru: "Привет! Так здорово слышать твой голос! Как проходит твой день?" },
    { text: "That is fantastic! Remember, consistency is the key to mastering English.", ru: "Это потрясающе! Помни, регулярность — ключ к свободному владению английским." },
    { text: "Your pronunciation sounded very clear and confident today. Keep it up!", ru: "Твоё произношение сегодня звучало очень чисто и уверенно. Так держать!" }
  ],
  de: [
    { text: "Hallo! Freut mich sehr, von dir zu hören! Wie geht es dir heute?", ru: "Привет! Очень рад тебя слышать! Как твои дела сегодня?" },
    { text: "Sehr gut gesprochen! Deutsch zu lernen braucht etwas Geduld, aber du machst tolle Fortschritte.", ru: "Очень хорошо сказано! Изучение немецкого требует терпения, но ты делаешь отличные успехи." }
  ],
  fr: [
    { text: "Bonjour! Quel plaisir d'écouter votre message vocal! Comment allez-vous?", ru: "Здравствуйте! Какое удовольствие слушать ваше голосовое сообщение! Как ваши дела?" },
    { text: "Magnifique accent! Continuez à pratiquer comme ça chaque jour.", ru: "Великолепный акцент! Продолжайте практиковаться так каждый день." }
  ],
  es: [
    { text: "¡Hola! ¡Qué alegría escuchar tu mensaje! ¿Qué planes tienes para hoy?", ru: "Привет! Какая радость услышать твоё сообщение! Какие планы на сегодня?" },
    { text: "¡Muy bien dicho! El español es un idioma hermoso y estás mejorando rápido.", ru: "Очень хорошо сказано! Испанский — прекрасный язык, и ты быстро прогрессируешь." }
  ]
};

export default function VoiceMessengerModal({ isOpen, onClose, currentLanguage = 'en' }) {
  const [selectedLang, setSelectedLang] = useState(
    ['en', 'de', 'fr', 'es'].includes(currentLanguage) ? currentLanguage : 'en'
  );
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'tutor',
      type: 'voice',
      duration: '0:04',
      text: 'Hello! Send me a voice note or ask any question. I am here to help you practice!',
      ru: 'Привет! Отправь мне голосовое сообщение или задай вопрос. Я помогу тебе с практикой!'
    }
  ]);
  const [isRecording, setIsRecording] = useState(false);
  const [recSeconds, setRecSeconds] = useState(0);
  const [inputText, setInputText] = useState('');
  const [playingId, setPlayingId] = useState(null);

  const tutor = TUTOR_PROFILES[selectedLang] || TUTOR_PROFILES.en;
  const messagesEndRef = useRef(null);
  const recTimerRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  if (!isOpen) return null;

  const startVoiceRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Микрофон не поддерживается в этом браузере. Вы можете отправить текстовое сообщение!');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      let langCode = 'en-US';
      if (selectedLang === 'de') langCode = 'de-DE';
      if (selectedLang === 'fr') langCode = 'fr-FR';
      if (selectedLang === 'es') langCode = 'es-ES';

      recognition.lang = langCode;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsRecording(true);
        setRecSeconds(0);
        recTimerRef.current = setInterval(() => setRecSeconds((s) => s + 1), 1000);
        haptics.medium();
        sounds.playTap?.();
      };

      recognition.onresult = (event) => {
        const spoken = event.results[0][0].transcript;
        handleSendUserMessage(spoken, true);
      };

      recognition.onerror = () => {
        stopRecording();
      };

      recognition.onend = () => {
        stopRecording();
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (_) {
      stopRecording();
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (recTimerRef.current) clearInterval(recTimerRef.current);
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (_) {}
    }
  };

  const handleSendUserMessage = (text, isVoice = false) => {
    if (!text.trim()) return;
    stopRecording();
    sounds.playTap?.();
    haptics.light();

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      type: isVoice ? 'voice' : 'text',
      duration: isVoice ? `0:0${Math.max(2, recSeconds)}` : null,
      text: text.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    gamification.addXP(15);

    // Tutor reply after 800ms
    setTimeout(() => {
      const pool = SAMPLE_REPLIES[selectedLang] || SAMPLE_REPLIES.en;
      const reply = pool[Math.floor(Math.random() * pool.length)];

      const tutorMsg = {
        id: Date.now() + 1,
        sender: 'tutor',
        type: 'voice',
        duration: '0:05',
        text: reply.text,
        ru: reply.ru,
      };

      setMessages((prev) => [...prev, tutorMsg]);
      sounds.playCorrect?.();
      haptics.celebrate();

      // Automatically speak tutor reply
      speakText(reply.text, selectedLang);
      setPlayingId(tutorMsg.id);
      setTimeout(() => setPlayingId(null), 4000);
    }, 850);
  };

  const playVoiceNote = (msg) => {
    sounds.playTap?.();
    haptics.light();
    setPlayingId(msg.id);
    speakText(msg.text, msg.sender === 'user' ? selectedLang : tutor.lang);
    setTimeout(() => setPlayingId(null), 3500);
  };

  return (
    <div className="vm-overlay" onClick={onClose}>
      <div className="vm-modal animate-pop" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="vm-header">
          <div className="vm-tutor-meta">
            <span className="vm-avatar">{tutor.avatar}</span>
            <div>
              <h3>{tutor.name} {tutor.flag}</h3>
              <span className="vm-online-dot">🟢 В сети (Аудио-чат)</span>
            </div>
          </div>

          <div className="vm-lang-switcher">
            {['en', 'de', 'fr', 'es'].map((code) => (
              <button
                key={code}
                className={`vm-lang-btn ${selectedLang === code ? 'active' : ''}`}
                onClick={() => setSelectedLang(code)}
              >
                {TUTOR_PROFILES[code].flag}
              </button>
            ))}
          </div>

          <button className="vm-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Chat Messages Log */}
        <div className="vm-chat-box" ref={messagesEndRef}>
          {messages.map((m) => (
            <div key={m.id} className={`vm-msg-row ${m.sender} animate-in`}>
              <div className="vm-msg-bubble">
                {m.type === 'voice' ? (
                  <div className="vm-voice-note">
                    <button
                      className={`vm-play-btn ${playingId === m.id ? 'playing' : ''}`}
                      onClick={() => playVoiceNote(m)}
                    >
                      {playingId === m.id ? '⏸' : '▶'}
                    </button>
                    <div className="vm-waveform">
                      <span className="wave-bar" />
                      <span className="wave-bar" />
                      <span className="wave-bar" />
                      <span className="wave-bar" />
                      <span className="wave-bar" />
                    </div>
                    <span className="vm-duration">{m.duration || '0:03'}</span>
                  </div>
                ) : null}

                <div className="vm-text">{m.text}</div>
                {m.ru && <div className="vm-ru-translation">{m.ru}</div>}
              </div>
            </div>
          ))}
        </div>

        {/* Recording active overlay bar */}
        {isRecording && (
          <div className="vm-recording-bar animate-in">
            <span className="rec-dot" />
            <span>Запись голосового... 0:0{recSeconds}</span>
            <button className="rec-stop-btn" onClick={stopRecording}>Готово ✓</button>
          </div>
        )}

        {/* Input Bar */}
        <div className="vm-input-bar">
          <input
            type="text"
            placeholder={`Напишите или надиктуйте сообщение для ${tutor.name}...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendUserMessage(inputText);
            }}
          />

          <button
            className={`vm-mic-action-btn ${isRecording ? 'recording' : ''}`}
            onClick={isRecording ? stopRecording : startVoiceRecording}
            title="Записать голосовое сообщение"
          >
            {isRecording ? '⏹' : '🎤'}
          </button>

          {inputText && (
            <button
              className="vm-send-btn"
              onClick={() => handleSendUserMessage(inputText)}
            >
              ➤
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
