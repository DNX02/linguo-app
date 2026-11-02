import React, { useState, useEffect, useRef } from 'react';
import { getAllCards } from '../db';
import { speakText } from '../utils/speech';
import { sounds } from '../utils/soundEffects';
import { gamification } from '../utils/gamification';
import './MatchGameModal.css';

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function MatchGameModal({ isOpen, onClose, language = 'en' }) {
  const [cards, setCards] = useState([]);
  const [leftItems, setLeftItems] = useState([]);
  const [rightItems, setRightItems] = useState([]);
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [matchedIds, setMatchedIds] = useState([]);
  const [wrongMatch, setWrongMatch] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);

  const timerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      startGame();
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isOpen, language]);

  const startGame = async () => {
    setScore(0);
    setCombo(0);
    setTimeLeft(35);
    setGameOver(false);
    setEarnedXP(0);
    setMatchedIds([]);
    setSelectedLeft(null);
    setSelectedRight(null);

    const all = await getAllCards(language);
    const pool = all.length >= 5 ? all : await getAllCards();
    const shuffledPool = shuffle(pool);
    setCards(shuffledPool);

    loadRound(shuffledPool, []);
    startTimer();
  };

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          endGame();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const loadRound = (pool, alreadyUsedIds) => {
    const available = pool.filter((c) => !alreadyUsedIds.includes(c.id));
    const roundCards = (available.length >= 5 ? available : shuffle(pool)).slice(0, 5);

    setLeftItems(shuffle(roundCards.map((c) => ({ id: c.id, text: c.word, lang: c.language }))));
    setRightItems(shuffle(roundCards.map((c) => ({ id: c.id, text: c.translation }))));
    setMatchedIds([]);
    setSelectedLeft(null);
    setSelectedRight(null);
  };

  const checkMatch = (leftId, rightId) => {
    if (leftId === rightId) {
      sounds.playCorrect();
      const newMatched = [...matchedIds, leftId];
      setMatchedIds(newMatched);
      setSelectedLeft(null);
      setSelectedRight(null);

      const addedScore = 100 + combo * 25;
      setScore((s) => s + addedScore);
      setCombo((c) => c + 1);

      // Check if current round cleared (5 pairs)
      if (newMatched.length === 5) {
        setTimeLeft((t) => t + 5); // +5s time bonus!
        setTimeout(() => {
          loadRound(cards, newMatched);
        }, 400);
      }
    } else {
      sounds.playWrong();
      setWrongMatch(true);
      setCombo(0);
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
        setWrongMatch(false);
      }, 500);
    }
  };

  const handleSelectLeft = (item) => {
    if (matchedIds.includes(item.id)) return;
    speakText(item.text, item.lang);
    setSelectedLeft(item.id);
    if (selectedRight) {
      checkMatch(item.id, selectedRight);
    }
  };

  const handleSelectRight = (item) => {
    if (matchedIds.includes(item.id)) return;
    setSelectedRight(item.id);
    if (selectedLeft) {
      checkMatch(selectedLeft, item.id);
    }
  };

  const endGame = () => {
    setGameOver(true);
    sounds.playComplete();
    const xp = Math.max(15, Math.round(score / 40));
    setEarnedXP(xp);
    gamification.addXP(xp);
  };

  if (!isOpen) return null;

  return (
    <div className="match-overlay" onClick={onClose}>
      <div className="match-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="match-header">
          <div className="match-title-row">
            <h2>⚡ Найди пары</h2>
            <button className="match-close" onClick={onClose}>✕</button>
          </div>
          <div className="match-stats-row">
            <div className={`match-timer ${timeLeft <= 5 ? 'critical' : ''}`}>
              ⏳ {timeLeft} сек
            </div>
            <div className="match-score">Очки: {score}</div>
            {combo > 1 && <div className="match-combo">🔥 x{combo}!</div>}
          </div>
        </div>

        {gameOver ? (
          <div className="match-game-over">
            <span className="match-over-emoji">🏆</span>
            <h3>Время вышло!</h3>
            <p className="match-final-score">Ваш счёт: <strong>{score}</strong></p>
            <div className="match-xp-badge">+{earnedXP} XP получено!</div>
            <div className="match-over-buttons">
              <button className="match-btn-play" onClick={startGame}>
                🔄 Играть снова
              </button>
              <button className="match-btn-done" onClick={onClose}>
                Завершить
              </button>
            </div>
          </div>
        ) : (
          <div className="match-board">
            {/* Left Column (Foreign words) */}
            <div className="match-column">
              {leftItems.map((item) => {
                const isMatched = matchedIds.includes(item.id);
                const isSelected = selectedLeft === item.id;
                return (
                  <button
                    key={item.id}
                    className={`match-card-btn ${isMatched ? 'matched' : ''} ${isSelected ? 'selected' : ''} ${wrongMatch && isSelected ? 'wrong' : ''}`}
                    onClick={() => handleSelectLeft(item)}
                    disabled={isMatched}
                  >
                    <span>{item.text}</span>
                    <span className="match-speaker-mini">🔊</span>
                  </button>
                );
              })}
            </div>

            {/* Right Column (Russian translations) */}
            <div className="match-column">
              {rightItems.map((item) => {
                const isMatched = matchedIds.includes(item.id);
                const isSelected = selectedRight === item.id;
                return (
                  <button
                    key={item.id}
                    className={`match-card-btn ${isMatched ? 'matched' : ''} ${isSelected ? 'selected' : ''} ${wrongMatch && isSelected ? 'wrong' : ''}`}
                    onClick={() => handleSelectRight(item)}
                    disabled={isMatched}
                  >
                    <span>{item.text}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
