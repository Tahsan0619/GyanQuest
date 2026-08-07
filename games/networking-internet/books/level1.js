/**
 * Digital book - Networking & Internet Mission 1: Packets Travel
 * Theory: cognitive load, dual coding, multimedia learning, constructivism,
 * conceptual change, spiral scaffold, retrieval practice.
 * Photos: assets/book-shared computing / space themes (see assets/book/CREDITS-m1.json).
 */
export const BOOK = {
  missionIndex: 0,
  title: "Packets Travel",
  subtitle: "messages split into packets and find a path",
  subject: "Networking Internet / Packets Travel",
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
    title: "Packets Travel",
    art: "/games/networking-internet/assets/book/m1-cover.jpg",
  },
  glossary: [
    { id: "packet", term: "packet" },
    { id: "path", term: "path" },
    { id: "router", term: "router" },
    { id: "address", term: "address" },
    { id: "reassemble", term: "reassemble" },
    { id: "message", term: "message" },
    { id: "network", term: "network" },
    { id: "hop", term: "hop" },
  ],
  pages: [
    {
      title: "Chop the message, send the pieces",
      layout: "text",
      theory: ["constructivism", "dual-coding", "cognitive-load"],
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/networking-internet/assets/book/m1-cover.jpg",
              caption: "Figure 1. Satellites and ground links move labeled pieces of data across long paths.",
              alt: "Satellite communication",
            },
            {
              src: "/games/networking-internet/assets/book/m1-hook.jpg",
              caption: "Launches remind us: getting a payload to a destination takes a planned path.",
              alt: "Rocket launch",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Internet messages split into packets that travel paths and reassemble at the end.",
        },
        {
          type: "p",
          text: "Each packet carries a bit of the message plus addressing so routers can forward it hop by hop.",
        },
        {
          type: "p",
          text: "Sending a chat, loading a photo, and a video call are three times you watch packets move without seeing the slices.",
        },
      ],
    },
    {
      title: "Many roads across a big map",
      layout: "full-fig",
      theory: ["multimedia-learning", "dual-coding"],
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/networking-internet/assets/book/m1-model.jpg",
              caption: "Figure 2. A sky full of points - networks are meshes where pieces take different routes.",
              alt: "Milky Way arch",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Packets from one photo may take different paths and still rebuild the same image if all pieces arrive.",
        },
        {
          type: "ul",
          items: [
            "Split: large message -> smaller packets",
            "Travel: each packet finds a path via routers",
            "Join: destination reassembles using order info",
          ],
        },
      ],
    },
    {
      title: "Why split at all",
      layout: "text",
      theory: ["cognitive-load", "dual-coding"],
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/networking-internet/assets/book/m1-mechanism.jpg",
              caption: "Figure 3. Separate worlds still share a system map - networks share routes too.",
              alt: "Planets diagram",
            },
            {
              src: "/games/networking-internet/assets/book/m1-detail.jpg",
              caption: "Stormy detail on a giant planet - local trouble can force a detour.",
              alt: "Jupiter plume detail",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Small packets share links fairly and survive congestion better than one giant unbreakable blob.",
        },
        {
          type: "p",
          text: "If one packet drops, often only that slice retries - your chat does not restart from zero every time.",
        },
      ],
    },
    {
      title: "Arrival and rebuild",
      layout: "full-fig",
      theory: ["multimedia-learning", "spiral-scaffold"],
      figures: [
        {
          place: "full",
          slides: [
            {
              src: "/games/networking-internet/assets/book/m1-transfer.jpg",
              caption: "Figure 4. A full moon looks whole - like a photo after packets reassemble.",
              alt: "Full moon",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "You see one smooth picture. Underneath, many packets landed, maybe out of order, then lined up again.",
        },
      ],
    },
    {
      title: "Packet Pilot route",
      layout: "text",
      theory: ["spiral-scaffold", "cognitive-load"],
      blocks: [
        {
          type: "p",
          text: "You met packets, dialed path clarity, sorted packet parts, cleaned a path lab, and named why packets move.",
        },
        {
          type: "ul",
          items: [
            "Parts: data slice, address, order clues",
            "Path lab: watch hops and detours",
            "Rule: messages split into packets and find a path",
          ],
        },
        {
          type: "p",
          text: "Each sub kept one idea. This page holds the travel story end to end.",
        },
      ],
    },
    {
      title: "Chat, photo, call",
      layout: "split",
      theory: ["constructivism", "dual-coding", "retrieval-practice"],
      figures: [
        {
          place: "right",
          slides: [
            {
              src: "/games/networking-internet/assets/book/m1-cover.jpg",
              caption: "Chat - tiny packets, fast hops.",
              alt: "Satellite link",
            },
            {
              src: "/games/networking-internet/assets/book/m1-model.jpg",
              caption: "Photo load - many packets rebuild one image.",
              alt: "Dense network metaphor",
            },
            {
              src: "/games/networking-internet/assets/book/m1-hook.jpg",
              caption: "Video call - steady stream of slices both ways.",
              alt: "Launch as delivery metaphor",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "For each everyday case, say what is splitting, what is traveling, and what reassembles on the screen.",
        },
        {
          type: "ul",
          items: [
            "What happens if one packet is late?",
            "Why might two packets take different paths?",
            "What do you see only after reassembly?",
          ],
        },
      ],
    },
    {
      title: "Packet myths",
      layout: "text",
      theory: ["conceptual-change"],
      blocks: [
        {
          type: "p",
          text: "Myth: The whole message rides as one car on one road. Better: sliced packets can use many roads.",
        },
        {
          type: "p",
          text: "Myth: Different paths mean different photos. Better: reassembly rebuilds the same message when pieces arrive intact.",
        },
        {
          type: "p",
          text: "Myth: Wi-Fi is the entire internet. Better: Wi-Fi is one local hop; packets continue across many networks.",
        },
        {
          type: "p",
          text: "Red terms such as packet or path open the tutor.",
        },
      ],
    },
    {
      title: "Packet Pilot mastery",
      layout: "text",
      theory: ["retrieval-practice", "spiral-scaffold"],
      figures: [
        {
          place: "top",
          slides: [
            {
              src: "/games/networking-internet/assets/book/m1-cover.jpg",
              caption: "Figure 5. Teach packet travel with one long-path picture.",
              alt: "Satellite communication anchor",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "p",
          text: "Teach in one minute: messages split into packets, packets find paths, the destination reassembles the story you see.",
        },
        {
          type: "ul",
          items: [
            "Sketch split-travel-join",
            "Point to a photo loading on a phone",
            "Use the word packet correctly once",
          ],
        },
      ],
    },
  ],
};

export default BOOK;
