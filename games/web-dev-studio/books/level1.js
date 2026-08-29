/**
 * Web Dev Studio Mission 1 book: HTML House
 * Companion to the 4-spiral lesson (tags → nesting → structure → iframe).
 */
export const BOOK = {
 missionIndex: 0,
 title: "HTML House",
 subtitle: "tags are rooms with doors that open and close",
 subject: "Web Dev Studio / HTML House",
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
 title: "HTML House",
 art: "/games/web-dev-studio/assets/book/gen-web-m1-cover.png",
 },
 glossary: [
 { id: "html", term: "HTML" },
 { id: "element", term: "element" },
 { id: "tag", term: "tag" },
 { id: "attribute", term: "attribute" },
 { id: "nesting", term: "nesting" },
 { id: "semantic", term: "semantic" },
 { id: "iframe", term: "iframe" },
 { id: "hyperlink", term: "hyperlink" },
 ],
 pages: [
 {
 title: "Every page is a house",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/web-dev-studio/assets/book/gen-web-m1-fig01-skeleton.png",
 caption: "Figure 1. HTML is the skeleton: rooms first, paint and wiring later.",
 alt: "Wireframe house skeleton of a webpage",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "HTML means HyperText Markup Language. It does not paint color or run clicks. It marks meaning: this is a title, this is a paragraph, this is a link. Think of a house blueprint before furniture arrives.",
 },
 {
 type: "p",
 text: "Everyday hook: a school notice, a family blog, or a BD news page all start as the same idea - rooms made of tags.",
 },
 {
 type: "ul",
 items: [
 "Spiral 1: one room with opening and closing doors.",
 "Spiral 2: rooms nested inside rooms.",
 "Spiral 3: semantic rooms that name their job.",
 "Spiral 4: a window that shows another page inside.",
 ],
 },
 ],
 },
 {
 title: "Tags are doors",
 layout: "full-fig",
 figures: [
 {
 place: "full",
 src: "/games/web-dev-studio/assets/book/gen-web-m1-fig02-tags.png",
 caption: "Figure 2. An opening tag starts a room; a closing tag ends it.",
 alt: "Opening and closing HTML tags as doors",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "An element is usually an opening tag, content in the middle, and a closing tag. Forget the closing door and later content can leak into the wrong room. The browser still tries to build something - often a messy house.",
 },
 {
 type: "ul",
 items: [
 "Opening tag: the door into the room.",
 "Content: what lives inside.",
 "Closing tag: the door shut behind you.",
 ],
 },
 ],
 },
 {
 title: "Nest the rooms",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/web-dev-studio/assets/book/gen-web-m1-fig03-nest.png",
 caption: "Figure 3. Nesting means close the inner room before the outer one.",
 alt: "Nested rooms inside a webpage house",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Nesting is rooms inside rooms. A paragraph can sit inside a main section. A list item sits inside a list. The rule is tidy: finish the inner room first, then close the outer one. Crossed doors break the house.",
 },
 {
 type: "p",
 text: "Quick check from the lab: if you open body, then open a section, you close the section before you close body.",
 },
 ],
 },
 {
 title: "Semantic choices",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/web-dev-studio/assets/book/gen-web-m1-fig04-semantic.png",
 caption: "Figure 4. Header, nav, main, footer name jobs - not random boxes.",
 alt: "Semantic page sections labeled by role",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Semantic HTML picks tags for meaning: header, nav, main, article, footer. People, screen readers, and search tools understand the map better. A pile of empty boxes can look fine after CSS - and still be hard to navigate.",
 },
 {
 type: "ul",
 items: [
 "Pretty paint comes later with CSS.",
 "Broken structure stays broken even with fancy colors.",
 "Headings (h1-h6) show importance order, not just bold text.",
 ],
 },
 ],
 },
 {
 title: "Cut a window",
 layout: "full-fig",
 figures: [
 {
 place: "full",
 src: "/games/web-dev-studio/assets/book/gen-web-m1-fig05-iframe.png",
 caption: "Figure 5. An iframe is a window that shows another page inside yours.",
 alt: "Iframe window embedding another page",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "An iframe is a room with a view into another document - a map, a video player, a form hosted elsewhere. Your house stays yours; the window frames someone else’s page inside it.",
 },
 {
 type: "p",
 text: "Use it on purpose. Too many windows make a noisy house. One clear embed often beats five.",
 },
 ],
 },
 {
 title: "Attributes add facts",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/web-dev-studio/assets/book/gen-web-m1-fig07-attr.png",
 caption: "Figure 6. Attributes hang extra facts on a tag: where to go, what to show, what to say.",
 alt: "HTML attributes attached to a tag",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Attributes are extra facts on a tag. A hyperlink needs href so the browser knows where to jump. An image needs src for the file and alt for a text description when the picture cannot load or when a reader cannot see it.",
 },
 {
 type: "ul",
 items: [
 "href: where a link goes.",
 "src: where an image or iframe loads from.",
 "alt: words that stand in for an image.",
 ],
 },
 ],
 },
 {
 title: "Links connect houses",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/web-dev-studio/assets/book/gen-web-m1-fig08-link.png",
 caption: "Figure 7. A hyperlink is a doorway from this page to another address.",
 alt: "Hyperlink path between two pages",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "The web is houses connected by doors. An anchor element with an href attribute is that door. Without href, you have a labeled wall, not a doorway.",
 },
 ],
 },
 {
 title: "House lab",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/web-dev-studio/assets/book/gen-web-m1-fig06-close.png",
 caption: "Figure 8. Sketch rooms, choose tags on purpose, then check in the browser.",
 alt: "Browser building a page from HTML",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Build a one-screen About me page: one h1, two paragraphs, one image with alt, one hyperlink. Save, refresh, check. That loop is how HTML skill grows.",
 },
 {
 type: "ul",
 items: [
 "Is your top title a heading element?",
 "Does every image have alt text?",
 "Which attribute makes the link work?",
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
 src: "/games/web-dev-studio/assets/book/gen-web-m1-fig09-myth.png",
 caption: "Figure 9. Bold text is not a heading. Structure and style are different jobs.",
 alt: "Bold style versus real heading structure",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Myth: bigger bold text is the same as a heading. Better: heading tags create structure; bold alone is style.",
 },
 {
 type: "p",
 text: "Myth: HTML is outdated because apps look fancy. Better: almost every web UI still rests on HTML elements.",
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
 src: "/games/web-dev-studio/assets/book/gen-web-m1-fig10-mastery.png",
 caption: "Figure 10. Teach HTML as meaningful structure the browser can build.",
 alt: "Complete HTML house mastery overview",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Teach a friend in one minute: HTML elements use tags; nesting stays tidy; attributes add facts; semantic choices make pages clearer; an iframe is a window into another page.",
 },
 {
 type: "ul",
 items: [
 "Write one element with open and close tags.",
 "Name one attribute you used.",
 "Use the words nesting and semantic correctly once.",
 ],
 },
 ],
 },
 ],
};

export default BOOK;
