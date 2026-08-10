/**
 * Digital book - Mechanical Basics / Motion Machines
 * Theory: cognitive load, dual coding, multimedia learning, constructivism,
 * conceptual change, spiral scaffold, retrieval practice.
 * Photos: local verified copies under /games/mechanical-basics/assets/book/ (see CREDITS-m2.json).
 */
export const BOOK = {
 missionIndex: 1,
 title: "Motion Machines",
 subtitle: "motion transfer",
 subject: "Mechanical Basics / Motion Machines",
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
 title: "Motion Machines",
 art: "/games/mechanical-basics/assets/book/m2-cover.jpg",
 },
 glossary: [
 { id: "wheel", term: "wheel" },
 { id: "axle", term: "axle" },
 { id: "belt", term: "belt" },
 { id: "chain", term: "chain" },
 { id: "transfer", term: "transfer" },
 { id: "friction", term: "friction" },
 { id: "brake", term: "brake" },
 { id: "slip", term: "slip" },
 { id: "jam", term: "jam" },
 { id: "conveyor", term: "conveyor" },
 ],
 pages: [
 {
 title: "Why Motion Machines?",
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
 src: "/games/mechanical-basics/assets/book/m2-hook.jpg",
 caption: "Figure 1. Cranes move loads along planned paths - belts do the same for spin.",
 alt: "Crane",
 },
 {
 src: "/games/mechanical-basics/assets/book/m2-cover.jpg",
 caption: "Wheels cut friction and carry motion.",
 alt: "Skateboard motion",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Wheels, belts, and chains pass motion along a linked path.",
 },
 {
 type: "p",
 text: "Bike chains, fan belts, and conveyors succeed when each link stays connected and tight enough.",
 },
 {
 type: "p",
 text: "Everyday hook: pedal a bike - chain links carry your leg motion to the wheel.",
 },
 ],
 },
 {
 title: "Links that carry",
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
 src: "/games/mechanical-basics/assets/book/m2-model.webp",
 caption: "Figure 2. Cart push shows how force becomes travel when links work.",
 alt: "Pushing cart",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "A belt or chain is a motion messenger. Loose belts slip. Jammed belts block the path.",
 },
 {
 type: "ul",
 items: [
 "Wheels and axles reduce rubbing losses",
 "Brakes intentionally block or slow motion",
 "Engines are not the only motion source - links pass it along",
 ],
 },
 ],
 },
 {
 title: "Transfer dial",
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
 src: "/games/mechanical-basics/assets/book/m2-mechanism.jpg",
 caption: "Figure 3. Gears can sit inside a transfer path too.",
 alt: "Gears",
 },
 {
 src: "/games/mechanical-basics/assets/book/m2-lab.jpg",
 caption: "Friction can help grip or steal motion - name which.",
 alt: "Friction study",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "In the lab you dialed transfer quality until motion arrived at the far end.",
 },
 {
 type: "p",
 text: "If the far wheel stays still, check slip, jam, or a missing link.",
 },
 ],
 },
 {
 title: "Brakes are blockers",
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
 src: "/games/mechanical-basics/assets/book/m2-mastery.webp",
 caption: "Figure 4. When the path is clear, push becomes travel.",
 alt: "Cart motion",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Brakes are not broken belts - they are designed to stop transfer on purpose.",
 },
 {
 type: "p",
 text: "A jammed belt is an accident; a brake is a choice.",
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
 text: "Meet transfer -> dial links -> sort movers/blockers -> stronger lab -> why belts -> name the transfer rule -> stretch conveyors -> myths -> fluency -> mastery.",
 },
 {
 type: "ul",
 items: [
 "Sorting separates wheels, belts, and brakes",
 "Labs show slip vs solid transfer",
 "Rule: linked paths pass motion; jams and loose belts break it",
 ],
 },
 ],
 },
 {
 title: "Street lab: bike chain",
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
 src: "/games/mechanical-basics/assets/book/m2-hook.jpg",
 caption: "Lift path.",
 alt: "Crane",
 },
 {
 src: "/games/mechanical-basics/assets/book/m2-model.webp",
 caption: "Push path.",
 alt: "Cart",
 },
 {
 src: "/games/mechanical-basics/assets/book/m2-cover.jpg",
 caption: "Wheel path.",
 alt: "Skateboard",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "With a bike (or clear photo), trace pedal -> chain -> rear wheel. Find the brake.",
 },
 {
 type: "ul",
 items: [
 "Predict what a loose chain does",
 "Name one conveyor-like machine at a shop",
 "Flip carousel: crane lift vs cart push",
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
 text: "Myth: wheels only look round for fun. Better: wheels and axles cut friction and carry motion.",
 },
 {
 type: "p",
 text: "Myth: a belt never needs to be tight. Better: loose belts slip - motion fails to transfer.",
 },
 {
 type: "p",
 text: "Myth: brakes add motion to the chain. Better: brakes block or slow motion on purpose.",
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
 src: "/games/mechanical-basics/assets/book/m2-mastery.webp",
 caption: "Figure 5. Clear path - your transfer goal.",
 alt: "Cart anchor",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Teach a friend: motion travels along links; keep belts true; brakes stop on purpose.",
 },
 {
 type: "ul",
 items: [
 "Sketch a three-part transfer path",
 "Explain slip in one sentence",
 "Use the word axle correctly once",
 ],
 },
 ],
 },
 ],
};

export default BOOK;
