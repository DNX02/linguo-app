import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { serverDB } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

const app = express();
const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || '0.0.0.0';

app.use(cors());
app.use(express.json());

// Auth middleware
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Требуется авторизация' });
  }

  const token = authHeader.split(' ')[1];
  const session = serverDB.getSession(token);
  if (!session) {
    return res.status(401).json({ error: 'Сессия истекла или недействительна' });
  }

  const user = serverDB.getUserById(session.userId);
  if (!user) {
    return res.status(401).json({ error: 'Пользователь не найден' });
  }

  req.user = user;
  req.token = token;
  next();
}

// Optional Auth (for public + personalized)
function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const session = serverDB.getSession(token);
    if (session) {
      req.user = serverDB.getUserById(session.userId);
      req.token = token;
    }
  }
  next();
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', server: 'Linguo API', timestamp: new Date().toISOString() });
});

// Auth Routes
app.post('/api/auth/register', (req, res) => {
  try {
    const { username, password, name } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Имя пользователя и пароль обязательны' });
    }
    if (username.length < 3) {
      return res.status(400).json({ error: 'Логин должен быть не короче 3 символов' });
    }
    if (password.length < 4) {
      return res.status(400).json({ error: 'Пароль должен быть не менее 4 символов' });
    }

    const user = serverDB.createUser({ username, password, name });
    const token = serverDB.createSession(user.id);
    res.json({ user, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Введите логин и пароль' });
    }

    const user = serverDB.authenticateUser(username, password);
    const token = serverDB.createSession(user.id);
    res.json({ user, token });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

app.post('/api/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    serverDB.deleteSession(token);
  }
  res.json({ success: true });
});

// Custom Words API
app.get('/api/words/custom', optionalAuth, (req, res) => {
  const userId = req.user ? req.user.id : null;
  const words = serverDB.getCustomWords(userId);
  res.json(words);
});

app.post('/api/words/custom', requireAuth, (req, res) => {
  try {
    const { word, translation, language, level, category, example, exampleTranslation } = req.body;
    if (!word || !translation) {
      return res.status(400).json({ error: 'Слово и перевод обязательны' });
    }

    const newWord = serverDB.addCustomWord({
      word,
      translation,
      language: language || 'en',
      level: level || 'A1',
      category: category || 'Мои слова',
      example: example || '',
      exampleTranslation: exampleTranslation || '',
      userId: req.user.id,
    });

    res.json(newWord);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/words/custom/:id', requireAuth, (req, res) => {
  const success = serverDB.deleteCustomWord(req.params.id, req.user.id);
  res.json({ success });
});

// Progress Sync API
app.get('/api/progress', requireAuth, (req, res) => {
  const progress = serverDB.getUserProgress(req.user.id);
  res.json(progress);
});

app.post('/api/progress/sync', requireAuth, (req, res) => {
  try {
    const updated = serverDB.saveUserProgress(req.user.id, req.body);
    res.json({ success: true, progress: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve static frontend files
app.use(express.static(DIST_DIR));

// Fallback to index.html for SPA routing
app.use((req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`Linguo Full-Stack Web Server running at http://${HOST}:${PORT}`);
});
