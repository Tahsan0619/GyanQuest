/**
 * Digital book - OS & Hardware Mission 1: Inside the Box
 * Theory: cognitive load, dual coding, multimedia learning, constructivism,
 * conceptual change, spiral scaffold, retrieval practice.
 * Photos: assets/book-shared computing theme (see assets/book/CREDITS-m1.json).
 */
export const BOOK = {
  missionIndex: 0,
  title: "Inside the Box",
  subtitle: "hardware does work - OS manages the team",
  subject: "OS Hardware / Inside the Box",
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
    title: "Inside the Box",
    art: "/games/os-hardware/assets/book/m1-cover.jpg",
  },
  glossary: [
    { id: "hardware", term: "hardware" },
    { id: "os", term: "operating system" },
    { id: "cpu", term: "CPU" },
    { id: "memory", term: "memory" },
    { id: "device", term: "device" },
    { id: "app", term: "app" },
    { id: "boot", term: "boot" },
    { id: "driver", term: "driver" },
  ],
  pages: [
    {
      title: "Parts that work, software that manages",
      layout: "text",
      theory: ["constructivism", "dual-coding", "cognitive-load"],
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/os-hardware/assets/book/m1-cover.jpg",
              caption: "Figure 1. An integrated circuit is hardware - physical work happens here.",
              alt: "Integrated circuit chip",
            },
            {
              src: "/games/os-hardware/assets/book/m1-hook.jpg",
              caption: "Batteries and boards supply energy so hardware can run.",
              alt: "Battery hardware",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Hardware parts do the physical work. The operating system manages apps, memory, and devices.",
        },
        {
          type: "p",
          text: "Think of a team: CPU, memory, storage, and USB devices are players. The OS is the coach that schedules turns and keeps them from colliding.",
        },
        {
          type: "p",
          text: "Laptop boots, phone app switches, and USB stick plug-ins all show hardware meeting OS management.",
        },
      ],
    },
    {
      title: "A shared workspace",
      layout: "full-fig",
      theory: ["multimedia-learning", "dual-coding"],
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/os-hardware/assets/book/m1-model.jpg",
              caption: "Figure 2. Crowded shared spaces need rules - so do CPU time and memory.",
              alt: "Shared station environment",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Without an OS, every app would fight for the screen, disk, and memory. With an OS, apps ask politely through system services.",
        },
        {
          type: "ul",
          items: [
            "Hardware: chips, disks, ports, screens",
            "OS: boots the machine, runs apps, talks to devices",
            "Apps: tools you open; they ride on top of the OS",
          ],
        },
      ],
    },
    {
      title: "Who starts the day",
      layout: "text",
      theory: ["cognitive-load", "dual-coding"],
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/os-hardware/assets/book/m1-mechanism.jpg",
              caption: "Figure 3. Crew procedures - OS boot follows ordered steps before apps appear.",
              alt: "Crewmember performing system procedure",
            },
            {
              src: "/games/os-hardware/assets/book/m1-detail.jpg",
              caption: "Motion needs coordination - app switching is scheduled motion of attention and memory.",
              alt: "Skateboard motion",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Boot is the OS waking hardware, checking devices, then offering you a desktop or home screen.",
        },
        {
          type: "p",
          text: "Plug in a USB stick and the OS loads a driver path so the file app can see the device - hardware alone is not enough.",
        },
      ],
    },
    {
      title: "Pushing work through the system",
      layout: "full-fig",
      theory: ["multimedia-learning", "spiral-scaffold"],
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/os-hardware/assets/book/m1-transfer.webp",
              caption: "Figure 4. Moving a load takes a path - OS routes work to the right hardware.",
              alt: "Pushing a cart",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Saving a file pushes bits to storage hardware under OS control. You click once; the team play is longer.",
        },
      ],
    },
    {
      title: "Box Scout route",
      layout: "text",
      theory: ["spiral-scaffold", "cognitive-load"],
      blocks: [
        {
          type: "p",
          text: "You met the box, dialed the team idea, sorted hardware vs OS, smoothed the team lab, and named why the OS manages.",
        },
        {
          type: "ul",
          items: [
            "Sort: physical part vs managing software",
            "Lab: smoother sharing of CPU and devices",
            "Rule: hardware does work - OS manages the team",
          ],
        },
        {
          type: "p",
          text: "Subs stayed focused. This book is the full inside-the-box map.",
        },
      ],
    },
    {
      title: "Boot, switch, plug-in",
      layout: "split",
      theory: ["constructivism", "dual-coding", "retrieval-practice"],
      figures: [
        {
          place: "right",
          slides: [
            {
              src: "/games/os-hardware/assets/book/m1-cover.jpg",
              caption: "Laptop boot - OS wakes hardware.",
              alt: "Chip hardware",
            },
            {
              src: "/games/os-hardware/assets/book/m1-detail.jpg",
              caption: "App switch - OS shares attention and memory.",
              alt: "Coordinated motion",
            },
            {
              src: "/games/os-hardware/assets/book/m1-hook.jpg",
              caption: "USB power and data - device meets OS driver path.",
              alt: "Battery and power hardware",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Narrate each everyday moment as hardware action plus OS management.",
        },
        {
          type: "ul",
          items: [
            "What physical part is busy?",
            "What is the OS deciding?",
            "What would fail if the OS ignored the device?",
          ],
        },
      ],
    },
    {
      title: "Box myths",
      layout: "text",
      theory: ["conceptual-change"],
      blocks: [
        {
          type: "p",
          text: "Myth: The OS is just wallpaper icons. Better: it schedules work, memory, and devices under those icons.",
        },
        {
          type: "p",
          text: "Myth: Faster hardware always fixes lag. Better: a stuck app or full memory can lag even on strong hardware; OS management matters.",
        },
        {
          type: "p",
          text: "Myth: Apps talk to chips directly all day. Better: apps usually ask the OS, which coordinates safe access.",
        },
        {
          type: "p",
          text: "Tap hardware or operating system in red to ask the tutor.",
        },
      ],
    },
    {
      title: "Box Scout mastery",
      layout: "text",
      theory: ["retrieval-practice", "spiral-scaffold"],
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/os-hardware/assets/book/m1-cover.jpg",
              caption: "Figure 5. Teach the team rule with one chip picture.",
              alt: "Integrated circuit teaching anchor",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Teach in one minute: hardware does the physical work; the operating system manages apps, memory, and devices like a coach.",
        },
        {
          type: "ul",
          items: [
            "Sort three items into hardware vs OS",
            "Explain boot in one sentence",
            "Use the word device correctly once",
          ],
        },
      ],
    },
  ],
};

export default BOOK;
