/**
 * Force Fighter Mission 2: Push Power
 * Script: Opening + 4 Bruner spirals (force → power ≠ strong → gears → why it matters) + recap map.
 * Packed into the shared 10-step mission engine (N_SUBS = 10).
 */
import { forceLabState, resetPushPowerState, FORCE_ASSET_PATHS } from "./force-state.js?v=pairvis6";
import {
 mountGate,
 mountSpiralMap,
 mountPushAim,
 mountPushForce,
 mountPushRace,
 mountPushWork,
 mountPushGears,
 mountPushTrade,
 mountPushFriends,
 mountPushScale,
 badgeHtml,
} from "./force-activities.js?v=pairvis6";

export const L2_META = {
 objective:
 "By the end of this mission, you'll be able to explain force as a push or pull (direction plus strength, in newtons), and power as how fast work gets done (watts), not as a synonym for strong.",
 bdHook: "Last time the rock sat still until a net force. Today we ask what a push is, and what power actually means.",
 predict: {
 q: "Before we start: if someone calls an engine 'powerful,' what do they usually mean, and what should it mean?",
 options: [
 "Powerful just means it pushes very hard",
 "Powerful means it can get a job done quickly, which is not the same as pushing hard",
 "Powerful means the engine is heavy",
 ],
 ok: 1,
 },
 kidTitle: "Push Power",
 theme: "force and power",
 emoji: "🏎️",
 rewardName: "Speed Star",
 intro:
 "Last time, we learned that the lazy rock will sit forever unless something pushes it, a net force. Today a stalled car sits on the road with that same problem. We hunt down two words people mix up constantly: push and power. Once you're done, you will not use the word powerful carelessly again.",
 everyday: [
 "The lazy rock, waiting on the grass beside a stalled car",
 "A tortoise and a rabbit, each on their own lane",
 "Low gear on a hill, high gear sliding back, high gear on a flat road",
 ],
 subTitles: [
 "Give it a push",
 "Aim and push",
 "Force has a name",
 "Tortoise vs Rabbit",
 "Work and watts",
 "Gears on a hill",
 "Force times velocity",
 "Many hands",
 "Watts you can feel",
 "Two words, one difference",
 ],
};

export function runL2Sub(subIndex, api) {
 const { registerTryAgain } = api;
 resetPushPowerState();

 const runners = [
 sub1_opening,
 sub2_aim,
 sub3_force,
 sub4_race,
 sub5_work,
 sub6_gears,
 sub7_trade,
 sub8_friends,
 sub9_scale,
 sub10_closing,
 ];
 const fn = runners[subIndex] || runners[0];
 registerTryAgain(() => {
 api.overlay.innerHTML = "";
 resetPushPowerState();
 fn(api);
 });
 fn(api);
}

function sub1_opening({ overlay, setCoach, completeSub }) {
 setCoach("A stalled car sits on the road. Net force is zero until you push. Tap Give It a Push.");
 mountGate(overlay, {
 scene: "pushOpen",
 badge: "Opening",
 title: "Push Power",
 pulse: true,
 ready: () => forceLabState.ppNudged,
 readyText: "A force changed its motion.",
 doneLabel: "Start the lesson ▶",
 controlsHtml: `<button type="button" class="btn secondary tiny-pulse" id="pp-nudge-btn">Give It a Push →</button>`,
 html: `${badgeHtml(FORCE_ASSET_PATHS.push, "push")}
 ${n(
 "Last time, we learned that a rock will sit forever unless something pushes it, a net force. Today a stalled car is waiting on the road with that same problem. What is a push, exactly? And once something starts pushing, does it matter how hard it pushes, or how fast? Today we're hunting down two words people mix up constantly, push and power, and once you're done, you'll never use the word 'powerful' carelessly again.",
 )}`,
 bind(host) {
 const arena = window.__arena;
 function doPush() {
 forceLabState.ppNudged = true;
 forceLabState.ppRvx = 0.018;
 const btn = document.getElementById("tiny-gate-go");
 if (btn) {
 btn.disabled = false;
 btn.click();
 }
 }
 host.querySelector("#pp-nudge-btn")?.addEventListener("click", doPush);
 arena?.setIntentHandler?.((intent) => {
 if (
 (intent.type === "CANVAS_TAP" || intent.type === "CANVAS_UP") &&
 intent.meta?.action === "nudge"
 ) {
 doPush();
 }
 });
 },
 onDone: completeSub,
 });
}

function sub2_aim({ overlay, setCoach, completeSub }) {
 setCoach("Three guided pushes on the crate. The compass stays put. Weak, strong, then a new angle.");
 mountPushAim(overlay, { onDone: completeSub });
}

function sub3_force({ overlay, setCoach, completeSub }) {
 setCoach("Four everyday force pictures stay on screen, then the word force, measured in newtons.");
 mountPushForce(overlay, { onDone: completeSub });
}

function sub4_race({ overlay, setCoach, completeSub }) {
 setCoach("Tortoise on the top lane, rabbit on the bottom. Then guess who was more powerful. Do not skip the guess.");
 mountPushRace(overlay, { onDone: completeSub });
}

function sub5_work({ overlay, setCoach, completeSub }) {
 setCoach("Same work, different time. Then work in joules and power in watts.");
 mountPushWork(overlay, { onDone: completeSub });
}

function sub6_gears({ overlay, setCoach, completeSub }) {
 setCoach("Power stays fixed. Low gear climbs. High gear on the hill slides back. High gear on the road smiles.");
 mountPushGears(overlay, { onDone: completeSub });
}

function sub7_trade({ overlay, setCoach, completeSub }) {
 setCoach("Force vs speed on a pivot, then Power = Force × Velocity.");
 mountPushTrade(overlay, { onDone: completeSub });
}

function sub8_friends({ overlay, setCoach, completeSub }) {
 setCoach("Push the stalled car alone, then recruit friends. Optional lift after.");
 mountPushFriends(overlay, { onDone: completeSub });
}

function sub9_scale({ overlay, setCoach, completeSub }) {
 setCoach("Five power pictures from a bulb to a rocket. Then force vs power, side by side.");
 mountPushScale(overlay, { onDone: completeSub });
}

function sub10_closing({ overlay, setCoach, completeSub }) {
 setCoach("Force moves the rock. Power is how quickly the job is done. Then the recap map.");
 const t0 = Date.now();
 mountGate(overlay, {
 scene: "pushClose",
 badge: "Closing",
 title: "Two words, one clear difference",
 html: n(
 "We started today by asking what actually makes that lazy rock move, and how fast it happens. Now you know: a force is what moves it, a push or pull, with a direction and a strength. Power is how quickly that push gets the job done. Mix them up, and 'powerful' just sounds like a compliment. Understand them properly, and you can explain everything from a weightlifter's technique to a rocket's engines using the exact same two ideas.",
 ),
 ready: () => forceLabState.ppCloseU >= 0.95 || Date.now() - t0 > 8000,
 readyText: "The overlays are in.",
 doneLabel: "Open the spiral map ▶",
 onDone: () => {
 setCoach("Last screen: a recap map of the four spirals. Tap a number to replay, then Finish Push Power.");
 mountSpiralMap(overlay, {
 scene: "pushSpiral",
 title: "Your recap map",
 finishLabel: "Finish Push Power ▶",
 narration:
 "This last screen is a recap, not a new puzzle. The four numbers are the four loops you already finished. Tap a number (on the canvas or here) to replay a short highlight. When you are ready, tap Finish Push Power.",
 statusIdle: "Tap a number to replay, or finish now.",
 stops: [
 { n: 1, label: "1: What is a push" },
 { n: 2, label: "2: Power ≠ strong" },
 { n: 3, label: "3: Gears" },
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
