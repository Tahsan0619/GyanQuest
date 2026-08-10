/**
 * Digital book - Statistics Probability / Chance Games
 * Theory: cognitive load, dual coding, multimedia learning, constructivism,
 * conceptual change, spiral scaffold, retrieval practice.
 * Photos: local verified copies under /games/statistics-probability/assets/book/ (see CREDITS-m2.json).
 */
export const BOOK = {
 missionIndex: 1,
 title: "Chance Games",
 subtitle: "probability / fair shares of outcomes",
 subject: "Statistics Probability / Chance Games",
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
 title: "Chance Games",
 art: "/games/statistics-probability/assets/book/m2-cover.jpg",
 },
 glossary: [
 { id: "probability", term: "probability" },
 { id: "outcome", term: "outcome" },
 { id: "fair", term: "fair" },
 { id: "chance", term: "chance" },
 { id: "trial", term: "trial" },
 { id: "impossible", term: "impossible" },
 { id: "likely", term: "likely" },
 { id: "share", term: "share" },
 { id: "random", term: "random" },
 { id: "sample", term: "sample" },
 ],
 pages: [
 {
 title: "Why Chance Games?",
 layout: "text",
 theory: [
 "constructivism",
 "dual-coding",
 "cognitive-load",
 ],
 figures: [
 {
 place: "top",
 slides: [
 {
 src: "/games/statistics-probability/assets/book/m2-hook.jpg",
 caption: "Figure 1. Worlds of outcomes - chance ideas scale from coins to orbits.",
 alt: "Planets",
 },
 {
 src: "/games/statistics-probability/assets/book/m2-cover.jpg",
 caption: "Patterns of possibility - not promises of the next flip.",
 alt: "Pattern",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Probability is a fair share of outcomes. A fair coin is 1/2 heads; a fair die gives each face an equal shot.",
 },
 {
 type: "p",
 text: "Cricket tosses, board-game dice, and fun-fair spinners are probability labs in disguise.",
 },
 {
 type: "p",
 text: "Everyday hook: before a cricket match, the coin does not remember the last five tosses.",
 },
 ],
 },
 {
 title: "Fair shares",
 layout: "full-fig",
 theory: [
 "multimedia-learning",
 "dual-coding",
 ],
 figures: [
 {
 place: "full",
 slides: [
 {
 src: "/games/statistics-probability/assets/book/m2-model.jpg",
 caption: "Figure 2. Planned paths still meet uncertainty in measurement - chance has rules too.",
 alt: "Orbit diagram",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "A probability share stays between 0 and 1. Face 7 on a standard die is impossible - not just unlikely.",
 },
 {
 type: "ul",
 items: [
 "Fair coin: about 1/2 heads",
 "Fair die: 1/6 each face",
 "More fair trials usually settle closer to the true share",
 ],
 },
 ],
 },
 {
 title: "Chance dial",
 layout: "text",
 theory: [
 "cognitive-load",
 "dual-coding",
 ],
 figures: [
 {
 place: "top",
 slides: [
 {
 src: "/games/statistics-probability/assets/book/m2-mechanism.jpg",
 caption: "Figure 3. Geometry of outcomes - sample spaces have shapes.",
 alt: "Geometry",
 },
 {
 src: "/games/statistics-probability/assets/book/m2-lab.jpg",
 caption: "Run trials like experiments; tally honestly.",
 alt: "Experiment",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "In the lab you dialed until fair shares felt intuitive - not mystical.",
 },
 {
 type: "p",
 text: "Casinos are not the only users; weather and games use chance ideas too.",
 },
 ],
 },
 {
 title: "No memory myth",
 layout: "full-fig",
 theory: [
 "multimedia-learning",
 "spiral-scaffold",
 ],
 figures: [
 {
 place: "full",
 slides: [
 {
 src: "/games/statistics-probability/assets/book/m2-mastery.jpg",
 caption: "Figure 4. Honest counting beats streak stories.",
 alt: "Abacus",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "After five heads, tails is not 'due'. A fair coin has no memory - still about 1/2.",
 },
 {
 type: "p",
 text: "Record many tosses. Watch the share settle instead of chasing streaks.",
 },
 ],
 },
 {
 title: "How the 10 steps connect",
 layout: "text",
 theory: [
 "spiral-scaffold",
 "cognitive-load",
 ],
 blocks: [
 {
 type: "p",
 text: "Meet chance -> dial fair share -> sort possible/impossible -> stronger lab -> why trials -> name the probability rule -> stretch tosses -> myths -> fluency -> mastery.",
 },
 {
 type: "ul",
 items: [
 "Sorting separates impossible from unlikely",
 "Labs show shares between 0 and 1",
 "Rule: probability is a fair share of outcomes",
 ],
 },
 ],
 },
 {
 title: "Street lab: coin tally",
 layout: "split",
 theory: [
 "constructivism",
 "dual-coding",
 "retrieval-practice",
 ],
 figures: [
 {
 place: "right",
 slides: [
 {
 src: "/games/statistics-probability/assets/book/m2-hook.jpg",
 caption: "Outcome worlds.",
 alt: "Planets",
 },
 {
 src: "/games/statistics-probability/assets/book/m2-mastery.jpg",
 caption: "Tally true.",
 alt: "Abacus",
 },
 {
 src: "/games/statistics-probability/assets/book/m2-cover.jpg",
 caption: "Possibility pattern.",
 alt: "Pattern",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Toss a fair coin 20 times. Tally heads. Compare your share to 1/2. Discuss streaks without inventing memory.",
 },
 {
 type: "ul",
 items: [
 "Explain why face 7 never appears on a standard die",
 "Name one spinner at a fair and its fair-share idea",
 "Flip carousel: planet outcomes vs abacus tallies",
 ],
 },
 ],
 },
 {
 title: "Myths to bust",
 layout: "text",
 theory: [
 "conceptual-change",
 ],
 blocks: [
 {
 type: "p",
 text: "Myth: after five heads, tails is 'due'. Better: fair coin has no memory - still about 1/2.",
 },
 {
 type: "p",
 text: "Myth: probability can be bigger than 1. Better: a share stays between 0 and 1.",
 },
 {
 type: "p",
 text: "Myth: die face 7 is just unlikely. Better: face 7 is impossible on a standard die.",
 },
 {
 type: "p",
 text: "Red words are glossary terms. Tap one to ask the tutor.",
 },
 ],
 },
 {
 title: "Mastery",
 layout: "text",
 theory: [
 "retrieval-practice",
 "spiral-scaffold",
 ],
 figures: [
 {
 place: "top",
 slides: [
 {
 src: "/games/statistics-probability/assets/book/m2-mastery.jpg",
 caption: "Figure 5. Count outcomes - your chance goal.",
 alt: "Abacus anchor",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Teach a friend: fair share between 0 and 1; coins forget; more trials clarify the share.",
 },
 {
 type: "ul",
 items: [
 "State P(heads) for a fair coin",
 "Give one impossible event on a die",
 "Use the word probability correctly once",
 ],
 },
 ],
 },
 ],
};

export default BOOK;
