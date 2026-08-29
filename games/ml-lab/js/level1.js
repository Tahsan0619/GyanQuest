/**
 * Machine Learning - Mission 1: Teach the Model
 * Script: Opening + 4 Bruner spirals (clean → split → epochs → evaluate) + recap.
 */
import { labState, LAB_ASSET_PATHS, resetTeachModelState, initMlSub } from "./lab-state.js?v=acad6";
import { mountGate, mountSpiralMap, mountTapContinue, badgeHtml } from "./lab-activities.js?v=acad6";

export const L1_META = {
 objective:
 "By the end of this mission, you'll explain the real ML workflow - clean data, train/test split, epochs, early stopping, and honest evaluation.",
 bdHook:
 "Fruit photo sorters, handwriting apps, spam filters - all built with this same disciplined cycle behind the scenes.",
 predict: {
 q: "You already know a model learns from examples. What's the first practical step before training?",
 options: [
 "Clean and fix the dataset - garbage in, garbage out",
 "Train on every card including the final exam set",
 "Skip labels and hope the model guesses",
 ],
 ok: 0,
 },
 kidTitle: "Teach the Model",
 theme: "the real machine learning work cycle",
 emoji: "🏫",
 rewardName: "Model Mentor",
 intro:
 "Open the training academy and run an apprentice through the entire process - good material in, vault sealed early, disciplined practice, honest final exam.",
 everyday: ["Labeled photo decks", "Train vs test split", "Error graphs", "Accuracy score"],
 subTitles: [
 "Enroll the Apprentice",
 "Clean the Deck",
 "Gathering Good Material",
 "Split the Deck",
 "Training vs Testing",
 "Practice Loop",
 "When to Stop",
 "Final Exam",
 "The Full Cycle",
 "Properly Trained",
 ],
};

export function runL1Sub(subIndex, api) {
 const { registerTryAgain } = api;
 initMlSub(subIndex);
 const runners = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10];
 const fn = runners[subIndex] || runners[0];
 registerTryAgain(() => {
 api.overlay.innerHTML = "";
 resetTeachModelState();
 fn(api);
 });
 fn(api);
}

function n(text) {
 return `<p class="tiny-narration">${text}</p>`;
}

function s1_opening({ overlay, setCoach, completeSub }) {
 setCoach("Tap Enroll the Apprentice on the canvas - you'll advance automatically.");
 const t0 = Date.now();
 mountGate(overlay, {
 scene: "mlOpen",
 badge: "Opening",
 title: "Teach the Model",
 pulse: true,
 autoAdvanceOnReady: true,
 ready: () => labState.mlOpenReady || Date.now() - t0 > 4000,
 readyText: "You know models learn from examples - today we run the real kitchen.",
 doneLabel: "Continue ▶",
 controlsHtml: `<p class="drag-hint">Or tap here if the canvas button is hard to reach:</p>
 <button type="button" class="btn secondary" id="gate-enroll-ml">Enroll the Apprentice →</button>`,
 bind: (host, { finish, signalGateReady: signal }) => {
 host.querySelector("#gate-enroll-ml")?.addEventListener("click", () => {
 labState.mlOpenReady = true;
 signal({ forceAdvance: true });
 finish();
 });
 },
 html: `${badgeHtml(LAB_ASSET_PATHS.m1, "ml")}
 ${n(
 "Knowing a model learns from examples is like knowing a chef cooks with ingredients - it doesn't tell you how the kitchen runs. Today we open a real training academy and run the full cycle start to finish.",
 )}`,
 onDone: completeSub,
 });
}

function s2_clean({ overlay, setCoach, completeSub }) {
 setCoach("Fix mislabels, discard duplicates and blurry cards - then compare two apprentices.");
 mountGate(overlay, {
 scene: "mlClean1",
 badge: "Spiral 1 · Enactive",
 title: "Gathering Good Material",
 pulse: true,
 ready: () => labState.mlCompareDone,
 readyText: "Same process - only the material quality differed.",
 doneLabel: "Continue ▶",
 html: n(
 "Clean the messy flashcard deck, then train one apprentice on the messy pile and one on the clean pile. See who generalizes on new photos.",
 ),
 onDone: completeSub,
 });
}

function s3_funnel({ overlay, setCoach, completeSub }) {
 setCoach("Raw data pours in messy - cleaning filters it to ready-to-train.");
 mountGate(overlay, {
 scene: "mlFunnel1",
 badge: "Spiral 1 · Iconic",
 title: "The Cleaning Funnel",
 ready: () => true,
 html: n(
 "In real projects, cleaning often takes more time than training. Skipping it doesn't save time - it guarantees a worse model.",
 ),
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "mlTerms1",
 html: `<h3>Spiral 1 · Symbolic</h3>
 <p><strong>Dataset</strong> · <strong>Data cleaning</strong></p>
 <p><em>Garbage in, garbage out.</em> No technique fully fixes a poorly built dataset.</p>`,
 onDone: completeSub,
 });
 },
 });
}

function s4_split({ overlay, setCoach, completeSub }) {
 setCoach("Split 80 cards to practice, 20 into a sealed vault - then try to peek.");
 mountGate(overlay, {
 scene: "mlSplit2",
 badge: "Spiral 2 · Enactive",
 title: "Split Before You Start",
 pulse: true,
 ready: () => labState.mlVaultSealed && labState.mlPeekAttempted,
 readyText: "Vault sealed - peeking refused. Final exam stays meaningful.",
 doneLabel: "Continue ▶",
 html: n(
 "Drag cards into Practice (80) and Sealed Vault (20). Confirm the split, then tap Peek at the Vault to see why it must stay closed during training.",
 ),
 onDone: completeSub,
 });
}

function s5_rooms({ overlay, setCoach, completeSub }) {
 setCoach("Practice room for learning - vault room locked until training ends.");
 mountGate(overlay, {
 scene: "mlRooms2",
 badge: "Spiral 2 · Iconic",
 title: "Two Rooms",
 ready: () => true,
 html: n(
 "Every real project keeps this separation. Mixing training and test data - even accidentally - undermines the entire point of evaluation.",
 ),
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "mlTerms2",
 html: `<h3>Spiral 2 · Symbolic</h3>
 <p><strong>Training set</strong> (~80%) · <strong>Test set</strong> (~20%)</p>
 <p>The split happens first - vault stays sealed.</p>`,
 onDone: completeSub,
 });
 },
 });
}

function s6_train({ overlay, setCoach, completeSub }) {
 setCoach("Run full passes - watch error fall and check score dip then rise.");
 mountGate(overlay, {
 scene: "mlTrain3",
 badge: "Spiral 3 · Enactive",
 title: "The Practice Loop",
 pulse: true,
 ready: () => labState.mlStopDone,
 readyText: "You chose when to stop - early stopping in action.",
 doneLabel: "Continue ▶",
 html: n(
 "Tap Run one full pass for each epoch. Watch the check score - stop training near its lowest point, before it climbs again (overfitting warning).",
 ),
 onDone: completeSub,
 });
}

function s7_graph({ overlay, setCoach, completeSub }) {
 setCoach("One line falls forever - the other dips then rises. Stop at the star.");
 mountGate(overlay, {
 scene: "mlGraph3",
 badge: "Spiral 3 · Iconic",
 title: "The Sweet Spot",
 ready: () => true,
 html: n(
 "This shape shows up constantly in real ML work. Recognizing it and stopping at the turning point is one of the most practical skills in the field.",
 ),
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "mlTerms3",
 html: `<h3>Spiral 3 · Symbolic</h3>
 <p><strong>Epoch</strong> · <strong>Loss</strong> · <strong>Overfitting</strong> · <strong>Early stopping</strong></p>`,
 onDone: completeSub,
 });
 },
 });
}

function s8_exam({ overlay, setCoach, completeSub }) {
 setCoach("Unlock the vault for the first time - score the honest final exam.");
 mountGate(overlay, {
 scene: "mlExam4",
 badge: "Spiral 4 · Enactive",
 title: "Report Card",
 pulse: true,
 ready: () => labState.mlExamDone,
 readyText: "18/20 - trustworthy because the vault was never used in training.",
 doneLabel: "Continue ▶",
 html: n(
 "Unlock the sealed vault and run all 20 cards. Optional: compare to a cheater who peeked during training - their 100% proves nothing.",
 ),
 onDone: completeSub,
 });
}

function s9_cycle({ overlay, setCoach, completeSub }) {
 setCoach("Collect → Clean → Split → Train → Evaluate - one continuous cycle.");
 mountGate(overlay, {
 scene: "mlCycle4",
 badge: "Spiral 4 · Iconic",
 title: "The Full Workflow",
 ready: () => true,
 html: n(
 "Everything you did today is one disciplined cycle. Skipping any stage quietly undermines everything that comes after.",
 ),
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "mlTerms4",
 html: `<h3>Spiral 4 · Symbolic</h3>
 <p><strong>Accuracy</strong> - percent correct on the test set.</p>
 <p><em>Next: what does learning look like without an answer key at all?</em></p>`,
 onDone: completeSub,
 });
 },
 });
}

function s10_closing({ overlay, setCoach, completeSub }) {
 setCoach("Watch the full academy cycle play out - then open the recap map.");
 const t0 = Date.now();
 mountGate(overlay, {
 scene: "mlClose",
 badge: "Closing",
 title: "The Apprentice, Properly Trained",
 html: n(
 "Good material in, fair exam locked away early, disciplined practice with honest error correction, and a final score that actually means something.",
 ),
 ready: () => labState.mlCloseU >= 0.85 || Date.now() - t0 > 7000,
 readyText: "Clean · Split · Train · Evaluate.",
 doneLabel: "Open the recap map ▶",
 onDone: () => {
 setCoach("Tap a spiral number to replay, then finish Teach the Model.");
 mountSpiralMap(overlay, {
 scene: "mlSpiral",
 title: "Your recap map",
 finishLabel: "Finish Teach the Model ▶",
 narration:
 "The four numbers are the four spirals you finished. Tap a number to replay a highlight, then finish when ready.",
 statusIdle: "Tap a number to replay, or finish now.",
 stops: [
 { n: 1, label: "1: Cleaning" },
 { n: 2, label: "2: Split" },
 { n: 3, label: "3: Epochs" },
 { n: 4, label: "4: Evaluate" },
 ],
 onDone: completeSub,
 });
 },
 });
}

const s1 = s1_opening;
const s2 = s2_clean;
const s3 = s3_funnel;
const s4 = s4_split;
const s5 = s5_rooms;
const s6 = s6_train;
const s7 = s7_graph;
const s8 = s8_exam;
const s9 = s9_cycle;
const s10 = s10_closing;
