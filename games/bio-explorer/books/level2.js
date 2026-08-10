/**
 * Digital book - Bio Explorer Mission 2: Cell City
 * Unique curriculum book (cell parts as a working city). Not a template fill-in.
 * Photos: Wikimedia Commons (see assets/book/CREDITS-m2.json).
 */
export const BOOK = {
  missionIndex: 1,
  title: "Cell City",
  subtitle: "tiny parts that keep life running",
  subject: "Bio Explorer / Cell City",
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
    title: "Cell City",
    art: "/games/bio-explorer/assets/book/m2-cover.jpg",
  },
  glossary: [
    { id: "organelle", term: "organelle" },
    { id: "nucleus", term: "nucleus" },
    { id: "membrane", term: "membrane" },
    { id: "cytoplasm", term: "cytoplasm" },
    { id: "mitochondria", term: "mitochondria" },
    { id: "chloroplast", term: "chloroplast" },
    { id: "microscope", term: "microscope" },
  ],
  pages: [
    {
      title: "A city too small to see",
      layout: "text",
      theory: ["constructivism", "dual-coding", "cognitive-load"],
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/bio-explorer/assets/book/m2-hook.jpg",
              caption: "Figure 1. Onion skin under a microscope - real cells, packed like rooms in a wall.",
              alt: "Onion epidermis cells under microscope",
            },
            {
              src: "/games/bio-explorer/assets/book/m2-cover.jpg",
              caption: "A labeled cell model helps you name parts you cannot see with bare eyes.",
              alt: "Animal cell model",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Every plant and animal body is built from cells. One cell is a tiny room with jobs happening inside.",
        },
        {
          type: "p",
          text: "We call the specialized parts organelles - like shops and offices inside a busy city.",
        },
        {
          type: "p",
          text: "Everyday hook: think of your school. The office, cafeteria, and walls each do a different job so the whole place works.",
        },
      ],
    },
    {
      title: "Control room and border",
      layout: "full-fig",
      theory: ["multimedia-learning", "dual-coding"],
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/bio-explorer/assets/book/m2-nucleus.jpg",
              caption: "Figure 2. The nucleus is the control room - it holds the instructions for the cell.",
              alt: "Cell nucleus microscopy",
            },
            {
              src: "/games/bio-explorer/assets/book/m2-membrane.jpg",
              caption: "The membrane is the city border - it chooses what enters and leaves.",
              alt: "Cell membrane diagram",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "ul",
          items: [
            "Nucleus: stores the plan (DNA instructions)",
            "Membrane: thin border that controls traffic",
            "Cytoplasm: the jelly-like space where work happens",
          ],
        },
        {
          type: "p",
          text: "If the membrane fails, the city floods. If the nucleus is missing, nobody knows what to build next.",
        },
      ],
    },
    {
      title: "Power plants inside",
      layout: "text",
      theory: ["cognitive-load", "dual-coding"],
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/bio-explorer/assets/book/m2-organelle.jpg",
              caption: "Figure 3. Mitochondria release usable energy from food molecules - the cell's power stations.",
              alt: "Mitochondria electron micrograph",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Mitochondria break down food fuel so the cell can move materials, repair itself, and grow.",
        },
        {
          type: "p",
          text: "Plant cells add another organelle: the chloroplast, which captures light to make sugar. Animal cells do not have that factory.",
        },
      ],
    },
    {
      title: "Why models matter",
      layout: "full-fig",
      theory: ["multimedia-learning", "spiral-scaffold"],
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/bio-explorer/assets/book/m2-cover.jpg",
              caption: "Figure 4. A classroom cell model is a map, not a photograph of every molecule.",
              alt: "Classroom cell model",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Under a microscope you see outlines and some organelles. Colored models exaggerate size so you can learn the jobs faster.",
        },
        {
          type: "p",
          text: "In the mission, matching each organelle to a city job trained that map in your head.",
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
          text: "Meet the city → tour parts → match jobs → lab view → explain → rule → stretch → myth → fluency → mastery.",
        },
        {
          type: "ul",
          items: [
            "Matching jobs stops you from memorizing names with no meaning",
            "The microscope step proves cells are real, not cartoon only",
            "The rule sentence links part → job → whole organism",
          ],
        },
      ],
    },
    {
      title: "Tour lab",
      layout: "split",
      theory: ["constructivism", "dual-coding", "retrieval-practice"],
      figures: [
        {
          place: "right",
          slides: [
            {
              src: "/games/bio-explorer/assets/book/m2-nucleus.jpg",
              caption: "Control room - nucleus.",
              alt: "Nucleus",
            },
            {
              src: "/games/bio-explorer/assets/book/m2-organelle.jpg",
              caption: "Power station - mitochondria.",
              alt: "Mitochondria",
            },
            {
              src: "/games/bio-explorer/assets/book/m2-membrane.jpg",
              caption: "City border - membrane.",
              alt: "Membrane",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Point to each photo and say the organelle name plus one job. Then invent a new city metaphor of your own.",
        },
        {
          type: "ul",
          items: [
            "Which part is the border?",
            "Which part holds the plan?",
            "Which part makes usable energy?",
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
          text: "Myth: Only animals have cells. Better: plants, fungi, and many tiny organisms are also built from cells.",
        },
        {
          type: "p",
          text: "Myth: The nucleus is a tiny brain that thinks. Better: it stores instructions; thinking happens in networks of many cells.",
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
              src: "/games/bio-explorer/assets/book/m2-hook.jpg",
              caption: "Figure 5. Teach from this microscope view: walls of cells, each with jobs inside.",
              alt: "Onion cells teaching anchor",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Teach a friend in one minute: cells are living rooms; organelles do jobs; nucleus, membrane, and mitochondria are three you must know.",
        },
        {
          type: "ul",
          items: [
            "Sketch a cell and label three organelles",
            "Give one plant-only organelle (chloroplast)",
            "Use the word cytoplasm correctly once",
          ],
        },
      ],
    },
  ],
};

export default BOOK;
