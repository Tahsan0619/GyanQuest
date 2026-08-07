/**
 * ICT / Mission 1: Computer Bits - CPU, RAM, storage (Tiny Bits depth).
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

function drawCpu(ctx, x, y, pulse) {
  ctx.fillStyle = "#1e293b";
  roundRect(ctx, x - 40, y - 40, 80, 80, 8);
  ctx.fill();
  ctx.strokeStyle = "#60a5fa";
  ctx.lineWidth = 3;
  ctx.stroke();
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = `rgba(96,165,250,${0.3 + pulse * 0.5})`;
    roundRect(ctx, x - 28 + (i % 2) * 30, y - 28 + Math.floor(i / 2) * 30, 24, 24, 4);
    ctx.fill();
  }
  ctx.fillStyle = "#93c5fd";
  ctx.font = "700 11px Segoe UI";
  ctx.textAlign = "center";
  ctx.fillText("CPU", x, y + 54);
}
function drawRam(ctx, x, y) {
  ctx.fillStyle = "#22c55e";
  roundRect(ctx, x - 50, y - 14, 100, 28, 4);
  ctx.fill();
  for (let i = 0; i < 8; i++) {
    ctx.fillStyle = "#86efac";
    ctx.fillRect(x - 44 + i * 12, y - 8, 8, 16);
  }
  ctx.fillStyle = "#bbf7d0";
  ctx.font = "700 11px Segoe UI";
  ctx.textAlign = "center";
  ctx.fillText("RAM (fast memory)", x, y + 32);
}
function drawDisk(ctx, x, y) {
  ctx.fillStyle = "#64748b";
  ctx.beginPath();
  ctx.arc(x, y, 36, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#94a3b8";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = "#0f172a";
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#cbd5e1";
  ctx.font = "700 11px Segoe UI";
  ctx.textAlign = "center";
  ctx.fillText("Storage", x, y + 52);
}

export function registerBitsScenes(arena) {
  if (!arena?.registerScene) return;

  arena.registerScene("bitsMeet", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, opts, setHitRegions } = api;
    labState.phase = opts.phase || labState.phase || "desk";
    setDescription("Computer Bits - CPU thinks, RAM holds now, storage keeps.");
    const props = { cpu: { x: 0, y: 0 }, ram: { x: 0, y: 0 }, disk: { x: 0, y: 0 } };
    let inited = false;
    setTick(() => {
      const w = api.width, h = api.height, layout = api.layout;
      const live = labState.phase || "desk";
      const pulse = labState.heat || 0.4;
      drawBackdrop();
      if (!inited) {
        props.cpu.x = w * 0.25; props.cpu.y = h * 0.42;
        props.ram.x = w * 0.5; props.ram.y = h * 0.48;
        props.disk.x = w * 0.75; props.disk.y = h * 0.42;
        inited = true;
      }
      ctx.fillStyle = "#1e3a5f";
      roundRect(ctx, w * 0.08, layout.deskTop - 8, w * 0.84, 18, 8);
      ctx.fill();
      drawCpu(ctx, props.cpu.x, props.cpu.y, live === "glow" || live === "settle" ? pulse : 0.2);
      drawRam(ctx, props.ram.x, props.ram.y);
      drawDisk(ctx, props.disk.x, props.disk.y);
      if (live === "glow" || live === "settle") {
        ctx.strokeStyle = "rgba(96,165,250,0.6)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(props.cpu.x + 40, props.cpu.y);
        ctx.lineTo(props.ram.x - 50, props.ram.y);
        ctx.lineTo(props.disk.x - 36, props.disk.y);
        ctx.stroke();
      }
      const tips = {
        desk: "Drag CPU, RAM, storage - the inside team",
        glow: "CPU <-> RAM for open work / Storage keeps files",
        settle: "Brain / desk / cupboard of the computer",
      };
      drawLabel(ctx, tips[live] || tips.desk, w * 0.5, layout.labelY);
      const hits = [];
      for (const [id, p] of Object.entries(props)) {
        hits.push({
          id, shape: "rect", x: p.x, y: p.y, w: 100, h: 90, meta: { propId: id },
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

  arena.registerScene("bitsSort", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler, reducedMotion } = api;
    setDescription("Sort: CPU, RAM, or storage job?");
    const chips = [
      { id: "calc", text: "Do the math fast", short: "Calculate", color: 0x60a5fa },
      { id: "open", text: "Hold open app", short: "Open app", color: 0x22c55e },
      { id: "save", text: "Keep photo forever", short: "Save file", color: 0x94a3b8 },
      { id: "boot", text: "Run instructions", short: "Run code", color: 0x3b82f6 },
      { id: "temp", text: "Scratch pad now", short: "Scratch", color: 0x4ade80 },
      { id: "ssd", text: "SSD / hard disk", short: "Disk", color: 0x64748b },
      { id: "snack", text: "Eat a snack", short: "Snack", color: 0xf97316 },
      { id: "paint", text: "Wall paint color", short: "Paint", color: 0xa78bfa },
    ];
    const accept = {
      cpu: ["calc", "boot"],
      ram: ["open", "temp"],
      store: ["save", "ssd"],
      not: ["snack", "paint"],
    };
    // fix: store zone id
    accept.storage = accept.store;
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
        { id: "cpu", label: "CPU job", x: w * 0.02, y: zoneY, ww: w * 0.23, hh: zoneH, color: "#60a5fa" },
        { id: "ram", label: "RAM job", x: w * 0.26, y: zoneY, ww: w * 0.23, hh: zoneH, color: "#22c55e" },
        { id: "storage", label: "Storage job", x: w * 0.5, y: zoneY, ww: w * 0.23, hh: zoneH, color: "#94a3b8" },
        { id: "not", label: "Not a PC part", x: w * 0.74, y: zoneY, ww: w * 0.24, hh: zoneH, color: "#f97316" },
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
      const byZone = { cpu: [], ram: [], storage: [], not: [] };
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
      drawLabel(ctx, "CPU / RAM / Storage / Not a PC part", w * 0.5, layout.labelY);
      setHitRegions(hits); failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => setIntentHandler(null));
  });

  arena.registerScene("bitsLab", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
    setDescription("Dial CPU work - watch RAM fill for open tasks.");
    setIntentHandler((intent) => {
      if (intent.type === "CANVAS_DRAG" && intent.meta?.action === "stretch") {
        labState.heat = Math.max(0, Math.min(1, (intent.x - api.width * 0.2) / (api.width * 0.6)));
      }
    });
    setTick(() => {
      const w = api.width, h = api.height, layout = api.layout;
      const heat = labState.heat ?? 0.3;
      drawBackdrop();
      drawCpu(ctx, w * 0.28, h * 0.4, heat);
      drawRam(ctx, w * 0.65, h * 0.4);
      ctx.fillStyle = `rgba(34,197,94,${0.2 + heat * 0.7})`;
      roundRect(ctx, w * 0.65 - 48, h * 0.4 - 12, 96 * heat, 24, 4);
      ctx.fill();
      const hx = w * 0.2 + heat * w * 0.6;
      ctx.fillStyle = "#60a5fa";
      ctx.beginPath(); ctx.arc(hx, h * 0.7, 14, 0, Math.PI * 2); ctx.fill();
      drawLabel(ctx, heat >= 0.6 ? "Busy PC: CPU working / RAM holding open apps" : "Drag - more CPU work fills RAM", w * 0.5, layout.labelY);
      setHitRegions([{ id: "h", shape: "rect", x: hx, y: h * 0.7, w: 48, h: 48, meta: { action: "stretch" } }]);
      failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => setIntentHandler(null));
  });

  arena.registerScene("bitsRule", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
    setDescription("CPU / RAM / Storage team.");
    setTick(() => {
      const w = api.width, h = api.height, layout = api.layout, prog = labState.tokenProgress || 0;
      drawBackdrop();
      ["CPU", "RAM", "Storage", "Team"].forEach((label, i) => {
        const x = w * 0.18 + i * (w * 0.18);
        ctx.fillStyle = i < prog ? "rgba(96,165,250,0.4)" : "rgba(15,23,42,0.9)";
        roundRect(ctx, x - 44, h * 0.36 - 18, 88, 36, 10); ctx.fill();
        ctx.fillStyle = "#dbeafe"; ctx.font = "700 12px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(label, x, h * 0.36);
      });
      drawCpu(ctx, w * 0.5, h * 0.58, 0.7);
      drawLabel(ctx, "Computer Bits rule", w * 0.5, layout.labelY);
      failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => {});
  });

  arena.registerScene("bitsStretch", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
    const modes = ["phone", "laptop", "lab", "game", "class"];
    setDescription("Same parts in devices you know.");
    setIntentHandler((intent) => {
      if (intent.type === "CANVAS_TAP" && intent.meta?.mode) { labState.mode = intent.meta.mode; pulseSuccessFeedback(200); }
    });
    setTick(() => {
      const w = api.width, h = api.height, layout = api.layout, mode = labState.mode || "phone";
      drawBackdrop();
      const hits = [];
      modes.forEach((m, i) => {
        const x = w * 0.12 + i * (w * 0.17);
        ctx.fillStyle = m === mode ? "rgba(96,165,250,0.4)" : "#1e3a5f";
        roundRect(ctx, x - 36, layout.deskTop - 36, 72, 48, 10); ctx.fill();
        ctx.fillStyle = "#dbeafe"; ctx.font = "600 11px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(m, x, layout.deskTop - 10);
        hits.push({ id: m, shape: "rect", x, y: layout.deskTop - 12, w: 72, h: 48, meta: { mode: m } });
      });
      drawCpu(ctx, w * 0.35, h * 0.38, 0.5); drawDisk(ctx, w * 0.65, h * 0.38);
      const captions = {
        phone: "Phone has CPU + RAM + storage too",
        laptop: "Laptop - same team, bigger screen",
        lab: "School lab PCs - save work to storage",
        game: "Games need fast CPU + enough RAM",
        class: "Tablet in class - still CPU/RAM/storage",
      };
      drawLabel(ctx, captions[mode], w * 0.5, layout.labelY);
      setHitRegions(hits); failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => setIntentHandler(null));
  });

  arena.registerScene("bitsMyth", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
    const myths = [
      { claim: "RAM and storage are the same", truth: "RAM is fast temporary; storage keeps files after power off" },
      { claim: "CPU is only for gaming", truth: "CPU runs all instructions - school apps too" },
      { claim: "More storage makes apps open faster always", truth: "Open speed leans on CPU + RAM; storage holds files" },
      { claim: "Phones have no CPU", truth: "Phones have a CPU (often called a chip/SoC)" },
      { claim: "Closing the lid deletes storage", truth: "Files on storage stay; RAM clears when powered off" },
    ];
    setDescription("Bust computer myths.");
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

  arena.registerScene("bitsDrill", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
    setDescription(labState.prompt || "Bits drill");
    setTick(() => {
      const w = api.width, h = api.height;
      drawBackdrop();
      drawLabel(ctx, labState.prompt || "Computer Bits drill", w * 0.5, h * 0.2, { h: 32, font: "700 16px Segoe UI" });
      drawCpu(ctx, w * 0.5, h * 0.48, 0.6);
      failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => {});
  });

  arena.registerScene("bitsMastery", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
    setDescription("Bit Scout mastery.");
    setTick(() => {
      const w = api.width, h = api.height, layout = api.layout, locked = labState.masteryStep || 0;
      drawBackdrop();
      ["Meet", "Sort", "Lab", "Rule", "Myth", "Scout"].forEach((label, i) => {
        const x = w * 0.1 + i * (w * 0.14);
        ctx.fillStyle = i < locked ? "#60a5fa" : "rgba(148,163,184,0.35)";
        roundRect(ctx, x - 28, h * 0.78 - 12, 56, 24, 8); ctx.fill();
        ctx.fillStyle = "#0f172a"; ctx.font = "600 10px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(label, x, h * 0.78);
      });
      drawCpu(ctx, w * 0.3, h * 0.4, 0.8); drawRam(ctx, w * 0.55, h * 0.42); drawDisk(ctx, w * 0.78, h * 0.4);
      drawLabel(ctx, "Bit Scout!", w * 0.5, layout.labelY);
      failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => {});
  });
}
