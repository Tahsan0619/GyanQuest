import { t } from "./i18n.js";
import {
  runChain,
  mountDemoWithDwell,
  mountDragZones,
  mountEquationRail,
  mountOrderRail,
  mountRevealSteps,
  mountMotionChain,
} from "./lab-dnd.js";
import { LEVEL_DEMO_SCENES } from "./game-core.js";
import { spectatorPauseMs } from "./timings.js";
import { kidMcq } from "./kid-activities.js";

/**
 * Force Fighter, levels 2-10: interactive sub-levels (HTML/CSS/JS + arena 3D helpers).
 * @param {object} api. See main.js `buildLevelApi()`.
 */
export function runAdvancedLevel(api) {
  const { arena, state, setCoach, mountOverlay, clearOverlay, completeCurrentSub, btnRestart, setInteractCleanup } = api;

  clearOverlay();

  const lv = state.level;
  // Per-level default canvas scene. Specific `mountDemoWithDwell` calls override this
  // by passing their own `scene` (or by calling arena.startXxxDemo() directly).
  const demo = LEVEL_DEMO_SCENES[lv];
  if (demo?.scene && typeof arena.playExample === "function") {
    try {
      arena.playExample(demo.scene, demo.sceneArgs || {});
    } catch (_) {
      /* ignore */
    }
  }

  const runners = [runL2, runL3, runL4, runL5, runL6, runL7, runL8, runL9, runL10];
  const run = runners[lv - 1];
  if (run) run(api);
}

function wrapRestart(api, fn) {
  const run = () => fn(api);
  if (typeof api.registerTryAgain === "function") api.registerTryAgain(run);
  else api.btnRestart.onclick = run;
}

function mcSeg(api, title, question, choices, okIndex, coachWin, next) {
  kidMcq(api, { title, question, choices, okIndex, coachShort: coachWin }, next);
}

function setViewportHud(html) {
  const el = document.getElementById("viewport-hud");
  if (el) el.innerHTML = html;
}

function frictionSurfaceLabel(mu) {
  if (mu < 0.25) return "Ice";
  if (mu < 0.55) return "Tile / ceramic";
  if (mu < 1.2) return "Rubber / road";
  return "Sandpaper / rough";
}

function frictionZoneKey(mu) {
  if (mu < 0.25) return "ice";
  if (mu < 0.55) return "tile";
  if (mu < 1.2) return "rubber";
  return "sand";
}

/** Toy estimate for readout (matches glide decel feel roughly). */
function estStoppingDistanceMu(mu, v0 = 2.1) {
  if (mu < 0.03) return 80;
  const a = mu * 5.5;
  return (v0 * v0) / (2 * Math.max(0.05, a));
}

/* ========== Level 2: Second law ========== */
function runL2(api) {
  const subs = [l2s0, l2s1, l2s2, l2s3, l2s4, l2s5, l2s6, l2s7, l2s8, l2s9];
  subs[api.state.sub](api);
}

function l2s0(api) {
  const { arena, setCoach, mountOverlay, clearOverlay } = api;
  let predicted = null;
  runChain(api, [
    (a, next) => {
      arena.clearExtras();
      setCoach(t("adv.s0103"), "");
      mountOverlay(`<div class="card"><div id="l2d0"></div></div>`, { dock: "bottom", passThrough: false });
      mountDemoWithDwell(document.getElementById("l2d0"), {
        minDwellMs: 5200,
        scene: "massCompare",
        html: `<p class="lab-lead">Example bars = acceleration “feel” (not to scale with your race).</p>
          <div class="demo-bars"><div class="demo-bar"><span>Light car</span><div class="demo-fill" style="width:88%"></div></div>
          <div class="demo-bar demo-bar--slow"><span>Heavy tank</span><div class="demo-fill" style="width:28%"></div></div></div>`,
        onContinue: () => {
          clearOverlay();
          next();
        },
      });
    },
    (a, next, finish) => {
      setCoach(t("adv.s0302"), "");
      mountOverlay(
        `<div class="card"><h2>Acceleration trials</h2><p>Light sports car vs heavy tank.</p>
        <div class="btn-row" id="pred"><button type="button" class="btn secondary" data-p="car">Sports car wins</button>
        <button type="button" class="btn secondary" data-p="tank">Tank wins</button>
        <button type="button" class="btn secondary" data-p="tie">Tie</button></div>
        <div class="btn-row"><button type="button" class="btn primary" id="go" disabled>GO!</button></div>
        <p class="drag-hint" id="race-msg"></p></div>`,
        { dock: "bottom", passThrough: false }
      );
      document.querySelectorAll("#pred button").forEach((b) => {
        b.onclick = () => {
          predicted = b.dataset.p;
          document.querySelectorAll("#pred button").forEach((x) => x.classList.remove("selected"));
          b.classList.add("selected");
          document.getElementById("go").disabled = false;
        };
      });
      document.getElementById("go").onclick = () => {
        document.getElementById("go").disabled = true;
        arena.startRaceDemo({
          onFinish: (winner) => {
            const right = predicted === "car" && winner === "car";
            const el = document.getElementById("race-msg");
            if (el)
              el.textContent = right
                ? "Nice prediction, same F, smaller m ⇒ larger a."
                : "Same thrust: the car still pulls ahead because it has far less inertia.";
            setTimeout(() => {
              clearOverlay();
              next();
            }, spectatorPauseMs(2000));
          },
        });
      };
    },
    (a, next, finish) => {
      setCoach(t("adv.s0120"), "");
      mountOverlay(`<div class="card"><div id="l2dz"></div></div>`, { dock: "bottom", passThrough: false });
      mountDragZones(document.getElementById("l2dz"), {
        title: t("adv.s0212"),
        instructions: t("adv.s0514"),
        zones: [
          { id: "car", label: t("adv.s0371"), accept: ["fast"] },
          { id: "tank", label: t("adv.s0402"), accept: ["heavy"] },
        ],
        chips: [
          { id: "fast", text: t("adv.s0369") },
          { id: "heavy", text: t("adv.s0239") },
          { id: "wrong", text: t("adv.s0215") },
        ],
        onDone: () => {
          clearOverlay();
          next();
        },
      });
    },
    (a, next, finish) => {
      setCoach(t("adv.s0311"), "");
      mountOverlay(`<div class="card"><div id="l2ord"></div></div>`, { dock: "bottom", passThrough: false });
      mountOrderRail(document.getElementById("l2ord"), {
        items: [
          { id: "c", html: "Compare resulting <strong>accelerations</strong>" },
          { id: "b", html: "Measure / control the <strong>force</strong> applied" },
          { id: "a", html: "Identify each body’s <strong>mass</strong>" },
        ],
        correctIds: ["a", "b", "c"],
        onDone: finish,
      });
    },
  ]);
}

function l2s1(api) {
  const { setCoach, mountOverlay, clearOverlay } = api;
  let step = 0;
  const steps = [
    { t: "Force", b: "Both rockets: 5000 N thrust (same force).", c: "Got it" },
    { t: "Mass", b: "Car ≈ 500 kg vs tank ≈ 4000 kg, tank resists acceleration more.", c: "Got it" },
    { t: "Acceleration", b: "a = F ÷ m → lighter car gains speed faster with the same F.", c: "Got it" },
  ];
  runChain(api, [
    (a, next) => {
      setCoach(t("adv.s0353"), "");
      mountOverlay(`<div class="card"><div id="l21d"></div></div>`, { dock: "bottom", passThrough: false });
      mountDemoWithDwell(document.getElementById("l21d"), {
        minDwellMs: 4200,
        scene: "massCompare",
        html: `<p>Example: if <strong>F</strong> is matched on two bodies, the one with larger <strong>m</strong> shows a smaller <strong>a</strong> readout.</p>`,
        onContinue: () => {
          clearOverlay();
          next();
        },
      });
    },
    (a, next, finish) => {
      function showGot() {
        if (step >= steps.length) {
          clearOverlay();
          next();
          return;
        }
        const s = steps[step];
        setCoach(`Guided observation ${step + 1}/3`, "");
        mountOverlay(
          `<div class="card"><h2>Race breakdown</h2><p><strong>${s.t}.</strong> ${s.b}</p>
          <button type="button" class="btn primary" id="nx">${s.c}</button></div>`,
          { dock: "bottom", passThrough: false }
        );
        document.getElementById("nx").onclick = () => {
          step++;
          showGot();
        };
      }
      step = 0;
      showGot();
    },
    (a, next, finish) => {
      setCoach(t("adv.s0118"), "");
      mountOverlay(`<div class="card"><div id="l21z"></div></div>`, { dock: "bottom", passThrough: false });
      mountDragZones(document.getElementById("l21z"), {
        title: t("adv.s0219"),
        instructions: t("adv.s0344"),
        zones: [
          { id: "F", label: t("adv.s0340"), accept: ["t1"] },
          { id: "m", label: t("adv.s0207"), accept: ["t2"] },
          { id: "a", label: t("adv.s0193"), accept: ["t3"] },
        ],
        chips: [
          { id: "t1", text: t("adv.s0007") },
          { id: "t2", text: t("adv.s0403") },
          { id: "t3", text: t("adv.s0077") },
          { id: "junk", text: t("adv.s0334") },
        ],
        onDone: () => {
          clearOverlay();
          next();
        },
      });
    },
    (a, next, finish) => {
      mcSeg(api, "Quick check", "Which vehicle had more mass?", ["Sports car", "Tank"], 1, "More mass ⇒ smaller a for the same net force.", finish);
    },
  ]);
}

function l2s2(api) {
  const { setCoach, mountOverlay, clearOverlay } = api;
  runChain(api, [
    (a, next) => {
      setCoach(t("adv.s0450"), "");
      mountOverlay(`<div class="card"><div id="l22d"></div></div>`, { dock: "bottom", passThrough: false });
      mountDemoWithDwell(document.getElementById("l22d"), {
        minDwellMs: 5000,
        scene: "massCompare",
        html: `<p>100 kg crate at <strong>5 m/s²</strong> needs <strong>500 N</strong>.<br/>
        400 kg crate at the same <strong>5 m/s²</strong> needs <strong>2000 N</strong> (four times the push).</p>`,
        onContinue: () => {
          clearOverlay();
          next();
        },
      });
    },
    (a, next, finish) => {
      setCoach(t("adv.s0442"), "");
      mountOverlay(
        `<div class="card"><h2>Dual-crate push lab</h2>
        <p>Crate A: 100 kg, force (N)</p>
        <input type="range" min="0" max="1500" value="0" id="fa" /><span id="ra" class="readout">0 N</span>
        <p>Crate B: 400 kg, force (N)</p>
        <input type="range" min="0" max="3000" value="0" id="fb" /><span id="rb" class="readout">0 N</span>
        <div class="btn-row"><button type="button" class="btn primary" id="tst">Test</button></div>
        <p id="hint2" class="drag-hint"></p>
        <div id="l22z"></div></div>`,
        { dock: "bottom", passThrough: false }
      );
      const ra = () => {
        document.getElementById("ra").textContent = `${document.getElementById("fa").value} N`;
        document.getElementById("rb").textContent = `${document.getElementById("fb").value} N`;
      };
      document.getElementById("fa").oninput = ra;
      document.getElementById("fb").oninput = ra;
      ra();
      document.getElementById("tst").onclick = () => {
        const fv = +document.getElementById("fa").value;
        const gv = +document.getElementById("fb").value;
        if (Math.abs(fv - 500) < 80 && Math.abs(gv - 2000) < 120) {
          document.getElementById("hint2").textContent = t("adv.s0161");
          const z = document.getElementById("l22z");
          mountDragZones(z, {
            title: t("adv.s0480"),
            instructions: t("adv.s0125"),
            zones: [{ id: "one", label: t("adv.s0335"), accept: ["why"] }],
            chips: [
              { id: "why", text: t("adv.s0517") },
              { id: "bad", text: t("adv.s0516") },
            ],
            onDone: () => {
              clearOverlay();
              finish();
            },
          });
        } else document.getElementById("hint2").textContent = t("adv.s0191");
      };
    },
  ]);
}

function l2s3(api) {
  const { setCoach, mountOverlay, clearOverlay } = api;
  runChain(api, [
    (a, next) => {
      setCoach(t("adv.s0102"), "");
      mountOverlay(`<div class="card"><div id="l23d"></div></div>`, { dock: "bottom", passThrough: false });
      mountDemoWithDwell(document.getElementById("l23d"), {
        minDwellMs: 4800,
        scene: "massCompare",
        html: `<p>Example readout: if <strong>m = 200 kg</strong> and <strong>F = 1000 N</strong>, then <strong>a = 5 m/s²</strong>. Double only <strong>m</strong> → <strong>a</strong> drops toward 2.5 m/s².</p>`,
        onContinue: () => {
          clearOverlay();
          next();
        },
      });
    },
    (a, next) => {
      setCoach(t("adv.s0300"), "");
      mountOverlay(
        `<div class="card"><h2>Acceleration simulator</h2>
        <p>Mass (kg) <input type="range" id="mass" min="50" max="800" value="200" /></p>
        <p>Force (N) <input type="range" id="force" min="0" max="4000" value="1000" /></p>
        <p id="acc" class="readout"></p>
        <button type="button" class="btn primary" id="l23n">Continue, then build the law</button></div>`,
        { dock: "bottom", passThrough: false }
      );
      const upd = () => {
        const m = +document.getElementById("mass").value;
        const f = +document.getElementById("force").value;
        const ac = m > 0 ? f / m : 0;
        document.getElementById("acc").textContent = `Acceleration ≈ ${ac.toFixed(2)} m/s²`;
      };
      document.getElementById("mass").oninput = upd;
      document.getElementById("force").oninput = upd;
      upd();
      document.getElementById("l23n").onclick = () => {
        clearOverlay();
        next();
      };
    },
    (a, next, finish) => {
      setCoach(t("adv.s0126"), "");
      mountOverlay(`<div class="card"><div id="l23e"></div></div>`, { dock: "bottom", passThrough: false });
      mountEquationRail(document.getElementById("l23e"), {
        tokens: [
          { id: "F", html: "F" },
          { id: "EQ", html: "=" },
          { id: "m", html: "m" },
          { id: "X", html: "·" },
          { id: "a", html: "a" },
        ],
        onDone: () => {
          clearOverlay();
          next();
        },
      });
    },
    (a, next, finish) => {
      mcSeg(
        api,
        "Concept check",
        "You keep F the same but double m. Acceleration…",
        ["Doubles", "Halves", "Unchanged"],
        1,
        "Same net force, twice the inertia ⇒ half the acceleration.",
        finish
      );
    },
  ]);
}

function l2s4(api) {
  const { mountOverlay, clearOverlay } = api;
  runChain(api, [
    (a, next) => {
      mountOverlay(`<div class="card"><div id="l24d"></div></div>`, { dock: "bottom", passThrough: false });
      mountDemoWithDwell(document.getElementById("l24d"), {
        minDwellMs: 4500,
        scene: "massCompare",
        html: `<p>Example: physicists pack “net force = mass × acceleration” into one compact sentence, you’ll assemble it next.</p>`,
        onContinue: () => {
          clearOverlay();
          next();
        },
      });
    },
    (a, next, finish) => {
      mountOverlay(`<div class="card"><div id="l24e"></div></div>`, { dock: "bottom", passThrough: false });
      mountEquationRail(document.getElementById("l24e"), {
        tokens: [
          { id: "F", html: "F" },
          { id: "EQ", html: "=" },
          { id: "m", html: "m" },
          { id: "X", html: "·" },
          { id: "a", html: "a" },
        ],
        onDone: () => {
          clearOverlay();
          next();
        },
      });
    },
    (a, next, finish) => {
      mcSeg(api, "Symbolic check", "Which is Newton’s Second Law?", ["F = m·a", "F = m·v", "F = a/m"], 0, "Good, keep this form in muscle memory.", finish);
    },
  ]);
}

function numberSeg(api, title, prompt, correctNum, tol, coach, next, formulaHint) {
  const { mountOverlay, clearOverlay, setCoach } = api;
  const hint = formulaHint ?? "Formula: F = m · a";
  mountOverlay(
    `<div class="card"><h2>${title}</h2><p>${prompt}</p>
    <p class="formula-hint">${hint}</p>
    <input type="number" step="any" id="nsv" />
    <div class="btn-row"><button type="button" class="btn primary" id="nchk">Check</button></div>
    <p id="nfe" class="drag-hint"></p></div>`,
    { dock: "bottom", passThrough: false }
  );
  document.getElementById("nchk").onclick = () => {
    const v = parseFloat(document.getElementById("nsv").value);
    if (Number.isFinite(v) && Math.abs(v - correctNum) <= tol) {
      clearOverlay();
      setCoach(coach, "");
      next();
    } else document.getElementById("nfe").textContent = t("adv.s0021");
  };
}

function l2s5(api) {
  const { mountOverlay, clearOverlay } = api;
  runChain(api, [
    (a, next) => {
      mountOverlay(`<div class="card"><div id="l25d"></div></div>`, { dock: "bottom", passThrough: false });
      mountDemoWithDwell(document.getElementById("l25d"), {
        minDwellMs: 4500,
        scene: "massCompare",
        html: `<p>Example: 150 kg × 4 m/s² = <strong>600 N</strong> net force. Always multiply <strong>m</strong> by <strong>a</strong> when they align on one axis.</p>`,
        onContinue: () => {
          clearOverlay();
          next();
        },
      });
    },
    (a, next, finish) => {
      numberSeg(
        api,
        "Number crunch",
        "A 150 kg cart accelerates at 4 m/s². Net force (N)?",
        600,
        45,
        "600 N, F = m·a.",
        () => finish(),
        "Formula: F = m · a"
      );
    },
  ]);
}

function l2s6(api) {
  const { mountOverlay, clearOverlay } = api;
  runChain(api, [
    (a, next) => {
      mountOverlay(`<div class="card"><div id="l26d"></div></div>`, { dock: "bottom", passThrough: false });
      mountDemoWithDwell(document.getElementById("l26d"), {
        minDwellMs: 5000,
        scene: "massCompare",
        html: `<p>Example trucks: same engine force chart, the loaded trace climbs speed <em>slower</em> because each extra ton adds inertia.</p>`,
        onContinue: () => {
          clearOverlay();
          next();
        },
      });
    },
    (a, next, finish) => {
      mountOverlay(`<div class="card"><div id="l26z"></div></div>`, { dock: "bottom", passThrough: false });
      mountDragZones(document.getElementById("l26z"), {
        title: t("adv.s0400"),
        instructions: t("adv.s0123"),
        zones: [{ id: "t", label: t("adv.s0221"), accept: ["ok"] }],
        chips: [
          { id: "ok", text: t("adv.s0151") },
          { id: "bad", text: t("adv.s0178") },
        ],
        onDone: () => {
          clearOverlay();
          finish();
        },
      });
    },
  ]);
}

function l2s7(api) {
  const { mountOverlay, clearOverlay } = api;
  runChain(api, [
    (a, next) => {
      mountOverlay(`<div class="card"><div id="l27d"></div></div>`, { dock: "bottom", passThrough: false });
      mountDemoWithDwell(document.getElementById("l27d"), {
        minDwellMs: 4500,
        scene: "shove",
        html: `<p>Example: SI definition ties <strong>1 N</strong> to <strong>1 kg·m/s²</strong>, force is “how hard” you change motion numerically.</p>`,
        onContinue: () => {
          clearOverlay();
          next();
        },
      });
    },
    (a, next, finish) => {
      mountOverlay(`<div class="card"><div id="l27o"></div></div>`, { dock: "bottom", passThrough: false });
      mountOrderRail(document.getElementById("l27o"), {
        items: [
          { id: "c", html: "State the unit equivalence for Newtons" },
          { id: "a", html: "Write kg·m/s²" },
          { id: "b", html: "Link it to force changing motion" },
        ],
        correctIds: ["a", "b", "c"],
        onDone: finish,
      });
    },
  ]);
}

function l2s8(api) {
  const { setCoach, mountOverlay, clearOverlay } = api;
  runChain(api, [
    (a, next) => {
      mountOverlay(`<div class="card"><div id="l28d"></div></div>`, { dock: "bottom", passThrough: false });
      mountDemoWithDwell(document.getElementById("l28d"), {
        minDwellMs: 4800,
        scene: "forceCompare",
        html: `<p>Example tuning: 360 N on 60 kg gives 6 m/s². Try nearby pairs in your head before sliding.</p>`,
        onContinue: () => {
          clearOverlay();
          next();
        },
      });
    },
    (a, next, finish) => {
      setCoach(t("adv.s0234"), "");
      mountOverlay(
        `<div class="card"><h2>Tuning + verify</h2>
        <p>Mass 50-400 kg, Force 0-2400 N</p>
        <input type="range" id="m8" min="50" max="400" value="200" />
        <input type="range" id="f8" min="0" max="2400" value="0" />
        <p id="a8" class="readout"></p>
        <button type="button" class="btn primary" id="c8">Lock readout ≈ 6</button>
        <div id="l28z"></div></div>`,
        { dock: "bottom", passThrough: false }
      );
      const u = () => {
        const m = +document.getElementById("m8").value;
        const f = +document.getElementById("f8").value;
        document.getElementById("a8").textContent = `a = ${(f / m).toFixed(2)} m/s²`;
      };
      document.getElementById("m8").oninput = u;
      document.getElementById("f8").oninput = u;
      u();
      document.getElementById("c8").onclick = () => {
        const m = +document.getElementById("m8").value;
        const f = +document.getElementById("f8").value;
        if (Math.abs(f / m - 6) > 0.35) return;
        const z = document.getElementById("l28z");
        if (z.dataset.mounted) return;
        z.dataset.mounted = "1";
        mountDragZones(z, {
          title: t("adv.s0399"),
          instructions: t("adv.s0038"),
          zones: [{ id: "x", label: t("adv.s0515"), accept: ["d"] }],
          chips: [
            { id: "d", text: t("adv.s0498") },
            { id: "w", text: t("adv.s0503") },
          ],
          onDone: finish,
        });
      };
    },
  ]);
}

function l2s9(api) {
  const { mountOverlay, clearOverlay } = api;
  runChain(api, [
    (a, next) => {
      mountOverlay(`<div class="card"><div id="l29d"></div></div>`, { dock: "bottom", passThrough: false });
      mountDemoWithDwell(document.getElementById("l29d"), {
        minDwellMs: 5000,
        scene: "forceCompare",
        html: `<p>Example graph idea: double the horizontal push on the same crate → the acceleration trace doubles its slope.</p>`,
        onContinue: () => {
          clearOverlay();
          next();
        },
      });
    },
    (a, next, finish) => {
      mountOverlay(`<div class="card"><div id="l29z"></div></div>`, { dock: "bottom", passThrough: false });
      mountDragZones(document.getElementById("l29z"), {
        title: t("adv.s0230"),
        instructions: t("adv.s0204"),
        zones: [{ id: "slot", label: t("adv.s0298"), accept: ["d"] }],
        chips: [
          { id: "d", text: t("adv.s0115") },
          { id: "h", text: t("adv.s0182") },
          { id: "q", text: t("adv.s0312") },
        ],
        onDone: () => {
          clearOverlay();
          a.mountOverlay(
            `<div class="card scenario-box"><p><span class="badge-earned">🏎️ Speed Star Badge</span></p>
            <p class="drag-hint">F = m·a is your launch code - same push, less mass, bigger kick.</p>
            <button type="button" class="btn primary" id="l29b">Continue</button></div>`,
            { dock: "bottom", passThrough: false }
          );
          document.getElementById("l29b").onclick = () => {
            clearOverlay();
            finish();
          };
        },
      });
    },
  ]);
}

/* ========== Level 3: Third law ========== */
function runL3(api) {
  const subs = [l3s0, l3s1, l3s2, l3s3, l3s4, l3s5, l3s6, l3s7, l3s8, l3s9];
  subs[api.state.sub](api);
}

function l3s0(api) {
  const { arena, setCoach, mountOverlay, clearOverlay } = api;
  arena.clearExtras();
  runChain(api, [
    (a, next) => {
      setCoach(t("adv.s0104"), "");
      mountOverlay(`<div class="card"><div id="p3d"></div></div>`, { dock: "bottom", passThrough: false });
      mountDemoWithDwell(document.getElementById("p3d"), {
        minDwellMs: 5500,
        scene: "recoil",
        html: `<p>Example: in a pool push, you shove water backward; water shoves you forward, <strong>same strength, opposite directions, two different bodies</strong>.</p>`,
        onContinue: () => {
          clearOverlay();
          next();
        },
      });
    },
    (a, next) => {
      setCoach(t("adv.s0489"), "");
      mountOverlay(
        `<div class="card"><h2>Recoil lab</h2><p>Press <strong>Push!</strong> to fire the pair apart.</p>
        <button type="button" class="btn primary" id="push">Push!</button></div>`,
        { dock: "bottom", passThrough: false }
      );
      document.getElementById("push").onclick = () => {
        document.getElementById("push").disabled = true;
        arena.startRecoilDemo({
          onFinish: () => {
            clearOverlay();
            next();
          },
        });
      };
    },
    (a, next, finish) => {
      setCoach(t("adv.s0124"), "");
      mountOverlay(`<div class="card"><div id="p3z"></div></div>`, { dock: "bottom", passThrough: false });
      mountDragZones(document.getElementById("p3z"), {
        title: t("adv.s0398"),
        instructions: t("adv.s0138"),
        zones: [
          { id: "L", label: t("adv.s0055"), accept: ["fl"] },
          { id: "R", label: t("adv.s0283"), accept: ["fr"] },
        ],
        chips: [
          { id: "fl", text: t("adv.s0307") },
          { id: "fr", text: t("adv.s0308") },
          { id: "bad", text: t("adv.s0263") },
        ],
        onDone: finish,
      });
    },
  ]);
}

function l3s1(api) {
  const { arena, setCoach, completeCurrentSub } = api;
  arena.playExample("recoil");
  setCoach(t("adv.s0449"), "");
  kidMcq(
    api,
    {
      title: t("adv.s0275"),
      question:
        "A Shitalakshya rower shoves a big plug of water backward with the blade. What makes the boat surge forward?",
      choices: [
        "Water pushes the oar forward with a matching-size contact force (different body)",
        "Water is too floppy to push back",
        "Only arm muscles count; the river is decoration",
      ],
      okIndex: 0,
      coachShort: t("adv.s0260"),
    },
    () => {
      completeCurrentSub();
      setCoach(t("adv.s0150"), "");
    }
  );
  wrapRestart(api, l3s1);
}

function l3s2(api) {
  const { setCoach, mountOverlay, clearOverlay, completeCurrentSub } = api;
  let sel = null;
  setCoach(t("adv.s0081"), "");
  mountOverlay(
    `<div class="card"><h2>Match pairs</h2>
    <div class="match-row"><div id="terms"></div><div id="means"></div></div>
    <p id="mp" class="drag-hint">Matched: 0/3</p></div>`,
    { dock: "bottom", passThrough: false }
  );
  const labels = [
    ["Action", "A"],
    ["Reaction", "B"],
    ["Interaction", "C"],
  ];
  const defs = [
    ["Object A exerts a force on B", "A"],
    ["Object B exerts equal & opposite force on A", "B"],
    ["One mutual event linking two bodies", "C"],
  ];
  const matched = new Set();
  const te = document.getElementById("terms");
  const me = document.getElementById("means");
  labels.forEach(([lab, id]) => {
    const b = document.createElement("button");
    b.className = "term";
    b.textContent = lab;
    b.dataset.id = id;
    b.onclick = () => {
      te.querySelectorAll("button").forEach((x) => x.classList.remove("selected"));
      b.classList.add("selected");
      sel = id;
    };
    te.appendChild(b);
  });
  defs.forEach(([lab, id]) => {
    const b = document.createElement("button");
    b.className = "mean";
    b.textContent = lab;
    b.dataset.id = id;
    b.onclick = () => {
      if (!sel) return;
      if (sel === id) {
        matched.add(id);
        te.querySelectorAll("button").forEach((x) => {
          if (x.dataset.id === id) {
            x.classList.add("matched-done");
            x.disabled = true;
          }
        });
        me.querySelectorAll("button").forEach((x) => {
          if (x.dataset.id === id) {
            x.classList.add("matched-done");
            x.disabled = true;
          }
        });
        sel = null;
        document.getElementById("mp").textContent = `Matched: ${matched.size}/3`;
        if (matched.size === 3) {
          clearOverlay();
          completeCurrentSub();
          setCoach(t("adv.s0018"), "");
        }
      }
    };
    me.appendChild(b);
  });
  wrapRestart(api, l3s2);
}

function l3s3(api) {
  const { setCoach, mountOverlay, clearOverlay, completeCurrentSub } = api;
  function run() {
    clearOverlay();
    setCoach(t("adv.s0317"), "");
    mountOverlay(`<div class="card scenario-box"><div id="l33h"></div></div>`, { dock: "bottom", passThrough: false });
    mountRevealSteps(document.getElementById("l33h"), {
      title: t("adv.s0324"),
      stepScenes: [
        { scene: "recoil", sceneArgs: { variant: "exhaust" } },
        { scene: "recoil", sceneArgs: { variant: "thrust" } },
        { scene: "recoil", sceneArgs: { variant: "pair" } },
      ],
      steps: [
        "Fuel becomes hot gas; the engine hurls that gas **downward** at huge speed.",
        "The gas shoves the engine bay **upward** - same interaction strength as the downward shove on the gas.",
        "Gravity never “turns off”; thrust just wins the **net** battle for a while.",
      ],
      onDone: () => {
        clearOverlay();
        kidMcq(
          api,
          {
            title: t("adv.s0214"),
            question:
              "Why does a heavy launch vehicle leave the pad even though gravity still pulls it down?",
            choices: [
              "Hot exhaust is pushed down; exhaust pushes the vehicle up (Newton 3 pair)",
              "Newton 3 stops working above the tower",
              "Rockets hover because weight disappears",
            ],
            okIndex: 0,
            coachShort: t("adv.s0286"),
          },
          () => {
            completeCurrentSub();
            setCoach(t("adv.s0130"), "");
          }
        );
      },
    });
  }
  wrapRestart(api, run);
  run();
}

function l3s4(api) {
  const { arena, setCoach, completeCurrentSub } = api;
  arena.playExample("rope");
  setViewportHud(`<div class="hud-readout">Tug helpers pull left & right - watch the shared rope.</div>`);
  setCoach(t("adv.s0432"), "");
  kidMcq(
    api,
    {
      title: t("adv.s0372"),
      question:
        "A spring scale sits in the middle of a horizontal rope. Teammate A pulls the left rope at 120 N, teammate B pulls the right rope at 120 N. The scale reading is closest to…",
      choices: ["0 N (forces cancel everywhere)", "120 N", "240 N (add both pulls)"],
      okIndex: 1,
      coachShort: t("adv.s0408"),
    },
    () => {
      setViewportHud("");
      completeCurrentSub();
      setCoach(t("adv.s0513"), "");
    }
  );
  wrapRestart(api, l3s4);
}

function l3s5(api) {
  const { arena, setCoach, mountOverlay, clearOverlay, completeCurrentSub } = api;
  arena.playExample("shove");
  setCoach(t("adv.s0119"), "");
  mountOverlay(`<div class="card"><div id="l35z"></div></div>`, { dock: "bottom", passThrough: false });
  mountDragZones(document.getElementById("l35z"), {
    title: t("adv.s0447"),
    instructions: t("adv.s0490"),
    zones: [
      { id: "foot", label: t("adv.s0469"), accept: ["back"] },
      { id: "ground", label: t("adv.s0466"), accept: ["fwd"] },
    ],
    chips: [
      { id: "back", text: t("adv.s0305") },
      { id: "fwd", text: t("adv.s0379") },
      { id: "bad", text: t("adv.s0141") },
    ],
    onDone: () => {
      clearOverlay();
      completeCurrentSub();
      setCoach(t("adv.s0409"), "");
    },
  });
  wrapRestart(api, l3s5);
}

function l3s6(api) {
  const { arena, setCoach, completeCurrentSub } = api;
  arena.playExample("rest", { shape: "ball", arrows: true });
  setCoach(t("adv.s0455"), "");
  kidMcq(
    api,
    {
      title: t("adv.s0201"),
      question:
        "Earth pulls you down with gravitational force (your weight). The Newton-third-law reaction partner acts on…",
      choices: [
        "Earth - you pull Earth upward with the same magnitude",
        "The air around you only",
        "Your shoes - normal force is always the reaction to weight",
      ],
      okIndex: 0,
      coachShort: t("adv.s0458"),
    },
    () => {
      completeCurrentSub();
      setCoach(t("adv.s0277"), "");
    }
  );
  wrapRestart(api, l3s6);
}

function l3s7(api) {
  const { arena, setCoach, mountOverlay, clearOverlay, completeCurrentSub } = api;
  arena.playExample("orbit");
  setCoach(t("adv.s0217"), "");
  mountOverlay(`<div class="card"><div id="l37z"></div></div>`, { dock: "bottom", passThrough: false });
  mountDragZones(document.getElementById("l37z"), {
    title: t("adv.s0157"),
    instructions: t("adv.s0156"),
    zones: [
      {
        id: "thrust",
        label: t("adv.s0194"),
        accept: ["jet"],
      },
      {
        id: "lift",
        label: t("adv.s0464"),
        accept: ["buoy"],
      },
    ],
    chips: [
      { id: "jet", text: t("adv.s0309") },
      { id: "buoy", text: t("adv.s0074") },
      { id: "bad", text: t("adv.s0412") },
    ],
    onDone: () => {
      clearOverlay();
      completeCurrentSub();
      setCoach(t("adv.s0073"), "");
    },
  });
  wrapRestart(api, l3s7);
}

function l3s8(api) {
  const { arena, setCoach, mountOverlay, clearOverlay, completeCurrentSub } = api;
  setCoach(t("adv.s0044"), "");
  mountOverlay(
    `<div class="card"><h2>Balloon reaction</h2><button type="button" class="btn primary" id="rel">Release air!</button></div>`,
    { dock: "bottom", passThrough: false }
  );
  document.getElementById("rel").onclick = () => {
    arena.startRecoilDemo({
      strength: 0.55,
      onFinish: () => {
        clearOverlay();
        completeCurrentSub();
        setCoach(t("adv.s0237"), "");
      },
    });
  };
  wrapRestart(api, l3s8);
}

function l3s9(api) {
  runChain(api, [
    (a, next) => {
      a.setCoach(t("adv.s0420"), "");
      a.mountOverlay(`<div class="card"><div id="l39d"></div></div>`, { dock: "bottom", passThrough: false });
      mountDemoWithDwell(document.getElementById("l39d"), {
        minDwellMs: 4200,
        scene: "wall",
        sceneArgs: { autoRepeat: true },
        html: `<p class="scenario-box"><strong>Observation:</strong> a small rock can stop abruptly on a rigid wall - accelerations differ even when interaction forces match.</p>
          <p class="drag-hint">Newton 3 is about the <em>pair</em>, not about who has more mass.</p>`,
        onContinue: () => {
          a.clearOverlay();
          next();
        },
      });
    },
    (a, _n, finish) => {
      kidMcq(
        a,
        {
          title: t("adv.s0072"),
          question:
            "During the splat, the bug’s force on the glass is ___ the glass’s force on the bug.",
          choices: ["Greater than", "Less than", "Equal in magnitude to"],
          okIndex: 2,
          coachShort: t("adv.s0337"),
        },
        () => {
          a.mountOverlay(
            `<div class="card"><p><span class="badge-earned">🤝 Team Force Badge</span></p>
            <p class="drag-hint">You traced third-law partners from boats to rockets to gnats - slick teamwork!</p>
            <button type="button" class="btn primary" id="l39b">Continue</button></div>`,
            { dock: "bottom", passThrough: false }
          );
          document.getElementById("l39b").onclick = () => {
            a.clearOverlay();
            finish();
          };
        }
      );
    },
  ]);
}

/* ========== Level 4: Friction ========== */
function runL4(api) {
  const subs = [l4s0, l4s1, l4s2, l4s3, l4s4, l4s5, l4s6, l4s7, l4s8, l4s9];
  subs[api.state.sub](api);
}

function l4s0(api) {
  const { arena, setCoach, mountOverlay, clearOverlay, completeCurrentSub, setInteractCleanup } = api;
  setCoach(t("adv.s0357"), "");
  const tried = new Set();
  let lastProgress = null;
  let rafId = 0;
  mountOverlay(
    `<div class="card"><h2>Friction compare</h2>
    <p>Right-track μ (left track stays <strong>0.15</strong>).</p>
    <input type="range" id="mu" min="0.2" max="2.5" step="0.05" value="1.2" />
    <p class="readout">μ right = <span id="mu-read">1.20</span> · distinct tries <span id="mu-tries">0</span>/3</p>
    <div class="btn-row"><button type="button" class="btn primary" id="run" disabled>RUN</button></div>
    <p class="drag-hint"><span class="key-hint">HUD</span> shows live slide data on the 3D view.</p></div>`,
    { dock: "bottom", passThrough: false }
  );
  const muEl = document.getElementById("mu");
  const runBtn = document.getElementById("run");
  const updTries = () => {
    tried.add(Math.round(+muEl.value * 100) / 100);
    document.getElementById("mu-tries").textContent = String(Math.min(tried.size, 99));
    document.getElementById("mu-read").textContent = (+muEl.value).toFixed(2);
    runBtn.disabled = tried.size < 3;
  };
  muEl.addEventListener("input", updTries);
  updTries();

  const spinHud = () => {
    if (lastProgress) {
      const p = lastProgress;
      setViewportHud(
        `<div class="hud-readout">Left μ=0.15 | Right μ=${p.muRight.toFixed(2)} | x: L ${p.xL.toFixed(
          1
        )} m · R ${p.xR.toFixed(1)} m | v: ${p.vL.toFixed(2)} / ${p.vR.toFixed(2)} m/s</div>`
      );
    }
    rafId = requestAnimationFrame(spinHud);
  };

  const cleanup = () => {
    cancelAnimationFrame(rafId);
    setViewportHud("");
  };
  setInteractCleanup(cleanup);

  runBtn.onclick = () => {
    runBtn.disabled = true;
    const muRight = +muEl.value;
    lastProgress = { xL: -5, xR: -5, vL: 3.2, vR: 3.2, muRight, muLeft: 0.15 };
    spinHud();
    arena.startFrictionCompare({
      muLeft: 0.15,
      muRight,
      onProgress: (s) => {
        lastProgress = s;
      },
      onFinish: () => {
        cancelAnimationFrame(rafId);
        const p = lastProgress;
        clearOverlay();
        setViewportHud("");
        mountOverlay(
          `<div class="card lab-win-banner"><h2>Run finished</h2>
          <p class="scenario-box"><strong>High friction = shorter slide!</strong> The rougher track shed speed faster.</p>
          <p>Left stopped near <strong>${p.xL.toFixed(1)} m</strong> · Right near <strong>${p.xR.toFixed(1)} m</strong>.</p>
          <button type="button" class="btn primary" id="l4d0ok">Continue</button></div>`,
          { dock: "bottom", passThrough: false }
        );
        document.getElementById("l4d0ok").onclick = () => {
          cleanup();
          clearOverlay();
          completeCurrentSub();
          setCoach(t("adv.s0343"), "");
        };
      },
    });
  };
  wrapRestart(api, l4s0);
}

function l4s1(api) {
  const { arena, setCoach, mountOverlay, clearOverlay, completeCurrentSub, setInteractCleanup } = api;
  arena.playExample("glide", { speed: 2, frictionMu: 0.12 });
  setCoach(t("adv.s0129"), "");
  const visited = new Set();
  let rafId = 0;
  mountOverlay(
    `<div class="card"><h2>Surface feel</h2>
    <p>Roughness μ: <span id="muv">0.10</span> <span class="key-hint">0.00 - 2.0</span></p>
    <input type="range" id="glmu" min="0" max="2" step="0.02" value="0.1" />
    <p id="zoneprog" class="readout">Zones visited: 0 / 4</p>
    <button type="button" class="btn primary hidden" id="l41done">Lock in progress</button></div>`,
    { dock: "bottom", passThrough: false }
  );
  const glmu = document.getElementById("glmu");
  const tick = () => {
    const mu = +glmu.value;
    arena.setGlideFrictionMu(mu);
    document.getElementById("muv").textContent = mu.toFixed(2);
    visited.add(frictionZoneKey(mu));
    document.getElementById("zoneprog").textContent = `Zones visited: ${visited.size} / 4 (${[...visited].join(", ")})`;
    const sp = arena.rockVel.length();
    const dist = estStoppingDistanceMu(mu);
    const lbl = frictionSurfaceLabel(mu);
    setViewportHud(
      `<div class="hud-readout">μ=${mu.toFixed(2)} | ~stop dist ≈ ${dist.toFixed(1)} m | Type: ${lbl} | |v|=${sp.toFixed(
        2
      )}</div>`
    );
    if (visited.size >= 4) document.getElementById("l41done").classList.remove("hidden");
    rafId = requestAnimationFrame(tick);
  };
  rafId = requestAnimationFrame(tick);
  const cleanup = () => {
    cancelAnimationFrame(rafId);
    setViewportHud("");
  };
  setInteractCleanup(cleanup);
  document.getElementById("l41done").onclick = () => {
    if (visited.size < 4) return;
    cleanup();
    clearOverlay();
    completeCurrentSub();
    setCoach(t("adv.s0510"), "");
  };
  wrapRestart(api, l4s1);
}

function l4s2(api) {
  const { arena, setCoach, mountOverlay, clearOverlay, completeCurrentSub } = api;
  arena.playExample("frictionLoop", {});
  setCoach(t("adv.s0366"), "");
  mountOverlay(`<div class="card"><div id="l42z"></div></div>`, { dock: "bottom", passThrough: false });
  mountDragZones(document.getElementById("l42z"), {
    title: t("adv.s0164"),
    instructions: t("adv.s0382"),
    zones: [
      { id: "st1", label: t("adv.s0383"), accept: ["bef"] },
      { id: "st2", label: t("adv.s0384"), accept: ["book"] },
      { id: "ki1", label: t("adv.s0210"), accept: ["dur"] },
      { id: "ki2", label: t("adv.s0211"), accept: ["puck"] },
      { id: "ro1", label: t("adv.s0327"), accept: ["bike"] },
      { id: "ro2", label: t("adv.s0328"), accept: ["ball"] },
      { id: "fl1", label: t("adv.s0158"), accept: ["chute"] },
      { id: "fl2", label: t("adv.s0159"), accept: ["ship"] },
    ],
    chips: [
      { id: "bef", text: t("adv.s0049") },
      { id: "book", text: t("adv.s0058") },
      { id: "dur", text: t("adv.s0135") },
      { id: "puck", text: t("adv.s0304") },
      { id: "bike", text: t("adv.s0050") },
      { id: "ball", text: t("adv.s0043") },
      { id: "chute", text: t("adv.s0287") },
      { id: "ship", text: t("adv.s0352") },
      { id: "d1", text: t("adv.s0014") },
      { id: "d2", text: t("adv.s0493") },
    ],
    onDone: () => {
      clearOverlay();
      completeCurrentSub();
      setCoach(t("adv.s0380"), "");
    },
  });
  wrapRestart(api, l4s2);
}

function l4s3(api) {
  const { arena, setCoach, mountOverlay, clearOverlay } = api;
  arena.playExample("glide", { speed: 1.6, frictionMu: 0 });
  runChain(api, [
    (a, next) => {
      setCoach(t("adv.s0314"), "");
      mountOverlay(`<div class="card"><div id="r31"></div></div>`, { dock: "bottom", passThrough: false });
      mountRevealSteps(document.getElementById("r31"), {
        title: t("adv.s0069"),
        steps: [
          "Bicycle brakes squeeze rims or discs: kinetic friction turns motion into heat so you slow down.",
        ],
        scene: "glide",
        sceneArgs: { speed: 1.4, frictionMu: 0.3 },
        onDone: () => {
          clearOverlay();
          next();
        },
      });
    },
    (a, next, finish) => {
      kidMcq(
        a,
        {
          title: t("adv.s0435"),
          question: t("adv.s0417"),
          choices: ["Static friction only", "Kinetic (sliding) friction", "Magnetic lift"],
          okIndex: 1,
          coachShort: t("adv.s0362"),
        },
        next
      );
    },
    (a, next, finish) => {
      kidMcq(
        a,
        {
          title: t("adv.s0244"),
          question: t("adv.s0491"),
          choices: ["Too much normal force", "Not enough static friction grip", "Gravity shutting off"],
          okIndex: 1,
          coachShort: t("adv.s0225"),
        },
        next
      );
    },
    (a, _n, finish) => {
      kidMcq(
        a,
        {
          title: t("adv.s0106"),
          question: t("adv.s0436"),
          choices: ["Very low μ", "High μ for grip", "Zero air drag"],
          okIndex: 1,
          coachShort: t("adv.s0331"),
        },
        finish
      );
    },
  ]);
}

function l4s4(api) {
  const { setCoach, mountOverlay, clearOverlay, completeCurrentSub, arena } = api;
  setCoach(t("adv.s0333"), "");
  let lastP = { xL: -5, xR: -5, muLeft: 0.5, muRight: 0.85 };
  mountOverlay(
    `<div class="card"><h2>Dual-μ lab</h2><p>Left μ: <span id="muu">0.50</span> · Right is always +0.35 rougher.</p>
    <input type="range" id="mu1" min="0.05" max="1.65" step="0.05" value="0.5" />
    <button type="button" class="btn primary" id="r1">Run crates</button></div>`,
    { dock: "bottom", passThrough: false }
  );
  document.getElementById("mu1").oninput = () => {
    document.getElementById("muu").textContent = (+document.getElementById("mu1").value).toFixed(2);
  };
  document.getElementById("r1").onclick = () => {
    const mu = +document.getElementById("mu1").value;
    arena.startFrictionCompare({
      muLeft: mu,
      muRight: mu + 0.35,
      onProgress: (s) => {
        lastP = s;
        setViewportHud(
          `<div class="hud-readout">Left μ:${s.muLeft.toFixed(2)} → x ${s.xL.toFixed(1)} m | Right μ:${s.muRight.toFixed(
            2
          )} → x ${s.xR.toFixed(1)} m | v ${s.vL.toFixed(2)}/${s.vR.toFixed(2)} m/s</div>`
        );
      },
      onFinish: () => {
        clearOverlay();
        setViewportHud("");
        mountOverlay(
          `<div class="card"><h2>Brake designers</h2>
          <p class="scenario-box">Higher μ helps brakes grab without extra squeeze force.</p>
          <div id="l44dz"></div></div>`,
          { dock: "bottom", passThrough: false }
        );
        mountDragZones(document.getElementById("l44dz"), {
          title: t("adv.s0299"),
          instructions: t("adv.s0488"),
          zones: [{ id: "want", label: t("adv.s0303"), accept: ["hi"] }],
          chips: [
            { id: "hi", text: t("adv.s0187") },
            { id: "lo", text: t("adv.s0224") },
            { id: "mid", text: t("adv.s0509") },
          ],
          onDone: () => {
            clearOverlay();
            completeCurrentSub();
            setCoach(`Rougher track stopped near ${lastP.xR.toFixed(1)} m vs ${lastP.xL.toFixed(1)} m on the smoother lane.`, "");
          },
        });
      },
    });
  };
  wrapRestart(api, l4s4);
}

function l4s5(api) {
  const { arena, setCoach, mountOverlay, clearOverlay } = api;
  arena.playExample("forceCompare", {});
  runChain(api, [
    (a, next) => {
      setCoach(t("adv.s0342"), "");
      mountOverlay(
        `<div class="card"><h2>Rubber vs wood</h2>
        <p class="scenario-box">Wooden block μ≈0.4 and rubber block μ≈0.8 get the same shove on the same floor. Which grip grabs harder and stops first?</p>
        <div class="btn-row" id="pred5"></div></div>`,
        { dock: "bottom", passThrough: false }
      );
      const row = document.getElementById("pred5");
      ["Wooden block", "Rubber block", "Same time"].forEach((label, i) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "btn secondary";
        b.textContent = label;
        b.onclick = () => {
          if (i !== 1) {
            b.classList.add("wrong-pick");
            setTimeout(() => b.classList.remove("wrong-pick"), 500);
            return;
          }
          clearOverlay();
          next();
        };
        row.appendChild(b);
      });
    },
    (a, _n, finish) => {
      setCoach(t("adv.s0448"), "");
      arena.startFrictionCompare({
        muLeft: 0.4,
        muRight: 0.8,
        onProgress: (s) => {
          setViewportHud(
            `<div class="hud-readout">Wood μ=0.4 x=${s.xL.toFixed(1)} m | Rubber μ=0.8 x=${s.xR.toFixed(1)} m</div>`
          );
        },
        onFinish: () => {
          setViewportHud("");
          finish();
          setCoach(t("adv.s0238"), "");
        },
      });
    },
  ]);
}

function l4s6(api) {
  const { arena, setCoach, mountOverlay, clearOverlay, completeCurrentSub, setInteractCleanup } = api;
  arena.startFrictionPushLab();
  setCoach(t("adv.s0404"), "");
  mountOverlay(
    `<div class="card"><h2>Static limit hunt</h2>
    <p><span class="key-hint">W</span> +8 N · <span class="key-hint">S</span> −8 N · crate 20 kg, N=200 N, μ_s=0.5 → limit ≈100 N.</p>
    <p id="fp-read" class="readout"></p>
    <p class="drag-hint">HUD on canvas shows forces while you tune.</p></div>`,
    { dock: "bottom", passThrough: false }
  );

  const pressed = {};
  const onKeyDown = (e) => {
    if (pressed[e.key]) return;
    pressed[e.key] = true;
    if (e.key === "w" || e.key === "W") arena.adjustFrictionPushForce(8);
    if (e.key === "s" || e.key === "S") arena.adjustFrictionPushForce(-8);
  };
  const onKeyUp = (e) => {
    pressed[e.key] = false;
  };
  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);

  let raf = 0;
  const loop = () => {
    raf = requestAnimationFrame(loop);
    const st = arena.getFrictionPushState();
    if (!st) return;
    let status = "LOCKED - static friction matches your push";
    if (st.sliding) status = st.F < st.Fkinetic ? "SLIDING (slowing)" : "SLIDING";
    else if (st.F >= st.FstaticMax) status = "THRESHOLD";
    setViewportHud(
      `<div class="hud-readout">Applied: ${st.F.toFixed(
        0
      )} N | Static max: ${st.FstaticMax.toFixed(0)} N | Kinetic: ${st.Fkinetic.toFixed(0)} N | ${status}</div>`
    );
    document.getElementById("fp-read").textContent = `F = ${st.F} N · sliding=${st.sliding} · v=${st.v.toFixed(2)}`;
    if (st.sliding && st.F >= 100 && st.F <= 115 && st.v > 0.04) {
      doneWin();
    }
  };

  const cleanup = () => {
    cancelAnimationFrame(raf);
    document.removeEventListener("keydown", onKeyDown);
    document.removeEventListener("keyup", onKeyUp);
    setViewportHud("");
  };

  let finished = false;
  function doneWin() {
    if (finished) return;
    finished = true;
    cleanup();
    clearOverlay();
    completeCurrentSub();
    setCoach(t("adv.s0321"), "");
  }

  setInteractCleanup(() => {
    if (!finished) cleanup();
  });
  raf = requestAnimationFrame(loop);
  wrapRestart(api, l4s6);
}

function l4s7(api) {
  const { arena, setCoach, mountOverlay, clearOverlay } = api;
  runChain(api, [
    (a, next) => {
      setCoach(t("adv.s0242"), "");
      mountOverlay(`<div class="card"><div id="l47d"></div></div>`, { dock: "bottom", passThrough: false });
      mountDemoWithDwell(document.getElementById("l47d"), {
        minDwellMs: 4800,
        scene: "kickedBall",
        html: "<p>Ball slows because kinetic friction points opposite the roll.</p>",
        onContinue: () => {
          clearOverlay();
          next();
        },
      });
    },
    (a, next, finish) => {
      setCoach(t("adv.s0465"), "");
      arena.playExample("kickedBall", {});
      mountOverlay(`<div class="card"><div id="l47z"></div></div>`, { dock: "bottom", passThrough: false });
      mountDragZones(document.getElementById("l47z"), {
        title: t("adv.s0387"),
        instructions: t("adv.s0462"),
        zones: [{ id: "truth", label: t("adv.s0316"), accept: ["heat"] }],
        chips: [
          { id: "heat", text: t("adv.s0209") },
          { id: "runout", text: t("adv.s0243") },
          { id: "grav", text: t("adv.s0179") },
        ],
        onDone: () => {
          clearOverlay();
          next();
        },
      });
    },
    (a, _n, finish) => {
      kidMcq(
        a,
        {
          title: t("adv.s0174"),
          question: t("adv.s0278"),
          choices: ["Stop anyway", "Keep rolling at the same speed", "Speed up forever alone"],
          okIndex: 1,
          coachShort: t("adv.s0262"),
        },
        finish
      );
    },
  ]);
}

function l4s8(api) {
  const { arena, setCoach, mountOverlay, clearOverlay, completeCurrentSub } = api;
  arena.playExample("glide", { speed: 1.9, frictionMu: 0.25 });
  setCoach(t("adv.s0109"), "");
  mountOverlay(
    `<div class="card"><h2>Target friction force</h2>
    <p class="scenario-box">Floor μ = 0.4 locked. Find N so <strong>F = μ×N = 120 N</strong> (hint: N ≈ 300 N).</p>
    <p>N: <span id="nread">300</span> N</p>
    <input type="range" id="ns" min="50" max="500" step="5" value="200" />
    <p id="fshow" class="readout"></p>
    <button type="button" class="btn primary hidden" id="runf">Confirm on track</button></div>`,
    { dock: "bottom", passThrough: false }
  );
  const MU = 0.4;
  const ns = document.getElementById("ns");
  const sync = () => {
    const N = +ns.value;
    const f = MU * N;
    document.getElementById("nread").textContent = String(N);
    document.getElementById("fshow").textContent = `μN = ${f.toFixed(1)} N`;
    const ok = Math.abs(f - 120) <= 8;
    document.getElementById("runf").classList.toggle("hidden", !ok);
  };
  ns.addEventListener("input", sync);
  sync();
  document.getElementById("runf").onclick = () => {
    const N = +ns.value;
    clearOverlay();
    arena.startFrictionCompare({
      muLeft: MU,
      muRight: MU,
      onProgress: () => {
        setViewportHud(`<div class="hud-readout">μ=${MU} | N=${N} N | F_friction≈${(MU * N).toFixed(0)} N ✓</div>`);
      },
      onFinish: () => {
        setViewportHud("");
        completeCurrentSub();
        setCoach(t("adv.s0005"), "");
      },
    });
  };
  wrapRestart(api, l4s8);
}

function l4s9(api) {
  const { arena, setCoach } = api;
  arena.playExample("glide", { speed: 1.8, frictionMu: 0.2 });
  setCoach(t("adv.s0418"), "");
  const rs = document.getElementById("reward-slot");
  runChain(api, [
    (a, next) => {
      kidMcq(
        a,
        {
          title: t("adv.s0385"),
          question: t("adv.s0012"),
          choices: ["Zero - pushes balance friction", "Huge forward net", "Equal to weight"],
          okIndex: 0,
          coachShort: t("adv.s0089"),
        },
        next
      );
    },
    (a, next, finish) => {
      kidMcq(
        a,
        {
          title: t("adv.s0291"),
          question: t("adv.s0345"),
          choices: ["Static friction peak", "Kinetic friction while sliding", "They are always identical"],
          okIndex: 0,
          coachShort: t("adv.s0381"),
        },
        next
      );
    },
    (a, _n, finish) => {
      kidMcq(
        a,
        {
          title: t("adv.s0484"),
          question: t("adv.s0479"),
          choices: ["Rolling losses are tiny next to sliding", "Wheels remove weight", "Wheels delete gravity"],
          okIndex: 0,
          coachShort: t("adv.s0325"),
        },
        () => {
          if (rs) {
            rs.innerHTML = `<span class="badge-earned" title="Level reward">🛞 Grip Guru Badge Earned</span>`;
          }
          finish();
        }
      );
    },
  ]);
}

/* ========== Level 5: Net force ========== */
function runL5(api) {
  const subs = [l5s0, l5s1, l5s2, l5s3, l5s4, l5s5, l5s6, l5s7, l5s8, l5s9];
  subs[api.state.sub](api);
}

function l5s0(api) {
  const { arena, setCoach, mountOverlay, clearOverlay, completeCurrentSub, setInteractCleanup } = api;
  setCoach(t("adv.s0360"), "");
  arena.playExample("vector", { fx: 0.75, fy: 1.0 });
  mountOverlay(
    `<div class="card"><h2>Vector builder</h2>
    <p>Fx (−80…80) <input type="range" id="fx" min="-80" max="80" value="30" /></p>
    <p>Fy (−80…80) <input type="range" id="fy" min="-80" max="80" value="40" /></p>
    <p id="mag" class="readout"></p>
    <p>Match magnitude ≈ 50 N (±3)</p>
    <button type="button" class="btn primary" id="vm">Verify</button></div>`,
    { dock: "bottom", passThrough: false }
  );
  function cleanup() {
    setViewportHud("");
  }
  setInteractCleanup(cleanup);
  const u = () => {
    const x = +document.getElementById("fx").value;
    const y = +document.getElementById("fy").value;
    const m = Math.hypot(x, y);
    const th = (Math.atan2(y, x) * 180) / Math.PI;
    document.getElementById("mag").textContent = `|F| = ${m.toFixed(1)} N · θ = ${th.toFixed(0)}°`;
    arena.playExample("vector", { fx: x * 0.028, fy: y * 0.028 });
    setViewportHud(
      `<div class="hud-readout">Fx = ${x} N | Fy = ${y} N | |F| = ${m.toFixed(1)} N | θ = ${th.toFixed(0)}°</div>`
    );
  };
  document.getElementById("fx").oninput = u;
  document.getElementById("fy").oninput = u;
  u();
  document.getElementById("vm").onclick = () => {
    const x = +document.getElementById("fx").value;
    const y = +document.getElementById("fy").value;
    const m = Math.hypot(x, y);
    if (Math.abs(m - 50) < 3) {
      cleanup();
      clearOverlay();
      completeCurrentSub();
      setCoach(t("adv.s0292"), "");
    }
  };
  wrapRestart(api, l5s0);
}

function l5s1(api) {
  const { arena, setCoach, mountOverlay, clearOverlay, completeCurrentSub, setInteractCleanup } = api;
  arena.startEquilibriumBoxLab();
  setCoach(t("adv.s0042"), "");
  let balanceCount = 0;
  const signatures = new Set();
  mountOverlay(
    `<div class="card"><h2>Forces on a crate (1D)</h2>
    <p>Left rope (0-200 N) <input type="range" id="fl" min="0" max="200" value="100" /></p>
    <p>Right rope (0-200 N) <input type="range" id="fr" min="0" max="200" value="100" /></p>
    <p id="bal" class="readout"></p>
    <p>Unique balances: <span id="bc">0</span>/3</p></div>`,
    { dock: "bottom", passThrough: false }
  );
  function cleanup() {
    setViewportHud("");
  }
  setInteractCleanup(cleanup);
  const tick = () => {
    const fl = +document.getElementById("fl").value;
    const fr = +document.getElementById("fr").value;
    arena.setEquilibriumForces(fl, fr);
    const net = fr - fl;
    let label = "NET →";
    if (net < -5) label = "← NET";
    if (Math.abs(net) <= 5) label = "EQUILIBRIUM";
    document.getElementById("bal").textContent = `Left: ${fl} N ← | → Right: ${fr} N · Net: ${net} N`;
    setViewportHud(`<div class="hud-readout">Left: ${fl} N | Right: ${fr} N | Net: ${net} N | ${label}</div>`);
    if (Math.abs(net) <= 5) {
      const sig = `${Math.round(fl / 15)}-${Math.round(fr / 15)}`;
      if (!signatures.has(sig)) {
        signatures.add(sig);
        balanceCount++;
        document.getElementById("bc").textContent = String(balanceCount);
      }
      if (balanceCount >= 3) {
        cleanup();
        clearOverlay();
        completeCurrentSub();
        setCoach(t("adv.s0319"), "");
      }
    }
  };
  document.getElementById("fl").oninput = tick;
  document.getElementById("fr").oninput = tick;
  tick();
  wrapRestart(api, l5s1);
}

function l5s2(api) {
  const { arena, setCoach, mountOverlay, clearOverlay, completeCurrentSub } = api;
  arena.playExample("vector", { fx: 1.2, fy: 0.2 });
  setCoach(t("adv.s0140"), "");
  mountOverlay(`<div class="card"><div id="l52z"></div></div>`, { dock: "bottom", passThrough: false });
  mountDragZones(document.getElementById("l52z"), {
    title: t("adv.s0252"),
    instructions: t("adv.s0392"),
    zones: [
      { id: "p10", label: t("adv.s0250"), accept: ["a"] },
      { id: "m7", label: t("adv.s0258"), accept: ["b"] },
      { id: "z0", label: t("adv.s0251"), accept: ["c"] },
    ],
    chips: [
      { id: "a", text: t("adv.s0003") },
      { id: "b", text: t("adv.s0002") },
      { id: "c", text: t("adv.s0004") },
      { id: "d1", text: t("adv.s0107") },
    ],
    onDone: () => {
      clearOverlay();
      completeCurrentSub();
      setCoach(t("adv.s0285"), "");
    },
  });
  wrapRestart(api, l5s2);
}

function l5s3(api) {
  const { setCoach, mountOverlay, clearOverlay } = api;
  runChain(api, [
    (a, next) => {
      setCoach(t("adv.s0453"), "");
      mountOverlay(`<div class="card"><div id="l53m"></div></div>`, { dock: "bottom", passThrough: false });
      mountMotionChain(document.getElementById("l53m"), {
        title: t("adv.s0428"),
        beats: [
          {
            scene: "tugOfWar",
            sceneArgs: { left: 2.2, right: 3.4, snapshot: true },
            dwellMs: 2800,
            html: "<p><strong>Right crew wins</strong> - blue crate team pulls harder; knot sits to the right.</p>",
          },
          {
            scene: "tugOfWar",
            sceneArgs: { left: 2.8, right: 2.8, snapshot: true },
            dwellMs: 2800,
            html: "<p><strong>Matched pulls</strong> - equal arrows; knot hovers near center.</p>",
          },
          {
            scene: "tugOfWar",
            sceneArgs: { left: 3.6, right: 2.0, snapshot: true },
            dwellMs: 2800,
            html: "<p><strong>Left crew wins</strong> - knot parked left; orange team loses ground.</p>",
          },
        ],
        onDone: () => {
          clearOverlay();
          next();
        },
      });
    },
    (a, next) => {
      kidMcq(
        a,
        {
          title: t("adv.s0256"),
          question: t("adv.s0390"),
          choices: ["Right", "Left", "There is never a net on a rope"],
          okIndex: 0,
          coachShort: t("adv.s0391"),
        },
        next
      );
    },
    (a, next) => {
      mountOverlay(
        `<div class="card"><h2>Find balance</h2>
        <p>Your left pull (0-400 N) <input type="range" id="tl" min="0" max="400" value="180" /></p>
        <p>Right-side cousins hold <strong>300 N</strong>. Slide until the HUD claims a tie.</p>
        <p id="tss" class="readout"></p></div>`,
        { dock: "bottom", passThrough: false }
      );
      a.arena.startTugOfWarInteractive({ rightN: 300 });
      const go = () => {
        const L = +document.getElementById("tl").value;
        a.arena.setTugLeftForce(L);
        const net = L - 300;
        document.getElementById("tss").textContent = `Net ≈ ${net} N`;
        setViewportHud(`<div class="hud-readout">Left: ${L} N | Right: 300 N | Net: ${net} N</div>`);
        if (Math.abs(net) <= 20) {
          setViewportHud("");
          clearOverlay();
          next();
        }
      };
      document.getElementById("tl").oninput = go;
      go();
    },
    (a, _n, finish) => {
      kidMcq(
        a,
        {
          title: t("adv.s0113"),
          question: t("adv.s0253"),
          choices: ["Backward", "Forward with the net force", "Straight up"],
          okIndex: 1,
          coachShort: t("adv.s0259"),
        },
        finish
      );
    },
  ]);
}

function l5s4(api) {
  const { arena, setCoach, mountOverlay, clearOverlay } = api;
  arena.playExample("elevator", {});
  runChain(api, [
    (a, next) => {
      setCoach(t("adv.s0320"), "");
      mountOverlay(
        `<div class="card"><h2>Accelerating upward</h2>
        <p class="scenario-box">The elevator cab speeds <strong>upward</strong> while you stand on a scale.</p>
        <div class="btn-row" id="e41"></div></div>`,
        { dock: "bottom", passThrough: false }
      );
      const labels = ["Scale reads less than true weight", "Scale reads more than true weight", "Scale always reads zero"];
      const row = document.getElementById("e41");
      labels.forEach((label, i) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "btn secondary";
        b.textContent = label;
        b.onclick = () => {
          if (i !== 1) {
            b.classList.add("wrong-pick");
            setTimeout(() => b.classList.remove("wrong-pick"), 450);
            return;
          }
          clearOverlay();
          next();
        };
        row.appendChild(b);
      });
    },
    (a, _n, finish) => {
      mountOverlay(
        `<div class="card"><h2>Slowing while moving up</h2>
        <p class="scenario-box">The same lift <strong>slows down</strong> while still moving upward toward a stop.</p>
        <div class="btn-row" id="e42"></div></div>`,
        { dock: "bottom", passThrough: false }
      );
      setCoach(t("adv.s0363"), "");
      const labels = ["Scale still reads heavier than normal", "Scale dips below true weight briefly", "Scale must break"];
      const row = document.getElementById("e42");
      labels.forEach((label, i) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "btn secondary";
        b.textContent = label;
        b.onclick = () => {
          if (i !== 1) {
            b.classList.add("wrong-pick");
            setTimeout(() => b.classList.remove("wrong-pick"), 450);
            return;
          }
          clearOverlay();
          finish();
          setCoach(t("adv.s0033"), "");
        };
        row.appendChild(b);
      });
    },
  ]);
}

function l5s5(api) {
  const { arena, setCoach, mountOverlay, clearOverlay, completeCurrentSub } = api;
  arena.setRampVisual(25);
  setCoach(t("adv.s0441"), "");
  const G = 10;
  mountOverlay(
    `<div class="card"><h2>Ramp component lab</h2>
    <p>θ: <span id="ta">25</span>° <input type="range" id="th" min="0" max="60" value="25" /></p>
    <p>Mass (kg): <span id="mk">8</span> <input type="range" id="mass" min="1" max="20" value="8" /></p>
    <p id="rp" class="readout"></p>
    <p>Goal: make <strong>parallel = 40 N</strong> (±2 N).</p>
    <button type="button" class="btn primary hidden" id="rv">Verify match</button></div>`,
    { dock: "bottom", passThrough: false }
  );
  const sync = () => {
    const th = (+document.getElementById("th").value * Math.PI) / 180;
    const m = +document.getElementById("mass").value;
    document.getElementById("ta").textContent = document.getElementById("th").value;
    document.getElementById("mk").textContent = String(m);
    arena.setRampVisual((th * 180) / Math.PI);
    const parallel = m * G * Math.sin(th);
    const normal = m * G * Math.cos(th);
    document.getElementById("rp").textContent = `Parallel = ${parallel.toFixed(1)} N · Normal = ${normal.toFixed(1)} N`;
    setViewportHud(
      `<div class="hud-readout">m=${m} kg | g=${G} | θ=${((th * 180) / Math.PI).toFixed(0)}° | ∥=${parallel.toFixed(
        1
      )} N | ⟂=${normal.toFixed(1)} N</div>`
    );
    const ok = Math.abs(parallel - 40) <= 2;
    document.getElementById("rv").classList.toggle("hidden", !ok);
  };
  document.getElementById("th").oninput = sync;
  document.getElementById("mass").oninput = sync;
  sync();
  document.getElementById("rv").onclick = () => {
    clearOverlay();
    completeCurrentSub();
    setViewportHud("");
    setCoach(t("adv.s0085"), "");
  };
  wrapRestart(api, l5s5);
}

function l5s6(api) {
  const { arena, setCoach, mountOverlay, clearOverlay, completeCurrentSub, setInteractCleanup } = api;
  arena.playExample("elevator", {});
  setCoach(t("adv.s0518"), "");
  let a = 0;
  const m = 70;
  const g = 10;
  const wTrue = m * g;
  const target = 1050;
  mountOverlay(
    `<div class="card"><h2>Apparent weight lab</h2>
    <p>True weight ${wTrue} N - tune acceleration until the scale reads <strong>1050 N</strong> (≈50% extra).</p>
    <p class="drag-hint"><span class="key-hint">↑</span> <span class="key-hint">↓</span> <span class="key-hint">Space</span></p>
    <p id="ar" class="readout"></p></div>`,
    { dock: "bottom", passThrough: false }
  );
  const onDown = (e) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      a = Math.min(8, a + 0.5);
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      a = Math.max(-8, a - 0.5);
    }
    if (e.code === "Space") {
      e.preventDefault();
      a = 0;
    }
  };
  document.addEventListener("keydown", onDown);
  let raf = 0;
  const loop = () => {
    raf = requestAnimationFrame(loop);
    const scale = m * (g + a);
    setViewportHud(
      `<div class="hud-readout">a = ${a.toFixed(1)} m/s² | True weight: ${wTrue} N | Scale: ${scale.toFixed(0)} N</div>`
    );
    document.getElementById("ar").textContent = `a = ${a.toFixed(2)} m/s² · Scale = ${scale.toFixed(0)} N`;
    if (Math.abs(scale - target) <= 25) done();
  };
  function cleanup() {
    cancelAnimationFrame(raf);
    document.removeEventListener("keydown", onDown);
    setViewportHud("");
  }
  let finished = false;
  function done() {
    if (finished) return;
    finished = true;
    cleanup();
    clearOverlay();
    completeCurrentSub();
    setCoach(t("adv.s0438"), "");
  }
  setInteractCleanup(() => {
    if (!finished) cleanup();
  });
  raf = requestAnimationFrame(loop);
  wrapRestart(api, l5s6);
}

function l5s7(api) {
  const { arena, setCoach, mountOverlay, clearOverlay } = api;
  runChain(api, [
    (a, next) => {
      setCoach(t("adv.s0087"), "");
      mountOverlay(`<div class="card"><div id="l57d"></div></div>`, { dock: "bottom", passThrough: false });
      mountDemoWithDwell(document.getElementById("l57d"), {
        minDwellMs: 4500,
        scene: "glide",
        sceneArgs: { speed: 1.5, frictionMu: 0 },
        html: "<p>Steady glide can mean <strong>zero net force</strong> along the lane.</p>",
        onContinue: () => {
          clearOverlay();
          next();
        },
      });
    },
    (a, next) => {
      arena.playExample("glide", { speed: 1.5, frictionMu: 0 });
      let hudRf = 0;
      const spinHud = () => {
        setViewportHud(`<div class="hud-readout">Speed: steady | Net along track: 0 N (model)</div>`);
        hudRf = requestAnimationFrame(spinHud);
      };
      hudRf = requestAnimationFrame(spinHud);
      mountOverlay(`<div class="card"><div id="l57z"></div></div>`, { dock: "bottom", passThrough: false });
      mountDragZones(document.getElementById("l57z"), {
        title: t("adv.s0246"),
        instructions: t("adv.s0463"),
        zones: [{ id: "ok", label: t("adv.s0425"), accept: ["b"] }],
        chips: [
          { id: "a", text: t("adv.s0013") },
          { id: "b", text: t("adv.s0494") },
          { id: "c", text: t("adv.s0170") },
        ],
        onDone: () => {
          cancelAnimationFrame(hudRf);
          setViewportHud("");
          clearOverlay();
          next();
        },
      });
    },
    (a, _n, finish) => {
      kidMcq(
        a,
        {
          title: t("adv.s0235"),
          question: t("adv.s0496"),
          choices: ["It must stand still forever", "Zero acceleration (velocity can stay flat)", "Mass disappears"],
          okIndex: 1,
          coachShort: t("adv.s0507"),
        },
        finish
      );
    },
  ]);
}

function l5s8(api) {
  const { arena, setCoach, mountOverlay, clearOverlay, completeCurrentSub, setInteractCleanup } = api;
  arena.playExample("vector", { fx: 0.2, fy: 0.2 });
  setCoach(t("adv.s0231"), "");
  let step = 1;
  mountOverlay(
    `<div class="card"><h2>Vector targets</h2>
    <p id="stlab">Mission 1: <strong>10 N</strong> at <strong>37°</strong> above +x (try Fx≈8, Fy≈6).</p>
    <p>Fx <input type="range" id="jx" min="-200" max="200" value="0" /></p>
    <p>Fy <input type="range" id="jy" min="-200" max="200" value="0" /></p>
    <p id="jrd" class="readout"></p>
    <button type="button" class="btn primary" id="jv">Check mission</button></div>`,
    { dock: "bottom", passThrough: false }
  );
  function cleanup() {
    setViewportHud("");
  }
  setInteractCleanup(cleanup);
  const paint = () => {
    const x = +document.getElementById("jx").value;
    const y = +document.getElementById("jy").value;
    const mag = Math.hypot(x, y);
    const ang = (Math.atan2(y, x) * 180) / Math.PI;
    document.getElementById("jrd").textContent = `|F|=${mag.toFixed(1)} N · θ=${ang.toFixed(1)}°`;
    arena.playExample("vector", { fx: x * 0.025, fy: y * 0.025 });
    setViewportHud(`<div class="hud-readout">Fx=${x} | Fy=${y} | |F|=${mag.toFixed(1)} | θ=${ang.toFixed(0)}°</div>`);
  };
  document.getElementById("jx").oninput = paint;
  document.getElementById("jy").oninput = paint;
  paint();
  document.getElementById("jv").onclick = () => {
    const x = +document.getElementById("jx").value;
    const y = +document.getElementById("jy").value;
    const mag = Math.hypot(x, y);
    const ang = (Math.atan2(y, x) * 180) / Math.PI;
    if (step === 1) {
      if (Math.abs(mag - 10) > 1.5 || Math.abs(ang - 37) > 4) return;
      step = 2;
      document.getElementById("stlab").innerHTML =
        "Mission 2: <strong>13 N</strong> at <strong>67°</strong> - try Fx≈5, Fy≈12.";
      return;
    }
    if (Math.abs(mag - 13) > 1.5 || Math.abs(ang - 67) > 4) return;
    cleanup();
    clearOverlay();
    completeCurrentSub();
    setCoach(t("adv.s0046"), "");
  };
  wrapRestart(api, l5s8);
}

function l5s9(api) {
  const { arena, setCoach } = api;
  arena.playExample("vector", { fx: 1.4, fy: 0.5 });
  const rs = document.getElementById("reward-slot");
  runChain(api, [
    (a, next) => {
      kidMcq(
        a,
        {
          title: t("adv.s0188"),
          question: t("adv.s0011"),
          choices: ["Points forward from inertia", "Is zero (forces around it cancel)", "Equals engine power only"],
          okIndex: 1,
          coachShort: t("adv.s0090"),
        },
        next
      );
    },
    (a, next) => {
      kidMcq(
        a,
        {
          title: t("adv.s0368"),
          question: t("adv.s0336"),
          choices: ["Backward", "Forward", "Straight up"],
          okIndex: 1,
          coachShort: t("adv.s0163"),
        },
        next
      );
    },
    (a, _n, finish) => {
      kidMcq(
        a,
        {
          title: t("adv.s0067"),
          question: t("adv.s0471"),
          choices: ["Object at rest on a table", "Object moving in a circle at steady speed", "Object drifting at constant velocity with no turning"],
          okIndex: 1,
          coachShort: t("adv.s0430"),
        },
        () => {
          if (rs) rs.innerHTML = `<span class="badge-earned">⚖️ Balance Boss Badge</span>`;
          finish();
        }
      );
    },
  ]);
}

/* ========== Level 6: Ramps ========== */
function runL6(api) {
  const subs = [l6s0, l6s1, l6s2, l6s3, l6s4, l6s5, l6s6, l6s7, l6s8, l6s9];
  subs[api.state.sub](api);
}

function l6s0(api) {
  const { arena, setCoach, mountOverlay, clearOverlay, completeCurrentSub, setInteractCleanup } = api;
  const M = 10;
  const G = 10;
  setCoach(t("adv.s0393"), "");
  let lo = 100;
  let hi = 0;
  mountOverlay(
    `<div class="card"><h2>Ramp components (observe)</h2>
    <p>Block model mass fixed at <strong>${M} kg</strong>, g = ${G} N/kg.</p>
    <p>θ = <span id="ang">20</span>°</p>
    <input type="range" id="theta" min="5" max="55" value="20" />
    <p class="drag-hint">Drag from low to high θ so the slider visits both ends - then the lock appears.</p>
    <button type="button" class="btn primary hidden" id="lock">Lock in θ ≥ 35°</button></div>`,
    { dock: "bottom", passThrough: false }
  );
  const lockBtn = document.getElementById("lock");
  function cleanup() {
    setViewportHud("");
  }
  setInteractCleanup(cleanup);
  const u = () => {
    const t = +document.getElementById("theta").value;
    document.getElementById("ang").textContent = String(t);
    lo = Math.min(lo, t);
    hi = Math.max(hi, t);
    const swept = lo <= 7 && hi >= 53;
    lockBtn.classList.toggle("hidden", !swept);
    arena.setRampVisual(t);
    const rad = (t * Math.PI) / 180;
    const ps = M * G * Math.sin(rad);
    const nc = M * G * Math.cos(rad);
    setViewportHud(
      `<div class="hud-readout">θ=${t}° | mg·sinθ=${ps.toFixed(1)} N (‖ ramp) | mg·cosθ=${nc.toFixed(1)} N (normal)</div>`
    );
  };
  document.getElementById("theta").oninput = u;
  u();
  lockBtn.onclick = () => {
    if (+document.getElementById("theta").value < 35) return;
    cleanup();
    clearOverlay();
    completeCurrentSub();
    setCoach(t("adv.s0501"), "");
  };
  wrapRestart(api, l6s0);
}

function l6s1(api) {
  const { arena, setCoach, mountOverlay, clearOverlay, completeCurrentSub, setInteractCleanup } = api;
  setCoach(t("adv.s0370"), "");
  const G = 10;
  const labeled = { mg: false, n: false, p: false };
  mountOverlay(
    `<div class="card"><h2>Three forces on the block</h2>
    <p>θ <span id="t6">30</span>° <input type="range" id="th6" min="5" max="55" value="30" /></p>
    <p>Mass (kg) <span id="m6">5</span> <input type="range" id="mk6" min="1" max="18" value="5" /></p>
    <p id="r61" class="readout"></p>
    <div class="btn-row">
      <button type="button" class="btn secondary" id="bmg">Weight mg (down)</button>
      <button type="button" class="btn secondary" id="bn">Normal (⊥ ramp)</button>
      <button type="button" class="btn secondary" id="bp">Parallel mg·sinθ</button>
    </div></div>`,
    { dock: "bottom", passThrough: false }
  );
  function sync() {
    const th = +document.getElementById("th6").value;
    const m = +document.getElementById("mk6").value;
    document.getElementById("t6").textContent = String(th);
    document.getElementById("m6").textContent = String(m);
    const rad = (th * Math.PI) / 180;
    const w = m * G;
    const para = m * G * Math.sin(rad);
    const norm = m * G * Math.cos(rad);
    document.getElementById("r61").textContent = `Weight ${w} N · Parallel ∥ ${para.toFixed(1)} N · Normal ${norm.toFixed(1)} N`;
    arena.playExample("ramp", { angleDeg: th, massKg: m, frictionMu: null });
    setViewportHud(
      `<div class="hud-readout">θ=${th}° | m=${m} kg | mg=${w} N | ∥=${para.toFixed(1)} N | N=${norm.toFixed(1)} N</div>`
    );
  }
  document.getElementById("th6").oninput = sync;
  document.getElementById("mk6").oninput = sync;
  sync();
  function mark(btn, key) {
    labeled[key] = true;
    btn.classList.add("correct-pick");
    if (labeled.mg && labeled.n && labeled.p) {
      cleanup();
      clearOverlay();
      completeCurrentSub();
      setCoach(t("adv.s0459"), "");
    }
  }
  function cleanup() {
    setViewportHud("");
  }
  setInteractCleanup(cleanup);
  document.getElementById("bmg").onclick = function () {
    mark(this, "mg");
  };
  document.getElementById("bn").onclick = function () {
    mark(this, "n");
  };
  document.getElementById("bp").onclick = function () {
    mark(this, "p");
  };
  wrapRestart(api, l6s1);
}

function l6s2(api) {
  const { arena, setCoach, mountOverlay, clearOverlay, completeCurrentSub } = api;
  arena.playExample("ramp", { angleDeg: 28, massKg: 6, frictionMu: null });
  setCoach(t("adv.s0284"), "");
  mountOverlay(`<div class="card"><div id="l62o"></div></div>`, { dock: "bottom", passThrough: false });
  mountOrderRail(document.getElementById("l62o"), {
    items: [
      { id: "a", html: "<strong>Normal</strong> balances the perpendicular part of weight" },
      { id: "b", html: "<strong>Parallel</strong> component is unbalanced downhill" },
      { id: "c", html: "Block <strong>accelerates</strong> along the ramp" },
      { id: "d", html: "<strong>Friction</strong> (if present) fights motion along the ramp" },
    ],
    correctIds: ["a", "b", "c", "d"],
    onDone: () => {
      clearOverlay();
      completeCurrentSub();
      setCoach(t("adv.s0078"), "");
    },
  });
  wrapRestart(api, l6s2);
}

function l6s3(api) {
  const { arena, setCoach, mountOverlay, clearOverlay } = api;
  arena.playExample("ramp", { angleDeg: 32, frictionMu: null });
  runChain(api, [
    (a, next) => {
      setCoach(t("adv.s0045"), "");
      mountOverlay(`<div class="card"><div id="l63r"></div></div>`, { dock: "bottom", passThrough: false });
      mountRevealSteps(document.getElementById("l63r"), {
        title: t("adv.s0190"),
        steps: [
          "Mountain roads use switchbacks so each segment tilts less - smaller sin θ along the pavement.",
        ],
        scene: "ramp",
        sceneArgs: { angleDeg: 22, massKg: 8, frictionMu: null },
        onDone: () => {
          clearOverlay();
          next();
        },
      });
    },
    (a, next) => {
      kidMcq(
        a,
        {
          title: t("adv.s0084"),
          question: t("adv.s0394"),
          choices: ["Parallel-to-road component", "Your car’s paint color", "Earth’s total mass"],
          okIndex: 0,
          coachShort: t("adv.s0175"),
        },
        next
      );
    },
    (a, next) => {
      mountOverlay(`<div class="card"><div id="l63r2"></div></div>`, { dock: "bottom", passThrough: false });
      mountRevealSteps(document.getElementById("l63r2"), {
        title: t("adv.s0301"),
        steps: ["Steeper slides aim more weight parallel to the slide - you speed up faster."],
        scene: "ramp",
        sceneArgs: { angleDeg: 45, massKg: 5, frictionMu: null },
        onDone: () => {
          clearOverlay();
          next();
        },
      });
    },
    (a, next) => {
      kidMcq(
        a,
        {
          title: t("adv.s0356"),
          question: t("adv.s0482"),
          choices: ["Larger parallel weight component", "Gravity turns off", "Normal doubles forever"],
          okIndex: 0,
          coachShort: t("adv.s0051"),
        },
        next
      );
    },
    (a, _n, finish) => {
      mountOverlay(`<div class="card"><div id="l63r3"></div></div>`, { dock: "bottom", passThrough: false });
      mountRevealSteps(document.getElementById("l63r3"), {
        title: t("adv.s0181"),
        steps: ["Skate arcs trade height for speed - parallel gravity does work while you drop."],
        scene: "ramp",
        sceneArgs: { angleDeg: 35, massKg: 7, frictionMu: null },
        onDone: () => {
          clearOverlay();
          finish();
          setCoach(t("adv.s0105"), "");
        },
      });
    },
  ]);
}

function l6s4(api) {
  const { arena, setCoach, mountOverlay, clearOverlay, completeCurrentSub } = api;
  const MU = 0.4;
  const G = 10;
  setCoach(t("adv.s0429"), "");
  mountOverlay(
    `<div class="card"><h2>Ramp equilibrium hunt</h2>
    <p>θ <span id="l64t">22</span>° <input type="range" id="l64th" min="5" max="45" value="22" /></p>
    <p>Mass (kg) <span id="l64m">5</span> <input type="range" id="l64mk" min="2" max="12" value="5" /></p>
    <p><label><input type="checkbox" id="l64fr" /> Rough ramp (μ<sub>s</sub>=0.4)</label></p>
    <p id="l64rd" class="readout"></p>
    <button type="button" class="btn primary hidden" id="l64go">Lock equilibrium</button></div>`,
    { dock: "bottom", passThrough: false }
  );
  const goalDeg = (Math.atan(MU) * 180) / Math.PI;
  function sync() {
    const th = +document.getElementById("l64th").value;
    const m = +document.getElementById("l64mk").value;
    const fr = document.getElementById("l64fr").checked;
    document.getElementById("l64t").textContent = String(th);
    document.getElementById("l64m").textContent = String(m);
    const rad = (th * Math.PI) / 180;
    const para = m * G * Math.sin(rad);
    const norm = m * G * Math.cos(rad);
    const fk = fr ? MU * norm : 0;
    const net = fr ? para - fk : para;
    document.getElementById("l64rd").textContent = `∥=${para.toFixed(1)} N | N=${norm.toFixed(
      1
    )} N | μN=${fk.toFixed(1)} N | Net‖≈${net.toFixed(1)} N`;
    arena.playExample("ramp", { angleDeg: th, massKg: m, frictionMu: fr ? MU : null });
    setViewportHud(
      `<div class="hud-readout">m=${m} kg | θ=${th}° | ∥=${para.toFixed(1)} N | N=${norm.toFixed(1)} N | μN=${fk.toFixed(
        1
      )} N</div>`
    );
    const ok = fr && Math.abs(th - goalDeg) <= 2.2;
    document.getElementById("l64go").classList.toggle("hidden", !ok);
  }
  document.getElementById("l64th").oninput = sync;
  document.getElementById("l64mk").oninput = sync;
  document.getElementById("l64fr").onchange = sync;
  sync();
  document.getElementById("l64go").onclick = () => {
    clearOverlay();
    setViewportHud("");
    completeCurrentSub();
    setCoach(t("adv.s0039"), "");
  };
  wrapRestart(api, l6s4);
}

function l6s5(api) {
  const { arena, setCoach, mountOverlay, clearOverlay } = api;
  const MU = 0.4;
  runChain(api, [
    (a, next) => {
      setCoach(t("adv.s0512"), "");
      mountOverlay(
        `<div class="card"><h2>Hill prediction A</h2>
        <p class="scenario-box">Wooden block on a rough ramp, θ = <strong>20°</strong>, μ<sub>s</sub> = 0.4. Does it slide?</p>
        <div class="btn-row" id="l65a"></div></div>`,
        { dock: "bottom", passThrough: false }
      );
      ["No - tan θ &lt; μ", "Yes - always slides", "Only with wind"].forEach((label, i) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "btn secondary";
        b.innerHTML = label;
        b.onclick = () => {
          if (i !== 0) {
            b.classList.add("wrong-pick");
            setTimeout(() => b.classList.remove("wrong-pick"), 450);
            return;
          }
          clearOverlay();
          next();
        };
        document.getElementById("l65a").appendChild(b);
      });
    },
    (a, next) => {
      arena.playExample("ramp", { angleDeg: 20, massKg: 6, frictionMu: MU });
      setViewportHud(`<div class="hud-readout">θ=20° | tanθ≈0.36 &lt; μ=0.4 - stays put (model)</div>`);
      mountOverlay(
        `<div class="card"><p>Canvas: block should stick near the top.</p>
        <button type="button" class="btn primary" id="l65n1">Continue</button></div>`,
        { dock: "bottom", passThrough: false }
      );
      document.getElementById("l65n1").onclick = () => {
        setViewportHud("");
        clearOverlay();
        next();
      };
    },
    (a, next) => {
      mountOverlay(
        `<div class="card"><h2>Hill prediction B</h2>
        <p class="scenario-box">Same μ, now θ = <strong>30°</strong>. tan 30° ≈ 0.58.</p>
        <div class="btn-row" id="l65b"></div></div>`,
        { dock: "bottom", passThrough: false }
      );
      ["No slide", "Yes - should break loose and go", "Only at night"].forEach((label, i) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "btn secondary";
        b.textContent = label;
        b.onclick = () => {
          if (i !== 1) {
            b.classList.add("wrong-pick");
            setTimeout(() => b.classList.remove("wrong-pick"), 450);
            return;
          }
          clearOverlay();
          next();
        };
        document.getElementById("l65b").appendChild(b);
      });
    },
    (a, _n, finish) => {
      arena.playExample("ramp", { angleDeg: 30, massKg: 6, frictionMu: MU });
      setViewportHud(`<div class="hud-readout">θ=30° | tanθ&gt;μ - downhill slide in the scene</div>`);
      mountOverlay(
        `<div class="card"><p>Watch it travel - parallel pull beat static friction.</p>
        <button type="button" class="btn primary" id="l65done">Done</button></div>`,
        { dock: "bottom", passThrough: false }
      );
      document.getElementById("l65done").onclick = () => {
        setViewportHud("");
        clearOverlay();
        finish();
        setCoach(t("adv.s0083"), "");
      };
    },
  ]);
}

function l6s6(api) {
  const { arena, setCoach, mountOverlay, clearOverlay, completeCurrentSub } = api;
  const G = 10;
  setCoach(t("adv.s0108"), "");
  mountOverlay(
    `<div class="card"><h2>Dual targets</h2>
    <p>θ <span id="l66t">53</span>° <input type="range" id="l66th" min="20" max="70" value="53" /></p>
    <p>m (kg) <span id="l66m">5</span> <input type="range" id="l66mk" min="2" max="14" step="0.5" value="5" /></p>
    <p id="l66r" class="readout"></p>
    <button type="button" class="btn primary hidden" id="l66v">Match both</button></div>`,
    { dock: "bottom", passThrough: false }
  );
  function sync() {
    const th = +document.getElementById("l66th").value;
    const m = +document.getElementById("l66mk").value;
    document.getElementById("l66t").textContent = String(th);
    document.getElementById("l66m").textContent = String(m);
    const rad = (th * Math.PI) / 180;
    const para = m * G * Math.sin(rad);
    const norm = m * G * Math.cos(rad);
    document.getElementById("l66r").textContent = `Parallel ${para.toFixed(1)} N · Normal ${norm.toFixed(1)} N`;
    arena.playExample("ramp", { angleDeg: th, massKg: m, frictionMu: null });
    setViewportHud(`<div class="hud-readout">∥=${para.toFixed(1)} N | N=${norm.toFixed(1)} N | m=${m} kg | θ=${th}°</div>`);
    const ok = Math.abs(para - 40) <= 1.8 && Math.abs(norm - 30) <= 1.8;
    document.getElementById("l66v").classList.toggle("hidden", !ok);
  }
  document.getElementById("l66th").oninput = sync;
  document.getElementById("l66mk").oninput = sync;
  sync();
  document.getElementById("l66v").onclick = () => {
    clearOverlay();
    setViewportHud("");
    completeCurrentSub();
    setCoach(t("adv.s0036"), "");
  };
  wrapRestart(api, l6s6);
}

function l6s7(api) {
  const { arena, setCoach, mountOverlay, clearOverlay } = api;
  runChain(api, [
    (a, next) => {
      setCoach(t("adv.s0386"), "");
      mountOverlay(`<div class="card"><div id="l67d"></div></div>`, { dock: "bottom", passThrough: false });
      let hudr = 0;
      const spin = () => {
        const th = 38;
        const m = 6;
        const G = 10;
        const rad = (th * Math.PI) / 180;
        const nc = m * G * Math.cos(rad);
        setViewportHud(`<div class="hud-readout">θ=${th}° | Normal ≈ ${nc.toFixed(1)} N - nudge θ up in the next step to feel it drop</div>`);
        hudr = requestAnimationFrame(spin);
      };
      hudr = requestAnimationFrame(spin);
      mountDemoWithDwell(document.getElementById("l67d"), {
        minDwellMs: 4800,
        scene: "ramp",
        sceneArgs: { angleDeg: 38, massKg: 7, frictionMu: null },
        html: "<p>Watch the run - we’ll quiz how <strong>normal</strong> changes next.</p>",
        onContinue: () => {
          cancelAnimationFrame(hudr);
          setViewportHud("");
          clearOverlay();
          next();
        },
      });
    },
    (a, next) => {
      arena.playExample("ramp", { angleDeg: 42, massKg: 7, frictionMu: null });
      mountOverlay(`<div class="card"><div id="l67z"></div></div>`, { dock: "bottom", passThrough: false });
      mountDragZones(document.getElementById("l67z"), {
        title: t("adv.s0272"),
        instructions: t("adv.s0034"),
        zones: [{ id: "ok", label: t("adv.s0424"), accept: ["down"] }],
        chips: [
          { id: "down", text: t("adv.s0101") },
          { id: "up", text: t("adv.s0206") },
          { id: "flat", text: t("adv.s0030") },
        ],
        onDone: () => {
          clearOverlay();
          next();
        },
      });
    },
    (a, _n, finish) => {
      kidMcq(
        a,
        {
          title: t("adv.s0310"),
          question: t("adv.s0486"),
          choices: ["Down the ramp with you", "Up the ramp (opposing slide)", "Straight off the ramp"],
          okIndex: 1,
          coachShort: t("adv.s0167"),
        },
        finish
      );
    },
  ]);
}

function l6s8(api) {
  const { arena, setCoach, mountOverlay, clearOverlay } = api;
  const G = 10;
  runChain(api, [
    (a, next) => {
      arena.setRampVisual(30);
      kidMcq(
        a,
        {
          title: t("adv.s0270"),
          question: t("adv.s0006"),
          choices: ["40 N", "34.6 N (mg cos 30°)", "20 N"],
          okIndex: 1,
          coachShort: t("adv.s0247"),
        },
        next
      );
    },
    (a, next) => {
      mountOverlay(
        `<div class="card"><h2>Kinetic friction</h2>
        <p>Using N ≈ 34.6 N, μ<sub>k</sub>=0.3. Drag the slider to the kinetic friction force.</p>
        <p>F<sub>k</sub> = <span id="l68f">12</span> N</p>
        <input type="range" id="l68s" min="5" max="18" step="0.1" value="12" />
        <button type="button" class="btn primary" id="l68c">Check</button></div>`,
        { dock: "bottom", passThrough: false }
      );
      document.getElementById("l68s").oninput = () => {
        document.getElementById("l68f").textContent = document.getElementById("l68s").value;
      };
      document.getElementById("l68c").onclick = () => {
        const v = +document.getElementById("l68s").value;
        if (Math.abs(v - 10.4) > 1.2) return;
        clearOverlay();
        next();
      };
    },
    (a, _n, finish) => {
      arena.playExample("ramp", { angleDeg: 30, massKg: 4, frictionMu: 0.3 });
      setViewportHud(`<div class="hud-readout">μ=0.3 | N≈34.6 N | F_k≈10.4 N</div>`);
      mountOverlay(
        `<div class="card"><p>Ramp scene uses μ for stick/slide feel.</p>
        <button type="button" class="btn primary" id="l68x">Finish</button></div>`,
        { dock: "bottom", passThrough: false }
      );
      document.getElementById("l68x").onclick = () => {
        setViewportHud("");
        clearOverlay();
        finish();
        setCoach(t("adv.s0168"), "");
      };
    },
  ]);
}

function l6s9(api) {
  const { arena, setCoach } = api;
  arena.setRampVisual(35);
  const rs = document.getElementById("reward-slot");
  runChain(api, [
    (a, next) => {
      kidMcq(
        a,
        {
          title: t("adv.s0288"),
          question: t("adv.s0473"),
          choices: ["mg cos θ perpendicular", "mg sin θ along the ramp", "Only air inside the box"],
          okIndex: 1,
          coachShort: t("adv.s0502"),
        },
        next
      );
    },
    (a, next) => {
      kidMcq(
        a,
        {
          title: t("adv.s0271"),
          question: t("adv.s0035"),
          choices: ["Approaches zero (for this model)", "Becomes infinite", "Ignores mass"],
          okIndex: 0,
          coachShort: t("adv.s0249"),
        },
        next
      );
    },
    (a, _n, finish) => {
      kidMcq(
        a,
        {
          title: t("adv.s0395"),
          question: t("adv.s0010"),
          choices: ["Down the ramp (with momentary slip down the slope)", "Up the ramp opposing the relative motion", "Horizontal only"],
          okIndex: 1,
          coachShort: t("adv.s0166"),
        },
        () => {
          if (rs) rs.innerHTML = `<span class="badge-earned">📐 Slope Scout Badge</span>`;
          finish();
        }
      );
    },
  ]);
}

/* ========== Level 7: Tension / ropes ========== */
function runL7(api) {
  const subs = [l7s0, l7s1, l7s2, l7s3, l7s4, l7s5, l7s6, l7s7, l7s8, l7s9];
  subs[api.state.sub](api);
}

function l7s0(api) {
  const { setCoach, mountOverlay, clearOverlay, completeCurrentSub } = api;
  setCoach(t("adv.s0452"), "");
  mountOverlay(`<div class="card"><div id="l70m"></div></div>`, { dock: "bottom", passThrough: false });
  mountMotionChain(document.getElementById("l70m"), {
    title: t("adv.s0198"),
    beats: [
      {
        scene: "pulley",
        sceneArgs: { mLeft: 5, mRight: 8 },
        dwellMs: 3200,
        html: "<p><strong>Beat 1:</strong> The heavier side falls - no motor, gravity does the scheduling.</p>",
      },
      {
        scene: "pulley",
        sceneArgs: { mLeft: 4, mRight: 4 },
        dwellMs: 3200,
        html: "<p><strong>Beat 2:</strong> Matched masses sway gently - ideal string shares one tension.</p>",
      },
      {
        scene: "pulley",
        sceneArgs: { mLeft: 2, mRight: 9 },
        dwellMs: 3200,
        html: "<p><strong>Beat 3:</strong> Bigger mass gap ⇒ snappier motion in this toy model.</p>",
      },
    ],
    onDone: () => {
      clearOverlay();
      completeCurrentSub();
      setCoach(t("adv.s0040"), "");
    },
  });
  wrapRestart(api, l7s0);
}

function l7s1(api) {
  const { arena, setCoach, mountOverlay, clearOverlay, completeCurrentSub } = api;
  const G = 10;
  setCoach(t("adv.s0355"), "");
  mountOverlay(
    `<div class="card"><h2>Target acceleration</h2>
    <p>m₁ (kg, left) <span id="l71a">4</span> <input type="range" id="l71m1" min="1" max="9" value="4" /></p>
    <p>m₂ (kg, right) <span id="l71b">6</span> <input type="range" id="l71m2" min="2" max="10" value="6" /></p>
    <p id="l71r" class="readout"></p>
    <button type="button" class="btn primary hidden" id="l71v">Match a ≈ 2.0</button></div>`,
    { dock: "bottom", passThrough: false }
  );
  function sync() {
    let m1 = +document.getElementById("l71m1").value;
    let m2 = +document.getElementById("l71m2").value;
    if (m2 <= m1) m2 = m1 + 1;
    document.getElementById("l71m2").value = String(m2);
    document.getElementById("l71a").textContent = String(m1);
    document.getElementById("l71b").textContent = String(m2);
    const net = (m2 - m1) * G;
    const sum = m1 + m2;
    const a = sum > 0 ? net / sum : 0;
    document.getElementById("l71r").textContent = `Net ≈ ${net} N · a ≈ ${a.toFixed(2)} m/s²`;
    arena.playExample("pulley", { mLeft: m1, mRight: m2 });
    setViewportHud(
      `<div class="hud-readout">m₁=${m1} kg | m₂=${m2} kg | Net=${net} N | a≈${a.toFixed(2)} m/s²</div>`
    );
    document.getElementById("l71v").classList.toggle("hidden", Math.abs(a - 2) > 0.22);
  }
  document.getElementById("l71m1").oninput = sync;
  document.getElementById("l71m2").oninput = sync;
  sync();
  document.getElementById("l71v").onclick = () => {
    clearOverlay();
    setViewportHud("");
    completeCurrentSub();
    setCoach(t("adv.s0426"), "");
  };
  wrapRestart(api, l7s1);
}

function l7s2(api) {
  const { arena, setCoach, mountOverlay, clearOverlay, completeCurrentSub } = api;
  arena.playExample("pulley", { mLeft: 4, mRight: 7 });
  setCoach(t("adv.s0227"), "");
  mountOverlay(`<div class="card"><div id="l72z"></div></div>`, { dock: "bottom", passThrough: false });
  mountDragZones(document.getElementById("l72z"), {
    title: t("adv.s0160"),
    instructions: t("adv.s0121"),
    zones: [
      { id: "t", label: t("adv.s0199"), accept: ["c1"] },
      { id: "n", label: t("adv.s0257"), accept: ["c2"] },
      { id: "wh", label: t("adv.s0185"), accept: ["c3"] },
      { id: "wl", label: t("adv.s0216"), accept: ["c4"] },
    ],
    chips: [
      { id: "c1", text: t("adv.s0388") },
      { id: "c2", text: t("adv.s0001") },
      { id: "c3", text: t("adv.s0176") },
      { id: "c4", text: t("adv.s0177") },
      { id: "d1", text: t("adv.s0226") },
    ],
    onDone: () => {
      clearOverlay();
      completeCurrentSub();
      setCoach(t("adv.s0407"), "");
    },
  });
  wrapRestart(api, l7s2);
}

function l7s3(api) {
  const { setCoach, mountOverlay, clearOverlay } = api;
  runChain(api, [
    (a, next) => {
      mountOverlay(`<div class="card"><div id="l73r"></div></div>`, { dock: "bottom", passThrough: false });
      mountRevealSteps(document.getElementById("l73r"), {
        title: t("adv.s0093"),
        steps: ["Motijheel site: lift tension must beat the load’s weight to accelerate upward."],
        scene: "rope",
        sceneArgs: {},
        onDone: () => {
          clearOverlay();
          next();
        },
      });
    },
    (a, next) => {
      kidMcq(
        a,
        {
          title: t("adv.s0075"),
          question: t("adv.s0477"),
          choices: ["Less than mg", "Greater than mg", "Exactly zero"],
          okIndex: 1,
          coachShort: t("adv.s0439"),
        },
        next
      );
    },
    (a, next) => {
      mountOverlay(`<div class="card"><div id="l73r2"></div></div>`, { dock: "bottom", passThrough: false });
      mountRevealSteps(document.getElementById("l73r2"), {
        title: t("adv.s0427"),
        steps: ["Both teams feel the same rope tension - Newton’s third in a straight line."],
        scene: "tugOfWar",
        sceneArgs: { left: 2.5, right: 2.5, snapshot: true },
        onDone: () => {
          clearOverlay();
          next();
        },
      });
    },
    (a, next) => {
      kidMcq(
        a,
        {
          title: t("adv.s0329"),
          question: t("adv.s0134"),
          choices: ["Unrelated forces", "Equal magnitude, opposite direction", "Always zero"],
          okIndex: 1,
          coachShort: t("adv.s0416"),
        },
        next
      );
    },
    (a, next) => {
      mountOverlay(`<div class="card"><div id="l73r3"></div></div>`, { dock: "bottom", passThrough: false });
      mountRevealSteps(document.getElementById("l73r3"), {
        title: t("adv.s0145"),
        steps: ["Cab speeds up: tension > weight. Cab brakes while moving up: tension can dip below weight briefly."],
        scene: "elevator",
        onDone: () => {
          clearOverlay();
          next();
        },
      });
    },
    (a, _n, finish) => {
      kidMcq(
        a,
        {
          title: t("adv.s0144"),
          question: t("adv.s0476"),
          choices: ["Must grow forever", "Can drop below cruising weight", "Becomes negative mass"],
          okIndex: 1,
          coachShort: t("adv.s0116"),
        },
        () => {
          finish();
          setCoach(t("adv.s0091"), "");
        }
      );
    },
  ]);
}

function l7s4(api) {
  const { arena, setCoach, mountOverlay, clearOverlay, completeCurrentSub } = api;
  const G = 10;
  setCoach(t("adv.s0197"), "");
  mountOverlay(
    `<div class="card"><h2>Tension tuner</h2>
    <p>m₁ <span id="l74a">4</span> <input type="range" id="l74m1" min="1" max="10" value="4" /></p>
    <p>m₂ <span id="l74b">4</span> <input type="range" id="l74m2" min="1" max="10" value="4" /></p>
    <p id="l74r" class="readout"></p>
    <button type="button" class="btn primary hidden" id="l74v">T ≈ 40 N</button></div>`,
    { dock: "bottom", passThrough: false }
  );
  function tension(m1, m2) {
    const s = m1 + m2;
    return s > 0 ? (2 * m1 * m2 * G) / s : 0;
  }
  function sync() {
    const m1 = +document.getElementById("l74m1").value;
    const m2 = +document.getElementById("l74m2").value;
    document.getElementById("l74a").textContent = String(m1);
    document.getElementById("l74b").textContent = String(m2);
    const T = tension(m1, m2);
    document.getElementById("l74r").textContent = `T ≈ ${T.toFixed(1)} N`;
    arena.playExample("pulley", { mLeft: m1, mRight: m2 });
    setViewportHud(`<div class="hud-readout">T = 2·m₁·m₂·g/(m₁+m₂) ≈ ${T.toFixed(1)} N</div>`);
    document.getElementById("l74v").classList.toggle("hidden", Math.abs(T - 40) > 3);
  }
  document.getElementById("l74m1").oninput = sync;
  document.getElementById("l74m2").oninput = sync;
  sync();
  document.getElementById("l74v").onclick = () => {
    clearOverlay();
    setViewportHud("");
    completeCurrentSub();
    setCoach(t("adv.s0147"), "");
  };
  wrapRestart(api, l7s4);
}

function l7s5(api) {
  const { arena, setCoach, completeCurrentSub } = api;
  arena.playExample("elevator", {});
  setCoach(t("adv.s0348"), "");
  kidMcq(
    api,
    {
      title: t("adv.s0146"),
      question: t("adv.s0008"),
      choices: ["700 N", "910 N (70×13)", "490 N"],
      okIndex: 1,
      coachShort: t("adv.s0032"),
    },
    () => {
      setViewportHud(`<div class="hud-readout">True weight 700 N | Scale ≈ 910 N | Extra from upward a</div>`);
      setTimeout(() => {
        setViewportHud("");
        completeCurrentSub();
      }, 1400);
      setCoach(t("adv.s0240"), "");
    }
  );
  wrapRestart(api, l7s5);
}

function l7s6(api) {
  const { arena, setCoach, mountOverlay, clearOverlay, completeCurrentSub } = api;
  arena.playExample("pulley", { mLeft: 3, mRight: 5 });
  setCoach(t("adv.s0397"), "");
  const m1 = 3;
  const m2 = 5;
  const Mtot = m1 + m2;
  mountOverlay(
    `<div class="card"><h2>Friction + hanger</h2>
    <p>m₂g = 50 N straight down. Table friction = μ · ${m1 * 10} N.</p>
    <p>μ <span id="l76u">0.5</span> <input type="range" id="l76s" min="0" max="1" step="0.01" value="0.5" /></p>
    <p id="l76r" class="readout"></p>
    <button type="button" class="btn primary hidden" id="l76v">a ≈ 3.5 m/s²</button></div>`,
    { dock: "bottom", passThrough: false }
  );
  function sync() {
    const mu = +document.getElementById("l76s").value;
    document.getElementById("l76u").textContent = mu.toFixed(2);
    const fr = mu * m1 * 10;
    const net = 50 - fr;
    const accel = Mtot > 0 ? net / Mtot : 0;
    document.getElementById("l76r").textContent = `Friction ≈ ${fr.toFixed(1)} N · Net ≈ ${net.toFixed(1)} N · a ≈ ${accel.toFixed(
      2
    )} m/s²`;
    setViewportHud(
      `<div class="hud-readout">m₂g=50N | friction=${fr.toFixed(1)}N | net=${net.toFixed(1)}N | a=${accel.toFixed(2)} m/s²</div>`
    );
    document.getElementById("l76v").classList.toggle("hidden", Math.abs(accel - 3.5) > 0.18);
  }
  document.getElementById("l76s").oninput = sync;
  sync();
  document.getElementById("l76v").onclick = () => {
    clearOverlay();
    setViewportHud("");
    completeCurrentSub();
    setCoach(t("adv.s0511"), "");
  };
  wrapRestart(api, l7s6);
}

function l7s7(api) {
  const { setCoach, mountOverlay, clearOverlay } = api;
  runChain(api, [
    (a, next) => {
      mountOverlay(`<div class="card"><div id="l77d"></div></div>`, { dock: "bottom", passThrough: false });
      let hudr = 0;
      const spin = () => {
        setViewportHud(`<div class="hud-readout">Left pull 300 N | Right pull 300 N - same rope tension!</div>`);
        hudr = requestAnimationFrame(spin);
      };
      hudr = requestAnimationFrame(spin);
      mountDemoWithDwell(document.getElementById("l77d"), {
        minDwellMs: 4500,
        scene: "tugOfWar",
        sceneArgs: { left: 3, right: 3 },
        html: "<p>Ideal rope: both teams feel identical tension - not “whoever pulls harder gets more rope”.</p>",
        onContinue: () => {
          cancelAnimationFrame(hudr);
          setViewportHud("");
          clearOverlay();
          next();
        },
      });
    },
    (a, _n, finish) => {
      mountOverlay(`<div class="card"><div id="l77z"></div></div>`, { dock: "bottom", passThrough: false });
      mountDragZones(document.getElementById("l77z"), {
        title: t("adv.s0229"),
        instructions: t("adv.s0024"),
        zones: [{ id: "ok", label: t("adv.s0425"), accept: ["same"] }],
        chips: [
          { id: "same", text: t("adv.s0413") },
          { id: "diff", text: t("adv.s0027") },
          { id: "zero", text: t("adv.s0492") },
        ],
        onDone: () => {
          clearOverlay();
          finish();
          setCoach(t("adv.s0315"), "");
        },
      });
    },
  ]);
}

function l7s8(api) {
  const { arena, setCoach, mountOverlay, clearOverlay } = api;
  const G = 10;
  runChain(api, [
    (a, next) => {
      arena.playExample("pulley", { mLeft: 4, mRight: 6 });
      kidMcq(
        a,
        {
          title: t("adv.s0017"),
          question: t("adv.s0041"),
          choices: ["1.0 m/s²", "2.0 m/s²", "4.0 m/s²"],
          okIndex: 1,
          coachShort: t("adv.s0000"),
        },
        next
      );
    },
    (a, next) => {
      mountOverlay(
        `<div class="card"><h2>Tension check</h2>
        <p>Use T ≈ m₁(g+a) = 4×(10+2) for this ideal pair.</p>
        <p>Tension (N) <input type="number" id="l78n" min="1" max="120" step="1" value="40" style="width:5rem" />
        <button type="button" class="btn primary" id="l78c">Check</button></div>`,
        { dock: "bottom", passThrough: false }
      );
      document.getElementById("l78c").onclick = () => {
        const v = +document.getElementById("l78n").value;
        if (Math.abs(v - 48) > 3) return;
        clearOverlay();
        next();
      };
    },
    (a, _n, finish) => {
      arena.playExample("pulley", { mLeft: 4, mRight: 6 });
      setViewportHud(`<div class="hud-readout">a=2.0 m/s² | T≈48 N</div>`);
      mountOverlay(
        `<div class="card"><p>Pulley scene matches the numbers you just locked.</p>
        <button type="button" class="btn primary" id="l78x">Done</button></div>`,
        { dock: "bottom", passThrough: false }
      );
      document.getElementById("l78x").onclick = () => {
        setViewportHud("");
        clearOverlay();
        finish();
        setCoach(t("adv.s0028"), "");
      };
    },
  ]);
}

function l7s9(api) {
  const { arena, setCoach } = api;
  arena.playExample("pulley", { mLeft: 5, mRight: 6 });
  const rs = document.getElementById("reward-slot");
  runChain(api, [
    (a, next) => {
      kidMcq(
        a,
        {
          title: t("adv.s0220"),
          question: t("adv.s0478"),
          choices: [
            "Because sway and braking spike tension",
            "Because cables delete gravity",
            "Because loads become massless when lifted",
          ],
          okIndex: 0,
          coachShort: t("adv.s0137"),
        },
        next
      );
    },
    (a, next) => {
      kidMcq(
        a,
        {
          title: t("adv.s0364"),
          question: t("adv.s0472"),
          choices: ["Frictionless axle + massless string", "Heavy rusty pulley only", "Short rope only"],
          okIndex: 0,
          coachShort: t("adv.s0411"),
        },
        next
      );
    },
    (a, _n, finish) => {
      kidMcq(
        a,
        {
          title: t("adv.s0395"),
          question: t("adv.s0485"),
          choices: ["Harder than", "With equal magnitude compared to", "Weaker than"],
          okIndex: 1,
          coachShort: t("adv.s0415"),
        },
        () => {
          if (rs) rs.innerHTML = `<span class="badge-earned">🪢 Rope Ranger Badge</span>`;
          finish();
        }
      );
    },
  ]);
}

/* ========== Level 8: Applied forces & direction ========== */
function runL8(api) {
  const subs = [l8s0, l8s1, l8s2, l8s3, l8s4, l8s5, l8s6, l8s7, l8s8, l8s9];
  subs[api.state.sub](api);
}

function l8s0(api) {
  const { arena, THREE, setCoach, mountOverlay, clearOverlay, completeCurrentSub, setInteractCleanup } = api;
  arena.playExample("rock");
  arena.clearArrow();
  const dirs = new Set();
  setCoach(t("adv.s0350"), "");
  mountOverlay(
    `<div class="card scenario-box"><h2>Vector shove lab</h2>
    <p>Angle (degrees from +X in the lane) <input type="range" id="l80a" min="-90" max="90" value="0" />
    <span id="l80av">0°</span></p>
    <p>Impulse strength <input type="range" id="l80s" min="1" max="9" value="5" />
    <span id="l80sv">5</span></p>
    <p id="l80d" class="drag-hint"></p>
    <button type="button" class="btn primary" id="l80go">Apply push</button>
    <p class="key-hint">Tip: try wide angle changes so three buckets stay different.</p></div>`,
    { dock: "bottom", passThrough: false }
  );
  const angEl = document.getElementById("l80a");
  const strEl = document.getElementById("l80s");
  function syncUi() {
    const deg = +angEl.value;
    document.getElementById("l80av").textContent = `${deg}°`;
    document.getElementById("l80sv").textContent = String(strEl.value);
    const rad = (deg * Math.PI) / 180;
    const s = +strEl.value;
    const fx = Math.round(s * Math.cos(rad) * 12);
    const fz = Math.round(s * Math.sin(rad) * 12);
    setViewportHud(
      `<div class="hud-readout">Toy components (not SI perfect): F<sub>x</sub>≈${fx} · F<sub>z</sub>≈${fz} · |F|≈${Math.hypot(fx, fz)}</div>`
    );
  }
  angEl.oninput = syncUi;
  strEl.oninput = syncUi;
  syncUi();
  document.getElementById("l80go").onclick = () => {
    const deg = (+angEl.value * Math.PI) / 180;
    const s = +strEl.value;
    const bucket = Math.round((angEl.valueAsNumber + 90) / 24);
    dirs.add(bucket);
    arena.applyImpulseToRock(Math.cos(deg), Math.sin(deg), s);
    const ry = arena.rock.position.y + 0.42;
    const from = new THREE.Vector3(arena.rock.position.x, ry, arena.rock.position.z);
    const scl = 0.28 + s * 0.07;
    arena.setArrow(
      from,
      new THREE.Vector3(from.x + Math.cos(deg) * scl, from.y, from.z + Math.sin(deg) * scl)
    );
    const msg = document.getElementById("l80d");
    if (msg) msg.textContent = `Distinct direction families used: ${dirs.size} / 3`;
    if (dirs.size >= 3) {
        setTimeout(() => {
        clearOverlay();
        setViewportHud("");
        arena.clearArrow();
        completeCurrentSub();
        setCoach(t("adv.s0341"), "");
      }, spectatorPauseMs(700));
    }
  };
  setInteractCleanup(() => {
    setViewportHud("");
    arena.clearArrow();
  });
  wrapRestart(api, l8s0);
}

function l8s1(api) {
  const { arena, setCoach, mountOverlay, clearOverlay, completeCurrentSub } = api;
  function tryWin(placed) {
    if (!placed.w || !placed.n || !placed.a || !placed.f) return;
    clearOverlay();
    setViewportHud("");
    completeCurrentSub();
    setCoach(
      "At constant speed, your forward push and kinetic friction match closely, while weight and normal cancel vertically.",
      ""
    );
  }
  function run() {
    const placed = { w: false, n: false, a: false, f: false };
    function paintHud() {
      setViewportHud(
        `<div class="hud-readout">Weight ${placed.w ? "✓" : "-"} · Normal ${placed.n ? "✓" : "-"} · Your push ${placed.a ? "✓" : "-"} · Friction ${placed.f ? "✓" : "-"}</div>`
      );
    }
    clearOverlay();
    arena.startFbdCrateScene();
    setCoach(t("adv.s0405"), "");
    mountOverlay(
      `<div class="card scenario-box"><h2>Four-force sketch</h2>
      <p class="lab-lead">Each button drops a learner arrow on the crate (wide box in the lane).</p>
      <div class="btn-row">
        <button type="button" class="btn secondary" id="l81w">Add weight (down)</button>
        <button type="button" class="btn secondary" id="l81n">Add normal (up)</button>
      </div>
      <div class="btn-row">
        <button type="button" class="btn secondary" id="l81a">Add your push (right)</button>
        <button type="button" class="btn secondary" id="l81f">Add kinetic friction (left)</button>
      </div>
      <p id="l81h" class="drag-hint"></p></div>`,
      { dock: "bottom", passThrough: false }
    );
    paintHud();
    document.getElementById("l81w").onclick = () => {
      if (placed.w) return;
      placed.w = true;
      arena.appendFbdArrow(0, -1, 0, 1.15, 0xff7a33);
      paintHud();
      tryWin(placed);
    };
    document.getElementById("l81n").onclick = () => {
      if (placed.n) return;
      placed.n = true;
      arena.appendFbdArrow(0, 1, 0, 1.05, 0x22c55e);
      paintHud();
      tryWin(placed);
    };
    document.getElementById("l81a").onclick = () => {
      if (placed.a) return;
      placed.a = true;
      arena.appendFbdArrow(1, 0, 0, 1.0, 0x5b8cff);
      paintHud();
      tryWin(placed);
    };
    document.getElementById("l81f").onclick = () => {
      if (placed.f) return;
      placed.f = true;
      arena.appendFbdArrow(-1, 0, 0, 0.95, 0xf97316);
      paintHud();
      tryWin(placed);
    };
  }
  wrapRestart(api, run);
  run();
}

function l8s2(api) {
  const { arena, setCoach, mountOverlay, clearOverlay, completeCurrentSub } = api;
  arena.playExample("frictionLoop");
  setCoach(t("adv.s0117"), "");
  mountOverlay(`<div class="card"><div id="l82z"></div></div>`, { dock: "bottom", passThrough: false });
  mountDragZones(document.getElementById("l82z"), {
    title: t("adv.s0165"),
    instructions:
      "Sliding crate → friction opposes slip. Book on desk → mostly vertical pair. Ball in flight → weight only (model). Braking car → tires want to slide forward, friction points back.",
    zones: [
      { id: "slide", label: t("adv.s0094"), accept: ["c1"] },
      { id: "desk", label: t("adv.s0057"), accept: ["c2"] },
      { id: "air", label: t("adv.s0365"), accept: ["c3"] },
      { id: "brake", label: t("adv.s0183"), accept: ["c4"] },
    ],
    chips: [
      { id: "c1", text: t("adv.s0172") },
      { id: "c2", text: t("adv.s0456") },
      { id: "c3", text: "Only Earth's pull downward" },
      { id: "c4", text: t("adv.s0169") },
      { id: "d1", text: t("adv.s0268") },
    ],
    onDone: () => {
      clearOverlay();
      completeCurrentSub();
      setCoach(t("adv.s0026"), "");
    },
  });
  wrapRestart(api, l8s2);
}

function l8s3(api) {
  const { setCoach, mountOverlay, clearOverlay, completeCurrentSub } = api;
  function run() {
    clearOverlay();
    setCoach(t("adv.s0318"), "");
    mountOverlay(`<div class="card"><div id="l83h"></div></div>`, { dock: "bottom", passThrough: false });
    mountRevealSteps(document.getElementById("l83h"), {
      title: t("adv.s0019"),
      stepScenes: [
        { scene: "rest", sceneArgs: { shape: "wide", arrows: true, wobble: false } },
        { scene: "recoil", sceneArgs: { variant: "pair" } },
        { scene: "shove", sceneArgs: { phase: "accel", vehicle: "kart" } },
      ],
      steps: [
        "<strong>Partners always touch two different bodies.</strong> If Earth pulls the book down, the book pulls Earth up (tiny but real).",
        "Oars, rockets, and crates recoiling all show the same bookkeeping: A on B is paired with B on A, same size, opposite direction.",
        "Never add an action-reaction pair when you draw <em>one</em> object’s FBD - show only forces <em>on</em> that object.",
      ],
      onDone: () => {
        clearOverlay();
        kidMcq(
          api,
          {
            title: t("adv.s0461"),
            question:
              "A textbook rests on a lab desk. The Newton-third-law reaction partner to the book’s <strong>weight</strong> (Earth pulling the book) is best described as…",
            choices: [
              "The book pulls Earth with the same size force",
              "The desk pushes the book up (normal)",
              "Air pushes sideways on the cover",
            ],
            okIndex: 0,
            coachShort: t("adv.s0457"),
          },
          () => {
            completeCurrentSub();
            setCoach(t("adv.s0266"), "");
          }
        );
      },
    });
  }
  wrapRestart(api, run);
  run();
}

function l8s4(api) {
  const { arena, setCoach, mountOverlay, clearOverlay, completeCurrentSub, setInteractCleanup } = api;
  setCoach(t("adv.s0431"), "");
  mountOverlay(
    `<div class="card scenario-box"><h2>Perpendicular components</h2>
    <p>Horizontal F<sub>x</sub> (N) <input type="range" id="l84x" min="0" max="200" value="15" /> <span id="l84xv">15</span></p>
    <p>Vertical F<sub>y</sub> (N) <input type="range" id="l84y" min="0" max="200" value="20" /> <span id="l84yv">20</span></p>
    <p id="l84m" class="readout"></p>
    <button type="button" class="btn primary hidden" id="l84ok">|F| ≈ 25 N - lock in</button></div>`,
    { dock: "bottom", passThrough: false }
  );
  function sync() {
    const fx = +document.getElementById("l84x").value;
    const fy = +document.getElementById("l84y").value;
    document.getElementById("l84xv").textContent = String(fx);
    document.getElementById("l84yv").textContent = String(fy);
    const mag = Math.hypot(fx, fy);
    document.getElementById("l84m").textContent = `|F| = √(F_x² + F_y²) ≈ ${mag.toFixed(1)} N`;
    const vizX = (fx / 25) * 1.05;
    const vizY = (fy / 25) * 1.05;
    arena.playExample("vector", { fx: vizX, fy: vizY });
    const ok = mag >= 24 && mag <= 26;
    document.getElementById("l84ok").classList.toggle("hidden", !ok);
    setViewportHud(
      ok
        ? `<div class="hud-readout">Resultant parked near 25 N - ready when you are.</div>`
        : `<div class="hud-readout">Aim near 15 N + 20 N, or any pair with √(Fx²+Fy²)≈25.</div>`
    );
  }
  document.getElementById("l84x").oninput = sync;
  document.getElementById("l84y").oninput = sync;
  sync();
  document.getElementById("l84ok").onclick = () => {
    clearOverlay();
    setViewportHud("");
    completeCurrentSub();
    setCoach(t("adv.s0296"), "");
  };
  setInteractCleanup(() => setViewportHud(""));
  wrapRestart(api, l8s4);
}

function l8s5(api) {
  runChain(api, [
    (a, next) => {
      a.arena.playExample("recoil");
      a.setCoach(t("adv.s0274"), "");
      kidMcq(
        a,
        {
          title: t("adv.s0389"),
          question:
            "During a forward stroke, the oar blade pushes the water mostly backward. The water’s force on the blade is…",
          choices: [
            "Equal in size and opposite in direction (Newton 3 pair)",
            "Smaller because water is soft",
            "Unrelated - only muscles matter",
          ],
          okIndex: 0,
          coachShort: t("adv.s0111"),
        },
        next
      );
    },
    (a, _n, finish) => {
      kidMcq(
        a,
        {
          title: t("adv.s0255"),
          question:
            "Crew tension pulls a staging barge forward with 180 N while river drag resists with 30 N. Forward net on the barge?",
          choices: ["About 150 N forward", "210 N backward", "Zero because drag cancels everything forever"],
          okIndex: 0,
          coachShort: t("adv.s0354"),
        },
        finish
      );
    },
  ]);
}

function l8s6(api) {
  const { arena, THREE, setCoach, mountOverlay, clearOverlay, completeCurrentSub, setInteractCleanup } = api;
  arena.playExample("rock");
  arena.clearArrow();
  const f1 = 100;
  setCoach(
    "One crew member shoves the practice wall with 100 N forward. Dial a second shove until the net they apply together is basically zero.",
    ""
  );
  mountOverlay(
    `<div class="card scenario-box"><h2>Cancel the pair</h2>
    <p>Second push: magnitude (N) <input type="range" id="l86m" min="0" max="200" value="40" /> <span id="l86mv">40</span></p>
    <p>Second push: angle (° from +forward) <input type="range" id="l86t" min="0" max="360" value="90" /> <span id="l86tv">90</span></p>
    <p id="l86r" class="readout"></p>
    <button type="button" class="btn primary hidden" id="l86ok">Net ≈ 0 - continue</button></div>`,
    { dock: "bottom", passThrough: false }
  );
  function sync() {
    const mag = +document.getElementById("l86m").value;
    const theta = (+document.getElementById("l86t").value * Math.PI) / 180;
    document.getElementById("l86mv").textContent = String(mag);
    document.getElementById("l86tv").textContent = `${document.getElementById("l86t").value}°`;
    const f2x = mag * Math.cos(theta);
    const f2z = mag * Math.sin(theta);
    const nx = f1 + f2x;
    const nz = f2z;
    const nm = Math.hypot(nx, nz);
    document.getElementById("l86r").textContent = `Net horizontal ≈ ${nx.toFixed(1)} N · lateral ≈ ${nz.toFixed(1)} N · |F_net| ≈ ${nm.toFixed(1)} N`;
    const ry = arena.rock.position.y + 0.42;
    const from = new THREE.Vector3(arena.rock.position.x, ry, arena.rock.position.z);
    const scale = 0.0038;
    arena.setArrow(from, new THREE.Vector3(from.x + nx * scale, from.y, from.z + nz * scale));
    const ok = nm <= 8;
    document.getElementById("l86ok").classList.toggle("hidden", !ok);
    setViewportHud(
      ok
        ? `<div class="hud-readout">Forces cancel - crate feels no push from this pair.</div>`
        : `<div class="hud-readout">Hint: match 100 N backward to the first crew shove.</div>`
    );
  }
  document.getElementById("l86m").oninput = sync;
  document.getElementById("l86t").oninput = sync;
  sync();
  document.getElementById("l86ok").onclick = () => {
    clearOverlay();
    setViewportHud("");
    arena.clearArrow();
    completeCurrentSub();
    setCoach(t("adv.s0148"), "");
  };
  setInteractCleanup(() => {
    setViewportHud("");
    arena.clearArrow();
  });
  wrapRestart(api, l8s6);
}

function l8s7(api) {
  runChain(api, [
    (a, next) => {
      a.setCoach(t("adv.s0223"), "");
      a.mountOverlay(`<div class="card"><div id="l87d"></div></div>`, { dock: "bottom", passThrough: false });
      mountDemoWithDwell(document.getElementById("l87d"), {
        minDwellMs: 4800,
        scene: "glide",
        sceneArgs: { frictionMu: 0.04, speed: 2 },
        html: `<p><strong>Observation:</strong> the rock keeps coasting because the lane cheats friction down - not because “motion needs a forward force.”</p>
          <p class="drag-hint">If ΣF = 0 horizontally, velocity can stay constant even with no engine push.</p>`,
        onContinue: () => {
          a.clearOverlay();
          next();
        },
      });
    },
    (a, _n, finish) => {
      a.setCoach(t("adv.s0367"), "");
      a.mountOverlay(`<div class="card"><div id="l87z"></div></div>`, { dock: "bottom", passThrough: false });
      mountDragZones(document.getElementById("l87z"), {
        title: t("adv.s0127"),
        instructions: t("adv.s0189"),
        zones: [
          { id: "highway", label: t("adv.s0098"), accept: ["air"] },
          { id: "sprint", label: t("adv.s0373"), accept: ["staticg"] },
          { id: "puck", label: t("adv.s0192"), accept: ["lowk"] },
        ],
        chips: [
          { id: "air", text: t("adv.s0023") },
          { id: "staticg", text: t("adv.s0378") },
          { id: "lowk", text: t("adv.s0446") },
          { id: "wrong", text: t("adv.s0180") },
        ],
        onDone: () => {
          a.clearOverlay();
          a.setCoach(t("adv.s0128"), "");
          finish();
        },
      });
    },
  ]);
}

function l8s8(api) {
  const { arena, setCoach, mountOverlay, clearOverlay, completeCurrentSub } = api;
  arena.playExample("ramp", { angleDeg: 30, frictionMu: 0.25, massKg: 12 });
  setCoach(t("adv.s0052"), "");
  mountOverlay(`<div class="card"><div id="l88z"></div></div>`, { dock: "bottom", passThrough: false });
  mountDragZones(document.getElementById("l88z"), {
    title: t("adv.s0313"),
    instructions: t("adv.s0289"),
    zones: [
      { id: "para", label: t("adv.s0025"), accept: ["gpar"] },
      { id: "perp", label: t("adv.s0208"), accept: ["gperp"] },
      { id: "fslide", label: t("adv.s0203"), accept: ["fopp"] },
    ],
    chips: [
      { id: "gpar", text: t("adv.s0500") },
      { id: "gperp", text: t("adv.s0499") },
      { id: "fopp", text: t("adv.s0171") },
      { id: "bad", text: t("adv.s0265") },
    ],
    onDone: () => {
      clearOverlay();
      completeCurrentSub();
      setCoach(t("adv.s0131"), "");
    },
  });
  wrapRestart(api, l8s8);
}

function l8s9(api) {
  runChain(api, [
    (a, next) => {
      a.arena.playExample("vector", { fx: 0.75, fy: 0.85 });
      a.setCoach(t("adv.s0433"), "");
      kidMcq(
        a,
        {
          title: t("adv.s0095"),
          question:
            "One porter pushes purely north on a crate while another pushes purely east with the same magnitude. The combined push points…",
          choices: ["Northeast along the diagonal", "Due west only", "Straight up off the floor"],
          okIndex: 0,
          coachShort: t("adv.s0293"),
        },
        next
      );
    },
    (a, next) => {
      a.setCoach(t("adv.s0218"), "");
      a.mountOverlay(`<div class="card"><div id="l89z"></div></div>`, { dock: "bottom", passThrough: false });
      mountDragZones(document.getElementById("l89z"), {
        title: t("adv.s0443"),
        instructions: t("adv.s0088"),
        zones: [
          { id: "vel", label: t("adv.s0506"), accept: ["cru"] },
          { id: "break", label: t("adv.s0245"), accept: ["bud"] },
          { id: "n3", label: t("adv.s0031"), accept: ["pair"] },
        ],
        chips: [
          { id: "cru", text: t("adv.s0196") },
          {
            id: "bud",
            text: t("adv.s0186"),
          },
          { id: "pair", text: t("adv.s0323") },
          { id: "bad", text: t("adv.s0444") },
        ],
        onDone: () => {
          a.clearOverlay();
          next();
        },
      });
    },
    (a, _n, finish) => {
      kidMcq(
        a,
        {
          title: t("adv.s0071"),
          question:
            "To start a heavy cabinet sliding on tile you usually need horizontal push that is ___ the peak static-friction budget.",
          choices: ["Smaller than", "At least as large as", "Unrelated to"],
          okIndex: 1,
          coachShort: t("adv.s0070"),
        },
        () => {
          a.mountOverlay(
            `<div class="card"><p><span class="badge-earned">🧭 Direction Pro Badge</span></p>
            <p class="drag-hint">You mixed arrows, components, ramps, and everyday stories - sharp direction sense!</p>
            <button type="button" class="btn primary" id="l89done">Continue</button></div>`,
            { dock: "bottom", passThrough: false }
          );
          document.getElementById("l89done").onclick = () => {
            a.clearOverlay();
            finish();
          };
        }
      );
    },
  ]);
}

/* ========== Level 9: Combined ========== */
function runL9(api) {
  const subs = [l9s0, l9s1, l9s2, l9s3, l9s4, l9s5, l9s6, l9s7, l9s8, l9s9];
  subs[api.state.sub](api);
}

function l9s0(api) {
  const { arena, setCoach, mountOverlay, clearOverlay, completeCurrentSub, setInteractCleanup } = api;
  arena.playExample("rest", { shape: "ball", arrows: true });
  setCoach(t("adv.s0474"), "");
  setViewportHud(`<div class="hud-readout">Vertical pair only for this story.</div>`);
  mountOverlay(
    `<div class="card scenario-box"><h2>Honest checklist</h2>
    <label><input type="checkbox" id="l9c1" /> Weight - Earth pulls the book downward</label><br/>
    <label><input type="checkbox" id="l9c2" /> Normal - bench pushes the book upward</label><br/>
    <label><input type="checkbox" id="l9c3" /> “Centrifugal” push (inertial frame <em>cheat sheet</em>)</label><br/>
    <label><input type="checkbox" id="l9c4" /> Static friction along the bench “just in case”</label><br/>
    <button type="button" class="btn primary" id="l9go">Submit</button>
    <p id="l9er" class="drag-hint"></p></div>`,
    { dock: "bottom", passThrough: false }
  );
  document.getElementById("l9go").onclick = () => {
    const c1 = document.getElementById("l9c1").checked;
    const c2 = document.getElementById("l9c2").checked;
    const c3 = document.getElementById("l9c3").checked;
    const c4 = document.getElementById("l9c4").checked;
    const er = document.getElementById("l9er");
    if (c1 && c2 && !c3 && !c4) {
      clearOverlay();
      setViewportHud("");
      completeCurrentSub();
      setCoach(t("adv.s0454"), "");
    } else if (c3) {
      er.textContent = t("adv.s0079");
    } else if (c4) {
      er.textContent = t("adv.s0264");
    } else {
      er.textContent = t("adv.s0349");
    }
  };
  setInteractCleanup(() => setViewportHud(""));
  wrapRestart(api, l9s0);
}

function l9s1(api) {
  const { arena, setCoach, mountOverlay, clearOverlay, completeCurrentSub } = api;
  arena.playExample("shove");
  setCoach(t("adv.s0232"), "");
  mountOverlay(`<div class="card"><div id="l91z"></div></div>`, { dock: "bottom", passThrough: false });
  mountDragZones(document.getElementById("l91z"), {
    title: t("adv.s0132"),
    instructions:
      "Tires shove the road backward; the road’s reaction shoves the chassis forward - classic Newton-3 bookkeeping.",
    zones: [
      { id: "tire", label: t("adv.s0468"), accept: ["back"] },
      { id: "road", label: t("adv.s0467"), accept: ["fwd"] },
    ],
    chips: [
      { id: "back", text: t("adv.s0306") },
      { id: "fwd", text: t("adv.s0290") },
      { id: "bad", text: t("adv.s0322") },
    ],
    onDone: () => {
      clearOverlay();
      completeCurrentSub();
      setCoach(t("adv.s0410"), "");
    },
  });
  wrapRestart(api, l9s1);
}

function l9s2(api) {
  const { arena, setCoach, mountOverlay, clearOverlay, completeCurrentSub, setInteractCleanup } = api;
  arena.playExample("massCompare");
  setCoach(t("adv.s0440"), "");
  mountOverlay(
    `<div class="card scenario-box"><h2>F & m tuner</h2>
    <p>Net force (N) <input type="range" id="nf" min="10" max="200" value="60" /> <span id="nfv">60</span></p>
    <p>Mass (kg) <input type="range" id="mf" min="5" max="30" value="12" /> <span id="mfv">12</span></p>
    <p id="af" class="readout"></p>
    <button type="button" class="btn primary" id="lk">Lock a ≈ 5.0 m/s² (±0.4)</button></div>`,
    { dock: "bottom", passThrough: false }
  );
  const u = () => {
    const F = +document.getElementById("nf").value;
    const m = +document.getElementById("mf").value;
    document.getElementById("nfv").textContent = String(F);
    document.getElementById("mfv").textContent = String(m);
    const a = F / m;
    document.getElementById("af").textContent = `a = F ÷ m = ${a.toFixed(2)} m/s²`;
    setViewportHud(
      `<div class="hud-readout">F=${F} N · m=${m} kg · a≈${a.toFixed(2)} m/s² - lighter body still “surges” faster with the same net push.</div>`
    );
  };
  document.getElementById("nf").oninput = u;
  document.getElementById("mf").oninput = u;
  u();
  document.getElementById("lk").onclick = () => {
    const F = +document.getElementById("nf").value;
    const m = +document.getElementById("mf").value;
    if (Math.abs(F / m - 5) < 0.45) {
      clearOverlay();
      setViewportHud("");
        completeCurrentSub();
      setCoach(t("adv.s0261"), "");
    }
  };
  setInteractCleanup(() => setViewportHud(""));
  wrapRestart(api, l9s2);
}

function l9s3(api) {
  runChain(api, [
    (a, next) => {
      a.setCoach(t("adv.s0054"), "");
      a.mountOverlay(`<div class="card"><div id="l93h"></div></div>`, { dock: "bottom", passThrough: false });
      mountRevealSteps(document.getElementById("l93h"), {
        title: t("adv.s0375"),
        stepScenes: [
          { scene: "rest", sceneArgs: { shape: "wide", arrows: false, wobble: false } },
          { scene: "recoil", sceneArgs: { variant: "pair" } },
          { scene: "rest", sceneArgs: { shape: "ball", arrows: true, wobble: true } },
        ],
        steps: [
          "Isolate block **A** on block **B**: each surface still obeys Newton’s third law at the touch point.",
          "**F(A→B)** and **F(B→A)** are equal in size, opposite in direction - but they act on **different** bodies.",
          "Never paste both members of a third-law pair onto the **same** single-object FBD as if they cancel there.",
        ],
        onDone: () => {
          a.clearOverlay();
          next();
        },
      });
    },
    (a, _n, finish) => {
      a.arena.playExample("rest", { shape: "wide", arrows: false });
      a.mountOverlay(`<div class="card"><div id="l93z"></div></div>`, { dock: "bottom", passThrough: false });
      mountDragZones(document.getElementById("l93z"), {
        title: t("adv.s0092"),
        instructions: t("adv.s0122"),
        zones: [
          {
            id: "law",
            label: t("adv.s0504"),
            accept: ["eq"],
          },
        ],
        chips: [
          { id: "eq", text: t("adv.s0149") },
          { id: "bad", text: t("adv.s0068") },
          { id: "bad2", text: t("adv.s0414") },
        ],
        onDone: () => {
          a.clearOverlay();
          a.setCoach(t("adv.s0338"), "");
          finish();
        },
      });
    },
  ]);
}

function l9s4(api) {
  const { arena, setCoach, mountOverlay, clearOverlay, completeCurrentSub } = api;
  arena.playExample("vector", { fx: 0.9, fy: 0.48 });
  setCoach(t("adv.s0358"), "");
  mountOverlay(
    `<div class="card scenario-box"><h2>Colinear accountant</h2>
    <p>+F₁ <input type="range" id="l94a" min="0" max="40" value="15" /> <span id="l94av">15</span> N</p>
    <p>F₂ (may be negative) <input type="range" id="l94b" min="-25" max="25" value="-8" /> <span id="l94bv">−8</span> N</p>
    <p>+F₃ <input type="range" id="l94c" min="-15" max="25" value="3" /> <span id="l94cv">3</span> N</p>
    <p id="l94r" class="readout"></p>
    <button type="button" class="btn primary hidden" id="l94ok">Lock net = +10 N (±0.5)</button></div>`,
    { dock: "bottom", passThrough: false }
  );
  function sync() {
    const a1 = +document.getElementById("l94a").value;
    const a2 = +document.getElementById("l94b").value;
    const a3 = +document.getElementById("l94c").value;
    document.getElementById("l94av").textContent = String(a1);
    document.getElementById("l94bv").textContent = String(a2);
    document.getElementById("l94cv").textContent = String(a3);
    const sum = a1 + a2 + a3;
    document.getElementById("l94r").textContent = `Net along the line = ${sum.toFixed(1)} N`;
    const viz = Math.max(0.15, Math.min(2.2, sum / 14));
    arena.playExample("vector", { fx: viz * 0.95, fy: 0.15 });
    const ok = Math.abs(sum - 10) < 0.55;
    document.getElementById("l94ok").classList.toggle("hidden", !ok);
    setViewportHud(
      `<div class="hud-readout">Remake the classic drill: +15 − 8 + 3 → net +10 N.</div>`
    );
  }
  document.getElementById("l94a").oninput = sync;
  document.getElementById("l94b").oninput = sync;
  document.getElementById("l94c").oninput = sync;
  sync();
  document.getElementById("l94ok").onclick = () => {
    clearOverlay();
    setViewportHud("");
    completeCurrentSub();
    setCoach(t("adv.s0295"), "");
  };
  wrapRestart(api, l9s4);
}

function l9s5(api) {
  runChain(api, [
    (a, next) => {
      a.setCoach(t("adv.s0100"), "");
      a.mountOverlay(`<div class="card"><div id="l95d"></div></div>`, { dock: "bottom", passThrough: false });
      mountDemoWithDwell(document.getElementById("l95d"), {
        minDwellMs: 4600,
        scene: "drift",
        sceneArgs: { withTrack: true },
        html: `<p><strong>Hatirjheel loop pace:</strong> holding speed still needs engine/body power because drag steals mechanical energy.</p>
          <p class="drag-hint">From rest, it’s the static-friction budget at the tire patch that lets you push backward on Earth without slipping.</p>`,
        onContinue: () => {
          a.clearOverlay();
          next();
        },
      });
    },
    (a, _n, finish) => {
      a.mountOverlay(`<div class="card"><div id="l95z"></div></div>`, { dock: "bottom", passThrough: false });
      mountDragZones(document.getElementById("l95z"), {
        title: t("adv.s0099"),
        instructions: t("adv.s0233"),
        zones: [
          { id: "fast", label: t("adv.s0374"), accept: ["drag"] },
          { id: "start", label: t("adv.s0082"), accept: ["staticf"] },
        ],
        chips: [
          { id: "drag", text: t("adv.s0022") },
          { id: "staticf", text: t("adv.s0376") },
          { id: "bad", text: t("adv.s0269") },
        ],
        onDone: () => {
          a.clearOverlay();
          a.setCoach(t("adv.s0112"), "");
          finish();
        },
      });
    },
  ]);
}

function l9s6(api) {
  runChain(api, [
    (a, next) => {
      a.setCoach(t("adv.s0347"), "");
      a.mountOverlay(`<div class="card"><div id="l96d"></div></div>`, { dock: "bottom", passThrough: false });
      mountDemoWithDwell(document.getElementById("l96d"), {
        minDwellMs: 4400,
        scene: "elevator",
        html: `<p><strong>Elevator trick:</strong> if the cab accelerates downward, the floorNormal on you drops - scales read “lighter.”</p>
          <p class="drag-hint">Gravity doesn’t vanish; apparent weight tracks how hard the floor pushes.</p>`,
        onContinue: () => {
          a.clearOverlay();
          next();
        },
      });
    },
    (a, _n, finish) => {
      kidMcq(
        a,
        {
          title: t("adv.s0143"),
          question:
            "Motijheel metro repair cab accelerates **downward** while you stand on a bathroom scale. Compared with your true weight, the scale reads…",
          choices: ["Greater", "Less", "Exactly equal no matter what"],
          okIndex: 1,
          coachShort: t("adv.s0267"),
        },
        finish
      );
    },
  ]);
}

function l9s7(api) {
  const { arena, setCoach, mountOverlay, clearOverlay, completeCurrentSub, setInteractCleanup } = api;
  arena.playExample("forceCompare");
  setCoach(t("adv.s0351"), "");
  mountOverlay(
    `<div class="card scenario-box"><h2>Inertia duel</h2>
    <p>Net push F (N) <input type="range" id="l97f" min="40" max="160" value="96" /> <span id="l97fv">96</span></p>
    <p>Heavy crate (kg) <input type="range" id="l97h" min="12" max="40" value="24" /> <span id="l97hv">24</span></p>
    <p>Light crate (kg) <input type="range" id="l97l" min="4" max="20" value="8" /> <span id="l97lv">8</span></p>
    <p id="l97r" class="readout"></p>
    <button type="button" class="btn primary hidden" id="l97ok">Heavy shows smaller a (inertia win)</button></div>`,
    { dock: "bottom", passThrough: false }
  );
  function sync() {
    const F = +document.getElementById("l97f").value;
    let mh = +document.getElementById("l97h").value;
    let ml = +document.getElementById("l97l").value;
    if (mh <= ml) {
      ml = Math.max(4, mh - 4);
      document.getElementById("l97l").value = String(ml);
    }
    document.getElementById("l97fv").textContent = String(F);
    document.getElementById("l97hv").textContent = String(mh);
    document.getElementById("l97lv").textContent = String(ml);
    const ah = F / mh;
    const al = F / ml;
    document.getElementById("l97r").textContent = `a_heavy ≈ ${ah.toFixed(2)} m/s² · a_light ≈ ${al.toFixed(2)} m/s²`;
    const ok = ah < al - 0.08;
    document.getElementById("l97ok").classList.toggle("hidden", !ok);
    setViewportHud(`<div class="hud-readout">Same F, bigger m ⇒ smaller a - Newton II in one glance.</div>`);
  }
  document.getElementById("l97f").oninput = sync;
  document.getElementById("l97h").oninput = sync;
  document.getElementById("l97l").oninput = sync;
  sync();
  document.getElementById("l97ok").onclick = () => {
    clearOverlay();
    setViewportHud("");
    completeCurrentSub();
    setCoach(t("adv.s0228"), "");
  };
  setInteractCleanup(() => setViewportHud(""));
  wrapRestart(api, l9s7);
}

function l9s8(api) {
  const { arena, setCoach, mountOverlay, clearOverlay, completeCurrentSub } = api;
  arena.playExample("tugOfWar");
  setCoach(t("adv.s0470"), "");
  mountOverlay(`<div class="card"><div id="l98z"></div></div>`, { dock: "bottom", passThrough: false });
  mountDragZones(document.getElementById("l98z"), {
    title: t("adv.s0396"),
    instructions: t("adv.s0483"),
    zones: [
      { id: "why", label: t("adv.s0273"), accept: ["push"] },
    ],
    chips: [
      { id: "push", text: t("adv.s0139") },
      { id: "bad", text: t("adv.s0056") },
      { id: "bad2", text: t("adv.s0445") },
    ],
    onDone: () => {
      clearOverlay();
      completeCurrentSub();
      setCoach(t("adv.s0202"), "");
    },
  });
  wrapRestart(api, l9s8);
}

function l9s9(api) {
  runChain(api, [
    (a, next) => {
      a.setCoach(t("adv.s0195"), "");
      a.mountOverlay(`<div class="card"><div id="l99h"></div></div>`, { dock: "bottom", passThrough: false });
      mountRevealSteps(document.getElementById("l99h"), {
        title: t("adv.s0213"),
        stepScenes: [
          { scene: "glide", sceneArgs: { prop: "rock", speed: 1.5 } },
          { scene: "massCompare" },
          { scene: "recoil", sceneArgs: { variant: "pair" } },
        ],
        steps: [
          "First law: **ΣF = 0** lets velocity stay **steady** (even non-zero) in an inertial frame.",
          "Second law: **ΣF = m a** on **one** chosen body - acceleration lines up with net force.",
          "Third law: partners live on **two** bodies - they never erase each other on a single FBD.",
        ],
        onDone: () => {
          a.clearOverlay();
          next();
        },
      });
    },
    (a, _n, finish) => {
      kidMcq(
        a,
        {
          title: t("adv.s0080"),
          question:
            "Which quote smuggles a classic **misconception** about inertia / first law on Earth?",
          choices: [
            "ΣF = m a keeps net force and acceleration locked together (Newton II).",
            "Objects only keep coasting while your muscles keep touching because motion “needs fuel” forward (Aristotle hangover).",
            "Rocket exhaust down pushes the rocket up - textbook Newton III.",
          ],
          okIndex: 1,
          coachShort: t("adv.s0173"),
        },
        () => {
          a.mountOverlay(
            `<div class="card scenario-box"><p><span class="badge-earned">🧲 Magnet Master Badge</span></p>
            <p class="drag-hint">You braided ropes, ramps, wheels, and magnets into one mental toolkit.</p>
            <button type="button" class="btn primary" id="l99go">Continue</button></div>`,
            { dock: "bottom", passThrough: false }
          );
          document.getElementById("l99go").onclick = () => {
            a.clearOverlay();
            finish();
          };
        }
      );
    },
  ]);
}

/* ========== Level 10: Boss ========== */
function runL10(api) {
  const subs = [l10s0, l10s1, l10s2, l10s3, l10s4, l10s5, l10s6, l10s7, l10s8, l10s9];
  subs[api.state.sub](api);
}

function l10s0(api) {
  runChain(api, [
    (a, next) => {
      a.setCoach(t("adv.s0297"), "");
      a.mountOverlay(`<div class="card"><div id="l10d0"></div></div>`, { dock: "bottom", passThrough: false });
      mountDemoWithDwell(document.getElementById("l10d0"), {
        minDwellMs: 4500,
        scene: "glide",
        sceneArgs: { frictionMu: 0.02, speed: 2.1 },
        html: `<p><strong>Boss observation:</strong> with cheat-level low μ, the rock keeps sliding - no forward force needed to maintain speed.</p>
          <p class="drag-hint">First law: if ΣF = 0, **v** can stay constant (even non-zero).</p>`,
        onContinue: () => {
          a.clearOverlay();
          next();
        },
      });
    },
    (a, _n, finish) => {
      kidMcq(
        a,
        {
          title: t("adv.s0059"),
          question:
            "In an inertial frame, if the net force on a particle is **zero**, its velocity…",
          choices: [
            "Must spiral upward forever",
            "Can stay constant (maybe zero, maybe cruising)",
            "Must jitter randomly",
          ],
          okIndex: 1,
          coachShort: t("adv.s0497"),
        },
        finish
      );
    },
  ]);
}

function l10s1(api) {
  const { arena, setCoach, mountOverlay, clearOverlay, completeCurrentSub, setInteractCleanup } = api;
  arena.playExample("massCompare");
  setCoach(t("adv.s0222"), "");
  mountOverlay(
    `<div class="card scenario-box"><h2>Boss 2 - Newton II tuner</h2>
    <p>Net force (N) <input type="range" id="lb1f" min="4" max="28" value="12" /> <span id="lb1fv">12</span></p>
    <p>Mass (kg) <input type="range" id="lb1m" step="0.5" min="1" max="9" value="5" /> <span id="lb1mv">5.0</span></p>
    <p id="lb1r" class="readout"></p>
    <button type="button" class="btn primary hidden" id="lb1ok">a = 4.0 m/s² (±0.25)</button></div>`,
    { dock: "bottom", passThrough: false }
  );
  function sync() {
    const F = +document.getElementById("lb1f").value;
    const m = +document.getElementById("lb1m").value;
    document.getElementById("lb1fv").textContent = String(F);
    document.getElementById("lb1mv").textContent = m.toFixed(1);
    const a = F / m;
    document.getElementById("lb1r").textContent = `a = F ÷ m = ${a.toFixed(3)} m/s²`;
    setViewportHud(`<div class="hud-readout">Target mental math: 12 N ÷ 3 kg = 4 m/s².</div>`);
    const ok = Math.abs(a - 4) < 0.26 && Math.abs(F - 12) < 0.6 && Math.abs(m - 3) < 0.21;
    document.getElementById("lb1ok").classList.toggle("hidden", !ok);
  }
  document.getElementById("lb1f").oninput = sync;
  document.getElementById("lb1m").oninput = sync;
  sync();
  document.getElementById("lb1ok").onclick = () => {
    clearOverlay();
    setViewportHud("");
    completeCurrentSub();
    setCoach(t("adv.s0254"), "");
  };
  setInteractCleanup(() => setViewportHud(""));
  wrapRestart(api, l10s1);
}

function l10s2(api) {
  const { arena, setCoach, completeCurrentSub } = api;
  arena.playExample("orbit");
  setCoach(t("adv.s0421"), "");
  kidMcq(
    api,
    {
      title: t("adv.s0060"),
      question:
        "You stand on Banani pavement. Earth pulls you downward with weight **W**. The Newton-third-law partner force is best described as…",
      choices: [
        "You pull Earth upward with magnitude W (same interaction)",
        "Only air pushes you - Earth stays unbothered",
        "Normal force is automatically the reaction to weight",
      ],
      okIndex: 0,
      coachShort: t("adv.s0460"),
    },
    () => {
      completeCurrentSub();
      setCoach(t("adv.s0114"), "");
    }
  );
  wrapRestart(api, l10s2);
}

function l10s3(api) {
  runChain(api, [
    (a, next) => {
      a.setCoach(t("adv.s0048"), "");
      a.mountOverlay(`<div class="card"><div id="lb3h"></div></div>`, { dock: "bottom", passThrough: false });
      mountRevealSteps(document.getElementById("lb3h"), {
        title: t("adv.s0047"),
        stepScenes: [
          { scene: "orbit", sceneArgs: { radius: 3.2, speed: 0.55 } },
          { scene: "orbit", sceneArgs: { radius: 2.0, speed: 0.95, showGravity: true } },
          { scene: "ramp", sceneArgs: { angleDeg: 38, massKg: 6, frictionMu: null } },
        ],
        steps: [
          "Flat turn: sideways friction can supply centripetal push (until it slips).",
          "Bank the road: the normal force tilts and grows a **horizontal** component toward the curve center.",
          "That component teams with friction (or even replaces it in ideal designs) to steer the net inward push.",
        ],
        onDone: () => {
          a.clearOverlay();
          next();
        },
      });
    },
    (a, _n, finish) => {
      kidMcq(
        a,
        {
          title: t("adv.s0061"),
          question:
            "On a banked highway curve (no fancy tricks), why can normal force help keep a car turning?",
          choices: [
            "It aims straight up only, always canceling gravity perfectly",
            "It tilts with the roadway so part of it points horizontally toward the curve center",
            "It vanishes whenever speed is nonzero",
          ],
          okIndex: 1,
          coachShort: t("adv.s0419"),
        },
        finish
      );
    },
  ]);
}

function l10s4(api) {
  const { setCoach, mountOverlay, clearOverlay, completeCurrentSub, setInteractCleanup } = api;
  setCoach(t("adv.s0359"), "");
  mountOverlay(
    `<div class="card scenario-box"><h2>Boss 5 - friction budget</h2>
    <p>μ<sub>s</sub> <input type="range" id="lb4m" min="0.08" max="0.6" step="0.01" value="0.2" /> <span id="lb4mv">0.20</span></p>
    <p>Normal N (N) <input type="range" id="lb4n" min="80" max="320" value="200" /> <span id="lb4nv">200</span></p>
    <p id="lb4r" class="readout"></p>
    <button type="button" class="btn primary hidden" id="lb4ok">F<sub>max</sub> ≈ 50 N (±2)</button></div>`,
    { dock: "bottom", passThrough: false }
  );
  function sync() {
    const mu = +document.getElementById("lb4m").value;
    const N = +document.getElementById("lb4n").value;
    document.getElementById("lb4mv").textContent = mu.toFixed(2);
    document.getElementById("lb4nv").textContent = String(N);
    const fm = mu * N;
    document.getElementById("lb4r").textContent = `F_max ≈ μ · N = ${fm.toFixed(1)} N`;
    setViewportHud(`<div class="hud-readout">Peak static grip scales with how hard surfaces press together.</div>`);
    document.getElementById("lb4ok").classList.toggle("hidden", Math.abs(fm - 50) > 2.05);
  }
  document.getElementById("lb4m").oninput = sync;
  document.getElementById("lb4n").oninput = sync;
  sync();
  document.getElementById("lb4ok").onclick = () => {
    clearOverlay();
    setViewportHud("");
    completeCurrentSub();
    setCoach(t("adv.s0508"), "");
  };
  setInteractCleanup(() => setViewportHud(""));
  wrapRestart(api, l10s4);
}

function l10s5(api) {
  const { arena, setCoach, completeCurrentSub } = api;
  arena.playExample("pulley", { mLeft: 8, mRight: 4 });
  setViewportHud(`<div class="hud-readout">Ideal Atwood: m₁ = 2 m₂ in this toy scene.</div>`);
  setCoach(t("adv.s0451"), "");
  kidMcq(
    api,
    {
      title: t("adv.s0062"),
      question:
        "Ideal rope, m₁ = 2 m₂. Right after release, the rope tension is…",
      choices: [
        "Exactly m₁ g (full weight of the heavy side)",
        "Somewhere between m₂ g and m₁ g",
        "Zero because ropes can’t pull",
      ],
      okIndex: 1,
      coachShort: t("adv.s0406"),
    },
    () => {
      setViewportHud("");
      completeCurrentSub();
      setCoach(t("adv.s0110"), "");
    }
  );
  wrapRestart(api, l10s5);
}

function l10s6(api) {
  runChain(api, [
    (a, next) => {
      a.setCoach(t("adv.s0097"), "");
      a.mountOverlay(`<div class="card"><div id="lb6d"></div></div>`, { dock: "bottom", passThrough: false });
      mountDemoWithDwell(document.getElementById("lb6d"), {
        minDwellMs: 4400,
        scene: "drift",
        sceneArgs: { withTrack: true },
        html: `<p><strong>Boss 7:</strong> at steady highway speed, acceleration ≈ 0 but dissipative forces steal energy - engines do work to replace it.</p>`,
        onContinue: () => {
          a.clearOverlay();
          next();
        },
      });
    },
    (a, _n, finish) => {
      kidMcq(
        a,
        {
          title: t("adv.s0063"),
          question:
            "On flat Cox’s Bazar Marine Drive at steady speed, the engine’s forward traction mostly balances…",
          choices: [
            "Only vertical normal force",
            "Air drag + rolling losses (dissipative gang)",
            "Static friction that wants to stop all motion magically",
          ],
          okIndex: 1,
          coachShort: t("adv.s0495"),
        },
        finish
      );
    },
  ]);
}

function l10s7(api) {
  const { arena, setCoach, mountOverlay, clearOverlay, completeCurrentSub } = api;
  arena.playExample("ramp", { angleDeg: 32, frictionMu: 0.35, massKg: 10 });
  setCoach(t("adv.s0330"), "");
  mountOverlay(`<div class="card"><div id="lb7z"></div></div>`, { dock: "bottom", passThrough: false });
  mountDragZones(document.getElementById("lb7z"), {
    title: t("adv.s0064"),
    instructions:
      "Block pinned at rest while you **also** push down along the ramp (helping gravity scale the slip attempt).",
    zones: [
      {
        id: "dir",
        label: t("adv.s0377"),
        accept: ["up"],
      },
    ],
    chips: [
      { id: "up", text: t("adv.s0437") },
      { id: "bad", text: t("adv.s0029") },
      { id: "bad2", text: t("adv.s0294") },
    ],
    onDone: () => {
      clearOverlay();
      completeCurrentSub();
      setCoach(t("adv.s0248"), "");
    },
  });
  wrapRestart(api, l10s7);
}

function l10s8(api) {
  runChain(api, [
    (a, next) => {
      a.arena.playExample("vector", { fx: 1.1, fy: 0.35 });
      a.setViewportHud(`<div class="hud-readout">Boss chain: read ΣF, read inertia.</div>`);
      kidMcq(
        a,
        {
          title: t("adv.s0065"),
          question:
            "Hatim’s delivery van cruises Matijheel straight at constant speed. The net force on the van is…",
          choices: ["Zero (no acceleration)", "Forward equal to weight", "Backward equal to engine thrust always"],
          okIndex: 0,
          coachShort: t("adv.s0086"),
        },
        next
      );
    },
    (a, _n, finish) => {
      kidMcq(
        a,
        {
          title: t("adv.s0066"),
          question:
            "Same net forward force on a bicycle trailer vs a loaded tea truck. Which picks up speed slower?",
          choices: ["Trailer (always lighter)", "Tea truck (more mass, meeker a)", "They must match acceleration"],
          okIndex: 1,
          coachShort: t("adv.s0346"),
        },
        () => {
          a.setViewportHud("");
          finish();
          a.setCoach(t("adv.s0434"), "");
        }
      );
    },
  ]);
}

function l10s9(api) {
  runChain(api, [
    (a, next) => {
      a.arena.playExample("kickedBall");
      a.setCoach(t("adv.s0155"), "");
      kidMcq(
        a,
        {
          title: t("adv.s0152"),
          question:
            "Forces on Bashundhara delivery van sum to zero while it rolls straight. Which is possible?",
          choices: [
            "It must be parked - ΣF = 0 kills motion",
            "It can cruise at steady speed with balanced thrust/drag",
            "It must be accelerating backward",
          ],
          okIndex: 1,
          coachShort: t("adv.s0505"),
        },
        next
      );
    },
    (a, next) => {
      a.arena.playExample("rope");
      kidMcq(
        a,
        {
          title: t("adv.s0153"),
          question:
            "Action-reaction partners **do not** cancel on one body because…",
          choices: [
            "They always attach to the same object",
            "They always act on different bodies, so you sum them per FBD",
            "They are imaginary bookkeeping tricks",
          ],
          okIndex: 1,
          coachShort: t("adv.s0076"),
        },
        next
      );
    },
    (a, _n, finish) => {
      a.arena.playExample("frictionLoop");
      kidMcq(
        a,
        {
          title: t("adv.s0154"),
          question:
            "Rubber office chair wheels on laminate vs metal desk toy wheels on felt - rolling resistance is usually…",
          choices: [
            "Huge compared with sliding everywhere",
            "Smaller than skidding the same load across the surface",
            "Infinite in both cases",
          ],
          okIndex: 1,
          coachShort: t("adv.s0326"),
        },
        () => {
          a.mountOverlay(
            `<div class="card scenario-box"><h2>Champion</h2>
            <p><span class="badge-earned">👑 Force Champion Badge</span></p>
            <p>Force Fighter complete - you leveled push, pull, friction, ropes, ramps, and magnets in one run.</p>
            <button type="button" class="btn primary" id="lb9end">Continue</button></div>`,
            { dock: "bottom", passThrough: false }
          );
          document.getElementById("lb9end").onclick = () => {
            a.clearOverlay();
            a.setCoach(t("adv.s0401"), "");
            finish();
          };
        }
      );
    },
  ]);
}
