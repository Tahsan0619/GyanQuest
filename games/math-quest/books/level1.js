/**
 * Digital book - Math Quest Mission 1: place value (gold)
 */
export const BOOK = {
  missionIndex: 0,
  title: "Number Sense",
  subtitle: "tens and ones / place value",
  subject: "Math Quest / Number Sense",
  cover: {
    title: "Number Sense",
    art: "/games/math-quest/assets/book/m1-fig1.svg",
  },
  glossary: [
    { id: "place-value", term: "place value" },
    { id: "tens", term: "tens" },
    { id: "ones", term: "ones" },
    { id: "digit", term: "digit" },
    { id: "regroup", term: "regroup" },
    { id: "number", term: "number" },
    { id: "base-ten", term: "base ten" },
  ],
  pages: [
    {
      title: "Why place value?",
      layout: "text",
      figures: [
        {
          src: "/games/math-quest/assets/book/m1-fig1.svg",
          caption: "Figure 1. Tens rods and ones cubes.",
          place: "top",
          alt: "Place value",
        },
      ],
      blocks: [
        {
          type: "p",
          text: "A digit is a symbol 0-9. Place value tells you what a digit is worth because of where it sits. In base ten, ten ones make one ten.",
        },
        {
          type: "p",
          text: "The number 34 means 3 tens and 4 ones - not '3 and 4 side by side with no meaning'.",
        },
      ],
    },
    {
      title: "Tens and ones",
      layout: "text",
      blocks: [
        {
          type: "p",
          text: "Bundle 10 ones into a ten. That is regroup. Unbundle a ten into 10 ones when you need to subtract carefully.",
        },
        {
          type: "ul",
          items: ["Ones: single counters", "Tens: groups of ten", "Regroup when you have 10 or more ones"],
        },
      ],
    },
    {
      title: "See it",
      layout: "full-fig",
      figures: [
        {
          src: "/games/math-quest/assets/book/m1-fig2.svg",
          caption: "Figure 2. Building a two-digit number.",
          place: "full",
          alt: "Build number",
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Match blocks to digits. Say the number aloud using tens and ones words.",
        },
      ],
    },
    {
      title: "From game to book",
      layout: "text",
      blocks: [
        {
          type: "p",
          text: "Your mission steps practiced building, sorting, and explaining place value. This book keeps the rule clear for homework and life.",
        },
      ],
    },
    {
      title: "Everyday counts",
      layout: "split",
      figures: [
        {
          src: "/games/math-quest/assets/book/m1-fig3.svg",
          caption: "Figure 3. Money and pencils use tens thinking.",
          place: "right",
          alt: "Everyday",
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Count crayons by tens. Read a two-digit house number and name each digit's place value.",
        },
      ],
    },
    {
      title: "Myths",
      layout: "text",
      blocks: [
        {
          type: "p",
          text: "Myth: Longer numbers are always harder. Reality: place value patterns repeat - ones, tens, hundreds...",
        },
      ],
    },
    {
      title: "Mastery",
      layout: "text",
      blocks: [
        {
          type: "p",
          text: "Build any two-digit number with tens and ones, then regroup 10 ones into a ten without help.",
        },
      ],
    },
  ],
};

export default BOOK;
