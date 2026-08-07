/**
 * Digital book - Eco Guardian Mission 1: Waste Watch
 * Theory: cognitive load, dual coding, multimedia learning, constructivism,
 * conceptual change, spiral scaffold, retrieval practice.
 * Photos: forest, river, plant, and Earth JPGs under assets/book/.
 */
export const BOOK = {
  missionIndex: 0,
  title: "Waste Watch",
  subtitle: "reduce, reuse, recycle",
  subject: "Eco Guardian / Waste Watch",
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
    title: "Waste Watch",
    art: "/games/eco-guardian/assets/book/m1-cover.jpg",
  },
  glossary: [
    { id: "reduce", term: "reduce" },
    { id: "reuse", term: "reuse" },
    { id: "recycle", term: "recycle" },
    { id: "compost", term: "compost" },
    { id: "landfill", term: "landfill" },
    { id: "waste", term: "waste" },
    { id: "sort", term: "sort" },
    { id: "plastic", term: "plastic" },
  ],
  pages: [
    {
      title: "Kitchen peels, school paper, market bags",
      layout: "text",
      theory: ["constructivism", "dual-coding", "cognitive-load"],
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/eco-guardian/assets/book/m1-hook.jpg",
              caption: "Figure 1. Rivers and streets feel every bag that escapes a bin.",
              alt: "Amazon River landscape",
            },
            {
              src: "/games/eco-guardian/assets/book/m1-cover.jpg",
              caption: "Healthy green cover needs less waste dumped carelessly.",
              alt: "Forest from space",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Kitchen peels can become compost. School paper can often be recycled. Market plastic bags clog drains if they blow away - reduce them first when you can.",
        },
        {
          type: "p",
          text: "Waste Watch means sorting smart: recycle what belongs there, compost food scraps when possible, and send only true leftovers to landfill.",
        },
        {
          type: "p",
          text: "Earn Waste Watcher by putting reduce before the other Rs.",
        },
      ],
    },
    {
      title: "Three bins, one priority order",
      layout: "full-fig",
      theory: ["multimedia-learning", "dual-coding"],
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/eco-guardian/assets/book/m1-model.jpg",
              caption: "Figure 2. Model: living systems prefer less trash in the first place.",
              alt: "Sunflower - living system",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "The 3R order matters:",
        },
        {
          type: "ul",
          items: [
            "Reduce - make less waste (skip the bag if you have a tote)",
            "Reuse - use again before throwing (jar, notebook back)",
            "Recycle - remake materials when reuse is done",
          ],
        },
      ],
    },
    {
      title: "Why reduce comes first",
      layout: "text",
      theory: ["cognitive-load", "dual-coding"],
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/eco-guardian/assets/book/m1-ocean.jpg",
              caption: "Figure 3. Plastic that reaches water is hard to pull back - prevention wins.",
              alt: "Ocean surface",
            },
            {
              src: "/games/eco-guardian/assets/book/m1-compost.jpg",
              caption: "Peels and leaves can return nutrients as compost instead of landfill.",
              alt: "Leaf for compost idea",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Recycling helps, but it still uses collection trucks and energy. If you never took the plastic bag, there is nothing to haul.",
        },
        {
          type: "p",
          text: "Mission clean-up labs fill a recycle goal on purpose - then the book reminds you: sorting is step two; reducing is step one.",
        },
      ],
    },
    {
      title: "Sort: recycle, compost, landfill",
      layout: "full-fig",
      theory: ["multimedia-learning", "spiral-scaffold"],
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/eco-guardian/assets/book/m1-plant.jpg",
              caption: "Figure 4. Representation: green waste can feed plants via compost.",
              alt: "Plant",
            },
            {
              src: "/games/eco-guardian/assets/book/m1-earth.jpg",
              caption: "Earth's thin living layer is where our trash decisions land.",
              alt: "Earth atmosphere view",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Canvas bins are models. Real streets need the same sort: paper and clean bottles to recycle; peels to compost; dirty mixed trash to landfill.",
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
          text: "Meet the bins -> fill recycle goal -> sort the litter -> clean-up lab -> why reduce first -> name the 3R rule -> stretch to BD places -> myth bust -> fluency -> Waste Watcher mastery.",
        },
        {
          type: "ul",
          items: [
            "Sorting trains recycle vs compost vs landfill",
            "Clean-up lab makes the habit active",
            "The rule sentence: reduce first, then reuse, then recycle",
          ],
        },
      ],
    },
    {
      title: "Home and school transfer",
      layout: "split",
      theory: ["constructivism", "dual-coding", "retrieval-practice"],
      figures: [
        {
          place: "right",
          slides: [
            {
              src: "/games/eco-guardian/assets/book/m1-hook.jpg",
              caption: "Keep bags out of waterways.",
              alt: "River",
            },
            {
              src: "/games/eco-guardian/assets/book/m1-compost.jpg",
              caption: "Kitchen peels -> compost when you can.",
              alt: "Leaf compost cue",
            },
            {
              src: "/games/eco-guardian/assets/book/m1-cover.jpg",
              caption: "Protect green cover by making less trash.",
              alt: "Forest from space",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Pick three items near you: a peel, a notebook page, a plastic wrapper. Say reduce, reuse, recycle, compost, or landfill for each.",
        },
        {
          type: "ul",
          items: [
            "Which item could you refuse next time?",
            "Which item has a second life already?",
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
          text: "Myth: Recycling fixes everything, so buy and toss freely. Better: reduce first; recycling is helpful, not magic.",
        },
        {
          type: "p",
          text: "Myth: All trash is the same. Better: peels, paper, and plastic need different homes.",
        },
        {
          type: "p",
          text: "Red words are glossary terms. Tap one to ask the tutor.",
        },
      ],
    },
    {
      title: "Waste Watcher mastery",
      layout: "text",
      theory: ["retrieval-practice", "spiral-scaffold"],
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/eco-guardian/assets/book/m1-cover.jpg",
              caption: "Figure 5. Teaching anchor: less waste, smarter bins, greener cover.",
              alt: "Forest teaching anchor",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Teach a friend in one minute: reduce makes less trash; reuse gives items another life; recycle remakes materials; compost feeds soil; landfill is last.",
        },
        {
          type: "ul",
          items: [
            "Sort three real items correctly",
            "Name why reduce is first",
            "Use the word compost correctly once",
          ],
        },
      ],
    },
  ],
};

export default BOOK;
