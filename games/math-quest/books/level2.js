/**
 * Digital book - Math Quest Mission 2: Fraction Friends
 * Theory: cognitive load, dual coding, multimedia learning, constructivism,
 * conceptual change, spiral scaffold, retrieval practice.
 * Photos: sunflower parts-of-a-whole + share scenes under assets/book/.
 */
export const BOOK = {
 missionIndex: 1,
 title: "Fraction Friends",
 subtitle: "equal shares of one whole",
 subject: "Math Quest / Fraction Friends",
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
 title: "Fraction Friends",
 art: "/games/math-quest/assets/book/m2-cover.jpg",
 },
 glossary: [
 { id: "fraction", term: "fraction" },
 { id: "whole", term: "whole" },
 { id: "equal-parts", term: "equal parts" },
 { id: "numerator", term: "numerator" },
 { id: "denominator", term: "denominator" },
 { id: "half", term: "half" },
 { id: "third", term: "third" },
 { id: "fourth", term: "fourth" },
 { id: "unit-fraction", term: "unit fraction" },
 ],
 pages: [
 {
 title: "Fair shares of roti and chocolate",
 layout: "text",
 theory: ["constructivism", "dual-coding", "cognitive-load"],
 figures: [
 {
 place: "top",
 slides: [
 {
 src: "/games/math-quest/assets/book/m2-hook.jpg",
 caption: "Figure 1. A flower head is one whole - petals and seeds are parts.",
 alt: "Sunflower head showing parts of a whole",
 },
 {
 src: "/games/math-quest/assets/book/m2-share.jpg",
 caption: "Sharing only works when the parts are equal.",
 alt: "River scene - continuous whole that can be portioned",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Cut a roti into two matching pieces and each person gets one half. Break a chocolate bar into equal squares and name the shaded part. Half an hour on a clock is one of two equal halves of sixty minutes.",
 },
 {
 type: "p",
 text: "A fraction names how many equal parts you take from one whole. Uneven scraps are not fair shares - so they are not the fractions we mean here.",
 },
 {
 type: "p",
 text: "Earn Fraction Friend by spotting equal parts before you name them.",
 },
 ],
 },
 {
 title: "One whole, then equal cuts",
 layout: "full-fig",
 theory: ["multimedia-learning", "dual-coding"],
 figures: [
 {
 place: "full",
 slides: [
 {
 src: "/games/math-quest/assets/book/m2-model.jpg",
 caption: "Figure 2. Model: keep the whole clear, then cut equal parts.",
 alt: "Abacus reminder that quantity needs clear units",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "First name the whole. Then cut it into equal parts. The denominator tells how many equal parts. The numerator tells how many you shade or take.",
 },
 {
 type: "ul",
 items: [
 "1/2 - one of two equal parts",
 "1/3 - one of three equal parts",
 "3/4 - three of four equal parts",
 ],
 },
 ],
 },
 {
 title: "Why equal matters",
 layout: "text",
 theory: ["cognitive-load", "dual-coding"],
 figures: [
 {
 place: "top",
 slides: [
 {
 src: "/games/math-quest/assets/book/m2-parts.jpg",
 caption: "Figure 3. Parts must match in size - otherwise the name lies.",
 alt: "Ocean surface as a continuous whole",
 },
 {
 src: "/games/math-quest/assets/book/m2-cover.jpg",
 caption: "Same whole, different fair cuts - halves, thirds, fourths.",
 alt: "Sunflower as whole with many equal-looking florets",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "If one 'half' of a chocolate bar is a tiny corner, that is not a half. Equal parts keep the fraction honest.",
 },
 {
 type: "p",
 text: "A unit fraction like 1/4 is one equal piece. Bigger numerators stack those unit pieces on the same whole.",
 },
 ],
 },
 {
 title: "Shade, then name",
 layout: "full-fig",
 theory: ["multimedia-learning", "spiral-scaffold"],
 figures: [
 {
 place: "full",
 slides: [
 {
 src: "/games/math-quest/assets/book/m2-hook.jpg",
 caption: "Figure 4. Representation: shaded equal regions map to numerator / denominator.",
 alt: "Sunflower used as shaded-parts metaphor",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Mission shading is a model. Real roti slices and clock hands are the same idea: show the part, say the fraction.",
 },
 ],
 },
 {
 title: "How the 10 steps connect",
 layout: "text",
 theory: ["spiral-scaffold", "cognitive-load"],
 blocks: [
 {
 type: "p",
 text: "Meet fair shares -> shade the whole -> sort equal or not -> parts lab -> name the parts -> name the fraction rule -> transfer to food and time -> myth bust -> fluency -> Fraction Friend mastery.",
 },
 {
 type: "ul",
 items: [
 "Sorting trains your eye for equal vs unequal",
 "Shading links picture to symbols",
 "The rule sentence names numerator and denominator",
 ],
 },
 ],
 },
 {
 title: "Kitchen and clock transfer",
 layout: "split",
 theory: ["constructivism", "dual-coding", "retrieval-practice"],
 figures: [
 {
 place: "right",
 slides: [
 {
 src: "/games/math-quest/assets/book/m2-cover.jpg",
 caption: "Share a round food like a flower head - equal wedges.",
 alt: "Sunflower as round whole",
 },
 {
 src: "/games/math-quest/assets/book/m2-share.jpg",
 caption: "Portion a continuous whole fairly.",
 alt: "River as continuous whole",
 },
 {
 src: "/games/math-quest/assets/book/m2-parts.jpg",
 caption: "Half an hour: one of two equal halves of the hour.",
 alt: "Wide surface as whole to partition",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Fold a paper roti into halves or fourths. Shade 1/2 or 3/4. Check that every piece matches.",
 },
 {
 type: "ul",
 items: [
 "What was the whole?",
 "Were the parts equal?",
 "Drag the photos to flip examples",
 ],
 },
 ],
 },
 {
 title: "Myths to bust",
 layout: "text",
 theory: ["conceptual-change"],
 blocks: [
 {
 type: "p",
 text: "Myth: Bigger denominator means bigger piece. Better: more equal cuts make each unit piece smaller - 1/8 is smaller than 1/2.",
 },
 {
 type: "p",
 text: "Myth: Any two pieces are halves. Better: halves must be equal. Uneven breaks are just pieces, not 1/2.",
 },
 {
 type: "p",
 text: "Red words are glossary terms. Tap one to ask the tutor.",
 },
 ],
 },
 {
 title: "Fraction Friend mastery",
 layout: "text",
 theory: ["retrieval-practice", "spiral-scaffold"],
 figures: [
 {
 place: "top",
 slides: [
 {
 src: "/games/math-quest/assets/book/m2-cover.jpg",
 caption: "Figure 5. Anchor: one whole, equal parts, then name the take.",
 alt: "Sunflower mastery anchor",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Teach a friend in one minute: a fraction names equal parts of one whole; the bottom number counts the cuts; the top number counts the parts you take.",
 },
 {
 type: "ul",
 items: [
 "Draw and shade 2/3 of a bar",
 "Reject one unequal 'half' sketch",
 "Say numerator and denominator correctly once",
 ],
 },
 ],
 },
 ],
};

export default BOOK;
