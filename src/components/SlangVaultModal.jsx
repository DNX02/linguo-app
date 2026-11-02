import React, { useState } from 'react';
import { speakText } from '../utils/speech';
import { sounds } from '../utils/sounds';
import { haptics } from '../utils/haptics';
import './SlangVaultModal.css';

const IDIOMS_DATA = [
  {
    id: 1,
    phrase: 'No cap',
    literal: 'Без кепки / без шапки',
    meaning: 'Честно, без обмана / чистая правда (For real, no lie)',
    example: 'That concert in Brooklyn was the best night of my life, no cap!',
    category: 'Gen-Z & Street',
    badge: '🔥 Топ сленг'
  },
  {
    id: 2,
    phrase: 'Spill the tea',
    literal: 'Разлить чай',
    meaning: 'Рассказывай сплетни / выкладывай секреты (Share the gossip)',
    example: 'I saw you talking to the new manager. Spill the tea!',
    category: 'Разговорный',
    badge: '☕ Популярное'
  },
  {
    id: 3,
    phrase: 'Bite the bullet',
    literal: 'Укусить пулю',
    meaning: 'Стиснуть зубы и сделать трудное, но неизбежное дело',
    example: 'I finally bit the bullet and bought the plane tickets to Miami.',
    category: 'Классика США',
    badge: '🇺🇸 Идиома'
  },
  {
    id: 4,
    phrase: 'Touch base',
    literal: 'Коснуться базы',
    meaning: 'Кратко созвониться или списаться, чтобы сверить планы',
    example: 'Let’s touch base on Slack after the client call.',
    category: 'Деловой & IT',
    badge: '💼 Офис'
  },
  {
    id: 5,
    phrase: 'Under the weather',
    literal: 'Под погодой',
    meaning: 'Плохо себя чувствовать / приболеть (Feeling sick or unwell)',
    example: 'I am feeling a bit under the weather today, so I’m working from home.',
    category: 'Разговорный',
    badge: '🤒 Здоровье'
  },
  {
    id: 6,
    phrase: 'Hit the nail on the head',
    literal: 'Ударить гвоздь по шляпке',
    meaning: 'Попасть не в бровь, а в глаз / сказать в самую точку',
    example: 'Your presentation hit the nail on the head regarding customer retention.',
    category: 'Деловой & IT',
    badge: '🎯 Метко'
  },
  {
    id: 7,
    phrase: 'Piece of cake',
    literal: 'Кусок торта / пирога',
    meaning: 'Проще простого / пара пустяков (Extremely easy)',
    example: 'Don’t worry about the English driver’s test, it’s a piece of cake.',
    category: 'Классика США',
    badge: '🍰 Легко'
  },
  {
    id: 8,
    phrase: 'Lowkey',
    literal: 'Низкий ключ',
    meaning: 'Втайне / немного / не привлекая лишнего внимания',
    example: 'I lowkey love eating peanut butter straight from the jar.',
    category: 'Gen-Z & Street',
    badge: '🤫 Сленг'
  },
  {
    id: 9,
    phrase: 'Break a leg',
    literal: 'Сломать ногу',
    meaning: 'Ни пуха, ни пера! / Удачи перед важным выступлением',
    example: 'You have your job interview today? Break a leg!',
    category: 'Классика США',
    badge: '🍀 Удача'
  },
  {
    id: 10,
    phrase: 'Burn the midnight oil',
    literal: 'Жечь полночное масло',
    meaning: 'Работать или учиться до глубокой ночи',
    example: 'The engineering team burned the midnight oil to push the release.',
    category: 'Деловой & IT',
    badge: '🌙 Ночь'
  },
  {
    id: 11,
    phrase: 'Cost an arm and a leg',
    literal: 'Стоить руку и ногу',
    meaning: 'Стоить бешеных денег / стоить целое состояние',
    example: 'Renting an apartment in downtown San Francisco costs an arm and a leg.',
    category: 'Классика США',
    badge: '💸 Деньги'
  },
  {
    id: 12,
    phrase: 'GOAT (Greatest Of All Time)',
    literal: 'Козёл',
    meaning: 'Величайший всех времён (легенда в спорте, коде или музыке)',
    example: 'Michael Jordan is undeniably the basketball GOAT.',
    category: 'Gen-Z & Street',
    badge: '🐐 Легенда'
  }
];

export default function SlangVaultModal({ isOpen, onClose }) {
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [quizCard, setQuizCard] = useState(null);
  const [quizScore, setQuizScore] = useState(0);

  if (!isOpen) return null;

  const categories = ['all', 'Gen-Z & Street', 'Классика США', 'Деловой & IT', 'Разговорный'];

  const filtered = IDIOMS_DATA.filter((item) => {
    const matchesCat = filterCategory === 'all' || item.category === filterCategory;
    const matchesSearch =
      item.phrase.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.meaning.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSpeak = (text) => {
    sounds.playTap?.();
    speakText(text, 'en-US');
  };

  const startMiniQuiz = () => {
    const random = IDIOMS_DATA[Math.floor(Math.random() * IDIOMS_DATA.length)];
    // Pick 2 wrong answers
    const wrongs = IDIOMS_DATA.filter((i) => i.id !== random.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2)
      .map((i) => i.meaning);

    const options = [random.meaning, ...wrongs].sort(() => 0.5 - Math.random());

    setQuizCard({
      item: random,
      options,
      correct: random.meaning,
      selected: null
    });
    sounds.playTap?.();
    haptics.medium();
  };

  const handleQuizAnswer = (opt) => {
    if (quizCard.selected) return;
    const isCorrect = opt === quizCard.correct;
    setQuizCard((prev) => ({ ...prev, selected: opt }));

    if (isCorrect) {
      sounds.playCorrect?.();
      haptics.celebrate();
      setQuizScore((s) => s + 1);
    } else {
      sounds.playWrong?.();
      haptics.error();
    }
  };

  return (
    <div className="slang-modal-overlay" onClick={onClose}>
      <div className="slang-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="slang-modal-header">
          <div className="slang-header-title">
            <span className="slang-sparkle">🗽</span>
            <div>
              <h3>Секретный словарь сленга США</h3>
              <p>Американские идиомы и фразы, которым не учат в школе</p>
            </div>
          </div>
          <button className="slang-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Controls & Search */}
        <div className="slang-controls-strip">
          <div className="slang-search-box">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Поиск идиомы или значения..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="slang-search-input"
            />
          </div>

          <div className="slang-cat-pills scrollable-tabs">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`sc-btn ${filterCategory === cat ? 'active' : ''}`}
                onClick={() => setFilterCategory(cat)}
              >
                {cat === 'all' ? '✨ Все' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="slang-modal-body">
          {quizCard ? (
            /* Mini-Quiz Mode */
            <div className="slang-quiz-box animate-pop">
              <div className="sqb-header">
                <span>🎯 Экспресс-квиз по идиомам США</span>
                <button className="sqb-close" onClick={() => setQuizCard(null)}>✕</button>
              </div>

              <h2 className="sqb-phrase">"{quizCard.item.phrase}"</h2>
              <p className="sqb-prompt">Что на самом деле значит это выражение в Америке?</p>

              <div className="sqb-opts-stack">
                {quizCard.options.map((opt, i) => {
                  let optStyle = '';
                  if (quizCard.selected) {
                    if (opt === quizCard.correct) optStyle = 'correct';
                    else if (opt === quizCard.selected) optStyle = 'wrong';
                  }
                  return (
                    <button
                      key={i}
                      className={`sqb-opt-btn ${optStyle}`}
                      onClick={() => handleQuizAnswer(opt)}
                      disabled={quizCard.selected !== null}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {quizCard.selected && (
                <div className="sqb-footer-action animate-in">
                  <button className="sqb-next-btn" onClick={startMiniQuiz}>
                    Следующая идиома ➔
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Quiz Banner */}
              <div className="slang-quiz-banner" onClick={startMiniQuiz}>
                <div>
                  <strong>🧠 Проверить знание сленга</strong>
                  <p>Интерактивный блиц-опрос по фразеологизмам США</p>
                </div>
                <button className="sqb-start-pill">Пройти ➔</button>
              </div>

              {/* Idioms List */}
              <div className="slang-cards-grid">
                {filtered.map((item) => (
                  <div key={item.id} className="slang-card animate-in">
                    <div className="sc-header">
                      <div className="sc-phrase-group">
                        <strong className="sc-phrase">{item.phrase}</strong>
                        <span className="sc-category-tag">{item.badge}</span>
                      </div>
                      <button
                        className="sc-sound-btn"
                        onClick={() => handleSpeak(item.phrase)}
                        title="Прослушать произношение (en-US)"
                      >
                        🔊
                      </button>
                    </div>

                    <div className="sc-meaning-block">
                      <div className="sc-meaning">
                        <span className="meaning-label">Значение:</span>
                        <span className="meaning-val">{item.meaning}</span>
                      </div>
                      <div className="sc-literal">
                        <span className="literal-label">Буквально:</span>
                        <span className="literal-val">{item.literal}</span>
                      </div>
                    </div>

                    <div className="sc-example-box">
                      <span className="example-quote">“{item.example}”</span>
                      <button
                        className="example-listen-mini"
                        onClick={() => handleSpeak(item.example)}
                        title="Прослушать пример"
                      >
                        🗣️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
