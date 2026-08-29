/**
 * Bio Explorer Mission 2: Cell City
 * Script: Opening + 4 Bruner spirals (cities of cells → animal workers → plant upgrades → cooperation) + recap.
 */
import { bioLabState, resetCellState, BIO_ASSET_PATHS, pulseSuccessFeedback } from "./bio-state.js?v=cellplant2";
import {
 mountGate,
 mountSpiralMap,
 mountCellZoom,
 mountCellCompare,
 mountCellTour,
 mountCellMorph,
 mountCellPlant,
 mountCellPair,
 mountCellLine,
 mountCellScale,
 badgeHtml,
} from "./bio-activities.js?v=cellplant2";

export const L2_META = {
 objective:
 "By the end of this mission, you'll be able to name the main parts of animal and plant cells, map each to a city job, and explain how cells cooperate as tissues, organs, and organisms.",
 bdHook: "Last time asked what does MRS GREN's work inside a living thing. Today: Cell City.",
 predict: {
 q: "If living things do MRS GREN's seven jobs, what is actually doing that work inside them?",
 options: [
 "A single giant organ the size of the whole body",
 "Tiny complete units called cells, each with workers (organelles) doing specific jobs",
 "Only the brain, and everything else is packing material",
 ],
 ok: 1,
 },
 kidTitle: "Cell City",
 theme: "cells as working cities",
 emoji: "🔬",
 rewardName: "Cell Scout",
 intro:
 "Last time ended on a question: if living things are doing all seven of MRS GREN's jobs, what is actually doing the work inside them? From far enough away, a city at night and a piece of living tissue under a microscope look almost the same: countless small units, each doing its own job, all working together. That is not a coincidence, and it is not just a nice metaphor. Every living thing you have ever met, including you, is genuinely built exactly like a city, just impossibly small. Welcome to Cell City. Let's go meet the residents.",
 everyday: [
 "A city glowing at night",
 "Skin that turns out to be packed cells",
 "A leaf that makes food with its own solar panels",
 ],
 subTitles: [
 "Enter the city",
 "The zoom tool",
 "City blocks and cell theory",
 "Tour the city",
 "City map to diagram",
 "Upgrade the city",
 "Animal vs plant",
 "Run the production line",
 "Cells to organisms",
 "A city of trillions",
 ],
};

export function runL2Sub(subIndex, api) {
 const { registerTryAgain } = api;
 resetCellState();
 const runners = [
 sub1_opening,
 sub2_zoom,
 sub3_compare,
 sub4_tour,
 sub5_morph,
 sub6_plant,
 sub7_pair,
 sub8_line,
 sub9_scale,
 sub10_closing,
 ];
 const fn = runners[subIndex] || runners[0];
 registerTryAgain(() => {
 api.overlay.innerHTML = "";
 resetCellState();
 fn(api);
 });
 fn(api);
}

function sub1_opening({ overlay, setCoach, completeSub }) {
 setCoach("A night city becomes tissue. Then enter Cell City.");
 mountGate(overlay, {
 scene: "cellOpen",
 badge: "Opening",
 title: "Cell City",
 pulse: true,
 status: "Watch the city become tissue. Then enter.",
 ready: () => bioLabState.cellOpenU >= 0.4 || bioLabState.cellSeen,
 readyText: "The city and the tissue are the same busy pattern.",
 doneLabel: "Enter the City →",
 html: `${badgeHtml(BIO_ASSET_PATHS.cell, "cell")}
 ${n(
 "Last time ended on a question: if living things are doing all seven of MRS GREN's jobs, what is actually doing the work inside them? From far enough away, a city at night and a piece of living tissue under a microscope look almost the same: countless small units, each doing its own job, all working together. That is not a coincidence. Every living thing you have ever met, including you, is genuinely built exactly like a city, just impossibly small. Welcome to Cell City.",
 )}`,
 bind(host) {
 const btn = host.querySelector("#tiny-gate-go");
 btn?.addEventListener("click", () => {
 bioLabState.cellSeen = true;
 });
 window.__arena?.setIntentHandler?.((intent) => {
 if (intent.type !== "CANVAS_TAP") return;
 if (intent.meta?.action === "enter") {
 bioLabState.cellSeen = true;
 pulseSuccessFeedback(200);
 if (btn && !btn.disabled) btn.click();
 }
 });
 },
 onDone: completeSub,
 });
}

function sub2_zoom({ overlay, setCoach, completeSub }) {
 setCoach("Zoom the hand three times. The leaf is optional.");
 mountCellZoom(overlay, { onDone: completeSub });
}

function sub3_compare({ overlay, setCoach, completeSub }) {
 setCoach("City block beside a cell, then the three rules of cell theory.");
 mountCellCompare(overlay, { onDone: completeSub });
}

function sub4_tour({ overlay, setCoach, completeSub }) {
 setCoach("Visit all six workers. Replay is allowed. Do not skip a stop.");
 mountCellTour(overlay, { onDone: completeSub });
}

function sub5_morph({ overlay, setCoach, completeSub }) {
 setCoach("Watch city jobs become real organelles, then lock the formal names.");
 mountCellMorph(overlay, { onDone: completeSub });
}

function sub6_plant({ overlay, setCoach, completeSub }) {
 setCoach("Add wall, chloroplasts, and the water tower. All three required.");
 mountCellPlant(overlay, { onDone: completeSub });
}

function sub7_pair({ overlay, setCoach, completeSub }) {
 setCoach("Same core team. Then the animal vs plant table.");
 mountCellPair(overlay, { onDone: completeSub });
}

function sub8_line({ overlay, setCoach, completeSub }) {
 setCoach("Send Protein X in order: nucleus, ribosome, ER, Golgi, membrane.");
 mountCellLine(overlay, { onDone: completeSub });
}

function sub9_scale({ overlay, setCoach, completeSub }) {
 setCoach("Cell to organism, then unicellular vs multicellular.");
 mountCellScale(overlay, { onDone: completeSub });
}

function sub10_closing({ overlay, setCoach, completeSub }) {
 setCoach("A city of trillions, then a recap map of the four spirals.");
 const t0 = Date.now();
 mountGate(overlay, {
 scene: "cellClose",
 badge: "Closing",
 title: "You are a city of trillions",
 html: n(
 "You walked into Cell City today thinking of your body as one single thing. It isn't. It's a cooperating civilization of trillions of individual cells, each one a complete, working city in its own right, each one running City Hall, Power Plants, Factories, and Border Walls every second of your life, without you ever having to manage a single one of them yourself. That's not a metaphor anymore. That's just what you actually are.",
 ),
 ready: () => bioLabState.cellCloseU >= 0.95 || Date.now() - t0 > 8000,
 readyText: "The silhouette is made of the same glowing cells.",
 doneLabel: "Open the spiral map ▶",
 onDone: () => {
 setCoach("Last screen: a recap map of the four spirals. Tap a number to replay, then Finish Cell City.");
 mountSpiralMap(overlay, {
 scene: "cellSpiral",
 title: "Your recap map",
 finishLabel: "Finish Cell City ▶",
 narration:
 "This last screen is a recap, not a new puzzle. The four numbers are the four loops you already finished. Tap a number (on the canvas or here) to replay a short highlight. When you are ready, tap Finish Cell City.",
 statusIdle: "Tap a number to replay, or finish now.",
 stops: [
 { n: 1, label: "1: Cities of cells" },
 { n: 2, label: "2: Animal workers" },
 { n: 3, label: "3: Plant upgrades" },
 { n: 4, label: "4: How they cooperate" },
 ],
 onDone: completeSub,
 });
 },
 });
}

function n(text) {
 return `<p class="tiny-narration">${text}</p>`;
}
