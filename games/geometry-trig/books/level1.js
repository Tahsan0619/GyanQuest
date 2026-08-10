/**
 * Digital book - Geometry Trig / Shape Studio
 * Theory: cognitive load, dual coding, multimedia learning, constructivism,
 * conceptual change, spiral scaffold, retrieval practice.
 * Photos: local verified copies under /games/geometry-trig/assets/book/ (see CREDITS-m1.json).
 */
export const BOOK = {
 missionIndex: 0,
 title: "Shape Studio",
 subtitle: "polygons / sides & corners",
 subject: "Geometry Trig / Shape Studio",
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
 title: "Shape Studio",
 art: "/games/geometry-trig/assets/book/m1-cover.jpg",
 },
 glossary: [
 { id: "polygon", term: "polygon" },
 { id: "triangle", term: "triangle" },
 { id: "square", term: "square" },
 { id: "rectangle", term: "rectangle" },
 { id: "circle", term: "circle" },
 { id: "side", term: "side" },
 { id: "corner", term: "corner" },
 { id: "vertex", term: "vertex" },
 { id: "quadrilateral", term: "quadrilateral" },
 { id: "edge", term: "edge" },
 ],
 pages: [
 {
 title: "Why Shape Studio?",
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
 src: "/games/geometry-trig/assets/book/m1-hook.jpg",
 caption: "Figure 1. Geometry shows up in engineered forms.",
 alt: "Geometry imagery",
 },
 {
 src: "/games/geometry-trig/assets/book/m1-cover.jpg",
 caption: "Sides and corners - start by counting.",
 alt: "Geometry forms",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Shapes have rules: triangles have 3 sides, squares have 4 equal sides and right angles, circles are round with no corners.",
 },
 {
 type: "p",
 text: "Traffic signs, floor tiles, and rickshaw wheels use those rules in the street.",
 },
 {
 type: "p",
 text: "Everyday hook: a yield sign's triangle shape is a safety language you can count.",
 },
 ],
 },
 {
 title: "Count sides first",
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
 src: "/games/geometry-trig/assets/book/m1-model.jpg",
 caption: "Figure 2. Patterns help you compare shapes side by side.",
 alt: "Pattern",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Side count is the first clue to the shape name. Not every 4-sided shape is a square.",
 },
 {
 type: "ul",
 items: [
 "Triangle: 3 sides",
 "Quadrilateral family: 4 sides (rectangle, square, others)",
 "Circle: round - no corners",
 ],
 },
 ],
 },
 {
 title: "Shape dial",
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
 src: "/games/geometry-trig/assets/book/m1-mechanism.jpg",
 caption: "Figure 3. Planet disks remind us: circles are a special round story.",
 alt: "Planets",
 },
 {
 src: "/games/geometry-trig/assets/book/m1-lab.jpg",
 caption: "Classroom tiles and posters are shape museums.",
 alt: "Classroom",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "In the lab you dialed until sides and corners snapped into named shapes.",
 },
 {
 type: "p",
 text: "Triangles can be tall, wide, or right-angled - still 3 sides.",
 },
 ],
 },
 {
 title: "Corners and curves",
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
 src: "/games/geometry-trig/assets/book/m1-mastery.jpg",
 caption: "Figure 4. Measurement habits pair with shape names.",
 alt: "Measurement",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Corners (vertices) meet sides. Circles trade corners for a smooth curve.",
 },
 {
 type: "p",
 text: "Shape names are tools for signs, buildings, and machines - not only art class.",
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
 text: "Meet shapes -> dial sides -> sort polygons -> stronger lab -> why names -> name the shape rule -> stretch street signs -> myths -> fluency -> mastery.",
 },
 {
 type: "ul",
 items: [
 "Sorting separates triangles, quads, circles",
 "Labs make side-counting automatic",
 "Rule: count sides and corners, then name the shape",
 ],
 },
 ],
 },
 {
 title: "Street lab: sign hunt",
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
 src: "/games/geometry-trig/assets/book/m1-cover.jpg",
 caption: "Forms.",
 alt: "Geometry",
 },
 {
 src: "/games/geometry-trig/assets/book/m1-mechanism.jpg",
 caption: "Round disks.",
 alt: "Planets",
 },
 {
 src: "/games/geometry-trig/assets/book/m1-model.jpg",
 caption: "Compare patterns.",
 alt: "Pattern",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Spot three signs or tiles. Count sides. Name the shape. Note equal sides if you see them.",
 },
 {
 type: "ul",
 items: [
 "Find one circle that is not a sign (wheel)",
 "Explain why a rectangle is not always a square",
 "Flip carousel: geometry forms vs planet disks",
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
 text: "Myth: every 4-sided shape is a square. Better: rectangles and other quads exist - squares need equal sides + right angles.",
 },
 {
 type: "p",
 text: "Myth: circles have 4 corners. Better: circles are round - no corners.",
 },
 {
 type: "p",
 text: "Myth: counting sides is useless. Better: side count is the first clue to the shape name.",
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
 src: "/games/geometry-trig/assets/book/m1-mastery.jpg",
 caption: "Figure 5. Measure and name - your shape goal.",
 alt: "Measurement anchor",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Teach a friend: count sides, check corners, then name - square is a special rectangle.",
 },
 {
 type: "ul",
 items: [
 "Draw triangle, square, circle and label",
 "Point to one street shape",
 "Use the word polygon correctly once",
 ],
 },
 ],
 },
 ],
};

export default BOOK;
