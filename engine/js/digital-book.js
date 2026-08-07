/**
 * GyanQuest digital book viewer - cover, spreads, page-turn, glossary terms.
 * Pages are fixed (no scroll). Multi-image figures use an auto/drag carousel.
 */
const BOOK_CSS = "/engine/css/digital-book.css?v=book3";

function ensureBookCss() {
  if (!document.querySelector('link[data-gq-book-css]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = BOOK_CSS;
    link.dataset.gqBookCss = "1";
    document.head.appendChild(link);
  }
  if (!document.querySelector('link[data-gq-book-font]')) {
    const fonts = document.createElement("link");
    fonts.rel = "stylesheet";
    fonts.href =
      "https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap";
    fonts.dataset.gqBookFont = "1";
    document.head.appendChild(fonts);
  }
}

function escapeHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Wrap glossary terms in html text with clickable marks. */
export function linkTerms(html, glossary = []) {
  let out = String(html || "");
  const terms = [...glossary].sort((a, b) => String(b.term).length - String(a.term).length);
  for (const g of terms) {
    const term = g.term;
    if (!term) continue;
    const id = g.id || term.toLowerCase().replace(/\s+/g, "-");
    const re = new RegExp(`\\b(${escapeRegExp(term)})\\b`, "gi");
    out = out.replace(re, (m) => {
      if (m.includes("data-book-term")) return m;
      return `<button type="button" class="gq-book-term" data-book-term="${escapeHtml(id)}" data-book-term-label="${escapeHtml(term)}" title="Click for details">${m}</button>`;
    });
  }
  return out;
}

function escapeRegExp(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Normalize a figure entry into a list of slides. */
function figSlides(fig) {
  if (!fig) return [];
  if (Array.isArray(fig.slides) && fig.slides.length) {
    return fig.slides.map((s) => ({
      src: s.src || fig.src,
      caption: s.caption || fig.caption || "",
      alt: s.alt || s.caption || fig.alt || "",
    })).filter((s) => s.src);
  }
  if (fig.src) {
    return [{ src: fig.src, caption: fig.caption || "", alt: fig.alt || fig.caption || "" }];
  }
  return [];
}

function figHtml(fig) {
  const slides = figSlides(fig);
  if (!slides.length) return "";
  const place = fig.place || "top";
  if (slides.length === 1) {
    const s = slides[0];
    return `<figure class="gq-book-fig gq-book-fig--${escapeHtml(place)}">
    <img src="${escapeHtml(s.src)}" alt="${escapeHtml(s.alt || "Book figure")}" draggable="false" />
    ${s.caption ? `<figcaption>${escapeHtml(s.caption)}</figcaption>` : ""}
  </figure>`;
  }
  const slidesHtml = slides
    .map(
      (s, i) => `<div class="gq-book-carousel__slide${i === 0 ? " is-active" : ""}" data-slide="${i}">
        <img src="${escapeHtml(s.src)}" alt="${escapeHtml(s.alt || "Book figure")}" draggable="false" />
        ${s.caption ? `<figcaption>${escapeHtml(s.caption)}</figcaption>` : ""}
      </div>`,
    )
    .join("");
  const dots = slides
    .map((_, i) => `<button type="button" class="gq-book-carousel__dot${i === 0 ? " is-active" : ""}" data-dot="${i}" aria-label="Slide ${i + 1}"></button>`)
    .join("");
  return `<figure class="gq-book-fig gq-book-fig--${escapeHtml(place)} gq-book-fig--carousel" data-gq-carousel>
    <div class="gq-book-carousel" tabindex="0" role="group" aria-roledescription="carousel" aria-label="Photo carousel">
      <div class="gq-book-carousel__track">${slidesHtml}</div>
      <div class="gq-book-carousel__dots">${dots}</div>
      <p class="gq-book-carousel__hint">Drag to flip photos</p>
    </div>
  </figure>`;
}

function pageInner(page, glossary) {
  const layout = page.layout || "text";
  const figs = page.figures || [];
  const title = page.title ? `<h3 class="gq-book-page__title">${escapeHtml(page.title)}</h3>` : "";
  let body = "";
  if (Array.isArray(page.blocks)) {
    body = page.blocks
      .map((b) => {
        if (typeof b === "string") return `<p>${linkTerms(b, glossary)}</p>`;
        if (b.type === "p") return `<p>${linkTerms(b.html || b.text || "", glossary)}</p>`;
        if (b.type === "h") return `<h4>${escapeHtml(b.text || "")}</h4>`;
        if (b.type === "ul") {
          const items = (b.items || []).map((it) => `<li>${linkTerms(it, glossary)}</li>`).join("");
          return `<ul>${items}</ul>`;
        }
        if (b.type === "fig") return figHtml(b);
        return "";
      })
      .join("");
  } else {
    body = `<div class="gq-book-page__html">${linkTerms(page.html || "", glossary)}</div>`;
  }

  const topFigs = figs.filter((f) => (f.place || "top") === "top").map(figHtml).join("");
  const fullFigs = figs.filter((f) => f.place === "full").map(figHtml).join("");
  const leftFigs = figs.filter((f) => f.place === "left").map(figHtml).join("");
  const rightFigs = figs.filter((f) => f.place === "right").map(figHtml).join("");
  const bottomFigs = figs.filter((f) => f.place === "bottom").map(figHtml).join("");

  if (layout === "full-fig" && fullFigs) {
    return `<div class="gq-book-page__stack">${title}<div class="gq-book-page__visual">${fullFigs}</div><div class="gq-book-page__copy">${body}</div></div>`;
  }
  if (layout === "split" || leftFigs || rightFigs) {
    return `<div class="gq-book-page__stack">${title}${topFigs}
      <div class="gq-book-split">
        <div class="gq-book-split__col gq-book-split__col--copy">${leftFigs || ""}${layout === "split" ? body : ""}</div>
        <div class="gq-book-split__col gq-book-split__col--visual">${rightFigs || ""}${layout === "split" ? "" : body}</div>
      </div>
      ${layout === "split" ? "" : `<div class="gq-book-page__copy">${body}</div>`}${bottomFigs}</div>`;
  }
  return `<div class="gq-book-page__stack">${title}${topFigs}<div class="gq-book-page__copy">${body}</div>${bottomFigs}${fullFigs}</div>`;
}

function mountCarousels(scope) {
  scope.querySelectorAll("[data-gq-carousel]").forEach((host) => {
    const track = host.querySelector(".gq-book-carousel");
    const slides = [...host.querySelectorAll(".gq-book-carousel__slide")];
    const dots = [...host.querySelectorAll(".gq-book-carousel__dot")];
    if (slides.length < 2) return;

    let idx = 0;
    let timer = null;
    let dragging = false;
    let startX = 0;
    let deltaX = 0;

    const paint = () => {
      slides.forEach((el, i) => el.classList.toggle("is-active", i === idx));
      dots.forEach((el, i) => el.classList.toggle("is-active", i === idx));
    };

    const go = (n) => {
      idx = ((n % slides.length) + slides.length) % slides.length;
      paint();
    };

    const stop = () => {
      if (timer) clearInterval(timer);
      timer = null;
    };

    const start = () => {
      stop();
      timer = setInterval(() => go(idx + 1), 1000);
    };

    dots.forEach((dot) => {
      dot.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        go(Number(dot.getAttribute("data-dot")) || 0);
        start();
      });
    });

    const onDown = (clientX) => {
      dragging = true;
      startX = clientX;
      deltaX = 0;
      stop();
      track.classList.add("is-dragging");
    };
    const onMove = (clientX) => {
      if (!dragging) return;
      deltaX = clientX - startX;
    };
    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      track.classList.remove("is-dragging");
      if (Math.abs(deltaX) > 36) go(idx + (deltaX < 0 ? 1 : -1));
      start();
    };

    track.addEventListener("pointerdown", (e) => {
      if (e.button != null && e.button !== 0) return;
      onDown(e.clientX);
      track.setPointerCapture?.(e.pointerId);
    });
    track.addEventListener("pointermove", (e) => onMove(e.clientX));
    track.addEventListener("pointerup", onUp);
    track.addEventListener("pointercancel", onUp);
    track.addEventListener("pointerleave", () => {
      if (dragging) onUp();
    });

    host.addEventListener("mouseenter", stop);
    host.addEventListener("mouseleave", () => {
      if (!dragging) start();
    });

    paint();
    start();
  });
}

/**
 * Open digital book overlay.
 * @param {{ book: object, onTerm?: (term: string, meta: object) => void, onClose?: () => void }} opts
 */
export function openDigitalBook(opts) {
  ensureBookCss();
  const book = opts.book;
  if (!book) return;

  dismissDigitalBook();

  const root = document.createElement("div");
  root.id = "gq-digital-book-root";
  root.className = "gq-book-root";
  root.setAttribute("role", "dialog");
  root.setAttribute("aria-modal", "true");
  root.setAttribute("aria-label", book.title || "Mission book");

  const pages = Array.isArray(book.pages) ? book.pages : [];

  let mode = "cover";
  let pageIndex = 0;

  root.innerHTML = `
    <div class="gq-book-backdrop" data-gq-book-close></div>
    <div class="gq-book-stage">
      <button type="button" class="gq-book-close" data-gq-book-close aria-label="Close">Close</button>
      <div class="gq-book-shell" id="gq-book-shell">
        <div class="gq-book-cover" id="gq-book-cover">
          <div class="gq-book-cover__art">${book.cover?.art ? `<img src="${escapeHtml(book.cover.art)}" alt="" />` : ""}</div>
          <div class="gq-book-cover__meta">
            <p class="gq-book-cover__eyebrow">${escapeHtml(book.subtitle || "Mission book")}</p>
            <h2 class="gq-book-cover__title">${escapeHtml(book.cover?.title || book.title || "Book")}</h2>
            <p class="gq-book-cover__hint">Tap the cover to open</p>
          </div>
        </div>
        <div class="gq-book-spread hidden" id="gq-book-spread">
          <div class="gq-book-spine" aria-hidden="true"></div>
          <div class="gq-book-page gq-book-page--left" id="gq-book-left"></div>
          <div class="gq-book-page gq-book-page--right" id="gq-book-right"></div>
          <div class="gq-book-flip" id="gq-book-flip" aria-hidden="true"></div>
        </div>
      </div>
      <div class="gq-book-nav">
        <button type="button" class="gq-book-nav__btn" id="gq-book-prev">Prev</button>
        <span class="gq-book-nav__label" id="gq-book-label">Cover</span>
        <button type="button" class="gq-book-nav__btn" id="gq-book-next">Next</button>
      </div>
    </div>`;

  document.body.appendChild(root);
  document.body.classList.add("gq-book-open");

  const coverEl = root.querySelector("#gq-book-cover");
  const spreadEl = root.querySelector("#gq-book-spread");
  const leftEl = root.querySelector("#gq-book-left");
  const rightEl = root.querySelector("#gq-book-right");
  const flipEl = root.querySelector("#gq-book-flip");
  const labelEl = root.querySelector("#gq-book-label");
  const prevBtn = root.querySelector("#gq-book-prev");
  const nextBtn = root.querySelector("#gq-book-next");
  const shell = root.querySelector("#gq-book-shell");

  function bindTerms(scope) {
    scope.querySelectorAll("[data-book-term]").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const term = el.getAttribute("data-book-term-label") || el.textContent || "";
        opts.onTerm?.(term, {
          id: el.getAttribute("data-book-term"),
          subject: book.subject || book.title,
          bookTitle: book.title,
        });
      });
    });
  }

  function renderSpread() {
    const left = pages[pageIndex];
    const right = pages[pageIndex + 1];
    leftEl.innerHTML = left
      ? `<div class="gq-book-page__inner">${pageInner(left, book.glossary)}</div><span class="gq-book-page__num">${pageIndex + 1}</span>`
      : `<div class="gq-book-page__inner gq-book-page__inner--blank"></div>`;
    rightEl.innerHTML = right
      ? `<div class="gq-book-page__inner">${pageInner(right, book.glossary)}</div><span class="gq-book-page__num">${pageIndex + 2}</span>`
      : `<div class="gq-book-page__inner gq-book-page__inner--blank"><p class="gq-book-end">The End</p></div>`;
    bindTerms(leftEl);
    bindTerms(rightEl);
    mountCarousels(leftEl);
    mountCarousels(rightEl);
    const end = Math.min(pageIndex + 2, pages.length);
    labelEl.textContent = `Pages ${pageIndex + 1}-${end} of ${pages.length}`;
  }

  function showCover() {
    mode = "cover";
    pageIndex = 0;
    coverEl.classList.remove("hidden", "gq-book-cover--opening");
    spreadEl.classList.add("hidden");
    shell.classList.remove("gq-book-shell--open");
    labelEl.textContent = "Cover - tap to open";
    prevBtn.disabled = true;
    nextBtn.disabled = false;
    nextBtn.textContent = "Open";
  }

  function openFromCover() {
    mode = "open";
    coverEl.classList.add("gq-book-cover--opening");
    setTimeout(() => {
      coverEl.classList.add("hidden");
      spreadEl.classList.remove("hidden");
      shell.classList.add("gq-book-shell--open");
      pageIndex = 0;
      renderSpread();
      nextBtn.textContent = "Next";
      prevBtn.disabled = false;
    }, 520);
  }

  function animateFlip(dir, then) {
    flipEl.className = `gq-book-flip gq-book-flip--${dir}`;
    requestAnimationFrame(() => flipEl.classList.add("gq-book-flip--run"));
    setTimeout(() => {
      flipEl.className = "gq-book-flip";
      then?.();
    }, 480);
  }

  function goNext() {
    if (mode === "cover") {
      openFromCover();
      return;
    }
    if (mode === "closing") {
      dismissDigitalBook();
      opts.onClose?.();
      return;
    }
    if (pageIndex + 2 >= pages.length) {
      mode = "closing";
      animateFlip("close", () => {
        spreadEl.classList.add("gq-book-spread--closing");
        labelEl.textContent = "Closing book...";
        nextBtn.textContent = "Close";
        setTimeout(() => {
          dismissDigitalBook();
          opts.onClose?.();
        }, 700);
      });
      return;
    }
    animateFlip("next", () => {
      pageIndex += 2;
      renderSpread();
    });
  }

  function goPrev() {
    if (mode === "cover") return;
    if (pageIndex <= 0) {
      showCover();
      return;
    }
    animateFlip("prev", () => {
      pageIndex = Math.max(0, pageIndex - 2);
      mode = "open";
      renderSpread();
      nextBtn.textContent = "Next";
    });
  }

  coverEl.addEventListener("click", () => {
    if (mode === "cover") openFromCover();
  });
  prevBtn.addEventListener("click", goPrev);
  nextBtn.addEventListener("click", goNext);
  root.querySelectorAll("[data-gq-book-close]").forEach((el) => {
    el.addEventListener("click", () => {
      dismissDigitalBook();
      opts.onClose?.();
    });
  });

  showCover();
}

export function dismissDigitalBook() {
  document.getElementById("gq-digital-book-root")?.remove();
  document.body.classList.remove("gq-book-open");
}
