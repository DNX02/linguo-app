import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const USERS_FILE = path.join(DATA_DIR, 'users.json');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');
const CUSTOM_WORDS_FILE = path.join(DATA_DIR, 'custom-words.json');
const PROGRESS_FILE = path.join(DATA_DIR, 'progress.json');

function readJSON(file, defaultVal) {
  try {
    if (!fs.existsSync(file)) return defaultVal;
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    console.error(`Error reading ${file}:`, e);
    return defaultVal;
  }
}

function writeJSON(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error(`Error writing ${file}:`, e);
  }
}

// Password hashing using Node native crypto pbkdf2
function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

function verifyPassword(password, hash, salt) {
  const verify = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return verify === hash;
}

export const serverDB = {
  // Users
  createUser({ username, password, name = '' }) {
    const users = readJSON(USERS_FILE, []);
    const normalizedUsername = username.trim().toLowerCase();
    
    if (users.find(u => u.username === normalizedUsername)) {
      throw new Error('Пользователь с таким логином уже существует');
    }

    const { hash, salt } = hashPassword(password);
    const newUser = {
      id: 'usr_' + crypto.randomUUID().slice(0, 8),
      username: normalizedUsername,
      name: name.trim() || normalizedUsername,
      hash,
      salt,
      createdAt: new Date().toISOString(),
      level: 'A1',
      targetLanguage: 'en',
    };

    users.push(newUser);
    writeJSON(USERS_FILE, users);

    const { hash: _, salt: __, ...safeUser } = newUser;
    return safeUser;
  },

  authenticateUser(username, password) {
    const users = readJSON(USERS_FILE, []);
    const normalizedUsername = username.trim().toLowerCase();
    const user = users.find(u => u.username === normalizedUsername);
    if (!user) {
      throw new Error('Неверный логин или пароль');
    }

    if (!verifyPassword(password, user.hash, user.salt)) {
      throw new Error('Неверный логин или пароль');
    }

    const { hash: _, salt: __, ...safeUser } = user;
    return safeUser;
  },

  getUserById(id) {
    const users = readJSON(USERS_FILE, []);
    const user = users.find(u => u.id === id);
    if (!user) return null;
    const { hash: _, salt: __, ...safeUser } = user;
    return safeUser;
  },

  // Sessions
  createSession(userId) {
    const sessions = readJSON(SESSIONS_FILE, {});
    const token = crypto.randomBytes(32).toString('hex');
    sessions[token] = {
      userId,
      createdAt: Date.now(),
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
    };
    writeJSON(SESSIONS_FILE, sessions);
    return token;
  },

  getSession(token) {
    if (!token) return null;
    const sessions = readJSON(SESSIONS_FILE, {});
    const session = sessions[token];
    if (!session) return null;
    if (Date.now() > session.expiresAt) {
      delete sessions[token];
      writeJSON(SESSIONS_FILE, sessions);
      return null;
    }
    return session;
  },

  deleteSession(token) {
    const sessions = readJSON(SESSIONS_FILE, {});
    delete sessions[token];
    writeJSON(SESSIONS_FILE, sessions);
  },

  // Custom Words
  getCustomWords(userId = null) {
    const words = readJSON(CUSTOM_WORDS_FILE, []);
    if (!userId) return words;
    return words.filter(w => !w.userId || w.userId === userId);
  },

  addCustomWord(wordData) {
    const words = readJSON(CUSTOM_WORDS_FILE, []);
    const newWord = {
      id: 'custom_' + crypto.randomUUID().slice(0, 8),
      word: wordData.word.trim(),
      translation: wordData.translation.trim(),
      language: wordData.language || 'en',
      level: wordData.level || 'A1',
      category: wordData.category || 'Пользовательские',
      example: wordData.example || '',
      exampleTranslation: wordData.exampleTranslation || '',
      userId: wordData.userId || null,
      createdAt: new Date().toISOString()
    };
    words.push(newWord);
    writeJSON(CUSTOM_WORDS_FILE, words);
    return newWord;
  },

  deleteCustomWord(wordId, userId = null) {
    let words = readJSON(CUSTOM_WORDS_FILE, []);
    const beforeCount = words.length;
    words = words.filter(w => {
      if (w.id !== wordId) return true;
      if (userId && w.userId && w.userId !== userId) return true; // not allowed
      return false;
    });
    writeJSON(CUSTOM_WORDS_FILE, words);
    return words.length < beforeCount;
  },

  // User Progress Sync
  getUserProgress(userId) {
    const allProgress = readJSON(PROGRESS_FILE, {});
    return allProgress[userId] || { cards: {}, daily: {}, streak: 0, lastActive: null };
  },

  saveUserProgress(userId, progressData) {
    const allProgress = readJSON(PROGRESS_FILE, {});
    const current = allProgress[userId] || { cards: {}, daily: {}, streak: 0, lastActive: null };

    // Merge cards reviews
    const mergedCards = {
      ...current.cards,
      ...(progressData.cards || {})
    };

    // Merge daily progress
    const mergedDaily = {
      ...current.daily,
      ...(progressData.daily || {})
    };

    allProgress[userId] = {
      cards: mergedCards,
      daily: mergedDaily,
      streak: progressData.streak !== undefined ? progressData.streak : current.streak,
      lastActive: new Date().toISOString()
    };

    writeJSON(PROGRESS_FILE, allProgress);
    return allProgress[userId];
  }
};
