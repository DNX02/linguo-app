import React from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';

import Home from './pages/Home';
import Flashcards from './pages/Flashcards';
import Quiz from './pages/Quiz';
import Grammar from './pages/Grammar';
import Progress from './pages/Progress';
import Settings from './pages/Settings';

const navItems = [
  { path: '/', label: 'Главная', icon: '🏠' },
  { path: '/flashcards', label: 'Карточки', icon: '📚' },
  { path: '/quiz', label: 'Тест', icon: '❓' },
  { path: '/grammar', label: 'Грамматика', icon: '✏️' },
  { path: '/progress', label: 'Прогресс', icon: '📊' },
];

export default function App() {
  const location = useLocation();

  return (
    <div className="app">
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

      <nav className="bottom-nav">
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
      </nav>
    </div>
  );
}
