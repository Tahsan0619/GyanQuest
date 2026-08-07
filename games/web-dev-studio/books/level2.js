/**
 * Digital book - Web Dev Studio / CSS Style
 * Theory: cognitive load, dual coding, multimedia learning, constructivism,
 * conceptual change, spiral scaffold, retrieval practice.
 * Photos: local verified copies under /games/web-dev-studio/assets/book/ (see CREDITS-m2.json).
 */
export const BOOK = {
  missionIndex: 1,
  title: "CSS Style",
  subtitle: "look & layout",
  subject: "Web Dev Studio / CSS Style",
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
    title: "CSS Style",
    art: "/games/web-dev-studio/assets/book/m2-cover.jpg",
  },
  glossary: [
    { id: "css", term: "css" },
    { id: "stylesheet", term: "stylesheet" },
    { id: "selector", term: "selector" },
    { id: "color", term: "color" },
    { id: "margin", term: "margin" },
    { id: "padding", term: "padding" },
    { id: "contrast", term: "contrast" },
    { id: "layout", term: "layout" },
    { id: "font", term: "font" },
    { id: "spacing", term: "spacing" },
  ],
  pages: [
    {
      title: "Why CSS Style?",
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
              src: "/games/web-dev-studio/assets/book/m2-hook.jpg",
              caption: "Figure 1. Experiments tweak one variable - CSS tweaks look without breaking structure.",
              alt: "Experiment setup",
            },
            {
              src: "/games/web-dev-studio/assets/book/m2-cover.jpg",
              caption: "Chips are dense; good CSS keeps pages breathable.",
              alt: "Computer chip",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "HTML built the rooms. CSS paints them: color, size, and spacing so a page is clear to read from a phone or a wall screen.",
        },
        {
          type: "p",
          text: "School posters, shop product cards, and rickshaw ads all fail when text is tiny or colors fight.",
        },
        {
          type: "p",
          text: "Everyday hook: a market flyer that must read from far uses contrast and gap - the same ideas as CSS.",
        },
      ],
    },
    {
      title: "Look vs structure",
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
              src: "/games/web-dev-studio/assets/book/m2-model.jpg",
              caption: "Figure 2. Clear signals across distance - pages need the same clarity.",
              alt: "Satellite communication dish",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "HTML says what a heading is. CSS says how big, which color, and how much space around it.",
        },
        {
          type: "ul",
          items: [
            "A few clear colors beat a messy rainbow",
            "Readable size matters on phones",
            "Gap and margin guide the eye",
          ],
        },
      ],
    },
    {
      title: "Style dial",
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
              src: "/games/web-dev-studio/assets/book/m2-mechanism.jpg",
              caption: "Figure 3. Light is a design tool - contrast helps text pop.",
              alt: "Incandescent light bulb",
            },
            {
              src: "/games/web-dev-studio/assets/book/m2-lab.jpg",
              caption: "Try changes, then check readability.",
              alt: "Laboratory",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "In the lab you dialed style strength. Too little and the page looks raw; too much noise and nothing stands out.",
        },
        {
          type: "p",
          text: "Aim for hierarchy: one loud headline, quieter body text, steady spacing.",
        },
      ],
    },
    {
      title: "Layout that breathes",
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
              src: "/games/web-dev-studio/assets/book/m2-mastery.jpg",
              caption: "Figure 4. Ordered hardware still leaves pathways - leave pathways on your page.",
              alt: "Computer workstation",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Whitespace is not empty waste. It separates ideas so a shop card or notice can be scanned in a second.",
        },
        {
          type: "p",
          text: "CSS box ideas - margin, padding, border - are how you carve that air.",
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
          text: "Meet style -> dial look -> sort style jobs -> stronger layout lab -> why spacing -> name the style rule -> stretch posters -> myths -> fluency -> mastery.",
        },
        {
          type: "ul",
          items: [
            "Sorting separates structure jobs from look jobs",
            "Dial practice links contrast to readability",
            "Rule: CSS paints HTML rooms with color, size, and space",
          ],
        },
      ],
    },
    {
      title: "Street lab: poster audit",
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
              src: "/games/web-dev-studio/assets/book/m2-mechanism.jpg",
              caption: "Contrast tool.",
              alt: "Bulb",
            },
            {
              src: "/games/web-dev-studio/assets/book/m2-hook.jpg",
              caption: "Try and check.",
              alt: "Experiment",
            },
            {
              src: "/games/web-dev-studio/assets/book/m2-cover.jpg",
              caption: "Dense vs breathable.",
              alt: "Chip",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Pick a school poster or shop sign. Score contrast, text size, and spacing from 1 to 5.",
        },
        {
          type: "ul",
          items: [
            "Suggest one CSS-like fix (bigger type, more gap, fewer colors)",
            "Name what should stay HTML structure",
            "Flip carousel: bulb contrast vs chip density",
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
          text: "Myth: more colors always look better. Better: a few clear colors beat a messy rainbow.",
        },
        {
          type: "p",
          text: "Myth: CSS and HTML are the same job. Better: HTML structures; CSS styles the look.",
        },
        {
          type: "p",
          text: "Myth: spacing does not matter. Better: gap and margin guide the eye.",
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
              src: "/games/web-dev-studio/assets/book/m2-mastery.jpg",
              caption: "Figure 5. Clear pathways - your CSS goal.",
              alt: "Computer anchor",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Teach a friend: structure first, then paint with CSS - contrast, size, spacing.",
        },
        {
          type: "ul",
          items: [
            "Say one property you would change on a messy page",
            "Explain why tiny text fails on phones",
            "Use the word stylesheet correctly once",
          ],
        },
      ],
    },
  ],
};

export default BOOK;
