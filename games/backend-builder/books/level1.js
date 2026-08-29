/**
 * Backend Builder Mission 1 book: Server Basics
 * Companion to the 4-spiral lesson (client/server → request/response → concurrency → DNS).
 */
export const BOOK = {
 missionIndex: 0,
 title: "Server Basics",
 subtitle: "client asks, server answers - the invisible round trip",
 subject: "Backend Builder / Server Basics",
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
 title: "Server Basics",
 art: "/games/backend-builder/assets/book/gen-be-m1-cover.png",
 },
 glossary: [
 { id: "server", term: "server" },
 { id: "client", term: "client" },
 { id: "request", term: "request" },
 { id: "response", term: "response" },
 { id: "route", term: "route" },
 { id: "json", term: "JSON" },
 { id: "status-code", term: "status code" },
 { id: "api", term: "API" },
 ],
 pages: [
 {
 title: "Open the restaurant",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/backend-builder/assets/book/gen-be-m1-fig01-roles.png",
 caption: "Figure 1. Client asks. Server cooks and answers. Two clear roles.",
 alt: "Client and server roles like diner and kitchen",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Every webpage load is a round trip. Your browser is a client placing an order. A server is the kitchen that receives the order and sends food back. Weather apps, school portals, and ticket kiosks all hide that restaurant.",
 },
 {
 type: "ul",
 items: [
 "Spiral 1: who is client and who is server?",
 "Spiral 2: request goes out, response comes back.",
 "Spiral 3: one kitchen handles many tables.",
 "Spiral 4: DNS finds the right restaurant address.",
 ],
 },
 ],
 },
 {
 title: "Routes are menu items",
 layout: "full-fig",
 figures: [
 {
 place: "full",
 src: "/games/backend-builder/assets/book/gen-be-m1-fig02-routes.png",
 caption: "Figure 2. A route is the path that says which kitchen station handles this order.",
 alt: "Server routes as labeled paths",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "A route is an address path on the server - like a menu item that maps to a kitchen station. /weather and /login are different doors. Hit the wrong door and you get the wrong dish, or none at all.",
 },
 {
 type: "ul",
 items: [
 "URL path: which route you asked for.",
 "Server: chooses the handler for that path.",
 "Response: what comes back for that order.",
 ],
 },
 ],
 },
 {
 title: "JSON is the tray",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/backend-builder/assets/book/gen-be-m1-fig03-json.png",
 caption: "Figure 3. JSON packages data in a neat, labeled structure machines share.",
 alt: "JSON data packaged like labeled trays",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "JSON is a common way to pack data on the tray: names paired with values, lists of items, nested boxes. Humans can skim it; programs can parse it. Many APIs speak JSON so client and server share one clear format.",
 },
 ],
 },
 {
 title: "Status codes speak",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/backend-builder/assets/book/gen-be-m1-fig04-status.png",
 caption: "Figure 4. Status codes tell success, not found, or server trouble at a glance.",
 alt: "HTTP status code signals",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "A status code is a short number that summarizes how the order went. 200-class often means success. 404 means that route or resource was not found. 500-class often means the kitchen had an internal problem. Read the code before you blame the paint.",
 },
 {
 type: "ul",
 items: [
 "2xx: usually worked.",
 "4xx: client-side problem (bad ask or missing door).",
 "5xx: server-side problem.",
 ],
 },
 ],
 },
 {
 title: "The request loop",
 layout: "full-fig",
 figures: [
 {
 place: "full",
 src: "/games/backend-builder/assets/book/gen-be-m1-fig05-call.png",
 caption: "Figure 5. Request travels out; response travels back. That is the call.",
 alt: "Request and response call between client and server",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "The blank flicker before a page fills is often this loop: client builds a request, network carries it, server builds a response, network returns it, browser uses the payload. Slow the moment down and you see a waiter, not magic.",
 },
 ],
 },
 {
 title: "Methods are verbs",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/backend-builder/assets/book/gen-be-m1-fig06-methods.png",
 caption: "Figure 6. GET reads, POST creates, and other methods name the kind of ask.",
 alt: "HTTP methods as action verbs",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "HTTP methods are verbs on the order ticket. GET usually means ‘show me.’ POST often means ‘create this.’ Same route can behave differently depending on the verb. Asking the kitchen to cook with the wrong verb wastes a trip.",
 },
 ],
 },
 {
 title: "API = the menu contract",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/backend-builder/assets/book/gen-be-m1-fig10-api.png",
 caption: "Figure 7. An API is the agreed menu: what you can ask and how answers arrive.",
 alt: "API as a shared contract menu",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "An API is the contract between client and server: which routes exist, which methods they accept, what JSON shapes come back. Your weather app does not invent the kitchen - it follows the published menu.",
 },
 ],
 },
 {
 title: "Busy-shift lab",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/backend-builder/assets/book/gen-be-m1-fig07-lab.png",
 caption: "Figure 8. Trace one order from tap to response. Name each role.",
 alt: "Backend lab tracing a server request",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Pick a real tap: open weather, log into a portal, place a shop order. Draw the loop. Label client, request, route, response, and status. One kitchen can serve many tables at once - concurrency is that busy shift.",
 },
 {
 type: "ul",
 items: [
 "Who was the client?",
 "Which route did you hit?",
 "Was the status a success or a problem code?",
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
 src: "/games/backend-builder/assets/book/gen-be-m1-fig08-myth.png",
 caption: "Figure 9. The browser is not the whole system - the kitchen still matters.",
 alt: "Myth busting client-server misconceptions",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Myth: the phone app is the whole system. Better: the app is usually a client; a server still answers.",
 },
 {
 type: "p",
 text: "Myth: a blank screen means CSS failed. Better: often the request never returned a useful response.",
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
 src: "/games/backend-builder/assets/book/gen-be-m1-fig09-close.png",
 caption: "Figure 10. Teach the restaurant: client, request, server, response, status.",
 alt: "Server basics mastery overview",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Teach a friend in one minute: clients ask, servers answer, routes pick the station, JSON packs the tray, status codes report how the order went.",
 },
 {
 type: "ul",
 items: [
 "Name client and server once.",
 "Point to request versus response.",
 "Use the words route and status code correctly once.",
 ],
 },
 ],
 },
 ],
};

export default BOOK;
