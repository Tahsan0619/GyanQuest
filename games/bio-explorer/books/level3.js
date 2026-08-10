/**
 * Digital book - Bio Explorer Mission 3: Plant Power
 * Unique curriculum book (how plants make and move food). Not a template fill-in.
 * Photos: Wikimedia Commons (see assets/book/CREDITS-m3.json).
 */
export const BOOK = {
  missionIndex: 2,
  title: "Plant Power",
  subtitle: "how green factories feed life",
  subject: "Bio Explorer / Plant Power",
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
    title: "Plant Power",
    art: "/games/bio-explorer/assets/book/m3-cover.jpg",
  },
  glossary: [
    { id: "photosynthesis", term: "photosynthesis" },
    { id: "chlorophyll", term: "chlorophyll" },
    { id: "stomata", term: "stomata" },
    { id: "glucose", term: "glucose" },
    { id: "xylem", term: "xylem" },
    { id: "phloem", term: "phloem" },
    { id: "producer", term: "producer" },
  ],
  pages: [
    {
      title: "Why plants matter first",
      layout: "text",
      theory: ["constructivism", "dual-coding", "cognitive-load"],
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/bio-explorer/assets/book/m3-hook.jpg",
              caption: "Figure 1. A leafy canopy catches light - the first step in making food for an ecosystem.",
              alt: "Forest canopy leaves in sunlight",
            },
            {
              src: "/games/bio-explorer/assets/book/m3-cover.jpg",
              caption: "Green leaves are solar factories, not just decoration.",
              alt: "Green plant leaves",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Animals hunt or browse. Plants build sugar from light, air, and water - that is plant power.",
        },
        {
          type: "p",
          text: "A plant is a producer: it makes food molecules other organisms can later eat.",
        },
        {
          type: "p",
          text: "Everyday hook: the rice, bread, or fruit on your plate started as plant sugar somewhere.",
        },
      ],
    },
    {
      title: "Photosynthesis in plain words",
      layout: "full-fig",
      theory: ["multimedia-learning", "dual-coding"],
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/bio-explorer/assets/book/m3-producer.jpg",
              caption: "Figure 2. Chlorophyll makes leaves look green and helps trap light energy.",
              alt: "Green grass and plants in sunlight",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Photosynthesis is the recipe: light + carbon dioxide + water → glucose + oxygen.",
        },
        {
          type: "ul",
          items: [
            "Chlorophyll: the green pigment that catches light",
            "Glucose: the sugar the plant stores or uses",
            "Oxygen: a useful leftover for animals that breathe",
          ],
        },
      ],
    },
    {
      title: "Gates and highways",
      layout: "text",
      theory: ["cognitive-load", "dual-coding"],
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/bio-explorer/assets/book/m3-consumer.jpg",
              caption: "Figure 3. When a deer eats leaves, it is taking plant-made glucose up the food chain.",
              alt: "Deer grazing on plants",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Tiny pores called stomata let carbon dioxide in and oxygen out. Plants can open or close them like gates.",
        },
        {
          type: "p",
          text: "Xylem tubes carry water up from roots. Phloem tubes carry sugar to growing tips, fruits, and storage organs.",
        },
      ],
    },
    {
      title: "What recyclers add",
      layout: "full-fig",
      theory: ["multimedia-learning", "spiral-scaffold"],
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/bio-explorer/assets/book/m3-decomposer.jpg",
              caption: "Figure 4. Fungi break dead leaves so nutrients return to soil for new plants.",
              alt: "Mushrooms on forest floor",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Producers start the chain. Consumers eat. Decomposers unlock leftover nutrients so producers can grow again.",
        },
        {
          type: "p",
          text: "Without plants making glucose, the rest of the chain has nothing solid to run on.",
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
          text: "Meet leaves → light lab → gas exchange → transport → explain → rule → stretch → myth → fluency → mastery.",
        },
        {
          type: "ul",
          items: [
            "The light lab links chlorophyll to energy capture",
            "Transport steps stop the myth that plants 'drink sugar from soil'",
            "The rule sentence ties inputs to glucose and oxygen",
          ],
        },
      ],
    },
    {
      title: "Window-sill lab",
      layout: "split",
      theory: ["constructivism", "dual-coding", "retrieval-practice"],
      figures: [
        {
          place: "right",
          slides: [
            {
              src: "/games/bio-explorer/assets/book/m3-producer.jpg",
              caption: "Producer leaves in light.",
              alt: "Green plants",
            },
            {
              src: "/games/bio-explorer/assets/book/m3-hook.jpg",
              caption: "Canopy catching sunlight.",
              alt: "Forest canopy",
            },
            {
              src: "/games/bio-explorer/assets/book/m3-decomposer.jpg",
              caption: "Nutrients cycling back.",
              alt: "Forest fungi",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Watch a houseplant for a week. Note light, water, and new growth. Explain each with a plant-power word.",
        },
        {
          type: "ul",
          items: [
            "Where does the carbon in new leaves come from?",
            "Which tube system would move sugar to a fruit?",
            "Flip the photos and narrate the chain out loud",
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
          text: "Myth: Plants eat soil the way we eat food. Better: soil holds water and minerals; the sugar is built with light and air carbon.",
        },
        {
          type: "p",
          text: "Myth: Plants only give oxygen and need nothing. Better: they also need carbon dioxide, water, and light for photosynthesis.",
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
      theory: ["retrieval-practice", "spiral-scaffold"],
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/bio-explorer/assets/book/m3-cover.jpg",
              caption: "Figure 5. Use this leaf as your teaching anchor for plant power.",
              alt: "Leaf teaching anchor",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Teach a friend in one minute: photosynthesis builds glucose; chlorophyll catches light; xylem and phloem move water and sugar.",
        },
        {
          type: "ul",
          items: [
            "Say the photosynthesis recipe in your own words",
            "Name stomata as the gas gates",
            "Use the word producer correctly once",
          ],
        },
      ],
    },
  ],
};

export default BOOK;
