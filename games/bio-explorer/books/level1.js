/**
 * Bio Explorer Mission 1 book: Living or Not
 * Companion to the 4-spiral lesson (gut pattern → MRS GREN → tricky cases → why it matters).
 */
export const BOOK = {
 missionIndex: 0,
 title: "Living or Not",
 subtitle: "seven signs of life, then the cases that fool a gut check",
 subject: "Bio Explorer / Living or Not",
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
 title: "Living or Not",
 art: "/games/bio-explorer/assets/book/gen-bio-m1-cover.png",
 },
 glossary: [
 { id: "organism", term: "organism" },
 { id: "mrs-gren", term: "MRS GREN" },
 { id: "respiration", term: "respiration" },
 { id: "sensitivity", term: "sensitivity" },
 { id: "reproduction", term: "reproduction" },
 { id: "dormant", term: "dormant" },
 { id: "virus", term: "virus" },
 { id: "excretion", term: "excretion" },
 { id: "nutrition", term: "nutrition" },
 ],
 pages: [
 {
 title: "Four things in the dark",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/bio-explorer/assets/book/gen-bio-m1-fig01-suspects.png",
 caption: "Figure 1. Flame, crystal, virus, sleeping cat. Only one is obviously alive.",
 alt: "Four suspects: flame, crystal, virus, cat",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "A flame moves, grows, and needs fuel. A crystal grows too. Doctors fight viruses as if they were alive. A sleeping cat is not moving at all, and is still obviously alive.",
 },
 {
 type: "p",
 text: "This lesson is not about easy animals versus rocks. It is a toolkit for the cases where a gut check fails. The path is a spiral: compare, name the seven signs, stress-test the hard cases, then use the same questions on Mars, medicine, and machines.",
 },
 {
 type: "ul",
 items: [
 "Spiral 1: compare obvious living and non-living things.",
 "Spiral 2: name the seven signs, MRS GREN.",
 "Spiral 3: fire, crystals, viruses, dormant seeds.",
 "Spiral 4: Mars sensors, medicine, and machines.",
 ],
 },
 ],
 },
 {
 title: "What you were already checking",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/bio-explorer/assets/book/gen-bio-m1-fig02-sort.png",
 caption: "Figure 2. Dog, tree, mushroom, person versus rock, chair, car, cloud.",
 alt: "A living pile and a non-living pile",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Sorting a dog from a chair does not take a lecture. The useful question is what you were looking for without noticing: growth, energy use, response to the world, reproduction, and movement at some point in a life.",
 },
 {
 type: "p",
 text: "Those hunches are already close to a real biological checklist. The spiral's job is to make the invisible criteria visible, then keep them honest when a flame or a virus tries to fake one or two of them.",
 },
 ],
 },
 {
 title: "A tree grows. A rock does not.",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/bio-explorer/assets/book/gen-bio-m1-fig03-tree.png",
 caption: "Figure 3. Time-lapse a sapling next to an unchanged boulder. Growth is biology's work, not weather alone.",
 alt: "Growing tree beside an unchanged rock",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "A time-lapse tree next to an unchanged rock makes the pattern visible. The tree builds new living material from its own processes. The rock only changes if something outside it acts: wind, water, a hammer.",
 },
 {
 type: "p",
 text: "That difference is the seed of every MRS GREN trait. Living things run their own chemistry. Non-living things wait for outside causes.",
 },
 ],
 },
 {
 title: "MRS GREN",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/bio-explorer/assets/book/gen-bio-m1-fig04-mrs.png",
 caption: "Figure 4. Seven slots beside a mushroom: one named sign of life each.",
 alt: "A mushroom next to a seven-item checklist",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Movement, Respiration, Sensitivity, Growth, Reproduction, Excretion, Nutrition. That acronym is MRS GREN, a memory trick biologists actually use. An organism is a living thing that can carry out these processes with its own biology.",
 },
 {
 type: "ul",
 items: [
 "Movement: changing position, or moving parts of the body.",
 "Respiration: releasing energy from food, at the cellular level.",
 "Sensitivity: detecting and responding to changes.",
 "Growth: increasing in size or complexity over time.",
 "Reproduction: producing new individuals of the same kind.",
 "Excretion: removing waste from the body's own processes.",
 "Nutrition: taking in and using materials for energy and growth.",
 ],
 },
 ],
 },
 {
 title: "The flame that almost passes",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/bio-explorer/assets/book/gen-bio-m1-fig05-flame.png",
 caption: "Figure 5. Fire looks busy: it moves, grows, eats fuel, and leaves ash. That is not enough.",
 alt: "A lively campfire flame",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "A flame can fake movement, growth, nutrition, excretion, and even a loose response to wind. It fails true reproduction and cellular respiration. Five out of seven, and the two misses are the ones that matter.",
 },
 {
 type: "p",
 text: "Fire is a chemical reaction, not a living system. It does not build cells, copy genetic instructions, or release energy the way mitochondria do. Partial ticks are the point. Do not flatten hard cases into tidy yes/no until you finish the list.",
 },
 ],
 },
 {
 title: "Crystals only stack",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/bio-explorer/assets/book/gen-bio-m1-fig06-crystal.png",
 caption: "Figure 6. Crystals grow by stacking non-living layers. Pretty is not the same as alive.",
 alt: "Geometric mineral crystals",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "A crystal earns growth only, and even that is stacking non-living layers from the outside, not building living cells from the inside. One out of seven.",
 },
 {
 type: "p",
 text: "If you only watched size change, you would call both a mushroom and a crystal alive. MRS GREN stops that mistake by demanding the whole set of processes.",
 },
 ],
 },
 {
 title: "Viruses on the border",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/bio-explorer/assets/book/gen-bio-m1-fig07-virus.png",
 caption: "Figure 7. Genetic instructions in a shell, with no metabolism of their own.",
 alt: "A simplified virus particle near a cell",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "A virus copies itself only by hijacking a living host. It has genetic material, but no independent metabolism. Most biologists classify viruses as non-living. Some prefer to say they sit on the border of life.",
 },
 {
 type: "p",
 text: "That disagreement is the checklist doing its job on a genuinely hard case, not a hole in the list. Antibiotics disrupt living cell processes, which is why they do not treat viral infections.",
 },
 ],
 },
 {
 title: "Dormant is not dead",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/bio-explorer/assets/book/gen-bio-m1-fig08-seed.png",
 caption: "Figure 8. A dry seed looks dead. Add water and the living program wakes.",
 alt: "Dry seeds and one sprouting after water",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "A dormant seed looks dead until you add water. Alive means capacity, not constant visible activity. The seed already has the biology to grow, respire, and become a plant when conditions allow.",
 },
 {
 type: "p",
 text: "Winter trees, hibernating animals, and dry spores use the same idea: pause without losing the living toolkit. Stillness alone never settles the Living or Not question.",
 },
 ],
 },
 {
 title: "The same seven questions on Mars",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/bio-explorer/assets/book/gen-bio-m1-fig09-mars.png",
 caption: "Figure 9. Shape change can be erosion. A rhythmic gas plume is a stronger biosignature.",
 alt: "A rover on a red landscape scanning rocks and gas",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "There is no special alien version of MRS GREN. A rock that changes shape over months is weak evidence, like the crystal. A gas plume on a non-random daily rhythm is the kind of respiration signal scientists actually hunt. Smooth metal is not biology.",
 },
 {
 type: "p",
 text: "A robot vacuum can sense and move and still fail the rest of the list. Machines copy pieces of life. They do not run the full living set with their own cells.",
 },
 ],
 },
 {
 title: "The test to keep",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/bio-explorer/assets/book/gen-bio-m1-fig10-close.png",
 caption: "Figure 10. Verdicts: flame no, crystal no, virus on the border, cat yes.",
 alt: "The four opening objects with soft verdict moods",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Keep this test: does it carry out, or have the capacity to carry out, essentially all seven MRS GREN traits using its own biological processes?",
 },
 {
 type: "p",
 text: "Next hunt: if something is alive, what is the smallest unit inside it that is actually doing this work? That question opens Cell City.",
 },
 ],
 },
 ],
};

export default BOOK;
