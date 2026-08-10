/**
 * Chemistry Lab hub helpers - shared GyanQuest hub + local sub-rail.
 */
export {
 mountMissionHub,
 ensureMissionHubStyles,
 setMissionHubMode,
 missionsFromLevels,
} from "/engine/js/mission-hub.js?v=tier3";

/**
 * Bottom horizontal sub-rail with sequential locks.
 * @param {HTMLElement} host
 * @param {{
 * titles: string[],
 * level: number,
 * sub: number,
 * completed: boolean[][],
 * onJump: (subIndex: number) => void,
 * }} opts
 */
export function mountSubRail(host, opts) {
 const { titles, level, sub, completed, onJump } = opts;
 host.innerHTML = `<div class="chem-sub-rail" role="navigation" aria-label="Mission steps"></div>`;
 const rail = host.querySelector(".chem-sub-rail");
 titles.forEach((title, i) => {
 const done = !!completed?.[level]?.[i];
 const current = i === sub;
 const prevDone = i === 0 || !!completed?.[level]?.[i - 1];
 const unlocked = current || done || prevDone;

 const btn = document.createElement("button");
 btn.type = "button";
 btn.className = `chem-sub-rail__item${current ? " is-current" : ""}${done ? " is-done" : ""}${
 !unlocked ? " is-locked" : ""
 }`;
 btn.disabled = !unlocked;
 btn.title = title;
 btn.setAttribute("aria-label", `Step ${i + 1}: ${title}${unlocked ? "" : " (locked)"}`);
 btn.innerHTML = `
 <span class="chem-sub-rail__n">${i + 1}</span>
 <span class="chem-sub-rail__label">${title}</span>
 ${!unlocked ? `<span class="chem-sub-rail__lock" aria-hidden="true">🔒</span>` : ""}`;
 if (unlocked) {
 btn.onclick = () => onJump(i);
 }
 rail.appendChild(btn);
 });

 const cur = rail.querySelector(".is-current");
 cur?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
}
