/**
 * Electrical Basics  -  Mission 3: Safe Power - dry hands, insulation, respect live wires.
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
  ctx.strokeStyle = opts.border || "rgba(34,197,94,0.55)";
  ctx.lineWidth = 1.4;
  ctx.stroke();
  ctx.fillStyle = opts.color || "#bbf7d0";
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
  ctx.fillStyle = `rgba(34,197,94,${Math.max(0, (until - performance.now()) / 380) * 0.22})`;
  ctx.fillRect(0, 0, w, h);
}

function drawHands(ctx, x, y, dry) {
  ctx.fillStyle = dry ? "#fde68a" : "#38bdf8";
  roundRect(ctx, x - 30, y - 20, 60, 40, 12);
  ctx.fill();
  ctx.strokeStyle = dry ? "#22c55e" : "#0ea5e9";
  ctx.lineWidth = 3;
  ctx.stroke();
  if (!dry) {
    ctx.fillStyle = "rgba(56,189,248,0.5)";
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.arc(x - 12 + i * 8, y - 28, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.fillStyle = "#e2e8f0";
  ctx.font = "700 11px Segoe UI";
  ctx.textAlign = "center";
  ctx.fillText(dry ? "Dry hands" : "Wet hands!", x, y + 40);
}
function drawOutlet(ctx, x, y, danger) {
  ctx.fillStyle = "#e2e8f0";
  roundRect(ctx, x - 28, y - 32, 56, 64, 6);
  ctx.fill();
  ctx.fillStyle = "#0f172a";
  roundRect(ctx, x - 14, y - 16, 10, 18, 2);
  ctx.fill();
  roundRect(ctx, x + 4, y - 16, 10, 18, 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x, y + 14, 6, 0, Math.PI * 2);
  ctx.fill();
  if (danger) {
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - 20, y - 40);
    ctx.lineTo(x, y - 55);
    ctx.lineTo(x + 20, y - 40);
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = "#ef4444";
    ctx.font = "700 14px Segoe UI";
    ctx.textAlign = "center";
    ctx.fillText("!", x, y - 44);
  }
  ctx.fillStyle = "#94a3b8";
  ctx.font = "700 11px Segoe UI";
  ctx.textAlign = "center";
  ctx.fillText("Outlet", x, y + 48);
}
function drawShield(ctx, x, y, ok) {
  ctx.fillStyle = ok ? "#14532d" : "#7f1d1d";
  ctx.beginPath();
  ctx.moveTo(x, y - 36);
  ctx.lineTo(x + 28, y - 22);
  ctx.lineTo(x + 28, y + 8);
  ctx.quadraticCurveTo(x, y + 36, x - 28, y + 8);
  ctx.lineTo(x - 28, y - 22);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = ok ? "#22c55e" : "#ef4444";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = ok ? "#86efac" : "#fca5a5";
  ctx.font = "700 16px Segoe UI";
  ctx.textAlign = "center";
  ctx.fillText(ok ? "OK" : "NO", x, y + 4);
}

export function registerSafeScenes(arena) {
  if (!arena?.registerScene) return;

  arena.registerScene("safeMeet", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, opts, setHitRegions } = api;
    labState.phase = opts.phase || labState.phase || "desk";
    setDescription("Safe Power - dry hands, insulation, respect live wires.");
    const props = { hands: { x: 0, y: 0 }, out: { x: 0, y: 0 }, sh: { x: 0, y: 0 } };
    let inited = false;
    setTick(() => {
      const w = api.width, h = api.height, layout = api.layout;
      const live = labState.phase || "desk";
      const safe = live === "glow" || live === "settle";
      drawBackdrop();
      if (!inited) {
        props.hands.x = w * 0.22; props.hands.y = h * 0.42;
        props.out.x = w * 0.5; props.out.y = h * 0.42;
        props.sh.x = w * 0.78; props.sh.y = h * 0.42;
        inited = true;
      }
      ctx.fillStyle = "#14532d";
      roundRect(ctx, w * 0.08, layout.deskTop - 8, w * 0.84, 18, 8);
      ctx.fill();
      drawHands(ctx, props.hands.x, props.hands.y, safe || live === "desk");
      drawOutlet(ctx, props.out.x, props.out.y, !safe && live === "glow");
      drawShield(ctx, props.sh.x, props.sh.y, safe);
      const tips = {
        desk: "Drag dry-hands, outlet, and safety shield",
        glow: "Wet hands + live socket = danger",
        settle: "Ask an adult - never poke outlets or frayed cords",
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

  arena.registerScene("safeSort", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler, reducedMotion } = api;
    setDescription("Sort safe habits vs unsafe actions.");
    const chips = [
      { id: "dry", short: "Dry hands", color: 0x22c55e },
      { id: "plug", short: "Plug body", color: 0x4ade80 },
      { id: "ins", short: "Insulation", color: 0x86efac },
      { id: "wet", short: "Wet hands", color: 0xef4444 },
      { id: "key", short: "Metal in", color: 0xf87171 },
      { id: "fray", short: "Frayed", color: 0xf97316 },
      { id: "pole", short: "Climb", color: 0xdc2626 },
      { id: "spark", short: "Sparks", color: 0xfbbf24 },
    ];
    const accept = {
      safe: ["dry", "plug", "ins"],
      unsafe: ["wet", "key", "fray", "pole"],
      adult: ["spark"],
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
        { id: "safe", label: "Safe habit", x: w * 0.02, y: zoneY, ww: w * 0.31, hh: zoneH, color: "#22c55e" },
        { id: "unsafe", label: "Unsafe", x: w * 0.35, y: zoneY, ww: w * 0.31, hh: zoneH, color: "#ef4444" },
        { id: "adult", label: "Tell an adult", x: w * 0.68, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#fbbf24" },
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
      const byZone = { safe: [], unsafe: [], adult: [] };
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
        ctx.fillStyle = labState.selectedId === c.id ? "rgba(34,197,94,0.4)" : "rgba(15,23,42,0.95)";
        roundRect(ctx, prev.x - 48, prev.y - 16, 96, 32, 8); ctx.fill();
        ctx.strokeStyle = "#" + c.color.toString(16).padStart(6, "0"); ctx.stroke();
        ctx.fillStyle = "#bbf7d0"; ctx.font = "700 11px Segoe UI"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(c.short, prev.x, prev.y);
        hits.push({ id: c.id, shape: "rect", x: prev.x, y: prev.y, w: 100, h: 36, meta: { chipId: c.id },
          onDrag(pt) { draggingId = c.id; prev.x = Math.max(30, Math.min(w - 30, pt.x)); prev.y = Math.max(30, Math.min(h - 30, pt.y)); } });
      });
      drawLabel(ctx, "Safe / Unsafe / Tell an adult", w * 0.5, layout.labelY);
      setHitRegions(hits); failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => setIntentHandler(null));
  });

  arena.registerScene("safeLab", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
    setDescription("Raise safety habits - dry hands and care.");
    setIntentHandler((intent) => {
      if (intent.type === "CANVAS_DRAG" && intent.meta?.action === "stretch") {
        labState.heat = Math.max(0, Math.min(1, (intent.x - api.width * 0.2) / (api.width * 0.6)));
      }
    });
    setTick(() => {
      const w = api.width, h = api.height, layout = api.layout;
      const heat = labState.heat ?? 0.3;
      const ok = heat >= 0.55;
      drawBackdrop();
      drawHands(ctx, w * 0.25, h * 0.4, ok);
      drawOutlet(ctx, w * 0.5, h * 0.4, !ok);
      drawShield(ctx, w * 0.75, h * 0.4, ok);
      const hx = w * 0.2 + heat * w * 0.6;
      ctx.fillStyle = "#22c55e";
      ctx.beginPath(); ctx.arc(hx, h * 0.72, 14, 0, Math.PI * 2); ctx.fill();
      drawLabel(ctx, heat >= 0.65 ? "Safer habits locked in" : "Drag to raise safety habits", w * 0.5, layout.labelY);
      setHitRegions([{ id: "h", shape: "rect", x: hx, y: h * 0.72, w: 48, h: 48, meta: { action: "stretch" } }]);
      failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => setIntentHandler(null));
  });

  arena.registerScene("safeRule", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
    setDescription("Dry / insulate / respect live wires.");
    setTick(() => {
      const w = api.width, h = api.height, layout = api.layout, prog = labState.tokenProgress || 0;
      drawBackdrop();
      ["Dry", "insulate", "respect", "live wires"].forEach((label, i) => {
        const x = w * 0.14 + i * (w * 0.2);
        ctx.fillStyle = i < prog ? "rgba(34,197,94,0.4)" : "rgba(15,23,42,0.9)";
        roundRect(ctx, x - 48, h * 0.36 - 18, 96, 36, 10); ctx.fill();
        ctx.fillStyle = "#bbf7d0"; ctx.font = "700 11px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(label, x, h * 0.36);
      });
      drawShield(ctx, w * 0.5, h * 0.58, prog >= 4);
      drawLabel(ctx, "Safe Power rule", w * 0.5, layout.labelY);
      failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => {});
  });

  arena.registerScene("safeStretch", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
    const modes = ["home", "school", "street", "shop", "lab"];
    setDescription("Same safety idea in every place.");
    setIntentHandler((intent) => {
      if (intent.type === "CANVAS_TAP" && intent.meta?.mode) { labState.mode = intent.meta.mode; pulseSuccessFeedback(200); }
    });
    setTick(() => {
      const w = api.width, h = api.height, layout = api.layout, mode = labState.mode || "home";
      drawBackdrop();
      const hits = [];
      modes.forEach((m, i) => {
        const x = w * 0.12 + i * (w * 0.17);
        ctx.fillStyle = m === mode ? "rgba(34,197,94,0.4)" : "#14532d";
        roundRect(ctx, x - 36, layout.deskTop - 36, 72, 48, 10); ctx.fill();
        ctx.fillStyle = "#bbf7d0"; ctx.font = "600 11px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(m, x, layout.deskTop - 10);
        hits.push({ id: m, shape: "rect", x, y: layout.deskTop - 12, w: 72, h: 48, meta: { mode: m } });
      });
      drawShield(ctx, w * 0.5, h * 0.4, true);
      const captions = {
        home: "Home: dry hands, good plugs, no poking sockets",
        school: "School lab: follow teacher safety rules",
        street: "Street: stay away from broken / hanging wires",
        shop: "Shop: report sparks or burning smells",
        lab: "Lab kits: insulated leads, supervised builds",
      };
      drawLabel(ctx, captions[mode], w * 0.5, layout.labelY);
      setHitRegions(hits); failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => setIntentHandler(null));
  });

  arena.registerScene("safeMyth", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
    const myths = [
      { claim: "Wet hands are fine on switches", truth: "Water helps shock - dry your hands" },
      { claim: "Putting toys or metal in sockets is a fun game", truth: "Never put objects in sockets" },
      { claim: "Frayed cords are still perfectly safe", truth: "Frayed cords can shock or start fires - stop using them" },
      { claim: "Birds prove wires are always safe to touch", truth: "Birds sit without a path to ground; you can complete a path" },
      { claim: "Kids should fix wall wiring alone", truth: "Leave wiring to trained adults" },
    ];
    setDescription("Bust electricity safety myths.");
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
      ctx.fillStyle = phase === "truth" ? "rgba(34,197,94,0.2)" : "rgba(248,113,113,0.18)";
      roundRect(ctx, w * 0.12, h * 0.28, w * 0.76, h * 0.28, 16); ctx.fill();
      drawLabel(ctx, phase === "truth" ? m.truth : "Myth: " + m.claim, w * 0.5, h * 0.42, { h: 42, font: "700 13px Segoe UI" });
      drawLabel(ctx, "Myth " + (idx + 1) + " / 5  -  Tap to flip", w * 0.5, layout.labelY);
      setHitRegions([{ id: "card", shape: "rect", x: w * 0.5, y: h * 0.42, w: w * 0.76, h: h * 0.28, meta: { action: "flip" } }]);
      failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => setIntentHandler(null));
  });

  arena.registerScene("safeDrill", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
    setDescription(labState.prompt || "Safety drill");
    setTick(() => {
      const w = api.width, h = api.height;
      drawBackdrop();
      drawLabel(ctx, labState.prompt || "Safe Power drill", w * 0.5, h * 0.2, { h: 32, font: "700 16px Segoe UI" });
      drawShield(ctx, w * 0.5, h * 0.48, true);
      failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => {});
  });

  arena.registerScene("safeMastery", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
    setDescription("Safety Star mastery.");
    setTick(() => {
      const w = api.width, h = api.height, layout = api.layout, locked = labState.masteryStep || 0;
      drawBackdrop();
      ["Meet", "Sort", "Lab", "Rule", "Myth", "Star"].forEach((label, i) => {
        const x = w * 0.1 + i * (w * 0.14);
        ctx.fillStyle = i < locked ? "#22c55e" : "rgba(148,163,184,0.35)";
        roundRect(ctx, x - 28, h * 0.78 - 12, 56, 24, 8); ctx.fill();
        ctx.fillStyle = "#0f172a"; ctx.font = "600 10px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(label, x, h * 0.78);
      });
      drawHands(ctx, w * 0.28, h * 0.4, true);
      drawOutlet(ctx, w * 0.5, h * 0.4, false);
      drawShield(ctx, w * 0.72, h * 0.4, true);
      drawLabel(ctx, "Safety Star!", w * 0.5, layout.labelY);
      failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => {});
  });
}
