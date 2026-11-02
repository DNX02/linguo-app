import React, { useState, useEffect } from 'react';
import { gamification, MASCOT_SKINS } from '../utils/gamification';
import { sounds } from '../utils/sounds';
import { haptics } from '../utils/haptics';
import './MascotWardrobeModal.css';

export default function MascotWardrobeModal({ isOpen, onClose, onSkinChange }) {
  const [activeTab, setActiveTab] = useState('skins'); // 'skins' | 'quests'
  const [currentSkin, setCurrentSkin] = useState(() => gamification.getMascotSkin());
  const [unlockedSkins, setUnlockedSkins] = useState(() => gamification.getUnlockedSkins());
  const [gems, setGems] = useState(() => gamification.getGems());
  const [quests, setQuests] = useState(() => gamification.getDailyQuests());

  useEffect(() => {
    if (isOpen) {
      setCurrentSkin(gamification.getMascotSkin());
      setUnlockedSkins(gamification.getUnlockedSkins());
      setGems(gamification.getGems());
      setQuests(gamification.getDailyQuests());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectSkin = (skin) => {
    const isUnlocked = unlockedSkins.includes(skin.id);

    if (isUnlocked) {
      gamification.setMascotSkin(skin.id);
      setCurrentSkin(skin.id);
      onSkinChange?.(skin.id);
      sounds.playTap?.();
      haptics.light();
    } else {
      if (gems < skin.cost) {
        sounds.playWrong?.();
        haptics.error();
        alert(`Недостаточно кристаллов! Нужно: ${skin.cost} 💎 (у вас: ${gems} 💎)`);
        return;
      }

      const success = gamification.unlockSkin(skin.id, skin.cost);
      if (success) {
        setUnlockedSkins(gamification.getUnlockedSkins());
        setCurrentSkin(skin.id);
        setGems(gamification.getGems());
        onSkinChange?.(skin.id);
        sounds.playComplete?.();
        haptics.celebrate();
      }
    }
  };

  const handleClaimQuest = (questId) => {
    const reward = gamification.claimQuest(questId);
    if (reward) {
      setQuests(gamification.getDailyQuests());
      setGems(gamification.getGems());
      sounds.playComplete?.();
      haptics.celebrate();
      alert(`🎉 Награда получена: +${reward.xp} XP и +${reward.gems} 💎!`);
    }
  };

  const activeSkinData = MASCOT_SKINS.find((s) => s.id === currentSkin) || MASCOT_SKINS[0];

  return (
    <div className="wardrobe-modal-overlay" onClick={onClose}>
      <div className="wardrobe-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="wardrobe-modal-header">
          <div className="wardrobe-header-title">
            <span className="wardrobe-sparkle">🦉</span>
            <div>
              <h3>Гардероб и Зал Славы Linguo</h3>
              <p>Костюмы совы, достижения и ежедневные квесты</p>
            </div>
          </div>
          <button className="wardrobe-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Currency & Tabs Strip */}
        <div className="wardrobe-top-strip">
          <div className="wardrobe-tabs-pill">
            <button
              className={`wt-btn ${activeTab === 'skins' ? 'active' : ''}`}
              onClick={() => setActiveTab('skins')}
            >
              🎭 Скины совы
            </button>
            <button
              className={`wt-btn ${activeTab === 'quests' ? 'active' : ''}`}
              onClick={() => setActiveTab('quests')}
            >
              🎯 Квесты дня
            </button>
          </div>

          <div className="wardrobe-gems-badge">
            <span>💎</span>
            <strong>{gems}</strong>
          </div>
        </div>

        {/* Modal Body */}
        <div className="wardrobe-modal-body">
          {activeTab === 'skins' ? (
            <div className="wardrobe-skins-view animate-pop">
              {/* Featured Mascot Spotlight */}
              <div className="mascot-spotlight-card">
                <div className="mascot-avatar-stage">
                  <span className="mascot-giant-emoji animate-bounce">{activeSkinData.emoji}</span>
                  <div className="mascot-aura-ring" />
                </div>
                <h3>{activeSkinData.name}</h3>
                <p className="mascot-tagline">{activeSkinData.desc}</p>
                <div className="mascot-active-pill">✓ Надет сейчас</div>
              </div>

              {/* Skins Collection Grid */}
              <div className="skins-collection-grid">
                {MASCOT_SKINS.map((s) => {
                  const isUnlocked = unlockedSkins.includes(s.id);
                  const isEquipped = currentSkin === s.id;

                  return (
                    <div
                      key={s.id}
                      className={`skin-card ${isEquipped ? 'equipped' : ''} ${isUnlocked ? 'unlocked' : 'locked'}`}
                      onClick={() => handleSelectSkin(s)}
                    >
                      <div className="skin-emoji-box">
                        <span>{s.emoji}</span>
                        {isEquipped && <span className="equipped-badge">✓</span>}
                      </div>
                      <div className="skin-info">
                        <strong>{s.name}</strong>
                        <small>{s.desc}</small>
                      </div>
                      <div className="skin-action-area">
                        {isEquipped ? (
                          <span className="skin-status-tag active">Выбран</span>
                        ) : isUnlocked ? (
                          <button className="skin-equip-btn">Надеть</button>
                        ) : (
                          <button className="skin-buy-btn">
                            💎 {s.cost}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="wardrobe-quests-view animate-pop">
              <div className="quests-hero-card">
                <span className="qh-icon">⚡</span>
                <div>
                  <h4>Ежедневные испытания</h4>
                  <p>Обновляются каждые 24 часа. Выполняйте задания для кристаллов и опыта!</p>
                </div>
              </div>

              <div className="quests-stack">
                {quests.map((q) => {
                  const isReady = q.progress >= q.target && !q.claimed;
                  const percent = Math.min(100, Math.round((q.progress / q.target) * 100));

                  return (
                    <div key={q.id} className={`quest-item-card ${q.claimed ? 'claimed' : ''}`}>
                      <div className="quest-meta-col">
                        <strong>{q.title}</strong>
                        <p>{q.desc}</p>
                        <div className="quest-progress-track">
                          <div className="quest-progress-bar" style={{ width: `${percent}%` }} />
                        </div>
                        <span className="quest-count-lbl">{q.progress} / {q.target}</span>
                      </div>

                      <div className="quest-rewards-col">
                        <div className="quest-rewards-pills">
                          <span>+{q.rewardXP} XP</span>
                          <span>💎 +{q.rewardGems}</span>
                        </div>

                        {q.claimed ? (
                          <span className="quest-claimed-lbl">✓ Получено</span>
                        ) : (
                          <button
                            className={`quest-claim-btn ${isReady ? 'ready' : ''}`}
                            disabled={!isReady}
                            onClick={() => handleClaimQuest(q.id)}
                          >
                            {isReady ? 'Забрать 🎁' : `${percent}%`}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
