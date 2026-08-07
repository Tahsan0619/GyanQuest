/**
 * Global book unlock flag (landing page toggle).
 * localStorage key: gq-unlock-all-books
 */
export const UNLOCK_ALL_BOOKS_KEY = "gq-unlock-all-books";

export function areAllBooksUnlocked() {
  try {
    if (localStorage.getItem(UNLOCK_ALL_BOOKS_KEY) === "1") return true;
  } catch {
    /* ignore */
  }
  try {
    const u = new URL(location.href);
    if (u.searchParams.get("unlockBooks") === "1") return true;
  } catch {
    /* ignore */
  }
  return false;
}

export function setAllBooksUnlocked(on) {
  try {
    localStorage.setItem(UNLOCK_ALL_BOOKS_KEY, on ? "1" : "0");
  } catch {
    /* ignore */
  }
  try {
    window.dispatchEvent(
      new CustomEvent("gq-unlock-all-books", { detail: { unlocked: !!on } }),
    );
  } catch {
    /* ignore */
  }
}

/** Call once on game boot so ?unlockBooks=1 from landing sticks in localStorage. */
export function syncUnlockFlagFromUrl() {
  try {
    const u = new URL(location.href);
    const v = u.searchParams.get("unlockBooks");
    if (v === "1") setAllBooksUnlocked(true);
    if (v === "0") setAllBooksUnlocked(false);
  } catch {
    /* ignore */
  }
}
