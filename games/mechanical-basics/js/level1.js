/**
 * Mechanical Basics - Mission 1: Levers & Gears
 * Script: Opening + 4 Bruner spirals (lever → fulcrum/MA → gears → everyday) + recap.
 */
import { labState, LAB_ASSET_PATHS, resetLeverGearState, initLevSub } from "./lab-state.js?v=lev4";
import { mountGate, mountSpiralMap, mountTapContinue, badgeHtml } from "./lab-activities.js?v=lev4";

export const L1_META = {
 objective:
 "By the end of this mission, you'll explain levers, mechanical advantage, gears, torque, and gear ratio - how small effort moves heavy loads by trading distance for force.",
 bdHook:
 "Scissors, wheelbarrows, bicycle hills - same trick: trade distance (or speed) for force (or torque).",
 predict: {
 q: "A boulder is too heavy to lift by hand. What's the honest reason a plank can help?",
 options: [
 "The plank trades how far your hand moves for how hard it has to push",
 "The plank magically creates extra strength from nowhere",
 "Wood is lighter than rock so it cancels the weight",
 ],
 ok: 0,
 },
 kidTitle: "Levers & Gears",
 theme: "machines that make effort go further",
 emoji: "⚙️",
 rewardName: "Lever Learner",
 intro:
 "How does a small push move something far too heavy? A lever trades distance for force. A gear trades speed for torque. Same trick - straight line and spinning versions.",
 everyday: ["Scissors and bottle opener", "Wheelbarrow", "Bicycle climbing a hill"],
 subTitles: [
 "Try Lifting It",
 "Hand vs Plank",
 "What Is a Lever?",
 "Slide the Fulcrum",
 "Mechanical Advantage",
 "Crank the Gears",
 "Torque & Ratio",
 "Sort the Machines",
 "Why It Matters",
 "The Right Tool",
 ],
};

export function runL1Sub(subIndex, api) {
 const { registerTryAgain } = api;
 initLevSub(subIndex);
 const runners = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10];
 const fn = runners[subIndex] || runners[0];
 registerTryAgain(() => {
 api.overlay.innerHTML = "";
 resetLeverGearState();
 fn(api);
 });
 fn(api);
}

function n(text) {
 return `<p class="tiny-narration">${text}</p>`;
}

function fulcrumBothTried() {
 return labState.levFulcrumTriedNearLoad && labState.levFulcrumTriedNearEffort;
}

function s1_opening({ overlay, setCoach, completeSub }) {
 setCoach("Tap Try Lifting It on the canvas - you'll advance automatically.");
 const t0 = Date.now();
 mountGate(overlay, {
 scene: "levOpen",
 badge: "Opening",
 title: "Machines That Make Effort Go Further",
 pulse: true,
 autoAdvanceOnReady: true,
 ready: () => labState.levOpenReady || Date.now() - t0 > 4500,
 readyText: "Clever force beats raw strength.",
 doneLabel: "Continue ▶",
 controlsHtml: `<p class="drag-hint">Or tap here:</p>
 <button type="button" class="btn secondary" id="gate-try-lift">Try Lifting It →</button>`,
 bind: (host, { finish, signalGateReady: signal }) => {
 host.querySelector("#gate-try-lift")?.addEventListener("click", () => {
 labState.levOpenReady = true;
 signal?.({ forceAdvance: true });
 finish();
 });
 },
 html: `${badgeHtml(LAB_ASSET_PATHS.m1, "lever")}
 ${n(
 "That boulder is too heavy for bare hands - and that hill is steep enough to exhaust anyone in the wrong gear. A plain plank and a bicycle are both about to make both problems genuinely easy. Not by adding strength. By being clever about how force gets applied.",
 )}`,
 onDone: completeSub,
 });
}

function s2_lever({ overlay, setCoach, completeSub }) {
 setCoach("Hold Push against the boulder - fail honestly. Then push down on the plank.");
 mountGate(overlay, {
 scene: "levLever1",
 badge: "Spiral 1 · Enactive",
 title: "Lift It By Hand, Then the Plank",
 pulse: true,
 ready: () => labState.levHandFailed && labState.levPlankUsed,
 readyText: "Same boulder - far less force with the plank.",
 doneLabel: "Continue ▶",
 html: n(
 "Maximum effort by hand: barely any movement. Then drag down on the far end of the plank - the boulder rises with noticeably less force on the meter.",
 ),
 onDone: completeSub,
 });
}

function s3_seesaw({ overlay, setCoach, completeSub }) {
 setCoach("Long side travels far with less force; short side lifts with more force.");
 mountGate(overlay, {
 scene: "levSeesaw1",
 badge: "Spiral 1 · Iconic",
 title: "The Seesaw Trade",
 ready: () => true,
 html: n(
 "A seesaw is the exact same machine: the long side moves a large distance with a small push, and the short side moves a little with a large push - two sides of the same trade.",
 ),
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "levTerms1",
 html: `<h3>Spiral 1 · Symbolic</h3>
 <p><strong>Lever</strong> · <strong>Fulcrum</strong> · <strong>Effort</strong> · <strong>Load</strong></p>`,
 onDone: completeSub,
 });
 },
 });
}

function s4_fulcrum({ overlay, setCoach, completeSub }) {
 setCoach("Slide the fulcrum near the load AND near your hand - push each time.");
 mountGate(overlay, {
 scene: "levFulcrum2",
 badge: "Spiral 2 · Enactive",
 title: "Where You Push Matters",
 pulse: true,
 ready: fulcrumBothTried,
 readyText: "Closer to load: less force, longer travel. Closer to effort: the opposite.",
 doneLabel: "Continue ▶",
 html: n(
 "Drag the fulcrum along the plank. Push near the load - force drops but your hand travels further. Push near your hand - more force, barely any motion.",
 ),
 onDone: completeSub,
 });
}

function s5_arms({ overlay, setCoach, completeSub }) {
 setCoach("Both levers reach the same height - they split force and distance differently.");
 mountGate(overlay, {
 scene: "levArms2",
 badge: "Spiral 2 · Iconic",
 title: "Long Arm vs Short Arm",
 ready: () => true,
 html: n(
 "A lever never eliminates effort - it lets you choose: a little force over a long distance, or a lot of force over a short one.",
 ),
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "levTerms2",
 html: `<h3>Spiral 2 · Symbolic</h3>
 <p><strong>Mechanical advantage</strong> - longer effort arm → less force needed, but your hand moves further. Total work stays the same.</p>`,
 onDone: completeSub,
 });
 },
 });
}

function s6_gears({ overlay, setCoach, completeSub }) {
 setCoach("Crank small→large to lift weight, then large→small to spin the fan fast.");
 mountGate(overlay, {
 scene: "levGears3",
 badge: "Spiral 3 · Enactive",
 title: "Turning Force: Gears",
 pulse: true,
 ready: () => labState.levGearCranked && labState.levGearReversed,
 readyText: "Same trade as the lever - but spinning: speed ↔ torque.",
 doneLabel: "Continue ▶",
 html: n(
 "Turn the small gear: it spins fast while the large gear lifts the weight with more torque. Reverse it: crank the large gear - more effort per turn, small gear spins the fan quickly.",
 ),
 onDone: completeSub,
 });
}

function s7_bike({ overlay, setCoach, completeSub }) {
 setCoach("Big rear gear for hills; small rear gear for flat speed - same gear trade.");
 mountGate(overlay, {
 scene: "levBike3",
 badge: "Spiral 3 · Iconic",
 title: "Why Bicycles Have Gears",
 ready: () => true,
 html: n(
 "Cyclists shift going up or down a hill: a big rear gear trades speed for easier pedaling; a small rear gear trades ease back for speed on flat roads.",
 ),
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "levTerms3",
 html: `<h3>Spiral 3 · Symbolic</h3>
 <p><strong>Gear</strong> · <strong>Torque</strong> · <strong>Gear ratio</strong></p>
 <p>Small driving → large driven: more torque, less speed.</p>`,
 onDone: completeSub,
 });
 },
 });
}

function s8_sort({ overlay, setCoach, completeSub }) {
 setCoach("Sort scissors, opener, wheelbarrow, seesaw, clock, gear shift - bonus: bicycle uses both.");
 mountGate(overlay, {
 scene: "levSort4",
 badge: "Spiral 4 · Enactive",
 title: "Sort the Simple Machines",
 pulse: true,
 ready: () => labState.levSortDone,
 readyText: "Levers and gears - genuinely everywhere.",
 doneLabel: "Continue ▶",
 html: n(
 "Scissors are two levers sharing a fulcrum. A wind-up clock runs a chain of gear ratios. Sort each object - then spot the bicycle: lever arm plus gears together.",
 ),
 onDone: completeSub,
 });
}

function s9_montage({ overlay, setCoach, completeSub }) {
 setCoach("Opening boulder and hill - solved without extra strength.");
 mountGate(overlay, {
 scene: "levMontage4",
 badge: "Spiral 4 · Iconic",
 title: "Why This Actually Matters",
 ready: () => true,
 html: n(
 "Neither the boulder nor the hill needed a stronger person - they needed the right simple machine, applied correctly.",
 ),
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "levTerms4",
 html: `<h3>Spiral 4 · Symbolic</h3>
 <p>Lever (distance ↔ force) · Gear (speed ↔ torque) · Simple machines rearrange the trade - they don't add energy.</p>
 <p><em>Next: pulleys and the wheel-and-axle?</em></p>`,
 onDone: completeSub,
 });
 },
 });
}

function s10_closing({ overlay, setCoach, completeSub }) {
 setCoach("Watch both opening problems resolve - then open the recap map.");
 const t0 = Date.now();
 mountGate(overlay, {
 scene: "levClose",
 badge: "Closing",
 title: "The Right Tool, Not More Strength",
 html: n(
 "That boulder and that hill never needed more muscle - they needed a lever trading distance for force, and gears trading speed for torque. Simple machines don't cheat physics; they let you choose which side of the trade you'd rather deal with.",
 ),
 ready: () => labState.levCloseU >= 0.85 || Date.now() - t0 > 7000,
 readyText: "Lever · Fulcrum · Gear · Torque.",
 doneLabel: "Open the recap map ▶",
 onDone: () => {
 setCoach("Tap a spiral number to replay, then finish Levers & Gears.");
 mountSpiralMap(overlay, {
 scene: "levSpiral",
 title: "Your recap map",
 finishLabel: "Finish Levers & Gears ▶",
 narration: "The four numbers are the four spirals you finished. Tap a number to replay a highlight, then finish when ready.",
 statusIdle: "Tap a number to replay, or finish now.",
 stops: [
 { n: 1, label: "1: Lever" },
 { n: 2, label: "2: Fulcrum" },
 { n: 3, label: "3: Gears" },
 { n: 4, label: "4: Everywhere" },
 ],
 onDone: completeSub,
 });
 },
 });
}

const s1 = s1_opening;
const s2 = s2_lever;
const s3 = s3_seesaw;
const s4 = s4_fulcrum;
const s5 = s5_arms;
const s6 = s6_gears;
const s7 = s7_bike;
const s8 = s8_sort;
const s9 = s9_montage;
const s10 = s10_closing;
