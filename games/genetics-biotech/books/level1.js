/**
 * Digital book - Genetics & Biotech Mission 1: Trait Tokens
 * Theory: cognitive load, dual coding, multimedia learning, constructivism,
 * conceptual change, spiral scaffold, retrieval practice.
 * Photos: assets/book-shared biology theme (see assets/book/CREDITS-m1.json).
 */
export const BOOK = {
 missionIndex: 0,
 title: "Trait Tokens",
 subtitle: "inherited vs not",
 subject: "Genetics Biotech / Trait Tokens",
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
 title: "Trait Tokens",
 art: "/games/genetics-biotech/assets/book/m1-cover.jpg",
 },
 glossary: [
 { id: "trait", term: "trait" },
 { id: "inherited", term: "inherited" },
 { id: "gene", term: "gene" },
 { id: "parent", term: "parent" },
 { id: "family", term: "family" },
 { id: "learned", term: "learned" },
 { id: "variation", term: "variation" },
 { id: "offspring", term: "offspring" },
 ],
 pages: [
 {
 title: "What can pass down",
 layout: "text",
 theory: ["constructivism", "dual-coding", "cognitive-load"],
 figures: [
 {
 place: "top",
 slides: [
 {
 src: "/games/genetics-biotech/assets/book/m1-cover.jpg",
 caption: "Figure 1. Cells carry instructions - some traits travel with them across generations.",
 alt: "Cell imagery",
 },
 {
 src: "/games/genetics-biotech/assets/book/m1-hook.jpg",
 caption: "Sunflowers share family patterns, yet each bloom still varies.",
 alt: "Sunflower plant",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "A trait is a feature you can notice: eye color clues, hair type, dimples. Some traits are inherited from parents. Others are learned or caused by environment.",
 },
 {
 type: "p",
 text: "Inherited vs not is the first sorting skill in genetics. Family eye colors can hint at inheritance; a haircut cannot.",
 },
 {
 type: "p",
 text: "Mirror checks, classmate dimples, and family photos are gentle places to practice - never as a way to judge people.",
 },
 ],
 },
 {
 title: "Living patterns",
 layout: "full-fig",
 theory: ["multimedia-learning", "dual-coding"],
 figures: [
 {
 place: "full",
 slides: [
 {
 src: "/games/genetics-biotech/assets/book/m1-model.jpg",
 caption: "Figure 2. Plants show inherited structure plus environment - sun, water, soil.",
 alt: "Plant growth",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Offspring resemble parents because information passes through genes. That does not mean every detail is fixed or that one trait defines a person.",
 },
 {
 type: "ul",
 items: [
 "Inherited: often visible across relatives",
 "Not inherited: skills, scars, dyed hair, practiced habits",
 "Mixed: height and health also meet food, sleep, and care",
 ],
 },
 ],
 },
 {
 title: "Clues, not fortune telling",
 layout: "text",
 theory: ["cognitive-load", "dual-coding"],
 figures: [
 {
 place: "top",
 slides: [
 {
 src: "/games/genetics-biotech/assets/book/m1-mechanism.jpg",
 caption: "Figure 3. Leaves vary even on one plant - variation is normal.",
 alt: "Leaf close-up",
 },
 {
 src: "/games/genetics-biotech/assets/book/m1-detail.jpg",
 caption: "Microscopes reveal structure; they do not assign destiny.",
 alt: "Microscope investigation",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Family clues help you sort inherited vs not. They do not let you predict a person's worth, future, or every feature.",
 },
 {
 type: "p",
 text: "If a trait appears after practice or injury, put it in the not-inherited bin for this mission.",
 },
 ],
 },
 {
 title: "Environment leaves marks",
 layout: "full-fig",
 theory: ["multimedia-learning", "spiral-scaffold"],
 figures: [
 {
 place: "full",
 slides: [
 {
 src: "/games/genetics-biotech/assets/book/m1-transfer.jpg",
 caption: "Figure 4. Cold and warmth change living systems - environment matters beside inheritance.",
 alt: "Ice and cold environment",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Genes load the starting kit. Weather, food, learning, and chance still shape what you see. Sorting carefully keeps both ideas honest.",
 },
 ],
 },
 {
 title: "Trait Tracker path",
 layout: "text",
 theory: ["spiral-scaffold", "cognitive-load"],
 blocks: [
 {
 type: "p",
 text: "Mission arc: meet trait tokens, clarify inherited vs not, sort examples, run a family-clue lab, then name why some traits pass.",
 },
 {
 type: "ul",
 items: [
 "Sort bins stop mix-ups early",
 "Family clue lab uses respectful examples only",
 "Rule: some traits inherit; many visible features do not",
 ],
 },
 {
 type: "p",
 text: "Short labs first. Full sorting story here.",
 },
 ],
 },
 {
 title: "Eyes, hair, dimples",
 layout: "split",
 theory: ["constructivism", "dual-coding", "retrieval-practice"],
 figures: [
 {
 place: "right",
 slides: [
 {
 src: "/games/genetics-biotech/assets/book/m1-hook.jpg",
 caption: "Family patterns - compare gently, never tease.",
 alt: "Sunflower as family pattern metaphor",
 },
 {
 src: "/games/genetics-biotech/assets/book/m1-model.jpg",
 caption: "Hair in the mirror - which parts are style vs biology?",
 alt: "Plant variation",
 },
 {
 src: "/games/genetics-biotech/assets/book/m1-detail.jpg",
 caption: "Dimples and other clues - sort inherited vs practiced.",
 alt: "Microscope for close looking",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "List three features. Mark each inherited, not inherited, or need-more-info.",
 },
 {
 type: "ul",
 items: [
 "What evidence is a family clue?",
 "What evidence is learning or choice?",
 "What should stay private and respectful?",
 ],
 },
 ],
 },
 {
 title: "Trait myths",
 layout: "text",
 theory: ["conceptual-change"],
 blocks: [
 {
 type: "p",
 text: "Myth: Everything about you is inherited. Better: many traits are learned, environmental, or mixed.",
 },
 {
 type: "p",
 text: "Myth: One parent trait always appears unchanged. Better: inheritance can skip, blend in looks, or need two copies - this mission only starts the idea.",
 },
 {
 type: "p",
 text: "Myth: Inherited means better. Better: inherited only means passed biologically, not ranked.",
 },
 {
 type: "p",
 text: "Red words such as trait or inherited open tutor help.",
 },
 ],
 },
 {
 title: "Trait Tracker mastery",
 layout: "text",
 theory: ["retrieval-practice", "spiral-scaffold"],
 figures: [
 {
 place: "top",
 slides: [
 {
 src: "/games/genetics-biotech/assets/book/m1-cover.jpg",
 caption: "Figure 5. Teach inherited vs not with one careful example.",
 alt: "Cell image as trait anchor",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Teach in one minute: some traits pass from parents; skills and many styled features do not; sort with respect.",
 },
 {
 type: "ul",
 items: [
 "Give one inherited example and one not-inherited example",
 "Explain why a haircut does not inherit",
 "Use the word trait correctly once",
 ],
 },
 ],
 },
 ],
};

export default BOOK;
