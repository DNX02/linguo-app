import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getCardsForReview,
  getAllCards,
  updateCard,
  getDailyProgress,
  saveDailyProgress,
} from '../db';
import { calculateNextReview } from '../utils/spaced-repetition';
import { speakText } from '../utils/speech';
import { sounds } from '../utils/soundEffects';
import { gamification } from '../utils/gamification';
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
  const [starredIds, setStarredIds] = useState([]);

  const isMounted = useRef(true);

  const loadCards = useCallback(async (forcedAll = false) => {
    try {
      let loaded = [];
      if (forcedAll) {
        loaded = await getAllCards();
      } else {
        loaded = await getCardsForReview();
      }
      if (isMounted.current) {
        setCards(loaded || []);
        setCurrentIndex(0);
        setFinished(!loaded || loaded.length === 0);
        setStarredIds(gamification.getStarred());
      }
    } catch (e) {
      console.error('Error loading cards:', e);
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    loadCards();
    return () => {
      isMounted.current = false;
    };
  }, [loadCards]);

  const handleFlip = () => {
    if (!flipped && !animating) {
      setFlipped(true);
      const card = cards[currentIndex];
      if (card) {
        speakText(card.word, card.language);
      }
    }
  };

  const handleToggleStar = (e) => {
    e.stopPropagation();
    const card = cards[currentIndex];
    if (card) {
      gamification.toggleStarred(card.id);
      setStarredIds([...gamification.getStarred()]);
    }
  };

  const handleQuality = useCallback(
    async (quality) => {
      if (animating || !cards[currentIndex]) return;
      setAnimating(true);

      const card = cards[currentIndex];
      const updated = calculateNextReview(card, quality);
      await updateCard({ ...card, ...updated });

      // Audio feedback & Gamification
      if (quality >= 3) {
        sounds.playCorrect();
        gamification.addXP(10);
        gamification.removeMistake(card.id);
      } else {
        sounds.playWrong();
        gamification.addMistake(card.id);
      }

      // Update daily progress safely
      try {
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
          cards: {
            [card.id]: {
              interval: updated.interval,
              repetitions: updated.repetitions,
              easeFactor: updated.easeFactor,
              nextReview: updated.nextReview,
            },
          },
          daily: { [progress.date]: progress },
        }).catch(() => {});
      } catch (err) {
        console.warn('Progress update warning:', err);
      }

      setSlideDir('slide-out');

      setTimeout(() => {
        const nextIndex = currentIndex + 1;
        if (nextIndex >= cards.length) {
          setFinished(true);
          sounds.playComplete();
          gamification.addXP(25);
        } else {
          setCurrentIndex(nextIndex);
        }
        setFlipped(false);
        setSlideDir('slide-in');
        setTimeout(() => {
          setSlideDir('');
          setAnimating(false);
        }, 250);
      }, 250);
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
      <div className="fc-finished">
        <div className="fc-finished-card">
          <span className="fc-finished-emoji">🎉</span>
          <h2>Отличная работа!</h2>
          <p>
            {cards.length > 0
              ? `Вы успешно повторили ${cards.length} ${
                  cards.length === 1 ? 'карточку' : cards.length < 5 ? 'карточки' : 'карточек'
                }!`
              : 'Нет карточек, требующих повторения прямо сейчас.'}
          </p>
          <div className="fc-finished-buttons">
            <button
              className="fc-btn fc-btn-primary"
              onClick={() => {
                setLoading(true);
                loadCards(true);
              }}
            >
              🔄 Учить все слова колоды
            </button>
            <button
              className="fc-btn fc-btn-secondary"
              onClick={() => navigate('/')}
            >
              🏠 На главную
            </button>
          </div>
        </div>
      </div>
    );
  }

  const card = cards[currentIndex];
  if (!card) return null;

  const isStarred = starredIds.includes(card.id);
  const progressPercent = Math.round(((currentIndex + 1) / cards.length) * 100);

  return (
    <div className="fc-page">
      {/* Header */}
      <div className="fc-header">
        <button className="fc-back-btn" onClick={() => navigate('/')}>
          ← Назад
        </button>
        <span className="fc-counter">
          {currentIndex + 1} / {cards.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="fc-progress-bar">
        <div
          className="fc-progress-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Flashcard with 3D Flip */}
      <div
        className={`fc-card-container ${slideDir}`}
        onClick={handleFlip}
        role="button"
        tabIndex={0}
      >
        <div className={`fc-card-inner ${flipped ? 'is-flipped' : ''}`}>
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
              <button
                type="button"
                className={`fc-star-btn ${isStarred ? 'active' : ''}`}
                onClick={handleToggleStar}
                title="Добавить в избранное"
              >
                {isStarred ? '⭐' : '☆'}
              </button>
            </div>
            <div className="fc-card-word">
              {card.word}
              <div className="fc-audio-group">
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
                <button
                  type="button"
                  className="fc-speak-btn fc-slow-btn"
                  title="Озвучить медленно"
                  onClick={(e) => {
                    e.stopPropagation();
                    speakText(card.word, card.language, { slow: true });
                  }}
                >
                  🐢
                </button>
              </div>
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
