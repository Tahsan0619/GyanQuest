/**
 * Digital book - ICT Fundamentals Mission 2: Input & Output
 * Theory: cognitive load, dual coding, multimedia learning, constructivism,
 * conceptual change, spiral scaffold, retrieval practice.
 * Photos: computer, dish, chip, and path JPGs under assets/book/.
 */
export const BOOK = {
  missionIndex: 1,
  title: "Input & Output",
  subtitle: "devices that send in and show out",
  subject: "ICT Fundamentals / Input & Output",
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
    title: "Input & Output",
    art: "/games/ict-fundamentals/assets/book/m2-cover.jpg",
  },
  glossary: [
    { id: "input", term: "input" },
    { id: "output", term: "output" },
    { id: "device", term: "device" },
    { id: "keyboard", term: "keyboard" },
    { id: "display", term: "display" },
    { id: "microphone", term: "microphone" },
    { id: "speaker", term: "speaker" },
    { id: "touchscreen", term: "touchscreen" },
  ],
  pages: [
    {
      title: "Homework keys, call mic, tablet taps",
      layout: "text",
      theory: ["constructivism", "dual-coding", "cognitive-load"],
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/ict-fundamentals/assets/book/m2-hook.jpg",
              caption: "Figure 1. Signals travel in and results travel out - devices specialize.",
              alt: "Satellite communication",
            },
            {
              src: "/games/ict-fundamentals/assets/book/m2-cover.jpg",
              caption: "A computer is surrounded by input and output tools.",
              alt: "Desktop computer",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Typing homework is input. The screen showing letters is output. On a video call, the mic is input and the speaker is output. A touchscreen does both.",
        },
        {
          type: "p",
          text: "Input sends data in. Output shows, prints, or plays results out.",
        },
        {
          type: "p",
          text: "Earn I/O Ranger by sorting everyday devices into in, out, or both.",
        },
      ],
    },
    {
      title: "In toward the CPU, out toward you",
      layout: "full-fig",
      theory: ["multimedia-learning", "dual-coding"],
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/ict-fundamentals/assets/book/m2-model.jpg",
              caption: "Figure 2. Model: processing sits in the middle; I/O devices feed and report.",
              alt: "Chip between input and output",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "ul",
          items: [
            "Input examples - keyboard, mouse, mic, camera",
            "Output examples - screen, speaker, printer",
            "Both - touchscreen, headset with mic",
          ],
        },
      ],
    },
    {
      title: "Path of a keypress",
      layout: "text",
      theory: ["cognitive-load", "dual-coding"],
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/ict-fundamentals/assets/book/m2-path.jpg",
              caption: "Figure 3. Signals need a path from device to processor and back to a display.",
              alt: "Circuit path",
            },
            {
              src: "/games/ict-fundamentals/assets/book/m2-devices.jpg",
              caption: "Tiny electronics still obey the same in/out story.",
              alt: "Integrated circuit",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Press A: keyboard input travels in, the CPU processes, the display outputs the letter. Mission type-to-screen labs shrink that path so you can watch it.",
        },
        {
          type: "p",
          text: "If the keyboard fails, input breaks. If the screen fails, output breaks. Same computer, different broken job.",
        },
      ],
    },
    {
      title: "Sort bins for devices",
      layout: "full-fig",
      theory: ["multimedia-learning", "spiral-scaffold"],
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/ict-fundamentals/assets/book/m2-cover.jpg",
              caption: "Figure 4. Representation: label each tool as input, output, or both.",
              alt: "Computer with peripherals implied",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Game bins are models. Real desks still ask: does this device send data in, show results out, or both?",
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
          text: "Meet I/O devices -> type to screen lab -> sort input/output -> signal lab -> path of a keypress -> name the I/O rule -> stretch to real life -> myth bust -> fluency -> I/O Ranger mastery.",
        },
        {
          type: "ul",
          items: [
            "Sorting builds quick device judgment",
            "Keypress path links input to output through processing",
            "The rule sentence: input in, output out; some devices do both",
          ],
        },
      ],
    },
    {
      title: "Desk transfer",
      layout: "split",
      theory: ["constructivism", "dual-coding", "retrieval-practice"],
      figures: [
        {
          place: "right",
          slides: [
            {
              src: "/games/ict-fundamentals/assets/book/m2-cover.jpg",
              caption: "Point to keyboard (in) and screen (out).",
              alt: "Computer",
            },
            {
              src: "/games/ict-fundamentals/assets/book/m2-hook.jpg",
              caption: "Mic and speaker on a call - in and out.",
              alt: "Communication gear",
            },
            {
              src: "/games/ict-fundamentals/assets/book/m2-model.jpg",
              caption: "Processor sits between the two directions.",
              alt: "Chip",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "List five devices near you. Mark each I, O, or both. Include one touchscreen if you have one.",
        },
        {
          type: "ul",
          items: [
            "Which device only sends in?",
            "Which device only shows out?",
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
          text: "Myth: The screen is where thinking happens. Better: the display is mostly output; the CPU does the thinking.",
        },
        {
          type: "p",
          text: "Myth: Touchscreens are only output because you see them. Better: touch is input and the picture is output.",
        },
        {
          type: "p",
          text: "Red words are glossary terms. Tap one to ask the tutor.",
        },
      ],
    },
    {
      title: "I/O Ranger mastery",
      layout: "text",
      theory: ["retrieval-practice", "spiral-scaffold"],
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/ict-fundamentals/assets/book/m2-cover.jpg",
              caption: "Figure 5. Teaching anchor: data in, results out.",
              alt: "Computer mastery anchor",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Teach a friend in one minute: input devices send data in; output devices show or play results; touchscreens and headsets can do both.",
        },
        {
          type: "ul",
          items: [
            "Sort six device names",
            "Trace one keypress path",
            "Use input and output correctly once each",
          ],
        },
      ],
    },
  ],
};

export default BOOK;
