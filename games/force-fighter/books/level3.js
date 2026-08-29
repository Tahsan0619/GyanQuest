/**
 * Force Fighter Mission 3 book: Push & Pull
 * Companion to the 4-spiral lesson (two directions → tension/compression → Newton 3 → teamwork).
 */
export const BOOK = {
 missionIndex: 2,
 title: "Push & Pull",
 subtitle: "two directions of force, then tension, compression, and pairs",
 subject: "Force Fighter / Push & Pull",
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
 title: "Push & Pull",
 art: "/games/force-fighter/assets/book/gen-ff-m3-cover.png",
 },
 glossary: [
 { id: "force", term: "force" },
 { id: "newton", term: "newton" },
 { id: "tension", term: "tension" },
 { id: "compression", term: "compression" },
 { id: "newton-third-law", term: "Newton's Third Law" },
 { id: "inertia", term: "inertia" },
 { id: "action-reaction", term: "action-reaction pair" },
 ],
 pages: [
 {
 title: "Push it, or pull it?",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/force-fighter/assets/book/gen-ff-m3-fig01-door.png",
 caption: "Figure 1. A door can open either way. Which you choose depends on where you stand.",
 alt: "A door that can be pushed or pulled",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "The Lazy Rock showed inertia. Push Power showed that force is a push or a pull, measured in newtons. This lesson asks the question those two skipped: are pushing and pulling the same thing pointed two ways, or is something fundamentally different going on?",
 },
 {
 type: "p",
 text: "Mostly the same, with a few sharp differences. Those differences explain why ropes are floppy but rods are not, and why your muscles only know how to do one of the two.",
 },
 {
 type: "ul",
 items: [
 "Spiral 1: push and pull are one idea, two directions.",
 "Spiral 2: a rope cannot push. Tension versus compression.",
 "Spiral 3: every push or pull has a partner (Newton's Third Law).",
 "Spiral 4: cables pull, pillars push. Muscles only pull.",
 ],
 },
 ],
 },
 {
 title: "Squeeze and stretch",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/force-fighter/assets/book/gen-ff-m3-fig02-spring.png",
 caption: "Figure 2. The same spring fights back both ways.",
 alt: "A spring being squeezed and stretched",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Push the free end toward the wall and the spring gets shorter and shoves back. Pull it away and the spring gets longer and tugs back. Same spring, same kind of force, two directions.",
 },
 {
 type: "p",
 text: "Push: a force applied away from you, toward the object, that tends to squeeze or shorten. Pull: a force applied toward you, drawing the object closer, that tends to stretch or lengthen. Both are still forces, in newtons.",
 },
 ],
 },
 {
 title: "Why you cannot push a rope",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/force-fighter/assets/book/gen-ff-m3-fig03-rope.png",
 caption: "Figure 3. Shove through a rope and it crumples. Pull, and it goes taut.",
 alt: "A floppy rope versus a taut rope pulling a cart",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Try to push a cart through a loose rope and the rope buckles. No force reaches the cart. Pull the same rope and it straightens and drags the cart along. A stiff rod can do both, because it does not fold.",
 },
 {
 type: "p",
 text: "Pulling stretches the material, so anything that can go taut (rope, cable, chain, string) can pull. Pushing squeezes the material. Floppy stuff has nothing to resist that squeeze, so it crumples. Rigid rods and beams can push.",
 },
 ],
 },
 {
 title: "Tension and compression",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/force-fighter/assets/book/gen-ff-m3-fig04-tension.png",
 caption: "Figure 4. Stretching inside a rope. Squeezing inside a rod.",
 alt: "Internal tension arrows in a rope and compression in a rod",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "A material under a pulling force is in tension. A material under a pushing force is in compression. A cable's job or a column's job is usually decided by which of those it needs to handle, or both.",
 },
 {
 type: "p",
 text: "You now know that from failing to push a rope, not from memorizing the words. Tension = stretch from a pull. Compression = squeeze from a push.",
 },
 ],
 },
 {
 title: "You act on one. Both move.",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/force-fighter/assets/book/gen-ff-m3-fig05-skaters.png",
 caption: "Figure 5. Push-off: both skaters glide apart. Pull-together: both glide in.",
 alt: "Two skaters on ice pushing apart and pulling together",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "On frictionless ice, push one skater into the other. Both glide away. Pull one end of a rope between them. Both glide toward each other. You only acted on one side. Both still moved.",
 },
 {
 type: "p",
 text: "If the skaters have different mass, the heavier one glides more slowly. That is inertia from The Lazy Rock, sitting inside the pair. Forces come in partners, but motion still depends on mass.",
 },
 ],
 },
 {
 title: "Newton's Third Law",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/force-fighter/assets/book/gen-ff-m3-fig06-pairs.png",
 caption: "Figure 6. Two equal, opposite arrows. One on each object. Swimmer, boat, rocket: same pattern.",
 alt: "Action-reaction pairs in swimming, rowing, and rockets",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "A swimmer pushes water backward; water pushes the swimmer forward. A rowboat's oars push water back; water pushes the boat forward. A rocket pushes exhaust down; exhaust pushes the rocket up.",
 },
 {
 type: "p",
 text: "Newton's Third Law: for every action, there is an equal and opposite reaction. More precisely: whenever A exerts a force on B, B exerts an equal force back on A, in the opposite direction, whether that force is a push or a pull.",
 },
 {
 type: "p",
 text: "When you push a wall, the wall does feel an equal force. Its inertia, and its connection to the ground, make the motion too small to notice.",
 },
 ],
 },
 {
 title: "Cables and pillars",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/force-fighter/assets/book/gen-ff-m3-fig07-bridge.png",
 caption: "Figure 7. Tension cables droop then go taut. Compression pillars stay straight.",
 alt: "A suspension bridge with cables and pillars",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "A suspension bridge stands because each part does the job it is good at: cables pulling, pillars pushing. Put a floppy rope where a pillar belongs and the structure collapses.",
 },
 {
 type: "p",
 text: "Your muscles only pull. Bending your arm is the bicep pulling. Straightening it is the tricep pulling on the other side of the joint. Every 'push' your body makes is a pull somewhere else.",
 },
 ],
 },
 {
 title: "A team, not rivals",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/force-fighter/assets/book/gen-ff-m3-fig08-team.png",
 caption: "Figure 8. Crane, tent, skeleton: pulling parts and pushing parts together.",
 alt: "Structures that mix tension and compression",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "A crane lifts with a tension cable and holds with a compression boom. A tent uses guy-lines in tension and a pole in compression. Your bones take compression under weight; muscles and tendons do all the pulling.",
 },
 {
 type: "p",
 text: "Three ideas to keep: pushing means compression and needs something rigid. Pulling means tension and can work through something flexible. Every push or pull has an equal, opposite partner on something else.",
 },
 ],
 },
 {
 title: "Two sides of the same force",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/force-fighter/assets/book/gen-ff-m3-fig09-door.png",
 caption: "Figure 9. Back at the door: push means compression, pull means tension, and every force has an equal opposite partner.",
 alt: "Door with push, pull, and reaction ideas",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "We started unsure whether to push or pull a door. Both are force, aimed two ways. That difference in direction explains floppy ropes, why bridges need cables and pillars, and why muscles only pull.",
 },
 {
 type: "p",
 text: "Push and pull were never rivals. They have been a team the entire time. When the pushes and pulls on an object do not cancel evenly, motion changes. That is the story Force Fighter has been building toward all along.",
 },
 ],
 },
 {
 title: "One track, three big ideas",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/force-fighter/assets/book/gen-ff-m3-fig10-close.png",
 caption: "Figure 10. Inertia, power, and push-pull pairs: three lessons, one physics track.",
 alt: "Recap collage of door, rope, skaters, and bridge",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "The Lazy Rock taught inertia: objects keep doing what they are doing until a net force changes that. Push Power taught that force is the push itself, while power is how fast the job finishes. Push & Pull taught that direction matters: tension versus compression, and every force comes with a partner.",
 },
 {
 type: "p",
 text: "The recap map lets you replay the four spirals: two directions, tension and compression, Newton's Third Law, and teamwork in real structures. Next time you open a door, yank a rope, or watch a bridge, you will know which idea you are looking at.",
 },
 ],
 },
 ],
};

export default BOOK;
