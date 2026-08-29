/**
 * Floating GyanQuest tutor (Groq via /api/chat).
 * Socratic word flow: ask what the learner thinks → evaluate → compare.
 */
const CHAT_CSS = "/engine/css/book-chat.css?v=tutor2";
const CHAT_VER = "tutor2";

function ensureChatCss() {
  if (document.querySelector("link[data-gq-chat-css]")) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = CHAT_CSS;
  link.dataset.gqChatCss = "1";
  document.head.appendChild(link);
}

function escapeHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Inline markdown: **bold**, *italic*, ~~strike~~ */
function inlineMd(text) {
  let s = escapeHtml(text);
  s = s.replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/(?<![*\w])\*([^*\n]+)\*(?!\*)/g, "<em>$1</em>");
  s = s.replace(/~~([^~\n]+)~~/g, "<del>$1</del>");
  return s;
}

/** Block markdown: paragraphs, - bullets, 1. numbered lists */
function formatBotMessage(text) {
  const lines = String(text ?? "").replace(/\r\n/g, "\n").split("\n");
  const out = [];
  let inUl = false;
  let inOl = false;

  const closeLists = () => {
    if (inUl) {
      out.push("</ul>");
      inUl = false;
    }
    if (inOl) {
      out.push("</ol>");
      inOl = false;
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    const trimmed = line.trim();
    const bullet = trimmed.match(/^[-*•]\s+(.+)$/);
    const numbered = trimmed.match(/^\d+[.)]\s+(.+)$/);

    if (bullet) {
      if (inOl) {
        out.push("</ol>");
        inOl = false;
      }
      if (!inUl) {
        out.push("<ul>");
        inUl = true;
      }
      out.push(`<li>${inlineMd(bullet[1])}</li>`);
    } else if (numbered) {
      if (inUl) {
        out.push("</ul>");
        inUl = false;
      }
      if (!inOl) {
        out.push("<ol>");
        inOl = true;
      }
      out.push(`<li>${inlineMd(numbered[1])}</li>`);
    } else {
      closeLists();
      if (trimmed) out.push(`<p>${inlineMd(trimmed)}</p>`);
    }
  }
  closeLists();
  return out.join("") || `<p>${inlineMd(text)}</p>`;
}

let chatState = {
  open: false,
  subject: "",
  history: [],
  busy: false,
  lastTerm: "",
  pendingTerm: null,
};

/**
 * Mount floating chat FAB + panel once per page.
 * @param {{ subject?: string }} opts
 */
export function mountBookChat(opts = {}) {
  ensureChatCss();
  chatState.subject = opts.subject || chatState.subject || document.title || "GyanQuest";

  if (document.getElementById("gq-book-chat-root")) {
    return document.getElementById("gq-book-chat-root");
  }

  const root = document.createElement("div");
  root.id = "gq-book-chat-root";
  root.className = "gq-chat";
  root.innerHTML = `
 <button type="button" class="gq-chat__fab" id="gq-chat-fab" aria-expanded="false" title="Ask tutor">
 Ask
 </button>
 <div class="gq-chat__panel hidden" id="gq-chat-panel" role="dialog" aria-label="Tutor chat">
 <header class="gq-chat__head">
 <div>
 <strong>GyanQuest Tutor</strong>
 <p class="gq-chat__sub">Ask anything — or tap a red word in the book</p>
 </div>
 <button type="button" class="gq-chat__x" id="gq-chat-close" aria-label="Close chat">Close</button>
 </header>
 <div class="gq-chat__msgs" id="gq-chat-msgs" aria-live="polite"></div>
 <form class="gq-chat__form" id="gq-chat-form">
 <input type="text" id="gq-chat-input" placeholder="Type a question..." autocomplete="off" />
 <button type="submit" id="gq-chat-send">Send</button>
 </form>
 </div>`;
  document.body.appendChild(root);

  const fab = root.querySelector("#gq-chat-fab");
  const panel = root.querySelector("#gq-chat-panel");
  const closeBtn = root.querySelector("#gq-chat-close");
  const form = root.querySelector("#gq-chat-form");
  const input = root.querySelector("#gq-chat-input");

  const setOpen = (open) => {
    chatState.open = open;
    panel.classList.toggle("hidden", !open);
    fab.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) input.focus();
  };

  fab.addEventListener("click", () => setOpen(!chatState.open));
  closeBtn.addEventListener("click", () => setOpen(false));
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    input.value = "";
    appendUser(text);
    const sendBtn = form.querySelector("#gq-chat-send");
    if (sendBtn) sendBtn.disabled = true;
    handleUserMessage(text).finally(() => {
      if (sendBtn) sendBtn.disabled = false;
    });
  });

  appendBot(
    "Hi! I am your GyanQuest tutor. Tap a **red word** in a mission book, or ask me anything. I will ask what **you** think first — then we compare ideas together.",
  );
  return root;
}

/**
 * @param {{
 * subject?: string,
 * term?: string,
 * message?: string,
 * buildThenReveal?: boolean,
 * tiered?: boolean,
 * bookFigure?: string|null,
 * level?: number,
 * onExplained?: (info: object) => void,
 * }} opts
 */
export function openBookChat(opts = {}) {
  mountBookChat({ subject: opts.subject });
  if (opts.subject) chatState.subject = opts.subject;
  const panel = document.getElementById("gq-chat-panel");
  const fab = document.getElementById("gq-chat-fab");
  panel?.classList.remove("hidden");
  fab?.setAttribute("aria-expanded", "true");
  chatState.open = true;

  if (opts.term) {
    beginTermFlow(opts);
  } else if (opts.message) {
    appendUser(opts.message);
    sendChat({ message: opts.message, subject: opts.subject || chatState.subject, phase: "chat" });
  }
}

function beginTermFlow(opts) {
  const term = opts.term;
  const subject = opts.subject || chatState.subject;
  const key = `${subject}::${term}`.toLowerCase();
  chatState._tiers = chatState._tiers || {};
  chatState._tiers[key] = (chatState._tiers[key] || 0) + 1;
  const tier = Math.min(3, chatState._tiers[key]);

  try {
    if (typeof window.__gqGetState === "function") {
      const st = window.__gqGetState();
      st.hintTiers = st.hintTiers || {};
      st.hintTiers[key] = tier;
      window.__gqPersist?.();
    }
  } catch {
    /* ignore */
  }

  chatState.lastTerm = term;

  if (tier <= 1 || opts.buildThenReveal !== false) {
    chatState.pendingTerm = {
      term,
      subject,
      tier,
      bookFigure: opts.bookFigure || null,
      level: opts.level,
      onExplained: opts.onExplained,
    };
    appendBot(
      `From the book you tapped **${term}**.\n\nWhat do you think this word means? Say it in **your own words** — there is no wrong answer yet.`,
    );
    return;
  }

  appendUser(`From the digital book I pressed a word: ${term}`);
  sendChat({
    term,
    subject,
    tier,
    bookFigure: opts.bookFigure,
    phase: "explain",
  }).then(() => {
    logConcept(term, subject, opts.level);
    opts.onExplained?.({ term, tier, subject });
  });
}

async function handleUserMessage(text) {
  if (chatState.pendingTerm) {
    const pending = chatState.pendingTerm;
    chatState.pendingTerm = null;
    await sendChat({
      term: pending.term,
      subject: pending.subject,
      tier: pending.tier,
      bookFigure: pending.bookFigure,
      phase: "evaluate",
      userAttempt: text,
    });
    logConcept(pending.term, pending.subject, pending.level);
    pending.onExplained?.({ term: pending.term, tier: pending.tier, subject: pending.subject });
    return;
  }

  const phase = chatState.lastTerm ? "followup" : "chat";
  await sendChat({ message: text, subject: chatState.subject, phase });
}

function logConcept(term, subject, level) {
  try {
    if (typeof window.__gqGetState === "function") {
      const st = window.__gqGetState();
      st.conceptLog = st.conceptLog || [];
      st.conceptLog.push({
        term,
        subject: subject || "",
        level: typeof level === "number" ? level : st.level || 0,
        timestamp: Date.now(),
      });
      if (st.conceptLog.length > 200) st.conceptLog = st.conceptLog.slice(-200);
      window.__gqPersist?.();
    }
    import("/engine/js/auth-api.js?v=auth2")
      .then((m) =>
        m.postConceptLog?.({
          term,
          subject: subject || "",
          level: typeof level === "number" ? level : 0,
        }),
      )
      .catch(() => {});
  } catch {
    /* ignore */
  }
}

function appendUser(text) {
  const box = document.getElementById("gq-chat-msgs");
  if (!box) return;
  const el = document.createElement("div");
  el.className = "gq-chat__bubble gq-chat__bubble--user";
  el.textContent = text;
  box.appendChild(el);
  box.scrollTop = box.scrollHeight;
}

function appendBot(text) {
  const box = document.getElementById("gq-chat-msgs");
  if (!box) return;
  const el = document.createElement("div");
  el.className = "gq-chat__bubble gq-chat__bubble--bot";
  el.innerHTML = formatBotMessage(text);
  box.appendChild(el);
  box.scrollTop = box.scrollHeight;
}

function appendStatus(text) {
  const box = document.getElementById("gq-chat-msgs");
  if (!box) return;
  let el = box.querySelector(".gq-chat__status");
  if (!el) {
    el = document.createElement("div");
    el.className = "gq-chat__status";
    box.appendChild(el);
  }
  el.textContent = text;
  box.scrollTop = box.scrollHeight;
  return el;
}

async function sendChat({
  message,
  term,
  subject,
  tier,
  bookFigure,
  phase = "chat",
  userAttempt,
}) {
  const started = Date.now();
  while (chatState.busy && Date.now() - started < 20000) {
    await new Promise((r) => setTimeout(r, 40));
  }
  if (chatState.busy) {
    appendBot("One moment — still finishing the last answer. Try again.");
    return;
  }
  chatState.busy = true;
  const status = appendStatus("Thinking...");

  const tierN = tier || 1;
  const topic = subject || chatState.subject;
  let userContent = message || "";
  let apiPhase = phase;

  if (phase === "evaluate" && term && userAttempt) {
    chatState.lastTerm = term;
    userContent =
      `The learner tapped the glossary word "${term}" in ${topic} and said what they think it means:\n` +
      `"${userAttempt}"\n\n` +
      `Evaluate their idea using the tutor format (actual meaning, what they said, how close, compare).`;
    apiPhase = "evaluate";
  } else if (term && phase === "explain") {
    chatState.lastTerm = term;
    if (tierN <= 1) {
      userContent = `Explain "${term}" in ${topic} for a school kid.`;
    } else if (tierN === 2) {
      userContent = `Explain "${term}" in ${topic} again, going deeper than before.`;
    } else {
      userContent = `Give the clearest full answer for "${term}" in ${topic}${
        bookFigure ? ` (book figure: ${bookFigure})` : ""
      }.`;
    }
    apiPhase = "explain";
  } else if (chatState.lastTerm && phase === "followup") {
    userContent = `${message}\n\n(Still about "${chatState.lastTerm}" in ${topic}.)`;
    apiPhase = "followup";
  } else if (message) {
    userContent = message;
    apiPhase = phase === "chat" ? "chat" : phase;
  }

  const payload = {
    subject: topic,
    term: term || chatState.lastTerm || undefined,
    message: userContent || undefined,
    phase: apiPhase,
    tier: tierN,
    userAttempt: userAttempt || undefined,
    messages: [...chatState.history, { role: "user", content: userContent }],
  };

  const ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
  const timer = ctrl ? setTimeout(() => ctrl.abort(), 22000) : null;
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
      signal: ctrl?.signal,
    });
    const data = await res.json().catch(() => ({}));
    status?.remove();
    if (!res.ok) {
      const detail = data.detail || data.error || "";
      appendBot(
        detail
          ? `Chat is offline right now.\n\n- ${detail}\n\nYou can still use the book and missions. Ask your teacher if this keeps happening.`
          : "Chat is offline right now. Check that **groq_proxy.py** is running and **GROQ_API_KEY** is in `.env`.",
      );
      return;
    }
    const reply = data.reply || "I could not form an answer.";
    appendBot(reply);
    chatState.history.push(
      { role: "user", content: payload.messages[payload.messages.length - 1].content },
      { role: "assistant", content: reply },
    );
    if (chatState.history.length > 16) chatState.history = chatState.history.slice(-16);
  } catch (err) {
    status?.remove();
    appendBot(
      err?.name === "AbortError"
        ? "That took too long — ask again in a moment."
        : "Chat is offline. Start the server with: `py -3 tools/groq_proxy.py`",
    );
  } finally {
    if (timer) clearTimeout(timer);
    chatState.busy = false;
  }
}

export { CHAT_VER };
