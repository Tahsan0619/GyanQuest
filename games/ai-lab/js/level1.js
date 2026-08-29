/**
 * Artificial Intelligence - Mission 1: What is AI?
 * Script: Opening + 4 Bruner spirals (rules vs ML → training → test → real AI) + recap.
 */
import { labState, LAB_ASSET_PATHS, resetWhatIsAiState, initAiSub } from "./lab-state.js?v=appr6";
import { mountGate, mountSpiralMap, mountTapContinue, badgeHtml } from "./lab-activities.js?v=appr6";

export const L1_META = {
 objective:
 "By the end of this mission, you'll explain AI as an apprentice that learns patterns from examples - not magic, not a rulebook.",
 bdHook:
 "Phone photo tags, voice assistants, spam filters - all trained on real examples, tested on new data.",
 predict: {
 q: "Nobody wrote a rule for every dog photo - so how does the app tag it correctly?",
 options: [
 "It learned patterns from thousands of labeled photo examples",
 "A programmer wrote IF…THEN rules for every breed and angle",
 "It magically understands dogs like a person",
 ],
 ok: 0,
 },
 kidTitle: "What is AI?",
 theme: "the apprentice that learns from examples",
 emoji: "🎓",
 rewardName: "AI Rookie",
 intro:
 "Meet the Apprentice - not a rule-following employee, but a system that learns from examples, gets corrected, and is tested on brand-new situations.",
 everyday: ["Photo auto-tags", "Voice assistant", "Spam filter", "Music recommendations"],
 subTitles: [
 "Meet the Apprentice",
 "Rules vs Examples",
 "What Makes AI Different",
 "Training Rounds",
 "Accuracy Over Time",
 "Training Vocabulary",
 "Test the Apprentice",
 "Generalization",
 "Real AI Apps",
 "Apprentice Understood",
 ],
};

export function runL1Sub(subIndex, api) {
 const { registerTryAgain } = api;
 initAiSub(subIndex);
 const runners = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10];
 const fn = runners[subIndex] || runners[0];
 registerTryAgain(() => {
 api.overlay.innerHTML = "";
 resetWhatIsAiState();
 fn(api);
 });
 fn(api);
}

function n(text) {
 return `<p class="tiny-narration">${text}</p>`;
}

function allAppsMatched() {
 const m = labState.aiMatches || {};
 return APP_MATCHES.every((a) => m[a.app] === a.data);
}

const APP_MATCHES = [
 { app: "voice", data: "speech" },
 { app: "photo", data: "photos" },
 { app: "music", data: "music" },
 { app: "spam", data: "spam" },
];

function s1_opening({ overlay, setCoach, completeSub }) {
 setCoach("Tap Meet the Apprentice on the canvas - you'll advance automatically.");
 const t0 = Date.now();
 mountGate(overlay, {
 scene: "aiOpen",
 badge: "Opening",
 title: "What Is AI?",
 pulse: true,
 autoAdvanceOnReady: true,
 ready: () => labState.aiOpenReady || Date.now() - t0 > 4000,
 readyText: "Something different from a lookup table - not sci-fi, the real kind.",
 doneLabel: "Continue ▶",
 controlsHtml: `<p class="drag-hint">Or tap here if the canvas button is hard to reach:</p>
 <button type="button" class="btn secondary" id="gate-enroll-ai">Meet the Apprentice →</button>`,
 bind: (host, { finish, signalGateReady: signal }) => {
 host.querySelector("#gate-enroll-ai")?.addEventListener("click", () => {
 labState.aiOpenReady = true;
 signal({ forceAdvance: true });
 finish();
 });
 },
 html: `${badgeHtml(LAB_ASSET_PATHS.m1, "ai")}
 ${n(
 "Nobody sat down and wrote a rule for every possible dog photo - every breed, every angle - and yet this app got it right instantly. Today we find out exactly what is happening.",
 )}`,
 onDone: completeSub,
 });
}

function s2_rules({ overlay, setCoach, completeSub }) {
 setCoach("Patch sorting rules until they break - then feed examples to the Apprentice.");
 mountGate(overlay, {
 scene: "aiRules1",
 badge: "Spiral 1 · Enactive",
 title: "Not Programmed, Trained",
 pulse: true,
 ready: () => labState.aiApprenticeTrained,
 readyText: "No rules written. Just examples - tricky photos sorted correctly.",
 doneLabel: "Continue ▶",
 html: n(
 "Write IF…THEN rules and watch them fail on exceptions. Then drag labeled cat & dog photos to the Apprentice and test the same tricky photos.",
 ),
 onDone: completeSub,
 });
}

function s3_split({ overlay, setCoach, completeSub }) {
 setCoach("Rules tangle with exceptions - examples flow into a learned pattern.");
 mountGate(overlay, {
 scene: "aiSplit1",
 badge: "Spiral 1 · Iconic",
 title: "The Philosophical Split",
 ready: () => true,
 html: n(
 "One approach tries to anticipate every situation with explicit instructions. The other learns directly from real examples of the task done correctly.",
 ),
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "aiTerms1",
 html: `<h3>Spiral 1 · Symbolic</h3>
 <p><strong>Traditional programming</strong> - explicit step-by-step rules.</p>
 <p><strong>AI</strong> - systems that perform tasks requiring human-like intelligence.</p>
 <p><strong>Machine learning</strong> - learns patterns from example data, not rules.</p>`,
 onDone: completeSub,
 });
 },
 });
}

function s4_train({ overlay, setCoach, completeSub }) {
 setCoach("Run five rounds: guess → reveal answer → watch confidence climb.");
 mountGate(overlay, {
 scene: "aiTrain2",
 badge: "Spiral 2 · Enactive",
 title: "The Apprentice Learns",
 pulse: true,
 ready: () => labState.aiTrainingDone,
 readyText: "Guess, correction, small adjustment - five rounds complete.",
 doneLabel: "Continue ▶",
 html: n(
 "Before each reveal the Apprentice guesses Cat or Dog. Wrong guesses trigger a small internal adjustment; correct ones reinforce the pattern.",
 ),
 onDone: completeSub,
 });
}

function s5_graph({ overlay, setCoach, completeSub }) {
 setCoach("Five rounds by hand - real training repeats thousands of times.");
 mountGate(overlay, {
 scene: "aiGraph2",
 badge: "Spiral 2 · Iconic",
 title: "Accuracy Climbs",
 ready: () => true,
 html: n(
 "You did five rounds yourself; real training does this thousands or millions of times - same loop, just scaled up.",
 ),
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "aiTerms2",
 html: `<h3>Spiral 2 · Symbolic</h3>
 <p><strong>Training data</strong> · <strong>Model</strong> · <strong>Prediction</strong> · <strong>Training</strong></p>
 <p>The labeled examples, the apprentice itself, its guess, and the repeated guess-correct-adjust cycle.</p>`,
 onDone: completeSub,
 });
 },
 });
}

function s6_test({ overlay, setCoach, completeSub }) {
 setCoach("Both scored 100% in training - give them five brand-new photos.");
 mountGate(overlay, {
 scene: "aiTest3",
 badge: "Spiral 3 · Enactive",
 title: "Did It Actually Learn?",
 pulse: true,
 ready: () => labState.aiTestDone,
 readyText: "Both aced training - only one generalizes to new data.",
 doneLabel: "Continue ▶",
 html: n(
 "Present five new photos never shown during training. Apprentice A handles most; Apprentice B fails despite a perfect training score. Optional: peek inside both.",
 ),
 onDone: completeSub,
 });
}

function s7_exam({ overlay, setCoach, completeSub }) {
 setCoach("Understanding the pattern vs memorizing exact answers.");
 mountGate(overlay, {
 scene: "aiExam3",
 badge: "Spiral 3 · Iconic",
 title: "The Classroom Test",
 ready: () => true,
 html: n(
 "Memorizing specific answers and genuinely understanding a pattern can look identical - until something new shows up.",
 ),
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "aiTerms3",
 html: `<h3>Spiral 3 · Symbolic</h3>
 <p><strong>Generalization</strong> (good) · <strong>Overfitting</strong> (bad) · <strong>Test data</strong></p>
 <p>Real AI systems are always checked on fresh examples the model never saw during training.</p>`,
 onDone: completeSub,
 });
 },
 });
}

function s8_match({ overlay, setCoach, completeSub }) {
 setCoach("Drag each app icon to the training data it learned from.");
 mountGate(overlay, {
 scene: "aiMatch4",
 badge: "Spiral 4 · Enactive",
 title: "AI All Around Us",
 pulse: true,
 ready: allAppsMatched,
 readyText: "Every app - same apprentice loop, different training data.",
 doneLabel: "Continue ▶",
 html: n(
 "Voice assistant, photo tags, music recommendations, spam filter - match each to speech+text, labeled photos, play/skip history, or spam labels.",
 ),
 onDone: completeSub,
 });
}

function s9_montage({ overlay, setCoach, completeSub }) {
 setCoach("Useful - but only as good as the examples it learned from.");
 mountGate(overlay, {
 scene: "aiMontage4",
 badge: "Spiral 4 · Iconic",
 title: "Honest Limits",
 ready: () => true,
 html: n(
 "Spam filters catch junk; recommendation systems sometimes miss your taste. Limited or biased training data produces limited or biased predictions.",
 ),
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "aiTerms4",
 html: `<h3>Spiral 4 · Symbolic</h3>
 <p>AI → broad goal · ML → patterns from data · Training loop → generalization vs overfitting</p>
 <p><em>Next question: what does the inside of a trained model - like a neural network - actually look like?</em></p>`,
 onDone: completeSub,
 });
 },
 });
}

function s10_closing({ overlay, setCoach, completeSub }) {
 setCoach("Watch the journey behind one instant tag - then open the recap map.");
 const t0 = Date.now();
 mountGate(overlay, {
 scene: "aiClose",
 badge: "Closing",
 title: "The Apprentice, Understood",
 html: n(
 "That instant correct tag isn't mysterious anymore - an apprentice shown real examples, corrected patiently, and tested on things it had never seen before.",
 ),
 ready: () => labState.aiCloseU >= 0.85 || Date.now() - t0 > 7000,
 readyText: "Examples · Training · Test data · Real apps.",
 doneLabel: "Open the recap map ▶",
 onDone: () => {
 setCoach("Tap a spiral number to replay, then finish What is AI?");
 mountSpiralMap(overlay, {
 scene: "aiSpiral",
 title: "Your recap map",
 finishLabel: "Finish What is AI? ▶",
 narration:
 "The four numbers are the four spirals you finished. Tap a number to replay a highlight, then finish when ready.",
 statusIdle: "Tap a number to replay, or finish now.",
 stops: [
 { n: 1, label: "1: Rules vs ML" },
 { n: 2, label: "2: Training" },
 { n: 3, label: "3: Test data" },
 { n: 4, label: "4: Real AI" },
 ],
 onDone: completeSub,
 });
 },
 });
}

const s1 = s1_opening;
const s2 = s2_rules;
const s3 = s3_split;
const s4 = s4_train;
const s5 = s5_graph;
const s6 = s6_test;
const s7 = s7_exam;
const s8 = s8_match;
const s9 = s9_montage;
const s10 = s10_closing;
