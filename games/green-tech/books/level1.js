/**
 * Digital book - Green Tech Mission 1: Clean Energy
 * Theory: cognitive load, dual coding, multimedia learning, constructivism,
 * conceptual change, spiral scaffold, retrieval practice.
 * Photos: assets/book-shared eco / electrical themes (see assets/book/CREDITS-m1.json).
 */
export const BOOK = {
  missionIndex: 0,
  title: "Clean Energy",
  subtitle: "solar wind",
  subject: "Green Tech / Clean Energy",
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
    title: "Clean Energy",
    art: "/games/green-tech/assets/book/m1-cover.jpg",
  },
  glossary: [
    { id: "solar", term: "solar" },
    { id: "wind", term: "wind" },
    { id: "renewable", term: "renewable" },
    { id: "panel", term: "panel" },
    { id: "turbine", term: "turbine" },
    { id: "fuel", term: "fuel" },
    { id: "emission", term: "emission" },
    { id: "grid", term: "grid" },
  ],
  pages: [
    {
      title: "Power without the smoke stack",
      layout: "text",
      theory: ["constructivism", "dual-coding", "cognitive-load"],
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/green-tech/assets/book/m1-cover.jpg",
              caption: "Figure 1. Solar panels catch sunlight and turn it into electric current.",
              alt: "Solar panel array",
            },
            {
              src: "/games/green-tech/assets/book/m1-hook.jpg",
              caption: "Earth's thin blue edge - the atmosphere we share with every power choice.",
              alt: "Earth atmosphere from space",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Sun and wind can power homes without smoke from burning fuel. That is the clean energy promise behind solar and wind.",
        },
        {
          type: "p",
          text: "Rooftop solar, a wind turbine in open land, and a solar lamp in a night market are three faces of the same idea.",
        },
        {
          type: "p",
          text: "Burning fuel still runs many places. Clean sources cut local smoke and long-term emissions when they replace that burn.",
        },
      ],
    },
    {
      title: "Forests and oceans watch us",
      layout: "full-fig",
      theory: ["multimedia-learning", "dual-coding"],
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/green-tech/assets/book/m1-model.jpg",
              caption: "Figure 2. Living landscapes depend on the air and climate our energy choices shape.",
              alt: "Forest seen from space",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Solar panels convert light. Wind turbines convert moving air. Neither needs a continuous fuel truck once built and maintained.",
        },
        {
          type: "ul",
          items: [
            "Solar: best with clear sun on the panel face",
            "Wind: needs steady moving air across blades",
            "Both: weather varies, so storage and grids matter",
          ],
        },
      ],
    },
    {
      title: "Why clean helps",
      layout: "text",
      theory: ["cognitive-load", "dual-coding"],
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/green-tech/assets/book/m1-mechanism.jpg",
              caption: "Figure 3. Oceans and air trade heat - energy systems sit inside this planetary engine.",
              alt: "Ocean from space",
            },
            {
              src: "/games/green-tech/assets/book/m1-detail.jpg",
              caption: "The Sun is the upstream battery for solar power.",
              alt: "Solar system with Sun",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Clean here means the running step does not burn fuel on site. Building panels and turbines still uses materials - honesty includes that.",
        },
        {
          type: "p",
          text: "For learners, the key contrast is smoke-making burn versus sun-and-wind capture.",
        },
      ],
    },
    {
      title: "Heat we already know",
      layout: "full-fig",
      theory: ["multimedia-learning", "spiral-scaffold"],
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/green-tech/assets/book/m1-transfer.jpg",
              caption: "Figure 4. Boiling water is burn-or-resist heat at kitchen scale - power plants can do similar with fuel smoke.",
              alt: "Boiling water",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "A kettle shows energy becoming heat. A solar lamp shows energy becoming light without a fuel flame at the point of use.",
        },
      ],
    },
    {
      title: "Clean Champ path",
      layout: "text",
      theory: ["spiral-scaffold", "cognitive-load"],
      blocks: [
        {
          type: "p",
          text: "You met clean power, dialed sources, sorted energy types, grew the clean share in a lab, and named why clean helps.",
        },
        {
          type: "ul",
          items: [
            "Sort: solar/wind vs burn-on-site fuels",
            "Lab: more clean share, less smoke story",
            "Rule: sun and wind can power without burning fuel",
          ],
        },
        {
          type: "p",
          text: "Mission bites stayed small. This book keeps the energy contrast clear.",
        },
      ],
    },
    {
      title: "Roof, turbine, lamp",
      layout: "split",
      theory: ["constructivism", "dual-coding", "retrieval-practice"],
      figures: [
        {
          place: "right",
          slides: [
            {
              src: "/games/green-tech/assets/book/m1-cover.jpg",
              caption: "Rooftop solar - light in, electricity out.",
              alt: "Solar panels",
            },
            {
              src: "/games/green-tech/assets/book/m1-hook.jpg",
              caption: "Shared atmosphere - why cleaner running matters.",
              alt: "Earth atmosphere",
            },
            {
              src: "/games/green-tech/assets/book/m1-detail.jpg",
              caption: "Sun as source - solar lamps borrow this flood of light.",
              alt: "Sun in solar system",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Find or imagine rooftop solar, a turbine photo, and a solar lamp. For each, name the input (light or wind) and the useful output.",
        },
        {
          type: "ul",
          items: [
            "What is captured?",
            "What is not burned on site?",
            "When would weather slow the system?",
          ],
        },
      ],
    },
    {
      title: "Clean energy myths",
      layout: "text",
      theory: ["conceptual-change"],
      blocks: [
        {
          type: "p",
          text: "Myth: Solar works only in deserts. Better: panels work wherever light hits; brighter sites produce more.",
        },
        {
          type: "p",
          text: "Myth: Wind power means the air will run out. Better: wind is moving air driven by heating differences; turbines sample it, they do not empty the sky.",
        },
        {
          type: "p",
          text: "Myth: Clean means zero impact forever. Better: clean running avoids burn smoke; manufacturing and land use still need care.",
        },
        {
          type: "p",
          text: "Red glossary words like solar or renewable invite tutor questions.",
        },
      ],
    },
    {
      title: "Clean Champ mastery",
      layout: "text",
      theory: ["retrieval-practice", "spiral-scaffold"],
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/green-tech/assets/book/m1-cover.jpg",
              caption: "Figure 5. Teach solar and wind with one panel picture.",
              alt: "Solar panel teaching anchor",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Teach in one minute: solar and wind capture natural flows instead of burning fuel on site; roofs and lamps make the idea local.",
        },
        {
          type: "ul",
          items: [
            "Contrast a solar lamp with a kerosene flame story",
            "Name one weather limit",
            "Use the word renewable correctly once",
          ],
        },
      ],
    },
  ],
};

export default BOOK;
