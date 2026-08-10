/**
 * Digital book - Chemistry Lab Mission 1: Tiny Bits
 * Theory: cognitive load, dual coding, multimedia learning, constructivism,
 * conceptual change, spiral scaffold, retrieval practice.
 * Photos: Wikimedia Commons (see assets/book/CREDITS.json) - verified local JPGs.
 */
export const BOOK = {
 missionIndex: 0,
 title: "Tiny Bits",
 subtitle: "particles of matter",
 subject: "Chemistry Lab / Tiny Bits",
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
 title: "Tiny Bits",
 art: "/games/chemistry-lab/assets/book/m1-cover.jpg",
 },
 glossary: [
 { id: "particle", term: "particle" },
 { id: "molecule", term: "molecule" },
 { id: "lattice", term: "lattice" },
 { id: "evaporation", term: "evaporation" },
 { id: "condensation", term: "condensation" },
 { id: "matter", term: "matter" },
 { id: "energy", term: "energy" },
 { id: "solid", term: "solid" },
 { id: "liquid", term: "liquid" },
 { id: "gas", term: "gas" },
 ],
 pages: [
 {
 title: "Why Tiny Bits?",
 layout: "text",
 theory: ["constructivism", "dual-coding", "cognitive-load"],
 figures: [
 {
 place: "top",
 slides: [
 {
 src: "/games/chemistry-lab/assets/book/m1-particles.jpg",
 caption: "Figure 1. Salt under a microscope - still matter, still made of tinier bits.",
 alt: "Salt crystals under a microscope",
 },
 {
 src: "/games/chemistry-lab/assets/book/m1-cover.jpg",
 caption: "Home-grown salt crystals - cubes you can hold.",
 alt: "Home-grown salt crystals",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Everything you can touch is matter. A grain of salt, a drop of water, and the air in a room all take up space and have mass.",
 },
 {
 type: "p",
 text: "The mission used short steps. This book slows down: matter is built from tiny pieces called a particle - and particles can join into a molecule.",
 },
 {
 type: "p",
 text: "Everyday hook: shake a salt shaker. Each grain looks tiny to you, but it is still huge compared with the particles packed inside.",
 },
 ],
 },
 {
 title: "Solid, liquid, gas",
 layout: "full-fig",
 theory: ["multimedia-learning", "dual-coding"],
 figures: [
 {
 place: "full",
 slides: [
 {
 src: "/games/chemistry-lab/assets/book/m1-states.jpg",
 caption: "Figure 2. Water as ice, liquid, and vapor - same substance, different particle motion.",
 alt: "Ice, liquid water, and water vapor",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Same water particles. Different spacing and speed.",
 },
 {
 type: "ul",
 items: [
 "Solid: packed, keeps a shape - ice or salt in a lattice",
 "Liquid: close, can flow",
 "Gas: spread out, fills space",
 ],
 },
 ],
 },
 {
 title: "Energy moves particles",
 layout: "text",
 theory: ["cognitive-load", "dual-coding"],
 figures: [
 {
 place: "top",
 slides: [
 {
 src: "/games/chemistry-lab/assets/book/m1-melt.jpg",
 caption: "Figure 3. Melting ice - heat adds energy so solid water becomes liquid.",
 alt: "Melting ice",
 },
 {
 src: "/games/chemistry-lab/assets/book/m1-boil.jpg",
 caption: "Boiling - liquid gaining enough energy for rapid evaporation.",
 alt: "Boiling water",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Add energy (heat) and particles jiggle harder. A solid can melt; heat more and evaporation can turn liquid into gas.",
 },
 {
 type: "p",
 text: "Cool a misty bathroom mirror and you may see condensation - gas becoming liquid again.",
 },
 ],
 },
 {
 title: "Packed like a lattice",
 layout: "full-fig",
 theory: ["multimedia-learning", "spiral-scaffold"],
 figures: [
 {
 place: "full",
 slides: [
 {
 src: "/games/chemistry-lab/assets/book/m1-lattice.jpg",
 caption: "Figure 4. Sodium chloride crystals - a solid lattice at close range (NASA / ISS).",
 alt: "Close-up sodium chloride crystals",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Canvas dots are models, not photographs. Real crystals still show order: particles locked in a repeating lattice.",
 },
 ],
 },
 {
 title: "How the 10 steps connect",
 layout: "text",
 theory: ["spiral-scaffold", "cognitive-load"],
 blocks: [
 {
 type: "p",
 text: "Meet → dial heat → sort matter → lab goal → explain → rule → stretch → myth → fluency → mastery.",
 },
 {
 type: "ul",
 items: [
 "Sorting teaches what counts as matter",
 "The heat dial links energy to state change",
 "The rule sentence locks the idea in words",
 ],
 },
 {
 type: "p",
 text: "Short steps on purpose. The book gathers the full story.",
 },
 ],
 },
 {
 title: "Kitchen lab",
 layout: "split",
 theory: ["constructivism", "dual-coding", "retrieval-practice"],
 figures: [
 {
 place: "right",
 slides: [
 {
 src: "/games/chemistry-lab/assets/book/m1-boil.jpg",
 caption: "Boiling water - liquid to gas.",
 alt: "Boiling water in a pot",
 },
 {
 src: "/games/chemistry-lab/assets/book/m1-melt.jpg",
 caption: "Melting ice - solid to liquid.",
 alt: "Melting ice",
 },
 {
 src: "/games/chemistry-lab/assets/book/m1-cover.jpg",
 caption: "Salt crystals - solid lattice you can grow.",
 alt: "Salt crystals",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Watch ice melt, water boil, or a cold bottle sweat. Name solid, liquid, gas, evaporation, and condensation.",
 },
 {
 type: "ul",
 items: [
 "What stayed the same substance?",
 "What changed because of energy?",
 "Drag the photos to flip examples",
 ],
 },
 ],
 },
 {
 title: "Myths to bust",
 layout: "text",
 theory: ["conceptual-change"],
 blocks: [
 {
 type: "p",
 text: "Myth: Heat is a glowing fluid you pour. Better: heat is energy transfer that makes particles move differently.",
 },
 {
 type: "p",
 text: "Myth: Steam is empty air. Better: steam is water particles in the gas state.",
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
 theory: ["retrieval-practice", "spiral-scaffold"],
 figures: [
 {
 place: "top",
 slides: [
 {
 src: "/games/chemistry-lab/assets/book/m1-cover.jpg",
 caption: "Figure 5. Use this crystal as your teaching anchor.",
 alt: "Home-grown salt crystals",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Teach a friend in one minute: matter is made of particles; energy can change how they move; solid, liquid, and gas are patterns of that motion.",
 },
 {
 type: "ul",
 items: [
 "Sketch a lattice vs a flowing liquid",
 "Point to evaporation in real life",
 "Use the word molecule correctly once",
 ],
 },
 ],
 },
 ],
};

export default BOOK;
