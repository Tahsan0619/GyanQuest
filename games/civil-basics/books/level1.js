/**
 * Digital book - Civil Basics Mission 1: Strong Structures
 * Theory: cognitive load, dual coding, multimedia learning, constructivism,
 * conceptual change, spiral scaffold, retrieval practice.
 * Photos: assets/book-shared civil_mech theme (see assets/book/CREDITS-m1.json).
 */
export const BOOK = {
  missionIndex: 0,
  title: "Strong Structures",
  subtitle: "triangles & load",
  subject: "Civil Basics / Strong Structures",
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
    title: "Strong Structures",
    art: "/games/civil-basics/assets/book/m1-cover.jpg",
  },
  glossary: [
    { id: "load", term: "load" },
    { id: "truss", term: "truss" },
    { id: "triangle", term: "triangle" },
    { id: "base", term: "base" },
    { id: "frame", term: "frame" },
    { id: "brace", term: "brace" },
    { id: "force", term: "force" },
    { id: "span", term: "span" },
  ],
  pages: [
    {
      title: "Why bridges love triangles",
      layout: "text",
      theory: ["constructivism", "dual-coding", "cognitive-load"],
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/civil-basics/assets/book/m1-cover.jpg",
              caption: "Figure 1. A bridge span carries load - weight trying to bend or crush the path.",
              alt: "Bridge structure spanning a gap",
            },
            {
              src: "/games/civil-basics/assets/book/m1-hook.jpg",
              caption: "Cranes and towers lean on a firm base so lifting force does not tip them.",
              alt: "Construction crane with a stable base",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "A shelf, a bridge, and a building frame all fight the same enemy: load pulling or pushing where you do not want motion.",
        },
        {
          type: "p",
          text: "Triangles lock. Three sides pinned together resist changing shape, so truss bridges and braced frames stay stiff under load.",
        },
        {
          type: "p",
          text: "Look around Bangladesh streets: a bridge truss, a shelf bracket under books, a steel building frame - each is a lesson in triangles and bases.",
        },
      ],
    },
    {
      title: "Load needs a path",
      layout: "full-fig",
      theory: ["multimedia-learning", "dual-coding"],
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/civil-basics/assets/book/m1-model.jpg",
              caption: "Figure 2. Gears and frames share a lesson - forces travel through connected parts.",
              alt: "Mechanical gears transferring force",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Load is the weight or push a structure must carry. Strength is not magic metal - it is a clear path for that force down to the ground.",
        },
        {
          type: "ul",
          items: [
            "Wide, firm base -> harder to tip",
            "Triangle brace -> harder to rack or lean",
            "Broken path -> weak spot where bend begins",
          ],
        },
      ],
    },
    {
      title: "Bases and braces",
      layout: "text",
      theory: ["cognitive-load", "dual-coding"],
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/civil-basics/assets/book/m1-mechanism.jpg",
              caption: "Figure 3. Structure members form a skeleton that shares load.",
              alt: "Structural frame members",
            },
            {
              src: "/games/civil-basics/assets/book/m1-detail.jpg",
              caption: "Mechanical joints show how connected parts share work.",
              alt: "Close mechanical assembly",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "A tall tower with a tiny base topples easily. Spread the base and add braces, and the same height becomes safer under side force and gravity.",
        },
        {
          type: "p",
          text: "Shelf brackets are mini-trusses: the diagonal piece turns bending into compression and tension the wall can handle.",
        },
      ],
    },
    {
      title: "When metal remembers weather",
      layout: "full-fig",
      theory: ["multimedia-learning", "spiral-scaffold"],
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/civil-basics/assets/book/m1-transfer.jpg",
              caption: "Figure 4. Rusted metal reminds us: materials weaken, so design must leave margin for real life.",
              alt: "Rusted metal surface",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Canvas triangles are clean. Real steel can rust, loosen, or overload. Good structure starts with shape, then needs care and sensible load limits.",
        },
      ],
    },
    {
      title: "From dial to Structure Scout",
      layout: "text",
      theory: ["spiral-scaffold", "cognitive-load"],
      blocks: [
        {
          type: "p",
          text: "Mission flow: meet strong shapes, twist the strength dial, sort sound ideas, rebuild a stronger bridge, then speak the structure rule.",
        },
        {
          type: "ul",
          items: [
            "Triangles beat floppy rectangles under side push",
            "Bases spread load and fight tipping",
            "Naming the rule makes the lab stick beyond the screen",
          ],
        },
        {
          type: "p",
          text: "Each sub-step added one idea. Here you see the whole load story.",
        },
      ],
    },
    {
      title: "Street structure hunt",
      layout: "split",
      theory: ["constructivism", "dual-coding", "retrieval-practice"],
      figures: [
        {
          place: "right",
          slides: [
            {
              src: "/games/civil-basics/assets/book/m1-cover.jpg",
              caption: "Bridge truss - count the triangles.",
              alt: "Bridge with triangular truss",
            },
            {
              src: "/games/civil-basics/assets/book/m1-hook.jpg",
              caption: "Crane base - ask what stops the tip.",
              alt: "Crane at a worksite",
            },
            {
              src: "/games/civil-basics/assets/book/m1-mechanism.jpg",
              caption: "Building frame - find braces that fight lean.",
              alt: "Building structural frame",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "On the way to school, spot one truss, one bracket, and one frame. For each, point to where load travels.",
        },
        {
          type: "ul",
          items: [
            "Where are the triangles?",
            "Where is the base widest?",
            "What would fail first if a brace vanished?",
          ],
        },
      ],
    },
    {
      title: "Structure myths",
      layout: "text",
      theory: ["conceptual-change"],
      blocks: [
        {
          type: "p",
          text: "Myth: Heavier always means stronger. Better: smart shape often beats blind mass; triangles and bases matter.",
        },
        {
          type: "p",
          text: "Myth: A rectangle frame is as stiff as a triangle. Better: four-bar frames rack unless braced; triangles do not.",
        },
        {
          type: "p",
          text: "Myth: Only bridges need this. Better: shelves, roofs, and phone towers all carry load through frames.",
        },
        {
          type: "p",
          text: "Tap a red glossary word like truss or load to ask the tutor.",
        },
      ],
    },
    {
      title: "Structure Scout mastery",
      layout: "text",
      theory: ["retrieval-practice", "spiral-scaffold"],
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/civil-basics/assets/book/m1-cover.jpg",
              caption: "Figure 5. Use one bridge photo to teach triangles and load.",
              alt: "Bridge as teaching anchor",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Teach in one minute: load needs a path to the ground; triangles and wide bases keep frames from tipping or racking.",
        },
        {
          type: "ul",
          items: [
            "Sketch a braced triangle vs a floppy square",
            "Point to a real shelf bracket",
            "Use the word truss correctly once",
          ],
        },
      ],
    },
  ],
};

export default BOOK;
