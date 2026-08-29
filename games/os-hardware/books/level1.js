/**
 * Digital book - OS Hardware Mission 1: Inside the Box
 * Unique curriculum book (CPU, RAM, storage, OS role). Not a template fill-in.
 */
export const BOOK = {
 missionIndex: 0,
 title: "Inside the Box",
 subtitle: "hardware parts and the OS that bosses them",
 subject: "OS Hardware / Inside the Box",
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
 title: "Inside the Box",
 art: "/games/os-hardware/assets/book/m1-cover.jpg",
 },
 glossary: [
 { id: "operating-system", term: "operating system" },
 { id: "cpu", term: "CPU" },
 { id: "ram", term: "RAM" },
 { id: "storage-drive", term: "storage drive" },
 { id: "process", term: "process" },
 { id: "driver", term: "driver" },
 { id: "kernel", term: "kernel" },
 ],
 pages: [
 {
 title: "Parts with jobs",
 layout: "text",
 figures: [
 {
 place: "top",
 slides: [
 {
 src: "/games/os-hardware/assets/book/m1-cover.jpg",
 caption: "Figure 1. Inside a computer: CPU, memory, and drives must cooperate.",
 alt: "Computer internals",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "The CPU executes instructions. RAM holds working data temporarily. A storage drive keeps files when power is gone.",
 },
 {
 type: "p",
 text: "The operating system is the boss software that shares those parts among many programs fairly.",
 },
 ],
 },
 {
 title: "Processes and drivers",
 layout: "full-fig",
 figures: [
 {
 place: "full",
 slides: [
 {
 src: "/games/os-hardware/assets/book/m1-hook.jpg",
 caption: "Figure 2. Each running app is a process the OS schedules onto the CPU.",
 alt: "Processes concept",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "ul",
 items: [
 "Kernel: core of the OS that talks to hardware",
 "Driver: translator so a device makes sense to the OS",
 "Process: a running program with its own memory space",
 ],
 },
 ],
 },
 {
 title: "How the mission connects",
 layout: "text",
 blocks: [
 {
 type: "p",
 text: "Meet parts → map OS jobs → open a process view → lab bottleneck → explain → rule → stretch → myth → fluency → mastery.",
 },
 ],
 },
 {
 title: "Bottleneck lab",
 layout: "split",
 figures: [
 {
 place: "right",
 slides: [
 {
 src: "/games/os-hardware/assets/book/m1-model.jpg",
 caption: "Is the stall CPU, RAM, or storage?",
 alt: "Bottleneck check",
 },
 {
 src: "/games/os-hardware/assets/book/m1-cover.jpg",
 caption: "Point to each hardware role.",
 alt: "Hardware roles",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "When a laptop feels slow, ask which resource is busy: CPU grind, RAM full, or storage thrash.",
 },
 ],
 },
 {
 title: "Myths to bust",
 layout: "text",
 blocks: [
 {
 type: "p",
 text: "Myth: Closing windows always frees everything instantly. Better: processes and caches may still hold RAM until the OS reclaims it.",
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
 slides: [
 {
 src: "/games/os-hardware/assets/book/m1-hook.jpg",
 caption: "Figure 3. Teach the box as hardware plus an OS scheduler.",
 alt: "OS hardware mastery",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Teach a friend in one minute: CPU computes; RAM is working space; drives store; the OS manages processes and drivers.",
 },
 ],
 },
 ],
};

export default BOOK;
