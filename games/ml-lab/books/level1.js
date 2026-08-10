/**
 * Digital book - ML Lab Mission 1: Learn from Data
 * Unique curriculum book (fit a simple model to points). Not a template fill-in.
 */
export const BOOK = {
  missionIndex: 0,
  title: "Learn from Data",
  subtitle: "points, patterns, and cautious predictions",
  subject: "ML Lab / Learn from Data",
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
    title: "Learn from Data",
    art: "/games/ml-lab/assets/book/m1-cover.jpg",
  },
  glossary: [
    { id: "dataset", term: "dataset" },
    { id: "feature", term: "feature" },
    { id: "label", term: "label" },
    { id: "regression", term: "regression" },
    { id: "overfit", term: "overfit" },
    { id: "train-test", term: "train/test split" },
    { id: "error", term: "error" },
  ],
  pages: [
    {
      title: "Data before drama",
      layout: "text",
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/ml-lab/assets/book/m1-data.jpg",
              caption: "Figure 1. A dataset is an organized table of examples - rows of cases, columns of measurements.",
              alt: "Data chart or table",
            },
            {
              src: "/games/ml-lab/assets/book/m1-cover.jpg",
              caption: "Machine learning starts by plotting and cleaning, not by guessing fancy names.",
              alt: "Scatter plot intro",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "A feature is an input column you measure. A label is the answer column you hope to predict.",
        },
        {
          type: "p",
          text: "Everyday hook: hours studied (feature) and quiz score (label) can form a tiny dataset.",
        },
      ],
    },
    {
      title: "Fit a line",
      layout: "full-fig",
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/ml-lab/assets/book/m1-model.jpg",
              caption: "Figure 2. Regression draws a trend line through points to estimate new labels.",
              alt: "Regression line on scatter plot",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Regression is learning a relationship - often a line - that maps features to a number label.",
        },
        {
          type: "p",
          text: "Error is the gap between the model's guess and the true label. Smaller average error is better, not perfect.",
        },
      ],
    },
    {
      title: "Train vs test",
      layout: "text",
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/ml-lab/assets/book/m1-feature.jpg",
              caption: "Figure 3. Choose features carefully - garbage columns make confident garbage lines.",
              alt: "Feature columns concept",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "A train/test split keeps some rows hidden while you fit. Then you score on the hidden rows.",
        },
        {
          type: "p",
          text: "If you only check the training rows, you can overfit - memorize noise instead of learning a useful pattern.",
        },
      ],
    },
    {
      title: "Predict with caution",
      layout: "full-fig",
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/ml-lab/assets/book/m1-predict.jpg",
              caption: "Figure 4. A prediction is an estimate - always ask how far it is from the training world.",
              alt: "Prediction chart",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Predicting far outside the dataset range is risky. Lines do not get infinite trust.",
        },
      ],
    },
    {
      title: "How the mission connects",
      layout: "text",
      blocks: [
        {
          type: "p",
          text: "Meet points → pick features → fit → measure error → explain → rule → stretch → myth → fluency → mastery.",
        },
        {
          type: "ul",
          items: [
            "Plotting first prevents blind fitting",
            "Error checks keep you honest",
            "The split fights overfit",
          ],
        },
      ],
    },
    {
      title: "Notebook lab",
      layout: "split",
      figures: [
        {
          place: "right",
          slides: [
            {
              src: "/games/ml-lab/assets/book/m1-data.jpg",
              caption: "Collect a tiny dataset.",
              alt: "Dataset",
            },
            {
              src: "/games/ml-lab/assets/book/m1-model.jpg",
              caption: "Sketch a regression line.",
              alt: "Model fit",
            },
            {
              src: "/games/ml-lab/assets/book/m1-predict.jpg",
              caption: "Test one new prediction.",
              alt: "Prediction",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Make eight (x, y) points on paper. Draw a line. Hide two points first - that is your test set.",
        },
        {
          type: "ul",
          items: [
            "Which feature did you choose for x?",
            "Where is the biggest error?",
            "Did you overfit the wiggles?",
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
          text: "Myth: A fancy model is always smarter. Better: a simple regression with clean features often wins for beginners.",
        },
        {
          type: "p",
          text: "Myth: Zero training error means success. Better: that can be overfit - test error tells the real story.",
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
              src: "/games/ml-lab/assets/book/m1-cover.jpg",
              caption: "Figure 5. Teach ML as data → fit → check error → predict carefully.",
              alt: "ML teaching anchor",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Teach a friend in one minute: datasets have features and labels; regression fits a trend; watch overfit with a train/test split.",
        },
        {
          type: "ul",
          items: [
            "Define error in one sentence",
            "Explain why we hide a test set",
            "Use the word regression correctly once",
          ],
        },
      ],
    },
  ],
};

export default BOOK;
