/**
 * Electrical Basics Mission 1 book: Circuit Loop
 * Companion to the 4-spiral lesson (loop → voltage → current/resistance → switch).
 */
export const BOOK = {
 missionIndex: 0,
 title: "Circuit Loop",
 subtitle: "electricity's water park - complete loops, push, and flow",
 subject: "Electrical Basics / Circuit Loop",
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
 title: "Circuit Loop",
 art: "/games/electrical-basics/assets/book/gen-el-m1-cover.png",
 },
 glossary: [
 { id: "circuit", term: "circuit" },
 { id: "voltage", term: "voltage" },
 { id: "current", term: "current" },
 { id: "resistance", term: "resistance" },
 { id: "switch", term: "switch" },
 { id: "battery", term: "battery" },
 { id: "load", term: "load" },
 ],
 pages: [
 {
 title: "Nothing without a loop",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/electrical-basics/assets/book/gen-el-m1-fig01-open.png",
 caption: "Figure 1. An open gap breaks the path. The bulb stays dark.",
 alt: "Open broken circuit with dark bulb",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Electricity behaves like water in pipes. A battery is the pump, wire is the pipe, a bulb is a water wheel that glows when flow pushes through. Phone chargers, room lights, and toy motors all need one complete loop.",
 },
 {
 type: "ul",
 items: [
 "Spiral 1: close the unbroken loop.",
 "Spiral 2: voltage is the pump push.",
 "Spiral 3: current and resistance.",
 "Spiral 4: a switch is a valve.",
 ],
 },
 ],
 },
 {
 title: "Close the loop",
 layout: "full-fig",
 figures: [
 {
 place: "full",
 src: "/games/electrical-basics/assets/book/gen-el-m1-fig02-closed.png",
 caption: "Figure 2. A complete circuit: battery, wires, and a glowing load.",
 alt: "Closed complete circuit with bright bulb",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "A circuit is a complete, unbroken path back to the source. Leave a gap and flow stops. The mission rule starts here: electricity only flows through a complete loop.",
 },
 {
 type: "ul",
 items: [
 "Source: the battery or outlet push.",
 "Path: conducting wires.",
 "Load: the useful work (bulb, motor).",
 ],
 },
 ],
 },
 {
 title: "Voltage is the push",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/electrical-basics/assets/book/gen-el-m1-fig03-voltage.png",
 caption: "Figure 3. The battery is the pump. Voltage is how hard it pushes.",
 alt: "Battery pump pushing flow through pipe circuit",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Voltage is the push that tries to move charge around the loop - like water pressure from a pump. Swap to a stronger battery and the push increases. No push, no useful glow.",
 },
 ],
 },
 {
 title: "Current and resistance",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/electrical-basics/assets/book/gen-el-m1-fig04-current.png",
 caption: "Figure 4. Wide easy path versus narrow resistance that slows the flow.",
 alt: "Thick versus narrow pipe affecting current",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Current is how much charge flows each second - the amount of water moving. Resistance is how hard the path fights the flow - a narrow pipe. More resistance usually means less current for the same push, and a dimmer useful load.",
 },
 {
 type: "ul",
 items: [
 "Voltage: the push.",
 "Current: the flow amount.",
 "Resistance: the squeeze in the path.",
 ],
 },
 ],
 },
 {
 title: "A switch is a valve",
 layout: "full-fig",
 figures: [
 {
 place: "full",
 src: "/games/electrical-basics/assets/book/gen-el-m1-fig05-switch.png",
 caption: "Figure 5. Open valve: dark. Closed valve: bright. Same loop, controlled gap.",
 alt: "Switch as valve open and closed comparison",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "A switch opens or closes a gap on purpose. Open is an intentional break. Closed reconnects the loop. Room lights are valves you flip with a finger.",
 },
 ],
 },
 {
 title: "Lights at home",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/electrical-basics/assets/book/gen-el-m1-fig06-home.png",
 caption: "Figure 6. A wall switch completes or breaks the room light circuit.",
 alt: "Home light switch controlling ceiling lamp",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Everyday hook: flip a room switch and you are opening or closing a circuit. The lamp is the load. The wiring is the path. The supply provides the push.",
 },
 ],
 },
 {
 title: "Chargers need a loop too",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/electrical-basics/assets/book/gen-el-m1-fig07-charger.png",
 caption: "Figure 7. A phone charger is still a complete path doing useful work.",
 alt: "Phone charger complete circuit glow",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "A charger looks different from a bulb circuit, but the idea matches: source, path, and a place where energy does useful work. Unplug and you open the loop.",
 },
 ],
 },
 {
 title: "Wiring lab",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/electrical-basics/assets/book/gen-el-m1-fig08-lab.png",
 caption: "Figure 8. Build battery → wire → bulb → wire → battery. Watch the glow.",
 alt: "Child assembling a simple circuit in lab",
 },
 ],
 blocks: [
 {
 type: "ul",
 items: [
 "Is the loop complete with no accidental gap?",
 "Where is the push coming from?",
 "What did the switch change when you flipped it?",
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
 src: "/games/electrical-basics/assets/book/gen-el-m1-fig09-myth.png",
 caption: "Figure 9. Wire is a path, not a sponge that fills up with electricity.",
 alt: "Myth of wire as sponge versus flowing loop",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Myth: wire stores electricity like a sponge until full. Better: wire is a path; flow needs a complete loop and a push.",
 },
 {
 type: "p",
 text: "Myth: shaking a battery fixes a dark bulb. Better: check for an open gap or a dead source.",
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
 src: "/games/electrical-basics/assets/book/gen-el-m1-fig10-close.png",
 caption: "Figure 10. Teach the water-park loop: push, path, load, valve.",
 alt: "Circuit loop mastery closing scene",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Teach a friend in one minute: circuits need a complete loop; voltage pushes; current flows; resistance squeezes; a switch is a valve.",
 },
 {
 type: "ul",
 items: [
 "Draw one complete loop once.",
 "Name voltage versus current once.",
 "Explain what a switch does once.",
 ],
 },
 ],
 },
 ],
};

export default BOOK;
