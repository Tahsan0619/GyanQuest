/**
 * Digital book - Backend Builder / Routes & APIs
 * Theory: cognitive load, dual coding, multimedia learning, constructivism,
 * conceptual change, spiral scaffold, retrieval practice.
 * Photos: local verified copies under /games/backend-builder/assets/book/ (see CREDITS-m2.json).
 */
export const BOOK = {
 missionIndex: 1,
 title: "Routes & APIs",
 subtitle: "paths & endpoints",
 subject: "Backend Builder / Routes & APIs",
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
 title: "Routes & APIs",
 art: "/games/backend-builder/assets/book/m2-cover.jpg",
 },
 glossary: [
 { id: "route", term: "route" },
 { id: "path", term: "path" },
 { id: "endpoint", term: "endpoint" },
 { id: "api", term: "api" },
 { id: "get", term: "get" },
 { id: "post", term: "post" },
 { id: "url", term: "url" },
 { id: "method", term: "method" },
 { id: "status", term: "status" },
 { id: "404", term: "404" },
 ],
 pages: [
 {
 title: "Why Routes & APIs?",
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
 src: "/games/backend-builder/assets/book/m2-hook.jpg",
 caption: "Figure 1. Dense modules still expose clear ports - routes are clear ports.",
 alt: "Chip",
 },
 {
 src: "/games/backend-builder/assets/book/m2-cover.jpg",
 caption: "Structures need labeled access points.",
 alt: "Structure",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "URLs are doors. Each route path does a job - /users, /posts, /login, /forecast, /grades, /checkout.",
 },
 {
 type: "p",
 text: "APIs expose those doors so apps can ask for the right room.",
 },
 {
 type: "p",
 text: "Everyday hook: a weather app hitting /forecast is knocking on one labeled door, not every door at once.",
 },
 ],
 },
 {
 title: "One path, one job",
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
 src: "/games/backend-builder/assets/book/m2-model.jpg",
 caption: "Figure 2. Planned paths in space - planned paths in APIs.",
 alt: "Orbit diagram",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Every URL is not the same job. /users lists people; /login checks identity; a wrong path can return 404 - not melted servers.",
 },
 {
 type: "ul",
 items: [
 "GET often reads",
 "POST often sends new data",
 "Methods are not just colors",
 ],
 },
 ],
 },
 {
 title: "Route dial",
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
 src: "/games/backend-builder/assets/book/m2-mechanism.jpg",
 caption: "Figure 3. Long-range links still need addresses.",
 alt: "Satellite communication",
 },
 {
 src: "/games/backend-builder/assets/book/m2-lab.jpg",
 caption: "Sketch doors on paper before coding them.",
 alt: "Education",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "In the lab you dialed route clarity until each door had a job label.",
 },
 {
 type: "p",
 text: "Rice is food, not a valid API route. Paths look like /users.",
 },
 ],
 },
 {
 title: "404 means not found",
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
 src: "/games/backend-builder/assets/book/m2-mastery.jpg",
 caption: "Figure 4. Cranes move to labeled positions - requests move to labeled routes.",
 alt: "Crane",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "A 404 says that route was not found. It is a map problem, not a volcano.",
 },
 {
 type: "p",
 text: "Kids can learn /users as a door with a job.",
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
 text: "Meet routes -> dial paths -> sort jobs -> stronger lab -> why methods -> name the route rule -> stretch school APIs -> myths -> fluency -> mastery.",
 },
 {
 type: "ul",
 items: [
 "Sorting maps paths to jobs",
 "Labs show 404 vs success",
 "Rule: each route path usually does one clear job",
 ],
 },
 ],
 },
 {
 title: "Street lab: door map",
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
 src: "/games/backend-builder/assets/book/m2-cover.jpg",
 caption: "Access points.",
 alt: "Structure",
 },
 {
 src: "/games/backend-builder/assets/book/m2-mastery.jpg",
 caption: "Labeled move.",
 alt: "Crane",
 },
 {
 src: "/games/backend-builder/assets/book/m2-model.jpg",
 caption: "Planned path.",
 alt: "Orbit",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Draw three doors: /forecast, /grades, /checkout. Write one sentence job on each.",
 },
 {
 type: "ul",
 items: [
 "Mark which might use GET vs POST",
 "Invent a 404 story for a typo path",
 "Flip carousel: structure vs crane positioning",
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
 text: "Myth: every URL is the same job. Better: each route path usually does one clear job.",
 },
 {
 type: "p",
 text: "Myth: 404 means the server melted. Better: 404 means that route was not found.",
 },
 {
 type: "p",
 text: "Myth: rice is a valid API route. Better: routes are paths like /users - not food.",
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
 src: "/games/backend-builder/assets/book/m2-mastery.jpg",
 caption: "Figure 5. Labeled positions - your route goal.",
 alt: "Crane anchor",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Teach a friend: URLs are doors; methods say how you ask; 404 means missing door.",
 },
 {
 type: "ul",
 items: [
 "Name three real-feeling routes",
 "Explain GET vs POST in kid words",
 "Use the word endpoint correctly once",
 ],
 },
 ],
 },
 ],
};

export default BOOK;
