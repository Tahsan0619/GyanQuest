/**
 * Lightweight themed 3D arena for curriculum games.
 * Scenes must only place registered asset keys (see asset-loader.js).
 * Chemistry scenes are distinct per topic so screens do not look identical.
 */
import { spawnAsset, hasAsset } from "./asset-loader.js";

const THREE = window.THREE;

export function createArena(canvas, theme = {}) {
 const sky = theme.sky ?? 0x87ceeb;
 const floorColor = theme.floor ?? 0x121922;
 const fogColor = theme.fog ?? 0xbae6fd;

 const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
 renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
 renderer.setClearColor(sky, 1);

 const scene = new THREE.Scene();
 scene.fog = new THREE.Fog(fogColor, 14, 36);

 const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
 camera.position.set(0, 4.2, 9);
 camera.lookAt(0, 0.4, 0);

 scene.add(new THREE.HemisphereLight(0x7aa8ff, 0x1a1a1a, 0.9));
 const dir = new THREE.DirectionalLight(0xffffff, 0.6);
 dir.position.set(4, 10, 6);
 scene.add(dir);

 const grid = new THREE.GridHelper(40, 40, 0x1a56db, 0x1e2a3a);
 grid.position.y = 0.01;
 scene.add(grid);

 const floor = new THREE.Mesh(
 new THREE.PlaneGeometry(40, 40),
 new THREE.MeshStandardMaterial({ color: floorColor, roughness: 0.9, metalness: 0.1 }),
 );
 floor.rotation.x = -Math.PI / 2;
 scene.add(floor);

 const extras = new THREE.Group();
 scene.add(extras);

 let extraTick = null;
 let sceneDispose = null;
 let orbit = null;
 let playground = false;
 let hero = null;

 function disposeTree(obj) {
 if (!obj?.traverse) return;
 obj.traverse((c) => {
 if (c.geometry) c.geometry.dispose();
 if (c.material) {
 if (Array.isArray(c.material)) c.material.forEach((m) => m.dispose());
 else c.material.dispose();
 }
 });
 }

 function clearExtras() {
 if (typeof sceneDispose === "function") {
 try {
 sceneDispose();
 } catch {
 /* ignore dispose errors */
 }
 sceneDispose = null;
 }
 while (extras.children.length) {
 const c = extras.children.pop();
 extras.remove(c);
 disposeTree(c);
 }
 extraTick = null;
 }

 function fallbackBox(color = 0x60a5fa) {
 return new THREE.Mesh(
 new THREE.BoxGeometry(0.8, 0.8, 0.8),
 new THREE.MeshStandardMaterial({ color, roughness: 0.5 }),
 );
 }

 function place(key, x, z, y = 0, opts = {}) {
 const obj =
 spawnAsset(key, {
 parent: extras,
 position: { x, y, z },
 ...opts,
 fallback: () => {
 const b = fallbackBox(opts.color ?? 0x94a3b8);
 b.position.set(x, y + 0.4, z);
 extras.add(b);
 return b;
 },
 }) || null;
 if (obj && opts.tag) obj.userData.tag = opts.tag;
 if (obj && opts.noBob) obj.userData.noBob = true;
 return obj;
 }

 function particle(color, x, y, z, size = 0.12) {
 const m = new THREE.Mesh(
 new THREE.SphereGeometry(size, 10, 10),
 new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.25 }),
 );
 m.position.set(x, y, z);
 m.userData.particle = true;
 extras.add(m);
 return m;
 }

 function bobTick(start) {
 return () => {
 if (!extras.children.length) return;
 const t = (performance.now() - start) / 1000;
 extras.children.forEach((c, i) => {
 if (c.userData?.noBob) return;
 if (c.userData?.particle) {
 c.position.y += Math.sin(t * 2.2 + i) * 0.002;
 return;
 }
 c.position.y += Math.sin(t * 1.4 + i) * 0.0008;
 });
 };
 }

 const SCENES = {
 labBench() {
 place("desk", 0, 0, 0, { noBob: true });
 place("bottle", -1.2, 0.4, 0.9);
 place("cup", 0.8, 0.3, 0.85);
 place("apple", 1.4, -0.2, 0.85);
 place("boxSmall", -2, -1.2);
 },

 /** Chemistry topic scenes - unique layouts + light motion */
 chemAtoms() {
 place("desk", 0, 0, 0, { noBob: true });
 place("bottle", -1.1, 0.3, 0.9, { color: 0x38bdf8 });
 place("cup", 0.9, 0.2, 0.85);
 // "atoms" as floating spheres around the bottle
 for (let i = 0; i < 10; i++) {
 const a = (i / 10) * Math.PI * 2;
 particle(0x7dd3fc, Math.cos(a) * 1.6 - 1.1, 1.4 + (i % 3) * 0.15, Math.sin(a) * 1.1 + 0.3, 0.1);
 }
 const start = performance.now();
 extraTick = () => {
 const t = (performance.now() - start) / 1000;
 extras.children.forEach((c, i) => {
 if (!c.userData?.particle) return;
 const a = t * 0.9 + i * 0.6;
 c.position.x = Math.cos(a) * 1.6 - 1.1;
 c.position.z = Math.sin(a) * 1.1 + 0.3;
 c.position.y = 1.35 + Math.sin(t * 2 + i) * 0.2;
 });
 };
 },

 chemElements() {
 place("desk", 0, 0, 0, { noBob: true });
 place("bottle", -1.6, 0.2, 0.9, { color: 0x64748b, tag: "Fe" }); // iron-ish
 place("bottleKetchup", 0, 0.3, 0.9, { color: 0xb45309, tag: "Cu" });
 place("bottleMustard", 1.6, 0.2, 0.9, { color: 0x38bdf8, tag: "O" });
 place("boxSmall", -2.2, -1.2, 0, { color: 0x94a3b8 });
 place("boxSmall", 2.2, -1.2, 0, { color: 0xf59e0b });
 const start = performance.now();
 extraTick = bobTick(start);
 },

 chemBonds() {
 place("desk", 0, 0, 0, { noBob: true });
 place("magnet", 0, -0.2, 0.2, { color: 0xef4444 });
 place("cup", -1.8, 0.4, 0.85, { color: 0xe2e8f0 });
 place("apple", 1.8, 0.3, 0.85);
 place("boxSmall", 0, 1.4);
 const start = performance.now();
 extraTick = () => {
 const t = (performance.now() - start) / 1000;
 extras.children.forEach((c) => {
 if (c.userData?.tag === undefined && c.position) {
 // magnet pulse
 }
 });
 const mag = extras.children.find((c) => c.position && Math.abs(c.position.x) < 0.2);
 const left = extras.children.find((c) => c.position?.x < -1);
 const right = extras.children.find((c) => c.position?.x > 1.2);
 if (left) left.position.x = -1.8 + Math.sin(t) * 0.25;
 if (right) right.position.x = 1.8 - Math.sin(t) * 0.25;
 if (mag) mag.position.y = 0.2 + Math.abs(Math.sin(t * 2)) * 0.15;
 };
 },

 chemMixtures() {
 place("desk", 0, 0, 0, { noBob: true });
 place("bottle", -1.4, 0.2, 0.95, { color: 0xf59e0b }); // oil
 place("cup", 0.4, 0.3, 0.85, { color: 0x38bdf8 });
 place("bowl", 1.6, 0.1, 0.85, { color: 0xf8fafc });
 place("pan", -0.2, -1.4, 0);
 const start = performance.now();
 extraTick = () => {
 const t = (performance.now() - start) / 1000;
 const bottle = extras.children.find((c) => c.position?.x < -1);
 if (bottle) {
 bottle.rotation.z = Math.sin(t * 1.2) * 0.35;
 bottle.position.y = 0.95 + Math.max(0, Math.sin(t * 1.2)) * 0.1;
 }
 // drip particles into cup
 if (Math.sin(t * 1.2) > 0.7 && extras.children.filter((c) => c.userData?.particle).length < 6) {
 particle(0xfbbf24, -0.6, 1.3, 0.25, 0.06);
 }
 extras.children.forEach((c) => {
 if (!c.userData?.particle) return;
 c.position.y -= 0.02;
 c.position.x += 0.015;
 if (c.position.y < 0.9) {
 extras.remove(c);
 disposeTree(c);
 }
 });
 };
 },

 chemReactions() {
 place("desk", 0, 0, 0, { noBob: true });
 place("pan", 0, 0.4, 0, { color: 0x64748b, noBob: true, scaleMult: 1.35 });
 place("bottle", -2.0, 0.5, 0.95, { color: 0xf8fafc, scaleMult: 1.2 });
 place("bottleKetchup", 2.0, 0.5, 0.95, { color: 0xfde68a, scaleMult: 1.2 });
 place("cup", 2.4, -1.3, 0.9, { scaleMult: 1.1 });
 place("bowl", -2.2, -1.2, 0.9, { color: 0xe2e8f0 });
 const start = performance.now();
 for (let i = 0; i < 10; i++) {
 particle(0x86efac, (Math.random() - 0.5) * 0.9, 0.55 + Math.random() * 0.5, 0.35, 0.08);
 }
 extraTick = () => {
 const t = (performance.now() - start) / 1000;
 extras.children.forEach((c, i) => {
 if (!c.userData?.particle) return;
 c.position.y = 0.55 + ((t * 0.7 + i * 0.18) % 1.4);
 c.position.x = Math.sin(t * 1.2 + i) * 0.4;
 if (c.material) {
 c.material.transparent = true;
 c.material.opacity = 0.9 - ((t * 0.7 + i * 0.18) % 1.4) / 1.6;
 }
 });
 };
 },

 chemAcids() {
 place("desk", 0, 0, 0, { noBob: true });
 place("bottle", -1.5, 0.2, 0.9, { color: 0xef4444 }); // acid
 place("bottle", 0, 0.3, 0.9, { color: 0x3b82f6 }); // base
 place("cup", 1.5, 0.2, 0.85, { color: 0xa3e635 });
 place("bowl", -0.2, -1.3, 0.85);
 const start = performance.now();
 extraTick = () => {
 const t = (performance.now() - start) / 1000;
 const cups = extras.children.filter((c) => Math.abs(c.position?.x - 1.5) < 0.2);
 cups.forEach((c) => {
 const hue = (Math.sin(t) + 1) / 2;
 c.traverse((m) => {
 if (m.isMesh && m.material?.color) {
 m.material.color.setRGB(0.9 - hue * 0.5, 0.2 + hue * 0.5, 0.2 + hue * 0.7);
 }
 });
 });
 };
 },

 chemStates() {
 place("desk", 0, 0, 0, { noBob: true });
 place("apple", -1.6, 0.2, 0.85); // solid
 place("cup", 0, 0.3, 0.85, { color: 0x38bdf8 }); // liquid
 place("pan", 1.6, 0.1, 0); // heat → gas
 place("bottle", 2.2, -1.2, 0.9, { color: 0xe0f2fe });
 for (let i = 0; i < 6; i++) {
 particle(0xe0f2fe, 1.6 + (Math.random() - 0.5) * 0.4, 1.0 + i * 0.12, 0.1, 0.08);
 }
 const start = performance.now();
 extraTick = () => {
 const t = (performance.now() - start) / 1000;
 extras.children.forEach((c, i) => {
 if (!c.userData?.particle) return;
 c.position.y = 1.0 + ((t * 0.5 + i * 0.15) % 1.5);
 c.material.transparent = true;
 c.material.opacity = 0.85 - ((t * 0.5 + i * 0.15) % 1.5) / 1.8;
 });
 };
 },

 chemPeriodic() {
 place("desk", 0, 0, 0, { noBob: true });
 const colors = [0x64748b, 0xf59e0b, 0x38bdf8, 0xa78bfa, 0x22c55e, 0xf43f5e];
 colors.forEach((col, i) => {
 const x = -2 + (i % 3) * 1.5;
 const z = -0.4 + Math.floor(i / 3) * 1.4;
 place("boxSmall", x, z, 0, { color: col });
 });
 place("barrel", 2.4, 0.5, 0, { color: 0x94a3b8 });
 const start = performance.now();
 extraTick = bobTick(start);
 },

 chemSafety() {
 place("desk", 0, 0, 0, { noBob: true });
 place("cone", -1.5, 0.5);
 place("cone", 1.5, 0.5);
 place("bottle", 0, 0.2, 0.9, { color: 0xf97316 });
 place("boxLarge", -2.2, -1.2, 0, { color: 0xef4444 });
 place("cup", 2, -1, 0.85);
 const start = performance.now();
 extraTick = () => {
 const t = (performance.now() - start) / 1000;
 extras.children.forEach((c) => {
 if (Math.abs(c.position?.x) > 1.2 && c.position?.y < 0.5) {
 c.rotation.y = Math.sin(t * 3) * 0.15;
 }
 });
 };
 },

 chemSynthesis() {
 place("desk", 0, 0, 0, { noBob: true });
 place("pan", 0, 0.2, 0, { noBob: true });
 place("bottle", -1.8, 0.3, 0.9, { color: 0xf59e0b });
 place("apple", 1.5, 0.2, 0.85);
 place("bowl", 1.8, -1.2, 0.85);
 place("magnet", -2.2, -1.2, 0.1, { color: 0xdc2626 });
 const start = performance.now();
 for (let i = 0; i < 5; i++) particle(0xfbbf24, (Math.random() - 0.5) * 0.6, 0.6, 0.2, 0.06);
 extraTick = () => {
 const t = (performance.now() - start) / 1000;
 extras.children.forEach((c, i) => {
 if (!c.userData?.particle) return;
 c.position.y = 0.55 + Math.abs(Math.sin(t * 2 + i)) * 0.5;
 });
 };
 },

 factory() {
 place("structure", -2.5, -1);
 place("conveyor", 0.5, 0);
 place("boxLarge", 1.5, 0.8);
 place("robotArm", -1, 1.2);
 place("crane", 3, -1.5);
 },
 nature() {
 place("tree", -2, -1);
 place("tree", 2.2, 0.5);
 place("plant", 0, 1);
 place("rockNature", 1, -1.5);
 place("rocks", -1.5, 1.2);
 },
 city() {
 place("building", -2.5, -1);
 place("building", 2.5, 0.5);
 place("parasol", 0, 1.2);
 place("carSedan", 0.5, -1.5);
 place("cone", 2, -1.2);
 },
 space() {
 place("rocket", 0, 0);
 place("astronaut", -1.8, 1);
 place("satellite", 2.2, -0.5);
 place("barrel", 1.5, 1.2);
 },
 vehicles() {
 place("carSports", -1.5, 0);
 place("truck", 2, -0.5);
 place("tire", 0, 1.5);
 place("cone", -2.5, 1);
 },
 arcade() {
 place("arcade", 0, 0);
 place("register", 2, 0.5);
 place("coin", -1.5, 0.8, 0.3);
 place("button", -0.5, 1.5);
 },
 castle() {
 place("castleDoor", 0, -0.5);
 place("castleBridge", 0, 2);
 place("brick", -2, 0.5);
 place("brick", 2, 0.5);
 },
 classroom() {
 place("desk", 0, 0);
 place("chair", 0, 1.2);
 place("bookcase", -2.5, -0.5);
 place("apple", 0.6, 0.2, 0.9);
 },
 // Topic variants for other packs (avoid identical screens)
 factoryFlow() {
 place("conveyor", 0, 0);
 place("boxSmall", -1.5, 0.5);
 place("boxLarge", 1.8, 0.3);
 place("robotArm", -2.2, -1);
 },
 natureCycle() {
 place("tree", -2, 0);
 place("plant", 0.5, 1);
 place("apple", 1.5, -0.5, 0.2);
 place("rockNature", -0.5, -1.5);
 },
 cityTraffic() {
 place("carSedan", -1, 0);
 place("cone", 1.2, 0.8);
 place("building", 2.5, -1);
 place("truck", -2.5, 1);
 },
 spaceOrbit() {
 place("rocket", -1.5, 0);
 place("satellite", 1.8, 0.5);
 place("astronaut", 0, 1.5);
 },
 arcadeBits() {
 place("arcade", -1, 0);
 place("coin", 1, 0.5, 0.3);
 place("button", 1.8, -0.8);
 place("register", 0.2, 1.5);
 },
 classroomCount() {
 place("desk", 0, 0);
 place("coin", -1, 0.5, 0.9);
 place("coin", 0.2, 0.5, 0.9);
 place("coin", 1.2, 0.5, 0.9);
 place("apple", 1.6, -0.8, 0.9);
 },
 castleBuild() {
 place("brick", -1.2, 0);
 place("brick", 0, 0);
 place("brick", 1.2, 0);
 place("castleDoor", 0, 1.8);
 },
 vehiclesRace() {
 place("carSports", -1.8, 0);
 place("truck", 1.8, 0);
 place("cone", 0, 1.5);
 place("tire", 0, -1.2);
 },
 default() {
 place("boxLarge", -1, 0);
 place("barrel", 1.2, 0.5);
 place("rocks", 0, -1.5);
 place("cone", 2, -1);
 },
 };

 /**
 * Register or replace a named scene. Builder receives helpers closed over this arena.
 * @param {string} name
 * @param {(api: {
 * place: Function, particle: Function, extras: THREE.Group, THREE: typeof THREE,
 * camera: THREE.Camera, scene: THREE.Scene, setTick: (fn: Function|null) => void,
 * setDispose: (fn: Function|null) => void, clearExtras: Function, opts: object
 * }) => void} builder
 */
 function registerScene(name, builder) {
 SCENES[name] = function registeredScene() {
 builder({
 place,
 particle,
 extras,
 THREE,
 camera,
 scene,
 clearExtras,
 opts: playOpts,
 setTick(fn) {
 extraTick = fn;
 },
 setDispose(fn) {
 sceneDispose = fn;
 },
 });
 };
 }

 let playOpts = {};

 function playExample(name, opts = {}) {
 playOpts = opts || {};
 // clearExtras runs sceneDispose + tears down previous meshes before building
 clearExtras();
 const fn = SCENES[name] || SCENES.default;
 fn();
 if (!extraTick) {
 const start = performance.now();
 extraTick = bobTick(start);
 }
 }

 function resize() {
 const parent = canvas.parentElement;
 const w = parent?.clientWidth || window.innerWidth;
 const h = parent?.clientHeight || Math.max(240, window.innerHeight * 0.4);
 renderer.setSize(w, h, false);
 camera.aspect = w / Math.max(1, h);
 camera.updateProjectionMatrix();
 }

 function tick() {
 if (extraTick) extraTick();
 if (orbit && playground) orbit.update();
 renderer.render(scene, camera);
 }

 function enterPlayground() {
 playground = true;
 clearExtras();
 playExample(theme.defaultScene || "default");
 if (THREE.OrbitControls) {
 orbit = new THREE.OrbitControls(camera, canvas);
 orbit.enableDamping = true;
 orbit.target.set(0, 0.5, 0);
 }
 }

 function exitPlayground() {
 playground = false;
 if (orbit) {
 orbit.dispose();
 orbit = null;
 }
 camera.position.set(0, 4.2, 9);
 camera.lookAt(0, 0.4, 0);
 clearExtras();
 }

 function spawnPlaygroundProp(key) {
 const x = (Math.random() - 0.5) * 6;
 const z = (Math.random() - 0.5) * 4;
 place(key, x, z);
 }

 resize();
 playExample(theme.defaultScene || "default");

 return {
 scene,
 camera,
 renderer,
 resize,
 tick,
 clearExtras,
 playExample,
 registerScene,
 enterPlayground,
 exitPlayground,
 spawnPlaygroundProp,
 hasAsset,
 setHeroVisible(v) {
 if (hero) hero.visible = v;
 },
 };
}
