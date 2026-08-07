/**
 * Digital book - AI Lab / Pattern Predict
 * Theory: cognitive load, dual coding, multimedia learning, constructivism,
 * conceptual change, spiral scaffold, retrieval practice.
 * Photos: local verified copies under /games/ai-lab/assets/book/ (see CREDITS-m2.json).
 */
export const BOOK = {
  missionIndex: 1,
  title: "Pattern Predict",
  subtitle: "see a pattern, predict the next piece",
  subject: "AI Lab / Pattern Predict",
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
    title: "Pattern Predict",
    art: "/games/ai-lab/assets/book/m2-cover.jpg",
  },
  glossary: [
    { id: "pattern", term: "pattern" },
    { id: "sequence", term: "sequence" },
    { id: "predict", term: "predict" },
    { id: "repeat", term: "repeat" },
    { id: "clue", term: "clue" },
    { id: "noise", term: "noise" },
    { id: "confidence", term: "confidence" },
    { id: "verify", term: "verify" },
    { id: "rule", term: "rule" },
    { id: "next", term: "next" },
  ],
  pages: [
    {
      title: "Why Pattern Predict?",
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
              src: "/games/ai-lab/assets/book/m2-hook.jpg",
              caption: "Figure 1. Repeating visual patterns - train your eye before you predict.",
              alt: "Repeating pattern image",
            },
            {
              src: "/games/ai-lab/assets/book/m2-cover.jpg",
              caption: "Pattern tiles as a warm-up for sequence guessing.",
              alt: "Pattern graphic",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Bead necklaces, traffic lights, and class timetables all repeat. Once you see the repeat, you can name the next piece before it shows.",
        },
        {
          type: "p",
          text: "This mission trains prediction as a skill: spot structure, then forecast - not lucky guessing.",
        },
        {
          type: "p",
          text: "Everyday hook: if lights go green-yellow-red, you already know what comes after green again.",
        },
      ],
    },
    {
      title: "Clue vs noise",
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
              src: "/games/ai-lab/assets/book/m2-model.jpg",
              caption: "Figure 2. Rovers follow planned sequences - each next move rides on the pattern of the plan.",
              alt: "Curiosity rover",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "A true clue repeats: same order, same gap, a next slot waiting.",
        },
        {
          type: "p",
          text: "Noise is a one-off blot or sticker. Tricky near-repeats try to fool you - check twice.",
        },
      ],
    },
    {
      title: "Confidence dial",
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
              src: "/games/ai-lab/assets/book/m2-mechanism.jpg",
              caption: "Figure 3. Orbit diagrams are sequential plans - next position follows the rule.",
              alt: "Orbit diagram",
            },
            {
              src: "/games/ai-lab/assets/book/m2-lab.jpg",
              caption: "Notebooks help you sketch the repeat before you speak the next piece.",
              alt: "Notebook",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "In the lab you raised prediction confidence. Confidence should rise only when the repeating structure is clear.",
        },
        {
          type: "p",
          text: "If the sequence twists once, pause and re-map the rule before guessing again.",
        },
      ],
    },
    {
      title: "Predict, then check",
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
              src: "/games/ai-lab/assets/book/m2-mastery.jpg",
              caption: "Figure 4. Mars paths succeed when the next step matches the plan.",
              alt: "Mars rover",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Say the next piece out loud. Reveal. Match? Keep the rule. Miss? Rebuild the pattern from the start.",
        },
        {
          type: "p",
          text: "One lucky hit is not mastery. Reliable prediction beats a single cheer.",
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
          text: "Meet sequence -> dial confidence -> sort clues -> stronger lab -> why we predict -> name the rule -> stretch places -> myths -> fluency -> mastery.",
        },
        {
          type: "ul",
          items: [
            "Sorting separates pattern clues from noise",
            "Checking after a guess closes the learning loop",
            "Rule: see the repeat, then predict the next piece",
          ],
        },
      ],
    },
    {
      title: "Street lab: lights and beads",
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
              src: "/games/ai-lab/assets/book/m2-cover.jpg",
              caption: "Abstract repeat.",
              alt: "Pattern",
            },
            {
              src: "/games/ai-lab/assets/book/m2-mechanism.jpg",
              caption: "Planned path.",
              alt: "Orbit",
            },
            {
              src: "/games/ai-lab/assets/book/m2-hook.jpg",
              caption: "Visual rhythm.",
              alt: "Pattern close-up",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Watch a traffic light cycle or a friendship bracelet pattern. Pause mid-way and predict the next color.",
        },
        {
          type: "ul",
          items: [
            "Write the repeating block (e.g. R-G-B)",
            "Name what would count as noise",
            "Flip the carousel to compare plan vs field",
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
          text: "Myth: predicting means you never need a pattern. Better: predictions ride on the repeating structure you noticed.",
        },
        {
          type: "p",
          text: "Myth: one lucky guess equals mastery. Better: check against the real next piece.",
        },
        {
          type: "p",
          text: "Myth: noise is the same as a pattern clue. Better: noise does not reliably repeat.",
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
              src: "/games/ai-lab/assets/book/m2-mastery.jpg",
              caption: "Figure 5. Anchor: next step follows the plan.",
              alt: "Rover anchor",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Teach a friend: find the repeating block, predict the next piece, then verify. Misses teach you to re-check the pattern.",
        },
        {
          type: "ul",
          items: [
            "Build a 6-bead pattern and hide the last bead",
            "Have a partner predict, then reveal",
            "Use the word sequence correctly once",
          ],
        },
      ],
    },
  ],
};

export default BOOK;
