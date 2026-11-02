import React, { useState } from 'react';
import './ShareAchievementModal.css';

export default function ShareAchievementModal({ isOpen, onClose, stats = {} }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const {
    streak = 1,
    todayReviewed = 0,
    accuracy = 100,
    rankTitle = '🌱 Новичок',
    totalXP = 0,
    language = 'en',
  } = stats;

  const langLabel = language === 'en' ? '🇺🇸 Американский английский' : '🇩🇪 Немецкий';

  const shareText = `🚀 Мой прогресс в Linguo!\n` +
    `🔥 Серия: ${streak} ${streak === 1 ? 'день' : streak < 5 ? 'дня' : 'дней'} подряд\n` +
    `📚 Повторено сегодня: ${todayReviewed} слов\n` +
    `🎯 Точность ответов: ${accuracy}%\n` +
    `⚡ Уровень: ${rankTitle} (${totalXP} XP)\n` +
    `🌐 Язык: ${langLabel}\n\n` +
    `Учи языки бесплатно: https://dnx02.github.io/linguo-app/`;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareText);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = shareText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (_) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="share-overlay" onClick={onClose}>
      <div className="share-modal" onClick={(e) => e.stopPropagation()}>
        <div className="share-header">
          <h2>🎉 Поделиться успехом</h2>
          <button className="share-close" onClick={onClose}>✕</button>
        </div>

        {/* The Pretty Achievement Card */}
        <div className="share-card-preview">
          <div className="share-card-brand">
            <span className="share-logo-icon">🦉</span>
            <span className="share-logo-text">Linguo App</span>
            <span className="share-card-flag">{language === 'en' ? '🇺🇸' : '🇩🇪'}</span>
          </div>

          <div className="share-card-streak">
            <span className="share-flame">🔥</span>
            <div>
              <div className="share-streak-num">{streak}</div>
              <div className="share-streak-lbl">
                {streak === 1 ? 'день ударно' : streak < 5 ? 'дня ударно' : 'дней ударно'}
              </div>
            </div>
          </div>

          <div className="share-card-stats-row">
            <div className="share-stat-col">
              <span className="share-stat-v">{todayReviewed}</span>
              <span className="share-stat-l">Слов сегодня</span>
            </div>
            <div className="share-stat-col">
              <span className="share-stat-v">{accuracy}%</span>
              <span className="share-stat-l">Точность</span>
            </div>
            <div className="share-stat-col">
              <span className="share-stat-v">{totalXP}</span>
              <span className="share-stat-l">Очков XP</span>
            </div>
          </div>

          <div className="share-card-footer">
            <span className="share-rank-pill">{rankTitle}</span>
            <span className="share-web-link">dnx02.github.io/linguo-app</span>
          </div>
        </div>

        <div className="share-actions">
          <button className="share-copy-btn" onClick={handleCopy}>
            {copied ? '✅ Скопировано в буфер!' : '📋 Скопировать текст для соцсетей'}
          </button>
        </div>
      </div>
    </div>
  );
}
