/**
 * Digital book - Database SQL / Tables & Rows
 * Theory: cognitive load, dual coding, multimedia learning, constructivism,
 * conceptual change, spiral scaffold, retrieval practice.
 * Photos: local verified copies under /games/database-sql/assets/book/ (see CREDITS-m1.json).
 */
export const BOOK = {
  missionIndex: 0,
  title: "Tables & Rows",
  subtitle: "rows columns",
  subject: "Database SQL / Tables & Rows",
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
    title: "Tables & Rows",
    art: "/games/database-sql/assets/book/m1-cover.jpg",
  },
  glossary: [
    { id: "table", term: "table" },
    { id: "row", term: "row" },
    { id: "column", term: "column" },
    { id: "record", term: "record" },
    { id: "field", term: "field" },
    { id: "cell", term: "cell" },
    { id: "header", term: "header" },
    { id: "database", term: "database" },
    { id: "schema", term: "schema" },
    { id: "value", term: "value" },
  ],
  pages: [
    {
      title: "Why Tables & Rows?",
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
              src: "/games/database-sql/assets/book/m1-hook.jpg",
              caption: "Figure 1. Counting tools love grids - databases love rows and columns.",
              alt: "Abacus",
            },
            {
              src: "/games/database-sql/assets/book/m1-cover.jpg",
              caption: "Notebook grids preview how tables store facts.",
              alt: "Notebook",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Phone contacts, class registers, and shop inventory sheets are tables: neat rows and columns.",
        },
        {
          type: "p",
          text: "Each row is one record. Each column is one field - like name, city, or stock count.",
        },
        {
          type: "p",
          text: "Everyday hook: your contacts list is already a tiny database without the scary name.",
        },
      ],
    },
    {
      title: "Row vs column",
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
              src: "/games/database-sql/assets/book/m1-model.jpg",
              caption: "Figure 2. Graphs summarize table numbers - first you need clean fields.",
              alt: "Data graph",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "A row holds one whole story (one student, one product). A column holds the same kind of fact across stories.",
        },
        {
          type: "ul",
          items: [
            "id, name, city are columns",
            "One student across those columns is a row",
            "Messy piles of notes are not tables yet",
          ],
        },
      ],
    },
    {
      title: "Table dial",
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
              src: "/games/database-sql/assets/book/m1-mechanism.jpg",
              caption: "Figure 3. Computers store tables as structured data, not cake crumbs.",
              alt: "Computer",
            },
            {
              src: "/games/database-sql/assets/book/m1-lab.jpg",
              caption: "Class registers are live tables you already read.",
              alt: "Education setting",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "In the mission you tightened the grid until rows and columns snapped into place.",
        },
        {
          type: "p",
          text: "Clear headers beat mystery scribbles. Same column means same kind of value.",
        },
      ],
    },
    {
      title: "Read a grid",
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
              src: "/games/database-sql/assets/book/m1-mastery.jpg",
              caption: "Figure 4. Measurement sheets are tables in the wild.",
              alt: "Measurement chart",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Practice pointing: this cell is row 3, column city. That habit unlocks every later SQL question.",
        },
        {
          type: "p",
          text: "Apps store people, products, and scores this way - not only math class worksheets.",
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
          text: "Meet tables -> dial grid -> sort row/column -> stronger lab -> why records -> name the table rule -> stretch sheets -> myths -> fluency -> mastery.",
        },
        {
          type: "ul",
          items: [
            "Sorting locks row vs column jobs",
            "Lab grids build reading fluency",
            "Rule: rows are records; columns are fields",
          ],
        },
      ],
    },
    {
      title: "Street lab: inventory",
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
              src: "/games/database-sql/assets/book/m1-hook.jpg",
              caption: "Count and grid.",
              alt: "Abacus",
            },
            {
              src: "/games/database-sql/assets/book/m1-cover.jpg",
              caption: "Write the headers.",
              alt: "Notebook",
            },
            {
              src: "/games/database-sql/assets/book/m1-model.jpg",
              caption: "Later: charts from tables.",
              alt: "Graph",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Make a 3x3 table for a tiny shop: item, price, stock. Fill three rows.",
        },
        {
          type: "ul",
          items: [
            "Circle one row and one column",
            "Explain why cake is not a column name here",
            "Flip carousel: abacus grid vs notebook grid",
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
          text: "Myth: tables are only for math class. Better: apps store people, products, and scores in tables.",
        },
        {
          type: "p",
          text: "Myth: columns and rows are the same. Better: columns are fields; rows are whole records.",
        },
        {
          type: "p",
          text: "Myth: cake is a database column. Better: columns are fields like name - not desserts.",
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
              src: "/games/database-sql/assets/book/m1-mastery.jpg",
              caption: "Figure 5. Clean fields - your table goal.",
              alt: "Measurement anchor",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Teach a friend with a contact list: point to a row, a column, and one cell.",
        },
        {
          type: "ul",
          items: [
            "Define record and field in one sentence each",
            "Build a 4-row class register on paper",
            "Use the word table correctly once",
          ],
        },
      ],
    },
  ],
};

export default BOOK;
