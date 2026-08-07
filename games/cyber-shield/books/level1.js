/**
 * Digital book - Cyber Shield Mission 1: Password Power
 * Theory: cognitive load, dual coding, multimedia learning, constructivism,
 * conceptual change, spiral scaffold, retrieval practice.
 * Photos: assets/book-shared computing theme (see assets/book/CREDITS-m1.json).
 */
export const BOOK = {
  missionIndex: 0,
  title: "Password Power",
  subtitle: "long unique secrets beat short easy ones",
  subject: "Cyber Shield / Password Power",
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
    title: "Password Power",
    art: "/games/cyber-shield/assets/book/m1-cover.jpg",
  },
  glossary: [
    { id: "password", term: "password" },
    { id: "unique", term: "unique" },
    { id: "length", term: "length" },
    { id: "guess", term: "guess" },
    { id: "secret", term: "secret" },
    { id: "reuse", term: "reuse" },
    { id: "login", term: "login" },
    { id: "strength", term: "strength" },
  ],
  pages: [
    {
      title: "Locks made of letters",
      layout: "text",
      theory: ["constructivism", "dual-coding", "cognitive-load"],
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/cyber-shield/assets/book/m1-cover.jpg",
              caption: "Figure 1. Accounts live on computers - your password is the first gate.",
              alt: "Computer workstation",
            },
            {
              src: "/games/cyber-shield/assets/book/m1-hook.jpg",
              caption: "Even mission machines need careful access control.",
              alt: "Computer systems used in a complex environment",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "A password is a secret you prove you know. Attackers do not need magic - they try common words, names, and short number runs.",
        },
        {
          type: "p",
          text: "Long unique secrets beat short easy ones. Length multiplies the guess space; uniqueness stops one leaked site from opening every other login.",
        },
        {
          type: "p",
          text: "School login, a game account, and family email are three doors. Reusing 1234 or your name is like one key for every lock in the house.",
        },
      ],
    },
    {
      title: "Why length hurts guessers",
      layout: "full-fig",
      theory: ["multimedia-learning", "dual-coding"],
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/cyber-shield/assets/book/m1-model.jpg",
              caption: "Figure 2. Tiny chip, huge number of bit patterns - passwords work the same way with characters.",
              alt: "Computer chip close-up",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Each extra character multiplies how many secrets are possible. Short passwords fall to quick trials; longer passphrases make guessing expensive.",
        },
        {
          type: "ul",
          items: [
            "name + birth year -> tiny guess list",
            "four random words or a long mixed string -> huge guess list",
            "same secret on five sites -> one leak opens five doors",
          ],
        },
      ],
    },
    {
      title: "Unique beats clever",
      layout: "text",
      theory: ["cognitive-load", "dual-coding"],
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/cyber-shield/assets/book/m1-mechanism.jpg",
              caption: "Figure 3. Boards and paths - separate circuits, separate risks.",
              alt: "Circuit board with many paths",
            },
            {
              src: "/games/cyber-shield/assets/book/m1-detail.jpg",
              caption: "Friction against attack: make guessing slow and reuse impossible.",
              alt: "Surface texture suggesting resistance",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "A fancy short password that you reuse is weaker than a long unique phrase you never share across sites.",
        },
        {
          type: "p",
          text: "Think separate circuits: school, games, and email should not share the same secret current.",
        },
      ],
    },
    {
      title: "Order in the secret",
      layout: "full-fig",
      theory: ["multimedia-learning", "spiral-scaffold"],
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/cyber-shield/assets/book/m1-transfer.jpg",
              caption: "Figure 4. Clear structure helps humans remember; random mush is hard for you and still short for attackers if it is tiny.",
              alt: "Ordered crystal structure",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Memorable length beats forgettable chaos. A passphrase you can recall safely is stronger than a four-digit pin written on a sticky note.",
        },
      ],
    },
    {
      title: "How Password Pro was trained",
      layout: "text",
      theory: ["spiral-scaffold", "cognitive-load"],
      blocks: [
        {
          type: "p",
          text: "You met passwords, watched a strength dial, sorted strong vs weak, built a stronger secret, then named why length helps.",
        },
        {
          type: "ul",
          items: [
            "Dial: feel strength jump as length grows",
            "Sort: weak patterns vs strong habits",
            "Lab: craft a longer unique secret",
            "Rule: long unique secrets beat short easy ones",
          ],
        },
        {
          type: "p",
          text: "The game kept each idea small. The book gathers the security spine.",
        },
      ],
    },
    {
      title: "Three-door practice",
      layout: "split",
      theory: ["constructivism", "dual-coding", "retrieval-practice"],
      figures: [
        {
          place: "right",
          slides: [
            {
              src: "/games/cyber-shield/assets/book/m1-cover.jpg",
              caption: "School login - treat it as a real gate.",
              alt: "Computer for school work",
            },
            {
              src: "/games/cyber-shield/assets/book/m1-hook.jpg",
              caption: "Game account - do not recycle the school secret.",
              alt: "Protected computer systems",
            },
            {
              src: "/games/cyber-shield/assets/book/m1-mechanism.jpg",
              caption: "Family email - a third unique secret.",
              alt: "Circuit paths as separate channels",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Without writing the real secrets here, plan three different long passwords for school, games, and email.",
        },
        {
          type: "ul",
          items: [
            "Which old habit is shortest and easiest to guess?",
            "Where were you reusing one secret?",
            "What length target will you keep?",
          ],
        },
      ],
    },
    {
      title: "Password myths",
      layout: "text",
      theory: ["conceptual-change"],
      blocks: [
        {
          type: "p",
          text: "Myth: Changing ! to 1 makes a short password safe. Better: length and uniqueness matter more than one symbol swap.",
        },
        {
          type: "p",
          text: "Myth: Sharing with friends is fine if they are nice. Better: a shared secret is no longer your secret.",
        },
        {
          type: "p",
          text: "Myth: Only hackers on movies care. Better: leaked lists of common passwords are tried automatically every day.",
        },
        {
          type: "p",
          text: "Red glossary terms such as password or unique can launch a tutor question.",
        },
      ],
    },
    {
      title: "Password Pro mastery",
      layout: "text",
      theory: ["retrieval-practice", "spiral-scaffold"],
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/cyber-shield/assets/book/m1-cover.jpg",
              caption: "Figure 5. Teach the gate rule with one clear picture.",
              alt: "Computer as password gate anchor",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Teach a friend: long unique secrets beat short easy ones; never reuse across school, games, and email; guessing loves short names and 1234.",
        },
        {
          type: "ul",
          items: [
            "Compare a 4-character guess list to a 16-character one in words",
            "Name one reuse danger",
            "Use the word unique correctly once",
          ],
        },
      ],
    },
  ],
};

export default BOOK;
