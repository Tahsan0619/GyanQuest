/**
 * Backend Builder - Mission 1: Server Basics
 * Script: Opening + 4 Bruner spirals (client/server → request/response → concurrency → DNS) + recap.
 */
import { labState, LAB_ASSET_PATHS, resetServerBasicsState, initSrvSub } from "./lab-state.js?v=rest2";
import { mountGate, mountSpiralMap, mountTapContinue, badgeHtml } from "./lab-activities.js?v=rest4";

export const L1_META = {
 objective:
 "By the end of this mission, you'll explain client and server roles, request-response cycles, concurrent handling, and how DNS finds the right server.",
 bdHook:
 "Weather apps, school portals, ticket kiosks - every tap hides the same restaurant: client asks, server answers.",
 predict: {
 q: "Before a webpage fills in, what's happening during that blank flicker?",
 options: [
 "Nothing - the browser paints CSS randomly",
 "A request travels to a server and a response comes back",
 "HTML tags close themselves automatically",
 ],
 ok: 1,
 },
 kidTitle: "Server Basics",
 theme: "client & server",
 emoji: "📡",
 rewardName: "Server Scout",
 intro:
 "Every webpage load is a round trip: your browser asks, a server answers. Today we slow that invisible moment down - to the size of a restaurant, a waiter, and a kitchen.",
 everyday: ["Phone weather app", "School portal login", "Shop checkout order"],
 subTitles: [
 "Open the Restaurant",
 "Try to Order",
 "Client & Server",
 "Place an Order",
 "Request & Response",
 "Run a Busy Shift",
 "One Kitchen, Many Tables",
 "Find the Restaurant",
 "Why This Matters",
 "The Restaurant Is Open",
 ],
};

export function runL1Sub(subIndex, api) {
 const { registerTryAgain } = api;
 initSrvSub(subIndex);
 const runners = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10];
 const fn = runners[subIndex] || runners[0];
 registerTryAgain(() => {
 api.overlay.innerHTML = "";
 resetServerBasicsState();
 fn(api);
 });
 fn(api);
}

function n(text) {
 return `<p class="tiny-narration">${text}</p>`;
}

function s1_opening({ overlay, setCoach, completeSub }) {
 setCoach("Click the link - watch the blank flicker, then the page load.");
 const t0 = Date.now();
 mountGate(overlay, {
 scene: "srvOpen",
 badge: "Opening",
 title: "Server Basics",
 pulse: true,
 ready: () => labState.srvOpenReady || (labState.srvLoadPhase >= 2 && Date.now() - t0 > 3500),
 readyText: "That flicker was a round trip - ask, answer, show.",
 doneLabel: "Open the Restaurant ▶",
 html: `${badgeHtml(LAB_ASSET_PATHS.m1, "server")}
 ${n(
 "That tiny blank moment before a webpage loads is one of the most interesting round trips in technology. Your click travelled somewhere, asked a question, and got an answer back. Today we're slowing that down - to a restaurant, a waiter, and a kitchen.",
 )}`,
 onDone: completeSub,
 });
}

function s2_kitchen({ overlay, setCoach, completeSub }) {
 setCoach("Tap Call with no kitchen - then drag kitchen + hallway and try again.");
 mountGate(overlay, {
 scene: "srvKitchen1",
 badge: "Spiral 1 · Enactive",
 title: "Try to Order",
 pulse: true,
 ready: () => labState.srvCallWorked && labState.srvCallTriedEmpty,
 readyText: "Same tap - kitchen on the other end makes the difference.",
 doneLabel: "Continue ▶",
 html: n(
 "Tap the call button with no kitchen - nothing happens. Drag the kitchen onto the floor, connect the hallway, then tap again. Food travels back to the table.",
 ),
 onDone: completeSub,
 });
}

function s3_clientServer({ overlay, setCoach, completeSub }) {
 setCoach("Client asks. Server has and provides.");
 mountGate(overlay, {
 scene: "srvSplit1",
 badge: "Spiral 1 · Iconic",
 title: "Who's Cooking?",
 ready: () => true,
 html: n(
 "One side asks for things. One side holds the resources and does the work - weather apps, email, streaming: all have a customer table and a kitchen.",
 ),
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "srvTerms1",
 badge: LAB_ASSET_PATHS.m1,
 html: `<h3>Spiral 1 · Symbolic</h3>
 <p><strong>Client</strong> · <strong>Server</strong> · <strong>Network</strong></p>
 <p>Browser = client. Kitchen program = server. Hallway = network.</p>`,
 onDone: completeSub,
 });
 },
 });
}

function s4_order({ overlay, setCoach, completeSub }) {
 setCoach("Order Homepage Special (200), then Secret Page (404).");
 mountGate(overlay, {
 scene: "srvOrder2",
 badge: "Spiral 2 · Enactive",
 title: "Place an Order",
 pulse: true,
 ready: () => labState.srvOrderSuccess && labState.srvOrder404,
 readyText: "Two full round trips - success and honest not-found.",
 doneLabel: "Continue ▶",
 html: n(
 "Tap Homepage Special - ticket out, plate back. Then tap Secret Page - a 404 card comes back instead. Both are complete responses.",
 ),
 onDone: completeSub,
 });
}

function s5_requestResponse({ overlay, setCoach, completeSub }) {
 setCoach("Request out, response back - every webpage load.");
 mountGate(overlay, {
 scene: "srvLoop2",
 badge: "Spiral 2 · Iconic",
 title: "The Request Loop",
 ready: () => true,
 html: n(
 "This loop runs every time any webpage loads, any app fetches data - the same ticket-and-plate cycle, in a fraction of a second.",
 ),
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "srvTerms2",
 html: `<h3>Spiral 2 · Symbolic</h3>
 <p><strong>Request</strong> · <strong>Response</strong> · <strong>Status code</strong></p>
 <p><code>200</code> = here's what you wanted · <code>404</code> = that doesn't exist here</p>`,
 onDone: completeSub,
 });
 },
 });
}

function s6_busy({ overlay, setCoach, completeSub }) {
 setCoach('Tap Start Service - watch six tables get served from one kitchen.');
 mountGate(overlay, {
 scene: "srvBusy3",
 badge: "Spiral 3 · Enactive",
 title: "Run a Busy Shift",
 pulse: true,
 ready: () => (labState.srvOrdersHandled || 0) >= 6,
 readyText: "Six tables. One kitchen. Every order handled.",
 doneLabel: "Continue ▶",
 html: n(
 "Start service - orders arrive from multiple tables. Tickets stack briefly, the kitchen works through the queue, every table gets its plate.",
 ),
 onDone: completeSub,
 });
}

function s7_concurrent({ overlay, setCoach, completeSub }) {
 setCoach("Scale up: one server, many clients at once.");
 mountGate(overlay, {
 scene: "srvScale3",
 badge: "Spiral 3 · Iconic",
 title: "One Kitchen, Many Tables",
 ready: () => true,
 html: n(
 "A popular website's server might field thousands of orders every second, from all over the world - built to run 24/7 on dedicated hardware.",
 ),
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "srvTerms3",
 html: `<h3>Spiral 3 · Symbolic</h3>
 <p><strong>Concurrent requests</strong> - many at once, queued and served in turn.</p>
 <p>Servers run on always-on cloud hardware - not a laptop shut off at night.</p>`,
 onDone: completeSub,
 });
 },
 });
}

function s8_dns({ overlay, setCoach, completeSub }) {
 setCoach('Type PixelBistro.com - watch DNS translate name → IP → kitchen.');
 mountGate(overlay, {
 scene: "srvDns4",
 badge: "Spiral 4 · Enactive",
 title: "Find the Restaurant",
 pulse: true,
 ready: () => labState.srvDnsDone,
 readyText: "Friendly name → directory lookup → exact kitchen.",
 doneLabel: "Continue ▶",
 html: n(
 "Type a domain name in the address bar. DNS (the directory booth) looks up the real numeric IP before your request reaches the right kitchen.",
 ),
 onDone: completeSub,
 });
}

function s9_matters({ overlay, setCoach, completeSub }) {
 setCoach("Website, app, smart speaker - same chain every time.");
 mountGate(overlay, {
 scene: "srvMontage4",
 badge: "Spiral 4 · Iconic",
 title: "Why This Matters",
 ready: () => true,
 html: n(
 "The restaurant metaphor isn't a toy version - it's structurally what's really happening behind nearly everything you do online.",
 ),
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "srvTerms4",
 html: `<h3>Spiral 4 · Symbolic</h3>
 <p><strong>Domain name</strong> · <strong>IP address</strong> · <strong>DNS</strong></p>
 <p><em>Next: where does the kitchen keep its ingredients - stored data?</em></p>`,
 onDone: completeSub,
 });
 },
 });
}

function s10_closing({ overlay, setCoach, completeSub }) {
 setCoach("Watch the slowed page-load trip. Then open the recap map.");
 const t0 = Date.now();
 mountGate(overlay, {
 scene: "srvClose",
 badge: "Closing",
 title: "The Restaurant Is Open",
 html: n(
 "That blank flicker isn't blank anymore. A name looked up, a request raced out, a server prepared exactly what was asked for, and a response raced back - all in less time than a blink.",
 ),
 ready: () => labState.srvCloseU >= 0.85 || Date.now() - t0 > 7000,
 readyText: "Click → DNS → request → server → response → page.",
 doneLabel: "Open the recap map ▶",
 onDone: () => {
 setCoach("Tap a spiral number to replay, then Finish Server Basics.");
 mountSpiralMap(overlay, {
 scene: "srvSpiral",
 title: "Your recap map",
 finishLabel: "Finish Server Basics ▶",
 narration:
 "The four numbers are the four spirals you finished. Tap a number to replay a highlight, then finish when ready.",
 statusIdle: "Tap a number to replay, or finish now.",
 stops: [
 { n: 1, label: "1: Client/Server" },
 { n: 2, label: "2: Request/RES" },
 { n: 3, label: "3: Many tables" },
 { n: 4, label: "4: DNS" },
 ],
 onDone: completeSub,
 });
 },
 });
}

const s1 = s1_opening;
const s2 = s2_kitchen;
const s3 = s3_clientServer;
const s4 = s4_order;
const s5 = s5_requestResponse;
const s6 = s6_busy;
const s7 = s7_concurrent;
const s8 = s8_dns;
const s9 = s9_matters;
const s10 = s10_closing;
