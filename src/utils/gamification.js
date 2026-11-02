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
};
