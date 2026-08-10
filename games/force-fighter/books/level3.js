/**
 * Digital book - Force Fighter Mission 3: Push & Pull Pairs
 * Unique curriculum book (Newton 3 / action-reaction pairs).
 */
export const BOOK = {
 missionIndex: 2,
 title: "Push & Pull Pairs",
 subtitle: "forces come in partners",
 subject: "Force Fighter / Push & Pull Pairs",
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
 title: "Push & Pull Pairs",
 art: "/games/force-fighter/assets/book/m3-cover.jpg",
 },
 glossary: [
 { id: "action-reaction", term: "action-reaction" },
 { id: "interaction", term: "interaction" },
 { id: "recoil", term: "recoil" },
 { id: "thrust", term: "thrust" },
 { id: "partner-force", term: "partner force" },
 { id: "magnitude", term: "magnitude" },
 { id: "direction", term: "direction" },
 ],
 pages: [
 {
 title: "You push - it pushes back",
 layout: "text",
 figures: [
 {
 place: "top",
 slides: [
 {
 src: "/games/force-fighter/assets/book/m3-cover.jpg",
 caption: "Even quiet scenes hide force pairs - ground and feet, rope and hands.",
 alt: "Full moon night scene",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "When you push, something pushes back! Pull a rope and the rope pulls you too.",
 },
 {
 type: "p",
 text: "Tug-of-war is the classic pair: team A pulls the rope, the rope pulls team A. Walking works the same way - you push the ground backward, the ground pushes you forward.",
 },
 ],
 },
 {
 title: "Newton 3 in one sentence",
 layout: "full-fig",
 figures: [
 {
 place: "full",
 slides: [
 {
 src: "/games/force-fighter/assets/book/m3-cover.jpg",
 caption: "One calm picture, many invisible pairs if objects touch or pull.",
 alt: "Moon as calm backdrop for pairs idea",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "For every force, there is an equal and opposite partner force on the other object. Forces are a pair, not a solo.",
 },
 {
 type: "ul",
 items: [
 "Equal in size",
 "Opposite in direction",
 "Act on two different objects",
 ],
 },
 ],
 },
 {
 title: "Why you still move",
 layout: "text",
 figures: [
 {
 place: "top",
 slides: [
 {
 src: "/games/force-fighter/assets/book/m1-cover.jpg",
 caption: "You accelerate when the net force on YOU is not zero - pairs live on two bodies.",
 alt: "Skateboard rider",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Equal pair does not mean nothing moves. The forces act on different objects. You and the Earth pull each other; you jump higher because your mass is tiny compared with Earth's.",
 },
 {
 type: "p",
 text: "In the mission, magnets, ropes, and footsteps make the pair visible as a story.",
 },
 ],
 },
 {
 title: "Pair detective",
 layout: "full-fig",
 figures: [
 {
 place: "full",
 slides: [
 {
 src: "/games/force-fighter/assets/book/m1-model.webp",
 caption: "Cradle collisions: each click is a pair of pushes between neighboring balls.",
 alt: "Newton cradle pairs",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Name both sides: 'hand on rope' and 'rope on hand.' If you can only name one side, you are not done.",
 },
 ],
 },
 {
 title: "Mission path for pairs",
 layout: "text",
 blocks: [
 {
 type: "p",
 text: "Meet pairs → feel the tug → sort pair vs solo stories → lab → explain → name Newton 3 → stretch walks and jumps → myths → fluency → Team Force mastery.",
 },
 {
 type: "ul",
 items: [
 "Sorting kills the 'one-sided force' habit",
 "Walking example connects school physics to the playground",
 "Myths page protects you from equal-pair confusion",
 ],
 },
 ],
 },
 {
 title: "Rope and footsteps",
 layout: "split",
 figures: [
 {
 place: "right",
 slides: [
 {
 src: "/games/force-fighter/assets/book/m1-model.webp",
 caption: "Collision pairs in the cradle.",
 alt: "Cradle",
 },
 {
 src: "/games/force-fighter/assets/book/m1-cover.jpg",
 caption: "Board and ground exchange pushes as you ride.",
 alt: "Skateboard",
 },
 {
 src: "/games/force-fighter/assets/book/m3-cover.jpg",
 caption: "Quiet night - still full of contact pairs wherever things touch.",
 alt: "Moon",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Try a gentle tug on a rope with a friend (safe yard only). Each of you feels a pull. That is the pair.",
 },
 {
 type: "ul",
 items: [
 "Who did you pull?",
 "Who pulled you?",
 "Are those the same object? (No.)",
 ],
 },
 ],
 },
 {
 title: "Pair myths",
 layout: "text",
 blocks: [
 {
 type: "p",
 text: "Myth: Equal and opposite forces cancel so nothing can accelerate. Better: they act on different objects, so each object can still accelerate.",
 },
 {
 type: "p",
 text: "Myth: The ground does not push you. Better: without the ground's push up (and friction forward), walking fails.",
 },
 {
 type: "p",
 text: "Red terms open the tutor if 'action/reaction' wording feels slippery.",
 },
 ],
 },
 {
 title: "Team Force check",
 layout: "text",
 figures: [
 {
 place: "top",
 slides: [
 {
 src: "/games/force-fighter/assets/book/m1-model.webp",
 caption: "Teaching anchor: every push you name should have a partner on the other object.",
 alt: "Cradle anchor",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Teach a friend with tug-of-war and walking. End with: forces come in pairs - equal, opposite, two objects.",
 },
 {
 type: "ul",
 items: [
 "Name one pair on a rope",
 "Name one pair in a footstep",
 "Bust the 'they cancel so nothing moves' myth",
 ],
 },
 ],
 },
 ],
};

export default BOOK;
