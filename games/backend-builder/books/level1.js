/**
 * Digital book - Backend Builder / Server Basics
 * Theory: cognitive load, dual coding, multimedia learning, constructivism,
 * conceptual change, spiral scaffold, retrieval practice.
 * Photos: local verified copies under /games/backend-builder/assets/book/ (see CREDITS-m1.json).
 */
export const BOOK = {
  missionIndex: 0,
  title: "Server Basics",
  subtitle: "request response",
  subject: "Backend Builder / Server Basics",
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
    title: "Server Basics",
    art: "/games/backend-builder/assets/book/m1-cover.jpg",
  },
  glossary: [
    { id: "client", term: "client" },
    { id: "server", term: "server" },
    { id: "request", term: "request" },
    { id: "response", term: "response" },
    { id: "status", term: "status" },
    { id: "http", term: "http" },
    { id: "browser", term: "browser" },
    { id: "api", term: "api" },
    { id: "endpoint", term: "endpoint" },
    { id: "error", term: "error" },
  ],
  pages: [
    {
      title: "Why Server Basics?",
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
              src: "/games/backend-builder/assets/book/m1-hook.jpg",
              caption: "Figure 1. Local machines ask; distant machines answer.",
              alt: "Computer",
            },
            {
              src: "/games/backend-builder/assets/book/m1-cover.jpg",
              caption: "Signals carry requests and responses across distance.",
              alt: "Satellite communication",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "A client asks. A server answers. Request goes in - response comes back with data and a status.",
        },
        {
          type: "p",
          text: "Phone weather apps, school portal pages, and shop checkouts all ride this ask/answer loop.",
        },
        {
          type: "p",
          text: "Everyday hook: opening weather on your phone sends a request; the cloud replies with today's forecast.",
        },
      ],
    },
    {
      title: "Client is not server",
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
              src: "/games/backend-builder/assets/book/m1-model.jpg",
              caption: "Figure 2. Earth-scale networks - your app still uses the same ask/answer idea.",
              alt: "Earth from space",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "The browser is usually the client. The server lives elsewhere and sends data - not just pretty colors (CSS handles look).",
        },
        {
          type: "ul",
          items: [
            "Request: what you ask for",
            "Response: status + body of data",
            "Useful apps wait for an answer or a clear error",
          ],
        },
      ],
    },
    {
      title: "Request dial",
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
              src: "/games/backend-builder/assets/book/m1-mechanism.jpg",
              caption: "Figure 3. Boards route signals - servers route responses.",
              alt: "Circuit board",
            },
            {
              src: "/games/backend-builder/assets/book/m1-lab.jpg",
              caption: "Test ask/answer like an experiment trial.",
              alt: "Experiment",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "In the lab you dialed request clarity until a sensible response returned.",
        },
        {
          type: "p",
          text: "Cake is not a valid HTTP response. Status codes and data are.",
        },
      ],
    },
    {
      title: "Status matters",
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
              src: "/games/backend-builder/assets/book/m1-mastery.jpg",
              caption: "Figure 4. Mission machines that talk in request/response loops.",
              alt: "ISS computer",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "A good response says whether the ask worked. Silent failure confuses users; clear status helps everyone.",
        },
        {
          type: "p",
          text: "Kids can learn: client asks, server answers.",
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
          text: "Meet servers -> dial requests -> sort client/server -> stronger lab -> why responses -> name the loop rule -> stretch apps -> myths -> fluency -> mastery.",
        },
        {
          type: "ul",
          items: [
            "Sorting kills the myth that the browser is the server",
            "Labs show request then response",
            "Rule: client asks; server answers",
          ],
        },
      ],
    },
    {
      title: "Street lab: weather ask",
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
              src: "/games/backend-builder/assets/book/m1-cover.jpg",
              caption: "Carry the ask.",
              alt: "Satellite",
            },
            {
              src: "/games/backend-builder/assets/book/m1-model.jpg",
              caption: "Big network.",
              alt: "Earth",
            },
            {
              src: "/games/backend-builder/assets/book/m1-hook.jpg",
              caption: "Client machine.",
              alt: "Computer",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Open a weather app with a grown-up. Say out loud: request sent, response received, data shown.",
        },
        {
          type: "ul",
          items: [
            "Name client and server in that story",
            "Guess what a failed response might look like",
            "Flip carousel: dish vs earth-scale net",
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
          text: "Myth: the browser is the server. Better: browser is the client - server answers elsewhere.",
        },
        {
          type: "p",
          text: "Myth: a request never needs a response. Better: useful apps wait for a response (or a clear error).",
        },
        {
          type: "p",
          text: "Myth: cake is a valid HTTP response. Better: responses are status and data - not snacks.",
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
              src: "/games/backend-builder/assets/book/m1-mastery.jpg",
              caption: "Figure 5. Talking machines - your server goal.",
              alt: "ISS computer anchor",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Teach a friend with a shop checkout: client sends order request; server responds with confirmation or error.",
        },
        {
          type: "ul",
          items: [
            "Draw arrows: client -> server -> client",
            "Name one piece of data in a response",
            "Use the word request correctly once",
          ],
        },
      ],
    },
  ],
};

export default BOOK;
