/**
 * Bio Explorer Mission 3: Plant Power
 * Script: Opening + 4 Bruner spirals (plant body → kitchen → plumbing → next generation) + recap.
 */
import { bioLabState, resetPlantState, BIO_ASSET_PATHS, pulseSuccessFeedback } from "./bio-state.js?v=cellplant2";
import { mountGate, mountSpiralMap, badgeHtml } from "./bio-activities.js?v=cellplant2";
import {
 mountPlantBuild,
 mountPlantOrgans,
 mountPlantKitchen,
 mountPlantPhoto,
 mountPlantTrace,
 mountPlantHighways,
 mountPlantBloom,
 mountPlantCycle,
} from "./plant-activities.js?v=cellplant2";

export const L3_META = {
 objective:
 "By the end of this mission, you'll be able to name a plant's four organs, run photosynthesis as inputs and outputs, explain xylem and phloem, and tell the story from flower to seed.",
 bdHook: "Last time we were inside a plant cell. Today we zoom out to the whole machine.",
 predict: {
 q: "This plant never eats a meal. How does it still grow?",
 options: [
 "It eats soil the way we eat food",
 "It makes food from sunlight, water, and air",
 "It only grows if someone pours sugar on the leaves",
 ],
 ok: 1,
 },
 kidTitle: "Plant Power",
 theme: "how a whole plant works",
 emoji: "🍃",
 rewardName: "Plant Explorer",
 intro:
 "We've already met a single plant cell, with its chloroplasts, cell wall, and water tower. Today we zoom all the way back out. This plant never eats a meal, never drinks from a cup, and never moves from its windowsill, and yet it's pulling water up with no pump, building its own food out of sunlight and air, and growing entirely new parts of itself, all at once. Welcome to Plant Power.",
 everyday: [
 "A potted plant on a windowsill",
 "A leaf cooking food from sunlight and air",
 "Water rising up a stem with no pump",
 ],
 subTitles: [
 "Meet the plant",
 "Build a plant",
 "Four organs",
 "Stock the kitchen",
 "The photosynthesis equation",
 "Trace the routes",
 "Xylem and phloem",
 "Pollinate the flower",
 "The life cycle",
 "The whole machine",
 ],
};

export function runL3Sub(subIndex, api) {
 const { registerTryAgain } = api;
 resetPlantState();
 const runners = [
 sub1_opening,
 sub2_build,
 sub3_organs,
 sub4_kitchen,
 sub5_photo,
 sub6_trace,
 sub7_highways,
 sub8_bloom,
 sub9_cycle,
 sub10_closing,
 ];
 const fn = runners[subIndex] || runners[0];
 registerTryAgain(() => {
 api.overlay.innerHTML = "";
 resetPlantState();
 fn(api);
 });
 fn(api);
}

function sub1_opening({ overlay, setCoach, completeSub }) {
 setCoach("A windowsill plant, then meet the whole machine.");
 mountGate(overlay, {
 scene: "plantOpen",
 badge: "Opening",
 title: "Plant Power",
 pulse: true,
 status: "Watch the sill. Then meet the plant.",
 ready: () => bioLabState.plantOpenU >= 0.4 || bioLabState.plantSeen,
 readyText: "The plant is running more than one job at once.",
 doneLabel: "Meet the Plant →",
 html: `${badgeHtml(BIO_ASSET_PATHS.plant, "plant")}
 ${n(
 "This plant never eats a meal, never drinks from a cup, and never moves from this windowsill, and yet it's quietly running one of the most impressive operations in all of biology. It's pulling water up from the ground with no pump, building its own food out of sunlight and air, and growing entirely new parts of itself, all at once, right now. We've already met a single plant cell. Today we zoom out and meet the whole machine that cell is a part of. Welcome to Plant Power.",
 )}`,
 bind(host) {
 const btn = host.querySelector("#tiny-gate-go");
 btn?.addEventListener("click", () => {
 bioLabState.plantSeen = true;
 });
 window.__arena?.setIntentHandler?.((intent) => {
 if (intent.type !== "CANVAS_TAP") return;
 if (intent.meta?.action === "meet") {
 bioLabState.plantSeen = true;
 pulseSuccessFeedback(200);
 if (btn && !btn.disabled) btn.click();
 }
 });
 },
 onDone: completeSub,
 });
}

function sub2_build({ overlay, setCoach, completeSub }) {
 setCoach("Place roots, stem, leaves, and flower. All four required.");
 mountPlantBuild(overlay, { onDone: completeSub });
}

function sub3_organs({ overlay, setCoach, completeSub }) {
 setCoach("Four jobs, then the four organ names.");
 mountPlantOrgans(overlay, { onDone: completeSub });
}

function sub4_kitchen({ overlay, setCoach, completeSub }) {
 setCoach("Three ingredients in, then two products out. Do not skip a chute.");
 mountPlantKitchen(overlay, { onDone: completeSub });
}

function sub5_photo({ overlay, setCoach, completeSub }) {
 setCoach("A real leaf factory, then the photosynthesis equation.");
 mountPlantPhoto(overlay, { onDone: completeSub });
}

function sub6_trace({ overlay, setCoach, completeSub }) {
 setCoach("Water up first, then sugar down. Two separate routes.");
 mountPlantTrace(overlay, { onDone: completeSub });
}

function sub7_highways({ overlay, setCoach, completeSub }) {
 setCoach("Two one-way highways, then xylem, phloem, and transpiration.");
 mountPlantHighways(overlay, { onDone: completeSub });
}

function sub8_bloom({ overlay, setCoach, completeSub }) {
 setCoach("Pollinate first, then match each seed to how it travels.");
 mountPlantBloom(overlay, { onDone: completeSub });
}

function sub9_cycle({ overlay, setCoach, completeSub }) {
 setCoach("The life cycle, then pollination, fertilization, and dispersal.");
 mountPlantCycle(overlay, { onDone: completeSub });
}

function sub10_closing({ overlay, setCoach, completeSub }) {
 setCoach("The whole machine, then a recap map of the four spirals.");
 const t0 = Date.now();
 mountGate(overlay, {
 scene: "plantClose",
 badge: "Closing",
 title: "The whole machine",
 html: n(
 "We started today looking at a plant that seemed to be doing nothing at all. Now you know better. It's pulling water up with no pump, cooking its own food from sunlight and air, running two separate one-way highways through its stem every second, and building the next generation, one flower at a time. Nothing about a plant is actually still. It's just quiet.",
 ),
 ready: () => bioLabState.plantCloseU >= 0.95 || Date.now() - t0 > 8000,
 readyText: "Roots, leaves, highways, and a new flower, all on the same plant.",
 doneLabel: "Open the spiral map ▶",
 onDone: () => {
 setCoach("Last screen: a recap map of the four spirals. Tap a number to replay, then Finish Plant Power.");
 mountSpiralMap(overlay, {
 scene: "plantSpiral",
 title: "Your recap map",
 finishLabel: "Finish Plant Power ▶",
 narration:
 "This last screen is a recap, not a new puzzle. The four numbers are the four loops you already finished. Tap a number (on the canvas or here) to replay a short highlight. When you are ready, tap Finish Plant Power.",
 statusIdle: "Tap a number to replay, or finish now.",
 stops: [
 { n: 1, label: "1: Plant body" },
 { n: 2, label: "2: The kitchen" },
 { n: 3, label: "3: Plumbing" },
 { n: 4, label: "4: Next generation" },
 ],
 onDone: completeSub,
 });
 },
 });
}

function n(text) {
 return `<p class="tiny-narration">${text}</p>`;
}
