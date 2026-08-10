/**
 * Kenney OBJ loader - kit registry shared across curriculum games.
 */
const THREE = window.THREE;

function resolveAssetBase() {
 if (typeof document === "undefined") return "3D%20Assets";
 const path = document.location.pathname.replace(/\\/g, "/");
 // /games/<slug>/ under ImpactX root → ../../3D Assets
 if (path.includes("/games/")) return "../../3D%20Assets";
 // Legacy top-level game URLs
 if (/\/[a-z0-9-]+\/?$/i.test(path) || /\/[a-z0-9-]+\/index\.html$/i.test(path)) {
 return "../3D%20Assets";
 }
 return "3D%20Assets";
}

const BASE = resolveAssetBase();
const kitPath = (kit) => kit.split("/").map((p) => encodeURIComponent(p)).join("/");
const OBJ = (kit, file) => `${BASE}/kenney/${kitPath(kit)}/Models/OBJ%20format/${file}`;

/** Master catalog - games pick subsets via manifest.assetKeys */
export const ASSET_DEFS = {
 // Factory / lab
 wall: { url: OBJ("Factory Kit", "structure-wall.obj"), targetSize: 2.4, color: 0x8b9cb3, rotY: Math.PI / 2 },
 boxLarge: { url: OBJ("Factory Kit", "box-large.obj"), targetSize: 0.75, color: 0xc4a574 },
 boxSmall: { url: OBJ("Factory Kit", "box-small.obj"), targetSize: 0.55, color: 0xb8a068 },
 boxWide: { url: OBJ("Factory Kit", "box-wide.obj"), targetSize: 0.85, color: 0x9ca3af },
 magnet: { url: OBJ("Factory Kit", "crane-magnet.obj"), targetSize: 1.2, color: 0xcc4444 },
 crane: { url: OBJ("Factory Kit", "crane.obj"), targetSize: 2.8, color: 0x6b7280 },
 conveyor: { url: OBJ("Factory Kit", "conveyor-stripe.obj"), targetSize: 4.0, color: 0x4a5568, rotY: Math.PI / 2 },
 structure: { url: OBJ("Factory Kit", "structure-medium.obj"), targetSize: 2.2, color: 0x94a3b8 },
 robotArm: { url: OBJ("Factory Kit", "robot-arm-a.obj"), targetSize: 1.4, color: 0xfbbf24 },
 // Vehicles
 carSports: { url: OBJ("Car Kit", "sedan-sports.obj"), targetSize: 2.1, color: 0xd92d20, rotY: Math.PI / 2 },
 carSedan: { url: OBJ("Car Kit", "sedan.obj"), targetSize: 2.1, color: 0x60a5fa, rotY: Math.PI / 2 },
 truck: { url: OBJ("Car Kit", "truck.obj"), targetSize: 2.35, color: 0x2d6a4f, rotY: Math.PI / 2 },
 cone: { url: OBJ("Car Kit", "cone.obj"), targetSize: 0.45, color: 0xf97316 },
 tire: { url: OBJ("Car Kit", "debris-tire.obj"), targetSize: 0.55, color: 0x1e293b },
 // Dungeon / props
 barrel: { url: OBJ("Mini Dungeon", "barrel.obj"), targetSize: 1.05, color: 0x6f5f52 },
 rocks: { url: OBJ("Mini Dungeon", "rocks.obj"), targetSize: 1.75, color: 0x6f5f52 },
 // City
 building: { url: OBJ("City Kit (Commercial)", "building-a.obj"), targetSize: 2.5, color: 0x64748b },
 parasol: { url: OBJ("City Kit (Commercial)", "detail-parasol-a.obj"), targetSize: 1.8, color: 0xff7a33 },
 // Food / chemistry metaphors (only kits present under 3D Assets/kenney)
 apple: { url: OBJ("Food Kit", "apple.obj"), targetSize: 0.7, color: 0xe11d48 },
 bottle: { url: OBJ("Food Kit", "bottle-oil.obj"), targetSize: 0.9, color: 0x38bdf8 },
 bottleKetchup: { url: OBJ("Food Kit", "bottle-ketchup.obj"), targetSize: 0.9, color: 0xb45309 },
 bottleMustard: { url: OBJ("Food Kit", "bottle-musterd.obj"), targetSize: 0.9, color: 0xfbbf24 },
 cup: { url: OBJ("Food Kit", "cup.obj"), targetSize: 0.55, color: 0xf8fafc },
 pan: { url: OBJ("Food Kit", "pan.obj"), targetSize: 1.1, color: 0x64748b },
 bowl: { url: OBJ("Food Kit", "bowl.obj"), targetSize: 0.9, color: 0xf8fafc },
 can: { url: OBJ("Food Kit", "can.obj"), targetSize: 0.7, color: 0x94a3b8 },
 // Nature / eco
 tree: { url: OBJ("Nature Kit", "tree_default.obj"), targetSize: 2.4, color: 0x22c55e },
 rockNature: { url: OBJ("Nature Kit", "rock_largeA.obj"), targetSize: 1.4, color: 0x78716c },
 plant: { url: OBJ("Nature Kit", "plant_bush.obj"), targetSize: 1.0, color: 0x4ade80 },
 // Space / astronomy
 astronaut: { url: OBJ("Space Kit", "astronautA.obj"), targetSize: 1.6, color: 0xe2e8f0 },
 rocket: { url: OBJ("Space Kit", "rocket_baseA.obj"), targetSize: 2.2, color: 0xf97316 },
 satellite: { url: OBJ("Space Kit", "satelliteDish.obj"), targetSize: 1.5, color: 0x94a3b8 },
 // Furniture / anatomy lab metaphors
 desk: { url: OBJ("Furniture Kit", "desk.obj"), targetSize: 1.8, color: 0xa16207 },
 chair: { url: OBJ("Furniture Kit", "chair.obj"), targetSize: 1.1, color: 0x78716c },
 bookcase: { url: OBJ("Furniture Kit", "bookcaseClosed.obj"), targetSize: 2.0, color: 0x92400e },
 // Prototype / ICT
 coin: { url: OBJ("Prototype Kit", "coin.obj"), targetSize: 0.45, color: 0xfbbf24 },
 button: { url: OBJ("Prototype Kit", "button-floor-round.obj"), targetSize: 0.6, color: 0x3b82f6 },
 // Arcade / CS metaphors
 arcade: { url: OBJ("Mini Arcade", "arcade-machine.obj"), targetSize: 2.0, color: 0x7c3aed },
 register: { url: OBJ("Mini Arcade", "cash-register.obj"), targetSize: 1.2, color: 0x64748b },
 // Castle / civil
 castleDoor: { url: OBJ("Castle Kit", "door.obj"), targetSize: 2.0, color: 0x78716c },
 castleBridge: { url: OBJ("Castle Kit", "bridge-straight.obj"), targetSize: 3.0, color: 0xa8a29e },
 // Platformer / math
 arrow: { url: OBJ("Platformer Kit", "arrow.obj"), targetSize: 0.8, color: 0xf59e0b },
 // Space station / robotics
 bedStation: { url: OBJ("Space Station Kit", "bed-double.obj"), targetSize: 1.8, color: 0x64748b },
 // Brick / geometry
 brick: { url: OBJ("Brick Kit", "bevel-hq-brick-2x4.obj"), targetSize: 0.9, color: 0xef4444 },
};

const cache = new Map();
let loadPromise = null;
let activeKeys = Object.keys(ASSET_DEFS);

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
 if (!THREE.OBJLoader) return Promise.resolve([]);
 const loader = new THREE.OBJLoader();
 const pending = keys.filter((key) => !cache.has(key) && ASSET_DEFS[key]);
 if (!pending.length) return Promise.resolve(keys);

 let cursor = 0;

 function worker() {
 const key = pending[cursor++];
 if (!key) return Promise.resolve();
 const def = ASSET_DEFS[key];
 return new Promise((resolve) => {
 loader.load(
 def.url,
 (obj) => {
 applyColorMaterials(obj, def.color ?? 0x9aa8b8);
 normalizeObject(obj, def.targetSize ?? 1.0);
 if (def.rotY != null) obj.rotation.y = def.rotY;
 cache.set(key, obj);
 resolve();
 },
 undefined,
 () => {
 console.warn("Asset failed:", key, def.url);
 resolve();
 },
 );
 }).then(worker);
 }

 return Promise.all(
 Array.from({ length: Math.min(LOAD_CONCURRENCY, pending.length) }, () => worker()),
 );
}

export function configureAssets(keys) {
 if (Array.isArray(keys) && keys.length) {
 activeKeys = keys.filter((k) => ASSET_DEFS[k]);
 }
}

export function initAssetLoader(keys) {
 if (keys) configureAssets(keys);
 if (loadPromise) return loadPromise;
 const boot = activeKeys.slice(0, 12);
 loadPromise = loadAssetKeys(boot).then(() => {
 const rest = activeKeys.filter((k) => !cache.has(k));
 const schedule = () => loadAssetKeys(rest);
 if (typeof requestIdleCallback === "function") requestIdleCallback(schedule, { timeout: 2500 });
 else setTimeout(schedule, 80);
 });
 return loadPromise;
}

export function whenAllAssetsReady() {
 return initAssetLoader().then(() => loadAssetKeys(activeKeys.filter((k) => !cache.has(k))));
}

export function hasAsset(key) {
 return cache.has(key);
}

export function cloneAsset(key) {
 const src = cache.get(key);
 return src ? src.clone(true) : null;
}

export function spawnAsset(key, opts = {}) {
 let obj = hasAsset(key) ? cloneAsset(key) : null;
 if (obj && opts.color != null) applyColorMaterials(obj, opts.color);
 if (obj && opts.scaleMult) obj.scale.multiplyScalar(opts.scaleMult);
 if (obj && opts.rotationY) obj.rotation.y += opts.rotationY;
 if (obj && opts.position) {
 const p = opts.position;
 obj.position.set(p.x ?? 0, p.y ?? 0, p.z ?? 0);
 }
 if (!obj && typeof opts.fallback === "function") obj = opts.fallback();
 if (obj && opts.parent) opts.parent.add(obj);
 return obj;
}

export function playgroundAssetCatalog(groups) {
 const g =
 groups ||
 [
 {
 id: "props",
 title: "Props",
 keys: activeKeys,
 },
 ];
 return g
 .map((group) => ({
 id: group.id,
 title: group.title,
 items: (group.keys || [])
 .filter((key) => ASSET_DEFS[key])
 .map((key) => ({
 key,
 label: key,
 mass: 1,
 ready: hasAsset(key),
 })),
 }))
 .filter((x) => x.items.length);
}
