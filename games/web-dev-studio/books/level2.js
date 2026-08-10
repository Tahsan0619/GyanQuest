/**
 * Digital book - Web Dev Studio Mission 2: CSS Style Lab
 * Unique curriculum book (selectors, box model, layout). Not a template fill-in.
 */
export const BOOK = {
  missionIndex: 1,
  title: "CSS Style Lab",
  subtitle: "paint and spacing without breaking structure",
  subject: "Web Dev Studio / CSS Style Lab",
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
    title: "CSS Style Lab",
    art: "/games/web-dev-studio/assets/book/m2-cover.jpg",
  },
  glossary: [
    { id: "css", term: "CSS" },
    { id: "selector", term: "selector" },
    { id: "declaration", term: "declaration" },
    { id: "box-model", term: "box model" },
    { id: "margin", term: "margin" },
    { id: "flexbox", term: "flexbox" },
    { id: "responsive", term: "responsive" },
  ],
  pages: [
    {
      title: "Style is a separate layer",
      layout: "text",
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/web-dev-studio/assets/book/m2-cover.jpg",
              caption: "Figure 1. CSS files describe look and layout while HTML keeps meaning.",
              alt: "CSS code",
            },
            {
              src: "/games/web-dev-studio/assets/book/m2-color.jpg",
              caption: "Color and type choices are declarations applied through selectors.",
              alt: "Color palette swatches",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "CSS means Cascading Style Sheets. A selector targets elements; a declaration sets a property and value.",
        },
        {
          type: "p",
          text: "Everyday hook: the same article HTML can look like a newspaper or a neon poster with different CSS.",
        },
      ],
    },
    {
      title: "The box model",
      layout: "full-fig",
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/web-dev-studio/assets/book/m2-box.jpg",
              caption: "Figure 2. Content, padding, border, then margin - the box model layers around every element.",
              alt: "CSS box model diagram",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "ul",
          items: [
            "Padding: space inside the border",
            "Margin: space outside the border",
            "Border: the edge you can color or hide",
          ],
        },
        {
          type: "p",
          text: "Most 'why is this too wide?' bugs are box model math, not mystery browsers.",
        },
      ],
    },
    {
      title: "Layout tools",
      layout: "text",
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/web-dev-studio/assets/book/m2-layout.jpg",
              caption: "Figure 3. Responsive layouts adapt across phone and desktop widths.",
              alt: "Responsive design on devices",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Flexbox lines up items in a row or column and controls wrapping, gaps, and alignment.",
        },
        {
          type: "p",
          text: "Responsive design means the page stays usable when the viewport shrinks - often with flexible units and media queries.",
        },
      ],
    },
    {
      title: "Cascade and conflict",
      layout: "full-fig",
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/web-dev-studio/assets/book/m2-style.jpg",
              caption: "Figure 4. When rules conflict, specificity and order decide the winner - that is the cascade.",
              alt: "Developer styling a page",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "More specific selectors beat general ones. Later rules can override earlier ones when specificity ties.",
        },
      ],
    },
    {
      title: "How the mission connects",
      layout: "text",
      blocks: [
        {
          type: "p",
          text: "Meet CSS → select elements → box practice → layout lab → explain → rule → stretch → myth → fluency → mastery.",
        },
        {
          type: "ul",
          items: [
            "Selector drills stop random inline styling",
            "Box labs make spacing visible",
            "Responsive checks prove layout is not one width only",
          ],
        },
      ],
    },
    {
      title: "Style lab",
      layout: "split",
      figures: [
        {
          place: "right",
          slides: [
            {
              src: "/games/web-dev-studio/assets/book/m2-color.jpg",
              caption: "Pick a small palette.",
              alt: "Palette",
            },
            {
              src: "/games/web-dev-studio/assets/book/m2-box.jpg",
              caption: "Tune padding and margin.",
              alt: "Box model",
            },
            {
              src: "/games/web-dev-studio/assets/book/m2-layout.jpg",
              caption: "Test a narrow width.",
              alt: "Responsive check",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Style a card: background, padding, margin, and a flexbox row for a title plus button. Shrink the window and fix overflow.",
        },
        {
          type: "ul",
          items: [
            "Which selector did you use?",
            "Is the gap margin or padding?",
            "What breaks first when narrow?",
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
          text: "Myth: Inline styles are fine forever. Better: they fight the cascade and make reuse painful.",
        },
        {
          type: "p",
          text: "Myth: Margin and padding are synonyms. Better: one is outside the border, one is inside.",
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
              src: "/games/web-dev-studio/assets/book/m2-cover.jpg",
              caption: "Figure 5. Teach CSS as selectors + declarations + honest box math.",
              alt: "CSS mastery anchor",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Teach a friend in one minute: CSS styles HTML; selectors target; the box model explains spacing; flexbox helps layout.",
        },
        {
          type: "ul",
          items: [
            "Write one selector with two declarations",
            "Point to margin vs padding on a sketch",
            "Use the word responsive correctly once",
          ],
        },
      ],
    },
  ],
};

export default BOOK;
