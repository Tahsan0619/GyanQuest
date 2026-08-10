import { bootChemLevel1 } from "./js/boot-l1.js?v=tier3";
import { manifest } from "./manifest.js";

function showBootError(msg) {
 const hub = document.getElementById("mission-hub-root");
 if (hub) {
 hub.innerHTML = `<div class="gq-hub" style="padding:2rem;text-align:center"><h2>Could not start</h2><p>${msg}</p><p><a href="/">Back to GyanQuest</a></p></div>`;
 return;
 }
 const overlay = document.getElementById("overlay");
 if (overlay) {
 overlay.innerHTML = `<div class="chem-card"><p>${msg}</p></div>`;
 }
 console.error(msg);
}

function start() {
 bootChemLevel1({ manifest }).catch((err) => {
 console.error("[chemistry-lab] boot failed", err);
 showBootError(`Boot error: ${String(err?.message || err)}`);
 });
}

if (document.readyState === "loading") {
 document.addEventListener("DOMContentLoaded", start, { once: true });
} else {
 start();
}

window.addEventListener("error", (ev) => {
 if (ev?.filename && String(ev.filename).includes("/games/")) {
 try { showBootError(`Script error: ${ev.message || "unknown"}`); } catch (_) {}
 }
});
window.addEventListener("unhandledrejection", (ev) => {
 try { showBootError(`Boot error: ${String(ev.reason?.message || ev.reason || "unknown")}`); } catch (_) {}
});
