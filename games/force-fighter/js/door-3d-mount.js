/**
 * CSS 3D push/pull door overlay for Mission 3 Step 1.
 * Hinge left: push = rotateY(-115deg) into room, pull = rotateY(75deg) toward you.
 */
const ROOT_ID = "door-3d-root";

export function mountDoor3D(viewport, onAction, opts = {}) {
 if (!viewport) return () => {};
 let root = document.getElementById(ROOT_ID);
 if (root) return () => unmountDoor3D(viewport);

 root = document.createElement("div");
 root.id = ROOT_ID;
 root.className = "door-3d-root";
 root.innerHTML = `
 <p class="door-3d-banner" id="door-3d-banner">To open this door, do you push it, or pull it?</p>
 <div class="door-3d-scene" aria-hidden="true">
 <div class="door-3d-frame">
 <div class="door-3d-way">
 <div class="door-3d-leaf" id="door-3d-leaf">
 <div class="door-3d-handle"></div>
 </div>
 </div>
 </div>
 </div>
 <p class="door-3d-caption" id="door-3d-caption" aria-live="polite"></p>
 <div class="door-3d-controls">
 <button type="button" class="door-3d-btn door-3d-btn--push" id="door-3d-push">Push It</button>
 <button type="button" class="door-3d-btn door-3d-btn--pull" id="door-3d-pull">Pull It</button>
 </div>`;

 viewport.appendChild(root);
 viewport.classList.add("viewport--door3d");

 if (opts.hideControls) root.querySelector(".door-3d-controls")?.remove();

 root.querySelector("#door-3d-push")?.addEventListener("click", () => onAction?.("push"));
 root.querySelector("#door-3d-pull")?.addEventListener("click", () => onAction?.("pull"));

 return () => unmountDoor3D(viewport);
}

export function syncDoor3D(mode, opts = {}) {
 const door = document.getElementById("door-3d-leaf");
 const banner = document.getElementById("door-3d-banner");
 const pushBtn = document.getElementById("door-3d-push");
 const pullBtn = document.getElementById("door-3d-pull");
 if (!door) return;

 const next = mode === "push" ? "push" : mode === "pull" ? "pull" : "";
 if (next !== door.dataset.mode) {
 door.classList.remove("push", "pull");
 door.dataset.mode = next;
 if (next) {
 void door.offsetWidth;
 door.classList.add(next);
 }
 }

 if (banner) {
 if (mode === "push") banner.textContent = "You pushed. The door swung away from you.";
 else if (mode === "pull") banner.textContent = "You pulled. The door swung toward you.";
 else banner.textContent = opts.banner || "To open this door, do you push it, or pull it?";
 }

 pushBtn?.classList.toggle("is-lit", mode === "push");
 pullBtn?.classList.toggle("is-lit", mode === "pull");

 const caption = document.getElementById("door-3d-caption");
 if (caption && opts.caption != null) caption.textContent = opts.caption;
}

export function unmountDoor3D(viewport) {
 document.getElementById(ROOT_ID)?.remove();
 viewport?.classList.remove("viewport--door3d");
}
