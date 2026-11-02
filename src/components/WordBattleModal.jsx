import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../utils/sounds';
import { haptics } from '../utils/haptics';
import { gamification } from '../utils/gamification';
import wordsData from '../data/words';
import './WordBattleModal.css';

export default function WordBattleModal({ isOpen, onClose, currentLanguage = 'en' }) {
  const [gameState, setGameState] = useState('lobby'); // 'lobby' | 'playing' | 'victory' | 'defeat'
  const [playerHp, setPlayerHp] = useState(100);
  const [botHp, setBotHp] = useState(100);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerChecking, setIsAnswerChecking] = useState(false);
  const [botHitAnim, setBotHitAnim] = useState(false);
  const [playerHitAnim, setPlayerHitAnim] = useState(false);

  const timerRef = useRef(null);
  const botAttackRef = useRef(null);

  // Filter pool of words for current language
  const availableWords = wordsData.filter((w) => w.language === currentLanguage || w.language === 'en');

  const generateQuestion = () => {
    if (availableWords.length < 4) return null;
    const targetWord = availableWords[Math.floor(Math.random() * availableWords.length)];
    const wrongWords = availableWords.filter((w) => w.id !== targetWord.id);
    const shuffledWrongs = [...wrongWords].sort(() => 0.5 - Math.random()).slice(0, 3);
    const options = [targetWord.translation, ...shuffledWrongs.map((w) => w.translation)].sort(
      () => 0.5 - Math.random()
    );
    return {
      word: targetWord.word,
      correct: targetWord.translation,
      options,
    };
  };

  const startGame = () => {
    sounds.playTap?.();
    haptics.medium();
    setPlayerHp(100);
    setBotHp(100);
    setCombo(0);
    setTimeLeft(45);
    setGameState('playing');
    setCurrentQuestion(generateQuestion());
  };

  // Main countdown timer & bot attacks
  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleTimeOver();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Bot periodic chip attack every 4.5 seconds
      botAttackRef.current = setInterval(() => {
        setPlayerHp((prev) => {
          const next = Math.max(0, prev - 8);
          setPlayerHitAnim(true);
          setTimeout(() => setPlayerHitAnim(false), 300);
          if (next <= 0) {
            handleDefeat();
          }
          return next;
        });
      }, 4500);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (botAttackRef.current) clearInterval(botAttackRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (botAttackRef.current) clearInterval(botAttackRef.current);
    };
  }, [gameState]);

  const handleTimeOver = () => {
    if (botHp <= playerHp) {
      handleVictory();
    } else {
      handleDefeat();
    }
  };

  const handleVictory = () => {
    setGameState('victory');
    gamification.addXP(50);
    sounds.playComplete?.();
    haptics.celebrate();
  };

  const handleDefeat = () => {
    setGameState('defeat');
    gamification.addXP(20);
    sounds.playWrong?.();
    haptics.error();
  };

  const handleAnswerClick = (option) => {
    if (isAnswerChecking || gameState !== 'playing') return;
    setIsAnswerChecking(true);
    setSelectedAnswer(option);

    if (option === currentQuestion.correct) {
      // Correct! Deal damage to bot
      sounds.playCorrect?.();
      haptics.celebrate();
      const newCombo = combo + 1;
      setCombo(newCombo);

      const baseDamage = 22;
      const comboBonus = Math.min(15, newCombo * 3);
      const totalDamage = baseDamage + comboBonus;

      setBotHitAnim(true);
      setTimeout(() => setBotHitAnim(false), 350);

      setBotHp((prev) => {
        const next = Math.max(0, prev - totalDamage);
        if (next <= 0) {
          setTimeout(handleVictory, 300);
        }
        return next;
      });

      setTimeout(() => {
        setIsAnswerChecking(false);
        setSelectedAnswer(null);
        setCurrentQuestion(generateQuestion());
      }, 400);
    } else {
      // Wrong! Player takes damage
      sounds.playWrong?.();
      haptics.error();
      setCombo(0);

      setPlayerHitAnim(true);
      setTimeout(() => setPlayerHitAnim(false), 350);

      setPlayerHp((prev) => {
        const next = Math.max(0, prev - 18);
        if (next <= 0) {
          setTimeout(handleDefeat, 300);
        }
        return next;
      });

      setTimeout(() => {
        setIsAnswerChecking(false);
        setSelectedAnswer(null);
        setCurrentQuestion(generateQuestion());
      }, 600);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="battle-overlay" onClick={onClose}>
      <div className="battle-modal animate-pop" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="battle-header">
          <div>
            <h3>⚔️ Word Battle Arena</h3>
            <p className="battle-sub">Спид-поединок против AI-бота на скорость</p>
          </div>
          <button className="battle-close-btn" onClick={onClose}>✕</button>
        </div>

        {gameState === 'lobby' ? (
          /* Lobby view */
          <div className="battle-lobby animate-in">
            <div className="battle-vs-stage">
              <div className="combatant-preview">
                <span className="combatant-avatar">🦸</span>
                <span className="combatant-name">Вы</span>
              </div>
              <div className="battle-vs-badge">VS</div>
              <div className="combatant-preview">
                <span className="combatant-avatar bot">🤖</span>
                <span className="combatant-name">Duo Bot</span>
              </div>
            </div>

            <div className="battle-rules-box">
              <h4>🎯 Правила поединка:</h4>
              <ul>
                <li>⏳ Раунд длится <strong>45 секунд</strong>.</li>
                <li>⚡ Быстрые верные ответы наносят урон боту и создают <strong>комбо</strong>!</li>
                <li>⚠️ Ошибки или промедление отнимают ваше здоровье!</li>
              </ul>
            </div>

            <button className="battle-start-btn" onClick={startGame}>
              🔥 Вступить в бой!
            </button>
          </div>
        ) : gameState === 'victory' || gameState === 'defeat' ? (
          /* End Game Result */
          <div className="battle-result-card animate-pop">
            <span className="result-big-icon">
              {gameState === 'victory' ? '🏆' : '💀'}
            </span>
            <h3>{gameState === 'victory' ? 'ПОБЕДА!' : 'ПОРАЖЕНИЕ'}</h3>
            <p>
              {gameState === 'victory'
                ? 'Вы сокрушили Duo Bot своей эрудицией и скоростью!'
                : 'Duo Bot оказался быстрее в этот раз. Попробуйте взять реванш!'}
            </p>

            <div className="result-xp-badge">
              +{gameState === 'victory' ? '50' : '20'} XP получено
            </div>

            <div className="result-actions">
              <button className="battle-start-btn" onClick={startGame}>
                🔄 Реванш
              </button>
              <button className="battle-lobby-btn" onClick={() => setGameState('lobby')}>
                В лобби
              </button>
            </div>
          </div>
        ) : (
          /* Active Battle Stage */
          <div className="battle-arena">
            {/* Top HUD: Health Bars & Timer */}
            <div className="battle-hud">
              {/* Player HP */}
              <div className={`combatant-hud ${playerHitAnim ? 'hit' : ''}`}>
                <div className="hud-meta">
                  <span>🦸 Вы</span>
                  <strong>{playerHp} HP</strong>
                </div>
                <div className="hp-bar-track">
                  <div
                    className="hp-bar-fill player"
                    style={{ width: `${playerHp}%` }}
                  />
                </div>
              </div>

              {/* Timer in Center */}
              <div className="battle-timer-ring">
                <span>⏱ {timeLeft}s</span>
              </div>

              {/* Bot HP */}
              <div className={`combatant-hud ${botHitAnim ? 'hit' : ''}`}>
                <div className="hud-meta">
                  <span>🤖 Duo Bot</span>
                  <strong>{botHp} HP</strong>
                </div>
                <div className="hp-bar-track">
                  <div
                    className="hp-bar-fill bot"
                    style={{ width: `${botHp}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Combo Streak Indicator */}
            {combo > 1 && (
              <div className="battle-combo-badge animate-pop">
                🔥 COMBO x{combo}!
              </div>
            )}

            {/* Question Card */}
            {currentQuestion && (
              <div className="battle-question-card animate-in">
                <span className="q-label">Переведите слово:</span>
                <h2 className="q-word">{currentQuestion.word}</h2>

                <div className="battle-options-grid">
                  {currentQuestion.options.map((opt, i) => {
                    let optClass = '';
                    if (isAnswerChecking) {
                      if (opt === currentQuestion.correct) optClass = 'correct';
                      else if (opt === selectedAnswer) optClass = 'wrong';
                    }
                    return (
                      <button
                        key={i}
                        className={`battle-opt-btn ${optClass}`}
                        onClick={() => handleAnswerClick(opt)}
                        disabled={isAnswerChecking}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
