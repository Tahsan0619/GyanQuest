/**
 * Digital book - Web Dev Studio Mission 1: HTML Foundations
 * Unique curriculum book (page structure with tags). Not a template fill-in.
 */
export const BOOK = {
  missionIndex: 0,
  title: "HTML Foundations",
  subtitle: "tags that build the skeleton of a page",
  subject: "Web Dev Studio / HTML Foundations",
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
    title: "HTML Foundations",
    art: "/games/web-dev-studio/assets/book/m1-cover.jpg",
  },
  glossary: [
    { id: "html", term: "HTML" },
    { id: "element", term: "element" },
    { id: "tag", term: "tag" },
    { id: "attribute", term: "attribute" },
    { id: "heading", term: "heading" },
    { id: "hyperlink", term: "hyperlink" },
    { id: "semantic", term: "semantic" },
  ],
  pages: [
    {
      title: "Skeleton first",
      layout: "text",
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/web-dev-studio/assets/book/m1-cover.jpg",
              caption: "Figure 1. HTML is the skeleton - structure before paint and motion.",
              alt: "HTML code on screen",
            },
            {
              src: "/games/web-dev-studio/assets/book/m1-structure.jpg",
              caption: "A wireframe is a plan for which elements go where.",
              alt: "Website wireframe",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "HTML means HyperText Markup Language. It marks meaning: this is a title, this is a paragraph, this is a link.",
        },
        {
          type: "p",
          text: "An element is usually an opening tag, content, and a closing tag. The browser turns that into a page.",
        },
        {
          type: "p",
          text: "Everyday hook: a news site still starts as headings, paragraphs, images, and hyperlinks in HTML.",
        },
      ],
    },
    {
      title: "Tags and attributes",
      layout: "full-fig",
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/web-dev-studio/assets/book/m1-tags.jpg",
              caption: "Figure 2. Tags name the element; attributes add extra facts like href or alt.",
              alt: "HTML tags in source",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "ul",
          items: [
            "Heading tags (h1-h6) show importance order",
            "Attribute examples: href on links, src and alt on images",
            "Nesting must stay tidy - close inner tags first",
          ],
        },
        {
          type: "p",
          text: "A hyperlink uses an anchor element with an href attribute so users can jump to another URL.",
        },
      ],
    },
    {
      title: "Semantic choices",
      layout: "text",
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/web-dev-studio/assets/book/m1-page.jpg",
              caption: "Figure 3. A clear page layout maps to semantic sections, not random div soup.",
              alt: "Simple webpage layout",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Semantic HTML picks tags for meaning - header, main, nav, article - so people and tools understand the page.",
        },
        {
          type: "p",
          text: "Pretty looks come later with CSS. Broken structure stays broken even with fancy colors.",
        },
      ],
    },
    {
      title: "Browser as builder",
      layout: "full-fig",
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/web-dev-studio/assets/book/m1-browser.jpg",
              caption: "Figure 4. The browser reads your HTML file and builds the visible page.",
              alt: "Web browser window",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Save the file, refresh the browser, check the result. That loop is how HTML skills grow.",
        },
      ],
    },
    {
      title: "How the mission connects",
      layout: "text",
      blocks: [
        {
          type: "p",
          text: "Meet tags → build headings → add links/images → lab page → explain → rule → stretch → myth → fluency → mastery.",
        },
        {
          type: "ul",
          items: [
            "Building a real mini-page beats memorizing tag lists",
            "Attributes show that tags take options",
            "The rule sentence is 'structure carries meaning'",
          ],
        },
      ],
    },
    {
      title: "Page lab",
      layout: "split",
      figures: [
        {
          place: "right",
          slides: [
            {
              src: "/games/web-dev-studio/assets/book/m1-structure.jpg",
              caption: "Sketch sections first.",
              alt: "Wireframe",
            },
            {
              src: "/games/web-dev-studio/assets/book/m1-tags.jpg",
              caption: "Choose tags on purpose.",
              alt: "Tags",
            },
            {
              src: "/games/web-dev-studio/assets/book/m1-browser.jpg",
              caption: "Check in the browser.",
              alt: "Browser check",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Build a one-screen 'About me' page: one h1, two paragraphs, one image with alt, one hyperlink.",
        },
        {
          type: "ul",
          items: [
            "Is your top title a heading element?",
            "Does every image have alt text?",
            "Which attribute makes the link work?",
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
          text: "Myth: Bigger bold text is the same as a heading. Better: heading tags create structure; bold alone is style.",
        },
        {
          type: "p",
          text: "Myth: HTML is outdated because apps look fancy. Better: almost every web UI still rests on HTML elements.",
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
              src: "/games/web-dev-studio/assets/book/m1-page.jpg",
              caption: "Figure 5. Teach HTML as meaningful structure the browser can build.",
              alt: "HTML mastery anchor",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Teach a friend in one minute: HTML elements use tags; attributes add details; semantic choices make pages clearer.",
        },
        {
          type: "ul",
          items: [
            "Write one element with open and close tags",
            "Name one attribute you used",
            "Use the word semantic correctly once",
          ],
        },
      ],
    },
  ],
};

export default BOOK;
