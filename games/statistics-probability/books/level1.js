/**
 * Statistics & Probability Mission 1 book: Mean & Mode
 * Companion to the 4-spiral lesson (typical → mean → mode → choose).
 */
export const BOOK = {
  missionIndex: 0,
  title: "Mean & Mode",
  subtitle: "two honest answers to different 'typical' questions",
  subject: "Statistics & Probability / Mean & Mode",
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
    art: "/games/statistics-probability/assets/book/gen-st-m1-cover.png",
  },
  glossary: [
    { id: "mean", term: "mean" },
    { id: "mode", term: "mode" },
    { id: "average", term: "average" },
    { id: "data", term: "data" },
    { id: "outlier", term: "outlier" },
    { id: "frequency", term: "frequency" },
    { id: "central-tendency", term: "central tendency" },
  ],
  pages: [
    {
      title: "Meet the line",
      layout: "text",
      figures: [
        {
          place: "top",
          src: "/games/statistics-probability/assets/book/gen-st-m1-fig01-line.png",
          caption: "Figure 1. Kids in line with different scoop counts. What is typical?",
          alt: "Line of kids with different ice cream scoop counts",
        },
      ],
      blocks: [
        {
          type: "p",
          text: "An ice cream truck, a line of kids, and one tricky question: how many scoops does a kid typically get? Mean and mode both answer honestly - but they answer different versions of the question.",
        },
        {
          type: "ul",
          items: [
            "Spiral 1: what 'typical' can mean.",
            "Spiral 2: mean as an even share.",
            "Spiral 3: mode as most frequent.",
            "Spiral 4: choose which fits the question.",
          ],
        },
      ],
    },
    {
      title: "Mean = share it evenly",
      layout: "full-fig",
      figures: [
        {
          place: "full",
          src: "/games/statistics-probability/assets/book/gen-st-m1-fig02-mean.png",
          caption: "Figure 2. Mean is the even-share value if everyone got the same amount.",
          alt: "Scoops redistributed equally into matching bowls",
        },
      ],
      blocks: [
        {
          type: "p",
          text: "The mean is a balance average. Pretend you pool all the scoops, then share them out so every kid gets the same. That even amount is the mean. Class marks and cricket run totals often use this idea.",
        },
        {
          type: "ul",
          items: [
            "Pool the values.",
            "Share evenly across the count of kids (or items).",
            "The shared amount is the mean.",
          ],
        },
      ],
    },
    {
      title: "Mode = most popular",
      layout: "text",
      figures: [
        {
          place: "top",
          src: "/games/statistics-probability/assets/book/gen-st-m1-fig03-mode.png",
          caption: "Figure 3. Mode is the value that shows up most often.",
          alt: "Most frequent ice cream flavor glowing as mode",
        },
      ],
      blocks: [
        {
          type: "p",
          text: "The mode is the most frequent value - the flavor or scoop count that appears most. It does not need to be the balance point. Shop price tags and 'most common choice' questions love the mode.",
        },
      ],
    },
    {
      title: "The mean recipe",
      layout: "text",
      figures: [
        {
          place: "top",
          src: "/games/statistics-probability/assets/book/gen-st-m1-fig04-formula.png",
          caption: "Figure 4. Mean: add the values, then divide by how many there are.",
          alt: "Sum flowing into divide-by-count balance for mean",
        },
      ],
      blocks: [
        {
          type: "p",
          text: "In short: mean = sum ÷ count. Add every number in the list, then divide by how many numbers you added. That is the even-share recipe written as a formula.",
        },
      ],
    },
    {
      title: "Outlier vs most common",
      layout: "full-fig",
      figures: [
        {
          place: "full",
          src: "/games/statistics-probability/assets/book/gen-st-m1-fig05-outlier.png",
          caption: "Figure 5. One huge outlier can tug the mean; the mode can stay with the crowd.",
          alt: "Outlier scoop beside common scoops with mode glowing",
        },
      ],
      blocks: [
        {
          type: "p",
          text: "An outlier is an unusual extreme value. It can pull the mean up or down. The mode often stays with the crowd. That is why 'typical' needs a careful question: balance average, or most common?",
        },
      ],
    },
    {
      title: "When to use which",
      layout: "text",
      figures: [
        {
          place: "top",
          src: "/games/statistics-probability/assets/book/gen-st-m1-fig06-choose.png",
          caption: "Figure 6. Choose mean for even share; choose mode for most frequent.",
          alt: "Child choosing between mean and mode ideas",
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Ask what you really want. Fair share or balance across everyone? Use the mean. What value appears most? Use the mode. Central tendency is the family name; mean and mode are two different tools inside it.",
        },
        {
          type: "ul",
          items: [
            "Mean: balances (sum ÷ count).",
            "Mode: most frequent value.",
            "They are not always the same number.",
          ],
        },
      ],
    },
    {
      title: "Everyday lists",
      layout: "text",
      figures: [
        {
          place: "top",
          src: "/games/statistics-probability/assets/book/gen-st-m1-fig07-everyday.png",
          caption: "Figure 7. Class marks, cricket totals, and prices all ask 'typical' questions.",
          alt: "Everyday statistics collage of marks scores and prices",
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Everyday hook: a class mark list may want a mean. A 'most common price' question may want a mode. Notice the question before you pick the tool.",
        },
      ],
    },
    {
      title: "Scoop lab",
      layout: "text",
      figures: [
        {
          place: "top",
          src: "/games/statistics-probability/assets/book/gen-st-m1-fig08-lab.png",
          caption: "Figure 8. Sort for mode. Share evenly for mean. Compare both answers.",
          alt: "Child sorting scoop cards and sharing tokens evenly",
        },
      ],
      blocks: [
        {
          type: "ul",
          items: [
            "What is the even-share mean?",
            "What value appears most (mode)?",
            "Did an outlier tug only one of them?",
          ],
        },
      ],
    },
    {
      title: "Myths to bust",
      layout: "text",
      figures: [
        {
          place: "top",
          src: "/games/statistics-probability/assets/book/gen-st-m1-fig09-myth.png",
          caption: "Figure 9. Mean and mode are not always the same number.",
          alt: "Myth that mean and mode are always equal",
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Myth: mean and mode are always the same. Better: they answer different questions and often disagree.",
        },
        {
          type: "p",
          text: "Myth: only the biggest value matters. Better: mean uses every value; mode cares about frequency.",
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
          src: "/games/statistics-probability/assets/book/gen-st-m1-fig10-close.png",
          caption: "Figure 10. Teach mean as even share and mode as most frequent.",
          alt: "Mean and mode mastery closing scene",
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Teach a friend in one minute: mean is sum ÷ count (even share); mode is the value that appears most; pick the one that matches the question.",
        },
        {
          type: "ul",
          items: [
            "Compute or describe one mean once.",
            "Name one mode once.",
            "Say when you would choose each once.",
          ],
        },
      ],
    },
  ],
};

export default BOOK;
