/**
 * Digital book - Mechanical Basics / Forces at Work
 * Theory: cognitive load, dual coding, multimedia learning, constructivism,
 * conceptual change, spiral scaffold, retrieval practice.
 * Photos: local verified copies under /games/mechanical-basics/assets/book/ (see CREDITS-m3.json).
 */
export const BOOK = {
 missionIndex: 2,
 title: "Forces at Work",
 subtitle: "force & work",
 subject: "Mechanical Basics / Forces at Work",
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
 title: "Forces at Work",
 art: "/games/mechanical-basics/assets/book/m3-cover.webp",
 },
 glossary: [
 { id: "force", term: "force" },
 { id: "work", term: "work" },
 { id: "distance", term: "distance" },
 { id: "direction", term: "direction" },
 { id: "joule", term: "joule" },
 { id: "energy", term: "energy" },
 { id: "push", term: "push" },
 { id: "lift", term: "lift" },
 { id: "newton", term: "newton" },
 { id: "mechanical", term: "mechanical" },
 ],
 pages: [
 {
 title: "Why Forces at Work?",
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
 src: "/games/mechanical-basics/assets/book/m3-hook.jpg",
 caption: "Figure 1. Force alone is not the whole story.",
 alt: "Force demonstration",
 },
 {
 src: "/games/mechanical-basics/assets/book/m3-cover.webp",
 caption: "Push that travels - work you can see.",
 alt: "Pushing cart",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Work happens when a force moves something through a distance.",
 },
 {
 type: "p",
 text: "Push a crate, lift a bag, pull a wagon - if it moves in the force direction, you did mechanical work.",
 },
 {
 type: "p",
 text: "Everyday hook: holding a heavy bag still tires you, but mechanical work needs distance too.",
 },
 ],
 },
 {
 title: "Force times distance",
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
 src: "/games/mechanical-basics/assets/book/m3-model.jpg",
 caption: "Figure 2. Astronauts feel push/move pairs in orbit training films.",
 alt: "Astronaut push",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Work = force x distance (in the direction of the force). Huge push on an unmoving wall is about zero work.",
 },
 {
 type: "ul",
 items: [
 "Moving a box across a floor counts",
 "Holding still does not add distance",
 "Kids do real work lifting school bags",
 ],
 },
 ],
 },
 {
 title: "Work dial",
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
 src: "/games/mechanical-basics/assets/book/m3-mechanism.jpg",
 caption: "Figure 3. Gravity sets the cost of lifts - force against a field.",
 alt: "Gravity concept imagery",
 },
 {
 src: "/games/mechanical-basics/assets/book/m3-lab.jpg",
 caption: "Structures stand because forces balance - work appears when things move.",
 alt: "Structure",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "In the lab you dialed until force and distance both showed up in the story.",
 },
 {
 type: "p",
 text: "Distance matters. Ignoring it breaks the work idea.",
 },
 ],
 },
 {
 title: "Not only huge machines",
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
 src: "/games/mechanical-basics/assets/book/m3-mastery.jpg",
 caption: "Figure 4. Big systems still obey force and motion rules.",
 alt: "ISS imagery",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Cranes do work. So do you when you slide a chair. Scale changes; the definition stays.",
 },
 {
 type: "p",
 text: "Name force, distance, and direction whenever you claim work happened.",
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
 text: "Meet work -> dial force/distance -> sort work/no-work -> stronger lab -> why direction -> name the work rule -> stretch wagons -> myths -> fluency -> mastery.",
 },
 {
 type: "ul",
 items: [
 "Sorting kills 'any push is work'",
 "Labs require motion through a distance",
 "Rule: work needs force AND distance in that direction",
 ],
 },
 ],
 },
 {
 title: "Street lab: crate slide",
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
 src: "/games/mechanical-basics/assets/book/m3-cover.webp",
 caption: "Traveling push.",
 alt: "Cart",
 },
 {
 src: "/games/mechanical-basics/assets/book/m3-model.jpg",
 caption: "Push in micro-g demos.",
 alt: "Astronaut",
 },
 {
 src: "/games/mechanical-basics/assets/book/m3-hook.jpg",
 caption: "Force spotlight.",
 alt: "Force",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Slide a light box one meter. Describe the force and the distance. Then press a wall without moving it - compare.",
 },
 {
 type: "ul",
 items: [
 "Which case had mechanical work?",
 "Estimate which took more effort feeling vs formal work",
 "Flip carousel: cart travel vs astronaut push",
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
 text: "Myth: any push is always work. Better: work needs force AND distance in that direction.",
 },
 {
 type: "p",
 text: "Myth: holding a bag still does lots of work. Better: no distance moved = no mechanical work.",
 },
 {
 type: "p",
 text: "Myth: distance does not matter for work. Better: work = force x distance.",
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
 src: "/games/mechanical-basics/assets/book/m3-mastery.jpg",
 caption: "Figure 5. Motion under forces - your work goal.",
 alt: "ISS anchor",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Teach a friend: force alone is not enough; add distance in the same direction to claim work.",
 },
 {
 type: "ul",
 items: [
 "Give one work and one no-work example",
 "Say the formula in words",
 "Use the word joule as a work unit once if ready",
 ],
 },
 ],
 },
 ],
};

export default BOOK;
