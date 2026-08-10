/**
 * Digital book - ICT Fundamentals Mission 1: Computer Basics
 * Unique curriculum book (input-process-output-storage). Not a template fill-in.
 */
export const BOOK = {
  missionIndex: 0,
  title: "Computer Basics",
  subtitle: "the four jobs every computer repeats",
  subject: "ICT Fundamentals / Computer Basics",
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
    title: "Computer Basics",
    art: "/games/ict-fundamentals/assets/book/m1-cover.jpg",
  },
  glossary: [
    { id: "input", term: "input" },
    { id: "process", term: "process" },
    { id: "output", term: "output" },
    { id: "storage", term: "storage" },
    { id: "hardware", term: "hardware" },
    { id: "software", term: "software" },
    { id: "cpu", term: "CPU" },
  ],
  pages: [
    {
      title: "A machine with a loop",
      layout: "text",
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/ict-fundamentals/assets/book/m1-hook.jpg",
              caption: "Figure 1. Keyboard and mouse are classic input tools - they send signals in.",
              alt: "Keyboard and mouse on a desk",
            },
            {
              src: "/games/ict-fundamentals/assets/book/m1-cover.jpg",
              caption: "Inside the case, hardware parts carry out the loop again and again.",
              alt: "Computer hardware",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Every useful computer task follows a loop: input → process → output, with storage keeping work for later.",
        },
        {
          type: "p",
          text: "Hardware is the physical stuff you can touch. Software is the instructions that tell hardware what to do.",
        },
        {
          type: "p",
          text: "Everyday hook: typing a chat message - fingers input, the phone processes, the screen shows output, the app stores the chat.",
        },
      ],
    },
    {
      title: "Input and process",
      layout: "full-fig",
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/ict-fundamentals/assets/book/m1-process.jpg",
              caption: "Figure 2. The CPU is the main process chip - it follows instructions at high speed.",
              alt: "CPU processor chip",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "ul",
          items: [
            "Input devices: keyboard, mouse, mic, camera, touchscreen",
            "Process: CPU and programs transform data",
            "Without clear input, process has nothing useful to do",
          ],
        },
        {
          type: "p",
          text: "The CPU does not 'know ideas'. It follows software steps on data that input delivered.",
        },
      ],
    },
    {
      title: "Output and storage",
      layout: "text",
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/ict-fundamentals/assets/book/m1-output.jpg",
              caption: "Figure 3. A monitor is output - it shows results humans can read.",
              alt: "Computer monitor",
            },
            {
              src: "/games/ict-fundamentals/assets/book/m1-storage.jpg",
              caption: "Drives and chips provide storage so work survives after you close a window.",
              alt: "Storage drive",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Output can be screen, speaker, printer, or even a motor in a robot. It is the computer talking back to the world.",
        },
        {
          type: "p",
          text: "Storage holds files and programs. Fast short-term memory and longer disk storage play different roles, but both keep data.",
        },
      ],
    },
    {
      title: "Trace one task",
      layout: "full-fig",
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/ict-fundamentals/assets/book/m1-input.jpg",
              caption: "Figure 4. Start any task at input, then name process, output, and storage.",
              alt: "Input devices",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Example: open a saved drawing. Storage loads the file, software + CPU process edits, the screen outputs pixels, save writes storage again.",
        },
      ],
    },
    {
      title: "How the mission connects",
      layout: "text",
      blocks: [
        {
          type: "p",
          text: "Meet parts → sort IPOS → connect cables/ideas → lab task → explain → rule → stretch → myth → fluency → mastery.",
        },
        {
          type: "ul",
          items: [
            "Sorting devices into IPOS builds the mental model",
            "Tracing a real task stops memorizing labels only",
            "The rule sentence is the four-job loop",
          ],
        },
      ],
    },
    {
      title: "Desk lab",
      layout: "split",
      figures: [
        {
          place: "right",
          slides: [
            {
              src: "/games/ict-fundamentals/assets/book/m1-hook.jpg",
              caption: "Find two input devices.",
              alt: "Input",
            },
            {
              src: "/games/ict-fundamentals/assets/book/m1-output.jpg",
              caption: "Name one output device.",
              alt: "Output",
            },
            {
              src: "/games/ict-fundamentals/assets/book/m1-storage.jpg",
              caption: "Point to where files live.",
              alt: "Storage",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Pick a phone or PC task. Write four short labels: input, process, output, storage. No empty boxes allowed.",
        },
        {
          type: "ul",
          items: [
            "Which part is hardware?",
            "Which part is software?",
            "Where does the CPU sit in your story?",
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
          text: "Myth: The screen is the computer. Better: the screen is mostly output; process happens in chips inside.",
        },
        {
          type: "p",
          text: "Myth: Storage and memory are the same word game. Better: both keep data, but they are different hardware jobs.",
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
              src: "/games/ict-fundamentals/assets/book/m1-cover.jpg",
              caption: "Figure 5. Teach the IPOS loop from this hardware view.",
              alt: "Computer basics anchor",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Teach a friend in one minute: computers loop input-process-output; storage keeps work; hardware runs software.",
        },
        {
          type: "ul",
          items: [
            "Name one device for each of the four jobs",
            "Separate hardware from software once",
            "Use the word CPU correctly once",
          ],
        },
      ],
    },
  ],
};

export default BOOK;
