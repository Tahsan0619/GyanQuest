/**
 * Math Quest Mission 1: Number Sense panel mounts.
 */
import {
 labState,
 pulseFailFeedback,
 NUM_SLOW_NEED,
 NUM_TENS_NEED,
 NUM_ONES_NEED,
} from "./lab-state.js?v=numbersense1";
import { playScene, once, trackCleanup, narrationHtml } from "./lab-activities.js?v=numbersense1";
import {
 tapApple,
 countNextDot,
 startBundling,
 lassoNext,
 snapBundle,
 placeBlock,
 sortBank,
 pickBank,
} from "./num-scenes.js?v=numbersense1";

export function mountNumCount(host, cfg) {
 const finish = once(() => cfg.onDone());
 let cancelled = false;
 let iv = null;
 trackCleanup(() => {
 cancelled = true;
 if (iv) clearInterval(iv);
 });
 labState.numApples = {};
 labState.numCountDone = false;
 labState.prompt = "";
 playScene("numCount");
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 1: Enactive</div>
 <h3>Count them yourself</h3>
 ${narrationHtml(
 "That's really all counting is: matching each item to exactly one number word, in the right order, with nothing skipped and nothing counted twice. It feels automatic because you've done it thousands of times, but you just watched yourself do it, one tap at a time.",
 )}
 <p class="drag-hint">Tap each apple, on the canvas or here. Each one only counts once.</p>
 <div class="chip-bank" id="num-ap-bank"></div>
 <p id="num-ap-status" class="drag-hint" aria-live="polite">0 of 8 counted.</p>
 <button type="button" class="btn primary" id="num-ap-go" disabled>Continue ▶</button>
 </div>`;
 const bank = host.querySelector("#num-ap-bank");
 const status = host.querySelector("#num-ap-status");
 const go = host.querySelector("#num-ap-go");
 let lastN = Object.keys(labState.numApples || {}).length;
 function renderBank() {
 bank.innerHTML = Array.from({ length: 8 }, (_, i) =>
 labState.numApples[i]
 ? ""
 : `<button type="button" class="chip" data-ap="${i}">Apple ${i + 1}</button>`,
 ).join("");
 bank.querySelectorAll("[data-ap]").forEach((btn) => {
 btn.onclick = () => tapApple(Number(btn.dataset.ap));
 });
 }
 renderBank();
 iv = setInterval(() => {
 if (cancelled) return;
 const n = Object.keys(labState.numApples || {}).length;
 status.textContent = labState.numCountDone
 ? labState.prompt
 : labState.prompt && labState.prompt.startsWith("Already")
 ? labState.prompt
 : `${n} of 8 counted.`;
 if (n !== lastN) {
 lastN = n;
 renderBank();
 }
 if (labState.numCountDone) go.disabled = false;
 }, 160);
 go.onclick = () => finish();
}

export function mountNumAmount(host, cfg) {
 const finish = once(() => cfg.onDone());
 let stage = "icon";
 trackCleanup(() => {});
 labState.phase = "icon";
 playScene("numAmount", { phase: "icon" });
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 1: Iconic</div>
 <h3 id="num-am-title">The same number</h3>
 <div id="num-am-body"></div>
 <button type="button" class="btn primary" id="num-am-go">Lock the words ▶</button>
 </div>`;
 const title = host.querySelector("#num-am-title");
 const body = host.querySelector("#num-am-body");
 const go = host.querySelector("#num-am-go");
 body.innerHTML = `${narrationHtml(
 "Apples and stars have nothing in common at all, except one thing: there are exactly 8 of each. A number captures that one shared fact and throws away everything else. That's the whole power of a number: it's a pure amount, completely separate from whatever you're counting.",
 )}<p class="tiny-onscreen">8 apples. 8 stars. Completely different things, but the exact same number.</p>`;
 go.onclick = () => {
 if (stage === "icon") {
 stage = "card";
 labState.phase = "card";
 playScene("numAmount", { phase: "card" });
 title.textContent = "Number, numeral, counting";
 body.innerHTML = `${narrationHtml(
 "Quick vocabulary check: the amount is called a number. The symbol you write for it, like this 8, is called a numeral. Small distinction, but it matters, because what we're about to discover only works because of a clever trick in how those numerals are built.",
 )}<p class="tiny-onscreen"><strong>Number</strong> - an amount or quantity.</p>
 <p class="tiny-onscreen"><strong>Numeral</strong> - the symbol we write down to represent a number (like 8).</p>
 <p class="tiny-onscreen"><strong>Counting</strong> - matching each item in a group to exactly one number word, in order, with none skipped or repeated.</p>`;
 go.textContent = "Continue ▶";
 return;
 }
 finish();
 };
}

export function mountNumBundle(host, cfg) {
 const finish = once(() => cfg.onDone());
 let cancelled = false;
 let iv = null;
 trackCleanup(() => {
 cancelled = true;
 if (iv) clearInterval(iv);
 });
 labState.numCounted = {};
 labState.numSlowDone = false;
 labState.numBundlePhase = "slow";
 labState.numSelected = {};
 labState.numBundled = {};
 labState.numBundles = 0;
 labState.numBundleDone = false;
 labState.numSlowStarted = performance.now();
 labState.prompt = "";
 playScene("numBundle");
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 2: Enactive</div>
 <h3>The slow way vs the fast way</h3>
 ${narrationHtml(
 "Counting one at a time completely falls apart once the pile gets big, but counting in bundles scales beautifully. Four bundles and seven leftovers is instantly readable. Forty-seven individual dots never really is.",
 )}
 <p class="drag-hint" id="num-bu-hint">First, count one by one. Do not skip this. It is supposed to feel slow.</p>
 <div class="btn-row" id="num-bu-row"></div>
 <p id="num-bu-status" class="drag-hint" aria-live="polite">Timer running. Count the next dot.</p>
 <button type="button" class="btn primary" id="num-bu-go" disabled>Continue ▶</button>
 </div>`;
 const hint = host.querySelector("#num-bu-hint");
 const row = host.querySelector("#num-bu-row");
 const status = host.querySelector("#num-bu-status");
 const go = host.querySelector("#num-bu-go");
 function renderRow() {
 if (labState.numBundlePhase !== "bundle") {
 row.innerHTML = `<button type="button" class="btn secondary" id="num-count-next">Count one</button>
 <button type="button" class="btn secondary" id="num-start-bundle" ${labState.numSlowDone ? "" : "disabled"}>Now try bundling</button>`;
 row.querySelector("#num-count-next").onclick = () => countNextDot();
 row.querySelector("#num-start-bundle").onclick = () => {
 if (!labState.numSlowDone) return;
 startBundling();
 renderRow();
 };
 } else {
 row.innerHTML = `<button type="button" class="btn secondary" id="num-lasso">Add 1 to the lasso</button>
 <button type="button" class="btn secondary" id="num-snap">Snap a bundle of 10</button>`;
 row.querySelector("#num-lasso").onclick = () => lassoNext();
 row.querySelector("#num-snap").onclick = () => snapBundle();
 }
 hint.textContent =
 labState.numBundlePhase === "bundle"
 ? "Now bundle: Snap a bundle of 10, four times, until 4 bundles and 7 leftovers remain. You can also tap ten dots on the canvas."
 : "First, count one by one. Do not skip this. It is supposed to feel slow.";
 }
 renderRow();
 let lastPhase = "slow";
 iv = setInterval(() => {
 if (cancelled) return;
 if (labState.numBundlePhase !== lastPhase) {
 lastPhase = labState.numBundlePhase;
 renderRow();
 }
 const sec = Math.floor((performance.now() - (labState.numSlowStarted || performance.now())) / 1000);
 if (labState.numBundlePhase !== "bundle") {
 const n = Object.keys(labState.numCounted || {}).length;
 status.textContent = labState.prompt || `${n} counted. Timer ${sec}s. Need ${NUM_SLOW_NEED} before bundling.`;
 const startBtn = row.querySelector("#num-start-bundle");
 if (startBtn) startBtn.disabled = !labState.numSlowDone;
 } else {
 const sel = Object.keys(labState.numSelected || {}).length;
 status.textContent =
 labState.prompt || `${labState.numBundles || 0} bundles. Lasso ${sel} of 10.`;
 }
 if (labState.numBundleDone) go.disabled = false;
 }, 160);
 go.onclick = () => finish();
}

export function mountNumGroups(host, cfg) {
 const finish = once(() => cfg.onDone());
 let stage = "icon";
 trackCleanup(() => {});
 labState.phase = "icon";
 playScene("numGroups", { phase: "icon" });
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 2: Iconic</div>
 <h3 id="num-gr-title">Trust at a glance</h3>
 <div id="num-gr-body"></div>
 <button type="button" class="btn primary" id="num-gr-go">Name grouping ▶</button>
 </div>`;
 const title = host.querySelector("#num-gr-title");
 const body = host.querySelector("#num-gr-body");
 const go = host.querySelector("#num-gr-go");
 body.innerHTML = `${narrationHtml(
 "This is really a story about trust. A messy pile makes you doubt your own count, but organized groups of ten are something your eyes can verify almost instantly, every single time. That single idea, group things into tens, turns out to be the foundation of the entire number system you already use every day.",
 )}<p class="tiny-onscreen">Messy pile → hard to trust at a glance. Neat groups of ten → trustworthy at a glance, every time.</p>`;
 go.onclick = () => {
 if (stage === "icon") {
 stage = "card";
 labState.phase = "card";
 playScene("numGroups", { phase: "card" });
 title.textContent = "Grouping by tens";
 body.innerHTML = `${narrationHtml(
 "Grouping in tens isn't some mathematical law of the universe. It's just an extremely convenient choice, likely inherited from counting on our own ten fingers. But once you commit to grouping by ten, something remarkable happens to the way we write numbers down.",
 )}<p class="tiny-onscreen"><strong>Grouping (bundling)</strong> - organizing a quantity into equal-sized bundles to make counting faster and more reliable.</p>
 <p class="tiny-onscreen">We group in tens by long-standing convention, likely because humans have 10 fingers to count on.</p>
 <p class="tiny-onscreen">4 bundles of ten, plus 7 leftover, is about to become the exact reason the numeral 47 looks the way it does.</p>`;
 go.textContent = "Continue ▶";
 return;
 }
 finish();
 };
}

export function mountNumBuild(host, cfg) {
 const finish = once(() => cfg.onDone());
 let cancelled = false;
 let iv = null;
 trackCleanup(() => {
 cancelled = true;
 if (iv) clearInterval(iv);
 });
 labState.numBuildTens = 0;
 labState.numBuildOnes = 0;
 labState.numBuildPick = null;
 labState.numBuildDone = false;
 labState.prompt = "";
 playScene("numBuild");
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 3: Enactive</div>
 <h3>Build the number</h3>
 ${narrationHtml(
 "Look closely at what just happened: the 4 in 47 isn't just sitting there. It's specifically telling you 4 groups of ten. The 7 is specifically telling you 7 single leftovers. Move either digit to a different position, and its entire meaning would change. That's the entire design of the system.",
 )}
 <p class="drag-hint">The same 47 dots, now as a target. Place 4 ten-rods and 7 one-cubes.</p>
 <div class="chip-bank">
 <button type="button" class="chip" data-pick="ten">Ten-rod</button>
 <button type="button" class="chip" data-pick="one">One-cube</button>
 </div>
 <div class="btn-row">
 <button type="button" class="btn secondary" data-zone="tens">Tens column</button>
 <button type="button" class="btn secondary" data-zone="ones">Ones column</button>
 </div>
 <p id="num-bd-status" class="drag-hint" aria-live="polite">0 tens + 0 ones.</p>
 <button type="button" class="btn primary" id="num-bd-go" disabled>Continue ▶</button>
 </div>`;
 const status = host.querySelector("#num-bd-status");
 const go = host.querySelector("#num-bd-go");
 host.querySelectorAll("[data-pick]").forEach((btn) => {
 btn.onclick = () => {
 labState.numBuildPick = btn.dataset.pick;
 labState.prompt = "";
 host.querySelectorAll("[data-pick]").forEach((el) => el.classList.toggle("chip--selected", el === btn));
 status.textContent =
 btn.dataset.pick === "ten" ? "Ten-rod ready. Drop it in Tens." : "One-cube ready. Drop it in Ones.";
 };
 });
 host.querySelectorAll("[data-zone]").forEach((btn) => {
 btn.onclick = () => {
 if (!labState.numBuildPick) {
 status.textContent = "Tap a ten-rod or a one-cube first.";
 pulseFailFeedback(180);
 return;
 }
 placeBlock(btn.dataset.zone);
 };
 });
 iv = setInterval(() => {
 if (cancelled) return;
 status.textContent =
 labState.prompt || `${labState.numBuildTens || 0} tens + ${labState.numBuildOnes || 0} ones. Need ${NUM_TENS_NEED} tens and ${NUM_ONES_NEED} ones.`;
 if (labState.numBuildDone) go.disabled = false;
 }, 160);
 go.onclick = () => finish();
}

export function mountNumPlace(host, cfg) {
 const finish = once(() => cfg.onDone());
 let stage = "icon";
 trackCleanup(() => {});
 labState.phase = "icon";
 playScene("numPlace", { phase: "icon" });
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 3: Iconic</div>
 <h3 id="num-pl-title">Every two-digit number</h3>
 <div id="num-pl-body"></div>
 <button type="button" class="btn primary" id="num-pl-go">Write it formally ▶</button>
 </div>`;
 const title = host.querySelector("#num-pl-title");
 const body = host.querySelector("#num-pl-body");
 const go = host.querySelector("#num-pl-go");
 body.innerHTML = `${narrationHtml(
 "Once you can see it, you can't unsee it. Every two-digit number you'll ever read is silently telling you exactly this same story: how many full groups of ten, and how many single leftovers. Even a number like 30, with that zero sitting in the ones place, is really just saying exactly 3 tens, and not a single leftover.",
 )}<p class="tiny-onscreen">82 = 8 tens + 2 ones. 15 = 1 ten + 5 ones. 30 = 3 tens + 0 ones.</p>`;
 go.onclick = () => {
 if (stage === "icon") {
 stage = "card";
 labState.phase = "card";
 playScene("numPlace", { phase: "card" });
 title.textContent = "Place value";
 body.innerHTML = `${narrationHtml(
 "This system has a name: place value, and the number written in expanded form, 4 times 10, plus 7 times 1, is just a formal way of writing exactly what you built with blocks a minute ago. Each new position you move to the left is worth ten times more than the one before it, which means this exact trick can build numbers of literally any size.",
 )}<p class="tiny-onscreen"><strong>Place value</strong> - the value of a digit based on its position in a number.</p>
 <p class="tiny-onscreen"><strong>Expanded form:</strong> 47 = (4 × 10) + (7 × 1).</p>
 <p class="tiny-onscreen">Reading right to left: the ones place, then the tens place. Each new position is worth ten times the one before it.</p>`;
 go.textContent = "Continue ▶";
 return;
 }
 finish();
 };
}

export function mountNumCompare(host, cfg) {
 const finish = once(() => cfg.onDone());
 let cancelled = false;
 let iv = null;
 trackCleanup(() => {
 cancelled = true;
 if (iv) clearInterval(iv);
 });
 labState.numBankL = false;
 labState.numBankR = false;
 labState.numCompareDone = false;
 labState.prompt = "";
 playScene("numCompare");
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 4: Enactive</div>
 <h3>Which has more?</h3>
 ${narrationHtml(
 "This is exactly why place value matters far beyond just reading a number out loud. It's what lets you instantly compare, add, and reason about numbers of any size, from a handful of coins all the way up to a number with hundreds, thousands, or millions in it. It's the exact same pattern, just extended further and further to the left.",
 )}
 <p class="drag-hint">First the jumble is hard. Sort each bank into tens, then tap the one with more.</p>
 <div class="btn-row">
 <button type="button" class="btn secondary" data-sort="L">Sort bank A</button>
 <button type="button" class="btn secondary" data-sort="R">Sort bank B</button>
 </div>
 <div class="btn-row">
 <button type="button" class="btn secondary" data-bank="L">Bank A has more</button>
 <button type="button" class="btn secondary" data-bank="R">Bank B has more</button>
 </div>
 <p id="num-co-status" class="drag-hint" aria-live="polite">Coins are jumbled. Sort into tens first.</p>
 <button type="button" class="btn primary" id="num-co-go" disabled>Continue ▶</button>
 </div>`;
 const status = host.querySelector("#num-co-status");
 const go = host.querySelector("#num-co-go");
 host.querySelectorAll("[data-sort]").forEach((btn) => {
 btn.onclick = () => sortBank(btn.dataset.sort);
 });
 host.querySelectorAll("[data-bank]").forEach((btn) => {
 btn.onclick = () => pickBank(btn.dataset.bank);
 });
 iv = setInterval(() => {
 if (cancelled) return;
 status.textContent = labState.prompt || "Coins are jumbled. Sort into tens first.";
 if (labState.numCompareDone) go.disabled = false;
 }, 160);
 go.onclick = () => finish();
}

export function mountNumRoll(host, cfg) {
 const finish = once(() => cfg.onDone());
 let stage = "icon";
 trackCleanup(() => {});
 labState.phase = "icon";
 playScene("numRoll", { phase: "icon" });
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 4: Iconic</div>
 <h3 id="num-ro-title">Rollover</h3>
 <div id="num-ro-body"></div>
 <button type="button" class="btn primary" id="num-ro-go">Name base 10 ▶</button>
 </div>`;
 const title = host.querySelector("#num-ro-title");
 const body = host.querySelector("#num-ro-body");
 const go = host.querySelector("#num-ro-go");
 body.innerHTML = `${narrationHtml(
 "Every time you've watched an odometer roll from 9 to 10, or 99 to 100, you were watching place value happen in real time. A column fills up completely, resets to zero, and hands off exactly one unit to the column on its left. That's the entire system, running quietly, everywhere numbers show up.",
 )}<p class="tiny-onscreen">Every single rollover you've ever seen on an odometer, a clock, or a counter is place value, happening live.</p>`;
 go.onclick = () => {
 if (stage === "icon") {
 stage = "card";
 labState.phase = "card";
 playScene("numRoll", { phase: "card" });
 title.textContent = "Base 10";
 body.innerHTML = `${narrationHtml(
 "Everything you learned today lives inside the phrase base 10, our entire number system, built around grouping by tens. And if you're curious just how flexible this idea really is: computers don't use base 10 at all. They use base 2, called binary, grouping everything in twos instead of tens, using this exact same place-value logic underneath. Same brilliant trick, a different-sized bundle.",
 )}<p class="tiny-onscreen"><strong>Base 10</strong> - our number system, built entirely around grouping in tens, almost certainly because of our 10 fingers.</p>
 <p class="tiny-onscreen">Bonus fact: it didn't have to be base 10. Computers run on base 2 (binary), grouping by twos instead of tens, using the exact same place-value logic you just learned.</p>
 <p class="tiny-onscreen">Next question worth hunting: now that we can represent any number, what happens when we start combining them, adding and subtracting?</p>`;
 go.textContent = "Continue ▶";
 return;
 }
 finish();
 };
}
