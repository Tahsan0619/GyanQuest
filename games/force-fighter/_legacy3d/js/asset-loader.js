/**
 * Kenney OBJ props from 3D Assets/ - load once, clone for each scene.
 */
const THREE = window.THREE;

/** Shared 3D Assets at ImpactX root (sibling of force-fighter) so any folder can access it. */
function resolveAssetBase() {
  if (typeof document === "undefined") return "3D%20Assets";
  const path = document.location.pathname.replace(/\\/g, "/");
  // /games/force-fighter/ → ../../3D Assets
  if (path.includes("/games/force-fighter")) return "../../3D%20Assets";
  if (path.includes("/force-fighter")) return "../3D%20Assets";
  return "../../3D%20Assets";
}

const BASE = resolveAssetBase();
const kitPath = (kit) => kit.split("/").map((p) => encodeURIComponent(p)).join("/");
const OBJ = (kit, file) => `${BASE}/kenney/${kitPath(kit)}/Models/OBJ%20format/${file}`;

/** targetSize = max dimension in world units; rotY = Y rotation so model nose points +X (travel direction). */
export const CAR_TRAVEL_Y = Math.PI / 2;
export const ASSET_DEFS = {
  wall: { url: OBJ("Factory Kit", "structure-wall.obj"), targetSize: 2.4, color: 0x8b9cb3, rotY: Math.PI / 2 },
  boxLarge: { url: OBJ("Factory Kit", "box-large.obj"), targetSize: 0.75, color: 0xc4a574 },
  boxSmall: { url: OBJ("Factory Kit", "box-small.obj"), targetSize: 0.55, color: 0xb8a068 },
  boxWide: { url: OBJ("Factory Kit", "box-wide.obj"), targetSize: 0.85, color: 0x9ca3af },
  magnet: { url: OBJ("Factory Kit", "crane-magnet.obj"), targetSize: 1.2, color: 0xcc4444 },
  crane: { url: OBJ("Factory Kit", "crane.obj"), targetSize: 2.8, color: 0x6b7280 },
  conveyor: { url: OBJ("Factory Kit", "conveyor-stripe.obj"), targetSize: 4.0, color: 0x4a5568, rotY: Math.PI / 2 },
  rampPlank: { url: OBJ("Factory Kit", "top-large.obj"), targetSize: 3.5, color: 0x4a5568 },
  structure: { url: OBJ("Factory Kit", "structure-medium.obj"), targetSize: 2.2, color: 0x94a3b8 },
  robotArm: { url: OBJ("Factory Kit", "robot-arm-a.obj"), targetSize: 1.4, color: 0xfbbf24 },
  carSports: { url: OBJ("Car Kit", "sedan-sports.obj"), targetSize: 2.1, color: 0xd92d20, rotY: CAR_TRAVEL_Y },
  carRace: { url: OBJ("Car Kit", "race.obj"), targetSize: 2.25, color: 0x3dd6c7, rotY: CAR_TRAVEL_Y },
  carSedan: { url: OBJ("Car Kit", "sedan.obj"), targetSize: 2.1, color: 0x60a5fa, rotY: CAR_TRAVEL_Y },
  truck: { url: OBJ("Car Kit", "truck.obj"), targetSize: 2.35, color: 0x2d6a4f, rotY: CAR_TRAVEL_Y },
  kart: { url: OBJ("Car Kit", "kart-oodi.obj"), targetSize: 1.75, color: 0xf59e0b, rotY: CAR_TRAVEL_Y },
  delivery: { url: OBJ("Car Kit", "delivery.obj"), targetSize: 2.15, color: 0xc4a574, rotY: CAR_TRAVEL_Y },
  van: { url: OBJ("Car Kit", "van.obj"), targetSize: 2.2, color: 0x8b5cf6, rotY: CAR_TRAVEL_Y },
  tire: { url: OBJ("Car Kit", "debris-tire.obj"), targetSize: 0.55, color: 0x1e293b },
  cone: { url: OBJ("Car Kit", "cone.obj"), targetSize: 0.45, color: 0xf97316 },
  barrel: { url: OBJ("Mini Dungeon", "barrel.obj"), targetSize: 1.05, color: 0x6f5f52 },
  rocks: { url: OBJ("Mini Dungeon", "rocks.obj"), targetSize: 1.75, color: 0x6f5f52 },
  parasol: { url: OBJ("City Kit (Commercial)", "detail-parasol-a.obj"), targetSize: 1.8, color: 0xff7a33 },
  building: { url: OBJ("City Kit (Commercial)", "building-a.obj"), targetSize: 2.5, color: 0x64748b },
};

const cache = new Map();
let loadPromise = null;
let backgroundPromise = null;

/** Loaded first so level 1 feels ready quickly; the rest load in the background. */
const BOOT_ASSET_KEYS = [
  "carSports",
  "carSedan",
  "carRace",
  "delivery",
  "van",
  "truck",
  "kart",
  "tire",
  "boxLarge",
  "boxSmall",
  "rocks",
  "barrel",
  "wall",
  "cone",
  "building",
];

const LOAD_CONCURRENCY = 4;

function applyColorMaterials(object, hex = 0x88aacc) {
  object.traverse((c) => {
    if (c.isMesh) {
      c.material = new THREE.MeshStandardMaterial({
        color: hex,
        roughness: 0.62,
        metalness: 0.14,
      });
    }
  });
}

/** Fit mesh to target max dimension and sit on local Y=0 (ground). */
function normalizeObject(obj, targetSize = 1.0) {
  const box = new THREE.Box3().setFromObject(obj);
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z, 0.001);
  obj.scale.setScalar(targetSize / maxDim);
  box.setFromObject(obj);
  const center = box.getCenter(new THREE.Vector3());
  obj.position.x -= center.x;
  obj.position.z -= center.z;
  obj.position.y -= box.min.y;
  return obj;
}

function loadAssetKeys(keys) {
  if (!keys.length) return Promise.resolve([]);
  const loader = new THREE.OBJLoader();
  const pending = keys.filter((key) => !cache.has(key) && ASSET_DEFS[key]);
  if (!pending.length) return Promise.resolve(keys);

  let cursor = 0;
  const results = [];

  function worker() {
    const key = pending[cursor++];
    if (!key) return Promise.resolve();
    const def = ASSET_DEFS[key];
    return new Promise((resolve) => {
      loader.load(
        def.url,
        (obj) => {
          applyColorMaterials(obj, def.color ?? 0x9aa8b8);
          normalizeObject(obj, def.targetSize ?? def.scale ?? 1.0);
          if (def.rotY != null) obj.rotation.y = def.rotY;
          cache.set(key, obj);
          results.push(key);
          resolve();
        },
        undefined,
        () => {
          console.warn("3D Asset failed:", key, def.url);
          resolve();
        },
      );
    }).then(worker);
  }

  const workers = Array.from(
    { length: Math.min(LOAD_CONCURRENCY, pending.length) },
    () => worker(),
  );
  return Promise.all(workers).then(() => results);
}

function preloadRemainingAssets() {
  if (backgroundPromise) return backgroundPromise;
  const rest = Object.keys(ASSET_DEFS).filter((key) => !cache.has(key));
  backgroundPromise = loadAssetKeys(rest).then((loaded) => {
    const total = cache.size;
    console.info(
      `Force Fighter: ${total}/${Object.keys(ASSET_DEFS).length} Kenney models ready (${loaded.length} loaded in background)`,
    );
  });
  return backgroundPromise;
}

export function initAssetLoader() {
  if (!THREE.OBJLoader) {
    console.warn("OBJLoader missing - 3D Assets will not load. Add OBJLoader script to index.html.");
    return Promise.resolve();
  }
  if (loadPromise) return loadPromise;
  loadPromise = loadAssetKeys(BOOT_ASSET_KEYS).then((loaded) => {
    const n = loaded.length;
    console.info(`Force Fighter: boot assets ready (${n}/${BOOT_ASSET_KEYS.length})`);
    const schedule = () => preloadRemainingAssets();
    if (typeof requestIdleCallback === "function") requestIdleCallback(schedule, { timeout: 2500 });
    else setTimeout(schedule, 50);
  });
  return loadPromise;
}

/** Resolves when every defined Kenney model has been attempted. */
export function whenAllAssetsReady() {
  return initAssetLoader().then(() => backgroundPromise || Promise.resolve());
}

export function cloneAsset(key) {
  const src = cache.get(key);
  if (!src) return null;
  return src.clone(true);
}

export function hasAsset(key) {
  return cache.has(key);
}

export function listLoadedAssets() {
  return [...cache.keys()];
}

/**
 * @param {string} key
 * @param {{
 *   parent?: THREE.Object3D;
 *   position?: THREE.Vector3 | { x: number; y: number; z: number };
 *   rotationY?: number;
 *   rotationZ?: number;
 *   scaleMult?: number;
 *   color?: number;
 *   fallback?: () => THREE.Object3D;
 * }} [opts]
 */
export function spawnAsset(key, opts = {}) {
  const parent = opts.parent;
  let obj = null;
  if (hasAsset(key)) {
    obj = cloneAsset(key);
    if (obj && opts.color != null) applyColorMaterials(obj, opts.color);
    if (obj && opts.scaleMult) obj.scale.multiplyScalar(opts.scaleMult);
    const extraY = opts.rotationY != null ? opts.rotationY : 0;
    if (obj && extraY) obj.rotation.y += extraY;
    if (obj && opts.rotationZ != null) obj.rotation.z = opts.rotationZ;
    if (obj && opts.position) {
      const p = opts.position;
      if (p.isVector3) obj.position.copy(p);
      else obj.position.set(p.x ?? 0, p.y ?? 0, p.z ?? 0);
    }
  }
  if (!obj && typeof opts.fallback === "function") obj = opts.fallback();
  if (obj && parent) parent.add(obj);
  return obj;
}

export const ASSETS = ASSET_DEFS;

/** Kid-friendly labels for playground spawn buttons. */
export const PLAYGROUND_ASSET_LABELS = {
  wall: "Wall",
  boxLarge: "Big crate",
  boxSmall: "Small crate",
  boxWide: "Wide crate",
  magnet: "Magnet",
  crane: "Crane",
  conveyor: "Conveyor",
  rampPlank: "Ramp",
  structure: "Factory",
  robotArm: "Robot arm",
  carSports: "Sports car",
  carRace: "Race car",
  carSedan: "Sedan",
  truck: "Truck",
  kart: "Kart",
  delivery: "Delivery van",
  van: "Van",
  tire: "Tire",
  cone: "Cone",
  barrel: "Barrel",
  rocks: "Rocks",
  parasol: "Parasol",
  building: "Building",
};

/** Relative mass for playground collisions (approximate). */
export const PLAYGROUND_ASSET_MASS = {
  wall: 12,
  building: 14,
  structure: 9,
  crane: 10,
  conveyor: 8,
  rampPlank: 6,
  robotArm: 4,
  magnet: 3,
  truck: 3.2,
  van: 2.8,
  delivery: 2.4,
  carSedan: 1.2,
  carSports: 1,
  carRace: 1,
  kart: 0.75,
  boxLarge: 1.6,
  boxWide: 1.4,
  boxSmall: 0.9,
  rocks: 2.2,
  barrel: 1.8,
  tire: 0.7,
  cone: 0.4,
  parasol: 1.1,
};

export const PLAYGROUND_ASSET_GROUPS = [
  { id: "vehicles", title: "Cars & trucks", keys: ["carSports", "carRace", "carSedan", "truck", "kart", "delivery", "van"] },
  { id: "props", title: "Rocks & boxes", keys: ["rocks", "barrel", "cone", "tire", "boxLarge", "boxSmall", "boxWide"] },
  { id: "factory", title: "Factory kit", keys: ["wall", "structure", "crane", "magnet", "robotArm", "conveyor", "rampPlank"] },
  { id: "city", title: "City kit", keys: ["building", "parasol"] },
];

/**
 * Loaded assets grouped for the playground spawn panel.
 * @returns {{ id: string; title: string; items: { key: string; label: string; mass: number }[] }[]}
 */
/**
 * All playground spawn entries (show every asset; UI marks unloaded as disabled).
 * @returns {{ id: string; items: { key: string; label: string; mass: number; ready: boolean }[] }[]}
 */
export function playgroundAssetCatalog() {
  return PLAYGROUND_ASSET_GROUPS.map((g) => ({
    id: g.id,
    items: g.keys
      .filter((key) => ASSET_DEFS[key])
      .map((key) => ({
        key,
        label: PLAYGROUND_ASSET_LABELS[key] || key,
        mass: PLAYGROUND_ASSET_MASS[key] ?? 1,
        ready: hasAsset(key),
      })),
  })).filter((g) => g.items.length > 0);
}
