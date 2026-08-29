/**
 * Digital book - Cyber Shield Mission 1: Password Power
 * Unique curriculum book (strong unique secrets). Not a template fill-in.
 */
export const BOOK = {
 missionIndex: 0,
 title: "Password Power",
 subtitle: "long unique secrets beat short easy ones",
 subject: "Cyber Shield / Password Power",
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
 title: "Password Power",
 art: "/games/cyber-shield/assets/book/m1-cover.jpg",
 },
 glossary: [
 { id: "credential", term: "credential" },
 { id: "passphrase", term: "passphrase" },
 { id: "entropy", term: "entropy" },
 { id: "phishing", term: "phishing" },
 { id: "breach", term: "breach" },
 { id: "reuse", term: "reuse" },
 { id: "manager", term: "password manager" },
 ],
 pages: [
 {
 title: "Secrets that guard doors",
 layout: "text",
 figures: [
 {
 place: "top",
 slides: [
 {
 src: "/games/cyber-shield/assets/book/m1-cover.jpg",
 caption: "Figure 1. A login is a door. Your credential is the key - treat it like one.",
 alt: "Secure login concept",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "A credential proves you are you. Short dictionary words are keys anyone can copy from a word list.",
 },
 {
 type: "p",
 text: "A passphrase is a longer secret made of several uncommon words - easier to remember, harder to guess.",
 },
 ],
 },
 {
 title: "Length beats clever tricks",
 layout: "full-fig",
 figures: [
 {
 place: "full",
 slides: [
 {
 src: "/games/cyber-shield/assets/book/m1-hook.jpg",
 caption: "Figure 2. Extra characters raise entropy - the guess-space attackers must search.",
 alt: "Password strength concept",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Entropy here means unpredictability. One extra random word can beat a short password stuffed with symbols.",
 },
 {
 type: "ul",
 items: [
 "Longer unique secrets resist guessing",
 "Reuse lets one breach open many accounts",
 "A password manager stores unique secrets safely",
 ],
 },
 ],
 },
 {
 title: "Tricks and traps",
 layout: "text",
 figures: [
 {
 place: "top",
 slides: [
 {
 src: "/games/cyber-shield/assets/book/m1-model.jpg",
 caption: "Figure 3. Phishing pages fake a real login to steal your credential.",
 alt: "Phishing awareness",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Phishing is fake trust - a message that pushes you to type secrets on a look-alike site.",
 },
 {
 type: "p",
 text: "After a breach, leaked passwords get tested everywhere. That is why reuse is so dangerous.",
 },
 ],
 },
 {
 title: "How the mission connects",
 layout: "text",
 blocks: [
 {
 type: "p",
 text: "Meet weak secrets → build length → stop reuse → phishing lab → explain → rule → stretch → myth → fluency → mastery.",
 },
 ],
 },
 {
 title: "Secret lab",
 layout: "split",
 figures: [
 {
 place: "right",
 slides: [
 {
 src: "/games/cyber-shield/assets/book/m1-hook.jpg",
 caption: "Compare short vs long secrets.",
 alt: "Length comparison",
 },
 {
 src: "/games/cyber-shield/assets/book/m1-cover.jpg",
 caption: "One credential per important door.",
 alt: "Unique credentials",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Invent a four-word passphrase you would never post online. Do not use it for a real account - practice only.",
 },
 {
 type: "ul",
 items: [
 "Would a stranger guess it from your bio?",
 "Is it reused anywhere in your story?",
 "Would a password manager help you keep it unique?",
 ],
 },
 ],
 },
 {
 title: "Myths to bust",
 layout: "text",
 blocks: [
 {
 type: "p",
 text: "Myth: P@ssw0rd1 is strong because of symbols. Better: length and uniqueness beat tiny letter swaps.",
 },
 {
 type: "p",
 text: "Myth: Changing one digit each month is enough. Better: unique passphrases plus a manager beat ritual tweaks.",
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
 slides: [
 {
 src: "/games/cyber-shield/assets/book/m1-model.jpg",
 caption: "Figure 4. Teach password power as unique long secrets, not clever shortcuts.",
 alt: "Password mastery",
 },
 ],
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Teach a friend in one minute: long unique passphrases; no reuse; watch phishing; managers help.",
 },
 {
 type: "ul",
 items: [
 "Define entropy in plain words",
 "Explain why reuse fails after a breach",
 "Use the word phishing correctly once",
 ],
 },
 ],
 },
 ],
};

export default BOOK;
