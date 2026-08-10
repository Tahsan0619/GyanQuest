/**
 * Digital book - Backend Builder Mission 1: Server Requests
 * Unique curriculum book (client, server, routes, JSON). Not a template fill-in.
 */
export const BOOK = {
  missionIndex: 0,
  title: "Server Requests",
  subtitle: "what happens after you hit Send",
  subject: "Backend Builder / Server Requests",
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
    title: "Server Requests",
    art: "/games/backend-builder/assets/book/m1-cover.jpg",
  },
  glossary: [
    { id: "server", term: "server" },
    { id: "client", term: "client" },
    { id: "request", term: "request" },
    { id: "response", term: "response" },
    { id: "route", term: "route" },
    { id: "json", term: "JSON" },
    { id: "status-code", term: "status code" },
  ],
  pages: [
    {
      title: "Two roles",
      layout: "text",
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/backend-builder/assets/book/m1-cover.jpg",
              caption: "Figure 1. Servers wait for work - racks of machines answering many clients.",
              alt: "Server rack",
            },
            {
              src: "/games/backend-builder/assets/book/m1-route.jpg",
              caption: "Your browser is a client sending a request across the network.",
              alt: "Browser to server request",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "A client asks. A server answers. That pair is the heart of backend work.",
        },
        {
          type: "p",
          text: "A request carries a method and a path. A response carries a status code and a body.",
        },
      ],
    },
    {
      title: "Routes are doors",
      layout: "full-fig",
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/backend-builder/assets/book/m1-api.jpg",
              caption: "Figure 2. An API exposes routes - named doors that accept certain requests.",
              alt: "API request response diagram",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "A route maps a URL path (and method) to code that runs on the server.",
        },
        {
          type: "ul",
          items: [
            "GET often reads data",
            "POST often creates or submits data",
            "Wrong door or method → error status code",
          ],
        },
      ],
    },
    {
      title: "JSON bodies",
      layout: "text",
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/backend-builder/assets/book/m1-json.jpg",
              caption: "Figure 3. JSON is a text format for structured data - keys and values browsers and servers both understand.",
              alt: "JSON data example",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Many APIs speak JSON in the response body so apps can parse fields reliably.",
        },
        {
          type: "p",
          text: "Status codes tell the short story: 200-ish success, 400-ish client mistake, 500-ish server trouble.",
        },
      ],
    },
    {
      title: "Follow one call",
      layout: "full-fig",
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/backend-builder/assets/book/m1-server.jpg",
              caption: "Figure 4. Server code receives the request, runs the route handler, returns a response.",
              alt: "Server code terminal",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Backend builders write those handlers: validate input, talk to storage, shape JSON, set the status code.",
        },
      ],
    },
    {
      title: "How the mission connects",
      layout: "text",
      blocks: [
        {
          type: "p",
          text: "Meet client/server → hit a route → read JSON → lab errors → explain → rule → stretch → myth → fluency → mastery.",
        },
        {
          type: "ul",
          items: [
            "Calling a real route makes request/response concrete",
            "Reading status codes prevents 'it just broke' thinking",
            "The rule sentence is 'ask a door, get a coded answer'",
          ],
        },
      ],
    },
    {
      title: "Route lab",
      layout: "split",
      figures: [
        {
          place: "right",
          slides: [
            {
              src: "/games/backend-builder/assets/book/m1-route.jpg",
              caption: "Write the path you call.",
              alt: "Route path",
            },
            {
              src: "/games/backend-builder/assets/book/m1-json.jpg",
              caption: "Read the JSON fields.",
              alt: "JSON body",
            },
            {
              src: "/games/backend-builder/assets/book/m1-api.jpg",
              caption: "Note the status code.",
              alt: "API status",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Trace one login or search action: client request, route, server work, JSON response, status code.",
        },
        {
          type: "ul",
          items: [
            "What path was the route?",
            "Was the body JSON?",
            "What would a 404 mean here?",
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
          text: "Myth: The frontend is the whole app. Better: without a server route, many apps cannot load real data.",
        },
        {
          type: "p",
          text: "Myth: Any text response is fine forever. Better: JSON contracts let clients parse safely.",
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
              src: "/games/backend-builder/assets/book/m1-cover.jpg",
              caption: "Figure 5. Teach backends as servers answering routed requests with status + body.",
              alt: "Backend mastery anchor",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Teach a friend in one minute: clients send requests; servers expose routes; responses carry status codes and often JSON.",
        },
        {
          type: "ul",
          items: [
            "Define route in one sentence",
            "Name one success and one error status code",
            "Use the word client correctly once",
          ],
        },
      ],
    },
  ],
};

export default BOOK;
