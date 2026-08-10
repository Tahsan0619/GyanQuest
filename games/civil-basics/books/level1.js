/**
 * Digital book - Civil Basics Mission 1: Structures Stand
 * Unique curriculum book (loads, beams, foundations). Not a template fill-in.
 */
export const BOOK = {
  missionIndex: 0,
  title: "Structures Stand",
  subtitle: "how buildings and bridges carry loads",
  subject: "Civil Basics / Structures Stand",
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
    title: "Structures Stand",
    art: "/games/civil-basics/assets/book/m1-cover.jpg",
  },
  glossary: [
    { id: "load", term: "load" },
    { id: "beam", term: "beam" },
    { id: "column", term: "column" },
    { id: "foundation", term: "foundation" },
    { id: "tension", term: "tension" },
    { id: "compression", term: "compression" },
    { id: "span", term: "span" },
  ],
  pages: [
    {
      title: "Standing is a job",
      layout: "text",
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/civil-basics/assets/book/m1-cover.jpg",
              caption: "Figure 1. Bridges and buildings are systems that carry loads safely to the ground.",
              alt: "Bridge structure",
            },
            {
              src: "/games/civil-basics/assets/book/m1-load.jpg",
              caption: "Traffic is a live load - it moves and changes.",
              alt: "Bridge traffic load",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "A load is a force a structure must carry - people, wind, snow, trucks, even its own weight.",
        },
        {
          type: "p",
          text: "Civil engineers choose shapes and materials so loads travel down without tearing the structure apart.",
        },
      ],
    },
    {
      title: "Beams, columns, span",
      layout: "full-fig",
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/civil-basics/assets/book/m1-beam.jpg",
              caption: "Figure 2. A beam spans a gap and bends under load; supports catch that force.",
              alt: "Concrete beam",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "ul",
          items: [
            "Beam: horizontal member across a span",
            "Column: vertical member that mainly takes compression",
            "Span: clear distance between supports",
          ],
        },
      ],
    },
    {
      title: "Push and pull inside",
      layout: "text",
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/civil-basics/assets/book/m1-material.jpg",
              caption: "Figure 3. Reinforced concrete pairs materials - steel likes tension, concrete likes compression.",
              alt: "Reinforced concrete rebar",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Compression is a squeeze. Tension is a pull. Different parts of a beam feel both when it bends.",
        },
        {
          type: "p",
          text: "Pick materials for the job they handle well - that is why rebar shows up inside concrete.",
        },
      ],
    },
    {
      title: "Foundations first",
      layout: "full-fig",
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/civil-basics/assets/book/m1-foundation.jpg",
              caption: "Figure 4. A foundation spreads loads into soil so the building does not punch through or tip.",
              alt: "Building foundation",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Pretty walls fail if the foundation cannot share load with the ground beneath.",
        },
      ],
    },
    {
      title: "How the mission connects",
      layout: "text",
      blocks: [
        {
          type: "p",
          text: "Meet loads → place beams → test span → foundation lab → explain → rule → stretch → myth → fluency → mastery.",
        },
        {
          type: "ul",
          items: [
            "Changing span shows why supports matter",
            "Material talk links tension and compression",
            "The rule sentence is 'carry load to ground safely'",
          ],
        },
      ],
    },
    {
      title: "Span lab",
      layout: "split",
      figures: [
        {
          place: "right",
          slides: [
            {
              src: "/games/civil-basics/assets/book/m1-beam.jpg",
              caption: "Model a beam with a ruler.",
              alt: "Beam model",
            },
            {
              src: "/games/civil-basics/assets/book/m1-foundation.jpg",
              caption: "Widen the base supports.",
              alt: "Foundation idea",
            },
            {
              src: "/games/civil-basics/assets/book/m1-load.jpg",
              caption: "Add a careful load.",
              alt: "Load test",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Support a ruler on two books. Add coins at midspan. Shorten the span and compare sag.",
        },
        {
          type: "ul",
          items: [
            "Where did the beam bend most?",
            "Is the top feeling compression or tension?",
            "How would a better foundation help a tower of blocks?",
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
          text: "Myth: Stronger always means thicker everything. Better: smart shape and material placement beat blind bulk.",
        },
        {
          type: "p",
          text: "Myth: Foundations are just cosmetic baseboards. Better: they are the load handoff to earth.",
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
              src: "/games/civil-basics/assets/book/m1-cover.jpg",
              caption: "Figure 5. Teach structures as load paths from span to foundation.",
              alt: "Civil mastery anchor",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Teach a friend in one minute: loads travel through beams and columns; tension and compression appear in bending; foundations finish the path.",
        },
        {
          type: "ul",
          items: [
            "Define span in one sentence",
            "Name one tension-friendly idea (steel)",
            "Use the word foundation correctly once",
          ],
        },
      ],
    },
  ],
};

export default BOOK;
