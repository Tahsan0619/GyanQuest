/**
 * Digital book - Eco Guardian Mission 1: Planet Balance
 * Unique curriculum book (ecosystems and human impact). Not a template fill-in.
 */
export const BOOK = {
  missionIndex: 0,
  title: "Planet Balance",
  subtitle: "living systems and the choices that tip them",
  subject: "Eco Guardian / Planet Balance",
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
    title: "Planet Balance",
    art: "/games/eco-guardian/assets/book/m1-cover.jpg",
  },
  glossary: [
    { id: "ecosystem", term: "ecosystem" },
    { id: "habitat", term: "habitat" },
    { id: "pollution", term: "pollution" },
    { id: "recycle", term: "recycle" },
    { id: "renewable", term: "renewable" },
    { id: "biodiversity", term: "biodiversity" },
    { id: "conservation", term: "conservation" },
  ],
  pages: [
    {
      title: "A system, not a postcard",
      layout: "text",
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/eco-guardian/assets/book/m1-forest.jpg",
              caption: "Figure 1. A forest canopy is an ecosystem - plants, animals, soil, and weather linked together.",
              alt: "Forest canopy",
            },
            {
              src: "/games/eco-guardian/assets/book/m1-cover.jpg",
              caption: "Balance means the links still work after we take what we need.",
              alt: "Planet care theme",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "An ecosystem is a living neighborhood plus its nonliving stage: light, water, air, and soil.",
        },
        {
          type: "p",
          text: "A habitat is the address inside that system where a species finds food, shelter, and space.",
        },
        {
          type: "p",
          text: "Everyday hook: your street is a tiny system - trees, drains, birds, trash bins, and people all affect each other.",
        },
      ],
    },
    {
      title: "When waste tips the scale",
      layout: "full-fig",
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/eco-guardian/assets/book/m1-cover.jpg",
              caption: "Figure 2. Plastic on a shoreline is pollution - matter in the wrong place that harms living links.",
              alt: "Ocean or beach pollution cleanup context",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Pollution is not only smoke. Plastic, oil, noise, and excess fertilizer can all break habitat links.",
        },
        {
          type: "ul",
          items: [
            "Reduce: use less of what becomes trash",
            "Reuse: give an item a second job",
            "Recycle: turn materials into new products when systems exist",
          ],
        },
      ],
    },
    {
      title: "Energy choices",
      layout: "text",
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/eco-guardian/assets/book/m1-energy.jpg",
              caption: "Figure 3. Solar panels harvest renewable energy from sunlight.",
              alt: "Solar panels",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Renewable sources can refill on human timescales - sun, wind, flowing water. Fossil fuels do not refill quickly.",
        },
        {
          type: "p",
          text: "Choosing cleaner energy protects air and slows some kinds of climate stress on ecosystems.",
        },
      ],
    },
    {
      title: "Biodiversity is backup",
      layout: "full-fig",
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/eco-guardian/assets/book/m1-water.jpg",
              caption: "Figure 4. Clean freshwater habitats support many species - biodiversity is a living safety net.",
              alt: "Clean river or freshwater habitat",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Biodiversity means many kinds of life in a place. More kinds often means the system can survive shocks better.",
        },
        {
          type: "p",
          text: "Conservation is the work of protecting habitats and species so the net does not tear.",
        },
      ],
    },
    {
      title: "How the mission connects",
      layout: "text",
      blocks: [
        {
          type: "p",
          text: "Meet the system → spot damage → sort choices → cleanup lab → explain → rule → stretch → myth → fluency → mastery.",
        },
        {
          type: "ul",
          items: [
            "Sorting actions shows help vs harm clearly",
            "The lab makes pollution feel local, not abstract",
            "The rule sentence ties choice → habitat → balance",
          ],
        },
      ],
    },
    {
      title: "Home audit lab",
      layout: "split",
      figures: [
        {
          place: "right",
          slides: [
            {
              src: "/games/eco-guardian/assets/book/m1-recycle.jpg",
              caption: "Sort waste where recycling exists.",
              alt: "Recycling bins",
            },
            {
              src: "/games/eco-guardian/assets/book/m1-energy.jpg",
              caption: "Notice where energy comes from.",
              alt: "Renewable energy",
            },
            {
              src: "/games/eco-guardian/assets/book/m1-forest.jpg",
              caption: "Protect living cover nearby.",
              alt: "Trees and habitat",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Walk your home or school yard. List one pollution risk, one habitat helper, and one energy habit you can change this week.",
        },
        {
          type: "ul",
          items: [
            "What living thing depends on that habitat?",
            "What waste could be reduced first?",
            "Which choice is conservation in action?",
          ],
        },
      ],
    },
    {
      title: "Myths to bust",
      layout: "text",
      blocks: [
        {
          type: "p",
          text: "Myth: One bottle does not matter. Better: millions of 'one bottles' become pollution loads ecosystems cannot digest.",
        },
        {
          type: "p",
          text: "Myth: Recycling alone fixes everything. Better: reduce and reuse come first; recycle is the last helpful step.",
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
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/eco-guardian/assets/book/m1-water.jpg",
              caption: "Figure 5. Teach with water habitat: links, threats, and care.",
              alt: "Freshwater teaching anchor",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Teach a friend in one minute: ecosystems link life and place; pollution breaks links; conservation and smart energy help restore balance.",
        },
        {
          type: "ul",
          items: [
            "Define ecosystem in one sentence",
            "Give one local conservation action",
            "Use the word biodiversity correctly once",
          ],
        },
      ],
    },
  ],
};

export default BOOK;
