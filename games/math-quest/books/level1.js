/**
 * Digital book - Math Quest Mission 1: Place Value Power
 * Unique curriculum book (tens and ones). Not a template fill-in.
 */
export const BOOK = {
  missionIndex: 0,
  title: "Place Value Power",
  subtitle: "tens and ones that build bigger numbers",
  subject: "Math Quest / Place Value Power",
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
    title: "Place Value Power",
    art: "/games/math-quest/assets/book/m1-cover.jpg",
  },
  glossary: [
    { id: "digit", term: "digit" },
    { id: "place-value", term: "place value" },
    { id: "tens", term: "tens" },
    { id: "ones", term: "ones" },
    { id: "bundle", term: "bundle" },
    { id: "expanded", term: "expanded form" },
    { id: "regroup", term: "regroup" },
  ],
  pages: [
    {
      title: "Why position matters",
      layout: "text",
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/math-quest/assets/book/m1-hook.jpg",
              caption: "Figure 1. Beads and blocks make groups of ten easy to see before symbols take over.",
              alt: "Counting beads or base-ten materials",
            },
            {
              src: "/games/math-quest/assets/book/m1-cover.jpg",
              caption: "The same digit means different amounts in different seats.",
              alt: "Place value teaching materials",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "In 25, the 2 is not 'just two'. It sits in the tens place, so it means two groups of ten.",
        },
        {
          type: "p",
          text: "Place value is the rule that a digit's seat decides its worth. Move the seat, change the value.",
        },
        {
          type: "p",
          text: "Everyday hook: house numbers, scores, and money all depend on which digit sits where.",
        },
      ],
    },
    {
      title: "Tens and ones",
      layout: "full-fig",
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/math-quest/assets/book/m1-tens.jpg",
              caption: "Figure 2. One rod can stand for a bundle of ten ones.",
              alt: "Base ten rods",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "ul",
          items: [
            "Ones: single units (1, 2, 3...)",
            "Tens: each tens digit is worth ten ones",
            "Bundle: trade ten ones for one ten",
          ],
        },
        {
          type: "p",
          text: "34 means 3 tens and 4 ones. Say it that way until the digits feel like seats, not decorations.",
        },
      ],
    },
    {
      title: "Expanded form",
      layout: "text",
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/math-quest/assets/book/m1-place.jpg",
              caption: "Figure 3. A place-value chart keeps each digit in its seat.",
              alt: "Place value chart",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Expanded form writes the value of each seat: 47 = 40 + 7. That sentence proves you understand place value.",
        },
        {
          type: "p",
          text: "When you regroup, you trade ten ones for one ten (or the reverse) so the seats stay honest.",
        },
      ],
    },
    {
      title: "Number line check",
      layout: "full-fig",
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/math-quest/assets/book/m1-number.jpg",
              caption: "Figure 4. On a number line, jumping by tens is a different size jump than hopping by ones.",
              alt: "Classroom number line",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "If 52 and 25 used the same digits but swapped seats, they land in different places. Seat order is not optional.",
        },
      ],
    },
    {
      title: "How the mission connects",
      layout: "text",
      blocks: [
        {
          type: "p",
          text: "Meet digits → build tens → sort values → lab trade → explain → rule → stretch → myth → fluency → mastery.",
        },
        {
          type: "ul",
          items: [
            "Building with bundles makes the tens seat concrete",
            "Trading ones for tens practices regroup",
            "The rule sentence locks 'seat decides worth'",
          ],
        },
      ],
    },
    {
      title: "Kitchen counter lab",
      layout: "split",
      figures: [
        {
          place: "right",
          slides: [
            {
              src: "/games/math-quest/assets/book/m1-bundle.jpg",
              caption: "Bundle ten ones into one ten.",
              alt: "Bundled sticks or blocks",
            },
            {
              src: "/games/math-quest/assets/book/m1-tens.jpg",
              caption: "Read the tens seat first.",
              alt: "Tens materials",
            },
            {
              src: "/games/math-quest/assets/book/m1-place.jpg",
              caption: "Write expanded form beside the chart.",
              alt: "Place value chart practice",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Use beans, sticks, or coins. Make 28 two ways: loose ones, then with bundles. Write both in expanded form.",
        },
        {
          type: "ul",
          items: [
            "How many tens do you see?",
            "How many ones are left?",
            "What changes if you swap the digits?",
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
          text: "Myth: Bigger-looking digits are always bigger numbers. Better: seat order beats digit size - 19 is less than 91.",
        },
        {
          type: "p",
          text: "Myth: The 0 in 305 does nothing. Better: it holds the tens seat so 3 stays hundreds.",
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
              src: "/games/math-quest/assets/book/m1-cover.jpg",
              caption: "Figure 5. Teach with this picture: digits in seats, not floating marks.",
              alt: "Place value mastery anchor",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Teach a friend in one minute: place value means seat worth; tens are bundles of ten ones; expanded form proves it.",
        },
        {
          type: "ul",
          items: [
            "Break 63 into tens and ones",
            "Write one number in expanded form",
            "Use the word regroup correctly once",
          ],
        },
      ],
    },
  ],
};

export default BOOK;
