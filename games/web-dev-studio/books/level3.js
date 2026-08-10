/**
 * Digital book - Web Dev Studio Mission 3: JavaScript Actions
 * Unique curriculum book (events, DOM, interactivity). Not a template fill-in.
 */
export const BOOK = {
  missionIndex: 2,
  title: "JavaScript Actions",
  subtitle: "make the page respond to people",
  subject: "Web Dev Studio / JavaScript Actions",
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
    title: "JavaScript Actions",
    art: "/games/web-dev-studio/assets/book/m3-cover.jpg",
  },
  glossary: [
    { id: "javascript", term: "JavaScript" },
    { id: "dom", term: "DOM" },
    { id: "event", term: "event" },
    { id: "listener", term: "listener" },
    { id: "function", term: "function" },
    { id: "variable", term: "variable" },
    { id: "state", term: "state" },
  ],
  pages: [
    {
      title: "Behavior layer",
      layout: "text",
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/web-dev-studio/assets/book/m3-cover.jpg",
              caption: "Figure 1. JavaScript adds behavior - clicks, typing, timers, live updates.",
              alt: "JavaScript code on laptop",
            },
            {
              src: "/games/web-dev-studio/assets/book/m3-interactive.jpg",
              caption: "Buttons and inputs only feel alive when scripts handle events.",
              alt: "Interactive UI controls",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "HTML structures, CSS styles, JavaScript decides what happens when a user acts.",
        },
        {
          type: "p",
          text: "A function is a named set of steps you can run when needed. A variable remembers a value while the page runs.",
        },
      ],
    },
    {
      title: "The DOM map",
      layout: "full-fig",
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/web-dev-studio/assets/book/m3-dom.jpg",
              caption: "Figure 2. The DOM is the browser's live tree of elements your script can read and change.",
              alt: "DOM tree diagram",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "When you change text or classes in the DOM, the page updates without a full rewrite of the HTML file.",
        },
        {
          type: "ul",
          items: [
            "Select a node (query by id or selector)",
            "Read or write its content and classes",
            "Keep state in variables when needed",
          ],
        },
      ],
    },
    {
      title: "Events and listeners",
      layout: "text",
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/web-dev-studio/assets/book/m3-event.jpg",
              caption: "Figure 3. A click is an event - a moment your listener can answer.",
              alt: "Mouse click interaction",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "An event is something that happened (click, keydown, submit). A listener is the function you attach to handle it.",
        },
        {
          type: "p",
          text: "State is the current situation - score, open/closed menu, selected tab - that your functions update over time.",
        },
      ],
    },
    {
      title: "Small scripts win",
      layout: "full-fig",
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/web-dev-studio/assets/book/m3-script.jpg",
              caption: "Figure 4. Start with tiny scripts you can read aloud - then grow.",
              alt: "Programming console or editor",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "One clear listener that toggles a class beats a giant script you cannot explain.",
        },
      ],
    },
    {
      title: "How the mission connects",
      layout: "text",
      blocks: [
        {
          type: "p",
          text: "Meet JS → select DOM nodes → wire events → lab widget → explain → rule → stretch → myth → fluency → mastery.",
        },
        {
          type: "ul",
          items: [
            "Wiring one button proves the event loop idea",
            "Updating the DOM shows behavior vs reload",
            "The rule sentence is 'listen, then change state'",
          ],
        },
      ],
    },
    {
      title: "Widget lab",
      layout: "split",
      figures: [
        {
          place: "right",
          slides: [
            {
              src: "/games/web-dev-studio/assets/book/m3-interactive.jpg",
              caption: "Pick one control to animate.",
              alt: "UI control",
            },
            {
              src: "/games/web-dev-studio/assets/book/m3-event.jpg",
              caption: "Attach a click listener.",
              alt: "Event",
            },
            {
              src: "/games/web-dev-studio/assets/book/m3-dom.jpg",
              caption: "Update a DOM node.",
              alt: "DOM update",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Build a counter: a button, a number on screen, a function that adds one to state and writes it into the DOM.",
        },
        {
          type: "ul",
          items: [
            "Where is the listener attached?",
            "Which variable holds state?",
            "What DOM text changes after each click?",
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
          text: "Myth: JavaScript is only for huge apps. Better: even one listener can make a page helpful.",
        },
        {
          type: "p",
          text: "Myth: Changing HTML files is the only way to update a page. Better: DOM updates change the live tree.",
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
              src: "/games/web-dev-studio/assets/book/m3-cover.jpg",
              caption: "Figure 5. Teach JS as events that change state and the DOM.",
              alt: "JavaScript mastery anchor",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Teach a friend in one minute: JavaScript listens for events; functions update state; the DOM shows the new result.",
        },
        {
          type: "ul",
          items: [
            "Name one event and one listener job",
            "Point to where state lives in your counter",
            "Use the word DOM correctly once",
          ],
        },
      ],
    },
  ],
};

export default BOOK;
