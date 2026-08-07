/**
 * Digital book - AI Lab / What is AI?
 * Theory: cognitive load, dual coding, multimedia learning, constructivism,
 * conceptual change, spiral scaffold, retrieval practice.
 * Photos: local verified copies under /games/ai-lab/assets/book/ (see CREDITS-m1.json).
 */
export const BOOK = {
  missionIndex: 0,
  title: "What is AI?",
  subtitle: "patterns from examples, not magic",
  subject: "AI Lab / What is AI?",
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
    title: "What is AI?",
    art: "/games/ai-lab/assets/book/m1-cover.jpg",
  },
  glossary: [
    { id: "pattern", term: "pattern" },
    { id: "examples", term: "examples" },
    { id: "guess", term: "guess" },
    { id: "data", term: "data" },
    { id: "model", term: "model" },
    { id: "bias", term: "bias" },
    { id: "automation", term: "automation" },
    { id: "feedback", term: "feedback" },
    { id: "input", term: "input" },
    { id: "output", term: "output" },
  ],
  pages: [
    {
      title: "Why What is AI?",
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
              src: "/games/ai-lab/assets/book/m1-hook.jpg",
              caption: "Figure 1. Rovers and robots follow sensed patterns - a concrete cousin of AI guessing.",
              alt: "NASA rover on rocky terrain",
            },
            {
              src: "/games/ai-lab/assets/book/m1-cover.jpg",
              caption: "Lab robots remind us: machines act on data, not feelings.",
              alt: "Industrial-style robot",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Your phone tags a cat photo. A voice helper guesses your next word. A map app suggests a faster road home.",
        },
        {
          type: "p",
          text: "None of those tools is a tiny person living in the silicon. They are systems that spot patterns in examples - then guess on new cases.",
        },
        {
          type: "p",
          text: "Everyday hook in Bangladesh: a shop camera that flags empty shelves learns from many past shelf photos, not from magic.",
        },
      ],
    },
    {
      title: "Examples fuel patterns",
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
              src: "/games/ai-lab/assets/book/m1-model.png",
              caption: "Figure 2. Brains inspire metaphors - but AI is statistics over examples, not a human mind.",
              alt: "Human brain illustration",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Feed many labeled examples. Patterns emerge. New inputs get a guess.",
        },
        {
          type: "ul",
          items: [
            "More varied examples usually mean sturdier patterns",
            "Messy or biased examples can bend the guess",
            "A light switch is automation - not pattern learning",
          ],
        },
      ],
    },
    {
      title: "Pattern dial in the lab",
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
              src: "/games/ai-lab/assets/book/m1-mechanism.jpg",
              caption: "Figure 3. Autonomous systems stack sensors + patterns + checks.",
              alt: "Autonomous system hardware",
            },
            {
              src: "/games/ai-lab/assets/book/m1-lab.jpg",
              caption: "A lab bench is where you test guesses against fresh cases.",
              alt: "Laboratory workspace",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "In the mission you raised a pattern dial. Clarity went up until the guess looked solid.",
        },
        {
          type: "p",
          text: "Think of that dial as how cleanly the examples line up. Sparse, noisy data keeps the dial low.",
        },
      ],
    },
    {
      title: "Sort: AI, not AI, tricky",
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
              src: "/games/ai-lab/assets/book/m1-mastery.jpg",
              caption: "Figure 4. A robotic arm repeats trained motions - still pattern + control, not human thought.",
              alt: "Robotic arm",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Photo taggers, voice helpers, and route suggesters lean on learned patterns.",
        },
        {
          type: "p",
          text: "Plain calculators and wall clocks follow fixed rules. A scripted FAQ bot can look smart yet only replay canned lines - tricky.",
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
          text: "Meet -> dial clarity -> sort tools -> stronger lab -> order the guess story -> name the rule -> stretch places -> myth bust -> fluency -> mastery.",
        },
        {
          type: "ul",
          items: [
            "Sorting teaches what counts as AI",
            "The dial links data quality to guess strength",
            "The rule sentence locks: AI learns patterns from examples",
          ],
        },
      ],
    },
    {
      title: "Street lab: photo tags",
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
              src: "/games/ai-lab/assets/book/m1-hook.jpg",
              caption: "Field rover - sensing then deciding.",
              alt: "Rover",
            },
            {
              src: "/games/ai-lab/assets/book/m1-lab.jpg",
              caption: "Bench testing - check before you trust.",
              alt: "Lab",
            },
            {
              src: "/games/ai-lab/assets/book/m1-cover.jpg",
              caption: "Robot hardware - patterns in motion.",
              alt: "Robot",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Open a gallery app that suggests names. Ask: what examples trained this? What would confuse it?",
        },
        {
          type: "ul",
          items: [
            "Name one AI tool and one non-AI tool at home",
            "Explain why a wrong tag might happen",
            "Drag the photos to flip lab vs field views",
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
          text: "Myth: AI is a magic brain that thinks like humans. Better: AI spots statistical patterns in examples.",
        },
        {
          type: "p",
          text: "Myth: AI never needs data. Better: good examples are the fuel for pattern learning.",
        },
        {
          type: "p",
          text: "Myth: every automated button is AI. Better: simple switches and fixed scripts are not AI.",
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
              src: "/games/ai-lab/assets/book/m1-mastery.jpg",
              caption: "Figure 5. Keep this arm as your teaching anchor: trained motion, checked outcomes.",
              alt: "Robotic arm anchor",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Teach a friend in one minute: AI learns patterns from examples, then guesses on new cases - and guesses can be wrong until data and checks improve.",
        },
        {
          type: "ul",
          items: [
            "Say the rule out loud once",
            "Point to a phone feature that uses patterns",
            "Name one myth you can bust",
          ],
        },
      ],
    },
  ],
};

export default BOOK;
