import React, { useState, useEffect, useRef } from 'react';
import { speakText } from '../utils/speech';
import { sounds } from '../utils/sounds';
import { haptics } from '../utils/haptics';
import { gamification } from '../utils/gamification';
import './PronunciationModal.css';

const PRONUNCIATION_WORDS = {
  en: [
    { text: 'Opportunity', syllables: ['Op', 'por', 'tu', 'ni', 'ty'], ipa: '/ˌɒp.əˈtjuː.nə.ti/', translation: 'Возможность', tip: 'Главное ударение на слог TU: op-por-TU-ni-ty' },
    { text: 'Comfortable', syllables: ['Com', 'fort', 'a', 'ble'], ipa: '/ˈkʌm.fə.tə.bəl/', translation: 'Удобный', tip: 'Произносится как «камф-тэ-бл», без долгого «or»' },
    { text: 'Vegetable', syllables: ['Veg', 'e', 'ta', 'ble'], ipa: '/ˈvedʒ.tə.bəl/', translation: 'Овощ', tip: 'Три слога вместо четырёх: veg-tuh-buhl' },
    { text: 'Schedule', syllables: ['Sche', 'dule'], ipa: '/ˈskedʒ.uːl/', translation: 'Расписание', tip: 'Американский вариант: «скедж-ул», британский: «шед-юл»' },
    { text: 'Wednesday', syllables: ['Wednes', 'day'], ipa: '/ˈwenz.deɪ/', translation: 'Среда', tip: 'Буква «d» не произносится: wenz-day' },
  ],
  de: [
    { text: 'Entschuldigung', syllables: ['Ent', 'schul', 'di', 'gung'], ipa: '/ɛntˈʃʊldɪɡʊŋ/', translation: 'Извините', tip: 'Мягкий «sch» и краткий «u»: энт-шуль-ди-гунг' },
    { text: 'Sehenswürdigkeit', syllables: ['Se', 'hens', 'wür', 'dig', 'keit'], ipa: '/ˈzeːənsˌvʏʁdɪçkaɪt/', translation: 'Достопримечательность', tip: '«h» немая, звук «ü» губы трубочкой' },
    { text: 'Gemütlichkeit', syllables: ['Ge', 'müt', 'lich', 'keit'], ipa: '/ɡəˈmyːtlɪçkaɪt/', translation: 'Уют / душевность', tip: 'Мягкий суффикс «lich» с шипящим придыханием' },
    { text: 'Brötchen', syllables: ['Bröt', 'chen'], ipa: '/ˈbʁøːtçən/', translation: 'Булочка', tip: 'Звук «ö» как в слове «мёд», «chen» — мягкий «хьен»' },
  ],
};

export default function PronunciationModal({ isOpen, onClose, currentLanguage = 'en' }) {
  const [selectedLang, setSelectedLang] = useState(
    ['en', 'de'].includes(currentLanguage) ? currentLanguage : 'en'
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [score, setScore] = useState(null);
  const [syllableScores, setSyllableScores] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [customWordInput, setCustomWordInput] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [activeWordData, setActiveWordData] = useState(null);

  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
    }
  }, []);

  const wordList = PRONUNCIATION_WORDS[selectedLang] || PRONUNCIATION_WORDS.en;
  const currentWord = activeWordData || wordList[currentIndex] || wordList[0];

  useEffect(() => {
    setActiveWordData(null);
    setCurrentIndex(0);
    setScore(null);
    setSyllableScores([]);
    setRecognizedText('');
    setFeedback('');
  }, [selectedLang]);

  if (!isOpen) return null;

  // Split string into syllables heuristically if custom word
  const getSyllables = (word) => {
    if (word.syllables && word.syllables.length) return word.syllables;
    const clean = word.text || word;
    const chunks = clean.match(/.{1,3}/g) || [clean];
    return chunks;
  };

  const playReferenceAudio = () => {
    sounds.playTap?.();
    haptics.light();
    speakText(currentWord.text, selectedLang);
  };

  const startListening = () => {
    setRecognizedText('');
    setScore(null);
    setSyllableScores([]);
    setFeedback('');

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
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
      recognition.maxAlternatives = 3;

      recognition.onstart = () => {
        setIsListening(true);
        haptics.medium();
      };

      recognition.onresult = (event) => {
        const spoken = event.results[0][0].transcript.trim().toLowerCase();
        const target = currentWord.text.trim().toLowerCase();
        setRecognizedText(spoken);

        // Syllable heatmap scoring
        const syllables = getSyllables(currentWord);
        const sScores = syllables.map((syl) => {
          const sylLower = syl.toLowerCase();
          if (spoken.includes(sylLower)) return 100;
          // Partial match
          let charsMatched = 0;
          for (const char of sylLower) {
            if (spoken.includes(char)) charsMatched++;
          }
          const ratio = charsMatched / Math.max(1, sylLower.length);
          if (ratio >= 0.7) return 75;
          if (ratio >= 0.4) return 50;
          return 25;
        });

        setSyllableScores(sScores);

        // Calculate overall score
        let calculatedScore = 0;
        if (spoken === target) {
          calculatedScore = 100;
        } else if (spoken.includes(target) || target.includes(spoken)) {
          calculatedScore = 90;
        } else {
          const avgSyllables = sScores.reduce((a, b) => a + b, 0) / sScores.length;
          calculatedScore = Math.max(25, Math.round(avgSyllables));
        }

        setScore(calculatedScore);

        if (calculatedScore >= 80) {
          setFeedback('Великолепно! Чистое звучание носителя! 🎯');
          sounds.playCorrect?.();
          haptics.celebrate();
          gamification.addXP(25);
        } else if (calculatedScore >= 55) {
          setFeedback('Хорошо! Обратите внимание на выделенные слоги. 👍');
          haptics.medium();
        } else {
          setFeedback('Попробуйте ещё раз, послушайте эталон в медленном темпе. 🔄');
          sounds.playWrong?.();
          haptics.error();
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (_) {
      setIsListening(false);
    }
  };

  const handleNext = () => {
    sounds.playTap?.();
    haptics.light();
    setActiveWordData(null);
    setCurrentIndex((prev) => (prev + 1) % wordList.length);
    setScore(null);
    setSyllableScores([]);
    setRecognizedText('');
    setFeedback('');
  };

  const handleCustomWordSubmit = (e) => {
    e.preventDefault();
    const trimmed = customWordInput.trim();
    if (!trimmed) return;
    const syllables = trimmed.match(/.{1,3}/g) || [trimmed];
    setActiveWordData({
      text: trimmed,
      syllables,
      ipa: 'Пользовательское слово',
      translation: 'Ваша практика',
      tip: 'Тренируйте произношение любого нужного вам слова',
    });
    setScore(null);
    setSyllableScores([]);
    setRecognizedText('');
    setFeedback('');
    setIsCustomMode(false);
    setCustomWordInput('');
    sounds.playTap?.();
  };

  const syllables = getSyllables(currentWord);

  return (
    <div className="pronounce-overlay" onClick={onClose}>
      <div className="pronounce-modal animate-pop" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="pronounce-header">
          <div>
            <h3>🎙️ AI-тренер произношения</h3>
            <p className="pronounce-sub">Фонетический скоринг & тепловая карта слогов</p>
          </div>
          <button className="pronounce-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Language Tabs */}
        <div className="pronounce-lang-tabs">
          {[
            { id: 'en', flag: '🇺🇸', name: 'English' },
            { id: 'de', flag: '🇩🇪', name: 'Deutsch' },
          ].map((l) => (
            <button
              key={l.id}
              className={`pronounce-lang-btn ${selectedLang === l.id ? 'active' : ''}`}
              onClick={() => setSelectedLang(l.id)}
            >
              {l.flag} {l.name}
            </button>
          ))}
        </div>

        {/* Main Word Card */}
        <div className="pronounce-card">
          <div className="pronounce-card-top">
            <span className="pronounce-tag">Эталонная фраза</span>
            <button
              className="pronounce-custom-toggle"
              onClick={() => setIsCustomMode(!isCustomMode)}
            >
              {isCustomMode ? 'Отмена' : '✏️ Своё слово'}
            </button>
          </div>

          {isCustomMode ? (
            <form onSubmit={handleCustomWordSubmit} className="pronounce-custom-form">
              <input
                type="text"
                placeholder="Введите слово на иностранном языке..."
                value={customWordInput}
                onChange={(e) => setCustomWordInput(e.target.value)}
                autoFocus
              />
              <button type="submit">Тренировать</button>
            </form>
          ) : (
            <>
              {/* Syllable Heatmap Display */}
              <div className="pronounce-heatmap-row">
                {syllables.map((syl, idx) => {
                  const sScore = syllableScores[idx];
                  let heatClass = 'default';
                  if (sScore !== undefined) {
                    if (sScore >= 80) heatClass = 'perfect';
                    else if (sScore >= 50) heatClass = 'warn';
                    else heatClass = 'poor';
                  }
                  return (
                    <span key={idx} className={`syllable-pill ${heatClass}`}>
                      {syl}
                    </span>
                  );
                })}
              </div>

              <div className="pronounce-ipa">{currentWord.ipa}</div>
              <div className="pronounce-tr">{currentWord.translation}</div>

              <div className="pronounce-tip-box">
                💡 <strong>Совет диктора:</strong> {currentWord.tip}
              </div>

              <div className="pronounce-audio-controls">
                <button className="pronounce-listen-btn" onClick={playReferenceAudio}>
                  🔊 Слушать эталон
                </button>
              </div>
            </>
          )}
        </div>

        {/* Recording Action Area */}
        {!isSupported ? (
          <div className="pronounce-fallback-note">
            ⚠️ Распознавание микрофона не поддерживается в этом браузере. Вы можете использовать кнопку 🔊 для тренировки на слух!
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
                {isListening ? 'Слушаю вас... Произнесите слово!' : 'Нажмите и скажите в микрофон'}
              </span>
            </button>

            {score !== null && (
              <div className="pronounce-result-card animate-pop">
                <div
                  className="pronounce-score-circle"
                  style={{
                    borderColor: score >= 80 ? '#22c55e' : score >= 55 ? '#f59e0b' : '#ef4444',
                    color: score >= 80 ? '#22c55e' : score >= 55 ? '#f59e0b' : '#ef4444',
                  }}
                >
                  <span className="score-num">{score}%</span>
                </div>
                <div className="pronounce-result-details">
                  <div className="spoken-label">
                    Распознано: «<strong>{recognizedText || '—'}</strong>»
                  </div>
                  <div className="feedback-text">{feedback}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer Next button */}
        <div className="pronounce-footer">
          <button className="pronounce-next-btn" onClick={handleNext}>
            Следующее слово →
          </button>
        </div>
      </div>
    </div>
  );
}
