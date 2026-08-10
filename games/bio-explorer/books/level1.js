/**
 * Digital book - Bio Explorer Mission 1: Living or Not
 * Unique curriculum book (traits of life). Not a template fill-in.
 * Photos: Wikimedia Commons (see assets/book/CREDITS-m1.json).
 */
export const BOOK = {
  missionIndex: 0,
  title: "Living or Not",
  subtitle: "traits that mark life",
  subject: "Bio Explorer / Living or Not",
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
    title: "Living or Not",
    art: "/games/bio-explorer/assets/book/m1-cover.jpg",
  },
  glossary: [
    { id: "organism", term: "organism" },
    { id: "trait", term: "trait" },
    { id: "stimulus", term: "stimulus" },
    { id: "reproduce", term: "reproduce" },
    { id: "nutrition", term: "nutrition" },
    { id: "dormant", term: "dormant" },
    { id: "nonliving", term: "nonliving" },
  ],
  pages: [
    {
      title: "Is a sleeping cat alive?",
      layout: "text",
      theory: ["constructivism", "dual-coding", "cognitive-load"],
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/bio-explorer/assets/book/m1-hook.jpg",
              caption: "Figure 1. Eyes closed, still an organism - life does not require constant motion.",
              alt: "Sleeping cat",
            },
            {
              src: "/games/bio-explorer/assets/book/m1-cover.jpg",
              caption: "A seedling is quiet too, yet it can grow when conditions allow.",
              alt: "Young seedling in soil",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "A sleeping cat barely moves. A rock never will. Both can sit still - only one is living.",
        },
        {
          type: "p",
          text: "Biologists look for a bundle of traits: grow, take nutrition, respond to a stimulus, and reproduce when ready.",
        },
        {
          type: "p",
          text: "Everyday hook: compare your pet (or a houseplant) with a phone charger on the table.",
        },
      ],
    },
    {
      title: "Living vs nonliving",
      layout: "full-fig",
      theory: ["multimedia-learning", "dual-coding"],
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/bio-explorer/assets/book/m1-living.jpg",
              caption: "Figure 2. Green tissue captures light - a living leaf at work.",
              alt: "Close-up green leaf",
            },
            {
              src: "/games/bio-explorer/assets/book/m1-nonliving.jpg",
              caption: "Stone can be beautiful and old, but it does not grow or reproduce.",
              alt: "Granite rock close-up",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Living means the whole set of traits, not one flashy clue. Fire moves and needs fuel - still nonliving.",
        },
        {
          type: "ul",
          items: [
            "Organism: a whole living individual (cat, mango tree, bacterium)",
            "Nonliving: never ran the full life program (rock, plastic cup, flame)",
            "One trait alone is not enough - check the bundle",
          ],
        },
      ],
    },
    {
      title: "Energy and response",
      layout: "text",
      theory: ["cognitive-load", "dual-coding"],
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/bio-explorer/assets/book/m1-energy.jpg",
              caption: "Figure 3. Sunflowers track light - a clear response to a stimulus outdoors.",
              alt: "Sunflowers in a field",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Every organism needs a way to get energy. Plants capture sunlight; animals eat; both use that energy to keep cells working.",
        },
        {
          type: "p",
          text: "A stimulus is a cue from the world - light, touch, sound, hunger. Living things respond; a textbook does not flinch when you drop it.",
        },
      ],
    },
    {
      title: "Quiet is not dead",
      layout: "full-fig",
      theory: ["multimedia-learning", "spiral-scaffold", "conceptual-change"],
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/bio-explorer/assets/book/m1-cover.jpg",
              caption: "Figure 4. Seeds can stay dormant for months, then sprout when water and warmth arrive.",
              alt: "Seedling emerging from soil",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Dormant means paused, not fake. A dry seed is still an organism waiting for the right moment to grow.",
        },
        {
          type: "p",
          text: "That is why the mission sorted sleepy cats and mango seeds with living clues, not with 'is it moving right now?'",
        },
      ],
    },
    {
      title: "How the 10 steps connect",
      layout: "text",
      theory: ["spiral-scaffold", "cognitive-load"],
      blocks: [
        {
          type: "p",
          text: "Meet clues → sprout lab → sort living/not → watch growth → explain → rule → stretch → myth → fluency → mastery.",
        },
        {
          type: "ul",
          items: [
            "Sorting forces you to use several traits together",
            "The seed lab shows dormancy can look like 'not alive'",
            "The rule sentence locks the bundle of traits in words",
          ],
        },
        {
          type: "p",
          text: "Short steps on purpose. This book gathers the full sorting story.",
        },
      ],
    },
    {
      title: "Sort lab at home",
      layout: "split",
      theory: ["constructivism", "dual-coding", "retrieval-practice"],
      figures: [
        {
          place: "right",
          slides: [
            {
              src: "/games/bio-explorer/assets/book/m1-hook.jpg",
              caption: "Living: responds, needs nutrition, can reproduce later.",
              alt: "Cat as living example",
            },
            {
              src: "/games/bio-explorer/assets/book/m1-nonliving.jpg",
              caption: "Nonliving: no growth program, no offspring.",
              alt: "Rock as nonliving example",
            },
            {
              src: "/games/bio-explorer/assets/book/m1-living.jpg",
              caption: "Living plant tissue - slow change still counts.",
              alt: "Leaf tissue",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Pick three objects nearby. For each, name two traits you can observe or infer, then decide living or nonliving.",
        },
        {
          type: "ul",
          items: [
            "Which traits did you actually see?",
            "Which did you infer (like 'can reproduce')?",
            "Flip the photos and sort again out loud",
          ],
        },
      ],
    },
    {
      title: "Myths to bust",
      layout: "text",
      theory: ["conceptual-change"],
      blocks: [
        {
          type: "p",
          text: "Myth: If it does not move, it is dead. Better: dormancy and sleep are still life.",
        },
        {
          type: "p",
          text: "Myth: Fire is alive because it grows and needs fuel. Better: fire does not reproduce as an organism or keep organized cells.",
        },
        {
          type: "p",
          text: "Red words are glossary terms. Tap one to ask the tutor - each mark appears once on purpose.",
        },
      ],
    },
    {
      title: "Mastery",
      layout: "text",
      theory: ["retrieval-practice", "spiral-scaffold"],
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/bio-explorer/assets/book/m1-energy.jpg",
              caption: "Figure 5. Teach with this picture: stimulus, response, and energy in one scene.",
              alt: "Sunflowers facing light",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Teach a friend in one minute: life is a bundle of traits; sleeping and dormant still count; rocks and flames fail the test.",
        },
        {
          type: "ul",
          items: [
            "Name four traits of an organism",
            "Give one living and one nonliving example",
            "Use the word stimulus correctly once",
          ],
        },
      ],
    },
  ],
};

export default BOOK;
