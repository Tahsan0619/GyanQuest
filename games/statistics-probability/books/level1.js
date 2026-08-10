/**
 * Digital book - Statistics Probability Mission 1: Chance & Data
 * Unique curriculum book (mean, samples, probability). Not a template fill-in.
 */
export const BOOK = {
  missionIndex: 0,
  title: "Chance & Data",
  subtitle: "fair questions for messy numbers",
  subject: "Statistics Probability / Chance & Data",
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
    title: "Chance & Data",
    art: "/games/statistics-probability/assets/book/m1-cover.jpg",
  },
  glossary: [
    { id: "probability", term: "probability" },
    { id: "sample", term: "sample" },
    { id: "population", term: "population" },
    { id: "mean", term: "mean" },
    { id: "outlier", term: "outlier" },
    { id: "distribution", term: "distribution" },
    { id: "fairness", term: "fairness" },
  ],
  pages: [
    {
      title: "Data is a story with noise",
      layout: "text",
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/statistics-probability/assets/book/m1-cover.jpg",
              caption: "Figure 1. Dice make probability visible - repeated trials reveal patterns in chance.",
              alt: "Dice probability",
            },
            {
              src: "/games/statistics-probability/assets/book/m1-chart.jpg",
              caption: "Charts turn raw lists into a distribution you can compare.",
              alt: "Bar chart",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Probability measures how likely an event is, from 0 (impossible) to 1 (certain).",
        },
        {
          type: "p",
          text: "Fairness means each outcome in a fair game gets an equal chance - a fair die is not stuck on six.",
        },
      ],
    },
    {
      title: "Sample vs population",
      layout: "full-fig",
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/statistics-probability/assets/book/m1-sample.jpg",
              caption: "Figure 2. A sample is the slice you actually measure; the population is the whole group you care about.",
              alt: "Survey sample collection",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "We rarely measure everyone. A careful sample lets us estimate the population - if the sample is not wildly biased.",
        },
      ],
    },
    {
      title: "Mean and outliers",
      layout: "text",
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/statistics-probability/assets/book/m1-mean.jpg",
              caption: "Figure 3. The mean is a balance point - useful, but sensitive to extreme values.",
              alt: "Average calculation",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "The mean is the average: sum divided by count. An outlier is a value far from the others that can yank the mean.",
        },
        {
          type: "p",
          text: "Always glance at the distribution before trusting a single summary number.",
        },
      ],
    },
    {
      title: "See the spread",
      layout: "full-fig",
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/statistics-probability/assets/book/m1-spread.jpg",
              caption: "Figure 4. A histogram shows distribution - clustered, spread out, or lopsided.",
              alt: "Histogram distribution",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Two classes can share a mean yet look different if one is tightly packed and the other is wildly spread.",
        },
      ],
    },
    {
      title: "How the mission connects",
      layout: "text",
      blocks: [
        {
          type: "p",
          text: "Meet chance → run trials → sample data → chart → explain → rule → stretch → myth → fluency → mastery.",
        },
        {
          type: "ul",
          items: [
            "Trials make probability feel empirical",
            "Charts expose outliers the mean hides",
            "The rule sentence is 'show the distribution, then summarize'",
          ],
        },
      ],
    },
    {
      title: "Dice-and-survey lab",
      layout: "split",
      figures: [
        {
          place: "right",
          slides: [
            {
              src: "/games/statistics-probability/assets/book/m1-cover.jpg",
              caption: "Run 30 dice trials.",
              alt: "Dice trials",
            },
            {
              src: "/games/statistics-probability/assets/book/m1-chart.jpg",
              caption: "Build a bar chart.",
              alt: "Chart",
            },
            {
              src: "/games/statistics-probability/assets/book/m1-mean.jpg",
              caption: "Compute the mean carefully.",
              alt: "Mean",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Roll a die 30 times. Chart the faces. Compare your frequencies to the fair probability of 1/6.",
        },
        {
          type: "ul",
          items: [
            "Is your sample big enough to look fair?",
            "Any outlier count that looks weird?",
            "What population are you estimating?",
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
          text: "Myth: After five heads, tails is 'due'. Better: independent fair flips ignore the past streak.",
        },
        {
          type: "p",
          text: "Myth: The mean is always the best summary. Better: outliers can fool the mean - check the distribution.",
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
              src: "/games/statistics-probability/assets/book/m1-spread.jpg",
              caption: "Figure 5. Teach stats as probability + honest pictures of data.",
              alt: "Stats mastery anchor",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Teach a friend in one minute: probability measures chance; samples estimate populations; means need distribution checks.",
        },
        {
          type: "ul",
          items: [
            "Define sample vs population",
            "Spot one outlier in a tiny list",
            "Use the word fairness correctly once",
          ],
        },
      ],
    },
  ],
};

export default BOOK;
