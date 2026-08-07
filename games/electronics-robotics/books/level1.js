/**
 * Digital book - Electronics & Robotics Mission 1: Sensor Bot
 * Theory: cognitive load, dual coding, multimedia learning, constructivism,
 * conceptual change, spiral scaffold, retrieval practice.
 * Photos: assets/book-shared electrical / ai_data themes (see assets/book/CREDITS-m1.json).
 */
export const BOOK = {
  missionIndex: 0,
  title: "Sensor Bot",
  subtitle: "sense act",
  subject: "Electronics Robotics / Sensor Bot",
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
    title: "Sensor Bot",
    art: "/games/electronics-robotics/assets/book/m1-cover.jpg",
  },
  glossary: [
    { id: "sensor", term: "sensor" },
    { id: "actuator", term: "actuator" },
    { id: "loop", term: "loop" },
    { id: "input", term: "input" },
    { id: "output", term: "output" },
    { id: "decide", term: "decide" },
    { id: "motor", term: "motor" },
    { id: "signal", term: "signal" },
  ],
  pages: [
    {
      title: "Sense, decide, act",
      layout: "text",
      theory: ["constructivism", "dual-coding", "cognitive-load"],
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/electronics-robotics/assets/book/m1-cover.jpg",
              caption: "Figure 1. A robot body is useless without a loop that listens and responds.",
              alt: "Robot system",
            },
            {
              src: "/games/electronics-robotics/assets/book/m1-hook.jpg",
              caption: "Arms and motors are actuators - they do the acting after a decision.",
              alt: "Robotic arm actuator",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Sensors sense the world. Code decides what that reading means. Actuators act - motors, doors, lights.",
        },
        {
          type: "p",
          text: "That loop is the whole robot trick: sense -> decide -> act -> sense again.",
        },
        {
          type: "p",
          text: "Line followers, bump-and-turn toys, and auto doors all run the same spine with different sensors and actuators.",
        },
      ],
    },
    {
      title: "Energy that becomes motion",
      layout: "full-fig",
      theory: ["multimedia-learning", "dual-coding"],
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/electronics-robotics/assets/book/m1-model.webp",
              caption: "Figure 2. Controlled energy - robots turn power into timed action, not random sparks.",
              alt: "Controlled flame as energy metaphor",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "A sensor reading is just a signal until a rule maps it to an output. Bright line? Steer. Bumper hit? Reverse and turn.",
        },
        {
          type: "ul",
          items: [
            "Sensor = input",
            "Program rule = decide",
            "Motor or door = actuator output",
          ],
        },
      ],
    },
    {
      title: "Why the bot moves",
      layout: "text",
      theory: ["cognitive-load", "dual-coding"],
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/electronics-robotics/assets/book/m1-mechanism.jpg",
              caption: "Figure 3. Combustion and motors differ, yet both show energy driving change.",
              alt: "Combustion energy image",
            },
            {
              src: "/games/electronics-robotics/assets/book/m1-detail.jpg",
              caption: "Metal parts wear - loops must stay simple and testable.",
              alt: "Metal surface detail",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "If the sensor is wrong, the decide step will look smart and still fail. Test inputs before blaming the motor.",
        },
        {
          type: "p",
          text: "Auto doors sense presence, decide open/close, then act with a motor. Same loop as a classroom line follower.",
        },
      ],
    },
    {
      title: "Wear, tear, and tough loops",
      layout: "full-fig",
      theory: ["multimedia-learning", "spiral-scaffold"],
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/electronics-robotics/assets/book/m1-transfer.jpg",
              caption: "Figure 4. Real hardware ages - clean sense-act rules make debugging possible.",
              alt: "Weathered metal",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Fancy bodies impress. Reliable loops win: clear sensors, clear rules, actuators that match the job.",
        },
      ],
    },
    {
      title: "Bot Builder mission spine",
      layout: "text",
      theory: ["spiral-scaffold", "cognitive-load"],
      blocks: [
        {
          type: "p",
          text: "You met Sensor Bot, dialed the loop, sorted sense/decide/act cards, strengthened the loop, and named why the bot moves.",
        },
        {
          type: "ul",
          items: [
            "Sort keeps the three roles from blurring",
            "Stronger loop lab shows delayed or noisy sensors",
            "Rule lock: sensors sense, code decides, actuators act",
          ],
        },
        {
          type: "p",
          text: "Canvas steps stayed short. The book holds the full loop.",
        },
      ],
    },
    {
      title: "Follower, bumper, door",
      layout: "split",
      theory: ["constructivism", "dual-coding", "retrieval-practice"],
      figures: [
        {
          place: "right",
          slides: [
            {
              src: "/games/electronics-robotics/assets/book/m1-cover.jpg",
              caption: "Line follower - light sensor in, steering out.",
              alt: "Robot for line following",
            },
            {
              src: "/games/electronics-robotics/assets/book/m1-hook.jpg",
              caption: "Bump-and-turn - contact sensor, then motor plan.",
              alt: "Robotic arm motion",
            },
            {
              src: "/games/electronics-robotics/assets/book/m1-model.webp",
              caption: "Auto door - presence sense, open act.",
              alt: "Energy for actuators",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "For each example, name the sensor, the decide rule, and the actuator in one breath.",
        },
        {
          type: "ul",
          items: [
            "What is sensed?",
            "What rule decides?",
            "What part acts?",
          ],
        },
      ],
    },
    {
      title: "Robot myths",
      layout: "text",
      theory: ["conceptual-change"],
      blocks: [
        {
          type: "p",
          text: "Myth: Robots understand like people. Better: they follow sense-decide-act loops from sensors and code.",
        },
        {
          type: "p",
          text: "Myth: More motors mean smarter. Better: better sensing and clearer rules beat extra thrashing.",
        },
        {
          type: "p",
          text: "Myth: If it moves, the sensor must be fine. Better: wrong input can still produce motion - test the signal.",
        },
        {
          type: "p",
          text: "Tap red terms like sensor or actuator to ask the tutor.",
        },
      ],
    },
    {
      title: "Bot Builder mastery",
      layout: "text",
      theory: ["retrieval-practice", "spiral-scaffold"],
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/electronics-robotics/assets/book/m1-cover.jpg",
              caption: "Figure 5. Teach the loop with one robot picture.",
              alt: "Robot as sense-act anchor",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Teach in one minute: sensors sense, code decides, actuators act; line followers and auto doors share that loop.",
        },
        {
          type: "ul",
          items: [
            "Draw the three-box loop",
            "Point to a real auto door",
            "Use the word actuator correctly once",
          ],
        },
      ],
    },
  ],
};

export default BOOK;
