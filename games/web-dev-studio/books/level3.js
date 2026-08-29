/**
 * Web Dev Studio Mission 3 book: JS Clicks
 * Companion to the 4-spiral lesson (events → functions → variables → toggle).
 */
export const BOOK = {
 missionIndex: 2,
 title: "JS Clicks",
 subtitle: "events, functions, and memory that make the house react",
 subject: "Web Dev Studio / JS Clicks",
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
 title: "JS Clicks",
 art: "/games/web-dev-studio/assets/book/gen-web-m3-cover.png",
 },
 glossary: [
 { id: "javascript", term: "JavaScript" },
 { id: "event", term: "event" },
 { id: "event-listener", term: "event listener" },
 { id: "function", term: "function" },
 { id: "variable", term: "variable" },
 { id: "dom", term: "DOM" },
 { id: "state", term: "state" },
 ],
 pages: [
 {
 title: "The house still will not react",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/web-dev-studio/assets/book/gen-web-m3-fig01-behavior.png",
 caption: "Figure 1. HTML built it. CSS painted it. JavaScript adds behavior.",
 alt: "Interactive behavior layer on a webpage",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "JavaScript is the wiring. A light switch that does nothing is a painted prop until code listens for a click and runs instructions. Game Start buttons, quiz taps, and ticket kiosks all hide the same pattern.",
 },
 {
 type: "ul",
 items: [
 "Spiral 1: listen for an event.",
 "Spiral 2: write reusable functions.",
 "Spiral 3: store values in variables.",
 "Spiral 4: combine them into a real toggle.",
 ],
 },
 ],
 },
 {
 title: "The DOM tree",
 layout: "full-fig",
 figures: [
 {
 place: "full",
 src: "/games/web-dev-studio/assets/book/gen-web-m3-fig02-dom.png",
 caption: "Figure 2. The DOM is the live tree of elements the browser built from HTML.",
 alt: "DOM tree of webpage elements",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "The DOM (Document Object Model) is the live map of your page. JavaScript finds a node, changes text, toggles a class, or shows and hides a room. You are not rewriting the file each click - you are updating the living tree.",
 },
 ],
 },
 {
 title: "Events and listeners",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/web-dev-studio/assets/book/gen-web-m3-fig03-event.png",
 caption: "Figure 3. An event happens; a listener is the ear that notices.",
 alt: "Click event reaching an event listener",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "An event is something that happens: click, key press, form submit. An event listener is code that waits for that something, then runs. No listener means the switch looks real and does nothing.",
 },
 {
 type: "ul",
 items: [
 "Event: the thing that happened.",
 "Listener: the ear attached to an element.",
 "Handler: the instructions that run next.",
 ],
 },
 ],
 },
 {
 title: "Functions are recipes",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/web-dev-studio/assets/book/gen-web-m3-fig04-function.png",
 caption: "Figure 4. One function can be called from many places.",
 alt: "Reusable function recipe block",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "A function is a named recipe of steps. Write it once, call it from a click, a timer, or another function. That is how a doorbell and a light switch can share the same ‘ring or flash’ logic without copying code twice.",
 },
 ],
 },
 {
 title: "Variables remember",
 layout: "full-fig",
 figures: [
 {
 place: "full",
 src: "/games/web-dev-studio/assets/book/gen-web-m3-fig05-var.png",
 caption: "Figure 5. A variable is a labeled box that holds a value for later.",
 alt: "Variable storage boxes holding values",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "A variable is a labeled box in memory. Counters, names, and on/off flags live there. Without variables, every click starts from amnesia. With them, a like count can climb and a toggle can remember if the light is already on.",
 },
 ],
 },
 {
 title: "Widgets that respond",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/web-dev-studio/assets/book/gen-web-m3-fig06-widget.png",
 caption: "Figure 6. Buttons and toggles become real when event, function, and state meet.",
 alt: "Interactive UI widget responding to clicks",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "A working widget is the three ideas together: listen for an event, run a function, update a variable and the DOM. That is a Start button, a like counter, or a form that shows an error on bad email.",
 },
 ],
 },
 {
 title: "State is the now",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/web-dev-studio/assets/book/gen-web-m3-fig07-state.png",
 caption: "Figure 7. State is what is true right now - on or off, open or closed.",
 alt: "On and off state of an interactive switch",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "State is the current truth the interface remembers. A toggle flips state, then the screen matches. HTML is the body, CSS the face, JavaScript the nervous system that keeps state and reaction aligned.",
 },
 ],
 },
 {
 title: "Listen carefully",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/web-dev-studio/assets/book/gen-web-m3-fig10-listen.png",
 caption: "Figure 8. Attach the right listener to the right element.",
 alt: "Ear listening for user interaction events",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Wire one button in the lab: click → function → change text or class. If nothing happens, check three places: wrong element, missing listener, or a function that never updates the DOM.",
 },
 {
 type: "ul",
 items: [
 "Which event are you listening for?",
 "Which function runs?",
 "What variable or DOM node changes?",
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
 src: "/games/web-dev-studio/assets/book/gen-web-m3-fig08-myth.png",
 caption: "Figure 9. Fancy CSS cannot replace a missing click listener.",
 alt: "Myth busting JavaScript misconceptions",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Myth: if it looks clickable, it works. Better: looks are CSS; reaction needs an event listener.",
 },
 {
 type: "p",
 text: "Myth: JavaScript is only for games. Better: almost every web form, menu, and counter uses the same event pattern.",
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
 src: "/games/web-dev-studio/assets/book/gen-web-m3-fig09-close.png",
 caption: "Figure 10. Teach the trio: event, function, variable - then a living toggle.",
 alt: "Complete interactive house mastery overview",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Teach a friend in one minute: JavaScript listens for events, runs functions, stores state in variables, and updates the DOM so the house reacts.",
 },
 {
 type: "ul",
 items: [
 "Name one event and one listener.",
 "Explain why a function is reusable.",
 "Use the word variable correctly once.",
 ],
 },
 ],
 },
 ],
};

export default BOOK;
