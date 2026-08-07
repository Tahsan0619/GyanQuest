/**
 * Bio Explorer · Mission 3: Plant Power - Canvas 2D scenes.
 */
import { bioLabState, pulseFailFeedback, pulseSuccessFeedback } from "./bio-state.js";
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
  const tw = ctx.measureText(text).width;
  const bw = Math.min(tw + 24, opts.maxW || 520);
  const bh = opts.h || 26;
  ctx.fillStyle = opts.bg || "rgba(20,83,45,0.9)";
  roundRect(ctx, x - bw / 2, y - bh / 2, bw, bh, 10);
  ctx.fill();
  ctx.strokeStyle = opts.border || "rgba(134,239,172,0.5)";
  ctx.lineWidth = 1.4;
  ctx.stroke();
  ctx.fillStyle = opts.color || "#dcfce7";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, y + 1);
}

function drawPlant(ctx, x, y, scale, stage) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = "#854d0e";
  ctx.fillRect(-4, 0, 8, 50);
  if (stage >= 1) {
    ctx.fillStyle = "#22c55e";
    ctx.beginPath();
    ctx.ellipse(-18, 10, 16, 8, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(18, 5, 16, 8, 0.5, 0, Math.PI * 2);
    ctx.fill();
  }
  if (stage >= 2) {
    ctx.fillStyle = "#fbbf24";
    ctx.beginPath();
    ctx.arc(0, -18, 14, 0, Math.PI * 2);
    ctx.fill();
  }
  if (stage >= 3) {
    ctx.fillStyle = "#f97316";
    ctx.beginPath();
    ctx.arc(-8, -28, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(8, -26, 6, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function failFlash(ctx, w, h) {
  const until = bioLabState.failPulse;
  if (!until || performance.now() > until) return;
  ctx.fillStyle = `rgba(248,113,113,${Math.max(0, (until - performance.now()) / 420) * 0.28})`;
  ctx.fillRect(0, 0, w, h);
}
function successFlash(ctx, w, h) {
  const until = bioLabState.successPulse;
  if (!until || performance.now() > until) return;
  ctx.fillStyle = `rgba(74,222,128,${Math.max(0, (until - performance.now()) / 380) * 0.25})`;
  ctx.fillRect(0, 0, w, h);
}

export function registerPlantScenes(arena) {
  if (!arena?.registerScene) return;

  arena.registerScene("plantMeet", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, opts } = api;
    const startPhase = opts.phase || bioLabState.phase || "seed";
    bioLabState.phase = startPhase;
    setDescription("Plant Power - plants make food with light.");
    setTick(() => {
      const w = api.width;
      const h = api.height;
      const layout = api.layout;
      const live = bioLabState.phase || startPhase;
      drawBackdrop();
      const stage = live === "fruit" ? 3 : live === "flower" ? 2 : live === "leaf" || live === "grow" ? 1 : 0;
      if (live === "seed" || live === "desk") {
        ctx.fillStyle = "#a16207";
        ctx.beginPath();
        ctx.ellipse(w * 0.5, h * 0.45, 18, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        drawLabel(ctx, "A seed is a living plant waiting to grow", w * 0.5, layout.labelY);
      } else {
        drawPlant(ctx, w * 0.5, h * 0.42, 1.6, stage);
        const sun = bioLabState.heat || 0.5;
        ctx.fillStyle = `rgba(251,191,36,${0.3 + sun * 0.5})`;
        ctx.beginPath();
        ctx.arc(w * 0.78, h * 0.2, 28, 0, Math.PI * 2);
        ctx.fill();
        drawLabel(ctx, "Sun + water + air → plant food (then fruit)", w * 0.5, layout.labelY);
      }
      failFlash(ctx, w, h);
      successFlash(ctx, w, h);
    });
    setDispose(() => {});
  });

  arena.registerScene("plantSort", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler, reducedMotion } =
      api;
    setDescription("Sort plant needs vs extras.");
    const chips = [
      { id: "sun", text: "Sunlight", short: "Sun", color: 0xfbbf24 },
      { id: "water", text: "Water", short: "Water", color: 0x38bdf8 },
      { id: "air", text: "Air (CO₂)", short: "Air", color: 0xa5b4fc },
      { id: "soil", text: "Soil minerals", short: "Soil", color: 0xa16207 },
      { id: "candy", text: "Candy", short: "Candy", color: 0xf472b6 },
      { id: "phone", text: "Phone charger", short: "Charger", color: 0x94a3b8 },
      { id: "bee", text: "Bees (some plants)", short: "Bees", color: 0xf59e0b },
      { id: "toys", text: "Toys", short: "Toys", color: 0x78716c },
    ];
    const accept = {
      need: ["sun", "water", "air"],
      help: ["soil", "bee"],
      no: ["candy", "phone", "toys"],
    };
    const cardPos = {};
    chips.forEach((c) => {
      cardPos[c.id] = { x: 0, y: 0 };
    });
    let draggingId = null;
    let lastZones = [];

    function placeChip(chipId, zoneId) {
      if (!chipId || !zoneId) return false;
      if (!(accept[zoneId] || []).includes(chipId)) {
        pulseFailFeedback(400);
        return false;
      }
      bioLabState.placed = { ...(bioLabState.placed || {}), [chipId]: zoneId };
      bioLabState.selectedId = chipId;
      const session = getActiveSession();
      if (session?.dispatch) session.dispatch({ type: "PLACE_CHIP", chipId, zoneId, accept: accept[zoneId] });
      else bioLabState._placedVersion = (bioLabState._placedVersion || 0) + 1;
      pulseSuccessFeedback(220);
      return true;
    }
    function zoneAt(x, y) {
      for (const z of lastZones) {
        if (x >= z.x && x <= z.x + z.ww && y >= z.y && y <= z.y + z.hh) return z.id;
      }
      return null;
    }

    setIntentHandler((intent) => {
      if (intent.type === "CANVAS_DOWN" && intent.meta?.chipId) {
        draggingId = intent.meta.chipId;
        bioLabState.selectedId = intent.meta.chipId;
      }
      if (intent.type === "CANVAS_DRAG" && intent.meta?.chipId && cardPos[intent.meta.chipId]) {
        draggingId = intent.meta.chipId;
        cardPos[intent.meta.chipId].x = intent.x;
        cardPos[intent.meta.chipId].y = intent.y;
      }
      if (intent.type === "CANVAS_TAP" && intent.meta?.chipId) bioLabState.selectedId = intent.meta.chipId;
      if (intent.type === "CANVAS_TAP" && intent.meta?.zoneId && bioLabState.selectedId) {
        placeChip(bioLabState.selectedId, intent.meta.zoneId);
      }
      if (intent.type === "CANVAS_UP" && intent.meta?.chipId) {
        const zoneId = intent.dropMeta?.zoneId || zoneAt(intent.x, intent.y);
        if (zoneId) placeChip(intent.meta.chipId, zoneId);
        draggingId = null;
      } else if (intent.type === "CANVAS_UP") draggingId = null;
    });

    setTick(() => {
      const w = api.width;
      const h = api.height;
      const layout = api.layout;
      drawBackdrop();
      const zoneH = Math.max(100, Math.min(h * 0.28, 130));
      const zoneY = Math.max(layout.labelY + 28, h * 0.09);
      const zones = [
        { id: "need", label: "Must have", x: w * 0.03, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#22c55e" },
        { id: "help", label: "Helps", x: w * 0.35, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#fbbf24" },
        { id: "no", label: "Not plant food", x: w * 0.67, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#94a3b8" },
      ];
      lastZones = zones;
      const hits = [];
      for (const z of zones) {
        ctx.fillStyle = "rgba(5,46,22,0.7)";
        roundRect(ctx, z.x, z.y, z.ww, z.hh, 12);
        ctx.fill();
        ctx.strokeStyle = z.color;
        ctx.lineWidth = 2.5;
        ctx.stroke();
        drawLabel(ctx, z.label, z.x + z.ww / 2, z.y + 16, { h: 20, font: "700 12px Segoe UI" });
        hits.push({
          id: "zone-" + z.id,
          shape: "rect",
          x: z.x + z.ww / 2,
          y: z.y + z.hh / 2,
          w: z.ww,
          h: z.hh,
          meta: { zoneId: z.id, accept: accept[z.id] },
        });
      }
      const placed = bioLabState.placed || {};
      const byZone = {
        need: chips.filter((c) => placed[c.id] === "need").map((c) => c.id),
        help: chips.filter((c) => placed[c.id] === "help").map((c) => c.id),
        no: chips.filter((c) => placed[c.id] === "no").map((c) => c.id),
      };
      const bankIds = chips.filter((c) => typeof placed[c.id] !== "string").map((c) => c.id);
      const ease = reducedMotion ? 1 : 0.18;
      chips.forEach((c) => {
        let targetX;
        let targetY;
        const zoneKey = typeof placed[c.id] === "string" ? placed[c.id] : null;
        if (zoneKey && byZone[zoneKey]) {
          const z = zones.find((zz) => zz.id === zoneKey);
          const idx = byZone[zoneKey].indexOf(c.id);
          const slot = sortSlotPositions({ x: z.x, y: z.y + 18, w: z.ww, h: z.hh - 22 }, Math.max(byZone[zoneKey].length, 1), idx);
          targetX = slot.x;
          targetY = slot.y;
        } else {
          const idx = bankIds.indexOf(c.id);
          targetX = w * 0.14 + (idx % 4) * (w * 0.22);
          targetY = zoneY + zoneH + 36 + Math.floor(idx / 4) * 48;
        }
        const prev = cardPos[c.id];
        if (!prev.x && !prev.y) {
          prev.x = targetX;
          prev.y = targetY;
        }
        if (draggingId !== c.id) {
          prev.x += (targetX - prev.x) * ease;
          prev.y += (targetY - prev.y) * ease;
        }
        ctx.fillStyle = bioLabState.selectedId === c.id ? "rgba(74,222,128,0.4)" : "rgba(20,83,45,0.95)";
        roundRect(ctx, prev.x - 48, prev.y - 16, 96, 32, 8);
        ctx.fill();
        ctx.strokeStyle = "#" + c.color.toString(16).padStart(6, "0");
        ctx.stroke();
        ctx.fillStyle = "#dcfce7";
        ctx.font = "700 12px Segoe UI";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(c.short, prev.x, prev.y);
        hits.push({
          id: c.id,
          shape: "rect",
          x: prev.x,
          y: prev.y,
          w: 100,
          h: 36,
          meta: { chipId: c.id },
          onDrag(pt) {
            draggingId = c.id;
            prev.x = Math.max(30, Math.min(w - 30, pt.x));
            prev.y = Math.max(30, Math.min(h - 30, pt.y));
          },
        });
      });
      drawLabel(ctx, "Plants don’t eat candy - they make food", w * 0.5, layout.labelY);
      setHitRegions(hits);
      failFlash(ctx, w, h);
      successFlash(ctx, w, h);
    });
    setDispose(() => setIntentHandler(null));
  });

  arena.registerScene("plantLab", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
    setDescription("Drag sun power - watch the plant grow.");
    setIntentHandler((intent) => {
      if (intent.type === "CANVAS_DRAG" && intent.meta?.action === "stretch") {
        const next = Math.max(0, Math.min(1, (intent.x - api.width * 0.2) / (api.width * 0.6)));
        bioLabState.heat = next;
      }
    });
    setTick(() => {
      const w = api.width;
      const h = api.height;
      const layout = api.layout;
      const sun = bioLabState.heat ?? 0.35;
      drawBackdrop();
      const stage = sun > 0.75 ? 3 : sun > 0.5 ? 2 : sun > 0.25 ? 1 : 0;
      drawPlant(ctx, w * 0.5, h * 0.4, 1.5, stage);
      ctx.fillStyle = `rgba(251,191,36,${0.25 + sun * 0.6})`;
      ctx.beginPath();
      ctx.arc(w * 0.78, h * 0.18, 22 + sun * 12, 0, Math.PI * 2);
      ctx.fill();
      const hx = w * 0.2 + sun * w * 0.6;
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.arc(hx, h * 0.68, 14, 0, Math.PI * 2);
      ctx.fill();
      drawLabel(ctx, sun > 0.7 ? "More light → more plant food" : "Drag sun energy for the plant", w * 0.5, layout.labelY);
      setHitRegions([{ id: "h", shape: "rect", x: hx, y: h * 0.68, w: 48, h: 48, meta: { action: "stretch" } }]);
      failFlash(ctx, w, h);
      successFlash(ctx, w, h);
    });
    setDispose(() => setIntentHandler(null));
  });

  arena.registerScene("plantRule", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
    setDescription("Plants make food using light.");
    setTick(() => {
      const w = api.width;
      const h = api.height;
      const layout = api.layout;
      const prog = bioLabState.tokenProgress || 0;
      drawBackdrop();
      const tokens = ["Light", "+", "water", "+", "air", "→ food"];
      tokens.forEach((label, i) => {
        const x = w * 0.12 + i * (w * 0.14);
        const on = i < prog;
        ctx.fillStyle = on ? "rgba(74,222,128,0.4)" : "rgba(20,83,45,0.9)";
        roundRect(ctx, x - 40, h * 0.36 - 18, 80, 36, 10);
        ctx.fill();
        ctx.fillStyle = on ? "#dcfce7" : "#86efac";
        ctx.font = "700 12px Segoe UI";
        ctx.textAlign = "center";
        ctx.fillText(label, x, h * 0.36);
      });
      drawPlant(ctx, w * 0.5, h * 0.58, 1.2, 2);
      drawLabel(ctx, "Plant Power rule", w * 0.5, layout.labelY);
      failFlash(ctx, w, h);
      successFlash(ctx, w, h);
    });
    setDispose(() => {});
  });

  arena.registerScene("plantStretch", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
    const modes = ["mango", "rice", "rose", "bamboo", "algae"];
    setDescription("Same plant idea in Bangladesh stories.");
    setIntentHandler((intent) => {
      if (intent.type === "CANVAS_TAP" && intent.meta?.mode) {
        bioLabState.mode = intent.meta.mode;
        pulseSuccessFeedback(200);
      }
    });
    setTick(() => {
      const w = api.width;
      const h = api.height;
      const layout = api.layout;
      const mode = bioLabState.mode || "mango";
      drawBackdrop();
      const hits = [];
      modes.forEach((m, i) => {
        const x = w * 0.12 + i * (w * 0.17);
        ctx.fillStyle = m === mode ? "rgba(74,222,128,0.4)" : "#14532d";
        roundRect(ctx, x - 36, layout.deskTop - 36, 72, 48, 10);
        ctx.fill();
        ctx.fillStyle = "#dcfce7";
        ctx.font = "600 11px Segoe UI";
        ctx.textAlign = "center";
        ctx.fillText(m, x, layout.deskTop - 10);
        hits.push({ id: m, shape: "rect", x, y: layout.deskTop - 12, w: 72, h: 48, meta: { mode: m } });
      });
      drawPlant(ctx, w * 0.5, h * 0.36, 1.3, mode === "algae" ? 1 : 3);
      const captions = {
        mango: "Mango tree - leaves catch light for sweet fruit",
        rice: "Rice paddy - plants feed a nation",
        rose: "Rose - flowers need light too",
        bamboo: "Bamboo - fast-growing plant power",
        algae: "Pond algae - tiny plants making food",
      };
      drawLabel(ctx, captions[mode], w * 0.5, layout.labelY);
      setHitRegions(hits);
      failFlash(ctx, w, h);
      successFlash(ctx, w, h);
    });
    setDispose(() => setIntentHandler(null));
  });

  arena.registerScene("plantMyth", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
    const myths = [
      { claim: "Plants eat soil for food", truth: "Soil helps with minerals - food is made with light" },
      { claim: "Plants don’t need air", truth: "Plants use air (CO₂) when they make food" },
      { claim: "Seeds are dead until they sprout", truth: "Seeds can be dormant living plants" },
      { claim: "Only green leaves matter", truth: "Roots, stems, and flowers are plant parts too" },
      { claim: "Bees make the plant’s food", truth: "Bees help pollinate - leaves still make food" },
    ];
    setDescription("Bust plant myths.");
    setIntentHandler((intent) => {
      if (intent.type === "CANVAS_TAP" && intent.meta?.action === "flip") {
        bioLabState.mythPhase = bioLabState.mythPhase === "truth" ? "claim" : "truth";
        if (bioLabState.mythPhase === "truth") pulseSuccessFeedback(220);
      }
    });
    setTick(() => {
      const w = api.width;
      const h = api.height;
      const layout = api.layout;
      const idx = bioLabState.myth ?? 0;
      const phase = bioLabState.mythPhase || "claim";
      const m = myths[idx] || myths[0];
      drawBackdrop();
      ctx.fillStyle = phase === "truth" ? "rgba(74,222,128,0.2)" : "rgba(248,113,113,0.18)";
      roundRect(ctx, w * 0.12, h * 0.28, w * 0.76, h * 0.28, 16);
      ctx.fill();
      drawLabel(ctx, phase === "truth" ? m.truth : `Myth: ${m.claim}`, w * 0.5, h * 0.42, { h: 42, font: "700 13px Segoe UI" });
      drawLabel(ctx, `Myth ${idx + 1} / 5 · Tap to flip`, w * 0.5, layout.labelY);
      setHitRegions([{ id: "card", shape: "rect", x: w * 0.5, y: h * 0.42, w: w * 0.76, h: h * 0.28, meta: { action: "flip" } }]);
      failFlash(ctx, w, h);
      successFlash(ctx, w, h);
    });
    setDispose(() => setIntentHandler(null));
  });

  arena.registerScene("plantDrill", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
    setDescription(bioLabState.prompt || "Plant drill");
    setTick(() => {
      const w = api.width;
      const h = api.height;
      drawBackdrop();
      drawLabel(ctx, bioLabState.prompt || "Plant Power drill", w * 0.5, h * 0.2, { h: 32, font: "700 16px Segoe UI" });
      drawPlant(ctx, w * 0.5, h * 0.5, 1.4, 2);
      failFlash(ctx, w, h);
      successFlash(ctx, w, h);
    });
    setDispose(() => {});
  });

  arena.registerScene("plantMastery", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
    setDescription("Plant Explorer mastery.");
    setTick(() => {
      const w = api.width;
      const h = api.height;
      const layout = api.layout;
      const locked = bioLabState.masteryStep || 0;
      drawBackdrop();
      ["Meet", "Sort", "Lab", "Rule", "Myth", "Explorer"].forEach((label, i) => {
        const x = w * 0.1 + i * (w * 0.14);
        ctx.fillStyle = i < locked ? "#22c55e" : "rgba(148,163,184,0.35)";
        roundRect(ctx, x - 28, h * 0.78 - 12, 56, 24, 8);
        ctx.fill();
        ctx.fillStyle = "#052e16";
        ctx.font = "600 10px Segoe UI";
        ctx.textAlign = "center";
        ctx.fillText(label, x, h * 0.78);
      });
      drawPlant(ctx, w * 0.5, h * 0.4, 1.5, 3);
      drawLabel(ctx, "Plant Explorer!", w * 0.5, layout.labelY);
      failFlash(ctx, w, h);
      successFlash(ctx, w, h);
    });
    setDispose(() => {});
  });
}
