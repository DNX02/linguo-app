import React, { Suspense, lazy } from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const Flashcards = lazy(() => import('./pages/Flashcards'));
const Quiz = lazy(() => import('./pages/Quiz'));
const Grammar = lazy(() => import('./pages/Grammar'));
const Progress = lazy(() => import('./pages/Progress'));
const Settings = lazy(() => import('./pages/Settings'));

const navItems = [
  { path: '/', label: 'Главная', icon: '🏠' },
  { path: '/flashcards', label: 'Карточки', icon: '📚' },
  { path: '/quiz', label: 'Тест', icon: '❓' },
  { path: '/grammar', label: 'Грамматика', icon: '✏️' },
  { path: '/progress', label: 'Прогресс', icon: '📊' },
];

function LoadingSpinner() {
  return (
    <div className="loading-container">
      <div className="loading-spinner" />
      <p className="loading-text">Загрузка...</p>
    </div>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <div className="app">
      <main className="main-content">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/flashcards" element={<Flashcards />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/grammar" element={<Grammar />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Suspense>
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
