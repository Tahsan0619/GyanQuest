/**
 * Three.js Force Arena: minimal scene for Force Fighter (global THREE from CDN).
 */
import { SCENE_MOTION_MULT } from "./timings.js";
import {
  CAR_TRAVEL_Y,
  cloneAsset,
  hasAsset,
  spawnAsset,
  PLAYGROUND_ASSET_MASS,
} from "./asset-loader.js";
import { SCENES } from "./scene-registry.js";
import { getPlaygroundPreset } from "./playground-presets.js";

const THREE = window.THREE;
const M = SCENE_MOTION_MULT;
const dampPerStep = Math.pow(0.92, 1 / M);

export function createForceArena(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x87ceeb, 1);
  if (THREE.sRGBEncoding !== undefined) renderer.outputEncoding = THREE.sRGBEncoding;
  if (THREE.ACESFilmicToneMapping !== undefined) {
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
  }
  if (renderer.physicallyCorrectLights !== undefined) renderer.physicallyCorrectLights = true;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xbae6fd, 12, 32);

  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.set(0, 4.2, 9);
  camera.lookAt(0, 0.4, 0);

  const hemi = new THREE.HemisphereLight(0x7aa8ff, 0x1a1a1a, 0.85);
  scene.add(hemi);
  const dir = new THREE.DirectionalLight(0xffffff, 0.55);
  dir.position.set(4, 10, 6);
  scene.add(dir);
  const warm = new THREE.PointLight(0xffcfa3, 0.35, 12, 2);
  warm.position.set(-0.4, 1.4, 1.2);
  scene.add(warm);

  const grid = new THREE.GridHelper(40, 40, 0x1a56db, 0x1e2a3a);
  grid.position.y = 0.01;
  scene.add(grid);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 40),
    new THREE.MeshStandardMaterial({ color: 0x121922, roughness: 0.9, metalness: 0.1 })
  );
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  const blueTrack = new THREE.Mesh(
    new THREE.PlaneGeometry(24, 3),
    new THREE.MeshStandardMaterial({
      color: 0x1a56db,
      emissive: 0x0a2a6a,
      emissiveIntensity: 0.35,
      transparent: true,
      opacity: 0.55,
      roughness: 0.4,
    })
  );
  blueTrack.rotation.x = -Math.PI / 2;
  blueTrack.position.set(0, 0.02, 0);
  blueTrack.visible = false;
  scene.add(blueTrack);

  /** Interactive hero body (Kenney rocks) - never a hidden placeholder block. */
  const rock = new THREE.Group();
  rock.visible = false;
  scene.add(rock);

  const wall = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 2.2, 3),
    new THREE.MeshStandardMaterial({ color: 0x4a4f58, roughness: 0.7 })
  );
  wall.position.set(5.5, 1.1, 0);
  wall.visible = false;
  scene.add(wall);

  const arrowMat = new THREE.LineBasicMaterial({ color: 0xff7a33, linewidth: 2 });
  let arrowLine = null;

  /** @type {((dt: number) => void) | null} */
  let extraTick = null;
  const extrasRoot = new THREE.Group();
  scene.add(extrasRoot);

  function disposeTree(obj) {
    if (!obj) return;
    if (typeof obj.traverse === "function") {
      obj.traverse((c) => {
        if (c.geometry) c.geometry.dispose();
        if (c.material) {
          if (Array.isArray(c.material)) c.material.forEach((m) => m.dispose());
          else c.material.dispose();
        }
      });
    } else {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) obj.material.dispose();
    }
  }

  function clearExtras() {
    extraTick = null;
    while (extrasRoot.children.length) {
      const m = extrasRoot.children[0];
      extrasRoot.remove(m);
      disposeTree(m);
    }
  }

  function mkStdMat(color, opts = {}) {
    return new THREE.MeshStandardMaterial({
      color,
      roughness: opts.roughness ?? 0.5,
      metalness: opts.metalness ?? 0.15,
      emissive: opts.emissive ?? 0x000000,
      emissiveIntensity: opts.emissiveIntensity ?? 0,
    });
  }
  function mkBox(w, h, d, color, opts) {
    return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mkStdMat(color, opts));
  }
  function mkSphere(r, color, opts) {
    return new THREE.Mesh(new THREE.SphereGeometry(r, 24, 16), mkStdMat(color, opts));
  }
  function mkArrow(dir, origin, length, color) {
    const head = Math.min(0.55, Math.max(0.18, length * 0.25));
    return new THREE.ArrowHelper(
      dir.clone().normalize(),
      origin.clone(),
      length,
      color,
      head,
      head * 0.55,
    );
  }
  function mkLine(p1, p2, color) {
    const g = new THREE.BufferGeometry().setFromPoints([p1, p2]);
    return new THREE.Line(g, new THREE.LineBasicMaterial({ color }));
  }

  /** Kenney model from 3D Assets/, or fallback mesh. */
  function spawn(key, opts = {}) {
    return spawnAsset(key, { parent: extrasRoot, ...opts });
  }

  function spawnCrate(pos, color = 0xc4a574, size = "large") {
    const key = size === "small" ? "boxSmall" : size === "wide" ? "boxWide" : "boxLarge";
    const dims = size === "small" ? [0.45, 0.35, 0.4] : size === "wide" ? [0.9, 0.5, 0.65] : [0.65, 0.45, 0.55];
    return spawn(key, {
      position: pos,
      color,
      fallback: () => {
        const m = mkBox(dims[0], dims[1], dims[2], color, { roughness: 0.7 });
        m.position.set(pos.x, pos.y, pos.z);
        return m;
      },
    });
  }

  function spawnCar(pos, variant = "sports", color) {
    const key =
      variant === "truck"
        ? "truck"
        : variant === "delivery"
          ? "delivery"
          : variant === "van"
            ? "van"
            : variant === "sedan"
              ? "carSedan"
              : variant === "race"
                ? "carRace"
                : variant === "kart"
                  ? "kart"
                  : "carSports";
    const c = color ?? (variant === "truck" ? 0x2d6a4f : 0xd92d20);
    const dims = variant === "truck" ? [1.35, 0.75, 0.85] : [0.85, 0.38, 0.55];
    const car = spawn(key, {
      position: pos,
      color: c,
      rotationY: hasAsset(key) ? 0 : CAR_TRAVEL_Y,
      fallback: () => {
        const m = mkBox(dims[0], dims[1], dims[2], c, { roughness: 0.5, metalness: 0.2 });
        m.position.set(pos.x, pos.y, pos.z);
        m.rotation.y = CAR_TRAVEL_Y;
        return m;
      },
    });
    if (car && hasAsset(key)) car.rotation.y = CAR_TRAVEL_Y;
    return car;
  }

  let rockVel = new THREE.Vector3();
  /** When true, hero rock stays still (no idle bob) while the kid drags an aim arrow. */
  let rockAimDrag = false;
  const slideSpeed = 2.2 / M;
  let slideMode = false;
  let wallHitDone = false;
  let useKenneyRock = false;
  let lastExample = { kind: "idle", opts: {} };

  let glideFrictionMu = 0;
  /** @type {{ F: number; sliding: boolean; v: number; crate: THREE.Object3D | null; FstaticMax: number; Fkinetic: number; m: number; N: number; muS: number; muK: number } | null} */
  let frictionPushState = null;
  /** @type {{ fL: number; fR: number; v: number; crate: THREE.Object3D | null } | null} */
  let equilibriumBoxState = null;
  /** @type {{ leftN: number; rightN: number; knot: THREE.Object3D | null } | null} */
  let tugWarState = null;

  function setGlideFrictionMu(mu) {
    glideFrictionMu = Math.max(0, Math.min(2.5, +mu || 0));
  }

  /* ---------- Force Lab playground (free play) ---------- */
  let playgroundActive = false;
  /** @type {{ mesh: THREE.Object3D; vel: THREE.Vector3; mass: number; kind: string; radius: number }[]} */
  let playgroundBodies = [];
  let playgroundIce = true;
  let playgroundFriction = 0.38;
  let playgroundSpawnN = 0;
  /** @type {import("three/examples/jsm/controls/OrbitControls").OrbitControls | null} */
  let orbitControls = null;

  const PLAYGROUND_LEGACY = {
    rock: "rocks",
    car: "carSports",
    carRace: "carRace",
    truck: "truck",
    crate: "boxLarge",
    cone: "cone",
    ball: "tire",
  };

  const CAR_ASSET_KEYS = new Set([
    "carSports",
    "carRace",
    "carSedan",
    "truck",
    "kart",
    "delivery",
    "van",
  ]);

  function playgroundMeshRadius(mesh) {
    mesh.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(mesh);
    const size = box.getSize(new THREE.Vector3());
    const footprint = Math.hypot(size.x, size.z) * 0.52;
    const bulk = Math.max(size.x, size.y, size.z) * 0.38;
    return Math.max(0.45, Math.max(footprint, bulk));
  }

  function refreshPlaygroundBodyRadius(body) {
    body.radius = playgroundMeshRadius(body.mesh);
  }

  function clearPlaygroundBodies() {
    for (const b of playgroundBodies) {
      extrasRoot.remove(b.mesh);
      disposeTree(b.mesh);
    }
    playgroundBodies = [];
    playgroundSpawnN = 0;
  }

  function wrapPlaygroundMesh(mesh, kind, mass = 1, frictionMult = 1) {
    mesh.userData.playgroundKind = kind;
    const body = {
      mesh,
      vel: new THREE.Vector3(),
      mass,
      kind,
      radius: playgroundMeshRadius(mesh),
      frictionMult: frictionMult ?? 1,
    };
    playgroundBodies.push(body);
    return body;
  }

  function spawnPlaygroundFromDef(def) {
    const body = spawnPlaygroundBody(def.kind, def.x ?? 0, def.z ?? 0);
    if (!body) return null;
    if (def.frictionMult != null) body.frictionMult = def.frictionMult;
    if (def.vel) {
      body.vel.set((def.vel[0] ?? 0) / M, 0, (def.vel[1] ?? 0) / M);
    }
    return body;
  }

  function spawnPlaygroundMeshForAsset(assetKey, px, pz) {
    if (CAR_ASSET_KEYS.has(assetKey)) {
      const variant =
        assetKey === "truck"
          ? "truck"
          : assetKey === "carRace"
            ? "race"
            : assetKey === "delivery"
              ? "delivery"
              : assetKey === "kart"
                ? "kart"
                : assetKey === "van"
                  ? "van"
                  : assetKey === "carSedan"
                    ? "sedan"
                    : "sports";
      return spawnCar({ x: px, y: 0, z: pz }, variant);
    }
    if (assetKey === "boxLarge" || assetKey === "boxSmall" || assetKey === "boxWide") {
      const size = assetKey === "boxSmall" ? "small" : assetKey === "boxWide" ? "wide" : "large";
      return spawnCrate({ x: px, y: 0, z: pz }, undefined, size);
    }
    if (assetKey === "rocks") {
      const mesh = spawn("rocks", {
        position: { x: px, y: 0, z: pz },
        fallback: () => mkSphere(0.55, 0x6f5f52),
      });
      if (mesh) mesh.position.y = mesh.position.y || 0.35;
      return mesh;
    }
    if (assetKey === "tire") {
      return spawn("tire", {
        position: { x: px, y: 0.35, z: pz },
        fallback: () => mkSphere(0.4, 0xd92d20),
      });
    }
    return spawn(assetKey, { position: { x: px, y: 0, z: pz } });
  }

  function spawnPlaygroundBody(kind, x = 0, z = 0) {
    const assetKey = PLAYGROUND_LEGACY[kind] || kind;
    playgroundSpawnN += 1;
    const px = x + (Math.random() - 0.5) * 0.45;
    const pz = z + (Math.random() - 0.5) * 0.45;
    const mesh = spawnPlaygroundMeshForAsset(assetKey, px, pz);
    if (!mesh) return null;
    if (!mesh.parent) extrasRoot.add(mesh);
    mesh.position.set(px, mesh.position.y || 0, pz);
    const mass = PLAYGROUND_ASSET_MASS[assetKey] ?? 1;
    const body = wrapPlaygroundMesh(mesh, assetKey, mass);
    refreshPlaygroundBodyRadius(body);
    return body;
  }

  function clampPlaygroundBody(b) {
    const m = b.mesh;
    if (wall.visible && m.position.x > wall.position.x - b.radius - 0.35) {
      m.position.x = wall.position.x - b.radius - 0.35;
      b.vel.x = -Math.abs(b.vel.x) * 0.42;
    }
    if (m.position.x < -9 + b.radius) {
      m.position.x = -9 + b.radius;
      b.vel.x = Math.abs(b.vel.x) * 0.35;
    }
    if (m.position.x > 9 - b.radius) {
      m.position.x = 9 - b.radius;
      b.vel.x = -Math.abs(b.vel.x) * 0.35;
    }
    if (m.position.z < -4 + b.radius) {
      m.position.z = -4 + b.radius;
      b.vel.z = Math.abs(b.vel.z) * 0.35;
    }
    if (m.position.z > 4 - b.radius) {
      m.position.z = 4 - b.radius;
      b.vel.z = -Math.abs(b.vel.z) * 0.35;
    }
  }

  let lastPlaygroundBumpMsg = 0;

  function resolvePlaygroundCollisions(onBump) {
    const restitution = 0.58;
    for (let i = 0; i < playgroundBodies.length; i++) {
      for (let j = i + 1; j < playgroundBodies.length; j++) {
        const a = playgroundBodies[i];
        const b = playgroundBodies[j];
        const dx = b.mesh.position.x - a.mesh.position.x;
        const dz = b.mesh.position.z - a.mesh.position.z;
        let dist = Math.hypot(dx, dz);
        const minDist = a.radius + b.radius;
        if (dist >= minDist) continue;
        let nx;
        let nz;
        if (dist < 0.001) {
          const angle = (i + j) * 0.7;
          nx = Math.cos(angle);
          nz = Math.sin(angle);
          dist = 0.001;
        } else {
          nx = dx / dist;
          nz = dz / dist;
        }
        const overlap = minDist - dist;
        const totalMass = a.mass + b.mass;
        a.mesh.position.x -= (nx * overlap * b.mass) / totalMass;
        a.mesh.position.z -= (nz * overlap * b.mass) / totalMass;
        b.mesh.position.x += (nx * overlap * a.mass) / totalMass;
        b.mesh.position.z += (nz * overlap * a.mass) / totalMass;
        const rvx = b.vel.x - a.vel.x;
        const rvz = b.vel.z - a.vel.z;
        const relN = rvx * nx + rvz * nz;
        const invMassSum = 1 / a.mass + 1 / b.mass;
        let impulse = 0;
        if (relN < 0) {
          impulse = (-(1 + restitution) * relN) / invMassSum;
        } else if (overlap > 0.02) {
          impulse = (overlap * 8) / invMassSum;
        }
        if (impulse > 0.02) {
          a.vel.x -= (impulse * nx) / a.mass;
          a.vel.z -= (impulse * nz) / a.mass;
          b.vel.x += (impulse * nx) / b.mass;
          b.vel.z += (impulse * nz) / b.mass;
          onBump?.(a, b, impulse);
        }
      }
    }
  }

  function playgroundPhysicsTick(dt) {
    const mu = playgroundIce ? 0.035 : playgroundFriction;
    const steps = Math.min(4, Math.max(1, Math.ceil(dt * 50)));
    const subDt = dt / steps;
    const bumpNow = performance.now();

    for (let step = 0; step < steps; step++) {
      for (const b of playgroundBodies) {
        const m = b.mesh;
        m.position.x += b.vel.x * subDt;
        m.position.z += b.vel.z * subDt;
        const sp = Math.hypot(b.vel.x, b.vel.z);
        if (sp > 0.04) {
          const fMult = b.frictionMult ?? 1;
          b.vel.multiplyScalar(Math.max(0, 1 - (mu * fMult * 4.2 * subDt) / Math.sqrt(b.mass)));
        } else {
          b.vel.set(0, 0, 0);
        }
        clampPlaygroundBody(b);
        m.rotation.y += 0.15 * subDt * (sp > 0.1 ? 1 : 0.2);
      }
      for (let pass = 0; pass < 6; pass++) {
        resolvePlaygroundCollisions((a, b, impulse) => {
          if (bumpNow - lastPlaygroundBumpMsg < 900) return;
          lastPlaygroundBumpMsg = bumpNow;
          const labelA = a.kind || "toy";
          const labelB = b.kind || "toy";
          if (typeof window !== "undefined" && window.__pgBumpCoach) {
            window.__pgBumpCoach(
              `Bump! <strong>${labelA}</strong> and <strong>${labelB}</strong> push each other with the same strength (Newton's 3rd law) - equal force, opposite direction.`,
            );
          }
        });
        playgroundBodies.forEach(clampPlaygroundBody);
      }
    }
  }

  function enablePlaygroundOrbit() {
    if (!THREE.OrbitControls) return;
    if (!orbitControls) {
      orbitControls = new THREE.OrbitControls(camera, canvas);
      orbitControls.enableDamping = true;
      orbitControls.dampingFactor = 0.09;
      orbitControls.target.set(0, 0.45, 0);
      orbitControls.minDistance = 5;
      orbitControls.maxDistance = 24;
      orbitControls.maxPolarAngle = Math.PI / 2 - 0.06;
      orbitControls.screenSpacePanning = true;
    }
    orbitControls.enabled = false;
    orbitControls.update();
  }

  function disablePlaygroundOrbit() {
    if (orbitControls) orbitControls.enabled = false;
    setCameraArena();
  }

  /** Orbit only while Ctrl is held (see playground-ui pointer handlers). */
  function playgroundSetOrbitEnabled(on) {
    if (!playgroundActive || !orbitControls) return;
    orbitControls.enabled = !!on;
    if (orbitControls.enabled) orbitControls.update();
  }

  function enterPlayground() {
    playgroundActive = true;
    hideHero();
    clearExtras();
    clearPlaygroundBodies();
    extraTick = null;
    slideMode = false;
    rockVel.set(0, 0, 0);
    wallHitDone = false;
    setWall(false);
    enablePlaygroundOrbit();
    playgroundIce = true;
    playgroundFriction = 0.38;
    buildGlidePad();
    spawnPlaygroundBody("rocks", 0, 0);
    spawnPlaygroundBody("carRace", -4, -0.8);
    spawnPlaygroundBody("boxLarge", -4, 0.8);
    spawnPlaygroundBody("cone", 2, 1.2);
    spawnPlaygroundBody("cone", 2, -1.2);
    extraTick = playgroundPhysicsTick;
  }

  function exitPlayground() {
    playgroundActive = false;
    clearPlaygroundBodies();
    extraTick = null;
    hideHero();
    setBlueTrack(false);
    setWall(false);
    clearArrow();
    disablePlaygroundOrbit();
  }

  function playgroundSetIce(on) {
    playgroundIce = !!on;
    if (on) buildGlidePad();
    else setBlueTrack(false);
  }

  function playgroundSetWall(on) {
    setWall(!!on);
  }

  function playgroundRunPreset(name) {
    const preset = getPlaygroundPreset(name) || getPlaygroundPreset(name === "glide" ? "glideRock" : name);
    clearPlaygroundBodies();
    hideHero();
    setWall(false);
    setBlueTrack(false);
    playgroundIce = false;
    let lessonTick = null;

    if (!preset) {
      enterPlayground();
      return;
    }

    if (preset.ice) {
      playgroundIce = true;
      buildGlidePad();
    } else if (preset.ice === false) {
      playgroundIce = false;
    }

    if (preset.wall) playgroundSetWall(true);

    if (preset.lessonScene) {
      playExample(preset.lessonScene, preset.sceneArgs || {});
      lessonTick = extraTick;
    }

    const handler = preset.handler || preset.id;

    if (handler === "drift") {
      playgroundIce = true;
      buildGlidePad();
      const car = spawnPlaygroundBody("carRace", -7, 0);
      if (car) car.vel.set(2.2 / M, 0, 0);
    } else if (handler === "glide" || handler === "glideRock") {
      playgroundIce = true;
      buildGlidePad();
      const r = spawnPlaygroundBody("rocks", -7, 0);
      if (r) r.vel.set(1.9 / M, 0, 0);
    } else if (handler === "glideTire") {
      playgroundIce = true;
      buildGlidePad();
      const t = spawnPlaygroundBody("tire", -7, 0);
      if (t) t.vel.set(2.1 / M, 0, 0);
    } else if (handler === "glideCrate") {
      playgroundIce = true;
      buildGlidePad();
      const c = spawnPlaygroundBody("boxWide", -7, 0);
      if (c) c.vel.set(0.75 / M, 0, 0);
    } else if (handler === "puckDrift") {
      playgroundIce = true;
      buildGlidePad();
      const t = spawnPlaygroundBody("tire", -7, 0);
      if (t) t.vel.set(2.35 / M, 0, 0);
    } else if (handler === "shove") {
      playgroundIce = false;
      setBlueTrack(true);
      const c = spawnPlaygroundBody("carSports", -5, 0);
      if (c) c.vel.set(0.5 / M, 0, 0);
      const shoveCar = c;
      extraTick = (dt) => {
        if (lessonTick) lessonTick(dt);
        playgroundPhysicsTick(dt);
        if (shoveCar) shoveCar.vel.x += (1.4 / M) * dt;
      };
      return;
    } else if (handler === "wakeRock") {
      playgroundIce = false;
      const r = spawnPlaygroundBody("rocks", 0, 0);
      if (r) r.vel.set(0, 0, 0);
    } else if (handler === "kickedBall") {
      playgroundIce = false;
      playgroundFriction = 0.55;
      const ball = spawnPlaygroundBody("tire", -6, 0);
      if (ball) ball.vel.set(3.0 / M, 0, 0);
    } else if (handler === "race") {
      playgroundIce = true;
      buildGlidePad();
      const a = spawnPlaygroundBody("carRace", -6, -0.7);
      const b = spawnPlaygroundBody("truck", -6, 0.7);
      if (a) a.vel.set(3.5 / M, 0, 0);
      if (b) b.vel.set(0.55 / M, 0, 0);
    } else if (handler === "forceCompare") {
      playgroundIce = true;
      buildGlidePad();
      const a = spawnPlaygroundBody("boxWide", -5, -0.85);
      const b = spawnPlaygroundBody("boxWide", -5, 0.85);
      if (a) a.vel.set(0.7 / M, 0, 0);
      if (b) b.vel.set(1.75 / M, 0, 0);
    } else if (handler === "frictionCompare") {
      playgroundIce = false;
      buildGlidePad();
      const slick = spawnPlaygroundBody("boxLarge", -5, -0.85);
      const rough = spawnPlaygroundBody("boxLarge", -5, 0.85);
      if (slick) {
        slick.vel.set(3.2 / M, 0, 0);
        slick.frictionMult = 0.12;
      }
      if (rough) {
        rough.vel.set(3.2 / M, 0, 0);
        rough.frictionMult = 1.35;
      }
    } else if (handler === "recoil") {
      playgroundIce = false;
      const a = spawnPlaygroundBody("boxSmall", -0.5, 0);
      const b = spawnPlaygroundBody("boxSmall", 0.5, 0);
      if (a) a.vel.set(-1.2 / M, 0, 0);
      if (b) b.vel.set(1.2 / M, 0, 0);
    } else if (handler === "wall") {
      playgroundIce = false;
      playgroundSetWall(true);
      const r = spawnPlaygroundBody("rocks", -6, 0);
      if (r) r.vel.set(2.8 / M, 0, 0);
    } else if (handler === "tugWar") {
      spawnPlaygroundBody("boxSmall", -2.2, 0);
      spawnPlaygroundBody("boxSmall", 2.2, 0);
      spawnPlaygroundBody("cone", 0, 0);
    }

    (preset.spawns || []).forEach((def) => spawnPlaygroundFromDef(def));

    if (handler !== "shove") {
      extraTick = (dt) => {
        if (lessonTick) lessonTick(dt);
        playgroundPhysicsTick(dt);
      };
    }
  }

  function playgroundPick(ndcX, ndcY) {
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera);
    const targets = [];
    for (const b of playgroundBodies) {
      b.mesh.traverse((c) => {
        if (c.isMesh) targets.push(c);
      });
    }
    const hits = raycaster.intersectObjects(targets, false);
    if (!hits.length) return null;
    let obj = hits[0].object;
    while (obj.parent && obj.parent !== extrasRoot) obj = obj.parent;
    return playgroundBodies.find((b) => b.mesh === obj) || null;
  }

  function playgroundApplyImpulse(body, dirX, dirZ, strength) {
    if (!body) return;
    const len = Math.hypot(dirX, dirZ) || 1;
    body.vel.x += (dirX / len) * strength;
    body.vel.z += (dirZ / len) * strength;
  }

  /** Impulse on pointer-up only (aim-drag release). Sets velocity, does not add each frame. */
  function playgroundReleaseImpulse(body, dirX, dirZ, strength) {
    if (!body) return;
    const len = Math.hypot(dirX, dirZ) || 1;
    body.vel.x = (dirX / len) * strength;
    body.vel.z = (dirZ / len) * strength;
  }

  /** @deprecated Use playgroundReleaseImpulse after aim-drag; kept for compatibility. */
  function playgroundPush(body, dx, dz) {
    if (!body) return;
    const mag = Math.hypot(dx, dz);
    if (mag < 0.02) return;
    const strength = Math.min(2.2, mag * 6);
    playgroundReleaseImpulse(body, dx, dz, strength);
  }

  function playgroundCount() {
    return playgroundBodies.length;
  }

  function heroGroundY() {
    return useKenneyRock ? 0 : 0.55;
  }

  function clearHeroVisual() {
    while (rock.children.length) {
      const c = rock.children[0];
      rock.remove(c);
      disposeTree(c);
    }
    useKenneyRock = false;
  }

  function attachHeroRockVisual() {
    clearHeroVisual();
    const key = hasAsset("rocks") ? "rocks" : hasAsset("barrel") ? "barrel" : null;
    if (key) {
      const prop = cloneAsset(key);
      if (prop) {
        prop.position.set(0, 0, 0);
        rock.add(prop);
        useKenneyRock = key === "rocks";
        return;
      }
    }
    const fb = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.55, 1),
      mkStdMat(0x6f5f52, { roughness: 0.55, metalness: 0.08 }),
    );
    fb.position.y = 0.55;
    rock.add(fb);
    useKenneyRock = false;
  }

  function hideHero() {
    rock.visible = false;
    clearHeroVisual();
    slideMode = false;
    rockVel.set(0, 0, 0);
    wallHitDone = false;
  }

  function showHero() {
    attachHeroRockVisual();
    rock.visible = true;
  }

  /**
   * Reset canvas props before each lesson scene (prevents rock+car overlap).
   * @param {{ track?: boolean; wall?: boolean; hero?: boolean }} cfg
   */
  function beginScene(cfg = {}) {
    if (playgroundActive) {
      playgroundActive = false;
      clearPlaygroundBodies();
    }
    clearExtras();
    frictionPushState = null;
    tugWarState = null;
    equilibriumBoxState = null;
    extraTick = null;
    slideMode = false;
    rockVel.set(0, 0, 0);
    wallHitDone = false;
    setWall(!!cfg.wall);
    setCameraArena();
    if (cfg.track) buildGlidePad();
    else setBlueTrack(false);
    if (cfg.hero) showHero();
    else hideHero();
  }

  function resize() {
    const w = Math.max(2, canvas.clientWidth || canvas.parentElement?.clientWidth || 640);
    const h = Math.max(2, canvas.clientHeight || canvas.parentElement?.clientHeight || 360);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  function syncCanvasSize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (w > 0 && h > 0) {
      const pr = renderer.getPixelRatio();
      const tgtW = Math.round(w * pr);
      const tgtH = Math.round(h * pr);
      if (canvas.width !== tgtW || canvas.height !== tgtH) {
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }
    }
  }

  function setArrow(from, to) {
    if (arrowLine) {
      scene.remove(arrowLine);
      arrowLine.geometry.dispose();
    }
    const g = new THREE.BufferGeometry().setFromPoints([from.clone(), to.clone()]);
    arrowLine = new THREE.Line(g, arrowMat);
    scene.add(arrowLine);
  }

  function clearArrow() {
    if (arrowLine) {
      scene.remove(arrowLine);
      arrowLine.geometry.dispose();
      arrowLine = null;
    }
  }

  function resetRockAtOrigin() {
    rock.position.set(0, heroGroundY(), 0);
    rock.rotation.set(0, 0, 0);
    rockVel.set(0, 0, 0);
    slideMode = false;
    wallHitDone = false;
    clearArrow();
  }

  function setBlueTrack(visible) {
    blueTrack.visible = visible;
  }

  function setWall(visible) {
    wall.visible = visible;
  }

  function startFrictionlessSlide() {
    beginScene({ track: true, hero: true });
    resetRockAtOrigin();
    rock.position.set(-8, heroGroundY(), 0);
    rockVel.set(slideSpeed, 0, 0);
    slideMode = true;
  }

  function startWallDemo() {
    beginScene({ wall: true, hero: true });
    resetRockAtOrigin();
    rock.position.set(-5, heroGroundY(), 0);
    rockVel.set(2.5 / M, 0, 0);
    slideMode = true;
    wallHitDone = false;
  }

  function applyImpulseToRock(dirX, dirZ, strength) {
    const len = Math.hypot(dirX, dirZ) || 1;
    const nx = (dirX / len) * strength;
    const nz = (dirZ / len) * strength;
    rockVel.set(nx, 0, nz);
    slideMode = false;
  }

  function setCameraArena() {
    camera.position.set(0, 4.2, 9);
    camera.lookAt(0, 0.4, 0);
  }

  function setCameraTop() {
    camera.position.set(0, 14, 0.1);
    camera.lookAt(0, 0, 0);
  }

  let last = performance.now();
  function tick(now) {
    syncCanvasSize();
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    if (slideMode && rockVel.lengthSq() > 0.0001) {
      rock.position.x += rockVel.x * dt;
      rock.position.z += rockVel.z * dt;
      if (wall.visible && !wallHitDone && rock.position.x > wall.position.x - 0.9) {
        rock.position.x = wall.position.x - 0.9;
        rockVel.set(0, 0, 0);
        wallHitDone = true;
      }
    } else if (!slideMode && rockVel.lengthSq() > 0.0001) {
      rock.position.x += rockVel.x * dt;
      rock.position.z += rockVel.z * dt;
      rockVel.multiplyScalar(Math.pow(dampPerStep, dt / (1 / 60)));
      if (rockVel.length() < 0.05) rockVel.set(0, 0, 0);
    }

    if (extraTick) extraTick(dt);

    if (orbitControls && orbitControls.enabled) orbitControls.update();

    /* Idle “life” on the rock so the canvas never feels frozen between pushes */
    if (rock.visible && !slideMode && !rockAimDrag && rockVel.lengthSq() < 1e-8) {
      rock.rotation.y += 0.28 * dt;
      rock.position.y = heroGroundY() + Math.sin(now * 0.0016) * 0.045;
    } else if (rock.visible && (slideMode || rockAimDrag)) {
      rock.position.y = heroGroundY();
    }
    hemi.intensity = 0.78 + 0.12 * Math.sin(now * 0.0009);
    if (blueTrack.visible) {
      blueTrack.material.emissiveIntensity = 0.32 + 0.14 * Math.sin(now * 0.0011 + 0.7);
    }

    renderer.render(scene, camera);
  }

  function applyKenneyAssets() {
    if (hasAsset("wall")) {
      const w = cloneAsset("wall");
      if (w) {
        w.position.set(0, -1.05, 0);
        w.rotation.y = Math.PI / 2;
        wall.add(w);
        wall.material.transparent = true;
        wall.material.opacity = 0;
        wall.material.depthWrite = false;
      }
    }
  }

  resize();

  return {
    scene,
    camera,
    renderer,
    rock,
    wall,
    resize,
    tick,
    resetRockAtOrigin,
    setBlueTrack,
    setWall,
    startFrictionlessSlide,
    startWallDemo,
    applyKenneyAssets,
    applyImpulseToRock,
    setRockAimDrag(on) {
      rockAimDrag = !!on;
      if (rockAimDrag) {
        rock.position.y = heroGroundY();
        rock.rotation.y = 0;
      }
    },
    setArrow,
    clearArrow,
    setCameraArena,
    setCameraTop,
    get rockVel() {
      return rockVel.clone();
    },
    setSlideMode(v) {
      slideMode = v;
    },
    get wallHitDone() {
      return wallHitDone;
    },
    rockPosition() {
      return rock.position.clone();
    },
    setRockPosition(x, z) {
      rock.position.x = x;
      rock.position.z = z;
    },
    clearExtras,
    startFbdCrateScene,
    appendFbdArrow,
    setGlideFrictionMu,
    /**
     * Crate on a track: push with horizontal force. μ_s=0.5, μ_k=0.4, m=20 kg, N=200 N → F_stat max 100 N, F_k 80 N.
     */
    startFrictionPushLab() {
      beginScene({ track: true, hero: false });
      const crate = spawnCrate({ x: -3.5, y: 0, z: 0 }, 0xc4a574, "large");
      const m = 20;
      const N = 200;
      const muS = 0.5;
      const muK = 0.4;
      const FstaticMax = muS * N;
      const Fkinetic = muK * N;
      frictionPushState = {
        F: 0,
        sliding: false,
        v: 0,
        crate: crate || null,
        FstaticMax,
        Fkinetic,
        m,
        N,
        muS,
        muK,
      };
      if (!crate) return;
      extraTick = (dt) => {
        const st = frictionPushState;
        if (!st?.crate) return;
        if (!st.sliding) {
          if (st.F > st.FstaticMax) {
            st.sliding = true;
            st.v = 0.15;
          }
        } else {
          const Fnet = st.F - st.Fkinetic;
          const a = ((Fnet / st.m) * 1.1) / M;
          st.v += a * dt;
          if (st.v < 0) st.v = 0;
          st.crate.position.x += st.v * dt;
          if (st.crate.position.x > 5) {
            st.crate.position.x = -3.5;
            st.sliding = false;
            st.v = 0;
          }
        }
      };
    },
    setFrictionPushForce(f) {
      if (!frictionPushState) return;
      frictionPushState.F = Math.max(0, Math.min(150, +f || 0));
    },
    adjustFrictionPushForce(delta) {
      if (!frictionPushState) return;
      setFrictionPushForce(frictionPushState.F + delta);
    },
    getFrictionPushState() {
      if (!frictionPushState) return null;
      const st = frictionPushState;
      return {
        F: st.F,
        sliding: st.sliding,
        v: st.v,
        FstaticMax: st.FstaticMax,
        Fkinetic: st.Fkinetic,
        m: st.m,
        N: st.N,
      };
    },
    resetFrictionPushLab() {
      if (!frictionPushState?.crate) return;
      frictionPushState.F = 0;
      frictionPushState.sliding = false;
      frictionPushState.v = 0;
      frictionPushState.crate.position.x = -3.5;
    },
    /** Horizontal pulls on a crate: net = fR − fL (newtons, toy masses). */
    startEquilibriumBoxLab() {
      beginScene({ track: true, hero: false });
      const crate = spawnCrate({ x: 0, y: 0, z: 0 }, 0x5b8cff, "wide");
      if (!crate) return;
      equilibriumBoxState = { fL: 0, fR: 0, v: 0, crate };
      extraTick = (dt) => {
        const st = equilibriumBoxState;
        if (!st?.crate) return;
        const net = st.fR - st.fL;
        if (Math.abs(net) < 5) {
          st.v *= Math.pow(0.86, dt * 50);
          if (Math.abs(st.v) < 0.02) st.v = 0;
        } else {
          st.v += (net / 140) * dt;
        }
        st.crate.position.x += st.v * dt;
        st.crate.position.x = Math.max(-3.5, Math.min(3.5, st.crate.position.x));
      };
    },
    setEquilibriumForces(fLeft, fRight) {
      if (!equilibriumBoxState) return;
      equilibriumBoxState.fL = Math.max(0, +fLeft || 0);
      equilibriumBoxState.fR = Math.max(0, +fRight || 0);
    },
    /** Rope knot shifts with left vs right pull; right default 300 N. */
    startTugOfWarInteractive({ rightN = 300 } = {}) {
      beginScene({ hero: false });
      const knot =
        spawn("cone", {
          position: { x: 0, y: 0.55, z: 0 },
          color: 0xfbbf24,
          scaleMult: 0.5,
          fallback: () => mkSphere(0.18, 0xfbbf24),
        }) || mkSphere(0.18, 0xfbbf24);
      knot.position.set(0, 0.55, 0);
      extrasRoot.add(knot);
      tugWarState = { leftN: 150, rightN, knot };
      extraTick = (dt) => {
        const st = tugWarState;
        if (!st?.knot) return;
        const net = st.leftN - st.rightN;
        const target = Math.max(-1.15, Math.min(1.15, net * 0.004));
        st.knot.position.x += (target - st.knot.position.x) * Math.min(1, 12 * dt);
      };
    },
    setTugLeftForce(n) {
      if (tugWarState) tugWarState.leftN = Math.max(0, Math.min(500, +n || 0));
    },
    /** @param {((dt: number) => void) | null} fn */
    setExtraTick(fn) {
      extraTick = fn;
    },
    get extrasRoot() {
      return extrasRoot;
    },
    /**
     * Light car vs heavy tank: same “thrust”, different acceleration along +X.
     * @param {{ onFinish: (winner: 'car'|'tank') => void }} opts
     */
    startRaceDemo({ onFinish }) {
      beginScene({ track: true, hero: false });
      const car = spawnCar({ x: -6, y: 0, z: -0.75 }, "sports");
      const tank = spawnCar({ x: -6, y: 0, z: 0.75 }, "truck");
      if (!car || !tank) {
        onFinish("car");
        return;
      }
      const vCar = 4.8 / M;
      const vTank = 0.65 / M;
      let done = false;
      extraTick = (dt) => {
        if (done) return;
        car.position.x += vCar * dt;
        tank.position.x += vTank * dt;
        if (car.position.x >= 5.5) {
          done = true;
          extraTick = null;
          onFinish("car");
        }
      };
    },
    /** Two blocks push apart (Newton 3, enactive). */
    startRecoilDemo({ onFinish, strength = 1 }) {
      beginScene({ hero: false });
      const a = spawnCrate({ x: -0.35, y: 0.4, z: 0 }, 0x5b8cff, "small");
      const b = spawnCrate({ x: 0.35, y: 0.4, z: 0 }, 0xff8c42, "small");
      let t = 0;
      const dur = 1.6 * strength * M;
      const recoilSpd = (2.2 * strength) / M;
      extraTick = (dt) => {
        t += dt;
        a.position.x -= recoilSpd * dt;
        b.position.x += recoilSpd * dt;
        if (t >= dur) {
          extraTick = null;
          onFinish();
        }
      };
    },
    /**
     * Two crates same initial speed, different friction decay along X.
     */
    startFrictionCompare({ muLeft, muRight, onFinish, onProgress }) {
      beginScene({ track: true, hero: false });
      const left = spawnCrate({ x: -5, y: 0, z: -0.9 }, 0xc4a574, "large");
      const right = spawnCrate({ x: -5, y: 0, z: 0.9 }, 0x9ca3af, "large");
      let vL = 3.2;
      let vR = 3.2;
      let t = 0;
      let finished = false;
      extraTick = (dt) => {
        if (finished) return;
        t += dt;
        left.position.x += vL * dt;
        right.position.x += vR * dt;
        vL = Math.max(0, vL - ((muLeft * 4) / M) * dt);
        vR = Math.max(0, vR - ((muRight * 4) / M) * dt);
        if (typeof onProgress === "function") {
          try {
            onProgress({
              xL: left.position.x,
              xR: right.position.x,
              vL,
              vR,
              muLeft,
              muRight,
              t,
            });
          } catch (_) {
            /* ignore HUD callback errors */
          }
        }
        if (t > 5 * M || (vL < 0.05 && vR < 0.05)) {
          finished = true;
          extraTick = null;
          onFinish();
        }
      };
    },
    /** Simple ramp + block (visual); angle in degrees */
    setRampVisual(angleDeg) {
      beginScene({ hero: false });
      const rad = (angleDeg * Math.PI) / 180;
      const ramp =
        spawn("rampPlank", {
          position: { x: 0, y: 0.35 + Math.sin(rad) * 1.1, z: 0 },
          rotationZ: -rad,
          color: 0x3d4f6f,
          fallback: () => {
            const m = mkBox(6, 0.12, 2.2, 0x3d4f6f, { roughness: 0.75 });
            m.rotation.z = -rad;
            m.position.set(0, 0.35 + Math.sin(rad) * 1.1, 0);
            return m;
          },
        }) || mkBox(6, 0.12, 2.2, 0x3d4f6f);
      const block = spawnCrate(
        { x: 0, y: 0, z: 0 },
        0xb8a068,
        "small"
      );
      if (block && ramp) block.position.copy(ramp.position).add(new THREE.Vector3(-0.8, 0.35, 0));
    },

    replayExample() {
      playExample(lastExample.kind, lastExample.opts);
    },

    /* ============== Example scene presets (used by mountDemoWithDwell `scene` opt) ============== */
    playExample(kind, opts = {}) {
      lastExample = { kind: kind || "idle", opts: opts || {} };
      switch (kind) {
        case "idle":
        case null:
        case undefined:
          return playIdle();
        case "drift": return playDrift(opts);
        case "glide": return playGlide(opts);
        case "rock": return playRock(opts);
        case "rest": return playRest(opts);
        case "shove": return playShove(opts);
        case "massCompare": return playMassCompare(opts);
        case "forceCompare": return playForceCompare(opts);
        case "frictionLoop": return playFrictionLoop(opts);
        case "recoil": return playRecoilLoop(opts);
        case "wall": return playWallLoop(opts);
        case "vector": return playVector(opts);
        case "elevator": return playElevator(opts);
        case "pulley": return playPulley(opts);
        case "rope": return playRope(opts);
        case "orbit": return playOrbit(opts);
        case "ramp": return playRamp(opts);
        case "kickedBall": return playKickedBall(opts);
        case "parachute": return playParachute(opts);
        case "tugOfWar": return playTugOfWar(opts);
        case "magnet": return playMagnet(opts);
        default: return playIdle();
      }
    },
    setRockVisible(v) { rock.visible = v; },
    get isPlayground() {
      return playgroundActive;
    },
    enterPlayground,
    exitPlayground,
    playgroundSpawn: spawnPlaygroundBody,
    playgroundClear: clearPlaygroundBodies,
    playgroundSetIce,
    playgroundSetWall,
    playgroundSetFriction: (v) => {
      playgroundFriction = v;
    },
    playgroundRunPreset,
    playgroundPick,
    playgroundApplyImpulse,
    playgroundReleaseImpulse,
    playgroundPush,
    playgroundSetOrbitEnabled,
    playgroundCount,
    playgroundBodyCount: playgroundCount,
  };

  function playIdle() {
    beginScene({ track: false, hero: true });
    resetRockAtOrigin();
  }

  /** Blue frictionless lane (flat strip only - no factory conveyor block). */
  function buildGlidePad() {
    setBlueTrack(true);
    [-1.15, 1.15].forEach((z) => {
      spawn("cone", { position: { x: -8.5, y: 0, z }, color: 0xf97316, scaleMult: 0.85 });
      spawn("cone", { position: { x: 8.5, y: 0, z }, color: 0xf97316, scaleMult: 0.85 });
    });
  }

  /** Rock at center for wake / push labs - no car. */
  function playRock({ withTrack = false } = {}) {
    beginScene({ track: !!withTrack, hero: true });
    resetRockAtOrigin();
  }

  function addGlideVelocityArrow(target, y = 0.55) {
    const velArrow = mkArrow(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, y, 0), 1.2, 0x22c55e);
    target.add(velArrow);
    return velArrow;
  }

  /** Glide a prop along the blue lane (rock uses hero; crate/tire are separate meshes). */
  function playGlidePropSlide({ speed = 1.8, frictionMu = 0, prop = "rock" } = {}) {
    if (prop === "rock") {
      playGlideRock({ speed, frictionMu });
      return;
    }
    beginScene({ track: true, hero: false });
    const baseV = (speed / M) * 1.15;
    glideFrictionMu = Math.max(0, Math.min(2.5, frictionMu));
    let pod = null;
    let groundY = 0.35;
    if (prop === "crate") {
      pod = spawnCrate({ x: -7, y: 0.35, z: 0 }, 0x8b6914, "wide");
      groundY = 0.45;
    } else if (prop === "tire") {
      pod = spawn("tire", {
        position: { x: -7, y: 0.35, z: 0 },
        color: 0xf97316,
        fallback: () => {
          const s = mkSphere(0.42, 0x1e293b, { roughness: 0.7 });
          s.position.set(-7, 0.35, 0);
          return s;
        },
      });
      groundY = 0.4;
    } else if (prop === "barrel") {
      pod = spawn("barrel", {
        position: { x: -7, y: 0.35, z: 0 },
        fallback: () => {
          const s = mkSphere(0.5, 0x6f5f52);
          s.position.set(-7, 0.35, 0);
          return s;
        },
      });
      groundY = 0.42;
    }
    if (!pod) return;
    pod.position.set(-7, groundY, 0);
    addGlideVelocityArrow(pod, 0.15);
    let vx = baseV;
    let restAcc = 0;
    extraTick = (dt) => {
      const mu = glideFrictionMu;
      pod.position.x += vx * dt;
      pod.rotation.y += 0.35 * dt;
      if (mu > 0.02) {
        const decel = (mu * 10 * 0.55) / M;
        const sp = Math.abs(vx);
        if (sp > 0.02) {
          vx = Math.max(0, sp - decel * dt) * (Math.sign(vx) || 1);
          restAcc = 0;
        } else {
          vx = 0;
          restAcc += dt;
          if (restAcc > 0.9) {
            restAcc = 0;
            pod.position.set(-7, groundY, 0);
            vx = baseV;
          }
        }
      } else {
        restAcc = 0;
        if (pod.position.x > 6.5) {
          pod.position.set(-7, groundY, 0);
          vx = baseV;
        }
      }
    };
  }

  /** Rock gliding on the low-friction pad - no car. Optional μ adds longitudinal deceleration (toy model). */
  function playGlideRock({ speed = 1.8, frictionMu = 0 } = {}) {
    beginScene({ track: true, hero: true });
    const y = heroGroundY();
    const baseV = (speed / M) * 1.15;
    glideFrictionMu = Math.max(0, Math.min(2.5, frictionMu));
    rock.position.set(-7, y, 0);
    rockVel.set(baseV, 0, 0);
    slideMode = true;
    wallHitDone = false;
    extrasRoot.add(
      mkArrow(new THREE.Vector3(1, 0, 0), new THREE.Vector3(-1.2, y + 0.55, 0), 1.35, 0x22c55e),
    );
    let restAcc = 0;
    extraTick = (dt) => {
      const mu = glideFrictionMu;
      if (mu > 0.02) {
        const decel = (mu * 10 * 0.55) / M;
        const sp = Math.abs(rockVel.x);
        if (sp > 0.02) {
          const nv = Math.max(0, sp - decel * dt);
          rockVel.x = nv * (Math.sign(rockVel.x) || 1);
          restAcc = 0;
        } else {
          rockVel.x = 0;
          restAcc += dt;
          if (restAcc > 0.9) {
            restAcc = 0;
            rock.position.set(-7, y, 0);
            rockVel.set(baseV, 0, 0);
          }
        }
      } else {
        restAcc = 0;
        if (rock.position.x > 6.5) {
          rock.position.set(-7, y, 0);
          rockVel.set(baseV, 0, 0);
          slideMode = true;
        }
      }
    };
  }

  function playGlide(opts = {}) {
    const prop = opts.prop || "rock";
    playGlidePropSlide({ ...opts, prop });
  }

  /** Vehicle or puck drifts on glide lane - no hero rock. */
  function playDrift({ color = 0x3dd6c7, speed = 1.4, withTrack = true, vehicle = "race" } = {}) {
    beginScene({ track: !!withTrack, hero: false });

    let pod = null;
    if (vehicle === "tire") {
      pod = spawn("tire", {
        position: { x: -7, y: 0.35, z: 0 },
        color: 0xf97316,
        fallback: () => {
          const m = mkSphere(0.42, 0x1e293b, { roughness: 0.65 });
          m.position.set(-7, 0.35, 0);
          return m;
        },
      });
    } else {
      const variant =
        vehicle === "sports"
          ? "sports"
          : vehicle === "sedan"
            ? "sedan"
            : vehicle === "kart"
              ? "kart"
              : vehicle === "truck"
                ? "truck"
                : vehicle === "delivery"
                  ? "delivery"
                  : vehicle === "van"
                    ? "van"
                    : "race";
      const carColor = vehicle === "truck" ? 0x4a5568 : color;
      pod = spawnCar({ x: -7, y: 0, z: 0 }, variant, carColor);
    }
    if (!pod) {
      pod = mkBox(1.35, 0.5, 0.75, color, { roughness: 0.35, metalness: 0.4 });
      pod.position.set(-7, 0.35, 0);
      pod.rotation.y = CAR_TRAVEL_Y;
      extrasRoot.add(pod);
    }
    const arrowY = vehicle === "tire" ? 0.12 : 0.35;
    addGlideVelocityArrow(pod, arrowY);
    if (speed <= 0.0001) {
      extraTick = null;
      return;
    }
    const driftSpin = vehicle === "tire" ? 0.9 : 0.15;
    extraTick = (dt) => {
      pod.position.x += (speed / M) * dt;
      pod.rotation.y += driftSpin * dt;
      if (pod.position.x > 7) pod.position.set(-7, pod.position.y, 0);
    };
  }

  function playRest({ shape = "ball", color = 0xd92d20, arrows = true, wobble = true } = {}) {
    beginScene({ hero: false });
    const y0 = shape === "ball" ? 0.5 : 0.35;
    const obj =
      shape === "ball"
        ? spawn("tire", {
            position: { x: 0, y: y0, z: 0 },
            color,
            fallback: () => {
              const s = mkSphere(0.5, color, { roughness: 0.55 });
              s.position.set(0, y0, 0);
              return s;
            },
          })
        : spawnCrate({ x: 0, y: y0, z: 0 }, color, "wide");
    if (!obj) return;
    if (arrows) {
      const up = mkArrow(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, y0 + 0.05, 0), 1.7, 0x22c55e);
      const down = mkArrow(new THREE.Vector3(0, -1, 0), new THREE.Vector3(0, y0 + 2.05, 0), 1.5, 0xff7a33);
      extrasRoot.add(up, down);
    }
    if (!wobble) return;
    let t = 0;
    extraTick = (dt) => {
      t += dt;
      obj.rotation.y += 0.4 * dt;
      obj.position.y = y0 + Math.sin(t * 1.4) * 0.022;
    };
  }

  /** Centered crate for FBD labs; call `appendFbdArrow` to draw learner forces. */
  function startFbdCrateScene() {
    beginScene({ hero: false });
    spawnCrate({ x: 0, y: 0.35, z: 0 }, 0xc4a574, "wide");
    let t = 0;
    extraTick = (dt) => {
      t += dt;
    };
  }

  /** One-shot segment arrow in scene units from crate center (y≈0.55). */
  function appendFbdArrow(ux, uy, uz, length = 1.1, color = 0xff7a33) {
    const o = new THREE.Vector3(0, 0.55, 0);
    const d = new THREE.Vector3(ux, uy, uz);
    if (d.lengthSq() < 1e-6) return;
    d.normalize();
    const mat = new THREE.LineBasicMaterial({ color });
    const end = o.clone().addScaledVector(d, length);
    const g = new THREE.BufferGeometry().setFromPoints([o, end]);
    extrasRoot.add(new THREE.Line(g, mat));
  }

  function playShove({ color = 0xc4a574, accel = 1.6, phase = "accel", vehicle = "delivery" } = {}) {
    beginScene({ track: true, hero: false });
    const variant =
      vehicle === "sports" ? "sports" : vehicle === "kart" ? "kart" : vehicle === "race" ? "race" : "delivery";
    let car = spawnCar({ x: -5, y: 0, z: 0 }, variant, color);
    if (!car) {
      car = mkBox(0.85, 0.38, 0.55, color, { roughness: 0.5, metalness: 0.2 });
      car.position.set(-5, 0.35, 0);
      car.rotation.y = CAR_TRAVEL_Y;
      extrasRoot.add(car);
    }
    const pushLen = phase === "contact" ? 0.55 : phase === "coast" ? 0.35 : 1.05;
    const arrow = mkArrow(new THREE.Vector3(1, 0, 0), new THREE.Vector3(-0.65, 0, 0), pushLen, 0xff7a33);
    car.add(arrow);
    let v = phase === "coast" ? 1.1 / M : 0;
    const useAccel = phase === "contact" ? 0.35 : phase === "coast" ? 0 : accel;
    extraTick = (dt) => {
      if (useAccel > 0) v += (useAccel / M) * dt;
      car.position.x += v * dt;
      if (car.position.x > 5) {
        car.position.x = -5;
        v = phase === "coast" ? 1.1 / M : 0;
      }
    };
  }

  function playRamp({ angleDeg = 30, frictionMu = null, massKg = 5 } = {}) {
    beginScene({ hero: false });
    const g = 10;
    const rad = (angleDeg * Math.PI) / 180;
    const ramp =
      spawn("rampPlank", {
        position: { x: 0, y: 0.1 + 2 * Math.sin(rad), z: 0 },
        rotationZ: -rad,
        color: 0x4a4f58,
        fallback: () => {
          const m = mkBox(4, 0.2, 2, 0x4a4f58, { roughness: 0.75 });
          m.rotation.z = -rad;
          m.position.set(0, 0.1 + 2 * Math.sin(rad), 0);
          return m;
        },
      }) || mkBox(4, 0.2, 2, 0x4a4f58);
    const block = spawnCrate({ x: 0, y: 0, z: 0 }, 0xff8c42, "small");
    if (!block || !ramp) return;
    let along = -1.55;
    let hold = 0;
    const slideSpeed = 1.35 / M;
    const endAlong = 1.55;
    const m = Math.max(0.5, massKg);
    const parallelDown = () => m * g * Math.sin(rad);
    const normalMag = () => m * g * Math.cos(rad);

    extraTick = (dt) => {
      if (hold > 0) {
        hold -= dt;
        return;
      }
      const p = parallelDown();
      const n = normalMag();
      const fLim = frictionMu != null && frictionMu > 0 ? frictionMu * n : 0;
      const stuck = frictionMu != null && frictionMu > 0 && p <= fLim + 0.85;
      if (stuck) {
        along = -1.55;
        block.position.set(
          along * Math.cos(rad),
          ramp.position.y + 0.28 + along * Math.sin(rad),
          0,
        );
        return;
      }
      along += slideSpeed * dt;
      block.position.set(
        along * Math.cos(rad),
        ramp.position.y + 0.28 + along * Math.sin(rad),
        0,
      );
      if (along >= endAlong) {
        along = -1.55;
        hold = 0.65;
      }
    };
    block.position.set(
      along * Math.cos(rad),
      ramp.position.y + 0.28 + along * Math.sin(rad),
      0,
    );
  }

  function playMassCompare() {
    beginScene({ track: true, hero: false });
    const light = spawnCar({ x: -5, y: 0, z: -0.95 }, "sports");
    const heavy = spawnCar({ x: -5, y: 0, z: 0.95 }, "truck");
    if (light) light.add(mkArrow(new THREE.Vector3(1, 0, 0), new THREE.Vector3(-0.45, 0, 0), 0.8, 0xff7a33));
    if (heavy) heavy.add(mkArrow(new THREE.Vector3(1, 0, 0), new THREE.Vector3(-0.8, 0, 0), 0.8, 0xff7a33));
    if (!light || !heavy) return;
    let vL = 0, vH = 0;
    extraTick = (dt) => {
      vL += (1.8 / M) * dt;
      vH += (0.45 / M) * dt;
      light.position.x += vL * dt;
      heavy.position.x += vH * dt;
      if (light.position.x > 6) { light.position.x = -5; vL = 0; }
      if (heavy.position.x > 6) { heavy.position.x = -5; vH = 0; }
    };
  }

  function playForceCompare() {
    beginScene({ track: true, hero: false });
    const a = spawnCrate({ x: -5, y: 0, z: -0.95 }, 0x5b8cff, "wide");
    const b = spawnCrate({ x: -5, y: 0, z: 0.95 }, 0xff8c42, "wide");
    if (a) a.add(mkArrow(new THREE.Vector3(1, 0, 0), new THREE.Vector3(-0.55, 0, 0), 0.55, 0xff7a33));
    if (b) b.add(mkArrow(new THREE.Vector3(1, 0, 0), new THREE.Vector3(-0.55, 0, 0), 1.15, 0xff7a33));
    if (!a || !b) return;
    let va = 0, vb = 0;
    extraTick = (dt) => {
      va += (0.7 / M) * dt;
      vb += (1.7 / M) * dt;
      a.position.x += va * dt;
      b.position.x += vb * dt;
      if (a.position.x > 6) { a.position.x = -5; va = 0; }
      if (b.position.x > 6) { b.position.x = -5; vb = 0; }
    };
  }

  function playFrictionLoop() {
    beginScene({ track: true, hero: false });
    const left = spawnCrate({ x: -5, y: 0, z: -0.95 }, 0xc4a574, "large");
    const right = spawnCrate({ x: -5, y: 0, z: 0.95 }, 0x9ca3af, "large");
    let vL = 3.2 / M, vR = 3.2 / M;
    let t = 0;
    extraTick = (dt) => {
      t += dt;
      left.position.x += vL * dt;
      right.position.x += vR * dt;
      vL = Math.max(0, vL - 0.12 * dt);
      vR = Math.max(0, vR - 1.2 * dt);
      if (t > 6 || (vL < 0.01 && vR < 0.01)) {
        left.position.x = -5; right.position.x = -5;
        vL = 3.2 / M; vR = 3.2 / M; t = 0;
      }
    };
  }

  function playRecoilLoop({ variant = "pair" } = {}) {
    beginScene({ hero: false });
    if (variant === "exhaust") {
      const rocket =
        spawn("structure", {
          position: { x: 0, y: 0.35, z: 0 },
          color: 0x64748b,
          scaleMult: 0.75,
          fallback: () => mkBox(0.7, 1.2, 0.6, 0x64748b),
        }) || mkBox(0.7, 1.2, 0.6, 0x64748b);
      extrasRoot.add(
        mkArrow(new THREE.Vector3(0, -1, 0), new THREE.Vector3(0, 0.9, 0), 1.2, 0xff7a33),
      );
      let t = 0;
      extraTick = (dt) => {
        t += dt;
        rocket.position.y = 0.35 + Math.sin(t * 2.2) * 0.02;
      };
      return;
    }
    if (variant === "thrust") {
      const rocket =
        spawn("structure", {
          position: { x: 0, y: 0.35, z: 0 },
          color: 0x64748b,
          scaleMult: 0.75,
          fallback: () => mkBox(0.7, 1.2, 0.6, 0x64748b),
        }) || mkBox(0.7, 1.2, 0.6, 0x64748b);
      extrasRoot.add(
        mkArrow(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0.5, 0), 1.35, 0x22c55e),
      );
      let t = 0;
      extraTick = (dt) => {
        t += dt;
        rocket.position.y = 0.35 + Math.min(0.55, t * 0.22);
      };
      return;
    }
    const a = spawnCrate({ x: -0.35, y: 0, z: 0 }, 0x5b8cff, "small");
    const b = spawnCrate({ x: 0.35, y: 0, z: 0 }, 0xff8c42, "small");
    if (a) extrasRoot.add(mkArrow(new THREE.Vector3(-1, 0, 0), new THREE.Vector3(0.1, 0.35, 0), 0.75, 0x5b8cff));
    if (b) extrasRoot.add(mkArrow(new THREE.Vector3(1, 0, 0), new THREE.Vector3(-0.1, 0.35, 0), 0.75, 0xff8c42));
    let t = 0;
    extraTick = (dt) => {
      t += dt;
      if (t < 1.7) {
        a.position.x = -0.35 - t * 0.85;
        b.position.x = 0.35 + t * 0.85;
      } else if (t < 2.4) {
        /* hold */
      } else {
        a.position.set(-0.35, 0, 0);
        b.position.set(0.35, 0, 0);
        t = 0;
      }
    };
  }

  function playWallLoop({ autoRepeat = true, phase = "loop", speed = 2.5 } = {}) {
    beginScene({ wall: true, hero: true });
    const ry = heroGroundY();
    const wallX = wall.position.x - 0.95;
    if (phase === "impact") {
      rock.position.set(wallX, ry, 0);
      rockVel.set(0, 0, 0);
      slideMode = false;
      wallHitDone = true;
      extrasRoot.add(
        mkArrow(new THREE.Vector3(-1, 0, 0), new THREE.Vector3(wallX - 0.2, ry + 0.55, 0), 1.1, 0xef4444),
      );
      extrasRoot.add(
        mkArrow(new THREE.Vector3(1, 0, 0), new THREE.Vector3(wall.position.x - 0.35, ry + 0.55, 0), 0.85, 0xfbbf24),
      );
      return;
    }
    if (phase === "stop") {
      rock.position.set(wallX, ry, 0);
      rockVel.set(0, 0, 0);
      slideMode = false;
      wallHitDone = true;
      return;
    }
    rock.position.set(-5, ry, 0);
    rockVel.set(speed / M, 0, 0);
    slideMode = true;
    wallHitDone = false;
    if (phase === "approach") {
      extrasRoot.add(
        mkArrow(new THREE.Vector3(1, 0, 0), new THREE.Vector3(-1.2, ry + 0.55, 0), 1.2, 0x22c55e),
      );
      return;
    }
    let restartT = 0;
    extraTick = (dt) => {
      if (!autoRepeat) return;
      if (wallHitDone) {
        restartT += dt;
        if (restartT > 1.5) {
          rock.position.set(-5, ry, 0);
          rockVel.set(speed / M, 0, 0);
          wallHitDone = false;
          slideMode = true;
          restartT = 0;
        }
      }
    };
  }

  function playVector({ fx = 1.2, fy = 0.9 } = {}) {
    beginScene({ hero: true });
    const ry = heroGroundY();
    rock.position.set(0, ry, 0);
    rockVel.set(0, 0, 0);
    const origin = new THREE.Vector3(0, ry, 0);
    extrasRoot.add(mkArrow(new THREE.Vector3(1, 0, 0), origin, Math.abs(fx) * 1.4, 0x5b8cff));
    extrasRoot.add(mkArrow(new THREE.Vector3(0, 0, fy >= 0 ? 1 : -1), origin, Math.abs(fy) * 1.4, 0xff8c42));
    const resDir = new THREE.Vector3(fx, 0, fy).normalize();
    const resMag = Math.hypot(fx, fy) * 1.4;
    extrasRoot.add(mkArrow(resDir, origin, resMag, 0x22c55e));
  }

  function playElevator() {
    beginScene({ hero: false });
    const car = new THREE.Group();
    car.position.set(0, 1.2, 0);
    const cab = spawn("structure", {
      parent: car,
      position: { x: 0, y: 0, z: 0 },
      color: 0x4a4f58,
      scaleMult: 0.9,
      fallback: () => mkBox(1.6, 1.4, 1.2, 0x4a4f58, { roughness: 0.55, metalness: 0.3 }),
    });
    const rider = spawn("kart", {
      parent: car,
      position: { x: 0, y: 0.2, z: 0.6 },
      color: 0x60a5fa,
      scaleMult: 0.7,
    });
    void cab;
    void rider;
    const arrow = mkArrow(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0.9, 0), 0.9, 0xfbbf24);
    car.add(arrow);
    extrasRoot.add(car);
    let t = 0;
    extraTick = (dt) => {
      t += dt;
      car.position.y = 1.2 + Math.sin(t * 1.1) * 0.8;
    };
  }

  function playPulley({ mLeft = 5, mRight = 8 } = {}) {
    beginScene({ hero: false });
    spawn("crane", { position: { x: 0, y: 2.8, z: 0 }, scaleMult: 0.85 });
    const pulley = spawn("robotArm", {
      position: { x: 0, y: 3.6, z: 0 },
      color: 0xfbbf24,
      fallback: () => {
        const p = mkSphere(0.22, 0xfbbf24, { metalness: 0.6, roughness: 0.4 });
        p.position.set(0, 3.6, 0);
        return p;
      },
    });
    void pulley;
    const wA = spawnCrate({ x: -1.2, y: 1.5, z: 0 }, 0x5b8cff, "small");
    const wB = spawnCrate({ x: 1.2, y: 1.2, z: 0 }, 0xff8c42, "small");
    extrasRoot.add(mkLine(new THREE.Vector3(-1.2, 3.5, 0), new THREE.Vector3(-1.2, 1.8, 0), 0xfbbf24));
    extrasRoot.add(mkLine(new THREE.Vector3(1.2, 3.5, 0), new THREE.Vector3(1.2, 1.5, 0), 0xfbbf24));
    let t = 0;
    const mL = Math.max(0.5, +mLeft || 5);
    const mR = Math.max(0.5, +mRight || 8);
    const diff = Math.abs(mR - mL);
    const sum = mL + mR;
    const norm = sum > 1e-6 ? diff / sum : 0;
    const amp = Math.min(0.52, 0.1 + norm * 0.62);
    const spd = 0.65 + norm * 1.35;
    const sign = mR >= mL ? 1 : -1;
    const startOffset = sign * amp * 0.92;
    wA.position.y = 1.5 - startOffset;
    wB.position.y = 1.2 + startOffset;
    extraTick = (dt) => {
      t += dt;
      const a = Math.sin(t * spd) * amp;
      wA.position.y = 1.5 - sign * a;
      wB.position.y = 1.2 + sign * a;
    };
  }

  function playRope() {
    beginScene({ hero: false });
    spawn("crane", { position: { x: 0, y: 2.5, z: 0 }, scaleMult: 0.75 });
    const w = spawnCrate({ x: 0, y: 1.4, z: 0 }, 0x2d6a4f, "large");
    extrasRoot.add(mkLine(new THREE.Vector3(0, 3.7, 0), new THREE.Vector3(0, 1.85, 0), 0xfbbf24));
    extrasRoot.add(mkArrow(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 1.8, 0), 1.0, 0x22c55e));
    extrasRoot.add(mkArrow(new THREE.Vector3(0, -1, 0), new THREE.Vector3(0, 1.4, 0), 1.0, 0xff7a33));
    let t = 0;
    extraTick = (dt) => {
      t += dt;
      w.rotation.y += 0.5 * dt;
      w.position.y = 1.4 + Math.sin(t * 1.1) * 0.025;
    };
  }

  function playOrbit({ radius = 2.5, speed = 0.7, showGravity = false } = {}) {
    beginScene({ hero: false });
    setCameraTop();
    const earth =
      spawn("building", {
        position: { x: 0, y: 0.7, z: 0 },
        color: 0x1a56db,
        scaleMult: 1.1,
        fallback: () => {
          const s = mkSphere(0.85, 0x1a56db, { emissive: 0x0a2a6a, emissiveIntensity: 0.3 });
          s.position.set(0, 0.7, 0);
          return s;
        },
      }) || mkSphere(0.85, 0x1a56db);
    const sat =
      spawn("carSedan", {
        position: { x: 2.5, y: 0, z: 0 },
        color: 0xc4a574,
        fallback: () => {
          const b = mkBox(0.5, 0.18, 0.2, 0xc4a574);
          b.position.set(2.5, 0.7, 0);
          return b;
        },
      }) || mkBox(0.5, 0.18, 0.2, 0xc4a574);
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(radius - 0.1, radius, 64),
      new THREE.MeshBasicMaterial({ color: 0x3dd6c7, transparent: true, opacity: 0.35, side: THREE.DoubleSide }),
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.05;
    extrasRoot.add(ring);
    if (showGravity && sat) {
      extrasRoot.add(
        mkArrow(
          new THREE.Vector3(-1, 0, 0),
          new THREE.Vector3(sat.position.x, sat.position.y + 0.4, sat.position.z),
          0.9,
          0xff7a33,
        ),
      );
    }
    if (!sat) return;
    let t = 0;
    extraTick = (dt) => {
      t += dt;
      sat.position.x = Math.cos(t * speed) * radius;
      sat.position.z = Math.sin(t * speed) * radius;
      sat.rotation.y = t * speed + Math.PI / 2;
    };
  }

  function playKickedBall() {
    beginScene({ hero: false });
    const ball =
      spawn("tire", {
        position: { x: -5, y: 0.4, z: 0 },
        color: 0xd92d20,
        fallback: () => {
          const s = mkSphere(0.4, 0xd92d20, { roughness: 0.55 });
          s.position.set(-5, 0.4, 0);
          return s;
        },
      }) || mkSphere(0.4, 0xd92d20);
    let v = 3.0 / M;
    let hold = 0;
    extraTick = (dt) => {
      v = Math.max(0, v - 0.45 * dt);
      ball.position.x += v * dt;
      ball.rotation.z -= v * 1.6 * dt;
      if (v < 0.02) {
        hold += dt;
        if (hold > 1.0) {
          ball.position.set(-5, 0.4, 0);
          v = 3.0 / M;
          hold = 0;
        }
      }
    };
  }

  function playParachute() {
    beginScene({ hero: false });
    const chute =
      spawn("parasol", {
        position: { x: 0, y: 2.5, z: 0 },
        color: 0xff7a33,
        fallback: () => {
          const m = new THREE.Mesh(
            new THREE.SphereGeometry(0.9, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5),
            mkStdMat(0xff7a33, { roughness: 0.6 })
          );
          m.position.set(0, 2.5, 0);
          return m;
        },
      }) || mkSphere(0.5, 0xff7a33);
    const person = spawn("kart", {
      position: { x: 0, y: 1.6, z: 0 },
      color: 0x60a5fa,
      scaleMult: 0.85,
      fallback: () => {
        const p = mkBox(0.3, 0.6, 0.22, 0x60a5fa);
        p.position.set(0, 1.6, 0);
        return p;
      },
    });
    extrasRoot.add(mkLine(new THREE.Vector3(-0.7, 2.3, 0), new THREE.Vector3(0, 1.85, 0), 0xfbbf24));
    extrasRoot.add(mkLine(new THREE.Vector3(0.7, 2.3, 0), new THREE.Vector3(0, 1.85, 0), 0xfbbf24));
    extrasRoot.add(mkArrow(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 2.8, 0), 0.9, 0x22c55e));
    extrasRoot.add(mkArrow(new THREE.Vector3(0, -1, 0), new THREE.Vector3(0, 1.5, 0), 0.7, 0xff7a33));
    let t = 0;
    extraTick = (dt) => {
      t += dt;
      chute.position.y = 2.5 + Math.sin(t * 1.2) * 0.08;
      person.position.y = 1.6 + Math.sin(t * 1.2) * 0.06;
    };
  }

  function playMagnet({ focus = "both" } = {}) {
    beginScene({ hero: false });
    spawn("magnet", { position: { x: -0.5, y: 1.8, z: 0 }, scaleMult: 1.1 });
    const clip =
      focus === "coin"
        ? null
        : spawn("boxSmall", {
            position: { x: 0.35, y: 0.5, z: 0.2 },
            color: 0x64748b,
          });
    const coin =
      focus === "clip"
        ? null
        : spawn("tire", {
            position: { x: 0.55, y: 0.48, z: -0.25 },
            color: 0xfbbf24,
            scaleMult: 0.35,
          });
    let t = 0;
    extraTick = (dt) => {
      t += dt;
      const lift = Math.min(1, t * 0.35);
      if (clip) {
        clip.position.y = 0.5 + lift * 1.1;
        clip.position.x = 0.35 + lift * 0.15;
      }
      if (coin) {
        coin.position.y = 0.48 + lift * 1.05;
        coin.position.x = 0.55 + lift * 0.1;
      }
    };
  }

  function playTugOfWar({ left = 1, right = 1.2, snapshot = false } = {}) {
    beginScene({ hero: false });
    spawnCrate({ x: -2.4, y: 0.35, z: 0 }, 0x5b8cff, "small");
    spawnCrate({ x: 2.4, y: 0.35, z: 0 }, 0xff8c42, "small");
    const knot = spawn("cone", {
      position: { x: 0, y: 0.55, z: 0 },
      color: 0xfbbf24,
      scaleMult: 0.5,
      fallback: () => mkSphere(0.18, 0xfbbf24),
    });
    const targetX = ((right - left) / 4) * 0.95;
    knot.position.set(snapshot ? targetX : 0, 0.55, 0);
    extrasRoot.add(knot);
    extrasRoot.add(mkArrow(new THREE.Vector3(-1, 0, 0), new THREE.Vector3(targetX - 0.15, 0.55, 0), left, 0x5b8cff));
    extrasRoot.add(mkArrow(new THREE.Vector3(1, 0, 0), new THREE.Vector3(targetX + 0.15, 0.55, 0), right, 0xff8c42));
    let t = 0;
    extraTick = (dt) => {
      t += dt;
      if (snapshot) {
        knot.position.x = targetX + Math.sin(t * 2.4) * 0.04;
        return;
      }
      knot.position.x = targetX * Math.min(t / 1.2, 1);
    };
  }
}
