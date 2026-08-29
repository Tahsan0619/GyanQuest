/**
 * Force Fighter Mission 3: Push & Pull
 * Script: Opening + 4 Bruner spirals (two directions → rope vs rod → Newton 3 → teamwork) + recap map.
 */
import { forceLabState, resetPushPullState, FORCE_ASSET_PATHS, pulseSuccessFeedback } from "./force-state.js?v=pairvis6";
import {
 mountGate,
 mountSpiralMap,
 mountPairSpring,
 mountPairDirs,
 mountPairRope,
 mountPairTension,
 mountPairSkate,
 mountPairThird,
 mountPairBridge,
 mountPairTeam,
 badgeHtml,
} from "./force-activities.js?v=pairvis6";

export const L3_META = {
 objective:
 "By the end of this mission, you'll be able to explain push and pull as the same kind of force aimed two ways, name tension versus compression, and state Newton's Third Law: every force has an equal, opposite partner on a different object.",
 bdHook: "Last time, force was a push or a pull in newtons. Today we stop treating those words as interchangeable.",
 predict: {
 q: "To open a door, is pushing different from pulling, or the same idea aimed two ways?",
 options: [
 "They are totally different kinds of force",
 "They are the same kind of force, just aimed toward you or away from you",
 "Only pushing is a real force",
 ],
 ok: 1,
 },
 kidTitle: "Push & Pull",
 theme: "push, pull, tension, compression",
 emoji: "🤝",
 rewardName: "Team Force",
 intro:
 "Quick question: to open a door, do you push it, or pull it? It depends which side you stand on, and which way the hinges swing. Push and pull get treated like two totally different actions, but they are more like two ends of the same idea. Today we pull that idea apart, and you will find that some things are extremely good at pulling, and completely useless at pushing.",
 everyday: [
 "A door you might push or pull",
 "A rope that crumples if you shove with it",
 "Two skaters who both move when you only act on one",
 ],
 subTitles: [
 "Push or pull",
 "Squeeze and stretch",
 "Two directions, one idea",
 "Why can't you push a rope",
 "Tension and compression",
 "Both skaters move",
 "Newton's Third Law",
 "Cables and pillars",
 "Push and pull as a team",
 "Two sides of the same force",
 ],
};

export function runL3Sub(subIndex, api) {
 const { registerTryAgain } = api;
 resetPushPullState();
 const runners = [
 sub1_opening,
 sub2_spring,
 sub3_dirs,
 sub4_rope,
 sub5_tension,
 sub6_skate,
 sub7_third,
 sub8_bridge,
 sub9_team,
 sub10_closing,
 ];
 const fn = runners[subIndex] || runners[0];
 registerTryAgain(() => {
 api.overlay.innerHTML = "";
 resetPushPullState();
 fn(api);
 });
 fn(api);
}

function sub1_opening({ overlay, setCoach, completeSub }) {
 setCoach("Tap Push It or Pull It. Watch the door swing inward or outward.");
 mountGate(overlay, {
 scene: "pairOpen",
 badge: "Opening",
 title: "Push & Pull",
 pulse: true,
 ready: () => forceLabState.plDoorOpen,
 readyText: "The door swung. Same force, two directions.",
 doneLabel: "Start the lesson ▶",
 controlsHtml: `<div class="btn-row">
 <button type="button" class="btn secondary tiny-pulse" id="pl-door-push">Push It →</button>
 <button type="button" class="btn secondary tiny-pulse" id="pl-door-pull">Pull It →</button>
 </div>`,
 html: `${badgeHtml(FORCE_ASSET_PATHS.pair, "pairs")}
 ${n(
 "Quick question: to open this door, do you push it, or pull it? The honest answer is, it depends entirely on which side of the door you're standing on, and which way the hinges swing. Push and pull get treated like two totally different actions, but they're more like two ends of the same idea. Today we're pulling that idea apart, and some things in this world are extremely good at pulling, and completely useless at pushing.",
 )}`,
 bind(host) {
 function swing(dir) {
 forceLabState.plDoorDir = dir;
 forceLabState.plDoorOpen = true;
 pulseSuccessFeedback(200);
 }
 host.querySelector("#pl-door-push")?.addEventListener("click", () => swing(1));
 host.querySelector("#pl-door-pull")?.addEventListener("click", () => swing(-1));
 window.__arena?.setIntentHandler?.((intent) => {
 if (intent.type !== "CANVAS_TAP" && intent.type !== "CANVAS_UP") return;
 if (intent.meta?.action === "push") swing(1);
 if (intent.meta?.action === "pull") swing(-1);
 });
 },
 onDone: completeSub,
 });
}

function sub2_spring({ overlay, setCoach, completeSub }) {
 setCoach("Squeeze the spring, then stretch it. It fights back both ways.");
 mountPairSpring(overlay, { onDone: completeSub });
}

function sub3_dirs({ overlay, setCoach, completeSub }) {
 setCoach("Four everyday examples stay on screen: box, wagon, door, drawer.");
 mountPairDirs(overlay, { onDone: completeSub });
}

function sub4_rope({ overlay, setCoach, completeSub }) {
 setCoach("Fail at pushing the rope first. Then pull. Do not skip the crumple.");
 mountPairRope(overlay, { onDone: completeSub });
}

function sub5_tension({ overlay, setCoach, completeSub }) {
 setCoach("Stretching versus squeezing, then tension and compression.");
 mountPairTension(overlay, { onDone: completeSub });
}

function sub6_skate({ overlay, setCoach, completeSub }) {
 setCoach("Push-off, then pull together. Both skaters move both times.");
 mountPairSkate(overlay, { onDone: completeSub });
}

function sub7_third({ overlay, setCoach, completeSub }) {
 setCoach("Swimmer, rowboat, rocket, wall push. Then Newton's Third Law.");
 mountPairThird(overlay, { onDone: completeSub });
}

function sub8_bridge({ overlay, setCoach, completeSub }) {
 setCoach("Build a real suspension bridge: cables, pillars, drive across.");
 mountPairBridge(overlay, { onDone: completeSub });
}

function sub9_team({ overlay, setCoach, completeSub }) {
 setCoach("Cranes, tents, bones. Then three ideas to keep.");
 mountPairTeam(overlay, { onDone: completeSub });
}

function sub10_closing({ overlay, setCoach, completeSub }) {
 setCoach("Back at the door. Push, pull, equal and opposite. Then the recap map.");
 const t0 = Date.now();
 mountGate(overlay, {
 scene: "pairClose",
 badge: "Closing",
 title: "Two sides of the same force",
 html: n(
 "We started today standing in front of a door, unsure whether to push or pull. Now you know both are really the same underlying idea, force, just aimed in opposite directions, and that this simple difference in direction quietly explains why ropes can't push, why bridges need both cables and pillars, and why your own muscles only ever know how to pull. Push and pull were never rivals. They've been a team this entire time.",
 ),
 ready: () => forceLabState.plCloseU >= 0.95 || Date.now() - t0 > 8000,
 readyText: "The overlays are in.",
 doneLabel: "Open the spiral map ▶",
 onDone: () => {
 setCoach("Last screen: a recap map of the four spirals. Tap a number to replay, then Finish Push & Pull.");
 mountSpiralMap(overlay, {
 scene: "pairSpiral",
 title: "Your recap map",
 finishLabel: "Finish Push & Pull ▶",
 narration:
 "This last screen is a recap, not a new puzzle. The four numbers are the four loops you already finished. Tap a number (on the canvas or here) to replay a short highlight. When you are ready, tap Finish Push & Pull.",
 statusIdle: "Tap a number to replay, or finish now.",
 stops: [
 { n: 1, label: "1: Two directions" },
 { n: 2, label: "2: Rope vs rod" },
 { n: 3, label: "3: Force pairs" },
 { n: 4, label: "4: Teamwork" },
 ],
 onDone: completeSub,
 });
 },
 });
}

function n(text) {
 return `<p class="tiny-narration">${text}</p>`;
}
