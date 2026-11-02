import React, { useState } from 'react';
import { gamification } from '../utils/gamification';
import { sounds } from '../utils/sounds';
import { haptics } from '../utils/haptics';
import './LeaderboardModal.css';

const LEAGUES = [
  { id: 'bronze', name: 'Бронзовая лига', icon: '🥉', color: '#cd7f32' },
  { id: 'silver', name: 'Серебряная лига', icon: '🥈', color: '#c0c0c0' },
  { id: 'gold', name: 'Золотая лига', icon: '🥇', color: '#ffd700' },
  { id: 'diamond', name: 'Алмазная лига', icon: '💎', color: '#38bdf8' },
];

export default function LeaderboardModal({ isOpen, onClose }) {
  const [selectedLeague, setSelectedLeague] = useState('gold');
  const userXP = gamification.getWeeklyXP();

  if (!isOpen) return null;

  // Generate dynamic leaderboard with user naturally placed
  const competitors = [
    { rank: 1, name: 'Alex M.', flag: '🇩🇪', xp: Math.max(userXP + 180, 520), avatar: '👨‍💻' },
    { rank: 2, name: 'Sophie L.', flag: '🇫🇷', xp: Math.max(userXP + 95, 440), avatar: '👩‍🎨' },
    { rank: 3, name: 'Elena V.', flag: '🇷🇺', xp: Math.max(userXP + 30, 380), avatar: '👩‍🏫' },
    { rank: 4, name: 'Вы (Ученик)', flag: '⭐', xp: userXP, isUser: true, avatar: '🦉' },
    { rank: 5, name: 'Carlos R.', flag: '🇪🇸', xp: Math.max(40, userXP - 50), avatar: '👨‍🎤' },
    { rank: 6, name: 'David K.', flag: '🇺🇸', xp: Math.max(30, userXP - 90), avatar: '🧑‍🚀' },
    { rank: 7, name: 'Yuki T.', flag: '🇯🇵', xp: Math.max(20, userXP - 140), avatar: '👩‍💻' },
    { rank: 8, name: 'Marco B.', flag: '🇮🇹', xp: Math.max(10, userXP - 180), avatar: '👨‍🍳' },
  ].sort((a, b) => b.xp - a.xp).map((item, idx) => ({ ...item, rank: idx + 1 }));

  return (
    <div className="board-overlay" onClick={onClose}>
      <div className="board-modal animate-pop" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="board-header">
          <div>
            <h3>🏆 Лига Лидеров Недели</h3>
            <p className="board-sub">Соревнуйся с другими учениками и переходи в Алмазную лигу</p>
          </div>
          <button className="board-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* League Selector Tabs */}
        <div className="board-leagues-row">
          {LEAGUES.map((l) => (
            <button
              key={l.id}
              className={`league-tab ${selectedLeague === l.id ? 'active' : ''}`}
              onClick={() => {
                setSelectedLeague(l.id);
                sounds.playTap?.();
                haptics.light();
              }}
            >
              <span>{l.icon}</span> {l.name}
            </button>
          ))}
        </div>

        {/* Timer Banner */}
        <div className="board-timer-banner">
          <span>⏳ До подведения итогов: <strong>3 дня 14 часов</strong></span>
          <span className="zone-hint">Топ-3 переходят в лигу выше ⬆️</span>
        </div>

        {/* Competitors List */}
        <div className="board-list">
          {competitors.map((c) => {
            const isPromotion = c.rank <= 3;
            return (
              <div
                key={c.name}
                className={`board-row ${c.isUser ? 'user-row' : ''} ${isPromotion ? 'promotion' : ''}`}
              >
                <div className="rank-badge">
                  {c.rank === 1 ? '🥇' : c.rank === 2 ? '🥈' : c.rank === 3 ? '🥉' : c.rank}
                </div>

                <div className="board-user-info">
                  <span className="board-avatar">{c.avatar}</span>
                  <div>
                    <strong>{c.name}</strong>
                    <span className="user-country">{c.flag}</span>
                  </div>
                </div>

                <div className="board-xp-val">
                  ⚡ {c.xp} XP
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="board-footer">
          <p>💡 Проходите уроки, истории и батлы, чтобы подняться в топ лиги!</p>
        </div>
      </div>
    </div>
  );
}
