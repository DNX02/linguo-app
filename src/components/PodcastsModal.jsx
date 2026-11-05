import React, { useState, useEffect, useRef } from 'react';
import { speakText } from '../utils/speech';
import { sounds } from '../utils/soundEffects';
import gamification from '../utils/gamification';
import './PodcastsModal.css';

const PODCAST_EPISODES = [
  {
    id: 'pod-en-1',
    lang: 'en',
    title: 'The Secret Silicon Valley Pitch',
    subtitle: 'Как стартапы убеждают инвесторов на миллионы долларов',
    author: 'Tech Insider Podcast',
    duration: '2:15',
    tag: '💼 IT & Бизнес',
    coverIcon: '🚀',
    accentColor: '#6366f1',
    sentences: [
      {
        en: 'In the heart of Silicon Valley, entrepreneurs have exactly ninety seconds to pitch their dream.',
        ru: 'В самом сердце Кремниевой долины у предпринимателей есть ровно девяносто секунд, чтобы презентовать свою мечту.'
      },
      {
        en: 'They say you should never start with technical details or complex code.',
        ru: 'Говорят, никогда не следует начинать с технических деталей или сложного кода.'
      },
      {
        en: 'Instead, identify a painful problem that millions of people experience every single day.',
        ru: 'Вместо этого укажите на острую проблему, с которой миллионы людей сталкиваются каждый день.'
      },
      {
        en: 'Investors do not just invest in great software; they bet on passionate founders.',
        ru: 'Инвесторы вкладывают деньги не просто в отличный софт — они делают ставку на увлечённых основателей.'
      },
      {
        en: 'If you can prove high scalability and user traction, the money will naturally follow.',
        ru: 'Если вы сможете доказать высокую масштабируемость и рост аудитории, деньги придут сами собой.'
      }
    ],
    vocab: [
      { word: 'Pitch', note: 'Краткая убедительная презентация' },
      { word: 'Painful problem', note: 'Острая наболевшая проблема' },
      { word: 'Traction', note: 'Метрика вовлеченности и роста пользователей' },
      { word: 'Bet on', note: 'Делать ставку на кого-то' }
    ]
  },
  {
    id: 'pod-de-1',
    lang: 'de',
    title: 'Das Geheimnis des Berliner Untergrunds',
    subtitle: 'Тайны заброшенных бункеров и метро Берлина',
    author: 'Berlin Kultur Welle',
    duration: '2:30',
    tag: '🏛️ История & Город',
    coverIcon: '🚇',
    accentColor: '#f59e0b',
    sentences: [
      {
        en: 'Unter den Straßen Berlins verbirgt sich eine völlig unbekannte, faszinierende Welt.',
        ru: 'Под улицами Берлина скрывается совершенно неизведанный, завораживающий мир.'
      },
      {
        en: 'Hunderte von Bunkern und verlassenen U-Bahn-Stationen erzählen Geschichten aus dem Kalten Krieg.',
        ru: 'Сотни бункеров и заброшенных станций метро хранят истории времен Холодной войны.'
      },
      {
        en: 'Viele dieser unterirdischen Räume wurden jahrzehntelang vergessen und erst kürzlich wiederentdeckt.',
        ru: 'Многие из этих подземных помещений были забыты десятилетиями и открыты заново лишь недавно.'
      },
      {
        en: 'Heute führen Historiker neugierige Besucher durch dunkle Tunnel mit Taschenlampen.',
        ru: 'Сегодня историки водят любознательных туристов по темным туннелям с фонариками.'
      },
      {
        en: 'Geschichte wird hier hautnah spürbar und lässt niemanden kalt.',
        ru: 'История здесь ощущается буквально кожей и никого не оставляет равнодушным.'
      }
    ],
    vocab: [
      { word: 'verbirgt sich', note: 'Скрывается, прячется' },
      { word: 'verlassenen', note: 'Заброшенные, покинутые' },
      { word: 'wiederentdeckt', note: 'Вновь открытые заново' },
      { word: 'hautnah spürbar', note: 'Ощутимо кожей / очень близко' }
    ]
  },
  {
    id: 'pod-en-2',
    lang: 'en',
    title: 'Midnight in Tokyo: City of Neon',
    subtitle: 'Атмосфера ночного мегаполиса и эстетика рамена',
    author: 'Wanderlust Audio Journeys',
    duration: '2:10',
    tag: '✈️ Путешествия',
    coverIcon: '🍜',
    accentColor: '#ec4899',
    sentences: [
      {
        en: 'The rain has just stopped, leaving Tokyo streets shimmering with reflections of neon signs.',
        ru: 'Дождь только что стих, оставив токийские улицы мерцающими в отражениях неоновых вывесок.'
      },
      {
        en: 'Down a narrow alleyway, steam rises from a tiny ramen shop with only six wooden stools.',
        ru: 'В узком переулке поднимается пар из крошечной раменной всего на шесть деревянных табуретов.'
      },
      {
        en: 'The master chef bows quietly and prepares a rich tonkotsu broth that simmered for twelve hours.',
        ru: 'Шеф-мастер вежливо кланяется и готовит наваристый бульон тонкоцу, который томился двенадцать часов.'
      },
      {
        en: 'In this bustling metropolis, solitude feels peaceful rather than lonely.',
        ru: 'В этом шумном мегаполисе уединение ощущается умиротворяющим, а не одиноким.'
      }
    ],
    vocab: [
      { word: 'Shimmering', note: 'Мерцающий, переливающийся' },
      { word: 'Alleyway', note: 'Узкий переулок, улочка' },
      { word: 'Simmered', note: 'Томился на медленном огне' },
      { word: 'Solitude', note: 'Приятное уединение (в отличие от lonely)' }
    ]
  },
  {
    id: 'pod-de-2',
    lang: 'de',
    title: 'Oktoberfest: Mythen und Wirklichkeit',
    subtitle: 'Как на самом деле мюнхенцы празднуют крупнейший фестиваль',
    author: 'Bayern Magazin',
    duration: '2:20',
    tag: '🍻 Традиции & Бавария',
    coverIcon: '🥨',
    accentColor: '#10b981',
    sentences: [
      {
        en: 'Für die meisten Touristen bedeutet das Oktoberfest nur Riesenkrüge Bier und laute Blasmusik.',
        ru: 'Для большинства туристов Октоберфест означает лишь гигантские кружки пива и громкую духовую музыку.'
      },
      {
        en: 'Aber für echte Münchner ist die «Wiesn» ein traditionsreiches Familienfest mit über zweihundert Jahren Geschichte.',
        ru: 'Но для коренных мюнхенцев «Визн» — это традиционный семейный праздник с более чем двухсотлетней историей.'
      },
      {
        en: 'Frische Brezen, knusprige Hendl und traditionelle Trachten wie Dirndl und Lederhosen gehören einfach dazu.',
        ru: 'Свежие брецели, хрустящая курица и традиционные наряды — дирндль и ледерхозе — неотъемлемая часть атмосферы.'
      },
      {
        en: 'Gemütlichkeit ist das Zauberwort, das die bayerische Lebensfreude perfekt beschreibt.',
        ru: '«Gemütlichkeit» (уют и душевная теплота) — волшебное слово, идеально описывающее баварскую радость жизни.'
      }
    ],
    vocab: [
      { word: 'die Wiesn', note: 'Разговорное название Октоберфеста в Мюнхене' },
      { word: 'knusprige', note: 'Хрустящий' },
      { word: 'die Trachten', note: 'Национальные баварские костюмы' },
      { word: 'Gemütlichkeit', note: 'Уникальное немецкое понятие душевного уюта' }
    ]
  }
];

export default function PodcastsModal({ isOpen, onClose }) {
  const [selectedEp, setSelectedEp] = useState(PODCAST_EPISODES[0]);
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [completedEps, setCompletedEps] = useState(new Set());
  const playTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      stopPlayback();
    };
  }, []);

  if (!isOpen) return null;

  const stopPlayback = () => {
    if (playTimerRef.current) {
      clearTimeout(playTimerRef.current);
      playTimerRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  };

  const playSentence = (idx, speed = playbackSpeed) => {
    if (idx >= selectedEp.sentences.length) {
      stopPlayback();
      // Reward completion
      if (!completedEps.has(selectedEp.id)) {
        gamification.addXP(40);
        gamification.addGems(15);
        setCompletedEps(prev => new Set(prev).add(selectedEp.id));
        sounds.playComplete();
      }
      return;
    }

    setCurrentSentenceIdx(idx);
    setIsPlaying(true);
    const item = selectedEp.sentences[idx];
    const textToSpeak = item.en; // contains target foreign language (EN or DE)

    speakText(textToSpeak, selectedEp.lang, { rate: speed });

    // Calculate approx reading duration for sentence progression
    const wordCount = textToSpeak.split(' ').length;
    const durationMs = Math.max(2500, (wordCount * 450) / speed);

    playTimerRef.current = setTimeout(() => {
      playSentence(idx + 1, speed);
    }, durationMs);
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      sounds.playTap?.();
      playSentence(currentSentenceIdx);
    }
  };

  const handleSelectEpisode = (ep) => {
    stopPlayback();
    setSelectedEp(ep);
    setCurrentSentenceIdx(0);
  };

  const handleTapSentence = (idx) => {
    stopPlayback();
    setCurrentSentenceIdx(idx);
    playSentence(idx);
  };

  return (
    <div className="podcast-overlay" onClick={onClose}>
      <div className="podcast-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="podcast-header">
          <div className="podcast-header-left">
            <span className="podcast-badge">🎙️ Linguo Audio Theater</span>
            <h3>Билингвальные Подкасты</h3>
          </div>
          <button className="podcast-close" onClick={onClose}>✕</button>
        </div>

        {/* Episode Carousel */}
        <div className="podcast-episodes-strip">
          {PODCAST_EPISODES.map(ep => {
            const isSelected = selectedEp.id === ep.id;
            const isDone = completedEps.has(ep.id);
            return (
              <div
                key={ep.id}
                className={`podcast-ep-card ${isSelected ? 'active' : ''}`}
                onClick={() => handleSelectEpisode(ep)}
              >
                <div className="ep-card-top">
                  <span className="ep-icon">{ep.coverIcon}</span>
                  <span className="ep-lang-tag">{ep.lang === 'en' ? '🇺🇸 EN' : '🇩🇪 DE'}</span>
                </div>
                <strong className="ep-title">{ep.title}</strong>
                <div className="ep-meta">
                  <span>{ep.tag}</span>
                  {isDone && <span className="ep-done-badge">✓ +40 XP</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Player Deck */}
        <div className="podcast-player-deck">
          <div className="player-deck-top">
            <div className="deck-info">
              <span className="deck-tag">{selectedEp.tag} • {selectedEp.author}</span>
              <h4>{selectedEp.title}</h4>
              <p>{selectedEp.subtitle}</p>
            </div>
          </div>

          {/* Speed & Controls Bar */}
          <div className="podcast-controls-bar">
            <button className="podcast-main-play-btn" onClick={handleTogglePlay}>
              {isPlaying ? '⏸️ Пауза' : '▶️ Слушать выпуск'}
            </button>

            <div className="speed-pills">
              {[0.8, 1.0, 1.25].map(spd => (
                <button
                  key={spd}
                  className={`speed-pill ${playbackSpeed === spd ? 'active' : ''}`}
                  onClick={() => {
                    setPlaybackSpeed(spd);
                    if (isPlaying) {
                      stopPlayback();
                      playSentence(currentSentenceIdx, spd);
                    }
                  }}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Karaoke Transcripts */}
          <div className="podcast-transcript-stream">
            <div className="stream-header-note">
              Нажмите на любое предложение, чтобы прослушать его отдельно:
            </div>
            {selectedEp.sentences.map((st, idx) => {
              const isActive = currentSentenceIdx === idx;
              return (
                <div
                  key={idx}
                  className={`transcript-row ${isActive ? 'active-speaking' : ''}`}
                  onClick={() => handleTapSentence(idx)}
                >
                  <div className="row-indicator">
                    {isActive ? (
                      <span className="live-sound-bars">
                        <span className="bar" />
                        <span className="bar" />
                        <span className="bar" />
                      </span>
                    ) : (
                      <span className="row-num">{idx + 1}</span>
                    )}
                  </div>
                  <div className="row-text">
                    <p className="foreign-phrase">{st.en}</p>
                    <p className="ru-translation">{st.ru}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Key Vocabulary Pills */}
          <div className="podcast-vocab-box">
            <span className="vocab-header">💡 Ключевые фразы выпуска:</span>
            <div className="vocab-chips-row">
              {selectedEp.vocab.map((v, i) => (
                <div
                  key={i}
                  className="vocab-chip"
                  onClick={() => speakText(v.word, selectedEp.lang)}
                  title="Нажмите для произношения"
                >
                  <strong>{v.word} 🔊</strong>
                  <small>— {v.note}</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
