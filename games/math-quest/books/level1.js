/**
 * Math Quest Mission 1 book: Number Sense
 * Companion to the 4-spiral lesson (counting → bundling → place value → why it matters).
 */
export const BOOK = {
 missionIndex: 0,
 title: "Number Sense",
 subtitle: "counting, grouping, and the secret logic of place value",
 subject: "Math Quest / Number Sense",
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
 title: "Number Sense",
 art: "/games/math-quest/assets/book/gen-mq-m1-cover.png",
 },
 glossary: [
 { id: "number", term: "number" },
 { id: "numeral", term: "numeral" },
 { id: "counting", term: "counting" },
 { id: "grouping", term: "grouping" },
 { id: "place-value", term: "place value" },
 { id: "expanded-form", term: "expanded form" },
 { id: "base-10", term: "base 10" },
 ],
 pages: [
 {
 title: "From a messy pile to 47",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/math-quest/assets/book/gen-mq-m1-fig01-dots.png",
 caption: "Figure 1. A jumble of dots is hard to trust. A numeral is not.",
 alt: "Messy dots versus the idea of a clear amount",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "This lesson is not counting from scratch. Most people can already read 47. The goal is the hidden logic: why we group in tens, why a digit's seat changes its meaning, and why 47 secretly means 4 tens and 7 ones.",
 },
 {
 type: "p",
 text: "A number is a pure amount. A numeral is the symbol we write for it, like 8. Counting matches each item to exactly one number word, in order, with none skipped or repeated.",
 },
 {
 type: "ul",
 items: [
 "Spiral 1: count items, then number vs numeral.",
 "Spiral 2: feel the slow one-by-one count, then bundle tens.",
 "Spiral 3: build 47 on a tens-and-ones workbench.",
 "Spiral 4: compare, watch a rollover, name base 10.",
 ],
 },
 ],
 },
 {
 title: "Why we bundle by tens",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/math-quest/assets/book/gen-mq-m1-fig02-tens.png",
 caption: "Figure 2. Four bundles of ten plus seven leftovers is easier than forty-seven loose dots.",
 alt: "Bundles of ten sticks plus leftovers",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "One-by-one counting falls apart once the pile gets big. Grouping into tens is faster and harder to mess up. We group in tens by convention, likely because humans have 10 fingers, not because the universe requires it.",
 },
 {
 type: "p",
 text: "4 bundles of ten, plus 7 leftover, is exactly why the numeral 47 looks the way it does.",
 },
 ],
 },
 {
 title: "Ten fingers, ten seats",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/math-quest/assets/book/gen-mq-m1-fig04-fingers.png",
 caption: "Figure 3. Ten fingers make a handy bundle size. That habit became the shape of our numerals.",
 alt: "Two open hands with ten fingers",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Base 10 is a human convenience that became a worldwide rule. Other cultures have used other bases. The deep idea is not 'ten is magic.' The deep idea is place value: a digit's seat multiplies its meaning.",
 },
 ],
 },
 {
 title: "Place value",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/math-quest/assets/book/gen-mq-m1-fig03-place.png",
 caption: "Figure 4. The same workbench: tens column, ones column, then the numeral.",
 alt: "Place value workbench with bead columns",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Place value is the value of a digit based on its position. Expanded form writes that out: 47 = (4 × 10) + (7 × 1). Read right to left: ones, then tens. Each new seat to the left is worth ten times the one before it.",
 },
 {
 type: "p",
 text: "82 = 8 tens + 2 ones. 15 = 1 ten + 5 ones. 30 = 3 tens + 0 ones. The zero is not empty decoration. It says: no leftovers in that seat.",
 },
 ],
 },
 {
 title: "Build 47 with blocks",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/math-quest/assets/book/gen-mq-m1-fig05-blocks.png",
 caption: "Figure 5. Four ten-rods and seven unit cubes. The numeral is just a short code for this picture.",
 alt: "Base-ten blocks showing tens and ones",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "On the tens-and-ones workbench you can feel place value. Move a rod into the tens seat and the amount jumps by ten. Add a cube to the ones seat and it jumps by one. The written numeral is a compressed version of that board.",
 },
 ],
 },
 {
 title: "Compare without guessing",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/math-quest/assets/book/gen-mq-m1-fig06-compare.png",
 caption: "Figure 6. Sort into tens and ones first. Then 38 versus 83 stops being a coin-flip.",
 alt: "Two coin piles sorted into tens and ones",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Once amounts are sorted into tens and ones, comparing 38 and 83 is obvious: more tens wins before you even look at ones. Place value turns comparison into a rule, not a vibe.",
 },
 ],
 },
 {
 title: "When a column fills up",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/math-quest/assets/book/gen-mq-m1-fig07-rollover.png",
 caption: "Figure 7. A column fills, resets, and hands one unit to the left. That is a rollover.",
 alt: "Counter rolling over with a carry glow",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Every odometer jump from 9 to 10, or 99 to 100, is place value happening live: a column fills, resets to zero, and hands one unit to the left. Addition carries are the same idea wearing homework clothes.",
 },
 ],
 },
 {
 title: "Base 10 named",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/math-quest/assets/book/gen-mq-m1-fig08-base10.png",
 caption: "Figure 8. Each seat to the left is worth ten times the seat before it.",
 alt: "Nested place-value seats glowing brighter leftward",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "All of that lives in the phrase base 10: a number system where each place is ten times the place to its right. Ones, tens, hundreds, thousands… same rule forever.",
 },
 ],
 },
 {
 title: "Same trick, different bundles",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/math-quest/assets/book/gen-mq-m1-fig10-binary.png",
 caption: "Figure 9. Computers use the same place-value logic in base 2, grouping by twos instead of tens.",
 alt: "Glowing on-off bits suggesting binary place value",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Computers use the same place-value logic in base 2 (binary), grouping by twos instead of tens. Same trick, a different-sized bundle. Once you own place value, other bases stop feeling like magic.",
 },
 ],
 },
 {
 title: "Number sense you can trust",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/math-quest/assets/book/gen-mq-m1-fig09-close.png",
 caption: "Figure 10. Bundles, seats, and numerals: one idea, many costumes.",
 alt: "Neat bundles of ten sticks in a classroom",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "You can now read 47 as an amount picture, not a random pair of digits. Next hunt: now that we can represent any number, what happens when we start combining them, adding and subtracting?",
 },
 ],
 },
 ],
};

export default BOOK;
