/**
 * Digital book - Web Dev Studio / JS Click
 * Theory: cognitive load, dual coding, multimedia learning, constructivism,
 * conceptual change, spiral scaffold, retrieval practice.
 * Photos: local verified copies under /games/web-dev-studio/assets/book/ (see CREDITS-m3.json).
 */
export const BOOK = {
  missionIndex: 2,
  title: "JS Click",
  subtitle: "interaction",
  subject: "Web Dev Studio / JS Click",
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
    title: "JS Click",
    art: "/games/web-dev-studio/assets/book/m3-cover.jpg",
  },
  glossary: [
    { id: "javascript", term: "javascript" },
    { id: "event", term: "event" },
    { id: "click", term: "click" },
    { id: "handler", term: "handler" },
    { id: "listener", term: "listener" },
    { id: "function", term: "function" },
    { id: "button", term: "button" },
    { id: "interaction", term: "interaction" },
    { id: "dom", term: "dom" },
    { id: "feedback", term: "feedback" },
  ],
  pages: [
    {
      title: "Why JS Click?",
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
              src: "/games/web-dev-studio/assets/book/m3-hook.jpg",
              caption: "Figure 1. Arms move when a signal arrives - pages change when an event fires.",
              alt: "Robotic arm",
            },
            {
              src: "/games/web-dev-studio/assets/book/m3-cover.jpg",
              caption: "Interactive systems live where software meets controls.",
              alt: "ISS computer",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "A click is an event. JavaScript runs code that changes the page - Start buttons, quiz taps, and ticket kiosks wake up.",
        },
        {
          type: "p",
          text: "HTML alone is a still house. CSS dresses it. JS makes doors open when you knock.",
        },
        {
          type: "p",
          text: "Everyday hook: a BD ticket kiosk that lights a seat after a tap is event then change.",
        },
      ],
    },
    {
      title: "Event then change",
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
              src: "/games/web-dev-studio/assets/book/m3-model.jpg",
              caption: "Figure 2. A chip waits for signals - JS waits for events.",
              alt: "Computer chip",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Listen for an event (click/tap). Run a small clear change (show text, toggle a class, count a score).",
        },
        {
          type: "ul",
          items: [
            "One click can do one clear job",
            "Forms and quizzes use the same idea as games",
            "No event means the page stays still",
          ],
        },
      ],
    },
    {
      title: "Interaction dial",
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
              src: "/games/web-dev-studio/assets/book/m3-mechanism.jpg",
              caption: "Figure 3. Signals travel - clicks travel from finger to code.",
              alt: "Satellite communication",
            },
            {
              src: "/games/web-dev-studio/assets/book/m3-lab.jpg",
              caption: "Test each click path like an experiment trial.",
              alt: "Experiment",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "In the lab you raised interaction until the button felt alive. Alive means: event hooked, change visible, feedback clear.",
        },
        {
          type: "p",
          text: "Keep handlers small. Giant mystery scripts are hard to debug and hard to teach.",
        },
      ],
    },
    {
      title: "Buttons with jobs",
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
              src: "/games/web-dev-studio/assets/book/m3-mastery.jpg",
              caption: "Figure 4. Ordered boards still need a trigger path - so do interactive pages.",
              alt: "Circuit board",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Game Start, quiz A/B/C, and kiosk Confirm each map to an event plus a change.",
        },
        {
          type: "p",
          text: "Name the job before you write the code: what should the user see after the tap?",
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
          text: "Meet click -> dial interaction -> sort event jobs -> stronger lab -> why events -> name the click rule -> stretch kiosks -> myths -> fluency -> mastery.",
        },
        {
          type: "ul",
          items: [
            "Sorting shows HTML cannot react alone",
            "Labs prove event + change",
            "Rule: a click is an event; JS runs the change",
          ],
        },
      ],
    },
    {
      title: "Street lab: button hunt",
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
              src: "/games/web-dev-studio/assets/book/m3-hook.jpg",
              caption: "Motion after signal.",
              alt: "Arm",
            },
            {
              src: "/games/web-dev-studio/assets/book/m3-mechanism.jpg",
              caption: "Signal path.",
              alt: "Satellite",
            },
            {
              src: "/games/web-dev-studio/assets/book/m3-cover.jpg",
              caption: "Control surface.",
              alt: "Computer",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Find three tappable things today (app, site, kiosk). For each, say the event and the visible change.",
        },
        {
          type: "ul",
          items: [
            "Sketch event -> change as two boxes",
            "Invent a quiz button behavior in one sentence",
            "Flip carousel: arm motion vs signal path",
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
          text: "Myth: pages never need clicks. Better: many pages wake up when you click or tap.",
        },
        {
          type: "p",
          text: "Myth: HTML alone makes buttons react. Better: a reaction needs an event plus code.",
        },
        {
          type: "p",
          text: "Myth: JavaScript is only for games. Better: forms, quizzes, and switches use it too.",
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
              src: "/games/web-dev-studio/assets/book/m3-mastery.jpg",
              caption: "Figure 5. Trigger paths - your JS goal.",
              alt: "Circuit anchor",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Teach a friend: event then change. Keep each click's job small and visible.",
        },
        {
          type: "ul",
          items: [
            "Name one event besides click (e.g. tap, submit)",
            "Describe a before/after for a Start button",
            "Use the word handler correctly once",
          ],
        },
      ],
    },
  ],
};

export default BOOK;
