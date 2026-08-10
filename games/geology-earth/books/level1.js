/**
 * Digital book - Geology & Earth Mission 1: Rock Cycle Lite
 * Theory: cognitive load, dual coding, multimedia learning, constructivism,
 * conceptual change, spiral scaffold, retrieval practice.
 * Photos: assets/book-shared space / earth themes (see assets/book/CREDITS-m1.json).
 */
export const BOOK = {
 missionIndex: 0,
 title: "Rock Cycle Lite",
 subtitle: "igneous / sedimentary / metamorphic",
 subject: "Geology Earth / Rock Cycle Lite",
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
 title: "Rock Cycle Lite",
 art: "/games/geology-earth/assets/book/m1-cover.jpg",
 },
 glossary: [
 { id: "igneous", term: "igneous" },
 { id: "sedimentary", term: "sedimentary" },
 { id: "metamorphic", term: "metamorphic" },
 { id: "magma", term: "magma" },
 { id: "sediment", term: "sediment" },
 { id: "pressure", term: "pressure" },
 { id: "cycle", term: "cycle" },
 { id: "weathering", term: "weathering" },
 ],
 pages: [
 {
 title: "Earth recycles stone",
 layout: "text",
 theory: ["constructivism", "dual-coding", "cognitive-load"],
 figures: [
 {
 place: "top",
 slides: [
 {
 src: "/games/geology-earth/assets/book/m1-cover.jpg",
 caption: "Figure 1. Our planet's crust is a workshop - rocks form, break, and reform.",
 alt: "Earth seen from space",
 },
 {
 src: "/games/geology-earth/assets/book/m1-hook.jpg",
 caption: "From orbit, land and water hint at erosion paths that feed sediment.",
 alt: "Earth from orbit",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Igneous, sedimentary, and metamorphic are three rock families. They transform through heat, pressure, melting, and the slow work of water and wind.",
 },
 {
 type: "p",
 text: "The rock cycle is not a single road. Any family can feed another when conditions change.",
 },
 {
 type: "p",
 text: "River pebbles, brick or building stone, and hill paths in Bangladesh are local doors into the same cycle.",
 },
 ],
 },
 {
 title: "Three families",
 layout: "full-fig",
 theory: ["multimedia-learning", "dual-coding"],
 figures: [
 {
 place: "full",
 slides: [
 {
 src: "/games/geology-earth/assets/book/m1-model.jpg",
 caption: "Figure 2. Other worlds show bare rock faces - useful reminders that crust tells a heat-and-time story.",
 alt: "Mars rocky surface celebration imagery",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "ul",
 items: [
 "Igneous: cools from magma or lava",
 "Sedimentary: bits pressed and cemented after weathering",
 "Metamorphic: old rock changed by heat and pressure without fully melting",
 ],
 },
 {
 type: "p",
 text: "Name the process before you force a rock into a family.",
 },
 ],
 },
 {
 title: "Heat, press, wash",
 layout: "text",
 theory: ["cognitive-load", "dual-coding"],
 figures: [
 {
 place: "top",
 slides: [
 {
 src: "/games/geology-earth/assets/book/m1-mechanism.jpg",
 caption: "Figure 3. Craters and highland scars record impacts and change - Earth uses slower tools too.",
 alt: "Moon surface",
 },
 {
 src: "/games/geology-earth/assets/book/m1-detail.jpg",
 caption: "Layered worlds elsewhere echo how materials can stack and shift.",
 alt: "Saturn atmosphere layers",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Melting and cooling write igneous pages. Weathering and burial write sedimentary pages. Deep squeeze and heat rewrite metamorphic pages.",
 },
 {
 type: "p",
 text: "A river pebble may be a traveler from an older rock that broke apart - sediment on the move.",
 },
 ],
 },
 {
 title: "Ice as a sculptor",
 layout: "full-fig",
 theory: ["multimedia-learning", "spiral-scaffold"],
 figures: [
 {
 place: "full",
 slides: [
 {
 src: "/games/geology-earth/assets/book/m1-transfer.jpg",
 caption: "Figure 4. Melting and freezing help crack and carry rock - weathering in action.",
 alt: "Melting ice",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "You will not see a full cycle in one afternoon. You can still spot pieces: broken bits, layered stone, and cooled volcanic rock in some regions.",
 },
 ],
 },
 {
 title: "Rock Ranger route",
 layout: "text",
 theory: ["spiral-scaffold", "cognitive-load"],
 blocks: [
 {
 type: "p",
 text: "You met rock types, clarified the cycle, sorted type vs form vs not, felt a pressure lab, and named why rocks transform.",
 },
 {
 type: "ul",
 items: [
 "Sort stops mixing process words with rock names",
 "Pressure lab: change without needing a full melt",
 "Rule: igneous, sedimentary, metamorphic link through change",
 ],
 },
 {
 type: "p",
 text: "Game steps were bite-sized. The cycle view is here.",
 },
 ],
 },
 {
 title: "Pebbles, bricks, hills",
 layout: "split",
 theory: ["constructivism", "dual-coding", "retrieval-practice"],
 figures: [
 {
 place: "right",
 slides: [
 {
 src: "/games/geology-earth/assets/book/m1-hook.jpg",
 caption: "River pebbles - sediment on a journey.",
 alt: "Earth water and land",
 },
 {
 src: "/games/geology-earth/assets/book/m1-model.jpg",
 caption: "Building stone - ask how it formed.",
 alt: "Rocky terrain",
 },
 {
 src: "/games/geology-earth/assets/book/m1-transfer.jpg",
 caption: "Hill paths - weathering breaks bigger rock into bits.",
 alt: "Ice weathering metaphor",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "For each local example, guess family or process, then say what evidence you wish you had (crystals, layers, fossils, sparkle).",
 },
 {
 type: "ul",
 items: [
 "Is it layered or glassy?",
 "Does it look like pressed bits?",
 "Could heat or pressure have rewritten it?",
 ],
 },
 ],
 },
 {
 title: "Rock myths",
 layout: "text",
 theory: ["conceptual-change"],
 blocks: [
 {
 type: "p",
 text: "Myth: Rocks stay in one family forever. Better: the cycle lets material move between families when conditions change.",
 },
 {
 type: "p",
 text: "Myth: Metamorphic means melted. Better: metamorphic changes while mostly solid under heat and pressure.",
 },
 {
 type: "p",
 text: "Myth: Sedimentary only means sandcastles. Better: pressed and cemented sediments become solid rock over long time.",
 },
 {
 type: "p",
 text: "Tap igneous, sedimentary, or metamorphic in red to ask the tutor.",
 },
 ],
 },
 {
 title: "Rock Ranger mastery",
 layout: "text",
 theory: ["retrieval-practice", "spiral-scaffold"],
 figures: [
 {
 place: "top",
 slides: [
 {
 src: "/games/geology-earth/assets/book/m1-cover.jpg",
 caption: "Figure 5. Teach the three families with Earth as your anchor.",
 alt: "Earth from Apollo as geology anchor",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Teach in one minute: igneous from melt, sedimentary from bits, metamorphic from rewrite by heat and pressure; pebbles and hills show pieces of the cycle.",
 },
 {
 type: "ul",
 items: [
 "Sketch a simple three-family cycle",
 "Point to a river pebble story",
 "Use the word sediment correctly once",
 ],
 },
 ],
 },
 ],
};

export default BOOK;
