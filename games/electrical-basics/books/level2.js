/**
 * Digital book - Electrical Basics Mission 2: Voltage & Current
 * Theory: cognitive load, dual coding, multimedia learning, constructivism,
 * conceptual change, spiral scaffold, retrieval practice.
 * Photos: battery, bulb, and circuit JPGs under assets/book/.
 */
export const BOOK = {
  missionIndex: 1,
  title: "Voltage & Current",
  subtitle: "V pushes, I flows",
  subject: "Electrical Basics / Voltage & Current",
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
    title: "Voltage & Current",
    art: "/games/electrical-basics/assets/book/m2-cover.jpg",
  },
  glossary: [
    { id: "voltage", term: "voltage" },
    { id: "current", term: "current" },
    { id: "volt", term: "volt" },
    { id: "ampere", term: "ampere" },
    { id: "push", term: "push" },
    { id: "flow", term: "flow" },
    { id: "charge", term: "charge" },
    { id: "load", term: "load" },
  ],
  pages: [
    {
      title: "Phone charger, car battery, flashlight cells",
      layout: "text",
      theory: ["constructivism", "dual-coding", "cognitive-load"],
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/electrical-basics/assets/book/m2-hook.jpg",
              caption: "Figure 1. A bulb glows when push and flow are both present in a loop.",
              alt: "Light bulb",
            },
            {
              src: "/games/electrical-basics/assets/book/m2-cover.jpg",
              caption: "Cells and batteries provide the push we call voltage.",
              alt: "Battery",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "A phone charger label shows volts. A car battery is a strong push source. Flashlight cells stack to raise that push for the bulb.",
        },
        {
          type: "p",
          text: "Voltage (V) is the electrical push. Current (I) is the flow of charge around the loop. Push without a path does nothing; path without push stays dark.",
        },
        {
          type: "p",
          text: "Earn Volt Scout by saying 'V pushes, I flows' with a real device example.",
        },
      ],
    },
    {
      title: "Two jobs, not two names for one thing",
      layout: "full-fig",
      theory: ["multimedia-learning", "dual-coding"],
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/electrical-basics/assets/book/m2-model.jpg",
              caption: "Figure 2. Model: traces are the path; the source provides push; charge flows as current.",
              alt: "Circuit board",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "ul",
          items: [
            "Voltage - push, measured in volts",
            "Current - flow, measured in amperes",
            "Load - what uses the energy (bulb, phone)",
          ],
        },
        {
          type: "p",
          text: "Sorting V vs I in the mission stops the mix-up: brighter ideas need both ideas clear.",
        },
      ],
    },
    {
      title: "Stronger push, stronger flow (if the path allows)",
      layout: "text",
      theory: ["cognitive-load", "dual-coding"],
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/electrical-basics/assets/book/m2-push.jpg",
              caption: "Figure 3. Sources can raise available push - still need a safe closed path.",
              alt: "Solar panel source",
            },
            {
              src: "/games/electrical-basics/assets/book/m2-flow.jpg",
              caption: "Fine paths carry flow when push is applied.",
              alt: "Integrated circuit",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Add another cell in a simple series torch and the push rises. If the loop is closed, current can increase and the bulb can brighten - within safe limits.",
        },
        {
          type: "p",
          text: "Mission push dials model that idea. Never invent unsafe experiments with wall sockets.",
        },
      ],
    },
    {
      title: "Symbols stand for push and flow",
      layout: "full-fig",
      theory: ["multimedia-learning", "spiral-scaffold"],
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/electrical-basics/assets/book/m2-hook.jpg",
              caption: "Figure 4. Representation: a glowing load is evidence that push drove flow through the loop.",
              alt: "Glowing bulb",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Meters and labels are representations. The physics story stays: voltage pushes; current flows.",
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
          text: "Meet V and I -> push dial lab -> sort V vs I -> stronger push lab -> push then flow -> name the V-I rule -> stretch to power uses -> myth bust -> fluency -> Volt Scout mastery.",
        },
        {
          type: "ul",
          items: [
            "Sorting keeps voltage and current from blending",
            "Push dial lab shows cause before flow effect",
            "The rule sentence: V pushes, I flows",
          ],
        },
      ],
    },
    {
      title: "Charger-label transfer",
      layout: "split",
      theory: ["constructivism", "dual-coding", "retrieval-practice"],
      figures: [
        {
          place: "right",
          slides: [
            {
              src: "/games/electrical-basics/assets/book/m2-cover.jpg",
              caption: "Read V on a battery or adapter.",
              alt: "Battery",
            },
            {
              src: "/games/electrical-basics/assets/book/m2-hook.jpg",
              caption: "Flow shows up as light or heat in a load.",
              alt: "Bulb load",
            },
            {
              src: "/games/electrical-basics/assets/book/m2-push.jpg",
              caption: "Sources provide push - path still required.",
              alt: "Solar panel",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "With adult help, read a charger label. Find the volt number. Say: that is push. Name current as the flow that can charge the phone through a closed path.",
        },
        {
          type: "ul",
          items: [
            "Which number is voltage?",
            "What is flowing when the phone charges?",
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
          text: "Myth: Voltage and current are the same word for 'electricity'. Better: voltage is push; current is flow.",
        },
        {
          type: "p",
          text: "Myth: Higher volts always means the device is 'stronger' in every way. Better: check ratings; mismatched push can damage a load.",
        },
        {
          type: "p",
          text: "Red words are glossary terms. Tap one to ask the tutor.",
        },
      ],
    },
    {
      title: "Volt Scout mastery",
      layout: "text",
      theory: ["retrieval-practice", "spiral-scaffold"],
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/electrical-basics/assets/book/m2-cover.jpg",
              caption: "Figure 5. Teaching anchor: push from the source, flow in the loop.",
              alt: "Battery mastery anchor",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Teach a friend in one minute: voltage pushes charge; current is the flow; a closed path lets push create flow through a load.",
        },
        {
          type: "ul",
          items: [
            "Point to V on a label",
            "Act push vs flow with hand motions",
            "Use volt and current correctly once each",
          ],
        },
      ],
    },
  ],
};

export default BOOK;
