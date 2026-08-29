/**
 * Astronomy & Space Mission 1 book: Solar Family
 * Companion to the 4-spiral lesson (gravity → types → members → scale).
 */
export const BOOK = {
  missionIndex: 0,
  title: "Solar Family",
  subtitle: "meet the Sun's eight children, held by gravity",
  subject: "Astronomy & Space / Solar Family",
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
    art: "/games/astronomy-space/assets/book/gen-as-m1-cover.png",
  },
  glossary: [
    { id: "orbit", term: "orbit" },
    { id: "gravity", term: "gravity" },
    { id: "planet", term: "planet" },
    { id: "terrestrial", term: "terrestrial" },
    { id: "gas-giant", term: "gas giant" },
    { id: "habitable-zone", term: "habitable zone" },
    { id: "solar-system", term: "solar system" },
  ],
  pages: [
    {
      title: "Meet the family",
      layout: "text",
      figures: [
        {
          place: "top",
          src: "/games/astronomy-space/assets/book/gen-as-m1-fig01-sky.png",
          caption: "Figure 1. Night-sky wanderers are siblings of one star: our Sun.",
          alt: "Child looking up at a starry night sky",
        },
      ],
      blocks: [
        {
          type: "p",
          text: "The solar system is a family. The Sun is the parent; eight planets are its children - four rocky and close, four giant and far. Mars news and Saturn photos are family portraits of the same neighborhood.",
        },
        {
          type: "ul",
          items: [
            "Spiral 1: gravity and orbits.",
            "Spiral 2: rocky worlds versus giants.",
            "Spiral 3: members in order from the Sun.",
            "Spiral 4: scale and Earth's habitable home.",
          ],
        },
      ],
    },
    {
      title: "Home world",
      layout: "full-fig",
      figures: [
        {
          place: "full",
          src: "/games/astronomy-space/assets/book/gen-as-m1-fig02-earth.png",
          caption: "Figure 2. Earth is one planet among eight, spinning day into night.",
          alt: "Earth as a glowing sphere in space",
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Earth is not the center of everything. It is one sibling circling the Sun. Day and night happen because Earth turns. The bigger family story is the orbit around our star.",
        },
      ],
    },
    {
      title: "Moonlight neighbor",
      layout: "text",
      figures: [
        {
          place: "top",
          src: "/games/astronomy-space/assets/book/gen-as-m1-fig03-moon.png",
          caption: "Figure 3. The Moon changes how it looks as sunlight hits different faces.",
          alt: "Moon phases arc from crescent to full",
        },
      ],
      blocks: [
        {
          type: "p",
          text: "The Moon is Earth's close companion, not another planet of the Sun. Its changing shape is sunlight and shadow from our viewpoint - a reminder that space bodies move and light tells the story.",
        },
      ],
    },
    {
      title: "Find the balance",
      layout: "text",
      figures: [
        {
          place: "top",
          src: "/games/astronomy-space/assets/book/gen-as-m1-fig04-orbit.png",
          caption: "Figure 4. Earth travels a path around the Sun - an orbit.",
          alt: "Earth orbiting the Sun on a glowing path",
        },
      ],
      blocks: [
        {
          type: "p",
          text: "An orbit is a path around a heavier body. Earth does not sit still, and it does not fall straight into the Sun. It keeps circling on that path year after year.",
        },
      ],
    },
    {
      title: "Gravity keeps the family",
      layout: "full-fig",
      figures: [
        {
          place: "full",
          src: "/games/astronomy-space/assets/book/gen-as-m1-fig05-gravity.png",
          caption: "Figure 5. Gravity pulls inward; sideways motion carries Earth around.",
          alt: "Gravity pull and sideways motion balancing an orbit",
        },
      ],
      blocks: [
        {
          type: "p",
          text: "What keeps Earth from flying off or falling in? A balance: the Sun's gravity pulls inward while Earth's sideways motion carries it around. Same gravity that keeps your feet on the ground holds the solar family together.",
        },
        {
          type: "ul",
          items: [
            "Pull in: gravity toward the Sun.",
            "Carry around: sideways motion.",
            "Together: a stable orbit.",
          ],
        },
      ],
    },
    {
      title: "Rocky vs giants",
      layout: "text",
      figures: [
        {
          place: "top",
          src: "/games/astronomy-space/assets/book/gen-as-m1-fig06-rocky.png",
          caption: "Figure 6. Four small rocky worlds near the Sun; four giants farther out.",
          alt: "Rocky planets near Sun versus distant giant planets",
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Terrestrial planets are rocky and closer in. Gas and ice giants are huge and farther out. Sorting the family this way is clearer than memorizing random facts.",
        },
      ],
    },
    {
      title: "In order from the Sun",
      layout: "text",
      figures: [
        {
          place: "top",
          src: "/games/astronomy-space/assets/book/gen-as-m1-fig07-order.png",
          caption: "Figure 7. Eight planets in order: the family portrait from closest to farthest.",
          alt: "Eight planets lined in order from the Sun",
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Name the eight in order from the Sun and you can place any family photo. Closest rocky worlds first, then the giants. Order is a map, not a poem to forget.",
        },
      ],
    },
    {
      title: "Walk the scale",
      layout: "text",
      figures: [
        {
          place: "top",
          src: "/games/astronomy-space/assets/book/gen-as-m1-fig08-scale.png",
          caption: "Figure 8. Earth looks tiny beside Jupiter and tiny again beside the Sun.",
          alt: "Size comparison of Earth Jupiter and Sun",
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Scale surprises almost everyone. Earth is huge to us and small in the family. Giants dwarf the rocky worlds; the Sun dwarfs them all. Walking a scaled model in the mission makes that feeling stick.",
        },
      ],
    },
    {
      title: "Why Earth fits",
      layout: "text",
      figures: [
        {
          place: "top",
          src: "/games/astronomy-space/assets/book/gen-as-m1-fig09-habitable.png",
          caption: "Figure 9. The habitable zone is the Goldilocks band where liquid water can last.",
          alt: "Earth in the Sun habitable zone ring",
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Earth's place in the habitable zone matters: not too hot, not too cold for liquid water as we know life needs it. Exploration of Mars and beyond asks how rare that sweet spot is.",
        },
        {
          type: "ul",
          items: [
            "Too close: often too hot.",
            "Too far: often too cold.",
            "In the zone: a chance for liquid water.",
          ],
        },
      ],
    },
    {
      title: "Mastery",
      layout: "text",
      figures: [
        {
          place: "top",
          src: "/games/astronomy-space/assets/book/gen-as-m1-fig10-close.png",
          caption: "Figure 10. Teach the solar family: gravity, types, order, and home.",
          alt: "Full solar family mastery overview",
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Teach a friend in one minute: gravity plus sideways motion makes orbits; four rocky and four giant planets; name them in order; Earth's habitable-zone place helps life as we know it.",
        },
        {
          type: "ul",
          items: [
            "Explain the orbit balance once.",
            "Sort rocky versus giants once.",
            "Use the words orbit and habitable zone correctly once.",
          ],
        },
      ],
    },
  ],
};

export default BOOK;
