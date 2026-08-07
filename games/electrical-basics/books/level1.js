/**
 * Digital book - Electrical Basics Mission 1: Circuit Loop
 * Theory: cognitive load, dual coding, multimedia learning, constructivism,
 * conceptual change, spiral scaffold, retrieval practice.
 * Photos: bulb, battery, and circuit JPGs under assets/book/.
 */
export const BOOK = {
  missionIndex: 0,
  title: "Circuit Loop",
  subtitle: "closed path lights the bulb",
  subject: "Electrical Basics / Circuit Loop",
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
    title: "Circuit Loop",
    art: "/games/electrical-basics/assets/book/m1-cover.jpg",
  },
  glossary: [
    { id: "circuit", term: "circuit" },
    { id: "closed-loop", term: "closed loop" },
    { id: "battery", term: "battery" },
    { id: "wire", term: "wire" },
    { id: "switch", term: "switch" },
    { id: "bulb", term: "bulb" },
    { id: "current", term: "current" },
    { id: "open-circuit", term: "open circuit" },
  ],
  pages: [
    {
      title: "Torch switch, room light, lab kit",
      layout: "text",
      theory: ["constructivism", "dual-coding", "cognitive-load"],
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/electrical-basics/assets/book/m1-hook.jpg",
              caption: "Figure 1. Paths on a board only work when the loop is complete.",
              alt: "Circuit board traces",
            },
            {
              src: "/games/electrical-basics/assets/book/m1-cover.jpg",
              caption: "A bulb lights when charge can travel a full loop.",
              alt: "Incandescent light bulb",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "A torch lights when you close the switch. A room light needs the wall path intact. A school lab kit fails if one clip is loose - the loop is open.",
        },
        {
          type: "p",
          text: "Current needs a closed loop: battery, wires, switch, and bulb connected so charge can leave one battery end and return to the other.",
        },
        {
          type: "p",
          text: "Earn Loop Learner by fixing open paths before guessing the bulb is 'broken'.",
        },
      ],
    },
    {
      title: "Battery, wire, switch, bulb",
      layout: "full-fig",
      theory: ["multimedia-learning", "dual-coding"],
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/electrical-basics/assets/book/m1-model.jpg",
              caption: "Figure 2. Model parts: energy source (battery) plus a complete path.",
              alt: "Battery",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Name the four common parts in this mission:",
        },
        {
          type: "ul",
          items: [
            "Battery - energy source",
            "Wires - path for current",
            "Switch - opens or closes the path",
            "Bulb - load that lights when current flows",
          ],
        },
      ],
    },
    {
      title: "Open path, dark bulb",
      layout: "text",
      theory: ["cognitive-load", "dual-coding"],
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/electrical-basics/assets/book/m1-path.jpg",
              caption: "Figure 3. Tiny paths still need continuity - a break stops the loop.",
              alt: "Integrated circuit paths",
            },
            {
              src: "/games/electrical-basics/assets/book/m1-source.jpg",
              caption: "A source alone is not enough without a closed return path.",
              alt: "Solar panel as energy source example",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "An open circuit has a gap. Charge cannot complete the trip, so the bulb stays dark even if the battery is fresh.",
        },
        {
          type: "p",
          text: "Brighter-loop labs in the mission close gaps and tighten connections so current can flow.",
        },
      ],
    },
    {
      title: "Draw the loop, then build it",
      layout: "full-fig",
      theory: ["multimedia-learning", "spiral-scaffold"],
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/electrical-basics/assets/book/m1-cover.jpg",
              caption: "Figure 4. Representation: lit bulb means the drawn loop is closed in real wires.",
              alt: "Lit bulb",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Canvas wires are models. Real clips and switches obey the same rule: no closed path, no light.",
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
          text: "Meet the loop -> close the path lab -> sort loop parts -> brighter loop lab -> why the bulb lights -> name the loop rule -> stretch to places -> myth bust -> fluency -> Loop Learner mastery.",
        },
        {
          type: "ul",
          items: [
            "Sorting names battery, wire, switch, bulb",
            "Close-the-path lab makes darkness mean 'gap'",
            "The rule sentence: a closed path lights the bulb",
          ],
        },
      ],
    },
    {
      title: "Home and kit transfer",
      layout: "split",
      theory: ["constructivism", "dual-coding", "retrieval-practice"],
      figures: [
        {
          place: "right",
          slides: [
            {
              src: "/games/electrical-basics/assets/book/m1-cover.jpg",
              caption: "Torch bulb - check the switch path.",
              alt: "Bulb",
            },
            {
              src: "/games/electrical-basics/assets/book/m1-model.jpg",
              caption: "Fresh cells still need a loop.",
              alt: "Battery",
            },
            {
              src: "/games/electrical-basics/assets/book/m1-hook.jpg",
              caption: "Follow the path with your finger.",
              alt: "Circuit traces",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "With adult help, open a torch. Trace battery to switch to bulb and back. Open the switch and predict darkness.",
        },
        {
          type: "ul",
          items: [
            "Where is the gap when it is off?",
            "What closes to turn it on?",
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
          text: "Myth: Electricity stops at the bulb and disappears. Better: current needs a return path to the battery.",
        },
        {
          type: "p",
          text: "Myth: Any wire near a battery lights a bulb. Better: parts must form one closed loop.",
        },
        {
          type: "p",
          text: "Red words are glossary terms. Tap one to ask the tutor.",
        },
      ],
    },
    {
      title: "Loop Learner mastery",
      layout: "text",
      theory: ["retrieval-practice", "spiral-scaffold"],
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/electrical-basics/assets/book/m1-cover.jpg",
              caption: "Figure 5. Teaching anchor: closed loop, lit bulb.",
              alt: "Bulb mastery anchor",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Teach a friend in one minute: battery, wires, switch, and bulb must form a closed loop; an open gap means no current and no light.",
        },
        {
          type: "ul",
          items: [
            "Sketch a closed loop and an open loop",
            "Point to the switch as a controlled gap",
            "Use the word circuit correctly once",
          ],
        },
      ],
    },
  ],
};

export default BOOK;
