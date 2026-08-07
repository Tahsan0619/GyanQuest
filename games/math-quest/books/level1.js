/**
 * Digital book - Math Quest Mission 1: Number Sense
 * Theory: cognitive load, dual coding, multimedia learning, constructivism,
 * conceptual change, spiral scaffold, retrieval practice.
 * Photos: local JPGs under assets/book/ (abacus + everyday counting scenes).
 */
export const BOOK = {
  missionIndex: 0,
  title: "Number Sense",
  subtitle: "tens and ones place value",
  subject: "Math Quest / Number Sense",
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
    title: "Number Sense",
    art: "/games/math-quest/assets/book/m1-cover.jpg",
  },
  glossary: [
    { id: "place-value", term: "place value" },
    { id: "tens", term: "tens" },
    { id: "ones", term: "ones" },
    { id: "digit", term: "digit" },
    { id: "bundle", term: "bundle" },
    { id: "ten-rod", term: "ten-rod" },
    { id: "regroup", term: "regroup" },
    { id: "base-ten", term: "base ten" },
  ],
  pages: [
    {
      title: "Eggs, notes, and cricket scores",
      layout: "text",
      theory: ["constructivism", "dual-coding", "cognitive-load"],
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/math-quest/assets/book/m1-hook.jpg",
              caption: "Figure 1. An abacus beads tens and ones the way shops still count.",
              alt: "Wooden abacus with beads",
            },
            {
              src: "/games/math-quest/assets/book/m1-everyday.jpg",
              caption: "Everyday counting - groups of ten travel better than loose ones.",
              alt: "Person skating - motion that can be counted in steps",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "A crate of eggs is easier as 3 tens than as 30 loose shells. A 10-taka note is one bundle of ten ones. A cricket score like 47 is four tens and seven ones - not forty-seven mystery marks.",
        },
        {
          type: "p",
          text: "Place value means a digit's job changes with its seat. The same '4' is four ones or four tens depending on where it sits.",
        },
        {
          type: "p",
          text: "Earn the Number Scout badge by saying tens and ones out loud for numbers you meet today.",
        },
      ],
    },
    {
      title: "Tens sit left of ones",
      layout: "full-fig",
      theory: ["multimedia-learning", "dual-coding"],
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/math-quest/assets/book/m1-model.jpg",
              caption: "Figure 2. Base-ten model: left column tens, right column ones.",
              alt: "Abacus columns modeling tens and ones",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "In two-digit numbers, the left digit counts tens. The right digit counts ones.",
        },
        {
          type: "ul",
          items: [
            "34 = 3 tens + 4 ones",
            "70 = 7 tens + 0 ones",
            "09 is just 9 ones - the zero tens seat is empty",
          ],
        },
      ],
    },
    {
      title: "Bundle ten ones into a ten",
      layout: "text",
      theory: ["cognitive-load", "dual-coding"],
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/math-quest/assets/book/m1-tens.jpg",
              caption: "Figure 3. Ten loose ones regroup into one ten-rod (or one ten bead column).",
              alt: "Abacus showing bundled tens",
            },
            {
              src: "/games/math-quest/assets/book/m1-everyday.jpg",
              caption: "Trade ten ones for one ten - same total, cleaner packing.",
              alt: "Motion scene as reminder to count in groups",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "When ones hit ten, regroup: trade ten ones for one ten. The total stays equal; the writing gets shorter.",
        },
        {
          type: "p",
          text: "That is why 9 + 1 becomes 10, not '91'. You filled the ones seat and rolled a new ten into the tens seat.",
        },
      ],
    },
    {
      title: "Chart what you build",
      layout: "full-fig",
      theory: ["multimedia-learning", "spiral-scaffold"],
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/math-quest/assets/book/m1-cover.jpg",
              caption: "Figure 4. Representation: beads (or rods) map to digits on a place chart.",
              alt: "Abacus as place-value chart",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Canvas rods in the mission are models. Real shops use notes, crates, or beads - same base-ten idea.",
        },
      ],
    },
    {
      title: "How the 10 steps connect",
      layout: "text",
      theory: ["spiral-scaffold", "cognitive-load"],
      blocks: [
        {
          type: "p",
          text: "Meet tens and ones -> build a number -> sort tens vs ones -> place chart lab -> why place matters -> name the place rule -> transfer to BD money and scores -> myth bust -> fluency -> Number Scout mastery.",
        },
        {
          type: "ul",
          items: [
            "Building makes the seats visible",
            "Sorting stops mixing tens with ones",
            "The rule sentence locks the idea in words",
          ],
        },
      ],
    },
    {
      title: "Market and scoreboard transfer",
      layout: "split",
      theory: ["constructivism", "dual-coding", "retrieval-practice"],
      figures: [
        {
          place: "right",
          slides: [
            {
              src: "/games/math-quest/assets/book/m1-hook.jpg",
              caption: "Count change with 10-taka notes as tens.",
              alt: "Abacus for money place value",
            },
            {
              src: "/games/math-quest/assets/book/m1-everyday.jpg",
              caption: "Read a cricket score as tens and ones.",
              alt: "Everyday counting reminder",
            },
            {
              src: "/games/math-quest/assets/book/m1-tens.jpg",
              caption: "Egg cartons: full rows of ten.",
              alt: "Bundled tens on an abacus",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Pick one number from a shop receipt or a match score. Split it into tens and ones. Say the bundle out loud.",
        },
        {
          type: "ul",
          items: [
            "Which digit is the tens seat?",
            "Did you need to regroup any ones?",
            "Drag the photos to flip examples",
          ],
        },
      ],
    },
    {
      title: "Myths to bust",
      layout: "text",
      theory: ["conceptual-change"],
      blocks: [
        {
          type: "p",
          text: "Myth: Bigger digits are always bigger numbers. Better: place beats the digit - 19 is bigger than 91? No. 91 has nine tens.",
        },
        {
          type: "p",
          text: "Myth: Zero means 'nothing important'. Better: zero can hold a tens seat open so 40 is not confused with 4.",
        },
        {
          type: "p",
          text: "Red words are glossary terms. Tap one to ask the tutor.",
        },
      ],
    },
    {
      title: "Number Scout mastery",
      layout: "text",
      theory: ["retrieval-practice", "spiral-scaffold"],
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/math-quest/assets/book/m1-cover.jpg",
              caption: "Figure 5. Teach with the abacus: tens left, ones right.",
              alt: "Abacus teaching anchor",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Teach a friend in one minute: every two-digit number is tens plus ones; ten ones become one ten; the seat gives the digit its value.",
        },
        {
          type: "ul",
          items: [
            "Write 58 as tens and ones",
            "Regroup 14 ones into tens and ones",
            "Use the phrase place value correctly once",
          ],
        },
      ],
    },
  ],
};

export default BOOK;
