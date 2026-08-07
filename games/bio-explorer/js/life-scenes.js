/**
 * Bio Explorer · Mission 1: Living or Not - Canvas 2D scenes.
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
  const bw = tw + 24;
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

function drawCat(ctx, x, y) {
  ctx.fillStyle = "#f59e0b";
  ctx.beginPath();
  ctx.ellipse(x, y, 22, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 18, y - 10, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fbbf24";
  ctx.beginPath();
  ctx.moveTo(x + 12, y - 18);
  ctx.lineTo(x + 16, y - 28);
  ctx.lineTo(x + 20, y - 16);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x + 22, y - 16);
  ctx.lineTo(x + 28, y - 26);
  ctx.lineTo(x + 30, y - 12);
  ctx.fill();
}

function drawRock(ctx, x, y) {
  ctx.fillStyle = "#78716c";
  ctx.beginPath();
  ctx.ellipse(x, y, 24, 18, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#57534e";
  ctx.beginPath();
  ctx.ellipse(x - 8, y - 4, 8, 6, 0.2, 0, Math.PI * 2);
  ctx.fill();
}

function drawPhone(ctx, x, y) {
  ctx.fillStyle = "#1e293b";
  roundRect(ctx, x - 12, y - 22, 24, 44, 4);
  ctx.fill();
  ctx.fillStyle = "#38bdf8";
  roundRect(ctx, x - 9, y - 18, 18, 32, 2);
  ctx.fill();
}

function drawSeed(ctx, x, y, sprout) {
  ctx.fillStyle = "#92400e";
  ctx.beginPath();
  ctx.ellipse(x, y, 10, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  if (sprout > 0.2) {
    ctx.strokeStyle = "#22c55e";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, y - 6);
    ctx.lineTo(x, y - 6 - sprout * 40);
    ctx.stroke();
    if (sprout > 0.5) {
      ctx.fillStyle = "#4ade80";
      ctx.beginPath();
      ctx.ellipse(x + 10, y - 6 - sprout * 36, 10, 5, -0.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }
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

function makeSortScene(arena, name, chips, accept, zonesMeta, title) {
  arena.registerScene(name, (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler, reducedMotion } =
      api;
    setDescription(title);
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
      const zones = zonesMeta.map((z, i) => ({
        ...z,
        x: w * (0.03 + i * 0.32),
        y: zoneY,
        ww: w * 0.3,
        hh: zoneH,
      }));
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
      const byZone = {};
      zones.forEach((z) => {
        byZone[z.id] = chips.filter((c) => placed[c.id] === z.id).map((c) => c.id);
      });
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
        const selected = bioLabState.selectedId === c.id;
        ctx.fillStyle = selected ? "rgba(74,222,128,0.4)" : "rgba(20,83,45,0.95)";
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
      drawLabel(ctx, title, w * 0.5, layout.labelY);
      setHitRegions(hits);
      failFlash(ctx, w, h);
      successFlash(ctx, w, h);
    });
    setDispose(() => setIntentHandler(null));
  });
}

export function registerLifeScenes(arena) {
  if (!arena?.registerScene) return;

  arena.registerScene("lifeMeet", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, opts, setHitRegions, setIntentHandler } = api;
    const startPhase = opts.phase || bioLabState.phase || "desk";
    bioLabState.phase = startPhase;
    const props = {
      cat: { x: 0, y: 0, ready: false },
      rock: { x: 0, y: 0, ready: false },
      phone: { x: 0, y: 0, ready: false },
      seed: { x: 0, y: 0, ready: false },
    };
    setDescription("Drag living and not-living clues on the desk.");

    setTick(() => {
      const w = api.width;
      const h = api.height;
      const layout = api.layout;
      const live = bioLabState.phase || startPhase;
      if (!props.cat.ready) {
        props.cat = { x: layout.leftProp.x, y: layout.deskTop - 8, ready: true };
        props.rock = { x: layout.midProp.x - 40, y: layout.deskTop - 4, ready: true };
        props.phone = { x: layout.midProp.x + 50, y: layout.deskTop - 8, ready: true };
        props.seed = { x: layout.rightProp.x, y: layout.deskTop, ready: true };
      }
      drawBackdrop();
      const hits = [];
      drawCat(ctx, props.cat.x, props.cat.y);
      drawRock(ctx, props.rock.x, props.rock.y);
      drawPhone(ctx, props.phone.x, props.phone.y);
      drawSeed(ctx, props.seed.x, props.seed.y, live === "sprout" ? bioLabState.sprout || 0.6 : 0);
      const tips = {
        desk: "Living or Not · Drag cat, rock, phone, seed",
        watch: "Cat needs care & moves · rock just sits",
        sprout: "Seed can grow - still living even when quiet",
        settle: "Living things grow, need energy, respond, make more life",
      };
      drawLabel(ctx, tips[live] || tips.desk, w * 0.5, layout.labelY);
      for (const [id, p] of Object.entries(props)) {
        hits.push({
          id,
          shape: "rect",
          x: p.x,
          y: p.y,
          w: 56,
          h: 60,
          meta: { propId: id },
          onDrag(pt) {
            p.x = Math.max(40, Math.min(w - 40, pt.x));
            p.y = Math.max(50, Math.min(layout.deskTop + 6, pt.y));
          },
        });
      }
      setHitRegions(hits);
      failFlash(ctx, w, h);
      successFlash(ctx, w, h);
    });
    setDispose(() => setIntentHandler(null));
  });

  makeSortScene(
    arena,
    "lifeSort",
    [
      { id: "cat", text: "Cat", short: "Cat", color: 0xf59e0b },
      { id: "rock", text: "Rock", short: "Rock", color: 0x78716c },
      { id: "seed", text: "Seed", short: "Seed", color: 0x92400e },
      { id: "phone", text: "Phone", short: "Phone", color: 0x38bdf8 },
      { id: "tree", text: "Mango tree", short: "Tree", color: 0x22c55e },
      { id: "car", text: "Car", short: "Car", color: 0x94a3b8 },
      { id: "fire", text: "Campfire", short: "Fire", color: 0xf97316 },
      { id: "fish", text: "Fish", short: "Fish", color: 0x0ea5e9 },
    ],
    {
      living: ["cat", "seed", "tree", "fish"],
      notliving: ["rock", "phone", "car"],
      tricky: ["fire"],
    },
    [
      { id: "living", label: "Living", color: "#22c55e" },
      { id: "notliving", label: "Not living", color: "#94a3b8" },
      { id: "tricky", label: "Tricky / myth", color: "#f97316" },
    ],
    "Sort living · not living · tricky",
  );

  arena.registerScene("lifeSprout", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
    setDescription("Slide water - watch the seed sprout (living process).");
    setIntentHandler((intent) => {
      if (intent.type === "CANVAS_DRAG" && intent.meta?.action === "stretch") {
        const next = Math.max(0, Math.min(1, (intent.x - api.width * 0.2) / (api.width * 0.6)));
        bioLabState.heat = next;
        bioLabState.sprout = next;
      }
    });
    setTick(() => {
      const w = api.width;
      const h = api.height;
      const layout = api.layout;
      const s = bioLabState.heat ?? bioLabState.sprout ?? 0;
      bioLabState.sprout = s;
      drawBackdrop();
      ctx.fillStyle = "#713f12";
      roundRect(ctx, w * 0.35, h * 0.48, w * 0.3, 40, 8);
      ctx.fill();
      drawSeed(ctx, w * 0.5, h * 0.45, s);
      const hx = w * 0.2 + s * w * 0.6;
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.arc(hx, h * 0.68, 14, 0, Math.PI * 2);
      ctx.fill();
      drawLabel(ctx, s > 0.7 ? "Sprouting! Growth = living process" : "Add water - help the seed grow", w * 0.5, layout.labelY);
      setHitRegions([{ id: "h", shape: "rect", x: hx, y: h * 0.68, w: 48, h: 48, meta: { action: "stretch" } }]);
      failFlash(ctx, w, h);
      successFlash(ctx, w, h);
    });
    setDispose(() => setIntentHandler(null));
  });

  arena.registerScene("lifeRule", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
    setDescription("Build the living rule.");
    setTick(() => {
      const w = api.width;
      const h = api.height;
      const layout = api.layout;
      const prog = bioLabState.tokenProgress || 0;
      drawBackdrop();
      const tokens = ["Grow", "need energy", "respond", "make life"];
      tokens.forEach((label, i) => {
        const x = w * 0.18 + i * (w * 0.18);
        const on = i < prog;
        ctx.fillStyle = on ? "rgba(74,222,128,0.4)" : "rgba(20,83,45,0.9)";
        roundRect(ctx, x - 50, h * 0.36 - 18, 100, 36, 10);
        ctx.fill();
        ctx.fillStyle = on ? "#dcfce7" : "#86efac";
        ctx.font = "700 12px Segoe UI";
        ctx.textAlign = "center";
        ctx.fillText(label, x, h * 0.36);
      });
      drawLabel(ctx, "Living things grow, need energy, respond, make more life", w * 0.5, layout.labelY);
      failFlash(ctx, w, h);
      successFlash(ctx, w, h);
    });
    setDispose(() => {});
  });

  arena.registerScene("lifeStretch", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
    const modes = ["seed", "virus", "coral", "robot", "yeast"];
    setDescription("Same living criteria in new places.");
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
      const mode = bioLabState.mode || "seed";
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
      const captions = {
        seed: "Quiet seed can still be living (dormant)",
        virus: "Virus stretch - needs a host (tricky edge)",
        coral: "Coral animals build a living reef city",
        robot: "Robot moves but does not grow or reproduce as life",
        yeast: "Yeast is living - makes bread rise",
      };
      if (mode === "seed") drawSeed(ctx, w * 0.5, h * 0.36, 0.3);
      else if (mode === "robot") drawPhone(ctx, w * 0.5, h * 0.36);
      else drawCat(ctx, w * 0.5, h * 0.36);
      drawLabel(ctx, captions[mode], w * 0.5, layout.labelY);
      setHitRegions(hits);
      failFlash(ctx, w, h);
      successFlash(ctx, w, h);
    });
    setDispose(() => setIntentHandler(null));
  });

  arena.registerScene("lifeMyth", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
    const myths = [
      { claim: "Anything that moves is alive", truth: "Cars and phones move or respond - but they don’t grow or make more life" },
      { claim: "Phones are alive because they reply", truth: "Phones need people & power - they don’t grow or reproduce" },
      { claim: "Fire is alive", truth: "Fire uses fuel and spreads - but it isn’t an organism" },
      { claim: "Seeds are dead until they sprout", truth: "Many seeds are living but dormant" },
      { claim: "Only animals are living", truth: "Plants, fungi, and many tiny microbes are living too" },
    ];
    setDescription("Bust living myths - tap to flip.");
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

  arena.registerScene("lifeDrill", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
    setDescription(bioLabState.prompt || "Life drill");
    setTick(() => {
      const w = api.width;
      const h = api.height;
      drawBackdrop();
      drawLabel(ctx, bioLabState.prompt || "Living or not?", w * 0.5, h * 0.2, { h: 32, font: "700 16px Segoe UI" });
      drawCat(ctx, w * 0.35, h * 0.5);
      drawRock(ctx, w * 0.65, h * 0.5);
      failFlash(ctx, w, h);
      successFlash(ctx, w, h);
    });
    setDispose(() => {});
  });

  arena.registerScene("lifeMastery", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
    setDescription("Living Rookie mastery.");
    setTick(() => {
      const w = api.width;
      const h = api.height;
      const layout = api.layout;
      const locked = bioLabState.masteryStep || 0;
      drawBackdrop();
      ["Meet", "Sort", "Sprout", "Rule", "Myth", "Badge"].forEach((label, i) => {
        const x = w * 0.1 + i * (w * 0.14);
        ctx.fillStyle = i < locked ? "#22c55e" : "rgba(148,163,184,0.35)";
        roundRect(ctx, x - 28, h * 0.78 - 12, 56, 24, 8);
        ctx.fill();
        ctx.fillStyle = "#052e16";
        ctx.font = "600 10px Segoe UI";
        ctx.textAlign = "center";
        ctx.fillText(label, x, h * 0.78);
      });
      drawSeed(ctx, w * 0.5, h * 0.4, 0.8);
      drawLabel(ctx, "Living Rookie!", w * 0.5, layout.labelY);
      failFlash(ctx, w, h);
      successFlash(ctx, w, h);
    });
    setDispose(() => {});
  });
}
