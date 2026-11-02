import React, { useState, useEffect } from 'react';
import { sentencesData } from '../data/sentences';
import { speakText } from '../utils/speech';
import { sounds } from '../utils/sounds';
import { haptics } from '../utils/haptics';
import { gamification } from '../utils/gamification';
import './SentenceBuilderModal.css';

export default function SentenceBuilderModal({ isOpen, onClose, currentLanguage = 'en' }) {
  const langKey = currentLanguage === 'de' ? 'de' : 'en';
  const sentences = sentencesData[langKey] || sentencesData.en;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedWords, setSelectedWords] = useState([]);
  const [availableWords, setAvailableWords] = useState([]);
  const [status, setStatus] = useState(null); // 'correct' | 'wrong' | null
  const [score, setScore] = useState(0);

  const currentSentence = sentences[currentIndex] || sentences[0];

  useEffect(() => {
    if (isOpen) {
      loadSentence(currentIndex);
    }
  }, [isOpen, currentIndex, langKey]);

  const loadSentence = (idx) => {
    const item = sentences[idx] || sentences[0];
    const allWords = [...item.words, ...(item.extra || [])].map((w, id) => ({
      id: `${w}-${id}-${Math.random()}`,
      text: w,
    }));
    // Shuffle words
    for (let i = allWords.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allWords[i], allWords[j]] = [allWords[j], allWords[i]];
    }
    setAvailableWords(allWords);
    setSelectedWords([]);
    setStatus(null);
  };

  if (!isOpen) return null;

  const handleSelectWord = (wordObj) => {
    sounds.playTap();
    haptics.light();
    setAvailableWords((prev) => prev.filter((w) => w.id !== wordObj.id));
    setSelectedWords((prev) => [...prev, wordObj]);
    setStatus(null);
  };

  const handleRemoveWord = (wordObj) => {
    sounds.playTap();
    haptics.light();
    setSelectedWords((prev) => prev.filter((w) => w.id !== wordObj.id));
    setAvailableWords((prev) => [...prev, wordObj]);
    setStatus(null);
  };

  const checkSentence = () => {
    const built = selectedWords.map((w) => w.text).join(' ');
    const target = currentSentence.words.join(' ');

    if (built === target) {
      setStatus('correct');
      sounds.playCorrect();
      haptics.success();
      setScore((s) => s + 1);
      gamification.addXP(15);
      speakText(target, langKey);
    } else {
      setStatus('wrong');
      sounds.playWrong();
      haptics.error();
    }
  };

  const handleNext = () => {
    haptics.medium();
    if (currentIndex + 1 < sentences.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      sounds.playComplete();
      haptics.celebrate();
      setCurrentIndex(0);
    }
  };

  return (
    <div className="builder-overlay" onClick={onClose}>
      <div className="builder-modal" onClick={(e) => e.stopPropagation()}>
        <div className="builder-header">
          <div>
            <h3>🧩 Собери фразу</h3>
            <p className="builder-sub">Построй правильное предложение из слов</p>
          </div>
          <button className="builder-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="builder-progress-bar">
          <div
            className="builder-progress-fill"
            style={{ width: `${((currentIndex + 1) / sentences.length) * 100}%` }}
          />
        </div>

        <div className="builder-content">
          <div className="builder-target-card">
            <span className="builder-target-label">Переведите на {langKey === 'de' ? 'немецкий' : 'английский'}:</span>
            <h2 className="builder-target-text">{currentSentence.ru}</h2>
          </div>

          {/* Constructed Sentence Area */}
          <div className={`builder-slot-area ${status === 'correct' ? 'slot-correct' : status === 'wrong' ? 'slot-wrong' : ''}`}>
            {selectedWords.length === 0 ? (
              <span className="builder-placeholder">Нажимайте на слова внизу, чтобы собрать фразу...</span>
            ) : (
              selectedWords.map((w) => (
                <button
                  key={w.id}
                  className="builder-chip chip-selected animate-pop"
                  onClick={() => handleRemoveWord(w)}
                >
                  {w.text}
                </button>
              ))
            )}
          </div>

          {/* Available Words Pool */}
          <div className="builder-pool">
            {availableWords.map((w) => (
              <button
                key={w.id}
                className="builder-chip chip-available"
                onClick={() => handleSelectWord(w)}
              >
                {w.text}
              </button>
            ))}
          </div>

          {status === 'correct' && (
            <div className="builder-feedback correct animate-in">
              <span className="feedback-icon">🎉</span>
              <div>
                <strong>Превосходно!</strong>
                <p>Предложение собрано верно (+15 XP)</p>
              </div>
            </div>
          )}

          {status === 'wrong' && (
            <div className="builder-feedback wrong animate-in">
              <span className="feedback-icon">❌</span>
              <div>
                <strong>Попробуйте ещё раз!</strong>
                <p>Порядок слов не совсем правильный.</p>
              </div>
            </div>
          )}

          <div className="builder-actions">
            {status !== 'correct' ? (
              <button
                className="builder-check-btn"
                onClick={checkSentence}
                disabled={selectedWords.length === 0}
              >
                Проверить
              </button>
            ) : (
              <button className="builder-next-btn" onClick={handleNext}>
                Следующее фраза →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
