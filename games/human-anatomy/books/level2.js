/**
 * Digital book - Human Anatomy Mission 2: Heart Beat
 * Theory: cognitive load, dual coding, multimedia learning, constructivism,
 * conceptual change, spiral scaffold, retrieval practice.
 * Photos: heart and circulation-related JPGs under assets/book/.
 */
export const BOOK = {
 missionIndex: 1,
 title: "Heart Beat",
 subtitle: "pump and oxygen-carrying blood",
 subject: "Human Anatomy / Heart Beat",
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
 title: "Heart Beat",
 art: "/games/human-anatomy/assets/book/m2-cover.jpg",
 },
 glossary: [
 { id: "heart", term: "heart" },
 { id: "pulse", term: "pulse" },
 { id: "blood", term: "blood" },
 { id: "oxygen", term: "oxygen" },
 { id: "circulation", term: "circulation" },
 { id: "pump", term: "pump" },
 { id: "vessel", term: "vessel" },
 { id: "beat", term: "beat" },
 ],
 pages: [
 {
 title: "Wrist tick after a run",
 layout: "text",
 theory: ["constructivism", "dual-coding", "cognitive-load"],
 figures: [
 {
 place: "top",
 slides: [
 {
 src: "/games/human-anatomy/assets/book/m2-hook.jpg",
 caption: "Figure 1. Your brain needs a steady delivery of oxygenated blood.",
 alt: "Human brain",
 },
 {
 src: "/games/human-anatomy/assets/book/m2-active.jpg",
 caption: "Activity raises demand - the pump works harder.",
 alt: "Astronaut exertion as active-body cue",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Press two fingers on your wrist. That pulse is blood shoved by the heart. After running it speeds up. Calm breathing helps it settle.",
 },
 {
 type: "p",
 text: "The heart is a muscle pump. Blood carries oxygen from the lungs to the rest of the body through vessels.",
 },
 {
 type: "p",
 text: "Earn Pulse Pro by linking beat -> flow -> oxygen delivery.",
 },
 ],
 },
 {
 title: "Pump first, then flow",
 layout: "full-fig",
 theory: ["multimedia-learning", "dual-coding"],
 figures: [
 {
 place: "full",
 slides: [
 {
 src: "/games/human-anatomy/assets/book/m2-cover.jpg",
 caption: "Figure 2. Model: the heart squeezes; blood moves; oxygen rides along.",
 alt: "Heart pump",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Each beat is a squeeze. Circulation is the loop that returns blood so it can pick up oxygen again.",
 },
 {
 type: "ul",
 items: [
 "Heart = pump",
 "Blood = carrier",
 "Oxygen = cargo from the lungs",
 ],
 },
 ],
 },
 {
 title: "Why the pulse gets stronger",
 layout: "text",
 theory: ["cognitive-load", "dual-coding"],
 figures: [
 {
 place: "top",
 slides: [
 {
 src: "/games/human-anatomy/assets/book/m2-oxygen.jpg",
 caption: "Figure 3. Working tissues need more oxygen - the pump answers with more beats.",
 alt: "Microscope image hinting at living tissue",
 },
 {
 src: "/games/human-anatomy/assets/book/m2-flow.jpg",
 caption: "Flow paths matter - blocked thinking about 'blood sitting still' misses circulation.",
 alt: "Leaf vein-like flow metaphor",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Muscles burning energy during a sprint ask for more oxygen. The heart beats faster so circulation can deliver.",
 },
 {
 type: "p",
 text: "Mission 'stronger pulse' labs exaggerate that demand so you can see pump and path together.",
 },
 ],
 },
 {
 title: "Circulation is a loop",
 layout: "full-fig",
 theory: ["multimedia-learning", "spiral-scaffold"],
 figures: [
 {
 place: "full",
 slides: [
 {
 src: "/games/human-anatomy/assets/book/m2-model.jpg",
 caption: "Figure 4. Representation: tiny living units still depend on oxygen delivered by blood.",
 alt: "Cell image",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Game paths are simplified loops. Real vessels branch finely, but the story stays: pump, carry oxygen, return, repeat.",
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
 text: "Meet the pump -> pulse clarity lab -> sort circulation / notice / not -> stronger pulse lab -> why blood moves -> name the pump rule -> stretch to active days -> myth bust -> fluency -> Pulse Pro mastery.",
 },
 {
 type: "ul",
 items: [
 "Sorting separates real circulation clues from distractions",
 "Stronger pulse lab links activity to pump rate",
 "The rule sentence: heart pumps blood that carries oxygen",
 ],
 },
 ],
 },
 {
 title: "Active-day transfer",
 layout: "split",
 theory: ["constructivism", "dual-coding", "retrieval-practice"],
 figures: [
 {
 place: "right",
 slides: [
 {
 src: "/games/human-anatomy/assets/book/m2-cover.jpg",
 caption: "Find the pulse - proof of the pump.",
 alt: "Heart",
 },
 {
 src: "/games/human-anatomy/assets/book/m2-active.jpg",
 caption: "After activity - faster beats.",
 alt: "Active body",
 },
 {
 src: "/games/human-anatomy/assets/book/m2-hook.jpg",
 caption: "Calm focus - oxygen still arriving.",
 alt: "Brain needing oxygen",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Count wrist beats for 15 seconds at rest, then after 20 jumping jacks. Compare. Name pump, blood, and oxygen.",
 },
 {
 type: "ul",
 items: [
 "What changed?",
 "What stayed the same (still a loop)?",
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
 text: "Myth: The heart makes oxygen. Better: lungs add oxygen; the heart pumps the blood that carries it.",
 },
 {
 type: "p",
 text: "Myth: Blood only goes one way forever and never returns. Better: circulation is a loop - out and back.",
 },
 {
 type: "p",
 text: "Red words are glossary terms. Tap one to ask the tutor.",
 },
 ],
 },
 {
 title: "Pulse Pro mastery",
 layout: "text",
 theory: ["retrieval-practice", "spiral-scaffold"],
 figures: [
 {
 place: "top",
 slides: [
 {
 src: "/games/human-anatomy/assets/book/m2-cover.jpg",
 caption: "Figure 5. Teaching anchor: beat, flow, oxygen.",
 alt: "Heart mastery anchor",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Teach a friend in one minute: the heart pumps; blood moves in vessels; oxygen from the lungs rides along; pulse is the beat you can feel.",
 },
 {
 type: "ul",
 items: [
 "Find a pulse safely on a wrist",
 "Explain why it rises after exercise",
 "Use the word circulation correctly once",
 ],
 },
 ],
 },
 ],
};

export default BOOK;
