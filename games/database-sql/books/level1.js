/**
 * Database SQL Mission 1 book: Tables & Rows
 * Companion to the 4-spiral lesson (database → table/row → schema → SQL).
 */
export const BOOK = {
 missionIndex: 0,
 title: "Tables & Rows",
 subtitle: "organized shelves and precise questions",
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
 art: "/games/database-sql/assets/book/gen-db-m1-cover.png",
 },
 glossary: [
 { id: "database", term: "database" },
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
 title: "Open the storage room",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/database-sql/assets/book/gen-db-m1-fig01-table.png",
 caption: "Figure 1. A table is a shelf of records: rows of facts, columns of fields.",
 alt: "Database table with rows and columns",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Behind the kitchen door is the storage room - a database. Class registers, phone contacts, and shop sheets beat scattered piles because they are organized. A table is one shelf with a clear blueprint.",
 },
 {
 type: "ul",
 items: [
 "Spiral 1: what a database is for.",
 "Spiral 2: tables, rows, and columns.",
 "Spiral 3: schema rules that keep shelves honest.",
 "Spiral 4: SELECT queries that ask precise questions.",
 ],
 },
 ],
 },
 {
 title: "SELECT is asking",
 layout: "full-fig",
 figures: [
 {
 place: "full",
 src: "/games/database-sql/assets/book/gen-db-m1-fig02-select.png",
 caption: "Figure 2. SELECT picks which columns to bring back from a table.",
 alt: "SELECT query choosing columns from a table",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "A query is a precise question. SELECT names which columns you want. FROM names which table. You do not dig through every pile by hand - you fill a request form the database understands.",
 },
 {
 type: "ul",
 items: [
 "SELECT: which fields to show.",
 "FROM: which table to ask.",
 "Result: a smaller table answering the ask.",
 ],
 },
 ],
 },
 {
 title: "Filter the shelf",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/database-sql/assets/book/gen-db-m1-fig03-filter.png",
 caption: "Figure 3. A filter keeps only the rows that match your condition.",
 alt: "Filtering rows that match a condition",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Filtering answers ‘which rows?’ Find one customer, one class, one product that matches a rule. Without a filter you may get the whole shelf. With a filter you get the exact record you need.",
 },
 {
 type: "p",
 text: "Everyday hook: search contacts for one name. That is a filter on a column.",
 },
 ],
 },
 {
 title: "Keys keep identity",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/database-sql/assets/book/gen-db-m1-fig04-key.png",
 caption: "Figure 4. A primary key uniquely identifies each row.",
 alt: "Primary key uniquely labeling each row",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "A primary key is a unique ID for each row - like a locker number. Two customers can share a name; they should not share a key. Schema rules enforce that so the shelf stays trustworthy.",
 },
 {
 type: "ul",
 items: [
 "Unique: no two rows share the same key.",
 "Stable: the key stays with that record.",
 "Required: empty keys break identity.",
 ],
 },
 ],
 },
 {
 title: "Rows and columns",
 layout: "full-fig",
 figures: [
 {
 place: "full",
 src: "/games/database-sql/assets/book/gen-db-m1-fig06-rowcol.png",
 caption: "Figure 5. One row is one record. One column is one kind of fact.",
 alt: "Row versus column in a data table",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "A row is one whole record: one customer, one order, one student. A column is one kind of fact across records: name, phone, grade. Mix those ideas and the shelf becomes a mess of sticky notes.",
 },
 ],
 },
 {
 title: "Sort the answer",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/database-sql/assets/book/gen-db-m1-fig07-sort.png",
 caption: "Figure 6. Sorting orders the result so humans can scan it.",
 alt: "Sorted query results in order",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "After you select and filter, sort can line results by name, date, or score. The data did not change - only the reading order. A register sorted by roll number is still the same class.",
 },
 ],
 },
 {
 title: "Join related shelves",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/database-sql/assets/book/gen-db-m1-fig09-join.png",
 caption: "Figure 7. Related tables connect through shared keys - a join story.",
 alt: "Two tables joined by a shared key",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Real storage rooms have more than one shelf. Customers live on one table, orders on another. A join connects them through shared keys so you can ask ‘which orders belong to this customer?’ without copying every fact twice.",
 },
 ],
 },
 {
 title: "Request-form lab",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/database-sql/assets/book/gen-db-m1-fig05-lab.png",
 caption: "Figure 8. Fill a request form: SELECT, FROM, filter - then check the result.",
 alt: "SQL lab writing a simple query",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Build a Customers shelf in the mission, then ask for one customer by name or id. Turn the form into SQL words in your head: SELECT which columns, FROM which table, filter which rows.",
 },
 {
 type: "ul",
 items: [
 "Which columns do you need?",
 "What makes one row unique?",
 "Did your filter return zero, one, or many rows?",
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
 src: "/games/database-sql/assets/book/gen-db-m1-fig08-myth.png",
 caption: "Figure 9. A spreadsheet look-alike still needs keys and rules.",
 alt: "Myth busting database misconceptions",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Myth: a database is just a fancy spreadsheet. Better: tables look familiar, but keys and schema rules protect identity and truth.",
 },
 {
 type: "p",
 text: "Myth: SELECT deletes data. Better: SELECT reads; other statements change storage.",
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
 src: "/games/database-sql/assets/book/gen-db-m1-fig10-close.png",
 caption: "Figure 10. Teach tables, keys, and SELECT as precise questions to storage.",
 alt: "Tables and rows mastery overview",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Teach a friend in one minute: databases store tables; rows are records; columns are fields; primary keys identify; SELECT asks; filters narrow; related shelves connect through keys.",
 },
 {
 type: "ul",
 items: [
 "Name row versus column once.",
 "Explain why a primary key matters.",
 "Use the word SELECT correctly once.",
 ],
 },
 ],
 },
 ],
};

export default BOOK;
