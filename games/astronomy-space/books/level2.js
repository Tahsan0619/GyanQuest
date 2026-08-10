/**
 * Digital book - Astronomy Space Mission 2: Day & Night Sky
 * Theory: cognitive load, dual coding, multimedia learning, constructivism,
 * conceptual change, spiral scaffold, retrieval practice.
 * Photos: Earth, Moon, and night-sky JPGs under assets/book/.
 */
export const BOOK = {
 missionIndex: 1,
 title: "Day & Night Sky",
 subtitle: "Earth rotation makes day and night",
 subject: "Astronomy Space / Day & Night Sky",
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
 title: "Day & Night Sky",
 art: "/games/astronomy-space/assets/book/m2-cover.jpg",
 },
 glossary: [
 { id: "rotation", term: "rotation" },
 { id: "axis", term: "axis" },
 { id: "day", term: "day" },
 { id: "night", term: "night" },
 { id: "sunrise", term: "sunrise" },
 { id: "sunset", term: "sunset" },
 { id: "sunlight", term: "sunlight" },
 { id: "shadow", term: "shadow" },
 ],
 pages: [
 {
 title: "Sunrise window, evening lights",
 layout: "text",
 theory: ["constructivism", "dual-coding", "cognitive-load"],
 figures: [
 {
 place: "top",
 slides: [
 {
 src: "/games/astronomy-space/assets/book/m2-hook.jpg",
 caption: "Figure 1. The Moon lights a night sky - but day and night are about Earth's spin.",
 alt: "Moon in space",
 },
 {
 src: "/games/astronomy-space/assets/book/m2-night.jpg",
 caption: "Dhaka evening lights turn on when our side faces away from the Sun.",
 alt: "Milky Way arch over night landscape",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "A sunrise window brightens because your part of Earth turns into sunlight. School timetables chase that rhythm. Night lights in Dhaka glow when your side faces the dark.",
 },
 {
 type: "p",
 text: "Day and night take turns because Earth rotates - it spins on an axis. The Sun is still there; we turn.",
 },
 {
 type: "p",
 text: "Earn Sky Watcher by naming spin as the cause, not a traveling Sun.",
 },
 ],
 },
 {
 title: "One half lit, one half dark",
 layout: "full-fig",
 theory: ["multimedia-learning", "dual-coding"],
 figures: [
 {
 place: "full",
 slides: [
 {
 src: "/games/astronomy-space/assets/book/m2-model.jpg",
 caption: "Figure 2. Model: sunlight hits one face of Earth; the other face is night.",
 alt: "Earth from space showing lit side",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Sunlight travels in straight lines. The half of Earth facing the Sun is in day. The half turned away is in night.",
 },
 {
 type: "ul",
 items: [
 "Rotation = spin in place",
 "Sunrise = your location turns into the lit half",
 "Sunset = your location turns into the dark half",
 ],
 },
 ],
 },
 {
 title: "Faster spin, quicker day cycle",
 layout: "text",
 theory: ["cognitive-load", "dual-coding"],
 figures: [
 {
 place: "top",
 slides: [
 {
 src: "/games/astronomy-space/assets/book/m2-earth.jpg",
 caption: "Figure 3. Earth completes one rotation in about 24 hours.",
 alt: "Full Earth disk",
 },
 {
 src: "/games/astronomy-space/assets/book/m2-day.jpg",
 caption: "Mission 'faster spin' is a model - real Earth keeps a steady day length.",
 alt: "Rocket launch under daylight sky",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "If Earth spun faster, day and night would swap more often. The mission dial exaggerates that so you can feel cause and result.",
 },
 {
 type: "p",
 text: "Shadows outdoors also tell the story: the Sun's direction in your sky changes as Earth turns.",
 },
 ],
 },
 {
 title: "Cause versus result",
 layout: "full-fig",
 theory: ["multimedia-learning", "spiral-scaffold"],
 figures: [
 {
 place: "full",
 slides: [
 {
 src: "/games/astronomy-space/assets/book/m2-cover.jpg",
 caption: "Figure 4. Representation: night Moon above a spinning Earth that makes night possible.",
 alt: "Full moon",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Cause: Earth rotates. Result: day follows night. The Moon can shine at night, but it is not what creates the day/night cycle.",
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
 text: "Meet day and night -> spin clarity lab -> sort cause / result -> faster spin lab -> why day follows night -> name the spin rule -> stretch to BD times -> myth bust -> fluency -> Sky Watcher mastery.",
 },
 {
 type: "ul",
 items: [
 "Sorting separates spin (cause) from light/dark (result)",
 "Faster spin lab makes the link feel obvious",
 "The rule sentence: Earth rotates, so day and night swap",
 ],
 },
 ],
 },
 {
 title: "Lamp-and-globe transfer",
 layout: "split",
 theory: ["constructivism", "dual-coding", "retrieval-practice"],
 figures: [
 {
 place: "right",
 slides: [
 {
 src: "/games/astronomy-space/assets/book/m2-model.jpg",
 caption: "Lit face = day.",
 alt: "Earth lit from the Sun",
 },
 {
 src: "/games/astronomy-space/assets/book/m2-night.jpg",
 caption: "Dark face = night sky.",
 alt: "Night sky Milky Way",
 },
 {
 src: "/games/astronomy-space/assets/book/m2-hook.jpg",
 caption: "Moon can appear at night - still not the spin cause.",
 alt: "Moon",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Darken a room. Use a lamp as the Sun and a ball as Earth. Mark Bangladesh with a sticker. Spin the ball and watch the sticker enter light, then dark.",
 },
 {
 type: "ul",
 items: [
 "When is the sticker in day?",
 "What motion caused the change?",
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
 text: "Myth: The Sun races around Earth each day. Better: Earth rotates; sunrise is us turning into sunlight.",
 },
 {
 type: "p",
 text: "Myth: Night happens because the Sun turns off. Better: the Sun keeps shining; we face away.",
 },
 {
 type: "p",
 text: "Red words are glossary terms. Tap one to ask the tutor.",
 },
 ],
 },
 {
 title: "Sky Watcher mastery",
 layout: "text",
 theory: ["retrieval-practice", "spiral-scaffold"],
 figures: [
 {
 place: "top",
 slides: [
 {
 src: "/games/astronomy-space/assets/book/m2-earth.jpg",
 caption: "Figure 5. Teaching anchor: spinning Earth, fixed sunlight.",
 alt: "Earth teaching anchor",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Teach a friend in one minute: Earth rotates on an axis; the lit half is day; the dark half is night; sunrise and sunset are turns into and out of sunlight.",
 },
 {
 type: "ul",
 items: [
 "Act the spin with a ball and lamp",
 "Name one cause and one result",
 "Use the word rotation correctly once",
 ],
 },
 ],
 },
 ],
};

export default BOOK;
