/**
 * Force Fighter Mission 1 book: The Lazy Rock
 * Companion to the 4-spiral interactive lesson (still/move → inertia → Newton 1 → why it matters).
 */
export const BOOK = {
 missionIndex: 0,
 title: "The Lazy Rock",
 subtitle: "inertia and Newton's First Law",
 subject: "Force Fighter / The Lazy Rock",
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
 title: "The Lazy Rock",
 art: "/games/force-fighter/assets/book/gen-ff-m1-cover.png",
 },
 glossary: [
 { id: "inertia", term: "inertia" },
 { id: "state-of-motion", term: "state of motion" },
 { id: "mass", term: "mass" },
 { id: "force", term: "force" },
 { id: "friction", term: "friction" },
 { id: "newtons-first-law", term: "Newton's First Law" },
 { id: "net-force", term: "net force" },
 { id: "rest", term: "rest" },
 ],
 pages: [
 {
 title: "A rock that does nothing",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/force-fighter/assets/book/gen-ff-m1-fig01-rock.png",
 caption: "Figure 1. The lazy rock sits by the canal. It will not change what it is doing unless something makes it.",
 alt: "A canal-bank boulder sitting still",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "This is the first lesson in the Physics track. You do not need any earlier physics missions. The whole story centers on one character: a canal-bank boulder nicknamed the lazy rock, because inertia is easiest to feel as a kind of laziness. Matter's stubborn preference for continuing to do exactly whatever it was already doing.",
 },
 {
 type: "p",
 text: "That sounds almost too obvious to deserve a whole lesson. The path is a spiral. You do something with your hands, you watch a picture of what you just did, then you get the grown-up name. Each loop reactivates the last one before it pushes deeper.",
 },
 {
 type: "ul",
 items: [
 "Spiral 1: what is stillness, and what is movement?",
 "Spiral 2: objects resist change. That resistance has a name.",
 "Spiral 3: strip away friction and hear what Newton actually said.",
 "Spiral 4: why this matters, from seatbelts to satellites.",
 ],
 },
 ],
 },
 {
 title: "Poke the rock, then try a ball",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/force-fighter/assets/book/gen-ff-m1-fig02-poke.png",
 caption: "Figure 2. A tap is not a push. Drag across the rock, then give a light ball the same kind of shove.",
 alt: "A hand tapping then pushing a heavy rock",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "A light tap does nothing. You have to actually push. After you stop pushing, the rock slides a short way on the grass and then slows, with friction nibbling at its motion. The same kind of push on a light ball sends it farther before it stops.",
 },
 {
 type: "p",
 text: "Two very different results from a similar push. Your hands have already found something worth explaining: whatever is happening is not just about the push. It is also about the object being pushed.",
 },
 ],
 },
 {
 title: "Stillness and motion are one state",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/force-fighter/assets/book/gen-ff-m1-fig03-coast.png",
 caption: "Figure 3. The push happens once and then it is over. The movement, or the stillness, keeps going on its own afterward.",
 alt: "A short push arrow and a longer coast trail",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Here is the detail most people miss: after you stop pushing, the object does not need anything else to keep doing what it is doing. The rock kept sliding a bit after your hand let go. The ball kept rolling long after that.",
 },
 {
 type: "p",
 text: "Staying still and staying in motion turn out to be surprisingly similar. Both are just an object continuing on its own, undisturbed, until something else steps in. Physicists call both an object's state of motion. Whether that state is sitting still or moving steadily, changing it, in either direction, is what needs an explanation.",
 },
 ],
 },
 {
 title: "Same push: ball, brick, football",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/force-fighter/assets/book/gen-ff-m1-fig04-mass.png",
 caption: "Figure 4. Same effort, wildly different results: a ball, a brick, and a football. Size is not the same as mass.",
 alt: "A ball, a brick, and a football pushed with the same force",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Give a playground ball, a brick, and a football the same push. The ball shoots off. The brick barely creeps. The football looks big, but it is full of air, so it moves more than the brick. Then start all three already rolling at the same speed and try to stop them. The ball stops almost instantly. The brick takes far more effort.",
 },
 {
 type: "p",
 text: "The heavier an object is, the more it resists both starting to move and stopping once it is moving. The lazy rock is not lazy about moving. It is lazy about changing.",
 },
 ],
 },
 {
 title: "The stubbornness is called inertia",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/force-fighter/assets/book/gen-ff-m1-fig05-inertia.png",
 caption: "Figure 5. Resistance to change scales with mass. A brick has more inertia than a ball. A football looks big, but air does not add much mass.",
 alt: "Heavy brick versus light ball showing inertia",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "This resistance is not a separate mysterious force. It scales directly with how much mass an object has. More stuff packed into an object means a stubborner commitment to continuing whatever it is already doing.",
 },
 {
 type: "p",
 text: "Physicists call this stubbornness inertia: an object's natural tendency to resist any change to its state of motion. More mass means more inertia. Inertia is not a force pushing back. It is a property every object has, just by having mass. The lazy rock is lazy because it is massive.",
 },
 ],
 },
 {
 title: "Ice, then gravel",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/force-fighter/assets/book/gen-ff-m1-fig06-ice.png",
 caption: "Figure 6. On ice the rock keeps going. Flip to gravel mid-slide and friction, a real outside force, is what stops it.",
 alt: "Rock gliding on ice versus slowing on gravel",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "This is the hinge of the whole lesson. Put the lazy rock on ice and give it one push. It glides in a straight line at a constant speed and keeps going. That is not a trick. That is inertia with nothing else interfering.",
 },
 {
 type: "p",
 text: "Flip to gravel while it is still sliding and it begins to slow, exactly as it did on grass. It did not run out of motion. Friction, a real outside force, quietly acted on it. Every everyday stop you have seen was never really 'on its own' at all.",
 },
 ],
 },
 {
 title: "What Newton actually said",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/force-fighter/assets/book/gen-ff-m1-fig07-space.png",
 caption: "Figure 7. Same physics in a space station and on an Earth table. The difference is how much hidden friction is fighting the motion.",
 alt: "Wrench drifting in space versus stopping on a table",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "A wrench nudged in a space station drifts in a straight line. The same nudge on a table on Earth slides a short way, then air resistance and table friction bring it to a stop. Earth's objects are not less lazy. Earth is covered in invisible forces like friction, constantly nudging things without you noticing.",
 },
 {
 type: "p",
 text: "Around 1687, Isaac Newton wrote the idea down formally. Newton's First Law of Motion, also called the Law of Inertia: an object at rest stays at rest, and an object in motion stays in motion at a constant speed and direction, unless acted on by a net outside force. If a hockey puck slides across ice and eventually stops, that tells you a force like friction must have acted. It did not run out of motion.",
 },
 ],
 },
 {
 title: "A sudden stop, and a seatbelt",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/force-fighter/assets/book/gen-ff-m1-fig08-seatbelt.png",
 caption: "Figure 8. The car stops. The passenger's body does not, until something forces it to. A seatbelt is that outside force.",
 alt: "Car stop with seatbelt applying force",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "A car hits a wall. The car stops. An unrestrained passenger keeps moving forward at the same speed, like the lazy rock, until something applies a force. With a seatbelt on, that belt tightens and supplies the missing outside force so the passenger stops along with the car.",
 },
 {
 type: "p",
 text: "A seatbelt is not just a rule. It is literally supplying the force your body needs to change its state of motion. The tablecloth trick is the same idea wearing a party costume: yank the cloth fast enough and the dishes barely move, because their inertia keeps them in place while only the cloth is forced to move.",
 },
 ],
 },
 {
 title: "Net force = 0, no change in motion",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/force-fighter/assets/book/gen-ff-m1-fig09-netzero.png",
 caption: "Figure 9. If the combined result of every force is zero, motion does not change. That is Newton's First Law in short.",
 alt: "Balanced opposite forces on a rock",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Once you know to look for it, Newton's First Law is everywhere: you lurch on a bus, a coin stays on a yanked card, a satellite drifts around Earth for years with no engine running. None of these are separate coincidences. They are all the same lazy-rock behavior in different costumes.",
 },
 {
 type: "p",
 text: "Net force is the combined result of every force acting on an object at once. If net force = 0, there is no change in motion. What happens the moment net force is not zero? That is the next mission.",
 },
 ],
 },
 {
 title: "The rock was never really lazy",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/force-fighter/assets/book/gen-ff-m1-fig10-close.png",
 caption: "Figure 10. Back at the first image: state of rest, inertia, net force = 0. One rock, one law.",
 alt: "The lazy rock at sunset",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "We started with a rock doing nothing, and called it lazy. That is not a character flaw. It is a law of the universe. Everything, everywhere, insists on continuing to do exactly what it is already doing, until something else forces a change.",
 },
 {
 type: "p",
 text: "That is not laziness. That is inertia, and now you will not look at a rock, a brick, a bus, or a seatbelt quite the same way again. The recap map lets you replay the four spirals: still or moving, inertia, Newton 1, and why it matters.",
 },
 ],
 },
 ],
};

export default BOOK;
