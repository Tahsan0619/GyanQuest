/**
 * Digital book - ICT Fundamentals Mission 2: Networks & Signals
 * Unique curriculum book (how devices share data). Not a template fill-in.
 */
export const BOOK = {
  missionIndex: 1,
  title: "Networks & Signals",
  subtitle: "how messages travel between devices",
  subject: "ICT Fundamentals / Networks & Signals",
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
    title: "Networks & Signals",
    art: "/games/ict-fundamentals/assets/book/m2-cover.jpg",
  },
  glossary: [
    { id: "network", term: "network" },
    { id: "router", term: "router" },
    { id: "packet", term: "packet" },
    { id: "bandwidth", term: "bandwidth" },
    { id: "latency", term: "latency" },
    { id: "wireless", term: "wireless" },
    { id: "protocol", term: "protocol" },
  ],
  pages: [
    {
      title: "Devices that talk",
      layout: "text",
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/ict-fundamentals/assets/book/m2-devices.jpg",
              caption: "Figure 1. Phones, tablets, and laptops join the same network to share services.",
              alt: "Multiple connected devices",
            },
            {
              src: "/games/ict-fundamentals/assets/book/m2-cover.jpg",
              caption: "A home router is often the traffic manager for wireless devices.",
              alt: "Wi-Fi router",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "A network is a set of devices that can exchange data using agreed rules.",
        },
        {
          type: "p",
          text: "Your router directs traffic on a home network - like a clerk sending letters to the right desks.",
        },
        {
          type: "p",
          text: "Everyday hook: when a video buffers, the network path or its capacity is struggling, not 'the movie itself'.",
        },
      ],
    },
    {
      title: "Packets on a path",
      layout: "full-fig",
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/ict-fundamentals/assets/book/m2-packet.jpg",
              caption: "Figure 2. Cables and switches carry packets - small labeled chunks of a bigger message.",
              alt: "Network cable and switch",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Big files are split into packets. Each packet carries a piece plus addressing info so it can be rebuilt.",
        },
        {
          type: "ul",
          items: [
            "Wired paths: copper or fiber cables",
            "Wireless paths: radio signals through air",
            "Protocol: the shared rulebook for packing and addressing",
          ],
        },
      ],
    },
    {
      title: "Fast vs delayed",
      layout: "text",
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/ict-fundamentals/assets/book/m2-signal.jpg",
              caption: "Figure 3. Antennas and towers extend wireless reach across distance.",
              alt: "Communication tower or antenna",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Bandwidth is how much data can flow in a time window - the width of the pipe.",
        },
        {
          type: "p",
          text: "Latency is delay - how long a packet takes to arrive. Games feel lag when latency is high even if bandwidth looks fine.",
        },
      ],
    },
    {
      title: "Wireless is still physics",
      layout: "full-fig",
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/ict-fundamentals/assets/book/m2-path.jpg",
              caption: "Figure 4. Fiber and radio both move signals; only the medium changes.",
              alt: "Fiber optic or signal path",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Wireless does not mean magic. Walls, distance, and interference can weaken signals and drop packets.",
        },
      ],
    },
    {
      title: "How the mission connects",
      layout: "text",
      blocks: [
        {
          type: "p",
          text: "Meet devices → map a path → send packets → lab lag → explain → rule → stretch → myth → fluency → mastery.",
        },
        {
          type: "ul",
          items: [
            "Mapping a path shows router and links clearly",
            "Lag labs separate bandwidth from latency",
            "The rule sentence is 'shared rules + path = delivery'",
          ],
        },
      ],
    },
    {
      title: "Home Wi-Fi lab",
      layout: "split",
      figures: [
        {
          place: "right",
          slides: [
            {
              src: "/games/ict-fundamentals/assets/book/m2-cover.jpg",
              caption: "Find the router.",
              alt: "Router",
            },
            {
              src: "/games/ict-fundamentals/assets/book/m2-devices.jpg",
              caption: "List devices on the network.",
              alt: "Devices",
            },
            {
              src: "/games/ict-fundamentals/assets/book/m2-packet.jpg",
              caption: "Imagine packets hopping links.",
              alt: "Packets",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Stand near the router, then far away. Notice speed or signal icons. Explain the change with bandwidth or wireless strength.",
        },
        {
          type: "ul",
          items: [
            "What is one wired link in your home?",
            "What protocol idea keeps packets in order?",
            "Is a problem delay or capacity?",
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
          text: "Myth: The cloud is a fluffy computer in the sky. Better: it is other people's servers reached through networks.",
        },
        {
          type: "p",
          text: "Myth: More bars always mean unlimited speed. Better: bars hint at signal; bandwidth and congestion still matter.",
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
              src: "/games/ict-fundamentals/assets/book/m2-signal.jpg",
              caption: "Figure 5. Teach networks as paths for packets, not mystery wifi dust.",
              alt: "Signal teaching anchor",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Teach a friend in one minute: networks move packets; routers guide paths; bandwidth is capacity; latency is delay.",
        },
        {
          type: "ul",
          items: [
            "Define packet in one sentence",
            "Name one wireless risk (walls or distance)",
            "Use the word protocol correctly once",
          ],
        },
      ],
    },
  ],
};

export default BOOK;
