/**
 * ICT / Mission 2: Input & Output - devices that talk both ways.
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
  ctx.strokeStyle = opts.border || "rgba(96,165,250,0.55)";
  ctx.lineWidth = 1.4;
  ctx.stroke();
  ctx.fillStyle = opts.color || "#dbeafe";
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
  ctx.fillStyle = `rgba(96,165,250,${Math.max(0, (until - performance.now()) / 380) * 0.22})`;
  ctx.fillRect(0, 0, w, h);
}
function drawKeyboard(ctx, x, y) {
  ctx.fillStyle = "#334155";
  roundRect(ctx, x - 55, y - 20, 110, 40, 6);
  ctx.fill();
  for (let r = 0; r < 3; r++) for (let c = 0; c < 8; c++) {
    ctx.fillStyle = "#64748b";
    roundRect(ctx, x - 48 + c * 12, y - 14 + r * 12, 10, 10, 2);
    ctx.fill();
  }
}
function drawScreen(ctx, x, y, on) {
  ctx.fillStyle = "#0f172a";
  roundRect(ctx, x - 50, y - 35, 100, 70, 8);
  ctx.fill();
  ctx.fillStyle = on ? "#38bdf8" : "#1e293b";
  roundRect(ctx, x - 42, y - 27, 84, 54, 4);
  ctx.fill();
  ctx.fillStyle = "#94a3b8";
  ctx.fillRect(x - 10, y + 35, 20, 8);
}
function drawSpeaker(ctx, x, y) {
  ctx.fillStyle = "#475569";
  roundRect(ctx, x - 24, y - 28, 48, 56, 8);
  ctx.fill();
  ctx.strokeStyle = "#94a3b8";
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.arc(x, y - 8 + i * 10, 12 + i, -0.6, 0.6);
    ctx.stroke();
  }
}
function drawMic(ctx, x, y) {
  ctx.fillStyle = "#64748b";
  roundRect(ctx, x - 10, y - 28, 20, 36, 10);
  ctx.fill();
  ctx.strokeStyle = "#94a3b8";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x, y + 8, 16, 0, Math.PI);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y + 24);
  ctx.lineTo(x, y + 34);
  ctx.stroke();
}

export function registerIoScenes(arena) {
  if (!arena?.registerScene) return;

  arena.registerScene("ioMeet", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, opts, setHitRegions } = api;
    labState.phase = opts.phase || labState.phase || "desk";
    setDescription("Input & Output - in to the computer, out to you.");
    const props = { kb: { x: 0, y: 0 }, scr: { x: 0, y: 0 }, mic: { x: 0, y: 0 }, spk: { x: 0, y: 0 } };
    let inited = false;
    setTick(() => {
      const w = api.width, h = api.height, layout = api.layout;
      const live = labState.phase || "desk";
      drawBackdrop();
      if (!inited) {
        props.kb.x = w * 0.22; props.kb.y = h * 0.5;
        props.scr.x = w * 0.48; props.scr.y = h * 0.4;
        props.mic.x = w * 0.7; props.mic.y = h * 0.48;
        props.spk.x = w * 0.88; props.spk.y = h * 0.45;
        inited = true;
      }
      ctx.fillStyle = "#1e3a5f";
      roundRect(ctx, w * 0.08, layout.deskTop - 8, w * 0.84, 18, 8);
      ctx.fill();
      drawKeyboard(ctx, props.kb.x, props.kb.y);
      drawScreen(ctx, props.scr.x, props.scr.y, live !== "desk");
      drawMic(ctx, props.mic.x, props.mic.y);
      drawSpeaker(ctx, props.spk.x, props.spk.y);
      if (live === "glow" || live === "settle") {
        ctx.fillStyle = "#38bdf8";
        ctx.font = "700 14px Segoe UI";
        ctx.textAlign = "center";
        ctx.fillText("IN ->", w * 0.22, h * 0.22);
        ctx.fillText("<- OUT", w * 0.75, h * 0.22);
      }
      const tips = {
        desk: "Drag keyboard, screen, mic, speaker",
        glow: "Input sends data in / Output shows/plays out",
        settle: "You <-> devices <-> computer",
      };
      drawLabel(ctx, tips[live] || tips.desk, w * 0.5, layout.labelY);
      const hits = [];
      for (const [id, p] of Object.entries(props)) {
        hits.push({
          id, shape: "rect", x: p.x, y: p.y, w: 90, h: 80, meta: { propId: id },
          onDrag(pt) {
            p.x = Math.max(40, Math.min(w - 40, pt.x));
            p.y = Math.max(70, Math.min(layout.deskTop, pt.y));
          },
        });
      }
      setHitRegions(hits);
      failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => {});
  });

  arena.registerScene("ioSort", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler, reducedMotion } = api;
    setDescription("Sort input vs output vs both/neither.");
    const chips = [
      { id: "kb", text: "Keyboard", short: "Keyboard", color: 0x38bdf8 },
      { id: "mouse", text: "Mouse", short: "Mouse", color: 0x60a5fa },
      { id: "screen", text: "Monitor", short: "Screen", color: 0x22c55e },
      { id: "speaker", text: "Speaker", short: "Speaker", color: 0x4ade80 },
      { id: "mic", text: "Microphone", short: "Mic", color: 0x0ea5e9 },
      { id: "printer", text: "Printer", short: "Printer", color: 0xa3e635 },
      { id: "touch", text: "Touchscreen", short: "Touch", color: 0xfbbf24 },
      { id: "cake", text: "Birthday cake", short: "Cake", color: 0xf472b6 },
    ];
    const accept = {
      input: ["kb", "mouse", "mic"],
      output: ["screen", "speaker", "printer"],
      both: ["touch"],
      not: ["cake"],
    };
    const cardPos = {}; chips.forEach((c) => (cardPos[c.id] = { x: 0, y: 0 }));
    let draggingId = null, lastZones = [];
    function placeChip(chipId, zoneId) {
      if (!(accept[zoneId] || []).includes(chipId)) { pulseFailFeedback(400); return false; }
      labState.placed = { ...(labState.placed || {}), [chipId]: zoneId };
      const session = getActiveSession();
      if (session?.dispatch) session.dispatch({ type: "PLACE_CHIP", chipId, zoneId, accept: accept[zoneId] });
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
        { id: "input", label: "Input", x: w * 0.02, y: zoneY, ww: w * 0.23, hh: zoneH, color: "#38bdf8" },
        { id: "output", label: "Output", x: w * 0.26, y: zoneY, ww: w * 0.23, hh: zoneH, color: "#22c55e" },
        { id: "both", label: "Both", x: w * 0.5, y: zoneY, ww: w * 0.23, hh: zoneH, color: "#fbbf24" },
        { id: "not", label: "Not I/O", x: w * 0.74, y: zoneY, ww: w * 0.24, hh: zoneH, color: "#94a3b8" },
      ];
      lastZones = zones;
      const hits = [];
      for (const z of zones) {
        ctx.fillStyle = "rgba(15,23,42,0.75)"; roundRect(ctx, z.x, z.y, z.ww, z.hh, 12); ctx.fill();
        ctx.strokeStyle = z.color; ctx.lineWidth = 2.5; ctx.stroke();
        drawLabel(ctx, z.label, z.x + z.ww / 2, z.y + 16, { h: 20, font: "700 11px Segoe UI" });
        hits.push({ id: "z-" + z.id, shape: "rect", x: z.x + z.ww / 2, y: z.y + z.hh / 2, w: z.ww, h: z.hh, meta: { zoneId: z.id, accept: accept[z.id] } });
      }
      const placed = labState.placed || {};
      const byZone = { input: [], output: [], both: [], not: [] };
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
        ctx.fillStyle = labState.selectedId === c.id ? "rgba(96,165,250,0.4)" : "rgba(15,23,42,0.95)";
        roundRect(ctx, prev.x - 48, prev.y - 16, 96, 32, 8); ctx.fill();
        ctx.strokeStyle = "#" + c.color.toString(16).padStart(6, "0"); ctx.stroke();
        ctx.fillStyle = "#dbeafe"; ctx.font = "700 11px Segoe UI"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(c.short, prev.x, prev.y);
        hits.push({ id: c.id, shape: "rect", x: prev.x, y: prev.y, w: 100, h: 36, meta: { chipId: c.id },
          onDrag(pt) { draggingId = c.id; prev.x = Math.max(30, Math.min(w - 30, pt.x)); prev.y = Math.max(30, Math.min(h - 30, pt.y)); } });
      });
      drawLabel(ctx, "Input / Output / Both / Not I/O", w * 0.5, layout.labelY);
      setHitRegions(hits); failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => setIntentHandler(null));
  });

  arena.registerScene("ioLab", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
    setDescription("Type in -> see out on screen.");
    setIntentHandler((intent) => {
      if (intent.type === "CANVAS_DRAG" && intent.meta?.action === "stretch") {
        labState.heat = Math.max(0, Math.min(1, (intent.x - api.width * 0.2) / (api.width * 0.6)));
      }
      if (intent.type === "CANVAS_TAP" && intent.meta?.action === "type") {
        labState.typed = (labState.typed || 0) + 1;
        labState.heat = Math.min(1, (labState.typed || 0) / 8);
        pulseSuccessFeedback(120);
      }
    });
    setTick(() => {
      const w = api.width, h = api.height, layout = api.layout;
      const heat = labState.heat ?? 0.2;
      drawBackdrop();
      drawKeyboard(ctx, w * 0.3, h * 0.55);
      drawScreen(ctx, w * 0.7, h * 0.4, true);
      ctx.fillStyle = "#e0f2fe";
      ctx.font = "700 16px Segoe UI";
      ctx.textAlign = "left";
      const msg = "Hello".slice(0, Math.max(1, Math.round(heat * 5)));
      ctx.fillText(msg + (heat > 0.15 ? "|" : ""), w * 0.7 - 30, h * 0.4);
      const hx = w * 0.2 + heat * w * 0.6;
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath(); ctx.arc(hx, h * 0.72, 14, 0, Math.PI * 2); ctx.fill();
      drawLabel(ctx, heat >= 0.6 ? "Input typed -> output on screen!" : "Drag or tap keyboard to send input", w * 0.5, layout.labelY);
      setHitRegions([
        { id: "h", shape: "rect", x: hx, y: h * 0.72, w: 48, h: 48, meta: { action: "stretch" } },
        { id: "kb", shape: "rect", x: w * 0.3, y: h * 0.55, w: 120, h: 50, meta: { action: "type" } },
      ]);
      failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => setIntentHandler(null));
  });

  arena.registerScene("ioRule", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
    setDescription("Input in / Output out.");
    setTick(() => {
      const w = api.width, h = api.height, layout = api.layout, prog = labState.tokenProgress || 0;
      drawBackdrop();
      ["Input", "->", "Process", "-> Output"].forEach((label, i) => {
        const x = w * 0.18 + i * (w * 0.18);
        ctx.fillStyle = i < prog ? "rgba(96,165,250,0.4)" : "rgba(15,23,42,0.9)";
        roundRect(ctx, x - 44, h * 0.36 - 18, 88, 36, 10); ctx.fill();
        ctx.fillStyle = "#dbeafe"; ctx.font = "700 12px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(label, x, h * 0.36);
      });
      drawKeyboard(ctx, w * 0.35, h * 0.58); drawScreen(ctx, w * 0.65, h * 0.55, true);
      drawLabel(ctx, "I/O rule", w * 0.5, layout.labelY);
      failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => {});
  });

  arena.registerScene("ioStretch", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
    const modes = ["class", "game", "call", "print", "music"];
    setDescription("I/O in real life.");
    setIntentHandler((intent) => {
      if (intent.type === "CANVAS_TAP" && intent.meta?.mode) { labState.mode = intent.meta.mode; pulseSuccessFeedback(200); }
    });
    setTick(() => {
      const w = api.width, h = api.height, layout = api.layout, mode = labState.mode || "class";
      drawBackdrop();
      const hits = [];
      modes.forEach((m, i) => {
        const x = w * 0.12 + i * (w * 0.17);
        ctx.fillStyle = m === mode ? "rgba(96,165,250,0.4)" : "#1e3a5f";
        roundRect(ctx, x - 36, layout.deskTop - 36, 72, 48, 10); ctx.fill();
        ctx.fillStyle = "#dbeafe"; ctx.font = "600 11px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(m, x, layout.deskTop - 10);
        hits.push({ id: m, shape: "rect", x, y: layout.deskTop - 12, w: 72, h: 48, meta: { mode: m } });
      });
      drawScreen(ctx, w * 0.5, h * 0.38, true);
      const captions = {
        class: "Keyboard + screen for school typing",
        game: "Controller in / screen/speakers out",
        call: "Mic in / speaker out",
        print: "File in computer / paper out of printer",
        music: "Tap play (in) / sound out",
      };
      drawLabel(ctx, captions[mode], w * 0.5, layout.labelY);
      setHitRegions(hits); failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => setIntentHandler(null));
  });

  arena.registerScene("ioMyth", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
    const myths = [
      { claim: "A monitor is an input device", truth: "A plain monitor is output (touchscreens can be both)" },
      { claim: "Speakers take typing in", truth: "Speakers output sound" },
      { claim: "Microphone is output", truth: "Mic is input - your voice goes in" },
      { claim: "Printer is input", truth: "Printer outputs onto paper" },
      { claim: "Touchscreen is only output", truth: "Touchscreen is both - show and touch" },
    ];
    setDescription("Bust I/O myths.");
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
      ctx.fillStyle = phase === "truth" ? "rgba(96,165,250,0.2)" : "rgba(248,113,113,0.18)";
      roundRect(ctx, w * 0.12, h * 0.28, w * 0.76, h * 0.28, 16); ctx.fill();
      drawLabel(ctx, phase === "truth" ? m.truth : "Myth: " + m.claim, w * 0.5, h * 0.42, { h: 42, font: "700 13px Segoe UI" });
      drawLabel(ctx, "Myth " + (idx + 1) + " / 5 / Tap to flip", w * 0.5, layout.labelY);
      setHitRegions([{ id: "card", shape: "rect", x: w * 0.5, y: h * 0.42, w: w * 0.76, h: h * 0.28, meta: { action: "flip" } }]);
      failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => setIntentHandler(null));
  });

  arena.registerScene("ioDrill", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
    setDescription(labState.prompt || "I/O drill");
    setTick(() => {
      const w = api.width, h = api.height;
      drawBackdrop();
      drawLabel(ctx, labState.prompt || "Input & Output drill", w * 0.5, h * 0.2, { h: 32, font: "700 16px Segoe UI" });
      drawKeyboard(ctx, w * 0.35, h * 0.5); drawScreen(ctx, w * 0.65, h * 0.45, true);
      failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => {});
  });

  arena.registerScene("ioMastery", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
    setDescription("I/O Ranger mastery.");
    setTick(() => {
      const w = api.width, h = api.height, layout = api.layout, locked = labState.masteryStep || 0;
      drawBackdrop();
      ["Meet", "Sort", "Lab", "Rule", "Myth", "Ranger"].forEach((label, i) => {
        const x = w * 0.1 + i * (w * 0.14);
        ctx.fillStyle = i < locked ? "#38bdf8" : "rgba(148,163,184,0.35)";
        roundRect(ctx, x - 28, h * 0.78 - 12, 56, 24, 8); ctx.fill();
        ctx.fillStyle = "#0f172a"; ctx.font = "600 10px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(label, x, h * 0.78);
      });
      drawKeyboard(ctx, w * 0.35, h * 0.42); drawScreen(ctx, w * 0.65, h * 0.4, true);
      drawLabel(ctx, "I/O Ranger!", w * 0.5, layout.labelY);
      failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => {});
  });
}
