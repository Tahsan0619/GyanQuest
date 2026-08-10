/**
 * Digital book - Networking Internet Mission 1: Packets Across Town
 * Unique curriculum book (IP, DNS, routes). Not a template fill-in.
 */
export const BOOK = {
  missionIndex: 0,
  title: "Packets Across Town",
  subtitle: "addresses, names, and paths on the internet",
  subject: "Networking Internet / Packets Across Town",
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
    title: "Packets Across Town",
    art: "/games/networking-internet/assets/book/m1-cover.jpg",
  },
  glossary: [
    { id: "ip-address", term: "IP address" },
    { id: "dns", term: "DNS" },
    { id: "packet", term: "packet" },
    { id: "router", term: "router" },
    { id: "latency", term: "latency" },
    { id: "bandwidth", term: "bandwidth" },
    { id: "hop", term: "hop" },
  ],
  pages: [
    {
      title: "Names and numbers",
      layout: "text",
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/networking-internet/assets/book/m1-cover.jpg",
              caption: "Figure 1. The internet delivers packets between machines that have addresses.",
              alt: "Internet networking concept",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "An IP address is a numeric label for a device on a network - like a house number for data.",
        },
        {
          type: "p",
          text: "DNS translates human names (example.com) into IP addresses machines can route toward.",
        },
      ],
    },
    {
      title: "Hops along the way",
      layout: "full-fig",
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/networking-internet/assets/book/m1-hook.jpg",
              caption: "Figure 2. Each router hop forwards a packet closer to its destination.",
              alt: "Router hop path",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "A packet is a labeled chunk of data. Routers read the address and send it on the next hop.",
        },
        {
          type: "ul",
          items: [
            "Latency: delay along the path",
            "Bandwidth: how much can flow per time",
            "Many hops can raise latency even on a 'fast' link",
          ],
        },
      ],
    },
    {
      title: "How the mission connects",
      layout: "text",
      blocks: [
        {
          type: "p",
          text: "Meet addresses → resolve DNS → follow hops → lag lab → explain → rule → stretch → myth → fluency → mastery.",
        },
      ],
    },
    {
      title: "Trace lab",
      layout: "split",
      figures: [
        {
          place: "right",
          slides: [
            {
              src: "/games/networking-internet/assets/book/m1-model.jpg",
              caption: "Sketch client → DNS → server.",
              alt: "DNS path sketch",
            },
            {
              src: "/games/networking-internet/assets/book/m1-cover.jpg",
              caption: "Label packets and hops.",
              alt: "Packet hops",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Write the steps when you open a website: type name, DNS lookup, packets hop, page returns.",
        },
        {
          type: "ul",
          items: [
            "Where does DNS sit in the story?",
            "What does a router decide?",
            "Is a slow page latency or bandwidth?",
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
          text: "Myth: The internet is one giant wire. Better: it is many networks linked by routers and shared rules.",
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
              src: "/games/networking-internet/assets/book/m1-hook.jpg",
              caption: "Figure 3. Teach the net as addressed packets on multi-hop paths.",
              alt: "Networking mastery",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Teach a friend in one minute: DNS names map to IP addresses; packets hop through routers; latency and bandwidth differ.",
        },
      ],
    },
  ],
};

export default BOOK;
