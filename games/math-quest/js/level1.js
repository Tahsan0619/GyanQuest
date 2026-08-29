/**
 * Math Quest Mission 1: Number Sense
 * Script: Opening + 4 Bruner spirals (what a number is → bundle by tens → place value → why it matters) + recap.
 */
import { labState, resetNumberState, LAB_ASSET_PATHS, pulseSuccessFeedback } from "./lab-state.js?v=numbersense1";
import { mountGate, mountSpiralMap, badgeHtml } from "./lab-activities.js?v=numbersense1";
import {
 mountNumCount,
 mountNumAmount,
 mountNumBundle,
 mountNumGroups,
 mountNumBuild,
 mountNumPlace,
 mountNumCompare,
 mountNumRoll,
} from "./num-activities.js?v=numbersense1";

export const L1_META = {
 objective:
 "By the end of this mission, you'll be able to say what a number is, why we bundle in tens, and how place value makes 47 mean 4 tens and 7 ones.",
 bdHook: "A messy pile of dots versus the numeral 47. The hidden logic is grouping by tens.",
 predict: {
 q: "When you see 47, what is that 4 actually doing?",
 options: [
 "It means 4, same as if it sat alone",
 "It means 4 groups of ten",
 "It is only decoration next to the 7",
 ],
 ok: 1,
 },
 kidTitle: "Number Sense",
 theme: "counting, grouping, and place value",
 emoji: "🔢",
 rewardName: "Number Scout",
 intro:
 "Quick challenge: how many dots are on this screen? Frustrating, right? Somewhere around the third or fourth time you lost your place, you probably wanted to give up. And yet, put a number like 47 in front of you instead, and you'd know exactly how many that is, instantly, with zero counting at all. Something incredibly clever is hiding inside that number, a system so good most people never even notice it's there. Let's go find it.",
 everyday: [
 "A messy pile that is hard to count",
 "Bundles of ten that you can trust at a glance",
 "The numeral 47 quietly meaning 4 tens and 7 ones",
 ],
 subTitles: [
 "Find the system",
 "Count them yourself",
 "Number vs numeral",
 "Slow way vs bundles",
 "Why we group in tens",
 "Build 47",
 "Place value",
 "Which has more?",
 "Rollover and base 10",
 "The trick was there all along",
 ],
};

export function runL1Sub(subIndex, api) {
 const { registerTryAgain } = api;
 resetNumberState();
 const runners = [
 sub1_opening,
 sub2_count,
 sub3_amount,
 sub4_bundle,
 sub5_groups,
 sub6_build,
 sub7_place,
 sub8_compare,
 sub9_roll,
 sub10_closing,
 ];
 const fn = runners[subIndex] || runners[0];
 registerTryAgain(() => {
 api.overlay.innerHTML = "";
 resetNumberState();
 fn(api);
 });
 fn(api);
}

function sub1_opening({ overlay, setCoach, completeSub }) {
 setCoach("A messy pile of dots. Then find the system hiding in 47.");
 mountGate(overlay, {
 scene: "numOpen",
 badge: "Opening",
 title: "Number Sense",
 pulse: true,
 status: "Watch the pile. Then find the system.",
 ready: () => labState.numOpenU >= 0.4 || labState.numSeen,
 readyText: "A number like 47 hides a system so good most people never notice it.",
 doneLabel: "Find the System →",
 html: `${badgeHtml(LAB_ASSET_PATHS.m1, "number sense")}
 ${n(
 "Quick challenge: how many dots are on this screen? Go ahead, try to count them. Frustrating, right? Somewhere around the third or fourth time you lost your place, you probably wanted to give up. And yet, put a number like 47 in front of you instead, and you'd know exactly how many that is, instantly, with zero counting at all. Something incredibly clever is hiding inside that number. Let's go find it.",
 )}`,
 bind(host) {
 const btn = host.querySelector("#tiny-gate-go");
 btn?.addEventListener("click", () => {
 labState.numSeen = true;
 });
 window.__arena?.setIntentHandler?.((intent) => {
 if (intent.type !== "CANVAS_TAP") return;
 if (intent.meta?.action === "find") {
 if (!(labState.numOpenU >= 0.4 || labState.numSeen)) return;
 labState.numSeen = true;
 pulseSuccessFeedback(200);
 if (btn && !btn.disabled) btn.click();
 }
 });
 },
 onDone: completeSub,
 });
}

function sub2_count({ overlay, setCoach, completeSub }) {
 setCoach("Tap all 8 apples. Each one only counts once.");
 mountNumCount(overlay, { onDone: completeSub });
}

function sub3_amount({ overlay, setCoach, completeSub }) {
 setCoach("Same amount, different things. Then number vs numeral.");
 mountNumAmount(overlay, { onDone: completeSub });
}

function sub4_bundle({ overlay, setCoach, completeSub }) {
 setCoach("Count one by one first. Then bundle tens. Do not skip the slow way.");
 mountNumBundle(overlay, { onDone: completeSub });
}

function sub5_groups({ overlay, setCoach, completeSub }) {
 setCoach("Messy pile versus groups of ten, then the grouping words.");
 mountNumGroups(overlay, { onDone: completeSub });
}

function sub6_build({ overlay, setCoach, completeSub }) {
 setCoach("Build 47: exactly 4 tens and 7 ones. Do not skip the workbench.");
 mountNumBuild(overlay, { onDone: completeSub });
}

function sub7_place({ overlay, setCoach, completeSub }) {
 setCoach("Every two-digit number, then place value and expanded form.");
 mountNumPlace(overlay, { onDone: completeSub });
}

function sub8_compare({ overlay, setCoach, completeSub }) {
 setCoach("Sort both banks into tens, then tap the one with more.");
 mountNumCompare(overlay, { onDone: completeSub });
}

function sub9_roll({ overlay, setCoach, completeSub }) {
 setCoach("Watch the rollover, then base 10 and the binary bonus.");
 mountNumRoll(overlay, { onDone: completeSub });
}

function sub10_closing({ overlay, setCoach, completeSub }) {
 setCoach("The pile becomes 47. Then a recap map of the four spirals.");
 const t0 = Date.now();
 mountGate(overlay, {
 scene: "numClose",
 badge: "Closing",
 title: "The trick was there all along",
 html: n(
 "We started today staring at a messy pile of dots, completely unable to trust our own count. Now you know exactly what was hiding underneath every number you'll ever read: a system of bundles and positions so good, most people use it flawlessly their entire lives without ever once being shown how it actually works. You just got shown.",
 ),
 ready: () => labState.numCloseU >= 0.95 || Date.now() - t0 > 8000,
 readyText: "4 bundles, 7 leftovers, then 47.",
 doneLabel: "Open the spiral map ▶",
 onDone: () => {
 setCoach("Last screen: a recap map of the four spirals. Tap a number to replay, then Finish Number Sense.");
 mountSpiralMap(overlay, {
 scene: "numSpiral",
 title: "Your recap map",
 finishLabel: "Finish Number Sense ▶",
 narration:
 "This last screen is a recap, not a new puzzle. The four numbers are the four loops you already finished. Tap a number (on the canvas or here) to replay a short highlight. When you are ready, tap Finish Number Sense.",
 statusIdle: "Tap a number to replay, or finish now.",
 stops: [
 { n: 1, label: "1: What a number is" },
 { n: 2, label: "2: Bundle by tens" },
 { n: 3, label: "3: Place value" },
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
