/**
 * Digital book - Web Dev Studio / HTML House
 * Theory: cognitive load, dual coding, multimedia learning, constructivism,
 * conceptual change, spiral scaffold, retrieval practice.
 * Photos: local verified copies under /games/web-dev-studio/assets/book/ (see CREDITS-m1.json).
 */
export const BOOK = {
  missionIndex: 0,
  title: "HTML House",
  subtitle: "structure tags",
  subject: "Web Dev Studio / HTML House",
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
    title: "HTML House",
    art: "/games/web-dev-studio/assets/book/m1-cover.jpg",
  },
  glossary: [
    { id: "html", term: "html" },
    { id: "head", term: "head" },
    { id: "body", term: "body" },
    { id: "tag", term: "tag" },
    { id: "element", term: "element" },
    { id: "nesting", term: "nesting" },
    { id: "markup", term: "markup" },
    { id: "browser", term: "browser" },
    { id: "structure", term: "structure" },
    { id: "attribute", term: "attribute" },
  ],
  pages: [
    {
      title: "Why HTML House?",
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
              src: "/games/web-dev-studio/assets/book/m1-hook.jpg",
              caption: "Figure 1. Learning spaces need clear rooms - pages need clear tags.",
              alt: "Education setting",
            },
            {
              src: "/games/web-dev-studio/assets/book/m1-cover.jpg",
              caption: "Computers render the house you describe with markup.",
              alt: "Computer workstation",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "A web page is a house. Tags are rooms: <html> wraps the building, <head> holds the blueprints, <body> holds what visitors see.",
        },
        {
          type: "p",
          text: "School notice pages, family photo blogs, and news headline blocks all start as nested tags - not as random text soup.",
        },
        {
          type: "p",
          text: "Everyday hook: a BD news site headline sits inside structured tags so browsers know what is title vs story.",
        },
      ],
    },
    {
      title: "Open and close",
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
              src: "/games/web-dev-studio/assets/book/m1-model.jpg",
              caption: "Figure 2. Complex systems still need a clear outer shell - like <html> around a page.",
              alt: "ISS computer systems",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Most tags come in pairs: open, content, close. Nesting order builds the house from outside in.",
        },
        {
          type: "ul",
          items: [
            "<html> wraps everything",
            "<head> stores title and meta",
            "<body> holds headings, paragraphs, and images you see",
          ],
        },
      ],
    },
    {
      title: "Structure dial",
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
              src: "/games/web-dev-studio/assets/book/m1-mechanism.jpg",
              caption: "Figure 3. Circuits are structured layers - pages are structured tags.",
              alt: "Circuit board",
            },
            {
              src: "/games/web-dev-studio/assets/book/m1-lab.jpg",
              caption: "Classroom pages and school notices share the same HTML bones.",
              alt: "Classroom science",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "In the mission you opened more rooms until the house felt complete. More clear tags beat one giant unlabeled pile.",
        },
        {
          type: "p",
          text: "Browsers and people both thank you for tidy nesting.",
        },
      ],
    },
    {
      title: "Sort the rooms",
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
              src: "/games/web-dev-studio/assets/book/m1-mastery.jpg",
              caption: "Figure 4. Chips pack ordered parts - HTML packs ordered elements.",
              alt: "Integrated circuit",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Headings, paragraphs, and images belong in the body. Titles and meta hints belong in the head.",
        },
        {
          type: "p",
          text: "CSS will paint later. First, get the walls right.",
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
          text: "Meet the tag house -> open rooms -> sort structure -> build more rooms -> why nest -> name the house rule -> stretch real pages -> myths -> fluency -> mastery.",
        },
        {
          type: "ul",
          items: [
            "Sorting teaches head vs body jobs",
            "Nesting practice prevents broken houses",
            "Rule: tags structure the page like rooms in a house",
          ],
        },
      ],
    },
    {
      title: "Street lab: view source",
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
              src: "/games/web-dev-studio/assets/book/m1-lab.jpg",
              caption: "School-style page context.",
              alt: "Classroom",
            },
            {
              src: "/games/web-dev-studio/assets/book/m1-mechanism.jpg",
              caption: "Layered structure metaphor.",
              alt: "Circuit",
            },
            {
              src: "/games/web-dev-studio/assets/book/m1-cover.jpg",
              caption: "Where markup becomes a screen.",
              alt: "Computer",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "With a grown-up, peek at a simple school page. Find <html>, <head>, <body>, and one heading tag.",
        },
        {
          type: "ul",
          items: [
            "Sketch a three-room house labeled html / head / body",
            "Write one open and close pair by hand",
            "Flip photos: classroom page vs chip structure",
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
          text: "Myth: HTML is only for experts. Better: kids can learn core tags with clear labs.",
        },
        {
          type: "p",
          text: "Myth: tags can stay open forever. Better: most tags need a matching close tag.",
        },
        {
          type: "p",
          text: "Myth: CSS and HTML are the same. Better: HTML = structure; CSS = look.",
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
              src: "/games/web-dev-studio/assets/book/m1-mastery.jpg",
              caption: "Figure 5. Ordered parts - your HTML goal.",
              alt: "Chip anchor",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Teach a friend: a page is a house; tags are rooms; nest carefully; head holds meta, body holds what you see.",
        },
        {
          type: "ul",
          items: [
            "Name three tags and their jobs",
            "Draw nesting as boxes inside boxes",
            "Use the word element correctly once",
          ],
        },
      ],
    },
  ],
};

export default BOOK;
