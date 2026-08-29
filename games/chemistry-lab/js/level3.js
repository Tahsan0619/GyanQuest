/**
 * Chemistry Lab Mission 3: Bond Buddies
 * Script: Opening + 4 Bruner spirals (stability → ionic → covalent → spectrum) + recap map.
 * Packed into the shared 10-step mission engine (N_SUBS = 10).
 */
import { chemLabState, resetBondBuddiesState } from "./atom-scenes.js?v=bondbuddy1";
import { BOND_ASSET_PATHS } from "./bond-scenes.js?v=bondbuddy1";
import {
 mountGate,
 mountSpiralMap,
 mountBondMoods,
 mountBondPaths,
 mountBondHandoff,
 mountBondLattice,
 mountBondCovalent,
 mountBondPairs,
 mountBondTug,
 mountBondMaterials,
 badgeHtml,
} from "./chem-activities.js?v=bondbuddy1";

export const L3_META = {
 objective:
 "By the end of this mission, you'll be able to say why atoms bond, how ionic and covalent bonds solve the same problem, and how uneven pulling turns those two into one spectrum.",
 bdHook: "Start with one restless atom, then watch salt and water as two answers to the same need.",
 predict: {
 q: "Before we start: why do you think two atoms would stick together at all?",
 options: [
 "They like being close for no particular reason",
 "Each one is trying to become more stable, usually with a full outer shell",
 "Only magnets can pull atoms together",
 ],
 ok: 1,
 },
 kidTitle: "Bond Buddies",
 theme: "why atoms bond, ionic, covalent, and the spectrum between",
 emoji: "🤝",
 rewardName: "Bond Explorer",
 intro:
 "Most atoms in the universe are incomplete on their own. Their outer shells are not full, and that makes them restless, reactive, eager for company. Today we study bond buddies: how atoms pair up, why they pair up the way they do, and what happens once they find their match.",
 everyday: [
 "A restless atom with a nearly empty outer shell",
 "Give an electron away, or share one",
 "Table salt and a drop of water: same problem, two solutions",
 ],
 subTitles: [
 "A restless atom",
 "Happy or restless",
 "Give or share",
 "The electron handoff",
 "A crystal of salt",
 "Share, don't give",
 "Single, double, triple",
 "Tug-of-war",
 "How materials behave",
 "Every bond has a reason",
 ],
};

export function runL3Sub(subIndex, api) {
 const { registerTryAgain } = api;
 resetBondBuddiesState();

 const runners = [
 sub1_opening,
 sub2_moods,
 sub3_paths,
 sub4_handoff,
 sub5_lattice,
 sub6_covalent,
 sub7_pairs,
 sub8_tug,
 sub9_materials,
 sub10_closing,
 ];
 const fn = runners[subIndex] || runners[0];
 registerTryAgain(() => {
 api.overlay.innerHTML = "";
 resetBondBuddiesState();
 fn(api);
 });
 fn(api);
}

function sub1_opening({ overlay, setCoach, completeSub }) {
 setCoach("A restless atom is looking for a partner. Tap Bring Them Together.");
 mountGate(overlay, {
 scene: "bondOpen",
 badge: "Opening",
 title: "Bond Buddies",
 pulse: true,
 ready: () => chemLabState.bondTogether,
 readyText: "They found company.",
 doneLabel: "Start bonding ▶",
 html: `${badgeHtml(BOND_ASSET_PATHS.buddies, "bonds")}
 ${n(
 "Meet an atom that's, frankly, not having a great time. Its outer shell is almost empty, and (as you already know) that makes it restless, reactive, eager for company. Most atoms in the universe are exactly like this: incomplete on their own. So they do what incomplete things tend to do. They look for a partner. Today we're studying bond buddies: how atoms pair up, why they pair up the way they do, and what happens once they find their match.",
 )}`,
 bind() {
 const arena = window.__arena;
 arena?.setIntentHandler?.((intent) => {
 if (intent.type === "CANVAS_TAP" && intent.meta?.action === "together") {
 chemLabState.bondTogether = true;
 const btn = document.getElementById("tiny-gate-go");
 if (btn) {
 btn.disabled = false;
 btn.click();
 }
 }
 });
 },
 onDone: completeSub,
 });
}

function sub2_moods({ overlay, setCoach, completeSub }) {
 setCoach("Four atoms. Tap Happy or Restless from the outer shell, not a guess.");
 mountBondMoods(overlay, { onDone: completeSub });
}

function sub3_paths({ overlay, setCoach, completeSub }) {
 setCoach("Tap both paths on the canvas: transfer, then share. Then the octet rule.");
 mountBondPaths(overlay, { onDone: completeSub });
}

function sub4_handoff({ overlay, setCoach, completeSub }) {
 setCoach("Drag Sodium's outer electron onto Chlorine. Then drag the ions until they snap.");
 mountBondHandoff(overlay, { onDone: completeSub });
}

function sub5_lattice({ overlay, setCoach, completeSub }) {
 setCoach("Watch the pair multiply into a lattice, then name ion, ionic bond, and NaCl.");
 mountBondLattice(overlay, { onDone: completeSub });
}

function sub6_covalent({ overlay, setCoach, completeSub }) {
 setCoach("Try transferring a hydrogen electron (it bounces). Then overlap, then rebuild water.");
 mountBondCovalent(overlay, { onDone: completeSub });
}

function sub7_pairs({ overlay, setCoach, completeSub }) {
 setCoach("H2, O2, N2: single, double, triple. Then Lewis water and a lopsided share.");
 mountBondPairs(overlay, { onDone: completeSub });
}

function sub8_tug({ overlay, setCoach, completeSub }) {
 setCoach("H-H, H-Cl, then Na-Cl. Drag the marker to where the tug belongs.");
 mountBondTug(overlay, { onDone: completeSub });
}

function sub9_materials({ overlay, setCoach, completeSub }) {
 setCoach("Tap salt to shatter, sugar to melt. Then read the ΔEN map.");
 mountBondMaterials(overlay, { onDone: completeSub });
}

function sub10_closing({ overlay, setCoach, completeSub }) {
 setCoach("Give or share explains salt, water, and air. Then open the recap.");
 const t0 = Date.now();
 mountGate(overlay, {
 scene: "bondClose",
 badge: "Closing",
 title: "Every bond has a reason",
 html: n(
 "You started this lesson looking at one restless, incomplete atom. Now you know exactly what it does about that: give an electron away, or share one. That single choice explains everything from a grain of table salt to a drop of water to the air you breathe. Every bond you'll ever study from here on is really just one of these two ideas, playing out a little differently each time.",
 ),
 ready: () => chemLabState.bondCloseU >= 0.95 || Date.now() - t0 > 8000,
 readyText: "The collage is in.",
 doneLabel: "Open the spiral map ▶",
 onDone: () => {
 setCoach("Last screen: a recap map of the four spirals. Tap a number to replay, then Finish Bond Buddies.");
 mountSpiralMap(overlay, {
 scene: "bondSpiral",
 title: "Your recap map",
 finishLabel: "Finish Bond Buddies ▶",
 narration:
 "This last screen is a recap, not a new puzzle. The four numbers are the four loops you already finished. Tap a number (on the canvas or here) to replay a short highlight. When you are ready, tap Finish Bond Buddies.",
 statusIdle: "Tap a number to replay, or finish now.",
 stops: [
 { n: 1, label: "1: Why bond" },
 { n: 2, label: "2: Ionic" },
 { n: 3, label: "3: Covalent" },
 { n: 4, label: "4: Spectrum" },
 ],
 onDone: completeSub,
 });
 },
 });
}

function n(text) {
 return `<p class="tiny-narration">${text}</p>`;
}
