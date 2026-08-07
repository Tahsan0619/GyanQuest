/**
 * Digital book - ICT Mission 1: Computer Bits (gold)
 */
export const BOOK = {
  missionIndex: 0,
  title: "Computer Bits",
  subtitle: "CPU / RAM / storage",
  subject: "ICT Fundamentals / Computer Bits",
  cover: {
    title: "Computer Bits",
    art: "/games/ict-fundamentals/assets/book/m1-fig1.svg",
  },
  glossary: [
    { id: "CPU", term: "CPU" },
    { id: "RAM", term: "RAM" },
    { id: "storage", term: "storage" },
    { id: "SSD", term: "SSD" },
    { id: "bit", term: "bit" },
    { id: "instruction", term: "instruction" },
    { id: "memory", term: "memory" },
    { id: "hardware", term: "hardware" },
  ],
  pages: [
    {
      title: "The inside team",
      layout: "text",
      figures: [
        {
          src: "/games/ict-fundamentals/assets/book/m1-fig1.svg",
          caption: "Figure 1. CPU, RAM, and storage work together.",
          place: "top",
          alt: "Inside PC",
        },
      ],
      blocks: [
        {
          type: "p",
          text: "A computer is hardware you can touch. Inside, three jobs matter most: the CPU thinks by running each instruction, RAM is fast working memory for open apps, and storage keeps files after power off.",
        },
        {
          type: "p",
          text: "A bit is the smallest piece of information - on or off. Billions of bits make photos, games, and schoolwork.",
        },
      ],
    },
    {
      title: "Who does what?",
      layout: "text",
      blocks: [
        {
          type: "ul",
          items: [
            "CPU: calculate, decide, run code",
            "RAM: hold open documents right now",
            "Storage / SSD: keep files for tomorrow",
          ],
        },
        {
          type: "p",
          text: "If RAM fills up, the computer feels slow even if storage still has space. Different jobs, different parts.",
        },
      ],
    },
    {
      title: "Picture the flow",
      layout: "full-fig",
      figures: [
        {
          src: "/games/ict-fundamentals/assets/book/m1-fig2.svg",
          caption: "Figure 2. From storage to RAM to CPU and back.",
          place: "full",
          alt: "Data flow",
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Opening a file copies it into RAM so the CPU can work quickly. Saving writes changes back to storage.",
        },
      ],
    },
    {
      title: "Mission spiral",
      layout: "text",
      blocks: [
        {
          type: "p",
          text: "You met the team, dialed a busy PC, sorted jobs, ran a RAM lab, ordered the story, named the rule, stretched to devices, busted myths, drilled fluency, and claimed mastery.",
        },
      ],
    },
    {
      title: "Everyday devices",
      layout: "split",
      figures: [
        {
          src: "/games/ict-fundamentals/assets/book/m1-fig3.svg",
          caption: "Figure 3. Phones and laptops still use the same trio.",
          place: "right",
          alt: "Devices",
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Phones also have a CPU, RAM, and storage. Closing apps frees RAM. Deleting a video frees storage.",
        },
      ],
    },
    {
      title: "Myths",
      layout: "text",
      blocks: [
        {
          type: "p",
          text: "Myth: More storage always means a faster computer. Reality: a slow CPU or tiny RAM can still lag.",
        },
        {
          type: "p",
          text: "Tap red words like CPU or RAM for tutor help.",
        },
      ],
    },
    {
      title: "Mastery",
      layout: "text",
      blocks: [
        {
          type: "p",
          text: "Teach the trio: CPU runs instructions, RAM is working memory, storage keeps files. Point to each idea on a real device.",
        },
      ],
    },
  ],
};

export default BOOK;
