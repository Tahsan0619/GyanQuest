/**
 * ICT / Mission 3: Files & Folders - name, save, find.
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
function drawFolder(ctx, x, y, label, open) {
  ctx.fillStyle = "#fbbf24";
  roundRect(ctx, x - 40, y - 10, 36, 14, 3);
  ctx.fill();
  ctx.fillStyle = open ? "#fde68a" : "#f59e0b";
  roundRect(ctx, x - 44, y - 2, 88, 56, 6);
  ctx.fill();
  ctx.strokeStyle = "#b45309";
  ctx.stroke();
  ctx.fillStyle = "#78350f";
  ctx.font = "700 11px Segoe UI";
  ctx.textAlign = "center";
  ctx.fillText(label, x, y + 30);
}
function drawFile(ctx, x, y, name, color) {
  ctx.fillStyle = color || "#e2e8f0";
  roundRect(ctx, x - 18, y - 24, 36, 48, 4);
  ctx.fill();
  ctx.strokeStyle = "#64748b";
  ctx.stroke();
  ctx.fillStyle = "#0f172a";
  ctx.font = "600 9px Segoe UI";
  ctx.textAlign = "center";
  ctx.fillText(name, x, y + 36);
}

export function registerFilesScenes(arena) {
  if (!arena?.registerScene) return;

  arena.registerScene("filesMeet", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, opts, setHitRegions } = api;
    labState.phase = opts.phase || labState.phase || "desk";
    setDescription("Files & Folders - name, save, find.");
    const props = {
      f1: { x: 0, y: 0 },
      f2: { x: 0, y: 0 },
      doc: { x: 0, y: 0 },
      pic: { x: 0, y: 0 },
    };
    let inited = false;
    setTick(() => {
      const w = api.width, h = api.height, layout = api.layout;
      const live = labState.phase || "desk";
      drawBackdrop();
      if (!inited) {
        props.f1.x = w * 0.28; props.f1.y = h * 0.4;
        props.f2.x = w * 0.55; props.f2.y = h * 0.4;
        props.doc.x = w * 0.75; props.doc.y = h * 0.5;
        props.pic.x = w * 0.88; props.pic.y = h * 0.5;
        inited = true;
      }
      ctx.fillStyle = "#1e3a5f";
      roundRect(ctx, w * 0.08, layout.deskTop - 8, w * 0.84, 18, 8);
      ctx.fill();
      drawFolder(ctx, props.f1.x, props.f1.y, "School", live !== "desk");
      drawFolder(ctx, props.f2.x, props.f2.y, "Photos", false);
      drawFile(ctx, props.doc.x, props.doc.y, "hw.txt", "#bfdbfe");
      drawFile(ctx, props.pic.x, props.pic.y, "pic.jpg", "#86efac");
      const tips = {
        desk: "Drag folders and files - keep things findable",
        glow: "Open School folder - homework belongs here",
        settle: "Good names + folders = easy find later",
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

  arena.registerScene("filesSort", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler, reducedMotion } = api;
    setDescription("Sort files into the right folders.");
    const chips = [
      { id: "hw", text: "math-hw.txt", short: "math-hw", color: 0x60a5fa },
      { id: "pic", text: "eid.jpg", short: "eid.jpg", color: 0x22c55e },
      { id: "song", text: "song.mp3", short: "song", color: 0xa78bfa },
      { id: "essay", text: "essay.docx", short: "essay", color: 0x38bdf8 },
      { id: "selfie", text: "selfie.png", short: "selfie", color: 0x4ade80 },
      { id: "junk", text: "asdfgh", short: "asdfgh", color: 0xf87171 },
      { id: "notes", text: "class-notes", short: "notes", color: 0x93c5fd },
      { id: "meme", text: "funny.gif", short: "funny", color: 0xfbbf24 },
    ];
    const accept = {
      school: ["hw", "essay", "notes"],
      media: ["pic", "song", "selfie", "meme"],
      rename: ["junk"],
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
        { id: "school", label: "School folder", x: w * 0.03, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#60a5fa" },
        { id: "media", label: "Photos/Music", x: w * 0.35, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#22c55e" },
        { id: "rename", label: "Needs better name", x: w * 0.67, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#f87171" },
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
      const byZone = { school: [], media: [], rename: [] };
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
      drawLabel(ctx, "School / Media / Rename me", w * 0.5, layout.labelY);
      setHitRegions(hits); failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => setIntentHandler(null));
  });

  arena.registerScene("filesLab", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
    setDescription("Save progress - fill the save bar.");
    setIntentHandler((intent) => {
      if (intent.type === "CANVAS_DRAG" && intent.meta?.action === "stretch") {
        labState.heat = Math.max(0, Math.min(1, (intent.x - api.width * 0.2) / (api.width * 0.6)));
      }
    });
    setTick(() => {
      const w = api.width, h = api.height, layout = api.layout;
      const heat = labState.heat ?? 0.25;
      drawBackdrop();
      drawFolder(ctx, w * 0.35, h * 0.4, "School", true);
      drawFile(ctx, w * 0.6, h * 0.42, "hw.txt", "#bfdbfe");
      ctx.fillStyle = "#1e293b";
      roundRect(ctx, w * 0.2, h * 0.62, w * 0.6, 16, 8);
      ctx.fill();
      ctx.fillStyle = "#38bdf8";
      roundRect(ctx, w * 0.2, h * 0.62, w * 0.6 * heat, 16, 8);
      ctx.fill();
      const hx = w * 0.2 + heat * w * 0.6;
      ctx.fillStyle = "#60a5fa";
      ctx.beginPath(); ctx.arc(hx, h * 0.74, 14, 0, Math.PI * 2); ctx.fill();
      drawLabel(ctx, heat >= 0.65 ? "Saved in School/hw.txt - findable!" : "Drag to save into the folder", w * 0.5, layout.labelY);
      setHitRegions([{ id: "h", shape: "rect", x: hx, y: h * 0.74, w: 48, h: 48, meta: { action: "stretch" } }]);
      failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => setIntentHandler(null));
  });

  arena.registerScene("filesRule", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
    setDescription("Name / folder / save / find.");
    setTick(() => {
      const w = api.width, h = api.height, layout = api.layout, prog = labState.tokenProgress || 0;
      drawBackdrop();
      ["Name", "Folder", "Save", "Find"].forEach((label, i) => {
        const x = w * 0.18 + i * (w * 0.18);
        ctx.fillStyle = i < prog ? "rgba(96,165,250,0.4)" : "rgba(15,23,42,0.9)";
        roundRect(ctx, x - 44, h * 0.36 - 18, 88, 36, 10); ctx.fill();
        ctx.fillStyle = "#dbeafe"; ctx.font = "700 12px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(label, x, h * 0.36);
      });
      drawFolder(ctx, w * 0.5, h * 0.58, "School", true);
      drawLabel(ctx, "Files & Folders rule", w * 0.5, layout.labelY);
      failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => {});
  });

  arena.registerScene("filesStretch", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
    const modes = ["usb", "cloud", "phone", "lab", "home"];
    setDescription("Same organize idea everywhere.");
    setIntentHandler((intent) => {
      if (intent.type === "CANVAS_TAP" && intent.meta?.mode) { labState.mode = intent.meta.mode; pulseSuccessFeedback(200); }
    });
    setTick(() => {
      const w = api.width, h = api.height, layout = api.layout, mode = labState.mode || "usb";
      drawBackdrop();
      const hits = [];
      modes.forEach((m, i) => {
        const x = w * 0.12 + i * (w * 0.17);
        ctx.fillStyle = m === mode ? "rgba(96,165,250,0.4)" : "#1e3a5f";
        roundRect(ctx, x - 36, layout.deskTop - 36, 72, 48, 10); ctx.fill();
        ctx.fillStyle = "#dbeafe"; ctx.font = "600 11px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(m, x, layout.deskTop - 10);
        hits.push({ id: m, shape: "rect", x, y: layout.deskTop - 12, w: 72, h: 48, meta: { mode: m } });
      });
      drawFolder(ctx, w * 0.5, h * 0.38, "MyFiles", true);
      const captions = {
        usb: "USB stick - still use clear folder names",
        cloud: "Cloud drive - folders travel with you",
        phone: "Phone gallery albums are folders too",
        lab: "School lab - save to your student folder",
        home: "Home PC - Desktop vs Documents folders",
      };
      drawLabel(ctx, captions[mode], w * 0.5, layout.labelY);
      setHitRegions(hits); failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => setIntentHandler(null));
  });

  arena.registerScene("filesMyth", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
    const myths = [
      { claim: "File names don't matter", truth: "Clear names help you find work later" },
      { claim: "Everything can sit on Desktop", truth: "Folders keep Desktop searchable" },
      { claim: "Closing without save keeps edits", truth: "Unsaved work can disappear" },
      { claim: "asdfgh is a fine homework name", truth: "Use names like math-hw-may.txt" },
      { claim: "Cloud means you never organize", truth: "Cloud still needs folders and names" },
    ];
    setDescription("Bust file myths.");
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

  arena.registerScene("filesDrill", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
    setDescription(labState.prompt || "Files drill");
    setTick(() => {
      const w = api.width, h = api.height;
      drawBackdrop();
      drawLabel(ctx, labState.prompt || "Files & Folders drill", w * 0.5, h * 0.2, { h: 32, font: "700 16px Segoe UI" });
      drawFolder(ctx, w * 0.5, h * 0.48, "Find me", true);
      failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => {});
  });

  arena.registerScene("filesMastery", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
    setDescription("File Finder mastery.");
    setTick(() => {
      const w = api.width, h = api.height, layout = api.layout, locked = labState.masteryStep || 0;
      drawBackdrop();
      ["Meet", "Sort", "Lab", "Rule", "Myth", "Finder"].forEach((label, i) => {
        const x = w * 0.1 + i * (w * 0.14);
        ctx.fillStyle = i < locked ? "#60a5fa" : "rgba(148,163,184,0.35)";
        roundRect(ctx, x - 28, h * 0.78 - 12, 56, 24, 8); ctx.fill();
        ctx.fillStyle = "#0f172a"; ctx.font = "600 10px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(label, x, h * 0.78);
      });
      drawFolder(ctx, w * 0.4, h * 0.4, "School", true);
      drawFile(ctx, w * 0.62, h * 0.42, "hw.txt", "#bfdbfe");
      drawLabel(ctx, "File Finder!", w * 0.5, layout.labelY);
      failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => {});
  });
}
