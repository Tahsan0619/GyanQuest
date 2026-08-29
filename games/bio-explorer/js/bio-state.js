/**
 * Bio Explorer shared lab state (Chem / Force pattern).
 */
export const bioLabState = {
 heat: 0.12,
 heatTarget: 0.12,
 energy: 0.55,
 energyTarget: 0.55,
 phase: "desk",
 mode: "cat",
 myth: 0,
 mythPhase: "claim",
 mythBusted: false,
 bustedAt: 0,
 reveal: false,
 prompt: "Bio drill!",
 flashColor: 0x22c55e,
 animDuration: 3200,
 failPulse: 0,
 successPulse: 0,
 tokenProgress: 0,
 sortPlaced: 0,
 placed: {},
 selectedId: null,
 masteryStep: 0,
 scale: 0,
 reducedMotion: false,
 _placedVersion: 0,
 /** Living or Not (legacy lab fields kept) */
 lifeScore: 0,
 sprout: 0,
 labFocus: "water",
 /** Living or Not: MRS GREN investigation */
 lifeSpot: 0,
 lifeOpenU: 0,
 lifeSeen: false,
 lifePlaced: {},
 lifeSortDone: false,
 lifeSelected: null,
 lifeProve: {},
 lifeProvePick: null,
 lifeProveDone: false,
 lifeSuspect: 0,
 lifeMarks: {},
 lifeFlameDone: false,
 lifeCrystalDone: false,
 lifeVirusDone: false,
 lifeSeedDone: false,
 lifeSeedWater: false,
 lifeSeedT0: 0,
 lifeFlameFuel: 0,
 lifeFlameWind: 0,
 lifeFlameSmoke: 0,
 lifeFlameFlicker: 0,
 lifeMars: [null, null, null, null],
 lifeMarsI: 0,
 lifeMarsDone: false,
 lifeMarsOpt: false,
 lifeCloseU: 0,
 spiralStop: 0,
 spiralUntil: 0,
 spiralFinish: false,
 /** Cell City */
 cellZoom: 0.2,
 organelle: "membrane",
 cellOpenU: 0,
 cellSeen: false,
 cellZoomClick: 0,
 cellLeafClick: 0,
 cellView: "hand",
 cellTour: {},
 cellTourStop: null,
 cellTourDone: false,
 cellPlant: {},
 cellPlantPick: null,
 cellPlantDone: false,
 cellLineStep: 0,
 cellLineDone: false,
 cellCloseU: 0,
 /** Plant Power */
 sun: 0.3,
 rootWater: 0.2,
 beeVisit: 0,
 plantOpenU: 0,
 plantSeen: false,
 plantParts: {},
 plantPartPick: null,
 plantBuildDone: false,
 plantKitchen: {},
 plantKitchenPick: null,
 plantKitchenPhase: "in",
 plantKitchenDone: false,
 /** Leaf factory toggles (plantPhoto) */
 plantPhotoSun: false,
 plantPhotoWater: false,
 plantPhotoCo2: false,
 plantPhotoGlucoseSep: false,
 plantPhotoOxygenSep: false,
 plantTracePhase: "water",
 plantWaterStep: 0,
 plantSugarStep: 0,
 plantTraceDone: false,
 plantBee: "idle",
 plantBloomPhase: "pollinate",
 plantSeedI: 0,
 plantSeedOk: {},
 plantBloomDone: false,
 plantCloseU: 0,
};

export const chemLabState = bioLabState;

export const BIO_ASSET_PATHS = {
 life: "/games/bio-explorer/assets/living-or-not.svg",
 cell: "/games/bio-explorer/assets/cell-city.svg",
 plant: "/games/bio-explorer/assets/plant-power.svg",
 rule: "/games/bio-explorer/assets/life-rule.svg",
 cellRule: "/games/bio-explorer/assets/cell-rule.svg",
 plantRule: "/games/bio-explorer/assets/plant-rule.svg",
 myth: "/games/bio-explorer/assets/bio-myth.svg",
 sprout: "/games/bio-explorer/assets/seed-sprout.svg",
};

export const ATOM_ASSET_PATHS = BIO_ASSET_PATHS;

export function setHeatTarget(v) {
 bioLabState.heatTarget = Math.max(0, Math.min(1, v));
}

export function pulseFailFeedback(ms = 420) {
 bioLabState.failPulse = performance.now() + ms;
}

export function pulseSuccessFeedback(ms = 320) {
 bioLabState.successPulse = performance.now() + ms;
}

export const LIFE_SORT_ITEMS = [
 { id: "dog", label: "Dog", bin: "living", hint: "Breathes, moves, grows" },
 { id: "tree", label: "Tree", bin: "living", hint: "Grows from sunlight and water" },
 { id: "rock", label: "Rock", bin: "nonliving", hint: "Stays the same unless broken" },
 { id: "chair", label: "Chair", bin: "nonliving", hint: "Made by people; never grows" },
 { id: "mushroom", label: "Mushroom", bin: "living", hint: "Fungus that feeds and reproduces" },
 { id: "car", label: "Car", bin: "nonliving", hint: "Moves only with fuel and a driver" },
 { id: "person", label: "Person", bin: "living", hint: "Human: all seven life signs" },
 { id: "cloud", label: "Cloud", bin: "nonliving", hint: "Water droplets, not an organism" },
];

export const MRS_GREN = [
 {
 id: "movement",
 letter: "M",
 name: "Movement",
 def: "changing position, or moving parts of the body",
 example: "Real example: a dog runs; a mushroom shoots spores into the wind.",
 },
 {
 id: "respiration",
 letter: "R",
 name: "Respiration",
 def: "releasing energy from food, at the cellular level",
 example: "Real example: your cells break sugar with oxygen to make energy (not the same as breathing alone).",
 },
 {
 id: "sensitivity",
 letter: "S",
 name: "Sensitivity",
 def: "detecting and responding to changes in the surroundings",
 example: "Real example: a plant leans toward sunlight; your hand pulls back from heat.",
 },
 {
 id: "growth",
 letter: "G",
 name: "Growth",
 def: "increasing in size or complexity over time",
 example: "Real example: a seedling becomes a taller tree with thicker trunk and more leaves.",
 },
 {
 id: "reproduction",
 letter: "R",
 name: "Reproduction",
 def: "producing new individuals of the same kind",
 example: "Real example: a tree makes seeds; a mushroom releases spores that start new fungi.",
 },
 {
 id: "excretion",
 letter: "E",
 name: "Excretion",
 def: "removing waste products made by the body's own processes",
 example: "Real example: animals release CO₂ and urine; plants release oxygen as a waste of photosynthesis.",
 },
 {
 id: "nutrition",
 letter: "N",
 name: "Nutrition",
 def: "taking in and using materials for energy and growth",
 example: "Real example: a dog eats food; a tree takes water, minerals, and sunlight to make sugar.",
 },
];

export const LIFE_PROVE_CARDS = [
 { id: "spores", label: "Spores puff into the air", trait: "movement", scene: "spores drift off the gills" },
 { id: "sugars", label: "Cells break down sugars", trait: "respiration", scene: "energy released inside the cells" },
 { id: "light", label: "Cap curls toward light", trait: "sensitivity", scene: "cap tilts to a bright window" },
 { id: "bigger", label: "Grows larger over days", trait: "growth", scene: "stem and cap get taller and wider" },
 { id: "nearby", label: "A new mushroom sprouts nearby", trait: "reproduction", scene: "a baby mushroom appears beside it" },
 { id: "gas", label: "A puff of moisture or gas", trait: "excretion", scene: "waste vapor leaves the tissues" },
 { id: "wood", label: "Nutrients from decaying wood", trait: "nutrition", scene: "mycelium feeds on the log" },
];

export const LIFE_FLAME_EVIDENCE = [
 { id: "flicker", label: "Flickers and spreads", trait: "movement", effect: "flicker" },
 { id: "fuelgrow", label: "Grows if given fuel", trait: "growth", effect: "fuel" },
 { id: "consumes", label: "Consumes fuel", trait: "nutrition", effect: "consume" },
 { id: "smoke", label: "Releases smoke and gas", trait: "excretion", effect: "smoke" },
 { id: "wind", label: "Leans with wind or oxygen", trait: "sensitivity", effect: "wind" },
];

export const LIFE_MARS = [
 {
 id: "shape",
 title: "Rock formation",
 prompt: "A strange rock formation has slowly changed shape over 6 months.",
 hint: "Looks like Growth. No Nutrition, Respiration, or Reproduction.",
 ok: "weak",
 },
 {
 id: "plume",
 title: "Gas plume",
 prompt: "A gas plume spikes on a strange, non-random daily rhythm.",
 hint: "A possible Respiration signal. Scientists actually hunt this.",
 ok: "strong",
 },
 {
 id: "metal",
 title: "Smooth metal",
 prompt: "A perfectly smooth, symmetrical metallic object.",
 hint: "None of the 7 apply in a biological sense.",
 ok: "none",
 },
 {
 id: "sample",
 title: "Warmed sample",
 prompt: "Warmed and given water, the sample shows chemistry consistent with metabolism.",
 hint: "Like the dormant seed: activity appears when conditions are right.",
 ok: "strong",
 optional: true,
 },
];

export const CELL_ORGANELLES = [
 { id: "nucleus", city: "City Hall", name: "Nucleus", def: "contains the cell's DNA and controls its activities", cityLine: "holds the master instructions (DNA) and directs everything else in the city" },
 { id: "mito", city: "Power Plants", name: "Mitochondria", def: "release energy from food through respiration (the powerhouse of the cell)", cityLine: "convert fuel into usable energy for the whole city" },
 { id: "ribo", city: "Factories", name: "Ribosomes", def: "build proteins from instructions sent by the nucleus", cityLine: "build proteins, the city's actual products, following City Hall's instructions" },
 { id: "er", city: "Highway Network", name: "Endoplasmic Reticulum", def: "transports materials throughout the cell", cityLine: "transports products around the city" },
 { id: "golgi", city: "Post Office", name: "Golgi Apparatus", def: "packages and ships proteins to their final destination", cityLine: "packages and ships products to exactly where they are needed, inside or outside the city" },
 { id: "membrane", city: "City Wall", name: "Cell (Plasma) Membrane", def: "controls what substances enter and leave the cell", cityLine: "controls exactly what enters and leaves the city" },
];

export const CELL_PLANT_ADDONS = [
 { id: "wall", city: "Fortress wall", name: "Cell Wall", hint: "A second, much stronger wall, like a fortress wall built outside the city gates, for extra structure and protection.", drop: "wall" },
 { id: "chloro", city: "Solar Panels", name: "Chloroplasts", hint: "Solar Panels: capture sunlight and turn it directly into food energy for the city.", drop: "chloro" },
 { id: "vacuole", city: "Water Tower", name: "Large Central Vacuole", hint: "Water Tower: a huge storage tank holding water, nutrients, and waste, and giving the whole city its shape and firmness.", drop: "vacuole" },
];

export const CELL_LINE = [
 { from: "nucleus", to: "ribo", caption: "Instructions received. The factory begins building." },
 { from: "ribo", to: "er", caption: "Product enters the highway for transport." },
 { from: "er", to: "golgi", caption: "Product gets packaged and labeled." },
 { from: "golgi", to: "membrane", caption: "Product is shipped out of the city." },
];

export const CELL_THEORY = [
 "All living things are made of one or more cells",
 "The cell is the basic unit of structure and function in living things",
 "All cells come from other cells that already existed",
];

export function resetLivingState() {
 bioLabState.lifeSpot = 0;
 bioLabState.lifeOpenU = 0;
 bioLabState.lifeSeen = false;
 bioLabState.lifePlaced = {};
 bioLabState.lifeSortDone = false;
 bioLabState.lifeSelected = null;
 bioLabState.lifeProve = {};
 bioLabState.lifeProvePick = null;
 bioLabState.lifeProveDone = false;
 bioLabState.lifeSuspect = 0;
 bioLabState.lifeMarks = {};
 bioLabState.lifeFlameDone = false;
 bioLabState.lifeCrystalDone = false;
 bioLabState.lifeVirusDone = false;
 bioLabState.lifeSeedDone = false;
 bioLabState.lifeSeedWater = false;
 bioLabState.lifeSeedT0 = 0;
 bioLabState.lifeFlameFuel = 0;
 bioLabState.lifeFlameWind = 0;
 bioLabState.lifeFlameSmoke = 0;
 bioLabState.lifeFlameFlicker = 0;
 bioLabState.lifeMars = [null, null, null, null];
 bioLabState.lifeMarsI = 0;
 bioLabState.lifeMarsDone = false;
 bioLabState.lifeMarsOpt = false;
 bioLabState.lifeCloseU = 0;
 bioLabState.spiralStop = 0;
 bioLabState.spiralUntil = 0;
 bioLabState.spiralFinish = false;
 bioLabState.phase = "open";
 bioLabState.placed = {};
 bioLabState.selectedId = null;
 bioLabState.reveal = false;
 bioLabState.prompt = "";
}

export const PLANT_ORGANS = [
 { id: "roots", name: "Roots", drop: "roots", job: "anchor the plant and take in water", def: "anchors the plant in soil and absorbs water and minerals", snap: "Roots wiggle into the soil." },
 { id: "stem", name: "Stem", drop: "stem", job: "holds the plant up and connects everything", def: "supports the plant and transports materials between roots and leaves", snap: "The stem stands up firm and tall." },
 { id: "leaves", name: "Leaves", drop: "leaves", job: "catch sunlight to make food", def: "the plant's main site of photosynthesis: making food from sunlight", snap: "Leaves turn slightly to face the sun." },
 { id: "flower", name: "Flower", drop: "flower", job: "makes seeds for the next generation", def: "the plant's reproductive structure: produces seeds", snap: "The flower opens its petals." },
];

export const PLANT_KITCHEN_IN = [
 { id: "sun", name: "Sunlight", drop: "chloro", line: "Sunlight goes straight to the chloroplasts." },
 { id: "water", name: "Water", drop: "vein", line: "Water arrives from the roots through the stem." },
 { id: "co2", name: "Carbon dioxide", drop: "stomata", line: "Carbon dioxide enters through tiny pores on the underside." },
];

export const PLANT_KITCHEN_OUT = [
 { id: "glucose", name: "Glucose (sugar)", drop: "stemOut", line: "Sugar goes down into the stem, to be used or transported." },
 { id: "oxygen", name: "Oxygen", drop: "stomataOut", line: "Oxygen leaves through the same tiny pores, into the air." },
];

export const PLANT_WATER_HOPS = [
 { id: "whair", label: "Root hair", caption: "Water enters at a root hair." },
 { id: "wxylem", label: "Up the stem", caption: "Up a highlighted tube toward the leaf." },
 { id: "wleaf", label: "Into the leaf", caption: "Used in photosynthesis, or released as water vapor." },
];

export const PLANT_SUGAR_HOPS = [
 { id: "sleaf", label: "From the leaf", caption: "Sugar just made in the kitchen." },
 { id: "sphloem", label: "Down the stem", caption: "A different tube, carrying food." },
 { id: "ssink", label: "To growing parts", caption: "Stem, roots, and anywhere that needs energy." },
];

export const PLANT_SEEDS = [
 { id: "dandelion", name: "Dandelion", method: "wind", hint: "a fluffy parachute" },
 { id: "burr", name: "Burr", method: "animal", hint: "hooks that hitch a ride" },
 { id: "coconut", name: "Coconut", method: "water", hint: "a floating pod" },
];

export function resetPlantState() {
 bioLabState.plantOpenU = 0;
 bioLabState.plantSeen = false;
 bioLabState.plantParts = {};
 bioLabState.plantPartPick = null;
 bioLabState.plantBuildDone = false;
 bioLabState.plantKitchen = {};
 bioLabState.plantKitchenPick = null;
 bioLabState.plantKitchenPhase = "in";
 bioLabState.plantKitchenDone = false;
 bioLabState.plantPhotoSun = false;
 bioLabState.plantPhotoWater = false;
 bioLabState.plantPhotoCo2 = false;
 bioLabState.plantPhotoGlucoseSep = false;
 bioLabState.plantPhotoOxygenSep = false;
 bioLabState.plantTracePhase = "water";
 bioLabState.plantWaterStep = 0;
 bioLabState.plantSugarStep = 0;
 bioLabState.plantTraceDone = false;
 bioLabState.plantBee = "idle";
 bioLabState.plantBloomPhase = "pollinate";
 bioLabState.plantSeedI = 0;
 bioLabState.plantSeedOk = {};
 bioLabState.plantBloomDone = false;
 bioLabState.plantCloseU = 0;
 bioLabState.phase = "open";
 bioLabState.prompt = "";
 bioLabState.placed = {};
 bioLabState.selectedId = null;
 bioLabState.reveal = false;
 bioLabState.spiralStop = 0;
 bioLabState.spiralUntil = 0;
 bioLabState.spiralFinish = false;
 bioLabState.sun = 0.3;
 bioLabState.rootWater = 0.2;
 bioLabState.beeVisit = 0;
}

export function resetCellState() {
 bioLabState.cellOpenU = 0;
 bioLabState.cellSeen = false;
 bioLabState.cellZoomClick = 0;
 bioLabState.cellLeafClick = 0;
 bioLabState.cellView = "hand";
 bioLabState.cellTour = {};
 bioLabState.cellTourStop = null;
 bioLabState.cellTourDone = false;
 bioLabState.cellPlant = {};
 bioLabState.cellPlantPick = null;
 bioLabState.cellPlantDone = false;
 bioLabState.cellLineStep = 0;
 bioLabState.cellLineDone = false;
 bioLabState.cellCloseU = 0;
 bioLabState.cellZoom = 0.2;
 bioLabState.organelle = "nucleus";
 bioLabState.phase = "open";
 bioLabState.placed = {};
 bioLabState.selectedId = null;
 bioLabState.reveal = false;
 bioLabState.prompt = "";
 bioLabState.spiralStop = 0;
 bioLabState.spiralUntil = 0;
 bioLabState.spiralFinish = false;
}

if (typeof window !== "undefined") {
 window.__chemMirror = (s) => {
 if (!s) return;
 if (s.heat != null) {
 bioLabState.heat = s.heat;
 bioLabState.heatTarget = s.heat;
 }
 if (s.energy != null) {
 bioLabState.energy = s.energy;
 bioLabState.energyTarget = s.energy;
 }
 if (s.placed != null && s.placedVersion != null && s.placedVersion !== bioLabState._placedVersion) {
 bioLabState.placed = { ...s.placed };
 bioLabState.sortPlaced = Object.keys(s.placed).length;
 bioLabState._placedVersion = s.placedVersion;
 }
 if (s.selectedId !== undefined) bioLabState.selectedId = s.selectedId;
 if (s.reveal != null) bioLabState.reveal = s.reveal;
 if (s.tokenOrder) bioLabState.tokenProgress = s.tokenOrder.length;
 if (s.masteryOrder) bioLabState.masteryStep = s.masteryOrder.length;
 };
}
