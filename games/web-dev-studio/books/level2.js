/**
 * Web Dev Studio Mission 2 book: CSS Style
 * Companion to the 4-spiral lesson (selectors → box model → size/align → cascade).
 */
export const BOOK = {
 missionIndex: 1,
 title: "CSS Style",
 subtitle: "paint, space, and alignment on top of structure",
 subject: "Web Dev Studio / CSS Style",
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
 title: "CSS Style",
 art: "/games/web-dev-studio/assets/book/gen-web-m2-cover.png",
 },
 glossary: [
 { id: "css", term: "CSS" },
 { id: "selector", term: "selector" },
 { id: "property", term: "property" },
 { id: "box-model", term: "box model" },
 { id: "margin", term: "margin" },
 { id: "padding", term: "padding" },
 { id: "cascade", term: "cascade" },
 { id: "responsive", term: "responsive" },
 ],
 pages: [
 {
 title: "Paint on the house",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/web-dev-studio/assets/book/gen-web-m2-fig01-layer.png",
 caption: "Figure 1. CSS is a style layer on top of the HTML skeleton.",
 alt: "Style layer painted over an HTML structure",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "CSS means Cascading Style Sheets. HTML built the rooms. CSS decides color, spacing, borders, and how things line up. Without it, the house is structurally perfect and still flat and cramped.",
 },
 {
 type: "p",
 text: "Everyday hook: school posters, shop cards, and rickshaw ads all use color, gaps, and alignment - the same ideas CSS brings to a page.",
 },
 {
 type: "ul",
 items: [
 "Spiral 1: selectors point at the right rooms.",
 "Spiral 2: every room is a box with edges.",
 "Spiral 3: size and alignment make space livable.",
 "Spiral 4: cascade lets one rule restyle many rooms.",
 ],
 },
 ],
 },
 {
 title: "Every room is a box",
 layout: "full-fig",
 figures: [
 {
 place: "full",
 src: "/games/web-dev-studio/assets/book/gen-web-m2-fig02-box.png",
 caption: "Figure 2. Content, padding, border, margin: the box model.",
 alt: "CSS box model layers around content",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "The box model is the mental picture for layout. Content sits in the middle. Padding is soft space inside the border. The border is the wall. Margin is the gap outside the wall between this room and the next.",
 },
 {
 type: "ul",
 items: [
 "Padding: breathing room inside.",
 "Margin: breathing room outside.",
 "Border: the edge you can see.",
 ],
 },
 ],
 },
 {
 title: "Line them up",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/web-dev-studio/assets/book/gen-web-m2-fig03-flex.png",
 caption: "Figure 3. Flex and alignment tools arrange rooms side by side or stacked.",
 alt: "Flex layout arranging page sections",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Size and alignment turn a pile of boxes into a readable layout. Flex tools help rooms share a row or stack cleanly. Width, height, and justify choices decide whether a poster feels cramped or calm.",
 },
 {
 type: "p",
 text: "Quick check: if two cards hug each other with no gap, you probably need margin or a gap property - not more HTML tags.",
 },
 ],
 },
 {
 title: "Selectors aim the brush",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/web-dev-studio/assets/book/gen-web-m2-fig04-selector.png",
 caption: "Figure 4. A selector picks which elements get which style.",
 alt: "CSS selector targeting page elements",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "A rule has a selector and a set of properties. The selector aims: all paragraphs, this class, that id. Properties are the paint instructions: color, font-size, padding. Miss the selector and you paint the wrong wall.",
 },
 {
 type: "ul",
 items: [
 "Element selector: every matching tag.",
 "Class selector: a named group you choose.",
 "Id selector: one unique target.",
 ],
 },
 ],
 },
 {
 title: "Phone and desk",
 layout: "full-fig",
 figures: [
 {
 place: "full",
 src: "/games/web-dev-studio/assets/book/gen-web-m2-fig05-responsive.png",
 caption: "Figure 5. Responsive style adapts spacing and layout to screen width.",
 alt: "Same page on phone and desktop widths",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Responsive design means the house still fits when the window shrinks. You may stack columns, shrink type, or change padding so thumbs can tap. One HTML structure; style that bends with the viewport.",
 },
 ],
 },
 {
 title: "Cascade = many sheets",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/web-dev-studio/assets/book/gen-web-m2-fig06-cascade.png",
 caption: "Figure 6. Styles cascade: later and more specific rules can win.",
 alt: "Cascading stylesheets flowing down a page",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Cascade is why the name Cascading Style Sheets exists. Browser defaults, your stylesheet, and more specific rules stack. When two rules fight, specificity and order decide the winner. That is power: restyle many rooms from one place.",
 },
 ],
 },
 {
 title: "Properties do the work",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/web-dev-studio/assets/book/gen-web-m2-fig07-style.png",
 caption: "Figure 7. Color, type, and spacing are properties applied to selected rooms.",
 alt: "Styled webpage with color and typography",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Property names are the verbs of CSS. Change background, text color, or letter spacing and the same HTML reads differently. Style is not decoration alone - it is how meaning becomes readable.",
 },
 ],
 },
 {
 title: "Style lab",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/web-dev-studio/assets/book/gen-web-m2-fig09-lab.png",
 caption: "Figure 8. Pick a card. Set color, padding, and margin. Watch the box change.",
 alt: "CSS lab painting a card layout",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Restyle one product card: change background, add padding, then margin. Refresh. Ask whether the change was inside the border or outside it.",
 },
 {
 type: "ul",
 items: [
 "Which selector did you aim?",
 "Was the gap margin or padding?",
 "Could one class restyle three cards at once?",
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
 src: "/games/web-dev-studio/assets/book/gen-web-m2-fig10-myth.png",
 caption: "Figure 9. Inline inline-only habits hide the power of one shared stylesheet.",
 alt: "Myth busting CSS misconceptions",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Myth: CSS is only for making things pretty. Better: spacing and alignment are how people finish reading.",
 },
 {
 type: "p",
 text: "Myth: more inline styles are clearer. Better: one shared sheet keeps many rooms consistent through the cascade.",
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
 src: "/games/web-dev-studio/assets/book/gen-web-m2-fig08-close.png",
 caption: "Figure 10. Teach CSS as selectors, boxes, and cascade on top of HTML.",
 alt: "Finished styled house mastery view",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Teach a friend in one minute: selectors aim, properties paint, the box model explains gaps, cascade restyles many rooms, responsive style fits phone and desk.",
 },
 {
 type: "ul",
 items: [
 "Name one selector and one property you used.",
 "Point to padding versus margin once.",
 "Use the word cascade correctly once.",
 ],
 },
 ],
 },
 ],
};

export default BOOK;
