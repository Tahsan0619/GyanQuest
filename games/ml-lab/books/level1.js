/**
 * Digital book - ML Lab Mission 1: Teach the Model
 * Theory: cognitive load, dual coding, multimedia learning, constructivism,
 * conceptual change, spiral scaffold, retrieval practice.
 * Photos: assets/book-shared ai_data / anatomy themes (see assets/book/CREDITS-m1.json).
 */
export const BOOK = {
  missionIndex: 0,
  title: "Teach the Model",
  subtitle: "train vs test - more good examples",
  subject: "ML Lab / Teach the Model",
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
    title: "Teach the Model",
    art: "/games/ml-lab/assets/book/m1-cover.png",
  },
  glossary: [
    { id: "model", term: "model" },
    { id: "train", term: "train" },
    { id: "test", term: "test" },
    { id: "example", term: "example" },
    { id: "label", term: "label" },
    { id: "overfit", term: "overfit" },
    { id: "pattern", term: "pattern" },
    { id: "generalize", term: "generalize" },
  ],
  pages: [
    {
      title: "Learning from examples",
      layout: "text",
      theory: ["constructivism", "dual-coding", "cognitive-load"],
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/ml-lab/assets/book/m1-cover.png",
              caption: "Figure 1. Brains learn from many experiences - ML models learn from labeled examples.",
              alt: "Human brain diagram",
            },
            {
              src: "/games/ml-lab/assets/book/m1-hook.jpg",
              caption: "Systems with many parts need practice signals, not one lucky guess.",
              alt: "Heart anatomy as complex system metaphor",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "A model learns from training examples, then we test it on new ones it has not memorized.",
        },
        {
          type: "p",
          text: "More good examples usually beat a few messy ones. Labels must match reality, or the model practices the wrong habit.",
        },
        {
          type: "p",
          text: "Sorting fruit photos, handwriting samples, and spam vs real mail are everyday train-vs-test stories.",
        },
      ],
    },
    {
      title: "Train set vs test set",
      layout: "full-fig",
      theory: ["multimedia-learning", "dual-coding"],
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/ml-lab/assets/book/m1-model.jpg",
              caption: "Figure 2. Structure underneath - models fit patterns in data the way scaffolds support a shape.",
              alt: "Bone structure metaphor",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Train: examples used to adjust the model. Test: held-out examples used to check whether it generalizes.",
        },
        {
          type: "ul",
          items: [
            "If test looks exactly like memorized train items, you have not really checked",
            "If train is tiny, the model guesses wildly on new fruit or new handwriting",
            "Balanced, honest labels beat huge noisy piles",
          ],
        },
      ],
    },
    {
      title: "Why more good examples help",
      layout: "text",
      theory: ["cognitive-load", "dual-coding"],
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/ml-lab/assets/book/m1-mechanism.jpg",
              caption: "Figure 3. Many small units work together - lots of clean examples feed better patterns.",
              alt: "Blood cells metaphor for many examples",
            },
            {
              src: "/games/ml-lab/assets/book/m1-detail.jpg",
              caption: "Strong signal vs flare noise - quality beats random intensity.",
              alt: "Solar flare intensity image",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "A model that only saw yellow bananas may fail on green ones. Variety inside the train set teaches the real pattern.",
        },
        {
          type: "p",
          text: "Spam filters need many spam and many real messages. One weird email is not a curriculum.",
        },
      ],
    },
    {
      title: "Flow of a fair check",
      layout: "full-fig",
      theory: ["multimedia-learning", "spiral-scaffold"],
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/ml-lab/assets/book/m1-transfer.jpg",
              caption: "Figure 4. Keep train and test channels separate - like keeping two water paths from mixing.",
              alt: "Water imagery for separate flows",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Leaking test examples into training makes scores look brilliant and real-world use look broken. Keep the split clean.",
        },
      ],
    },
    {
      title: "Model Mentor route",
      layout: "text",
      theory: ["spiral-scaffold", "cognitive-load"],
      blocks: [
        {
          type: "p",
          text: "You met training, dialed example quality, sorted train vs test, strengthened the train set, and named why models learn from examples.",
        },
        {
          type: "ul",
          items: [
            "Sort: train item vs honest test item",
            "Lab: add better examples, watch guesses improve",
            "Rule: train vs test - more good examples",
          ],
        },
        {
          type: "p",
          text: "The canvas kept memory load low. Here is the full teach-and-check habit.",
        },
      ],
    },
    {
      title: "Fruit, handwriting, mail",
      layout: "split",
      theory: ["constructivism", "dual-coding", "retrieval-practice"],
      figures: [
        {
          place: "right",
          slides: [
            {
              src: "/games/ml-lab/assets/book/m1-cover.png",
              caption: "Fruit photos - train on many kinds, test on new ones.",
              alt: "Brain learning metaphor",
            },
            {
              src: "/games/ml-lab/assets/book/m1-model.jpg",
              caption: "Handwriting - variety beats one perfect sample.",
              alt: "Structure metaphor",
            },
            {
              src: "/games/ml-lab/assets/book/m1-mechanism.jpg",
              caption: "Spam vs real - need both classes in training.",
              alt: "Many examples metaphor",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "For each everyday task, name five train examples and one test example that must stay unused until check time.",
        },
        {
          type: "ul",
          items: [
            "What would a bad label look like?",
            "What variety is missing?",
            "How do you keep the test set honest?",
          ],
        },
      ],
    },
    {
      title: "ML myths",
      layout: "text",
      theory: ["conceptual-change"],
      blocks: [
        {
          type: "p",
          text: "Myth: A model that scores 100% on training is ready. Better: it may have memorized; test on fresh examples.",
        },
        {
          type: "p",
          text: "Myth: More data always helps even if labels are wrong. Better: wrong labels teach the wrong pattern faster.",
        },
        {
          type: "p",
          text: "Myth: ML understands fruit like a farmer. Better: it matches patterns from examples you provided.",
        },
        {
          type: "p",
          text: "Tap train, test, or model in red to talk with the tutor.",
        },
      ],
    },
    {
      title: "Model Mentor mastery",
      layout: "text",
      theory: ["retrieval-practice", "spiral-scaffold"],
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/ml-lab/assets/book/m1-cover.png",
              caption: "Figure 5. Teach train vs test with one clear picture.",
              alt: "Brain image as ML teaching anchor",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Teach in one minute: train on good examples, test on new ones, and never celebrate memorization as understanding.",
        },
        {
          type: "ul",
          items: [
            "Explain train vs test with fruit photos",
            "Give one overfit warning in plain words",
            "Use the word generalize correctly once",
          ],
        },
      ],
    },
  ],
};

export default BOOK;
