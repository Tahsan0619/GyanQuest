/**
 * Chemistry Lab Mission 2 book: Element Hunt
 * Companion to the 4-spiral interactive lesson (identity → orbits → orbitals → personality).
 */
export const BOOK = {
 missionIndex: 1,
 title: "Element Hunt",
 subtitle: "elements, orbits & the shapes of orbitals",
 subject: "Chemistry Lab / Element Hunt",
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
 title: "Element Hunt",
 art: "/games/chemistry-lab/assets/book/gen-m2-cover.png",
 },
 glossary: [
 { id: "element", term: "element" },
 { id: "proton", term: "proton" },
 { id: "atomic-number", term: "atomic number" },
 { id: "orbit", term: "orbit" },
 { id: "orbital", term: "orbital" },
 { id: "valence", term: "valence electron" },
 { id: "periodic-table", term: "periodic table" },
 { id: "electron-configuration", term: "electron configuration" },
 ],
 pages: [
 {
 title: "118 letters, then a hunt",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/chemistry-lab/assets/book/gen-m2-cover.png",
 caption: "Figure 1. The periodic table is a wall of tiles. This lesson starts with them unlabeled.",
 alt: "Pictorial periodic table of the elements",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Every material in the universe is spelled with an alphabet of 118 letters. Chemists call them elements. Tiny Bits already showed that atoms are built from protons, neutrons, and electrons. This hunt asks what makes one element different from another, then goes inside to where electrons actually live.",
 },
 {
 type: "p",
 text: "The path is a spiral. You do something, you watch a picture of what you just did, then you get the grown-up name. The orbit picture comes first because it is intuitive, then it is taken apart and rebuilt as orbitals, the way the idea actually developed.",
 },
 {
 type: "ul",
 items: [
 "Spiral 1: what actually makes an element an element?",
 "Spiral 2: from orbits (paths) to orbitals (regions of probability).",
 "Spiral 3: the rooms electrons live in: s, p, d, and f.",
 "Spiral 4: why this matters: calm versus reactive personalities.",
 ],
 },
 ],
 },
 {
 title: "Protons decide the name",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/chemistry-lab/assets/book/gen-m2-fig02-protons.png",
 caption: "Figure 2. Carbon's box. The 6 at the top is the proton count.",
 alt: "Periodic-table style carbon entry",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "In the Proton Counter you drag protons into a nucleus. Electrons match so the atom stays simple. The live label is Protons: [count] → Element: [name] ([symbol]). Guided stops are 1, 2, 6, 8, 10, 11, 17, and 18: Hydrogen, Helium, Carbon, Oxygen, Neon, Sodium, Chlorine, Argon.",
 },
 {
 type: "p",
 text: "You never needed a neutron count or an electron count to change which element you were building. Change the proton number by even one, and you have a completely different element, with completely different properties.",
 },
 ],
 },
 {
 title: "The table is a map of families",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/chemistry-lab/assets/book/gen-m2-fig03-table.png",
 caption: "Figure 3. Rows and columns. Same column, similar electron patterns.",
 alt: "Periodic table of the elements",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "The unlabeled glowing tiles lock into the real periodic table shape. Families color in as they sit: alkali metals (violet), noble gases (teal), halogens (orange), transition metals (blue-grey).",
 },
 {
 type: "p",
 text: "The table is not just a chart for memorizing. Elements in the same column tend to behave alike because they arrange their electrons in strikingly similar patterns. Each new row means the atom gained a whole new layer of space for electrons to live in.",
 },
 {
 type: "ul",
 items: [
 "Noble gases: already full, calm, barely reactive.",
 "Alkali metals: one easy-to-lose outer electron, a reactive spark.",
 "Halogens: one open spot, eager to grab an electron.",
 "Transition metals: the wide middle block, filling d orbitals.",
 ],
 },
 ],
 },
 {
 title: "Carbon's ID, then Sodium's seat",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/chemistry-lab/assets/book/gen-m2-fig04-carbon.png",
 caption: "Figure 4. Atomic number 6, symbol C, Period 2, Group 14.",
 alt: "Carbon periodic table entry",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Every element has an atomic number (its proton count), a one- or two-letter symbol, a period (its row), and a group (its column). Period and group are a preview of how that element's electrons are arranged.",
 },
 {
 type: "p",
 text: "Quick check from the lab: if an atom has 11 protons, it is Sodium, on the left side, Period 3.",
 },
 ],
 },
 {
 title: "Fill the shells, then break the picture",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/chemistry-lab/assets/book/gen-m2-fig05-orbits.png",
 caption: "Figure 5. The orbit model: electrons as tiny planets on circular tracks.",
 alt: "Atom with electrons on circular orbits",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Sodium has 11 electrons. Shell 1 holds 2 at most, shell 2 holds 8, shell 3 holds 8 for now. If you try to overfill a ring, the extra electron bounces off and must go to the next ring out. The correct fill is 2, 8, 1.",
 },
 {
 type: "p",
 text: "This orbit model correctly predicts how many electrons fit in each layer, which is genuinely useful. It is not what is really happening. Real electrons do not travel in neat circular paths.",
 },
 ],
 },
 {
 title: "Orbit is a path. Orbital is a region.",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/chemistry-lab/assets/book/gen-m2-fig06-cloud.png",
 caption: "Figure 6. Rings smear into a cloud. The cloud is many possible locations stacked up.",
 alt: "Atom diagram used to contrast orbit and orbital",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "The neat rings smear into a soft haze of probability: denser near the nucleus, fading toward the edges, with no fixed path. We can never know exactly where an electron is or exactly where it is going next, only how likely it is to be in a given spot.",
 },
 {
 type: "p",
 text: "Snapshots of one electron, stacked, rebuild the same cloud. That cloud is an orbital. An orbit is an imagined fixed circular path, useful for counting, not physically real. An orbital is a real, probability-based region of space where an electron is most likely to be found. From here on, the lesson talks only about real orbitals.",
 },
 ],
 },
 {
 title: "Rooms: s, p, d, and f",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/chemistry-lab/assets/book/gen-m2-fig07-shapes.png",
 caption: "Figure 7. Spin the shapes. s is a sphere. p is a set of three dumbbells.",
 alt: "Orbital shape models: sphere and dumbbells",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Orbitals are not all one shape. s is one simple sphere, identical from every angle. p always comes in a set of three, pointing along three directions like the x, y, and z axes. d comes in a set of five, more twisted. f comes in a set of seven, wilder still (optional look, not a memorization list).",
 },
 {
 type: "p",
 text: "Every atom is built by electrons filling shapes like these, starting with the simplest, and only using the fancier ones once the simple ones are full. If dragging is hard, auto-rotate still shows the 3D form.",
 },
 ],
 },
 {
 title: "Why the table is shaped that way",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/chemistry-lab/assets/book/gen-m2-fig08-iron.png",
 caption: "Figure 8. Iron. Filling 3d is why transition metals look different from the simple start of the table.",
 alt: "Iron metal",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Electrons fill in this order: 1s → 2s → 2p → 3s → 3p → 4s → 3d, visualized up through iron (26 electrons) so you see s, p, and d genuinely in use on one real atom.",
 },
 {
 type: "p",
 text: "The tall columns on the left and right are elements filling s and p orbitals. The wide middle block, the transition metals, is filling d orbitals. The shape of the periodic table is a direct map of orbital filling.",
 },
 {
 type: "p",
 text: "Iron's configuration in this lesson is 1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d⁶. Read it: the number is the shell, the letter is the orbital shape, the small number on top is how many electrons are packed into that shape. Two ground rules you can try to break: electrons fill the lowest energy orbital available first, and no two electrons in the same atom can be in the exact identical state.",
 },
 ],
 },
 {
 title: "Personalities: full, lonely, or almost full",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/chemistry-lab/assets/book/gen-m2-fig09-react.png",
 caption: "Figure 9. Reactivity follows how full the outer orbital is, not a random scatter.",
 alt: "Periodic table",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Tap Neon: a completely full outer shell, all orbitals evenly filled. Nothing missing, nothing extra. That is why noble gases barely react. Tap Sodium: one lone valence electron in an otherwise empty new shell, easy to lose, which is why sodium reacts violently and eagerly. Tap Chlorine: one missing electron from an otherwise full outer shell, desperate to grab one more, reactive in the opposite direction.",
 },
 {
 type: "p",
 text: "A heat map of the table: noble gases glow cool blue, alkali metals and halogens glow hot orange, everything else sits in between. Reactivity follows how full each element's outer orbital shape is.",
 },
 {
 type: "p",
 text: "Valence electrons are the electrons in an atom's outermost occupied shell, the ones involved in reactions. Na has 1. Cl has 7. Together they can reach a full 8. That pairing is the start of the next hunt: how atoms actually bond together.",
 },
 ],
 },
 {
 title: "A map you can actually read",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/chemistry-lab/assets/book/gen-m2-fig10-map.png",
 caption: "Figure 10. The same 118 squares, now labeled. Proton count, orbital rooms, outer-shell mood.",
 alt: "Periodic table of the elements",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "You started looking at 118 unlabeled glowing squares. Proton count is what separates one from another. Electrons do not really orbit like planets. They live in fuzzy, probability-shaped regions called orbitals: spheres, dumbbells, clovers, and beyond. An element's personality (calm or reactive) comes down to how full its outermost orbital happens to be.",
 },
 {
 type: "p",
 text: "The recap map at the end of the lab lets you replay any of the four loops: identity, clouds, shapes, moods.",
 },
 ],
 },
 ],
};

export default BOOK;
