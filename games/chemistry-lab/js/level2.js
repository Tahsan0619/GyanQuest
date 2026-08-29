/**
 * Chemistry Lab Mission 2: Element Hunt
 * Script: Opening + 4 Bruner spirals (identity → orbits → orbitals → personality) + recap map.
 * Packed into the shared 10-step mission engine (N_SUBS = 10).
 */
import { chemLabState, resetElementHuntState } from "./atom-scenes.js?v=bondbuddy1";
import { ELEM_ASSET_PATHS } from "./element-scenes.js?v=bondbuddy1";
import {
 mountGate,
 mountQuiz,
 mountSpiralMap,
 mountHuntProtonCounter,
 mountFamilyExplorer,
 mountShellFill,
 mountSnapshots,
 mountOrbitalGallery,
 mountBuildupScrub,
 mountInspector,
 badgeHtml,
} from "./chem-activities.js?v=bondbuddy1";

export const L2_META = {
 objective:
 "By the end of this mission, you'll be able to say what makes an element an element, where electrons actually live, and why some elements react while others sit quietly.",
 bdHook: "Start with 118 unlabeled squares, then go inside an atom and read the map.",
 predict: {
 q: "Before we start: what do you think actually makes one element different from another?",
 options: [
 "How heavy it feels in your hand",
 "Its number of protons",
 "Whether it is a metal or a gas",
 ],
 ok: 1,
 },
 kidTitle: "Element Hunt",
 theme: "elements, orbits & orbital shapes",
 emoji: "🔎",
 rewardName: "Element Scout",
 intro:
 "Every material in the universe is spelled out using an alphabet with only 118 letters. Chemists call them elements. Today we hunt what makes one element different from another, then go inside an atom to find where its electrons live, and why that space comes in such bizarre shapes.",
 everyday: [
 "118 unlabeled glowing squares, waiting to become a map",
 "A proton count that names the element",
 "Fuzzy orbital rooms instead of planet-like tracks",
 ],
 subTitles: [
 "The wall of doors",
 "Proton Counter",
 "Family map",
 "Carbon's ID",
 "Fill the shells",
 "Orbit to orbital",
 "Shape gallery",
 "Fill order",
 "Element personalities",
 "The map comes together",
 ],
};

export function runL2Sub(subIndex, api) {
 const { registerTryAgain } = api;
 resetElementHuntState();

 const runners = [
 sub1_opening,
 sub2_protons,
 sub3_families,
 sub4_carbon,
 sub5_shells,
 sub6_cloud,
 sub7_orbitals,
 sub8_buildup,
 sub9_moods,
 sub10_closing,
 ];
 const fn = runners[subIndex] || runners[0];
 registerTryAgain(() => {
 api.overlay.innerHTML = "";
 resetElementHuntState();
 fn(api);
 });
 fn(api);
}

function sub1_opening({ overlay, setCoach, completeSub }) {
 setCoach("Every material is spelled with 118 letters. Tap Begin on the glowing wall.");
 mountGate(overlay, {
 scene: "elemOpen",
 badge: "Opening",
 title: "Element Hunt",
 pulse: true,
 ready: () => chemLabState.huntBegin,
 readyText: "The hunt is open.",
 doneLabel: "Start hunting ▶",
 html: `${badgeHtml(ELEM_ASSET_PATHS.hunt, "hunt")}
 ${n(
 "Every material in the universe (every rock, every star, every breath you take) is spelled out using an alphabet with only 118 letters. Chemists call them elements. Today we're going on an element hunt: we'll figure out what makes one element different from another, and then we're going to do something most people never get to do: actually go inside an atom and find out exactly where its electrons live, and why the space they live in comes in such bizarre shapes. Let's start hunting.",
 )}`,
 bind() {
 const arena = window.__arena;
 arena?.setIntentHandler?.((intent) => {
 if (intent.type === "CANVAS_TAP" && intent.meta?.action === "begin") {
 chemLabState.huntBegin = true;
 const btn = document.getElementById("tiny-gate-go");
 if (btn) {
 btn.disabled = false;
 btn.click();
 }
 }
 });
 },
 onDone: completeSub,
 });
}

function sub2_protons({ overlay, setCoach, completeSub }) {
 setCoach("Drag protons into the nucleus. Watch the element name change.");
 mountHuntProtonCounter(overlay, { onDone: completeSub });
}

function sub3_families({ overlay, setCoach, completeSub }) {
 setCoach("The unlabeled wall locks into the real table. Tap each colored family.");
 mountFamilyExplorer(overlay, { onDone: completeSub });
}

function sub4_carbon({ overlay, setCoach, completeSub }) {
 setCoach("Carbon's box is a real periodic-table entry. Then a quick check.");
 mountGate(overlay, {
 scene: "elemCarbon",
 badge: "Spiral 1: Symbolic",
 title: "Atomic number, symbol, period, group",
 html: n(
 "Every element has an atomic number (its proton count), a one- or two-letter symbol, a period (its row), and a group (its column). This isn't trivia. Period and group numbers are actually a preview of exactly how that element's electrons are arranged, which is exactly what we're hunting for next.",
 ),
 onDone: () => {
 mountQuiz(overlay, {
 scene: "elemCarbon",
 title: "Quick check",
 q: "If an atom has 11 protons, what element is it, and roughly where would you expect to find it on the table?",
 opts: [
 "Sodium, left side, Period 3",
 "Carbon, Period 2",
 "Neon, right side, Period 2",
 "Chlorine, Period 3, right side",
 ],
 ok: 0,
 success: "Sodium, left side, Period 3.",
 fail: "Count the protons. 11 is Sodium, on the left of Period 3.",
 onDone: completeSub,
 });
 },
 });
}

function sub5_shells({ overlay, setCoach, completeSub }) {
 setCoach("Fill Sodium's three rings: 2, then 8, then 1. A full ring bounces extras off.");
 mountShellFill(overlay, { onDone: completeSub });
}

function sub6_cloud({ overlay, setCoach, completeSub }) {
 setCoach("Watch the rings smear into a cloud, then stack snapshots until the cloud returns.");
 mountSnapshots(overlay, { onDone: completeSub });
}

function sub7_orbitals({ overlay, setCoach, completeSub }) {
 setCoach("Rotate s, p, and d. Auto-rotate is there if you don't want to drag. f is optional.");
 mountOrbitalGallery(overlay, { onDone: completeSub });
}

function sub8_buildup({ overlay, setCoach, completeSub }) {
 setCoach("Electrons fill 1s, then 2s, 2p, 3s, 3p, 4s, 3d, up through iron. Scrub if you want.");
 mountBuildupScrub(overlay, { onDone: completeSub });
}

function sub9_moods({ overlay, setCoach, completeSub }) {
 setCoach("Tap any element: the table blurs, a red cross marks it. Hit Neon, Sodium, and Chlorine.");
 mountInspector(overlay, { onDone: completeSub });
}

function sub10_closing({ overlay, setCoach, completeSub }) {
 setCoach("The unlabeled wall is a map you can read. Then open the recap.");
 chemLabState.scale = 0;
 const t0 = Date.now();
 mountGate(overlay, {
 scene: "elemClose",
 badge: "Closing",
 title: "The map comes together",
 html: n(
 "You started this hunt looking at 118 unlabeled glowing squares. Now you know what actually separates one from another: proton count. You know electrons don't really orbit like planets, but live in fuzzy, probability-shaped regions called orbitals: spheres, dumbbells, clovers, and beyond. And you know that an element's entire personality (calm or reactive, generous or greedy with its electrons) comes down to how full its outermost orbital happens to be. That's not a random chart on a classroom wall anymore. That's a map you can actually read.",
 ),
 ready: () => chemLabState.scale >= 0.95 || Date.now() - t0 > 9000,
 readyText: "The table is labeled.",
 doneLabel: "Open the spiral map ▶",
 onDone: () => {
 setCoach("Last screen: a recap map of the four spirals. Tap a number to replay, then Finish Element Hunt.");
 mountSpiralMap(overlay, {
 scene: "elemSpiral",
 title: "Your recap map",
 finishLabel: "Finish Element Hunt ▶",
 narration:
 "This last screen is a recap, not a new puzzle. The four numbers are the four loops you already finished. Tap a number (on the canvas or here) to replay a short highlight. When you are ready, tap Finish Element Hunt.",
 statusIdle: "Tap a number to replay, or finish now.",
 stops: [
 { n: 1, label: "1: Identity" },
 { n: 2, label: "2: Clouds" },
 { n: 3, label: "3: Shapes" },
 { n: 4, label: "4: Moods" },
 ],
 onDone: completeSub,
 });
 },
 });
}

function n(text) {
 return `<p class="tiny-narration">${text}</p>`;
}
