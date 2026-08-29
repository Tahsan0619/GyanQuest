/**
 * ICT Fundamentals Mission 2 book: Networks & Signals
 * Companion curriculum book (how devices share data).
 */
export const BOOK = {
 missionIndex: 1,
 title: "Networks & Signals",
 subtitle: "how messages travel between devices",
 subject: "ICT Fundamentals / Networks & Signals",
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
 title: "Networks & Signals",
 art: "/games/ict-fundamentals/assets/book/gen-ict-m2-cover.png",
 },
 glossary: [
 { id: "network", term: "network" },
 { id: "router", term: "router" },
 { id: "packet", term: "packet" },
 { id: "bandwidth", term: "bandwidth" },
 { id: "latency", term: "latency" },
 { id: "wireless", term: "wireless" },
 { id: "protocol", term: "protocol" },
 ],
 pages: [
 {
 title: "Devices that talk",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/ict-fundamentals/assets/book/gen-ict-m2-fig01-devices.png",
 caption: "Figure 1. Phones, tablets, and laptops join the same network to share services.",
 alt: "Multiple connected devices",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "A network is a set of devices that can exchange data using agreed rules. After Computer Basics, this mission asks how those devices share messages across a path.",
 },
 {
 type: "p",
 text: "Everyday hook: when a video buffers, the network path or its capacity is struggling, not 'the movie itself.'",
 },
 {
 type: "ul",
 items: [
 "Meet devices on a network.",
 "Map a path through a router.",
 "Send packets and name protocols.",
 "Separate bandwidth from latency.",
 ],
 },
 ],
 },
 {
 title: "The router as clerk",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/ict-fundamentals/assets/book/gen-ict-m2-fig02-router.png",
 caption: "Figure 2. A home router directs traffic: like a clerk sending letters to the right desks.",
 alt: "Wi-Fi router directing packet trails",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Your router directs traffic on a home network. It does not invent the internet. It manages local paths and hands traffic onward when needed.",
 },
 ],
 },
 {
 title: "Packets on a path",
 layout: "full-fig",
 figures: [
 {
 place: "full",
 src: "/games/ict-fundamentals/assets/book/gen-ict-m2-fig03-packets.png",
 caption: "Figure 3. Big files split into packets: small labeled chunks of a bigger message.",
 alt: "Message splitting into packets on a cable",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Big files are split into packets. Each packet carries a piece plus addressing info so it can be rebuilt. Wired paths use copper or fiber. Wireless paths use radio through air.",
 },
 ],
 },
 {
 title: "Fast vs delayed",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/ict-fundamentals/assets/book/gen-ict-m2-fig04-speed.png",
 caption: "Figure 4. Bandwidth is pipe width. Latency is delay on the stopwatch.",
 alt: "Wide data pipe beside a delay stopwatch",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Bandwidth is how much data can flow in a time window: the width of the pipe. Latency is delay: how long a packet takes to arrive.",
 },
 {
 type: "p",
 text: "Games feel lag when latency is high even if bandwidth looks fine. Capacity and delay are different problems.",
 },
 ],
 },
 {
 title: "Wireless is still physics",
 layout: "full-fig",
 figures: [
 {
 place: "full",
 src: "/games/ict-fundamentals/assets/book/gen-ict-m2-fig05-wireless.png",
 caption: "Figure 5. Walls, distance, and interference can weaken signals and drop packets.",
 alt: "Wi-Fi signal weakened by walls",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Wireless does not mean magic. Radio waves are real physics. Distance, walls, and interference can weaken signals until packets fail.",
 },
 ],
 },
 {
 title: "Same idea, different medium",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/ict-fundamentals/assets/book/gen-ict-m2-fig06-path.png",
 caption: "Figure 6. Fiber and radio both move signals. Only the medium changes.",
 alt: "Fiber optic cable beside a radio tower",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Fiber and radio both move signals. The medium changes; the packet idea stays. Shared rules plus a path equals delivery.",
 },
 ],
 },
 {
 title: "Home Wi-Fi lab",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/ict-fundamentals/assets/book/gen-ict-m2-fig07-wifi.png",
 caption: "Figure 7. Stand near the router, then far away. Explain the change with signal or capacity.",
 alt: "Strong signal near router versus weak far away",
 },
 ],
 blocks: [
 {
 type: "ul",
 items: [
 "What is one wired link in your home?",
 "Is a problem delay or capacity?",
 "What weakens wireless in this room?",
 ],
 },
 ],
 },
 {
 title: "Protocols: shared rulebooks",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/ict-fundamentals/assets/book/gen-ict-m2-fig09-protocol.png",
 caption: "Figure 8. A protocol is the shared rulebook for packing and addressing.",
 alt: "Two devices agreeing on packet rules",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "A protocol is the shared rulebook for packing, addressing, and rebuilding messages. Without agreed rules, packets are just noise.",
 },
 ],
 },
 {
 title: "Myths to bust",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/ict-fundamentals/assets/book/gen-ict-m2-fig08-cloud.png",
 caption: "Figure 9. The cloud is other people's servers reached through networks.",
 alt: "Cloud dissolving into server racks",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Myth: the cloud is a fluffy computer in the sky. Better: it is other people's servers reached through networks.",
 },
 {
 type: "p",
 text: "Myth: more bars always mean unlimited speed. Better: bars hint at signal; bandwidth and congestion still matter.",
 },
 ],
 },
 {
 title: "Mastery",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/ict-fundamentals/assets/book/gen-ict-m2-fig10-close.png",
 caption: "Figure 10. Teach networks as paths for packets, not mystery Wi-Fi dust.",
 alt: "Packet paths between router and devices",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Teach a friend in one minute: networks move packets; routers guide paths; bandwidth is capacity; latency is delay.",
 },
 {
 type: "ul",
 items: [
 "Define packet in one sentence.",
 "Name one wireless risk (walls or distance).",
 "Use the word protocol correctly once.",
 ],
 },
 ],
 },
 ],
};

export default BOOK;
