import { openDB } from 'idb';
import { words as initialWords } from './data/words.js';

const DB_NAME = 'linguo-db';
const DB_VERSION = 1;

/**
 * Open (or create) the Linguo IndexedDB database.
 * Returns a promise that resolves to the database instance.
 */
export async function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Cards store – flashcard vocabulary with spaced repetition data
      if (!db.objectStoreNames.contains('cards')) {
        const cardStore = db.createObjectStore('cards', { keyPath: 'id' });
        cardStore.createIndex('language', 'language', { unique: false });
        cardStore.createIndex('level', 'level', { unique: false });
        cardStore.createIndex('category', 'category', { unique: false });
        cardStore.createIndex('nextReview', 'nextReview', { unique: false });
      }

      // Progress store – one record per date
      if (!db.objectStoreNames.contains('progress')) {
        db.createObjectStore('progress', { keyPath: 'date' });
      }

      // Settings store – key/value pairs
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }

      // Grammar exercises store
      if (!db.objectStoreNames.contains('grammarExercises')) {
        const grammarStore = db.createObjectStore('grammarExercises', { keyPath: 'id' });
        grammarStore.createIndex('language', 'language', { unique: false });
        grammarStore.createIndex('level', 'level', { unique: false });
      }
    },
  });
}

/**
 * Ensures the database contains the core vocabulary dataset.
 * Removes obsolete languages (anything other than 'en' and 'de')
 * and seeds newly added words.
 */
async function seedDefaultCards(db) {
  try {
    const allExisting = await db.getAll('cards');
    const existingMap = new Map();
    const obsoleteIds = [];

    for (const card of allExisting) {
      if (card.language !== 'en' && card.language !== 'de') {
        obsoleteIds.push(card.id);
      } else {
        existingMap.set(card.id, card);
      }
    }

    const tx = db.transaction('cards', 'readwrite');
    // Delete any non-English/non-German cards
    for (const obsId of obsoleteIds) {
      tx.store.delete(obsId);
    }

    // Seed missing cards from initialWords
    if (initialWords && initialWords.length > 0) {
      const now = new Date().toISOString();
      for (const w of initialWords) {
        if (!existingMap.has(w.id)) {
          tx.store.put({
            ...w,
            interval: 1,
            repetitions: 0,
            easeFactor: 2.5,
            nextReview: now,
          });
        }
      }
    }
    await tx.done;
  } catch (e) {
    console.warn('Auto-seed cards notice:', e);
  }
}

/**
 * Get all cards, optionally filtered by language and level.
 */
export async function getAllCards(language, level) {
  try {
    const db = await getDB();
    await seedDefaultCards(db);
    let cards;

    if (language) {
      cards = await db.getAllFromIndex('cards', 'language', language);
    } else {
      cards = await db.getAll('cards');
    }

    if (!cards || cards.length === 0) {
      cards = [...initialWords];
    }

    if (level) {
      cards = cards.filter((card) => card.level === level);
    }

    return cards || [];
  } catch (err) {
    console.error('getAllCards error:', err);
    let fallback = [...initialWords];
    if (language) fallback = fallback.filter((w) => w.language === language);
    if (level) fallback = fallback.filter((w) => w.level === level);
    return fallback;
  }
}

/**
 * Get cards that are due for review (nextReview <= now) for a given language.
 */
export async function getCardsForReview(language) {
  try {
    const db = await getDB();
    await seedDefaultCards(db);
    const now = new Date();
    let cards;

    if (language) {
      cards = await db.getAllFromIndex('cards', 'language', language);
    } else {
      cards = await db.getAll('cards');
    }

    if (!cards || cards.length === 0) {
      cards = [...initialWords];
    }

    const dueCards = (cards || []).filter((card) => {
      if (!card.nextReview) return true; // never reviewed = due
      return new Date(card.nextReview) <= now;
    });

    return dueCards.length > 0 ? dueCards : cards.slice(0, 20);
  } catch (err) {
    console.error('getCardsForReview error:', err);
    return initialWords.slice(0, 20);
  }
}

/**
 * Update a card's data (including spaced repetition fields).
 */
export async function updateCard(card) {
  try {
    const db = await getDB();
    return await db.put('cards', card);
  } catch (err) {
    console.error('updateCard error:', err);
  }
}

/**
 * Add a new card to the database.
 */
export async function addCard(card) {
  try {
    const db = await getDB();
    return await db.add('cards', card);
  } catch (err) {
    console.error('addCard error:', err);
  }
}

/**
 * Get the daily progress record for a specific date (defaults to today).
 * @param {string} [date] – ISO date string (YYYY-MM-DD)
 */
export async function getDailyProgress(date) {
  const targetDate = date || new Date().toISOString().split('T')[0];
  try {
    const db = await getDB();
    const record = await db.get('progress', targetDate);
    return (
      record || {
        date: targetDate,
        correct: 0,
        wrong: 0,
        reviewed: 0,
        grammarDone: 0,
      }
    );
  } catch (err) {
    console.error('getDailyProgress error:', err);
    return {
      date: targetDate,
      correct: 0,
      wrong: 0,
      reviewed: 0,
      grammarDone: 0,
    };
  }
}

/**
 * Save (or update) a daily progress record.
 * @param {object} progress – must include { date: "YYYY-MM-DD", ... }
 */
export async function saveDailyProgress(progress) {
  try {
    const db = await getDB();
    const safeProgress = {
      date: progress?.date || new Date().toISOString().split('T')[0],
      correct: progress?.correct || 0,
      wrong: progress?.wrong || 0,
      reviewed: progress?.reviewed || 0,
      grammarDone: progress?.grammarDone || 0,
      ...progress,
    };
    return await db.put('progress', safeProgress);
  } catch (err) {
    console.error('saveDailyProgress error:', err);
  }
}

/**
 * Get all settings as an object { [key]: value }.
 */
export async function getSettings() {
  try {
    const db = await getDB();
    const items = await db.getAll('settings');
    const settingsObj = {};
    if (Array.isArray(items)) {
      for (const item of items) {
        if (item && item.key) {
          settingsObj[item.key] = item.value;
        }
      }
    }
    return settingsObj;
  } catch (err) {
    console.error('getSettings error:', err);
    return {};
  }
}

/**
 * Save a single setting.
 * @param {string} key
 * @param {*} value
 */
export async function saveSetting(key, value) {
  try {
    const db = await getDB();
    return await db.put('settings', { key, value });
  } catch (err) {
    console.error('saveSetting error:', err);
  }
}
