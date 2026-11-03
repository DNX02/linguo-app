import React, { useState, useEffect } from 'react';
import { gamification } from '../utils/gamification';
import './LeaguesModal.css';

const LEAGUES = [
  { id: 'bronze', name: 'Бронзовая лига', icon: '🥉', color: '#cd7f32', minXP: 0 },
  { id: 'silver', name: 'Серебряная лига', icon: '🥈', color: '#c0c0c0', minXP: 300 },
  { id: 'gold', name: 'Золотая лига', icon: '🥇', color: '#ffd700', minXP: 800 },
  { id: 'ruby', name: 'Рубиновая лига', icon: '💎', color: '#e11d48', minXP: 1600 },
  { id: 'diamond', name: 'Бриллиантовая лига', icon: '👑', color: '#38bdf8', minXP: 3000 },
];

const BOT_PLAYERS = [
  { id: 'p1', name: 'Alex Hunter', avatar: '🦁', xp: 580, flag: '🇺🇸' },
  { id: 'p2', name: 'Sophie Müller', avatar: '🦊', xp: 510, flag: '🇩🇪' },
  { id: 'p3', name: 'Lucas Rossi', avatar: '🐺', xp: 470, flag: '🇮🇹' },
  { id: 'p4', name: 'Elena Petrova', avatar: '🐱', xp: 420, flag: '🇷🇺' },
  { id: 'p5', name: 'Kenji Sato', avatar: '🐼', xp: 390, flag: '🇯🇵' },
  { id: 'p6', name: 'Marie Dubois', avatar: '🦉', xp: 350, flag: '🇫🇷' },
  { id: 'p7', name: 'Mateo Garcia', avatar: '🦅', xp: 310, flag: '🇪🇸' },
  { id: 'p8', name: 'Clara Schmidt', avatar: '🐨', xp: 260, flag: '🇩🇪' },
  { id: 'p9', name: 'Oliver Brown', avatar: '🐯', xp: 220, flag: '🇺🇸' },
  { id: 'p10', name: 'Anna Novak', avatar: '🦄', xp: 180, flag: '🇨🇿' },
];

export default function LeaguesModal({ isOpen, onClose }) {
  const [userProfile, setUserProfile] = useState(() => {
    try {
      return gamification?.getProfile ? gamification.getProfile() : { xp: gamification?.getXP ? gamification.getXP() : 0 };
    } catch (_) {
      return { xp: 0 };
    }
  });
  const [currentLeagueIdx, setCurrentLeagueIdx] = useState(1); // Silver

  useEffect(() => {
    if (isOpen) {
      try {
        const p = gamification?.getProfile ? gamification.getProfile() : { xp: gamification?.getXP ? gamification.getXP() : 0 };
        setUserProfile(p);
        // Determine league based on user XP
        let lIdx = 0;
        for (let i = LEAGUES.length - 1; i >= 0; i--) {
          if ((p.xp || 0) >= LEAGUES[i].minXP) {
            lIdx = i;
            break;
          }
        }
        setCurrentLeagueIdx(lIdx);
      } catch (_) {}
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentLeague = LEAGUES[currentLeagueIdx];

  // Merge user into leaderboard and sort descending
  const userEntry = {
    id: 'user',
    name: 'Вы (Linguo Hero)',
    avatar: '🦉',
    xp: userProfile.xp,
    flag: '⭐',
    isUser: true,
  };

  const leaderboard = [...BOT_PLAYERS, userEntry].sort((a, b) => b.xp - a.xp);
  const userRank = leaderboard.findIndex((item) => item.isUser) + 1;

  return (
    <div className="leagues-modal-backdrop" onClick={onClose}>
      <div className="leagues-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <header className="leagues-modal-header">
          <div className="leagues-title-box">
            <span className="leagues-badge-icon">{currentLeague.icon}</span>
            <div>
              <h3>{currentLeague.name}</h3>
              <p>Еженедельный турнир • Топ-3 переходят в лигу выше</p>
            </div>
          </div>
          <button className="leagues-close-btn" onClick={onClose}>
            ✕
          </button>
        </header>

        {/* Season Timer & League progression bar */}
        <div className="league-season-banner">
          <div className="season-timer">
            <span className="timer-icon">⏳</span>
            <span>До конца турнира: <strong>3 дня 14 часов</strong></span>
          </div>
          <div className="league-nav-pills">
            {LEAGUES.map((l, i) => (
              <span
                key={l.id}
                className={`league-nav-dot ${i === currentLeagueIdx ? 'current' : ''} ${i < currentLeagueIdx ? 'passed' : ''}`}
                title={l.name}
              >
                {l.icon}
              </span>
            ))}
          </div>
        </div>

        {/* User Current Standing Highlight Card */}
        <div className="user-standing-card">
          <div className="standing-left">
            <span className="standing-rank-badge">#{userRank}</span>
            <div>
              <h4>Ваша позиция в лиге</h4>
              <p>
                {userRank <= 3
                  ? '🔥 Вы в ЗОНЕ ПОВЫШЕНИЯ! Держите темп!'
                  : `До Топ-3 не хватает ${Math.max(0, leaderboard[2].xp - userProfile.xp + 10)} XP`}
              </p>
            </div>
          </div>
          <div className="standing-xp">
            <strong>{userProfile.xp}</strong>
            <span>Всего XP</span>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="leagues-table-wrap">
          <div className="leagues-zone-header promotion">
            <span>🟢 ЗОНА ПОВЫШЕНИЯ В СЛЕДУЮЩУЮ ЛИГУ (+50 💎)</span>
          </div>

          <div className="leagues-list">
            {leaderboard.map((player, idx) => {
              const rank = idx + 1;
              let rowCls = 'league-row';
              if (player.isUser) rowCls += ' is-current-user';
              if (rank <= 3) rowCls += ' in-promo-zone';
              if (rank >= leaderboard.length - 2) rowCls += ' in-demo-zone';

              return (
                <div key={player.id} className={rowCls}>
                  <div className="rank-col">
                    {rank === 1 && '🥇'}
                    {rank === 2 && '🥈'}
                    {rank === 3 && '🥉'}
                    {rank > 3 && <span className="rank-number">{rank}</span>}
                  </div>

                  <div className="player-col">
                    <span className="player-avatar">{player.avatar}</span>
                    <div className="player-meta">
                      <span className="player-name">
                        {player.name} {player.flag}
                      </span>
                      {player.isUser && <span className="you-pill">ВЫ</span>}
                    </div>
                  </div>

                  <div className="xp-col">
                    <strong>{player.xp}</strong>
                    <span>XP</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="leagues-zone-header demotion">
            <span>🔴 ЗОНА ВЫЛЕТА (Нижние 2 места)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
