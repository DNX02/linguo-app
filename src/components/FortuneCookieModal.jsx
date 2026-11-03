import React, { useState, useEffect } from 'react';
import gamification from '../utils/gamification';
import { playSound } from '../utils/soundEffects';
import { speakText } from '../utils/speech';
import './FortuneCookieModal.css';

const FORTUNES = [
  {
    lang: 'en',
    quote: 'The journey of a thousand miles begins with a single step.',
    translation: 'Путь в тысячу миль начинается с первого шага.',
    author: 'Lao Tzu',
    lesson: 'Конструкция "begins with" (начинается с). Помните об окончании -s в Present Simple для 3-го лица!',
    gems: 15,
    xp: 25
  },
  {
    lang: 'de',
    quote: 'Aller Anfang ist schwer, aber Übung macht den Meister.',
    translation: 'Всякое начало трудно, но терпение и труд все перетрут (мастерство приходит с практикой).',
    author: 'Deutsches Sprichwort',
    lesson: 'Слово "die Übung" (практика/тренировка) женского рода. Глагол "macht" требует винительного падежа: "den Meister" (Akkusativ).',
    gems: 20,
    xp: 30
  },
  {
    lang: 'en',
    quote: 'Fortune favors the bold and persevering minds.',
    translation: 'Удача улыбается смелым и упорным умам.',
    author: 'Virgil',
    lesson: 'Глагол "to favor" означает благоволить или оказывать предпочтение. Прилагательное "bold" — смелый, дерзкий.',
    gems: 15,
    xp: 25
  },
  {
    lang: 'de',
    quote: 'Wer nicht wagt, der nicht gewinnt.',
    translation: 'Кто не рискует, тот не пьет шампанского (тот не выигрывает).',
    author: 'Deutsches Sprichwort',
    lesson: 'Относительное придаточное с "Wer... der...". Глагол в придаточном предложении всегда уходит в самый конец ("wagt", "gewinnt").',
    gems: 20,
    xp: 30
  },
  {
    lang: 'en',
    quote: 'Continuous effort, not strength or intelligence, is the key to unlocking our potential.',
    translation: 'Непрерывные усилия, а не сила или ум — вот ключ к раскрытию нашего потенциала.',
    author: 'Winston Churchill',
    lesson: 'Фраза "the key to doing something" — после предлога "to" здесь используется герундий ("unlocking"), так как "key to" — устойчивая связка.',
    gems: 25,
    xp: 35
  },
  {
    lang: 'de',
    quote: 'Es ist noch kein Meister vom Himmel gefallen.',
    translation: 'Мастерами не рождаются (с неба мастера ещё не падали).',
    author: 'Deutsches Sprichwort',
    lesson: 'Время Perfekt с глаголом движения "fallen": вспомогательный глагол "sein" ("ist... gefallen").',
    gems: 20,
    xp: 30
  }
];

export default function FortuneCookieModal({ isOpen, onClose }) {
  const [isCracked, setIsCracked] = useState(false);
  const [fortune, setFortune] = useState(null);
  const [alreadyClaimed, setAlreadyClaimed] = useState(false);
  const [isOpeningAnim, setIsOpeningAnim] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().slice(0, 10);
      const claimedDate = localStorage.getItem('linguo_fortune_claimed_date');
      const savedFortune = localStorage.getItem('linguo_fortune_claimed_data');

      if (claimedDate === today && savedFortune) {
        setAlreadyClaimed(true);
        setFortune(JSON.parse(savedFortune));
        setIsCracked(true);
      } else {
        setAlreadyClaimed(false);
        setIsCracked(false);
        // Pick a random fortune for today
        const randomIdx = Math.floor(Math.random() * FORTUNES.length);
        setFortune(FORTUNES[randomIdx]);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCrackCookie = () => {
    if (isCracked || isOpeningAnim) return;

    setIsOpeningAnim(true);
    try { playSound('streak'); } catch (_) {}

    setTimeout(() => {
      setIsCracked(true);
      setIsOpeningAnim(false);

      if (!alreadyClaimed && fortune) {
        const today = new Date().toISOString().slice(0, 10);
        localStorage.setItem('linguo_fortune_claimed_date', today);
        localStorage.setItem('linguo_fortune_claimed_data', JSON.stringify(fortune));
        setAlreadyClaimed(true);

        try {
          gamification.addXP(fortune.xp);
          gamification.addGems(fortune.gems);
          playSound('celebration');
        } catch (_) {}
      }
    }, 600);
  };

  const handleForceNew = () => {
    localStorage.removeItem('linguo_fortune_claimed_date');
    localStorage.removeItem('linguo_fortune_claimed_data');
    setAlreadyClaimed(false);
    setIsCracked(false);
    const randomIdx = Math.floor(Math.random() * FORTUNES.length);
    setFortune(FORTUNES[randomIdx]);
  };

  return (
    <div className="fortune-overlay" onClick={onClose}>
      <div className="fortune-modal" onClick={(e) => e.stopPropagation()}>
        <button className="fortune-close-btn" onClick={onClose}>✕</button>

        <div className="fortune-header">
          <span className="fortune-badge">🥠 Ежедневный ритуал</span>
          <h3>Печенье с предсказанием</h3>
          <p>Разломи печенье, узнай мудрость дня и получи кристаллы!</p>
        </div>

        <div className="fortune-stage">
          {!isCracked ? (
            <div
              className={`fortune-cookie-wrapper ${isOpeningAnim ? 'cracking' : ''}`}
              onClick={handleCrackCookie}
            >
              <div className="cookie-half left">🥠</div>
              <div className="cookie-prompt">
                <span>{isOpeningAnim ? 'Разламываем...' : 'Нажми, чтобы разломить!'}</span>
              </div>
            </div>
          ) : (
            <div className="fortune-revealed-paper">
              <div className="paper-ribbon">⭐ Мудрость Дня</div>
              <div className="paper-quote">
                «{fortune?.quote}»
              </div>
              <button
                className="paper-audio-btn"
                onClick={() => speakText(fortune?.quote, fortune?.lang || 'en')}
              >
                🔊 Слушать оригинал ({fortune?.lang === 'de' ? 'Немецкий' : 'Английский'})
              </button>
              <div className="paper-translation">
                {fortune?.translation}
              </div>
              <div className="paper-author">— {fortune?.author}</div>

              <div className="paper-lesson">
                <strong>💡 Разбор грамматики:</strong>
                <p>{fortune?.lesson}</p>
              </div>

              <div className="fortune-rewards-banner">
                <span className="reward-item">+{fortune?.xp} XP ⚡</span>
                <span className="reward-item">+{fortune?.gems} 💎</span>
              </div>
            </div>
          )}
        </div>

        <div className="fortune-footer">
          {alreadyClaimed && (
            <div className="fortune-hint-row">
              <span className="claimed-tag">✓ Награда получена сегодня</span>
              <button className="fortune-reset-link" onClick={handleForceNew}>
                Ещё одно печенье
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
