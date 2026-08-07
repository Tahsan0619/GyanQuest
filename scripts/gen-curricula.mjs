/**
 * Generates all GyanQuest curriculum game packs (except force-fighter).
 * Run: node scripts/gen-curricula.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
/** All games live under ImpactX/games/<slug>/ */
const GAMES = path.join(__dirname, "..", "games");
const ENGINE_REL = "/engine";

const TYPES_CYCLE = [
  "demo",
  "drag",
  "reveal",
  "order",
  "quiz",
  "scene3d",
  "equation",
  "tap",
  "drag",
  "boss",
];

/** @type {Array<object>} */
const PACKS = [
  {
    id: "chemistry",
    slug: "chemistry-lab",
    title: "Chemistry Lab",
    tagline: "Atoms, bonds & reactions!",
    subjectTag: "Fun chemistry for all",
    coachName: "Coach Molecule",
    emoji: "⚗️",
    landingId: "chemistry",
    defaultScene: "labBench",
    theme: { accent: "#0ea5e9", accent2: "#0369a1", sky: 0xb8e0f0, floor: 0x0f172a, fog: 0xcffafe },
    // Only Kenney Food/Factory/Furniture/Car props that exist in 3D Assets
    assetKeys: [
      "desk",
      "bottle",
      "bottleKetchup",
      "bottleMustard",
      "cup",
      "apple",
      "pan",
      "bowl",
      "can",
      "boxSmall",
      "boxLarge",
      "barrel",
      "magnet",
      "cone",
    ],
    // One distinct 3D scene + interactive viz per topic (10 topics)
    topicScenes: [
      "chemAtoms",
      "chemElements",
      "chemBonds",
      "chemMixtures",
      "chemReactions",
      "chemAcids",
      "chemStates",
      "chemPeriodic",
      "chemSafety",
      "chemSynthesis",
    ],
    topicViz: [
      "atoms",
      "elements",
      "bonds",
      "mixtures",
      "reactions",
      "acids",
      "states",
      "periodic",
      "safety",
      "synthesis",
    ],
    // Everyday hooks must match props students can see (bottle/cup/pan/magnet/apple/cone…)
    topics: [
      [
        "Tiny Bits",
        "atoms",
        [
          "Salt grains next to the oil bottle",
          "Ice melting in the cup on the desk",
          "Steam rising above the hot pan",
        ],
      ],
      [
        "Element Hunt",
        "elements",
        [
          "Grey bottle = iron-like metal",
          "Amber bottle = copper-like wire metal",
          "Blue bottle = oxygen in air",
        ],
      ],
      [
        "Bond Buddies",
        "bonds",
        [
          "Crane magnet pulling the cup closer",
          "Magnets clicking together",
          "Water droplets sticking in the bowl",
        ],
      ],
      [
        "Mix & Match",
        "mixtures",
        [
          "Oil bottle pouring into the cup",
          "Cha mixed smooth in a bowl",
          "Sand settling under water in the cup",
        ],
      ],
      [
        "Reaction Time",
        "reactions",
        [
          "White bottle + yellow bottle in the pan → fizz",
          "Rust on a metal can over time",
          "Candle-like heat over the pan",
        ],
      ],
      [
        "Acid & Base",
        "acids",
        [
          "Red bottle = sour acid idea",
          "Blue bottle = slippery base idea",
          "Cup color shifts like a pH strip",
        ],
      ],
      [
        "States of Matter",
        "states",
        [
          "Apple = solid chunk",
          "Cup = liquid water",
          "Steam particles over the hot pan = gas",
        ],
      ],
      [
        "Periodic Path",
        "periodic",
        [
          "Colored boxes grouped on the desk",
          "Metal-like barrel vs light boxes",
          "Families of similar bottles",
        ],
      ],
      [
        "Lab Safety",
        "safety",
        [
          "Traffic cones = caution zone",
          "Never taste the bottles",
          "Wash hands after desk work",
        ],
      ],
      [
        "Chem Boss",
        "synthesis",
        [
          "Cooking in the pan is chemistry",
          "Oil bottle + heat + apple bits",
          "Cleaning mixes = useful reactions",
        ],
      ],
    ],
  },
  {
    id: "biology",
    slug: "bio-explorer",
    title: "Bio Explorer",
    tagline: "Cells, ecosystems & you!",
    subjectTag: "Living science",
    coachName: "Coach Cell",
    emoji: "🧬",
    landingId: "biology",
    defaultScene: "nature",
    theme: { accent: "#22c55e", accent2: "#15803d", sky: 0xa7f3d0, floor: 0x14532d, fog: 0xbbf7d0 },
    assetKeys: ["tree", "plant", "rockNature", "apple", "rocks", "desk", "bottle"],
    topics: [
      ["Living or Not", "life", ["Cat vs rock", "Seed sprouting", "Phone is not alive"]],
      ["Cell City", "cells", ["Brick in a wall", "Room in a house", "Drop of pond water"]],
      ["Plant Power", "plants", ["Mango leaf sunlight", "Rice roots in mud", "Flower attracting bees"]],
      ["Body Systems", "body", ["Heart pumping", "Lungs breathing", "Stomach digesting"]],
      ["Food Chains", "ecosystems", ["Rice → hen → human", "Algae in a pond", "Hawk over fields"]],
      ["Micro Worlds", "microbes", ["Yogurt bacteria", "Hand washing", "Fever fighting germs"]],
      ["Genetics Sparks", "genes", ["Family eye color", "Seed variety", "Identical twins"]],
      ["Health Habits", "health", ["Sleep & water", "Vaccines", "Balanced plate"]],
      ["Biodiversity BD", "biodiversity", ["Sundarbans tiger", "Hilsa fish", "Village birds"]],
      ["Bio Boss", "synthesis", ["You are an ecosystem", "Protect habitats", "Science of healing"]],
    ],
  },
  {
    id: "mathematics",
    slug: "math-quest",
    title: "Math Quest",
    tagline: "Numbers, patterns & power!",
    subjectTag: "Math adventures",
    coachName: "Coach Number",
    emoji: "📐",
    landingId: "mathematics",
    defaultScene: "classroom",
    theme: { accent: "#8b5cf6", accent2: "#6d28d9", sky: 0xddd6fe, floor: 0x1e1b4b, fog: 0xe9d5ff },
    assetKeys: ["desk", "chair", "bookcase", "coin", "brick", "arrow", "boxSmall"],
    topics: [
      ["Number Sense", "numbers", ["Counting taka", "Bus seat numbers", "Cricket scores"]],
      ["Place Value", "place", ["Hundreds in a crowd", "Thousands on a bill", "Decimals in price"]],
      ["Add & Subtract", "ops", ["Market change", "Score difference", "Saving pocket money"]],
      ["Multiply Magic", "mul", ["Dozen eggs × price", "Rows of chairs", "Area of a mat"]],
      ["Fraction Fun", "fractions", ["Half a roti", "Quarter of a pizza", "Share among friends"]],
      ["Ratio & Rate", "ratio", ["Recipe scale-up", "Speed km/h", "Map scale"]],
      ["Patterns", "patterns", ["Tile floors", "Number sequences", "Music beats"]],
      ["Equations", "algebra", ["Find the missing", "Balance scales", "Word problems"]],
      ["Data Sense", "data", ["Class height chart", "Rainfall table", "Survey bars"]],
      ["Math Boss", "synthesis", ["Plan a trip budget", "Build with shapes", "Prove a pattern"]],
    ],
  },
  {
    id: "environmental",
    slug: "eco-guardian",
    title: "Eco Guardian",
    tagline: "Climate, resources & care!",
    subjectTag: "Earth stewardship",
    coachName: "Coach Earth",
    emoji: "🌍",
    landingId: "environmental",
    defaultScene: "nature",
    theme: { accent: "#10b981", accent2: "#047857", sky: 0x99f6e4, floor: 0x064e3b, fog: 0xa7f3d0 },
    assetKeys: ["tree", "plant", "rockNature", "rocks", "truck", "barrel", "building"],
    topics: [
      ["Our Shared Home", "planet", ["Blue sky over Dhaka", "Rivers of Bangladesh", "Monsoon rains"]],
      ["Air We Breathe", "air", ["Traffic smoke", "Trees cleaning air", "Indoor ventilation"]],
      ["Water Cycle", "water", ["Clouds → rain", "Padma river flow", "Saving tap water"]],
      ["Waste Wisdom", "waste", ["Segregate trash", "Plastic bags", "Compost kitchen peels"]],
      ["Energy Choices", "energy", ["Fan vs AC", "Solar lamps", "Turn off lights"]],
      ["Climate Signals", "climate", ["Hotter summers", "Flood risk", "Cyclone prep"]],
      ["Forests & Wildlife", "forests", ["Sundarbans", "Village groves", "Bird nesting"]],
      ["Sustainable City", "cities", ["Green roofs", "Walk & rickshaw", "Clean drains"]],
      ["Citizen Action", "action", ["School eco club", "Plant a tree", "Say no to litter"]],
      ["Eco Boss", "synthesis", ["Your carbon choices", "Protect wetlands", "Lead a campaign"]],
    ],
  },
  {
    id: "ict",
    slug: "ict-fundamentals",
    title: "ICT Fundamentals",
    tagline: "Digital literacy & tools!",
    subjectTag: "Computer basics",
    coachName: "Coach Pixel",
    emoji: "💻",
    landingId: "ict",
    defaultScene: "arcade",
    theme: { accent: "#3b82f6", accent2: "#1d4ed8", sky: 0xbfdbfe, floor: 0x0f172a, fog: 0xdbeafe },
    assetKeys: ["arcade", "register", "coin", "button", "desk", "chair", "boxSmall"],
    topics: [
      ["What is ICT?", "intro", ["Phone calls", "School computer lab", "Online class"]],
      ["Hardware Tour", "hardware", ["Keyboard & mouse", "Screen", "USB drive"]],
      ["Software Basics", "software", ["Apps vs OS", "Browser", "Word processor"]],
      ["Files & Folders", "files", ["Save homework", "Rename a file", "Desktop shortcuts"]],
      ["Internet Intro", "internet", ["Search wisely", "Wi-Fi vs mobile data", "Safe links"]],
      ["Digital Citizen", "citizen", ["Password strength", "Respect online", "Fake news check"]],
      ["Office Tools", "office", ["Type a letter", "Simple spreadsheet", "Slide deck"]],
      ["Media Smarts", "media", ["Photos & size", "Video call tips", "Copyright basics"]],
      ["Troubleshooting", "fix", ["Restart first", "Cable check", "Ask for help"]],
      ["ICT Boss", "synthesis", ["Plan a digital project", "Help a classmate", "Stay safe"]],
    ],
  },
  {
    id: "web",
    slug: "web-dev-studio",
    title: "Web Dev Studio",
    tagline: "HTML, CSS & JavaScript!",
    subjectTag: "Build the web",
    coachName: "Coach Browser",
    emoji: "🌐",
    landingId: "web",
    defaultScene: "arcade",
    theme: { accent: "#06b6d4", accent2: "#0e7490", sky: 0xa5f3fc, floor: 0x083344, fog: 0xcffafe },
    assetKeys: ["arcade", "desk", "button", "coin", "boxSmall", "building"],
    topics: [
      ["How Web Works", "web", ["URL bar", "Click a link", "Page loads"]],
      ["HTML Bones", "html", ["Headings", "Paragraphs", "Images"]],
      ["CSS Style", "css", ["Colors", "Fonts", "Boxes"]],
      ["Layout Lab", "layout", ["Rows & columns", "Mobile first", "Spacing"]],
      ["Links & Nav", "nav", ["Menus", "Anchors", "Buttons"]],
      ["Forms", "forms", ["Input fields", "Submit", "Validation idea"]],
      ["JS Spark", "js", ["Click events", "Change text", "Simple counter"]],
      ["DOM Play", "dom", ["Select element", "Add class", "Show/hide"]],
      ["Publish Path", "deploy", ["Save files", "Local preview", "Hosting idea"]],
      ["Web Boss", "synthesis", ["Mini portfolio page", "Accessible labels", "Debug a bug"]],
    ],
  },
  {
    id: "backend",
    slug: "backend-builder",
    title: "Backend Builder",
    tagline: "APIs, servers & logic!",
    subjectTag: "Server thinking",
    coachName: "Coach Server",
    emoji: "🖥️",
    landingId: "backend",
    defaultScene: "factory",
    theme: { accent: "#64748b", accent2: "#334155", sky: 0xcbd5e1, floor: 0x0f172a, fog: 0xe2e8f0 },
    assetKeys: ["structure", "conveyor", "boxLarge", "robotArm", "crane", "barrel", "desk"],
    topics: [
      ["Client vs Server", "roles", ["Restaurant kitchen", "App requesting data", "Browser waits"]],
      ["Request & Response", "http", ["GET a page", "POST a form", "Status codes"]],
      ["API Menus", "api", ["Menu of endpoints", "JSON boxes", "Auth token idea"]],
      ["Routes", "routes", ["/users", "/posts", "404 not found"]],
      ["Data Store", "data", ["Save a record", "Read a list", "Update & delete"]],
      ["Auth Basics", "auth", ["Login", "Session", "Password hash idea"]],
      ["Errors", "errors", ["Try/catch idea", "Helpful messages", "Logs"]],
      ["Framework Peek", "frameworks", ["Node idea", "Laravel idea", "Same patterns"]],
      ["Security Habits", "secure", ["Never trust input", "HTTPS", "Secrets stay secret"]],
      ["Backend Boss", "synthesis", ["Design an API", "Trace a request", "Ship safely"]],
    ],
  },
  {
    id: "database",
    slug: "database-sql",
    title: "Database & SQL",
    tagline: "Tables, queries & design!",
    subjectTag: "Data design",
    coachName: "Coach Table",
    emoji: "🗄️",
    landingId: "database",
    defaultScene: "classroom",
    theme: { accent: "#f59e0b", accent2: "#b45309", sky: 0xfde68a, floor: 0x1c1917, fog: 0xfef3c7 },
    assetKeys: ["bookcase", "desk", "boxLarge", "boxSmall", "register", "coin"],
    topics: [
      ["Why Databases?", "why", ["School registers", "Phone contacts", "Shop inventory"]],
      ["Tables & Rows", "tables", ["Spreadsheet feel", "Primary key", "Columns"]],
      ["SELECT", "select", ["Pick columns", "Filter WHERE", "ORDER BY"]],
      ["INSERT/UPDATE", "mutate", ["Add a student", "Fix a name", "Soft delete"]],
      ["JOIN Thinking", "join", ["Student + class", "Order + items", "Match keys"]],
      ["Keys & Relations", "keys", ["One-to-many", "Foreign keys", "No orphan rows"]],
      ["Normalize Light", "norm", ["Don't repeat", "Split tables", "Clean design"]],
      ["Indexes Idea", "index", ["Book index", "Faster find", "Tradeoffs"]],
      ["SQL Safety", "safety", ["Parameterized queries", "Backups", "Permissions"]],
      ["SQL Boss", "synthesis", ["Design a schema", "Write a query", "Explain a plan"]],
    ],
  },
  {
    id: "networking",
    slug: "networking-internet",
    title: "Networking & Internet",
    tagline: "Packets, DNS & stacks!",
    subjectTag: "How networks work",
    coachName: "Coach Packet",
    emoji: "📡",
    landingId: "networking",
    defaultScene: "city",
    theme: { accent: "#6366f1", accent2: "#4338ca", sky: 0xc7d2fe, floor: 0x1e1b4b, fog: 0xe0e7ff },
    assetKeys: ["building", "parasol", "carSedan", "cone", "satellite", "button"],
    topics: [
      ["What is a Network?", "net", ["School LAN", "Home Wi-Fi", "Mobile tower"]],
      ["Packets", "packets", ["Letters in envelopes", "Split message", "Reassemble"]],
      ["IP Addresses", "ip", ["House numbers", "IPv4 idea", "Local vs public"]],
      ["DNS", "dns", ["Phonebook for sites", "Name → number", "Cache"]],
      ["Routers & Switches", "devices", ["Traffic cops", "Home router", "Cables"]],
      ["Protocols", "proto", ["HTTP", "HTTPS", "Rules of talk"]],
      ["Latency & Bandwidth", "perf", ["Delay vs capacity", "Video buffering", "Speed tests"]],
      ["Wireless", "wifi", ["SSID", "Password", "Interference"]],
      ["Internet Map", "map", ["ISP", "Undersea cables idea", "CDN"]],
      ["Net Boss", "synthesis", ["Trace a click", "Secure a Wi-Fi", "Fix a drop"]],
    ],
  },
  {
    id: "cybersecurity",
    slug: "cyber-shield",
    title: "Cyber Shield",
    tagline: "Safety, encryption & threats!",
    subjectTag: "Stay safe online",
    coachName: "Coach Shield",
    emoji: "🛡️",
    landingId: "cybersecurity",
    defaultScene: "arcade",
    theme: { accent: "#ef4444", accent2: "#b91c1c", sky: 0xfecaca, floor: 0x450a0a, fog: 0xfee2e2 },
    assetKeys: ["arcade", "button", "coin", "wall", "boxLarge", "magnet"],
    topics: [
      ["Threat Landscape", "threats", ["Phishing SMS", "Fake shops", "Malware"]],
      ["Passwords", "passwords", ["Long phrases", "Unique per site", "Manager idea"]],
      ["Phishing Spot", "phish", ["Urgent tone", "Odd links", "Verify sender"]],
      ["Privacy", "privacy", ["Share less", "App permissions", "Public Wi-Fi caution"]],
      ["Encryption Idea", "crypto", ["Locked diary", "HTTPS lock", "Keys"]],
      ["Social Engineering", "social", ["Pretend IT support", "Pressure tricks", "Verify in person"]],
      ["Device Hygiene", "devices", ["Updates", "Antivirus idea", "Lock screen"]],
      ["Safe Browsing", "browse", ["HTTPS", "Extensions care", "Downloads"]],
      ["Incident Response", "incident", ["Don't panic", "Change passwords", "Tell a trusted adult"]],
      ["Shield Boss", "synthesis", ["Audit your habits", "Teach a friend", "Report a scam"]],
    ],
  },
  {
    id: "os",
    slug: "os-hardware",
    title: "OS & Hardware",
    tagline: "Processes, memory & machines!",
    subjectTag: "How computers run",
    coachName: "Coach Kernel",
    emoji: "⚙️",
    landingId: "os",
    defaultScene: "factory",
    theme: { accent: "#78716c", accent2: "#44403c", sky: 0xd6d3d1, floor: 0x1c1917, fog: 0xe7e5e4 },
    assetKeys: ["structure", "robotArm", "conveyor", "boxLarge", "desk", "button"],
    topics: [
      ["Inside the Box", "hw", ["CPU brain", "RAM desk", "Storage shelf"]],
      ["What OS Does", "os", ["Traffic manager", "File keeper", "App launcher"]],
      ["Processes", "proc", ["Apps as workers", "Multitasking", "Freeze & kill"]],
      ["Memory", "mem", ["Short-term desk", "Full RAM lag", "Swap idea"]],
      ["Storage", "disk", ["SSD vs HDD idea", "Files on disk", "Free space"]],
      ["Drivers", "drivers", ["Translators", "Printer needs driver", "Updates"]],
      ["Permissions", "perms", ["User accounts", "Admin power", "Least privilege"]],
      ["Boot Sequence", "boot", ["Power on", "POST idea", "Login"]],
      ["Performance", "perf", ["Too many tabs", "Background apps", "Cooling"]],
      ["OS Boss", "synthesis", ["Explain a freeze", "Upgrade wisely", "Secure the machine"]],
    ],
  },
  {
    id: "ai",
    slug: "ai-lab",
    title: "Artificial Intelligence",
    tagline: "Agents, prompts & ethics!",
    subjectTag: "AI for learners",
    coachName: "Coach Neuron",
    emoji: "🤖",
    landingId: "ai",
    defaultScene: "space",
    theme: { accent: "#a855f7", accent2: "#7e22ce", sky: 0xe9d5ff, floor: 0x2e1065, fog: 0xf3e8ff },
    assetKeys: ["astronaut", "robotArm", "arcade", "button", "satellite", "desk"],
    topics: [
      ["What is AI?", "intro", ["Suggest next song", "Face unlock", "Translate apps"]],
      ["Narrow vs General", "scope", ["Chess bot", "Chat helper", "Not magic"]],
      ["Data Fuel", "data", ["Examples teach", "Bias risk", "Quality matters"]],
      ["Prompts", "prompts", ["Clear ask", "Context", "Iterate"]],
      ["Agents", "agents", ["Goal + tools", "Step plans", "Human oversight"]],
      ["Perception", "sense", ["Vision", "Speech", "Sensors"]],
      ["Ethics", "ethics", ["Fairness", "Privacy", "Consent"]],
      ["Limits", "limits", ["Hallucinations", "No real understanding", "Verify facts"]],
      ["AI in BD", "local", ["Agri advice idea", "Language tools", "Classroom help"]],
      ["AI Boss", "synthesis", ["Design a helpful bot", "Spot misuse", "Use responsibly"]],
    ],
  },
  {
    id: "ml",
    slug: "ml-lab",
    title: "Machine Learning",
    tagline: "Models, training & data!",
    subjectTag: "Learn from data",
    coachName: "Coach Model",
    emoji: "📊",
    landingId: "ml",
    defaultScene: "classroom",
    theme: { accent: "#14b8a6", accent2: "#0f766e", sky: 0x99f6e4, floor: 0x134e4a, fog: 0xccfbf1 },
    assetKeys: ["desk", "bookcase", "coin", "apple", "boxSmall", "arcade"],
    topics: [
      ["Learn from Examples", "intro", ["Spam filter", "Recommend videos", "Price guess"]],
      ["Features", "features", ["Inputs that matter", "Height/weight", "Pixel values"]],
      ["Train / Test", "split", ["Study then exam", "Don't peek", "Generalize"]],
      ["Overfit", "overfit", ["Memorize ≠ learn", "Too complex", "Simpler wins"]],
      ["Classification", "class", ["Cat or dog", "Spam or not", "Disease risk"]],
      ["Regression", "reg", ["Predict price", "Temperature", "Scores"]],
      ["Eval Metrics", "metrics", ["Accuracy", "Mistakes cost", "Confusion"]],
      ["Pipeline", "pipe", ["Collect → clean → train → check", "Iterate", "Deploy idea"]],
      ["Responsible ML", "resp", ["Bias", "Consent", "Human review"]],
      ["ML Boss", "synthesis", ["Pick a problem", "Choose features", "Explain a model"]],
    ],
  },
  {
    id: "dataScience",
    slug: "data-science",
    title: "Data Science",
    tagline: "Stats, charts & insight!",
    subjectTag: "Stories from data",
    coachName: "Coach Chart",
    emoji: "📈",
    landingId: "dataScience",
    defaultScene: "classroom",
    theme: { accent: "#2563eb", accent2: "#1e40af", sky: 0xbfdbfe, floor: 0x1e3a8a, fog: 0xdbeafe },
    assetKeys: ["desk", "bookcase", "coin", "apple", "register", "boxSmall"],
    topics: [
      ["Ask a Question", "ask", ["Class survey", "Rain vs sales", "Who is late?"]],
      ["Collect Data", "collect", ["Forms", "Sensors", "Open data"]],
      ["Clean Data", "clean", ["Missing values", "Typos", "Duplicates"]],
      ["Describe", "describe", ["Mean", "Median", "Spread"]],
      ["Visualize", "viz", ["Bar chart", "Line trend", "Pie caution"]],
      ["Correlate", "corr", ["Related ≠ cause", "Scatter idea", "Confounders"]],
      ["Probability Lite", "prob", ["Chance rain", "Dice", "Uncertainty"]],
      ["Insight", "insight", ["What changed?", "Who benefits?", "Action"]],
      ["Communicate", "comms", ["Clear title", "Honest axis", "Audience"]],
      ["Data Boss", "synthesis", ["End-to-end mini project", "Critique a chart", "Decide with data"]],
    ],
  },
  {
    id: "electrical",
    slug: "electrical-basics",
    title: "Electrical Basics",
    tagline: "Circuits, current & voltage!",
    subjectTag: "Electricity lab",
    coachName: "Coach Volt",
    emoji: "⚡",
    landingId: "electrical",
    defaultScene: "factory",
    theme: { accent: "#eab308", accent2: "#a16207", sky: 0xfef08a, floor: 0x1c1917, fog: 0xfef9c3 },
    assetKeys: ["structure", "conveyor", "robotArm", "button", "barrel", "boxLarge", "magnet"],
    topics: [
      ["Charge & Current", "current", ["Flow of charge", "Water pipe analogy", "Battery push"]],
      ["Voltage", "voltage", ["Pressure idea", "Higher V", "Battery labels"]],
      ["Resistance", "ohm", ["Narrow pipe", "Hot wire risk", "Ohm's idea"]],
      ["Series Circuits", "series", ["One path", "Bulbs dim together", "Open = off"]],
      ["Parallel Circuits", "parallel", ["Home wiring idea", "One bulb fails", "Shared voltage"]],
      ["Power", "power", ["Watt = energy/time", "Bill units", "Efficient bulbs"]],
      ["Safety", "safety", ["Don't touch live", "Earthing idea", "Fuses"]],
      ["Magnetism Link", "magnet", ["Motors", "Generators", "Electromagnet"]],
      ["AC vs DC", "acdc", ["Battery DC", "Wall AC", "Adapters"]],
      ["Volt Boss", "synthesis", ["Design a circuit", "Find a short", "Save energy"]],
    ],
  },
  {
    id: "mechanical",
    slug: "mechanical-basics",
    title: "Mechanical Basics",
    tagline: "Forces, machines & motion!",
    subjectTag: "Machines that move",
    coachName: "Coach Gear",
    emoji: "🔧",
    landingId: "mechanical",
    defaultScene: "factory",
    theme: { accent: "#f97316", accent2: "#c2410c", sky: 0xfed7aa, floor: 0x1c1917, fog: 0xffedd5 },
    assetKeys: ["crane", "robotArm", "conveyor", "truck", "tire", "boxLarge", "structure"],
    topics: [
      ["Force & Motion", "force", ["Push a cart", "Friction slows", "Inertia"]],
      ["Simple Machines", "simple", ["Lever", "Pulley", "Inclined plane"]],
      ["Torque", "torque", ["Wrench longer", "Door handle", "Bike pedals"]],
      ["Gears", "gears", ["Speed vs torque", "Clockwork", "Bike gears"]],
      ["Energy", "energy", ["Kinetic", "Potential", "Heat loss"]],
      ["Materials", "materials", ["Strong vs stiff", "Steel vs wood", "Fatigue"]],
      ["Mechanisms", "mech", ["Linkages", "Cams idea", "Conveyors"]],
      ["Friction Design", "friction", ["Brakes", "Bearings", "Lubrication"]],
      ["Safety Factors", "safety", ["Over-design", "Wear", "Inspection"]],
      ["Mech Boss", "synthesis", ["Lift a load smarter", "Diagnose a jam", "Improve efficiency"]],
    ],
  },
  {
    id: "civil",
    slug: "civil-basics",
    title: "Civil Basics",
    tagline: "Structures, loads & materials!",
    subjectTag: "Build strong",
    coachName: "Coach Beam",
    emoji: "🏗️",
    landingId: "civil",
    defaultScene: "castle",
    theme: { accent: "#92400e", accent2: "#78350f", sky: 0xfde68a, floor: 0x1c1917, fog: 0xfef3c7 },
    assetKeys: ["castleDoor", "castleBridge", "brick", "building", "rocks", "truck"],
    topics: [
      ["Loads", "loads", ["People on a bridge", "Wind", "Earthquake idea"]],
      ["Compression & Tension", "stress", ["Pillars push", "Cables pull", "Beams bend"]],
      ["Materials", "mats", ["Concrete", "Steel", "Brick"]],
      ["Foundations", "found", ["Soil matters", "Deep piles idea", "Settlement"]],
      ["Beams & Columns", "frame", ["Carry floors", "Grid frames", "Avoid weak joints"]],
      ["Bridges", "bridges", ["Beam", "Arch", "Suspension idea"]],
      ["Water & Drainage", "drain", ["Slopes", "Culverts", "Flood paths"]],
      ["Survey Sense", "survey", ["Levels", "Maps", "Measurements"]],
      ["Sustainable Build", "green", ["Local materials", "Less waste", "Cool design"]],
      ["Civil Boss", "synthesis", ["Choose a structure", "Spot a crack risk", "Plan a path"]],
    ],
  },
  {
    id: "robotics",
    slug: "electronics-robotics",
    title: "Electronics & Robotics",
    tagline: "Sensors, code & builds!",
    subjectTag: "Make it move",
    coachName: "Coach Bot",
    emoji: "🦾",
    landingId: "robotics",
    defaultScene: "factory",
    theme: { accent: "#ec4899", accent2: "#be185d", sky: 0xfbcfe8, floor: 0x500724, fog: 0xfce7f3 },
    assetKeys: ["robotArm", "button", "conveyor", "arcade", "structure", "coin"],
    topics: [
      ["Sense → Think → Act", "loop", ["Eye → brain → hand", "Robot loop", "Feedback"]],
      ["Sensors", "sensors", ["Light", "Distance", "Touch"]],
      ["Actuators", "actuators", ["Motors", "Servos", "LEDs"]],
      ["Microcontrollers", "mcu", ["Tiny computers", "Pins", "Programs"]],
      ["Circuits Lite", "circuits", ["Power", "Ground", "Signal"]],
      ["Code Logic", "code", ["If sensor then…", "Loops", "Variables"]],
      ["Chassis & Build", "build", ["Stable base", "Wheels", "Wiring neat"]],
      ["Line Follow Idea", "line", ["Dark line", "Two sensors", "Correct path"]],
      ["Safety & Ethics", "ethics", ["Stop button", "No harm", "Clear intent"]],
      ["Bot Boss", "synthesis", ["Design a helper bot", "Debug a miss", "Demo a task"]],
    ],
  },
  {
    id: "green",
    slug: "green-tech",
    title: "Green Tech",
    tagline: "Solar, wind & clean power!",
    subjectTag: "Sustainable energy",
    coachName: "Coach Solar",
    emoji: "♻️",
    landingId: "green",
    defaultScene: "nature",
    theme: { accent: "#84cc16", accent2: "#4d7c0f", sky: 0xd9f99d, floor: 0x1a2e05, fog: 0xecfccb },
    assetKeys: ["tree", "plant", "satellite", "building", "barrel", "truck"],
    topics: [
      ["Why Green Tech?", "why", ["Cleaner air", "Climate", "Energy security"]],
      ["Solar", "solar", ["Panels on roofs", "Daytime power", "Battery store"]],
      ["Wind", "wind", ["Turbines", "Coastal breeze", "Intermittent"]],
      ["Hydro & Mini", "hydro", ["Dams idea", "Micro-hydro", "Fish care"]],
      ["Efficiency First", "eff", ["Insulation", "LED", "Less waste heat"]],
      ["Storage", "storage", ["Batteries", "Pumped water idea", "Tradeoffs"]],
      ["Grid Mix", "grid", ["Many sources", "Balance supply", "Smart meters"]],
      ["E-waste", "ewaste", ["Recycle phones", "Repair", "Design for repair"]],
      ["BD Opportunities", "bd", ["Solar home systems", "Biogas", "Cool roofs"]],
      ["Green Boss", "synthesis", ["Pick a tech for a village", "Audit energy use", "Pitch a plan"]],
    ],
  },
  {
    id: "astronomy",
    slug: "astronomy-space",
    title: "Astronomy & Space",
    tagline: "Planets, orbits & cosmos!",
    subjectTag: "Look up",
    coachName: "Coach Orbit",
    emoji: "🪐",
    landingId: "astronomy",
    defaultScene: "space",
    theme: { accent: "#818cf8", accent2: "#4f46e5", sky: 0x1e1b4b, floor: 0x0f0a1a, fog: 0x312e81 },
    assetKeys: ["rocket", "astronaut", "satellite", "barrel", "rocks", "coin"],
    topics: [
      ["Sky Stories", "sky", ["Day/night", "Moon phases", "Stars vs planets"]],
      ["Earth in Space", "earth", ["Orbit Sun", "Tilt seasons", "Axis spin"]],
      ["Solar System", "ss", ["Rocky vs gas", "Order of planets", "Asteroids"]],
      ["Gravity", "gravity", ["Keeps moons", "Orbits", "Weight vs mass"]],
      ["Light & Telescopes", "light", ["Collect light", "Bigger = better", "Radio too"]],
      ["Space Travel", "travel", ["Rockets", "Escape idea", "Satellites"]],
      ["Moon & Tides", "moon", ["Pulls oceans", "Craters", "Landing history"]],
      ["Stars & Life", "stars", ["Fuel fusion idea", "Life cycle", "Supernova"]],
      ["BD Night Sky", "local", ["Light pollution", "Best viewing", "Constellations"]],
      ["Space Boss", "synthesis", ["Plan a mission", "Explain seasons", "Protect dark skies"]],
    ],
  },
  {
    id: "geology",
    slug: "geology-earth",
    title: "Geology & Earth",
    tagline: "Rocks, plates & deep time!",
    subjectTag: "Earth's story",
    coachName: "Coach Rock",
    emoji: "🌋",
    landingId: "geology",
    defaultScene: "nature",
    theme: { accent: "#a16207", accent2: "#78350f", sky: 0xfcd34d, floor: 0x292524, fog: 0xfde68a },
    assetKeys: ["rocks", "rockNature", "tree", "castleBridge", "brick", "barrel"],
    topics: [
      ["Rock Types", "rocks", ["Igneous", "Sedimentary", "Metamorphic"]],
      ["Rock Cycle", "cycle", ["Heat & pressure", "Erosion", "Melting"]],
      ["Plates", "plates", ["Earth jigsaw", "Earthquakes", "Mountains"]],
      ["Volcanoes", "volcano", ["Magma", "Ash", "New land"]],
      ["Soil", "soil", ["Weathered rock", "Organic mix", "Farming"]],
      ["Water Shapes Land", "erosion", ["Rivers carve", "Deltas", "Coastlines"]],
      ["Fossils & Time", "time", ["Layers = time", "Fossils", "Deep past"]],
      ["Resources", "resources", ["Minerals", "Fossil fuels", "Responsible use"]],
      ["BD Landscapes", "bd", ["Delta plains", "Hills", "River shifts"]],
      ["Geo Boss", "synthesis", ["Read a landscape", "Hazard prep", "Conserve soil"]],
    ],
  },
  {
    id: "health",
    slug: "human-anatomy",
    title: "Human Anatomy & Health",
    tagline: "Organs, wellness & care!",
    subjectTag: "Know your body",
    coachName: "Coach Heart",
    emoji: "🫀",
    landingId: "health",
    defaultScene: "classroom",
    theme: { accent: "#f43f5e", accent2: "#be123c", sky: 0xfecdd3, floor: 0x4c0519, fog: 0xffe4e6 },
    assetKeys: ["desk", "chair", "apple", "bottle", "cup", "bookcase"],
    topics: [
      ["Body Map", "map", ["Head to toe", "Organs inside", "Systems team"]],
      ["Heart & Blood", "heart", ["Pump", "Vessels", "Pulse"]],
      ["Lungs & Breath", "lungs", ["Oxygen in", "CO₂ out", "Exercise"]],
      ["Digestion", "digest", ["Mouth to gut", "Nutrients", "Water"]],
      ["Bones & Muscles", "move", ["Support", "Movement", "Posture"]],
      ["Brain & Nerves", "brain", ["Signals", "Senses", "Sleep"]],
      ["Immune Basics", "immune", ["Defense", "Vaccines", "Hygiene"]],
      ["Nutrition", "food", ["Balanced plate", "Protein", "Junk caution"]],
      ["Mental Health", "mind", ["Feelings ok", "Ask help", "Rest"]],
      ["Health Boss", "synthesis", ["Daily habits", "First aid idea", "Help others"]],
    ],
  },
  {
    id: "genetics",
    slug: "genetics-biotech",
    title: "Genetics & Biotech",
    tagline: "DNA, inheritance & ideas!",
    subjectTag: "Code of life",
    coachName: "Coach Gene",
    emoji: "🧪",
    landingId: "genetics",
    defaultScene: "labBench",
    theme: { accent: "#d946ef", accent2: "#a21caf", sky: 0xf5d0fe, floor: 0x4a044e, fog: 0xfae8ff },
    assetKeys: ["bottle", "desk", "apple", "cup", "magnet", "boxSmall"],
    topics: [
      ["Traits", "traits", ["Eye color", "Height", "Family likeness"]],
      ["DNA Idea", "dna", ["Instruction book", "Cells carry it", "Base letters"]],
      ["Genes & Alleles", "genes", ["Versions of traits", "Dominant idea", "Recessive"]],
      ["Inheritance", "inherit", ["Parents → kids", "Punnett idea", "Variation"]],
      ["Mutation", "mut", ["Copy changes", "Sometimes helpful", "Sometimes harmful"]],
      ["Biotech Peek", "biotech", ["Medicine", "Crops", "Enzymes"]],
      ["CRISPR Idea", "crispr", ["Precise edit idea", "Promise", "Caution"]],
      ["Ethics", "ethics", ["Consent", "Equity", "Unintended effects"]],
      ["BD Context", "bd", ["Crop research", "Health labs", "Public talk"]],
      ["Gene Boss", "synthesis", ["Explain a trait", "Weigh a biotech use", "Ask ethical Qs"]],
    ],
  },
  {
    id: "statistics",
    slug: "statistics-probability",
    title: "Statistics & Probability",
    tagline: "Chance, distributions & data!",
    subjectTag: "Uncertainty skills",
    coachName: "Coach Chance",
    emoji: "🎲",
    landingId: "statistics",
    defaultScene: "classroom",
    theme: { accent: "#0ea5e9", accent2: "#0369a1", sky: 0xbae6fd, floor: 0x0c4a6e, fog: 0xe0f2fe },
    assetKeys: ["coin", "dice".replace("dice", "coin"), "desk", "apple", "boxSmall", "arcade"],
    topics: [
      ["Chance Language", "chance", ["Likely/unlikely", "Fair coin", "Weather %"]],
      ["Sample Space", "space", ["All outcomes", "Dice faces", "Cards"]],
      ["Probability Rules", "rules", ["0 to 1", "Add disjoint", "Multiply independent"]],
      ["Mean & Median", "center", ["Average", "Middle", "Outliers"]],
      ["Spread", "spread", ["Range", "Variability", "Consistency"]],
      ["Distributions", "dist", ["Bell idea", "Skew", "Everyday heights"]],
      ["Sampling", "sample", ["Survey bias", "Random sample", "Sample size"]],
      ["Inference Lite", "infer", ["From sample to all", "Uncertainty", "Confidence idea"]],
      ["Misuse", "misuse", ["Cherry-pick", "Bad graphs", "Correlation trap"]],
      ["Stats Boss", "synthesis", ["Design a fair game", "Critique a claim", "Compute a chance"]],
    ],
  },
  {
    id: "geometry",
    slug: "geometry-trig",
    title: "Geometry & Trigonometry",
    tagline: "Shapes, angles & proofs!",
    subjectTag: "Space & measure",
    coachName: "Coach Angle",
    emoji: "📏",
    landingId: "geometry",
    defaultScene: "castle",
    theme: { accent: "#7c3aed", accent2: "#5b21b6", sky: 0xddd6fe, floor: 0x2e1065, fog: 0xede9fe },
    assetKeys: ["brick", "castleBridge", "arrow", "boxLarge", "building", "desk"],
    topics: [
      ["Points Lines Planes", "basics", ["Corners", "Edges", "Surfaces"]],
      ["Angles", "angles", ["Acute/obtuse", "Straight", "Turning"]],
      ["Triangles", "tri", ["Sum 180°", "Types", "Stability"]],
      ["Polygons", "poly", ["Squares", "Hex tiles", "Interior angles"]],
      ["Circles", "circle", ["Radius", "Circumference", "Pi"]],
      ["Area & Perimeter", "measure", ["Fence length", "Floor tiles", "Units"]],
      ["Similarity", "similar", ["Scale models", "Maps", "Shadows"]],
      ["Right Triangles", "right", ["Pythagoras", "3-4-5", "Diagonal"]],
      ["Trig Ratios", "trig", ["SOH CAH TOA idea", "Heights", "Slopes"]],
      ["Geo Boss", "synthesis", ["Prove a property", "Measure a height", "Design a shape"]],
    ],
  },
  {
    id: "calculus",
    slug: "calculus-analysis",
    title: "Calculus & Analysis",
    tagline: "Rates, areas & change!",
    subjectTag: "Change mastery",
    coachName: "Coach Delta",
    emoji: "∫",
    landingId: "calculus",
    defaultScene: "vehicles",
    theme: { accent: "#0891b2", accent2: "#155e75", sky: 0xa5f3fc, floor: 0x083344, fog: 0xcffafe },
    assetKeys: ["carSports", "truck", "arrow", "cone", "desk", "coin"],
    topics: [
      ["Change Everywhere", "change", ["Speed", "Growing plants", "Filling a tank"]],
      ["Limits Idea", "limits", ["Getting closer", "Approach a value", "Instant"]],
      ["Derivative = Rate", "deriv", ["Slope of graph", "Speed from position", "Sensitivity"]],
      ["Rules Lite", "rules", ["Power rule idea", "Sum rule", "Product caution"]],
      ["Applications", "apps", ["Max/min", "Optimization", "Related rates idea"]],
      ["Integral = Accumulate", "int", ["Area under curve", "Total distance", "Sum of bits"]],
      ["FTC Spark", "ftc", ["Derivative ↔ integral", "Net change", "Undo"]],
      ["Series Peek", "series", ["Add forever", "Approximations", "Patterns"]],
      ["Models", "models", ["Growth", "Decay", "Motion"]],
      ["Calc Boss", "synthesis", ["Interpret a slope", "Estimate an area", "Explain a model"]],
    ],
  },
  {
    id: "discrete",
    slug: "discrete-math",
    title: "Discrete Math & Logic",
    tagline: "Sets, graphs & algorithms!",
    subjectTag: "Discrete thinking",
    coachName: "Coach Logic",
    emoji: "🔢",
    landingId: "discrete",
    defaultScene: "arcade",
    theme: { accent: "#4f46e5", accent2: "#3730a3", sky: 0xc7d2fe, floor: 0x1e1b4b, fog: 0xe0e7ff },
    assetKeys: ["arcade", "button", "coin", "boxSmall", "arrow", "desk"],
    topics: [
      ["Sets", "sets", ["Collections", "Union/intersect", "Venn"]],
      ["Logic", "logic", ["And/or/not", "Truth tables", "Implications"]],
      ["Proof Ideas", "proof", ["Direct", "Counterexample", "Cases"]],
      ["Counting", "count", ["Permutations", "Combinations", "Choices"]],
      ["Graphs", "graphs", ["Nodes & edges", "Paths", "Networks"]],
      ["Trees", "trees", ["Hierarchies", "No cycles", "Family trees"]],
      ["Algorithms", "algo", ["Step recipes", "Correctness", "Efficiency"]],
      ["Recursion", "recur", ["Self-similar", "Factorial idea", "Base case"]],
      ["Modular", "mod", ["Clock arithmetic", "Remainders", "Hashes idea"]],
      ["Logic Boss", "synthesis", ["Model a network", "Write an algorithm", "Prove a claim"]],
    ],
  },
];

// Fix statistics assetKeys typo
const stats = PACKS.find((p) => p.id === "statistics");
if (stats) stats.assetKeys = ["coin", "desk", "apple", "boxSmall", "arcade", "button"];

/** Scene variant sets keyed by defaultScene - keeps non-chem packs from looking identical every step */
const SCENE_VARIANTS = {
  labBench: ["labBench"],
  nature: ["nature", "natureCycle"],
  classroom: ["classroom", "classroomCount"],
  arcade: ["arcade", "arcadeBits"],
  factory: ["factory", "factoryFlow"],
  city: ["city", "cityTraffic"],
  space: ["space", "spaceOrbit"],
  castle: ["castle", "castleBuild"],
  vehicles: ["vehicles", "vehiclesRace"],
};

for (const pack of PACKS) {
  if (!pack.topicScenes) {
    pack.sceneVariants = SCENE_VARIANTS[pack.defaultScene] || [pack.defaultScene];
  }
  // Light viz for packs that share metaphors
  if (!pack.topicViz) {
    if (pack.defaultScene === "nature") pack.defaultViz = "nature";
    else if (pack.defaultScene === "factory") pack.defaultViz = "machines";
    else pack.defaultViz = "compare";
  }
}

function shufflePair(a, b) {
  return Math.random() < 0.5 ? [a, b] : [b, a];
}

function sceneFor(pack, levelIdx, subIdx = 0) {
  const topics = pack.topicScenes;
  if (Array.isArray(topics) && topics[levelIdx]) return topics[levelIdx];
  // Rotate among pack variants so screens are not identical across a mission
  const variants = pack.sceneVariants || [pack.defaultScene];
  return variants[(levelIdx + subIdx) % variants.length] || pack.defaultScene;
}

function vizFor(pack, levelIdx) {
  const list = pack.topicViz;
  if (Array.isArray(list) && list[levelIdx]) return list[levelIdx];
  return pack.defaultViz || null;
}

function makeSubs(pack, levelIdx, topicTitle, themeKey, everyday) {
  const scene = sceneFor(pack, levelIdx);
  const viz = vizFor(pack, levelIdx);
  const propTip =
    pack.id === "chemistry"
      ? `Props on screen match the lesson (bottle, cup, pan, magnet…). Use the interactive panel too.`
      : `Match the dock text to props you can actually see in the 3D scene.`;
  const subs = [];
  for (let s = 0; s < 10; s++) {
    const type = TYPES_CYCLE[s];
    const stepScene = sceneFor(pack, levelIdx, s);
    const brunner =
      levelIdx < 3 ? "enactive" : levelIdx < 6 ? "iconic" : levelIdx < 9 ? "symbolic" : "synthesis";
    const baseCoach = `${pack.emoji} Level ${levelIdx + 1} · Step ${s + 1}: explore ${themeKey} (${brunner}).`;
    const hook = everyday[s % everyday.length];

    if (type === "demo") {
      subs.push({
        type: "demo",
        scene: stepScene,
        viz,
        coach: baseCoach,
        html: `<p><strong>${topicTitle}</strong> - watch the themed scene <em>and</em> the interactive panel.</p><p>Everyday hook: <em>${hook}</em>.</p><p>Brunner stage: <strong>${brunner}</strong> - start concrete, then build up.</p>`,
      });
    } else if (type === "drag") {
      subs.push({
        type: "drag",
        scene: stepScene,
        viz,
        coach: `Sort ideas about ${themeKey}.`,
        title: `Sort: ${topicTitle}`,
        instructions: "Drag each chip into the matching zone.",
        chips: [
          { id: "a", text: everyday[0] },
          { id: "b", text: "Totally unrelated magic" },
          { id: "c", text: everyday[1] || everyday[0] },
          { id: "d", text: "Random noise" },
        ],
        zones: [
          { id: "yes", label: `About ${themeKey}`, accept: ["a", "c"] },
          { id: "no", label: "Not related", accept: ["b", "d"] },
        ],
      });
    } else if (type === "reveal") {
      subs.push({
        type: "reveal",
        scene: stepScene,
        viz,
        coach: `Reveal examples for ${topicTitle}.`,
        title: `${topicTitle} - unfold examples`,
        steps: [
          `Hook: ${everyday[0]}`,
          `Notice: ${everyday[1] || everyday[0]} connects to ${themeKey}.`,
          `Pattern: the same idea shows up in ${everyday[2] || everyday[0]}.`,
          `Takeaway: you can explain ${themeKey} using the props you see.`,
        ],
      });
    } else if (type === "order") {
      const chemOrder =
        pack.id === "chemistry"
          ? [
              { id: "1", html: "1) See the props / reaction panel" },
              { id: "2", html: "2) Name the chemistry idea" },
              { id: "3", html: "3) Sort real vs fake examples" },
              { id: "4", html: "4) Prove it on a quiz" },
            ]
          : [
              { id: "1", html: "1) See a concrete example" },
              { id: "2", html: "2) Name the idea" },
              { id: "3", html: "3) Try a hands-on sort" },
              { id: "4", html: "4) Check with a quiz" },
            ];
      subs.push({
        type: "order",
        scene: stepScene,
        viz,
        coach: `Order the learning path for ${themeKey}.`,
        items: chemOrder,
        correctIds: ["1", "2", "3", "4"],
      });
    } else if (type === "equation") {
      subs.push({
        type: "equation",
        scene: stepScene,
        viz,
        coach: `Build the idea sentence for ${themeKey}.`,
        tokens: [
          { id: "t1", html: themeKey },
          { id: "t2", html: "explains" },
          { id: "t3", html: everyday[0].split(" ").slice(0, 4).join(" ") },
        ],
      });
    } else if (type === "quiz" || type === "boss") {
      const ok = 0;
      subs.push({
        type: type === "boss" ? "boss" : "quiz",
        scene: stepScene,
        viz,
        coach: type === "boss" ? `Boss check: ${topicTitle}` : `Quick check: ${topicTitle}`,
        q: `Which best matches “${themeKey}” in ${pack.title}?`,
        opts: [
          everyday[0],
          "A completely unrelated myth",
          "Turning off gravity forever",
          "Ignoring all evidence",
        ],
        ok,
      });
    } else if (type === "scene3d") {
      subs.push({
        type: "scene3d",
        scene: stepScene,
        viz,
        coach: `Explore the 3D scene for ${topicTitle}.`,
        html: `<p>Look at the themed 3D scene. ${propTip}</p><p>Tip: <em>${hook}</em></p>`,
      });
    } else {
      subs.push({
        type: "tap",
        scene: stepScene,
        viz,
        coach: baseCoach,
        html: `<p><strong>${topicTitle}</strong></p><p>${everyday.join(" · ")}</p><p>Stage: ${brunner}. Use the interactive panel, then continue.</p>`,
      });
    }
  }
  return subs;
}

function makeLevel(pack, levelIdx) {
  const [kidTitle, theme, everyday] = pack.topics[levelIdx];
  const rewards = [
    "Rookie",
    "Scout",
    "Explorer",
    "Builder",
    "Analyst",
    "Strategist",
    "Guardian",
    "Scholar",
    "Mentor",
    "Champion",
  ];
  const scene = sceneFor(pack, levelIdx);
  const viz = vizFor(pack, levelIdx);
  return {
    kidTitle,
    theme,
    emoji: pack.emoji,
    rewardName: `${kidTitle.split(" ")[0]} ${rewards[levelIdx]}`,
    intro: `In “${kidTitle}” you learn ${theme} through play - spiral from concrete actions to symbols (Bruner's theory). Props and panel match the idea.`,
    everyday,
    scene,
    viz,
    quiz: [
      {
        q: `What is a good everyday example of “${theme}”?`,
        opts: [everyday[0], "Ignoring the idea", "Deleting evidence", "Random guessing only"],
        ok: 0,
      },
      {
        q: `Bruner's spiral says we should…`,
        opts: [
          "Revisit ideas from concrete → abstract",
          "Only memorize forever",
          "Skip examples",
          "Never check understanding",
        ],
        ok: 0,
      },
      ...(levelIdx >= 7
        ? [
            {
              q: `In ${pack.title}, “${theme}” most helps you…`,
              opts: [
                "Explain and apply the idea safely",
                "Avoid thinking",
                "Break lab rules",
                "Skip practice",
              ],
              ok: 0,
            },
          ]
        : []),
    ],
    subs: makeSubs(pack, levelIdx, kidTitle, theme, everyday),
  };
}

function shellHtml(pack) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <title>${pack.title} - GyanQuest</title>
  <link rel="icon" href="/assets/gyanquest-logo.png" type="image/png" />
  <link rel="stylesheet" href="${ENGINE_REL}/css/styles.css" />
  <link rel="stylesheet" href="${ENGINE_REL}/css/kid-theme.css" />
  <link rel="stylesheet" href="${ENGINE_REL}/css/engine.css" />
  <link rel="stylesheet" href="${ENGINE_REL}/css/concept-viz.css" />
  <link rel="stylesheet" href="${ENGINE_REL}/css/voice.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;600;700&display=swap" rel="stylesheet" />
</head>
<body>
  <div id="app">
    <header class="top-bar">
      <div class="brand">
        <span class="brand-mark" data-i18n="shell.brandMark">${pack.title}</span>
        <h1 data-i18n="shell.brandH1">${pack.tagline}</h1>
        <span class="subject-tag" data-i18n="shell.subjectTag">${pack.subjectTag}</span>
      </div>
      <div class="top-actions">
        <a href="/" class="btn secondary gq-hub-link" data-i18n="shell.hubBack">← GyanQuest</a>
        <span id="reward-slot" class="reward-slot" aria-live="polite"></span>
        <label class="lang-picker">
          <span data-i18n="shell.langLabel">Language</span>
          <select id="lang-select" aria-label="Choose language">
            <option value="en">English</option>
            <option value="bn">বাংলা</option>
          </select>
        </label>
        <button type="button" id="btn-playground" class="btn secondary btn-playground" data-i18n="shell.playground">🧪 Playground</button>
        <label class="level-picker">
          <span data-i18n="shell.mission">Mission</span>
          <select id="level-select" aria-label="Choose mission"></select>
        </label>
        <span id="checkpoint-badge" class="checkpoint-badge hidden" title="Bonus quiz"></span>
      </div>
    </header>

    <div class="progress-row">
      <div id="level-title" class="level-title"></div>
      <div class="sub-dots" id="sub-dots" aria-label="Steps"></div>
    </div>
    <div class="progress-bar-wrap">
      <div class="progress-bar" role="progressbar">
        <div id="progress-fill" class="progress-bar__fill"></div>
      </div>
      <span id="progress-label" class="progress-bar__label">0 steps left</span>
    </div>
    <div id="lab-depth" class="lab-depth" aria-live="polite"></div>

    <main class="stage">
      <div id="viewport" class="viewport">
        <canvas id="c3d" aria-label="3D play area"></canvas>
        <div id="viewport-hud" class="viewport-hud" aria-live="polite"></div>
      </div>
      <div id="play-dock" class="play-dock" aria-label="Coach and activities">
        <div class="play-dock__head">
          <div class="play-dock__coach">
            <span class="coach-inline-avatar" aria-hidden="true">${pack.emoji}</span>
            <div class="coach-inline-meta">
              <strong class="coach-inline-name" data-i18n="shell.coachName">${pack.coachName}</strong>
              <p id="coach-text" class="coach-text"></p>
              <p id="voice-caption" class="voice-caption" hidden></p>
            </div>
          </div>
          <div class="play-dock__head-actions">
            <button type="button" id="btn-next-dock" class="btn primary hidden" title="Next">Next ▶</button>
            <button type="button" id="btn-toggle-panel" class="btn secondary play-dock__toggle" title="Hide panel">−</button>
            <button type="button" id="btn-try-again" class="btn secondary" title="Try again">↻ Try again</button>
          </div>
        </div>
        <div id="coach-actions" class="coach-actions"></div>
        <div id="overlay" class="play-dock__tasks"></div>
      </div>
    </main>

    <footer class="bottom-bar">
      <div id="scores" class="scores"></div>
      <div class="footer-actions">
        <button type="button" id="btn-reset-all" class="btn secondary">↻ Reset all</button>
        <button type="button" id="btn-hint" class="btn secondary">💡 Hint</button>
        <button type="button" id="btn-next" class="btn primary hidden">Next step ▶</button>
      </div>
    </footer>
  </div>

  <div id="modal-root" class="modal-root" aria-hidden="true"></div>
  <div id="toast-root" class="toast-root" aria-live="polite"></div>

  <script defer src="${ENGINE_REL}/vendor/three.min.js"></script>
  <script defer src="${ENGINE_REL}/vendor/OBJLoader.js"></script>
  <script defer src="${ENGINE_REL}/vendor/OrbitControls.js"></script>
  <script type="module" src="main.js"></script>
</body>
</html>
`;
}

function writePack(pack) {
  const dir = path.join(GAMES, pack.slug);
  fs.mkdirSync(path.join(dir, "js"), { recursive: true });

  const levels = pack.topics.map((_, i) => makeLevel(pack, i));
  const curriculum = { levels };
  const manifest = {
    id: pack.id,
    slug: pack.slug,
    title: pack.title,
    tagline: pack.tagline,
    subjectTag: pack.subjectTag,
    coachName: pack.coachName,
    emoji: pack.emoji,
    storageKey: `gq-${pack.slug}-save-v1`,
    localeKey: `gq-${pack.slug}-locale`,
    defaultScene: pack.defaultScene,
    theme: pack.theme,
    assetKeys: pack.assetKeys,
    playgroundGroups: [{ id: "kit", title: `${pack.title} props`, keys: pack.assetKeys }],
  };

  fs.writeFileSync(path.join(dir, "index.html"), shellHtml(pack));
  fs.writeFileSync(
    path.join(dir, "manifest.js"),
    `/** Auto-generated manifest for ${pack.title} */\nexport const manifest = ${JSON.stringify(manifest, null, 2)};\n`,
  );
  fs.writeFileSync(
    path.join(dir, "curriculum.js"),
    `/** Auto-generated curriculum - 10 levels × 10 subs (Brunner spiral) */\nexport const curriculum = ${JSON.stringify(curriculum, null, 2)};\n`,
  );
  fs.writeFileSync(
    path.join(dir, "main.js"),
    `import { bootGame } from "${ENGINE_REL}/js/boot.js";\nimport { manifest } from "./manifest.js";\nimport { curriculum } from "./curriculum.js";\n\nfunction start() {\n  bootGame({ manifest, curriculum });\n}\n\nif (window.THREE) start();\nelse {\n  const iv = setInterval(() => {\n    if (window.THREE) {\n      clearInterval(iv);\n      start();\n    }\n  }, 30);\n  setTimeout(() => clearInterval(iv), 8000);\n}\n`,
  );
  return pack.slug;
}

// --- main ---
fs.mkdirSync(GAMES, { recursive: true });
const written = PACKS.map(writePack);
console.log(`Generated ${written.length} games:`);
written.forEach((s) => console.log(" -", s));

// Export landing map for a helper file
const landingMap = Object.fromEntries(PACKS.map((p) => [p.landingId, `games/${p.slug}/`]));
fs.writeFileSync(
  path.join(__dirname, "landing-hrefs.json"),
  JSON.stringify(landingMap, null, 2),
);
console.log("Wrote scripts/landing-hrefs.json");
