/**
 * Force Fighter Mission 1: The Lazy Rock
 * Script: Opening + 4 Bruner spirals (still/move → inertia → Newton 1 → why it matters) + recap map.
 * Packed into the shared 10-step mission engine (N_SUBS = 10).
 */
import { forceLabState, resetLazyRockState, FORCE_ASSET_PATHS } from "./force-state.js?v=pairvis6";
import {
 mountGate,
 mountSpiralMap,
 mountRockPoke,
 mountRockStates,
 mountRockEffort,
 mountRockInertia,
 mountRockIce,
 mountRockNewton,
 mountRockCrash,
 mountRockWhy,
 badgeHtml,
} from "./force-activities.js?v=pairvis6";

export const L1_META = {
 objective:
 "By the end of this mission, you'll be able to explain inertia and Newton's First Law in your own words: an object keeps its state of motion until a net outside force acts.",
 bdHook: "Start with a canal-bank rock that will not move, then feel the same stubbornness on a bus and in a seatbelt.",
 predict: {
 q: "Before we start: a rock sitting in a field does nothing. What is the best reason?",
 options: [
 "It is waiting until it feels like moving",
 "Things don't change what they're doing unless something makes them",
 "Only living things can stay still",
 ],
 ok: 1,
 },
 kidTitle: "The Lazy Rock",
 theme: "inertia and Newton's First Law",
 emoji: "🪨",
 rewardName: "Rock Rookie",
 intro:
 "Here's a rock by the canal. It's not doing anything, and it will not, unless something makes it. That stubborn preference for continuing exactly whatever it was already doing is the first idea in physics worth a whole lesson. We call it the lazy rock, and 'lazy' turns out to be the perfect scientific word for it.",
 everyday: [
 "A canal-bank boulder sitting still",
 "A ball, a brick, and a football given the same push",
 "A bus starting and braking, and a seatbelt supplying the missing stop",
 ],
 subTitles: [
 "A sitting rock",
 "Poke the rock",
 "Still or moving",
 "Ball, brick, football",
 "Feel inertia on a bus",
 "Ice then gravel",
 "What Newton said",
 "Seatbelts",
 "Why it matters",
 "The rock was never lazy",
 ],
};

export function runL1Sub(subIndex, api) {
 const { registerTryAgain } = api;
 resetLazyRockState();

 const runners = [
 sub1_opening,
 sub2_poke,
 sub3_states,
 sub4_effort,
 sub5_inertia,
 sub6_ice,
 sub7_newton,
 sub8_crash,
 sub9_why,
 sub10_closing,
 ];
 const fn = runners[subIndex] || runners[0];
 registerTryAgain(() => {
 api.overlay.innerHTML = "";
 resetLazyRockState();
 fn(api);
 });
 fn(api);
}

function sub1_opening({ overlay, setCoach, completeSub }) {
 setCoach("A canal rock that does nothing, until you make it. Tap Try Nudging It.");
 mountGate(overlay, {
 scene: "rockOpen",
 badge: "Opening",
 title: "The Lazy Rock",
 pulse: true,
 ready: () => forceLabState.rockNudged,
 readyText: "It only moved because you made it.",
 doneLabel: "Start the lesson ▶",
 controlsHtml: `<button type="button" class="btn secondary tiny-pulse" id="rock-nudge-btn">Try Nudging It →</button>`,
 html: `${badgeHtml(FORCE_ASSET_PATHS.rock, "lazy rock")}
 ${n(
 "Here's a rock. It's not doing anything. It's not going to do anything, either, not unless something makes it. That sounds obvious, almost too obvious to be worth a whole lesson. But this exact idea, that things don't change what they're doing all by themselves, turns out to be one of the deepest, most useful ideas in all of physics. We're going to call this rock the lazy rock, and by the end of today, you'll understand exactly why 'lazy' is actually the perfect scientific word for it.",
 )}`,
 bind(host) {
 const arena = window.__arena;
 function doNudge() {
 forceLabState.rockNudged = true;
 const btn = document.getElementById("tiny-gate-go");
 if (btn) {
 btn.disabled = false;
 btn.click();
 }
 }
 host.querySelector("#rock-nudge-btn")?.addEventListener("click", doNudge);
 arena?.setIntentHandler?.((intent) => {
 if (
 (intent.type === "CANVAS_TAP" || intent.type === "CANVAS_UP") &&
 intent.meta?.action === "nudge"
 ) {
 doNudge();
 }
 });
 },
 onDone: completeSub,
 });
}

function sub2_poke({ overlay, setCoach, completeSub }) {
 setCoach("A tap is not enough. Drag to push the rock, then try the ball.");
 mountRockPoke(overlay, { onDone: completeSub });
}

function sub3_states({ overlay, setCoach, completeSub }) {
 setCoach("Stillness and steady motion are more alike than they first appear.");
 mountRockStates(overlay, { onDone: completeSub });
}

function sub4_effort({ overlay, setCoach, completeSub }) {
 setCoach("Same push on a ball, a brick, and a football. Size is not the same as mass.");
 mountRockEffort(overlay, { onDone: completeSub });
}

function sub5_inertia({ overlay, setCoach, completeSub }) {
 setCoach("Start the bus, then brake. Your body tries to keep doing what it was already doing.");
 mountRockInertia(overlay, { onDone: completeSub });
}

function sub6_ice({ overlay, setCoach, completeSub }) {
 setCoach("Push on the ICE page first. Then flip to the GRAVEL page while it is still sliding.");
 mountRockIce(overlay, { onDone: completeSub });
}

function sub7_newton({ overlay, setCoach, completeSub }) {
 setCoach("Nudge the wrench in space, then the puck on the table. Then read Newton's First Law.");
 mountRockNewton(overlay, { onDone: completeSub });
}

function sub8_crash({ overlay, setCoach, completeSub }) {
 setCoach("Drive with no seatbelt, then with one. Watch the passenger keep going along a curve.");
 mountRockCrash(overlay, { onDone: completeSub });
}

function sub9_why({ overlay, setCoach, completeSub }) {
 setCoach("Do the bus, the coin, and the satellite yourself. Same law, three costumes.");
 mountRockWhy(overlay, { onDone: completeSub });
}

function sub10_closing({ overlay, setCoach, completeSub }) {
 setCoach("The rock, the ball, the brick, and the football were never really lazy. Then open the recap map.");
 const t0 = Date.now();
 mountGate(overlay, {
 scene: "rockClose",
 badge: "Closing",
 title: "The rock was never really lazy",
 html: n(
 "We started with a rock doing nothing, and called it lazy. By now you know that's not really a character flaw. It's a law of the universe. Everything, everywhere, insists on continuing to do exactly what it's already doing, until something else forces a change. That's not laziness. That's inertia, and now you'll never look at a rock, or a brick, or a bus, or a seatbelt, quite the same way again.",
 ),
 ready: () => forceLabState.rockCloseU >= 0.95 || Date.now() - t0 > 8000,
 readyText: "The overlays are in.",
 doneLabel: "Open the spiral map ▶",
 onDone: () => {
 setCoach("Last screen: a recap map of the four spirals. Tap a number to replay, then Finish The Lazy Rock.");
 mountSpiralMap(overlay, {
 scene: "rockSpiral",
 title: "Your recap map",
 finishLabel: "Finish The Lazy Rock ▶",
 narration:
 "This last screen is a recap, not a new puzzle. The four numbers are the four loops you already finished. Tap a number (on the canvas or here) to replay a short highlight. When you are ready, tap Finish The Lazy Rock.",
 statusIdle: "Tap a number to replay, or finish now.",
 stops: [
 { n: 1, label: "1: Why still/move" },
 { n: 2, label: "2: Inertia" },
 { n: 3, label: "3: Newton 1" },
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
