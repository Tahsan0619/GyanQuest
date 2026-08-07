/**
 * Electrical Basics  -  Mission 1: Circuit Loop - closed path lights the bulb.
 */
import { labState, pulseFailFeedback, pulseSuccessFeedback } from "./lab-state.js";
import { sortSlotPositions, getActiveSession } from "./activity-controller.js";

function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}
function drawLabel(ctx, text, x, y, opts = {}) {
  ctx.font = opts.font || "600 14px Segoe UI, system-ui, sans-serif";
  const tw = Math.min(ctx.measureText(text).width + 24, opts.maxW || 540);
  const bh = opts.h || 26;
  ctx.fillStyle = opts.bg || "rgba(15,23,42,0.92)";
  roundRect(ctx, x - tw / 2, y - bh / 2, tw, bh, 10);
  ctx.fill();
  ctx.strokeStyle = opts.border || "rgba(250,204,21,0.55)";
  ctx.lineWidth = 1.4;
  ctx.stroke();
  ctx.fillStyle = opts.color || "#fde68a";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, y + 1);
}
function failFlash(ctx, w, h) {
  const until = labState.failPulse;
  if (!until || performance.now() > until) return;
  ctx.fillStyle = `rgba(248,113,113,${Math.max(0, (until - performance.now()) / 420) * 0.28})`;
  ctx.fillRect(0, 0, w, h);
}
function successFlash(ctx, w, h) {
  const until = labState.successPulse;
  if (!until || performance.now() > until) return;
  ctx.fillStyle = `rgba(250,204,21,${Math.max(0, (until - performance.now()) / 380) * 0.22})`;
  ctx.fillRect(0, 0, w, h);
}

function drawBattery(ctx, x, y) {
  ctx.fillStyle = "#1e293b";
  roundRect(ctx, x - 28, y - 36, 56, 72, 6);
  ctx.fill();
  ctx.strokeStyle = "#facc15";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = "#facc15";
  ctx.fillRect(x - 10, y - 44, 8, 10);
  ctx.fillRect(x + 4, y - 40, 8, 6);
  ctx.fillStyle = "#fde68a";
  ctx.font = "700 14px Segoe UI";
  ctx.textAlign = "center";
  ctx.fillText("+", x, y - 8);
  ctx.fillText("-", x, y + 18);
  ctx.font = "700 11px Segoe UI";
  ctx.fillText("Battery", x, y + 52);
}
function drawSwitch(ctx, x, y, closed) {
  ctx.fillStyle = "#334155";
  roundRect(ctx, x - 36, y - 16, 72, 32, 6);
  ctx.fill();
  ctx.fillStyle = "#94a3b8";
  ctx.beginPath();
  ctx.arc(x - 22, y, 6, 0, Math.PI * 2);
  ctx.arc(x + 22, y, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = closed ? "#22c55e" : "#f97316";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x - 22, y);
  if (closed) ctx.lineTo(x + 22, y);
  else ctx.lineTo(x + 10, y - 14);
  ctx.stroke();
  ctx.fillStyle = "#e2e8f0";
  ctx.font = "700 11px Segoe UI";
  ctx.textAlign = "center";
  ctx.fillText(closed ? "Switch ON" : "Switch OFF", x, y + 36);
}
function drawBulb(ctx, x, y, lit) {
  ctx.fillStyle = lit ? "#fef08a" : "#64748b";
  ctx.beginPath();
  ctx.arc(x, y - 8, 22, 0, Math.PI * 2);
  ctx.fill();
  if (lit) {
    ctx.strokeStyle = "rgba(250,204,21,0.7)";
    ctx.lineWidth = 2;
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(a) * 26, y - 8 + Math.sin(a) * 26);
      ctx.lineTo(x + Math.cos(a) * 34, y - 8 + Math.sin(a) * 34);
      ctx.stroke();
    }
  }
  ctx.fillStyle = "#475569";
  roundRect(ctx, x - 10, y + 12, 20, 14, 3);
  ctx.fill();
  ctx.fillStyle = lit ? "#fde68a" : "#cbd5e1";
  ctx.font = "700 11px Segoe UI";
  ctx.textAlign = "center";
  ctx.fillText("Bulb", x, y + 42);
}
function drawWireSeg(ctx, x1, y1, x2, y2, on) {
  ctx.strokeStyle = on ? "#facc15" : "#64748b";
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

export function registerCircuitScenes(arena) {
  if (!arena?.registerScene) return;

  arena.registerScene("circuitMeet", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, opts, setHitRegions } = api;
    labState.phase = opts.phase || labState.phase || "desk";
    setDescription("Circuit Loop - closed path lights the bulb.");
    const props = { bat: { x: 0, y: 0 }, sw: { x: 0, y: 0 }, bulb: { x: 0, y: 0 } };
    let inited = false;
    setTick(() => {
      const w = api.width, h = api.height, layout = api.layout;
      const live = labState.phase || "desk";
      const closed = live === "glow" || live === "settle";
      drawBackdrop();
      if (!inited) {
        props.bat.x = w * 0.2; props.bat.y = h * 0.42;
        props.sw.x = w * 0.5; props.sw.y = h * 0.28;
        props.bulb.x = w * 0.78; props.bulb.y = h * 0.42;
        inited = true;
      }
      ctx.fillStyle = "#1e293b";
      roundRect(ctx, w * 0.08, layout.deskTop - 8, w * 0.84, 18, 8);
      ctx.fill();
      if (closed) {
        drawWireSeg(ctx, props.bat.x + 28, props.bat.y, props.sw.x - 36, props.sw.y, true);
        drawWireSeg(ctx, props.sw.x + 36, props.sw.y, props.bulb.x - 22, props.bulb.y - 8, true);
        drawWireSeg(ctx, props.bulb.x, props.bulb.y + 26, props.bat.x, props.bat.y + 36, true);
      }
      drawBattery(ctx, props.bat.x, props.bat.y);
      drawSwitch(ctx, props.sw.x, props.sw.y, closed);
      drawBulb(ctx, props.bulb.x, props.bulb.y, closed);
      const tips = {
        desk: "Drag battery, switch, bulb - build the team",
        glow: "Closed path: current can travel the loop",
        settle: "Open gap = dark. Closed loop = light",
      };
      drawLabel(ctx, tips[live] || tips.desk, w * 0.5, layout.labelY);
      const hits = [];
      for (const [id, p] of Object.entries(props)) {
        hits.push({
          id, shape: "rect", x: p.x, y: p.y, w: 90, h: 90, meta: { propId: id },
          onDrag(pt) {
            p.x = Math.max(50, Math.min(w - 50, pt.x));
            p.y = Math.max(70, Math.min(layout.deskTop, pt.y));
          },
        });
      }
      setHitRegions(hits);
      failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => {});
  });

  arena.registerScene("circuitSort", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler, reducedMotion } = api;
    setDescription("Sort: closed loop, open gap, or not a circuit.");
    const chips = [
      { id: "bat", short: "Battery", color: 0xfacc15 },
      { id: "wire", short: "Wire", color: 0x94a3b8 },
      { id: "swon", short: "Switch ON", color: 0x22c55e },
      { id: "bulb", short: "Bulb", color: 0xfde68a },
      { id: "swoff", short: "Switch OFF", color: 0xf97316 },
      { id: "break", short: "Broken", color: 0xef4444 },
      { id: "erase", short: "Eraser", color: 0xa78bfa },
      { id: "wood", short: "Wood", color: 0x78716c },
    ];
    const accept = {
      closed: ["bat", "wire", "swon", "bulb"],
      open: ["swoff", "break"],
      not: ["erase", "wood"],
    };
    const cardPos = {}; chips.forEach((c) => (cardPos[c.id] = { x: 0, y: 0 }));
    let draggingId = null, lastZones = [];
    function placeChip(chipId, zoneId) {
      const okList = accept[zoneId] || [];
      if (!okList.includes(chipId)) { pulseFailFeedback(400); return false; }
      labState.placed = { ...(labState.placed || {}), [chipId]: zoneId };
      const session = getActiveSession();
      if (session?.dispatch) session.dispatch({ type: "PLACE_CHIP", chipId, zoneId, accept: okList });
      else labState._placedVersion = (labState._placedVersion || 0) + 1;
      pulseSuccessFeedback(220); return true;
    }
    function zoneAt(x, y) {
      for (const z of lastZones) if (x >= z.x && x <= z.x + z.ww && y >= z.y && y <= z.y + z.hh) return z.id;
      return null;
    }
    setIntentHandler((intent) => {
      if (intent.type === "CANVAS_DOWN" && intent.meta?.chipId) { draggingId = intent.meta.chipId; labState.selectedId = intent.meta.chipId; }
      if (intent.type === "CANVAS_DRAG" && intent.meta?.chipId && cardPos[intent.meta.chipId]) {
        draggingId = intent.meta.chipId; cardPos[intent.meta.chipId].x = intent.x; cardPos[intent.meta.chipId].y = intent.y;
      }
      if (intent.type === "CANVAS_TAP" && intent.meta?.chipId) labState.selectedId = intent.meta.chipId;
      if (intent.type === "CANVAS_TAP" && intent.meta?.zoneId && labState.selectedId) placeChip(labState.selectedId, intent.meta.zoneId);
      if (intent.type === "CANVAS_UP" && intent.meta?.chipId) {
        const zoneId = intent.dropMeta?.zoneId || zoneAt(intent.x, intent.y);
        if (zoneId) placeChip(intent.meta.chipId, zoneId);
        draggingId = null;
      } else if (intent.type === "CANVAS_UP") draggingId = null;
    });
    setTick(() => {
      const w = api.width, h = api.height, layout = api.layout;
      drawBackdrop();
      const zoneH = Math.max(100, Math.min(h * 0.28, 130));
      const zoneY = Math.max(layout.labelY + 28, h * 0.09);
      const zones = [
        { id: "closed", label: "Closed loop part", x: w * 0.02, y: zoneY, ww: w * 0.31, hh: zoneH, color: "#22c55e" },
        { id: "open", label: "Open / gap", x: w * 0.35, y: zoneY, ww: w * 0.31, hh: zoneH, color: "#f97316" },
        { id: "not", label: "Not a circuit", x: w * 0.68, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#94a3b8" },
      ];
      lastZones = zones;
      const hits = [];
      for (const z of zones) {
        ctx.fillStyle = "rgba(15,23,42,0.75)"; roundRect(ctx, z.x, z.y, z.ww, z.hh, 12); ctx.fill();
        ctx.strokeStyle = z.color; ctx.lineWidth = 2.5; ctx.stroke();
        drawLabel(ctx, z.label, z.x + z.ww / 2, z.y + 16, { h: 20, font: "700 11px Segoe UI" });
        hits.push({ id: "zone-" + z.id, shape: "rect", x: z.x + z.ww / 2, y: z.y + z.hh / 2, w: z.ww, h: z.hh, meta: { zoneId: z.id, accept: accept[z.id] } });
      }
      const placed = labState.placed || {};
      const byZone = { closed: [], open: [], not: [] };
      chips.forEach((c) => { if (typeof placed[c.id] === "string" && byZone[placed[c.id]]) byZone[placed[c.id]].push(c.id); });
      const bankIds = chips.filter((c) => typeof placed[c.id] !== "string").map((c) => c.id);
      const ease = reducedMotion ? 1 : 0.18;
      chips.forEach((c) => {
        let targetX, targetY;
        const zoneKey = typeof placed[c.id] === "string" ? placed[c.id] : null;
        if (zoneKey && byZone[zoneKey]) {
          const z = zones.find((zz) => zz.id === zoneKey);
          const idx = byZone[zoneKey].indexOf(c.id);
          const slot = sortSlotPositions({ x: z.x, y: z.y + 18, w: z.ww, h: z.hh - 22 }, Math.max(byZone[zoneKey].length, 1), idx);
          targetX = slot.x; targetY = slot.y;
        } else {
          const idx = bankIds.indexOf(c.id);
          targetX = w * 0.14 + (idx % 4) * (w * 0.22);
          targetY = zoneY + zoneH + 36 + Math.floor(idx / 4) * 48;
        }
        const prev = cardPos[c.id];
        if (!prev.x && !prev.y) { prev.x = targetX; prev.y = targetY; }
        if (draggingId !== c.id) { prev.x += (targetX - prev.x) * ease; prev.y += (targetY - prev.y) * ease; }
        ctx.fillStyle = labState.selectedId === c.id ? "rgba(250,204,21,0.4)" : "rgba(15,23,42,0.95)";
        roundRect(ctx, prev.x - 48, prev.y - 16, 96, 32, 8); ctx.fill();
        ctx.strokeStyle = "#" + c.color.toString(16).padStart(6, "0"); ctx.stroke();
        ctx.fillStyle = "#fde68a"; ctx.font = "700 11px Segoe UI"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(c.short, prev.x, prev.y);
        hits.push({ id: c.id, shape: "rect", x: prev.x, y: prev.y, w: 100, h: 36, meta: { chipId: c.id },
          onDrag(pt) { draggingId = c.id; prev.x = Math.max(30, Math.min(w - 30, pt.x)); prev.y = Math.max(30, Math.min(h - 30, pt.y)); } });
      });
      drawLabel(ctx, "Closed loop / Open gap / Not a circuit", w * 0.5, layout.labelY);
      setHitRegions(hits); failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => setIntentHandler(null));
  });

  arena.registerScene("circuitLab", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
    setDescription("Close the path - watch the bulb brighten.");
    setIntentHandler((intent) => {
      if (intent.type === "CANVAS_DRAG" && intent.meta?.action === "stretch") {
        labState.heat = Math.max(0, Math.min(1, (intent.x - api.width * 0.2) / (api.width * 0.6)));
      }
    });
    setTick(() => {
      const w = api.width, h = api.height, layout = api.layout;
      const heat = labState.heat ?? 0.3;
      const closed = heat >= 0.55;
      drawBackdrop();
      drawBattery(ctx, w * 0.22, h * 0.4);
      drawSwitch(ctx, w * 0.5, h * 0.28, closed);
      drawBulb(ctx, w * 0.78, h * 0.4, heat);
      if (closed) {
        drawWireSeg(ctx, w * 0.22 + 28, h * 0.4, w * 0.5 - 36, h * 0.28, true);
        drawWireSeg(ctx, w * 0.5 + 36, h * 0.28, w * 0.78 - 22, h * 0.4 - 8, true);
        drawWireSeg(ctx, w * 0.78, h * 0.4 + 26, w * 0.22, h * 0.4 + 36, true);
      } else {
        drawWireSeg(ctx, w * 0.22 + 28, h * 0.4, w * 0.42, h * 0.28, false);
        drawWireSeg(ctx, w * 0.58, h * 0.28, w * 0.78 - 22, h * 0.4 - 8, false);
      }
      const hx = w * 0.2 + heat * w * 0.6;
      ctx.fillStyle = "#facc15";
      ctx.beginPath(); ctx.arc(hx, h * 0.72, 14, 0, Math.PI * 2); ctx.fill();
      drawLabel(ctx, heat >= 0.6 ? "Loop closing - bulb brightens" : "Drag to close the path", w * 0.5, layout.labelY);
      setHitRegions([{ id: "h", shape: "rect", x: hx, y: h * 0.72, w: 48, h: 48, meta: { action: "stretch" } }]);
      failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => setIntentHandler(null));
  });

  arena.registerScene("circuitRule", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
    setDescription("Closed loop = current flows.");
    setTick(() => {
      const w = api.width, h = api.height, layout = api.layout, prog = labState.tokenProgress || 0;
      drawBackdrop();
      ["Closed", "loop", "=", "current flows"].forEach((label, i) => {
        const x = w * 0.14 + i * (w * 0.2);
        ctx.fillStyle = i < prog ? "rgba(250,204,21,0.4)" : "rgba(15,23,42,0.9)";
        roundRect(ctx, x - 48, h * 0.36 - 18, 96, 36, 10); ctx.fill();
        ctx.fillStyle = "#fde68a"; ctx.font = "700 11px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(label, x, h * 0.36);
      });
      drawBulb(ctx, w * 0.5, h * 0.58, prog >= 4);
      drawLabel(ctx, "Circuit Loop rule", w * 0.5, layout.labelY);
      failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => {});
  });

  arena.registerScene("circuitStretch", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
    const modes = ["home", "school", "street", "shop", "lab"];
    setDescription("Same closed-loop idea in places you know.");
    setIntentHandler((intent) => {
      if (intent.type === "CANVAS_TAP" && intent.meta?.mode) { labState.mode = intent.meta.mode; pulseSuccessFeedback(200); }
    });
    setTick(() => {
      const w = api.width, h = api.height, layout = api.layout, mode = labState.mode || "home";
      drawBackdrop();
      const hits = [];
      modes.forEach((m, i) => {
        const x = w * 0.12 + i * (w * 0.17);
        ctx.fillStyle = m === mode ? "rgba(250,204,21,0.4)" : "#1e293b";
        roundRect(ctx, x - 36, layout.deskTop - 36, 72, 48, 10); ctx.fill();
        ctx.fillStyle = "#fde68a"; ctx.font = "600 11px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(m, x, layout.deskTop - 10);
        hits.push({ id: m, shape: "rect", x, y: layout.deskTop - 12, w: 72, h: 48, meta: { mode: m } });
      });
      drawBulb(ctx, w * 0.5, h * 0.4, true);
      const captions = {
        home: "Torch / room light - switch closes the loop",
        school: "Science kit - battery, wires, bulb",
        street: "Street lamp needs a complete supply path",
        shop: "Shop signs light when the circuit is closed",
        lab: "Lab boards: build one neat closed path",
      };
      drawLabel(ctx, captions[mode], w * 0.5, layout.labelY);
      setHitRegions(hits); failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => setIntentHandler(null));
  });

  arena.registerScene("circuitMyth", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
    const myths = [
      { claim: "Current stops at the bulb forever", truth: "Current needs a full closed loop back to the battery" },
      { claim: "Open switch still lets current flow", truth: "Open switch = gap; current stops" },
      { claim: "Any scrap wire is always a full circuit", truth: "Parts must connect into one closed path" },
      { claim: "A broken wire still lights the bulb", truth: "A gap breaks the loop - no light" },
      { claim: "Only experts can build a simple loop", truth: "Kids can build battery-wire-bulb loops carefully" },
    ];
    setDescription("Bust circuit myths.");
    setIntentHandler((intent) => {
      if (intent.type === "CANVAS_TAP" && intent.meta?.action === "flip") {
        labState.mythPhase = labState.mythPhase === "truth" ? "claim" : "truth";
        if (labState.mythPhase === "truth") pulseSuccessFeedback(220);
      }
    });
    setTick(() => {
      const w = api.width, h = api.height, layout = api.layout;
      const idx = labState.myth ?? 0, phase = labState.mythPhase || "claim", m = myths[idx] || myths[0];
      drawBackdrop();
      ctx.fillStyle = phase === "truth" ? "rgba(250,204,21,0.2)" : "rgba(248,113,113,0.18)";
      roundRect(ctx, w * 0.12, h * 0.28, w * 0.76, h * 0.28, 16); ctx.fill();
      drawLabel(ctx, phase === "truth" ? m.truth : "Myth: " + m.claim, w * 0.5, h * 0.42, { h: 42, font: "700 13px Segoe UI" });
      drawLabel(ctx, "Myth " + (idx + 1) + " / 5  -  Tap to flip", w * 0.5, layout.labelY);
      setHitRegions([{ id: "card", shape: "rect", x: w * 0.5, y: h * 0.42, w: w * 0.76, h: h * 0.28, meta: { action: "flip" } }]);
      failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => setIntentHandler(null));
  });

  arena.registerScene("circuitDrill", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
    setDescription(labState.prompt || "Loop drill");
    setTick(() => {
      const w = api.width, h = api.height;
      drawBackdrop();
      drawLabel(ctx, labState.prompt || "Circuit Loop drill", w * 0.5, h * 0.2, { h: 32, font: "700 16px Segoe UI" });
      drawBulb(ctx, w * 0.5, h * 0.48, true);
      failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => {});
  });

  arena.registerScene("circuitMastery", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
    setDescription("Loop Learner mastery.");
    setTick(() => {
      const w = api.width, h = api.height, layout = api.layout, locked = labState.masteryStep || 0;
      drawBackdrop();
      ["Meet", "Sort", "Lab", "Rule", "Myth", "Loop"].forEach((label, i) => {
        const x = w * 0.1 + i * (w * 0.14);
        ctx.fillStyle = i < locked ? "#facc15" : "rgba(148,163,184,0.35)";
        roundRect(ctx, x - 28, h * 0.78 - 12, 56, 24, 8); ctx.fill();
        ctx.fillStyle = "#0f172a"; ctx.font = "600 10px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(label, x, h * 0.78);
      });
      drawBattery(ctx, w * 0.28, h * 0.4); drawSwitch(ctx, w * 0.5, h * 0.32, true); drawBulb(ctx, w * 0.72, h * 0.4, true);
      drawLabel(ctx, "Loop Learner!", w * 0.5, layout.labelY);
      failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => {});
  });
}
