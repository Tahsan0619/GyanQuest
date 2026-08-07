/**
 * Digital book - Chemistry Lab Mission 1: Tiny Bits (gold)
 */
export const BOOK = {
  missionIndex: 0,
  title: "Tiny Bits",
  subtitle: "particles of matter",
  subject: "Chemistry Lab / Tiny Bits",
  cover: {
    title: "Tiny Bits",
    art: "/games/chemistry-lab/assets/book/m1-fig1.svg",
  },
  glossary: [
    { id: "particle", term: "particle" },
    { id: "molecule", term: "molecule" },
    { id: "lattice", term: "lattice" },
    { id: "evaporation", term: "evaporation" },
    { id: "condensation", term: "condensation" },
    { id: "matter", term: "matter" },
    { id: "energy", term: "energy" },
    { id: "solid", term: "solid" },
  ],
  pages: [
    {
      title: "Why Tiny Bits?",
      layout: "text",
      figures: [
        {
          src: "/games/chemistry-lab/assets/book/m1-fig1.svg",
          caption: "Figure 1. Matter is made of tiny moving pieces.",
          place: "top",
          alt: "Particles overview",
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Everything you can touch is matter. A grain of salt, a drop of water, and the air in a room all take up space and have mass.",
        },
        {
          type: "p",
          text: "In the mission you dragged heat, sorted cards, and watched stories on the canvas. This book slows down to explain the same idea: matter is built from tiny pieces called a particle - and particles can join into a molecule.",
        },
        {
          type: "p",
          text: "Everyday hook: shake a salt shaker. Each grain looks tiny to you, but it is still huge compared with the particles inside.",
        },
      ],
    },
    {
      title: "Solid, liquid, gas",
      layout: "text",
      blocks: [
        {
          type: "p",
          text: "In a solid, particles stay close and keep a shape - like ice or salt crystals arranged in a lattice.",
        },
        {
          type: "p",
          text: "Add energy (heat) and particles jiggle harder. The solid can melt into a liquid that flows. Heat more and evaporation can turn liquid into gas.",
        },
        {
          type: "p",
          text: "Cool a misty bathroom mirror and you may see condensation - gas becoming liquid again. Same water particles, different spacing and speed.",
        },
        {
          type: "ul",
          items: [
            "Solid: packed, keeps shape",
            "Liquid: close, can flow",
            "Gas: spread out, fills space",
          ],
        },
      ],
    },
    {
      title: "See the model",
      layout: "full-fig",
      figures: [
        {
          src: "/games/chemistry-lab/assets/book/m1-fig2.svg",
          caption: "Figure 2. A simple particle model of heating matter.",
          place: "full",
          alt: "Heat and particles",
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Models are not photographs. They are tools. When the canvas showed bouncing dots, it was teaching particle motion - not claiming salt grains are literally those dots.",
        },
      ],
    },
    {
      title: "How the 10 steps connect",
      layout: "text",
      blocks: [
        {
          type: "p",
          text: "Meet -> dial heat -> sort matter -> lab goal -> explain -> rule -> stretch -> myth -> fluency -> mastery. Each step adds one layer.",
        },
        {
          type: "ul",
          items: [
            "Sorting teaches what counts as matter",
            "The heat dial links energy to state change",
            "The rule sentence locks the idea in words",
          ],
        },
        {
          type: "p",
          text: "If a step felt short, that was on purpose. The book is where we gather the full story.",
        },
      ],
    },
    {
      title: "Kitchen lab",
      layout: "split",
      figures: [
        {
          src: "/games/chemistry-lab/assets/book/m1-fig3.svg",
          caption: "Figure 3. Everyday state changes.",
          place: "right",
          alt: "Kitchen examples",
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Watch ice melt, water boil, or a cold bottle sweat. Name solid, liquid, gas, evaporation, and condensation as you see them.",
        },
        {
          type: "p",
          text: "Ask: What stayed the same substance? What changed because of energy?",
        },
      ],
    },
    {
      title: "Myths to bust",
      layout: "text",
      blocks: [
        {
          type: "p",
          text: "Myth: Heat is a glowing fluid you pour. Better: heat is energy transfer that makes particles move differently.",
        },
        {
          type: "p",
          text: "Myth: Steam is empty air. Better: steam is water particles in the gas state.",
        },
        {
          type: "p",
          text: "Red words are glossary terms. Tap one to ask the tutor for a simple root explanation.",
        },
      ],
    },
    {
      title: "Mastery",
      layout: "text",
      blocks: [
        {
          type: "p",
          text: "Teach a friend in one minute: matter is made of particles; energy can change how they move; solid, liquid, and gas are patterns of that motion.",
        },
        {
          type: "ul",
          items: [
            "Sketch a lattice vs a flowing liquid",
            "Point to evaporation in real life",
            "Use the word molecule correctly once",
          ],
        },
      ],
    },
  ],
};

export default BOOK;
