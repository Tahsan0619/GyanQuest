/**
 * Digital book - ICT Fundamentals Mission 1: Computer Bits
 * Theory: cognitive load, dual coding, multimedia learning, constructivism,
 * conceptual change, spiral scaffold, retrieval practice.
 * Photos: chip, computer, and board JPGs under assets/book/.
 */
export const BOOK = {
  missionIndex: 0,
  title: "Computer Bits",
  subtitle: "CPU, RAM, and storage",
  subject: "ICT Fundamentals / Computer Bits",
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
    title: "Computer Bits",
    art: "/games/ict-fundamentals/assets/book/m1-cover.jpg",
  },
  glossary: [
    { id: "cpu", term: "CPU" },
    { id: "ram", term: "RAM" },
    { id: "storage", term: "storage" },
    { id: "processor", term: "processor" },
    { id: "memory", term: "memory" },
    { id: "file", term: "file" },
    { id: "power-off", term: "power off" },
    { id: "chip", term: "chip" },
  ],
  pages: [
    {
      title: "Phone chip, laptop upgrades, saved homework",
      layout: "text",
      theory: ["constructivism", "dual-coding", "cognitive-load"],
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/ict-fundamentals/assets/book/m1-hook.jpg",
              caption: "Figure 1. Inside a computer, different parts keep different jobs.",
              alt: "Computer hardware",
            },
            {
              src: "/games/ict-fundamentals/assets/book/m1-cover.jpg",
              caption: "Chips handle thinking work - but they need short-term and long-term helpers.",
              alt: "Computer chip",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "A phone has a chip that thinks. A laptop upgrade might add RAM so more apps stay open. Saving a school file puts it in storage so it survives power off.",
        },
        {
          type: "p",
          text: "CPU thinks (processes). RAM holds open work. Storage keeps files after you shut down.",
        },
        {
          type: "p",
          text: "Earn Bit Scout by naming which part does which job on a device you use.",
        },
      ],
    },
    {
      title: "Three parts, three jobs",
      layout: "full-fig",
      theory: ["multimedia-learning", "dual-coding"],
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/ict-fundamentals/assets/book/m1-model.jpg",
              caption: "Figure 2. Model: dense circuitry is where processing lives - still not the whole story.",
              alt: "Integrated circuit close-up",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "ul",
          items: [
            "CPU - the processor that runs instructions",
            "RAM - fast working memory for open apps",
            "Storage - longer-term place for files and programs",
          ],
        },
        {
          type: "p",
          text: "Busy PC labs in the mission fill RAM on purpose so you feel why three parts matter.",
        },
      ],
    },
    {
      title: "Why RAM is not storage",
      layout: "text",
      theory: ["cognitive-load", "dual-coding"],
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/ict-fundamentals/assets/book/m1-board.jpg",
              caption: "Figure 3. Boards host CPU and memory chips with different roles.",
              alt: "Circuit board",
            },
            {
              src: "/games/ict-fundamentals/assets/book/m1-signal.jpg",
              caption: "Saved work must survive when power and signals stop.",
              alt: "Satellite communication dish",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Close a document without saving and RAM forgets it after power off. Storage is what keeps the file for tomorrow.",
        },
        {
          type: "p",
          text: "If RAM fills up, the computer feels slow even when storage still has free space - different jobs.",
        },
      ],
    },
    {
      title: "Labels on a team diagram",
      layout: "full-fig",
      theory: ["multimedia-learning", "spiral-scaffold"],
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/ict-fundamentals/assets/book/m1-cover.jpg",
              caption: "Figure 4. Representation: chip photo stands for the CPU seat on your mental map.",
              alt: "Chip as CPU marker",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Game icons are simplified. Real motherboards pack CPU, RAM sticks, and drives - same three-job story.",
        },
      ],
    },
    {
      title: "How the 10 steps connect",
      layout: "text",
      theory: ["spiral-scaffold", "cognitive-load"],
      blocks: [
        {
          type: "p",
          text: "Meet the inside team -> busy PC lab -> sort the jobs -> RAM fill lab -> why three parts -> name the bits rule -> stretch to devices -> myth bust -> fluency -> Bit Scout mastery.",
        },
        {
          type: "ul",
          items: [
            "Sorting keeps CPU, RAM, and storage from blending",
            "RAM fill lab shows open-work limits",
            "The rule sentence: CPU thinks, RAM holds open work, storage keeps files",
          ],
        },
      ],
    },
    {
      title: "Device transfer",
      layout: "split",
      theory: ["constructivism", "dual-coding", "retrieval-practice"],
      figures: [
        {
          place: "right",
          slides: [
            {
              src: "/games/ict-fundamentals/assets/book/m1-hook.jpg",
              caption: "Laptop or PC - find the three jobs in your own words.",
              alt: "Computer",
            },
            {
              src: "/games/ict-fundamentals/assets/book/m1-cover.jpg",
              caption: "Phone chip - still has CPU, RAM, storage.",
              alt: "Chip",
            },
            {
              src: "/games/ict-fundamentals/assets/book/m1-signal.jpg",
              caption: "Cloud saves are still storage somewhere.",
              alt: "Communication link",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Open two apps, then save a file. Say: CPU ran them, RAM held them open, storage kept the save.",
        },
        {
          type: "ul",
          items: [
            "What disappears if power cuts before save?",
            "What stays after reboot?",
            "Drag the photos to flip examples",
          ],
        },
      ],
    },
    {
      title: "Myths to bust",
      layout: "text",
      theory: ["conceptual-change"],
      blocks: [
        {
          type: "p",
          text: "Myth: More storage always makes a slow PC fast. Better: speed often needs CPU and enough RAM; storage mainly holds files.",
        },
        {
          type: "p",
          text: "Myth: RAM and storage are the same memory. Better: RAM is short-term working space; storage keeps files after power off.",
        },
        {
          type: "p",
          text: "Red words are glossary terms. Tap one to ask the tutor.",
        },
      ],
    },
    {
      title: "Bit Scout mastery",
      layout: "text",
      theory: ["retrieval-practice", "spiral-scaffold"],
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/ict-fundamentals/assets/book/m1-cover.jpg",
              caption: "Figure 5. Teaching anchor: think, hold open, keep saved.",
              alt: "Chip mastery anchor",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Teach a friend in one minute: CPU processes, RAM holds open work, storage keeps files after shutdown.",
        },
        {
          type: "ul",
          items: [
            "Match three jobs to three parts",
            "Explain one save vs one open-tab example",
            "Use RAM and storage correctly once each",
          ],
        },
      ],
    },
  ],
};

export default BOOK;
