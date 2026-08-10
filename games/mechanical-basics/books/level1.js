/**
 * Digital book - Mechanical Basics Mission 1: Simple Machines
 * Unique curriculum book (lever, pulley, wheel, incline). Not a template fill-in.
 */
export const BOOK = {
  missionIndex: 0,
  title: "Simple Machines",
  subtitle: "trade force and distance to get work done",
  subject: "Mechanical Basics / Simple Machines",
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
    title: "Simple Machines",
    art: "/games/mechanical-basics/assets/book/m1-cover.jpg",
  },
  glossary: [
    { id: "lever", term: "lever" },
    { id: "fulcrum", term: "fulcrum" },
    { id: "pulley", term: "pulley" },
    { id: "inclined-plane", term: "inclined plane" },
    { id: "wheel-axle", term: "wheel and axle" },
    { id: "mechanical-advantage", term: "mechanical advantage" },
    { id: "load", term: "load" },
  ],
  pages: [
    {
      title: "Machines that multiply effort",
      layout: "text",
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/mechanical-basics/assets/book/m1-cover.jpg",
              caption: "Figure 1. Gears and simple machines change how force is applied - they do not erase work.",
              alt: "Gear mechanism",
            },
            {
              src: "/games/mechanical-basics/assets/book/m1-lever.jpg",
              caption: "A playground seesaw is a lever with a fulcrum in the middle.",
              alt: "Seesaw lever",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "A load is what you want to move. Simple machines help you move it by trading larger distance for smaller force - or the reverse.",
        },
        {
          type: "p",
          text: "Mechanical advantage is how much the machine multiplies your effort force (ideally, ignoring friction).",
        },
      ],
    },
    {
      title: "Levers and fulcrums",
      layout: "full-fig",
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/mechanical-basics/assets/book/m1-lever.jpg",
              caption: "Figure 2. Move the fulcrum and the same lever feels easier or harder.",
              alt: "Lever and fulcrum",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "A lever is a rigid bar that turns on a fulcrum. Crowbars, scissors, and bottle openers are lever cousins.",
        },
      ],
    },
    {
      title: "Pulleys and ramps",
      layout: "text",
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/mechanical-basics/assets/book/m1-pulley.jpg",
              caption: "Figure 3. A pulley changes force direction - and combined pulleys can share the load.",
              alt: "Pulley system",
            },
            {
              src: "/games/mechanical-basics/assets/book/m1-inclined.jpg",
              caption: "An inclined plane spreads lifting over a longer path.",
              alt: "Ramp inclined plane",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Ramps are inclined planes. You push a longer distance so each step of force can be smaller.",
        },
        {
          type: "p",
          text: "A wheel and axle lets a small force at the rim create useful turning at the center - think steering wheels and doorknobs.",
        },
      ],
    },
    {
      title: "Work is not free",
      layout: "full-fig",
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/mechanical-basics/assets/book/m1-wheel.jpg",
              caption: "Figure 4. Wheels reduce grinding friction so more of your effort moves the load forward.",
              alt: "Wheel and axle",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Machines redistribute effort. Friction still steals some energy as heat - real life is never perfect.",
        },
      ],
    },
    {
      title: "How the mission connects",
      layout: "text",
      blocks: [
        {
          type: "p",
          text: "Meet machines → place fulcrums → lift with pulley/ramp → lab tradeoffs → explain → rule → stretch → myth → fluency → mastery.",
        },
        {
          type: "ul",
          items: [
            "Moving a fulcrum shows mechanical advantage changing",
            "Ramp labs make the distance trade obvious",
            "The rule sentence is 'trade force against distance'",
          ],
        },
      ],
    },
    {
      title: "Yard lab",
      layout: "split",
      figures: [
        {
          place: "right",
          slides: [
            {
              src: "/games/mechanical-basics/assets/book/m1-lever.jpg",
              caption: "Find a lever at home.",
              alt: "Lever",
            },
            {
              src: "/games/mechanical-basics/assets/book/m1-inclined.jpg",
              caption: "Spot an inclined plane.",
              alt: "Ramp",
            },
            {
              src: "/games/mechanical-basics/assets/book/m1-pulley.jpg",
              caption: "Sketch a pulley lift.",
              alt: "Pulley",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Name three tools around you and label each as lever, pulley, wheel and axle, or inclined plane.",
        },
        {
          type: "ul",
          items: [
            "Where is the fulcrum?",
            "What is the load?",
            "Did you gain mechanical advantage?",
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
          text: "Myth: Machines create energy. Better: they rearrange force and distance; work still costs effort.",
        },
        {
          type: "p",
          text: "Myth: A longer ramp is cheating. Better: you pay with distance to reduce force.",
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
              src: "/games/mechanical-basics/assets/book/m1-cover.jpg",
              caption: "Figure 5. Teach simple machines as honest force-distance trades.",
              alt: "Simple machines mastery",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Teach a friend in one minute: levers need a fulcrum; ramps and pulleys help lift; mechanical advantage is the trade.",
        },
        {
          type: "ul",
          items: [
            "Sketch a lever with load and fulcrum",
            "Give one inclined plane example",
            "Use the word pulley correctly once",
          ],
        },
      ],
    },
  ],
};

export default BOOK;
