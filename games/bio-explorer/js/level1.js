/**
 * Bio Explorer Mission 1: Living or Not
 * Script: Opening + 4 Bruner spirals (gut pattern → MRS GREN → tricky cases → why it matters) + recap.
 */
import { bioLabState, resetLivingState, BIO_ASSET_PATHS, pulseSuccessFeedback } from "./bio-state.js?v=cellplant2";
import {
 mountGate,
 mountSpiralMap,
 mountLifeSort,
 mountLifeCompare,
 mountLifeProve,
 mountLifeMrs,
 mountLifeSuspects,
 mountLifeScore,
 mountLifeMars,
 mountLifeStakes,
 badgeHtml,
} from "./bio-activities.js?v=cellplant2";

export const L1_META = {
 objective:
 "By the end of this mission, you'll be able to use MRS GREN to decide whether something is alive, including tricky cases like fire, crystals, viruses, and dormant seeds.",
 bdHook: "A flame, a crystal, a virus, a sleeping cat. Gut checks fail. The checklist is the toolkit.",
 predict: {
 q: "Which of these four is the easiest to call alive, and why might the others fool you?",
 options: [
 "The flame, because it moves and needs food",
 "The sleeping cat is clearly alive; the others copy one or two signs of life without being organisms",
 "Anything that grows is alive, including crystals",
 ],
 ok: 1,
 },
 kidTitle: "Living or Not",
 theme: "signs of life, MRS GREN",
 emoji: "🌱",
 rewardName: "Living Rookie",
 intro:
 "Quick gut check: which of these four things are alive? A flame. It moves, it grows, it needs food. A crystal. It grows too, in its own way. A virus. Doctors fight it like it is alive, but is it, really? And a sleeping cat, not moving a muscle right now, but obviously alive. If your gut answers did not come easily for all four, good. They are not supposed to. By the end of today, you will have an actual toolkit for answering this question properly, for absolutely anything you throw at it.",
 everyday: [
 "A flickering flame that looks busy",
 "A virus doctors treat like an enemy",
 "A sleeping cat that is not moving at all",
 ],
 subTitles: [
 "Four suspects",
 "Sort it yourself",
 "Tree versus rock",
 "Prove the mushroom",
 "MRS GREN",
 "Four tricky cases",
 "The virus on the border",
 "Mars life-detector",
 "Why the line matters",
 "The investigation, solved",
 ],
};

export function runL1Sub(subIndex, api) {
 const { registerTryAgain } = api;
 resetLivingState();
 const runners = [
 sub1_opening,
 sub2_sort,
 sub3_compare,
 sub4_prove,
 sub5_mrs,
 sub6_suspects,
 sub7_score,
 sub8_mars,
 sub9_stakes,
 sub10_closing,
 ];
 const fn = runners[subIndex] || runners[0];
 registerTryAgain(() => {
 api.overlay.innerHTML = "";
 resetLivingState();
 fn(api);
 });
 fn(api);
}

function sub1_opening({ overlay, setCoach, completeSub }) {
 setCoach("Four suspects in the dark. Then start the investigation.");
 mountGate(overlay, {
 scene: "lifeOpen",
 badge: "Opening",
 title: "Living or Not",
 pulse: true,
 status: "Watch the four suspects. Then start the investigation.",
 ready: () => bioLabState.lifeOpenU > 0 || bioLabState.lifeSeen,
 readyText: "The four suspects are on the table.",
 doneLabel: "Start the Investigation →",
 html: `${badgeHtml(BIO_ASSET_PATHS.life, "life")}
 ${n(
 "Quick gut check: which of these four things are alive? A flame. It moves, it grows, it needs food. A crystal. It grows too, in its own way. A virus. Doctors fight it like it is alive, but is it, really? And a sleeping cat, not moving a muscle right now, but obviously alive. If your gut answers did not come easily for all four, good. They are not supposed to.",
 )}`,
 bind(host) {
 const btn = host.querySelector("#tiny-gate-go");
 btn?.addEventListener("click", () => {
 bioLabState.lifeSeen = true;
 });
 window.__arena?.setIntentHandler?.((intent) => {
 if (intent.type !== "CANVAS_TAP") return;
 if (intent.meta?.action === "spot") {
 bioLabState.lifeSpot = Number(intent.meta.i) || 0;
 bioLabState.lifeSeen = true;
 pulseSuccessFeedback(160);
 }
 if (intent.meta?.action === "start") {
 bioLabState.lifeSeen = true;
 pulseSuccessFeedback(200);
 if (btn && !btn.disabled) btn.click();
 }
 });
 },
 onDone: completeSub,
 });
}

function sub2_sort({ overlay, setCoach, completeSub }) {
 setCoach("Sort by gut instinct. Living or non-living. No trick items yet.");
 mountLifeSort(overlay, { onDone: completeSub });
}

function sub3_compare({ overlay, setCoach, completeSub }) {
 setCoach("Tree versus rock, then name the pattern you already used.");
 mountLifeCompare(overlay, { onDone: completeSub });
}

function sub4_prove({ overlay, setCoach, completeSub }) {
 setCoach("Match all seven mushroom clips to unlabeled slots. Do not skip any.");
 mountLifeProve(overlay, { onDone: completeSub });
}

function sub5_mrs({ overlay, setCoach, completeSub }) {
 setCoach("MRS GREN, then a precise definition for every letter.");
 mountLifeMrs(overlay, { onDone: completeSub });
}

function sub6_suspects({ overlay, setCoach, completeSub }) {
 setCoach("Flame, crystal, virus, seed. Run the same checklist on all four. Add water for the seed.");
 mountLifeSuspects(overlay, { onDone: completeSub });
}

function sub7_score({ overlay, setCoach, completeSub }) {
 setCoach("One scorecard, then why viruses sit on the border.");
 mountLifeScore(overlay, { onDone: completeSub });
}

function sub8_mars({ overlay, setCoach, completeSub }) {
 setCoach("Flag three Mars readings. The warmed sample is optional.");
 mountLifeMars(overlay, { onDone: completeSub });
}

function sub9_stakes({ overlay, setCoach, completeSub }) {
 setCoach("Doctors, alien hunts, machines. Then the rule to keep.");
 mountLifeStakes(overlay, { onDone: completeSub });
}

function sub10_closing({ overlay, setCoach, completeSub }) {
 setCoach("Four verdicts, then a recap map of the four spirals.");
 const t0 = Date.now();
 mountGate(overlay, {
 scene: "lifeClose",
 badge: "Closing",
 title: "The investigation, solved",
 html: n(
 "We opened today with four things and a gut feeling. Now you have something much better: an actual, seven-part checklist that biologists genuinely use, that you built and tested yourself, on a mushroom, a flame, a crystal, a virus, a dormant seed, and even a hypothetical patch of Mars. That sleeping cat was never in doubt. But now, neither is anything else.",
 ),
 ready: () => bioLabState.lifeCloseU >= 0.95 || Date.now() - t0 > 8000,
 readyText: "The verdicts are in.",
 doneLabel: "Open the spiral map ▶",
 onDone: () => {
 setCoach("Last screen: a recap map of the four spirals. Tap a number to replay, then Finish Living or Not.");
 mountSpiralMap(overlay, {
 scene: "lifeSpiral",
 title: "Your recap map",
 finishLabel: "Finish Living or Not ▶",
 narration:
 "This last screen is a recap, not a new puzzle. The four numbers are the four loops you already finished. Tap a number (on the canvas or here) to replay a short highlight. When you are ready, tap Finish Living or Not.",
 statusIdle: "Tap a number to replay, or finish now.",
 stops: [
 { n: 1, label: "1: Gut pattern" },
 { n: 2, label: "2: MRS GREN" },
 { n: 3, label: "3: Tricky cases" },
 { n: 4, label: "4: Why it matters" },
 ],
 onDone: completeSub,
 });
 },
 });
}

function n(text) {
 return `<p class="tiny-narration">${text}</p>`;
}
