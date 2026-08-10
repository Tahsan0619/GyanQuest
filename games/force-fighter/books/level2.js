/**
 * Digital book - Force Fighter Mission 2: Push Power
 * Unique curriculum book (F = m a / Newton 2).
 */
export const BOOK = {
 missionIndex: 1,
 title: "Push Power",
 subtitle: "same push, different mass - different acceleration",
 subject: "Force Fighter / Push Power",
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
 title: "Push Power",
 art: "/games/force-fighter/assets/book/m2-cover.jpg",
 },
 glossary: [
 { id: "mass", term: "mass" },
 { id: "acceleration", term: "acceleration" },
 { id: "net-force", term: "net force" },
 { id: "newton", term: "newton" },
 { id: "inertia-link", term: "proportional" },
 { id: "kilogram", term: "kilogram" },
 { id: "unbalanced", term: "unbalanced" },
 ],
 pages: [
 {
 title: "Light ball, heavy drum",
 layout: "text",
 figures: [
 {
 place: "top",
 slides: [
 {
 src: "/games/force-fighter/assets/book/m2-cover.jpg",
 caption: "Energy and motion change when a push acts - bigger jobs need bigger pushes.",
 alt: "Boiling pot as energy/change metaphor",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "A small push moves light things faster. A heavy thing needs a bigger push to get going!",
 },
 {
 type: "p",
 text: "Kick a light football, then try to roll a heavy drum with the same foot strength. The drum's mass fights the change.",
 },
 {
 type: "p",
 text: "Chair vs sofa: same idea in the living room. More mass → less acceleration for the same force.",
 },
 ],
 },
 {
 title: "The F = m a story",
 layout: "full-fig",
 figures: [
 {
 place: "full",
 slides: [
 {
 src: "/games/force-fighter/assets/book/m2-hook.jpg",
 caption: "Different states, different responses - compare how hard a change is to start.",
 alt: "Ice water vapor states",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Newton 2 links three ideas: force, mass, and acceleration. Double the force (same mass) → about double the acceleration. Double the mass (same force) → about half the acceleration.",
 },
 {
 type: "ul",
 items: [
 "Force is the push or pull you apply",
 "Mass is how much 'stuff' resists the change",
 "Acceleration is how quickly velocity changes",
 ],
 },
 ],
 },
 {
 title: "Feel it in the mission",
 layout: "text",
 figures: [
 {
 place: "top",
 slides: [
 {
 src: "/games/force-fighter/assets/book/m2-cover.jpg",
 caption: "Watch how strongly you must act to get a big change.",
 alt: "Strong change under heat/energy",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Push Power labs compare light vs heavy targets. Keep asking: Did I change force, mass, or both?",
 },
 {
 type: "p",
 text: "If two objects get the same push and one speeds up more, that one had less mass - not 'more willingness.'",
 },
 ],
 },
 {
 title: "Picture the trade-off",
 layout: "full-fig",
 figures: [
 {
 place: "full",
 slides: [
 {
 src: "/games/force-fighter/assets/book/m2-hook.jpg",
 caption: "Same world, different responses - mass changes how hard acceleration is.",
 alt: "Water states comparison",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Hold the triangle in your head: raise force → more acceleration. Raise mass → less acceleration. That triangle is Newton 2.",
 },
 ],
 },
 {
 title: "Steps that build Push Power",
 layout: "text",
 blocks: [
 {
 type: "p",
 text: "Meet push power → compare masses → sort strong/weak pushes → lab → explain → name F=ma → stretch → myths → fluency → Speed Star mastery.",
 },
 {
 type: "ul",
 items: [
 "Comparisons beat memorizing letters alone",
 "The equation is a shortcut for what you already felt",
 "Stretch contexts prove the rule travels",
 ],
 },
 ],
 },
 {
 title: "Chair vs sofa lab",
 layout: "split",
 figures: [
 {
 place: "right",
 slides: [
 {
 src: "/games/force-fighter/assets/book/m2-cover.jpg",
 caption: "Bigger change needs more push for the same mass - or less mass for the same push.",
 alt: "Energy change",
 },
 {
 src: "/games/force-fighter/assets/book/m2-hook.jpg",
 caption: "Compare two cases side by side, like the mission labs.",
 alt: "Comparison photo",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "At home: push an empty chair, then a sofa. Same foot? Different acceleration. That is mass talking.",
 },
 {
 type: "ul",
 items: [
 "Which object had more mass?",
 "Which sped up more?",
 "What would a bigger force do to the sofa?",
 ],
 },
 ],
 },
 {
 title: "Push Power myths",
 layout: "text",
 blocks: [
 {
 type: "p",
 text: "Myth: Heavier objects need force just to 'keep moving.' Better: without friction they would coast; force is needed to change motion.",
 },
 {
 type: "p",
 text: "Myth: F=ma is only for rockets. Better: chair, sofa, football, and drum all obey the same link.",
 },
 {
 type: "p",
 text: "Tap glossary terms for a tutor breakdown of mass vs weight if those words collide.",
 },
 ],
 },
 {
 title: "Speed Star check",
 layout: "text",
 figures: [
 {
 place: "top",
 slides: [
 {
 src: "/games/force-fighter/assets/book/m2-cover.jpg",
 caption: "Anchor picture for teaching F = m a in plain words.",
 alt: "Teaching anchor",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Teach a friend: same force, more mass → gentler acceleration. Same mass, more force → stronger acceleration. Use ball vs drum.",
 },
 {
 type: "ul",
 items: [
 "Say F = m a without looking",
 "Give one light and one heavy example",
 "Correct the 'force keeps things moving' myth",
 ],
 },
 ],
 },
 ],
};

export default BOOK;
