// Gamification, XP, Ranks and Mistake Tracking System

const XP_KEY = 'linguo_user_xp';
const MISTAKES_KEY = 'linguo_mistakes';
const STARRED_KEY = 'linguo_starred';

export const RANKS = [
  { level: 1, title: '🌱 Новичок', minXP: 0, maxXP: 100 },
  { level: 2, title: '📖 Ученик', minXP: 100, maxXP: 300 },
  { level: 3, title: '⚡ Знаток', minXP: 300, maxXP: 600 },
  { level: 4, title: '🔥 Продвинутый', minXP: 600, maxXP: 1200 },
  { level: 5, title: '💎 Эксперт', minXP: 1200, maxXP: 2500 },
  { level: 6, title: '👑 Полиглот', minXP: 2500, maxXP: 999999 },
];

export const MASCOT_SKINS = [
  { id: 'classic', name: 'Классический Linguo', emoji: '🦉', desc: 'Любимый зелёный маскот полиглотов', cost: 0 },
  { id: 'cyber', name: 'Киберпанк Нео-Сова', emoji: '🕶️', desc: 'Голографические очки и неоновый стиль', cost: 120 },
  { id: 'detective', name: 'Детектив Шерлок', emoji: '🕵️', desc: 'Расследует самые сложные грамматические тайны', cost: 180 },
  { id: 'harvard', name: 'Профессор Гарварда', emoji: '🎓', desc: 'Академическая мантия и строгий подход', cost: 240 },
  { id: 'emperor', name: 'Император Знаний', emoji: '👑', desc: 'Золотая корона для покорителей языков', cost: 350 },
  { id: 'nasa', name: 'Астронавт NASA', emoji: '🚀', desc: 'Готов покорять космические высоты английского', cost: 500 },
];

export const gamification = {
  getXP() {
    try {
      return parseInt(localStorage.getItem(XP_KEY) || '0', 10);
    } catch (_) {
      return 0;
    }
  },

  addXP(amount) {
    try {
      const current = this.getXP();
      const updated = current + amount;
      localStorage.setItem(XP_KEY, updated.toString());
      return { totalXP: updated, added: amount, rank: this.getRank(updated) };
    } catch (_) {
      return { totalXP: amount, added: amount, rank: this.getRank(amount) };
    }
  },

  getRank(xp = null) {
    const score = xp !== null ? xp : this.getXP();
    const rank = RANKS.find((r) => score >= r.minXP && score < r.maxXP) || RANKS[0];
    const nextRank = RANKS.find((r) => r.level === rank.level + 1) || null;
    const progressInLevel = nextRank
      ? Math.round(((score - rank.minXP) / (nextRank.minXP - rank.minXP)) * 100)
      : 100;

    return {
      ...rank,
      currentXP: score,
      progressInLevel: Math.min(100, Math.max(0, progressInLevel)),
      nextRankXP: nextRank ? nextRank.minXP : null,
    };
  },

  getProfile() {
    return {
      xp: this.getXP(),
      rank: this.getRank(),
      gems: this.getGems(),
      streak: this.getStreak(),
      mascotSkin: this.getMascotSkin(),
    };
  },

  // Mistakes Tracking (Слова с ошибками)
  getMistakes() {
    try {
      return JSON.parse(localStorage.getItem(MISTAKES_KEY) || '[]');
    } catch (_) {
      return [];
    }
  },

  addMistake(wordId) {
    try {
      const list = this.getMistakes();
      if (!list.includes(wordId)) {
        list.unshift(wordId);
        // keep up to 50 recent mistakes
        if (list.length > 50) list.pop();
        localStorage.setItem(MISTAKES_KEY, JSON.stringify(list));
      }
    } catch (_) {}
  },

  removeMistake(wordId) {
    try {
      const list = this.getMistakes().filter((id) => id !== wordId);
      localStorage.setItem(MISTAKES_KEY, JSON.stringify(list));
    } catch (_) {}
  },

  // Starred / Favorite Words (Избранное)
  getStarred() {
    try {
      return JSON.parse(localStorage.getItem(STARRED_KEY) || '[]');
    } catch (_) {
      return [];
    }
  },

  toggleStarred(wordId) {
    try {
      let list = this.getStarred();
      const exists = list.includes(wordId);
      if (exists) {
        list = list.filter((id) => id !== wordId);
      } else {
        list.unshift(wordId);
      }
      localStorage.setItem(STARRED_KEY, JSON.stringify(list));
      return !exists;
    } catch (_) {
      return false;
    }
  },

  isStarred(wordId) {
    return this.getStarred().includes(wordId);
  },

  // Gems & Crystals Currency
  getGems() {
    try {
      const val = localStorage.getItem('linguo_gems');
      return val !== null ? parseInt(val, 10) : 150;
    } catch (_) {
      return 150;
    }
  },

  addGems(amount) {
    try {
      const current = this.getGems();
      const updated = current + amount;
      localStorage.setItem('linguo_gems', updated.toString());
      return updated;
    } catch (_) {
      return amount;
    }
  },

  spendGems(amount) {
    const current = this.getGems();
    if (current >= amount) {
      const updated = current - amount;
      localStorage.setItem('linguo_gems', updated.toString());
      return true;
    }
    return false;
  },

  // Streak & Streak Freeze
  getStreak() {
    try {
      return parseInt(localStorage.getItem('linguo_streak') || '3', 10);
    } catch (_) {
      return 3;
    }
  },

  hasStreakFreeze() {
    try {
      return localStorage.getItem('linguo_streak_freeze') === 'true';
    } catch (_) {
      return false;
    }
  },

  setStreakFreeze(val) {
    try {
      localStorage.setItem('linguo_streak_freeze', val ? 'true' : 'false');
    } catch (_) {}
  },

  // Daily Treasure Chest
  isDailyChestOpened() {
    try {
      const today = new Date().toISOString().slice(0, 10);
      return localStorage.getItem('linguo_daily_chest') === today;
    } catch (_) {
      return false;
    }
  },

  openDailyChest() {
    const today = new Date().toISOString().slice(0, 10);
    localStorage.setItem('linguo_daily_chest', today);
    this.addGems(50);
    this.addXP(40);
    return { gems: 50, xp: 40 };
  },

  // Weekly XP for Leaderboards
  getWeeklyXP() {
    const totalXP = this.getXP();
    return Math.max(120, Math.round(totalXP * 0.45));
  },

  // Mascot Skins System
  getMascotSkin() {
    try {
      return localStorage.getItem('linguo_mascot_skin') || 'classic';
    } catch (_) {
      return 'classic';
    }
  },

  setMascotSkin(skinId) {
    try {
      localStorage.setItem('linguo_mascot_skin', skinId);
      return skinId;
    } catch (_) {
      return 'classic';
    }
  },

  getUnlockedSkins() {
    try {
      return JSON.parse(localStorage.getItem('linguo_unlocked_skins') || '["classic"]');
    } catch (_) {
      return ['classic'];
    }
  },

  unlockSkin(skinId, cost = 0) {
    if (cost > 0 && !this.spendGems(cost)) {
      return false;
    }
    try {
      const unlocked = this.getUnlockedSkins();
      if (!unlocked.includes(skinId)) {
        unlocked.push(skinId);
        localStorage.setItem('linguo_unlocked_skins', JSON.stringify(unlocked));
      }
      this.setMascotSkin(skinId);
      return true;
    } catch (_) {
      return false;
    }
  },

  // CEFR Certificate System
  getCertificate() {
    try {
      const data = localStorage.getItem('linguo_cefr_cert');
      return data ? JSON.parse(data) : null;
    } catch (_) {
      return null;
    }
  },

  saveCertificate(certData) {
    try {
      localStorage.setItem('linguo_cefr_cert', JSON.stringify(certData));
      return certData;
    } catch (_) {
      return certData;
    }
  },

  // Daily Quests System
  getDailyQuests() {
    const today = new Date().toISOString().slice(0, 10);
    const storedDate = localStorage.getItem('linguo_quests_date');
    if (storedDate !== today) {
      const freshQuests = [
        { id: 'q1', title: 'Ударный темп', desc: 'Наберите 60 XP за день', target: 60, progress: 0, rewardXP: 30, rewardGems: 15, claimed: false },
        { id: 'q2', title: 'Живой разговор', desc: 'Поговорите с репетитором Emma', target: 1, progress: 0, rewardXP: 40, rewardGems: 20, claimed: false },
        { id: 'q3', title: 'Гроза дуэлей', desc: 'Сыграйте 1 спид-батл слов', target: 1, progress: 0, rewardXP: 35, rewardGems: 20, claimed: false },
      ];
      localStorage.setItem('linguo_quests_date', today);
      localStorage.setItem('linguo_quests_data', JSON.stringify(freshQuests));
      return freshQuests;
    }
    try {
      return JSON.parse(localStorage.getItem('linguo_quests_data') || '[]');
    } catch (_) {
      return [];
    }
  },

  updateQuestProgress(questId, amount = 1) {
    try {
      const quests = this.getDailyQuests();
      const updated = quests.map((q) => {
        if (q.id === questId && !q.claimed) {
          return { ...q, progress: Math.min(q.target, q.progress + amount) };
        }
        return q;
      });
      localStorage.setItem('linguo_quests_data', JSON.stringify(updated));
      return updated;
    } catch (_) {
      return [];
    }
  },

  claimQuest(questId) {
    try {
      const quests = this.getDailyQuests();
      let rewards = null;
      const updated = quests.map((q) => {
        if (q.id === questId && q.progress >= q.target && !q.claimed) {
          rewards = { xp: q.rewardXP, gems: q.rewardGems };
          this.addXP(q.rewardXP);
          this.addGems(q.rewardGems);
          return { ...q, claimed: true };
        }
        return q;
      });
      localStorage.setItem('linguo_quests_data', JSON.stringify(updated));
      return rewards;
    } catch (_) {
      return null;
    }
  },
};

export default gamification;
