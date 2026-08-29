/**
 * ICT - Mission 1: Computer Bits
 * Script: Opening + 4 Bruner spirals (bits → CPU → memory/storage → why it matters) + recap.
 * Metaphor: a computer is a kitchen.
 */
import { initBitsSub, resetBitsKitchenState, LAB_ASSET_PATHS, labState } from "./lab-state.js";
import { mountGate, mountSpiralMap, mountTapContinue, badgeHtml } from "./lab-activities.js";

export const L1_META = {
 objective:
 "By the end of this mission, you'll explain bits, bytes, CPU, RAM, and storage using the kitchen metaphor - in your own words.",
 bdHook:
 "Bangladesh everyday: a phone waking up in a second, a sluggish school PC with too many tabs, reading a laptop spec sheet.",
 predict: {
 q: "Before we start - underneath everything a computer shows you, what's the smallest unit of information?",
 options: [
 "A bit - one switch that's only ever fully on or fully off",
 "A pixel on the screen",
 "A letter in a word document",
 ],
 ok: 0,
 },
 kidTitle: "Bits: Inside the Machine's Kitchen",
 theme: "bits, CPU, RAM & storage",
 emoji: "💻",
 rewardName: "Kitchen Scout",
 intro:
 "A computer is a kitchen. Every single thing it knows is ultimately just a pattern of light switches - a bit. The CPU is the chef. RAM is the countertop. Storage is the pantry. Today we shrink down, meet those switches, meet the chef, and find out exactly where a computer keeps everything it knows.",
 everyday: ["Phone waking up in a second", "School PC feeling sluggish", "Reading a laptop spec sheet"],
 subTitles: [
 "Open the Kitchen",
 "Flip the Switches",
 "Bits → Bytes",
 "Give the Chef an Instruction",
 "The CPU Loop",
 "Counter vs Pantry",
 "RAM & Storage",
 "Open a Program",
 "Read the Spec Sheet",
 "The Kitchen, Fully Understood",
 ],
};

export function runL1Sub(subIndex, api) {
 const { registerTryAgain } = api;
 initBitsSub(subIndex);
 const runners = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10];
 const fn = runners[subIndex] || runners[0];
 registerTryAgain(() => {
 api.overlay.innerHTML = "";
 resetBitsKitchenState();
 initBitsSub(subIndex);
 fn(api);
 });
 fn(api);
}

function n(text) {
 return `<p class="tiny-narration">${text}</p>`;
}

function s1_opening({ overlay, setCoach, completeSub }) {
 setCoach("Tap Open the Kitchen on the canvas - a laptop wakes and loads apps in seconds.");
 const t0 = Date.now();
 mountGate(overlay, {
 scene: "bitsOpen",
 badge: "Opening",
 title: "Bits: Inside the Machine's Kitchen",
 pulse: true,
 autoAdvanceOnReady: true,
 ready: () => labState.bitsOpenReady || Date.now() - t0 > 6000,
 readyText: "Billions of tiny switches - that's the entire secret.",
 doneLabel: "Continue ▶",
 controlsHtml: `<p class="drag-hint">Or tap here if the canvas button is hard to reach:</p>
 <button type="button" class="btn secondary" id="gate-open-kitchen">Open the Kitchen →</button>`,
 bind: (host, { finish, signalGateReady: signal }) => {
 host.querySelector("#gate-open-kitchen")?.addEventListener("click", () => {
 labState.bitsOpenReady = true;
 signal?.({ forceAdvance: true });
 finish();
 });
 },
 html: `${badgeHtml(LAB_ASSET_PATHS.m1, "kitchen")}
 ${n(
 "In the time it took that laptop to wake up, it just performed billions of individual actions - and every single one of them, underneath absolutely everything you just saw, was nothing more than a tiny switch being flipped on or off. That's genuinely the entire secret. Today we're going to shrink down, meet those switches, meet the chef who uses them, and find out exactly where a computer keeps everything it knows.",
 )}`,
 onDone: completeSub,
 });
}

function s2_switches({ overlay, setCoach, completeSub }) {
 setCoach("Flip switches on the canvas - watch the binary and decimal readout update live.");
 mountGate(overlay, {
 scene: "bitsSwitches1",
 badge: "Spiral 1 · Enactive",
 title: "The Only Language a Computer Speaks: Bits",
 pulse: true,
 ready: () => (labState.bitsSwitchFlips || 0) >= 2,
 readyText: "8 switches → 256 unique patterns. That's the whole foundation.",
 doneLabel: "Continue ▶",
 html: n(
 "Each one of those switches is either on or off, full stop - no dimmer setting, no in-between. And yet, just 8 of them together can already represent 256 completely different values. This is genuinely the entire foundation everything else in this lesson is built on top of.",
 ),
 onDone: completeSub,
 });
}

function s3_bits_bytes({ overlay, setCoach, completeSub }) {
 setCoach("Watch the same pattern become a number, a letter, and a pixel - then name the rule.");
 mountGate(overlay, {
 scene: "bitsReinterpret1",
 badge: "Spiral 1 · Iconic",
 title: "Same Pattern, Three Meanings",
 ready: () => true,
 html: n(
 "This is the part that surprises people the most: a computer doesn't have a separate secret method for storing text versus numbers versus pictures. It's all switches, all the way down - just interpreted differently depending on the job at hand.",
 ),
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "bitsTerms1",
 html: `<h3>Spiral 1 · Symbolic</h3>
 <p><strong>Bit</strong> - a single binary digit: 0 or 1, off or on. The smallest possible unit of information.</p>
 <p><strong>Byte</strong> - a group of 8 bits, able to represent 256 different values.</p>`,
 onDone: completeSub,
 });
 },
 });
}

function s4_chef({ overlay, setCoach, completeSub }) {
 setCoach("Drag 3 and 5 to the chef, Execute once slowly - then slide the speed toward fast.");
 mountGate(overlay, {
 scene: "bitsChef2",
 badge: "Spiral 2 · Enactive",
 title: "The Chef: What Does the CPU Actually Do?",
 pulse: true,
 ready: () => labState.bitsChefExecuted && (labState.bitsSpeedLevel || 0) >= 0.5,
 readyText: "Real CPUs don't do one of these a second. They do billions.",
 doneLabel: "Continue ▶",
 html: n(
 "You just watched the exact same basic cycle happen once, slowly, and then thousands of times, rapidly - and a real CPU does this same simple cycle billions of times every single second, every one of those instructions built from nothing more exotic than bits, exactly like the ones you flipped a minute ago.",
 ),
 onDone: completeSub,
 });
}

function s5_loop({ overlay, setCoach, completeSub }) {
 setCoach("Watch the 4-step instruction loop cycle - then read the formal CPU terms.");
 mountGate(overlay, {
 scene: "bitsLoop2",
 badge: "Spiral 2 · Iconic",
 title: "Read → Data → Compute → Result",
 ready: () => true,
 html: n(
 "Every single thing your computer does - loading a photo, running a game, opening this very lesson - is this same tiny loop, repeated an almost unimaginable number of times per second. Nothing mysterious is happening at the center of a computer. Just this loop, running unbelievably fast.",
 ),
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "bitsTerms2",
 html: `<h3>Spiral 2 · Symbolic</h3>
 <p><strong>CPU (Central Processing Unit)</strong> - executes instructions and performs calculations; the computer's "brain."</p>
 <p><strong>Instruction</strong> - one single operation the CPU carries out (like adding two numbers).</p>
 <p><strong>Clock speed</strong> - instruction cycles per second, measured in hertz (GHz = billions per second).</p>`,
 onDone: completeSub,
 });
 },
 });
}

function s6_kitchen({ overlay, setCoach, completeSub }) {
 setCoach("Fetch from counter (fast), then pantry (slower walk), then Power Off - watch the counter wipe.");
 mountGate(overlay, {
 scene: "bitsKitchen3",
 badge: "Spiral 3 · Enactive",
 title: "The Countertop vs. the Pantry",
 pulse: true,
 ready: () => labState.bitsFetchCounter && labState.bitsFetchPantry && labState.bitsPowerOff,
 readyText: "Counter: fast but forgetful. Pantry: slower but permanent.",
 doneLabel: "Continue ▶",
 html: n(
 "Two genuinely different trade-offs, both just demonstrated: the countertop is far faster to grab from, but everything on it disappears the moment the kitchen shuts down. The pantry is slower to fetch from, but it doesn't care whether the kitchen is open or closed - everything in it just stays put.",
 ),
 onDone: completeSub,
 });
}

function s7_memory({ overlay, setCoach, completeSub }) {
 setCoach("Compare speed and permanence - then name RAM and storage.");
 mountGate(overlay, {
 scene: "bitsCompare3",
 badge: "Spiral 3 · Iconic",
 title: "Fast but Forgetful · Slower but Permanent",
 ready: () => true,
 html: n(
 "Neither one of these is simply 'better' - a kitchen genuinely needs both. All-countertop, no pantry, and you'd lose everything the second the power went out. All-pantry, no countertop, and even the simplest task would mean a slow walk across the room every single time.",
 ),
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "bitsTerms3",
 html: `<h3>Spiral 3 · Symbolic</h3>
 <p><strong>RAM (Random Access Memory)</strong> - fast, temporary working memory; <em>volatile</em> (lost without power).</p>
 <p><strong>Storage (SSD / hard drive)</strong> - slower, long-term memory; <em>non-volatile</em> (stays without power).</p>
 <p><em>"Volatile" just means: disappears without power. RAM is volatile. Storage is not.</em></p>`,
 onDone: completeSub,
 });
 },
 });
}

function s8_program({ overlay, setCoach, completeSub }) {
 setCoach("Open the program and tap through all 4 steps - including the cramped-kitchen slowdown.");
 mountGate(overlay, {
 scene: "bitsProgram4",
 badge: "Spiral 4 · Enactive",
 title: "How It All Connects",
 pulse: true,
 ready: () => (labState.bitsProgramStep || 0) >= 4 && labState.bitsCrampedSeen,
 readyText: "Storage → RAM → CPU → screen. Lag = a full counter.",
 doneLabel: "Continue ▶",
 html: n(
 "This is genuinely the entire journey every program takes, every time you open it: pulled from storage into RAM, worked on by the CPU, shown to you as a result. And that cramped-kitchen slowdown you just watched is exactly what's happening on a real computer that feels sluggish with too many programs open at once - not a broken computer, just a countertop that's run out of space.",
 ),
 onDone: completeSub,
 });
}

function s9_spec({ overlay, setCoach, completeSub }) {
 setCoach("Hover each spec line - it connects to the kitchen. Then read the summary.");
 mountGate(overlay, {
 scene: "bitsSpec4",
 badge: "Spiral 4 · Iconic",
 title: "Read a Spec Sheet",
 ready: () => true,
 html: n(
 "Every one of those confusing numbers on a computer's spec sheet is really just describing the size of the countertop, the size of the pantry, and how fast the chef can work. You now genuinely know what you're looking at, and why each of those numbers matters for how a computer actually feels to use.",
 ),
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "bitsTerms4",
 html: `<h3>Spiral 4 · Symbolic</h3>
 <ul class="bk-summary-list">
 <li><strong>Bit → Byte</strong> - basic units of information</li>
 <li><strong>CPU</strong> - executes instructions (GHz)</li>
 <li><strong>RAM</strong> - fast, volatile working memory</li>
 <li><strong>Storage</strong> - slower, non-volatile long-term memory</li>
 </ul>
 <p><em>Next: once the CPU produces a result, how does it get to your screen or printer?</em></p>`,
 onDone: completeSub,
 });
 },
 });
}

function s10_closing({ overlay, setCoach, completeSub }) {
 setCoach("Watch the laptop wake with the ghost kitchen underneath - then open the recap map.");
 const t0 = Date.now();
 mountGate(overlay, {
 scene: "bitsClose",
 badge: "Closing",
 title: "The Kitchen, Fully Understood",
 html: n(
 "That laptop waking up in under a second isn't mysterious anymore. Underneath it, exactly what you'd expect: billions of switches, a chef working through instructions faster than you can blink, a countertop holding exactly what's needed right now, and a pantry quietly keeping everything else safe. That's not a metaphor stretched to fit anymore. That's genuinely what's happening, every single time you turn a computer on.",
 ),
 ready: () => labState.bitsCloseU >= 0.5 || Date.now() - t0 > 7000,
 readyText: "The kitchen, fully understood.",
 doneLabel: "Open the recap map ▶",
 onDone: () => {
 setCoach("Tap a spiral number to replay, then finish Bits: Inside the Machine's Kitchen.");
 mountSpiralMap(overlay, {
 scene: "bitsSpiral",
 title: "Your recap map",
 finishLabel: "Finish Bits: Inside the Machine's Kitchen ▶",
 narration:
 "The four numbers are the four spirals you finished. Tap a number (on the canvas or here) to replay a short highlight. When you are ready, tap Finish.",
 statusIdle: "Tap a number to replay, or finish now.",
 stops: [
 { n: 1, label: "1: Bits" },
 { n: 2, label: "2: CPU" },
 { n: 3, label: "3: Memory" },
 { n: 4, label: "4: Connect" },
 ],
 onDone: completeSub,
 });
 },
 });
}

const s1 = s1_opening;
const s2 = s2_switches;
const s3 = s3_bits_bytes;
const s4 = s4_chef;
const s5 = s5_loop;
const s6 = s6_kitchen;
const s7 = s7_memory;
const s8 = s8_program;
const s9 = s9_spec;
const s10 = s10_closing;
