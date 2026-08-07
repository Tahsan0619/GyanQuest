/**
 * Digital book - Chemistry Lab Mission 2: Element Hunt
 * Unique book: one kind of atom = element.
 */
export const BOOK = {
  missionIndex: 1,
  title: "Element Hunt",
  subtitle: "one kind of atom",
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
    art: "/games/chemistry-lab/assets/book/m2-cover.jpg",
  },
  glossary: [
    { id: "element", term: "element" },
    { id: "atom", term: "atom" },
    { id: "metal", term: "metal" },
    { id: "oxygen", term: "oxygen" },
    { id: "iron", term: "iron" },
    { id: "copper", term: "copper" },
    { id: "compound", term: "compound" },
    { id: "mixture", term: "mixture" },
  ],
  pages: [
    {
      title: "Hunt one kind of atom",
      layout: "text",
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/chemistry-lab/assets/book/m2-hook.jpg",
              caption: "Crystals under a microscope - still built from repeating atom kinds.",
              alt: "Salt crystals microscope",
            },
            {
              src: "/games/chemistry-lab/assets/book/m2-a.jpg",
              caption: "Cubic salt crystals you can grow - a compound made from two element kinds bonded.",
              alt: "Home-grown salt crystals",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Some everyday stuff is made of only one kind of atom - that is an element. Hunt iron-like metal, copper wire, and oxygen in air, then name a rule you can reuse anywhere.",
        },
        {
          type: "p",
          text: "In the lab bottles: grey hints iron-like metal, amber hints copper-like wire metal, blue hints oxygen in air. Each bottle story points at a pure element idea.",
        },
      ],
    },
    {
      title: "Element vs compound vs mixture",
      layout: "full-fig",
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/chemistry-lab/assets/book/m2-cover.jpg",
              caption: "Ordered crystals remind us that 'pure' can still mean carefully arranged atoms.",
              alt: "Sodium chloride crystals",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "ul",
          items: [
            "Element: one atom kind (iron, copper, oxygen)",
            "Compound: bonded different atom kinds (salt, water)",
            "Mixture: different pieces side by side (air, salty water)",
          ],
        },
        {
          type: "p",
          text: "Stretching copper wire does not invent a new atom kind - it is still copper element.",
        },
      ],
    },
    {
      title: "Metals and oxygen stories",
      layout: "text",
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/chemistry-lab/assets/book/m2-model.jpg",
              caption: "Chips pack repeating units - a reminder that bulk stuff is built from tiny identical pieces.",
              alt: "Integrated circuit",
            },
            {
              src: "/games/chemistry-lab/assets/book/m2-b.jpg",
              caption: "A glowing bulb needs a metal filament path - metals are elements we meet as wires and tools.",
              alt: "Light bulb",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Iron and copper are metallic elements you can often touch as solids. Oxygen is an element you meet as a gas in air - still one atom kind, even when paired as O2.",
        },
        {
          type: "p",
          text: "Air itself is a mixture. Oxygen in air is the element hiding inside that mixture.",
        },
      ],
    },
    {
      title: "The scout rule",
      layout: "full-fig",
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/chemistry-lab/assets/book/m2-a.jpg",
              caption: "If you can name 'only one atom kind,' you found an element story.",
              alt: "Salt crystal cluster",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Rule to keep: one kind of atom makes an element. When you sort Element / Compound / Mixture cards, ask that question first.",
        },
      ],
    },
    {
      title: "How Element Hunt steps fit",
      layout: "text",
      blocks: [
        {
          type: "p",
          text: "Meet hunt → magnifier bottles → sort three zones → stretch copper → tap O2 pairs → build the element rule → stretch objects → myths → fluency → Element Scout mastery.",
        },
        {
          type: "ul",
          items: [
            "Bottle stories make atom kinds visible without jargon first",
            "Sorting locks the three-way distinction",
            "Myths catch 'air is an element' mistakes early",
          ],
        },
      ],
    },
    {
      title: "Kitchen and tool hunt",
      layout: "split",
      figures: [
        {
          place: "right",
          slides: [
            {
              src: "/games/chemistry-lab/assets/book/m2-b.jpg",
              caption: "Metal parts in tools and bulbs.",
              alt: "Bulb",
            },
            {
              src: "/games/chemistry-lab/assets/book/m2-c.jpg",
              caption: "Water boiling - compound H2O, not an element.",
              alt: "Boiling water",
            },
            {
              src: "/games/chemistry-lab/assets/book/m2-hook.jpg",
              caption: "Crystals - ask how many atom kinds.",
              alt: "Microscope crystals",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Point around you: foil, wire, charcoal, helium balloon stories, graphite pencil. Which are element tales?",
        },
        {
          type: "ul",
          items: [
            "Name one metal element you can touch",
            "Name one gas element in air",
            "Name one compound that is NOT an element",
          ],
        },
      ],
    },
    {
      title: "Element myths",
      layout: "text",
      blocks: [
        {
          type: "p",
          text: "Myth: Water is an element because it feels 'pure.' Better: water is a compound of hydrogen and oxygen.",
        },
        {
          type: "p",
          text: "Myth: Air is an element. Better: air is a mixture; oxygen inside it is an element.",
        },
        {
          type: "p",
          text: "Myth: O2 pairs mean a compound. Better: O2 is still one atom kind - element oxygen.",
        },
      ],
    },
    {
      title: "Element Scout check",
      layout: "text",
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/chemistry-lab/assets/book/m2-cover.jpg",
              caption: "Teach with this crystal photo, then contrast it with a true element example.",
              alt: "Crystal anchor",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Teach a friend: element = one atom kind. Give iron, copper, and oxygen examples. Call out one compound impostor.",
        },
        {
          type: "ul",
          items: [
            "Say the element rule aloud",
            "Sort one object into element/compound/mixture",
            "Bust the water-or-air myth",
          ],
        },
      ],
    },
  ],
};

export default BOOK;
