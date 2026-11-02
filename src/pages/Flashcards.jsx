import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getCardsForReview,
  updateCard,
  getDailyProgress,
  saveDailyProgress,
} from '../db';
import { calculateNextReview } from '../utils/spaced-repetition';
import { speakText } from '../utils/speech';
import { api } from '../utils/api';
import './Flashcards.css';

const QUALITY_BUTTONS = [
  { quality: 0, label: 'Не помню', emoji: '😵', color: '#ef4444' },
  { quality: 2, label: 'Сложно', emoji: '😟', color: '#f59e0b' },
  { quality: 4, label: 'Нормально', emoji: '🙂', color: '#3b82f6' },
  { quality: 5, label: 'Легко', emoji: '😎', color: '#22c55e' },
];

export default function Flashcards() {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [animating, setAnimating] = useState(false);
  const [slideDir, setSlideDir] = useState('');

  useEffect(() => {
    const loadCards = async () => {
      const reviewCards = await getCardsForReview();
      setCards(reviewCards);
      setFinished(reviewCards.length === 0);
      setLoading(false);
    };
    loadCards();
  }, []);

  const handleFlip = () => {
    if (!flipped && !animating) {
      setFlipped(true);
    }
  };

  const handleQuality = useCallback(
    async (quality) => {
      if (animating) return;
      setAnimating(true);

      const card = cards[currentIndex];
      const updated = calculateNextReview(card, quality);
      await updateCard({ ...card, ...updated });

      // Update daily progress
      const progress = (await getDailyProgress()) || {
        date: new Date().toISOString().split('T')[0],
        correct: 0,
        wrong: 0,
        reviewed: 0,
      };
      progress.reviewed = (progress.reviewed || 0) + 1;
      if (quality >= 3) {
        progress.correct = (progress.correct || 0) + 1;
      } else {
        progress.wrong = (progress.wrong || 0) + 1;
      }
      await saveDailyProgress(progress);
      api.syncProgress({
        cards: { [card.id]: { interval: updated.interval, repetitions: updated.repetitions, easeFactor: updated.easeFactor, nextReview: updated.nextReview } },
        daily: { [progress.date]: progress }
      }).catch(() => {});

      setSlideDir('slide-out');

      setTimeout(() => {
        const nextIndex = currentIndex + 1;
        if (nextIndex >= cards.length) {
          setFinished(true);
        } else {
          setCurrentIndex(nextIndex);
        }
        setFlipped(false);
        setSlideDir('slide-in');
        setTimeout(() => {
          setSlideDir('');
          setAnimating(false);
        }, 300);
      }, 300);
    },
    [animating, cards, currentIndex]
  );

  if (loading) {
    return (
      <div className="fc-loading">
        <div className="fc-loading-spinner" />
        <p>Загрузка карточек...</p>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="fc-done">
        <div className="fc-done-emoji">🎉</div>
        <h2>Поздравляем!</h2>
        <p>Вы повторили все карточки на сегодня!</p>
        <div className="fc-done-stats">
          <span>Просмотрено: {currentIndex} карточек</span>
        </div>
        <button className="fc-done-btn" onClick={() => navigate('/')}>
          На главную
        </button>
      </div>
    );
  }

  const card = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  return (
    <div className="fc-page">
      <header className="fc-header">
        <button className="fc-back" onClick={() => navigate('/')}>
          ← Назад
        </button>
        <span className="fc-counter">
          {currentIndex + 1} / {cards.length}
        </span>
      </header>

      <div className="fc-progress-bar">
        <div
          className="fc-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div
        className={`fc-card-container ${slideDir}`}
        onClick={handleFlip}
      >
        <div className={`fc-card ${flipped ? 'fc-card-flipped' : ''}`}>
          {/* Front */}
          <div className="fc-card-face fc-card-front">
            <div className="fc-card-badges">
              {card.category && (
                <span className="fc-badge fc-badge-category">
                  {card.category}
                </span>
              )}
              {card.level && (
                <span className="fc-badge fc-badge-level">{card.level}</span>
              )}
              <span className="fc-badge fc-badge-lang">
                {card.language === 'en' ? '🇬🇧' : '🇩🇪'}
              </span>
            </div>
            <div className="fc-card-word">
              {card.word}
              <button
                type="button"
                className="fc-speak-btn"
                title="Озвучить слово"
                onClick={(e) => {
                  e.stopPropagation();
                  speakText(card.word, card.language);
                }}
              >
                🔊
              </button>
            </div>
            {card.transcription && (
              <div className="fc-card-transcription">[{card.transcription}]</div>
            )}
            <div className="fc-tap-hint">Нажмите, чтобы перевернуть</div>
          </div>

          {/* Back */}
          <div className="fc-card-face fc-card-back">
            <div className="fc-card-badges">
              {card.category && (
                <span className="fc-badge fc-badge-category">
                  {card.category}
                </span>
              )}
              {card.level && (
                <span className="fc-badge fc-badge-level">{card.level}</span>
              )}
            </div>
            <div className="fc-card-translation">{card.translation}</div>
            <div className="fc-card-word-small">{card.word}</div>
            {card.example && (
              <div className="fc-card-example">
                <p className="fc-example-label">Пример:</p>
                <p className="fc-example-text">{card.example}</p>
                {card.exampleTranslation && (
                  <p className="fc-example-translation">
                    {card.exampleTranslation}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {flipped && (
        <div className="fc-quality-buttons">
          <p className="fc-quality-label">Как хорошо вы знали?</p>
          <div className="fc-quality-row">
            {QUALITY_BUTTONS.map((btn) => (
              <button
                key={btn.quality}
                className="fc-quality-btn"
                style={{ '--btn-color': btn.color }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuality(btn.quality);
                }}
              >
                <span className="fc-quality-emoji">{btn.emoji}</span>
                <span className="fc-quality-text">{btn.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
