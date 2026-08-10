/**
 * Floating GyanQuest explain-chat (Groq via /api/chat).
 * Step 0: Scenario A - extend this path for tiered hints + build-then-reveal (Features 2 & 6).
 */
const CHAT_CSS = "/engine/css/book-chat.css?v=ped1";

function ensureChatCss() {
 if (document.querySelector('link[data-gq-chat-css]')) return;
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

let chatState = {
 open: false,
 subject: "",
 history: [],
 busy: false,
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
 <p class="gq-chat__sub">Ask anything - or tap a red word in the book</p>
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
 // Always paint the user bubble first - never hide it behind busy/API state.
 appendUser(text);
 const sendBtn = form.querySelector("#gq-chat-send");
 if (sendBtn) sendBtn.disabled = true;
 sendChat({ message: text }).finally(() => {
 if (sendBtn) sendBtn.disabled = false;
 });
 });

 appendBot("Hi! I explain hard words and ideas simply. Tap a red word in a mission book, or ask me anything.");
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
 const term = opts.term;
 const ped = window.__gqPed;
 const s = ped ? null : null;
 // Tier from persist hintTiers via __gqPed state if available
 let tier = 1;
 if (opts.tiered && window.__gqPed) {
 try {
 const st = window.__gqPed;
 // hint tier stored on game state through getState if exposed - use local session map on chatState
 } catch {
 /* ignore */
 }
 }
 const key = `${opts.subject || chatState.subject}::${term}`.toLowerCase();
 chatState._tiers = chatState._tiers || {};
 chatState._tiers[key] = (chatState._tiers[key] || 0) + 1;
 tier = Math.min(3, chatState._tiers[key]);

 // Also mirror into game persist hintTiers when pedagogy wired
 try {
 const gs = window.__gqPed && window.__gqSaveState;
 // Decision: store tiers on chatState session; also push to game state if __gqGetState exists
 if (typeof window.__gqGetState === "function") {
 const st = window.__gqGetState();
 st.hintTiers = st.hintTiers || {};
 st.hintTiers[key] = tier;
 window.__gqPersist?.();
 }
 } catch {
 /* ignore */
 }

 const runExplain = () => {
      appendUser(`From the digital book I pressed a word: ${term}`);
 sendChat({
 term,
 subject: opts.subject || chatState.subject,
 tier,
 bookFigure: opts.bookFigure,
 }).then(() => {
 logConcept(term, opts.subject || chatState.subject, opts.level);
 opts.onExplained?.({ term, tier, subject: opts.subject });
 });
 };

 if (opts.buildThenReveal) {
 showBuildThenReveal(term, runExplain);
 } else {
 runExplain();
 }
 } else if (opts.message) {
 appendUser(opts.message);
 sendChat({ message: opts.message, subject: opts.subject || chatState.subject });
 }
}

function showBuildThenReveal(term, then) {
 const box = document.getElementById("gq-chat-msgs");
 if (!box) {
 then?.();
 return;
 }
 const wrap = document.createElement("div");
 wrap.className = "gq-chat__build";
 wrap.innerHTML = `
 <p><strong>Build your definition</strong> for “${escapeHtml(term)}”</p>
 <input type="text" id="gq-build-def" placeholder="In my words, this means..." />
 <button type="button" class="btn primary" id="gq-build-go">Reveal tutor definition</button>`;
 box.appendChild(wrap);
 box.scrollTop = box.scrollHeight;
 wrap.querySelector("#gq-build-go").onclick = () => {
 const val = wrap.querySelector("#gq-build-def")?.value?.trim();
 if (val) appendUser(`My try: ${val}`);
 wrap.remove();
 then?.();
 };
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
 el.innerHTML = escapeHtml(text).replace(/\n/g, "<br>");
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

async function sendChat({ message, term, subject, tier, bookFigure }) {
 // Wait out an in-flight reply so Reveal + Ask never drop user bubbles.
 const started = Date.now();
 while (chatState.busy && Date.now() - started < 20000) {
   await new Promise((r) => setTimeout(r, 40));
 }
 if (chatState.busy) {
   appendBot("One moment - still finishing the last answer. Try again.");
   return;
 }
 chatState.busy = true;
 const status = appendStatus("Thinking...");

  const tierN = tier || 1;
  const topic = subject || chatState.subject;
  let userContent = message;
  if (term) {
    chatState.lastTerm = term;
    if (tierN <= 1) {
      userContent = `Explain "${term}" in ${topic} for a school kid, in 5 to 7 sentences.`;
    } else if (tierN === 2) {
      userContent = `Explain "${term}" in ${topic} again, going deeper than last time, in 5 to 7 sentences.`;
    } else {
      userContent = `Give the clearest full answer for "${term}" in ${topic} in 5 to 7 sentences, then point to a book diagram if relevant${
        bookFigure ? ` (figure hint: ${bookFigure})` : ""
      }.`;
    }
  } else if (chatState.lastTerm) {
    userContent = `${message}\n\n(Still about the word "${chatState.lastTerm}" in ${topic}.)`;
  }

  // First tap gets the fixed "Do you want to learn more?"; replies get an AI-written question.
  const phase = term ? "explain" : "followup";

  const payload = {
    subject: topic,
    term: term || chatState.lastTerm || undefined,
    message: userContent || undefined,
    phase,
    tier: tierN,
 messages: [
 ...chatState.history,
 {
 role: "user",
 content: userContent,
 },
 ],
 };

 const ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
 const timer = ctrl ? setTimeout(() => ctrl.abort(), 18000) : null;
 try {
 const res = await fetch("/api/chat", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify(payload),
 signal: ctrl?.signal,
 });
 const data = await res.json().catch(() => ({}));
 status?.remove();
 if (!res.ok) {
 appendBot(
 data.error
 ? `Ask your teacher - chat is offline right now. (${data.error})`
 : "Ask your teacher - chat is offline right now.",
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
 ? "That took too long - ask again in a moment."
 : "Ask your teacher - chat is offline right now.",
 );
 } finally {
 if (timer) clearTimeout(timer);
 chatState.busy = false;
 }
}
