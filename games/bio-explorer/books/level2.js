/**
 * Bio Explorer Mission 2 book: Cell City
 * Companion to the 4-spiral lesson (cities of cells → animal workers → plant upgrades → cooperation).
 */
export const BOOK = {
 missionIndex: 1,
 title: "Cell City",
 subtitle: "tiny workers building every living thing",
 subject: "Bio Explorer / Cell City",
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
 title: "Cell City",
 art: "/games/bio-explorer/assets/book/gen-bio-m2-cover.png",
 },
 glossary: [
 { id: "cell", term: "cell" },
 { id: "cell-theory", term: "cell theory" },
 { id: "organelle", term: "organelle" },
 { id: "nucleus", term: "nucleus" },
 { id: "mitochondria", term: "mitochondria" },
 { id: "ribosome", term: "ribosome" },
 { id: "endoplasmic-reticulum", term: "endoplasmic reticulum" },
 { id: "golgi", term: "Golgi apparatus" },
 { id: "cell-membrane", term: "cell membrane" },
 { id: "cell-wall", term: "cell wall" },
 { id: "chloroplast", term: "chloroplast" },
 { id: "vacuole", term: "vacuole" },
 { id: "unicellular", term: "unicellular" },
 { id: "multicellular", term: "multicellular" },
 ],
 pages: [
 {
 title: "The question Living or Not left open",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/bio-explorer/assets/book/gen-bio-m2-fig01-city.png",
 caption: "Figure 1. A night city and packed tissue rhyme: many small units, each on a job.",
 alt: "City pattern beside a grid of cells",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "If living things do MRS GREN's seven jobs, something inside them is doing that work. That something is the cell: a complete, self-contained unit, like one building in a city.",
 },
 {
 type: "p",
 text: "This lesson treats a cell as a working city, not a diagram to memorize. Every organelle gets a real name and a city job, taught together on purpose.",
 },
 {
 type: "ul",
 items: [
 "Spiral 1: zoom skin into packed cells, then cell theory.",
 "Spiral 2: tour six animal-cell workers.",
 "Spiral 3: add wall, chloroplasts, and a water tower.",
 "Spiral 4: run a protein production line, then zoom out to tissues and organisms.",
 ],
 },
 ],
 },
 {
 title: "Zoom the skin",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/bio-explorer/assets/book/gen-bio-m2-fig02-skin.png",
 caption: "Figure 2. Skin looks smooth until you zoom. Then you see living cells packed wall to wall.",
 alt: "Palm close-up zooming into skin cells",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Your hand looks continuous. Zoom far enough and the surface breaks into millions of individual living cells, each with a nucleus, each doing a job. You are not looking at skin anymore. You are looking at a city.",
 },
 {
 type: "p",
 text: "The same packed pattern appears in leaf tissue, mushroom flesh, and muscle. Living bodies are built from cooperating units, not continuous magic material.",
 },
 ],
 },
 {
 title: "Cell theory, live",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/bio-explorer/assets/book/gen-bio-m2-fig03-theory.png",
 caption: "Figure 3. A living tissue rack: cells packing into a complete structure, one unit at a time.",
 alt: "Grid of living cells with nuclei",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Three rules called cell theory sit under almost all of biology.",
 },
 {
 type: "ul",
 items: [
 "All living things are made of one or more cells.",
 "The cell is the basic unit of structure and function in living things.",
 "All cells come from other cells that already existed.",
 ],
 },
 {
 type: "p",
 text: "A city block and a single cell rhyme for the same reason: each is a complete unit that only works well because many cooperate.",
 },
 ],
 },
 {
 title: "Six workers in an animal cell",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/bio-explorer/assets/book/gen-bio-m2-fig04-workers.png",
 caption: "Figure 4. City Hall, power plants, factories, highway, post office, and city wall.",
 alt: "Animal cell mapped as a small city",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Nucleus (City Hall) holds DNA and directs the cell. Mitochondria (power plants) release energy from food. Ribosomes (factories) build proteins. Endoplasmic reticulum (highway) transports materials. Golgi apparatus (post office) packages and ships. The cell membrane (city wall) controls what enters and leaves.",
 },
 {
 type: "p",
 text: "An organelle is a 'little organ': one structure, one job, the way organs each do one job for a body. None of these six workers could run the whole city alone.",
 },
 ],
 },
 {
 title: "City Hall: the nucleus",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/bio-explorer/assets/book/gen-bio-m2-fig05-nucleus.png",
 caption: "Figure 5. The nucleus holds DNA instructions and directs everything else.",
 alt: "Glowing nucleus with DNA hint",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "The nucleus contains the cell's DNA and controls its activities. Think of it as City Hall holding the master plans and sending orders out to every department.",
 },
 {
 type: "p",
 text: "Damage or copy errors in those instructions can change how the whole city behaves. That is why the nucleus sits at the center of so many biology stories, from growth to disease.",
 },
 ],
 },
 {
 title: "Power plants: mitochondria",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/bio-explorer/assets/book/gen-bio-m2-fig06-mito.png",
 caption: "Figure 6. Mitochondria release usable energy from food. Busy cells need many of them.",
 alt: "Mitochondria with energy glow",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Mitochondria release energy from food through respiration. That is the cellular version of MRS GREN's R: not just breathing lungs, but chemistry that powers every job in the city.",
 },
 {
 type: "p",
 text: "Muscle cells and busy brain cells pack many mitochondria. Quiet storage cells need fewer. Energy demand shapes the city's power-plant count.",
 },
 ],
 },
 {
 title: "Plant upgrades",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/bio-explorer/assets/book/gen-bio-m2-fig07-plant.png",
 caption: "Figure 7. Plant cells keep the animal team, then add wall, chloroplasts, and a large vacuole.",
 alt: "Boxy plant cell with wall, chloroplasts, vacuole",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Plant cells keep the whole animal-cell team, then add three specialists. A rigid cell wall sits outside the membrane for support and protection. Chloroplasts capture sunlight and turn it into food. A large central vacuole stores water and keeps the cell firm.",
 },
 {
 type: "p",
 text: "That is why plant cells often look boxy and green, while animal cells look softer and rounder. Same core city. Different neighborhood upgrades.",
 },
 ],
 },
 {
 title: "Animal cell beside plant cell",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/bio-explorer/assets/book/gen-bio-m2-fig08-pair.png",
 caption: "Figure 8. Shared core team on both sides. Wall, chloroplasts, and large vacuole only on the plant side.",
 alt: "Animal cell next to plant cell",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Shared team: nucleus, mitochondria, ribosomes, ER, Golgi, membrane. Plant-only extras: cell wall, chloroplasts, large vacuole. Animal cells may have small vacuoles, but not the giant water tower that firms a plant cell.",
 },
 {
 type: "p",
 text: "If you can read that table, you can tell leaf tissue from skin tissue under a microscope without guessing.",
 },
 ],
 },
 {
 title: "The protein production line",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/bio-explorer/assets/book/gen-bio-m2-fig09-line.png",
 caption: "Figure 9. Instructions → build → transport → package → ship. One production line, all day.",
 alt: "Protein package moving through cell departments",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "The production line is always the same idea: nucleus instructions reach ribosomes, product enters the ER highway, Golgi packages and labels it, membrane ships it out or keeps it where needed.",
 },
 {
 type: "p",
 text: "That sequence runs in living cells all day. It is cooperation made visible: six departments, one finished product.",
 },
 ],
 },
 {
 title: "One city, or a country of cities",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/bio-explorer/assets/book/gen-bio-m2-fig10-scale.png",
 caption: "Figure 10. Cell → tissue → organ → organism, plus a single-cell city-state.",
 alt: "Hierarchy of cells and a lone amoeba",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Unicellular organisms (bacteria, amoeba) are one complete city-state. Multicellular organisms (you, a tree, a mushroom) are trillions of cities cooperating as tissues, organs, and whole bodies.",
 },
 {
 type: "p",
 text: "Next hunt: plant cells already carry solar panels. How does a whole plant use millions of those panels, move water with no pump, and build the next generation from a flower? That is Plant Power.",
 },
 ],
 },
 ],
};

export default BOOK;
