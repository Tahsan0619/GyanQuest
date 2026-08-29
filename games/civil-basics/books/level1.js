/**
 * Civil Basics Mission 1 book: Strong Structures
 * Companion to the 4-spiral lesson (shapes → stability → load paths → limits).
 */
export const BOOK = {
 missionIndex: 0,
 title: "Strong Structures",
 subtitle: "why shape decides whether something stands",
 subject: "Civil Basics / Strong Structures",
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
 title: "Strong Structures",
 art: "/games/civil-basics/assets/book/gen-cv-m1-cover.png",
 },
 glossary: [
 { id: "truss", term: "truss" },
 { id: "triangle", term: "triangle" },
 { id: "stability", term: "stability" },
 { id: "load-path", term: "load path" },
 { id: "center-of-gravity", term: "center of gravity" },
 { id: "safety-factor", term: "safety factor" },
 { id: "rigidity", term: "rigidity" },
 ],
 pages: [
 {
 title: "Push the square",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/civil-basics/assets/book/gen-cv-m1-fig01-square.png",
 caption: "Figure 1. A square frame can fold sideways even when rods stay strong.",
 alt: "Square frame collapsing sideways under push",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "How strong something is has almost nothing to do with what it is made of - and everything to do with the shape. A square of strong rods can still collapse sideways when pushed, because its corner angles can change without any rod breaking.",
 },
 {
 type: "ul",
 items: [
 "Spiral 1: why triangles stay rigid.",
 "Spiral 2: stability and center of gravity.",
 "Spiral 3: load paths to the ground.",
 "Spiral 4: limits and safety factor.",
 ],
 },
 ],
 },
 {
 title: "Triangles hold shape",
 layout: "full-fig",
 figures: [
 {
 place: "full",
 src: "/games/civil-basics/assets/book/gen-cv-m1-fig02-triangle.png",
 caption: "Figure 2. A triangle cannot change its angles without changing a side length.",
 alt: "Stable triangular truss under sideways push",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "A triangle is a rigid shape. To change a corner, you must stretch or shorten a side. That is why trusses - frames made of triangles - show up in bridges, shelves, and racks. Shape, not just thick rods, decides whether something stands.",
 },
 {
 type: "ul",
 items: [
 "Square: can fold into a diamond.",
 "Triangle: locks its angles.",
 "Truss: many triangles working together.",
 ],
 },
 ],
 },
 {
 title: "Stability in a gust",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/civil-basics/assets/book/gen-cv-m1-fig03-stable.png",
 caption: "Figure 3. Wide bases and low centers of gravity resist tipping.",
 alt: "Tall tippy tower versus wide stable structure",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Stability is resisting tip and slide. A tall skinny tower with a high center of gravity tips easily in wind. A wider base keeps the weight line inside the footprint. Shape again - this time for balance, not just rigidity.",
 },
 ],
 },
 {
 title: "Trace the load",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/civil-basics/assets/book/gen-cv-m1-fig04-loadpath.png",
 caption: "Figure 4. A load path is the glowing road weight travels down to the ground.",
 alt: "Load path arrows through bridge to ground",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "A load path is how force travels from where it sits, through members, into supports, into the ground. If the path is clear, the structure can carry. If the path breaks or concentrates badly, something yields.",
 },
 ],
 },
 {
 title: "Structures you already know",
 layout: "full-fig",
 figures: [
 {
 place: "full",
 src: "/games/civil-basics/assets/book/gen-cv-m1-fig05-real.png",
 caption: "Figure 5. Bridge trusses, shelf brackets, and racks reuse triangles.",
 alt: "Real structures using triangular bracing",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Everyday hook: shelf brackets, model bridges, warehouse racks. Look for triangles and clear paths to the floor. Once you see them, you cannot unsee them.",
 },
 ],
 },
 {
 title: "Load them both",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/civil-basics/assets/book/gen-cv-m1-fig06-loadtest.png",
 caption: "Figure 6. Same weights: weak square sags, triangular truss stands.",
 alt: "Load test comparing square and triangle bridges",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Load distribution spreads weight through members instead of dumping it on one weak spot. A good truss shares the work. A floppy square concentrates trouble at the joints that fold.",
 },
 ],
 },
 {
 title: "Safety factor",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/civil-basics/assets/book/gen-cv-m1-fig07-safety.png",
 caption: "Figure 7. Safety factor is intentional spare strength beyond everyday loads.",
 alt: "Safety factor reserve above normal load",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Engineers design with a safety factor - spare capacity beyond the expected everyday load - because wind, crowds, and surprises happen. Standing on purpose includes planning for more than a calm day.",
 },
 ],
 },
 {
 title: "Bridge lab",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/civil-basics/assets/book/gen-cv-m1-fig08-lab.png",
 caption: "Figure 8. Build triangles. Push gently. Trace how the load travels.",
 alt: "Child building triangle-braced bridge model",
 },
 ],
 blocks: [
 {
 type: "ul",
 items: [
 "Did a square fold before a rod broke?",
 "Where did the load path go?",
 "Would a wider base tip less in a gust?",
 ],
 },
 ],
 },
 {
 title: "Myths to bust",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/civil-basics/assets/book/gen-cv-m1-fig09-myth.png",
 caption: "Figure 9. Thicker rods alone do not beat a better shape.",
 alt: "Myth of thick rods versus winning triangle shape",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Myth: stronger material always wins. Better: a weak shape can fold even with strong rods.",
 },
 {
 type: "p",
 text: "Myth: squares collapse because gravity turns off inside them. Better: their angles can change without stretching a side.",
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
 figures: [
 {
 place: "top",
 src: "/games/civil-basics/assets/book/gen-cv-m1-fig10-close.png",
 caption: "Figure 10. Teach strong structures as shape, stability, path, and spare strength.",
 alt: "Strong structures mastery closing bridge scene",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Teach a friend in one minute: triangles lock shape; wide bases help stability; load paths carry weight to the ground; safety factor leaves spare strength on purpose.",
 },
 {
 type: "ul",
 items: [
 "Explain why a square can fold once.",
 "Point to one load path once.",
 "Use the words truss and safety factor correctly once.",
 ],
 },
 ],
 },
 ],
};

export default BOOK;
