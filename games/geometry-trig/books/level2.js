/**
 * Digital book - Geometry Trig / Angle Adventures
 * Theory: cognitive load, dual coding, multimedia learning, constructivism,
 * conceptual change, spiral scaffold, retrieval practice.
 * Photos: local verified copies under /games/geometry-trig/assets/book/ (see CREDITS-m2.json).
 */
export const BOOK = {
 missionIndex: 1,
 title: "Angle Adventures",
 subtitle: "angles / measuring turns",
 subject: "Geometry Trig / Angle Adventures",
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
 title: "Angle Adventures",
 art: "/games/geometry-trig/assets/book/m2-cover.jpg",
 },
 glossary: [
 { id: "angle", term: "angle" },
 { id: "ray", term: "ray" },
 { id: "acute", term: "acute" },
 { id: "right", term: "right" },
 { id: "obtuse", term: "obtuse" },
 { id: "degree", term: "degree" },
 { id: "turn", term: "turn" },
 { id: "protractor", term: "protractor" },
 { id: "vertex", term: "vertex" },
 { id: "straight", term: "straight" },
 ],
 pages: [
 {
 title: "Why Angle Adventures?",
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
 src: "/games/geometry-trig/assets/book/m2-hook.jpg",
 caption: "Figure 1. Measurement tools make turns visible.",
 alt: "Measurement",
 },
 {
 src: "/games/geometry-trig/assets/book/m2-cover.jpg",
 caption: "Orbit paths are full of turning angles.",
 alt: "Orbit diagram",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "An angle is a turn between two rays. Acute is under 90 degrees, right is exactly 90 degrees, obtuse is over 90 but under 180.",
 },
 {
 type: "p",
 text: "Clock hands, open doors, and roof pitches are angles you already live inside.",
 },
 {
 type: "p",
 text: "Everyday hook: a door swing from shut to open is a growing angle.",
 },
 ],
 },
 {
 title: "Turn, not ray length",
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
 src: "/games/geometry-trig/assets/book/m2-model.jpg",
 caption: "Figure 2. Moon phases dance around turning geometry in the sky.",
 alt: "Full moon",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Bigger looking lines do not mean a bigger angle. Angle is the turn amount.",
 },
 {
 type: "ul",
 items: [
 "Compare to a square corner to spot right angles",
 "Acute is sharp and under 90",
 "Obtuse is wider than a corner but not a straight line",
 ],
 },
 ],
 },
 {
 title: "Angle dial",
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
 src: "/games/geometry-trig/assets/book/m2-mechanism.jpg",
 caption: "Figure 3. Engineered geometry is full of right corners.",
 alt: "Geometry forms",
 },
 {
 src: "/games/geometry-trig/assets/book/m2-lab.jpg",
 caption: "Practice naming angles on classroom objects.",
 alt: "Education",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "In the lab you dialed turns until acute, right, and obtuse felt distinct.",
 },
 {
 type: "p",
 text: "Degrees here measure turns - not thermometer weather.",
 },
 ],
 },
 {
 title: "Right angles everywhere",
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
 src: "/games/geometry-trig/assets/book/m2-mastery.jpg",
 caption: "Figure 4. Patterned turns - train recognition.",
 alt: "Pattern",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Right angles appear in squares, books, tiles, and window frames - not only in triangles.",
 },
 {
 type: "p",
 text: "You can often compare to a square corner by eye before grabbing a protractor.",
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
 text: "Meet angles -> dial turns -> sort acute/right/obtuse -> stronger lab -> why degrees -> name the angle rule -> stretch roofs -> myths -> fluency -> mastery.",
 },
 {
 type: "ul",
 items: [
 "Sorting locks the three kid-level angle kinds",
 "Labs separate turn size from ray length",
 "Rule: angle measures turn between two rays",
 ],
 },
 ],
 },
 {
 title: "Street lab: clock hands",
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
 src: "/games/geometry-trig/assets/book/m2-cover.jpg",
 caption: "Turning paths.",
 alt: "Orbit",
 },
 {
 src: "/games/geometry-trig/assets/book/m2-model.jpg",
 caption: "Sky geometry.",
 alt: "Moon",
 },
 {
 src: "/games/geometry-trig/assets/book/m2-hook.jpg",
 caption: "Measure turns.",
 alt: "Measurement",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "At 3:00, clock hands make a right angle. At other times, classify acute or obtuse by eye.",
 },
 {
 type: "ul",
 items: [
 "Open a book and call the corner a right angle check",
 "Find one roof that looks obtuse from the side",
 "Flip carousel: orbit turn vs moon disk",
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
 text: "Myth: bigger looking lines mean a bigger angle. Better: angle is the turn, not how long the rays are drawn.",
 },
 {
 type: "p",
 text: "Myth: acute means any angle under 180. Better: acute is under 90 degrees; obtuse is over 90.",
 },
 {
 type: "p",
 text: "Myth: degrees are only for thermometers. Better: angle degrees measure turns; temperature is a different degree idea.",
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
 src: "/games/geometry-trig/assets/book/m2-mastery.jpg",
 caption: "Figure 5. Recognize turns - your angle goal.",
 alt: "Pattern anchor",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Teach a friend: angle = turn; compare to a square corner; name acute, right, obtuse.",
 },
 {
 type: "ul",
 items: [
 "Draw all three kinds and label",
 "Find a right angle in the room",
 "Use the word degree correctly once",
 ],
 },
 ],
 },
 ],
};

export default BOOK;
