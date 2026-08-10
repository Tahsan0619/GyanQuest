/**
 * Digital book - Database SQL / Keys & Joins
 * Theory: cognitive load, dual coding, multimedia learning, constructivism,
 * conceptual change, spiral scaffold, retrieval practice.
 * Photos: local verified copies under /games/database-sql/assets/book/ (see CREDITS-m3.json).
 */
export const BOOK = {
 missionIndex: 2,
 title: "Keys & Joins",
 subtitle: "linking tables",
 subject: "Database SQL / Keys & Joins",
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
 title: "Keys & Joins",
 art: "/games/database-sql/assets/book/m3-cover.jpg",
 },
 glossary: [
 { id: "key", term: "key" },
 { id: "primary", term: "primary" },
 { id: "foreign", term: "foreign" },
 { id: "join", term: "join" },
 { id: "match", term: "match" },
 { id: "link", term: "link" },
 { id: "unique", term: "unique" },
 { id: "orphan", term: "orphan" },
 { id: "table", term: "table" },
 { id: "id", term: "id" },
 ],
 pages: [
 {
 title: "Why Keys & Joins?",
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
 src: "/games/database-sql/assets/book/m3-hook.jpg",
 caption: "Figure 1. Structures stand when parts connect - tables stand when keys connect.",
 alt: "Structure",
 },
 {
 src: "/games/database-sql/assets/book/m3-cover.jpg",
 caption: "Bridges link two sides - JOINs link two tables.",
 alt: "Bridge",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Student + class list, order + order items, ticket + seat - related stories live in more than one table.",
 },
 {
 type: "p",
 text: "Keys link those tables. JOIN matches key values so the story stays connected.",
 },
 {
 type: "p",
 text: "Everyday hook: a bus ticket number must match a seat row - that match is a join idea.",
 },
 ],
 },
 {
 title: "What makes a key",
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
 src: "/games/database-sql/assets/book/m3-model.jpg",
 caption: "Figure 2. Systems keep IDs consistent across modules - so should your keys.",
 alt: "ISS computer",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "A good key uniquely identifies a row. Random scribbles that collide break the link.",
 },
 {
 type: "ul",
 items: [
 "Primary ideas: one id per student",
 "Foreign ideas: class_id pointing to a class row",
 "Orphan rows lose their story link",
 ],
 },
 ],
 },
 {
 title: "Join dial",
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
 src: "/games/database-sql/assets/book/m3-mechanism.jpg",
 caption: "Figure 3. Patterns of pairing - join matches are patterned equality checks.",
 alt: "Pattern",
 },
 {
 src: "/games/database-sql/assets/book/m3-lab.jpg",
 caption: "Practice linking on paper before typing JOIN.",
 alt: "Classroom",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "In the lab you raised link strength until matching keys lined up. JOIN ON is the handshake, not tape or socks.",
 },
 {
 type: "p",
 text: "If keys do not match, the combined story has holes.",
 },
 ],
 },
 {
 title: "Match across tables",
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
 src: "/games/database-sql/assets/book/m3-mastery.jpg",
 caption: "Figure 4. Another bridge view - connection is the point.",
 alt: "Bridge span",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "JOIN students to classes on class_id. Now each student row can carry a class name without copying the whole class table into every row forever.",
 },
 {
 type: "p",
 text: "Related stories need links; they do not need duplicate chaos.",
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
 text: "Meet keys -> dial links -> sort key types -> stronger join lab -> why match -> name the join rule -> stretch tickets -> myths -> fluency -> mastery.",
 },
 {
 type: "ul",
 items: [
 "Sorting separates unique ids from random numbers",
 "Labs show JOIN matches values",
 "Rule: keys link tables; JOIN matches those keys",
 ],
 },
 ],
 },
 {
 title: "Street lab: ticket + seat",
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
 src: "/games/database-sql/assets/book/m3-cover.jpg",
 caption: "Link sides.",
 alt: "Bridge",
 },
 {
 src: "/games/database-sql/assets/book/m3-hook.jpg",
 caption: "Connected parts.",
 alt: "Structure",
 },
 {
 src: "/games/database-sql/assets/book/m3-mechanism.jpg",
 caption: "Match patterns.",
 alt: "Pattern",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Draw two mini tables: tickets(id, seat_id) and seats(id, row). Draw lines where ids match.",
 },
 {
 type: "ul",
 items: [
 "Find an orphan ticket with no seat",
 "Explain why socks are not join tools",
 "Flip carousel: bridge vs structure metaphor",
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
 text: "Myth: tables never need to link. Better: related stories use keys to stay connected.",
 },
 {
 type: "p",
 text: "Myth: JOIN glues with tape. Better: JOIN matches key values between tables.",
 },
 {
 type: "p",
 text: "Myth: socks join tables. Better: keys and JOIN ON match fields - not socks.",
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
 src: "/games/database-sql/assets/book/m3-mastery.jpg",
 caption: "Figure 5. Connection - your join goal.",
 alt: "Bridge anchor",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Teach a friend: unique keys identify rows; JOIN matches keys across tables so stories connect.",
 },
 {
 type: "ul",
 items: [
 "Invent two tables that should link",
 "Name the shared key field",
 "Use the word join correctly once",
 ],
 },
 ],
 },
 ],
};

export default BOOK;
