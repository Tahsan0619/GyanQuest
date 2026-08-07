/**
 * Digital book - Force Fighter Mission 1: The Lazy Rock
 * Unique curriculum book (inertia / Newton 1). Not a template fill-in.
 */
export const BOOK = {
  missionIndex: 0,
  title: "The Lazy Rock",
  subtitle: "inertia - things keep doing what they are doing",
  subject: "Force Fighter / The Lazy Rock",
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
    title: "The Lazy Rock",
    art: "/games/force-fighter/assets/book/m1-cover.jpg",
  },
  glossary: [
    { id: "inertia", term: "inertia" },
    { id: "force", term: "force" },
    { id: "push", term: "push" },
    { id: "pull", term: "pull" },
    { id: "motion", term: "motion" },
    { id: "rest", term: "rest" },
    { id: "friction", term: "friction" },
  ],
  pages: [
    {
      title: "A rock that will not wake",
      layout: "text",
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/force-fighter/assets/book/m1-cover.jpg",
              caption: "Motion keeps going until a force changes it - like a rider coasting on a board.",
              alt: "Person skateboarding",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Things stay still until something pushes or pulls them. Wake a sleepy rock - just like pushing a door open!",
        },
        {
          type: "p",
          text: "That stubborn 'keep doing what I was doing' feeling is called inertia. A football on the grass does not roll until a kick gives it a push.",
        },
        {
          type: "p",
          text: "Everyday hooks: pushing a door, kicking a football, shoving a shopping trolley. Same rule each time.",
        },
      ],
    },
    {
      title: "Newton's first idea",
      layout: "full-fig",
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/force-fighter/assets/book/m1-model.webp",
              caption: "Newton's cradle - balls transfer a push through the line. Motion does not appear from nowhere.",
              alt: "Newton cradle demonstration",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "At rest stays at rest. In motion stays in motion - unless a net force acts. That is the heart of Newton 1.",
        },
        {
          type: "ul",
          items: [
            "No push or pull? The rock keeps sleeping.",
            "A push starts motion.",
            "Another force (wall, friction, hand) can slow or stop it.",
          ],
        },
      ],
    },
    {
      title: "Why coasting ends",
      layout: "text",
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/force-fighter/assets/book/m1-mechanism.jpg",
              caption: "Surfaces and surroundings apply hidden forces - nothing 'runs out of push' by magic.",
              alt: "Changing ice surface",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "In the mission you coasted, then hit a wall. The wall applied a force. Floor friction also nibbles speed every second.",
        },
        {
          type: "p",
          text: "Myth preview: objects do not 'get tired.' Forces change their motion.",
        },
      ],
    },
    {
      title: "See the rule in the lab",
      layout: "full-fig",
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/force-fighter/assets/book/m1-hook.jpg",
              caption: "Same inertia on a board: start with a push, keep moving, stop when forces act.",
              alt: "Skateboard motion",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Models on the canvas (rock, door, trolley) are stories for the same rule. Point to the force that starts motion and the force that ends it.",
        },
      ],
    },
    {
      title: "How the 10 steps build inertia",
      layout: "text",
      blocks: [
        {
          type: "p",
          text: "Meet the rock → coast & glide → sort force vs not → wall hit → why it coasts → name the rule → stretch → myth bust → fluency → Rock Rookie mastery.",
        },
        {
          type: "ul",
          items: [
            "Sorting trains you to spot real pushes and pulls",
            "Wall lab makes the 'change of motion' feel obvious",
            "The rule sentence locks Newton 1 in words",
          ],
        },
      ],
    },
    {
      title: "Door, ball, trolley",
      layout: "split",
      figures: [
        {
          place: "right",
          slides: [
            {
              src: "/games/force-fighter/assets/book/m1-cover.jpg",
              caption: "Coast like a board - inertia in motion.",
              alt: "Skateboard",
            },
            {
              src: "/games/force-fighter/assets/book/m1-model.webp",
              caption: "Cradle clicks - pushes travel as forces.",
              alt: "Newton cradle",
            },
            {
              src: "/games/force-fighter/assets/book/m1-mechanism.jpg",
              caption: "Surfaces change how long motion lasts.",
              alt: "Surface change",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Try at home: open a door slowly, then give a football a gentle kick. Ask what force started each motion.",
        },
        {
          type: "ul",
          items: [
            "What was at rest before?",
            "What force woke it?",
            "What force finally stopped it?",
          ],
        },
      ],
    },
    {
      title: "Inertia myths",
      layout: "text",
      blocks: [
        {
          type: "p",
          text: "Myth: Moving things stop because they run out of force. Better: unbalanced forces (often friction) slow them.",
        },
        {
          type: "p",
          text: "Myth: Heavy things have more inertia so they 'want' to fall faster. Better: inertia resists changes in motion; falling is about gravity and other forces.",
        },
        {
          type: "p",
          text: "Tap red glossary words if you want a tutor root explanation.",
        },
      ],
    },
    {
      title: "Rock Rookie check",
      layout: "text",
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/force-fighter/assets/book/m1-model.webp",
              caption: "Teach with this picture: no mystery motion - only forces changing motion.",
              alt: "Newton cradle teaching anchor",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "In one minute, teach a friend: inertia means stay-as-you-were until a net force acts. Give door, football, and trolley as examples.",
        },
        {
          type: "ul",
          items: [
            "Say Newton 1 in your own words",
            "Point to one push and one stopping force nearby",
            "Bust the 'ran out of force' myth once",
          ],
        },
      ],
    },
  ],
};

export default BOOK;
