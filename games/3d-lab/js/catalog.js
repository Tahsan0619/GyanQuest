/** Specimen catalog - files live in /sketchfab models/*.glb */

export const SUBJECTS = [
  { id: "all", en: "All", bn: "সব" },
  { id: "anatomy", en: "Anatomy", bn: "শারীরস্থান" },
  { id: "biology", en: "Biology", bn: "জীববিজ্ঞান" },
  { id: "chemistry", en: "Chemistry", bn: "রসায়ন" },
  { id: "space", en: "Space", bn: "মহাকাশ" },
  { id: "machines", en: "Machines", bn: "যন্ত্র" },
  { id: "measure", en: "Instruments", bn: "যন্ত্রপাতি" },
  { id: "math", en: "Math", bn: "গণিত" },
];

export const CATALOG = [
  {
    id: "animal-cell",
    file: "animal_cell_-_downloadable.glb",
    subject: "biology",
    mb: 13.9,
    credit: "Lauri Purhonen · CC-BY",
    title: { en: "Animal cell", bn: "প্রাণীকোষ" },
    blurb: {
      en: "Organelles of a typical animal cell. Tap a number to isolate one part.",
      bn: "একটি সাধারণ প্রাণীকোষের অঙ্গাণু। একটি অংশ আলাদা করতে নম্বরে চাপুন।",
    },
  },
  {
    id: "plant-cell",
    file: "plant_cell__biology.glb",
    subject: "biology",
    mb: 8.7,
    credit: "Oliver · CC-BY",
    title: { en: "Plant cell", bn: "উদ্ভিদকোষ" },
    blurb: {
      en: "Wall, vacuole, nucleus and the rest of a plant cell, labelled on the mesh.",
      bn: "প্রাচীর, ভ্যাকুওল, নিউক্লিয়াস - উদ্ভিদকোষের অংশগুলো মডেলে চিহ্নিত।",
    },
  },
  {
    id: "neuron",
    file: "3d_neuron_cell.glb",
    subject: "biology",
    mb: 5.8,
    credit: "Sketchfab · CC-BY",
    title: { en: "Neuron", bn: "নিউরন" },
    blurb: {
      en: "Soma, dendrites, myelin and the organelles packed inside a nerve cell.",
      bn: "সোমা, ডেনড্রাইট, মায়েলিন এবং স্নায়ুকোষের ভেতরের অঙ্গাণু।",
    },
  },
  {
    id: "coronavirus",
    file: "detailed_3d_model_of_the_coronavirus.glb",
    subject: "biology",
    mb: 12.3,
    credit: "Sketchfab · CC-BY",
    title: { en: "Coronavirus", bn: "করোনাভাইরাস" },
    blurb: {
      en: "Envelope and spike proteins of a coronavirus particle.",
      bn: "করোনাভাইরাস কণার আবরণ ও স্পাইক প্রোটিন।",
    },
  },
  {
    id: "dna",
    file: "b-dna_ribbon_backbone__sticks_bases.glb",
    subject: "biology",
    mb: 2.5,
    credit: "Holoxica · CC-BY",
    title: { en: "DNA", bn: "ডিএনএ" },
    blurb: {
      en: "Double helix: backbone ribbons and the base pairs they carry.",
      bn: "ডাবল হেলিক্স: ব্যাকবোন ও ক্ষারক জোড়।",
    },
  },
  {
    id: "heart",
    file: "human_heart.glb",
    subject: "anatomy",
    mb: 74.9,
    heavy: true,
    credit: "neshallads · CC-BY",
    title: { en: "Human heart", bn: "মানব হৃৎপিণ্ড" },
    blurb: {
      en: "Chambers and great vessels. A large file - wait for the bar, then pin-edit if a label sits off.",
      bn: "প্রকোষ্ঠ ও প্রধান রক্তনালি। ফাইল বড় - লোড হলে লেবেল সরাতে পিন এডিটর ব্যবহার করুন।",
    },
  },
  {
    id: "brain",
    file: "human_brain_cerebrum__brainstem.glb",
    subject: "anatomy",
    mb: 12.2,
    credit: "FrankJohansson · CC-BY",
    title: { en: "Brain", bn: "মস্তিষ্ক" },
    blurb: {
      en: "Cerebrum and brainstem. Drag pins if a lobe marker lands on the wrong gyrus.",
      bn: "সেরিব্রাম ও ব্রেইনস্টেম। লোব মার্কার ভুল জায়গায় পড়লে পিন সরিয়ে নিন।",
    },
  },
  {
    id: "lungs",
    file: "realistic_human_lungs.glb",
    subject: "anatomy",
    mb: 17.1,
    credit: "neshallads · CC-BY",
    title: { en: "Lungs", bn: "ফুসফুস" },
    blurb: {
      en: "Left and right lungs as separate meshes - isolation is exact here.",
      bn: "বাম ও ডান ফুসফুস আলাদা মেশ - এখানে আইসোলেশন সঠিক।",
    },
  },
  {
    id: "kidney",
    file: "free_kidney_3d_model_anatomy.glb",
    subject: "anatomy",
    mb: 2.8,
    credit: "Sketchfab · CC-BY",
    title: { en: "Kidney", bn: "বৃক্ক" },
    blurb: {
      en: "Cortex, medulla and vessels of a kidney section.",
      bn: "বৃক্কের কর্টেক্স, মেডুলা ও রক্তনালি।",
    },
  },
  {
    id: "nephron",
    file: "free_nephron_3d_model.glb",
    subject: "anatomy",
    mb: 1.2,
    credit: "Sketchfab · CC-BY",
    title: { en: "Nephron", bn: "নেফ্রন" },
    blurb: {
      en: "The kidney’s working unit: glomerulus and tubules.",
      bn: "বৃক্কের কার্যকর একক: গ্লোমেরুলাস ও নালিকা।",
    },
  },
  {
    id: "mouth",
    file: "mouth.glb",
    subject: "anatomy",
    mb: 22.3,
    credit: "Sketchfab · CC-BY",
    title: { en: "Mouth", bn: "মুখগহ্বর" },
    blurb: {
      en: "Oral cavity. Place pins on teeth, tongue and palate in the editor if needed.",
      bn: "মুখগহ্বর। দাঁত, জিহ্বা, তালুতে পিন বসাতে এডিটর ব্যবহার করুন।",
    },
  },
  {
    id: "earth",
    file: "earth.glb",
    subject: "space",
    mb: 22.7,
    credit: "Akshat · CC-BY",
    title: { en: "Earth", bn: "পৃথিবী" },
    blurb: {
      en: "Globe with first-pass region pins. Nudge them onto continents in the editor.",
      bn: "গ্লোব ও অঞ্চল পিন। মহাদেশে বসাতে এডিটরে সরিয়ে নিন।",
    },
  },
  {
    id: "moon",
    file: "nasa_cgi_moon_kit.glb",
    subject: "space",
    mb: 97.1,
    heavy: true,
    credit: "Thomas Flynn / NASA CGI Moon Kit · CC-BY",
    title: { en: "Moon", bn: "চাঁদ" },
    blurb: {
      en: "NASA CGI Moon Kit. Very large - load on Wi-Fi, then mark maria and poles.",
      bn: "NASA চাঁদের মডেল। খুব বড় ফাইল - ওয়াই-ফাইতে লোড করুন, তারপর মারে ও মেরু চিহ্নিত করুন।",
    },
  },
  {
    id: "iss",
    file: "iss.glb",
    subject: "space",
    mb: 2.6,
    credit: "uperesito · CC-BY",
    title: { en: "Space station", bn: "মহাকাশ স্টেশন" },
    blurb: {
      en: "ISS truss and modules. Use the editor to sit numbers on solar arrays and nodes.",
      bn: "আইএসএস। সোলার অ্যারে ও মডিউলে নম্বর বসাতে এডিটর ব্যবহার করুন।",
    },
  },
  {
    id: "falcon9",
    file: "spacex_falcon_9_and_dragon_2.glb",
    subject: "space",
    mb: 13.4,
    credit: "Forest Katsch · CC-BY",
    title: { en: "Falcon 9 & Dragon", bn: "ফ্যালকন ৯ ও ড্রাগন" },
    blurb: {
      en: "Named meshes for legs, grid fins, trunk and the crew capsule.",
      bn: "ল্যান্ডিং লেগ, গ্রিড ফিন, ট্রাঙ্ক ও ক্রু ক্যাপসুল - নামসহ মেশ।",
    },
  },
  {
    id: "atom",
    file: "atom_3d.glb",
    subject: "chemistry",
    mb: 2.2,
    credit: "Sketchfab · CC-BY",
    title: { en: "Atom", bn: "পরমাণু" },
    blurb: {
      en: "A single atom model. Pins mark nucleus versus electron cloud.",
      bn: "একটি পরমাণু মডেল। নিউক্লিয়াস ও ইলেকট্রন মেঘ আলাদা করে চিহ্নিত।",
    },
  },
  {
    id: "atomic-models",
    file: "atomic_models.glb",
    subject: "chemistry",
    mb: 2.0,
    credit: "arloopa · CC-BY",
    title: { en: "Atomic models", bn: "পরমাণু মডেল" },
    blurb: {
      en: "Classroom atomic models on a bench. Isolate a kit piece with a pin.",
      bn: "শ্রেণিকক্ষের পরমাণু মডেল। একটি অংশ আলাদা করতে পিন চাপুন।",
    },
  },
  {
    id: "wind-turbine",
    file: "animated_wind_turbine.glb",
    subject: "machines",
    mb: 3.8,
    credit: "Glowbox 3D · CC-BY",
    title: { en: "Wind turbine", bn: "বায়ুকল" },
    blurb: {
      en: "Tower plus spinning blades - two meshes, so focus is clean.",
      bn: "টাওয়ার ও ঘূর্ণায়মান ব্লেড - দুটি মেশ, ফোকাস পরিষ্কার।",
    },
  },
  {
    id: "engine-v8",
    file: "animated_engine_v8.glb",
    subject: "machines",
    mb: 8.3,
    credit: "Sketchfab · CC-BY",
    title: { en: "V8 engine", bn: "ভি৮ ইঞ্জিন" },
    blurb: {
      en: "Animated engine. Pins sit on gears and cylinder groups; nudge if a label drifts.",
      bn: "অ্যানিমেটেড ইঞ্জিন। গিয়ার ও সিলিন্ডার গ্রুপে পিন - সরাতে পারেন।",
    },
  },
  {
    id: "city",
    file: "cartoon_lowpoly_small_city_free_pack.glb",
    subject: "machines",
    mb: 3.1,
    credit: "antonmoek · CC-BY",
    title: { en: "Low-poly city", bn: "লো-পলি শহর" },
    blurb: {
      en: "Cars, lights and blocks. Good for talking about motion in a street.",
      bn: "গাড়ি, লাইট ও ব্লক। রাস্তায় গতি বোঝাতে সুবিধা।",
    },
  },
  {
    id: "multimeter",
    file: "3d_multimeter_analog.glb",
    subject: "measure",
    mb: 3.0,
    credit: "Sketchfab · CC-BY",
    title: { en: "Analog multimeter", bn: "অ্যানালগ মাল্টিমিটার" },
    blurb: {
      en: "Needle, scale and range knob of a classroom meter.",
      bn: "শ্রেণিকক্ষের মিটারের কাঁটা, স্কেল ও রেঞ্জ নব।",
    },
  },
  {
    id: "ammeter",
    file: "ampermeter.glb",
    subject: "measure",
    mb: 7.9,
    credit: "Sketchfab · CC-BY",
    title: { en: "Ammeter", bn: "অ্যামিটার" },
    blurb: {
      en: "Named body, buttons and probe cables.",
      bn: "বডি, বোতাম ও প্রোব তার - নামসহ অংশ।",
    },
  },
  {
    id: "caliper",
    file: "digital_measuring_caliper_preciva.glb",
    subject: "measure",
    mb: 10.0,
    credit: "Sketchfab · CC-BY",
    title: { en: "Digital caliper", bn: "ডিজিটাল ক্যালিপার" },
    blurb: {
      en: "Stationary jaw, sliding jaw, display and thumb wheel.",
      bn: "স্থির জো, স্লাইডিং জো, ডিসপ্লে ও থাম্ব হুইল।",
    },
  },
  {
    id: "compass",
    file: "compass.glb",
    subject: "measure",
    mb: 2.2,
    credit: "Sketchfab · CC-BY",
    title: { en: "Compass", bn: "কম্পাস" },
    blurb: {
      en: "Magnetic compass. Mark the needle and housing if the first pins sit off.",
      bn: "চুম্বক কম্পাস। কাঁটা ও হাউজিংয়ে পিন বসান।",
    },
  },
  {
    id: "abacus",
    file: "abacus.glb",
    subject: "math",
    mb: 6.1,
    credit: "Sketchfab · CC-BY",
    title: { en: "Abacus", bn: "অ্যাবাকাস" },
    blurb: {
      en: "Frame, rods and beads - counting hardware you can orbit.",
      bn: "ফ্রেম, দণ্ড ও গুটি - ঘুরিয়ে দেখা যায় এমন গণনার যন্ত্র।",
    },
  },
  {
    id: "calculator",
    file: "calculator_of_the_ussr.glb",
    subject: "math",
    mb: 3.1,
    credit: "Sketchfab · CC-BY",
    title: { en: "Mechanical calculator", bn: "যান্ত্রিক ক্যালকুলেটর" },
    blurb: {
      en: "A mechanical calculator. Use the editor to number keys and the register.",
      bn: "যান্ত্রিক ক্যালকুলেটর। কি ও রেজিস্টারে নম্বর দিতে এডিটর ব্যবহার করুন।",
    },
  },
];

export const MODEL_BASE = "/sketchfab%20models/";

export function modelUrl(entry) {
  return MODEL_BASE + encodeURIComponent(entry.file);
}

export function loc(obj, locale) {
  if (!obj) return "";
  if (typeof obj === "string") return obj;
  return obj[locale] || obj.en || "";
}
