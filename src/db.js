import { openDB } from 'idb';

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
 * Get all cards, optionally filtered by language and level.
 */
export async function getAllCards(language, level) {
  const db = await getDB();
  let cards;

  if (language) {
    cards = await db.getAllFromIndex('cards', 'language', language);
  } else {
    cards = await db.getAll('cards');
  }

  if (level) {
    cards = cards.filter((card) => card.level === level);
  }

  return cards;
}

/**
 * Get cards that are due for review (nextReview <= now) for a given language.
 */
export async function getCardsForReview(language) {
  const db = await getDB();
  const now = new Date();
  let cards;

  if (language) {
    cards = await db.getAllFromIndex('cards', 'language', language);
  } else {
    cards = await db.getAll('cards');
  }

  return cards.filter((card) => {
    if (!card.nextReview) return true; // never reviewed = due
    return new Date(card.nextReview) <= now;
  });
}

/**
 * Update a card's data (including spaced repetition fields).
 */
export async function updateCard(card) {
  const db = await getDB();
  return db.put('cards', card);
}

/**
 * Add a new card to the database.
 */
export async function addCard(card) {
  const db = await getDB();
  return db.add('cards', card);
}

/**
 * Get the daily progress record for a specific date.
 * @param {string} date – ISO date string (YYYY-MM-DD)
 */
export async function getDailyProgress(date) {
  const db = await getDB();
  return db.get('progress', date);
}

/**
 * Save (or update) a daily progress record.
 * @param {object} progress – must include { date: "YYYY-MM-DD", ... }
 */
export async function saveDailyProgress(progress) {
  const db = await getDB();
  return db.put('progress', progress);
}

/**
 * Get all settings as an array of { key, value } objects.
 */
export async function getSettings() {
  const db = await getDB();
  return db.getAll('settings');
}

/**
 * Save a single setting.
 * @param {string} key
 * @param {*} value
 */
export async function saveSetting(key, value) {
  const db = await getDB();
  return db.put('settings', { key, value });
}
