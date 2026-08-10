/**
 * Digital book - Astronomy Space Mission 1: Sky Neighbors
 * Unique curriculum book (sun, planets, orbits). Not a template fill-in.
 */
export const BOOK = {
  missionIndex: 0,
  title: "Sky Neighbors",
  subtitle: "our star, planets, and the paths they keep",
  subject: "Astronomy Space / Sky Neighbors",
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
    title: "Sky Neighbors",
    art: "/games/astronomy-space/assets/book/m1-cover.jpg",
  },
  glossary: [
    { id: "star", term: "star" },
    { id: "planet", term: "planet" },
    { id: "orbit", term: "orbit" },
    { id: "gravity", term: "gravity" },
    { id: "solar-system", term: "solar system" },
    { id: "moon", term: "moon" },
    { id: "telescope", term: "telescope" },
  ],
  pages: [
    {
      title: "A neighborhood in space",
      layout: "text",
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/astronomy-space/assets/book/m1-cover.jpg",
              caption: "Figure 1. Night sky stars are distant suns; our solar system is the local neighborhood around one star.",
              alt: "Milky Way night sky",
            },
            {
              src: "/games/astronomy-space/assets/book/m1-sun.jpg",
              caption: "The Sun is our star - the gravity anchor of the solar system.",
              alt: "The Sun",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "A star makes its own light with nuclear power in its core. Planets shine mostly by reflected light.",
        },
        {
          type: "p",
          text: "Earth is one planet among others circling the Sun on an orbit shaped by gravity.",
        },
      ],
    },
    {
      title: "Orbits are falling sideways",
      layout: "full-fig",
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/astronomy-space/assets/book/m1-orbit.jpg",
              caption: "Figure 2. An orbit is a balanced dance - gravity pulls in while sideways speed keeps the path from collapsing.",
              alt: "Earth Moon orbit illustration",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "The Moon orbits Earth for the same reason planets orbit the Sun: gravity plus motion.",
        },
        {
          type: "ul",
          items: [
            "Closer paths need faster orbital speeds for circular orbits",
            "Moons are natural satellites of planets",
            "Models shrink huge distances so we can think",
          ],
        },
      ],
    },
    {
      title: "Planets are not alike",
      layout: "text",
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/astronomy-space/assets/book/m1-planet.jpg",
              caption: "Figure 3. Giant planets like Saturn show rings and scale far beyond Earth.",
              alt: "Saturn with rings",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Rocky inner planets differ from gas-rich outer giants. Distance from the Sun changes heat and year length.",
        },
      ],
    },
    {
      title: "Seeing farther",
      layout: "full-fig",
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/astronomy-space/assets/book/m1-telescope.jpg",
              caption: "Figure 4. A telescope gathers more light so faint sky neighbors become visible.",
              alt: "Telescope at observatory",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Eyes alone miss detail. Optics and dark skies turn dots into worlds and starfields.",
        },
      ],
    },
    {
      title: "How the mission connects",
      layout: "text",
      blocks: [
        {
          type: "p",
          text: "Meet the Sun → place planets → trace orbits → telescope lab → explain → rule → stretch → myth → fluency → mastery.",
        },
        {
          type: "ul",
          items: [
            "Ordering planets fights random memorization",
            "Orbit sketches link gravity to path",
            "The rule sentence is 'gravity holds the neighborhood together'",
          ],
        },
      ],
    },
    {
      title: "Ball-and-string lab",
      layout: "split",
      figures: [
        {
          place: "right",
          slides: [
            {
              src: "/games/astronomy-space/assets/book/m1-orbit.jpg",
              caption: "Model an orbit path.",
              alt: "Orbit model",
            },
            {
              src: "/games/astronomy-space/assets/book/m1-sun.jpg",
              caption: "Keep the star at center.",
              alt: "Sun center",
            },
            {
              src: "/games/astronomy-space/assets/book/m1-planet.jpg",
              caption: "Compare planet types.",
              alt: "Planet types",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Swing a soft ball on a string (safe open space). The pull is your gravity stand-in; the path is an orbit sketch.",
        },
        {
          type: "ul",
          items: [
            "What happens if you pull harder?",
            "What happens if motion stops?",
            "Which object is the star in your model?",
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
          text: "Myth: The Sun is not a star. Better: it is the nearest star - bright because it is close.",
        },
        {
          type: "p",
          text: "Myth: Gravity stops in space. Better: gravity reaches across the solar system and beyond.",
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
              src: "/games/astronomy-space/assets/book/m1-cover.jpg",
              caption: "Figure 5. Teach the sky as a gravity-bound solar system, not stickers on a dome.",
              alt: "Astronomy mastery anchor",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Teach a friend in one minute: the Sun is our star; planets orbit; gravity shapes those paths; moons orbit planets.",
        },
        {
          type: "ul",
          items: [
            "Define orbit in one sentence",
            "Name one difference between a star and a planet",
            "Use the word telescope correctly once",
          ],
        },
      ],
    },
  ],
};

export default BOOK;
