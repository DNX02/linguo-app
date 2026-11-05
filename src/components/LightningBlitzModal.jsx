import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../utils/soundEffects';
import { speakText } from '../utils/speech';
import gamification from '../utils/gamification';
import './LightningBlitzModal.css';

const BLITZ_POOL = [
  { q: 'Выберите перевод слова «Breakthrough»:', opts: ['Провал', 'Прорыв / Открытие', 'Поломка', 'Перерыв'], c: 1, lang: 'en' },
  { q: 'Какая форма глагола правильная: «She ___ every day»', opts: ['swim', 'swims', 'swimming', 'swam'], c: 1, lang: 'en' },
  { q: 'Что означает немецкое «das Fernweh»?', opts: ['Тоска по родине', 'Тяга к путешествиям', 'Страх высоты', 'Усталость'], c: 1, lang: 'de' },
  { q: 'Выберите синоним к слову «Enormous»:', opts: ['Tiny', 'Gigantic', 'Quiet', 'Dark'], c: 1, lang: 'en' },
  { q: 'Какой артикль у слова «Mädchen» (девочка)?', opts: ['Der', 'Die', 'Das', 'Den'], c: 2, lang: 'de' },
  { q: 'Вставьте предлог: «I am interested ___ science»', opts: ['at', 'on', 'in', 'for'], c: 2, lang: 'en' },
  { q: 'Что означает идиома «Piece of cake»?', opts: ['Кусок торта', 'Очень просто / пустяк', 'Сложный выбор', 'Пекарня'], c: 1, lang: 'en' },
  { q: 'Третья форма (Partizip II) от «gehen»:', opts: ['ging', 'ist gegangen', 'gegeht', 'hat gegangt'], c: 1, lang: 'de' },
  { q: 'Выберите антоним к «Courage» (храбрость):', opts: ['Bravery', 'Fear / Cowardice', 'Strength', 'Power'], c: 1, lang: 'en' },
  { q: 'Как переводится немецкое «Feierabend»?', opts: ['Выходной день', 'Конец рабочего дня', 'Вечеринка ночью', 'Отпуск'], c: 1, lang: 'de' },
  { q: 'Выберите верный перевод: «Catch someone red-handed»', opts: ['Поймать с поличным', 'Пожать красную руку', 'Встретить друга', 'Ошибиться'], c: 0, lang: 'en' },
  { q: 'Какой падеж требует предлог «ohne» (без)?', opts: ['Dativ', 'Akkusativ', 'Genitiv', 'Nominativ'], c: 1, lang: 'de' }
];

export default function LightningBlitzModal({ isOpen, onClose }) {
  const [gameState, setGameState] = useState('lobby'); // 'lobby' | 'playing' | 'gameover'
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lives, setLives] = useState(3);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('linguo_blitz_highscore');
      if (saved) setHighScore(parseInt(saved, 10));
    } catch (_) {}
  }, []);

  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endGame();
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
    sounds.playTap?.();
    setScore(0);
    setCombo(0);
    setLives(3);
    setTimeLeft(60);
    setCurrentIdx(Math.floor(Math.random() * BLITZ_POOL.length));
    setSelectedOpt(null);
    setIsAnswered(false);
    setGameState('playing');
  };

  const endGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGameState('gameover');
    sounds.playComplete?.();

    setHighScore(prev => {
      const best = Math.max(prev, score);
      localStorage.setItem('linguo_blitz_highscore', best.toString());
      return best;
    });

    const xpEarned = Math.round(score * 2.5 + 20);
    const gemsEarned = Math.round(score / 4);
    gamification.addXP(xpEarned);
    if (gemsEarned > 0) gamification.addGems(gemsEarned);
  };

  const currentQ = BLITZ_POOL[currentIdx % BLITZ_POOL.length];

  const handleSelectOption = (idx) => {
    if (isAnswered) return;
    setSelectedOpt(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQ.c;

    if (isCorrect) {
      sounds.playCorrect?.();
      const mult = combo >= 9 ? 4 : combo >= 5 ? 3 : combo >= 2 ? 2 : 1;
      setScore(s => s + 10 * mult);
      setCombo(c => c + 1);
    } else {
      sounds.playWrong?.();
      setCombo(0);
      setLives(l => {
        const nextL = l - 1;
        if (nextL <= 0) {
          setTimeout(endGame, 400);
        }
        return nextL;
      });
    }

    setTimeout(() => {
      setSelectedOpt(null);
      setIsAnswered(false);
      setCurrentIdx(i => (i + 1) % BLITZ_POOL.length);
    }, 450);
  };

  return (
    <div className="blitz-overlay" onClick={onClose}>
      <div className="blitz-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="blitz-header">
          <div className="blitz-title-box">
            <span className="blitz-badge">⚡ 60s Survival</span>
            <h3>Молниеносный Блиц</h3>
          </div>
          <button className="blitz-close" onClick={onClose}>✕</button>
        </div>

        {/* LOBBY SCREEN */}
        {gameState === 'lobby' && (
          <div className="blitz-lobby">
            <div className="lobby-hero-art">⚡⏱️🔥</div>
            <h4>60 секунд на выживание</h4>
            <p>Отвечайте на вопросы без пауз, держите комбо и бейте свой рекорд!</p>

            <div className="blitz-stats-summary">
              <div className="stat-box">
                <span className="stat-label">🏆 Рекорд очков</span>
                <strong>{highScore}</strong>
              </div>
              <div className="stat-box">
                <span className="stat-label">❤️ Жизни</span>
                <strong>3 ошибки</strong>
              </div>
            </div>

            <button className="blitz-start-btn" onClick={startGame}>
              🚀 В бой! Начать раунд
            </button>
          </div>
        )}

        {/* ACTIVE PLAYING SCREEN */}
        {gameState === 'playing' && (
          <div className="blitz-play-stage">
            {/* HUD: Time, Lives, Score, Combo */}
            <div className="blitz-hud-row">
              <div className="hud-timer">
                <span className="hud-icon">⏱️</span>
                <span className={`time-val ${timeLeft <= 10 ? 'urgent' : ''}`}>{timeLeft}s</span>
              </div>

              <div className="hud-lives">
                {Array.from({ length: 3 }).map((_, i) => (
                  <span key={i} className={`heart ${i < lives ? 'alive' : 'lost'}`}>❤️</span>
                ))}
              </div>

              <div className="hud-score">
                <span>{score} pts</span>
                {combo >= 2 && (
                  <span className="combo-pill">x{combo >= 9 ? 4 : combo >= 5 ? 3 : 2} 🔥</span>
                )}
              </div>
            </div>

            {/* Time progress bar */}
            <div className="blitz-progress-bar">
              <div
                className="blitz-progress-fill"
                style={{ width: `${(timeLeft / 60) * 100}%` }}
              />
            </div>

            {/* Question card */}
            <div className="blitz-q-card">
              <div className="blitz-q-top">
                <span className="q-lang-tag">{currentQ.lang === 'en' ? '🇺🇸 EN' : '🇩🇪 DE'}</span>
                <button
                  className="q-speak-btn"
                  onClick={() => speakText(currentQ.q, currentQ.lang)}
                  title="Озвучить"
                >
                  🔊
                </button>
              </div>
              <p className="blitz-q-text">{currentQ.q}</p>
            </div>

            {/* 4 Choices */}
            <div className="blitz-options-grid">
              {currentQ.opts.map((opt, idx) => {
                let cls = 'blitz-opt-btn';
                if (isAnswered) {
                  if (idx === currentQ.c) cls += ' correct';
                  else if (idx === selectedOpt) cls += ' wrong';
                }
                return (
                  <button
                    key={idx}
                    className={cls}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswered}
                  >
                    <span className="opt-letter">{String.fromCharCode(65 + idx)}</span>
                    <span className="opt-title">{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* GAME OVER SCREEN */}
        {gameState === 'gameover' && (
          <div className="blitz-gameover">
            <div className="gameover-trophy">{score > highScore ? '🎉🏆' : '🏁'}</div>
            <h4>Раунд завершён!</h4>
            <div className="gameover-score-card">
              <span className="label">Ваш результат:</span>
              <strong className="score-number">{score} очков</strong>
              <div className="rewards-row">
                <span>+{Math.round(score * 2.5 + 20)} XP ⚡</span>
                <span>+{Math.round(score / 4)} 💎</span>
              </div>
            </div>

            <div className="gameover-actions">
              <button className="blitz-retry-btn" onClick={startGame}>
                ⚡ Играть снова
              </button>
              <button className="blitz-exit-btn" onClick={onClose}>
                Завершить
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
