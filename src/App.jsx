import React from 'react';
import { Routes, Route, NavLink, useLocation, useNavigate } from 'react-router-dom';

import Home from './pages/Home';
import Flashcards from './pages/Flashcards';
import Quiz from './pages/Quiz';
import Grammar from './pages/Grammar';
import Progress from './pages/Progress';
import Settings from './pages/Settings';

const navItems = [
  { path: '/', label: 'Главная', icon: '🏠' },
  { path: '/flashcards', label: 'Карточки', icon: '📚' },
  { path: '/quiz', label: 'Тест', icon: '🎯' },
  { path: '/grammar', label: 'Правила', icon: '✏️' },
  { path: '/progress', label: 'Прогресс', icon: '📊' },
];

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const isSettings = location.pathname === '/settings';

  return (
    <div className="app">
      {/* Sleek Top Navigation Header */}
      <header className="app-top-bar">
        <div className="app-brand" onClick={() => navigate('/')}>
          <div className="app-brand-logo">
            <span className="app-logo-emoji">🦉</span>
          </div>
          <div className="app-brand-text">
            <span className="app-name">Linguo</span>
            <span className="app-badge">PRO</span>
          </div>
        </div>

        <div className="app-top-actions">
          <button
            className={`app-settings-btn ${isSettings ? 'active' : ''}`}
            onClick={() => navigate('/settings')}
            title="Настройки приложения"
          >
            ⚙️
          </button>
        </div>
      </header>

      <main className="main-content">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/grammar" element={<Grammar />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>

      {/* Floating Island Bottom Navigation */}
      <nav className="bottom-nav">
        <div className="bottom-nav-inner">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'nav-item--active' : ''}`
              }
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
