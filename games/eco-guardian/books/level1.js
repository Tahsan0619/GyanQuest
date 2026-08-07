/**
 * Digital book - Eco Guardian Mission 1: Waste Watch (gold)
 */
export const BOOK = {
  missionIndex: 0,
  title: "Waste Watch",
  subtitle: "reduce / reuse / recycle",
  subject: "Eco Guardian / Waste Watch",
  cover: {
    title: "Waste Watch",
    art: "/games/eco-guardian/assets/book/m1-fig1.svg",
  },
  glossary: [
    { id: "recycle", term: "recycle" },
    { id: "compost", term: "compost" },
    { id: "landfill", term: "landfill" },
    { id: "reduce", term: "reduce" },
    { id: "reuse", term: "reuse" },
    { id: "organic", term: "organic" },
    { id: "plastic", term: "plastic" },
    { id: "waste", term: "waste" },
  ],
  pages: [
    {
      title: "Why sort waste?",
      layout: "text",
      figures: [
        {
          src: "/games/eco-guardian/assets/book/m1-fig1.svg",
          caption: "Figure 1. Three paths for everyday waste.",
          place: "top",
          alt: "Bins overview",
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Waste is what we throw away. Not every scrap should travel the same road. Some materials can recycle into new products. Kitchen peels can become compost. Mixed trash may end in a landfill.",
        },
        {
          type: "p",
          text: "The game sorted litter into bins. This book explains the why: reduce first, then reuse, then recycle - and use compost for organic scraps when you can.",
        },
      ],
    },
    {
      title: "The 3R order",
      layout: "text",
      blocks: [
        {
          type: "p",
          text: "Reduce means make less trash - skip a bag you do not need. Reuse means use an item again - a jar becomes a pencil cup. Recycle means process a material into something new.",
        },
        {
          type: "ul",
          items: [
            "Reduce: fewer things bought and tossed",
            "Reuse: same object, new job",
            "Recycle: material remade (paper, some plastic, metal)",
          ],
        },
      ],
    },
    {
      title: "Bin map",
      layout: "full-fig",
      figures: [
        {
          src: "/games/eco-guardian/assets/book/m1-fig2.svg",
          caption: "Figure 2. Recycle, compost, landfill - pick with care.",
          place: "full",
          alt: "Bin map",
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Clean paper and bottles often belong in recycle. Fruit peels belong in compost. Greasy packets and broken mixed trash often go to landfill - which is the last choice, not the first.",
        },
      ],
    },
    {
      title: "Mission steps to book ideas",
      layout: "text",
      blocks: [
        {
          type: "p",
          text: "Meet the bins, fill a recycle goal, sort litter, clean-up lab, explain reduce-first, name the 3R rule, stretch to local places, bust myths, fluency, mastery.",
        },
        {
          type: "p",
          text: "Each short step trained one habit. The book holds the full map so sorting feels thoughtful, not random.",
        },
      ],
    },
    {
      title: "Home and school",
      layout: "split",
      figures: [
        {
          src: "/games/eco-guardian/assets/book/m1-fig3.svg",
          caption: "Figure 3. Kitchen peels vs plastic wrap.",
          place: "right",
          alt: "Everyday waste",
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Tonight, check one trash can. Which items could reduce or reuse instead of becoming waste?",
        },
        {
          type: "p",
          text: "Separate organic peels for compost if your home or school has a bin.",
        },
      ],
    },
    {
      title: "Myths",
      layout: "text",
      blocks: [
        {
          type: "p",
          text: "Myth: All plastic recycles equally. Reality: rules differ by city - rinse and check symbols.",
        },
        {
          type: "p",
          text: "Myth: Landfill is fine forever. Reality: space and pollution costs make reduce smarter.",
        },
        {
          type: "p",
          text: "Tap any red glossary word for a simple tutor explanation.",
        },
      ],
    },
    {
      title: "Mastery",
      layout: "text",
      blocks: [
        {
          type: "p",
          text: "Explain Waste Watch in one breath: reduce first, reuse when you can, recycle the right materials, compost organic scraps, and treat landfill as last resort.",
        },
      ],
    },
  ],
};

export default BOOK;
