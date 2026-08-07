/**
 * Force Lab Playground - kid sandbox on the 3D canvas.
 */
import { playgroundAssetCatalog, whenAllAssetsReady } from "./asset-loader.js";
import { PLAYGROUND_PRESET_GROUPS } from "./playground-presets.js";
import { bindAimDragPush } from "./aim-drag.js";
import { t } from "./i18n.js";

/**
 * @param {{
 *   arena: object;
 *   canvas: HTMLCanvasElement;
 *   setCoach: (html: string) => void;
 *   onExit: () => void;
 * }} api
 */
export function mountPlaygroundUI(api) {
  const { arena, canvas, setCoach, onExit } = api;

  if (typeof window !== "undefined") {
    window.__pgBumpCoach = (html) => setCoach(html, "");
  }
  let detachDrag = null;
  let aimCleanup = null;
  let ctrlHeld = false;

  function setOrbitFromCtrl(ctrl) {
    ctrlHeld = !!ctrl;
    if (typeof arena.playgroundSetOrbitEnabled === "function") {
      arena.playgroundSetOrbitEnabled(ctrlHeld);
    }
  }

  function onKeyDown(e) {
    if (e.key === "Control") setOrbitFromCtrl(true);
  }

  function onKeyUp(e) {
    if (e.key === "Control") setOrbitFromCtrl(false);
  }

  function onWindowBlur() {
    setOrbitFromCtrl(false);
  }

  function ndcFromEvent(e) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
      y: -((e.clientY - rect.top) / rect.height) * 2 + 1,
    };
  }

  function pointOnGround(e) {
    const THREE = window.THREE;
    const { x, y } = ndcFromEvent(e);
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), arena.camera);
    const out = new THREE.Vector3();
    raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), out);
    return out;
  }

  function cleanupDrag() {
    aimCleanup?.();
    aimCleanup = null;
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("keyup", onKeyUp);
    window.removeEventListener("blur", onWindowBlur);
    if (typeof window !== "undefined" && window.__pgBumpCoach) delete window.__pgBumpCoach;
    arena.clearArrow();
    setOrbitFromCtrl(false);
    if (detachDrag === cleanupDrag) detachDrag = null;
  }

  function bindCanvasPush() {
    cleanupDrag();
    aimCleanup = bindAimDragPush({
      canvas,
      pointOnGround,
      onPick: (e) => {
        if (e.ctrlKey) {
          setOrbitFromCtrl(true);
          return null;
        }
        setOrbitFromCtrl(false);
        const { x, y } = ndcFromEvent(e);
        return arena.playgroundPick(x, y);
      },
      getOrigin: (body) => body.mesh.position.clone(),
      onMiss: () => setCoach(t("playground.ctrlDragCoach"), ""),
      onShortDrag: () => setCoach(t("playground.shortDrag"), ""),
      onImpulse: (body, dx, dz, len) => {
        const strength = Math.min(6, 1.5 + len * 0.35);
        if (typeof arena.playgroundReleaseImpulse === "function") {
          arena.playgroundReleaseImpulse(body, dx, dz, strength);
        } else {
          arena.playgroundPush(body, dx, dz);
        }
      },
      setArrow: (from, to) => arena.setArrow(from, to),
      clearArrow: () => arena.clearArrow(),
      arrowYOffset: 0.2,
      minLen: 0.35,
    });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onWindowBlur);
    detachDrag = cleanupDrag;
  }

  function spawnAt(key) {
    arena.playgroundSpawn(key);
    updateCount();
  }

  function updateCount() {
    const el = document.getElementById("pg-count");
    if (el) el.textContent = String(arena.playgroundCount?.() ?? arena.playgroundBodyCount?.() ?? 0);
  }

  function presetLabel(id) {
    return t(`playground.presets.${id}.label`);
  }

  function presetTip(id) {
    return t(`playground.presets.${id}.tip`);
  }

  let spawnScrollEl = null;

  function buildAssetSpawn(host) {
    if (!host) return;
    spawnScrollEl = host;
    host.innerHTML = "";
    const catalog = playgroundAssetCatalog();
    const readyCount = catalog.reduce((n, g) => n + g.items.filter((i) => i.ready).length, 0);
    if (readyCount === 0) {
      const p = document.createElement("p");
      p.className = "playground-empty";
      p.textContent = t("playground.assetsLoading");
      host.appendChild(p);
    }
    catalog.forEach((group) => {
      const section = document.createElement("div");
      section.className = "playground-spawn-group";
      const h = document.createElement("h4");
      h.className = "playground-spawn-group__title";
      h.textContent = t(`playground.assetGroups.${group.id}`);
      section.appendChild(h);
      const rowEl = document.createElement("div");
      rowEl.className = "playground-spawn";
      group.items.forEach((item) => {
        const label = t(`playground.assets.${item.key}`) || item.label;
        const b = document.createElement("button");
        b.type = "button";
        b.className = "btn secondary playground-spawn-btn";
        b.textContent = `+ ${label}`;
        b.title = item.ready
          ? t("playground.spawnTitle", { label })
          : t("playground.assetNotReady");
        b.disabled = !item.ready;
        if (item.ready) b.onclick = () => spawnAt(item.key);
        rowEl.appendChild(b);
      });
      section.appendChild(rowEl);
      host.appendChild(section);
    });
  }

  function refreshAssetSpawn() {
    if (spawnScrollEl) buildAssetSpawn(spawnScrollEl);
  }

  function buildPresetGroups(host) {
    host.innerHTML = "";
    PLAYGROUND_PRESET_GROUPS.forEach((group) => {
      const section = document.createElement("div");
      section.className = "playground-preset-group";
      const h = document.createElement("h4");
      h.className = "playground-preset-group__title";
      h.textContent = t(`playground.groups.${group.id}`);
      section.appendChild(h);
      const row = document.createElement("div");
      row.className = "playground-presets";
      group.presets.forEach((p) => {
        const label = presetLabel(p.id);
        const tip = presetTip(p.id);
        const b = document.createElement("button");
        b.type = "button";
        b.className = "btn secondary playground-preset-btn";
        b.textContent = label;
        b.title = tip;
        b.onclick = () => {
          arena.playgroundRunPreset(p.id);
          updateCount();
          setCoach(t("playground.presetCoach", { label, tip }), "");
          bindCanvasPush();
        };
        row.appendChild(b);
      });
      section.appendChild(row);
      host.appendChild(section);
    });
  }

  function mountPanel(host) {
    host.innerHTML = `
      <div class="playground-panel">
        <h2>🧪 ${t("playground.panelTitle")}</h2>
        <p class="playground-lead">${t("playground.panelLead")}</p>
        <p class="playground-orbit-hint">🔄 <strong>${t("playground.orbitHint")}</strong></p>

        <h3 class="playground-sub">${t("playground.assetsTitle")}</h3>
        <div class="playground-spawn-scroll" id="pg-spawn"></div>

        <h3 class="playground-sub">${t("playground.guidedTitle")}</h3>
        <div class="playground-preset-scroll" id="pg-presets"></div>

        <h3 class="playground-sub">${t("playground.worldTitle")}</h3>
        <div class="playground-toggles">
          <label><input type="checkbox" id="pg-ice" checked /> ${t("playground.iceLane")}</label>
          <label><input type="checkbox" id="pg-wall" /> ${t("playground.wallRight")}</label>
        </div>
        <p class="playground-sub">${t("playground.frictionLabel")}</p>
        <input type="range" id="pg-mu" min="0.1" max="1.2" step="0.05" value="0.38" />
        <span id="pg-mu-val" class="readout">0.38</span>

        <div class="btn-row playground-actions">
          <button type="button" class="btn secondary" id="pg-clear">${t("playground.clearToys")}</button>
          <button type="button" class="btn secondary" id="pg-reset">${t("playground.resetLab")}</button>
          <button type="button" class="btn primary" id="pg-exit">${t("playground.backMissions")}</button>
        </div>
        <p class="drag-hint" id="pg-hint">${t("playground.objectsCount")} <strong id="pg-count">0</strong></p>
      </div>`;

    const panel = host.querySelector(".playground-panel") || host;
    buildAssetSpawn(panel.querySelector("#pg-spawn"));
    buildPresetGroups(panel.querySelector("#pg-presets"));
    whenAllAssetsReady().then(() => refreshAssetSpawn());

    const ice = panel.querySelector("#pg-ice");
    const wall = panel.querySelector("#pg-wall");
    const mu = panel.querySelector("#pg-mu");
    const muVal = panel.querySelector("#pg-mu-val");

    ice.onchange = () => arena.playgroundSetIce(ice.checked);
    wall.onchange = () => arena.playgroundSetWall(wall.checked);
    mu.oninput = () => {
      arena.playgroundSetFriction(parseFloat(mu.value));
      muVal.textContent = mu.value;
    };

    panel.querySelector("#pg-clear").onclick = () => {
      arena.playgroundClear();
      updateCount();
    };
    panel.querySelector("#pg-reset").onclick = () => {
      arena.enterPlayground();
      ice.checked = true;
      wall.checked = false;
      updateCount();
      bindCanvasPush();
    };
    panel.querySelector("#pg-exit").onclick = () => {
      cleanupDrag();
      onExit();
    };

    updateCount();
    bindCanvasPush();
    requestAnimationFrame(() => {
      if (typeof window.__paginateOverlay === "function") window.__paginateOverlay();
    });
  }

  return { mountPanel, cleanup: cleanupDrag, updateCount, refreshAssetSpawn };
}
