/**
 * Digital book - Astronomy Space Mission 1: Solar Family
 * Theory: cognitive load, dual coding, multimedia learning, constructivism,
 * conceptual change, spiral scaffold, retrieval practice.
 * Photos: solar system and planet JPGs under assets/book/.
 */
export const BOOK = {
  missionIndex: 0,
  title: "Solar Family",
  subtitle: "sun and planets in orbit",
  subject: "Astronomy Space / Solar Family",
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
    title: "Solar Family",
    art: "/games/astronomy-space/assets/book/m1-cover.jpg",
  },
  glossary: [
    { id: "sun", term: "Sun" },
    { id: "planet", term: "planet" },
    { id: "orbit", term: "orbit" },
    { id: "solar-system", term: "solar system" },
    { id: "gravity", term: "gravity" },
    { id: "star", term: "star" },
    { id: "inner-planet", term: "inner planet" },
    { id: "outer-planet", term: "outer planet" },
  ],
  pages: [
    {
      title: "Family around one bright star",
      layout: "text",
      theory: ["constructivism", "dual-coding", "cognitive-load"],
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/astronomy-space/assets/book/m1-hook.jpg",
              caption: "Figure 1. Planets are not scattered randomly - they loop the Sun.",
              alt: "Diagram-like view of planets",
            },
            {
              src: "/games/astronomy-space/assets/book/m1-earth.jpg",
              caption: "Earth is one planet in that family - our home world.",
              alt: "Earth seen from space",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "On a clear Dhaka evening you may spot a bright 'star' that is really a planet. A school globe is a tiny Earth model. Both hint at the same truth: planets travel around the Sun.",
        },
        {
          type: "p",
          text: "The solar system is our neighborhood: one star at the center, planets in orbit, and smaller travelers like moons and rocks.",
        },
        {
          type: "p",
          text: "Earn Orbit Scout by naming who orbits whom - planets orbit the Sun, not the other way around.",
        },
      ],
    },
    {
      title: "Sun in the middle, paths outside",
      layout: "full-fig",
      theory: ["multimedia-learning", "dual-coding"],
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/astronomy-space/assets/book/m1-cover.jpg",
              caption: "Figure 2. Model: the Sun anchors the family; planets follow closed paths.",
              alt: "Solar system illustration",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "An orbit is a repeating path. Gravity from the Sun keeps planets from flying off in a straight line.",
        },
        {
          type: "ul",
          items: [
            "Sun = the system's star (huge and hot)",
            "Inner planets = closer, rockier",
            "Outer planets = farther, often giant",
          ],
        },
      ],
    },
    {
      title: "Closer paths feel faster",
      layout: "text",
      theory: ["cognitive-load", "dual-coding"],
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/astronomy-space/assets/book/m1-model.jpg",
              caption: "Figure 3. The Sun's pull is stronger nearby - closer planets finish a lap sooner.",
              alt: "Sun-focused space image",
            },
            {
              src: "/games/astronomy-space/assets/book/m1-mars.jpg",
              caption: "Mars - farther than Earth, longer year.",
              alt: "Mars",
            },
            {
              src: "/games/astronomy-space/assets/book/m1-jupiter.jpg",
              caption: "Jupiter - a giant on a wide orbit.",
              alt: "Jupiter",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "A year is one full orbit. Mercury's year is short; Neptune's year is huge. Distance changes the lap time.",
        },
        {
          type: "p",
          text: "Mission dials that pull a planet closer are models of that idea: shorter path, quicker loop.",
        },
      ],
    },
    {
      title: "Sort planet, Sun, other",
      layout: "full-fig",
      theory: ["multimedia-learning", "spiral-scaffold"],
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/astronomy-space/assets/book/m1-saturn.jpg",
              caption: "Figure 4. Representation: ringed Saturn is still a planet orbiting the Sun.",
              alt: "Saturn",
            },
            {
              src: "/games/astronomy-space/assets/book/m1-nebula.jpg",
              caption: "Pretty sky clouds are not planets - sort carefully.",
              alt: "Nebula",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Canvas dots are models. Real photos still ask the same sort: Is it the Sun, a planet, or something else?",
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
          text: "Meet the solar family -> orbit clarity lab -> sort planet / Sun / other -> closer orbit lab -> why planets orbit -> name the orbit rule -> stretch to sky places -> myth bust -> fluency -> Orbit Scout mastery.",
        },
        {
          type: "ul",
          items: [
            "Sorting prevents calling the Sun a planet",
            "Closer-orbit lab links distance to lap time",
            "The rule sentence: planets orbit the Sun",
          ],
        },
      ],
    },
    {
      title: "Night-sky transfer",
      layout: "split",
      theory: ["constructivism", "dual-coding", "retrieval-practice"],
      figures: [
        {
          place: "right",
          slides: [
            {
              src: "/games/astronomy-space/assets/book/m1-earth.jpg",
              caption: "Earth - one orbiting planet.",
              alt: "Earth from Apollo",
            },
            {
              src: "/games/astronomy-space/assets/book/m1-mars.jpg",
              caption: "Mars - another planet on its own path.",
              alt: "Mars",
            },
            {
              src: "/games/astronomy-space/assets/book/m1-cover.jpg",
              caption: "Family map - Sun plus orbiting worlds.",
              alt: "Solar system map",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Use a globe or a ball-and-lamp demo. Keep the lamp as the Sun. Move Earth on a loop. Name orbit and planet.",
        },
        {
          type: "ul",
          items: [
            "What stays in the center?",
            "What travels on a path?",
            "Drag the photos to flip examples",
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
          text: "Myth: The Sun orbits Earth each day. Better: Earth spins and also orbits the Sun; day/night is mostly spin (next mission).",
        },
        {
          type: "p",
          text: "Myth: Planets sit still on a flat map. Better: maps are snapshots; real planets keep moving on orbits.",
        },
        {
          type: "p",
          text: "Red words are glossary terms. Tap one to ask the tutor.",
        },
      ],
    },
    {
      title: "Orbit Scout mastery",
      layout: "text",
      theory: ["retrieval-practice", "spiral-scaffold"],
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/astronomy-space/assets/book/m1-cover.jpg",
              caption: "Figure 5. Teaching anchor: Sun center, planets on paths.",
              alt: "Solar system teaching anchor",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Teach a friend in one minute: the Sun is our star; planets orbit because of gravity; closer orbits finish a year sooner.",
        },
        {
          type: "ul",
          items: [
            "Sketch Sun plus two planet paths",
            "Point to Earth on a family map",
            "Use the word orbit correctly once",
          ],
        },
      ],
    },
  ],
};

export default BOOK;
