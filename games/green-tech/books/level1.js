/**
 * Digital book - Green Tech Mission 1: Clean Power Tools
 * Unique curriculum book (renewables and efficiency). Not a template fill-in.
 */
export const BOOK = {
  missionIndex: 0,
  title: "Clean Power Tools",
  subtitle: "tech that lowers damage while doing useful work",
  subject: "Green Tech / Clean Power Tools",
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
    title: "Clean Power Tools",
    art: "/games/green-tech/assets/book/m1-cover.jpg",
  },
  glossary: [
    { id: "renewable", term: "renewable" },
    { id: "efficiency", term: "efficiency" },
    { id: "solar", term: "solar" },
    { id: "wind-turbine", term: "wind turbine" },
    { id: "carbon", term: "carbon footprint" },
    { id: "grid", term: "grid" },
    { id: "insulation", term: "insulation" },
  ],
  pages: [
    {
      title: "Power with a lighter footprint",
      layout: "text",
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/green-tech/assets/book/m1-cover.jpg",
              caption: "Figure 1. Solar panels turn sunlight into electricity without burning fuel on site.",
              alt: "Solar panels",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Renewable power can refill on human timescales. Solar and a wind turbine harvest flows that keep coming.",
        },
        {
          type: "p",
          text: "Your carbon footprint estimates greenhouse gases linked to your energy and goods. Green tech aims to shrink it.",
        },
      ],
    },
    {
      title: "Efficiency is a superpower",
      layout: "full-fig",
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/green-tech/assets/book/m1-hook.jpg",
              caption: "Figure 2. Insulation and LED lighting raise efficiency - same comfort, less waste energy.",
              alt: "Energy efficiency at home",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Efficiency means more useful output per unit of energy in. Waste heat and leaky buildings steal comfort.",
        },
        {
          type: "p",
          text: "The electrical grid mixes sources. Cleaner generation plus efficiency beats either alone.",
        },
      ],
    },
    {
      title: "How the mission connects",
      layout: "text",
      blocks: [
        {
          type: "p",
          text: "Meet renewables → compare fuels → efficiency lab → explain → rule → stretch → myth → fluency → mastery.",
        },
      ],
    },
    {
      title: "Home efficiency lab",
      layout: "split",
      figures: [
        {
          place: "right",
          slides: [
            {
              src: "/games/green-tech/assets/book/m1-cover.jpg",
              caption: "Spot a renewable idea nearby.",
              alt: "Renewable",
            },
            {
              src: "/games/green-tech/assets/book/m1-model.jpg",
              caption: "Find one efficiency win.",
              alt: "Efficiency",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "List three energy uses at home. Mark each: reduce, switch to cleaner source, or improve insulation/efficiency.",
        },
      ],
    },
    {
      title: "Myths to bust",
      layout: "text",
      blocks: [
        {
          type: "p",
          text: "Myth: Green tech means zero impact forever. Better: it lowers damage; materials and manufacturing still matter.",
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
              src: "/games/green-tech/assets/book/m1-hook.jpg",
              caption: "Figure 3. Teach clean power as renewables plus ruthless efficiency.",
              alt: "Green tech mastery",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Teach a friend in one minute: renewable sources refill; efficiency cuts waste; the grid and footprint connect your choices.",
        },
      ],
    },
  ],
};

export default BOOK;
