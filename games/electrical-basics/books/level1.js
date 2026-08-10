/**
 * Digital book - Electrical Basics Mission 1: Circuit Flow
 * Unique curriculum book (voltage, current, resistance). Not a template fill-in.
 */
export const BOOK = {
  missionIndex: 0,
  title: "Circuit Flow",
  subtitle: "why a bulb needs a complete path",
  subject: "Electrical Basics / Circuit Flow",
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
    title: "Circuit Flow",
    art: "/games/electrical-basics/assets/book/m1-cover.jpg",
  },
  glossary: [
    { id: "circuit", term: "circuit" },
    { id: "current", term: "current" },
    { id: "voltage", term: "voltage" },
    { id: "resistance", term: "resistance" },
    { id: "conductor", term: "conductor" },
    { id: "insulator", term: "insulator" },
    { id: "switch", term: "switch" },
  ],
  pages: [
    {
      title: "A loop or nothing",
      layout: "text",
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/electrical-basics/assets/book/m1-cover.jpg",
              caption: "Figure 1. A breadboard circuit only works when the path closes from source through the load and back.",
              alt: "Breadboard LED circuit",
            },
            {
              src: "/games/electrical-basics/assets/book/m1-switch.jpg",
              caption: "A wall switch opens or closes the loop on purpose.",
              alt: "Light switch",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "A circuit is a closed path that lets electric charge move. Break the path and useful work stops.",
        },
        {
          type: "p",
          text: "Everyday hook: a flashlight dies not only from empty cells - a loose spring can open the circuit too.",
        },
      ],
    },
    {
      title: "Voltage and current",
      layout: "full-fig",
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/electrical-basics/assets/book/m1-voltage.jpg",
              caption: "Figure 2. Batteries provide voltage - the push that can drive charge around a circuit.",
              alt: "Batteries",
            },
            {
              src: "/games/electrical-basics/assets/book/m1-current.jpg",
              caption: "Current is the flow of charge through a conductor like copper wire.",
              alt: "Copper wire conductor",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "ul",
          items: [
            "Voltage: electric push (pressure-like idea)",
            "Current: how much charge flows per time",
            "Conductor: material that lets charge move easily",
          ],
        },
      ],
    },
    {
      title: "Resistance slows the flow",
      layout: "text",
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/electrical-basics/assets/book/m1-resistance.jpg",
              caption: "Figure 3. A resistor adds resistance so current stays in a safe, useful range.",
              alt: "Resistor component",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Resistance opposes current. Insulators have very high resistance so charge barely flows through them.",
        },
        {
          type: "p",
          text: "Ohm's useful idea: more voltage tends to raise current; more resistance tends to lower it.",
        },
      ],
    },
    {
      title: "Switches decide",
      layout: "full-fig",
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/electrical-basics/assets/book/m1-switch.jpg",
              caption: "Figure 4. Open switch = open circuit. Closed switch = path ready for current.",
              alt: "Switch controlling a circuit",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Safety first: never probe mains electricity. Learn on battery labs and diagrams.",
        },
      ],
    },
    {
      title: "How the mission connects",
      layout: "text",
      blocks: [
        {
          type: "p",
          text: "Meet the loop → add a load → measure ideas → switch lab → explain → rule → stretch → myth → fluency → mastery.",
        },
        {
          type: "ul",
          items: [
            "Building a loop beats memorizing words alone",
            "Switch labs prove open vs closed",
            "The rule sentence is 'closed path + push + limited resistance'",
          ],
        },
      ],
    },
    {
      title: "Battery lab",
      layout: "split",
      figures: [
        {
          place: "right",
          slides: [
            {
              src: "/games/electrical-basics/assets/book/m1-voltage.jpg",
              caption: "Name the voltage source.",
              alt: "Battery",
            },
            {
              src: "/games/electrical-basics/assets/book/m1-resistance.jpg",
              caption: "Point to resistance.",
              alt: "Resistor",
            },
            {
              src: "/games/electrical-basics/assets/book/m1-cover.jpg",
              caption: "Trace the full circuit.",
              alt: "Full circuit",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "On paper, draw battery, switch, bulb, wires. Mark where current would stop if the switch opens.",
        },
        {
          type: "ul",
          items: [
            "Where is the conductor path?",
            "What provides voltage?",
            "What adds resistance on purpose?",
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
          text: "Myth: Voltage is stuff that flows. Better: current flows; voltage is the push that can cause flow.",
        },
        {
          type: "p",
          text: "Myth: Electricity stops in the bulb and disappears. Better: charge moves around the whole circuit.",
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
              src: "/games/electrical-basics/assets/book/m1-cover.jpg",
              caption: "Figure 5. Teach circuits as closed paths with push, flow, and resistance.",
              alt: "Circuit mastery anchor",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Teach a friend in one minute: circuits need a closed path; voltage pushes; current flows; resistance limits.",
        },
        {
          type: "ul",
          items: [
            "Draw one open and one closed circuit",
            "Name a conductor and an insulator",
            "Use the word switch correctly once",
          ],
        },
      ],
    },
  ],
};

export default BOOK;
