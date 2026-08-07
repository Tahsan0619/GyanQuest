/**
 * Digital book - Mechanical Basics / Levers & Gears
 * Theory: cognitive load, dual coding, multimedia learning, constructivism,
 * conceptual change, spiral scaffold, retrieval practice.
 * Photos: local verified copies under /games/mechanical-basics/assets/book/ (see CREDITS-m1.json).
 */
export const BOOK = {
  missionIndex: 0,
  title: "Levers & Gears",
  subtitle: "simple machines",
  subject: "Mechanical Basics / Levers & Gears",
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
    title: "Levers & Gears",
    art: "/games/mechanical-basics/assets/book/m1-cover.jpg",
  },
  glossary: [
    { id: "lever", term: "lever" },
    { id: "gear", term: "gear" },
    { id: "fulcrum", term: "fulcrum" },
    { id: "effort", term: "effort" },
    { id: "load", term: "load" },
    { id: "force", term: "force" },
    { id: "torque", term: "torque" },
    { id: "machine", term: "machine" },
    { id: "advantage", term: "advantage" },
    { id: "trade", term: "trade" },
  ],
  pages: [
    {
      title: "Why Levers & Gears?",
      layout: "text",
      theory: [
        "constructivism",
        "dual-coding",
        "cognitive-load",
      ],
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/mechanical-basics/assets/book/m1-hook.jpg",
              caption: "Figure 1. Motion you can feel - machines redirect it.",
              alt: "Skateboard motion",
            },
            {
              src: "/games/mechanical-basics/assets/book/m1-cover.jpg",
              caption: "Gears mesh to trade speed and force.",
              alt: "Mechanical gears",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Levers and gears make hard jobs easier by trading force, distance, and turn.",
        },
        {
          type: "p",
          text: "Seesaws, bottle openers, and bike gears are everyday simple machines - not only factory toys.",
        },
        {
          type: "p",
          text: "Everyday hook: a bottle opener is a lever that multiplies your hand force at the cap.",
        },
      ],
    },
    {
      title: "Lever trade",
      layout: "full-fig",
      theory: [
        "multimedia-learning",
        "dual-coding",
      ],
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/mechanical-basics/assets/book/m1-model.jpg",
              caption: "Figure 2. Gear teeth - another trade of turn and force.",
              alt: "Gear close-up",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "A lever pivots on a fulcrum. Move the fulcrum and the push you need changes.",
        },
        {
          type: "ul",
          items: [
            "Long effort arm can mean easier lift",
            "Fulcrum place matters",
            "Levers do not create magic infinite force",
          ],
        },
      ],
    },
    {
      title: "Gear dial",
      layout: "text",
      theory: [
        "cognitive-load",
        "dual-coding",
      ],
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/mechanical-basics/assets/book/m1-mechanism.webp",
              caption: "Figure 3. Newton cradle shows force transfer along a linked path.",
              alt: "Newton cradle",
            },
            {
              src: "/games/mechanical-basics/assets/book/m1-lab.webp",
              caption: "Pushing a cart - feel effort vs distance.",
              alt: "Pushing cart",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "In the lab you dialed mechanical advantage until the job felt easier.",
        },
        {
          type: "p",
          text: "Gears change speed and turn direction. Bigger gear does not mean infinite force - pairs trade together.",
        },
      ],
    },
    {
      title: "Simple machines around you",
      layout: "full-fig",
      theory: [
        "multimedia-learning",
        "spiral-scaffold",
      ],
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/mechanical-basics/assets/book/m1-mastery.jpg",
              caption: "Figure 4. Mechanical assemblies - trades in metal.",
              alt: "Mechanical assembly",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Seesaws, crowbars, scissors, and bike gear clusters are lever/gear cousins.",
        },
        {
          type: "p",
          text: "Name the fulcrum, effort, and load when you can.",
        },
      ],
    },
    {
      title: "How the 10 steps connect",
      layout: "text",
      theory: [
        "spiral-scaffold",
        "cognitive-load",
      ],
      blocks: [
        {
          type: "p",
          text: "Meet levers -> dial advantage -> sort machine parts -> stronger lab -> why fulcrums -> name the trade rule -> stretch bikes -> myths -> fluency -> mastery.",
        },
        {
          type: "ul",
          items: [
            "Sorting names fulcrum vs gear roles",
            "Labs show force/distance trades",
            "Rule: levers and gears trade force, distance, and turn",
          ],
        },
      ],
    },
    {
      title: "Street lab: bottle opener",
      layout: "split",
      theory: [
        "constructivism",
        "dual-coding",
        "retrieval-practice",
      ],
      figures: [
        {
          place: "right",
          slides: [
            {
              src: "/games/mechanical-basics/assets/book/m1-hook.jpg",
              caption: "Everyday motion.",
              alt: "Skateboard",
            },
            {
              src: "/games/mechanical-basics/assets/book/m1-mechanism.webp",
              caption: "Transfer chain.",
              alt: "Cradle",
            },
            {
              src: "/games/mechanical-basics/assets/book/m1-cover.jpg",
              caption: "Gear trade.",
              alt: "Gears",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Use a safe bottle opener or a seesaw photo. Point to fulcrum, effort, and load.",
        },
        {
          type: "ul",
          items: [
            "Predict what happens if the fulcrum moves",
            "Find one gear on a bicycle",
            "Flip carousel: skate motion vs cradle transfer",
          ],
        },
      ],
    },
    {
      title: "Myths to bust",
      layout: "text",
      theory: [
        "conceptual-change",
      ],
      blocks: [
        {
          type: "p",
          text: "Myth: levers only make things heavier. Better: levers trade distance for force - they help lift.",
        },
        {
          type: "p",
          text: "Myth: fulcrum position does not matter. Better: fulcrum place changes how hard you push.",
        },
        {
          type: "p",
          text: "Myth: bigger gear always means infinite force. Better: gear pairs trade speed and force together.",
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
      theory: [
        "retrieval-practice",
        "spiral-scaffold",
      ],
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/mechanical-basics/assets/book/m1-mastery.jpg",
              caption: "Figure 5. Mechanical trade - your lever/gear goal.",
              alt: "Mechanical anchor",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Teach a friend: fulcrum + effort + load; gears trade speed and force.",
        },
        {
          type: "ul",
          items: [
            "Sketch a lever and label three parts",
            "Explain one bike gear change",
            "Use the word fulcrum correctly once",
          ],
        },
      ],
    },
  ],
};

export default BOOK;
