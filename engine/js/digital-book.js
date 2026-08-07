/**
 * GyanQuest digital book viewer - cover, spreads, page-turn, glossary terms.
 */
const BOOK_CSS = "/engine/css/digital-book.css?v=book1";

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

function figHtml(fig) {
  if (!fig?.src) return "";
  const place = fig.place || "top";
  return `<figure class="gq-book-fig gq-book-fig--${escapeHtml(place)}">
    <img src="${escapeHtml(fig.src)}" alt="${escapeHtml(fig.alt || fig.caption || "Book figure")}" />
    ${fig.caption ? `<figcaption>${escapeHtml(fig.caption)}</figcaption>` : ""}
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
    return `${title}${fullFigs}${body}`;
  }
  if (layout === "split" || leftFigs || rightFigs) {
    return `${title}${topFigs}
      <div class="gq-book-split">
        <div class="gq-book-split__col">${leftFigs || ""}${layout === "split" ? body : ""}</div>
        <div class="gq-book-split__col">${rightFigs || ""}${layout === "split" ? "" : body}</div>
      </div>
      ${layout === "split" ? "" : body}${bottomFigs}`;
  }
  return `${title}${topFigs}${body}${bottomFigs}${fullFigs}`;
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
  // Spreads: cover alone, then pairs of pages, then close
  // Index: -1 = cover, 0..n-1 = page index of left page of spread (even), closing

  let mode = "cover"; // cover | open | closing
  let pageIndex = 0; // left page index when open

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
