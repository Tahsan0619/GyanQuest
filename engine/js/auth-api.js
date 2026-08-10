/**
 * Optional GyanQuest API auth + progress sync (Sanctum).
 * Offline play stays fully local when no token is present.
 */
const TOKEN_KEY = "gq-api-token";
const USER_KEY = "gq-api-user";

function apiBase() {
 try {
 const u = new URL(location.href);
 const override = u.searchParams.get("api");
 if (override) return override.replace(/\/$/, "");
 } catch {
 /* ignore */
 }
 // Local default: Laravel serve on 8000
 if (location.port === "5500" || location.hostname === "127.0.0.1" || location.hostname === "localhost") {
 return `${location.protocol}//${location.hostname}:8000/api`;
 }
 return "/api";
}

export function getToken() {
 try {
 return sessionStorage.getItem(TOKEN_KEY) || "";
 } catch {
 return "";
 }
}

export function getUser() {
 try {
 const raw = sessionStorage.getItem(USER_KEY);
 return raw ? JSON.parse(raw) : null;
 } catch {
 return null;
 }
}

function setSession(token, user) {
 try {
 if (token) sessionStorage.setItem(TOKEN_KEY, token);
 else sessionStorage.removeItem(TOKEN_KEY);
 if (user) sessionStorage.setItem(USER_KEY, JSON.stringify(user));
 else sessionStorage.removeItem(USER_KEY);
 } catch {
 /* ignore */
 }
 window.dispatchEvent(new CustomEvent("gq-auth", { detail: { user: getUser() } }));
}

export function logoutLocal() {
 setSession("", null);
}

async function api(path, opts = {}) {
 const headers = {
 Accept: "application/json",
 "Content-Type": "application/json",
 ...(opts.headers || {}),
 };
 const token = getToken();
 if (token) headers.Authorization = `Bearer ${token}`;
 const res = await fetch(`${apiBase()}${path}`, { ...opts, headers });
 const body = await res.json().catch(() => ({}));
 if (!res.ok) {
 const err = new Error(body.message || `HTTP ${res.status}`);
 err.status = res.status;
 err.body = body;
 throw err;
 }
 return body;
}

export async function register(name, email, password) {
 return api("/register", {
 method: "POST",
 body: JSON.stringify({ name, email, password }),
 });
}

export async function login(email, password) {
 const data = await api("/login", {
 method: "POST",
 body: JSON.stringify({ email, password }),
 });
 setSession(data.token, data.user);
 return data;
}

export async function logout() {
 try {
 if (getToken()) await api("/logout", { method: "POST" });
 } catch {
 /* ignore */
 }
 logoutLocal();
}

/** Fire-and-forget progress sync after local saveGame. */
export function syncProgress(gameId, state) {
 if (!getToken() || !gameId || !state) return;
 const payload = {
 game_id: gameId,
 level: state.level,
 sub: state.sub,
 inHub: state.inHub !== false,
 completed: state.completed,
 rewards: state.rewards,
 introSeen: state.introSeen,
 streaks: state.streaks,
 predictions: state.predictions,
 hintTiers: state.hintTiers,
 fluencyScores: state.fluencyScores,
 conceptLog: state.conceptLog,
 };
 api("/progress/sync", { method: "POST", body: JSON.stringify(payload) }).catch(() => {});
}

export function postResponse(row) {
 if (!getToken()) return;
 api("/responses", { method: "POST", body: JSON.stringify(row) }).catch(() => {});
}

export function postConceptLog(row) {
 if (!getToken()) return;
 api("/concept-logs", { method: "POST", body: JSON.stringify(row) }).catch(() => {});
}

/**
 * Merge server progress into localStorage saves.
 * Prefer more completed levels; tie-break on last_synced_at vs local mtime is approximate.
 */
export async function pullAndMergeProgress() {
 if (!getToken()) return;
 const data = await api("/progress");
 const rows = data.progress || [];
 for (const row of rows) {
 const key = storageKeyForGame(row.game_id);
 if (!key) continue;
 let local = null;
 try {
 local = JSON.parse(localStorage.getItem(key) || "null");
 } catch {
 local = null;
 }
 const remoteDone = Number(row.levels_completed_count || 0);
 const localDone = countFinishedLevels(local?.completed);
 const remoteTs = row.last_synced_at ? Date.parse(row.last_synced_at) : 0;
 const takeRemote = !local || remoteDone > localDone || (remoteDone === localDone && remoteTs > 0);
 if (!takeRemote) continue;
 const next = {
 level: row.current_level ?? 0,
 sub: row.current_sub ?? 0,
 inHub: row.in_hub !== false,
 completed: row.completed_json || local?.completed || [],
 rewards: row.rewards_json || local?.rewards || [],
 introSeen: row.intro_seen_json || local?.introSeen || [],
 streaks: row.streak_json || local?.streaks || { wrong: 0, correct: 0 },
 predictions: row.predictions_json || local?.predictions || [],
 hintTiers: row.hint_tier_json || local?.hintTiers || {},
 fluencyScores: row.fluency_scores_json || local?.fluencyScores || [],
 conceptLog: row.concept_log_json || local?.conceptLog || [],
 };
 try {
 localStorage.setItem(key, JSON.stringify(next));
 } catch {
 /* ignore */
 }
 }
}

function countFinishedLevels(completed) {
 if (!Array.isArray(completed)) return 0;
 return completed.filter((row) => Array.isArray(row) && row.length && row.every(Boolean)).length;
}

/** Map game_id folder names to known storage keys. */
function storageKeyForGame(gameId) {
 const map = {
 "chemistry-lab": "gq-chemistry-lab-save-v2",
 "force-fighter": "gq-force-fighter-save-v2",
 "math-quest": "gq-math-quest-save-v2",
 "bio-explorer": "gq-bio-explorer-save-v2",
 "eco-guardian": "gq-eco-guardian-save-v2",
 };
 if (map[gameId]) return map[gameId];
 if (typeof gameId === "string" && gameId) return `gq-${gameId}-save-v2`;
 return null;
}

export function mountAuthControls(host) {
  if (!host || host.dataset.gqAuthMounted) return;
  host.dataset.gqAuthMounted = "1";
  ensureAuthCss();
  const paint = () => {
    const user = getUser();
    host.innerHTML = user
      ? `<span class="gq-auth__who" title="${escapeHtml(user.name || user.email)}">${escapeHtml(user.name || user.email)}</span>
 <button type="button" class="gq-auth-btn gq-auth-btn--ghost" id="gq-auth-logout">Log out</button>`
      : `<button type="button" class="gq-auth-btn" id="gq-auth-open">Log in</button>`;
    host.querySelector("#gq-auth-logout")?.addEventListener("click", () => logout());
    host.querySelector("#gq-auth-open")?.addEventListener("click", () => openAuthModal());
  };
 window.addEventListener("gq-auth", paint);
 paint();
}

function openAuthModal() {
 let root = document.getElementById("gq-auth-modal");
 if (!root) {
 root = document.createElement("div");
 root.id = "gq-auth-modal";
    root.innerHTML = `
 <div class="gq-auth-backdrop" data-close></div>
 <div class="gq-auth-card" role="dialog" aria-modal="true" aria-label="Account">
 <div class="gq-auth-card__head">
 <h3>GyanQuest account</h3>
 <button type="button" class="gq-auth-close" data-close aria-label="Close">×</button>
 </div>
 <p class="gq-auth-note">Optional - play offline anytime. Login syncs progress when the API is running.</p>
 <label>Name (for register)<input id="gq-auth-name" type="text" autocomplete="name" placeholder="Your name" /></label>
 <label>Email<input id="gq-auth-email" type="email" autocomplete="username" placeholder="you@example.com" /></label>
 <label>Password<input id="gq-auth-pass" type="password" autocomplete="current-password" placeholder="••••••••" /></label>
 <p id="gq-auth-msg" class="gq-auth-msg" aria-live="polite"></p>
 <div class="gq-auth-actions">
 <button type="button" class="gq-auth-action gq-auth-action--ghost" data-close>Close</button>
 <button type="button" class="gq-auth-action gq-auth-action--secondary" id="gq-auth-register">Register</button>
 <button type="button" class="gq-auth-action gq-auth-action--primary" id="gq-auth-login">Log in</button>
 </div>
 </div>`;
    document.body.appendChild(root);
    ensureAuthCss();
 root.addEventListener("click", (e) => {
 if (e.target?.hasAttribute?.("data-close")) root.classList.add("hidden");
 });
 root.querySelector("#gq-auth-login").onclick = async () => {
 const msg = root.querySelector("#gq-auth-msg");
 try {
 msg.textContent = "Signing in…";
 await login(
 root.querySelector("#gq-auth-email").value.trim(),
 root.querySelector("#gq-auth-pass").value,
 );
 await pullAndMergeProgress();
 msg.textContent = "Signed in.";
 root.classList.add("hidden");
 } catch (err) {
 msg.textContent = err.message || "Login failed";
 }
 };
 root.querySelector("#gq-auth-register").onclick = async () => {
 const msg = root.querySelector("#gq-auth-msg");
 try {
 msg.textContent = "Registering…";
 await register(
 root.querySelector("#gq-auth-name").value.trim() || "Student",
 root.querySelector("#gq-auth-email").value.trim(),
 root.querySelector("#gq-auth-pass").value,
 );
 msg.textContent = "Registered - wait for admin approval, then log in.";
 } catch (err) {
 msg.textContent = err.message || "Register failed";
 }
 };
 }
 root.classList.remove("hidden");
}

function ensureAuthCss() {
 if (document.querySelector("link[data-gq-auth-css]")) return;
 const link = document.createElement("link");
 link.rel = "stylesheet";
  link.href = "/engine/css/auth.css?v=auth2";
 link.dataset.gqAuthCss = "1";
 document.head.appendChild(link);
}

function escapeHtml(s) {
 return String(s ?? "")
 .replace(/&/g, "&amp;")
 .replace(/</g, "&lt;")
 .replace(/>/g, "&gt;")
 .replace(/"/g, "&quot;");
}
