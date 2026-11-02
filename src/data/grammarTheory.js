/**
 * Detailed grammar reference & handbook dataset for Linguo.
 * Contains in-depth rules, formulas, usage guidelines, markers, examples and common mistakes in Russian.
 */

export const grammarTheory = {
  // ==========================================
  // ENGLISH GRAMMAR RULES (DETAILED)
  // ==========================================

  'en-grammar-present-simple': {
    title: 'Present Simple Tense (Простое настоящее)',
    subtitle: 'Базовое время для привычек, фактов и регулярных действий',
    overview: 'Present Simple используется для описания постоянных состояний, законов природы, расписаний и действий, которые происходят регулярно, а не прямо в секунду речи.',
    formulas: [
      { type: 'positive', label: 'Утверждение (+)', formula: 'I / You / We / They + V1\nHe / She / It + V1 + -s/-es', example: 'She works in a bank. / They live in Boston.' },
      { type: 'negative', label: 'Отрицание (-)', formula: 'I / You / We / They + do not (don\'t) + V1\nHe / She / It + does not (doesn\'t) + V1', example: 'He doesn\'t like coffee. / We don\'t drive.' },
      { type: 'question', label: 'Вопрос (?)', formula: 'Do + I / you / we / they + V1 ?\nDoes + he / she / it + V1 ?', example: 'Do you speak English? / Does she work today?' },
    ],
    rules: [
      { title: 'Окончания -s и -es у he/she/it', text: 'Если глагол оканчивается на -s, -sh, -ch, -x, -o, добавляем -es: watch → watches, go → goes. Если на согласную + y: fly → flies.' },
      { title: 'Постоянные факты и законы природы', text: 'Water boils at 100°C. The Earth revolves around the Sun.' },
      { title: 'Расписания транспорта и мероприятий', text: 'The train departs at 6:30 PM. The movie starts in ten minutes.' },
    ],
    markers: ['always (всегда)', 'usually (обычно)', 'often (часто)', 'sometimes (иногда)', 'rarely / seldom (редко)', 'never (никогда)', 'every day / week (каждый день / неделю)'],
    examples: [
      { original: 'I get up at 7 AM every weekday.', translation: 'Я встаю в 7 утра каждый будний день.', note: 'Регулярная привычка' },
      { original: 'My brother plays soccer on Saturdays.', translation: 'Мой брат играет в футбол по субботам.', note: 'He + глагол с -s' },
      { original: 'Do they have any pets at home?', translation: 'У них есть домашние животные дома?', note: 'Вопрос с вспомогательным Do' },
    ],
    mistakes: [
      { wrong: 'He don\'t know the answer.', correct: 'He doesn\'t know the answer.', explanation: 'С he/she/it в отрицании всегда используется doesn\'t.' },
      { wrong: 'She works hard and she studys.', correct: 'She works hard and she studies.', explanation: 'После согласной буква "y" меняется на "ies": study → studies.' },
    ],
    proTip: 'Лайфхак: если в вопросе или отрицании уже есть does/doesn\'t, у смыслового глагола окончание -s забирается! (Does she like, а не Does she likes).',
  },

  'en-grammar-present-continuous': {
    title: 'Present Continuous (Настоящее длительное)',
    subtitle: 'Действие в момент речи, текущие тренды и временные ситуации',
    overview: 'Present Continuous показывает процесс, разворачивающийся прямо на ваших глазах, либо временную ситуацию, отличающуюся от привычной рутины.',
    formulas: [
      { type: 'positive', label: 'Утверждение (+)', formula: 'I am + V-ing\nHe / She / It is + V-ing\nWe / You / They are + V-ing', example: 'I am reading a book right now. / She is sleeping.' },
      { type: 'negative', label: 'Отрицание (-)', formula: 'Subject + am/is/are + not + V-ing', example: 'They are not (aren\'t) listening to music.' },
      { type: 'question', label: 'Вопрос (?)', formula: 'Am / Is / Are + Subject + V-ing ?', example: 'Are you working on the project right now?' },
    ],
    rules: [
      { title: 'Действие прямо в секунду разговора', text: 'Look! The bus is coming. Why are you shouting?' },
      { title: 'Временная ситуация', text: 'I usually take the metro, but this week I am walking because of nice weather.' },
      { title: 'Глаголы состояния (Stative Verbs) НЕ употребляются в Continuous', text: 'Глаголы чувств, мыслей и обладания (love, know, understand, believe, want, need) используются только в Simple: I understand you (НЕ I am understanding).' },
    ],
    markers: ['now (сейчас)', 'right now (прямо сейчас)', 'at the moment (в данный момент)', 'Look! (Смотри!)', 'Listen! (Слушай!)', 'currently (в настоящее время)', 'these days (в эти дни)'],
    examples: [
      { original: 'Look! It is snowing outside!', translation: 'Смотри! На улице идёт снег!', note: 'Процесс в момент речи' },
      { original: 'We are currently developing a new mobile application.', translation: 'Мы сейчас разрабатываем новое мобильное приложение.', note: 'Текущий проект' },
    ],
    mistakes: [
      { wrong: 'I am wanting a cup of tea right now.', correct: 'I want a cup of tea right now.', explanation: 'Глагол "want" — глагол состояния, не употребляется в Continuous.' },
      { wrong: 'She cooking dinner.', correct: 'She is cooking dinner.', explanation: 'Нельзя забывать глагол-связку to be (am/is/are) перед окончанием -ing.' },
    ],
    proTip: 'Present Continuous можно использовать для 100% договоренностей в будущем: "I am meeting Sarah tonight" (Мы уже договорились о встрече).',
  },

  'en-grammar-past-simple': {
    title: 'Past Simple (Простое прошедшее время)',
    subtitle: 'Завершённые действия в прошлом с указанием конкретного времени',
    overview: 'Past Simple описывает факт или череду событий, которые полностью завершились в прошлом и не привязаны к настоящему моменту.',
    formulas: [
      { type: 'positive', label: 'Утверждение (+)', formula: 'Правильные глаголы: V + -ed\nНеправильные глаголы: V2 (2-я форма)', example: 'I played tennis yesterday. / He went to Chicago last week.' },
      { type: 'negative', label: 'Отрицание (-)', formula: 'Subject + did not (didn\'t) + V1 (начальная форма)', example: 'She didn\'t call me yesterday. (не didn\'t called!)' },
      { type: 'question', label: 'Вопрос (?)', formula: 'Did + Subject + V1 (начальная форма) ?', example: 'Did you see that movie last night?' },
    ],
    rules: [
      { title: 'Правильные глаголы (+ed)', text: 'play → played, work → worked. Если на конце согласная + y: study → studied. Удвоение согласной: stop → stopped.' },
      { title: 'Неправильные глаголы (Irregular Verbs)', text: 'Учатся наизусть: go → went, see → saw, buy → bought, take → took, have → had.' },
      { title: 'Глагол to be в прошлом', text: 'I / he / she / it WAS; we / you / they WERE. Вопрос: Was he there? Отрицание: They weren\'t ready.' },
    ],
    markers: ['yesterday (вчера)', 'last night / week / year (прошлой ночью/на прошлой неделе)', '... ago (тому назад: two days ago)', 'in 2015 (в 2015 году)', 'when I was a child (когда я был ребенком)'],
    examples: [
      { original: 'We moved to New York three years ago.', translation: 'Мы переехали в Нью-Йорк три года назад.', note: 'Конкретное время в прошлом (ago)' },
      { original: 'Did you finish the financial report yesterday?', translation: 'Ты закончил финансовый отчёт вчера?', note: 'Вопрос с Did + инфинитив' },
    ],
    mistakes: [
      { wrong: 'Did you went to school yesterday?', correct: 'Did you go to school yesterday?', explanation: 'После "did" глагол ВСЕГДА возвращается в первую (начальную) форму.' },
      { wrong: 'I didn\'t saw him.', correct: 'I didn\'t see him.', explanation: 'В отрицании didn\'t уже забирает на себя прошедшее время.' },
    ],
    proTip: 'Если в предложении есть слово "yesterday", "ago" или "last...", это на 99% Past Simple, а не Present Perfect!',
  },

  'en-grammar-articles': {
    title: 'Articles: A, An, The (Артикли)',
    subtitle: 'Неопределённый (a/an), определённый (the) и нулевой артикль',
    overview: 'Артикль — определитель существительного. A/An происходит от слова "one" (один из многих), а The — от слова "that" (тот самый, конкретный).',
    formulas: [
      { type: 'positive', label: 'A / An (Неопределённый)', formula: 'A + согласный звук\nAn + гласный звук', example: 'a book, a cat, a university [j]\nan apple, an orange, an honest man [ɒ]' },
      { type: 'positive', label: 'The (Определённый)', formula: 'The + исчисляемые и неисчисляемые', example: 'the sun, the Earth, the man we met yesterday' },
    ],
    rules: [
      { title: 'Правило первого и повторного упоминания', text: 'При первом упоминании предмета ставим A/An: "I saw a dog in the yard." При повторном — The: "The dog was barking happily."' },
      { title: 'Уникальные объекты', text: 'The sun, the moon, the internet, the President of the USA.' },
      { title: 'Географические названия с The', text: 'Океаны, моря, реки, горные цепи и группы островов: the Pacific Ocean, the Alps, the United States.' },
      { title: 'Нулевой артикль (без артикля)', text: 'С именами людей, городами, странами (London, France), неисчисляемыми в общем смысле (Love is great, Coffee gives energy).' },
    ],
    markers: ['a / an: один из многих, любая вещь такого типа', 'the: конкретный предмет, понятный собеседникам'],
    examples: [
      { original: 'She bought an expensive laptop.', translation: 'Она купила дорогой ноутбук.', note: 'An перед гласным звуком [ɪ]' },
      { original: 'Could you pass me the salt, please?', translation: 'Передай мне соль, пожалуйста.', note: 'Конкретная солонка на этом столе' },
    ],
    mistakes: [
      { wrong: 'He is a honest police officer.', correct: 'He is an honest police officer.', explanation: 'Слово honest начинается с немой "h", первый звук — гласный [ɒ], поэтому AN.' },
      { wrong: 'I like the cats in general.', correct: 'I like cats in general.', explanation: 'Когда мы говорим о кошках вообще как о виде, артикль the не нужен.' },
    ],
    proTip: 'Ориентируйтесь не на буквы, а на ЗВУКИ: an hour (звук гласный), но a university (звук [j] — согласный).',
  },

  'en-grammar-modals': {
    title: 'Modal Verbs (Модальные глаголы: Can, Must, Should, May)',
    subtitle: 'Выражение способности, совета, строгого обязательства и разрешения',
    overview: 'Модальные глаголы не называют само действие, а показывают отношение к нему. После них всегда идет инфинитив без частицы to (голый инфинитив).',
    formulas: [
      { type: 'positive', label: 'Can / Could', formula: 'Subject + can + V1 (способность/умение)', example: 'I can swim. / She could play violin when she was five.' },
      { type: 'positive', label: 'Should (Совет)', formula: 'Subject + should + V1 (рекомендация)', example: 'You should drink more water and sleep 8 hours.' },
      { type: 'positive', label: 'Must vs Mustn\'t', formula: 'Must + V1 (обязан) / Mustn\'t + V1 (строго запрещено)', example: 'You must stop at red lights. / You mustn\'t touch this wire.' },
      { type: 'positive', label: 'May / Might', formula: 'May + V1 (вежливое разрешение / вероятность)', example: 'May I come in? / It might rain later.' },
    ],
    rules: [
      { title: 'Никаких окончаний -s!', text: 'Модальные глаголы не меняются по лицам: He can (НЕ he cans), She must (НЕ she musts).' },
      { title: 'Никакой частицы "to" после них', text: 'You should go (НЕ you should to go). Исключение: ought to, have to.' },
      { title: 'Mustn\'t vs Don\'t have to', text: 'Mustn\'t = строго запрещено (табу). Don\'t have to = нет необходимости (можно делать, а можно нет).' },
    ],
    markers: ['advice (совет: should)', 'permission (разрешение: may, can)', 'prohibition (запрет: mustn\'t)', 'ability (способность: can)'],
    examples: [
      { original: 'You should see a doctor as soon as possible.', translation: 'Тебе следует обратиться к врачу как можно скорее.', note: 'Дружеский совет' },
      { original: 'You don\'t have to wake up early tomorrow; it\'s Sunday.', translation: 'Тебе не обязательно вставать рано завтра — ведь воскресенье.', note: 'Отсутствие обязательства' },
    ],
    mistakes: [
      { wrong: 'She cans speak French very well.', correct: 'She can speak French very well.', explanation: 'Модальный глагол can никогда не принимает окончание -s.' },
      { wrong: 'You must to submit your report.', correct: 'You must submit your report.', explanation: 'После must частица "to" никогда не ставится.' },
    ],
    proTip: 'Запомните: Mustn\'t = "Нельзя!", а Don\'t have to = "Не обязательно, по желанию".',
  },

  'en-grammar-future-forms': {
    title: 'Future Forms: Will vs Be Going To',
    subtitle: 'Способы выражения будущего времени в американском английском',
    overview: 'В английском языке будущее выражается разными конструкциями в зависимости от того, когда было принято решение и насколько оно гарантировано.',
    formulas: [
      { type: 'positive', label: 'Will + V1 (Спонтанные решения и обещания)', formula: 'Subject + will (\'ll) + V1', example: 'The phone is ringing. I\'ll answer it! / I promise I won\'t tell anyone.' },
      { type: 'positive', label: 'Be going to + V1 (Планы и очевидные признаки)', formula: 'am/is/are + going to + V1', example: 'Look at those black clouds! It is going to rain. / I am going to buy a car.' },
      { type: 'positive', label: 'Present Continuous (Точные договорённости)', formula: 'am/is/are + V-ing', example: 'I am flying to Miami on Monday (билет уже на руках).' },
    ],
    rules: [
      { title: 'Will — решение "здесь и сейчас"', text: 'Официант подходит к вам в ресторане: "I will have a steak, please" (вы выбрали прямо сейчас).' },
      { title: 'Be going to — намерение, задуманное ранее', text: 'Вы решили купить квартиру месяц назад: "I am going to buy an apartment this year".' },
      { title: 'Be going to — очевидное неизбежное событие', text: 'Если вы видите, что ваза падает со стола: "Watch out! It is going to fall!" (есть визуальные признаки).' },
    ],
    markers: ['will: I promise, I think, maybe, perhaps, spontaneously', 'going to: look at..., already decided, plan, intention'],
    examples: [
      { original: 'Don\'t worry about the dishes, I will wash them.', translation: 'Не переживай о посуде, я помою её.', note: 'Спонтанное предложение помощи' },
      { original: 'We are going to move into our new house next weekend.', translation: 'Мы собираемся переехать в новый дом на следующих выходных.', note: 'Заранее спланированное намерение' },
    ],
    mistakes: [
      { wrong: 'Look at the sky, it will rain any second!', correct: 'Look at the sky, it is going to rain any second!', explanation: 'Когда есть прямое визуальное доказательство, используется "going to".' },
    ],
    proTip: 'В разговорном американском "going to" почти всегда произносится как "gonna": "I\'m gonna call him".',
  },

  'en-grammar-prepositions': {
    title: 'Prepositions of Time & Place: In, On, At',
    subtitle: 'Пирамида предлогов времени и пространства',
    overview: 'Представьте перевёрнутый треугольник: IN — самое широкое (века, страны), ON — среднее (дни, улицы), AT — самое точное (часы, конкретные адреса).',
    formulas: [
      { type: 'positive', label: 'AT (Точная точка)', formula: 'Время: at 5 PM, at midnight, at noon\nМесто: at home, at the bus stop, at 42 Main St.', example: 'Let\'s meet at 7:30 at the station.' },
      { type: 'positive', label: 'ON (Дни, даты, поверхности)', formula: 'Время: on Monday, on July 4th, on my birthday\nМесто: on the table, on the wall, on 5th Avenue', example: 'The parcel is on the kitchen table.' },
      { type: 'positive', label: 'IN (Большие периоды и пространства)', formula: 'Время: in 2026, in summer, in July, in the morning\nМесто: in London, in California, in the car', example: 'I was born in 1998 in Chicago.' },
    ],
    rules: [
      { title: 'Устойчивые исключения с AT', text: 'at night (ночью), at the weekend (по британски, в США чаще: on the weekend), at Christmas.' },
      { title: 'Исключения с IN', text: 'in the morning, in the afternoon, in the evening (но: at night!).' },
      { title: 'Слова-исключения: без предлога вообще', text: 'Перед словами this, last, next, every предлоги времени НЕ ставятся: see you next Monday (НЕ on next Monday).' },
    ],
    markers: ['at: точные часы, адрес с номером', 'on: дни недели, даты, улицы без номеров', 'in: месяцы, сезоны, годы, города, страны'],
    examples: [
      { original: 'The conference begins at 9:00 AM sharp on Monday.', translation: 'Конференция начинается ровно в 9:00 утра в понедельник.', note: 'at для часов, on для дня недели' },
      { original: 'She loves walking in Central Park in autumn.', translation: 'Она любит гулять в Центральном парке осенью.', note: 'in для сезона и территории' },
    ],
    mistakes: [
      { wrong: 'I will see you on the next week.', correct: 'I will see you next week.', explanation: 'Перед словами next/last/this предлоги не ставятся.' },
      { wrong: 'The meeting is in 3 o\'clock.', correct: 'The meeting is at 3 o\'clock.', explanation: 'С точным временем используется at.' },
    ],
    proTip: 'Адрес без номера дома — ON (on Oxford Street). Адрес с номером дома — AT (at 10 Downing Street).',
  },

  'en-grammar-present-perfect': {
    title: 'Present Perfect (Настоящее совершённое)',
    subtitle: 'Связующий мост между прошлым опытом и настоящим моментом',
    overview: 'Present Perfect используется, когда действие произошло в прошлом, но точное время не имеет значения — важен результат или жизненный опыт прямо сейчас.',
    formulas: [
      { type: 'positive', label: 'Утверждение (+)', formula: 'I / You / We / They + have + V3\nHe / She / It + has + V3', example: 'I have lost my wallet (и сейчас у меня его нет!). / She has traveled to 20 countries.' },
      { type: 'negative', label: 'Отрицание (-)', formula: 'Subject + have/has not (haven\'t / hasn\'t) + V3', example: 'They haven\'t finished the project yet.' },
      { type: 'question', label: 'Вопрос (?)', formula: 'Have / Has + Subject + V3 ?', example: 'Have you ever been to New York City?' },
    ],
    rules: [
      { title: 'Жизненный опыт (Ever / Never)', text: 'Have you ever ridden a camel? — I have never eaten sushi.' },
      { title: 'Действие только что завершилось (Just / Already / Yet)', text: 'I have just arrived. She has already sent the email. Have you paid yet?' },
      { title: 'Действие началось в прошлом и длится до сих пор (Since / For)', text: 'I have lived here for 10 years (и до сих пор живу!). She has worked here since 2018.' },
    ],
    markers: ['already (уже)', 'yet (еще не / уже в вопросе)', 'just (только что)', 'ever (когда-либо)', 'never (никогда)', 'since (с тех пор как)', 'for (на протяжении)', 'recently / lately (в последнее время)'],
    examples: [
      { original: 'I have just finished reading this fascinating novel.', translation: 'Я только что закончил читать этот захватывающий роман.', note: 'Результат налицо' },
      { original: 'How long have you known each other?', translation: 'Как давно вы знакомы друг с другом?', note: 'Продолжается до сих пор' },
    ],
    mistakes: [
      { wrong: 'I have seen him yesterday.', correct: 'I saw him yesterday.', explanation: 'Если указано точное время в прошлом (yesterday, ago, last), Present Perfect запрещён — только Past Simple!' },
      { wrong: 'He has lived here since 5 years.', correct: 'He has lived here for 5 years.', explanation: 'Период длительности — FOR. Отправная точка — SINCE (since 2019).' },
    ],
    proTip: 'Разница: "I have been to Paris" (был там и вернулся) vs "He has gone to Paris" (уехал в Париж и сейчас всё ещё там).',
  },

  'en-grammar-conditionals': {
    title: 'Conditionals: Zero, First & Second (Условные предложения)',
    subtitle: 'Законы природы, реальные планы и воображаемые гипотезы',
    overview: 'Условные предложения состоят из двух частей: придаточного условия с IF и главного предложения с результатом.',
    formulas: [
      { type: 'positive', label: 'Zero Conditional (100% законы)', formula: 'If + Present Simple, Present Simple', example: 'If you heat ice, it melts.' },
      { type: 'positive', label: 'First Conditional (Реальное будущее)', formula: 'If + Present Simple, will + V1', example: 'If it rains tomorrow, we will stay at home.' },
      { type: 'positive', label: 'Second Conditional (Воображаемое / Мечта)', formula: 'If + Past Simple, would + V1', example: 'If I won the lottery, I would travel the globe.' },
    ],
    rules: [
      { title: 'Никаких WILL после IF в 1-м типе!', text: 'В русском мы говорим: "Если пойдёт дождь (буд.), я останусь (буд.)". В английском после IF всегда настоящее: "If it rains, I will stay" (НЕ If it will rain).' },
      { title: 'Форма "WERE" для всех лиц во 2-м типе', text: 'В вежливой и литературной речи: "If I were you..." (На твоём месте...), "If she were here...". В разговорном американском допустимо "was", но "were" эталон.' },
    ],
    markers: ['First Conditional: real future probabilities', 'Second Conditional: unreal imaginary present/future situations'],
    examples: [
      { original: 'If she studies diligently, she will easily pass the exam.', translation: 'Если она будет усердно учиться, она легко сдаст экзамен.', note: 'First Conditional: реальный шанс' },
      { original: 'If I had more free time, I would learn Spanish.', translation: 'Если бы у меня было больше свободного времени, я бы учил испанский.', note: 'Second Conditional: гипотеза' },
    ],
    mistakes: [
      { wrong: 'If I will have time tomorrow, I will call you.', correct: 'If I have time tomorrow, I will call you.', explanation: 'В условной части после IF будущее время (will) использовать нельзя.' },
    ],
    proTip: 'Запомните золотую фразу: "If I were you, I would..." — это самый естественный способ дать совет на английском.',
  },

  'en-grammar-passive-voice': {
    title: 'Passive Voice (Пассивный залог)',
    subtitle: 'Когда объект действия или сам результат важнее исполнителя',
    overview: 'Пассивный залог используется в новостях, научных статьях, криминальных сводках или когда исполнитель действия неизвестен или очевиден.',
    formulas: [
      { type: 'positive', label: 'Present Simple Passive', formula: 'am / is / are + V3', example: 'English is spoken all over the world.' },
      { type: 'positive', label: 'Past Simple Passive', formula: 'was / were + V3', example: 'The telephone was invented by Alexander Bell.' },
      { type: 'positive', label: 'Future Simple Passive', formula: 'will be + V3', example: 'The new subway line will be opened next month.' },
      { type: 'positive', label: 'Present Perfect Passive', formula: 'has been / have been + V3', example: 'My smartphone has been stolen!' },
    ],
    rules: [
      { title: 'Формула Пассива', text: 'Любой пассив строится из глагола TO BE в нужном времени + 3-я форма смыслового глагола (V3 / Past Participle).' },
      { title: 'Указание исполнителя с предлогом BY', text: 'Если необходимо упомянуть, кто совершил действие: "The book was written by Stephen King."' },
      { title: 'Указание инструмента с предлогом WITH', text: 'Если действие совершено орудием: "The lock was broken with a crowbar."' },
    ],
    markers: ['by + исполнитель (by Shakespeare)', 'with + инструмент (with a knife)', 'акцент на объекте или событии'],
    examples: [
      { original: 'Millions of smartphones are sold globally every month.', translation: 'Миллионы смартфонов продаются по всему миру каждый месяц.', note: 'Present Passive' },
      { original: 'The championship match was postponed due to torrential rain.', translation: 'Финальный матч чемпионата был перенесён из-за проливного дождя.', note: 'Past Passive' },
    ],
    mistakes: [
      { wrong: 'The car was steal last night.', correct: 'The car was stolen last night.', explanation: 'Всегда используется 3-я форма глагола: steal → stole → stolen.' },
    ],
    proTip: 'Если вам не важно КТО сделал, а важно ЧТО произошло — смело используйте Passive Voice.',
  },

  'en-grammar-phrasal-verbs': {
    title: 'Phrasal Verbs (Фразовые глаголы)',
    subtitle: 'Сердце живой разговорной речи носителей языка',
    overview: 'Фразовый глагол — это сочетание обычного глагола с предлогом или наречием, которое рождает совершенно новое, идиоматическое значение.',
    formulas: [
      { type: 'positive', label: 'Get...', formula: 'get up (вставать), get along (ладить), get over (пережить/справиться)', example: 'I get along well with my teammates.' },
      { type: 'positive', label: 'Look...', formula: 'look for (искать), look after (заботиться), look up (искать в словаре/гуглить)', example: 'Can you look after my cat while I\'m away?' },
      { type: 'positive', label: 'Give...', formula: 'give up (сдаваться), give away (раздавать бесплатно), give back (возвращать)', example: 'Never give up on your dreams!' },
      { type: 'positive', label: 'Turn...', formula: 'turn on / off (включить/выключить), turn down (отклонить / сделать тише)', example: 'She turned down the job offer.' },
    ],
    rules: [
      { title: 'Разделяемые и неразделяемые глаголы', text: 'Если между глаголом и предлогом стоит местоимение, оно ставится в середину: Turn it off (НЕ Turn off it!).' },
      { title: 'Не переводите дословно!', text: '"Look down on" означает презирать, а не просто "смотреть вниз". Учите фразовые глаголы как цельные фразы.' },
    ],
    markers: ['idiomatic expressions', 'daily conversational English'],
    examples: [
      { original: 'Could you please turn down the TV volume a little bit?', translation: 'Не мог бы ты убавить громкость телевизора немного?', note: 'turn down = сделать тише' },
      { original: 'They had to put off the meeting until Friday.', translation: 'Им пришлось отложить встречу до пятницы.', note: 'put off = откладывать' },
    ],
    mistakes: [
      { wrong: 'Turn off it, please.', correct: 'Turn it off, please.', explanation: 'Местоимения (it, them, him) в разделяемых фразовых глаголах ВСЕГДА ставятся в середину.' },
    ],
    proTip: '90% носителей языка в повседневной беседе выберут фразовый глагол вместо книжного аналога (find out вместо discover, give up вместо surrender).',
  },

  'en-grammar-gerund-infinitive': {
    title: 'Gerund vs Infinitive (-ing или to-инфинитив)',
    subtitle: 'Как соединять два глагола подряд правильно',
    overview: 'Когда в предложении встречаются два глагола подряд, второй глагол может принимать форму инфинитива с TO или форму герундия с -ING. Выбор диктуется первым глаголом!',
    formulas: [
      { type: 'positive', label: 'Только Герундий (-ing)', formula: 'enjoy, avoid, mind, consider, suggest, finish, keep + V-ing', example: 'I enjoy swimming. / Would you mind opening the door?' },
      { type: 'positive', label: 'Только Инфинитив (to + V)', formula: 'decide, hope, promise, refuse, manage, want, need + to + V', example: 'We decided to buy a car. / She hopes to win.' },
      { type: 'positive', label: 'Меняют смысл в зависимости от формы', formula: 'stop doing (бросить навсегда) vs stop to do (остановиться, чтобы сделать)\nremember doing (помнить воспоминание) vs remember to do (не забыть сделать)', example: 'He stopped smoking. / He stopped to smoke.' },
    ],
    rules: [
      { title: 'После предлогов — ВСЕГДА герундий!', text: 'Если после глагола или прилагательного стоит ЛЮБОЙ предлог (in, on, at, of, about, for), за ним ВСЕГДА следует V-ing: interested in learning, good at playing.' },
      { title: 'После модальных глаголов — голый инфинитив', text: 'You should go, I can help (без частицы to и без -ing).' },
    ],
    markers: ['after prepositions: always -ing', 'after modal verbs: bare infinitive'],
    examples: [
      { original: 'She is looking forward to seeing you again.', translation: 'Она с нетерпением ждёт новой встречи с тобой.', note: 'to в данном выражении — предлог, поэтому seeing' },
      { original: 'Don\'t forget to lock the door before you leave.', translation: 'Не забудь запереть дверь перед уходом.', note: 'remember / forget to do' },
    ],
    mistakes: [
      { wrong: 'I enjoy to watch classic movies.', correct: 'I enjoy watching classic movies.', explanation: 'После глагола enjoy всегда используется только герундий.' },
      { wrong: 'He is afraid of fly.', correct: 'He is afraid of flying.', explanation: 'После предлога of глагол обязан стоять с окончанием -ing.' },
    ],
    proTip: 'Запомните золотое правило: ПРЕДЛОГ + ГЛАГОЛ = всегда -ING (thank you for coming, good at solving).',
  },

  'en-grammar-reported-speech': {
    title: 'Reported Speech (Косвенная речь)',
    subtitle: 'Правила передачи чужих слов и согласование времён',
    overview: 'Когда вы пересказываете слова другого человека в прошедшем времени (He said that...), времена в английском языке делают шаг назад в прошлое (Backshift of Tenses).',
    formulas: [
      { type: 'positive', label: 'Сдвиг времён (Backshift)', formula: 'Present Simple → Past Simple\nPresent Continuous → Past Continuous\nPast Simple / Present Perfect → Past Perfect\nWill → Would / Can → Could', example: '"I like pizza" → He said he liked pizza.\n"I will help" → She said she would help.' },
      { type: 'positive', label: 'Сдвиг указателей времени', formula: 'today → that day\ntomorrow → the next day\nyesterday → the day before\nhere → there', example: '"I am busy today" → He said he was busy that day.' },
    ],
    rules: [
      { title: 'Разница между SAY и TELL', text: 'Say используется БЕЗ указания лица: He said that... Tell требует адресата: He told ME that... (НЕ he said to me).' },
      { title: 'Косвенные вопросы', text: 'Порядок слов в косвенном вопросе становится ПРЯМЫМ, а вопросительные did/do исчезают: "Where do you live?" → He asked me where I lived.' },
    ],
    markers: ['he said that...', 'she told me that...', 'they asked if...'],
    examples: [
      { original: 'Emma said, "I have lost my passport." → Emma told us that she had lost her passport.', translation: 'Эмма сказала нам, что потеряла паспорт.', note: 'Present Perfect сдвинулся в Past Perfect' },
      { original: 'Mark asked, "Can you drive?" → Mark asked if I could drive.', translation: 'Марк спросил, умею ли я водить.', note: 'Вопрос "да/нет" вводится союзом if' },
    ],
    mistakes: [
      { wrong: 'He said me that he was tired.', correct: 'He told me that he was tired.', explanation: 'С местоимением me используется told, а не said.' },
      { wrong: 'She asked me where did I live.', correct: 'She asked me where I lived.', explanation: 'В косвенной речи нет вопросительного порядка слов и вспомогательного did.' },
    ],
    proTip: 'Если цитируется общеизвестная вечная истина, время можно не менять: "The teacher said that water boils at 100°C".',
  },

  'en-grammar-third-conditional': {
    title: 'Third Conditional (Условные предложения 3-го типа)',
    subtitle: 'Сожаления о прошлом и альтернативные сценарии истории',
    overview: 'Third Conditional используется для ситуаций в прошлом, которые НЕ произошли. Мы лишь фантазируем, как всё могло бы сложиться иначе. Изменить ничего уже нельзя.',
    formulas: [
      { type: 'positive', label: 'Формула 3-го типа', formula: 'If + had + V3 (Past Perfect), would have + V3', example: 'If I had studied harder, I would have passed the bar exam.' },
      { type: 'negative', label: 'Отрицательная форма', formula: 'If + hadn\'t + V3, wouldn\'t have + V3', example: 'If we hadn\'t missed our flight, we wouldn\'t have spent the night in Paris.' },
      { type: 'question', label: 'Вопрос', formula: 'What would you have done if you had known the truth?', example: 'Что бы ты сделал, если бы знал правду?' },
    ],
    rules: [
      { title: 'Никогда не ставьте WOULD HAVE сразу после IF', text: 'Формула строгая: после IF идет had + V3, а результат — would have + V3: "If you had told me, I would have helped you".' },
      { title: 'Вместо would можно использовать could / might have', text: 'If we had taken a taxi, we might have arrived on time (мы, возможно, успели бы).' },
    ],
    markers: ['unreal past', 'regrets about past events', 'counterfactual history'],
    examples: [
      { original: 'If I had known you were in the hospital, I would have visited you.', translation: 'Если бы я знал, что ты в больнице, я бы навестил тебя.', note: 'Но я не знал и не навестил' },
      { original: 'She wouldn\'t have caught a cold if she had worn a warm winter coat.', translation: 'Она бы не простудилась, если бы надела тёплое зимнее пальто.', note: 'Сожаление о прошлом действии' },
    ],
    mistakes: [
      { wrong: 'If I would have known, I would have told you.', correct: 'If I had known, I would have told you.', explanation: 'В условной части после IF запрещено ставить would have.' },
    ],
    proTip: 'В беглой американской речи "would have" сокращается до "would\'ve" [wʊdəv] или даже звучит как "woulda".',
  },

  // ==========================================
  // GERMAN GRAMMAR RULES (DETAILED)
  // ==========================================

  'de-grammar-artikel': {
    title: 'Artikel: Der, Die, Das (Артикли в немецком)',
    subtitle: 'Род существительных — основа основ грамматики немецкого',
    overview: 'В немецком языке у каждого существительного есть грамматический род: мужской (der), женский (die) или средний (das). Род часто не совпадает с русским!',
    formulas: [
      { type: 'positive', label: 'Мужской род (Maskulinum)', formula: 'der Mann, der Tisch, der Computer, der Hund', example: 'Der Tisch ist sehr stabil.' },
      { type: 'positive', label: 'Женский род (Femininum)', formula: 'die Frau, die Sonne, die Lampe, die Katze', example: 'Die Sonne scheint heute hell.' },
      { type: 'positive', label: 'Средний род (Neutrum)', formula: 'das Kind, das Buch, das Auto, das Haus', example: 'Das Auto fährt sehr schnell.' },
      { type: 'positive', label: 'Множественное число (Plural)', formula: 'die Männer, die Tische, die Bücher', example: 'Die Bücher liegen auf dem Tisch.' },
    ],
    rules: [
      { title: 'Суффиксы женского рода (100% die)', text: 'Существительные на -ung, -heit, -keit, -schaft, -tät, -ion, -ie, -ei: die Zeitung, die Freiheit, die Möglichkeit, die Nation.' },
      { title: 'Суффиксы среднего рода (100% das)', text: 'Уменьшительные на -chen, -lein: das Mädchen, das Brötchen. Заимствования на -ment, -um: das Dokument, das Museum.' },
      { title: 'Суффиксы мужского рода (100% der)', text: 'Профессии на -er, -or, -ist: der Lehrer, der Motor, der Optimist. Дни недели, месяцы, сезоны: der Montag, der Juli, der Sommer.' },
    ],
    markers: ['die: -ung, -heit, -keit, -schaft, -tät, -ion', 'das: -chen, -lein, -ment, -um', 'der: дни недели, месяцы, времена года, стороны света'],
    examples: [
      { original: 'Das Mädchen liest eine interessante Zeitung.', translation: 'Девочка читает интересную газету.', note: 'Mädchen средний род (-chen), Zeitung женский (-ung)' },
      { original: 'Der Kaffee ist heiß, aber das Wasser ist kalt.', translation: 'Кофе горячий, а вода холодная.', note: 'der Kaffee (муж. р.), das Wasser (ср. р.)' },
    ],
    mistakes: [
      { wrong: 'Die Mädchen spielt draußen.', correct: 'Das Mädchen spielt draußen.', explanation: 'Все существительные с суффиксом -chen — строго среднего рода (das).' },
    ],
    proTip: 'Учите каждое немецкое слово ВСЕГДА вместе с его артиклем и формой множественного числа (der Tisch, die Tische).',
  },

  'de-grammar-praesens': {
    title: 'Präsens (Настоящее время в немецком)',
    subtitle: 'Спряжение регулярных и сильных глаголов с чередованием гласных',
    overview: 'Präsens используется для действий в настоящем времени, а также для планов на будущее (с указанием времени: "Morgen fliege ich nach Berlin").',
    formulas: [
      { type: 'positive', label: 'Личные окончания слабых глаголов', formula: 'ich -e\ndu -st\ner/sie/es -t\nwir -en\nihr -t\nsie/Sie -en', example: 'ich lerne, du lernst, er lernt, wir lernen, ihr lernt, sie lernen' },
      { type: 'positive', label: 'Сильные глаголы (чередование e → i / ie)', text: 'Меняются только во 2-м (du) и 3-м (er/sie/es) лице!', formula: 'sprechen: du sprichst, er spricht\nsehen: du siehst, er sieht\nlesen: du liest, er liest', example: 'Er spricht fließend Deutsch.' },
      { type: 'positive', label: 'Сильные глаголы (умлаут a → ä)', formula: 'fahren: du fährst, er fährt\nschlafen: du schläfst, er schläft', example: 'Der Zug fährt um 8 Uhr ab.' },
    ],
    rules: [
      { title: 'Глагол ВСЕГДА на 2-м месте в простом предложении', text: 'Золотое правило немецкого: даже если предложение начинается со времени или места, сказуемое обязано стоять ровно на второй позиции! "Heute lerne ich Deutsch" (НЕ Heute ich lerne).' },
      { title: 'Глаголы sein и haben', text: 'Неправильные: sein (ich bin, du bist, er ist, wir sind, ihr seid, sie sind) и haben (ich habe, du hast, er hat, wir haben, ihr habt, sie haben).' },
    ],
    markers: ['heute (сегодня)', 'jetzt (сейчас)', 'jeden Tag (каждый день)', 'immer (всегда)', 'oft (часто)'],
    examples: [
      { original: 'Morgen fahre ich mit meiner Familie nach München.', translation: 'Завтра я еду со своей семьёй в Мюнхен.', note: 'Глагол fahre строго на 2-м месте' },
      { original: 'Sie liest jeden Abend ein spanisches Buch.', translation: 'Она читает каждый вечер испанскую книгу.', note: 'Сильный глагол: lesen → sie liest' },
    ],
    mistakes: [
      { wrong: 'Heute ich gehe ins Kino.', correct: 'Heute gehe ich ins Kino.', explanation: 'Порядок слов: глагол ВСЕГДА на втором месте в повествовательном предложении.' },
      { wrong: 'Du sprecht sehr schnell.', correct: 'Du sprichst sehr schnell.', explanation: 'Для du окончание -st + смена гласной e на i.' },
    ],
    proTip: 'Если хотите сказать о будущем, немцы почти всегда используют простое Präsens + слово времени: "Morgen koche ich Pasta" (Завтра я приготовлю пасту).',
  },

  'de-grammar-modalverben': {
    title: 'Modalverben (Модальные глаголы в немецком)',
    subtitle: 'Können, Müssen, Dürfen, Wollen, Sollen, Möchten',
    overview: 'Модальные глаголы выражают отношение к действию. Спрягаемый модальный глагол занимает почетное 2-е место, а смысловой глагол в начальной форме (инфинитиве) улетает в САМЫЙ КОНЕЦ предложения!',
    formulas: [
      { type: 'positive', label: 'Значения модальных глаголов', formula: 'können — мочь, уметь (физически)\nmüssen — быть должным (необходимость)\ndürfen — иметь разрешение (nicht dürfen = строго нельзя!)\nwollen — твердо хотеть (намерение)\nsollen — быть обязанным по чьему-то наказу/совету\nmöchten — вежливое "хотел бы"', example: 'Ich kann schwimmen. / Hier darf man nicht parken.' },
      { type: 'positive', label: 'Правило рамки (Satzklammer)', formula: 'Позиция 2: Модальный глагол\nКонец: Инфинитив', example: 'Wir [müssen] heute sehr viel [arbeiten].' },
    ],
    rules: [
      { title: 'Формы ich и er/sie/es СОВПАДАЮТ и не имеют окончаний!', text: 'ich kann = er kann (без -t!), ich muss = er muss, ich will = er will, ich darf = er darf.' },
      { title: 'Корневая гласная теряет умлаут в единственном числе', text: 'können: ich kann, du kannst, er kann (но: wir können!). müssen: ich muss, du musst, er muss (но: wir müssen!).' },
    ],
    markers: ['verboten (запрещено: darf nicht)', 'notwendig (необходимо: muss)', 'Fähigkeit (умение: kann)'],
    examples: [
      { original: 'Entschuldigung, können Sie mir bitte den Weg zum Bahnhof zeigen?', translation: 'Извините, не могли бы вы показать мне дорогу к вокзалу?', note: 'können на 1-м месте в вопросе, zeigen в конце' },
      { original: 'Wir möchten gern zwei Tassen Kaffee und einen Apfelstrudel bestellen.', translation: 'Мы хотели бы заказать две чашки кофе и яблочный штрудель.', note: 'вежливый заказ в ресторане' },
    ],
    mistakes: [
      { wrong: 'Er kannt sehr gut Klavier spielen.', correct: 'Er kann sehr gut Klavier spielen.', explanation: 'В 3-м лице (er/sie/es) у модальных глаголов НЕТ окончания -t!' },
      { wrong: 'Ich muss gehen nach Hause.', correct: 'Ich muss nach Hause gehen.', explanation: 'Инфинитив "gehen" ОБЯЗАН стоять на самом последнем месте в предложении.' },
    ],
    proTip: 'В Германии Nicht dürfen = категорический запрет (табу, штраф), а Nicht müssen = не обязательно (по желанию).',
  },

  'de-grammar-perfekt': {
    title: 'Perfekt (Разговорное прошедшее время)',
    subtitle: 'Основное время для общения, историй и переписки',
    overview: 'В 95% устной речи немцы используют именно Perfekt. Оно строится из вспомогательного глагола haben или sein + смыслового глагола в форме Partizip II на последнем месте.',
    formulas: [
      { type: 'positive', label: 'С HABEN (90% глаголов)', formula: 'haben + Partizip II (ge-...-t / ge-...-en)', example: 'Ich habe eine Pizza gegessen. / Er hat seine Hausaufgaben gemacht.' },
      { type: 'positive', label: 'С SEIN (Движение и смена состояния)', formula: 'sein + Partizip II', example: 'fahren, gehen, fliegen, kommen, aufstehen, sterben, passieren:\nEr ist nach Berlin gefahren. / Wir sind früh aufgestanden.' },
    ],
    rules: [
      { title: 'Образование Partizip II правильных глаголов', text: 'Приставка ge- + корень + суффикс -t: machen → gemacht, lernen → gelernt, kaufen → gekauft.' },
      { title: 'Глаголы на -ieren НЕ получают приставку ge-', text: 'studieren → studiert, reparieren → repariert, fotografieren → fotografiert.' },
      { title: 'Неотделяемые приставки (be-, ge-, er-, ver-, zer-) не принимают ge-', text: 'bekommen → bekommen, verstehen → verstanden, bezahlen → bezahlt.' },
    ],
    markers: ['gestern (вчера)', 'letzte Woche (на прошлой неделе)', 'vor zwei Tagen (два дня назад)', 'schon (уже)'],
    examples: [
      { original: 'Gestern bin ich um 7 Uhr aufgewacht und habe Sport gemacht.', translation: 'Вчера я проснулся в 7 утра и занялся спортом.', note: 'aufwachen с sein, machen с haben' },
      { original: 'Was hast du am Wochenende Schönes gemacht?', translation: 'Что хорошего ты делал на выходных?', note: 'Стандартный разговорный вопрос' },
    ],
    mistakes: [
      { wrong: 'Ich habe nach Hause gegangen.', correct: 'Ich bin nach Hause gegangen.', explanation: 'Глаголы движения из пункта А в пункт Б спрягаются только с SEIN.' },
      { wrong: 'Er hat das Auto gerepariert.', correct: 'Er hat das Auto repariert.', explanation: 'Глаголы на -ieren не принимают приставку ge-.' },
    ],
    proTip: 'Запомните глаголы-исключения с SEIN: sein (ich bin gewesen — я был) и bleiben (ich bin geblieben — я остался), хотя движения в них нет!',
  },

  'de-grammar-trennbare-verben': {
    title: 'Trennbare Verben (Отделяемые приставки)',
    subtitle: 'Глаголы-трансформеры с катапультирующейся приставкой',
    overview: 'В немецком языке приставки могут кардинально менять смысл глагола (stehen — стоять, но aufstehen — вставать). При этом в простом предложении отделяемая приставка отрывается и улетает в самый конец предложения.',
    formulas: [
      { type: 'positive', label: 'Схема в предложении', formula: 'Подлежащее + Корневой глагол (поз. 2) + ... + ПРИСТАВКА (конец)', example: 'Ich [stehe] jeden Morgen um 6:30 Uhr [auf].' },
      { type: 'positive', label: 'Популярные отделяемые приставки', formula: 'ab-, an-, auf-, aus-, ein-, mit-, vor-, weg-, zu-, zurück-', example: 'anrufen (звонить): Ich rufe dich an.\neinkaufen (покупать): Wir kaufen im Supermarkt ein.' },
    ],
    rules: [
      { title: 'Приставка всегда под ударением!', text: 'Если приставка отделяемая, ударение падает строго на неё: Áufstehen, Ánrufen, Éinkaufen.' },
      { title: 'С модальным глаголом приставка НЕ отделяется', text: 'Если в предложении есть модальный глагол, инфинитив идёт в конец целиком: "Ich muss morgen früh aufstehen".' },
      { title: 'Неотделяемые приставки (be-, ge-, er-, ver-, zer-, ent-, emp-, miss-)', text: 'Никогда не отделяются и являются безударными: verstehen, bezahlen, erleben.' },
    ],
    markers: ['aufstehen, anrufen, fernsehen, mitbringen, vorbereiten, einladen'],
    examples: [
      { original: 'Wann rufst du deine Großmutter an?', translation: 'Когда ты позвонишь своей бабушке?', note: 'anrufen: приставка an в конце вопроса' },
      { original: 'Am Abend sehen wir gern einen spannenden Film fern.', translation: 'Вечером мы с удовольствием смотрим увлекательный фильм по телевизору.', note: 'fernsehen: приставка fern в конце' },
    ],
    mistakes: [
      { wrong: 'Ich aufstehe um sieben.', correct: 'Ich stehe um sieben auf.', explanation: 'Приставка обязана отделиться и встать на последнее место.' },
    ],
    proTip: 'Запомните стишок для неотделяемых приставок: "be-, ge-, er-, ver-, zer-, ent-, emp-, miss- — приставку эту никогда от корня не отгрызть!".',
  },

  'de-grammar-nebensaetze': {
    title: 'Nebensätze (Придаточные предложения: weil, dass, wenn)',
    subtitle: 'Королевское правило немецкого синтаксиса — глагол в конце',
    overview: 'Подчинительные союзы создают придаточное предложение, в котором спрягаемый глагол силой грамматического магнита выталкивается на САМОЕ ПОСЛЕДНЕЕ место.',
    formulas: [
      { type: 'positive', label: 'Weil (потому что)', formula: '..., weil + Подлежащее + ... + Спрягаемый глагол.', example: 'Ich lerne Deutsch, weil ich in Wien leben und arbeiten will.' },
      { type: 'positive', label: 'Dass (что)', formula: '..., dass + Подлежащее + ... + Спрягаемый глагол.', example: 'Ich weiß, dass du recht hast.' },
      { type: 'positive', label: 'Wenn (если / когда)', formula: 'Wenn + ..., + глагол (поз. 1) + ...', example: 'Wenn das Wetter schön ist, gehen wir im Wald spazieren.' },
      { type: 'positive', label: 'Obwohl (хотя)', formula: '..., obwohl + Подлежащее + ... + глагол.', example: 'Er kam pünktlich, obwohl der Zug Verspätung hatte.' },
    ],
    rules: [
      { title: 'Запятая перед союзом обязательна!', text: 'В немецком языке перед подчинительными союзами всегда ставится запятая.' },
      { title: 'Если придаточное стоит первым', text: 'Главное предложение сразу после запятой начинается со сказуемого (правило глагол к глаголу): "Wenn es regnet, BLEIBE ich zu Hause".' },
    ],
    markers: ['weil (потому что)', 'dass (что)', 'wenn (если / когда)', 'obwohl (хотя)', 'ob (ли)', 'da (так как)'],
    examples: [
      { original: 'Sie freut sich sehr, weil sie die Führerscheinprüfung bestanden hat.', translation: 'Она очень рада, потому что сдала экзамен на водительские права.', note: 'Вспомогательный глагол hat на последней позиции' },
      { original: 'Er glaubt nicht, dass dieser Plan in der Praxis funktionieren kann.', translation: 'Он не верит, что этот план может сработать на практике.', note: 'Спрягаемый модальный глагол kann замыкает фразу' },
    ],
    mistakes: [
      { wrong: 'Ich kann nicht kommen, weil ich bin krank.', correct: 'Ich kann nicht kommen, weil ich krank bin.', explanation: 'После weil глагол bin ОБЯЗАН стоять на самом последнем месте.' },
    ],
    proTip: 'Помните формулу KATI: Konjunktion (союз) + Akteur (подлежащее) + Text (остальное) + Infinitiv/Verb (глагол на финише).',
  },

  'de-grammar-futur-1': {
    title: 'Futur I (Будущее время с werden)',
    subtitle: 'Выражение будущих событий, планов и предположений',
    overview: 'Futur I образуется с помощью вспомогательного глагола werden в личной форме на 2-м месте + смыслового инфинитива в самом конце предложения.',
    formulas: [
      { type: 'positive', label: 'Спряжение глагола werden', formula: 'ich werde\ndu wirst\ner/sie/es wird\nwir werden\nihr werdet\nsie/Sie werden', example: 'ich werde lernen, du wirst reisen, er wird ankommen' },
      { type: 'positive', label: 'Формула предложения', formula: 'Подлежащее + werden (поз. 2) + ... + Infinitiv (конец)', example: 'Wir [werden] im nächsten Sommer nach Spanien [fliegen].' },
    ],
    rules: [
      { title: 'Futur I для выражения предположения (Vermutung)', text: 'Очень часто Futur I используется не только для будущего, но и для предположений о настоящем: "Wo ist Markus? — Er wird wohl im Büro sein" (Он, должно быть, в офисе).' },
      { title: 'В разговорной речи будущее часто заменяется на Präsens', text: 'Если есть слово времени (morgen, nächste Woche), немцы обычно говорят: "Morgen kaufe ich ein neues Auto" вместо Futur I.' },
    ],
    markers: ['morgen (завтра)', 'bald (скоро)', 'in der Zukunft (в будущем)', 'nächstes Jahr (в следующем году)', 'wohl / bestimmt (наверное / определенно)'],
    examples: [
      { original: 'Die Experten sagen, dass die Technologie sich rasant entwickeln wird.', translation: 'Эксперты говорят, что эта технология будет стремительно развиваться.', note: 'Futur I в придаточном предложении' },
      { original: 'Keine Sorge, du wirst die Prüfung sicher mit Bravour bestehen!', translation: 'Не переживай, ты обязательно с блеском сдашь экзамен!', note: 'Ободрение и уверенный прогноз' },
    ],
    mistakes: [
      { wrong: 'Du wird das schaffen.', correct: 'Du wirst das schaffen.', explanation: 'Для местоимения du форма глагола werden — wirst.' },
    ],
    proTip: 'Если хотите звучать максимально естественно: используйте Futur I для торжественных обещаний ("Ich werde dich nie vergessen!") или предположений.',
  },

  'de-grammar-adjektivdeklination': {
    title: 'Adjektivdeklination (Склонение прилагательных)',
    subtitle: 'Окончания прилагательных перед существительными',
    overview: 'Когда прилагательное стоит перед существительным (das schöne Haus), оно обязано получить окончание в зависимости от рода, падежа и предшествующего артикля.',
    formulas: [
      { type: 'positive', label: 'После определенного артикля (der, die, das)', formula: 'В Nominativ: -e для муж., жен., ср. рода\nВо всех падежах Dativ, Genitiv, Akkusativ (муж. р.) и во множественном числе: окончание -EN!', example: 'der nette Mann, die schöne Stadt, das kleine Kind\nABER: mit dem netten Mann, die neuen Autos' },
      { type: 'positive', label: 'После неопределенного артикля (ein, eine, ein)', formula: 'Прилагательное добирает признак рода артикля: ein gut-er Mann (der), eine schön-e Frau (die), ein neu-es Auto (das)', example: 'Ich habe ein neues Auto gekauft.' },
    ],
    rules: [
      { title: 'Золотое правило DATIV и PLURAL', text: 'В Dativ и во множественном числе после ЛЮБОГО артикля или притяжательного местоимения (meine, seine) прилагательное ВСЕГДА получает окончание -EN!' },
      { title: 'Краткая предикативная форма (после глагола)', text: 'Если прилагательное стоит после глагола sein, оно НЕ склоняется: "Das Haus ist schön" (без окончаний).' },
    ],
    markers: ['Nominativ: der schöne..., ein schöner...', 'Akkusativ муж. р.: den neuen..., einen neuen...', 'Dativ: dem alten..., einer alten...'],
    examples: [
      { original: 'Ich habe gestern einen spannenden Kriminalroman gelesen.', translation: 'Я прочитал вчера захватывающий детективный роман.', note: 'Akkusativ муж. р.: einen spannenden' },
      { original: 'Wir wohnen in einer ruhigen und grünen Gegend.', translation: 'Мы живём в тихом и зелёном районе.', note: 'Dativ жен. р.: in einer ruhigen' },
    ],
    mistakes: [
      { wrong: 'Ich trinke gern kalt Wasser.', correct: 'Ich trinke gern kaltes Wasser.', explanation: 'Перед существительным прилагательное обязательно должно склоняться (kaltes Wasser — ср. род, без артикля).' },
    ],
    proTip: 'Если вы сомневаетесь в Dativ или множественном числе — смело ставьте окончание -EN, вы угадаете в 99% случаев!',
  },

  'de-grammar-akkusativ-dativ': {
    title: 'Akkusativ und Dativ (Винительный и Дательный падежи)',
    subtitle: 'Кого/что? (Akkusativ) против Кому/где? (Dativ)',
    overview: 'Падежи показывают роль слова в предложении. Akkusativ отвечает на вопросы Wen? Was? (Кого? Что?) и Wohin? (Куда?). Dativ отвечает на вопросы Wem? (Кому?) и Wo? (Где?).',
    formulas: [
      { type: 'positive', label: 'Akkusativ (меняется ТОЛЬКО мужской род!)', formula: 'der → den (einen, meinen)\ndie → die (eine, meine)\ndas → das (ein, mein)\nPlural → die (meine)', example: 'Ich sehe den Hund. / Ich trinke einen Kaffee.' },
      { type: 'positive', label: 'Dativ (меняется всё!)', formula: 'der / das → dem (einem, meinem)\ndie → der (einer, meiner)\nPlural → den + -n (meinen Freunden)', example: 'Ich helfe dem Mann. / Sie dankt der Lehrerin.' },
    ],
    rules: [
      { title: 'Глаголы, требующие только DATIV', text: 'helfen (помогать), danken (благодарить), gefallen (нравиться), gehören (принадлежать), gratulieren (поздравлять), antworten (отвечать): "Ich gratuliere dir!"' },
      { title: 'Предлоги строго с Akkusativ (DOGFU)', text: 'durch, ohne, gegen, für, um. После них ВСЕГДА Akkusativ: "Das Geschenk ist für meinen Vater".' },
      { title: 'Предлоги строго с Dativ', text: 'aus, bei, mit, nach, seit, von, zu, gegenüber. После них ВСЕГДА Dativ: "Ich fahre mit dem Bus".' },
    ],
    markers: ['Akkusativ: durch, für, gegen, ohne, um', 'Dativ: aus, bei, mit, nach, seit, von, zu', 'Dativ-глаголы: helfen, danken, gefallen, gehören'],
    examples: [
      { original: 'Der Vater schenkt seinem Sohn ein neues Fahrrad.', translation: 'Отец дарит своему сыну новый велосипед.', note: 'Кому? Sohn (Dativ: seinem). Что? Fahrrad (Akkusativ: ein neues)' },
      { original: 'Seit einem Jahr lerne ich täglich Deutsch.', translation: 'Уже на протяжении года я ежедневно учу немецкий.', note: 'Предлог seit строго с Dativ: einem Jahr' },
    ],
    mistakes: [
      { wrong: 'Ich helfe dich.', correct: 'Ich helfe dir.', explanation: 'Глагол helfen требует исключительно Dativ (dir, а не dich).' },
      { wrong: 'Das ist für mein Vater.', correct: 'Das ist für meinen Vater.', explanation: 'Предлог für требует Akkusativ (den / meinen Vater).' },
    ],
    proTip: 'Запомните аббревиатуру предлогов Akkusativ: DOGFU (Durch, Ohne, Gegen, Für, Um). Все они требуют только Akkusativ!',
  },

  'de-grammar-wechselpraepositionen': {
    title: 'Wechselpräpositionen (Предлоги двойного управления)',
    subtitle: 'Куда? (Akkusativ) или Где? (Dativ)',
    overview: 'Девять предлогов: in, an, auf, neben, hinter, über, unter, vor, zwischen. Если есть движение и вопрос "Куда?" (Wohin?) — ставим Akkusativ. Если покой, местонахождение и вопрос "Где?" (Wo?) — ставим Dativ.',
    formulas: [
      { type: 'positive', label: 'Вопрос WOHIN? (Куда? Направление) → AKKUSATIV', formula: 'Ich lege das Buch auf den Tisch.\nWir gehen in das (ins) Kino.', example: 'stellen (ставить), legen (класть), hängen (вешать) — куда?' },
      { type: 'positive', label: 'Вопрос WO? (Где? Местоположение) → DATIV', formula: 'Das Buch liegt auf dem Tisch.\nWir sind in dem (im) Kino.', example: 'stehen (стоять), liegen (лежать), hängen (висеть) — где?' },
    ],
    rules: [
      { title: 'Парные глаголы действия и состояния', text: 'legen (класть куда? Akk) — liegen (лежать где? Dat)\nstellen (ставить куда? Akk) — stehen (стоять где? Dat)\nsetzen (сажать куда? Akk) — sitzen (сидеть где? Dat)' },
      { title: 'Популярные слияния с артиклями', text: 'in + das = ins (ins Kino), in + dem = im (im Park), an + das = ans (ans Meer), an + dem = am (am Bahnhof).' },
    ],
    markers: ['in, an, auf, neben, hinter, über, unter, vor, zwischen', 'Wohin? (Akkusativ) vs Wo? (Dativ)'],
    examples: [
      { original: 'Er hängt das bunte Bild an die weiße Wand.', translation: 'Он вешает цветную картину на белую стену.', note: 'Куда? Направление → Akkusativ (an die Wand)' },
      { original: 'Jetzt hängt das bunte Bild an der weißen Wand.', translation: 'Теперь картина висит на белой стене.', note: 'Где? Местоположение → Dativ (an der Wand)' },
    ],
    mistakes: [
      { wrong: 'Ich gehe in dem Park spazieren.', correct: 'Ich gehe in den Park spazieren.', explanation: 'Иду (куда?) в парк — направление требует Akkusativ (in den Park).' },
    ],
    proTip: 'Формула-подсказка: Движение к цели = Akkusativ. Нахождение на месте = Dativ.',
  },

  'de-grammar-praeteritum': {
    title: 'Präteritum (Литературное прошедшее время)',
    subtitle: 'Время книг, прессы, новостей и сказок',
    overview: 'Präteritum — простое прошедшее время из одного слова. В разговорной речи оно обязательно используется для глаголов sein (war) и haben (hatte), а также для всех модальных глаголов.',
    formulas: [
      { type: 'positive', label: 'Формы sein и haben (обязательны в речи!)', formula: 'sein: ich war, du warst, er war, wir waren, ihr wart, sie waren\nhaben: ich hatte, du hattest, er hatte, wir hatten, ihr hattet, sie hatten', example: 'Gestern war ich krank. / Wir hatten keine Zeit.' },
      { type: 'positive', label: 'Слабые глаголы: суффикс -te', formula: 'machen → machte, lernen → lernte, wohnen → wohnte', example: 'Er lebte viele Jahre in Hamburg.' },
      { type: 'positive', label: 'Модальные глаголы в Präteritum', formula: 'können → konnte, müssen → musste, wollen → wollte, dürfen → durfte', example: 'Ich musste gestern lange im Büro arbeiten.' },
    ],
    rules: [
      { title: 'Формы ich и er/sie/es всегда совпадают!', text: 'В Präteritum у 1-го и 3-го лица одинаковая форма без окончания: ich war = er war, ich machte = er machte.' },
      { title: 'У модальных глаголов исчезает умлаут', text: 'müssen → musste, können → konnte, dürfen → durfte (без точек!).' },
    ],
    markers: ['es war einmal (жили-были)', 'damals (в те времена)', 'früher (раньше)'],
    examples: [
      { original: 'Im 18. Jahrhundert gab es noch keinen elektrischen Strom.', translation: 'В 18 веке ещё не было электрического тока.', note: 'es gab (форма Präteritum от es gibt)' },
      { original: 'Wir wollten ins Theater gehen, aber es gab keine Karten mehr.', translation: 'Мы хотели пойти в театр, но билетов уже не было.', note: 'wollten — модальный глагол в Präteritum' },
    ],
    mistakes: [
      { wrong: 'Gestern er ware zu Hause.', correct: 'Gestern war er zu Hause.', explanation: 'Форма 3-го лица: er war (без -e на конце).' },
    ],
    proTip: 'В диалоге никто не скажет "Ich habe gestern keine Zeit gehabt". Все скажут коротко и естественно: "Ich hatte gestern keine Zeit".',
  },

  'de-grammar-genitiv': {
    title: 'Genitiv (Родительный падеж и предлоги)',
    subtitle: 'Вопрос Wessen? (Чей?) и предлоги wegen, während, trotz',
    overview: 'Genitiv обозначает принадлежность (чей?) и используется с группой благородных предлогов. Он придаёт речи высокую грамотность и элегантность.',
    formulas: [
      { type: 'positive', label: 'Артикли в Genitiv', formula: 'Мужской род: des Mannes (+s/es)\nСредний род: des Kindes (+s/es)\nЖенский род: der Frau\nМножественное число: der Kinder', example: 'Das Auto meines Vaters ist nagelneu.' },
      { type: 'positive', label: 'Главные предлоги с Genitiv', formula: 'wegen (из-за)\nwährend (во время)\ntrotz (несмотря на)\nanstatt / statt (вместо)', example: 'Wegen des Regens blieben wir zu Hause. / Während der Reise habe ich viel gelernt.' },
    ],
    rules: [
      { title: 'Окончания существительных -s / -es', text: 'Существительные мужского и среднего рода получают окончание -s (des Computers) или -es для коротких и оканчивающихся на s, z, sch, t (des Hauses, des Mannes, des Kindes).' },
      { title: 'Женский род и множественное число', text: 'Существительные женского рода и во множественном числе окончания НЕ получают (меняется только артикль на DER: der Frau, der Kinder).' },
    ],
    markers: ['Wessen? (Чей?)', 'wegen (из-за)', 'während (во время)', 'trotz (несмотря на)'],
    examples: [
      { original: 'Trotz des schlechten Wetters machten die Wanderer einen langen Ausflug.', translation: 'Несмотря на плохую погоду, туристы совершили долгую прогулку.', note: 'Trotz des schlechten Wetters (Genitiv)' },
      { original: 'Die Meinung unseres Chefs ist für das Team sehr wichtig.', translation: 'Мнение нашего шефа очень важно для команды.', note: 'Wessen Meinung? Unseres Chefs' },
    ],
    mistakes: [
      { wrong: 'Wegen dem Wetter fahre ich nicht.', correct: 'Wegen des Wetters fahre ich nicht.', explanation: 'В литературном немецком предлог wegen требует строго Genitiv (des Wetters).' },
    ],
    proTip: 'Есть известная немецкая поговорка: "Der Dativ ist dem Genitiv sein Tod" (Датив — смерть генитива). В разговорной речи немцы часто упрощают до Dativ, но на экзаменах B1/B2 Genitiv обязателен!',
  },

  'de-grammar-passiv': {
    title: 'Passiv: Vorgangspassiv (Пассивный залог)',
    subtitle: 'Фокус на процессе и результате, а не на авторе действия',
    overview: 'В пассиве главным становится объект: "Дом строится", "Письмо было отправлено". Субъект либо опускается, либо вводится предлогом VON (+ Dativ).',
    formulas: [
      { type: 'positive', label: 'Präsens Passiv (Настоящее)', formula: 'werden (поз. 2) + ... + Partizip II (конец)', example: 'Das Auto wird in Deutschland gebaut.' },
      { type: 'positive', label: 'Präteritum Passiv (Прошедшее)', formula: 'wurde (поз. 2) + ... + Partizip II (конец)', example: 'Der Berliner Fernsehturm wurde 1969 eröffnet.' },
      { type: 'positive', label: 'Perfekt Passiv', formula: 'ist + ... + Partizip II + worden', example: 'Das Haus ist renoviert worden.' },
      { type: 'positive', label: 'Пассив с модальным глаголом', formula: 'Modalverb (поз. 2) + ... + Partizip II + werden (конец)', example: 'Diese Frage muss sofort geklärt werden.' },
    ],
    rules: [
      { title: 'Формула Пассива', text: 'Вспомогательный глагол WERDEN в нужной форме + Partizip II смыслового глагола.' },
      { title: 'Указание деятеля (VON + Dativ)', text: 'Если необходимо указать человека: "Das Buch wurde von Goethe geschrieben" (Книга была написана Гёте).' },
    ],
    markers: ['wird gemacht (делается)', 'wurde gemacht (было сделано)', 'muss gemacht werden (должно быть сделано)'],
    examples: [
      { original: 'Deutsch wird von über 100 Millionen Menschen als Muttersprache gesprochen.', translation: 'На немецком говорят как на родном более 100 миллионов человек.', note: 'Präsens Passiv' },
      { original: 'Die vertraulichen Dokumente wurden gestern vernichtet.', translation: 'Конфиденциальные документы были вчера уничтожены.', note: 'Präteritum Passiv' },
    ],
    mistakes: [
      { wrong: 'Das Fenster wird geputzt geworden.', correct: 'Das Fenster ist geputzt worden.', explanation: 'В пассиве вместо "geworden" используется сокращенная форма "worden".' },
    ],
    proTip: 'Если хотите сказать, что что-то "нужно сделать" — используйте конструкцию: "muss + Partizip II + werden" (Das Problem muss gelöst werden).',
  },

  'de-grammar-konjunktiv-2': {
    title: 'Konjunktiv II (Сослагательное наклонение)',
    subtitle: 'Мечты ("если бы да кабы"), вежливые просьбы и ценные советы',
    overview: 'Konjunktiv II переносит нас в мир фантазий, нереальных условий и деликатной вежливости. Это эквивалент русской частицы "бы".',
    formulas: [
      { type: 'positive', label: 'Конструкция würde + Infinitiv (универсальная)', formula: 'ich würde, du würdest, er würde, wir würden, ihr würdet, sie würden + Infinitiv', example: 'Ich würde gern um die Welt reisen.' },
      { type: 'positive', label: 'Особые формы wäre (был бы) и hätte (имел бы)', formula: 'sein → wäre (ich wäre, du wärst, er wäre, wir wären)\nhaben → hätte (ich hätte, du hättest, er hätte, wir hätten)', example: 'Wenn ich reich wäre, hätte ich ein Schloss am See.' },
      { type: 'positive', label: 'Вежливые модальные просьбы', formula: 'könnten (могли бы), müssten (должны были бы), sollten (следовало бы)', example: 'Könnten Sie mir bitte helfen? / Du solltest mehr schlafen.' },
    ],
    rules: [
      { title: 'Вежливые просьбы в ресторанах и отелях', text: '"Ich hätte gern einen Kaffee" (Я хотел бы кофе) звучит в разы вежливее, чем требовательное "Ich will einen Kaffee".' },
      { title: 'Нереальное условие (Wenn ... wäre/hätte, würde ...)', text: 'Если в придаточном стоит wäre/hätte, в главном предложении обычно steht würde: "Wenn ich Zeit hätte, würde ich dich besuchen".' },
    ],
    markers: ['hätte gern (хотел бы иметь)', 'könnten Sie (не могли бы вы)', 'an deiner Stelle (на твоём месте)', 'wenn ... wäre/hätte'],
    examples: [
      { original: 'Wenn ich mehr Freizeit hätte, würde ich täglich joggen gehen.', translation: 'Если бы у меня было больше свободного времени, я бы ежедневно бегал.', note: 'Нереальное условие' },
      { original: 'Könnten Sie mir bitte sagen, wo der nächste Geldautomat ist?', translation: 'Не могли бы вы подсказать, где ближайший банкомат?', note: 'Максимально вежливый вопрос прохожему' },
    ],
    mistakes: [
      { wrong: 'Ich will ein Glas Wasser.', correct: 'Ich hätte gern ein Glas Wasser. / Ich möchte ein Glas Wasser.', explanation: '"Ich will" звучит в немецком грубо и требовательно. Для вежливости используют Konjunktiv II.' },
    ],
    proTip: 'Запомните фразу: "An deiner Stelle würde ich..." (На твоём месте я бы...) — лучший способ дать совет немецкому другу.',
  },
};

export default grammarTheory;
