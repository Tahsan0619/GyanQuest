/**
 * Chemistry Lab Mission 3 book: Bond Buddies
 * Companion to the 4-spiral interactive lesson (stability → ionic → covalent → spectrum).
 */
export const BOOK = {
 missionIndex: 2,
 title: "Bond Buddies",
 subtitle: "how, and why, atoms bond",
 subject: "Chemistry Lab / Bond Buddies",
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
 title: "Bond Buddies",
 art: "/games/chemistry-lab/assets/book/gen-m3-cover.png",
 },
 glossary: [
 { id: "octet-rule", term: "octet rule" },
 { id: "lewis-dot", term: "Lewis dot structure" },
 { id: "ion", term: "ion" },
 { id: "ionic-bond", term: "ionic bond" },
 { id: "covalent-bond", term: "covalent bond" },
 { id: "electronegativity", term: "electronegativity" },
 { id: "polar-covalent", term: "polar covalent" },
 { id: "crystal-lattice", term: "crystal lattice" },
 ],
 pages: [
 {
 title: "A restless atom looks for a partner",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/chemistry-lab/assets/book/gen-m3-fig01-restless.png",
 caption: "Figure 1. Most atoms are incomplete on their own. Bonding is how they finish the outer shell.",
 alt: "Two atoms approaching to bond",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Tiny Bits showed that atoms are built from protons, neutrons, and electrons. Element Hunt showed that outer (valence) electrons decide an element's personality. Bond Buddies answers the question those lessons kept pointing at: what actually happens when two atoms meet, and why do some of them stick together?",
 },
 {
 type: "p",
 text: "The path is a spiral. You do something, you watch a picture of what you just did, then you get the grown-up name. Spiral 1 establishes why bonding happens at all (stability). Spirals 2 and 3 are two different solutions to that same problem, not two unrelated facts. Spiral 4 puts ionic and covalent on one spectrum of pull.",
 },
 {
 type: "ul",
 items: [
 "Spiral 1: why do atoms even want to bond?",
 "Spiral 2: ionic bonds, give and take.",
 "Spiral 3: covalent bonds, sharing instead of giving.",
 "Spiral 4: not all sharing is equal. One spectrum of every bond type.",
 ],
 },
 ],
 },
 {
 title: "Happy or restless",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/chemistry-lab/assets/book/gen-m3-fig02-mood.png",
 caption: "Figure 2. The same outer-shell idea from Element Hunt, now read as the engine behind every bond.",
 alt: "Periodic table personality map",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Neon has a full outer shell, so it is happy. Sodium has one lonely outer electron. Chlorine is one electron short of full. Oxygen is two short. Restless atoms do not sit forever. They look for a fix.",
 },
 {
 type: "p",
 text: "There are really only two moves: give electrons away, or share electrons with someone else. Everything about bonding comes down to which of those two moves an atom makes.",
 },
 ],
 },
 {
 title: "Transfer or share, then name it",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/chemistry-lab/assets/book/gen-m3-fig03-paths.png",
 caption: "Figure 3. Two paths from the same restless atom: transfer (ionic) or share (covalent).",
 alt: "Branching diagram of ionic versus covalent",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "A metal like sodium holds its lone outer electron loosely and is happy to let it go entirely. Two nonmetals both hold electrons tightly, so neither wants to fully give one up. They compromise and share.",
 },
 {
 type: "p",
 text: "The octet rule is the name for chasing a full set of eight outer electrons (two for the smallest atoms, hydrogen and helium). A Lewis dot structure is the shorthand: the symbol with dots for each valence electron only.",
 },
 ],
 },
 {
 title: "The great electron handoff",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/chemistry-lab/assets/book/gen-m3-fig04-nacl.png",
 caption: "Figure 4. Sodium gives one electron to chlorine. Opposite charges then attract.",
 alt: "Sodium and chlorine forming ions",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Drag Sodium's single outer electron onto Chlorine. Sodium shrinks slightly and becomes Na⁺. Chlorine grows slightly and becomes Cl⁻. Both now show full outer shells: sodium by emptying down to a full shell underneath, chlorine by filling up.",
 },
 {
 type: "p",
 text: "Giving away the electron did not just fix sodium's problem. It created charges. Opposite charges attract, hard. That attraction is the ionic bond. You did not just move an electron. You built the glue.",
 },
 ],
 },
 {
 title: "A crystal, then the formula",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/chemistry-lab/assets/book/gen-m3-fig05-lattice.png",
 caption: "Figure 5. One Na⁺/Cl⁻ pair multiplies into a repeating grid. Table salt is that lattice, not one molecule.",
 alt: "Ionic crystal lattice idea",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Ionic bonds almost never stop at two atoms. Opposite charges pull in every direction, so ions stack into a repeating 3D grid called a crystal lattice. A grain of table salt is trillions of sodium and chlorine ions locked into that pattern.",
 },
 {
 type: "p",
 text: "An ion is an atom that has gained or lost electrons, giving it an electric charge. An ionic bond is the electrostatic attraction between oppositely charged ions. The formula NaCl is a 1:1 ratio because one Na⁺ needs exactly one Cl⁻ to balance charge to zero overall.",
 },
 ],
 },
 {
 title: "Share, don't give",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/chemistry-lab/assets/book/gen-m3-fig06-share.png",
 caption: "Figure 6. The same H₂O ghost outline from Tiny Bits, now with shared-electron-pair clouds at each O-H junction.",
 alt: "Water molecule outline",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Two hydrogen atoms both want to keep their one electron. If you try transferring it the way you did with sodium and chlorine, it bounces back. Overlap the atoms instead. The two electrons merge into a shared pair sitting between the nuclei, owned by both at once.",
 },
 {
 type: "p",
 text: "Rebuild water from Tiny Bits. This time each Hydrogen next to Oxygen shows a shared-pair cloud at the junction. Two separate shared pairs, one per O-H connection, are what hold every water molecule together.",
 },
 ],
 },
 {
 title: "Single, double, triple, then Lewis water",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/chemistry-lab/assets/book/gen-m3-fig07-bonds.png",
 caption: "Figure 7. One shared pair is a single bond. Two is a double. Three is a triple. Extra pairs make the bond stronger and shorter.",
 alt: "Shared pairs as bonds",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "H₂ shares one pair (single bond). O₂ shares two pairs (double bond). N₂ shares three pairs (triple bond). You can tug the atoms: the triple bond resists the most, the single bond the least.",
 },
 {
 type: "p",
 text: "A covalent bond is a bond formed by sharing a pair of electrons. In a Lewis structure, a bonding pair is drawn as a line and a lone pair (unshared) is drawn as dots. In H₂O, oxygen pulls the shared electrons closer to itself than hydrogen does. That lopsided sharing is the bridge to the last spiral.",
 },
 ],
 },
 {
 title: "One spectrum of pull",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/chemistry-lab/assets/book/gen-m3-fig08-spectrum.png",
 caption: "Figure 8. Equal sharing on the left, complete transfer on the right. Ionic and covalent are two ends of the same bar.",
 alt: "Bonding spectrum bar",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "H-H is a perfectly even tug: nonpolar covalent, far left. H-Cl: chlorine pulls noticeably harder but does not fully win: polar covalent. Na-Cl: sodium barely resists, the electron fully leaves: ionic, far right.",
 },
 {
 type: "p",
 text: "This is the hinge of the whole lesson. Ionic and covalent are not two totally separate categories. Pull perfectly evenly, and it is nonpolar covalent. Pull unevenly but not completely, and it is polar covalent. Pull so hard the electron fully leaves, and it is ionic.",
 },
 ],
 },
 {
 title: "Materials, then the numbers",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/chemistry-lab/assets/book/gen-m3-fig09-materials.png",
 caption: "Figure 9. Bond type shows up in your hands: shatter versus melt, conduct versus not.",
 alt: "Salt crystal and molecular solid",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Ionic solids like salt shatter along flat planes and conduct electricity once dissolved in water. Covalent molecular substances like sugar tend to melt at a relatively low temperature and do not conduct. Metallic bonding (a metal that bends and conducts even as a solid) is a bonus flavor for another day.",
 },
 {
 type: "p",
 text: "Electronegativity is a number for how strongly an atom pulls on shared electrons. Subtract two atoms' values to get ΔEN. A useful map: 0-0.4 nonpolar covalent, 0.4-1.7 polar covalent, 1.7+ ionic. Those numbers are guidelines, not hard walls, because bonding is a spectrum.",
 },
 ],
 },
 {
 title: "Every bond has a reason",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/chemistry-lab/assets/book/gen-m3-fig10-recap.png",
 caption: "Figure 10. One restless atom, then two ideas: give an electron away, or share one.",
 alt: "Bonded structures collage",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "You started looking at one restless, incomplete atom. Now you know what it does about that: give an electron away, or share one. That single choice explains a grain of table salt, a drop of water, and the air you breathe.",
 },
 {
 type: "p",
 text: "Every bond you study from here on is really just one of those two ideas, playing out a little differently each time. The recap map lets you replay the four spirals: why bond, ionic, covalent, and the spectrum.",
 },
 ],
 },
 ],
};

export default BOOK;
