/**
 * Statistics & Probability - Mission 1: Mean & Mode
 * 10 sub-levels, Bruner spiral: enactive -> iconic -> symbolic.
 * Target: 45-60 minutes. Accurate: mean (sum/count), mode (most common), outliers.
 */
import { labState, LAB_ASSET_PATHS } from "./lab-state.js";
import {
 mountMotionChain,
 mountDragSort,
 mountHeatLab,
 mountRevealSteps,
 mountEquationBuild,
 mountQuiz,
 mountSpeedDrill,
 mountOrderSteps,
 mountMythCards,
 mountTapContinue,
 mountScaleLab,
 mountMultiQuiz,
 playScene,
 badgeHtml,
} from "./lab-activities.js";

export const L1_META = {
 objective:
 "By the end of this mission, you'll be able to explain mean (sum÷count) and mode (most common) in your own words.",
 bdHook:
 "Bangladesh everyday: class mark lists, cricket run totals, shop price tags - notice the balance average vs the value that shows up most, then connect it to Mean & Mode.",
 predict: {
 q: "Before we start - what mainly separates mean from mode?",
 options: [
 "They are always the same number",
 "Mean balances (sum÷count); mode is the value that appears most",
 "Only the biggest value in the list matters",
 ],
 ok: 1,
 },

 kidTitle: "Mean & Mode",
 theme: "averages / typical values",
 emoji: "📊",
 rewardName: "Mean Scout",
 intro:
 "Mean balances all values into one typical number. Mode is the value that appears most. We start with mark lists and price tags - then name a rule you can reuse anywhere.",
 everyday: [
 "Class mark list",
 "Cricket run totals",
 "Shop price tags in BD markets",
 ],
 subTitles: [
 "Meet Mean & Mode",
 "Balance the Mean",
 "Sort: Mean, Mode, or Not?",
 "Data Peak Lab",
 "Why Both Summaries",
 "Name the Average Rule",
 "Stretch: BD Data Stories",
 "Myth Bust",
 "Fluency Drill",
 "Mean Scout Mastery",
 ],
};

/**
 * @param {{
 * overlay: HTMLElement,
 * setCoach: (html: string, aside?: string) => void,
 * completeSub: () => void,
 * registerTryAgain: (fn: () => void) => void,
 * }} api
 */
export function runL1Sub(subIndex, api) {
 const { registerTryAgain } = api;
 labState.reveal = false;
 labState.tokenProgress = 0;
 labState.masteryStep = 0;
 labState.sortPlaced = 0;
 labState.placed = {};
 labState.selectedId = null;
 labState.mythBusted = false;
 labState.mythPhase = "claim";
 labState.heat = 0.25;
 labState.scale = 0;
 labState.mode = "marks";
 labState.phase = "desk";
 labState.dataVals = [2, 4, 4, 5, 5];
 labState.meanVal = 4;
 labState.modeVal = 4;
 labState.outlier = 0;

 const runners = [
 sub1_meet,
 sub2_balance,
 sub3_sort,
 sub4_peak,
 sub5_both,
 sub6_rule,
 sub7_stretch,
 sub8_myths,
 sub9_drill,
 sub10_mastery,
 ];
 const fn = runners[subIndex] || runners[0];
 registerTryAgain(() => {
 api.overlay.innerHTML = "";
 fn(api);
 });
 fn(api);
}

function sub1_meet({ overlay, setCoach, completeSub }) {
 setCoach(
 "Hook + light enactive: meet a data list, watch the mean balance line, then spot the mode peak.",
 );
 mountMotionChain(overlay, {
 title: "Meet Mean & Mode",
 beats: [
 {
 scene: "meanMeet",
 sceneArgs: { phase: "desk" },
 dwellMs: 4200,
 html: `${badgeHtml(LAB_ASSET_PATHS.dataBars, "data bars")}
 <p><strong>Act 1 - Everyday list:</strong> Drag the data bars. Each height is a value in the set (like marks or prices).</p>
 <p>A list of numbers is our starting object - not a guess.</p>`,
 },
 {
 scene: "meanMeet",
 sceneArgs: { phase: "glow" },
 dwellMs: 4500,
 html: `<p><strong>Act 2 - Mean line:</strong> The dashed line sits at the balance point of the set.</p>
 <p>Mean = add all values, then divide by how many there are.</p>`,
 },
 {
 scene: "meanMeet",
 sceneArgs: { phase: "predict" },
 dwellMs: 3800,
 html: `<p><strong>Act 3 - Predict:</strong> Which value shows up most often in 2, 4, 4, 5, 5?</p>
 <p>Watch the stacks before we crown the mode.</p>`,
 },
 {
 scene: "meanMeet",
 sceneArgs: { phase: "settle" },
 dwellMs: 4200,
 html: `<p><strong>Act 4 - Big idea:</strong> Mode stacks highest - the value that appears most (ties allowed).</p>
 <p>Mean balances; mode crowns popularity. They can differ.</p>`,
 },
 ],
 onDone: () => {
 mountQuiz(overlay, {
 scene: "meanMeet",
 sceneArgs: { phase: "settle" },
 title: "Exit check",
 q: "In 2, 4, 4, 5, 5 - which is the mode?",
 opts: [
 "4 and 5 (tie - both appear twice)",
 "Only 2",
 "The mean line alone",
 "Any random number",
 ],
 ok: 0,
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "meanMeet",
 sceneArgs: { phase: "settle" },
 badge: LAB_ASSET_PATHS.m1,
 html: `<h3>You met Mean & Mode</h3><p>Next we dial until the mean balance is clear - and watch an outlier pull it.</p>`,
 onDone: completeSub,
 advanceAfterDone: true,
 });
 },
 });
 },
 });
}

function sub2_balance({ overlay, setCoach, completeSub }) {
 setCoach("Enactive: push the dial - add an outlier and watch the mean line move while the mode stays with the crowd.");
 labState.heat = 0.2;
 labState.outlier = 0;
 mountHeatLab(overlay, {
 scene: "meanLab",
 sceneArgs: { labMode: "outlier" },
 title: "Balance the Mean",
 html: `<p>Drag the <strong>outlier dial</strong>. A huge extra value pulls the mean up. Mode stays with the common marks.</p>
 <p>Use the slider, +/−, or drag the amber handle on the canvas until clarity ≥ 60%.</p>`,
 goalText: "Goal: pull the outlier until mean balance clarity ≥ 60%.",
 doneLabel: "Mean balanced - continue ▶",
 threshold: 0.6,
 startHeat: 0.2,
 axis: "x",
 canvasAction: "stretch",
 sliderLabel: "Outlier pull",
 badge: LAB_ASSET_PATHS.meanLine,
 readoutLabels: {
 cold: "Data clustered - mean near the crowd",
 melting: "Outlier growing - mean starting to rise…",
 liquid: "Mean pulled upward - mode still common",
 simmer: "Mean clearly pulled - outlier effect locked!",
 },
 onDone: () => {
 mountQuiz(overlay, {
 scene: "meanLab",
 sceneArgs: { labMode: "outlier" },
 title: "Check",
 q: "Mean of 2, 4, 6 is…",
 opts: [
 "4 (add then divide by 3)",
 "6 only",
 "2 only",
 "12 without dividing",
 ],
 ok: 0,
 onDone: () => {
 mountRevealSteps(overlay, {
 scene: "meanLab",
 sceneArgs: { labMode: "outlier" },
 title: "Outlier story",
 steps: [
 "List the values first - honesty before averaging.",
 "Mean = sum ÷ count - every value pulls the balance line.",
 "A very large or small value can drag the mean away from the crowd.",
 "Mode often stays with the most common mark even when mean moves.",
 ],
 onDone: completeSub,
 });
 },
 });
 },
 });
}

function sub3_sort({ overlay, setCoach, completeSub }) {
 setCoach("Enactive sort: mean is balance/share; mode is most common; guesses and favorites are not summaries.");
 labState.reveal = false;
 mountTapContinue(overlay, {
 scene: "meanSort",
 html: `<h3>Mean, mode, or not?</h3>
 <p><strong>Mean:</strong> add-and-divide, balance line, fair share of total.</p>
 <p><strong>Mode:</strong> most common mark, peak stack, ties allowed.</p>
 <p><strong>Not:</strong> favorite color, random guess with no data.</p>
 <p>Next: sort eight cases on the canvas or with chips.</p>`,
 onDone: () => {
 mountDragSort(overlay, {
 scene: "meanSort",
 title: "Sort: Mean, Mode, or Not?",
 instructions: "Drag into Mean / Mode / Not a summary.",
 successText: "Sharp sort - summaries sorted!",
 chips: [
 { id: "adddiv", text: "Add then divide", short: "Add/div", color: 0xfbbf24 },
 { id: "peak", text: "Most common value", short: "Most", color: 0xf59e0b },
 { id: "balance", text: "Balance line", short: "Balance", color: 0xfde68a },
 { id: "stack", text: "Tallest stack", short: "Stack", color: 0xd97706 },
 { id: "share", text: "Fair share of total", short: "Share", color: 0xfbbf24 },
 { id: "color", text: "Favorite color", short: "Color", color: 0x94a3b8 },
 { id: "guess", text: "Random guess", short: "Guess", color: 0x78716c },
 { id: "ties", text: "Two peaks tied", short: "Tie mode", color: 0xf97316 },
 ],
 zones: [
 { id: "mean", label: "Mean idea", accept: ["adddiv", "balance", "share"] },
 { id: "mode", label: "Mode idea", accept: ["peak", "stack", "ties"] },
 { id: "not", label: "Not a summary", accept: ["color", "guess"] },
 ],
 onDone: () => {
 mountQuiz(overlay, {
 scene: "meanSort",
 title: "Justify",
 q: "Why is “favorite color” NOT a mean or mode?",
 opts: [
 "It is a preference, not a summary computed from a number list",
 "Because colors are always the mode",
 "Because means only work for prices",
 "Because mode needs exactly one peak forever",
 ],
 ok: 0,
 onDone: completeSub,
 });
 },
 });
 },
 });
}

function sub4_peak({ overlay, setCoach, completeSub }) {
 setCoach("Enactive: push clarity until the mode peak stacks tall - same data, clearer popularity story.");
 labState.heat = 0.35;
 mountHeatLab(overlay, {
 scene: "meanLab",
 sceneArgs: { labMode: "peak" },
 title: "Data Peak Lab",
 html: `<p>Dial <strong>clarity</strong> until the mode peak and mean line are both obvious (≥ 75%).</p>
 <p>Watch one value stack higher - that is mode, not magic.</p>`,
 goalText: "Goal: clarity ≥ 75% - mode peak and mean line both visible.",
 doneLabel: "Peak checked - continue ▶",
 threshold: 0.75,
 startHeat: 0.35,
 axis: "x",
 canvasAction: "stretch",
 sliderLabel: "Peak clarity",
 badge: LAB_ASSET_PATHS.modePeak,
 readoutLabels: {
 cold: "Stacks fuzzy - keep dialing",
 melting: "Mode peak rising…",
 liquid: "Peak almost clear",
 simmer: "Mode peak locked - most common value!",
 },
 onDone: () => {
 mountQuiz(overlay, {
 scene: "meanLab",
 sceneArgs: { labMode: "peak" },
 title: "Peak check",
 q: "Mode of 3, 3, 3, 8, 9 is…",
 opts: [
 "3 (appears most)",
 "8 only",
 "Always the mean",
 "9 because it is biggest",
 ],
 ok: 0,
 onDone: completeSub,
 });
 },
 });
}

function sub5_both({ overlay, setCoach, completeSub }) {
 setCoach("Explain: list → mean → mode → tell what each answer means. Both summaries earn a place.");
 mountOrderSteps(overlay, {
 scene: "meanMeet",
 sceneArgs: { phase: "settle" },
 title: "Why Both Summaries",
 instructions: "Put the story in order.",
 items: [
 { id: "list", html: "List the data values" },
 { id: "mean", html: "Find the mean (balance)" },
 { id: "mode", html: "Find the mode (most common)" },
 { id: "tell", html: "Tell what each summary means" },
 ],
 correctIds: ["list", "mean", "mode", "tell"],
 onDone: () => {
 mountRevealSteps(overlay, {
 scene: "meanMeet",
 sceneArgs: { phase: "settle" },
 title: "Two questions, one list",
 steps: [
 "Mean answers: what is a fair typical / balance of the total?",
 "Mode answers: which value shows up most often?",
 "They can match - or differ when an outlier pulls the mean.",
 "Say which average you mean before you compare classes or shops.",
 ],
 onDone: () => {
 mountQuiz(overlay, {
 scene: "meanMeet",
 sceneArgs: { phase: "settle" },
 title: "Check",
 q: "Why keep both mean and mode?",
 opts: [
 "They answer different questions about the same set",
 "Mean and mode are always identical",
 "Mode ignores the data",
 "Mean never uses division",
 ],
 ok: 0,
 onDone: completeSub,
 });
 },
 });
 },
 });
}

function sub6_rule({ overlay, setCoach, completeSub }) {
 setCoach(
 "Symbolic: build Mean = sum / count, then scrub list → mean → mode so both summaries stay distinct.",
 );
 mountEquationBuild(overlay, {
 scene: "meanRule",
 title: "Name the Average Rule",
 instructions: "Tap tokens in order to build the mean rule.",
 tokens: [
 { id: "a", html: "Sum" },
 { id: "b", html: "/" },
 { id: "c", html: "Count" },
 { id: "d", html: "= Mean" },
 ],
 correctIds: ["a", "b", "c", "d"],
 badge: LAB_ASSET_PATHS.rule,
 onDone: () => {
 mountScaleLab(overlay, {
 scene: "meanRule",
 title: "Average scale scrubber",
 html: `<p>Slide from raw list → mean balance → mode peak.</p>
 <p>Mean divides by the count. Mode crowns the most common value - they are not the same job.</p>`,
 start: 0,
 threshold: 0.85,
 sliderLabel: "Average scale: list → mean → mode",
 goalText: "Canvas follows: data list → sum÷count → mode peak.",
 readoutLabels: {
 low: "Raw data list",
 mid: "Mean = sum ÷ count (balance)",
 high: "Mode = most common (peak)",
 },
 onDone: () => {
 mountQuiz(overlay, {
 scene: "meanRule",
 title: "Rule check",
 q: "What is the main Mean & Mode rule?",
 opts: [
 "Mean balances (sum÷count); mode is the value that appears most",
 "Mean and mode are always the same number",
 "Mode ignores how often values appear",
 "Mean never divides by the count",
 ],
 ok: 0,
 onDone: completeSub,
 });
 },
 });
 },
 });
}

function sub7_stretch({ overlay, setCoach, completeSub }) {
 setCoach("Transfer: same mean/mode rule in marks, cricket, shops, bus waits, and weather.");
 const modes = [
 {
 mode: "marks",
 html: `${badgeHtml(LAB_ASSET_PATHS.dataBars, "marks")}<p><strong>Class marks:</strong> Mean score for the test; mode is the mark that shows up most.</p>`,
 },
 {
 mode: "cricket",
 html: `<p><strong>Cricket runs:</strong> Typical total (mean) vs the score that appears most often (mode).</p>`,
 },
 {
 mode: "shop",
 html: `<p><strong>Shop prices:</strong> Average cost vs the common price tag in a BD market stall.</p>`,
 },
 {
 mode: "bus",
 html: `<p><strong>Bus waits:</strong> Mean wait time; usual wait (mode) when one late bus is an outlier.</p>`,
 },
 {
 mode: "weather",
 html: `<p><strong>Temperatures:</strong> Average day vs the temperature that appears most in a week.</p>`,
 },
 ];
 let step = 0;

 function show() {
 if (step >= modes.length) {
 mountQuiz(overlay, {
 scene: "meanStretch",
 sceneArgs: { mode: "marks" },
 title: "Stretch check",
 q: "Class marks 70, 80, 80 - the mode is…",
 opts: [
 "80 (appears twice)",
 "70 only",
 "75 always",
 "No mode ever",
 ],
 ok: 0,
 onDone: completeSub,
 });
 return;
 }
 const m = modes[step];
 labState.mode = m.mode;
 mountTapContinue(overlay, {
 scene: "meanStretch",
 sceneArgs: { mode: m.mode },
 html: `<div class="lab-demo__badge">Context ${step + 1} of ${modes.length}</div>${m.html}`,
 onDone: () => {
 step++;
 show();
 },
 });
 }
 show();
}

function sub8_myths({ overlay, setCoach, completeSub }) {
 setCoach("Misconceptions: claim first on canvas; truth appears only after you bust the myth.");
 mountMythCards(overlay, {
 scene: "meanMyth",
 title: "Myth Bust",
 badge: LAB_ASSET_PATHS.myth,
 myths: [
 {
 sceneMyth: 0,
 title: "“Mean and mode are always equal”",
 claim: "Mean and mode are always the same number.",
 truth: "They can differ - mean balances; mode is most common.",
 },
 {
 sceneMyth: 1,
 title: "“Mode needs every value once”",
 claim: "Mode needs every value to appear exactly once.",
 truth: "Mode is the value that appears most (ties allowed).",
 },
 {
 sceneMyth: 2,
 title: "“Mean ignores the count”",
 claim: "Mean ignores how many values you have.",
 truth: "Mean divides by the count of values.",
 },
 {
 sceneMyth: 3,
 title: "“Only adults use averages”",
 claim: "Only adults use averages.",
 truth: "Kids use mean/mode for marks, scores, and prices.",
 },
 {
 sceneMyth: 4,
 title: "“Outliers never move the mean”",
 claim: "One outlier never moves the mean.",
 truth: "A very large or small value can pull the mean.",
 },
 ],
 onDone: completeSub,
 });
}

function sub9_drill({ overlay, setCoach, completeSub }) {
 setCoach("Fluency: quick mean/mode checks. Need about 80% to unlock Continue.");
 mountSpeedDrill(overlay, {
 scene: "meanDrill",
 title: "Fluency Drill",
 passScene: "meanMastery",
 passRatio: 0.8,
 items: [
 { prompt: "3,5,7", q: "Mean of 3, 5, 7?", opts: ["5", "7", "15", "3"], ok: 0 },
 { prompt: "2,2,9", q: "Mode of 2, 2, 9?", opts: ["2", "9", "5.5", "None"], ok: 0 },
 { prompt: "Mean", q: "Mean needs…", opts: ["Sum then divide", "Only the biggest", "Only color", "Guess"], ok: 0 },
 { prompt: "Mode", q: "Mode is…", opts: ["Most common", "Always the mean", "Never a number", "Only odd"], ok: 0 },
 { prompt: "Differ?", q: "Can mean ≠ mode?", opts: ["Yes", "Never"], ok: 0 },
 { prompt: "Color?", q: "Favorite color is a mean?", opts: ["No", "Yes"], ok: 0 },
 { prompt: "Outlier", q: "A huge outlier usually…", opts: ["Pulls the mean", "Never moves mean", "Deletes mode", "Ends math"], ok: 0 },
 { prompt: "Tie mode", q: "Two values appear most equally - mode is…", opts: ["Both (a tie)", "Neither ever", "Only the mean", "Always zero"], ok: 0 },
 ],
 onDone: completeSub,
 });
}

function sub10_mastery({ overlay, setCoach, completeSub }) {
 setCoach("Mastery: rebuild the path, transfer to snack prices, then prove it.");
 playScene("meanMastery");
 mountOrderSteps(overlay, {
 scene: "meanMastery",
 title: "Mean Scout Mastery - learning path",
 instructions: "Tap Bruner order: meet → sort → labs → rule → stretch/myths.",
 items: [
 { id: "1", html: "Meet mean & mode on a list (concrete)" },
 { id: "2", html: "Sort mean / mode / not-a-summary" },
 { id: "3", html: "Outlier dial + mode peak labs" },
 { id: "4", html: "Name sum÷count and mode rule" },
 { id: "5", html: "Stretch + bust myths" },
 ],
 correctIds: ["1", "2", "3", "4", "5"],
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "meanMastery",
 html: `<h3>Mixed case</h3>
 <p><strong>Three snack prices 10, 10, 40:</strong> Mode is 10 (appears twice); mean is 20 - the expensive snack pulls the average up.</p>
 <p>Ready for the final checks?</p>`,
 onDone: () => {
 mountMultiQuiz(overlay, {
 scene: "meanMastery",
 title: "Final mastery",
 doneTitle: "Mean Scout ready",
 items: [
 {
 q: "Marks, cricket runs, and shop prices all teach the same idea because…",
 opts: [
 "They are number lists where mean balances and mode crowns popularity",
 "They are unrelated magic tricks",
 "Only shops have a mode",
 "Mean never uses a count",
 ],
 ok: 0,
 },
 {
 q: "A correct statement about mean vs mode is…",
 opts: [
 "Mean = sum÷count; mode = most common value (they can differ)",
 "Mean and mode are identical words with no difference",
 "Mode is always bigger than the mean",
 "Mean ignores outliers forever",
 ],
 ok: 0,
 },
 {
 q: "Which belongs in “not a summary”?",
 opts: [
 "A random guess with no data",
 "Add then divide",
 "Most common mark",
 "Balance line of the set",
 ],
 ok: 0,
 },
 ],
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "meanMastery",
 badge: LAB_ASSET_PATHS.m1,
 html: `<h3>Mission 1 complete path</h3>
 <p>You earned the story arc from concrete lists to a reusable average rule. Use step dots to replay any weak spot. Press <strong>Next</strong> in the dock to claim <strong>Mean Scout</strong>.</p>`,
 onDone: completeSub,
 advanceAfterDone: true,
 });
 },
 });
 },
 });
 },
 });
}
