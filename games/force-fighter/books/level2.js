/**
 * Force Fighter Mission 2 book: Push Power
 * Companion to the 4-spiral lesson (force → power ≠ strong → gears → why it matters).
 */
export const BOOK = {
 missionIndex: 1,
 title: "Push Power",
 subtitle: "force is the push; power is how fast the job gets done",
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
 art: "/games/force-fighter/assets/book/gen-ff-m2-cover.png",
 },
 glossary: [
 { id: "force", term: "force" },
 { id: "newton", term: "newton" },
 { id: "work", term: "work" },
 { id: "joule", term: "joule" },
 { id: "power", term: "power" },
 { id: "watt", term: "watt" },
 { id: "velocity", term: "velocity" },
 { id: "horsepower", term: "horsepower" },
 ],
 pages: [
 {
 title: "What happens once net force is not zero?",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/force-fighter/assets/book/gen-ff-m2-fig01-push.png",
 caption: "Figure 1. A stalled car on the road. Last lesson's rock still waits on the grass. A push changes motion. What is a push, and what is power?",
 alt: "A stalled car with a push arrow",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "The Lazy Rock showed that an object's motion only changes because of a net force. This lesson answers the next question: what is a push, exactly, and once something is pushing, does it matter how hard or how fast?",
 },
 {
 type: "p",
 text: "The spiral is built around a trap. Most people use 'powerful' to mean 'strong.' In physics, power is not how hard something pushes. It is how fast it can get a job done. Spiral 1 builds force cleanly. Spiral 2 uses that idea, then breaks the trap.",
 },
 {
 type: "ul",
 items: [
 "Spiral 1: a push is direction plus strength. That is force.",
 "Spiral 2: same work, different time. That difference is power.",
 "Spiral 3: for fixed power, force and speed trade off. That is why gears exist.",
 "Spiral 4: stalled cars, watts, and horsepower that finally mean something.",
 ],
 },
 ],
 },
 {
 title: "Aim and push",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/force-fighter/assets/book/gen-ff-m2-fig02-aim.png",
 caption: "Figure 2. The compass stays put. Drag the crate. The arrow's direction is which way. Its size is how hard.",
 alt: "A directed push on a crate",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "A short, weak drag makes the crate barely creep. A long, strong drag sends it off quickly. A push aimed at a new angle sends it that way exactly. The painted compass does not move. A pull is the same idea, aimed toward you instead of away.",
 },
 {
 type: "p",
 text: "Every push has two things baked in: a direction and a strength. That combination is exactly what a push is, in the most physical sense.",
 },
 ],
 },
 {
 title: "Force, in newtons",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/force-fighter/assets/book/gen-ff-m2-fig03-forces.png",
 caption: "Figure 3. A door, a sail, a dog, an apple: every one is drawn as an arrow.",
 alt: "Everyday pushes and pulls drawn as arrows",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "A hand on a heavy door, a breeze on a sail, a dog on a leash, gravity on an apple: physicists draw every one the same way. An arrow pointing in the direction of the push or pull, sized to show how strong it is.",
 },
 {
 type: "p",
 text: "Push and pull both go by one formal name: force, measured in newtons (N), named after Isaac Newton. From a gentle tap to a rocket launch, it is the same kind of arrow, bigger or smaller.",
 },
 ],
 },
 {
 title: "Tortoise, rabbit, then the trap",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/force-fighter/assets/book/gen-ff-m2-fig04-race.png",
 caption: "Figure 4. Two lanes. Same crate, same distance, same push strength. Very different time.",
 alt: "Tortoise and rabbit racing identical crates",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Two identical crates, two finish lines, one on each lane. The tortoise is speed-capped: slow and steady. The rabbit hops as fast as you can hold. Both reach the line. Guess first: who was more powerful?",
 },
 {
 type: "p",
 text: "Most people pick the rabbit, and they are right about power. The twist: both used the same pushing strength the whole time. They did the same work. Only the time changed. That is what power measures.",
 },
 ],
 },
 {
 title: "Work in joules, power in watts",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/force-fighter/assets/book/gen-ff-m2-fig05-work.png",
 caption: "Figure 5. Work bars match. Time bars do not. Power is work compressed into less time.",
 alt: "Work, time, and power comparison bars",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Work is the size of the job: Work = Force × Distance, measured in joules. Power is how fast the job got done: Power = Work ÷ Time, measured in watts.",
 },
 {
 type: "p",
 text: "The turtle and rabbit had identical work. Only their time, and therefore their power, was different. Strength is how hard you push. Power is how fast you finish with that push.",
 },
 ],
 },
 {
 title: "Gears: a fixed power budget",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/force-fighter/assets/book/gen-ff-m2-fig06-gears.png",
 caption: "Figure 6. Low gear climbs. High gear on the hill gets shoved back. High gear on the flat road zips.",
 alt: "Car in low gear on a hill versus high gear on flat road",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "The engine's power budget never changes. You only change the mix. Low gear on a steep hill climbs slowly but with enough force. High gear on the same hill starts up, then gravity pushes the car back: not enough force, even though you asked for speed. High gear on a flat road zips.",
 },
 {
 type: "p",
 text: "You were trading force for speed, and speed for force. Climbing needs lots of force, so you sacrifice speed. Cruising needs less force, so you cash it in for extra speed. That trade-off is why gears exist.",
 },
 ],
 },
 {
 title: "Power = Force × Velocity",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/force-fighter/assets/book/gen-ff-m2-fig07-tradeoff.png",
 caption: "Figure 7. Force on one side, speed on the other, power as the pivot that never moves.",
 alt: "Balance between force and speed around fixed power",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Any engine, motor, or muscle with a fixed power output makes the same trade: more force means less speed, more speed means less force. The power itself stays put.",
 },
 {
 type: "p",
 text: "A second, equally valid formula is Power = Force × Velocity (velocity meaning speed in a direction). If power must stay the same number and force goes up, velocity has to come down, and vice versa.",
 },
 ],
 },
 {
 title: "Many hands, and a stalled car",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/force-fighter/assets/book/gen-ff-m2-fig08-team.png",
 caption: "Figure 8. Same car, same roadside. Alone is slow. Friends finish faster. Same work, more power.",
 alt: "One person versus a team pushing a stalled car",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Push a stalled car alone and it creeps. Recruit three friends and the same car, same distance, reaches the roadside far faster. More combined force means the job gets done quicker, so more total power.",
 },
 {
 type: "p",
 text: "A weightlifter is not just strong. Two lifts of the same weight to the same height do identical work. The faster lift has more power. Explosive lifts are prized for that.",
 },
 ],
 },
 {
 title: "Watts you can actually picture",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/force-fighter/assets/book/gen-ff-m2-fig09-watts.png",
 caption: "Figure 9. Five pictures from a lightbulb to a rocket: power is how fast work can be done.",
 alt: "Power scale from bulb to rocket",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "A household bulb is about 60 W. A person walking is about 100 W. A bicycle sprint is about 300 to 400 W. A small car engine is about 75,000 W, or 100 horsepower. A large rocket engine is in the billions of watts. One horsepower is about 746 watts.",
 },
 {
 type: "p",
 text: "A rocket is not remarkable only because it pushes hard. Plenty of things push hard. It is remarkable because it can do an enormous amount of work in a very short time.",
 },
 ],
 },
 {
 title: "Two words, one clear difference",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/force-fighter/assets/book/gen-ff-m2-fig10-close.png",
 caption: "Figure 10. Back at the rock: a force arrow, a distance, a stopwatch. That stopwatch is power.",
 alt: "Force, distance, and stopwatch around a boulder",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Force is the push itself, a push or pull with a direction and a strength, measured in newtons. Power is how quickly that push gets a job done, measured in watts. Mix them up and 'powerful' is just a compliment. Keep them straight and you can read a car ad or a lightbulb box for what it actually says.",
 },
 {
 type: "p",
 text: "A small, fast engine can genuinely be more powerful than a big, slow one. The recap map lets you replay the four spirals: what a push is, why power is not strength, the gear trade-off, and why it matters. Next question: when pushes and pulls point two ways, what is really going on?",
 },
 ],
 },
 ],
};

export default BOOK;
