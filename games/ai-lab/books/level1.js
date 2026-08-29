/**
 * AI Lab Mission 1 book: What is AI?
 * Companion to the 4-spiral lesson (rules vs ML → training → test → real AI).
 */
export const BOOK = {
 missionIndex: 0,
 title: "What is AI?",
 subtitle: "an apprentice that learns patterns from examples",
 subject: "Artificial Intelligence / What is AI?",
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
 title: "What is AI?",
 art: "/games/ai-lab/assets/book/gen-ai-m1-cover.png",
 },
 glossary: [
 { id: "ai", term: "AI" },
 { id: "example", term: "example" },
 { id: "pattern", term: "pattern" },
 { id: "training", term: "training" },
 { id: "accuracy", term: "accuracy" },
 { id: "test", term: "test" },
 { id: "generalization", term: "generalization" },
 ],
 pages: [
 {
 title: "Meet the apprentice",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/ai-lab/assets/book/gen-ai-m1-fig01-rules.png",
 caption: "Figure 1. A rulebook employee follows IF…THEN lists. An apprentice learns from examples.",
 alt: "Rule checklist worker versus apprentice learning from cards",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "AI is not magic and not a giant handwritten rulebook. Think of an apprentice: it studies many labeled examples, gets corrected, and slowly finds patterns. Phone photo tags, voice assistants, and spam filters all work that way.",
 },
 {
 type: "ul",
 items: [
 "Spiral 1: rules versus learning from examples.",
 "Spiral 2: training rounds and accuracy.",
 "Spiral 3: testing on brand-new cases.",
 "Spiral 4: real apps that use the same idea.",
 ],
 },
 ],
 },
 {
 title: "Examples, not every rule",
 layout: "full-fig",
 figures: [
 {
 place: "full",
 src: "/games/ai-lab/assets/book/gen-ai-m1-fig02-examples.png",
 caption: "Figure 2. Labeled example cards are the teaching material.",
 alt: "Desk covered with labeled example photo cards",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Nobody wrote a perfect rule for every dog angle and lighting. Instead, the apprentice sees thousands of labeled photos and notices patterns: ears, fur, shapes. Labels turn pictures into lessons.",
 },
 {
 type: "ul",
 items: [
 "Example: one labeled case.",
 "Pattern: what repeats across many examples.",
 "Garbage labels make a confused apprentice.",
 ],
 },
 ],
 },
 {
 title: "Training rounds",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/ai-lab/assets/book/gen-ai-m1-fig03-train.png",
 caption: "Figure 3. Training is practice with correction, round after round.",
 alt: "Apprentice training with correction sparks",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Training means showing examples, checking the guess, and adjusting. Wrong guesses get a gentle correction. Right guesses get reinforced. One pass is not enough - rounds of practice make the patterns stick.",
 },
 ],
 },
 {
 title: "Accuracy over time",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/ai-lab/assets/book/gen-ai-m1-fig04-accuracy.png",
 caption: "Figure 4. Accuracy climbs as training teaches better patterns.",
 alt: "Rising accuracy curve with stars",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Accuracy is how often the apprentice is right on the practice set. Early on it is clumsy. With good examples and enough rounds, the curve rises. Rising practice accuracy is progress - but not the final exam yet.",
 },
 ],
 },
 {
 title: "Seal a real test",
 layout: "full-fig",
 figures: [
 {
 place: "full",
 src: "/games/ai-lab/assets/book/gen-ai-m1-fig05-test.png",
 caption: "Figure 5. A sealed test vault holds brand-new cases never used in training.",
 alt: "Vault of unseen test cards for final exam",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "A fair test uses cases the apprentice has never practiced on. If you train on the exam cards, the score looks amazing and means little. Seal the test set early. Open it only when you are ready to judge honestly.",
 },
 ],
 },
 {
 title: "Generalization",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/ai-lab/assets/book/gen-ai-m1-fig06-generalize.png",
 caption: "Figure 6. Generalization: patterns that still work on new angles and lighting.",
 alt: "Apprentice recognizing a new dog photo angle",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Generalization means the patterns travel to new situations. A new dog photo, a new spam email, a new voice clip - if training taught real patterns, the apprentice still has a chance. Memorizing only the practice deck is not intelligence.",
 },
 ],
 },
 {
 title: "Real AI apps",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/ai-lab/assets/book/gen-ai-m1-fig07-apps.png",
 caption: "Figure 7. Photo tags, voice help, spam filters, recommendations - same apprentice idea.",
 alt: "Collage of everyday AI applications",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Everyday AI is the same story wearing different clothes: examples in, patterns learned, new inputs scored. The mission rule sentence is simple: AI learns patterns from examples, then is tested on new ones.",
 },
 ],
 },
 {
 title: "Apprentice lab",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/ai-lab/assets/book/gen-ai-m1-fig08-lab.png",
 caption: "Figure 8. Train with examples, watch accuracy, then open a sealed test.",
 alt: "Child training an apprentice with example cards",
 },
 ],
 blocks: [
 {
 type: "ul",
 items: [
 "Did you train on examples or invent endless rules?",
 "Was the test set sealed before training?",
 "Did accuracy on new cases stay honest?",
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
 src: "/games/ai-lab/assets/book/gen-ai-m1-fig09-myth.png",
 caption: "Figure 9. AI is not a magic wand. It is learning from examples.",
 alt: "Magic wand myth versus apprentice learning",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Myth: AI magically understands like a person. Better: it finds patterns in examples it was shown.",
 },
 {
 type: "p",
 text: "Myth: a perfect rulebook for every case is easier. Better: for messy real photos, examples beat endless IF…THEN lists.",
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
 src: "/games/ai-lab/assets/book/gen-ai-m1-fig10-close.png",
 caption: "Figure 10. Teach AI as an apprentice: examples, training, honest tests.",
 alt: "Apprentice mastery closing scene",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Teach a friend in one minute: AI is an apprentice that learns patterns from labeled examples, improves with training, and must be tested on brand-new cases to prove generalization.",
 },
 {
 type: "ul",
 items: [
 "Contrast rules versus examples once.",
 "Name training and test correctly once.",
 "Use the word generalization correctly once.",
 ],
 },
 ],
 },
 ],
};

export default BOOK;
