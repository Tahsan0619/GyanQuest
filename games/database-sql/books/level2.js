/**
 * Digital book - Database SQL / SELECT Stories
 * Theory: cognitive load, dual coding, multimedia learning, constructivism,
 * conceptual change, spiral scaffold, retrieval practice.
 * Photos: local verified copies under /games/database-sql/assets/book/ (see CREDITS-m2.json).
 */
export const BOOK = {
 missionIndex: 1,
 title: "SELECT Stories",
 subtitle: "query basics",
 subject: "Database SQL / SELECT Stories",
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
 title: "SELECT Stories",
 art: "/games/database-sql/assets/book/m2-cover.jpg",
 },
 glossary: [
 { id: "select", term: "select" },
 { id: "from", term: "from" },
 { id: "where", term: "where" },
 { id: "query", term: "query" },
 { id: "filter", term: "filter" },
 { id: "result", term: "result" },
 { id: "clause", term: "clause" },
 { id: "column", term: "column" },
 { id: "row", term: "row" },
 { id: "keyword", term: "keyword" },
 ],
 pages: [
 {
 title: "Why SELECT Stories?",
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
 src: "/games/database-sql/assets/book/m2-hook.jpg",
 caption: "Figure 1. Processors run instructions - SELECT is an instruction to read.",
 alt: "Chip",
 },
 {
 src: "/games/database-sql/assets/book/m2-cover.jpg",
 caption: "Graphs answer questions that started as SELECT.",
 alt: "Graph",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Ask the table with SELECT. FROM picks which table. WHERE filters which rows get to answer.",
 },
 {
 type: "p",
 text: "Find contacts in Dhaka, list class 5 names, show items in stock - all are questions, not rewrites.",
 },
 {
 type: "p",
 text: "Everyday hook: searching your phone contacts by city is a WHERE in disguise.",
 },
 ],
 },
 {
 title: "Read, don't smash",
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
 src: "/games/database-sql/assets/book/m2-model.jpg",
 caption: "Figure 2. Lab questions are precise - so are good queries.",
 alt: "Laboratory",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "SELECT mainly reads. It does not rewrite the whole table when you only want a list.",
 },
 {
 type: "ul",
 items: [
 "Pick only the columns you need",
 "WHERE narrows the story",
 "FROM names the table you are asking",
 ],
 },
 ],
 },
 {
 title: "Query dial",
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
 src: "/games/database-sql/assets/book/m2-mechanism.jpg",
 caption: "Figure 3. Planned paths - queries follow a planned ask.",
 alt: "Orbit diagram",
 },
 {
 src: "/games/database-sql/assets/book/m2-lab.jpg",
 caption: "Signals carry answers back - like a result set.",
 alt: "Satellite communication",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "In the lab you sharpened the question until the result set felt right - not too wide, not empty.",
 },
 {
 type: "p",
 text: "A fuzzy question returns noise. A clear WHERE returns a usable story.",
 },
 ],
 },
 {
 title: "Filter the story",
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
 src: "/games/database-sql/assets/book/m2-mastery.jpg",
 caption: "Figure 4. Counting tools reward precise asks.",
 alt: "Abacus",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "WHERE city = 'Dhaka' keeps Dhaka rows. Without WHERE, you get everyone - sometimes useful, often too much.",
 },
 {
 type: "p",
 text: "Kids can write clear questions; tea is a drink, not a SQL keyword.",
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
 text: "Meet SELECT -> dial query -> sort clauses -> stronger lab -> why filter -> name the query rule -> stretch contacts -> myths -> fluency -> mastery.",
 },
 {
 type: "ul",
 items: [
 "Sorting separates SELECT / FROM / WHERE jobs",
 "Labs prove filters change the answer set",
 "Rule: SELECT asks; WHERE filters; tables stay intact",
 ],
 },
 ],
 },
 {
 title: "Street lab: contact filter",
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
 src: "/games/database-sql/assets/book/m2-hook.jpg",
 caption: "Instruction.",
 alt: "Chip",
 },
 {
 src: "/games/database-sql/assets/book/m2-cover.jpg",
 caption: "Answer shape.",
 alt: "Graph",
 },
 {
 src: "/games/database-sql/assets/book/m2-mastery.jpg",
 caption: "Precise count.",
 alt: "Abacus",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "On paper, write SELECT name FROM contacts WHERE city = 'Dhaka'. Circle each clause.",
 },
 {
 type: "ul",
 items: [
 "Change WHERE and predict the new list",
 "Explain why SELECT is not a hammer",
 "Flip carousel: chip instruction vs result graph",
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
 text: "Myth: SELECT always changes the table. Better: SELECT mainly reads - it does not rewrite rows.",
 },
 {
 type: "p",
 text: "Myth: WHERE is just decoration. Better: WHERE filters which rows answer the question.",
 },
 {
 type: "p",
 text: "Myth: tea is a SQL keyword. Better: SELECT FROM WHERE are keywords - tea is a drink.",
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
 src: "/games/database-sql/assets/book/m2-mastery.jpg",
 caption: "Figure 5. Precise asks - your SELECT goal.",
 alt: "Abacus anchor",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Teach a friend: ask with SELECT, pick the table with FROM, filter with WHERE.",
 },
 {
 type: "ul",
 items: [
 "Write one query for in-stock items",
 "Say what stays unchanged in the table",
 "Use the word filter correctly once",
 ],
 },
 ],
 },
 ],
};

export default BOOK;
