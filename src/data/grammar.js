/**
 * Grammar exercises dataset for Linguo.
 * Includes English and German grammar topics with fill-in-the-blank exercises.
 * All titles, descriptions, and explanations are in Russian.
 */

export const grammarTopics = [
  // ==================== ENGLISH GRAMMAR ====================

  {
    id: 'en-grammar-present-simple',
    language: 'en',
    level: 'A1',
    title: 'Present Simple',
    description: 'Простое настоящее время — описывает привычки, факты и повторяющиеся действия.',
    exercises: [
      {
        id: 'en-ps-01',
        sentence: 'She ___ to school every day.',
        options: ['go', 'goes', 'going', 'gone'],
        correct: 1,
        explanation: 'В Present Simple для третьего лица единственного числа (he/she/it) к глаголу добавляется окончание -s или -es. "She goes".',
      },
      {
        id: 'en-ps-02',
        sentence: 'They ___ coffee in the morning.',
        options: ['drinks', 'drinking', 'drink', 'drunk'],
        correct: 2,
        explanation: 'Для множественного числа (they) глагол используется без окончания -s. "They drink".',
      },
      {
        id: 'en-ps-03',
        sentence: 'He ___ not like spicy food.',
        options: ['do', 'does', 'is', 'has'],
        correct: 1,
        explanation: 'Для отрицания в Present Simple с he/she/it используется вспомогательный глагол "does". "He does not like".',
      },
      {
        id: 'en-ps-04',
        sentence: '___ you speak English?',
        options: ['Does', 'Do', 'Are', 'Is'],
        correct: 1,
        explanation: 'Для вопросов с you/we/they используется вспомогательный глагол "Do". "Do you speak?".',
      },
    ],
  },

  {
    id: 'en-grammar-past-simple',
    language: 'en',
    level: 'A2',
    title: 'Past Simple',
    description: 'Простое прошедшее время — описывает завершённые действия в прошлом.',
    exercises: [
      {
        id: 'en-past-01',
        sentence: 'I ___ to the cinema yesterday.',
        options: ['go', 'went', 'gone', 'going'],
        correct: 1,
        explanation: '"Go" — неправильный глагол. В Past Simple: go → went. "I went to the cinema".',
      },
      {
        id: 'en-past-02',
        sentence: 'She ___ a delicious cake last weekend.',
        options: ['baked', 'bake', 'baking', 'bakes'],
        correct: 0,
        explanation: '"Bake" — правильный глагол. В Past Simple добавляется -d: bake → baked.',
      },
      {
        id: 'en-past-03',
        sentence: 'They ___ not understand the question.',
        options: ['do', 'did', 'were', 'was'],
        correct: 1,
        explanation: 'Для отрицания в Past Simple всегда используется "did not" (didn\'t), независимо от лица. "They did not understand".',
      },
      {
        id: 'en-past-04',
        sentence: 'We ___ a great time at the party.',
        options: ['have', 'has', 'had', 'having'],
        correct: 2,
        explanation: '"Have" — неправильный глагол. В Past Simple: have → had. "We had a great time".',
      },
    ],
  },

  {
    id: 'en-grammar-articles',
    language: 'en',
    level: 'A2',
    title: 'Articles (a, an, the)',
    description: 'Артикли в английском языке — неопределённые (a/an) и определённый (the).',
    exercises: [
      {
        id: 'en-art-01',
        sentence: 'She is ___ doctor.',
        options: ['a', 'an', 'the', '—'],
        correct: 0,
        explanation: 'Перед существительными, начинающимися с согласного звука, используется неопределённый артикль "a". "A doctor".',
      },
      {
        id: 'en-art-02',
        sentence: 'He ate ___ orange for breakfast.',
        options: ['a', 'an', 'the', '—'],
        correct: 1,
        explanation: 'Перед существительными, начинающимися с гласного звука, используется "an". "An orange".',
      },
      {
        id: 'en-art-03',
        sentence: '___ sun rises in the east.',
        options: ['A', 'An', 'The', '—'],
        correct: 2,
        explanation: 'Определённый артикль "the" используется, когда речь идёт о единственном в своём роде объекте. Солнце одно — "the sun".',
      },
      {
        id: 'en-art-04',
        sentence: 'I love ___ music.',
        options: ['a', 'an', 'the', '—'],
        correct: 3,
        explanation: 'С абстрактными и неисчисляемыми существительными в общем значении артикль не используется. "I love music" (музыку вообще).',
      },
    ],
  },

  {
    id: 'en-grammar-prepositions',
    language: 'en',
    level: 'B1',
    title: 'Prepositions (in, on, at)',
    description: 'Предлоги места и времени — in, on, at и их правильное употребление.',
    exercises: [
      {
        id: 'en-prep-01',
        sentence: 'The meeting is ___ Monday.',
        options: ['in', 'on', 'at', 'by'],
        correct: 1,
        explanation: 'С днями недели используется предлог "on". "On Monday".',
      },
      {
        id: 'en-prep-02',
        sentence: 'I was born ___ 1995.',
        options: ['in', 'on', 'at', 'by'],
        correct: 0,
        explanation: 'С годами, месяцами и длительными периодами используется предлог "in". "In 1995".',
      },
      {
        id: 'en-prep-03',
        sentence: 'The train arrives ___ 3 o\'clock.',
        options: ['in', 'on', 'at', 'by'],
        correct: 2,
        explanation: 'С точным временем (часами) используется предлог "at". "At 3 o\'clock".',
      },
      {
        id: 'en-prep-04',
        sentence: 'She lives ___ the second floor.',
        options: ['in', 'on', 'at', 'by'],
        correct: 1,
        explanation: 'С этажами используется предлог "on". "On the second floor".',
      },
    ],
  },

  // ==================== GERMAN GRAMMAR ====================

  {
    id: 'de-grammar-artikel',
    language: 'de',
    level: 'A1',
    title: 'Artikel (der, die, das)',
    description: 'Артикли в немецком языке — определённые (der/die/das) зависят от рода существительного.',
    exercises: [
      {
        id: 'de-art-01',
        sentence: '___ Buch liegt auf dem Tisch.',
        options: ['Der', 'Die', 'Das', 'Den'],
        correct: 2,
        explanation: '"Buch" (книга) — существительное среднего рода (das Neutrum). Определённый артикль в именительном падеже — "das".',
      },
      {
        id: 'de-art-02',
        sentence: '___ Frau geht einkaufen.',
        options: ['Der', 'Die', 'Das', 'Den'],
        correct: 1,
        explanation: '"Frau" (женщина) — существительное женского рода (das Femininum). Определённый артикль — "die".',
      },
      {
        id: 'de-art-03',
        sentence: '___ Mann trinkt Kaffee.',
        options: ['Der', 'Die', 'Das', 'Den'],
        correct: 0,
        explanation: '"Mann" (мужчина) — существительное мужского рода (das Maskulinum). Определённый артикль — "der".',
      },
      {
        id: 'de-art-04',
        sentence: 'Ich sehe ___ Hund im Park.',
        options: ['der', 'die', 'das', 'den'],
        correct: 3,
        explanation: '"Hund" — мужской род. Глагол "sehen" требует аккузатива (винительный падеж). Артикль мужского рода в аккузативе — "den".',
      },
    ],
  },

  {
    id: 'de-grammar-praesens',
    language: 'de',
    level: 'A1',
    title: 'Präsens (настоящее время)',
    description: 'Спряжение глаголов в настоящем времени (Präsens) — основа немецкой грамматики.',
    exercises: [
      {
        id: 'de-prae-01',
        sentence: 'Ich ___ jeden Tag Deutsch.',
        options: ['lerne', 'lernst', 'lernt', 'lernen'],
        correct: 0,
        explanation: 'Для "ich" (я) окончание глагола — "-e". lernen → ich lerne.',
      },
      {
        id: 'de-prae-02',
        sentence: 'Du ___ sehr gut Gitarre.',
        options: ['spiele', 'spielst', 'spielt', 'spielen'],
        correct: 1,
        explanation: 'Для "du" (ты) окончание глагола — "-st". spielen → du spielst.',
      },
      {
        id: 'de-prae-03',
        sentence: 'Er ___ gern Fußball.',
        options: ['spiele', 'spielst', 'spielt', 'spielen'],
        correct: 2,
        explanation: 'Для "er/sie/es" (он/она/оно) окончание глагола — "-t". spielen → er spielt.',
      },
      {
        id: 'de-prae-04',
        sentence: 'Wir ___ am Wochenende ins Kino.',
        options: ['gehe', 'gehst', 'geht', 'gehen'],
        correct: 3,
        explanation: 'Для "wir" (мы) окончание глагола — "-en" (совпадает с инфинитивом). gehen → wir gehen.',
      },
    ],
  },

  {
    id: 'de-grammar-perfekt',
    language: 'de',
    level: 'A2',
    title: 'Perfekt (прошедшее время)',
    description: 'Перфект — разговорная форма прошедшего времени, образуется с помощью haben/sein + Partizip II.',
    exercises: [
      {
        id: 'de-perf-01',
        sentence: 'Ich ___ gestern einen Film gesehen.',
        options: ['bin', 'habe', 'hat', 'sind'],
        correct: 1,
        explanation: 'Глагол "sehen" образует перфект с вспомогательным глаголом "haben". "Ich habe gesehen".',
      },
      {
        id: 'de-perf-02',
        sentence: 'Sie ___ nach Berlin gefahren.',
        options: ['hat', 'habe', 'ist', 'sind'],
        correct: 2,
        explanation: 'Глаголы движения (fahren, gehen, fliegen и др.) образуют перфект с "sein". "Sie ist gefahren".',
      },
      {
        id: 'de-perf-03',
        sentence: 'Wir ___ gestern viel gelacht.',
        options: ['sind', 'haben', 'hat', 'ist'],
        correct: 1,
        explanation: '"Lachen" (смеяться) — не глагол движения, поэтому перфект образуется с "haben". "Wir haben gelacht".',
      },
      {
        id: 'de-perf-04',
        sentence: 'Er hat das Buch ___.',
        options: ['gelest', 'gelesen', 'lesen', 'las'],
        correct: 1,
        explanation: '"Lesen" — неправильный глагол. Partizip II: lesen → gelesen. "Er hat das Buch gelesen".',
      },
    ],
  },

  {
    id: 'de-grammar-akkusativ-dativ',
    language: 'de',
    level: 'B1',
    title: 'Akkusativ und Dativ',
    description: 'Винительный (Akkusativ) и дательный (Dativ) падежи — когда какой использовать.',
    exercises: [
      {
        id: 'de-akk-01',
        sentence: 'Ich gebe ___ Freund ein Geschenk.',
        options: ['meinen', 'meinem', 'mein', 'meiner'],
        correct: 1,
        explanation: '"Geben" требует дательного падежа для получателя (кому?). "Meinem Freund" — Dativ мужского рода.',
      },
      {
        id: 'de-akk-02',
        sentence: 'Sie kauft ___ neuen Mantel.',
        options: ['ein', 'einem', 'einen', 'einer'],
        correct: 2,
        explanation: '"Kaufen" требует аккузатива (что?). "Mantel" — мужской род. Аккузатив: "einen neuen Mantel".',
      },
      {
        id: 'de-akk-03',
        sentence: 'Er hilft ___ Mutter im Haushalt.',
        options: ['seine', 'seiner', 'seinen', 'seinem'],
        correct: 1,
        explanation: '"Helfen" требует дательного падежа (кому?). "Mutter" — женский род. Dativ: "seiner Mutter".',
      },
      {
        id: 'de-akk-04',
        sentence: 'Das Buch liegt auf ___ Tisch.',
        options: ['den', 'dem', 'der', 'das'],
        correct: 1,
        explanation: 'Предлог "auf" с вопросом "где?" (Wo?) требует дательного падежа. "Tisch" — мужской род. Dativ: "dem Tisch".',
      },
    ],
  },
  {
    id: 'en-grammar-conditionals',
    language: 'en',
    level: 'B1',
    title: 'Conditionals (First & Second)',
    description: 'Условные предложения первого (реального) и второго (гипотетического) типов.',
    exercises: [
      {
        id: 'en-cond-01',
        sentence: 'If it rains tomorrow, we ___ at home.',
        options: ['stay', 'will stay', 'stayed', 'would stay'],
        correct: 1,
        explanation: 'В First Conditional (реальное условие в будущем): If + Present Simple, will + глагол. "If it rains, we will stay".',
      },
      {
        id: 'en-cond-02',
        sentence: 'If I ___ a million dollars, I would travel the world.',
        options: ['have', 'had', 'will have', 'having'],
        correct: 1,
        explanation: 'В Second Conditional (нереальное условие): If + Past Simple, would + глагол. "If I had a million dollars".',
      },
      {
        id: 'en-cond-03',
        sentence: 'If you study hard, you ___ the exam.',
        options: ['pass', 'will pass', 'would pass', 'passed'],
        correct: 1,
        explanation: 'First Conditional: "If you study hard, you will pass".',
      },
    ],
  },
  {
    id: 'en-grammar-phrasal-verbs',
    language: 'en',
    level: 'B2',
    title: 'Phrasal Verbs',
    description: 'Популярные фразовые глаголы (give up, look forward to, find out).',
    exercises: [
      {
        id: 'en-pv-01',
        sentence: 'Never ___ on your dreams!',
        options: ['give up', 'give in', 'give off', 'give away'],
        correct: 0,
        explanation: '"Give up" означает сдаваться, бросать занятие.',
      },
      {
        id: 'en-pv-02',
        sentence: 'I am looking forward ___ seeing you again.',
        options: ['for', 'to', 'at', 'with'],
        correct: 1,
        explanation: 'Устойчивое выражение: "look forward to + V-ing" (с нетерпением ждать).',
      },
      {
        id: 'en-pv-03',
        sentence: 'Can you help me ___ where the station is?',
        options: ['find out', 'find at', 'find over', 'find by'],
        correct: 0,
        explanation: '"Find out" переводится как «выяснить / узнать».',
      },
    ],
  },
  {
    id: 'de-grammar-trennbare-verben',
    language: 'de',
    level: 'A2',
    title: 'Trennbare Verben',
    description: 'Глаголы с отделяемыми приставками (aufstehen, anrufen, mitkommen).',
    exercises: [
      {
        id: 'de-tv-01',
        sentence: 'Ich stehe jeden Morgen um 7 Uhr ___.',
        options: ['auf', 'an', 'aus', 'ab'],
        correct: 0,
        explanation: 'Глагол "aufstehen" (вставать). Приставка "auf-" отделяется и уходит в самый конец предложения.',
      },
      {
        id: 'de-tv-02',
        sentence: 'Wann rufst du mich ___?',
        options: ['auf', 'an', 'mit', 'zu'],
        correct: 1,
        explanation: 'Глагол "anrufen" (звонить). В вопросе: "Wann rufst du mich an?".',
      },
      {
        id: 'de-tv-03',
        sentence: 'Kommst du heute Abend ___?',
        options: ['mit', 'ein', 'vor', 'ab'],
        correct: 0,
        explanation: 'Глагол "mitkommen" (идти вместе). "Kommst du mit?".',
      },
    ],
  },
  {
    id: 'de-grammar-wechselpraepositionen',
    language: 'de',
    level: 'B1',
    title: 'Wechselpräpositionen',
    description: 'Предлоги двойного управления (in, an, auf, unter, vor) с вопросами Wo? (Dativ) и Wohin? (Akkusativ).',
    exercises: [
      {
        id: 'de-wp-01',
        sentence: 'Ich lege das Buch auf ___ Tisch. (куда?)',
        options: ['den', 'dem', 'der', 'das'],
        correct: 0,
        explanation: 'Вопрос "куда?" (Wohin?) требует Akkusativ. "Tisch" — мужской род. Akkusativ: "auf den Tisch".',
      },
      {
        id: 'de-wp-02',
        sentence: 'Das Bild hängt an ___ Wand. (где?)',
        options: ['die', 'der', 'dem', 'den'],
        correct: 1,
        explanation: 'Вопрос "где?" (Wo?) требует Dativ. "Wand" — женский род. Dativ: "an der Wand".',
      },
      {
        id: 'de-wp-03',
        sentence: 'Wir gehen heute in ___ Kino. (куда?)',
        options: ['das', 'dem', 'den', 'der'],
        correct: 0,
        explanation: 'Вопрос "куда?" (Wohin?) требует Akkusativ. "Kino" — средний род. "in das (ins) Kino".',
      },
    ],
  },
];

export default grammarTopics;
