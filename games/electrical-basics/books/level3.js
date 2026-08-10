/**
 * Digital book - Electrical Basics Mission 3: Safe Power
 * Theory: cognitive load, dual coding, multimedia learning, constructivism,
 * conceptual change, spiral scaffold, retrieval practice.
 * Photos: panel, bulb, circuit, and battery JPGs under assets/book/.
 */
export const BOOK = {
 missionIndex: 2,
 title: "Safe Power",
 subtitle: "dry hands, insulation, respect live wires",
 subject: "Electrical Basics / Safe Power",
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
 title: "Safe Power",
 art: "/games/electrical-basics/assets/book/m3-cover.jpg",
 },
 glossary: [
 { id: "insulation", term: "insulation" },
 { id: "live-wire", term: "live wire" },
 { id: "outlet", term: "outlet" },
 { id: "shock", term: "shock" },
 { id: "dry-hands", term: "dry hands" },
 { id: "frayed", term: "frayed" },
 { id: "ground", term: "ground" },
 { id: "safety", term: "safety" },
 ],
 pages: [
 {
 title: "Home outlets, lab rules, street poles",
 layout: "text",
 theory: ["constructivism", "dual-coding", "cognitive-load"],
 figures: [
 {
 place: "top",
 slides: [
 {
 src: "/games/electrical-basics/assets/book/m3-hook.jpg",
 caption: "Figure 1. Useful light still demands safe habits around power.",
 alt: "Light bulb",
 },
 {
 src: "/games/electrical-basics/assets/book/m3-model.jpg",
 caption: "Covered paths and intact jackets keep charge where it belongs.",
 alt: "Circuit with protective layout",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Home outlets are not toys. School labs post dry-hands rules for a reason. Street poles and hanging wires can be live - stay back and tell an adult.",
 },
 {
 type: "p",
 text: "Safe power means dry hands, good insulation, and never poking live sockets or frayed cords.",
 },
 {
 type: "p",
 text: "Earn Safety Star by choosing the safe habit before the curious poke.",
 },
 ],
 },
 {
 title: "Insulation is the jacket",
 layout: "full-fig",
 theory: ["multimedia-learning", "dual-coding"],
 figures: [
 {
 place: "full",
 slides: [
 {
 src: "/games/electrical-basics/assets/book/m3-insulate.jpg",
 caption: "Figure 2. Model: conductors carry charge; insulation keeps it inside the designed path.",
 alt: "Integrated circuit with packages",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "ul",
 items: [
 "Insulation - covering that stops unwanted contact",
 "Live wire - can deliver dangerous current",
 "Frayed cord - broken jacket, high risk",
 ],
 },
 {
 type: "p",
 text: "Water on hands lowers resistance. Dry hands are a simple, powerful habit.",
 },
 ],
 },
 {
 title: "Unsafe shortcuts hurt",
 layout: "text",
 theory: ["cognitive-load", "dual-coding"],
 figures: [
 {
 place: "top",
 slides: [
 {
 src: "/games/electrical-basics/assets/book/m3-safe.jpg",
 caption: "Figure 3. Energy sources are useful - treat wall power with respect.",
 alt: "Battery as controlled source contrast",
 },
 {
 src: "/games/electrical-basics/assets/book/m3-cover.jpg",
 caption: "Outdoor and panel gear still need trained adults for repairs.",
 alt: "Solar panel installation",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Sorting safe vs unsafe in the mission is practice for real rooms: no metal in outlets, no wet fingers on switches, no climbing poles.",
 },
 {
 type: "p",
 text: "If a cord is frayed or a socket sparks, leave it and call a responsible adult.",
 },
 ],
 },
 {
 title: "Safety checklist as a map",
 layout: "full-fig",
 theory: ["multimedia-learning", "spiral-scaffold"],
 figures: [
 {
 place: "full",
 slides: [
 {
 src: "/games/electrical-basics/assets/book/m3-hook.jpg",
 caption: "Figure 4. Representation: enjoy the light after the checklist, not before.",
 alt: "Bulb after safe setup",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Dry hands. Intact insulation. Distance from live street wires. That checklist is your safety map.",
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
 text: "Meet safe power -> safety dial lab -> sort safe / unsafe -> safer habits lab -> safety steps -> name the safe rule -> stretch to places -> myth bust -> fluency -> Safety Star mastery.",
 },
 {
 type: "ul",
 items: [
 "Sorting builds quick judgment",
 "Habits lab turns rules into actions",
 "The rule sentence: dry hands, good insulation, respect live wires",
 ],
 },
 ],
 },
 {
 title: "Room walk transfer",
 layout: "split",
 theory: ["constructivism", "dual-coding", "retrieval-practice"],
 figures: [
 {
 place: "right",
 slides: [
 {
 src: "/games/electrical-basics/assets/book/m3-model.jpg",
 caption: "Look for covered, undamaged paths.",
 alt: "Circuit",
 },
 {
 src: "/games/electrical-basics/assets/book/m3-safe.jpg",
 caption: "Leave repairs to trained people.",
 alt: "Energy source",
 },
 {
 src: "/games/electrical-basics/assets/book/m3-cover.jpg",
 caption: "Outdoor gear: look, don't touch.",
 alt: "Solar panels",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Walk a room with an adult. Spot outlets, cords, and switches. Name one safe habit and one unsafe action you will avoid.",
 },
 {
 type: "ul",
 items: [
 "Are hands dry before touching switches?",
 "Is any cord frayed?",
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
 text: "Myth: Low household voltage cannot hurt. Better: wall outlets can still cause serious shock - respect them.",
 },
 {
 type: "p",
 text: "Myth: Rubber shoes make any stunt safe. Better: insulation helps, but poking live parts is still wrong.",
 },
 {
 type: "p",
 text: "Red words are glossary terms. Tap one to ask the tutor.",
 },
 ],
 },
 {
 title: "Safety Star mastery",
 layout: "text",
 theory: ["retrieval-practice", "spiral-scaffold"],
 figures: [
 {
 place: "top",
 slides: [
 {
 src: "/games/electrical-basics/assets/book/m3-cover.jpg",
 caption: "Figure 5. Teaching anchor: useful power, strict safety.",
 alt: "Safe power anchor",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Teach a friend in one minute: dry hands, check insulation, never poke live sockets or street wires, and get adult help for damage.",
 },
 {
 type: "ul",
 items: [
 "List three safe habits",
 "List three unsafe actions",
 "Use the word insulation correctly once",
 ],
 },
 ],
 },
 ],
};

export default BOOK;
