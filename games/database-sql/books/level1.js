/**
 * Digital book - Database SQL Mission 1: Tables & Queries
 * Unique curriculum book (rows, columns, SELECT). Not a template fill-in.
 */
export const BOOK = {
  missionIndex: 0,
  title: "Tables & Queries",
  subtitle: "ask a database with precise questions",
  subject: "Database SQL / Tables & Queries",
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
    title: "Tables & Queries",
    art: "/games/database-sql/assets/book/m1-cover.jpg",
  },
  glossary: [
    { id: "table", term: "table" },
    { id: "row", term: "row" },
    { id: "column", term: "column" },
    { id: "primary-key", term: "primary key" },
    { id: "query", term: "query" },
    { id: "select", term: "SELECT" },
    { id: "filter", term: "filter" },
  ],
  pages: [
    {
      title: "Spreadsheets with rules",
      layout: "text",
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/database-sql/assets/book/m1-cover.jpg",
              caption: "Figure 1. A database table looks familiar - rows of records, columns of fields.",
              alt: "Database table rows",
            },
            {
              src: "/games/database-sql/assets/book/m1-row.jpg",
              caption: "Each row is one record; each column is one kind of fact.",
              alt: "Spreadsheet rows and columns",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "A table stores one kind of thing - students, orders, books - with the same columns for every row.",
        },
        {
          type: "p",
          text: "A primary key uniquely identifies each row so updates and joins do not confuse twins.",
        },
      ],
    },
    {
      title: "Ask with SELECT",
      layout: "full-fig",
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/database-sql/assets/book/m1-query.jpg",
              caption: "Figure 2. A SELECT query asks for columns from a table, optionally filtered.",
              alt: "SQL SELECT query",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "A query is a precise question written in SQL. SELECT names the columns; FROM names the table.",
        },
        {
          type: "ul",
          items: [
            "SELECT name, score FROM students;",
            "WHERE filters which rows survive",
            "ORDER BY sorts the answer set",
          ],
        },
      ],
    },
    {
      title: "Filter means decide",
      layout: "text",
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/database-sql/assets/book/m1-table.jpg",
              caption: "Figure 3. Schema diagrams show tables, keys, and how columns relate.",
              alt: "Database schema diagram",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "To filter is to keep only rows that match a condition - score >= 80, city = 'Dhaka'.",
        },
        {
          type: "p",
          text: "Bad filters return too much or nothing. Good filters match the question you truly meant.",
        },
      ],
    },
    {
      title: "Keys keep identity",
      layout: "full-fig",
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/database-sql/assets/book/m1-key.jpg",
              caption: "Figure 4. Primary keys stop two different people from sharing one identity number by accident.",
              alt: "Primary key concept",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Without a primary key, 'update Rahim' might hit the wrong Rahim. Identity matters.",
        },
      ],
    },
    {
      title: "How the mission connects",
      layout: "text",
      blocks: [
        {
          type: "p",
          text: "Meet tables → pick columns → write SELECT → filter lab → explain → rule → stretch → myth → fluency → mastery.",
        },
        {
          type: "ul",
          items: [
            "Reading a table before querying prevents wild guesses",
            "Filter labs show WHERE power",
            "The rule sentence is 'ask precisely, get only what matches'",
          ],
        },
      ],
    },
    {
      title: "Query lab",
      layout: "split",
      figures: [
        {
          place: "right",
          slides: [
            {
              src: "/games/database-sql/assets/book/m1-row.jpg",
              caption: "Count rows in your sample.",
              alt: "Rows",
            },
            {
              src: "/games/database-sql/assets/book/m1-query.jpg",
              caption: "Write one SELECT.",
              alt: "SELECT",
            },
            {
              src: "/games/database-sql/assets/book/m1-key.jpg",
              caption: "Circle the primary key.",
              alt: "Primary key",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Invent a 5-row students table. Write a SELECT that returns only names with score above 70.",
        },
        {
          type: "ul",
          items: [
            "Which columns did you select?",
            "What condition did you filter on?",
            "Which column is the primary key?",
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
          text: "Myth: SQL is only for experts. Better: SELECT with a clear WHERE is a beginner superpower.",
        },
        {
          type: "p",
          text: "Myth: Tables and spreadsheets are identical. Better: databases enforce types, keys, and multi-user rules.",
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
              src: "/games/database-sql/assets/book/m1-cover.jpg",
              caption: "Figure 5. Teach databases as tables you question with SELECT.",
              alt: "SQL mastery anchor",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Teach a friend in one minute: tables have rows and columns; primary keys identify rows; SELECT queries ask precise questions.",
        },
        {
          type: "ul",
          items: [
            "Sketch one table with a primary key",
            "Write one filter condition in words",
            "Use the word query correctly once",
          ],
        },
      ],
    },
  ],
};

export default BOOK;
