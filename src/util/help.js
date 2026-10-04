import { useEffect, useRef, useState } from 'react';
import shops from '../data/shops.json';

export const levels = [
  {
    name: 'Whispering Woods',
    ar: 'الغابة الهامسة',
    short: 'The beginning',
    shortAr: 'البداية',
    color: '#708365',
    sky: '#bedbd5',
  },
  {
    name: 'Mossy Hollow',
    ar: 'الوادي المكسو بالطحلب',
    short: 'Into the green',
    shortAr: 'نحو الخضرة',
    color: '#54795b',
    sky: '#b5d4be',
  },
  {
    name: 'Sunlit Glade',
    ar: 'الفسحة المشمسة',
    short: 'Chase the light',
    shortAr: 'اتبع الضوء',
    color: '#ab9857',
    sky: '#e6d6a0',
  },
  {
    name: 'Riverbend',
    ar: 'منعطف النهر',
    short: 'Cross the current',
    shortAr: 'اعبر التيار',
    color: '#689897',
    sky: '#bbdedf',
  },
  {
    name: 'Amber Highlands',
    ar: 'مرتفعات الكهرمان',
    short: 'A higher calling',
    shortAr: 'نحو القمم',
    color: '#ad7b50',
    sky: '#edccac',
  },
  {
    name: 'Twilight Grove',
    ar: 'بستان الشفق',
    short: 'After the sunset',
    shortAr: 'بعد الغروب',
    color: '#897997',
    sky: '#c8bad9',
  },
  {
    name: 'Frostfall Pass',
    ar: 'ممر الصقيع',
    short: 'Keep your fire',
    shortAr: 'حافظ على نارك',
    color: '#839dab',
    sky: '#d1e7ec',
  },
  {
    name: 'Ember Canyon',
    ar: 'وادي الجمر',
    short: 'Through the fire',
    shortAr: 'عبر النار',
    color: '#b86d50',
    sky: '#e9ad8c',
  },
  {
    name: 'Floating Isles',
    ar: 'الجزر العائمة',
    short: 'Leap of faith',
    shortAr: 'قفزة أمل',
    color: '#829ba7',
    sky: '#c2deec',
  },
  {
    name: 'Skyward Summit',
    ar: 'قمة السماء',
    short: 'Made for the sky',
    shortAr: 'خُلقت للسماء',
    color: '#c5a562',
    sky: '#f2e3b8',
  },
];
export const copy = {
  en: {
    tagline: 'A LITTLE DRAGON. A GREAT ADVENTURE.',
    adventure: 'Adventure',
    worldMap: 'World map',
    fieldGuide: 'Field guide',
    shops: 'Shops',
    howToPlay: 'How to play',
    soundOn: 'Sound on',
    soundOff: 'Sound off',
    chapter: 'YOUR ADVENTURE AWAITS',
    heading: 'Small dragon. Big dreams.',
    subtitle: 'Follow the fire. Find your strength. Earn your wings.',
    newAdventure: 'New adventure',
    level: 'Level',
    of: 'of',
    beginner: 'BEGINNER',
    intermediate: 'EXPLORER',
    hard: 'CHALLENGING',
    final: 'THE FINAL CHAPTER',
    pause: 'Pause',
    resume: 'Resume',
    fullscreen: 'Fullscreen',
    score: 'YOUR SCORE',
    strength: 'STRENGTH',
    collected: 'FIREBALLS',
    best: 'PERSONAL BEST',
    strong: 'Feeling fiery',
    weak: 'Needs a little fire',
    meet: 'YOUR LITTLE COMPANION',
    dragonName: 'Meet Ember',
    dragonDescription: 'A brave heart. A spark of fire.\nAnd a dream of touching the sky.',
    grounded: 'Grounded, but going places.',
    courage: 'a little courage\ngoes a long way.',
    nextUnlock: 'THE BIG DREAM',
    wings: 'A pair of wings',
    unlockAt: 'Unlock at level 10',
    journey: 'The journey ahead',
    journeySub: 'Ten little worlds. One extraordinary adventure.',
    allLevels: 'Explore all levels',
    visitShops: 'A little help along the way',
    shopSub: 'Good things come to curious dragons.',
    browseShops: 'Visit the shops',
    move: 'Move',
    jump: 'Jump',
    doubleJump: 'Fly',
    pauseKey: 'Pause',
    tip: 'A little tip',
    tipText: 'Fire makes you stronger. Water? Not so much.',
    made: 'Made for the adventurer in you.',
    saved: 'Progress saved locally',
    ready: 'Every great adventure\nstarts with a little spark.',
    readySub: 'Your wings are waiting. Let’s go find them.',
    play: 'Let’s adventure',
    paused: 'Take a little breather.',
    pausedSub: 'Your adventure will be right here.',
    lost: 'A spark never truly fades.',
    lostSub: 'Rest up, little dragon. Give this world another try.',
    retry: 'Try again',
    complete: 'One step closer to the sky.',
    completeSub: 'A new path is waiting for you.',
    next: 'Next chapter',
    victory: 'You were made for the sky.',
    victorySub: 'Ten worlds. One brave dragon. Welcome home, Ember.',
    playAgain: 'Adventure again',
    close: 'Close',
    locked: 'Locked',
    current: 'YOU ARE HERE',
    completed: 'COMPLETED',
    buy: 'Get it',
    owned: 'Equipped',
    insufficient: 'More embers needed',
    balance: 'Embers to spend',
    restore: 'Restore strength',
    guideIntro: 'A few familiar faces for the road ahead.',
    fireGuide: 'Fireballs',
    fireDesc:
      '+25 score, +6 strength. They change in every world. In levels 9–10, jump to catch the flying fireballs.',
    waterGuide: 'Waterballs',
    waterDesc:
      'Avoid these! A hit costs 22 strength. You briefly shimmer while protected after a hit.',
    humanGuide: 'The woodland folk',
    humanDesc:
      'Eight different travelers. Blue water carriers throw waterballs. Catch travelers without water for +50 score and +12 strength.',
    obstacleGuide: 'The scenic route',
    obstacleDesc:
      'Jump over rocks and fallen trees. Cross rivers on wooden bridges. Reach the signpost to finish each level.',
    controlsIntro: 'A small dragon with a very big journey.',
    controlsText:
      'Use A / D or the arrow keys to move. Press Space, W or ↑ to jump. Hold jump with wings to fly. Press P or Escape to pause. On a touch screen, use the on-screen arrows.',
    goalText:
      'Collect fireballs, keep your strength above zero, and reach the end of each world. At level 10, buy wings for 300 embers in the shops, then fly home.',
    finalHint: 'The summit awaits! Buy wings in the shops to fly home.',
    loading: 'Waking up the woods…',
    error: 'The woods couldn’t load.',
    reload: 'Reload game',
    resetTitle: 'A fresh little adventure?',
    resetText: 'Your current run and embers will reset. Your best score stays with you.',
    cancel: 'Keep exploring',
    reset: 'Start fresh',
    fullStrength: 'Strength is full',
    shieldActive: 'Shield is active',
    shopLocked: 'Opens at level',
    chapterReward: '+150 embers · Chapter complete',
    welcome: 'THE WHISPERING WOODS',
    winged: 'Ready for the sky',
    status: 'DRAGON STATUS',
  },
  ar: {
    tagline: 'تنين صغير. مغامرة كبيرة.',
    adventure: 'المغامرة',
    worldMap: 'خريطة العالم',
    fieldGuide: 'دليل الرحلة',
    shops: 'المتاجر',
    howToPlay: 'طريقة اللعب',
    soundOn: 'الصوت يعمل',
    soundOff: 'الصوت مغلق',
    chapter: 'مغامرتك تنتظرك',
    heading: 'تنين صغير. أحلام كبيرة.',
    subtitle: 'اتبع النار. اكتشف قوتك. واكسب جناحيك.',
    newAdventure: 'مغامرة جديدة',
    level: 'المستوى',
    of: 'من',
    beginner: 'مبتدئ',
    intermediate: 'مستكشف',
    hard: 'تحدٍ كبير',
    final: 'الفصل الأخير',
    pause: 'إيقاف',
    resume: 'متابعة',
    fullscreen: 'ملء الشاشة',
    score: 'نقاطك',
    strength: 'القوة',
    collected: 'كرات النار',
    best: 'أفضل نتيجة',
    strong: 'مفعم بالنار',
    weak: 'تحتاج إلى نار',
    meet: 'رفيقك الصغير',
    dragonName: 'تعرّف على إمبر',
    dragonDescription: 'قلب شجاع. وشرارة نار.\nوحلم بملامسة السماء.',
    grounded: 'على الأرض، وعينه على السماء.',
    courage: 'قليل من الشجاعة\nيأخذك بعيداً.',
    nextUnlock: 'الحلم الكبير',
    wings: 'زوج من الأجنحة',
    unlockAt: 'تُفتح في المستوى ١٠',
    journey: 'الرحلة القادمة',
    journeySub: 'عشرة عوالم صغيرة. مغامرة استثنائية واحدة.',
    allLevels: 'استكشف المستويات',
    visitShops: 'بعض المساعدة في الطريق',
    shopSub: 'أشياء جميلة تنتظر التنانين الفضولية.',
    browseShops: 'زيارة المتاجر',
    move: 'تحرك',
    jump: 'اقفز',
    doubleJump: 'طر',
    pauseKey: 'توقف',
    tip: 'نصيحة صغيرة',
    tipText: 'النار تقويك. أما الماء؟ فابتعد عنه.',
    made: 'صُنعت للمغامر بداخلك.',
    saved: 'حُفظ التقدم محلياً',
    ready: 'كل مغامرة عظيمة\nتبدأ بشرارة صغيرة.',
    readySub: 'جناحاك ينتظران. لنذهب ونبحث عنهما.',
    play: 'لننطلق',
    paused: 'خذ استراحة قصيرة.',
    pausedSub: 'ستبقى مغامرتك بانتظارك.',
    lost: 'الشرارة لا تنطفئ أبداً.',
    lostSub: 'استرح أيها التنين. وحاول مرة أخرى.',
    retry: 'حاول مجدداً',
    complete: 'خطوة أقرب إلى السماء.',
    completeSub: 'طريق جديد ينتظرك.',
    next: 'الفصل التالي',
    victory: 'خُلقت لتلامس السماء.',
    victorySub: 'عشرة عوالم. تنين شجاع. أهلاً بعودتك يا إمبر.',
    playAgain: 'العب مجدداً',
    close: 'إغلاق',
    locked: 'مغلق',
    current: 'أنت هنا',
    completed: 'مكتمل',
    buy: 'اشترِ',
    owned: 'مُجهز',
    insufficient: 'تحتاج مزيداً من الجمر',
    balance: 'الجمر المتاح',
    restore: 'استعد قوتك',
    guideIntro: 'وجوه مألوفة ترافقك في الطريق.',
    fireGuide: 'كرات النار',
    fireDesc: '٢٥ نقطة و٦ قوة. تتغير في كل عالم. اقفز لالتقاط الكرات الطائرة في المستويين ٩ و١٠.',
    waterGuide: 'كرات الماء',
    waterDesc: 'تجنبها! كل إصابة تنقص ٢٢ قوة. تتلألأ لفترة قصيرة بعد الإصابة للحماية.',
    humanGuide: 'سكان الغابة',
    humanDesc:
      'ثمانية مسافرين مختلفين. حاملو الماء الأزرق يرمون الكرات. التقط من لا يحمل الماء لتحصل على ٥٠ نقطة و١٢ قوة.',
    obstacleGuide: 'الطريق الجميل',
    obstacleDesc:
      'اقفز فوق الصخور والأشجار الساقطة. اعبر الأنهار على الجسور الخشبية. اصل إلى اللافتة لإكمال المستوى.',
    controlsIntro: 'تنين صغير في رحلة كبيرة.',
    controlsText:
      'تحرك بالأسهم أو A / D. اقفز بمفتاح المسافة أو W أو ↑. اضغط مطولاً للقفز مع الأجنحة للطيران. توقف بمفتاح P أو Escape. استخدم الأزرار الظاهرة على شاشة اللمس.',
    goalText:
      'اجمع النار وحافظ على قوتك واصل إلى نهاية كل عالم. في المستوى ١٠ اشترِ جناحين مقابل ٣٠٠ جمرة ثم طر إلى منزلك.',
    finalHint: 'القمة تنتظرك! اشترِ الأجنحة من المتجر لتصل إلى المنزل.',
    loading: 'الغابة تستيقظ…',
    error: 'تعذر تحميل الغابة.',
    reload: 'إعادة التحميل',
    resetTitle: 'مغامرة جديدة؟',
    resetText: 'ستبدأ رحلتك وجمرك من جديد. ستحتفظ بأفضل نتيجة.',
    cancel: 'تابع الاستكشاف',
    reset: 'ابدأ من جديد',
    fullStrength: 'القوة كاملة',
    shieldActive: 'الدرع فعال',
    shopLocked: 'يُفتح في المستوى',
    chapterReward: '١٥٠ جمرة إضافية · اكتمل الفصل',
    welcome: 'الغابة الهامسة',
    winged: 'جاهز للسماء',
    status: 'حالة التنين',
  },
};
export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
export function formatNumber(value, language = 'en') {
  return new Intl.NumberFormat(language === 'ar' ? 'ar' : 'en').format(value);
}
export function freshState(best = 0, unlocked = 1) {
  return {
    level: 1,
    score: 0,
    coins: 0,
    strength: 100,
    collected: 0,
    best,
    unlocked,
    wings: false,
    shield: 0,
    status: 'ready',
    distance: 0,
  };
}
export function readProgress() {
  try {
    const data = JSON.parse(localStorage.getItem('emberQuest.v1') || '{}');
    return {
      ...freshState(),
      best: clamp(Number(data.best) || 0, 0, 99999999),
      unlocked: clamp(Math.floor(Number(data.unlocked) || 1), 1, 10),
    };
  } catch {
    return freshState();
  }
}
export function saveProgress(state) {
  try {
    localStorage.setItem(
      'emberQuest.v1',
      JSON.stringify({ best: state.best, unlocked: state.unlocked }),
    );
    return true;
  } catch {
    return false;
  }
}
export function collectReward(state, human = false) {
  const points = human ? 50 : 25;
  return {
    ...state,
    score: state.score + points,
    coins: state.coins + points,
    strength: clamp(state.strength + (human ? 12 : 6), 0, 100),
    collected: state.collected + (human ? 0 : 1),
    best: Math.max(state.best, state.score + points),
  };
}
export function waterDamage(state) {
  if (state.shield > 0) return { ...state, shield: state.shield - 1 };
  const strength = Math.max(0, state.strength - 22);
  return { ...state, strength, status: strength === 0 ? 'lost' : state.status };
}
export function purchaseItem(state, shop) {
  if (
    !shop ||
    state.level < shop.unlock ||
    state.coins < shop.price ||
    (shop.type === 'wings' && state.wings) ||
    (shop.type === 'strength' && state.strength === 100) ||
    (shop.type === 'shield' && state.shield > 0)
  )
    return state;
  return {
    ...state,
    coins: state.coins - shop.price,
    strength: shop.type === 'strength' ? clamp(state.strength + 35, 0, 100) : state.strength,
    shield: shop.type === 'shield' ? 3 : state.shield,
    wings: shop.type === 'wings' ? true : state.wings,
  };
}
export function levelLayout(level) {
  const length = 3500 + level * 150;
  return {
    length,
    speed: 255 + level * 6,
    throwDelay: Math.max(1300, 3300 - level * 160),
    fires: Array.from({ length: 21 + level }, (_, i) => ({
      x: 380 + i * ((length - 720) / (20 + level)),
      y: level >= 9 ? 294 + (i % 3) * 12 : i % 5 === 3 ? 330 : 389,
    })),
    enemies: Array.from({ length: 2 + Math.floor(level * 0.7) }, (_, i) => ({
      x: 1080 + i * ((length - 1600) / (1 + Math.floor(level * 0.7))),
      kind: (level + i - 1) % 8,
      armed: (i + level) % 3 !== 0,
    })),
  };
}
export function useAdventure() {
  const [state, setState] = useState(readProgress);
  const [language, setLanguage] = useState('en');
  const [panel, setPanel] = useState(null);
  const [sound, setSound] = useState(false);
  const [saved, setSaved] = useState(true);
  const model = useRef(state);
  const engine = useRef(null);
  const wasPlaying = useRef(false);
  const soundRef = useRef(sound);
  model.current = state;
  soundRef.current = sound;
  const commit = (next) => {
    model.current = typeof next === 'function' ? next(model.current) : next;
    setState(model.current);
  };
  const { best, unlocked } = state;
  useEffect(() => {
    setSaved(saveProgress({ best, unlocked }));
  }, [best, unlocked]); // Only durable achievements are stored.
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);
  const openPanel = (name) => {
    wasPlaying.current ||= model.current.status === 'playing';
    if (model.current.status === 'playing') engine.current?.command('pause');
    setPanel(name);
  };
  const closePanel = () => {
    setPanel(null);
    if (wasPlaying.current) engine.current?.command('resume');
    wasPlaying.current = false;
  };
  const action = (name, value) => {
    if (name === 'language') setLanguage(language === 'en' ? 'ar' : 'en');
    else if (name === 'sound') {
      setSound(!sound);
      if (!sound) playTone('start', true);
    } else if (name === 'close') closePanel();
    else if (name === 'panel') openPanel(value);
    else if (name === 'buy') {
      const next = purchaseItem(
        model.current,
        shops.find((item) => item.id === value),
      );
      if (next !== model.current) {
        commit(next);
        playTone('collect', soundRef.current);
      }
    } else if (name === 'reset') {
      wasPlaying.current = false;
      setPanel(null);
      commit(freshState(model.current.best, model.current.unlocked));
      engine.current?.command('reset');
    } else if (name === 'selectLevel') {
      if (value <= model.current.unlocked) {
        wasPlaying.current = false;
        setPanel(null);
        commit({
          ...freshState(model.current.best, model.current.unlocked),
          level: value,
          coins: value === 10 ? 300 : 0,
        });
        engine.current?.command('reset');
      }
    } else engine.current?.command(name);
  };
  return {
    state,
    language,
    panel,
    sound,
    saved,
    model,
    engine,
    soundRef,
    commit,
    action,
    t: copy[language],
  };
}
export function useGameMount(container, adventure) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let disposed = false;
    let game;
    import('phaser')
      .then((module) => {
        if (disposed) return;
        game = createGame(
          module.default || module,
          container.current,
          adventure.model,
          adventure.commit,
          adventure.soundRef,
          () => setLoaded(true),
        );
        adventure.engine.current = game;
      })
      .catch(() => {
        if (!disposed) setError(true);
      });
    return () => {
      disposed = true;
      if (game) {
        game.destroy(true);
        if (adventure.engine.current === game) adventure.engine.current = null;
      }
    };
    // The engine reads current values through stable refs; recreating it would discard the level.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { loaded, error };
}
export function useModalKeys(ref, close, adventure) {
  useEffect(() => {
    const previous = document.activeElement;
    const node = ref.current;
    node?.querySelector('button')?.focus();
    const handler = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopImmediatePropagation();
        close();
      }
      if (event.key === 'Tab') {
        const buttons = [
          ...node.querySelectorAll('button:not(:disabled), [href], input, [tabindex="0"]'),
        ];
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        }
        if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener('keydown', handler, true);
    return () => {
      document.removeEventListener('keydown', handler, true);
      if (adventure.model.current.status === 'playing') {
        adventure.engine.current?.canvas.parentElement?.focus({ preventScroll: true });
      } else {
        previous?.focus();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
export function toggleFullscreen(element) {
  if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
  else element?.requestFullscreen?.().catch(() => {});
}
let audioContext;
export function playTone(type, enabled) {
  if (!enabled) return;
  try {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const time = audioContext.currentTime;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(type === 'hit' ? 170 : 580, time);
    osc.frequency.exponentialRampToValueAtTime(type === 'hit' ? 70 : 1100, time + 0.16);
    gain.gain.setValueAtTime(0.065, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.24);
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.start(time);
    osc.stop(time + 0.25);
  } catch {
    /* Audio is an optional enhancement. */
  }
}

// Original canvas artwork. The same sprites are used by Phaser and the field guide.
export function path(ctx, shape, fill, stroke, width = 2) {
  const p = new Path2D(shape);
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill(p);
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = width;
    ctx.lineJoin = 'round';
    ctx.stroke(p);
  }
}
export function ellipse(ctx, x, y, rx, ry, color) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}
export function gradient(ctx, x, y, x2, y2, colors) {
  const g = ctx.createLinearGradient(x, y, x2, y2);
  colors.forEach((color, i) => g.addColorStop(i / (colors.length - 1), color));
  return g;
}
export function drawDragon(ctx, variant = 'strong', frame = 0) {
  ctx.save();
  const weak = variant === 'weak';
  const winged = variant === 'winged';
  const bounce = Math.sin((frame / 6) * Math.PI * 2) * 2.5;
  ctx.translate(0, bounce);
  const outline = weak ? '#69433b' : '#8d3624';
  const body = gradient(
    ctx,
    40,
    35,
    110,
    150,
    weak ? ['#c39b83', '#a07465', '#82564e'] : ['#ffb066', '#ea6b3b', '#c44b30'],
  );
  if (winged) {
    path(ctx, 'M81 95 Q25 28 22 10 Q55 12 71 44 Q77 5 102 0 L113 89Z', '#eeb45c', outline, 3);
    path(ctx, 'M80 91 L25 15 M80 91 L73 46 M80 91 L101 6', null, '#b65a36', 2);
  }
  path(ctx, 'M68 111 C44 134 22 126 9 100 Q4 126 32 140 Q52 148 78 133Z', body, outline, 2.8);
  path(ctx, 'M11 102 L4 94 L8 115 L18 112Z', '#f6cb79', outline, 1.5);
  ellipse(ctx, 86, 113, 36, 33, body);
  path(ctx, 'M64 101 Q67 72 83 69 L111 79 Q129 104 114 133 Q106 150 86 143Z', body, outline, 2.6);
  ellipse(ctx, 93, 117, 21, 27, '#f3bc79');
  path(
    ctx,
    'M81 111 Q95 116 110 111 M79 121 Q95 126 110 121 M82 131 Q93 135 106 130',
    null,
    '#d89759',
    1.3,
  );
  path(
    ctx,
    'M65 88 L52 80 L58 71 L47 65 L60 57 L54 44 L68 44 L67 32 L82 39Z',
    '#c3482d',
    outline,
    1.8,
  );
  path(
    ctx,
    'M75 44 Q57 24 64 16 Q72 27 86 29 L105 28 Q113 10 119 15 L117 40Z',
    '#f3d5a0',
    outline,
    2.5,
  );
  path(
    ctx,
    'M63 58 Q62 32 91 30 Q119 25 124 52 L126 59 Q152 59 153 76 Q154 88 131 94 L102 94 Q72 97 64 78Z',
    body,
    outline,
    2.8,
  );
  path(ctx, 'M117 77 Q137 73 150 78 Q148 92 126 92 L109 89Z', '#f8bf79');
  ellipse(ctx, 110, 55, 10, 14, '#fff5d6');
  ellipse(ctx, 114, 56, 5.2, 9, '#30382a');
  ellipse(ctx, 115, 52, 1.8, 3, '#fff');
  path(ctx, weak ? 'M99 47 Q110 53 119 48' : 'M99 41 Q110 36 120 43', null, outline, 3);
  ellipse(ctx, 140, 68, 2.4, 2.2, outline);
  ellipse(ctx, 100, 77, 7, 4, weak ? '#bc8975' : '#e65330');
  path(ctx, 'M128 85 Q135 88 141 84', null, outline, 1.4);
  path(ctx, 'M119 92 L124 95 L128 91', '#fff2cd');
  const stride = Math.sin((frame / 6) * Math.PI * 2) * 5;
  path(
    ctx,
    `M70 131 Q61 ${143 + stride} 65 152 L87 152 Q96 147 85 143 L86 132Z`,
    body,
    outline,
    2.5,
  );
  path(
    ctx,
    `M105 133 Q102 ${145 - stride} 108 153 L132 153 Q137 146 124 143 L123 129Z`,
    body,
    outline,
    2.5,
  );
  path(
    ctx,
    'M68 149 L70 153 L75 149 L77 153 L82 149 M114 150 L116 154 L121 150 L123 154 L128 150',
    '#f7dcac',
    null,
  );
  path(ctx, 'M111 100 Q113 115 128 116 Q134 113 132 108 Q121 108 121 99', body, outline, 2.5);
  ellipse(ctx, 77, 66, 3, 4, '#faab66');
  ellipse(ctx, 81, 76, 2, 3, '#f9a261');
  ctx.restore();
}
export function drawHuman(ctx, kind = 0, armed = false) {
  const coats = [
    '#779885',
    '#b77755',
    '#d2aa53',
    '#8a7595',
    '#647f9e',
    '#a76e73',
    '#8c915d',
    '#526f65',
  ];
  const coat = coats[kind % 8];
  ellipse(ctx, 36, 93, 22, 4, '#172d3326');
  path(ctx, 'M23 64 L20 91 L32 92 L37 71 L42 92 L54 92 L49 62Z', '#4c4d4b', '#344641', 2);
  path(
    ctx,
    'M21 86 L15 93 Q13 97 32 96 L32 88 M43 88 L43 96 L61 96 Q64 92 52 88',
    '#45372f',
    '#344641',
    1.5,
  );
  path(
    ctx,
    'M22 35 Q10 41 10 63 L19 67 L24 51 L23 72 Q35 78 51 69 L48 48 L57 64 L65 59 Q59 38 47 34Z',
    coat,
    '#3f5049',
    2,
  );
  path(ctx, 'M23 63 L49 63 L49 69 L23 69Z', '#735b42');
  path(ctx, 'M33 64 L39 64 L39 70 L33 70Z', '#dbc792');
  ellipse(ctx, 36, 27, 14, 16, kind % 3 === 0 ? '#ba8965' : '#edbf91');
  path(
    ctx,
    'M22 28 Q16 10 34 8 Q51 5 52 26 L45 19 L29 20Z',
    kind % 2 ? '#6b4934' : '#554638',
    '#3f5049',
    1.5,
  );
  if (kind % 2 === 0) path(ctx, 'M16 19 L25 5 L46 7 L56 22Z', coat, '#3f5049', 2);
  ellipse(ctx, 39, 27, 1.8, 2.2, '#42382e');
  path(ctx, 'M36 35 Q41 37 45 33', null, '#8e6146', 1.3);
  ellipse(ctx, 16, 64, 5, 6, '#edbf91');
  ellipse(ctx, 59, 62, 5, 6, '#edbf91');
  if (armed) {
    ellipse(ctx, 61, 55, 12, 13, '#69c6e4');
    ellipse(ctx, 57, 50, 3, 5, '#ddf6f3');
    path(ctx, 'M55 44 L62 37 L66 45', '#69c6e4');
  } else {
    path(ctx, 'M10 53 Q-1 57 4 75 L19 75 L21 55Z', '#ab8055', '#765c41', 1.5);
  }
}
export function drawOrb(ctx, kind = 'fire', level = 1) {
  const water = kind === 'water';
  const hues = [
    '#ffc059',
    '#ffa346',
    '#ffce52',
    '#f9944b',
    '#ffd77f',
    '#f7a1a4',
    '#d0e8ff',
    '#ff845c',
    '#ffc8f2',
    '#fff4b0',
  ];
  const fireShapes = [
    'M33 7 Q42 21 36 26 Q48 20 48 34 C58 58 12 62 14 39 Q14 27 26 20 Q24 36 30 34 Q38 29 33 7Z',
    'M25 5 Q47 19 39 32 Q52 26 49 42 C44 62 10 57 13 38 Q15 26 22 24 Q18 39 28 34 Q33 27 25 5Z',
    'M34 4 Q30 20 44 28 L49 23 Q56 44 41 51 Q19 62 12 43 Q8 28 21 17 Q16 36 27 32 Q25 18 34 4Z',
    'M30 8 L41 23 L37 30 L47 25 L50 41 Q43 59 25 54 Q10 49 13 34 L23 23 L24 36 L30 31Z',
  ];
  const color = water ? '#6fc6ee' : hues[level - 1];
  const glow = ctx.createRadialGradient(30, 32, 3, 30, 32, 29);
  glow.addColorStop(0, water ? '#adf2ff99' : '#ffb64088');
  glow.addColorStop(1, '#ffffff00');
  ellipse(ctx, 30, 32, 29, 29, glow);
  path(
    ctx,
    water
      ? 'M31 9 Q28 21 19 31 C2 53 48 62 48 38 Q47 28 31 9Z'
      : fireShapes[(level - 1) % fireShapes.length],
    gradient(ctx, 20, 15, 36, 55, [
      water ? '#cdf7ff' : '#ffe3a0',
      color,
      water ? '#438abf' : '#ed692c',
    ]),
    water ? '#469abe' : '#e2873d',
    1,
  );
  if (!water) path(ctx, 'M32 31 Q42 44 33 50 Q18 53 24 40 Q26 48 32 31Z', '#fff5b9');
  else ellipse(ctx, 24, 34, 4, 7, '#e3fcff');
  if (level >= 9 && !water) {
    path(ctx, 'M15 30 Q-2 15 4 34 L16 40 M45 30 Q62 15 57 34 L44 40', '#fff1c9', '#d2aa68', 1);
  }
}
export function useSprite(canvasRef, kind, variant) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (kind === 'dragon') {
      ctx.scale(canvas.width / 170, canvas.height / 170);
      drawDragon(ctx, variant);
    } else if (kind === 'human') {
      ctx.scale(canvas.width / 80, canvas.height / 105);
      drawHuman(ctx, Number(variant), Number(variant) % 3 !== 0);
    } else {
      ctx.scale(canvas.width / 60, canvas.height / 60);
      drawOrb(ctx, kind, Number(variant) || 1);
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }, [canvasRef, kind, variant]);
}
export function drawTree(ctx, x, ground, size, tint = 0) {
  ctx.save();
  ctx.translate(x, ground);
  ctx.scale(size, size);
  const dark = tint === 1 ? '#567b69' : '#314f42';
  const light = tint === 1 ? '#78967a' : '#647b48';
  path(
    ctx,
    'M-17 0 Q-7 -83 -15 -189 L8 -195 Q4 -90 21 0Z',
    gradient(ctx, -15, 0, 18, 0, ['#494e37', '#727044', '#394d36']),
  );
  path(ctx, 'M-6 -101 L-51 -153 L-45 -155 L2 -118 M2 -135 L46 -178 L50 -174 L4 -122', '#555b38');
  for (const [cx, cy, rx, ry] of [
    [-40, -192, 48, 38],
    [26, -211, 54, 45],
    [-3, -243, 46, 42],
    [-62, -158, 43, 32],
    [53, -169, 44, 36],
    [-10, -168, 64, 48],
  ]) {
    ellipse(ctx, cx, cy, rx, ry, gradient(ctx, cx, cy - ry, cx + 15, cy + ry, [light, dark]));
    ellipse(ctx, cx - 9, cy - ry / 2, rx * 0.67, ry * 0.43, tint === 1 ? '#90a08550' : '#91a05535');
  }
  path(ctx, 'M-18 0 L-33 4 L-5 -9 L17 -5 L34 5Z', '#3f5639');
  ctx.restore();
}
export function seededRandom(seed) {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}
export function drawLandscape(ctx, width, height, level = 1) {
  const random = seededRandom(431 + level);
  const sky = levels[level - 1].sky;
  ctx.fillStyle = gradient(ctx, 0, 0, 0, height, [sky, '#f6eac0', '#bfd1a3']);
  ctx.fillRect(0, 0, width, height);
  const sun = ctx.createRadialGradient(790, 105, 4, 790, 105, 260);
  sun.addColorStop(0, '#fffbd9e8');
  sun.addColorStop(0.28, '#fff5d3aa');
  sun.addColorStop(1, '#fff5d300');
  ctx.fillStyle = sun;
  ctx.fillRect(0, 0, width, height);
  ellipse(ctx, 790, 108, 38, 38, '#fff7d5b0');
  path(
    ctx,
    'M0 244 Q110 172 190 205 Q280 151 370 195 Q440 135 530 189 Q600 224 710 163 Q800 109 890 162 Q999 214 1100 158 L1500 350 L0 350Z',
    '#86aca777',
  );
  path(
    ctx,
    'M0 290 Q102 192 191 246 L365 132 L430 200 L521 163 L642 265 L779 165 L906 234 L1005 166 L1230 283 L1500 225 L1500 450 L0 450Z',
    '#779d9680',
  );
  path(ctx, 'M275 211 L366 133 L430 201 L369 177 L338 200 L351 176Z', '#dfebd055');
  for (let i = 0; i < 65; i++) {
    const x = i * 25;
    const y = 302 + random() * 45;
    const h = 48 + random() * 98;
    path(
      ctx,
      `M${x - 24} ${y} L${x - 11} ${y - h * 0.38} L${x - 20} ${y - h * 0.38} L${x - 7} ${y - h * 0.7} L${x - 14} ${y - h * 0.7} L${x} ${y - h} L${x + 19} ${y - h * 0.63} L${x + 11} ${y - h * 0.63} L${x + 27} ${y - h * 0.3} L${x + 16} ${y - h * 0.3} L${x + 34} ${y}Z`,
      '#638f8060',
    );
  }
  path(
    ctx,
    'M0 367 Q250 252 452 337 Q672 396 833 304 Q1024 260 1192 345 L1500 295 L1500 470 L0 470Z',
    '#739b73',
  );
  path(
    ctx,
    'M0 403 Q200 333 410 380 Q619 294 843 380 Q1100 301 1500 378 L1500 470 L0 470Z',
    '#648460',
  );
  for (let i = 0; i < 15; i++)
    drawTree(ctx, i * 113 + random() * 45, 411 + random() * 20, 0.45 + random() * 0.4, 1);
  drawTree(ctx, 80, 442, 1.62);
  drawTree(ctx, 1335, 442, 1.65);
  drawTree(ctx, 1150, 440, 1.05);
  drawTree(ctx, -50, 445, 1.6);
  // Soft shafts of sunlight through the canopy.
  path(
    ctx,
    'M711 0 L766 0 L540 438 L330 438Z',
    gradient(ctx, 650, 0, 490, 430, ['#fff8c213', '#fff8c206']),
  );
  path(ctx, 'M848 0 L865 0 L823 438 L691 438Z', '#fff9ce0c');
  ctx.fillStyle = gradient(ctx, 0, 434, 0, height, ['#687d42', '#647545', '#354b35']);
  ctx.fillRect(0, 435, width, height - 435);
  path(
    ctx,
    'M0 435 Q230 411 469 433 Q755 448 951 427 Q1210 412 1500 433 L1500 456 Q1170 450 951 449 Q718 464 460 451 Q240 439 0 458Z',
    '#a9a773',
  );
  path(ctx, 'M0 438 Q230 428 469 441 Q755 453 951 436 Q1210 422 1500 441', null, '#d6c797', 3);
  for (let i = 0; i < 420; i++) {
    const x = random() * width;
    const y = 457 + random() * 63;
    const color = ['#294d37', '#869352', '#b8ad69', '#4d693e'][i % 4];
    path(
      ctx,
      `M${x} ${y} q-2 -${3 + random() * 8} -5 -9 M${x} ${y} q1 -10 5 -12`,
      null,
      color,
      1.2,
    );
  }
  for (let i = 0; i < 42; i++) {
    const x = random() * width;
    const y = 459 + random() * 55;
    ellipse(ctx, x, y, 2, 1.5, i % 3 ? '#dec383' : '#ecbe86');
  }
  // Foreground bushes frame the little world.
  for (const x of [15, 50, 120, 1345, 1410, 1490]) {
    ellipse(ctx, x, 518, 61, 30, '#2e5138');
    ellipse(ctx, x - 14, 507, 32, 21, '#456342');
    path(
      ctx,
      `M${x} 520 Q${x - 10} 492 ${x - 24} 489 M${x} 520 Q${x + 14} 492 ${x + 35} 497`,
      null,
      '#789059',
      2,
    );
  }
}
export function createTexture(scene, key, width, height, draw) {
  if (scene.textures.exists(key)) return;
  const texture = scene.textures.createCanvas(key, width, height);
  draw(texture.context);
  texture.refresh();
}
export function buildTextures(scene) {
  for (const variant of ['strong', 'weak', 'winged']) {
    const key = `dragon-${variant}`;
    if (!scene.textures.exists(key)) {
      const canvas = document.createElement('canvas');
      canvas.width = 170 * 6;
      canvas.height = 170;
      const ctx = canvas.getContext('2d');
      for (let f = 0; f < 6; f++) {
        ctx.save();
        ctx.translate(f * 170, 0);
        drawDragon(ctx, variant, f);
        ctx.restore();
      }
      scene.textures.addSpriteSheet(key, canvas, { frameWidth: 170, frameHeight: 170 });
      scene.anims.create({
        key: `${variant}-walk`,
        frames: scene.anims.generateFrameNumbers(key, { start: 0, end: 5 }),
        frameRate: 9,
        repeat: -1,
      });
    }
  }
  for (let i = 0; i < 8; i++)
    for (const armed of [false, true])
      createTexture(scene, `human-${i}-${armed}`, 80, 105, (ctx) => drawHuman(ctx, i, armed));
  for (let i = 1; i <= 10; i++)
    createTexture(scene, `fire-${i}`, 60, 60, (ctx) => drawOrb(ctx, 'fire', i));
  createTexture(scene, 'water', 60, 60, (ctx) => drawOrb(ctx, 'water'));
  createTexture(scene, 'rock', 110, 70, (ctx) => {
    ellipse(ctx, 55, 63, 52, 6, '#30482c33');
    path(
      ctx,
      'M4 61 L17 29 L45 12 L78 17 L101 39 L106 61Z',
      gradient(ctx, 30, 14, 60, 68, ['#a5ac94', '#717e6c', '#556b59']),
      '#4d634e',
      2,
    );
    path(ctx, 'M17 29 L47 26 L61 44 L78 17 M47 26 L45 12 M61 44 L54 62', null, '#c1c5a077', 2);
    path(ctx, 'M13 32 Q34 16 49 22 L46 29 Q23 25 15 39', '#7d914b');
  });
  createTexture(scene, 'log', 140, 80, (ctx) => {
    path(
      ctx,
      'M17 25 L111 18 Q136 31 123 62 L29 70Z',
      gradient(ctx, 10, 20, 20, 70, ['#9b8653', '#695c37']),
      '#4c4d31',
      3,
    );
    ellipse(ctx, 26, 47, 21, 24, '#bdac77');
    ellipse(ctx, 26, 47, 15, 18, '#8c794b');
    ellipse(ctx, 26, 47, 10, 12, '#b5a06b');
    path(ctx, 'M42 32 L109 28 M43 49 L119 42 M41 60 L113 54', null, '#c0a87655', 3);
    path(ctx, 'M66 23 L58 10 L67 7 L77 23', '#726038');
    ellipse(ctx, 83, 24, 31, 7, '#718148');
  });
  createTexture(scene, 'bridge', 420, 135, (ctx) => {
    ctx.fillStyle = gradient(ctx, 0, 60, 0, 135, ['#8fc6bc', '#569f9e', '#437a7c']);
    ctx.fillRect(0, 55, 420, 80);
    for (let i = 0; i < 20; i++)
      path(ctx, `M${(i * 31) % 400} ${83 + (i % 4) * 12} l28 -2`, null, '#c4ded277', 2);
    path(ctx, 'M4 68 Q210 22 416 68 L416 82 Q210 39 4 82Z', '#6e6742', '#4e5337', 2);
    for (let i = 0; i < 22; i++) {
      const x = i * 19 + 5;
      const y = 66 - Math.sin((i / 21) * Math.PI) * 23;
      path(ctx, `M${x} ${y} l0 12`, null, '#b5a479', 2);
    }
    for (const x of [10, 100, 210, 320, 410]) {
      const y = 64 - Math.sin((x / 420) * Math.PI) * 23;
      path(ctx, `M${x} ${y + 10} L${x} ${y - 44}`, null, '#686342', 7);
      ellipse(ctx, x, y - 44, 5, 3, '#c4b589');
    }
    path(ctx, 'M10 20 Q210 -21 410 20 M10 37 Q210 -4 410 37', null, '#a79968', 4);
  });
  createTexture(scene, 'sign', 110, 155, (ctx) => {
    path(ctx, 'M48 149 L48 34 L62 34 L62 149', '#7f6d43', '#4e533b', 2);
    path(ctx, 'M9 19 L81 19 L102 39 L82 59 L9 59Z', '#b3a075', '#665b3b', 2);
    path(ctx, 'M29 37 L74 37 M66 30 L75 37 L66 44', null, '#f8e6b5', 3);
    ellipse(ctx, 53, 149, 39, 6, '#3f5d3744');
  });
}

export function createGame(Phaser, parent, model, commit, soundRef, onReady) {
  let sceneInstance;
  let checkpoint;
  class AdventureScene extends Phaser.Scene {
    constructor() {
      super('adventure');
    }
    create() {
      sceneInstance = this;
      const state = model.current;
      const layout = levelLayout(state.level);
      this.layout = layout;
      this.lastHit = -2000;
      this.finished = false;
      this.lastReport = 0;
      this.touch = { left: false, right: false, jump: false };
      this.previousJump = false;
      buildTextures(this);
      const landscapeKey = `landscape-${state.level}`;
      createTexture(this, landscapeKey, 1500, 520, (ctx) =>
        drawLandscape(ctx, 1500, 520, state.level),
      );
      this.backdrop = this.add
        .tileSprite(0, 0, 1100, 520, landscapeKey)
        .setOrigin(0)
        .setScrollFactor(0);
      this.physics.world.setBounds(0, -250, layout.length, 770);
      const platforms = this.physics.add.staticGroup();
      const riverStart = 1710;
      const riverEnd = 2070;
      for (const [x, width] of [
        [0, riverStart],
        [riverEnd, layout.length - riverEnd],
      ]) {
        const ground = this.add.rectangle(x, 456, width, 32, 0x000000, 0).setOrigin(0, 0.5);
        platforms.add(ground);
      }
      this.add.image(1890, 439, 'bridge').setOrigin(0.5, 0.49).setDepth(2);
      const bridgeFloor = this.add.rectangle(1890, 441, 380, 18, 0x000000, 0);
      platforms.add(bridgeFloor);
      this.obstacles = this.physics.add.staticGroup();
      for (const [index, x] of [720, 1430, 2320, 2980, 3690, 4180]
        .filter((x) => x < layout.length - 340)
        .entries()) {
        const obstacle = this.obstacles
          .create(x, 442, index % 2 ? 'log' : 'rock')
          .setOrigin(0.5, 1)
          .setScale(index % 2 ? 0.67 : 0.68)
          .setDepth(4);
        obstacle.refreshBody();
        obstacle.body
          .setSize(index % 2 ? 79 : 61, index % 2 ? 35 : 31)
          .setOffset(index % 2 ? 6 : 7, index % 2 ? 18 : 15);
      }
      this.add
        .image(layout.length - 120, 439, 'sign')
        .setOrigin(0.5, 1)
        .setScale(0.8)
        .setDepth(4);
      this.player = this.physics.add
        .sprite(180, 385, 'dragon-strong')
        .setScale(0.7)
        .setDepth(7)
        .setCollideWorldBounds(true);
      this.player.body.setSize(91, 124).setOffset(52, 30);
      this.player.setMaxVelocity(450, 800);
      this.physics.add.collider(this.player, platforms);
      this.physics.add.collider(this.player, this.obstacles);
      this.fires = this.physics.add.group({ allowGravity: false, immovable: true });
      layout.fires.forEach((position, i) => {
        const orb = this.fires
          .create(position.x, position.y, `fire-${state.level}`)
          .setScale(0.75)
          .setDepth(5);
        orb.body.setCircle(16, 14, 17);
        this.tweens.add({
          targets: orb,
          y: position.y + (state.level >= 9 ? 18 : 6),
          duration: 1000 + (i % 4) * 120,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.inOut',
        });
      });
      this.humans = this.physics.add.group({ allowGravity: false, immovable: true });
      layout.enemies.forEach((enemy) => {
        const human = this.humans
          .create(enemy.x, 405, `human-${enemy.kind}-${enemy.armed}`)
          .setScale(0.71)
          .setDepth(6);
        human.body.setSize(42, 83).setOffset(15, 12);
        human.setData('armed', enemy.armed);
        human.setData('lastThrow', -enemy.kind * 200);
      });
      this.water = this.physics.add.group({ allowGravity: false });
      this.physics.add.overlap(this.player, this.fires, (_, orb) => {
        if (model.current.status !== 'playing') return;
        const x = orb.x,
          y = orb.y;
        orb.destroy();
        commit(collectReward(model.current));
        this.spark(x, y, 0xffcb70);
        playTone('collect', soundRef.current);
      });
      this.physics.add.overlap(this.player, this.humans, (_, human) => {
        if (model.current.status !== 'playing' || human.getData('armed')) return;
        const x = human.x,
          y = human.y;
        human.destroy();
        commit(collectReward(model.current, true));
        this.spark(x, y, 0xe6bb77);
        playTone('collect', soundRef.current);
      });
      this.physics.add.overlap(this.player, this.water, (_, orb) => {
        orb.destroy();
        if (model.current.status !== 'playing' || this.time.now - this.lastHit < 1200) return;
        this.lastHit = this.time.now;
        commit(waterDamage(model.current));
        this.spark(this.player.x, this.player.y, 0x9fdcec);
        playTone('hit', soundRef.current);
        this.tweens.add({
          targets: this.player,
          alpha: 0.38,
          duration: 120,
          yoyo: true,
          repeat: 4,
          onComplete: () => this.player?.setAlpha(1),
        });
        if (model.current.status === 'lost') this.physics.pause();
      });
      this.cameras.main
        .setBounds(0, 0, layout.length, 520)
        .startFollow(this.player, true, 0.075, 0.075, -190, 0);
      this.keys = this.input.keyboard.addKeys('A,D,W,SPACE,LEFT,RIGHT,UP,P,ESC');
      // Capture keys only while the canvas has focus, preserving ordinary page navigation.
      this.input.keyboard.disableGlobalCapture();
      this.preventScroll = (event) => {
        if (
          model.current.status === 'playing' &&
          parent.contains(document.activeElement) &&
          [' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)
        )
          event.preventDefault();
      };
      window.addEventListener('keydown', this.preventScroll);
      this.input.keyboard.on('keydown-P', () => {
        if (!document.querySelector('[role="dialog"]')) this.togglePause();
      });
      this.input.keyboard.on('keydown-ESC', () => {
        if (model.current.status === 'playing' && !document.querySelector('[role="dialog"]'))
          this.togglePause();
      });
      this.visibilityHandler = () => {
        if (document.hidden && model.current.status === 'playing') this.togglePause();
      };
      document.addEventListener('visibilitychange', this.visibilityHandler);
      this.events.once('shutdown', () => {
        window.removeEventListener('keydown', this.preventScroll);
        document.removeEventListener('visibilitychange', this.visibilityHandler);
      });
      for (let i = 0; i < 24; i++) {
        const dot = this.add
          .circle((i * 173) % 1100, 70 + ((i * 53) % 330), i % 3 === 0 ? 2 : 1, 0xffe7a2, 0.35)
          .setScrollFactor(0.15)
          .setDepth(3);
        this.tweens.add({
          targets: dot,
          y: dot.y - 25,
          alpha: 0.05,
          duration: 1800 + i * 80,
          yoyo: true,
          repeat: -1,
        });
      }
      checkpoint = {
        ...state,
        strength: Math.max(75, state.strength),
        status: 'playing',
        distance: 0,
      };
      if (state.status !== 'playing') this.physics.pause();
      onReady();
    }
    spark(x, y, color) {
      for (let i = 0; i < 7; i++) {
        const particle = this.add.circle(x, y, 2 + (i % 3), color).setDepth(9);
        this.tweens.add({
          targets: particle,
          x: x + Math.cos(i) * 35,
          y: y - 25 + Math.sin(i) * 25,
          alpha: 0,
          scale: 0,
          duration: 500,
          onComplete: () => particle.destroy(),
        });
      }
    }
    togglePause() {
      if (model.current.status === 'playing') {
        this.touch = { left: false, right: false, jump: false };
        this.physics.pause();
        commit({ ...model.current, status: 'paused' });
      } else if (model.current.status === 'paused') {
        this.physics.resume();
        commit({ ...model.current, status: 'playing' });
      }
    }
    update(time) {
      if (!this.player) return;
      this.backdrop.tilePositionX = this.cameras.main.scrollX * 0.42;
      const state = model.current;
      const variant = state.wings ? 'winged' : state.strength < 35 ? 'weak' : 'strong';
      if (this.player.texture.key !== `dragon-${variant}`)
        this.player.setTexture(`dragon-${variant}`);
      if (state.status !== 'playing') {
        this.player.anims.stop();
        return;
      }
      const keyboardActive =
        !document.querySelector('[role="dialog"]') &&
        (parent.contains(document.activeElement) || document.activeElement === document.body);
      const left =
        this.touch.left || (keyboardActive && (this.keys.A.isDown || this.keys.LEFT.isDown));
      const right =
        this.touch.right || (keyboardActive && (this.keys.D.isDown || this.keys.RIGHT.isDown));
      const jump =
        this.touch.jump ||
        (keyboardActive && (this.keys.SPACE.isDown || this.keys.W.isDown || this.keys.UP.isDown));
      this.player.setVelocityX(left ? -this.layout.speed : right ? this.layout.speed : 0);
      if (left || right) {
        this.player.setFlipX(left);
        this.player.play(`${variant}-walk`, true);
      } else {
        this.player.anims.stop();
        this.player.setFrame(0);
      }
      if (
        jump &&
        !this.previousJump &&
        (this.player.body.blocked.down || this.player.body.touching.down)
      )
        this.player.setVelocityY(-570);
      if (state.wings && jump) this.player.setVelocityY(-260);
      this.previousJump = jump;
      this.humans.getChildren().forEach((human) => {
        if (!human || !human.active || !human.getData('armed')) return;
        const distance = this.player.x - human.x;
        human.setFlipX(distance < 0);
        if (
          Math.abs(distance) < 610 &&
          Math.abs(distance) > 60 &&
          time - human.getData('lastThrow') > this.layout.throwDelay
        ) {
          const orb = this.water
            .create(human.x, human.y - 15, 'water')
            .setScale(0.64)
            .setDepth(6);
          orb.body.setCircle(16, 14, 17);
          orb.setVelocity(Math.sign(distance) * (165 + state.level * 13), -8);
          orb.setData('born', time);
          human.setData('lastThrow', time);
        }
      });
      this.water
        .getChildren()
        .slice()
        .forEach((orb) => {
          if (orb && (time - orb.getData('born') > 5200 || orb.x < 0 || orb.x > this.layout.length))
            orb.destroy();
        });
      if (time - this.lastReport > 180) {
        const distance = clamp((this.player.x - 180) / (this.layout.length - 350), 0, 1);
        commit({ ...model.current, distance });
        this.lastReport = time;
      }
      if (this.player.y > 510) {
        this.player.setPosition(Math.max(180, this.player.x - 130), 320);
        commit(waterDamage(model.current));
        if (model.current.status === 'lost') this.physics.pause();
      }
      if (!this.finished && this.player.x > this.layout.length - 230) {
        if (state.level === 10 && !state.wings) {
          this.player.setVelocityX(0);
          this.player.x = this.layout.length - 235;
          commit({ ...model.current, status: 'needWings' });
          this.physics.pause();
          return;
        }
        if (state.level === 10 && this.player.y > 315) return;
        this.finished = true;
        this.physics.pause();
        const score = model.current.score + 150;
        commit({
          ...model.current,
          score,
          coins: model.current.coins + 150,
          best: Math.max(model.current.best, score),
          unlocked: Math.max(model.current.unlocked, Math.min(10, state.level + 1)),
          distance: 1,
          status: state.level === 10 ? 'victory' : 'complete',
        });
        playTone('start', soundRef.current);
      }
    }
  }
  const game = new Phaser.Game({
    type: Phaser.CANVAS,
    parent,
    width: 1100,
    height: 520,
    transparent: false,
    backgroundColor: '#bedbd5',
    antialias: true,
    physics: { default: 'arcade', arcade: { gravity: { y: 1100 }, debug: false } },
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    scene: AdventureScene,
    render: { pixelArt: false, roundPixels: false },
    audio: { noAudio: true },
    banner: false,
  });
  game.command = (name) => {
    const scene = sceneInstance;
    if (!scene) return;
    if (name === 'start' || name === 'resume') {
      commit({ ...model.current, status: 'playing' });
      scene.physics.resume();
      parent.focus();
      playTone('start', soundRef.current);
    }
    if (name === 'pause') scene.togglePause();
    if (name === 'retry') {
      commit({ ...checkpoint, best: model.current.best, unlocked: model.current.unlocked });
      scene.scene.restart();
      parent.focus();
    }
    if (name === 'next') {
      commit({
        ...model.current,
        level: Math.min(10, model.current.level + 1),
        status: 'playing',
        distance: 0,
      });
      scene.scene.restart();
      parent.focus();
    }
    if (name === 'reset') scene.scene.restart();
    if (name.startsWith('touch:')) {
      const [, direction, pressed] = name.split(':');
      scene.touch[direction] = pressed === 'on';
    }
  };
  return game;
}
