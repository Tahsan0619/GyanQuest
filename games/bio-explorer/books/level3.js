/**
 * Digital book - bio-explorer mission 3: Plant Power
 * Theory spine: cognitive load, dual coding, multimedia learning,
 * constructivism, conceptual change, spiral scaffold, retrieval practice.
 * Images: local assets under /games/bio-explorer/assets/book/ (verified downloads).
 */
export const BOOK = {
  "missionIndex": 2,
  "title": "Plant Power",
  "subtitle": "plants",
  "subject": "Bio Explorer / Plant Power",
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
    "title": "Plant Power",
    "art": "/games/bio-explorer/assets/book/m3-cover.jpg"
  },
  "glossary": [
    {
      "id": "plants",
      "term": "plants"
    },
    {
      "id": "plant",
      "term": "plant"
    },
    {
      "id": "power",
      "term": "power"
    },
    {
      "id": "food",
      "term": "food"
    },
    {
      "id": "light",
      "term": "light"
    },
    {
      "id": "water",
      "term": "water"
    },
    {
      "id": "air",
      "term": "air"
    },
    {
      "id": "grow",
      "term": "grow"
    }
  ],
  "pages": [
    {
      "title": "Why Plant Power?",
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
              "src": "/games/bio-explorer/assets/book/m3-hook.jpg",
              "caption": "Figure 1. A real-world door into Plant Power.",
              "alt": "Plant Power"
            },
            {
              "src": "/games/bio-explorer/assets/book/m3-cover.jpg",
              "caption": "Same idea, another angle.",
              "alt": "Plant Power"
            }
          ]
        }
      ],
      "blocks": [
        {
          "type": "p",
          "text": "Plants make food with light, water, and air - then grow flowers, fruit, and more plants."
        },
        {
          "type": "p",
          "text": "In the mission you practiced short steps. This book slows down: By the end of this mission, you'll be able to explain plants in your own words."
        },
        {
          "type": "p",
          "text": "Everyday hook: notice Mango trees."
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
              "src": "/games/bio-explorer/assets/book/m3-model.jpg",
              "caption": "Figure 2. Hold this picture of plants in your mind.",
              "alt": "plants"
            }
          ]
        }
      ],
      "blocks": [
        {
          "type": "p",
          "text": "Theme: plants."
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
              "src": "/games/bio-explorer/assets/book/m3-mechanism.jpg",
              "caption": "Figure 3. The process or force that drives the change.",
              "alt": "Mechanism"
            }
          ]
        }
      ],
      "blocks": [
        {
          "type": "p",
          "text": "Ask: what energy, force, or rule turns Mango trees into a new situation?"
        },
        {
          "type": "p",
          "text": "Compare with Rice paddies. Name one thing that stayed the same."
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
              "src": "/games/bio-explorer/assets/book/m3-mechanism.jpg",
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
            "Meet Plant Power",
            "Sun Energy Lab",
            "Sort: Plant Needs",
            "Grow Stages",
            "Food vs Soil"
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
              "src": "/games/bio-explorer/assets/book/m3-cover.jpg",
              "caption": "Try with Mango trees.",
              "alt": "Mango trees"
            },
            {
              "src": "/games/bio-explorer/assets/book/m3-hook.jpg",
              "caption": "Compare with Rice paddies.",
              "alt": "Rice paddies"
            },
            {
              "src": "/games/bio-explorer/assets/book/m3-model.jpg",
              "caption": "Find one more example nearby.",
              "alt": "Transfer"
            }
          ]
        }
      ],
      "blocks": [
        {
          "type": "p",
          "text": "Use Mango trees as your lab. Drag/flip the photos if more than one appears."
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
          "text": "Myth: Plant Power is just a fancy word. Better: it names a rule you can test with examples."
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
              "src": "/games/bio-explorer/assets/book/m3-cover.jpg",
              "caption": "Figure 5. Teach Plant Power using this picture as your anchor.",
              "alt": "Plant Power"
            }
          ]
        }
      ],
      "blocks": [
        {
          "type": "p",
          "text": "Teach a friend in one minute: what Plant Power means, one example (Mango trees), and one myth to avoid."
        },
        {
          "type": "ul",
          "items": [
            "Sketch the idea behind plants",
            "Point to Mango trees in real life",
            "Use one glossary word correctly"
          ]
        }
      ]
    }
  ]
};

export default BOOK;
