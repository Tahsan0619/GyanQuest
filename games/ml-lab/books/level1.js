/**
 * ML Lab Mission 1 book: Teach the Model
 * Companion to the 4-spiral lesson (clean → split → epochs → evaluate).
 */
export const BOOK = {
 missionIndex: 0,
 title: "Teach the Model",
 subtitle: "clean, split, practice, then an honest final exam",
 subject: "Machine Learning / Teach the Model",
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
 title: "Teach the Model",
 art: "/games/ml-lab/assets/book/gen-ml-m1-cover.png",
 },
 glossary: [
 { id: "dataset", term: "dataset" },
 { id: "train-set", term: "train set" },
 { id: "test-set", term: "test set" },
 { id: "epoch", term: "epoch" },
 { id: "early-stopping", term: "early stopping" },
 { id: "evaluation", term: "evaluation" },
 { id: "overfitting", term: "overfitting" },
 ],
 pages: [
 {
 title: "Enroll the apprentice",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/ml-lab/assets/book/gen-ml-m1-fig01-clean.png",
 caption: "Figure 1. First job: clean the deck. Garbage in, garbage out.",
 alt: "Cleaning messy photo cards into a neat deck",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Machine learning is the disciplined work cycle behind the AI apprentice. Fruit sorters, handwriting apps, and spam filters all follow it: clean material, seal a fair exam, practice in loops, stop wisely, then evaluate honestly.",
 },
 {
 type: "ul",
 items: [
 "Spiral 1: gather and clean good material.",
 "Spiral 2: split training from testing.",
 "Spiral 3: practice loops and when to stop.",
 "Spiral 4: final exam and the full cycle.",
 ],
 },
 ],
 },
 {
 title: "Split before you train",
 layout: "full-fig",
 figures: [
 {
 place: "full",
 src: "/games/ml-lab/assets/book/gen-ml-m1-fig02-split.png",
 caption: "Figure 2. Practice pile for training. Sealed vault for the final exam.",
 alt: "Training deck versus sealed test vault",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Split the dataset early. The train set is practice material. The test set is a sealed final exam. If you train on the exam cards, the score lies. Seal the vault before the first practice lap.",
 },
 {
 type: "ul",
 items: [
 "Train set: cards the model may study.",
 "Test set: cards locked until evaluation.",
 "Never peek at the exam during practice.",
 ],
 },
 ],
 },
 {
 title: "Epochs = practice laps",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/ml-lab/assets/book/gen-ml-m1-fig03-epochs.png",
 caption: "Figure 3. An epoch is one full lap through the training cards.",
 alt: "Model looping through training epochs",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "An epoch is one complete pass through the training deck. Models usually need many laps. Each lap adjusts the apprentice a little. Too few laps and it is undertrained. Endless laps without care can start memorizing noise.",
 },
 ],
 },
 {
 title: "When to stop",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/ml-lab/assets/book/gen-ml-m1-fig04-stop.png",
 caption: "Figure 4. Early stopping: quit while the model still generalizes.",
 alt: "Error curve with early stopping at sweet spot",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Early stopping means ending practice when more laps stop helping on held-out checks - or start hurting. Overfitting is when the model memorizes the practice deck and fails new cards. Discipline beats ‘just train forever.’",
 },
 ],
 },
 {
 title: "Honest final exam",
 layout: "full-fig",
 figures: [
 {
 place: "full",
 src: "/games/ml-lab/assets/book/gen-ml-m1-fig05-eval.png",
 caption: "Figure 5. Evaluation opens the sealed vault once and scores honestly.",
 alt: "Final exam evaluation with check and cross marks",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Evaluation is the honest score on the sealed test set. One open, one judgment. That number answers: did the patterns travel, or did we only memorize practice?",
 },
 ],
 },
 {
 title: "The full cycle",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/ml-lab/assets/book/gen-ml-m1-fig06-cycle.png",
 caption: "Figure 6. Clean → split → train → evaluate. Then improve and repeat.",
 alt: "Four-station machine learning work cycle",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "The mission rule sentence is the cycle itself: clean data, split train from test, practice in epochs with early stopping, then evaluate. Skip a station and the academy grade becomes fake.",
 },
 ],
 },
 {
 title: "Same cycle, many jobs",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/ml-lab/assets/book/gen-ml-m1-fig07-fruit.png",
 caption: "Figure 7. A fruit photo sorter still needs clean labels, split, train, evaluate.",
 alt: "Fruit photo classifier with model sphere",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Whether the cards show fruit, handwriting, or spam, the work cycle stays the same. Change the material, keep the discipline.",
 },
 ],
 },
 {
 title: "Academy lab",
 layout: "text",
 figures: [
 {
 place: "top",
 src: "/games/ml-lab/assets/book/gen-ml-m1-fig08-lab.png",
 caption: "Figure 8. Run one full academy shift: clean, seal, practice, exam.",
 alt: "Child running ML training academy lab",
 },
 ],
 blocks: [
 {
 type: "ul",
 items: [
 "Which cards were dirty and fixed?",
 "Was the test vault sealed before training?",
 "Did you stop before overfitting?",
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
 src: "/games/ml-lab/assets/book/gen-ml-m1-fig09-myth.png",
 caption: "Figure 9. Training on the exam is cheating - seal the vault early.",
 alt: "Myth of training on exam cards versus sealed vault",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Myth: train on every card including the final exam. Better: seal the test set first.",
 },
 {
 type: "p",
 text: "Myth: more epochs always means a smarter model. Better: early stopping protects generalization.",
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
 src: "/games/ml-lab/assets/book/gen-ml-m1-fig10-close.png",
 caption: "Figure 10. Teach the ML cycle: clean, split, train, evaluate.",
 alt: "ML mastery closing academy scene",
 },
 ],
 blocks: [
 {
 type: "p",
 text: "Teach a friend in one minute: clean the dataset, split train from test, practice in epochs, stop before overfitting, then evaluate on the sealed exam.",
 },
 {
 type: "ul",
 items: [
 "Name train set versus test set once.",
 "Explain one reason to stop early.",
 "Use the word evaluation correctly once.",
 ],
 },
 ],
 },
 ],
};

export default BOOK;
