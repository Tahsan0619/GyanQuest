/**
 * ICT Fundamentals Mission 1 book: Computer Basics
 * Companion curriculum book (input-process-output-storage).
 */
export const BOOK = {
 missionIndex: 0,
 title: "Computer Basics",
 subtitle: "the four jobs every computer repeats",
 subject: "ICT Fundamentals / Computer Basics",
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
 title: "Computer Basics",
 art: "/games/ict-fundamentals/assets/book/gen-ict-m1-cover.png",
 },
 glossary: [
 { id: "input", term: "input" },
 { id: "process", term: "process" },
 { id: "output", term: "output" },
 { id: "storage", term: "storage" },
 { id: "hardware", term: "hardware" },
 { id: "software", term: "software" },
 { id: "cpu", term: "CPU" },
 ],
 pages: [
 {
 title: "A machine with a loop",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/ict-fundamentals/assets/book/gen-ict-m1-fig01-input.png",
 caption: "Figure 1. Keyboard and mouse are classic input tools: they send signals in.",
 alt: "Keyboard and mouse sending input",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Every useful computer task follows a loop: input → process → output, with storage keeping work for later. That four-job loop is the whole mental model.",
 },
 {
 type: "p",
 text: "Everyday hook: typing a chat message. Fingers input, the phone processes, the screen shows output, the app stores the chat.",
 },
 {
 type: "ul",
 items: [
 "Meet the four jobs.",
 "Sort devices into IPOS.",
 "Trace one real task end to end.",
 "Separate hardware from software.",
 ],
 },
 ],
 },
 {
 title: "Process: the CPU",
 layout: "full-fig",
 figures: [
 {
 place: "full",
 src: "/games/ict-fundamentals/assets/book/gen-ict-m1-fig02-cpu.png",
 caption: "Figure 2. The CPU is the main process chip. It follows instructions at high speed.",
 alt: "CPU processor chip",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Process means transforming data according to instructions. The CPU does not 'know ideas.' It follows software steps on data that input delivered.",
 },
 {
 type: "ul",
 items: [
 "Input devices: keyboard, mouse, mic, camera, touchscreen.",
 "Process: CPU and programs transform data.",
 "Without clear input, process has nothing useful to do.",
 ],
 },
 ],
 },
 {
 title: "Output: talking back",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/ict-fundamentals/assets/book/gen-ict-m1-fig03-output.png",
 caption: "Figure 3. A monitor is output: it shows results humans can read.",
 alt: "Computer monitor as output",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Output can be screen, speaker, printer, or even a motor in a robot. It is the computer talking back to the world after process finishes a step.",
 },
 ],
 },
 {
 title: "Storage: keep it for later",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/ict-fundamentals/assets/book/gen-ict-m1-fig04-storage.png",
 caption: "Figure 4. Drives and chips provide storage so work survives after you close a window.",
 alt: "Storage drive and memory chips",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Storage holds files and programs. Fast short-term memory and longer disk storage play different roles, but both keep data. Without storage, every restart would feel like amnesia.",
 },
 ],
 },
 {
 title: "The IPOS loop",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/ict-fundamentals/assets/book/gen-ict-m1-fig05-ipos.png",
 caption: "Figure 5. Input, process, output, storage: one loop, repeated forever.",
 alt: "Four-job IPOS cycle diagram",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Name the four jobs in order and you can explain almost any device. The mission rule sentence is simply that loop.",
 },
 ],
 },
 {
 title: "Hardware and software",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/ict-fundamentals/assets/book/gen-ict-m1-fig06-hardsoft.png",
 caption: "Figure 6. Hardware is the physical stuff. Software is the instructions.",
 alt: "Physical parts versus glowing instruction streams",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Hardware is the physical stuff you can touch. Software is the instructions that tell hardware what to do. A laptop without software is a paperweight. Software without hardware is a script with nowhere to run.",
 },
 ],
 },
 {
 title: "Trace one task",
 layout: "full-fig",
 figures: [
 {
 place: "full",
 src: "/games/ict-fundamentals/assets/book/gen-ict-m1-fig07-task.png",
 caption: "Figure 7. Open a saved drawing: storage loads, process edits, screen outputs, save writes storage again.",
 alt: "Child editing a drawing on a tablet",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Example: open a saved drawing. Storage loads the file, software plus CPU process edits, the screen outputs pixels, save writes storage again. Start any task at input, then name the rest.",
 },
 ],
 },
 {
 title: "Desk lab",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/ict-fundamentals/assets/book/gen-ict-m1-fig08-desk.png",
 caption: "Figure 8. Pick a phone or PC task. Label all four jobs. No empty boxes.",
 alt: "Desk with phone, PC, and peripherals",
 },
 ],
 blocks: [
 {
 type: "ul",
 items: [
 "Which part is hardware?",
 "Which part is software?",
 "Where does the CPU sit in your story?",
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
 src: "/games/ict-fundamentals/assets/book/gen-ict-m1-fig09-myth.png",
 caption: "Figure 9. The screen is mostly output. Process happens in chips inside.",
 alt: "Screen versus internal chips",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Myth: the screen is the computer. Better: the screen is mostly output; process happens in chips inside.",
 },
 {
 type: "p",
 text: "Myth: storage and memory are the same word game. Better: both keep data, but they are different hardware jobs.",
 },
 ],
 },
 {
 title: "Mastery",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/ict-fundamentals/assets/book/gen-ict-m1-fig10-close.png",
 caption: "Figure 10. Teach the IPOS loop from this hardware view.",
 alt: "Friendly computer basics overview",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Teach a friend in one minute: computers loop input-process-output; storage keeps work; hardware runs software.",
 },
 {
 type: "ul",
 items: [
 "Name one device for each of the four jobs.",
 "Separate hardware from software once.",
 "Use the word CPU correctly once.",
 ],
 },
 ],
 },
 ],
};

export default BOOK;
