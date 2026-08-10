/**
 * Digital book - AI Lab Mission 1: Smart Patterns
 * Unique curriculum book (what AI can and cannot do). Not a template fill-in.
 */
export const BOOK = {
  missionIndex: 0,
  title: "Smart Patterns",
  subtitle: "machines that learn from examples",
  subject: "AI Lab / Smart Patterns",
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
    title: "Smart Patterns",
    art: "/games/ai-lab/assets/book/m1-cover.jpg",
  },
  glossary: [
    { id: "artificial-intelligence", term: "artificial intelligence" },
    { id: "training-data", term: "training data" },
    { id: "model", term: "model" },
    { id: "prediction", term: "prediction" },
    { id: "bias", term: "bias" },
    { id: "classify", term: "classify" },
    { id: "feature", term: "feature" },
  ],
  pages: [
    {
      title: "Not magic - patterns",
      layout: "text",
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/ai-lab/assets/book/m1-cover.jpg",
              caption: "Figure 1. Artificial intelligence systems look for patterns in examples, not wishes.",
              alt: "AI pattern visualization",
            },
            {
              src: "/games/ai-lab/assets/book/m1-robot.jpg",
              caption: "A robot body is hardware; the 'smart' part is the learned model.",
              alt: "Educational robot",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Artificial intelligence here means software that finds useful patterns in data so it can act on new cases.",
        },
        {
          type: "p",
          text: "It does not understand like a friend. It estimates from what it saw in training data.",
        },
        {
          type: "p",
          text: "Everyday hook: a photo app that tags 'cat' learned from thousands of labeled cat pictures.",
        },
      ],
    },
    {
      title: "Train, then predict",
      layout: "full-fig",
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/ai-lab/assets/book/m1-train.jpg",
              caption: "Figure 2. Training data is the example set the model studies before it is tested.",
              alt: "Training dataset concept",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "ul",
          items: [
            "Training data: labeled examples used to learn",
            "Model: the saved pattern rules after training",
            "Prediction: the model's answer on a new input",
          ],
        },
        {
          type: "p",
          text: "If the training set is narrow, predictions get shaky outside that narrow world.",
        },
      ],
    },
    {
      title: "Features and labels",
      layout: "text",
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/ai-lab/assets/book/m1-pattern.jpg",
              caption: "Figure 3. A feature is a measurable clue - shape, color, word count, sensor reading.",
              alt: "Pattern recognition shapes",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "To classify means to put an item into a category. The model weighs features to choose a label.",
        },
        {
          type: "p",
          text: "Bad features or messy labels make confident-looking mistakes.",
        },
      ],
    },
    {
      title: "Bias is a data story",
      layout: "full-fig",
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/ai-lab/assets/book/m1-decide.jpg",
              caption: "Figure 4. Decision paths inherit bias if training examples were unfair or incomplete.",
              alt: "Decision flowchart",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Bias here means systematic error - the model favors some groups or cases because the data did.",
        },
        {
          type: "p",
          text: "Good AI use includes checking who is missing from the training data before trusting predictions.",
        },
      ],
    },
    {
      title: "How the mission connects",
      layout: "text",
      blocks: [
        {
          type: "p",
          text: "Meet AI → sort examples → train a tiny model → test → explain → rule → stretch → myth → fluency → mastery.",
        },
        {
          type: "ul",
          items: [
            "Sorting examples shows why labels matter",
            "Testing after training proves prediction is not memory only",
            "The rule sentence separates pattern tools from human judgment",
          ],
        },
      ],
    },
    {
      title: "Example lab",
      layout: "split",
      figures: [
        {
          place: "right",
          slides: [
            {
              src: "/games/ai-lab/assets/book/m1-train.jpg",
              caption: "Gather fair training data.",
              alt: "Training data",
            },
            {
              src: "/games/ai-lab/assets/book/m1-pattern.jpg",
              caption: "Name the features you use.",
              alt: "Features",
            },
            {
              src: "/games/ai-lab/assets/book/m1-decide.jpg",
              caption: "Check predictions for bias.",
              alt: "Decision check",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Sort ten photos into two labels you invent. Then try a new photo. Where would a short-sighted model fail?",
        },
        {
          type: "ul",
          items: [
            "What features did you actually use?",
            "What is missing from your training set?",
            "Is a wrong prediction bias or bad luck?",
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
          text: "Myth: AI is always right because it is a computer. Better: it copies patterns - including human mistakes in data.",
        },
        {
          type: "p",
          text: "Myth: If it sounds fluent, it understands. Better: fluent text can still be a wrong prediction.",
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
              src: "/games/ai-lab/assets/book/m1-robot.jpg",
              caption: "Figure 5. Teach AI as learned patterns plus careful human checks.",
              alt: "AI teaching anchor",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Teach a friend in one minute: AI learns from training data; models make predictions; bias can hide in the examples.",
        },
        {
          type: "ul",
          items: [
            "Define model in one sentence",
            "Give one example of classify",
            "Use the word feature correctly once",
          ],
        },
      ],
    },
  ],
};

export default BOOK;
