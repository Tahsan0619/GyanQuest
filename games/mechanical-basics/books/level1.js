/**
 * Mechanical Basics Mission 1 book: Levers & Gears
 * Companion to the 4-spiral lesson (lever → fulcrum/MA → gears → everyday).
 */
export const BOOK = {
 missionIndex: 0,
 title: "Levers & Gears",
 subtitle: "trade distance for force - straight and spinning versions",
 subject: "Mechanical Basics / Levers & Gears",
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
 title: "Levers & Gears",
 art: "/games/mechanical-basics/assets/book/gen-me-m1-cover.png",
 },
 glossary: [
 { id: "lever", term: "lever" },
 { id: "fulcrum", term: "fulcrum" },
 { id: "mechanical-advantage", term: "mechanical advantage" },
 { id: "gear", term: "gear" },
 { id: "torque", term: "torque" },
 { id: "gear-ratio", term: "gear ratio" },
 { id: "effort", term: "effort" },
 ],
 pages: [
 {
 title: "Too heavy by hand",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/mechanical-basics/assets/book/gen-me-m1-fig01-hand.png",
 caption: "Figure 1. A boulder beats bare hands. A plank can change the trade.",
 alt: "Hand lift struggle versus plank lever success",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "How does a small push move something far too heavy? A lever trades how far your hand moves for how hard it has to push. A gear does the spinning version of the same honest trade. Scissors, wheelbarrows, and bicycle hills all use it.",
 },
 {
 type: "ul",
 items: [
 "Spiral 1: what a lever is.",
 "Spiral 2: fulcrum and mechanical advantage.",
 "Spiral 3: gears, torque, and ratio.",
 "Spiral 4: everyday machines that use the trick.",
 ],
 },
 ],
 },
 {
 title: "Parts of a lever",
 layout: "full-fig",
 figures: [
 {
 place: "full",
 src: "/games/mechanical-basics/assets/book/gen-me-m1-fig02-lever.png",
 caption: "Figure 2. Effort, fulcrum, and load on a simple plank lever.",
 alt: "Lever with fulcrum effort and load arrows",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "A lever is a rigid bar that turns on a fulcrum. You apply effort on one side; the load sits on the other. Move your hand a longer path and you can often use a smaller force - you did not create free strength.",
 },
 {
 type: "ul",
 items: [
 "Fulcrum: the pivot.",
 "Effort: your push.",
 "Load: the thing you want to move.",
 ],
 },
 ],
 },
 {
 title: "Slide the fulcrum",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/mechanical-basics/assets/book/gen-me-m1-fig03-fulcrum.png",
 caption: "Figure 3. Closer fulcrum to the load usually means more mechanical advantage.",
 alt: "Sliding fulcrum changing mechanical advantage",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Mechanical advantage is how much the machine multiplies your effort (while you trade distance). Slide the fulcrum toward the load and your hand usually travels farther for an easier push. Slide it the other way and the trade flips.",
 },
 ],
 },
 {
 title: "Gears spin the trade",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/mechanical-basics/assets/book/gen-me-m1-fig04-gears.png",
 caption: "Figure 4. Meshed gears trade speed for torque - or the reverse.",
 alt: "Large and small gears with torque arrows",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Gears are toothed wheels that pass turning force. A small gear spinning fast can drive a larger gear more slowly with stronger twist. That twist is torque. Gear ratio describes how the sizes set the trade.",
 },
 ],
 },
 {
 title: "Hills need torque",
 layout: "full-fig",
 figures: [
 {
 place: "full",
 src: "/games/mechanical-basics/assets/book/gen-me-m1-fig05-bike.png",
 caption: "Figure 5. Low gear on a hill: more pedal travel, stronger climbing twist.",
 alt: "Bicycle climbing hill in low gear",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Everyday hook: climb a hill in a low gear. Your legs spin more for each wheel advance, but the torque helps you up. Same lever idea - spinning edition.",
 },
 ],
 },
 {
 title: "Machines all around",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/mechanical-basics/assets/book/gen-me-m1-fig06-everyday.png",
 caption: "Figure 6. Scissors, bottle openers, and wheelbarrows are everyday levers.",
 alt: "Everyday lever tools collage",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Once you see fulcrums, you see them everywhere. Sort tools by where the pivot sits and you are doing real mechanical thinking, not memorizing names.",
 },
 ],
 },
 {
 title: "Torque is turning push",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/mechanical-basics/assets/book/gen-me-m1-fig07-torque.png",
 caption: "Figure 7. Torque is how hard a shaft twists - the spinning cousin of force.",
 alt: "Torque twisting arrows on a gear shaft",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Force pushes in a line. Torque twists around an axis. Gears and pedals care about torque. Name both and the hill climb story stays clear.",
 },
 ],
 },
 {
 title: "Lever lab",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/mechanical-basics/assets/book/gen-me-m1-fig08-lab.png",
 caption: "Figure 8. Slide the fulcrum. Feel how effort and travel change.",
 alt: "Child sliding fulcrum under a plank in lab",
 },
 ],
 blocks: [
 {
 type: "ul",
 items: [
 "Where is the fulcrum?",
 "Did your hand travel farther when the lift felt easier?",
 "Which everyday tool matches this setup?",
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
 src: "/games/mechanical-basics/assets/book/gen-me-m1-fig09-myth.png",
 caption: "Figure 9. A plank does not create free strength - it trades distance for force.",
 alt: "Myth of magic strength versus honest lever trade",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Myth: the plank magically creates extra strength. Better: it trades how far you move for how hard you push.",
 },
 {
 type: "p",
 text: "Myth: wood being lighter than rock cancels weight. Better: the fulcrum and lever arms do the work.",
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
 src: "/games/mechanical-basics/assets/book/gen-me-m1-fig10-close.png",
 caption: "Figure 10. Teach levers and gears as the same honest trade.",
 alt: "Levers and gears mastery closing scene",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Teach a friend in one minute: levers trade distance for force around a fulcrum; gears trade speed for torque through gear ratio - same idea, spinning version.",
 },
 {
 type: "ul",
 items: [
 "Name fulcrum, effort, and load once.",
 "Explain mechanical advantage in one sentence.",
 "Use the word torque correctly once.",
 ],
 },
 ],
 },
 ],
};

export default BOOK;
