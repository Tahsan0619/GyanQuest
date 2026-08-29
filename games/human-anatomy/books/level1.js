/**
 * Digital book - Human Anatomy Mission 1: Body Systems
 * Unique curriculum book (organs working in teams). Not a template fill-in.
 */
export const BOOK = {
 missionIndex: 0,
 title: "Body Systems",
 subtitle: "organs that team up to keep you alive",
 subject: "Human Anatomy / Body Systems",
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
 title: "Body Systems",
 art: "/games/human-anatomy/assets/book/m1-cover.jpg",
 },
 glossary: [
 { id: "organ", term: "organ" },
 { id: "system", term: "system" },
 { id: "circulatory", term: "circulatory" },
 { id: "respiratory", term: "respiratory" },
 { id: "digestive", term: "digestive" },
 { id: "skeleton", term: "skeleton" },
 { id: "homeostasis", term: "homeostasis" },
 ],
 pages: [
 {
 title: "Teams, not spare parts",
 layout: "text",
 figures: [
 {
 place: "top",
 slides: [
 {
 src: "/games/human-anatomy/assets/book/m1-cover.jpg",
 caption: "Figure 1. An organ is a structure with a job - heart, lungs, stomach - built from tissues.",
 alt: "Human body systems overview",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "A system is a team of organs that share a mission. Your circulatory system moves blood; your respiratory system exchanges gases.",
 },
 {
 type: "p",
 text: "Homeostasis means keeping internal conditions steady enough for cells to work - temperature, oxygen, fuel.",
 },
 ],
 },
 {
 title: "Breath and blood link",
 layout: "full-fig",
 figures: [
 {
 place: "full",
 slides: [
 {
 src: "/games/human-anatomy/assets/book/m1-hook.jpg",
 caption: "Figure 2. Lungs and heart partner - oxygen in, carbon dioxide out, blood as the delivery truck.",
 alt: "Heart and lungs partnership",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "ul",
 items: [
 "Respiratory: airways and lungs",
 "Circulatory: heart, blood, vessels",
 "Digestive: break food into usable molecules",
 ],
 },
 ],
 },
 {
 title: "Support and move",
 layout: "text",
 figures: [
 {
 place: "top",
 slides: [
 {
 src: "/games/human-anatomy/assets/book/m1-model.jpg",
 caption: "Figure 3. The skeleton frames the body and protects soft organs.",
 alt: "Human skeleton",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Bones, joints, and muscles turn plans from the nervous system into motion while protecting organs.",
 },
 ],
 },
 {
 title: "How the mission connects",
 layout: "text",
 blocks: [
 {
 type: "p",
 text: "Meet organs → map systems → link breath/blood → lab pulse → explain → rule → stretch → myth → fluency → mastery.",
 },
 ],
 },
 {
 title: "Pulse lab",
 layout: "split",
 figures: [
 {
 place: "right",
 slides: [
 {
 src: "/games/human-anatomy/assets/book/m1-hook.jpg",
 caption: "Feel pulse after rest vs walk.",
 alt: "Pulse check",
 },
 {
 src: "/games/human-anatomy/assets/book/m1-cover.jpg",
 caption: "Name the systems involved.",
 alt: "Systems",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Count your pulse for 15 seconds, multiply by 4. Walk two minutes, count again. Explain the change with circulatory demand.",
 },
 ],
 },
 {
 title: "Myths to bust",
 layout: "text",
 blocks: [
 {
 type: "p",
 text: "Myth: Organs work alone. Better: systems share products - oxygen, nutrients, signals.",
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
 src: "/games/human-anatomy/assets/book/m1-model.jpg",
 caption: "Figure 4. Teach the body as cooperating systems aiming at homeostasis.",
 alt: "Anatomy mastery",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Teach a friend in one minute: organs form systems; circulatory and respiratory partner; homeostasis is the steady goal.",
 },
 ],
 },
 ],
};

export default BOOK;
