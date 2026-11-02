import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCards, getDailyProgress } from '../db';
import { gamification } from '../utils/gamification';
import ShareAchievementModal from '../components/ShareAchievementModal';
import './Progress.css';

const DAYS_OF_WEEK = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

function getActivityColor(count) {
  if (count === 0) return '#1e293b';
  if (count < 5) return '#6d28d933';
  if (count < 15) return '#6d28d966';
  if (count < 30) return '#8b5cf699';
  return '#8b5cf6';
}

export default function Progress() {
  const navigate = useNavigate();
  const [totalWords, setTotalWords] = useState(0);
  const [learnedWords, setLearnedWords] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(1);
  const [bestStreak, setBestStreak] = useState(1);
  const [accuracy, setAccuracy] = useState(100);
  const [todayStats, setTodayStats] = useState({ correct: 0, wrong: 0, reviewed: 0, grammarDone: 0 });
  const [weekActivity, setWeekActivity] = useState([]);
  const [langBreakdown, setLangBreakdown] = useState({ en: 0, de: 0 });
  const [levelDist, setLevelDist] = useState({});
  const [rank, setRank] = useState(gamification.getRank());
  const [mistakesCount, setMistakesCount] = useState(0);
  const [starredCount, setStarredCount] = useState(0);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const allCards = await getAllCards();
        setTotalWords(allCards.length);

        const learned = allCards.filter((c) => c.repetitions && c.repetitions >= 1);
        setLearnedWords(learned.length);

        setRank(gamification.getRank());
        setMistakesCount(gamification.getMistakes().length);
        setStarredCount(gamification.getStarred().length);

        // Language breakdown
        const enCount = learned.filter((c) => c.language === 'en').length;
        const deCount = learned.filter((c) => c.language === 'de').length;
        setLangBreakdown({ en: enCount, de: deCount });

        // Level distribution
        const levels = {};
        learned.forEach((c) => {
          const lvl = c.level || 'A1';
          levels[lvl] = (levels[lvl] || 0) + 1;
        });
        setLevelDist(levels);

        // Today's progress
        const today = await getDailyProgress();
        if (today) {
          setTodayStats({
            correct: today.correct || 0,
            wrong: today.wrong || 0,
            reviewed: today.reviewed || 0,
            grammarDone: today.grammarDone || 0,
          });
          const total = (today.correct || 0) + (today.wrong || 0);
          setAccuracy(total > 0 ? Math.round(((today.correct || 0) / total) * 100) : 100);
        }

        // Weekly activity (last 7 days)
        const weekData = [];
        const now = new Date();
        for (let i = 6; i >= 0; i--) {
          const d = new Date(now);
          d.setDate(d.getDate() - i);
          const dateStr = d.toISOString().split('T')[0];
          const dayProgress = await getDailyProgress(dateStr);
          const count = dayProgress ? ((dayProgress.correct || 0) + (dayProgress.wrong || 0) + (dayProgress.reviewed || 0)) : 0;
          const dayOfWeek = d.getDay();
          const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
          weekData.push({
            day: DAYS_OF_WEEK[adjustedDay],
            date: dateStr,
            count,
            isToday: i === 0,
          });
        }
        setWeekActivity(weekData);

        // Streaks (last 30 days check)
        let current = 0;
        let best = 0;
        let tempStreak = 0;
        for (let i = 0; i < 30; i++) {
          const d = new Date(now);
          d.setDate(d.getDate() - i);
          const dateStr = d.toISOString().split('T')[0];
          const dayProg = await getDailyProgress(dateStr);
          if (dayProg && ((dayProg.correct || 0) + (dayProg.wrong || 0) + (dayProg.reviewed || 0)) > 0) {
            tempStreak++;
            if (i === 0 || (i > 0 && tempStreak > 0)) {
              current = i === 0 ? tempStreak : current;
            }
          } else if (i > 0) {
            if (tempStreak > best) best = tempStreak;
            if (i <= current + 1) current = tempStreak;
            tempStreak = 0;
          }
        }
        if (tempStreak > best) best = tempStreak;
        setCurrentStreak(Math.max(1, current || tempStreak));
        setBestStreak(Math.max(1, best, current, tempStreak));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="progress-loading">
        <div className="progress-loading-spinner" />
        <p>Загрузка статистики...</p>
      </div>
    );
  }

  const maxLevelCount = Math.max(...Object.values(levelDist), 1);

  return (
    <div className="progress-page">
      <header className="progress-header">
        <button className="progress-back" onClick={() => navigate('/')}>
          ← Назад
        </button>
        <h2>📊 Прогресс</h2>
        <button className="progress-share-btn" onClick={() => setIsShareOpen(true)}>
          🏆 Поделиться
        </button>
      </header>

      {/* Gamification Rank Card */}
      <section className="progress-rank-card">
        <div className="progress-rank-header">
          <div>
            <span className="progress-rank-title">{rank.title}</span>
            <span className="progress-rank-lvl">Уровень {rank.level}</span>
          </div>
          <div className="progress-xp-val">{rank.currentXP} XP</div>
        </div>
        <div className="progress-xp-bar-bg">
          <div
            className="progress-xp-bar-fill"
            style={{ width: `${rank.progressInLevel}%` }}
          />
        </div>
        <span className="progress-xp-hint">
          {rank.nextRankXP
            ? `Осталось ${rank.nextRankXP - rank.currentXP} XP до следующего звания`
            : 'Высший ранг полиглота! 👑'}
        </span>
      </section>

      {/* Today section */}
      <section className="progress-today">
        <h3>Сегодня</h3>
        <div className="progress-today-grid">
          <div className="progress-today-item">
            <span className="progress-today-val">{todayStats.reviewed}</span>
            <span className="progress-today-label">Повторено</span>
          </div>
          <div className="progress-today-item">
            <span className="progress-today-val progress-val-green">{todayStats.correct}</span>
            <span className="progress-today-label">Верно</span>
          </div>
          <div className="progress-today-item">
            <span className="progress-today-val progress-val-red">{todayStats.wrong}</span>
            <span className="progress-today-label">Ошибки</span>
          </div>
          <div className="progress-today-item">
            <span className="progress-today-val progress-val-purple">{todayStats.grammarDone}</span>
            <span className="progress-today-label">Грамматика</span>
          </div>
        </div>
      </section>

      {/* Special Decks: Mistakes & Starred */}
      <section className="progress-special-grid">
        <div className="progress-special-card" onClick={() => navigate('/quiz')}>
          <span className="progress-special-emoji">⚠️</span>
          <div>
            <strong>Работа над ошибками</strong>
            <p>{mistakesCount} {mistakesCount === 1 ? 'слово' : mistakesCount < 5 ? 'слова' : 'слов'} на доработку</p>
          </div>
        </div>
        <div className="progress-special-card">
          <span className="progress-special-emoji">⭐</span>
          <div>
            <strong>Избранные слова</strong>
            <p>{starredCount} {starredCount === 1 ? 'слово' : starredCount < 5 ? 'слова' : 'слов'} в закладках</p>
          </div>
        </div>
      </section>

      {/* Weekly heatmap */}
      <section className="progress-section">
        <h3>📅 Активность за неделю</h3>
        <div className="progress-heatmap">
          {weekActivity.map((day, i) => (
            <div key={i} className={`progress-heatmap-day ${day.isToday ? 'progress-heatmap-today' : ''}`}>
              <div
                className="progress-heatmap-block"
                style={{ backgroundColor: getActivityColor(day.count) }}
              >
                {day.count > 0 && <span>{day.count}</span>}
              </div>
              <span className="progress-heatmap-label">{day.day}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Streaks */}
      <section className="progress-streaks">
        <div className="progress-streak-card">
          <span className="progress-streak-emoji">🔥</span>
          <span className="progress-streak-num">{currentStreak}</span>
          <span className="progress-streak-text">Текущая серия</span>
        </div>
        <div className="progress-streak-card">
          <span className="progress-streak-emoji">🏆</span>
          <span className="progress-streak-num">{bestStreak}</span>
          <span className="progress-streak-text">Лучшая серия</span>
        </div>
      </section>

      {/* Overall stats */}
      <section className="progress-section">
        <h3>📖 Общая статистика</h3>
        <div className="progress-overall">
          <div className="progress-overall-row">
            <span>Всего слов в словаре</span>
            <span className="progress-overall-val">{totalWords}</span>
          </div>
          <div className="progress-overall-row">
            <span>Слов изучено</span>
            <span className="progress-overall-val">{learnedWords}</span>
          </div>
          <div className="progress-overall-row">
            <span>Точность ответов</span>
            <span className="progress-overall-val">{accuracy}%</span>
          </div>
        </div>
      </section>

      {/* Language breakdown */}
      <section className="progress-section">
        <h3>🌐 По языкам</h3>
        <div className="progress-lang-breakdown">
          <div className="progress-lang-item">
            <div className="progress-lang-header">
              <span>🇬🇧 English</span>
              <span>{langBreakdown.en} слов</span>
            </div>
            <div className="progress-lang-bar">
              <div
                className="progress-lang-fill progress-lang-en"
                style={{
                  width: learnedWords > 0 ? `${(langBreakdown.en / learnedWords) * 100}%` : '0%',
                }}
              />
            </div>
          </div>
          <div className="progress-lang-item">
            <div className="progress-lang-header">
              <span>🇩🇪 Deutsch</span>
              <span>{langBreakdown.de} слов</span>
            </div>
            <div className="progress-lang-bar">
              <div
                className="progress-lang-fill progress-lang-de"
                style={{
                  width: learnedWords > 0 ? `${(langBreakdown.de / learnedWords) * 100}%` : '0%',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Level distribution */}
      {Object.keys(levelDist).length > 0 && (
        <section className="progress-section">
          <h3>📊 По уровням</h3>
          <div className="progress-level-chart">
            {Object.entries(levelDist)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([lvl, count]) => (
                <div key={lvl} className="progress-level-row">
                  <span className="progress-level-label">{lvl}</span>
                  <div className="progress-level-bar-track">
                    <div
                      className="progress-level-bar-fill"
                      style={{ width: `${(count / maxLevelCount) * 100}%` }}
                    />
                  </div>
                  <span className="progress-level-count">{count}</span>
                </div>
              ))}
          </div>
        </section>
      )}

      <ShareAchievementModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        stats={{
          streak: currentStreak,
          todayReviewed: todayStats.reviewed,
          accuracy,
          rankTitle: rank.title,
          totalXP: rank.currentXP,
        }}
      />
    </div>
  );
}
