import { openDigitalBook } from "/engine/js/digital-book.js?v=book7";
import { mountBookChat, openBookChat } from "/engine/js/book-chat.js?v=chatfix2";
import {
 areAllBooksUnlocked,
 syncUnlockFlagFromUrl,
} from "/engine/js/book-unlock.js?v=unlock2";

/**
 * @param {{
 * subject: string,
 * getBook: (missionIndex: number) => object|null|undefined,
 * showToast?: (msg: string) => void,
 * getLevel?: () => number,
 * }} opts
 */
export function setupMissionBooks(opts) {
 const subject = opts.subject || "GyanQuest";
 syncUnlockFlagFromUrl();
 mountBookChat({ subject });

 return {
 onBookClick(missionIndex, meta = {}) {
 const unlocked = !!meta.unlocked || areAllBooksUnlocked();
 if (!unlocked) {
 opts.showToast?.(
 "Book locked. Turn on Unlock books on the GyanQuest home page, or finish this mission's 10 steps.",
 );
 return;
 }
 const book = opts.getBook?.(missionIndex);
 if (!book) {
 opts.showToast?.("Book coming soon for this mission.");
 return;
 }
 openDigitalBook({
 book: { ...book, subject: book.subject || subject },
 onTerm: (term, info) => {
 // Features 2+6: same book-chat path with build-then-reveal + tiering.
 openBookChat({
 term,
 subject: info?.subject || book.subject || subject,
 buildThenReveal: true,
 tiered: true,
 bookFigure: book.cover?.art || null,
 level: typeof opts.getLevel === "function" ? opts.getLevel() : missionIndex,
 });
 },
 });
 },
 };
}
