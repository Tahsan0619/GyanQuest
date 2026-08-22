import * as THREE from "three";
import { OrbitControls } from "../vendor/addons/controls/OrbitControls.js";
import { GLTFLoader } from "../vendor/addons/loaders/GLTFLoader.js";

const FOCUS_VERT = /* glsl */ `
varying vec3 vFocusWorldPos;
`;
const FOCUS_VERT_TAIL = /* glsl */ `
vFocusWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;
`;
const FOCUS_FRAG = /* glsl */ `
varying vec3 vFocusWorldPos;
uniform vec3 uFocusW;
uniform float uFocusR;
uniform float uFocusA;
`;
const FOCUS_FRAG_TAIL = /* glsl */ `
{
  float _fd = distance(vFocusWorldPos, uFocusW);
  float _fm = smoothstep(uFocusR, uFocusR * 2.7, _fd) * uFocusA;
  gl_FragColor.rgb = mix(gl_FragColor.rgb, gl_FragColor.rgb * 0.11, _fm);
  float _g = dot(gl_FragColor.rgb, vec3(0.22, 0.48, 0.10));
  gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(_g), _fm * 0.62);
}
`;

const MIX_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;
const MIX_FRAG = /* glsl */ `
uniform sampler2D tSharp;
uniform sampler2D tBlur;
uniform vec2 uFocus;
uniform float uRadius;
uniform float uFeather;
uniform float uAmount;
varying vec2 vUv;
void main() {
  vec4 sharp = texture2D(tSharp, vUv);
  vec4 blur = texture2D(tBlur, vUv);
  float d = distance(vUv, uFocus);
  float m = smoothstep(uRadius, uRadius + uFeather, d) * uAmount;
  gl_FragColor = mix(sharp, blur, m);
}
`;

function specGlossPlugin(parser) {
  return {
    name: "KHR_materials_pbrSpecularGlossiness",
    extendMaterialParams(materialIndex, materialParams) {
      const def = parser.json.materials?.[materialIndex];
      const ext = def?.extensions?.KHR_materials_pbrSpecularGlossiness;
      if (!ext) return Promise.resolve();

      const pending = [];
      const diffuse = ext.diffuseFactor || [1, 1, 1, 1];
      materialParams.color = new THREE.Color().setRGB(
        diffuse[0],
        diffuse[1],
        diffuse[2],
        THREE.LinearSRGBColorSpace,
      );
      if (diffuse[3] != null) materialParams.opacity = diffuse[3];
      materialParams.metalness = 0;
      materialParams.roughness = Math.max(0.35, 1 - (ext.glossinessFactor ?? 1));

      if (ext.diffuseTexture) {
        pending.push(
          parser.assignTexture(materialParams, "map", ext.diffuseTexture, THREE.SRGBColorSpace),
        );
      }
      return Promise.all(pending);
    },
  };
}

function isMeshMat(m) {
  return m && (m.isMeshStandardMaterial || m.isMeshPhysicalMaterial || m.isMeshPhongMaterial || m.isMeshLambertMaterial || m.isMeshBasicMaterial);
}

export class SpecimenViewer {
  /**
   * @param {{
   *   canvas: HTMLCanvasElement,
   *   pinLayer: HTMLElement,
   *   irisEl: HTMLElement,
   *   onPinSelect?: (id: string) => void,
   *   onSurfacePlace?: (local: THREE.Vector3) => void,
   *   onPinMove?: (id: string, local: THREE.Vector3) => void,
   *   onProgress?: (ratio: number) => void,
   *   onLoad?: (info: object) => void,
   *   onError?: (err: Error) => void,
   * }} opts
   */
  constructor(opts) {
    this.opts = opts;
    this.canvas = opts.canvas;
    this.pinLayer = opts.pinLayer;
    this.irisEl = opts.irisEl;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x101413);

    this.camera = new THREE.PerspectiveCamera(42, 1, 0.05, 80);
    this.camera.position.set(0.9, 0.55, 3.15);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.NeutralToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.setClearColor(0x101413, 1);

    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.minDistance = 0.55;
    this.controls.maxDistance = 9;
    this.controls.target.set(0, 0, 0);

    this._addLights();

    this.root = new THREE.Group();
    this.scene.add(this.root);

    this.loader = new GLTFLoader();
    this.loader.register(specGlossPlugin);
    this.clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();
    this.ndc = new THREE.Vector2();
    this._v = new THREE.Vector3();
    this._v2 = new THREE.Vector3();
    this._box = new THREE.Box3();
    this._size = new THREE.Vector3();

    this.pins = [];
    this.pinWorld = new Map();
    this.focusId = null;
    this.focusWorld = new THREE.Vector3();
    this.focusAmount = 0;
    this.focusTargetAmt = 0;
    this.focusRadius = 0.42;
    this.editMode = false;
    this.blurEnabled = false;
    this.mixer = null;
    this._loadTok = 0;
    this._shaderRefs = [];
    this._drag = null;
    this._camFrom = new THREE.Vector3();
    this._tgtFrom = new THREE.Vector3();
    this._camTo = new THREE.Vector3();
    this._tgtTo = new THREE.Vector3();
    this._camTween = 0;
    this._isolate = null;
    this._origColors = new Map();

    this._bind();
    this._onResize();
    this._loop = this._loop.bind(this);
    requestAnimationFrame(this._loop);
  }

  _addLights() {
    const hemi = new THREE.HemisphereLight(0xd7e8df, 0x1a2420, 0.9);
    this.scene.add(hemi);

    const key = new THREE.DirectionalLight(0xfff6e8, 1.45);
    key.position.set(1.2, 4.2, 2.4);
    this.scene.add(key);

    const fill = new THREE.DirectionalLight(0x71daa7, 0.32);
    fill.position.set(-2.8, 2.0, -1.2);
    this.scene.add(fill);

    const rim = new THREE.DirectionalLight(0xf8bd45, 0.22);
    rim.position.set(0.2, 2.4, -3.0);
    this.scene.add(rim);

    this.spot = null;
  }

  _initPost() {
    const params = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter };
    this.rtFull = new THREE.WebGLRenderTarget(1, 1, params);
    this.rtSmall = new THREE.WebGLRenderTarget(1, 1, params);
    this.mixScene = new THREE.Scene();
    this.mixCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.mixMat = new THREE.ShaderMaterial({
      uniforms: {
        tSharp: { value: this.rtFull.texture },
        tBlur: { value: this.rtSmall.texture },
        uFocus: { value: new THREE.Vector2(0.5, 0.5) },
        uRadius: { value: 0.16 },
        uFeather: { value: 0.28 },
        uAmount: { value: 0 },
      },
      vertexShader: MIX_VERT,
      fragmentShader: MIX_FRAG,
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
    });
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.mixMat);
    this.mixScene.add(quad);
    this._usePost = false;
  }

  _bind() {
    window.addEventListener("resize", () => this._onResize());
    this.canvas.addEventListener("pointerdown", (e) => this._onPointerDown(e));
    window.addEventListener("pointermove", (e) => this._onPointerMove(e));
    window.addEventListener("pointerup", (e) => this._onPointerUp(e));
    this.pinLayer.addEventListener("pointerdown", (e) => {
      const btn = e.target.closest("[data-pin]");
      if (!btn) return;
      const id = btn.getAttribute("data-pin");
      if (this.editMode) {
        e.preventDefault();
        e.stopPropagation();
        this._drag = { id, moved: false };
        btn.setPointerCapture?.(e.pointerId);
        this.opts.onPinSelect?.(id);
      }
    });
    this.pinLayer.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-pin]");
      if (!btn) return;
      e.preventDefault();
      const id = btn.getAttribute("data-pin");
      if (!this.editMode) this.opts.onPinSelect?.(id);
    });
  }

  _onResize() {
    const wrap = this.canvas.parentElement;
    const w = Math.max(1, wrap.clientWidth);
    const h = Math.max(1, wrap.clientHeight);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
  }

  setEditMode(on) {
    this.editMode = !!on;
    this.canvas.classList.toggle("is-editing", this.editMode);
    this.pinLayer.classList.toggle("is-editing", this.editMode);
    this._place = null;
  }

  setBlur(on) {
    this.blurEnabled = !!on;
  }

  async load(url) {
    const tok = ++this._loadTok;
    this._clearModel();
    this.opts.onProgress?.(0);
    let gltf;
    try {
      gltf = await new Promise((resolve, reject) => {
        this.loader.load(
          url,
          resolve,
          (ev) => {
            if (ev.total) this.opts.onProgress?.(ev.loaded / ev.total);
          },
          reject,
        );
      });
    } catch (err) {
      if (tok === this._loadTok) this.opts.onError?.(err);
      return;
    }
    if (tok !== this._loadTok) {
      gltf.scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose?.();
      });
      return;
    }

    const scene = gltf.scene || gltf.scenes[0];
    const dump = [];
    scene.traverse((o) => {
      if (o.isLight || o.isCamera) dump.push(o);
    });
    dump.forEach((o) => o.parent?.remove(o));

    this._prepareMaterials(scene);
    this.root.add(scene);
    this._normalize(this.root);

    if (gltf.animations?.length) {
      this.mixer = new THREE.AnimationMixer(scene);
      gltf.animations.forEach((clip) => this.mixer.clipAction(clip).play());
    }

    this._fitCamera();
    this.opts.onProgress?.(1);
    this.opts.onLoad?.({ animations: gltf.animations?.length || 0 });
  }

  _prepareMaterials(scene) {
    scene.traverse((obj) => {
      if (!obj.isMesh || !obj.material) return;
      const list = Array.isArray(obj.material) ? obj.material : [obj.material];
      list.forEach((m) => {
        if (!m || !("metalness" in m)) return;
        if (!m.metalnessMap && m.metalness > 0.25) m.metalness = 0;
      });
    });
  }

  _installFocus(mat) {
    if (!isMeshMat(mat)) return;
    const self = this;
    const prev = mat.onBeforeCompile;
    mat.onBeforeCompile = (shader, renderer) => {
      prev?.(shader, renderer);
      shader.uniforms.uFocusW = { value: self.focusWorld };
      shader.uniforms.uFocusR = { value: self.focusRadius };
      shader.uniforms.uFocusA = { value: 0 };
      shader.vertexShader = shader.vertexShader.replace(
        "#include <common>",
        `#include <common>\n${FOCUS_VERT}`,
      );
      if (shader.vertexShader.includes("#include <displacementmap_vertex>")) {
        shader.vertexShader = shader.vertexShader.replace(
          "#include <displacementmap_vertex>",
          `#include <displacementmap_vertex>\n${FOCUS_VERT_TAIL}`,
        );
      } else {
        shader.vertexShader = shader.vertexShader.replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>\n${FOCUS_VERT_TAIL}`,
        );
      }
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <common>",
        `#include <common>\n${FOCUS_FRAG}`,
      );
      if (shader.fragmentShader.includes("#include <tonemapping_fragment>")) {
        shader.fragmentShader = shader.fragmentShader.replace(
          "#include <tonemapping_fragment>",
          `${FOCUS_FRAG_TAIL}\n#include <tonemapping_fragment>`,
        );
      } else if (shader.fragmentShader.includes("#include <dithering_fragment>")) {
        shader.fragmentShader = shader.fragmentShader.replace(
          "#include <dithering_fragment>",
          `${FOCUS_FRAG_TAIL}\n#include <dithering_fragment>`,
        );
      } else if (shader.fragmentShader.includes("#include <colorspace_fragment>")) {
        shader.fragmentShader = shader.fragmentShader.replace(
          "#include <colorspace_fragment>",
          `#include <colorspace_fragment>\n${FOCUS_FRAG_TAIL}`,
        );
      }
      self._shaderRefs.push(shader);
    };
    mat.needsUpdate = true;
  }

  _normalize(group) {
    this._box.setFromObject(group);
    this._box.getSize(this._size);
    const maxDim = Math.max(this._size.x, this._size.y, this._size.z, 0.001);
    group.scale.multiplyScalar(2.35 / maxDim);
    this._box.setFromObject(group);
    const c = this._box.getCenter(this._v);
    group.position.sub(c);
  }

  _fitCamera() {
    this._box.setFromObject(this.root);
    this._box.getSize(this._size);
    const maxDim = Math.max(this._size.x, this._size.y, this._size.z, 0.8);
    const dist = maxDim * 1.7;
    this.camera.position.set(dist * 0.42, dist * 0.95, dist * 0.55);
    this.camera.near = Math.max(0.02, dist / 80);
    this.camera.far = dist * 20;
    this.camera.updateProjectionMatrix();
    this.controls.target.set(0, 0, 0);
    this.controls.minDistance = maxDim * 0.55;
    this.controls.maxDistance = maxDim * 4.2;
    this.controls.update();
    this._home = {
      pos: this.camera.position.clone(),
      target: this.controls.target.clone(),
    };
    this._homeDist = this.camera.position.distanceTo(this.controls.target);
  }

  resetView() {
    this.clearFocus();
    if (!this._home) return;
    this._startCam(this._home.pos, this._home.target);
  }

  _clearModel() {
    this.mixer?.stopAllAction();
    this.mixer = null;
    this._shaderRefs = [];
    this._origColors.clear();
    this._isolate = null;
    this.focusId = null;
    this.focusTargetAmt = 0;
    this.focusAmount = 0;
    while (this.root.children.length) {
      const child = this.root.children[0];
      child.traverse((o) => {
        if (o.geometry) o.geometry.dispose?.();
        const mats = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : [];
        mats.forEach((m) => {
          m.map?.dispose?.();
          m.dispose?.();
        });
      });
      this.root.remove(child);
    }
  }

  setPins(pins) {
    this.pins = pins || [];
    this._rebuildPinButtons();
    this._resolvePinWorlds();
  }

  _rebuildPinButtons() {
    this.pinLayer.innerHTML = "";
    this.pins.forEach((p) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "lab-pin";
      b.setAttribute("data-pin", p.id);
      b.setAttribute("aria-label", String(p.n));
      b.textContent = String(p.n);
      this.pinLayer.appendChild(b);
    });
  }

  findNamed(name) {
    if (!name) return null;
    const want = String(name).toLowerCase();
    let best = null;
    let bestScore = 999;
    this.root.traverse((o) => {
      if (!o.name) return;
      const n = o.name.toLowerCase();
      let score = 999;
      if (n === want) score = 0;
      else if (n === `${want}_0`) score = 1;
      else if (n.startsWith(`${want}_`) || n.startsWith(`${want}:`)) score = 2;
      else if (want.includes(".") && n.startsWith(want)) score = 3;
      else if (n.includes(want) && want.length >= 5) score = 8;
      if (score < bestScore) {
        bestScore = score;
        best = o;
      }
    });
    return bestScore < 20 ? best : null;
  }

  localOfObject(obj) {
    this._box.setFromObject(obj);
    const world = this._box.getCenter(this._v);
    return this.root.worldToLocal(world.clone());
  }

  resolvePinLocal(pin) {
    if (pin.pinned && pin.position) return new THREE.Vector3().fromArray(pin.position);
    if (pin.target) {
      const obj = this.findNamed(pin.target);
      if (obj) {
        const loc = this.localOfObject(obj);
        if (pin.offset) loc.add(new THREE.Vector3().fromArray(pin.offset));
        return loc;
      }
    }
    if (pin.position) return new THREE.Vector3().fromArray(pin.position);
    return new THREE.Vector3();
  }

  _resolvePinWorlds() {
    this.pinWorld.clear();
    this.pins.forEach((p) => {
      const local = this.resolvePinLocal(p);
      const world = local.clone();
      this.root.localToWorld(world);
      this.pinWorld.set(p.id, { local, world, target: p.target ? this.findNamed(p.target) : null });
    });
  }

  focusPin(id) {
    const rec = this.pinWorld.get(id);
    if (!rec) return;
    this.focusId = id;
    const target = this.controls.target.clone();
    const offset = this.camera.position.clone().sub(target);
    if (offset.lengthSq() < 1e-8) offset.set(0.4, 1, 0.5);
    const dist = (this._homeDist || offset.length()) * 0.75;
    offset.normalize().multiplyScalar(dist);
    this._startCam(target.clone().add(offset), target);
    this._markPins();
  }

  clearFocus() {
    this.focusId = null;
    this.focusTargetAmt = 0;
    this._markPins();
  }

  _setIsolate(obj) {
    this._isolate = obj;
    this.root.traverse((mesh) => {
      if (!mesh.isMesh) return;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      const keep = !obj || this._isIn(mesh, obj);
      mats.forEach((m) => {
        if (!m || !("emissive" in m) && !m.color) return;
        const key = mesh.uuid + (m.uuid || "");
        if (!this._origColors.has(key) && m.color) {
          this._origColors.set(key, {
            color: m.color.clone(),
            emissive: m.emissive ? m.emissive.clone() : null,
            opacity: m.opacity,
            transparent: m.transparent,
          });
        }
        const orig = this._origColors.get(key);
        if (!orig?.color) return;
        if (keep || !obj) {
          m.color.copy(orig.color);
          if (m.emissive && orig.emissive) m.emissive.copy(orig.emissive);
          m.opacity = orig.opacity;
          m.transparent = orig.transparent;
          if (keep && obj) {
            m.emissive?.setHex(0x1a2e22);
          }
        } else {
          m.color.copy(orig.color).multiplyScalar(0.22);
          m.emissive?.setHex(0x000000);
          m.transparent = true;
          m.opacity = 0.32;
        }
        m.needsUpdate = true;
      });
    });
  }

  _isIn(mesh, root) {
    let o = mesh;
    while (o) {
      if (o === root) return true;
      o = o.parent;
    }
    return false;
  }

  _startCam(pos, target) {
    this._camFrom.copy(this.camera.position);
    this._tgtFrom.copy(this.controls.target);
    this._camTo.copy(pos);
    this._tgtTo.copy(target);
    this._camTween = prefersReduce() ? 1 : 0.001;
  }

  _onPointerDown(e) {
    if (!this.editMode) return;
    if (e.button !== 0) return;
    this._place = { x: e.clientX, y: e.clientY, moved: false };
  }

  _onPointerMove(e) {
    if (this._place) {
      const dx = e.clientX - this._place.x;
      const dy = e.clientY - this._place.y;
      if (dx * dx + dy * dy > 25) this._place.moved = true;
    }
    if (!this._drag) return;
    const hit = this._hitModel(e);
    if (!hit) return;
    this._drag.moved = true;
    this.opts.onPinMove?.(this._drag.id, hit);
  }

  _onPointerUp(e) {
    if (this.editMode && this._place && !this._place.moved && !this._drag && e) {
      const hit = this._hitModel(e);
      if (hit) this.opts.onSurfacePlace?.(hit);
    }
    this._place = null;
    this._drag = null;
  }

  _hitModel(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.ndc, this.camera);
    const hits = this.raycaster.intersectObject(this.root, true);
    if (!hits.length) return null;
    return this.root.worldToLocal(hits[0].point.clone());
  }

  screenOf(world) {
    this._v.copy(world).project(this.camera);
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: (this._v.x * 0.5 + 0.5) * rect.width,
      y: (-this._v.y * 0.5 + 0.5) * rect.height,
      z: this._v.z,
      visible: this._v.z < 1 && this._v.z > -1,
    };
  }

  _markPins() {
    this.pinLayer.querySelectorAll("[data-pin]").forEach((el) => {
      el.classList.toggle("is-active", el.getAttribute("data-pin") === this.focusId);
    });
  }

  _updatePins() {
    this.root.updateWorldMatrix(true, true);
    this._resolvePinWorlds();
    this.pins.forEach((p) => {
      const rec = this.pinWorld.get(p.id);
      const el = this.pinLayer.querySelector(`[data-pin="${p.id}"]`);
      if (!rec || !el) return;
      const s = this.screenOf(rec.world);
      if (!s.visible) {
        el.style.display = "none";
        return;
      }
      el.style.display = "grid";
      el.style.left = `${s.x}px`;
      el.style.top = `${s.y}px`;
      el.classList.toggle("is-active", p.id === this.focusId);
    });

    if (this.irisEl) this.irisEl.style.opacity = "0";
    this.opts.onPinsUpdated?.();
  }

  _occluded(world) {
    const cam = this.camera.position;
    const dir = this._v2.copy(world).sub(cam);
    const dist = dir.length();
    dir.normalize();
    this.raycaster.set(cam, dir);
    const hits = this.raycaster.intersectObject(this.root, true);
    if (!hits.length) return false;
    return hits[0].distance + 0.04 < dist;
  }

  _loop() {
    requestAnimationFrame(this._loop);
    const dt = this.clock.getDelta();
    this.mixer?.update(dt);
    this.controls.update();

    if (this._camTween > 0 && this._camTween < 1) {
      this._camTween = Math.min(1, this._camTween + dt * 2.15);
      const k = 1 - (1 - this._camTween) ** 3;
      this.camera.position.lerpVectors(this._camFrom, this._camTo, k);
      this.controls.target.lerpVectors(this._tgtFrom, this._tgtTo, k);
    }

    const toward = this.focusTargetAmt;
    this.focusAmount += (toward - this.focusAmount) * Math.min(1, dt * 5);

    this.renderer.setRenderTarget(null);
    this.renderer.render(this.scene, this.camera);

    this._updatePins();
  }
}
