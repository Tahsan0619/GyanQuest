import { bootGame } from "/engine/js/boot.js";
import { manifest } from "./manifest.js";
import { curriculum } from "./curriculum.js";

function start() {
  bootGame({ manifest, curriculum });
}

if (window.THREE) start();
else {
  const iv = setInterval(() => {
    if (window.THREE) {
      clearInterval(iv);
      start();
    }
  }, 30);
  setTimeout(() => clearInterval(iv), 8000);
}
