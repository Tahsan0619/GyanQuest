/**
 * Chemistry Lab Mission 1 book: Tiny Bits
 * Companion to the 4-spiral interactive lesson (particles → atoms → insides → work).
 */
export const BOOK = {
  missionIndex: 0,
  title: "Tiny Bits",
  subtitle: "particles, atoms & molecules",
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
    { id: "atom", term: "atom" },
    { id: "molecule", term: "molecule" },
    { id: "proton", term: "proton" },
    { id: "neutron", term: "neutron" },
    { id: "electron", term: "electron" },
    { id: "atomic-number", term: "atomic number" },
    { id: "solid", term: "solid" },
    { id: "liquid", term: "liquid" },
    { id: "gas", term: "gas" },
    { id: "heat", term: "heat" },
  ],
  pages: [
    {
      title: "Ready to zoom in?",
      layout: "text",
      figures: [
        {
          place: "top",
          src: "/games/chemistry-lab/assets/book/m1-fig1.svg",
          caption: "Figure 1. A glass of water looks smooth. Zoom far enough and it does not.",
          alt: "Diagram of water made of many tiny bits",
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Your chair, the air, this screen, and your hand look solid and different. They are built from the same basic ingredients, arranged differently. This lesson names those ingredients Tiny Bits and then, only after you find them, calls them atoms.",
        },
        {
          type: "p",
          text: "The path is a spiral. You do something, you watch a picture of what you just did, then you get the grown-up name. Then the same big idea comes back deeper. Nothing is taught once and abandoned.",
        },
        {
          type: "ul",
          items: [
            "Spiral 1: is everything made of tiny bits?",
            "Spiral 2: not all tiny bits are the same.",
            "Spiral 3: what is hiding inside an atom?",
            "Spiral 4: putting the tiny bits to work.",
          ],
        },
      ],
    },
    {
      title: "Same bits, three dances",
      layout: "full-fig",
      figures: [
        {
          place: "full",
          src: "/games/chemistry-lab/assets/book/m1-states.jpg",
          caption: "Figure 2. Ice, a drop, a cloud. Same tiny bits. Different packing and motion.",
          alt: "Ice, liquid water, and clouds as three states of water",
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Ice, water, and steam are made of the exact same tiny bits. Nothing was added or removed. The only change is how those bits move and how close together they sit. Solid, liquid, gas: same ingredients, different dance.",
        },
        {
          type: "ul",
          items: [
            "Packed & still: a solid (ice).",
            "Close & sliding: a liquid (water).",
            "Far apart & fast: a gas (steam).",
          ],
        },
      ],
    },
    {
      title: "This tiny bit has a name",
      layout: "text",
      figures: [
        {
          place: "top",
          src: "/games/chemistry-lab/assets/book/m1-fig1.svg",
          caption: "Figure 3. One glowing bit from the zoom: an atom.",
          alt: "A single highlighted particle among many",
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Scientists named these bits over two thousand years ago: atom, from the Greek atomos, ‘that which cannot be cut.’ They thought if you kept slicing matter you would hit a piece that could not be cut further. They were mostly right, and we still use the word.",
        },
        {
          type: "p",
          text: "Quick check from the lab: ice, water, and steam are not different ingredients. They are the same atoms with different motion and spacing.",
        },
      ],
    },
    {
      title: "Many kinds, then a joined unit",
      layout: "text",
      figures: [
        {
          place: "top",
          src: "/games/chemistry-lab/assets/book/m1-fig2.svg",
          caption: "Figure 4. Two smaller bits and one larger bit snap into a bent shape: water’s unit.",
          alt: "Bent three-ball outline like a water molecule",
        },
      ],
      blocks: [
        {
          type: "p",
          text: "The dots are not all the same color. Sorting them by color is how you discover there is not just one kind of atom. There are many kinds.",
        },
        {
          type: "p",
          text: "Then you join two of one color and one of another into a bent outline. Three separate bits become one connected unit that drifts as a single shape. That is what is happening inside every drop of water you have ever touched. Names come later.",
        },
      ],
    },
    {
      title: "H₂O is the label for what you built",
      layout: "text",
      figures: [
        {
          place: "top",
          src: "/games/chemistry-lab/assets/book/m1-fig1.svg",
          caption: "Figure 5. The joined trio, now written H₂O.",
          alt: "Joined three-bit unit",
        },
      ],
      blocks: [
        {
          type: "p",
          text: "The blue bits are hydrogen (H). The red bit is oxygen (O). Two hydrogen plus one oxygen, joined, is H₂O, a molecule. The small 2 tells you how many of that atom are in the group.",
        },
        {
          type: "ul",
          items: [
            "O₂: two oxygen atoms joined as a pair.",
            "CO₂: one grey (carbon) with two reds in a straight line.",
            "Different combinations of a small set of atoms build water, air, and sugar.",
          ],
        },
      ],
    },
    {
      title: "What’s hiding inside an atom?",
      layout: "text",
      figures: [
        {
          place: "top",
          src: "/games/chemistry-lab/assets/book/m1-fig3.svg",
          caption: "Figure 6. Nucleus in the middle, electron rings around it.",
          alt: "Simplified atom with nucleus and rings",
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Atomos meant ‘cannot be cut.’ That name is a little wrong. Inside: protons (+), neutrons, and electrons (-). Protons and neutrons sit in the nucleus. Electrons occupy the rings.",
        },
        {
          type: "ul",
          items: [
            "1 proton + 1 electron → hydrogen.",
            "Then 2 protons, 2 neutrons, 2 electrons → helium.",
            "6 protons, 6 neutrons, 6 electrons → carbon (in your pencil, and in you).",
          ],
        },
        {
          type: "p",
          text: "Neutrons and electrons are not what decide the element. The number of protons does. That one number makes carbon carbon and not something else.",
        },
      ],
    },
    {
      title: "Atomic number is an ID",
      layout: "text",
      figures: [
        {
          place: "top",
          src: "/games/chemistry-lab/assets/book/m1-fig3.svg",
          caption: "Figure 7. Carbon’s box: 6 at the top, C in the middle.",
          alt: "Periodic-table style carbon entry",
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Every element is a different number of protons, with electrons around the nucleus. The first entries of the periodic table are just that pattern, organized. You built several of them in the lab.",
        },
        {
          type: "p",
          text: "The proton count is the atomic number: an atom’s ID, and no two elements share one. Carbon is always atomic number 6, everywhere in the universe. In a neutral atom, protons equal electrons, so the charges balance to zero.",
        },
      ],
    },
    {
      title: "Heat does not make new bits",
      layout: "text",
      figures: [
        {
          place: "top",
          src: "/games/chemistry-lab/assets/book/m1-melt.jpg",
          caption: "Figure 8. Ice becoming water. Energy arrived. The H₂O units did not vanish. They sped up and slipped.",
          alt: "Melting ice cubes",
        },
      ],
      blocks: [
        {
          type: "p",
          text: "The three dances from Spiral 1 return, now built from joined H₂O units. Cold locks them in a still grid (ice). The middle lets them slide (liquid). Hot sends them flying apart and upward (gas/steam).",
        },
        {
          type: "p",
          text: "You already discovered that ice, water, and steam are the same tiny bits moving differently. Heat is why they move differently. Heat does not create new tiny bits. It makes the ones you built move faster and spread further apart.",
        },
      ],
    },
    {
      title: "Nothing created, nothing destroyed",
      layout: "text",
      figures: [
        {
          place: "top",
          src: "/games/chemistry-lab/assets/book/m1-fig2.svg",
          caption: "Figure 9. 2H₂ + O₂ → 2H₂O. Same atoms, new partners.",
          alt: "Reaction of hydrogen and oxygen into water",
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Two hydrogen molecules (H₂ pairs) and one oxygen molecule (O₂ pair) can break their old bonds, swirl, and re-snap into two water units. Nothing is created. Nothing is destroyed. The same atoms, rearranged and rejoined.",
        },
        {
          type: "p",
          text: "That reaction is one of the ones that can power a rocket engine. Digesting lunch, rusting metal, and photosynthesis are the same idea: atoms letting go of old partners and grabbing new ones.",
        },
        {
          type: "p",
          text: "2H₂ + O₂ → 2H₂O is chemistry’s shorthand: a before, an arrow, and an after.",
        },
      ],
    },
    {
      title: "Back at the glass of water",
      layout: "text",
      figures: [
        {
          place: "top",
          src: "/games/chemistry-lab/assets/book/m1-states.jpg",
          caption: "Figure 10. Zoom out: molecule → droplet → glass. You know what you are looking at.",
          alt: "Ice, liquid water, and clouds",
        },
      ],
      blocks: [
        {
          type: "p",
          text: "You started at a glass of water and shrank past anything the eye can see. Everything is built from tiny bits called atoms. Atoms join into molecules. Atoms themselves are built from protons, neutrons, and electrons. All of chemistry (melting, boiling, burning, even breathing) is tiny bits moving, joining, and rearranging.",
        },
        {
          type: "p",
          text: "The spiral map at the end of the lab lets you replay any of the four loops. Next time you drink a glass of water, you will know exactly what you are really looking at.",
        },
      ],
    },
  ],
};

export default BOOK;
