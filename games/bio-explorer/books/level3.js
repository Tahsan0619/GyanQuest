/**
 * Bio Explorer Mission 3 book: Plant Power
 * Companion to the 4-spiral lesson (plant body → kitchen → plumbing → next generation).
 */
export const BOOK = {
 missionIndex: 2,
 title: "Plant Power",
 subtitle: "how a plant actually works",
 subject: "Bio Explorer / Plant Power",
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
 title: "Plant Power",
 art: "/games/bio-explorer/assets/book/gen-bio-m3-cover.png",
 },
 glossary: [
 { id: "photosynthesis", term: "photosynthesis" },
 { id: "chlorophyll", term: "chlorophyll" },
 { id: "stomata", term: "stomata" },
 { id: "xylem", term: "xylem" },
 { id: "phloem", term: "phloem" },
 { id: "transpiration", term: "transpiration" },
 { id: "pollination", term: "pollination" },
 { id: "fertilization", term: "fertilization" },
 { id: "root-hair", term: "root hair" },
 { id: "seed-dispersal", term: "seed dispersal" },
 ],
 pages: [
 {
 title: "From a cell city to the whole machine",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/bio-explorer/assets/book/gen-bio-m3-fig01-sill.png",
 caption: "Figure 1. A windowsill plant is running more than one job at once.",
 alt: "Potted plant on a windowsill",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Living or Not asked what living things do. Cell City asked what does that work inside them. This lesson zooms back out: how millions of plant-cell workers cooperate to make food from sunlight, move water with no pump, and build a new plant from a flower.",
 },
 {
 type: "p",
 text: "A flowering plant has four organs: roots, stem, leaves, and flower. Each is a distinct structure built from many cells, doing one major job for the whole organism.",
 },
 {
 type: "ul",
 items: [
 "Spiral 1: build the body, then name the four organs.",
 "Spiral 2: stock the leaf kitchen, then read photosynthesis.",
 "Spiral 3: trace water up and sugar down, then xylem and phloem.",
 "Spiral 4: pollinate, send a seed, then the life cycle.",
 ],
 },
 ],
 },
 {
 title: "Four organs, four jobs",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/bio-explorer/assets/book/gen-bio-m3-fig02-organs.png",
 caption: "Figure 2. Roots, stem, leaves, flower: one body plan almost every flowering plant shares.",
 alt: "Flowering plant with four labeled organ zones",
 },
 ],
 blocks: [
 {
 type: "ul",
 items: [
 "Roots: anchor the plant and take in water and minerals.",
 "Stem: hold the plant up and connect everything.",
 "Leaves: catch sunlight to make food.",
 "Flower: make seeds for the next generation.",
 ],
 },
 {
 type: "p",
 text: "Those everyday jobs become formal organ definitions once you have built them with your hands. Structure and function stay glued together on purpose.",
 },
 ],
 },
 {
 title: "Roots drink. Stem delivers.",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/bio-explorer/assets/book/gen-bio-m3-fig03-roots.png",
 caption: "Figure 3. Root hairs add surface area. Water rises into the stem toward the leaves.",
 alt: "Roots in soil with water rising into stem",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Root hairs are tiny extensions that increase surface area so more water and minerals can enter. Without them, uptake would be slow and weak.",
 },
 {
 type: "p",
 text: "The stem is not just a stick. It is the highway between underground supply and the leaf kitchen above. Support and transport are the same organ doing two jobs at once.",
 },
 ],
 },
 {
 title: "The leaf kitchen",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/bio-explorer/assets/book/gen-bio-m3-fig04-leaf.png",
 caption: "Figure 4. A leaf is millions of chloroplast factories supplied by veins and pores.",
 alt: "Leaf cross-section with chloroplasts and sunlight",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Photosynthesis: carbon dioxide + water + light energy → glucose + oxygen. Word equation first, then the chemical form: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂.",
 },
 {
 type: "p",
 text: "Those chloroplasts are the same organelles from Cell City, multiplied by millions in one leaf. The leaf is the kitchen. The rest of the plant is the delivery system.",
 },
 ],
 },
 {
 title: "Chloroplasts at work",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/bio-explorer/assets/book/gen-bio-m3-fig05-chloro.png",
 caption: "Figure 5. Chlorophyll inside chloroplasts captures light energy and feeds it into the reaction.",
 alt: "Close-up chloroplasts glowing under sunlight",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Chlorophyll is the green pigment whose job is grabbing light energy. Without it, the leaf kitchen has fuel and water but no power source.",
 },
 {
 type: "p",
 text: "Turn sunlight on in the lab and the factories pulse. Turn it off and the reaction pauses. Light is not decoration. It is an ingredient.",
 },
 ],
 },
 {
 title: "Stomata: gates for gases",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/bio-explorer/assets/book/gen-bio-m3-fig06-stomata.png",
 caption: "Figure 6. CO₂ enters. O₂ leaves. Tiny pores control the traffic.",
 alt: "Leaf underside with stomata and gas flow",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Stomata are microscopic pores, usually on the underside of leaves. They open and close to control how much gas moves in and out.",
 },
 {
 type: "p",
 text: "Carbon dioxide comes in for photosynthesis. Oxygen leaves as a product. Water vapor can leave too, which links the kitchen to the plumbing story next.",
 },
 ],
 },
 {
 title: "Two highways, no pump",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/bio-explorer/assets/book/gen-bio-m3-fig07-xylem.png",
 caption: "Figure 7. Xylem carries water up. Phloem carries sugar wherever it is needed.",
 alt: "Stem cutaway with xylem up and phloem down",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Xylem carries water and minerals up from roots to leaves. Phloem carries sugar throughout the plant, including down to roots that cannot photosynthesize in the dark soil.",
 },
 {
 type: "p",
 text: "Transpiration is water evaporating from stomata. That loss pulls more water up the xylem with no mechanical pump. Two journeys, opposite directions, two separate sets of tubes.",
 },
 ],
 },
 {
 title: "A flower's job",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/bio-explorer/assets/book/gen-bio-m3-fig08-flower.png",
 caption: "Figure 8. Pollination moves pollen from a stamen to a pistil. Fertilization can follow.",
 alt: "Bee pollinating a flower",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Pollination moves pollen from one flower's stamen to a pistil (often on another flower). Fertilization is the next step: joining genetic material to start a seed.",
 },
 {
 type: "p",
 text: "Bees and other animals are partners in that transfer. Wind can do it too. The flower's colors and scents are advertising for a delivery service.",
 },
 ],
 },
 {
 title: "Seeds that travel",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/bio-explorer/assets/book/gen-bio-m3-fig09-seeds.png",
 caption: "Figure 9. Wind, animal hitchhiking, water: three ways a seed leaves home.",
 alt: "Dandelion, burr, and coconut dispersal",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Seed dispersal sends the next plant away from its parent so it is not competing for the same light and water. Dandelions ride wind. Burrs hitch on fur. Coconuts float.",
 },
 {
 type: "p",
 text: "A seed is a living plant in pause mode, the dormant idea from Living or Not wearing a travel jacket.",
 },
 ],
 },
 {
 title: "Why Plant Power matters",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/bio-explorer/assets/book/gen-bio-m3-fig10-close.png",
 caption: "Figure 10. Photosynthesis feeds the plant and fills the air you breathe.",
 alt: "Green plants releasing oxygen into the sky",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Photosynthesis does not just feed the plant. It is the source of the oxygen you are breathing, and the base of almost every food chain on Earth.",
 },
 {
 type: "p",
 text: "You now have the whole Bio Explorer arc: what counts as alive, what unit does the work, and how a plant machine turns sunlight into food and future plants. The recap map lets you replay body, kitchen, plumbing, and next generation.",
 },
 ],
 },
 ],
};

export default BOOK;
