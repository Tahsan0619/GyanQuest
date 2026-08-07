/**
 * Digital book - Statistics Probability / Mean & Mode
 * Theory: cognitive load, dual coding, multimedia learning, constructivism,
 * conceptual change, spiral scaffold, retrieval practice.
 * Photos: local verified copies under /games/statistics-probability/assets/book/ (see CREDITS-m1.json).
 */
export const BOOK = {
  missionIndex: 0,
  title: "Mean & Mode",
  subtitle: "averages / typical values",
  subject: "Statistics Probability / Mean & Mode",
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
    title: "Mean & Mode",
    art: "/games/statistics-probability/assets/book/m1-cover.jpg",
  },
  glossary: [
    { id: "mean", term: "mean" },
    { id: "mode", term: "mode" },
    { id: "average", term: "average" },
    { id: "outlier", term: "outlier" },
    { id: "data", term: "data" },
    { id: "value", term: "value" },
    { id: "count", term: "count" },
    { id: "sum", term: "sum" },
    { id: "typical", term: "typical" },
    { id: "distribution", term: "distribution" },
  ],
  pages: [
    {
      title: "Why Mean & Mode?",
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
              src: "/games/statistics-probability/assets/book/m1-hook.jpg",
              caption: "Figure 1. Counting tools make totals honest before you average.",
              alt: "Abacus",
            },
            {
              src: "/games/statistics-probability/assets/book/m1-cover.jpg",
              caption: "Graphs show where typical values sit.",
              alt: "Graph",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Mean balances all values into one typical number. Mode is the value that appears most.",
        },
        {
          type: "p",
          text: "Class mark lists, cricket run totals, and shop price tags in BD markets all invite averages.",
        },
        {
          type: "p",
          text: "Everyday hook: if three snacks cost 10, 10, and 40, mode is 10 while mean is pulled upward.",
        },
      ],
    },
    {
      title: "Balance vs popularity",
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
              src: "/games/statistics-probability/assets/book/m1-model.jpg",
              caption: "Figure 2. Another graph view - spot the cluster (mode) vs the balance point (mean).",
              alt: "Graph alternate",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Mean adds then divides by the count. Mode crowns the most common value. They can differ.",
        },
        {
          type: "ul",
          items: [
            "Outliers can pull the mean",
            "Mode allows ties",
            "Kids use both for marks, scores, and prices",
          ],
        },
      ],
    },
    {
      title: "Average dial",
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
              src: "/games/statistics-probability/assets/book/m1-mechanism.jpg",
              caption: "Figure 3. Measurement sheets feed averages.",
              alt: "Measurement",
            },
            {
              src: "/games/statistics-probability/assets/book/m1-lab.jpg",
              caption: "Write the list before you compute.",
              alt: "Notebook",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "In the lab you dialed until mean and mode stories felt different on purpose.",
        },
        {
          type: "p",
          text: "Mean never ignores how many values you have - the count is the divider.",
        },
      ],
    },
    {
      title: "Watch the outlier",
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
              src: "/games/statistics-probability/assets/book/m1-mastery.jpg",
              caption: "Figure 4. Patterns in lists - clusters hint at mode.",
              alt: "Pattern",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "One huge score can drag the mean while the mode stays with the crowd.",
        },
        {
          type: "p",
          text: "Say which average you mean before you compare classes or shops.",
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
          text: "Meet averages -> dial typical -> sort mean/mode -> stronger lab -> why outliers -> name the average rule -> stretch markets -> myths -> fluency -> mastery.",
        },
        {
          type: "ul",
          items: [
            "Sorting separates balance from popularity",
            "Labs show mean move when an outlier appears",
            "Rule: mean balances; mode is most common",
          ],
        },
      ],
    },
    {
      title: "Street lab: mark list",
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
              src: "/games/statistics-probability/assets/book/m1-hook.jpg",
              caption: "Total first.",
              alt: "Abacus",
            },
            {
              src: "/games/statistics-probability/assets/book/m1-cover.jpg",
              caption: "See the typical.",
              alt: "Graph",
            },
            {
              src: "/games/statistics-probability/assets/book/m1-lab.jpg",
              caption: "Write the list.",
              alt: "Notebook",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Use five class marks. Compute mean. Circle the mode. Add one huge outlier and recompute mean.",
        },
        {
          type: "ul",
          items: [
            "Did mode change?",
            "Explain the pull in one sentence",
            "Flip carousel: abacus totals vs graph shape",
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
          text: "Myth: mean and mode are always the same number. Better: they can differ - mean balances; mode is most common.",
        },
        {
          type: "p",
          text: "Myth: one outlier never moves the mean. Better: a very large or small value can pull the mean.",
        },
        {
          type: "p",
          text: "Myth: mean ignores how many values you have. Better: mean divides by the count of values.",
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
              src: "/games/statistics-probability/assets/book/m1-mastery.jpg",
              caption: "Figure 5. Spot clusters - your average goal.",
              alt: "Pattern anchor",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Teach a friend with three prices: show mean vs mode and why shoppers might care about each.",
        },
        {
          type: "ul",
          items: [
            "Compute both on a 5-number list",
            "Point to an outlier effect",
            "Use the word average carefully (say mean or mode)",
          ],
        },
      ],
    },
  ],
};

export default BOOK;
