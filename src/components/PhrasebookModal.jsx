import React, { useState, useEffect } from 'react';
import { speakText } from '../utils/speech';
import { sounds } from '../utils/soundEffects';
import './PhrasebookModal.css';

const PHRASEBOOK_DATA = [
  // --- EMERGENCY & HEALTH ---
  {
    cat: 'emergency',
    catName: '🚑 Скорая & Врач',
    en: 'I need to see a doctor immediately.',
    de: 'Ich muss sofort einen Arzt aufsuchen.',
    ru: 'Мне нужно срочно к врачу.',
    translit: 'ай нид ту си э доктор иммидиэтли / их мус зофорт айнэн арцт ауфзухэн'
  },
  {
    cat: 'emergency',
    catName: '🚑 Скорая & Врач',
    en: 'I have a severe allergy to penicillin and nuts.',
    de: 'Ich habe eine schwere Allergie gegen Penicillin und Nüsse.',
    ru: 'У меня сильная аллергия на пенициллин и орехи.',
    translit: 'ай хэв э сивир элэрджи... / их хабэ айнэ шверэ алерги...'
  },
  {
    cat: 'emergency',
    catName: '🚑 Скорая & Врач',
    en: 'Where is the nearest 24-hour pharmacy?',
    de: 'Wo ist die nächste Notapotheke?',
    ru: 'Где находится ближайшая круглосуточная аптека?',
    translit: 'вэр из зэ нирэст... / во ист ди нэхстэ нот-апотекэ?'
  },
  {
    cat: 'emergency',
    catName: '🚑 Скорая & Врач',
    en: 'Call an ambulance, please! It is an emergency.',
    de: 'Rufen Sie bitte einen Krankenwagen! Es ist ein Notfall.',
    ru: 'Вызовите скорую, пожалуйста! Это экстренный случай.',
    translit: 'кол эн эмбьюланс плиз... / руфэн зи биттэ айнэн кранкэнвагэн!'
  },

  // --- AIRPORT & CUSTOMS ---
  {
    cat: 'travel',
    catName: '🛂 Аэропорт & Таможня',
    en: 'I am here for tourism and will stay for seven days.',
    de: 'Ich reise zu touristischen Zwecken und bleibe sieben Tage.',
    ru: 'Я приехал с туристической целью на 7 дней.',
    translit: 'ай эм хир фор туризм... / их райзэ цу туристишэн цветкэн...'
  },
  {
    cat: 'travel',
    catName: '🛂 Аэропорт & Таможня',
    en: 'My checked baggage did not arrive on the carousel.',
    de: 'Mein aufgegebenes Gepäck ist nicht am Band angekommen.',
    ru: 'Мой зарегистрированный багаж не прибыл на ленту.',
    translit: 'май чект бэггидж дид нот эррайв... / майн ауфгэгэбэнэс гэпэк...'
  },
  {
    cat: 'travel',
    catName: '🛂 Аэропорт & Таможня',
    en: 'Could you tell me where gate B14 is located?',
    de: 'Können Sie mir sagen, wo Gate B14 ist?',
    ru: 'Подскажите, пожалуйста, где находится выход B14?',
    translit: 'куд ю тэл ми вэр гейт... / кённэн зи мир загэн во гейт...'
  },

  // --- HOTEL & CHECK-IN ---
  {
    cat: 'hotel',
    catName: '🏨 Отель & Заселение',
    en: 'I have a reservation under the name Ivanov.',
    de: 'Ich habe eine Reservierung auf den Namen Ivanov.',
    ru: 'У меня забронирован номер на фамилию Иванов.',
    translit: 'ай хэв э резервейшн андэр зэ нейм... / их хабэ айнэ резервирунг...'
  },
  {
    cat: 'hotel',
    catName: '🏨 Отель & Заселение',
    en: 'Is breakfast included, and what are the serving hours?',
    de: 'Ist das Frühstück inklusive und wann wird es serviert?',
    ru: 'Завтрак включён, и до скольки он подаётся?',
    translit: 'из брекфаст инклудид... / ист дас фрюштюк инклюзивэ...'
  },
  {
    cat: 'hotel',
    catName: '🏨 Отель & Заселение',
    en: 'Could we request late check-out until 2 PM?',
    de: 'Könnten wir einen späten Check-out bis 14 Uhr anfragen?',
    ru: 'Можем ли мы запросить поздний выезд до 14:00?',
    translit: 'куд ви риквест лейт чек-аут... / кённтэн вир айнэн шпэтэн чек-аут...'
  },

  // --- RESTAURANT & FOOD ---
  {
    cat: 'food',
    catName: '🍽️ Ресторан & Еда',
    en: 'Could we please get the bill? We would like to pay by card.',
    de: 'Könnten wir bitte die Rechnung haben? Wir möchten mit Karte zahlen.',
    ru: 'Можно нам счет, пожалуйста? Мы хотим оплатить картой.',
    translit: 'куд ви плиз гет зэ билл... / кённтэн вир биттэ ди рехнунг хабэн...'
  },
  {
    cat: 'food',
    catName: '🍽️ Ресторан & Еда',
    en: 'Does this dish contain any dairy or gluten?',
    de: 'Enthält dieses Gericht Milchprodukte oder Gluten?',
    ru: 'Содержит ли это блюдо молочные продукты или глютен?',
    translit: 'даз зис диш контейн... / энтхэльт дизес герихьт...'
  },
  {
    cat: 'food',
    catName: '🍽️ Ресторан & Еда',
    en: 'A table for two outside on the terrace, please.',
    de: 'Einen Tisch für zwei Personen draußen auf der Terrasse, bitte.',
    ru: 'Столик на двоих снаружи на террасе, пожалуйста.',
    translit: 'э тейбл фор ту аутсайд... / айнэн тиш фюр цвай пэрзонэн...'
  },

  // --- TRANSPORT & TAXI ---
  {
    cat: 'transport',
    catName: '🚕 Такси & Транспорт',
    en: 'Please take me to the central train station.',
    de: 'Bitte bringen Sie mich zum Hauptbahnhof.',
    ru: 'Пожалуйста, отвезите меня на главный вокзал.',
    translit: 'плиз тейк ми ту зэ сентрал... / биттэ брингэн зи михь цум хауптбанхоф.'
  },
  {
    cat: 'transport',
    catName: '🚕 Такси & Транспорт',
    en: 'How much will the ride cost approximately?',
    de: 'Wie viel kostet die Fahrt ungefähr?',
    ru: 'Сколько примерно будет стоить поездка?',
    translit: 'хау мач вил зэ райд кост... / ви филь костэт ди фарт унгэфэр?'
  },
  {
    cat: 'transport',
    catName: '🚕 Такси & Транспорт',
    en: 'Which platform does the train to Vienna depart from?',
    de: 'Von welchem Gleis fährt der Zug nach Wien ab?',
    ru: 'С какой платформы отправляется поезд в Вену?',
    translit: 'вич плэтформ даз зэ трейн... / фон вельхем гляйс фэрт дэр цуг...'
  },

  // --- SHOPPING & MONEY ---
  {
    cat: 'money',
    catName: '💳 Банкомат & Оплата',
    en: 'The ATM swallowed my bank card. Who should I contact?',
    de: 'Der Geldautomat hat meine Bankkarte eingezogen. An wen wende ich mich?',
    ru: 'Банкомат заблокировал и не вернул мою карту. К кому обратиться?',
    translit: 'зи эй-ти-эм своллоуд май кард... / дэр гельт-аутомат хат майнэ картэ...'
  },
  {
    cat: 'money',
    catName: '💳 Банкомат & Оплата',
    en: 'Can I get a tax-free refund form for this purchase?',
    de: 'Kann ich bitte ein Tax-Free-Formular für diesen Einkauf bekommen?',
    ru: 'Могу я получить форму Tax Free (возврат налога) на эту покупку?',
    translit: 'кэн ай гет э тэкс-фри... / канн их биттэ айн такс-фри формуляр...'
  }
];

export default function PhrasebookModal({ isOpen, onClose }) {
  const [selectedLang, setSelectedLang] = useState('en');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [starredSet, setStarredSet] = useState(new Set());

  useEffect(() => {
    try {
      const saved = localStorage.getItem('linguo_starred_phrases');
      if (saved) setStarredSet(new Set(JSON.parse(saved)));
    } catch (_) {}
  }, []);

  if (!isOpen) return null;

  const toggleStar = (phraseKey) => {
    sounds.playTap?.();
    setStarredSet(prev => {
      const next = new Set(prev);
      if (next.has(phraseKey)) next.delete(phraseKey);
      else next.add(phraseKey);
      localStorage.setItem('linguo_starred_phrases', JSON.stringify(Array.from(next)));
      return next;
    });
  };

  const handleCopy = (text, id) => {
    sounds.playTap?.();
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const filtered = PHRASEBOOK_DATA.filter(item => {
    if (activeCategory !== 'all' && item.cat !== activeCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchEn = item.en.toLowerCase().includes(q);
      const matchDe = item.de.toLowerCase().includes(q);
      const matchRu = item.ru.toLowerCase().includes(q);
      return matchEn || matchDe || matchRu;
    }
    return true;
  });

  const categories = [
    { id: 'all', name: 'Все фразы' },
    { id: 'emergency', name: '🚑 Врач' },
    { id: 'travel', name: '🛂 Аэропорт' },
    { id: 'hotel', name: '🏨 Отель' },
    { id: 'food', name: '🍽️ Еда' },
    { id: 'transport', name: '🚕 Такси' },
    { id: 'money', name: '💳 Оплата' }
  ];

  return (
    <div className="phrase-overlay" onClick={onClose}>
      <div className="phrase-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="phrase-header">
          <div className="phrase-title-block">
            <span className="phrase-badge">🌍 Офлайн Разговорник</span>
            <h3>Разговорник Путешественника</h3>
          </div>
          <button className="phrase-close" onClick={onClose}>✕</button>
        </div>

        {/* Toolbar: Lang & Search */}
        <div className="phrase-search-toolbar">
          <div className="phrase-lang-pill-row">
            <button
              className={`p-lang-pill ${selectedLang === 'en' ? 'active' : ''}`}
              onClick={() => setSelectedLang('en')}
            >
              🇬🇧 English
            </button>
            <button
              className={`p-lang-pill ${selectedLang === 'de' ? 'active' : ''}`}
              onClick={() => setSelectedLang('de')}
            >
              🇩🇪 Deutsch
            </button>
          </div>

          <div className="phrase-search-input-wrap">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="🔍 Быстрый поиск фразы или симптома..."
              className="phrase-search-input"
            />
            {searchQuery && (
              <button className="phrase-search-clear" onClick={() => setSearchQuery('')}>×</button>
            )}
          </div>
        </div>

        {/* Categories Carousel */}
        <div className="phrase-categories-strip">
          {categories.map(c => (
            <button
              key={c.id}
              className={`cat-chip ${activeCategory === c.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(c.id)}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Phrases List */}
        <div className="phrases-list-scroll">
          {filtered.length === 0 ? (
            <div className="phrase-empty">
              <span>🔎</span>
              <p>Ничего не найдено по запросу «{searchQuery}»</p>
            </div>
          ) : (
            filtered.map((item, idx) => {
              const phraseKey = `${item.cat}_${idx}`;
              const foreignText = selectedLang === 'en' ? item.en : item.de;
              const isStarred = starredSet.has(phraseKey);
              const isCopied = copiedId === idx;

              return (
                <div key={idx} className={`phrase-card ${isStarred ? 'starred' : ''}`}>
                  <div className="phrase-card-top">
                    <span className="phrase-cat-tag">{item.catName}</span>
                    <div className="phrase-actions">
                      <button
                        className={`phrase-action-btn star ${isStarred ? 'active' : ''}`}
                        onClick={() => toggleStar(phraseKey)}
                        title="В избранное"
                      >
                        {isStarred ? '⭐' : '☆'}
                      </button>
                      <button
                        className="phrase-action-btn copy"
                        onClick={() => handleCopy(foreignText, idx)}
                        title="Скопировать"
                      >
                        {isCopied ? '✓ Скопировано' : '📋'}
                      </button>
                      <button
                        className="phrase-action-btn speak"
                        onClick={() => speakText(foreignText, selectedLang)}
                        title="Прослушать произношение"
                      >
                        🔊
                      </button>
                    </div>
                  </div>

                  <p className="phrase-foreign">{foreignText}</p>
                  <p className="phrase-ru">{item.ru}</p>
                  <p className="phrase-translit">Произношение: <em>{item.translit}</em></p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
