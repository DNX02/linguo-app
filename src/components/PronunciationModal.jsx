import React, { useState, useEffect, useRef } from 'react';
import { speakText } from '../utils/speech';
import { sounds } from '../utils/sounds';
import { haptics } from '../utils/haptics';
import { gamification } from '../utils/gamification';
import './PronunciationModal.css';

// Sample words for pronunciation training
const PRONUNCIATION_WORDS = {
  en: [
    { text: 'Opportunity', ipa: '/ˌɒp.əˈtjuː.nə.ti/', translation: 'Возможность', tip: 'Ударение на третий слог: op-por-TU-ni-ty' },
    { text: 'Comfortable', ipa: '/ˈkʌm.fə.tə.bəl/', translation: 'Удобный', tip: 'Произносится как «kamf-tuh-buhl», без явной «or»' },
    { text: 'Vegetable', ipa: '/ˈvedʒ.tə.bəl/', translation: 'Овощ', tip: 'Три слога вместо четырех: veg-tuh-buhl' },
    { text: 'Queue', ipa: '/kjuː/', translation: 'Очередь', tip: 'Звучит ровно как буква «Q»' },
    { text: 'Schedule', ipa: '/ˈʃedʒ.uːl/ или /ˈskedʒ.uːl/', translation: 'Расписание', tip: 'В британском «шед-юл», в американском «скедж-ул»' },
    { text: 'Wednesday', ipa: '/ˈwenz.deɪ/', translation: 'Среда', tip: 'Буква «d» не читается: wenz-day' },
  ],
  de: [
    { text: 'Entschuldigung', ipa: '/ɛntˈʃʊldɪɡʊŋ/', translation: 'Извините', tip: 'Мягкий «sch» и короткий «u»: энт-шуль-ди-гунг' },
    { text: 'Sehenswürdigkeit', ipa: '/ˈzeːənsˌvʏʁdɪçkaɪt/', translation: 'Достопримечательность', tip: '«h» немая, звук «ü» губы трубочкой' },
    { text: 'Gemütlichkeit', ipa: '/ɡəˈmyːtlɪçkaɪt/', translation: 'Уют / душевность', tip: 'Характерное немецкое слово с мягким «ch»' },
    { text: 'Brötchen', ipa: '/ˈbʁøːtçən/', translation: 'Булочка', tip: 'Звук «ö» как в слове мёд, «chen» — мягкий «хьен»' },
    { text: 'Frühling', ipa: '/ˈfʁyːlɪŋ/', translation: 'Весна', tip: 'Горловой звук «r» и длинное «ü»' },
  ]
};

export default function PronunciationModal({ isOpen, onClose, currentLanguage = 'en' }) {
  const langKey = currentLanguage === 'de' ? 'de' : 'en';
  const words = PRONUNCIATION_WORDS[langKey] || PRONUNCIATION_WORDS.en;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [score, setScore] = useState(null); // number 0-100 or null
  const [feedback, setFeedback] = useState('');
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef(null);
  const currentWord = words[currentIndex] || words[0];

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
    }
  }, []);

  if (!isOpen) return null;

  const startListening = () => {
    setRecognizedText('');
    setScore(null);
    setFeedback('');

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = langKey === 'de' ? 'de-DE' : 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 3;

      recognition.onstart = () => {
        setIsListening(true);
        haptics.medium();
      };

      recognition.onresult = (event) => {
        const spoken = event.results[0][0].transcript.trim().toLowerCase();
        const target = currentWord.text.trim().toLowerCase();
        setRecognizedText(spoken);

        // Calculate simple string distance / accuracy
        let calculatedScore = 0;
        if (spoken === target) {
          calculatedScore = 100;
        } else if (spoken.includes(target) || target.includes(spoken)) {
          calculatedScore = 85;
        } else {
          // Compare characters match ratio
          let matches = 0;
          for (let i = 0; i < Math.min(spoken.length, target.length); i++) {
            if (spoken[i] === target[i]) matches++;
          }
          calculatedScore = Math.max(20, Math.round((matches / target.length) * 100));
        }

        setScore(calculatedScore);
        if (calculatedScore >= 80) {
          setFeedback('Отличное произношение! Чистый акцент! 🎯');
          sounds.playCorrect();
          haptics.celebrate();
          gamification.addXP(20);
        } else if (calculatedScore >= 50) {
          setFeedback('Хорошая попытка, но обратите внимание на ударение и звуки. 👍');
          haptics.medium();
        } else {
          setFeedback('Попробуйте ещё раз, послушайте образец перед повторением. 🔄');
          sounds.playWrong();
          haptics.error();
        }
      };

      recognition.onerror = (err) => {
        console.warn('SpeechRecognition error:', err);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setIsListening(false);
    }
  };

  const handleNext = () => {
    haptics.light();
    setCurrentIndex((prev) => (prev + 1) % words.length);
    setScore(null);
    setRecognizedText('');
    setFeedback('');
  };

  return (
    <div className="pronounce-overlay" onClick={onClose}>
      <div className="pronounce-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pronounce-header">
          <div>
            <h3>🎙️ Тренажёр произношения</h3>
            <p className="pronounce-sub">Слушай эталон и тренируй свою речь</p>
          </div>
          <button className="pronounce-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="pronounce-card">
          <span className="pronounce-tag">Слово для тренировки</span>
          <h2 className="pronounce-word">{currentWord.text}</h2>
          <div className="pronounce-ipa">{currentWord.ipa}</div>
          <div className="pronounce-tr">{currentWord.translation}</div>

          <div className="pronounce-tip-box">
            💡 <strong>Совет диктора:</strong> {currentWord.tip}
          </div>

          <button
            className="pronounce-listen-btn"
            onClick={() => {
              speakText(currentWord.text, langKey);
              haptics.light();
            }}
          >
            🔊 Послушать эталон
          </button>
        </div>

        {!isSupported ? (
          <div className="pronounce-fallback-note">
            ⚠️ Распознавание речи через микрофон не поддерживается в этом браузере. Вы можете использовать кнопку 🔊 для тренировки на слух!
          </div>
        ) : (
          <div className="pronounce-action-area">
            <button
              className={`pronounce-mic-btn ${isListening ? 'listening' : ''}`}
              onClick={startListening}
              disabled={isListening}
            >
              <span className="mic-icon">{isListening ? '🔴' : '🎙️'}</span>
              <span className="mic-text">
                {isListening ? 'Слушаю вас... Говорите!' : 'Нажмите и скажите слово'}
              </span>
            </button>

            {score !== null && (
              <div className="pronounce-result-card animate-in">
                <div className="pronounce-score-circle" style={{ borderColor: score >= 80 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444' }}>
                  <span className="score-num">{score}%</span>
                </div>
                <div className="pronounce-result-details">
                  <div className="spoken-label">Вы сказали: «<strong>{recognizedText}</strong>»</div>
                  <div className="feedback-text">{feedback}</div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="pronounce-footer">
          <button className="pronounce-next-btn" onClick={handleNext}>
            Следующее слово →
          </button>
        </div>
      </div>
    </div>
  );
}
