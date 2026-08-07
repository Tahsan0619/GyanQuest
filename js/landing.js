/**
 * GyanQuest landing  -  bilingual catalog (en / bn).
 */

const STORAGE_KEY = "gyanquest-locale";
const UNLOCK_BOOKS_KEY = "gq-unlock-all-books";

const COPY = {
  en: {
    navGames: "Games",
    navWhy: "Why GyanQuest",
    navVision: "Vision",
    playNow: "Play now",
    badge: "Interactive learning for Bangladesh",
    tagline: "Learn. Level Up. Lead.",
    heroLead:
      "GyanQuest is a growing library of 3D mission games  -  বাংলা and English  -  that turn textbooks into labs you can touch on any phone.",
    exploreGames: "Explore games",
    whyUs: "Why GyanQuest",
    statGames: "Learning games",
    statLang: "Languages",
    statPlay: "Play style",
    statPlayVal: "3D + missions",
    gamesTitle: "Game library",
    gamesLead: "Twenty-eight live mission games  -  same shared engine, every subject playable.",
    live: "Play now",
    soon: "Coming soon",
    whyTitle: "Why we outperform",
    whyLead: "Built for how Bangladesh actually learns.",
    p1t: "Learn by doing",
    p1d: "Drag, push, fail, retry  -  not passive video.",
    p2t: "বাংলা + English",
    p2d: "Strict language modes  -  no mixed UI.",
    p3t: "Any device",
    p3d: "Browser-based. No install. Works on shared family phones.",
    p4t: "National scale",
    p4d: "One platform, every subject  -  from physics to cybersecurity.",
    visionTitle: "Digitalizing Bangladesh, one subject at a time",
    visionLead:
      "From village classrooms to city prep centers: quality labs, local language, and measurable progress  -  without expensive hardware or foreign-only content.",
    visionCta: "Start with Force Fighter",
    footer: "GyanQuest  -  Learn. Level Up. Lead.",
    tracks: {
      core: "Core sciences",
      cs: "Computer science & technology",
      eng: "Engineering & applied science",
      adv: "Advanced sciences",
      math: "Mathematics extended",
    },
    games: {
      forceFighter: "Force Fighter",
      forceFighterSub: "Push, pull, friction & gravity  -  10 levels + playground",
      chemistry: "Chemistry Lab",
      chemistrySub: "Atoms, bonds, reactions",
      biology: "Bio Explorer",
      biologySub: "Cells, ecosystems, body systems",
      mathematics: "Math Quest",
      mathematicsSub: "Numbers, algebra, patterns",
      environmental: "Eco Guardian",
      environmentalSub: "Climate, resources, sustainability",
      ict: "ICT Fundamentals",
      ictSub: "Digital literacy & tools",
      web: "Web Dev Studio",
      webSub: "HTML, CSS, JavaScript",
      backend: "Backend Builder",
      backendSub: "APIs, servers, Node & Laravel ideas",
      database: "Database & SQL",
      databaseSub: "Tables, queries, design",
      networking: "Networking & Internet",
      networkingSub: "Packets, DNS, the web stack",
      cybersecurity: "Cyber Shield",
      cybersecuritySub: "Safety, encryption, threats",
      os: "OS & Hardware",
      osSub: "Processes, memory, machines",
      ai: "Artificial Intelligence",
      aiSub: "Agents, prompts, ethics",
      ml: "Machine Learning",
      mlSub: "Models, training, data",
      dataScience: "Data Science",
      dataScienceSub: "Stats, charts, insight",
      electrical: "Electrical Basics",
      electricalSub: "Circuits, current, voltage",
      mechanical: "Mechanical Basics",
      mechanicalSub: "Forces, machines, motion",
      civil: "Civil Basics",
      civilSub: "Structures, loads, materials",
      robotics: "Electronics & Robotics",
      roboticsSub: "Sensors, code, builds",
      green: "Green Tech",
      greenSub: "Solar, wind, sustainable power",
      astronomy: "Astronomy & Space",
      astronomySub: "Planets, orbits, cosmos",
      geology: "Geology & Earth",
      geologySub: "Rocks, plates, time",
      health: "Human Anatomy & Health",
      healthSub: "Organs, wellness, care",
      genetics: "Genetics & Biotech",
      geneticsSub: "DNA, inheritance, CRISPR ideas",
      statistics: "Statistics & Probability",
      statisticsSub: "Chance, distributions, data",
      geometry: "Geometry & Trigonometry",
      geometrySub: "Shapes, angles, proofs",
      calculus: "Calculus & Analysis",
      calculusSub: "Rates, areas, change",
      discrete: "Discrete Math & Logic",
      discreteSub: "Sets, graphs, algorithms",
    },
  },
  bn: {
    navGames: "গেম",
    navWhy: "কেন GyanQuest",
    navVision: "ভিশন",
    playNow: "এখনই খেলুন",
    badge: "বাংলাদেশের জন্য ইন্টারঅ্যাক্টিভ শিক্ষা",
    tagline: "শিখো। লেভেল আপ করো। নেতৃত্ব দাও।",
    heroLead:
      "GyanQuest হলো ৩ডি মিশন গেমের বাড়তে থাকা লাইব্রেরি  -  বাংলা ও ইংরেজিতে  -  যেখানে পাঠ্যবইয়ের ধারণা ফোনেই স্পর্শ করে শেখা যায়।",
    exploreGames: "গেম দেখুন",
    whyUs: "কেন GyanQuest",
    statGames: "শিক্ষা গেম",
    statLang: "ভাষা",
    statPlay: "খেলার ধরন",
    statPlayVal: "৩ডি + মিশন",
    gamesTitle: "গেম লাইব্রেরি",
    gamesLead: "২৮টি লাইভ মিশন গেম  -  একই শেয়ার্ড ইঞ্জিন, সব বিষয় খেলা যায়।",
    live: "খেলুন",
    soon: "শীঘ্রই",
    whyTitle: "আমরা কেন এগিয়ে",
    whyLead: "বাংলাদেশ যেভাবে শেখে, তার জন্য বানানো।",
    p1t: "করতে করতে শেখা",
    p1d: "টানা, ঠেলা, ভুল, আবার চেষ্টা  -  প্যাসিভ ভিডিও নয়।",
    p2t: "বাংলা + ইংরেজি",
    p2d: "পৃথক ভাষা মোড  -  মিশ্র UI নেই।",
    p3t: "যেকোনো ডিভাইস",
    p3d: "ব্রাউজারেই চলে। ইনস্টল লাগে না।",
    p4t: "জাতীয় স্কেল",
    p4d: "এক প্ল্যাটফর্ম, সব বিষয়  -  পদার্থ থেকে সাইবার নিরাপত্তা।",
    visionTitle: "বাংলাদেশ ডিজিটালাইজ, এক বিষয়ে এক পা",
    visionLead:
      "গ্রামের ক্লাসরুম থেকে শহরের কোচিং  -  মানসম্মত ল্যাব, স্থানীয় ভাষা, অগ্রগতি মাপা  -  ব্যয়বহুল হার্ডওয়্যার ছাড়াই।",
    visionCta: "Force Fighter দিয়ে শুরু করুন",
    footer: "GyanQuest  -  শিখো। লেভেল আপ করো। নেতৃত্ব দাও।",
    tracks: {
      core: "মূল বিজ্ঞান",
      cs: "কম্পিউটার বিজ্ঞান ও প্রযুক্তি",
      eng: "ইঞ্জিনিয়ারিং ও প্রয়োগিক বিজ্ঞান",
      adv: "উন্নত বিজ্ঞান",
      math: "গণিত (প্রসারিত)",
    },
    games: {
      forceFighter: "Force Fighter",
      forceFighterSub: "বল, ঘর্ষণ, অভিকর্ষ  -  ১০ লেভেল + খেলার মাঠ",
      chemistry: "রসায়ন ল্যাব",
      chemistrySub: "পরমাণু, বন্ধন, বিক্রিয়া",
      biology: "জীববিজ্ঞান অন্বেষণ",
      biologySub: "কোষ, বাস্তুতন্ত্র, দেহ",
      mathematics: "গণিত কোয়েস্ট",
      mathematicsSub: "সংখ্যা, বীজগণিত, প্যাটার্ন",
      environmental: "পরিবেশ রক্ষক",
      environmentalSub: "জলবায়ু, সম্পদ, টেকসই",
      ict: "আইসিটি মূলভিত্তি",
      ictSub: "ডিজিটাল দক্ষতা",
      web: "ওয়েব ডেভ স্টুডিও",
      webSub: "HTML, CSS, JavaScript",
      backend: "ব্যাকএন্ড বিল্ডার",
      backendSub: "API, সার্ভার, Node ও Laravel",
      database: "ডাটাবেস ও SQL",
      databaseSub: "টেবিল, কোয়েরি, ডিজাইন",
      networking: "নেটওয়ার্কিং",
      networkingSub: "প্যাকেট, DNS, ওয়েব",
      cybersecurity: "সাইবার শিল্ড",
      cybersecuritySub: "নিরাপত্তা, এনক্রিপশন",
      os: "অপারেটিং সিস্টেম",
      osSub: "প্রসেস, মেমরি, হার্ডওয়্যার",
      ai: "কৃত্রিম বুদ্ধিমত্তা",
      aiSub: "এজেন্ট, প্রম্পট, নীতি",
      ml: "মেশিন লার্নিং",
      mlSub: "মডেল, ট্রেনিং, ডেটা",
      dataScience: "ডেটা সায়েন্স",
      dataScienceSub: "পরিসংখ্যান, চার্ট",
      electrical: "তড়িৎ মূলভিত্তি",
      electricalSub: "বর্তনী, প্রবাহ, ভোল্ট",
      mechanical: "যন্ত্র প্রকৌশল",
      mechanicalSub: "বল, যন্ত্র, গতি",
      civil: "পুরকৌশল",
      civilSub: "কাঠামো, লোড, উপাদান",
      robotics: "রোবোটিক্স",
      roboticsSub: "সেন্সর, কোড, বিল্ড",
      green: "সবুজ প্রযুক্তি",
      greenSub: "সৌর, বায়ু, টেকসই শক্তি",
      astronomy: "জ্যোতির্বিদ্যা",
      astronomySub: "গ্রহ, কক্ষপথ, মহাবিশ্ব",
      geology: "ভূতত্ত্ব",
      geologySub: "শিলা, প্লেট, সময়",
      health: "দেহ ও স্বাস্থ্য",
      healthSub: "অঙ্গ, সুস্থতা",
      genetics: "জিনতত্ত্ব",
      geneticsSub: "DNA, উত্তরাধিকার",
      statistics: "পরিসংখ্যান",
      statisticsSub: "সম্ভাবনা, বন্টন",
      geometry: "জ্যামিতি",
      geometrySub: "আকার, কোণ, প্রমাণ",
      calculus: "ক্যালকুলাস",
      calculusSub: "হার, ক্ষেত্রফল, পরিবর্তন",
      discrete: "বিচ্ছিন্ন গণিত",
      discreteSub: "সেট, গ্রাফ, অ্যালগরিদম",
    },
  },
};

const CATALOG = [
  {
    track: "core",
    items: [
      { id: "forceFighter", emoji: "🪨", href: "/games/force-fighter/", live: true },
      { id: "chemistry", emoji: "⚗️", href: "/games/chemistry-lab/", live: true },
      { id: "biology", emoji: "🧬", href: "/games/bio-explorer/", live: true },
      { id: "mathematics", emoji: "📐", href: "/games/math-quest/", live: true },
      { id: "environmental", emoji: "🌍", href: "/games/eco-guardian/", live: true },
    ],
  },
  {
    track: "cs",
    items: [
      { id: "ict", emoji: "💻", href: "/games/ict-fundamentals/", live: true },
      { id: "web", emoji: "🌐", href: "/games/web-dev-studio/", live: true },
      { id: "backend", emoji: "🖥️", href: "/games/backend-builder/", live: true },
      { id: "database", emoji: "🗄️", href: "/games/database-sql/", live: true },
      { id: "networking", emoji: "📡", href: "/games/networking-internet/", live: true },
      { id: "cybersecurity", emoji: "🛡️", href: "/games/cyber-shield/", live: true },
      { id: "os", emoji: "⚙️", href: "/games/os-hardware/", live: true },
      { id: "ai", emoji: "🤖", href: "/games/ai-lab/", live: true },
      { id: "ml", emoji: "📊", href: "/games/ml-lab/", live: true },
      { id: "dataScience", emoji: "📈", href: "/games/data-science/", live: true },
    ],
  },
  {
    track: "eng",
    items: [
      { id: "electrical", emoji: "⚡", href: "/games/electrical-basics/", live: true },
      { id: "mechanical", emoji: "🔧", href: "/games/mechanical-basics/", live: true },
      { id: "civil", emoji: "🏗️", href: "/games/civil-basics/", live: true },
      { id: "robotics", emoji: "🦾", href: "/games/electronics-robotics/", live: true },
      { id: "green", emoji: "♻️", href: "/games/green-tech/", live: true },
    ],
  },
  {
    track: "adv",
    items: [
      { id: "astronomy", emoji: "🪐", href: "/games/astronomy-space/", live: true },
      { id: "geology", emoji: "🌋", href: "/games/geology-earth/", live: true },
      { id: "health", emoji: "🫀", href: "/games/human-anatomy/", live: true },
      { id: "genetics", emoji: "🧪", href: "/games/genetics-biotech/", live: true },
    ],
  },
  {
    track: "math",
    items: [
      { id: "statistics", emoji: "🎲", href: "/games/statistics-probability/", live: true },
      { id: "geometry", emoji: "📏", href: "/games/geometry-trig/", live: true },
      { id: "calculus", emoji: "∫", href: "/games/calculus-analysis/", live: true },
      { id: "discrete", emoji: "🔢", href: "/games/discrete-math/", live: true },
    ],
  },
];

let locale = "en";

function t(path) {
  const parts = path.split(".");
  let cur = COPY[locale];
  for (const p of parts) {
    cur = cur?.[p];
  }
  return cur ?? path;
}

function applyLocale() {
  document.documentElement.lang = locale === "bn" ? "bn" : "en";
  document.body.classList.toggle("locale-bn", locale === "bn");
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (key) el.textContent = t(key);
  });
  const langBtn = document.getElementById("gq-lang");
  if (langBtn) langBtn.textContent = locale === "bn" ? "English" : "বাংলা";
  renderCatalog();
}

function renderCatalog() {
  const root = document.getElementById("gq-catalog");
  if (!root) return;
  let unlockOn = false;
  try {
    unlockOn = localStorage.getItem(UNLOCK_BOOKS_KEY) === "1";
  } catch {
    unlockOn = false;
  }
  root.innerHTML = "";
  for (const group of CATALOG) {
    const section = document.createElement("section");
    section.className = "gq-track";
    const h = document.createElement("h3");
    h.className = "gq-track__title";
    h.innerHTML = `<span>📚</span> ${t(`tracks.${group.track}`)}`;
    section.appendChild(h);
    const grid = document.createElement("div");
    grid.className = "gq-grid";
    for (const item of group.items) {
      const card = document.createElement(item.live ? "a" : "div");
      card.className = `gq-card${item.live ? " gq-card--live" : " gq-card--locked"}`;
      if (item.live && item.href) {
        const href = unlockOn
          ? item.href + (item.href.includes("?") ? "&" : "?") + "unlockBooks=1"
          : item.href;
        card.href = href;
        card.setAttribute("aria-label", t(`games.${item.id}`));
      }
      card.innerHTML = `
        <span class="gq-card__emoji" aria-hidden="true">${item.emoji}</span>
        <h4 class="gq-card__title">${t(`games.${item.id}`)}</h4>
        <p class="gq-card__sub">${t(`games.${item.id}Sub`)}</p>
        <span class="gq-card__badge">${item.live ? t("live") : t("soon")}</span>`;
      grid.appendChild(card);
    }
    section.appendChild(grid);
    root.appendChild(section);
  }
}

function init() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "bn" || saved === "en") locale = saved;
  } catch {
    /* private mode */
  }
  applyLocale();
  document.getElementById("gq-lang")?.addEventListener("click", () => {
    locale = locale === "bn" ? "en" : "bn";
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      /* ignore */
    }
    applyLocale();
  });
  initUnlockBooksToggle();
  initAuth();
}

async function initAuth() {
  const host = document.getElementById("gq-auth-host");
  if (!host) return;
  try {
    const auth = await import("/engine/js/auth-api.js?v=1");
    auth.mountAuthControls(host);
  } catch (err) {
    console.warn("[auth]", err);
  }
}

function initUnlockBooksToggle() {
  const btn = document.getElementById("gq-unlock-books");
  if (!btn) return;

  const sync = () => {
    let on = false;
    try {
      on = localStorage.getItem(UNLOCK_BOOKS_KEY) === "1";
    } catch {
      on = false;
    }
    btn.setAttribute("aria-pressed", on ? "true" : "false");
    btn.textContent = on ? "Unlock books: On" : "Unlock books: Off";
    btn.title = on
      ? "Mission books are unlocked - open a game from the library below"
      : "Unlock mission books without finishing levels";
    // Keep Play now links in sync too
    document.querySelectorAll('a[href*="/games/"]').forEach((a) => {
      try {
        const url = new URL(a.getAttribute("href"), location.origin);
        if (!url.pathname.startsWith("/games/")) return;
        if (on) url.searchParams.set("unlockBooks", "1");
        else url.searchParams.delete("unlockBooks");
        a.setAttribute("href", url.pathname + url.search + url.hash);
      } catch {
        /* ignore */
      }
    });
    renderCatalog();
  };

  sync();
  btn.addEventListener("click", () => {
    let on = false;
    try {
      on = localStorage.getItem(UNLOCK_BOOKS_KEY) !== "1";
      localStorage.setItem(UNLOCK_BOOKS_KEY, on ? "1" : "0");
    } catch (err) {
      alert("Could not save unlock setting (private browsing?). Try another browser mode.");
      return;
    }
    sync();
    alert(
      on
        ? "Books unlocked. Open any game from the library, then tap Book on a live mission."
        : "Books locked again. Finish each mission's 10 steps to read its book.",
    );
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
