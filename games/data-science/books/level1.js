/**
 * Digital book - Data Science Mission 1: Chart Stories
 * Theory: cognitive load, dual coding, multimedia learning, constructivism,
 * conceptual change, spiral scaffold, retrieval practice.
 * Photos: assets/book-shared ai_data theme (see assets/book/CREDITS-m1.json).
 */
export const BOOK = {
  missionIndex: 0,
  title: "Chart Stories",
  subtitle: "bars and lines turn numbers into stories",
  subject: "Data Science / Chart Stories",
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
    title: "Chart Stories",
    art: "/games/data-science/assets/book/m1-cover.jpg",
  },
  glossary: [
    { id: "chart", term: "chart" },
    { id: "bar", term: "bar" },
    { id: "line", term: "line" },
    { id: "axis", term: "axis" },
    { id: "scale", term: "scale" },
    { id: "compare", term: "compare" },
    { id: "trend", term: "trend" },
    { id: "data", term: "data" },
  ],
  pages: [
    {
      title: "Numbers that speak aloud",
      layout: "text",
      theory: ["constructivism", "dual-coding", "cognitive-load"],
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/data-science/assets/book/m1-cover.jpg",
              caption: "Figure 1. Machines collect readings - charts turn those readings into a story you can see.",
              alt: "Autonomous sensing system",
            },
            {
              src: "/games/data-science/assets/book/m1-hook.jpg",
              caption: "Exploration tools gather many measurements before anyone spots a pattern.",
              alt: "Rover-style exploration hardware",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "A list of marks or rainfall totals is hard to hold in your head. A chart paints the same numbers so your eyes can compare and follow.",
        },
        {
          type: "p",
          text: "Bars shout comparison: which category is taller? Lines whisper trend: what happened next as time moved?",
        },
        {
          type: "p",
          text: "Class marks bar chart, a rainfall line across months, and shop sales bars are everyday Bangladesh data stories.",
        },
      ],
    },
    {
      title: "Bars compare, lines follow",
      layout: "full-fig",
      theory: ["multimedia-learning", "dual-coding"],
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/data-science/assets/book/m1-model.jpg",
              caption: "Figure 2. Field machines sample the world one reading at a time - charts assemble the samples.",
              alt: "Mars rover collecting environmental data",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Choose the picture that matches the question. Comparing groups favors bars. Watching change over time favors a line.",
        },
        {
          type: "ul",
          items: [
            "Bar height -> amount for one category",
            "Line path -> how a value moves along an axis",
            "Missing axis labels -> story you cannot trust",
          ],
        },
      ],
    },
    {
      title: "Scale tells the truth",
      layout: "text",
      theory: ["cognitive-load", "dual-coding"],
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/data-science/assets/book/m1-mechanism.jpg",
              caption: "Figure 3. Another rover view - same idea: many points, one readable picture.",
              alt: "Rover instrumentation",
            },
            {
              src: "/games/data-science/assets/book/m1-detail.jpg",
              caption: "Rivers of measurement: flow data is useless without a clear scale.",
              alt: "River landscape as flow metaphor",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "A chart can lie with a chopped axis or uneven scale. Always read the numbers on the side before trusting a dramatic spike.",
        },
        {
          type: "p",
          text: "Good chart stories keep scale honest, categories clear, and the question in view: compare, or track change?",
        },
      ],
    },
    {
      title: "Patterns in the cloud of points",
      layout: "full-fig",
      theory: ["multimedia-learning", "spiral-scaffold"],
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/data-science/assets/book/m1-transfer.jpg",
              caption: "Figure 4. Dense patterns still hide structure - charts are how we pull a story out.",
              alt: "Nebula-like field of points",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Raw tables are starfields. Bars and lines are the constellation drawings that help a classmate see what you saw.",
        },
      ],
    },
    {
      title: "Chart Scout mission map",
      layout: "text",
      theory: ["spiral-scaffold", "cognitive-load"],
      blocks: [
        {
          type: "p",
          text: "You met charts, dialed story clarity, sorted chart parts, cleaned a chart, and named why pictures beat raw piles of numbers.",
        },
        {
          type: "ul",
          items: [
            "Parts: title, axis, scale, bars or line",
            "Lab: make the story readable, not fancy",
            "Rule: bars and lines turn numbers into stories",
          ],
        },
        {
          type: "p",
          text: "Practice was stepwise on purpose. Now hold the full reading habit.",
        },
      ],
    },
    {
      title: "Marks, rain, sales",
      layout: "split",
      theory: ["constructivism", "dual-coding", "retrieval-practice"],
      figures: [
        {
          place: "right",
          slides: [
            {
              src: "/games/data-science/assets/book/m1-hook.jpg",
              caption: "Class marks - bars for subject comparison.",
              alt: "Data collection metaphor",
            },
            {
              src: "/games/data-science/assets/book/m1-detail.jpg",
              caption: "Rainfall - a line across months.",
              alt: "Flowing landscape for time series",
            },
            {
              src: "/games/data-science/assets/book/m1-model.jpg",
              caption: "Shop sales - bars by item or day.",
              alt: "Sampling machine metaphor",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "For each everyday set, pick bar or line and say what question the chart answers.",
        },
        {
          type: "ul",
          items: [
            "What is being compared?",
            "What is changing over time?",
            "Where must the scale start?",
          ],
        },
      ],
    },
    {
      title: "Chart myths",
      layout: "text",
      theory: ["conceptual-change"],
      blocks: [
        {
          type: "p",
          text: "Myth: The tallest bar is always the most important. Better: importance depends on the question; scale and labels decide meaning.",
        },
        {
          type: "p",
          text: "Myth: A line chart means the values are connected in real life. Better: a line is a visual guide; check whether order on the axis makes sense.",
        },
        {
          type: "p",
          text: "Myth: Pretty colors equal true data. Better: honest axes beat decoration.",
        },
        {
          type: "p",
          text: "Tap red words (chart, scale, trend) to quiz the tutor.",
        },
      ],
    },
    {
      title: "Chart Scout mastery",
      layout: "text",
      theory: ["retrieval-practice", "spiral-scaffold"],
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/data-science/assets/book/m1-cover.jpg",
              caption: "Figure 5. Anchor: charts make number stories visible.",
              alt: "Sensing system as chart story anchor",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Teach in one minute: bars compare amounts; lines follow change; always read the scale before trusting the drama.",
        },
        {
          type: "ul",
          items: [
            "Sketch one bar chart and one line chart",
            "Point to a real marks or rainfall example",
            "Use the word trend correctly once",
          ],
        },
      ],
    },
  ],
};

export default BOOK;
