/**
 * Digital book - ICT Fundamentals Mission 3: Files & Folders
 * Theory: cognitive load, dual coding, multimedia learning, constructivism,
 * conceptual change, spiral scaffold, retrieval practice.
 * Photos: communication, computer, chip, and storage JPGs under assets/book/.
 */
export const BOOK = {
  missionIndex: 2,
  title: "Files & Folders",
  subtitle: "name, save, and find",
  subject: "ICT Fundamentals / Files & Folders",
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
    title: "Files & Folders",
    art: "/games/ict-fundamentals/assets/book/m3-cover.jpg",
  },
  glossary: [
    { id: "file", term: "file" },
    { id: "folder", term: "folder" },
    { id: "filename", term: "filename" },
    { id: "save", term: "save" },
    { id: "path", term: "path" },
    { id: "storage", term: "storage" },
    { id: "cloud", term: "cloud" },
    { id: "usb", term: "USB" },
  ],
  pages: [
    {
      title: "School folder, photo albums, USB stick",
      layout: "text",
      theory: ["constructivism", "dual-coding", "cognitive-load"],
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/ict-fundamentals/assets/book/m3-hook.jpg",
              caption: "Figure 1. Finding work later depends on clear names and places.",
              alt: "Computer for file work",
            },
            {
              src: "/games/ict-fundamentals/assets/book/m3-cover.jpg",
              caption: "Links and drives still need human-friendly labels.",
              alt: "Communication / link gear",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "A school folder named Math2026 beats a pile of Document1 copies. Phone photo albums group memories. A USB stick only helps if filenames make sense.",
        },
        {
          type: "p",
          text: "Clear names and folders make homework findable on PC, phone, or cloud.",
        },
        {
          type: "p",
          text: "Earn File Finder by practicing name -> save -> find as one habit.",
        },
      ],
    },
    {
      title: "File is the item, folder is the shelf",
      layout: "full-fig",
      theory: ["multimedia-learning", "dual-coding"],
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/ict-fundamentals/assets/book/m3-model.jpg",
              caption: "Figure 2. Model: storage chips hold bits; folders are how we organize them.",
              alt: "Storage chip",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "ul",
          items: [
            "File - one saved item (essay, photo, sheet)",
            "Folder - a named container for related files",
            "Path - the route of folders that leads to the file",
          ],
        },
      ],
    },
    {
      title: "Save again so finds succeed",
      layout: "text",
      theory: ["cognitive-load", "dual-coding"],
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/ict-fundamentals/assets/book/m3-storage.jpg",
              caption: "Figure 3. Storage keeps the bytes - your name tells humans which bytes.",
              alt: "Integrated circuit storage metaphor",
            },
            {
              src: "/games/ict-fundamentals/assets/book/m3-save.jpg",
              caption: "Saving moves work from temporary space into lasting storage.",
              alt: "Battery/power reminder that saves survive power cycles",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Save bar labs in the mission practice the moment work becomes findable. Save again after edits so the path leads to the newest version.",
        },
        {
          type: "p",
          text: "A good filename says subject and date: Science_WaterCycle_07Aug.md beats final_final2.",
        },
      ],
    },
    {
      title: "Path story on screen",
      layout: "full-fig",
      theory: ["multimedia-learning", "spiral-scaffold"],
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/ict-fundamentals/assets/book/m3-hook.jpg",
              caption: "Figure 4. Representation: School/Math/Homework is a path you can say aloud.",
              alt: "Computer file browser context",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Mission folder bins are models. Real explorers show the same idea: nest folders, then open the file at the end of the path.",
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
          text: "Meet files and folders -> save bar lab -> sort into folders -> save again lab -> find path story -> name the file rule -> stretch to places -> myth bust -> fluency -> File Finder mastery.",
        },
        {
          type: "ul",
          items: [
            "Sorting builds folder habits",
            "Save-again lab protects the newest version",
            "The rule sentence: name it, save it, then you can find it",
          ],
        },
      ],
    },
    {
      title: "Homework transfer",
      layout: "split",
      theory: ["constructivism", "dual-coding", "retrieval-practice"],
      figures: [
        {
          place: "right",
          slides: [
            {
              src: "/games/ict-fundamentals/assets/book/m3-hook.jpg",
              caption: "Create a School folder tree.",
              alt: "Computer",
            },
            {
              src: "/games/ict-fundamentals/assets/book/m3-storage.jpg",
              caption: "Save into storage with a clear name.",
              alt: "Storage",
            },
            {
              src: "/games/ict-fundamentals/assets/book/m3-cover.jpg",
              caption: "Cloud or USB - same naming rules.",
              alt: "Link / remote storage cue",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Make folders School/Math and School/Science. Save one note in each with a dated name. Close everything, then find both using the path.",
        },
        {
          type: "ul",
          items: [
            "What was the filename?",
            "What was the folder path?",
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
          text: "Myth: Search always saves you, so names do not matter. Better: clear names and folders make search faster and backups safer.",
        },
        {
          type: "p",
          text: "Myth: Desktop dumps are a filing system. Better: a few subject folders beat fifty loose icons.",
        },
        {
          type: "p",
          text: "Red words are glossary terms. Tap one to ask the tutor.",
        },
      ],
    },
    {
      title: "File Finder mastery",
      layout: "text",
      theory: ["retrieval-practice", "spiral-scaffold"],
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/ict-fundamentals/assets/book/m3-model.jpg",
              caption: "Figure 5. Teaching anchor: name, save, find on real storage.",
              alt: "Chip storage anchor",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Teach a friend in one minute: a file is the item; a folder is the shelf; a path is the route; save with a clear name so you can find it later.",
        },
        {
          type: "ul",
          items: [
            "Create one nested path and one dated filename",
            "Find the file after closing the app",
            "Use path and folder correctly once each",
          ],
        },
      ],
    },
  ],
};

export default BOOK;
