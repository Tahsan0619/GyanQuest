/**
 * Electrical Basics - Mission 1: Circuit Loop
 * Script: Opening + 4 Bruner spirals (loop → voltage → current/resistance → switch) + recap.
 */
import { labState, LAB_ASSET_PATHS, resetCircuitLoopState, initCircSub } from "./lab-state.js?v=loop4";
import { mountGate, mountSpiralMap, mountTapContinue, badgeHtml } from "./lab-activities.js?v=loop4";

export const L1_META = {
 objective:
 "By the end of this mission, you'll explain circuits, voltage, current, resistance, and switches using the water-in-pipes metaphor - in your own words.",
 bdHook:
 "Phone chargers, room lights, toy motors - all need one complete loop, a push, and something that does useful work.",
 predict: {
 q: "A battery, wire, and bulb sit disconnected. Why is the bulb dark?",
 options: [
 "Electricity only flows through a complete, unbroken loop back to the source",
 "The bulb is broken until you shake the battery",
 "Wire stores electricity like a sponge until it is full",
 ],
 ok: 0,
 },
 kidTitle: "Circuit Loop",
 theme: "electricity's water park",
 emoji: "🔌",
 rewardName: "Loop Learner",
 intro:
 "Electricity behaves like water flowing through a loop of pipes. A battery is the pump, wire is the pipe, a bulb is a water wheel that glows as flow pushes through - and nothing works unless the loop is complete.",
 everyday: ["Room light switch", "Phone charger plug", "Toy motor battery pack"],
 subTitles: [
 "Start Wiring",
 "Close the Loop",
 "What Is a Circuit?",
 "Swap the Battery",
 "Pump & Voltage",
 "Watch the Flow",
 "Current & Resistance",
 "Add a Switch",
 "Valve & Switch",
 "The Lights Are On",
 ],
};

export function runL1Sub(subIndex, api) {
 const { registerTryAgain } = api;
 initCircSub(subIndex);
 const runners = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10];
 const fn = runners[subIndex] || runners[0];
 registerTryAgain(() => {
 api.overlay.innerHTML = "";
 resetCircuitLoopState();
 fn(api);
 });
 fn(api);
}

function n(text) {
 return `<p class="tiny-narration">${text}</p>`;
}

function batteriesAllTried() {
 const t = labState.circBatteriesTried || {};
 return t.weak && t.medium && t.strong;
}

function s1_opening({ overlay, setCoach, completeSub }) {
 setCoach("Tap Start Wiring on the canvas - you'll advance automatically.");
 const t0 = Date.now();
 mountGate(overlay, {
 scene: "circOpen",
 badge: "Opening",
 title: "Electricity's Water Park",
 pulse: true,
 autoAdvanceOnReady: true,
 ready: () => labState.circOpenReady || Date.now() - t0 > 4500,
 readyText: "Water in pipes - same idea as electricity in wire.",
 doneLabel: "Continue ▶",
 controlsHtml: `<p class="drag-hint">Or tap here if the canvas button is hard to reach:</p>
 <button type="button" class="btn secondary" id="gate-start-wire">Start Wiring →</button>`,
 bind: (host, { finish, signalGateReady: signal }) => {
 host.querySelector("#gate-start-wire")?.addEventListener("click", () => {
 labState.circOpenReady = true;
 signal?.({ forceAdvance: true });
 finish();
 });
 },
 html: `${badgeHtml(LAB_ASSET_PATHS.m1, "circuit")}
 ${n(
 "Here's a battery, a wire, and a bulb - all the ingredients for light, and yet nothing is happening. Electricity behaves almost exactly like water flowing through pipes. Today we connect these three pieces correctly, and you'll understand exactly why they light up - and why the tiniest gap keeps them dark.",
 )}`,
 onDone: completeSub,
 });
}

function s2_loop({ overlay, setCoach, completeSub }) {
 setCoach("Click each gap to close the loop - then break any single wire segment.");
 mountGate(overlay, {
 scene: "circLoop1",
 badge: "Spiral 1 · Enactive",
 title: "Close the Loop",
 pulse: true,
 ready: () => labState.circLoopEverClosed && labState.circLoopBroken,
 readyText: "One gap anywhere - instantly dark. Reversible and immediate.",
 doneLabel: "Continue ▶",
 html: n(
 "Snap wire segments to connect battery → bulb → back to battery. When the circle closes, the bulb lights. Then click any segment to open a gap - not dim, not flickering, just immediately off.",
 ),
 onDone: completeSub,
 });
}

function s3_pipe({ overlay, setCoach, completeSub }) {
 setCoach("Closed pipe circulates water; a gap stops flow - same as wire.");
 mountGate(overlay, {
 scene: "circPipe1",
 badge: "Spiral 1 · Iconic",
 title: "Water Loop Comparison",
 ready: () => true,
 html: n(
 "A pipe loop with even one gap can't circulate water anymore - it spills out and stops. Electricity in a wire behaves the same way, just far too fast to see.",
 ),
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "circTerms1",
 html: `<h3>Spiral 1 · Symbolic</h3>
 <p><strong>Circuit</strong> - complete path for electricity</p>
 <p><strong>Closed circuit</strong> - no gaps; electricity flows</p>
 <p><strong>Open circuit</strong> - a gap anywhere; no flow</p>`,
 onDone: completeSub,
 });
 },
 });
}

function s4_battery({ overlay, setCoach, completeSub }) {
 setCoach("Try weak, medium, and strong batteries - same loop, different brightness.");
 mountGate(overlay, {
 scene: "circBattery2",
 badge: "Spiral 2 · Enactive",
 title: "Swap the Battery",
 pulse: true,
 ready: batteriesAllTried,
 readyText: "More push → brighter bulb. Less push → dimmer.",
 doneLabel: "Continue ▶",
 html: n(
 "Same bulb, same wire, same complete loop - only the battery's push changes. Weak battery: dim glow. Strong battery: bright glow, even straining at the edge.",
 ),
 onDone: completeSub,
 });
}

function s5_pump({ overlay, setCoach, completeSub }) {
 setCoach("Pump strength sets how hard water pushes - voltage does the same for electricity.");
 mountGate(overlay, {
 scene: "circPump2",
 badge: "Spiral 2 · Iconic",
 title: "Pump ↔ Battery",
 ready: () => true,
 html: n(
 "A stronger pump pushes water harder through the pipes; a stronger battery pushes electricity harder through the wire - and whatever is downstream responds directly.",
 ),
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "circTerms2",
 html: `<h3>Spiral 2 · Symbolic</h3>
 <p><strong>Battery</strong> - source of electrical push</p>
 <p><strong>Voltage</strong> - strength of that push, measured in <strong>volts (V)</strong></p>
 <p>AA ≈ 1.5 V · Car battery ≈ 12 V</p>`,
 onDone: completeSub,
 });
 },
 });
}

function s6_flow({ overlay, setCoach, completeSub }) {
 setCoach("Watch particles flow, swap thick wire, then remove and restore the bulb.");
 mountGate(overlay, {
 scene: "circFlow3",
 badge: "Spiral 3 · Enactive",
 title: "Flow & Resistance",
 pulse: true,
 ready: () => labState.circResistanceDone,
 readyText: "Thicker wire: more flow. Bulb resists on purpose - and glows.",
 doneLabel: "Continue ▶",
 html: n(
 "Observe the glowing particle stream. Replace thin wire with thick wire - flow widens and the bulb brightens slightly. Then remove the bulb (plain wire bypass) and put it back - feel how it resists and converts effort into light.",
 ),
 onDone: completeSub,
 });
}

function s7_wheel({ overlay, setCoach, completeSub }) {
 setCoach("The water wheel converts flowing effort into light - the bulb does the same.");
 mountGate(overlay, {
 scene: "circWheel3",
 badge: "Spiral 3 · Iconic",
 title: "Wheel ↔ Bulb",
 ready: () => true,
 html: n(
 "The wheel isn't just an obstacle - it's designed to convert flowing effort into useful work. A bulb's filament resists the electrical flow just enough to turn that resistance into heat and light.",
 ),
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "circTerms3",
 html: `<h3>Spiral 3 · Symbolic</h3>
 <p><strong>Current</strong> - flow through the circuit (amps, A)</p>
 <p><strong>Resistance</strong> - opposition to flow (ohms, Ω)</p>
 <p><strong>Wire</strong> - low resistance · <strong>Bulb (load)</strong> - useful resistance → light</p>
 <p><em>Bonus: Ohm's Law links voltage, current, and resistance.</em></p>`,
 onDone: completeSub,
 });
 },
 });
}

function s8_switch({ overlay, setCoach, completeSub }) {
 setCoach("Add a switch in the gap - open = dark, closed = lit. Toggle a few times.");
 mountGate(overlay, {
 scene: "circSwitch4",
 badge: "Spiral 4 · Enactive",
 title: "Add a Switch",
 pulse: true,
 ready: () => labState.circSwitchAdded && labState.circSwitchClosed && (labState.circSwitchToggles || 0) >= 2,
 readyText: "Switch open = gap = dark. Switch closed = loop = lit.",
 doneLabel: "Continue ▶",
 html: n(
 "Drag a switch into the gap. Open position: the switch itself creates the break from Spiral 1. Flip closed: the loop completes and the bulb lights instantly - on command, whenever you want.",
 ),
 onDone: completeSub,
 });
}

function s9_valve({ overlay, setCoach, completeSub }) {
 setCoach("A switch is an electrical valve - same control, same idea.");
 mountGate(overlay, {
 scene: "circValve4",
 badge: "Spiral 4 · Iconic",
 title: "Valve ↔ Switch",
 ready: () => true,
 html: n(
 "Every light switch in every room is doing precisely this - a deliberate, controllable gap, exactly like the one you broke and fixed in Spiral 1.",
 ),
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "circTerms4",
 html: `<h3>Spiral 4 · Symbolic</h3>
 <p>Circuit · Battery/Voltage · Wire · Current · Resistance/Bulb · Switch</p>
 <p><em>Next: what happens with more than one bulb - series vs parallel?</em></p>`,
 onDone: completeSub,
 });
 },
 });
}

function s10_closing({ overlay, setCoach, completeSub }) {
 setCoach("Watch the pieces assemble - then open the recap map.");
 const t0 = Date.now();
 mountGate(overlay, {
 scene: "circClose",
 badge: "Closing",
 title: "The Lights Are On",
 html: n(
 "Those three disconnected pieces were never mysterious - they needed a complete loop, a push to move things around it, and something willing to resist that push just enough to do something useful. That's genuinely all electricity in a simple circuit ever is.",
 ),
 ready: () => labState.circCloseU >= 0.85 || Date.now() - t0 > 7000,
 readyText: "Loop · Push · Flow · Control.",
 doneLabel: "Open the recap map ▶",
 onDone: () => {
 setCoach("Tap a spiral number to replay, then finish Circuit Loop.");
 mountSpiralMap(overlay, {
 scene: "circSpiral",
 title: "Your recap map",
 finishLabel: "Finish Circuit Loop ▶",
 narration:
 "The four numbers are the four spirals you finished. Tap a number to replay a highlight, then finish when ready.",
 statusIdle: "Tap a number to replay, or finish now.",
 stops: [
 { n: 1, label: "1: Loop" },
 { n: 2, label: "2: Voltage" },
 { n: 3, label: "3: Flow" },
 { n: 4, label: "4: Switch" },
 ],
 onDone: completeSub,
 });
 },
 });
}

const s1 = s1_opening;
const s2 = s2_loop;
const s3 = s3_pipe;
const s4 = s4_battery;
const s5 = s5_pump;
const s6 = s6_flow;
const s7 = s7_wheel;
const s8 = s8_switch;
const s9 = s9_valve;
const s10 = s10_closing;
