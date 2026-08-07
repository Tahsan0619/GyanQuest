/**
 * Digital book - Backend Builder / Auth Lite
 * Theory: cognitive load, dual coding, multimedia learning, constructivism,
 * conceptual change, spiral scaffold, retrieval practice.
 * Photos: local verified copies under /games/backend-builder/assets/book/ (see CREDITS-m3.json).
 */
export const BOOK = {
  missionIndex: 2,
  title: "Auth Lite",
  subtitle: "who are you",
  subject: "Backend Builder / Auth Lite",
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
    title: "Auth Lite",
    art: "/games/backend-builder/assets/book/m3-cover.jpg",
  },
  glossary: [
    { id: "auth", term: "auth" },
    { id: "login", term: "login" },
    { id: "password", term: "password" },
    { id: "session", term: "session" },
    { id: "logout", term: "logout" },
    { id: "token", term: "token" },
    { id: "public", term: "public" },
    { id: "private", term: "private" },
    { id: "identity", term: "identity" },
    { id: "permission", term: "permission" },
  ],
  pages: [
    {
      title: "Why Auth Lite?",
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
              src: "/games/backend-builder/assets/book/m3-hook.jpg",
              caption: "Figure 1. Autonomous systems still gate actions on permission checks.",
              alt: "Autonomous system",
            },
            {
              src: "/games/backend-builder/assets/book/m3-cover.jpg",
              caption: "Labs lock cabinets - apps lock private data.",
              alt: "Laboratory",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Login checks identity before private rooms open. Public pages can stay open.",
        },
        {
          type: "p",
          text: "School grades portals, bank app PINs, and family photo clouds all separate public from private.",
        },
        {
          type: "p",
          text: "Everyday hook: anyone may see a school homepage; only you should see your grades after login.",
        },
      ],
    },
    {
      title: "Public vs private",
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
              src: "/games/backend-builder/assets/book/m3-model.png",
              caption: "Figure 2. Identity metaphors start in the brain - auth is a digital ID check.",
              alt: "Human brain",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Public pages do not need your password. Private rooms need proof of who you are.",
        },
        {
          type: "ul",
          items: [
            "Auth is not only for banks",
            "Passwords stay private - never share",
            "Logout ends the session so others cannot peek",
          ],
        },
      ],
    },
    {
      title: "Auth dial",
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
              src: "/games/backend-builder/assets/book/m3-mechanism.jpg",
              caption: "Figure 3. Machines that ask who you are before serving private data.",
              alt: "Computer",
            },
            {
              src: "/games/backend-builder/assets/book/m3-lab.jpg",
              caption: "Write public vs private lists in a notebook first.",
              alt: "Notebook",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "In the lab you dialed gate strength until private doors stayed shut without login.",
        },
        {
          type: "p",
          text: "Socks are not login tokens. Tokens are digital proofs.",
        },
      ],
    },
    {
      title: "Session sense",
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
              src: "/games/backend-builder/assets/book/m3-mastery.jpg",
              caption: "Figure 4. Guarded systems - auth is the gate.",
              alt: "Robot gate metaphor",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "After login, a session remembers you for a while. Logout clears that memory on purpose.",
        },
        {
          type: "p",
          text: "Sharing a password shares your private rooms - do not.",
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
          text: "Meet auth -> dial gates -> sort public/private -> stronger lab -> why logout -> name the auth rule -> stretch portals -> myths -> fluency -> mastery.",
        },
        {
          type: "ul",
          items: [
            "Sorting teaches what stays public",
            "Labs prove login opens private rooms",
            "Rule: prove who you are before private data",
          ],
        },
      ],
    },
    {
      title: "Street lab: grades gate",
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
              src: "/games/backend-builder/assets/book/m3-cover.jpg",
              caption: "Locked bench.",
              alt: "Lab",
            },
            {
              src: "/games/backend-builder/assets/book/m3-mastery.jpg",
              caption: "Guarded system.",
              alt: "Robot",
            },
            {
              src: "/games/backend-builder/assets/book/m3-lab.jpg",
              caption: "Plan the rules.",
              alt: "Notebook",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "List three public school-site things and three private things that need login.",
        },
        {
          type: "ul",
          items: [
            "Explain why logout matters on a shared computer",
            "Invent a safe password rule (length, not sharing)",
            "Flip carousel: lab lock vs robot gate",
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
          text: "Myth: public pages need your password. Better: public pages can open without login.",
        },
        {
          type: "p",
          text: "Myth: sharing your password is fine. Better: passwords stay private - never share.",
        },
        {
          type: "p",
          text: "Myth: socks are login tokens. Better: tokens are digital proofs - not clothing.",
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
              src: "/games/backend-builder/assets/book/m3-mastery.jpg",
              caption: "Figure 5. Gatekeeping - your auth goal.",
              alt: "Robot anchor",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Teach a friend: public stays open; private needs identity proof; logout closes the session.",
        },
        {
          type: "ul",
          items: [
            "Name one public and one private page",
            "Say why PIN/password secrecy matters",
            "Use the word session correctly once",
          ],
        },
      ],
    },
  ],
};

export default BOOK;
