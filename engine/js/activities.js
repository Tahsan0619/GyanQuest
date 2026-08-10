/**
 * Reusable activity mounts (Brunner: enactive → iconic → symbolic).
 */
import { scaledDwellMs } from "./timings.js";
import { t } from "./i18n.js";
import { mountConceptViz, clearConceptViz } from "./concept-viz.js";

function hudHost() {
 return typeof document !== "undefined" ? document.getElementById("viewport-hud") : null;
}

export function applyConceptViz(viz) {
 const host = hudHost();
 if (!host) return;
 if (!viz) {
 clearConceptViz(host);
 return;
 }
 mountConceptViz(host, viz);
}

function makePointerClone(el, x, y) {
 const clone = el.cloneNode(true);
 clone.style.cssText = `position:fixed;left:${x}px;top:${y}px;transform:translate(-50%,-50%);z-index:10000;pointer-events:none;opacity:0.92;margin:0;`;
 document.body.appendChild(clone);
 return clone;
}

function attachChipPointerDrag(chips, onDropAtPoint) {
 chips.forEach((chip) => {
 chip.style.touchAction = "none";
 let clone = null;
 let startX = 0;
 let startY = 0;
 let chipId = null;
 let sourceChip = null;

 const cleanup = () => {
 if (clone) clone.remove();
 clone = null;
 chipId = null;
 sourceChip = null;
 document.removeEventListener("pointermove", onMove);
 document.removeEventListener("pointerup", onUp);
 document.removeEventListener("pointercancel", onUp);
 };

 const onMove = (e) => {
 if (!chipId) return;
 if (!clone && Math.hypot(e.clientX - startX, e.clientY - startY) > 8) {
 clone = makePointerClone(sourceChip, e.clientX, e.clientY);
 }
 if (clone) {
 clone.style.left = `${e.clientX}px`;
 clone.style.top = `${e.clientY}px`;
 }
 };

 const onUp = (e) => {
 if (!chipId) {
 cleanup();
 return;
 }
 const id = chipId;
 const x = e.clientX;
 const y = e.clientY;
 cleanup();
 onDropAtPoint(id, x, y);
 };

 chip.addEventListener("pointerdown", (e) => {
 if (e.pointerType === "mouse" && e.button !== 0) return;
 e.preventDefault();
 chipId = chip.dataset.chip;
 sourceChip = chip;
 startX = e.clientX;
 startY = e.clientY;
 document.addEventListener("pointermove", onMove);
 document.addEventListener("pointerup", onUp);
 document.addEventListener("pointercancel", onUp);
 });
 });
}

export function applyArenaScene(scene, viz, sceneArgs) {
 if (!scene || typeof window === "undefined") return;
 window.__lastDemoScene = scene;
 const arena = window.__arena;
 if (arena?.playExample) {
 try {
 arena.playExample(scene, sceneArgs || {});
 } catch {
 /* keep going */
 }
 }
 if (viz !== undefined) applyConceptViz(viz);
}

export function mountDemo(host, { html, scene, viz, minDwellMs, onContinue }) {
 const minMs = scaledDwellMs(minDwellMs ?? 1800);
 applyArenaScene(scene, viz);
 host.innerHTML = `
 <div class="lab-demo">
 <div class="lab-demo__badge">${t("lab.demoBadge")}</div>
 <div class="lab-demo__body">${html}</div>
 <p class="lab-demo__timer" id="lab-dwell-msg">${t("lab.dwellWait")}</p>
 <button type="button" class="btn primary" id="lab-dwell-go" disabled>${t("lab.dwellContinue")}</button>
 </div>`;
 const btn = host.querySelector("#lab-dwell-go");
 const t0 = Date.now();
 const iv = setInterval(() => {
 const left = Math.max(0, Math.ceil((minMs - (Date.now() - t0)) / 1000));
 const msg = host.querySelector("#lab-dwell-msg");
 if (msg) msg.textContent = left > 0 ? t("lab.dwellLook", { n: left }) : t("lab.dwellYourTurn");
 if (Date.now() - t0 >= minMs) {
 btn.disabled = false;
 clearInterval(iv);
 }
 }, 250);
 btn.onclick = () => {
 if (btn.disabled) return;
 clearInterval(iv);
 onContinue();
 };
}

export function mountDrag(host, cfg) {
 applyArenaScene(cfg.scene, cfg.viz);
 const zoneHtml = cfg.zones
 .map(
 (z) => `
 <div class="dz-wrap">
 <span class="dz-label">${z.label}</span>
 <div class="drop-zone" data-zone="${z.id}" data-accept="${z.accept.join(",")}"></div>
 </div>`,
 )
 .join("");
 const chipsHtml = cfg.chips.map((c) => `<div class="chip" draggable="true" data-chip="${c.id}">${c.text}</div>`).join("");
 host.innerHTML = `
 <div class="lab-drag">
 <h3>${cfg.title}</h3>
 <p class="lab-drag__hint">${cfg.instructions}</p>
 <div class="dz-row">${zoneHtml}</div>
 <div class="chip-bank" id="chip-bank">${chipsHtml}</div>
 <p id="lab-drag-status" class="drag-hint"></p>
 </div>`;

 const bank = host.querySelector("#chip-bank");
 const status = host.querySelector("#lab-drag-status");
 let done = false;

 host.querySelectorAll(".chip").forEach((chip) => {
 chip.addEventListener("dragstart", (e) => {
 e.dataTransfer.setData("text/plain", chip.dataset.chip);
 e.dataTransfer.effectAllowed = "move";
 });
 });

 function tryDropChip(zone, id) {
 if (done) return;
 const accept = zone.getAttribute("data-accept").split(",");
 if (!accept.includes(id)) {
 status.textContent = t("lab.dragWrong");
 return;
 }
 const prev = zone.querySelector(".chip");
 if (prev) bank.appendChild(prev);
 const chip = host.querySelector(`.chip[data-chip="${id}"]`);
 if (chip) zone.appendChild(chip);
 status.textContent = "";
 if (
 cfg.zones.every((z) => {
 const el = host.querySelector(`[data-zone="${z.id}"]`);
 const placed = el?.querySelector(".chip")?.getAttribute("data-chip");
 return placed && z.accept.includes(placed);
 })
 ) {
 done = true;
 status.textContent = t("lab.dragRight");
 cfg.onDone();
 }
 }

 host.querySelectorAll(".drop-zone").forEach((zone) => {
 zone.addEventListener("dragover", (e) => {
 e.preventDefault();
 zone.classList.add("dz-hover");
 });
 zone.addEventListener("dragleave", () => zone.classList.remove("dz-hover"));
 zone.addEventListener("drop", (e) => {
 e.preventDefault();
 zone.classList.remove("dz-hover");
 tryDropChip(zone, e.dataTransfer.getData("text/plain"));
 });
 });

 attachChipPointerDrag(host.querySelectorAll(".chip"), (id, x, y) => {
 const under = document.elementFromPoint(x, y);
 const zone = under?.closest?.(".drop-zone");
 if (zone && host.contains(zone)) tryDropChip(zone, id);
 });
}

export function mountReveal(host, cfg) {
 applyArenaScene(cfg.scene, cfg.viz);
 let i = 0;
 function render() {
 const body = cfg.steps
 .slice(0, i + 1)
 .map((s, j) => `<p class="reveal-step ${j === i ? "reveal-step--new" : ""}">${s}</p>`)
 .join("");
 const last = i >= cfg.steps.length - 1;
 host.innerHTML = `
 <div class="lab-reveal">
 <h3>${cfg.title}</h3>
 <div class="reveal-body">${body}</div>
 <button type="button" class="btn primary" id="reveal-go">${last ? t("lab.revealDone") : t("lab.revealNext")}</button>
 </div>`;
 host.querySelector("#reveal-go").onclick = () => {
 if (last) cfg.onDone();
 else {
 i++;
 render();
 }
 };
 }
 render();
}

export function mountEquation(host, { tokens, scene, viz, onDone }) {
 applyArenaScene(scene, viz);
 const shuffled = [...tokens].sort(() => Math.random() - 0.5);
 host.innerHTML = `
 <div class="lab-eq">
 <h3>${t("lab.eqTitle")}</h3>
 <p>${t("lab.eqHint")}</p>
 <div class="eq-rail" id="eq-rail"></div>
 <div class="chip-bank" id="eq-bank">${shuffled.map((tok) => `<div class="chip" draggable="true" data-chip="${tok.id}">${tok.html}</div>`).join("")}</div>
 <p id="eq-st" class="drag-hint"></p>
 </div>`;
 const rail = host.querySelector("#eq-rail");
 const bank = host.querySelector("#eq-bank");
 const target = tokens.map((tok) => tok.id).join(",");
 let eqDone = false;
 const st = host.querySelector("#eq-st");

 host.querySelectorAll(".chip").forEach((chip) => {
 chip.addEventListener("dragstart", (e) => {
 e.dataTransfer.setData("text/plain", chip.dataset.chip);
 });
 });

 function tryDropOnRail(id) {
 if (eqDone) return;
 const chip = host.querySelector(`.chip[data-chip="${id}"]`);
 if (!chip) return;
 rail.appendChild(chip);
 const order = [...rail.querySelectorAll(".chip")].map((c) => c.dataset.chip).join(",");
 if (order === target) {
 eqDone = true;
 st.textContent = t("lab.eqLocked");
 onDone();
 } else if (rail.children.length >= tokens.length) {
 st.textContent = t("lab.eqReorder");
 }
 }

 rail.addEventListener("dragover", (e) => e.preventDefault());
 rail.addEventListener("drop", (e) => {
 e.preventDefault();
 tryDropOnRail(e.dataTransfer.getData("text/plain"));
 });
 bank.addEventListener("dragover", (e) => e.preventDefault());
 bank.addEventListener("drop", (e) => {
 e.preventDefault();
 const chip = host.querySelector(`.chip[data-chip="${e.dataTransfer.getData("text/plain")}"]`);
 if (chip) bank.appendChild(chip);
 });

 attachChipPointerDrag(host.querySelectorAll(".chip"), (id, x, y) => {
 const under = document.elementFromPoint(x, y);
 if (under?.closest?.("#eq-rail")) tryDropOnRail(id);
 else if (under?.closest?.("#eq-bank")) {
 const chip = host.querySelector(`.chip[data-chip="${id}"]`);
 if (chip) bank.appendChild(chip);
 }
 });
}

export function mountOrder(host, { items, correctIds, scene, viz, onDone }) {
 applyArenaScene(scene, viz);
 const shuffled = [...items].sort(() => Math.random() - 0.5);
 host.innerHTML = `
 <div class="lab-order">
 <h3>${t("lab.orderTitle")}</h3>
 <p>${t("lab.orderHint")}</p>
 <div class="order-list" id="ord-list">${shuffled.map((it) => `<div class="order-tile" draggable="true" data-id="${it.id}">${it.html}</div>`).join("")}</div>
 <button type="button" class="btn primary" id="ord-check">${t("lab.orderCheck")}</button>
 <p id="ord-msg" class="drag-hint"></p>
 </div>`;
 const list = host.querySelector("#ord-list");
 let dragEl = null;

 function reorderBeforeTile(tile, y) {
 if (!dragEl || dragEl === tile) return;
 const rect = tile.getBoundingClientRect();
 const before = y < rect.top + rect.height / 2;
 list.insertBefore(dragEl, before ? tile : tile.nextSibling);
 }

 list.querySelectorAll(".order-tile").forEach((tile) => {
 tile.addEventListener("dragstart", () => {
 dragEl = tile;
 });
 tile.addEventListener("dragover", (e) => {
 e.preventDefault();
 reorderBeforeTile(tile, e.clientY);
 });
 tile.addEventListener("drop", (e) => e.preventDefault());
 });

 host.querySelector("#ord-check").onclick = () => {
 const got = [...list.querySelectorAll(".order-tile")].map((el) => el.dataset.id);
 const ok = got.join(",") === correctIds.join(",");
 const msg = host.querySelector("#ord-msg");
 if (ok) {
 msg.textContent = t("lab.orderOk");
 onDone();
 } else msg.textContent = t("lab.orderNope");
 };
}

export function mountQuiz(host, { q, opts, ok, scene, viz, onDone }) {
 applyArenaScene(scene, viz);
 host.innerHTML = `
 <div class="lab-quiz card">
 <p class="lab-quiz__prompt"><strong>${t("lab.quizPick")}</strong></p>
 <p class="lab-quiz__q">${q}</p>
 <div class="lab-quiz__opts" id="quiz-opts"></div>
 <p id="quiz-msg" class="drag-hint"></p>
 </div>`;
 const box = host.querySelector("#quiz-opts");
 const msg = host.querySelector("#quiz-msg");
 let locked = false;
 opts.forEach((label, i) => {
 const b = document.createElement("button");
 b.type = "button";
 b.className = "btn secondary quiz-opt";
 b.textContent = label;
 b.onclick = () => {
 if (locked) return;
 if (i === ok) {
 locked = true;
 b.classList.add("primary");
 msg.textContent = t("ui.quizGreat");
 setTimeout(onDone, 450);
 } else {
 b.classList.add("wrong-flash");
 msg.textContent = t("ui.notQuite");
 }
 };
 box.appendChild(b);
 });
}

export function mountIntro(host, { title, body, everyday, emoji, scene, viz, onContinue }) {
 applyArenaScene(scene, viz);
 const list = (everyday || []).map((e) => `<li>${e}</li>`).join("");
 host.innerHTML = `
 <div class="card intro-card">
 <h3>${emoji || "📘"} ${title}</h3>
 <p>${body}</p>
 <h4>${t("ui.everydayTitle")}</h4>
 <ul>${list}</ul>
 <button type="button" class="btn primary" id="intro-go">${t("ui.introLetsPlay")}</button>
 </div>`;
 host.querySelector("#intro-go").onclick = onContinue;
}

export function mountTapContinue(host, { html, scene, viz, onContinue }) {
 applyArenaScene(scene, viz);
 host.innerHTML = `
 <div class="lab-demo">
 <div class="lab-demo__body">${html}</div>
 <button type="button" class="btn primary" id="tap-go">${t("lab.tapContinue")}</button>
 </div>`;
 host.querySelector("#tap-go").onclick = onContinue;
}
