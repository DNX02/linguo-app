import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../utils/soundEffects';
import { gamification } from '../utils/gamification';
import './DuelArenaModal.css';

const OPPONENTS = [
  {
    id: 'mike',
    name: 'Майк',
    role: 'Новичок из Бруклина',
    avatar: '🧢',
    difficulty: 'Легкий',
    reactionMs: 4000,
    accuracy: 0.65,
  },
  {
    id: 'emma',
    name: 'Эмма',
    role: 'Студентка Гарварда',
    avatar: '👩‍🎓',
    difficulty: 'Средний',
    reactionMs: 2800,
    accuracy: 0.82,
  },
  {
    id: 'hans',
    name: 'Профессор Ганс',
    role: 'Лингвист из Берлина',
    avatar: '🧐',
    difficulty: 'Эксперт',
    reactionMs: 2000,
    accuracy: 0.95,
  },
];

const DUEL_QUESTIONS = [
  {
    q: 'Переведите: "He decided to call me"',
    options: ['Он решил позвонить мне', 'Он отказался звонить', 'Он позвонил вчера', 'Он ждет звонка'],
    correct: 0,
  },
  {
    q: 'Вставьте предлог: "I will meet you ___ Monday."',
    options: ['in', 'at', 'on', 'for'],
    correct: 2,
  },
  {
    q: 'Немецкий артикль: "___ Katze schläft."',
    options: ['Der', 'Die', 'Das', 'Den'],
    correct: 1,
  },
  {
    q: 'Выберите синоним к слову "Huge":',
    options: ['Tiny', 'Enormous', 'Silent', 'Slow'],
    correct: 1,
  },
  {
    q: 'Past Simple от глагола "buy":',
    options: ['buyed', 'bought', 'boated', 'boughten'],
    correct: 1,
  },
  {
    q: 'Переведите: "Hier darf man nicht rauchen"',
    options: ['Здесь можно курить', 'Здесь запрещено курить', 'Здесь продают табак', 'Курение полезно'],
    correct: 1,
  },
];

export default function DuelArenaModal({ isOpen, onClose }) {
  const [selectedOpponent, setSelectedOpponent] = useState(OPPONENTS[1]);
  const [gameState, setGameState] = useState('lobby'); // 'lobby' | 'playing' | 'victory' | 'defeat'
  const [playerHp, setPlayerHp] = useState(100);
  const [opponentHp, setOpponentHp] = useState(100);
  const [qIndex, setQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [combo, setCombo] = useState(0);
  const [botActionMessage, setBotActionMessage] = useState('');
  const [playerActionMessage, setPlayerActionMessage] = useState('');
  const botTimerRef = useRef(null);

  useEffect(() => {
    if (gameState === 'playing') {
      triggerBotTurn();
    }
    return () => {
      if (botTimerRef.current) clearTimeout(botTimerRef.current);
    };
  }, [gameState, qIndex]);

  if (!isOpen) return null;

  const startBattle = () => {
    setPlayerHp(100);
    setOpponentHp(100);
    setQIndex(0);
    setCombo(0);
    setSelectedOption(null);
    setBotActionMessage('');
    setPlayerActionMessage('');
    setGameState('playing');
    sounds.playLevelUp();
  };

  const triggerBotTurn = () => {
    if (botTimerRef.current) clearTimeout(botTimerRef.current);
    const delay = selectedOpponent.reactionMs + Math.random() * 1000;

    botTimerRef.current = setTimeout(() => {
      if (gameState !== 'playing') return;
      const willHit = Math.random() < selectedOpponent.accuracy;
      if (willHit) {
        const damage = Math.floor(15 + Math.random() * 15);
        setPlayerHp((prev) => {
          const next = Math.max(0, prev - damage);
          if (next === 0) {
            setGameState('defeat');
            sounds.playWrong();
          }
          return next;
        });
        setBotActionMessage(`⚡ ${selectedOpponent.name} нанес вам -${damage} HP!`);
      } else {
        setBotActionMessage(`💨 ${selectedOpponent.name} ошибся и промахнулся!`);
      }
    }, delay);
  };

  const handleAnswer = (optionIdx) => {
    if (selectedOption !== null || gameState !== 'playing') return;
    setSelectedOption(optionIdx);

    const curQ = DUEL_QUESTIONS[qIndex % DUEL_QUESTIONS.length];
    const isCorrect = optionIdx === curQ.correct;

    if (isCorrect) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      sounds.playCorrect();

      const baseDamage = 25;
      const totalDamage = baseDamage + (newCombo > 1 ? newCombo * 5 : 0);
      setPlayerActionMessage(`💥 УДАР! Нанесено -${totalDamage} HP (Комбо x${newCombo})!`);

      setOpponentHp((prev) => {
        const next = Math.max(0, prev - totalDamage);
        if (next === 0) {
          setGameState('victory');
          sounds.playComplete();
          gamification.addXP(50);
          gamification.addGems(15);
        }
        return next;
      });
    } else {
      setCombo(0);
      sounds.playWrong();
      setPlayerActionMessage('❌ Ошибка! Промах!');
    }

    // Move to next question after 1.2s
    setTimeout(() => {
      if (gameState === 'playing') {
        setSelectedOption(null);
        setQIndex((prev) => prev + 1);
      }
    }, 1200);
  };

  const currentQ = DUEL_QUESTIONS[qIndex % DUEL_QUESTIONS.length];

  return (
    <div className="duel-modal-backdrop" onClick={onClose}>
      <div className="duel-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <header className="duel-modal-header">
          <div className="duel-title-box">
            <span className="duel-badge-icon">⚔️</span>
            <div>
              <h3>Арена Дуэлей Знаний</h3>
              <p>Быстрый PVP баттл 1-на-1 на скорость и точность</p>
            </div>
          </div>
          <button className="duel-close-btn" onClick={onClose}>
            ✕
          </button>
        </header>

        {/* LOBBY STATE */}
        {gameState === 'lobby' && (
          <div className="duel-lobby-view">
            <p className="duel-section-subtitle">Выберите соперника для дуэли:</p>
            <div className="duel-opponents-grid">
              {OPPONENTS.map((opp) => (
                <div
                  key={opp.id}
                  className={`duel-opp-card ${selectedOpponent.id === opp.id ? 'active' : ''}`}
                  onClick={() => setSelectedOpponent(opp)}
                >
                  <div className="opp-avatar">{opp.avatar}</div>
                  <div className="opp-info">
                    <h4>{opp.name}</h4>
                    <span>{opp.role}</span>
                    <span className={`opp-diff diff-${opp.difficulty.toLowerCase()}`}>
                      {opp.difficulty}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="duel-reward-preview">
              <span>🏆 Награда за победу:</span>
              <strong>+50 XP & +15 💎 Кристаллов</strong>
            </div>

            <button className="duel-start-battle-btn" onClick={startBattle}>
              🔥 НАЧАТЬ ДУЭЛЬ!
            </button>
          </div>
        )}

        {/* PLAYING STATE */}
        {gameState === 'playing' && (
          <div className="duel-arena-view">
            {/* Health Bars HUD */}
            <div className="duel-hud-row">
              <div className="duel-fighter-side left">
                <div className="fighter-avatar">🤠</div>
                <div className="fighter-status">
                  <span className="fighter-name">Вы</span>
                  <div className="hp-bar-outer">
                    <div className="hp-bar-fill player" style={{ width: `${playerHp}%` }}></div>
                  </div>
                  <span className="hp-text">{playerHp} / 100 HP</span>
                </div>
              </div>

              <div className="duel-vs-badge">VS</div>

              <div className="duel-fighter-side right">
                <div className="fighter-status">
                  <span className="fighter-name">{selectedOpponent.name}</span>
                  <div className="hp-bar-outer">
                    <div className="hp-bar-fill opp" style={{ width: `${opponentHp}%` }}></div>
                  </div>
                  <span className="hp-text">{opponentHp} / 100 HP</span>
                </div>
                <div className="fighter-avatar">{selectedOpponent.avatar}</div>
              </div>
            </div>

            {/* Combat log banners */}
            <div className="duel-action-log">
              {playerActionMessage && <div className="log-msg player">{playerActionMessage}</div>}
              {botActionMessage && <div className="log-msg bot">{botActionMessage}</div>}
            </div>

            {/* Question card */}
            <div className="duel-question-card">
              <div className="duel-q-meta">
                <span>Вопрос #{qIndex + 1}</span>
                {combo > 1 && <span className="combo-pill">🔥 COMBO x{combo}!</span>}
              </div>
              <h3 className="duel-q-title">{currentQ.q}</h3>
            </div>

            {/* Answer buttons */}
            <div className="duel-answers-grid">
              {currentQ.options.map((opt, idx) => {
                let cls = 'duel-opt-btn';
                if (selectedOption !== null) {
                  if (idx === currentQ.correct) cls += ' opt-correct';
                  else if (idx === selectedOption) cls += ' opt-wrong';
                  else cls += ' opt-dim';
                }
                return (
                  <button
                    key={idx}
                    className={cls}
                    onClick={() => handleAnswer(idx)}
                    disabled={selectedOption !== null}
                  >
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* VICTORY STATE */}
        {gameState === 'victory' && (
          <div className="duel-result-view victory">
            <div className="result-trophy">🏆</div>
            <h2>ЧИСТАЯ ПОБЕДА!</h2>
            <p>Вы разгромили {selectedOpponent.name} и доказали превосходство в языке!</p>
            <div className="result-rewards-box">
              <span className="reward-chip">+50 XP ⚡</span>
              <span className="reward-chip">+15 💎 Кристаллов</span>
            </div>
            <button className="duel-rematch-btn" onClick={startBattle}>
              ⚔️ Сыграть ещё раз
            </button>
          </div>
        )}

        {/* DEFEAT STATE */}
        {gameState === 'defeat' && (
          <div className="duel-result-view defeat">
            <div className="result-trophy">💥</div>
            <h2>ПОРАЖЕНИЕ</h2>
            <p>{selectedOpponent.name} оказался быстрее. Повторите грамматику и возьмите реванш!</p>
            <button className="duel-rematch-btn retry" onClick={startBattle}>
              🔄 Попробовать снова
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
