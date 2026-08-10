/**
 * Digital book - Calculus & Analysis Mission 1: Slope Stories
 * Theory: cognitive load, dual coding, multimedia learning, constructivism,
 * conceptual change, spiral scaffold, retrieval practice.
 * Photos: assets/book-shared math theme (see assets/book/CREDITS-m1.json).
 */
export const BOOK = {
 missionIndex: 0,
 title: "Slope Stories",
 subtitle: "steep = faster change",
 subject: "Calculus Analysis / Slope Stories",
 theories: [
 "cognitive-load",
 "dual-coding",
 "multimedia-learning",
 "constructivism",
 "conceptual-change",
 "spiral-scaffold",
 "retrieval-practice",
 ],
 cover: {
 title: "Slope Stories",
 art: "/games/calculus-analysis/assets/book/m1-cover.jpg",
 },
 glossary: [
 { id: "slope", term: "slope" },
 { id: "rate", term: "rate" },
 { id: "steep", term: "steep" },
 { id: "rise", term: "rise" },
 { id: "run", term: "run" },
 { id: "graph", term: "graph" },
 { id: "change", term: "change" },
 { id: "linear", term: "linear" },
 ],
 pages: [
 {
 title: "Hills that teach rate",
 layout: "text",
 theory: ["constructivism", "dual-coding", "cognitive-load"],
 figures: [
 {
 place: "top",
 slides: [
 {
 src: "/games/calculus-analysis/assets/book/m1-hook.jpg",
 caption: "Figure 1. A graph is a map of how fast a value climbs or falls.",
 alt: "Data graph showing change over an axis",
 },
 {
 src: "/games/calculus-analysis/assets/book/m1-cover.jpg",
 caption: "Counting tools remind us: rate is how much per step, not a mood.",
 alt: "Abacus used for counting and comparing amounts",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Walk a gentle path and your height rises slowly. Walk a steep ramp and the same forward step lifts you farther. That feeling is slope: steep means faster change.",
 },
 {
 type: "p",
 text: "In class, a graph plays the same game. A steeper line is a higher rate - more rise for each bit of run.",
 },
 {
 type: "p",
 text: "Bangladesh everyday: a hill walk, a marks graph on the board, or a scooter gaining speed on a ramp all whisper the same rule.",
 },
 ],
 },
 {
 title: "Rise over run",
 layout: "full-fig",
 theory: ["multimedia-learning", "dual-coding"],
 figures: [
 {
 place: "full",
 slides: [
 {
 src: "/games/calculus-analysis/assets/book/m1-model.jpg",
 caption: "Figure 2. Geometry of change - compare vertical jump to horizontal travel.",
 alt: "Geometric diagram relating lengths and angles",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Slope = rise / run. Rise is the up-down change. Run is the along-the-axis change.",
 },
 {
 type: "ul",
 items: [
 "Bigger rise, same run -> steeper, faster change",
 "Same rise, longer run -> gentler, slower change",
 "Flat line -> rate near zero",
 ],
 },
 ],
 },
 {
 title: "What the steepness signals",
 layout: "text",
 theory: ["cognitive-load", "dual-coding"],
 figures: [
 {
 place: "top",
 slides: [
 {
 src: "/games/calculus-analysis/assets/book/m1-mechanism.jpg",
 caption: "Figure 3. Repeating patterns help you spot rate without guessing.",
 alt: "Repeating visual pattern used to compare steps",
 },
 {
 src: "/games/calculus-analysis/assets/book/m1-detail.jpg",
 caption: "Measurement turns a gut sense of steep into a number you can check.",
 alt: "Measurement tools and scale marks",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Slope is not decoration on a graph. It answers: how fast is this quantity changing?",
 },
 {
 type: "p",
 text: "If two lines share the same run length, the steeper one wins on rate. That is why ramp speed and exam-score trends both care about steepness.",
 },
 ],
 },
 {
 title: "Orbit of a linear story",
 layout: "full-fig",
 theory: ["multimedia-learning", "spiral-scaffold"],
 figures: [
 {
 place: "full",
 slides: [
 {
 src: "/games/calculus-analysis/assets/book/m1-transfer.jpg",
 caption: "Figure 4. Even space diagrams track change against a path - rate thinking travels.",
 alt: "Orbit diagram showing motion along a path",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "A line on paper is a model. Real hills bend and real speeds vary, yet the first tool is still rise over run on a local stretch.",
 },
 ],
 },
 {
 title: "Mission path for Slope Scout",
 layout: "text",
 theory: ["spiral-scaffold", "cognitive-load"],
 blocks: [
 {
 type: "p",
 text: "The lab moved from seeing gentle vs steep lines, to sorting slope ideas, to naming the rate rule out loud.",
 },
 {
 type: "ul",
 items: [
 "Clarity dial: feel steepness before naming it",
 "Sort: slope clue vs not-a-slope clue",
 "Steeper lab: watch rate jump when the line tilts",
 "Rule lock: steep = faster change, rise over run",
 ],
 },
 {
 type: "p",
 text: "Short canvas steps kept working memory light. This book stitches the full rate story.",
 },
 ],
 },
 {
 title: "Ramp and board lab",
 layout: "split",
 theory: ["constructivism", "dual-coding", "retrieval-practice"],
 figures: [
 {
 place: "right",
 slides: [
 {
 src: "/games/calculus-analysis/assets/book/m1-hook.jpg",
 caption: "Class graph - compare two lines with the same run.",
 alt: "Classroom-style graph",
 },
 {
 src: "/games/calculus-analysis/assets/book/m1-model.jpg",
 caption: "Geometry view - mark rise and run with your finger.",
 alt: "Geometry figure for rise and run",
 },
 {
 src: "/games/calculus-analysis/assets/book/m1-detail.jpg",
 caption: "Measure - turn steep into a checked number.",
 alt: "Measurement close-up",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Pick a hill walk, a board graph, or a ramp. Ask which stretch has the higher rate of height or speed change.",
 },
 {
 type: "ul",
 items: [
 "Where is rise largest for a small run?",
 "Which stretch is nearly flat?",
 "Say the slope sentence without looking at the book",
 ],
 },
 ],
 },
 {
 title: "Slope myths",
 layout: "text",
 theory: ["conceptual-change"],
 blocks: [
 {
 type: "p",
 text: "Myth: A steep line always means a big value. Better: steep means fast change; the value itself can still be small.",
 },
 {
 type: "p",
 text: "Myth: Slope is only for mountains. Better: any graphed quantity - marks, rainfall, speed - can have a slope.",
 },
 {
 type: "p",
 text: "Myth: Rise alone is enough. Better: without run, you cannot name a rate.",
 },
 {
 type: "p",
 text: "Glossary words in red open the tutor - try slope or rate.",
 },
 ],
 },
 {
 title: "Slope Scout check",
 layout: "text",
 theory: ["retrieval-practice", "spiral-scaffold"],
 figures: [
 {
 place: "top",
 slides: [
 {
 src: "/games/calculus-analysis/assets/book/m1-cover.jpg",
 caption: "Figure 5. Teach rate with one picture and one ramp story.",
 alt: "Abacus as teaching anchor",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Sixty-second teach: steep means faster change; slope is rise over run; a class graph and a hill walk both show rate.",
 },
 {
 type: "ul",
 items: [
 "Sketch a gentle line and a steep line with the same run",
 "Point to a real ramp and name rise vs run",
 "Use the word rate correctly once",
 ],
 },
 ],
 },
 ],
};

export default BOOK;
