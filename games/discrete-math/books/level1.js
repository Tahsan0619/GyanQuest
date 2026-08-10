/**
 * Digital book - Discrete Math Mission 1: Logic Lite
 * Theory: cognitive load, dual coding, multimedia learning, constructivism,
 * conceptual change, spiral scaffold, retrieval practice.
 * Photos: assets/book-shared general theme (see assets/book/CREDITS-m1.json).
 */
export const BOOK = {
 missionIndex: 0,
 title: "Logic Lite",
 subtitle: "AND / OR / NOT",
 subject: "Discrete Math / Logic Lite",
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
 title: "Logic Lite",
 art: "/games/discrete-math/assets/book/m1-cover.jpg",
 },
 glossary: [
 { id: "and", term: "AND" },
 { id: "or", term: "OR" },
 { id: "not", term: "NOT" },
 { id: "gate", term: "gate" },
 { id: "true", term: "true" },
 { id: "false", term: "false" },
 { id: "condition", term: "condition" },
 { id: "decide", term: "decide" },
 ],
 pages: [
 {
 title: "Tiny rules that decide",
 layout: "text",
 theory: ["constructivism", "dual-coding", "cognitive-load"],
 figures: [
 {
 place: "top",
 slides: [
 {
 src: "/games/discrete-math/assets/book/m1-cover.jpg",
 caption: "Figure 1. Learning spaces are full of yes/no choices waiting for clear rules.",
 alt: "Education setting",
 },
 {
 src: "/games/discrete-math/assets/book/m1-hook.jpg",
 caption: "Notebooks capture conditions: if this and that, then go.",
 alt: "Notebook for writing conditions",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "AND, OR, and NOT are tiny decision rules. They take true/false inputs and return one clear answer.",
 },
 {
 type: "p",
 text: "You already use them outside class: both shoes on (AND), bus or rickshaw (OR), not raining (NOT).",
 },
 {
 type: "p",
 text: "Computers call these gates. The names stay honest: every input matters in a fixed way.",
 },
 ],
 },
 {
 title: "Three gates, three jobs",
 layout: "full-fig",
 theory: ["multimedia-learning", "dual-coding"],
 figures: [
 {
 place: "full",
 slides: [
 {
 src: "/games/discrete-math/assets/book/m1-model.jpg",
 caption: "Figure 2. Lab thinking: test one condition at a time, then combine.",
 alt: "Laboratory investigation setting",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "ul",
 items: [
 "AND: true only if every input is true",
 "OR: true if at least one input is true",
 "NOT: flips true to false, false to true",
 ],
 },
 {
 type: "p",
 text: "Mix them carefully. NOT first can change what AND or OR will see.",
 },
 ],
 },
 {
 title: "On, off, and the flip",
 layout: "text",
 theory: ["cognitive-load", "dual-coding"],
 figures: [
 {
 place: "top",
 slides: [
 {
 src: "/games/discrete-math/assets/book/m1-mechanism.jpg",
 caption: "Figure 3. A bulb is a blunt model of true/false - lit or dark.",
 alt: "Incandescent light bulb",
 },
 {
 src: "/games/discrete-math/assets/book/m1-detail.jpg",
 caption: "Classroom checks: state the rule, then test with examples.",
 alt: "Science classroom",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Picture each condition as a switch. AND needs every switch on. OR needs any switch on. NOT inverts a switch.",
 },
 {
 type: "p",
 text: "Saying the rule aloud prevents fuzzy English like and/or when you meant one precise gate.",
 },
 ],
 },
 {
 title: "Chain reactions of choice",
 layout: "full-fig",
 theory: ["multimedia-learning", "spiral-scaffold"],
 figures: [
 {
 place: "full",
 slides: [
 {
 src: "/games/discrete-math/assets/book/m1-transfer.webp",
 caption: "Figure 4. One click can pass along a line - logic chains work the same with truth values.",
 alt: "Newton cradle showing chain transfer",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Daily decisions often nest: leave home if (bag packed AND homework done) OR (teacher said holiday). Write the gates before you argue.",
 },
 ],
 },
 {
 title: "Logic Learner path",
 layout: "text",
 theory: ["spiral-scaffold", "cognitive-load"],
 blocks: [
 {
 type: "p",
 text: "The mission introduced AND/OR/NOT, clarified gates, sorted logic vs not-logic, ran a gate lab, then locked the decide rule.",
 },
 {
 type: "ul",
 items: [
 "Sort: real gate language vs vague talk",
 "Gate lab: watch outputs flip with inputs",
 "Stretch: apply gates to daily decide moments",
 ],
 },
 {
 type: "p",
 text: "Small steps avoided overload. This page keeps the full gate toolkit.",
 },
 ],
 },
 {
 title: "Shoes, rides, rain",
 layout: "split",
 theory: ["constructivism", "dual-coding", "retrieval-practice"],
 figures: [
 {
 place: "right",
 slides: [
 {
 src: "/games/discrete-math/assets/book/m1-hook.jpg",
 caption: "Write: both shoes on -> AND.",
 alt: "Notebook for AND example",
 },
 {
 src: "/games/discrete-math/assets/book/m1-mechanism.jpg",
 caption: "Bus OR rickshaw - either true is enough.",
 alt: "On/off bulb as truth model",
 },
 {
 src: "/games/discrete-math/assets/book/m1-detail.jpg",
 caption: "NOT raining - flip the weather condition.",
 alt: "Classroom practice",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Build three sentences with AND, OR, and NOT from your morning routine.",
 },
 {
 type: "ul",
 items: [
 "Which sentence fails if one part is false?",
 "Which sentence still works with one true part?",
 "Where does NOT change the plan?",
 ],
 },
 ],
 },
 {
 title: "Logic myths",
 layout: "text",
 theory: ["conceptual-change"],
 blocks: [
 {
 type: "p",
 text: "Myth: OR means exactly one. Better: plain OR is true when one or both inputs are true (unless you say exclusive).",
 },
 {
 type: "p",
 text: "Myth: AND is the same as adding feelings. Better: AND is a strict both-must-be-true rule.",
 },
 {
 type: "p",
 text: "Myth: NOT is rude. Better: NOT is only a flip of true/false, not a mood.",
 },
 {
 type: "p",
 text: "Red gate words - AND, OR, NOT - are tutor hotspots.",
 },
 ],
 },
 {
 title: "Logic Learner mastery",
 layout: "text",
 theory: ["retrieval-practice", "spiral-scaffold"],
 figures: [
 {
 place: "top",
 slides: [
 {
 src: "/games/discrete-math/assets/book/m1-cover.jpg",
 caption: "Figure 5. Teach gates with one everyday decide story.",
 alt: "Education setting as logic anchor",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Teach in one minute: AND needs all, OR needs any, NOT flips; shoes, rides, and rain are enough to show each gate.",
 },
 {
 type: "ul",
 items: [
 "Act out AND with two conditions",
 "Act out OR with two travel choices",
 "Use the word gate correctly once",
 ],
 },
 ],
 },
 ],
};

export default BOOK;
