/**
 * Shared GyanQuest mission hub - 10 mission cards per game (Chemistry Lab pattern).
 */

import { areAllBooksUnlocked } from "/engine/js/book-unlock.js?v=unlock2";

const HUB_CSS_HREF = "/engine/css/mission-hub.css?v=playchrome1";
const HUB_FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=Syne:wght@700;800&display=swap";

/** Play UI pieces to hide while the mission hub is open (curriculum shells). */
export const HUB_PLAY_SELECTORS = [
  ".progress-row",
  ".progress-bar-wrap",
  "#lab-depth",
  "main.stage",
  "footer.bottom-bar",
  ".level-picker",
  "#btn-playground",
  ".btn-playground",
];

/**
 * Inject hub stylesheet (+ display fonts if missing).
 */
export function ensureMissionHubStyles() {
  if (!document.querySelector('link[data-gq-hub-css]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = HUB_CSS_HREF;
    link.dataset.gqHubCss = "1";
    document.head.appendChild(link);
  }
  if (!document.querySelector('link[data-gq-hub-fonts]')) {
    const fonts = document.createElement("link");
    fonts.rel = "stylesheet";
    fonts.href = HUB_FONT_HREF;
    fonts.dataset.gqHubFonts = "1";
    document.head.appendChild(fonts);
  }
}

/**
 * Ensure #mission-hub-root exists after the top bar, wrap play UI in #play-chrome,
 * and add a Missions button.
 * @returns {{ hubRoot: HTMLElement, btnMissions: HTMLElement|null, playChrome: HTMLElement|null }}
 */
export function ensureMissionHubShell() {
  ensureMissionHubStyles();
  const app = document.getElementById("app");
  const topBar = document.querySelector(".top-bar");
  let hubRoot = document.getElementById("mission-hub-root");
  if (!hubRoot) {
    hubRoot = document.createElement("div");
    hubRoot.id = "mission-hub-root";
    hubRoot.className = "mission-hub-root";
    hubRoot.setAttribute("aria-live", "polite");
    hubRoot.innerHTML =
      '<div class="gq-hub"><p class="gq-hub__sub" style="text-align:center;padding:2rem">Loading missions…</p></div>';
    if (topBar?.nextSibling) app?.insertBefore(hubRoot, topBar.nextSibling);
    else app?.appendChild(hubRoot);
  }

  let playChrome = document.getElementById("play-chrome");
  if (!playChrome && app && topBar) {
    playChrome = document.createElement("div");
    playChrome.id = "play-chrome";
    playChrome.className = "play-chrome hidden";
    const move = [];
    let node = hubRoot.nextSibling;
    while (node) {
      const next = node.nextSibling;
      if (node.nodeType === 1) move.push(node);
      node = next;
    }
    move.forEach((el) => playChrome.appendChild(el));
    app.appendChild(playChrome);
  }

  let btnMissions = document.getElementById("btn-missions");
  const actions = document.querySelector(".top-actions");
  if (!btnMissions && actions) {
    btnMissions = document.createElement("button");
    btnMissions.type = "button";
    btnMissions.id = "btn-missions";
    btnMissions.className = "btn secondary hidden";
    btnMissions.title = "All missions";
    btnMissions.textContent = "☰ Missions";
    const checkpoint = document.getElementById("checkpoint-badge");
    if (checkpoint) actions.insertBefore(btnMissions, checkpoint);
    else actions.appendChild(btnMissions);
  }
  return { hubRoot, btnMissions, playChrome };
}

/**
 * Show / hide play chrome around the hub.
 * @param {boolean} inHub
 * @param {{ hubRoot?: HTMLElement|null, btnMissions?: HTMLElement|null, playChrome?: HTMLElement|null }} els
 */
export function setMissionHubMode(inHub, els = {}) {
  const { hubRoot, btnMissions, playChrome } = els;
  const app = document.getElementById("app");
  document.documentElement.classList.toggle("gq-hub-scroll", inHub);
  app?.classList.toggle("app--mission-hub", inHub);
  app?.classList.toggle("app--playing", !inHub);

  if (hubRoot) hubRoot.classList.toggle("hidden", !inHub);
  if (btnMissions) btnMissions.classList.toggle("hidden", inHub);
  if (playChrome) {
    playChrome.classList.toggle("hidden", inHub);
    // HTML `hidden` beats class-based .hidden before stylesheets load
    if (inHub) playChrome.setAttribute("hidden", "");
    else playChrome.removeAttribute("hidden");
  }

  HUB_PLAY_SELECTORS.forEach((sel) => {
    document.querySelectorAll(sel).forEach((el) => {
      if (playChrome && playChrome.contains(el)) return;
      el.classList.toggle("gq-hub-hide-play", inHub);
    });
  });
}

/**
 * Normalize curriculum / meta levels into hub card models.
 * @param {Array<object>} levels
 * @returns {Array<{ kidTitle: string, emoji: string, hook: string, playable: boolean }>}
 */
export function missionsFromLevels(levels, { playable = false } = {}) {
  return (levels || []).map((L) => ({
    kidTitle: L.kidTitle || L.title || "Mission",
    emoji: L.emoji || "📘",
    hook:
      L.hook ||
      (Array.isArray(L.everyday) && L.everyday[0]) ||
      (typeof L.intro === "string" ? L.intro.slice(0, 110) : "") ||
      `Theme: ${L.theme || L.forceTheme || "explore"}`,
    playable: playable && L.playable !== false,
    rewardName: L.rewardName || "",
  }));
}

/**
 * @param {HTMLElement} host
 * @param {{
 *   gameTitle: string,
 *   subtitle?: string,
 *   missions: Array<{ kidTitle: string, emoji?: string, hook?: string, playable?: boolean }>,
 *   completed?: boolean[][],
 *   forceAllLocked?: boolean,
 *   unlockByProgress?: boolean,
 *   onSelect: (missionIndex: number) => void,
 *   onLockedClick?: (missionIndex: number) => void,
 *   onBookClick?: (missionIndex: number, meta: { unlocked: boolean, done: boolean }) => void,
 *   rewards?: Array<{ earned?: boolean, stars?: number, tier?: string|null }>,
 * }} opts
 */
export function mountMissionHub(host, opts) {
  const {
    gameTitle,
    subtitle,
    missions,
    completed,
    forceAllLocked = false,
    unlockByProgress = false,
    onSelect,
    onLockedClick,
    onBookClick,
    rewards,
  } = opts;

  const sub =
    subtitle ||
    (forceAllLocked
      ? "10 missions · 10 steps each. Open Force Fighter to play for now - other labs unlock soon."
      : "10 missions · 10 steps each. Finish one mission to unlock the next.");

  host.innerHTML = `
    <div class="gq-hub__bg" aria-hidden="true"></div>
    <div class="gq-hub" role="region" aria-label="${escapeAttr(gameTitle)} missions">
      <header class="gq-hub__head">
        <p class="gq-hub__eyebrow">${escapeHtml(gameTitle)}</p>
        <h2 class="gq-hub__title">Choose a mission</h2>
        <p class="gq-hub__sub">${escapeHtml(sub)}</p>
      </header>
      <div class="gq-hub__grid" id="gq-hub-grid"></div>
    </div>`;

  const grid = host.querySelector("#gq-hub-grid");
  missions.forEach((m, i) => {
    const progressionOk = !unlockByProgress || missionUnlockedByProgress(i, completed);
    const playable = !!m.playable && !forceAllLocked;
    const locked = forceAllLocked || !progressionOk || !playable;
    const done =
      Array.isArray(completed?.[i]) && completed[i].length === 10 && completed[i].every(Boolean);

    let badge = "Play";
    let kind = "live";
    if (forceAllLocked || (!playable && progressionOk)) {
      badge = forceAllLocked ? "Locked" : "Soon";
      kind = forceAllLocked ? "locked" : "soon";
    } else if (!progressionOk) {
      badge = "Locked";
      kind = "locked";
    } else if (done) {
      const rw = rewards?.[i];
      const tier = rw?.tier || (rw?.earned ? `SOLO` : null);
      badge = tier ? `Done · ${tier}` : "Done";
      kind = "done";
    }

    const canOpen = playable && progressionOk && !forceAllLocked;
    const bookUnlocked =
      playable && !forceAllLocked && (done || areAllBooksUnlocked());

    const card = document.createElement("div");
    card.className = `gq-hub-card gq-hub-card--${kind}`;
    if (!canOpen) card.classList.add("gq-hub-card--locked");

    const playBtn = document.createElement("button");
    playBtn.type = "button";
    playBtn.className = "gq-hub-card__play";
    playBtn.disabled = !canOpen && !onLockedClick;
    playBtn.setAttribute(
      "aria-label",
      canOpen ? `Play ${m.kidTitle}` : `${m.kidTitle} - ${badge.toLowerCase()}`,
    );
    playBtn.innerHTML = `
      <span class="gq-hub-card__emoji" aria-hidden="true">${m.emoji || "📘"}</span>
      <span class="gq-hub-card__num">Mission ${i + 1}</span>
      <strong class="gq-hub-card__title">${escapeHtml(m.kidTitle)}</strong>
      <p class="gq-hub-card__hook">${escapeHtml(m.hook || "")}</p>
      <span class="gq-hub-card__badge">${badge}</span>`;
    playBtn.onclick = () => {
      if (canOpen) onSelect?.(i);
      else onLockedClick?.(i);
    };

    const bookBtn = document.createElement("button");
    bookBtn.type = "button";
    const paintBookBtn = () => {
      const liveUnlocked =
        playable && !forceAllLocked && (done || areAllBooksUnlocked());
      bookBtn.className = `gq-hub-card__book${liveUnlocked ? "" : " gq-hub-card__book--locked"}`;
      bookBtn.title = liveUnlocked
        ? `Read the book for ${m.kidTitle}`
        : "Finish this mission's 10 steps to unlock the book";
      bookBtn.setAttribute(
        "aria-label",
        liveUnlocked ? `Read book: ${m.kidTitle}` : `Book locked: ${m.kidTitle}`,
      );
      bookBtn.innerHTML = liveUnlocked
        ? `<span aria-hidden="true">Book</span>`
        : `<span aria-hidden="true">Locked</span>`;
      return liveUnlocked;
    };
    paintBookBtn();
    bookBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const liveUnlocked = paintBookBtn();
      onBookClick?.(i, { unlocked: liveUnlocked, done });
    };

    card.appendChild(bookBtn);
    card.appendChild(playBtn);
    grid.appendChild(card);
  });
}

export function missionUnlockedByProgress(index, completed) {
  if (index === 0) return true;
  const prev = completed?.[index - 1];
  if (!Array.isArray(prev)) return false;
  return prev.every(Boolean);
}

function escapeHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(s) {
  return escapeHtml(s).replace(/'/g, "&#39;");
}
