import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../utils/soundEffects';
import { gamification } from '../utils/gamification';
import './WordRushModal.css';

const RUSH_WORDS = [
  { word: 'Courage', trans: 'Храбрость', options: ['Храбрость', 'Слабость', 'Тайна', 'Грусть'] },
  { word: 'Freedom', trans: 'Свобода', options: ['Оковы', 'Свобода', 'Порядок', 'Власть'] },
  { word: 'Discover', trans: 'Открывать', options: ['Забывать', 'Открывать', 'Закрывать', 'Ломать'] },
  { word: 'Ancient', trans: 'Древний', options: ['Новый', 'Древний', 'Быстрый', 'Узкий'] },
  { word: 'Knowledge', trans: 'Знания', options: ['Знания', 'Деньги', 'Успех', 'Случай'] },
  { word: 'Journey', trans: 'Путешествие', options: ['Покой', 'Остановка', 'Путешествие', 'Бег'] },
  { word: 'Powerful', trans: 'Мощный', options: ['Мощный', 'Слабый', 'Тихий', 'Темный'] },
];

export default function WordRushModal({ isOpen, onClose }) {
  const [gameState, setGameState] = useState('ready'); // 'ready' | 'playing' | 'gameover'
  const [timeLeft, setTimeLeft] = useState(45);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setGameState('gameover');
            sounds.playComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  if (!isOpen) return null;

  const startGame = () => {
    setGameState('playing');
    setTimeLeft(45);
    setScore(0);
    setCombo(0);
    setCurrentWordIdx(0);
    sounds.playLevelUp();
  };

  const handleSelectOption = (opt) => {
    if (gameState !== 'playing') return;

    const cur = RUSH_WORDS[currentWordIdx % RUSH_WORDS.length];
    const isCorrect = opt === cur.trans;

    if (isCorrect) {
      sounds.playCorrect();
      const newCombo = combo + 1;
      setCombo(newCombo);
      const points = 10 * (newCombo > 1 ? newCombo : 1);
      setScore((s) => s + points);
    } else {
      sounds.playWrong();
      setCombo(0);
    }

    setCurrentWordIdx((i) => i + 1);
  };

  const currentWord = RUSH_WORDS[currentWordIdx % RUSH_WORDS.length];

  return (
    <div className="rush-modal-backdrop" onClick={onClose}>
      <div className="rush-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <header className="rush-modal-header">
          <div className="rush-title-box">
            <span className="rush-badge-icon">⏱️</span>
            <div>
              <h3>Спринт Слов на Выживание</h3>
              <p>Молниеносный 45-секундный спринт на реакцию</p>
            </div>
          </div>
          <button className="rush-close-btn" onClick={onClose}>
            ✕
          </button>
        </header>

        {/* READY STATE */}
        {gameState === 'ready' && (
          <div className="rush-ready-stage">
            <span className="rush-big-icon">⚡</span>
            <h2>ГОТОВЫ К СПРИНТУ?</h2>
            <p>У вас есть 45 секунд, чтобы перевести как можно больше слов. Каждое комбо умножает очки!</p>
            <button className="rush-start-btn" onClick={startGame}>
              🔥 СТАРТ СПРИНТА!
            </button>
          </div>
        )}

        {/* PLAYING STATE */}
        {gameState === 'playing' && (
          <div className="rush-play-stage">
            {/* HUD */}
            <div className="rush-hud-bar">
              <div className="rush-timer-pill">
                <span>⏳ {timeLeft} сек</span>
              </div>
              {combo > 1 && <span className="rush-combo-badge">🔥 COMBO x{combo}!</span>}
              <div className="rush-score-pill">
                <span>{score} Очков</span>
              </div>
            </div>

            {/* Falling Target Word */}
            <div className="rush-word-target-box">
              <span className="rush-word-title">{currentWord.word}</span>
            </div>

            {/* 4 Choices */}
            <div className="rush-options-grid">
              {currentWord.options.map((opt, idx) => (
                <button
                  key={idx}
                  className="rush-choice-btn"
                  onClick={() => handleSelectOption(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* GAMEOVER STATE */}
        {gameState === 'gameover' && (
          <div className="rush-gameover-stage">
            <span className="finish-trophy">🏆</span>
            <h2>ВРЕМЯ ВЫШЛО!</h2>
            <div className="rush-final-score">
              <strong>{score}</strong>
              <span>Набрано очков</span>
            </div>
            <p>Вы показали потрясающую реакцию и закрепили словарный запас!</p>
            <button className="rush-start-btn" onClick={startGame}>
              🔄 Сыграть ещё раз
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
