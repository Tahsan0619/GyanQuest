/**
 * Web Dev Studio: Mission 2: CSS Style
 * Script: Opening + 4 Bruner spirals (selectors → box model → size/align → cascade) + recap map.
 */
import { labState, LAB_ASSET_PATHS, resetCssStyleState } from "./lab-state.js?v=csspaint1";
import { mountGate, mountSpiralMap, mountTapContinue, badgeHtml } from "./lab-activities.js?v=csspaint3";

export const L2_META = {
 objective:
 "By the end of this mission, you'll explain CSS selectors, the box model, size and alignment, and how cascading stylesheets restyle many rooms at once.",
 bdHook:
 "School posters, shop cards, rickshaw ads: color, spacing, and alignment are CSS making the HTML house livable.",
 predict: {
 q: "The HTML house from Mission 1 is built. What's missing before it feels readable?",
 options: [
 "More HTML tags nested deeper",
 "CSS: color, spacing, borders, and alignment on top of structure",
 "Deleting the footer tag entirely",
 ],
 ok: 1,
 },
 kidTitle: "CSS Style",
 theme: "paint & layout",
 emoji: "🎨",
 rewardName: "Style Star",
 intro:
 "The house you built is structurally perfect, but flat, cramped, and unlivable. CSS is the paintbrush, ruler, and decorating plan that makes it somewhere worth visiting.",
 everyday: ["School poster colors", "Shop product card gaps", "Readable spacing on a phone"],
 subTitles: [
 "Grab the Paintbrush",
 "Point and Paint",
 "Selectors & Rules",
 "Box Model Lab",
 "Four Layers",
 "Resize & Align",
 "Alignment Gallery",
 "Style Them All",
 "One Stylesheet",
 "From Blueprint to Home",
 ],
};

export function runL2Sub(subIndex, api) {
 const { registerTryAgain } = api;
 resetCssStyleState();
 const runners = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10];
 const fn = runners[subIndex] || runners[0];
 registerTryAgain(() => {
 api.overlay.innerHTML = "";
 resetCssStyleState();
 fn(api);
 });
 fn(api);
}

function n(text) {
 return `<p class="tiny-narration">${text}</p>`;
}

function s1_opening({ overlay, setCoach, completeSub }) {
 setCoach("The finished HTML house: no color, no spacing. Grab the paintbrush.");
 const t0 = Date.now();
 mountGate(overlay, {
 scene: "cssOpen",
 badge: "Opening",
 title: "CSS Style",
 pulse: true,
 ready: () => labState.cssOpenReady || Date.now() - t0 > 2800,
 readyText: "Structure is done. Style makes it livable.",
 doneLabel: "Grab the Paintbrush ▶",
 html: `${badgeHtml(LAB_ASSET_PATHS.m2, "css")}
 ${n(
 "Here's the house you built last time. Every room is exactly where it should be, but look at it. No color, no spacing, everything crammed edge to edge. Structurally perfect, and completely unlivable. Today we're picking up a paintbrush, a ruler, and a decorating plan.",
 )}`,
 onDone: completeSub,
 });
}

function s2_paint({ overlay, setCoach, completeSub }) {
 setCoach("Click Pointer, select main, paint it. Then select header with a different color.");
 mountGate(overlay, {
 scene: "cssPaint",
 badge: "Spiral 1 · Enactive",
 title: "Point and Paint",
 pulse: true,
 ready: () => labState.cssPaintMain && labState.cssPaintHeader,
 readyText: "Two rooms, two independent colors. That's CSS.",
 doneLabel: "Continue ▶",
 html: n(
 "Click the pointer on a room: that's the selector. Drag a color onto it: property and value. Each room only changes when you specifically point at it.",
 ),
 onDone: completeSub,
 });
}

function s3_selectors({ overlay, setCoach, completeSub }) {
 setCoach("Selector → property → value. Then read the formal rule parts.");
 mountGate(overlay, {
 scene: "cssRule",
 badge: "Spiral 1 · Iconic",
 title: "One Style Rule",
 ready: () => true,
 html: n(
 "Every style you'll ever write is built from three pieces: which room you're pointing at, what you want to change, and what you want to change it to.",
 ),
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "cssTerms",
 badge: LAB_ASSET_PATHS.m2,
 html: `<h3>Spiral 1 · Symbolic</h3>
 <pre class="hh-inline-code">main {
  background-color: lightblue;
}</pre>
 <p><strong>Selector</strong> · <strong>Property</strong> · <strong>Value</strong> · <strong>Declaration</strong> · <strong>Rule</strong></p>`,
 onDone: completeSub,
 });
 },
 });
}

function s4_box({ overlay, setCoach, completeSub }) {
 setCoach("Move all three sliders: padding, then border, then margin. Feel the difference.");
 mountGate(overlay, {
 scene: "cssBox",
 badge: "Spiral 2 · Enactive",
 title: "Box Model Lab",
 pulse: true,
 ready: () => labState.cssPaddingTouched && labState.cssBorderTouched && labState.cssMarginTouched,
 readyText: "Padding inside · border is the wall · margin outside.",
 doneLabel: "Continue ▶",
 html: n(
 "Padding pushes furniture from the walls. Border thickens the wall itself. Margin pushes neighboring rooms away. Do not skip any slider: mixing these up is a top beginner mistake.",
 ),
 onDone: completeSub,
 });
}

function s5_layers({ overlay, setCoach, completeSub }) {
 setCoach("Four nested layers: content, padding, border, margin.");
 mountGate(overlay, {
 scene: "cssBoxCut",
 badge: "Spiral 2 · Iconic",
 title: "Four Layers",
 ready: () => true,
 html: n(
 "This four-layer structure exists around absolutely everything on a webpage, whether you've styled it or not.",
 ),
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "cssBoxCode",
 html: `<h3>Spiral 2 · Symbolic</h3>
 <p><strong>The box model:</strong> content → padding → border → margin.</p>
 <pre class="hh-inline-code">main {
  padding: 20px;
  border: 3px solid black;
  margin: 40px;
}</pre>`,
 onDone: completeSub,
 });
 },
 });
}

function s6_resize({ overlay, setCoach, completeSub }) {
 setCoach("Drag width and height. Tap Left, Center, and Right alignment.");
 mountGate(overlay, {
 scene: "cssResize",
 badge: "Spiral 3 · Enactive",
 title: "Resize & Align",
 pulse: true,
 ready: () => {
 const t = labState.cssAlignTried || {};
 return labState.cssSizeTouched && t.left && t.center && t.right;
 },
 readyText: "Room size and furniture placement: independent choices.",
 doneLabel: "Continue ▶",
 html: n(
 "How big a room is, and where things sit inside it, are two genuinely different decisions. CSS lets you control both on purpose.",
 ),
 onDone: completeSub,
 });
}

function s7_gallery({ overlay, setCoach, completeSub }) {
 setCoach("Same room, same text: four alignments side by side.");
 mountGate(overlay, {
 scene: "cssGallery",
 badge: "Spiral 3 · Iconic",
 title: "Alignment Gallery",
 ready: () => true,
 html: n(
 "Alignment isn't decoration on top of the design. For a lot of designers, it basically is the design.",
 ),
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "cssSizeCode",
 html: `<h3>Spiral 3 · Symbolic</h3>
 <pre class="hh-inline-code">main {
  width: 600px;
  height: 400px;
  text-align: center;
}</pre>`,
 onDone: completeSub,
 });
 },
 });
}

function s8_cascade({ overlay, setCoach, completeSub }) {
 setCoach("Apply .cozy-room to 3 rooms, then override #reading-nook only.");
 mountGate(overlay, {
 scene: "cssCascade",
 badge: "Spiral 4 · Enactive",
 title: "Style Them All",
 pulse: true,
 ready: () => (labState.cssCozyRooms || []).length >= 3 && labState.cssOverrideNook,
 readyText: "Shared class, then one specific override.",
 doneLabel: "Continue ▶",
 html: n(
 "You're almost never styling one room at a time in a real project. Shared styles apply everywhere, then small exceptions only where needed.",
 ),
 onDone: completeSub,
 });
}

function s9_stylesheet({ overlay, setCoach, completeSub }) {
 setCoach("Change the stylesheet color: every cozy room updates at once.");
 mountGate(overlay, {
 scene: "cssSheet",
 badge: "Spiral 4 · Iconic",
 title: "One Stylesheet",
 ready: () => true,
 html: n(
 "This is why CSS lives in its own file from HTML: change one shared stylesheet, and every connected room updates instantly.",
 ),
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "cssSummary",
 html: `<h3>Spiral 4 · Symbolic</h3>
 <p><code>.cozy-room</code>: class, many elements. <code>#reading-nook</code>: id, one element.</p>
 <p><strong>Cascading</strong>: more specific rules override general ones.</p>
 <p><em>Next: JavaScript makes the house react when you click.</em></p>`,
 onDone: completeSub,
 });
 },
 });
}

function s10_closing({ overlay, setCoach, completeSub }) {
 setCoach("Watch the house transform. Then open the spiral recap map.");
 const t0 = Date.now();
 mountGate(overlay, {
 scene: "cssClose",
 badge: "Closing",
 title: "From Blueprint to Home",
 html: n(
 "We started with a house that was structurally perfect and completely unlivable. Now you know how to fix that: selectors, the box model, size and alignment, and one cascading stylesheet.",
 ),
 ready: () => labState.cssCloseU >= 0.85 || Date.now() - t0 > 7000,
 readyText: "Color, space, alignment. A home worth staying in.",
 doneLabel: "Open the recap map ▶",
 onDone: () => {
 setCoach("Tap a spiral number to replay, then Finish CSS Style.");
 mountSpiralMap(overlay, {
 scene: "cssSpiral",
 title: "Your recap map",
 finishLabel: "Finish CSS Style ▶",
 narration:
 "The four numbers are the four spirals you finished. Tap a number to replay a highlight, then finish when ready.",
 statusIdle: "Tap a number to replay, or finish now.",
 stops: [
 { n: 1, label: "1: Selectors & color" },
 { n: 2, label: "2: Box model" },
 { n: 3, label: "3: Size & align" },
 { n: 4, label: "4: Cascade" },
 ],
 onDone: completeSub,
 });
 },
 });
}

const s1 = s1_opening;
const s2 = s2_paint;
const s3 = s3_selectors;
const s4 = s4_box;
const s5 = s5_layers;
const s6 = s6_resize;
const s7 = s7_gallery;
const s8 = s8_cascade;
const s9 = s9_stylesheet;
const s10 = s10_closing;
