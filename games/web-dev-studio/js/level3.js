/**
 * Web Dev Studio - Mission 3: JS Clicks
 * Script: Opening + 4 Bruner spirals (events → functions → variables → toggle) + recap map.
 */
import { labState, LAB_ASSET_PATHS, resetJsClickState } from "./lab-state.js?v=jshouse1";
import { mountGate, mountSpiralMap, mountTapContinue, badgeHtml } from "./lab-activities.js?v=jshouse3";

export const L3_META = {
 objective:
 "By the end of this mission, you'll explain how JavaScript listens for events, runs reusable functions, stores values in variables, and combines all three into real interactivity.",
 bdHook:
 "Game Start buttons, quiz taps, ticket kiosks - every reaction is event + code + (often) a variable remembering state.",
 predict: {
 q: "The CSS house looks finished, but the light switch does nothing. What's missing?",
 options: [
 "More HTML tags nested deeper",
 "JavaScript: event listeners and code that run when you click",
 "Deleting the footer tag entirely",
 ],
 ok: 1,
 },
 kidTitle: "JS Clicks",
 theme: "behavior & wiring",
 emoji: "⚡",
 rewardName: "Click Coder",
 intro:
 "The house is built and painted - but it can't react. Today we run the wiring: events, functions, and variables that make every switch, doorbell, and toggle actually work.",
 everyday: ["Game Start button", "Like counter on a post", "Form error on bad email"],
 subTitles: [
 "Run the Wiring",
 "Wire the Switch",
 "Events & Listeners",
 "Write turnOnLight",
 "One Function, Many Switches",
 "Ring the Doorbell",
 "The ringCount Box",
 "Build the Toggle",
 "Real Interactivity",
 "The House Is Alive",
 ],
};

export function runL3Sub(subIndex, api) {
 const { registerTryAgain } = api;
 resetJsClickState();
 const runners = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10];
 const fn = runners[subIndex] || runners[0];
 registerTryAgain(() => {
 api.overlay.innerHTML = "";
 resetJsClickState();
 fn(api);
 });
 fn(api);
}

function n(text) {
 return `<p class="tiny-narration">${text}</p>`;
}

function s1_opening({ overlay, setCoach, completeSub }) {
 setCoach("The painted house looks great - flip the switch. Nothing. Run the wiring.");
 const t0 = Date.now();
 mountGate(overlay, {
 scene: "jsOpen",
 badge: "Opening",
 title: "JS Clicks",
 pulse: true,
 ready: () => labState.jsOpenReady || Date.now() - t0 > 2800,
 readyText: "Nice house - but completely unresponsive.",
 doneLabel: "Run the Wiring ▶",
 html: `${badgeHtml(LAB_ASSET_PATHS.m3, "javascript")}
 ${n(
 "This house looks great now - but try flipping that switch. Nothing. No matter how nicely a house is built and decorated, it's still just a stage set unless something inside can react. Today we're running the wiring.",
 )}`,
 onDone: completeSub,
 });
}

function s2_wire({ overlay, setCoach, completeSub }) {
 setCoach("Drag the wire and connector. Click the wired switch - then try the unwired one.");
 mountGate(overlay, {
 scene: "jsWire",
 badge: "Spiral 1 · Enactive",
 title: "Wire It Up",
 pulse: true,
 ready: () => labState.jsWired && labState.jsWireTriedUnwired,
 readyText: "WHEN clicked → DO this. You just programmed the house.",
 doneLabel: "Continue ▶",
 html: n(
 "Drag a wire from the switch to the bulb, drop the connector labeled When clicked → turn on, then click the switch yourself. Try the unwired pair too - nice to look at, completely unresponsive.",
 ),
 onDone: completeSub,
 });
}

function s3_events({ overlay, setCoach, completeSub }) {
 setCoach("Event → code runs → something changes. Same pattern on every website.");
 mountGate(overlay, {
 scene: "jsFlow1",
 badge: "Spiral 1 · Iconic",
 title: "The Event Pattern",
 ready: () => true,
 html: n(
 "Something happens, code responds, something visibly changes - running behind almost every button, menu, form, and game you've ever clicked.",
 ),
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "jsCode1",
 badge: LAB_ASSET_PATHS.m3,
 html: `<h3>Spiral 1 · Symbolic</h3>
 <pre class="hh-inline-code">switch.addEventListener("click", function() {
  bulb.turnOn();
});</pre>
 <p><strong>Event</strong> · <strong>Event listener</strong> · <strong>JavaScript</strong></p>`,
 onDone: completeSub,
 });
 },
 });
}

function s4_recipe({ overlay, setCoach, completeSub }) {
 setCoach("Drag 3 steps into the recipe, name it turnOnLight, connect it to 3 switches.");
 mountGate(overlay, {
 scene: "jsRecipe",
 badge: "Spiral 2 · Enactive",
 title: "Write the Instructions",
 pulse: true,
 ready: () => (labState.jsFunctionConnected || []).length >= 3,
 readyText: "Same instructions. Three switches. Written once.",
 doneLabel: "Continue ▶",
 html: n(
 "Drag the three steps in order into the recipe card, name it turnOnLight, then drop the recipe onto the kitchen, hallway, and bedroom switches.",
 ),
 onDone: completeSub,
 });
}

function s5_functions({ overlay, setCoach, completeSub }) {
 setCoach("One master recipe - update it once, every switch follows.");
 mountGate(overlay, {
 scene: "jsIconic2",
 badge: "Spiral 2 · Iconic",
 title: "One Function, Many Callers",
 ready: () => true,
 html: n(
 "Picture a function as one master recipe card that any number of switches can point to. Update the recipe once - every connected switch instantly follows.",
 ),
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "jsCode2",
 html: `<h3>Spiral 2 · Symbolic</h3>
 <pre class="hh-inline-code">function turnOnLight() {
  bulb.color = "yellow";
  room.brightness = "high";
  sign.text = "Lights ON";
}</pre>
 <p><strong>Function</strong> · <strong>Calling a function</strong></p>`,
 onDone: completeSub,
 });
 },
 });
}

function s6_doorbell({ overlay, setCoach, completeSub }) {
 setCoach("Ring the doorbell - watch ringCount tick up in its storage box.");
 mountGate(overlay, {
 scene: "jsDoorbell",
 badge: "Spiral 3 · Enactive",
 title: "Ring the Bell",
 pulse: true,
 ready: () => (labState.jsRingCount || 0) >= 3,
 readyText: "The house remembered something between each ring.",
 doneLabel: "Continue ▶",
 html: n(
 "Tap the doorbell repeatedly. Each ring ticks the display up by one - that labeled storage box is holding the running number.",
 ),
 onDone: completeSub,
 });
}

function s7_variables({ overlay, setCoach, completeSub }) {
 setCoach("One labeled box. Contents change - the name stays.");
 mountGate(overlay, {
 scene: "jsIconic3",
 badge: "Spiral 3 · Iconic",
 title: "The Storage Box",
 ready: () => true,
 html: n(
 "A variable is one labeled box, one name, contents that can change freely over time - doorbell counters, cart totals, whether a light is on or off.",
 ),
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "jsCode3",
 html: `<h3>Spiral 3 · Symbolic</h3>
 <pre class="hh-inline-code">let ringCount = 0;

doorbell.addEventListener("click", function() {
  ringCount = ringCount + 1;
  display.text = ringCount;
});</pre>
 <p><strong>Variable</strong> · <code>let</code> · read, add, store back</p>`,
 onDone: completeSub,
 });
 },
 });
}

function s8_toggle({ overlay, setCoach, completeSub }) {
 setCoach("Assemble isOn + toggleLight + listener. Click until the bulb toggles on and off.");
 const p = () => labState.jsTogglePieces || {};
 mountGate(overlay, {
 scene: "jsToggle",
 badge: "Spiral 4 · Enactive",
 title: "Build a Real Toggle",
 pulse: true,
 ready: () => {
 const pieces = p();
 return pieces.variable && pieces.function && pieces.listener && (labState.jsToggleFlips || 0) >= 2;
 },
 readyText: "Event + variable + function = a working toggle.",
 doneLabel: "Continue ▶",
 html: n(
 "Drag the variable box, function card, and event listener into the assembly row. Then click the switch repeatedly - watch isOn and the bulb stay in sync.",
 ),
 onDone: completeSub,
 });
}

function s9_montage({ overlay, setCoach, completeSub }) {
 setCoach("Dropdowns, sliders, forms, likes - same three ingredients every time.");
 mountGate(overlay, {
 scene: "jsMontage",
 badge: "Spiral 4 · Iconic",
 title: "Real Interactivity",
 ready: () => true,
 html: n(
 "None of these are separate tricks. Every one is built from the exact same three ingredients you just used: something happens, a function responds, a variable remembers.",
 ),
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "jsSummary",
 html: `<h3>Spiral 4 · Symbolic</h3>
 <p><strong>HTML</strong> - structure (rooms) · <strong>CSS</strong> - style (paint) · <strong>JavaScript</strong> - behavior (wiring)</p>
 <p>Event + function + variable - the three ingredients behind web interactivity.</p>
 <p><em>Next: what happens when JavaScript needs to remember a whole list of things?</em></p>`,
 onDone: completeSub,
 });
 },
 });
}

function s10_closing({ overlay, setCoach, completeSub }) {
 setCoach("Watch the house come alive. Then open the spiral recap map.");
 const t0 = Date.now();
 mountGate(overlay, {
 scene: "jsClose",
 badge: "Closing",
 title: "The House Is Fully Alive",
 html: n(
 "We started with a house that looked finished but couldn't respond. Now every switch works, every click means something, and the house remembers its state. HTML gave it a body. CSS gave it a face. JavaScript just gave it a nervous system.",
 ),
 ready: () => labState.jsCloseU >= 0.85 || Date.now() - t0 > 7000,
 readyText: "Fully alive - lights, doorbell, panels.",
 doneLabel: "Open the recap map ▶",
 onDone: () => {
 setCoach("Tap a spiral number to replay, then Finish JS Clicks.");
 mountSpiralMap(overlay, {
 scene: "jsSpiral",
 title: "Your recap map",
 finishLabel: "Finish JS Clicks ▶",
 narration:
 "The four numbers are the four spirals you finished. Tap a number to replay a highlight, then finish when ready.",
 statusIdle: "Tap a number to replay, or finish now.",
 stops: [
 { n: 1, label: "1: Events" },
 { n: 2, label: "2: Functions" },
 { n: 3, label: "3: Variables" },
 { n: 4, label: "4: Toggle" },
 ],
 onDone: completeSub,
 });
 },
 });
}

const s1 = s1_opening;
const s2 = s2_wire;
const s3 = s3_events;
const s4 = s4_recipe;
const s5 = s5_functions;
const s6 = s6_doorbell;
const s7 = s7_variables;
const s8 = s8_toggle;
const s9 = s9_montage;
const s10 = s10_closing;
