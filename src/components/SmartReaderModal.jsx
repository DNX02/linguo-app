import React, { useState } from 'react';
import { speakText } from '../utils/speech';
import { sounds } from '../utils/sounds';
import { haptics } from '../utils/haptics';
import { addCard } from '../db';
import { gamification } from '../utils/gamification';
import './SmartReaderModal.css';

const SAMPLE_TEXTS = [
  {
    title: '🚀 Space Exploration (English)',
    lang: 'en',
    content: 'Traveling to Mars represents one of humanity\'s greatest scientific ambitions. Astronauts will face unprecedented psychological and physical challenges during their journey through deep space. Creating sustainable oxygen and food systems is essential for long-term survival.',
    vocab: {
      traveling: { tr: 'путешествие', lvl: 'A1' },
      scientific: { tr: 'научный', lvl: 'B1' },
      ambitions: { tr: 'стремления / амбиции', lvl: 'B2' },
      astronauts: { tr: 'астронавты', lvl: 'A2' },
      unprecedented: { tr: 'беспрецедентный', lvl: 'C1' },
      psychological: { tr: 'психологический', lvl: 'B2' },
      challenges: { tr: 'испытания / трудности', lvl: 'B1' },
      sustainable: { tr: 'устойчивый / экологичный', lvl: 'B2' },
      essential: { tr: 'жизненно важный', lvl: 'B1' },
      survival: { tr: 'выживание', lvl: 'B2' },
    }
  },
  {
    title: '🥐 Un matin à Paris (Français)',
    lang: 'fr',
    content: 'Le matin à Paris commence toujours avec l\'odeur délicieuse du café frais et des croissants chauds dans les petites boulangeries. Les gens se promènent le long de la Seine en admirant l\'architecture historique.',
    vocab: {
      matin: { tr: 'утро', lvl: 'A1' },
      toujours: { tr: 'всегда', lvl: 'A1' },
      délicieuse: { tr: 'восхитительный / вкусный', lvl: 'A2' },
      chauds: { tr: 'горячий', lvl: 'A1' },
      boulangeries: { tr: 'булочные', lvl: 'A2' },
      promènent: { tr: 'гуляют', lvl: 'A2' },
      admirant: { tr: 'любуясь', lvl: 'B1' },
      historique: { tr: 'исторический', lvl: 'A2' },
    }
  },
  {
    title: '☕ Der perfekte Kaffee (Deutsch)',
    lang: 'de',
    content: 'Ein guter Kaffee braucht nicht nur erstklassige Kaffeebohnen, sondern auch die richtige Wassertemperatur und Geduld. Viele Menschen genießen ihren Espresso am liebsten in einem gemütlichen Café in der Innenstadt.',
    vocab: {
      erstklassige: { tr: 'первоклассный', lvl: 'B2' },
      Kaffeebohnen: { tr: 'кофейные зерна', lvl: 'A2' },
      Wassertemperatur: { tr: 'температура воды', lvl: 'A2' },
      Geduld: { tr: 'терпение', lvl: 'B1' },
      genießen: { tr: 'наслаждаться', lvl: 'B1' },
      gemütlichen: { tr: 'уютный', lvl: 'A2' },
      Innenstadt: { tr: 'центр города', lvl: 'A2' },
    }
  }
];

export default function SmartReaderModal({ isOpen, onClose }) {
  const [selectedSample, setSelectedSample] = useState(0);
  const [customText, setCustomText] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [activeWordData, setActiveWordData] = useState(null);
  const [savedWords, setSavedWords] = useState([]);
  const [toastMsg, setToastMsg] = useState('');

  if (!isOpen) return null;

  const currentSample = SAMPLE_TEXTS[selectedSample];
  const activeText = isCustomMode ? customText : currentSample.content;
  const activeLang = isCustomMode ? 'en' : currentSample.lang;
  const activeVocab = currentSample.vocab || {};

  const handleWordClick = (rawWord) => {
    const clean = rawWord.toLowerCase().replace(/[^a-zäöüßéèàáíóúñ]/gi, '');
    if (!clean) return;

    sounds.playTap?.();
    haptics.light();

    const info = activeVocab[clean] || { tr: 'Интересное слово', lvl: 'A2' };
    setActiveWordData({
      word: clean,
      translation: info.tr,
      level: info.lvl,
      lang: activeLang,
    });
  };

  const handleSaveToDeck = async () => {
    if (!activeWordData) return;
    try {
      await addCard({
        word: activeWordData.word,
        translation: activeWordData.translation,
        language: activeWordData.lang,
        level: activeWordData.level,
        interval: 0,
        repetitions: 0,
        easeFactor: 2.5,
        nextReview: new Date().toISOString(),
        learned: false,
      });

      setSavedWords((prev) => [...prev, activeWordData.word]);
      sounds.playCorrect?.();
      haptics.celebrate();
      gamification.addXP(10);
      setToastMsg(`✓ Слово «${activeWordData.word}» добавлено в колоду!`);
      setTimeout(() => setToastMsg(''), 2500);
    } catch (_) {}
  };

  // Render text with clickable tokens
  const renderInteractiveText = () => {
    const tokens = activeText.split(/(\s+)/);
    return tokens.map((token, i) => {
      if (/^\s+$/.test(token)) return token;
      const clean = token.toLowerCase().replace(/[^a-zäöüßéèàáíóúñ]/gi, '');
      const isHighlighted = activeVocab[clean];
      const lvl = isHighlighted?.lvl || '';

      return (
        <span
          key={i}
          className={`reader-token ${isHighlighted ? 'vocab-word' : ''} ${lvl}`}
          onClick={() => handleWordClick(clean)}
        >
          {token}
        </span>
      );
    });
  };

  return (
    <div className="reader-overlay" onClick={onClose}>
      <div className="reader-modal animate-pop" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="reader-header">
          <div>
            <h3>📸 AI Smart Reader & Lens</h3>
            <p className="reader-sub">Умный разбор текстов, перевод в 1 клик и сохранение слов</p>
          </div>
          <button className="reader-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Sample selection pills */}
        <div className="reader-sample-bar">
          {SAMPLE_TEXTS.map((s, idx) => (
            <button
              key={idx}
              className={`sample-pill ${selectedSample === idx && !isCustomMode ? 'active' : ''}`}
              onClick={() => {
                setSelectedSample(idx);
                setIsCustomMode(false);
                setActiveWordData(null);
                sounds.playTap?.();
              }}
            >
              {s.title}
            </button>
          ))}
          <button
            className={`sample-pill ${isCustomMode ? 'active' : ''}`}
            onClick={() => {
              setIsCustomMode(true);
              setActiveWordData(null);
              sounds.playTap?.();
            }}
          >
            ✏️ Вставить свой текст
          </button>
        </div>

        {/* Text Container */}
        <div className="reader-content-body">
          {isCustomMode ? (
            <div className="reader-custom-input-box">
              <textarea
                placeholder="Вставьте сюда любой иностранный текст из статьи, книги или песни..."
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                rows={6}
              />
              <p className="custom-hint">💡 Тапайте по любым словам в тексте ниже для перевода и озвучки</p>
            </div>
          ) : null}

          <div className="reader-text-card">
            <p className="interactive-paragraph">
              {renderInteractiveText()}
            </p>
          </div>
        </div>

        {/* Word Inspector Card */}
        {activeWordData && (
          <div className="reader-inspector animate-in">
            <div className="inspector-meta">
              <span className={`inspector-lvl-badge ${activeWordData.level}`}>
                {activeWordData.level}
              </span>
              <button
                className="inspector-speak-btn"
                onClick={() => {
                  speakText(activeWordData.word, activeWordData.lang);
                  haptics.light();
                }}
              >
                🔊 Слушать
              </button>
            </div>

            <div className="inspector-info">
              <h3 className="inspector-word">{activeWordData.word}</h3>
              <div className="inspector-tr">{activeWordData.translation}</div>
            </div>

            <button
              className={`inspector-add-btn ${savedWords.includes(activeWordData.word) ? 'added' : ''}`}
              onClick={handleSaveToDeck}
              disabled={savedWords.includes(activeWordData.word)}
            >
              {savedWords.includes(activeWordData.word) ? '✓ В колоде' : '+ В карточки'}
            </button>
          </div>
        )}

        {/* Toast */}
        {toastMsg && <div className="reader-toast animate-pop">{toastMsg}</div>}
      </div>
    </div>
  );
}
