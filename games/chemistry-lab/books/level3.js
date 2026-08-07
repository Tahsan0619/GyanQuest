/**
 * Digital book - Chemistry Lab Mission 3: Bond Buddies
 * Unique book: bonds link atoms as partners.
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
    { id: "atom", term: "atom" },
    { id: "molecule", term: "molecule" },
    { id: "attract", term: "attract" },
    { id: "ionic", term: "ionic" },
    { id: "covalent", term: "covalent" },
    { id: "compound", term: "compound" },
  ],
  pages: [
    {
      title: "Atoms that stick as buddies",
      layout: "text",
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/chemistry-lab/assets/book/m3-hook.jpg",
              caption: "Pieces can join or rearrange when attractions win - bonds are the lasting chemical links.",
              alt: "Melting ice",
            },
            {
              src: "/games/chemistry-lab/assets/book/m3-cover.jpg",
              caption: "Salt crystals stay together because ionic bonds lock Na and Cl partners in a lattice.",
              alt: "Salt crystals",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Atoms rarely live alone in everyday stuff. Bonds are the links that hold atom friends together - like magnets clicking or water droplets sticking.",
        },
        {
          type: "p",
          text: "Mission hooks: a crane magnet pulling a cup, magnets clicking, water droplets gathering in a bowl. Those feelings preview attraction - then we upgrade to real chemical bonds.",
        },
      ],
    },
    {
      title: "What a bond is (and is not)",
      layout: "full-fig",
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/chemistry-lab/assets/book/m3-a.jpg",
              caption: "A crystal lattice is a huge network of bonded partners - not glue and not fridge-magnet toys.",
              alt: "NaCl crystal close-up",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "A chemical bond links atoms into molecules or lattices. Fridge magnets and tape are helpful analogies, not the same thing as bonds.",
        },
        {
          type: "ul",
          items: [
            "Bonded molecule: atoms linked (water H-O-H)",
            "Attraction buddy feel: magnets help you imagine pull",
            "No chemical bond: loose mixture pieces sitting nearby",
          ],
        },
      ],
    },
    {
      title: "Click, stick, link",
      layout: "text",
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/chemistry-lab/assets/book/m3-model.jpg",
              caption: "Same substance, different spacing - bonding and state are related but not identical ideas.",
              alt: "Ice water vapor",
            },
            {
              src: "/games/chemistry-lab/assets/book/m3-b.jpg",
              caption: "Boiling breaks attractions between molecules enough to escape as gas - bonds inside a water molecule can still hold.",
              alt: "Boiling water",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "In Bond Buddies you snap lonely atoms into a link, slide magnets until they click, and sort bonded vs not. The rule: atoms link with bonds as buddies.",
        },
        {
          type: "p",
          text: "Water models show H-O-H bonded buddies. Salt shows ionic partners in a lattice. O2 shows two oxygen atoms bonded - still an element.",
        },
      ],
    },
    {
      title: "Hold the buddy picture",
      layout: "full-fig",
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/chemistry-lab/assets/book/m3-c.jpg",
              caption: "Zoomed structure helps you remember: bonds create ordered partners, not random piles.",
              alt: "Microscope crystals",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "When the canvas shows a glow snap, that is the iconic version of 'bond formed.' Say the symbolic rule right after you feel it.",
        },
      ],
    },
    {
      title: "How Bond Buddies steps fit",
      layout: "text",
      blocks: [
        {
          type: "p",
          text: "Meet buddies → attraction pull → sort bonded/attraction/none → magnet snap lab → water models → build bond rule → stretch salt/O2/sugar → myths → fluency → Bond Explorer mastery.",
        },
        {
          type: "ul",
          items: [
            "Magnet labs borrow everyday pull feelings",
            "Sorting stops 'everything sticky is a bond' errors",
            "Stretch objects prove the rule travels",
          ],
        },
      ],
    },
    {
      title: "Droplets and magnets",
      layout: "split",
      figures: [
        {
          place: "right",
          slides: [
            {
              src: "/games/chemistry-lab/assets/book/m3-hook.jpg",
              caption: "Ice to liquid - attractions change with energy.",
              alt: "Melting",
            },
            {
              src: "/games/chemistry-lab/assets/book/m3-b.jpg",
              caption: "Steam escape - molecules leave, bonds inside may remain.",
              alt: "Boil",
            },
            {
              src: "/games/chemistry-lab/assets/book/m3-cover.jpg",
              caption: "Salt lattice - ionic bond network.",
              alt: "Salt",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Watch droplets merge on a cold bottle and fridge magnets click. Ask: analogy or real chemical bond?",
        },
        {
          type: "ul",
          items: [
            "Name one true bonded molecule",
            "Name one magnet analogy",
            "Name one mixture with no new bonds",
          ],
        },
      ],
    },
    {
      title: "Bond myths",
      layout: "text",
      blocks: [
        {
          type: "p",
          text: "Myth: Glue and tape are chemical bonds. Better: they are sticky materials; bonds are atom-to-atom links.",
        },
        {
          type: "p",
          text: "Myth: Fridge magnets are chemical bonds. Better: magnetic force is a helpful buddy metaphor, not the bond itself.",
        },
        {
          type: "p",
          text: "Myth: Breaking a solid always means destroying molecules. Better: sometimes you only separate chunks; bonds inside pieces can remain.",
        },
      ],
    },
    {
      title: "Bond Explorer check",
      layout: "text",
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/chemistry-lab/assets/book/m3-a.jpg",
              caption: "Teaching anchor: partners locked in a pattern.",
              alt: "Crystal partners",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Teach a friend: bonds link atoms as buddies. Use water and salt examples. Bust the glue/magnet myths.",
        },
        {
          type: "ul",
          items: [
            "Say the bond rule in your own words",
            "Sketch H-O-H once",
            "Explain why magnets are only an analogy",
          ],
        },
      ],
    },
  ],
};

export default BOOK;
