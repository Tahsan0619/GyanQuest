/**
 * Chemistry Lab Mission 3 book — Bond Buddies
 * 10 pages. Links between atoms — not a rerun of Tiny Bits melting ice.
 */
export const BOOK = {
  missionIndex: 2,
  title: "Bond Buddies",
  subtitle: "links that hold atoms together",
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
    art: "/games/chemistry-lab/assets/book/m3-cover.jpg",
  },
  glossary: [
    { id: "bond", term: "bond" },
    { id: "molecule", term: "molecule" },
    { id: "atom", term: "atom" },
    { id: "ionic", term: "ionic" },
    { id: "covalent", term: "covalent" },
    { id: "compound", term: "compound" },
    { id: "attract", term: "attract" },
  ],
  pages: [
    {
      title: "Droplets stick. That is only a preview.",
      layout: "text",
      figures: [
        {
          place: "top",
          src: "/games/chemistry-lab/assets/book/m3-droplets.jpg",
          caption: "Figure 1. Water beads clinging. You feel a pull. That feeling is not yet the definition of a bond.",
          alt: "Water droplets clinging to a surface",
        },
      ],
      blocks: [
        {
          type: "p",
          text: "The mission used a crane magnet and clicking discs to make attraction visible. Water droplets also pull together because neighbouring molecules attract. These familiar pulls are a starting analogy, not the definition of a chemical bond.",
        },
        {
          type: "p",
          text: "A chemical bond is a strong interaction involving atoms’ outer electrons. Bonding lowers the energy of the combined arrangement, helping atoms form stable molecules or extended lattices. Breaking a bond requires energy; forming one releases energy to the surroundings.",
        },
        {
          type: "ul",
          items: [
            "Inside one water molecule: strong O–H covalent bonds.",
            "Between water molecules: weaker attractions create droplets.",
            "Scale matters: visible sticking is evidence, not a picture of atoms.",
          ],
        },
      ],
    },
    {
      title: "This is a real bond picture",
      layout: "full-fig",
      figures: [
        {
          place: "full",
          src: "/games/chemistry-lab/assets/book/m3-cover.jpg",
          caption: "Figure 2. Water: two H linked to one O. The sticks are bonds. H–O–H is one molecule.",
          alt: "Ball-and-stick model of a water molecule",
        },
      ],
      blocks: [
        {
          type: "p",
          text: "A ball-and-stick model translates invisible structure into a readable diagram. Ball colours label atom kinds; sticks show which atoms are bonded. Actual atoms are not coloured balls, and bonds are not rigid rods with empty tunnels around them.",
        },
        {
          type: "ul",
          items: [
            "H₂O: two O–H covalent bonds make one bent molecule.",
            "O₂: two oxygen atoms bond while remaining one element.",
            "NaCl: ions form a repeating lattice rather than separate H₂O-style molecules.",
            "A mixture: different particles share space without creating one new bonded particle.",
          ],
        },
        {
          type: "p",
          text: "Models answer ‘which atom connects to which?’ Space-filling models answer ‘how much space does each atom occupy?’ Scientists switch models depending on the question.",
        },
      ],
    },
    {
      title: "Magnets teach pull, not the link",
      layout: "text",
      figures: [
        {
          place: "top",
          src: "/games/chemistry-lab/assets/book/m3-magnets.svg",
          caption: "Figure 3. N facing S. Use this as a feeling of attract, then switch to an atom picture.",
          alt: "Diagram of two bar magnets attracting",
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Opposite magnet poles attract through a magnetic field, while like poles repel. Chemical bonding instead depends mainly on electrostatic interactions among positively charged nuclei and negatively charged electrons. The mechanisms are not the same.",
        },
        {
          type: "p",
          text: "The analogy still teaches three useful ideas: attraction can act without visible contact, orientation can matter, and pulling partners apart takes work. It fails because atoms are not tiny bar magnets and chemical bonds involve electron arrangements.",
        },
        {
          type: "ul",
          items: [
            "Use analogy: to imagine attraction and stability.",
            "Reject analogy: when explaining charge, electrons, or bond type.",
            "Scientific habit: state where every model works and where it fails.",
          ],
        },
      ],
    },
    {
      title: "Ionic buddies: charged partners in a grid",
      layout: "full-fig",
      figures: [
        {
          place: "full",
          src: "/games/chemistry-lab/assets/book/m3-nacl.jpg",
          caption: "Figure 4. Salt lattice: Na⁺ and Cl⁻ alternate. A 3-D grid of partners — not one H–O–H trio.",
          alt: "Diagram of sodium and chloride ions in a crystal lattice",
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Sodium can lose one outer electron to become Na⁺; chlorine can gain one to become Cl⁻. Opposite charges attract in every direction, so solid sodium chloride forms a giant repeating ionic lattice rather than individual NaCl molecules.",
        },
        {
          type: "p",
          text: "The lattice is strong and has a high melting point. If layers shift so like charges line up, repulsion can split the crystal, making ionic solids brittle. In water, polar molecules surround and separate ions; the solution conducts because those charged particles can move.",
        },
        {
          type: "ul",
          items: [
            "Electron transfer creates charged ions.",
            "Electrostatic attraction holds the lattice together.",
            "The formula NaCl gives the simplest 1:1 charge-balanced ratio.",
          ],
        },
      ],
    },
    {
      title: "Covalent buddies can survive a boil",
      layout: "text",
      figures: [
        {
          place: "top",
          src: "/games/chemistry-lab/assets/book/m1-boil.jpg",
          caption: "Figure 5. Water leaving as gas. H–O–H molecules can stay intact while the huddle of neighbours loosens.",
          alt: "Water boiling in a pot",
        },
      ],
      blocks: [
        {
          type: "p",
          text: "A covalent bond forms when atoms share pairs of electrons. In each water molecule, oxygen shares electrons with two hydrogen atoms. These O–H bonds are much stronger than the attractions between neighbouring water molecules.",
        },
        {
          type: "p",
          text: "During boiling, energy mainly overcomes attractions between molecules so intact H₂O molecules can separate into gas. Breaking O–H bonds would be a chemical change and requires far more energy. This distinction separates a change of state from decomposition.",
        },
        {
          type: "ul",
          items: [
            "Intramolecular: within a molecule; O–H bonds.",
            "Intermolecular: between molecules; weaker attractions.",
            "Boiling rearranges spacing without turning water into hydrogen and oxygen.",
          ],
        },
      ],
    },
    {
      title: "Kits are maps, not the atoms",
      layout: "text",
      figures: [
        {
          place: "top",
          src: "/games/chemistry-lab/assets/book/m3-modelkit.jpg",
          caption: "Figure 6. Coloured pieces and rods. The rods stand for bonds — a map you can hold.",
          alt: "HGS general chemistry molecular model kit tray",
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Molecular model kits encode information: colours identify elements, connector holes suggest bonding capacity, and rods show connections. By rotating a model, you can inspect three-dimensional shape more accurately than with a flat formula.",
        },
        {
          type: "p",
          text: "Every representation hides something. H₂O shows composition but little shape. A ball-and-stick model exaggerates distances to expose bonds. A space-filling model better shows size and surface but can hide connections. None is a literal miniature photograph.",
        },
        {
          type: "ul",
          items: [
            "Formula: fastest count of atom kinds and ratios.",
            "Ball-and-stick: clearest connectivity and geometry.",
            "Space-filling: clearest occupied volume and molecular surface.",
          ],
        },
      ],
    },
    {
      title: "What Bond Buddies trained",
      layout: "text",
      blocks: [
        {
          type: "p",
          text: "The three missions now form one explanatory chain. Tiny Bits asked how particles move and pack. Element Hunt asked which atom kinds are present. Bond Buddies asks how electron-based interactions hold those atoms in molecules or lattices.",
        },
        {
          type: "ul",
          items: [
            "Steps 1–2: compare separated particles with stable partners.",
            "Steps 3–4: sort bond, weaker attraction, and no new connection; test an analogy.",
            "Steps 5–6: read H–O–H and explain a bond using electrons and stability.",
            "Steps 7–10: transfer to salt, O₂, and sugar; reject myths; retrieve fluently.",
          ],
        },
        {
          type: "p",
          text: "Mastery means choosing the right scale. A spoon may stick with glue at human scale while every substance in the glue contains its own atom-scale bonds.",
        },
      ],
    },
    {
      title: "Sugar is bonded. Wet sand is not a new molecule.",
      layout: "split",
      figures: [
        {
          place: "right",
          src: "/games/chemistry-lab/assets/book/m3-sugar.jpg",
          caption: "Figure 7. Sugar crystals — stacked molecules. Sweet does not mean 'no chemistry.'",
          alt: "Close-up of sugar crystals",
        },
      ],
      blocks: [
        {
          type: "ul",
          items: [
            "Sugar crystal: many sucrose molecules packed in an ordered solid; strong covalent bonds hold each molecule together.",
            "Dissolved sugar: water separates molecules from the crystal, but the sucrose molecules usually remain intact.",
            "Wet sand: water occupies spaces and attracts grain surfaces; no single ‘wet-sand molecule’ forms.",
            "Burned sugar: new substances form as bonds break and others form—a chemical change, unlike dissolving.",
          ],
        },
        {
          type: "p",
          text: "Test the claim ‘sticking means bonding’ by asking whether a new particle with a definite composition formed. If materials can be separated physically and retain identity, you are probably observing a mixture or surface attraction.",
        },
      ],
    },
    {
      title: "Glue fails the atom-to-atom test",
      layout: "text",
      figures: [
        {
          place: "top",
          src: "/games/chemistry-lab/assets/book/m3-glue.jpg",
          caption: "Figure 8. A glue stick joins paper. Helpful craft. Not a chemical bond between atoms.",
          alt: "Open glue stick on a craft desk",
        },
      ],
      blocks: [
        {
          type: "ul",
          items: [
            "Myth: tape or glue is itself a chemical bond. Correction: it is material containing bonded molecules that adheres through several surface interactions.",
            "Myth: magnets are giant chemical bonds. Correction: magnetic force is an analogy with a different physical mechanism.",
            "Myth: any broken object has broken every chemical bond. Correction: snapping a sugar crystal mainly separates regions while molecules can survive.",
            "Myth: boiling water breaks H₂O apart. Correction: it mainly overcomes weaker intermolecular attractions.",
          ],
        },
        {
          type: "p",
          text: "Use precise verbs: bonds form or break; molecules separate or collide; substances melt, dissolve, or react. ‘Everything unstuck’ hides the mechanism.",
        },
      ],
    },
    {
      title: "Bond Explorer — one sentence, two examples",
      layout: "text",
      figures: [
        {
          place: "top",
          src: "/games/chemistry-lab/assets/book/m3-h2o.jpg",
          caption: "Figure 9. Space-filling water. Same molecule as the stick model — a second memory picture.",
          alt: "Space-filling model of a water molecule",
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Build the final explanation: chemical bonds are stable atom-scale interactions involving outer electrons. Covalent bonds share electron pairs, as in H₂O and O₂. Ionic bonding attracts oppositely charged ions throughout a lattice, as in NaCl.",
        },
        {
          type: "p",
          text: "Then separate the near-misses. Water droplets reveal attractions between molecules, magnets demonstrate a different long-range force, glue adheres surfaces, and mixed grains merely share space. None should be labelled an atom-to-atom chemical bond just because visible objects stick.",
        },
        {
          type: "ul",
          items: [
            "Predict whether boiling water breaks O–H bonds, then justify.",
            "Explain why solid salt is brittle but dissolved salt conducts.",
            "Compare what formula, stick model, and space-filling model reveal.",
          ],
        },
        {
          type: "p",
          text: "If you can answer using bond type, particle scale, and evidence—not only ‘buddies attract’—you have completed Bond Explorer.",
        },
      ],
    },
  ],
};

export default BOOK;
