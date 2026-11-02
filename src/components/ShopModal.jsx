import React, { useState } from 'react';
import { gamification } from '../utils/gamification';
import { sounds } from '../utils/sounds';
import { haptics } from '../utils/haptics';
import './ShopModal.css';

export default function ShopModal({ isOpen, onClose }) {
  const [gems, setGems] = useState(() => gamification.getGems());
  const [chestOpened, setChestOpened] = useState(() => gamification.isDailyChestOpened());
  const [chestReward, setChestReward] = useState(null);
  const [hasFreeze, setHasFreeze] = useState(() => gamification.hasStreakFreeze());
  const [hasXpBoost, setHasXpBoost] = useState(() => localStorage.getItem('linguo_boost_active') === 'true');
  const [hasGoldTheme, setHasGoldTheme] = useState(() => localStorage.getItem('linguo_gold_theme') === 'true');
  const [toastMsg, setToastMsg] = useState('');

  if (!isOpen) return null;

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2500);
  };

  const handleOpenChest = () => {
    if (chestOpened) return;
    const res = gamification.openDailyChest();
    setChestOpened(true);
    setChestReward(res);
    setGems(gamification.getGems());
    sounds.playComplete?.();
    haptics.celebrate();
    showToast('🎉 Награда получена: +50 💎 и +40 XP!');
  };

  const handleBuyItem = (itemType, price) => {
    sounds.playTap?.();
    if (gamification.spendGems(price)) {
      setGems(gamification.getGems());
      sounds.playCorrect?.();
      haptics.celebrate();

      if (itemType === 'freeze') {
        gamification.setStreakFreeze(true);
        setHasFreeze(true);
        showToast('❄️ Заморозка стрика активирована!');
      } else if (itemType === 'boost') {
        localStorage.setItem('linguo_boost_active', 'true');
        setHasXpBoost(true);
        showToast('⚡ Бустер двойного опыта включен!');
      } else if (itemType === 'gold') {
        localStorage.setItem('linguo_gold_theme', 'true');
        setHasGoldTheme(true);
        showToast('👑 Золотой статус активирован!');
      }
    } else {
      sounds.playWrong?.();
      haptics.error();
      showToast('❌ Недостаточно кристаллов! Занимайтесь, чтобы заработать 💎');
    }
  };

  return (
    <div className="shop-overlay" onClick={onClose}>
      <div className="shop-modal animate-pop" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="shop-header">
          <div>
            <h3>💎 Магазин и Награды</h3>
            <p className="shop-sub">Используй кристаллы за обучение для полезных бонусов</p>
          </div>
          <div className="shop-gems-badge">
            <span>💎</span> <strong>{gems}</strong>
          </div>
          <button className="shop-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="shop-body">
          {/* Daily Chest Section */}
          <div className="daily-chest-card">
            <div className="chest-visual">
              <span className={`chest-emoji ${!chestOpened ? 'bouncing' : ''}`}>
                {chestOpened ? '📭' : '🎁'}
              </span>
            </div>
            <div className="chest-info">
              <h4>Ежедневный сундук сокровищ</h4>
              <p>
                {chestOpened
                  ? 'Вы уже забрали сегодняшнюю награду! Новый сундук откроется завтра.'
                  : 'Открой бесплатный сундук и забери +50 кристаллов и +40 XP!'}
              </p>
              <button
                className={`chest-action-btn ${chestOpened ? 'opened' : ''}`}
                onClick={handleOpenChest}
                disabled={chestOpened}
              >
                {chestOpened ? '✓ Награда забрана' : 'Открыть сундук! 🎉'}
              </button>
            </div>
          </div>

          {/* Shop Inventory Grid */}
          <h4 className="shop-section-title">🛒 Полезные предметы</h4>

          <div className="shop-items-grid">
            {/* Streak Freeze */}
            <div className="shop-item-card">
              <span className="item-icon">❄️</span>
              <div className="item-meta">
                <strong>Заморозка стрика</strong>
                <p>Спасает ваш ударный режим, если вы пропустите один день занятий.</p>
              </div>
              <div className="item-action">
                <span className="item-price">💎 80</span>
                <button
                  className={`item-buy-btn ${hasFreeze ? 'owned' : ''}`}
                  onClick={() => handleBuyItem('freeze', 80)}
                  disabled={hasFreeze}
                >
                  {hasFreeze ? 'Активно ✓' : 'Купить'}
                </button>
              </div>
            </div>

            {/* 2x XP Boost */}
            <div className="shop-item-card">
              <span className="item-icon">⚡</span>
              <div className="item-meta">
                <strong>Двойной опыт (2x XP)</strong>
                <p>Удваивает весь опыт за карточки, уроки и квизы на целый день.</p>
              </div>
              <div className="item-action">
                <span className="item-price">💎 120</span>
                <button
                  className={`item-buy-btn ${hasXpBoost ? 'owned' : ''}`}
                  onClick={() => handleBuyItem('boost', 120)}
                  disabled={hasXpBoost}
                >
                  {hasXpBoost ? 'Активно ✓' : 'Купить'}
                </button>
              </div>
            </div>

            {/* Gold Mascot */}
            <div className="shop-item-card">
              <span className="item-icon">👑</span>
              <div className="item-meta">
                <strong>Золотой маскот Linguo</strong>
                <p>Эксклюзивный золотой бейдж профиля и особое сияние аватара.</p>
              </div>
              <div className="item-action">
                <span className="item-price">💎 250</span>
                <button
                  className={`item-buy-btn ${hasGoldTheme ? 'owned' : ''}`}
                  onClick={() => handleBuyItem('gold', 250)}
                  disabled={hasGoldTheme}
                >
                  {hasGoldTheme ? 'Куплено ✓' : 'Купить'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Toast notification */}
        {toastMsg && (
          <div className="shop-toast animate-pop">
            {toastMsg}
          </div>
        )}
      </div>
    </div>
  );
}
