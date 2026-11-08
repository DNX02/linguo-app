import React, { useState, useEffect } from 'react';
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
  const [hasModalOpen, setHasModalOpen] = useState(false);

  const isSettings = location.pathname === '/settings';

  // Monitor DOM for active modals so bottom nav automatically hides and never overlaps modal options
  useEffect(() => {
    const modalSelector =
      '.boss-modal-backdrop, .tutor-modal-overlay, .duo-lesson-overlay, .blitz-overlay, .iv-overlay, [class*="-overlay"], [class*="-backdrop"]';

    const checkModal = () => {
      const active = !!document.querySelector(modalSelector);
      setHasModalOpen(active);
      document.body.classList.toggle('modal-open', active);
    };

    checkModal();
    const observer = new MutationObserver(checkModal);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      document.body.classList.remove('modal-open');
    };
  }, []);

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

      {/* Floating Island Bottom Navigation - hidden when any modal is open */}
      <nav className={`bottom-nav ${hasModalOpen ? 'bottom-nav--hidden' : ''}`} aria-hidden={hasModalOpen}>
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
