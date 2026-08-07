/**
 * Digital book - Human Anatomy Mission 1: Body Map
 * Theory: cognitive load, dual coding, multimedia learning, constructivism,
 * conceptual change, spiral scaffold, retrieval practice.
 * Photos: brain, heart, and body-team JPGs under assets/book/.
 */
export const BOOK = {
  missionIndex: 0,
  title: "Body Map",
  subtitle: "organs that team up",
  subject: "Human Anatomy / Body Map",
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
    title: "Body Map",
    art: "/games/human-anatomy/assets/book/m1-cover.jpg",
  },
  glossary: [
    { id: "organ", term: "organ" },
    { id: "system", term: "system" },
    { id: "brain", term: "brain" },
    { id: "heart", term: "heart" },
    { id: "lungs", term: "lungs" },
    { id: "stomach", term: "stomach" },
    { id: "teamwork", term: "teamwork" },
    { id: "pulse", term: "pulse" },
  ],
  pages: [
    {
      title: "Pulse, breath, and lunch",
      layout: "text",
      theory: ["constructivism", "dual-coding", "cognitive-load"],
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/human-anatomy/assets/book/m1-hook.jpg",
              caption: "Figure 1. Living bodies are built from cooperating parts - not one lone hero organ.",
              alt: "Cell-scale biology image",
            },
            {
              src: "/games/human-anatomy/assets/book/m1-cover.jpg",
              caption: "The brain helps plan and control - still needs heart, lungs, and stomach.",
              alt: "Human brain",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Feel your wrist pulse after a walk. Take a deep breath at school. Notice lunch digesting later. Each moment uses a different organ - and they pass jobs to each other.",
        },
        {
          type: "p",
          text: "Organs are body parts with special jobs. They team up so you can move, think, breathe, and eat.",
        },
        {
          type: "p",
          text: "Earn Body Mapper by naming at least four organs and one job for each.",
        },
      ],
    },
    {
      title: "Four teammates, four jobs",
      layout: "full-fig",
      theory: ["multimedia-learning", "dual-coding"],
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/human-anatomy/assets/book/m1-heart.jpg",
              caption: "Figure 2. Heart - the pump on the team map.",
              alt: "Heart illustration",
            },
            {
              src: "/games/human-anatomy/assets/book/m1-breath.jpg",
              caption: "Lungs bring air in - oxygen for the team.",
              alt: "Leaf as oxygen-producing nature parallel",
            },
            {
              src: "/games/human-anatomy/assets/book/m1-cover.jpg",
              caption: "Brain - control and sensing hub.",
              alt: "Human brain",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "A simple body map for this mission:",
        },
        {
          type: "ul",
          items: [
            "Heart pumps blood",
            "Lungs exchange air",
            "Brain coordinates messages",
            "Stomach starts breaking down food",
          ],
        },
      ],
    },
    {
      title: "Why teamwork beats solo",
      layout: "text",
      theory: ["cognitive-load", "dual-coding"],
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/human-anatomy/assets/book/m1-model.jpg",
              caption: "Figure 3. Close-up structures remind us: organs are made of cooperating tissues.",
              alt: "Microscope biology image",
            },
            {
              src: "/games/human-anatomy/assets/book/m1-team.jpg",
              caption: "Like plants need many parts, your body needs many organs.",
              alt: "Plant as teamwork metaphor",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "If lungs stopped, the heart would still beat for a short while - but blood would lack fresh oxygen. If the stomach stopped, energy from food would fade. Organs depend on each other.",
        },
        {
          type: "p",
          text: "Mission labs that raise 'teamwork clarity' are models of that dependence: map the links, not just the labels.",
        },
      ],
    },
    {
      title: "Map labels are models",
      layout: "full-fig",
      theory: ["multimedia-learning", "spiral-scaffold"],
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/human-anatomy/assets/book/m1-cover.jpg",
              caption: "Figure 4. Representation: a labeled organ is a map marker, not the whole story.",
              alt: "Brain as mapped organ",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Canvas outlines in the game are simplified maps. Real organs are 3D and connected by vessels and nerves - still the same team idea.",
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
          text: "Meet the organ team -> map clarity lab -> sort organ / support / not -> teamwork lab -> why organs team -> name the body rule -> stretch to daily body -> myth bust -> fluency -> Body Mapper mastery.",
        },
        {
          type: "ul",
          items: [
            "Sorting keeps organs separate from non-organs",
            "Teamwork lab shows jobs linking together",
            "The rule sentence: organs team up to keep you alive and active",
          ],
        },
      ],
    },
    {
      title: "Daily-body transfer",
      layout: "split",
      theory: ["constructivism", "dual-coding", "retrieval-practice"],
      figures: [
        {
          place: "right",
          slides: [
            {
              src: "/games/human-anatomy/assets/book/m1-heart.jpg",
              caption: "Pulse check - heart at work.",
              alt: "Heart",
            },
            {
              src: "/games/human-anatomy/assets/book/m1-breath.jpg",
              caption: "Deep breath - lungs at work.",
              alt: "Breathing parallel image",
            },
            {
              src: "/games/human-anatomy/assets/book/m1-cover.jpg",
              caption: "Focus on a lesson - brain at work.",
              alt: "Brain",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "After running, feel your pulse and notice faster breathing. After a meal, give the stomach quiet time. Name which organs teamed up.",
        },
        {
          type: "ul",
          items: [
            "Which organ did you feel?",
            "Which organ helped next?",
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
          text: "Myth: Only the brain matters for thinking and the rest is luggage. Better: brain needs oxygen from lungs and fuel from digestion.",
        },
        {
          type: "p",
          text: "Myth: Organs work alone in separate rooms. Better: systems share blood, air, and messages every second.",
        },
        {
          type: "p",
          text: "Red words are glossary terms. Tap one to ask the tutor.",
        },
      ],
    },
    {
      title: "Body Mapper mastery",
      layout: "text",
      theory: ["retrieval-practice", "spiral-scaffold"],
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/human-anatomy/assets/book/m1-heart.jpg",
              caption: "Figure 5. Teaching anchor: map organs, then name their teamwork.",
              alt: "Heart mastery anchor",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Teach a friend in one minute: heart, lungs, brain, and stomach are organs with jobs; they team up so you can live, learn, and move.",
        },
        {
          type: "ul",
          items: [
            "Point to four organs on a sketch",
            "Give each organ one job",
            "Use the word organ correctly once",
          ],
        },
      ],
    },
  ],
};

export default BOOK;
