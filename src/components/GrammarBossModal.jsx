import React, { useState } from 'react';
import { sounds } from '../utils/soundEffects';
import { gamification } from '../utils/gamification';
import './GrammarBossModal.css';

const BOSSES = [
  {
    id: 'dragon',
    name: 'Дракон Неправильных Глаголов',
    title: 'The Irregular Dragon',
    avatar: '🐉',
    maxHp: 300,
    theme: 'Past Simple & V3',
    questions: [
      { q: 'Выберите 3-ю форму (V3) глагола "fly":', opts: ['flied', 'flew', 'flown'], c: 2, dmg: 100 },
      { q: 'Прошедшая форма (V2) от "freeze":', opts: ['froze', 'freezed', 'frozen'], c: 0, dmg: 100 },
      { q: 'Все 3 формы верны:', opts: ['sink - sank - sunk', 'sink - sinked - sinked', 'sink - sonk - sonken'], c: 0, dmg: 100 },
    ],
  },
  {
    id: 'colossus',
    name: 'Титан Пассивного Залога',
    title: 'The Passive Colossus',
    avatar: '🗿',
    maxHp: 350,
    theme: 'Passive Voice (be + V3)',
    questions: [
      { q: 'Вставьте пассив: "The house ___ built in 1995."', opts: ['was', 'is being', 'has'], c: 0, dmg: 120 },
      { q: '"Letters are ___ every morning."', opts: ['delivered', 'delivering', 'deliver'], c: 0, dmg: 120 },
      { q: '"The car has ___ repaired."', opts: ['been', 'be', 'being'], c: 0, dmg: 120 },
    ],
  },
];

export default function GrammarBossModal({ isOpen, onClose }) {
  const [currentBoss, setCurrentBoss] = useState(BOSSES[0]);
  const [bossHp, setBossHp] = useState(BOSSES[0].maxHp);
  const [playerHp, setPlayerHp] = useState(100);
  const [qIndex, setQIndex] = useState(0);
  const [combatState, setCombatState] = useState('fighting'); // 'fighting' | 'won' | 'lost'
  const [spellEffect, setSpellEffect] = useState('');

  if (!isOpen) return null;

  const handleCastSpell = (optIdx) => {
    if (combatState !== 'fighting') return;

    const currentQ = currentBoss.questions[qIndex % currentBoss.questions.length];
    const isCorrect = optIdx === currentQ.c;

    if (isCorrect) {
      setSpellEffect('🔥 ОГНЕННЫЙ УДАР! КРИТИЧЕСКИЙ УРОН!');
      sounds.playComplete();
      const nextHp = Math.max(0, bossHp - currentQ.dmg);
      setBossHp(nextHp);

      if (nextHp === 0) {
        setCombatState('won');
        gamification.addXP(75);
        gamification.addGems(25);
      } else {
        setQIndex((i) => i + 1);
      }
    } else {
      setSpellEffect('⚡ БОСС АТАКУЕТ! ПРОМАХ!');
      sounds.playWrong();
      const nextPlayerHp = Math.max(0, playerHp - 35);
      setPlayerHp(nextPlayerHp);

      if (nextPlayerHp === 0) {
        setCombatState('lost');
      }
    }

    setTimeout(() => setSpellEffect(''), 1500);
  };

  const resetBattle = (boss) => {
    setCurrentBoss(boss);
    setBossHp(boss.maxHp);
    setPlayerHp(100);
    setQIndex(0);
    setCombatState('fighting');
    setSpellEffect('');
  };

  const currentQ = currentBoss.questions[qIndex % currentBoss.questions.length];

  return (
    <div className="boss-modal-backdrop" onClick={onClose}>
      <div className="boss-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <header className="boss-modal-header">
          <div className="boss-title-box">
            <span className="boss-badge-icon">🧠</span>
            <div>
              <h3>RPG Битвы с Боссами Грамматики</h3>
              <p>Побеждайте монстров заклинаниями правильных ответов</p>
            </div>
          </div>
          <button className="boss-close-btn" onClick={onClose}>
            ✕
          </button>
        </header>

        {/* Boss selector */}
        <div className="boss-selector-row">
          {BOSSES.map((b) => (
            <button
              key={b.id}
              className={`boss-pill-btn ${currentBoss.id === b.id ? 'active' : ''}`}
              onClick={() => resetBattle(b)}
            >
              {b.avatar} {b.name}
            </button>
          ))}
        </div>

        {/* Battle Arena */}
        <div className="boss-arena-stage">
          {/* Boss character */}
          <div className="boss-monster-box">
            <div className="boss-avatar-big">{currentBoss.avatar}</div>
            <h3 className="boss-name">{currentBoss.name}</h3>
            <div className="boss-hp-bar">
              <div
                className="boss-hp-fill"
                style={{ width: `${(bossHp / currentBoss.maxHp) * 100}%` }}
              ></div>
            </div>
            <span className="boss-hp-num">{bossHp} / {currentBoss.maxHp} HP</span>
          </div>

          {/* Spell feedback animation */}
          {spellEffect && <div className="spell-banner animate-pop">{spellEffect}</div>}

          {/* Player status */}
          <div className="player-rpg-hud">
            <span>🧙‍♂️ Ваше здоровье: <strong>{playerHp} / 100 HP</strong></span>
            <div className="player-hp-bar">
              <div className="player-hp-fill" style={{ width: `${playerHp}%` }}></div>
            </div>
          </div>
        </div>

        {/* Question & Spells */}
        {combatState === 'fighting' && (
          <div className="boss-spell-card">
            <h4 className="boss-q-text">{currentQ.q}</h4>
            <div className="spells-grid">
              {currentQ.opts.map((opt, idx) => (
                <button
                  key={idx}
                  className="spell-cast-btn"
                  onClick={() => handleCastSpell(idx)}
                >
                  ⚡ {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Victory */}
        {combatState === 'won' && (
          <div className="boss-victory-box">
            <span className="loot-icon">👑</span>
            <h2>БОСС ПОВЕРЖЕН!</h2>
            <p>Вы заслужили титул «Повелитель Времен» и легендарную награду!</p>
            <div className="loot-chips">
              <span>+75 XP ⚡</span>
              <span>+25 💎 Кристаллов</span>
            </div>
            <button className="boss-rematch-btn" onClick={() => resetBattle(currentBoss)}>
              ⚔️ Сразиться снова
            </button>
          </div>
        )}

        {/* Defeat */}
        {combatState === 'lost' && (
          <div className="boss-defeat-box">
            <span className="loot-icon">💀</span>
            <h2>ВЫ ПАЛИ В БОЮ</h2>
            <p>Босс оказался слишком могуществен. Повторите правила и нанесите ответный удар!</p>
            <button className="boss-rematch-btn retry" onClick={() => resetBattle(currentBoss)}>
              🔄 Попробовать снова
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
