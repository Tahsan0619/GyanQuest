/**
 * Digital book - bio-explorer mission 2: Cell City
 * Theory spine: cognitive load, dual coding, multimedia learning,
 * constructivism, conceptual change, spiral scaffold, retrieval practice.
 * Images: local assets under /games/bio-explorer/assets/book/ (verified downloads).
 */
export const BOOK = {
  "missionIndex": 1,
  "title": "Cell City",
  "subtitle": "cells",
  "subject": "Bio Explorer / Cell City",
  "theories": [
    "cognitive-load",
    "dual-coding",
    "multimedia-learning",
    "constructivism",
    "conceptual-change",
    "spiral-scaffold",
    "retrieval-practice"
  ],
  "cover": {
    "title": "Cell City",
    "art": "/games/bio-explorer/assets/book/m2-cover.jpg"
  },
  "glossary": [
    {
      "id": "cells",
      "term": "cells"
    },
    {
      "id": "cell",
      "term": "cell"
    },
    {
      "id": "city",
      "term": "city"
    },
    {
      "id": "living",
      "term": "living"
    },
    {
      "id": "things",
      "term": "things"
    },
    {
      "id": "made",
      "term": "made"
    },
    {
      "id": "tiny",
      "term": "tiny"
    },
    {
      "id": "rooms",
      "term": "rooms"
    }
  ],
  "pages": [
    {
      "title": "Why Cell City?",
      "layout": "text",
      "theory": [
        "constructivism",
        "dual-coding",
        "cognitive-load"
      ],
      "figures": [
        {
          "place": "top",
          "slides": [
            {
              "src": "/games/bio-explorer/assets/book/m2-hook.jpg",
              "caption": "Figure 1. A real-world door into Cell City.",
              "alt": "Cell City"
            },
            {
              "src": "/games/bio-explorer/assets/book/m2-cover.jpg",
              "caption": "Same idea, another angle.",
              "alt": "Cell City"
            }
          ]
        }
      ],
      "blocks": [
        {
          "type": "p",
          "text": "Living things are made of tiny living rooms called cells - the basic units of life."
        },
        {
          "type": "p",
          "text": "In the mission you practiced short steps. This book slows down: By the end of this mission, you'll be able to explain cells in your own words."
        },
        {
          "type": "p",
          "text": "Everyday hook: notice Skin cells."
        }
      ]
    },
    {
      "title": "The big model",
      "layout": "full-fig",
      "theory": [
        "multimedia-learning",
        "dual-coding"
      ],
      "figures": [
        {
          "place": "full",
          "slides": [
            {
              "src": "/games/bio-explorer/assets/book/m2-model.jpg",
              "caption": "Figure 2. Hold this picture of cells in your mind.",
              "alt": "cells"
            }
          ]
        }
      ],
      "blocks": [
        {
          "type": "p",
          "text": "Theme: cells."
        },
        {
          "type": "p",
          "text": "Point to the photo and say what stays the same vs what can change."
        }
      ]
    },
    {
      "title": "What makes it change",
      "layout": "text",
      "theory": [
        "cognitive-load",
        "dual-coding"
      ],
      "figures": [
        {
          "place": "top",
          "slides": [
            {
              "src": "/games/bio-explorer/assets/book/m2-mechanism.jpg",
              "caption": "Figure 3. The process or force that drives the change.",
              "alt": "Mechanism"
            }
          ]
        }
      ],
      "blocks": [
        {
          "type": "p",
          "text": "Ask: what energy, force, or rule turns Skin cells into a new situation?"
        },
        {
          "type": "p",
          "text": "Compare with Mango leaf cells. Name one thing that stayed the same."
        }
      ]
    },
    {
      "title": "Look closer",
      "layout": "full-fig",
      "theory": [
        "multimedia-learning",
        "spiral-scaffold"
      ],
      "figures": [
        {
          "place": "full",
          "slides": [
            {
              "src": "/games/bio-explorer/assets/book/m2-mechanism.jpg",
              "caption": "Figure 4. A closer structure or pattern underneath the everyday view.",
              "alt": "Representation"
            }
          ]
        }
      ],
      "blocks": [
        {
          "type": "p",
          "text": "Models are tools, not photographs of every detail. Use them to explain, then check against real life."
        }
      ]
    },
    {
      "title": "How the 10 steps connect",
      "layout": "text",
      "theory": [
        "spiral-scaffold",
        "cognitive-load"
      ],
      "blocks": [
        {
          "type": "p",
          "text": "Meet \u2192 try \u2192 sort \u2192 lab \u2192 explain \u2192 rule \u2192 stretch \u2192 myth \u2192 fluency \u2192 mastery."
        },
        {
          "type": "ul",
          "items": [
            "Meet Cell City",
            "Zoom Lab",
            "Sort: Cell Stories",
            "Membrane Peek",
            "Cell Jobs"
          ]
        },
        {
          "type": "p",
          "text": "Each game step added one layer. The book gathers the full story."
        }
      ],
      "figures": []
    },
    {
      "title": "Transfer lab",
      "layout": "split",
      "theory": [
        "constructivism",
        "dual-coding",
        "retrieval-practice"
      ],
      "figures": [
        {
          "place": "right",
          "slides": [
            {
              "src": "/games/bio-explorer/assets/book/m2-cover.jpg",
              "caption": "Try with Skin cells.",
              "alt": "Skin cells"
            },
            {
              "src": "/games/bio-explorer/assets/book/m2-hook.jpg",
              "caption": "Compare with Mango leaf cells.",
              "alt": "Mango leaf cells"
            },
            {
              "src": "/games/bio-explorer/assets/book/m2-model.jpg",
              "caption": "Find one more example nearby.",
              "alt": "Transfer"
            }
          ]
        }
      ],
      "blocks": [
        {
          "type": "p",
          "text": "Use Skin cells as your lab. Drag/flip the photos if more than one appears."
        },
        {
          "type": "ul",
          "items": [
            "What changed?",
            "What stayed the same?",
            "What rule explains it?"
          ]
        }
      ]
    },
    {
      "title": "Myths to bust",
      "layout": "text",
      "theory": [
        "conceptual-change"
      ],
      "blocks": [
        {
          "type": "p",
          "text": "Myth: Cell City is just a fancy word. Better: it names a rule you can test with examples."
        },
        {
          "type": "p",
          "text": "Myth: if I memorized a sentence, I understand. Better: I can show an example and a counter-example."
        },
        {
          "type": "p",
          "text": "Red words are glossary terms. Tap one to ask the tutor."
        }
      ],
      "figures": []
    },
    {
      "title": "Mastery",
      "layout": "text",
      "theory": [
        "retrieval-practice",
        "spiral-scaffold"
      ],
      "figures": [
        {
          "place": "top",
          "slides": [
            {
              "src": "/games/bio-explorer/assets/book/m2-cover.jpg",
              "caption": "Figure 5. Teach Cell City using this picture as your anchor.",
              "alt": "Cell City"
            }
          ]
        }
      ],
      "blocks": [
        {
          "type": "p",
          "text": "Teach a friend in one minute: what Cell City means, one example (Skin cells), and one myth to avoid."
        },
        {
          "type": "ul",
          "items": [
            "Sketch the idea behind cells",
            "Point to Skin cells in real life",
            "Use one glossary word correctly"
          ]
        }
      ]
    }
  ]
};

export default BOOK;
