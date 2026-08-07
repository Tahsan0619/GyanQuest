/** Auto-generated curriculum - 10 levels × 10 subs (Brunner spiral) */
export const curriculum = {
  "levels": [
    {
      "kidTitle": "Learn from Examples",
      "theme": "intro",
      "emoji": "📊",
      "rewardName": "Learn Rookie",
      "intro": "In “Learn from Examples” you learn intro through play - spiral from concrete actions to symbols (Bruner's theory). Props and panel match the idea.",
      "everyday": [
        "Spam filter",
        "Recommend videos",
        "Price guess"
      ],
      "scene": "classroom",
      "viz": "compare",
      "quiz": [
        {
          "q": "What is a good everyday example of “intro”?",
          "opts": [
            "Spam filter",
            "Ignoring the idea",
            "Deleting evidence",
            "Random guessing only"
          ],
          "ok": 0
        },
        {
          "q": "Bruner's spiral says we should…",
          "opts": [
            "Revisit ideas from concrete → abstract",
            "Only memorize forever",
            "Skip examples",
            "Never check understanding"
          ],
          "ok": 0
        }
      ],
      "subs": [
        {
          "type": "demo",
          "scene": "classroom",
          "viz": "compare",
          "coach": "📊 Level 1 · Step 1: explore intro (enactive).",
          "html": "<p><strong>Learn from Examples</strong> - watch the themed scene <em>and</em> the interactive panel.</p><p>Everyday hook: <em>Spam filter</em>.</p><p>Brunner stage: <strong>enactive</strong> - start concrete, then build up.</p>"
        },
        {
          "type": "drag",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Sort ideas about intro.",
          "title": "Sort: Learn from Examples",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Spam filter"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Recommend videos"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About intro",
              "accept": [
                "a",
                "c"
              ]
            },
            {
              "id": "no",
              "label": "Not related",
              "accept": [
                "b",
                "d"
              ]
            }
          ]
        },
        {
          "type": "reveal",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Reveal examples for Learn from Examples.",
          "title": "Learn from Examples - unfold examples",
          "steps": [
            "Hook: Spam filter",
            "Notice: Recommend videos connects to intro.",
            "Pattern: the same idea shows up in Price guess.",
            "Takeaway: you can explain intro using the props you see."
          ]
        },
        {
          "type": "order",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Order the learning path for intro.",
          "items": [
            {
              "id": "1",
              "html": "1) See a concrete example"
            },
            {
              "id": "2",
              "html": "2) Name the idea"
            },
            {
              "id": "3",
              "html": "3) Try a hands-on sort"
            },
            {
              "id": "4",
              "html": "4) Check with a quiz"
            }
          ],
          "correctIds": [
            "1",
            "2",
            "3",
            "4"
          ]
        },
        {
          "type": "quiz",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Quick check: Learn from Examples",
          "q": "Which best matches “intro” in Machine Learning?",
          "opts": [
            "Spam filter",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        },
        {
          "type": "scene3d",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Explore the 3D scene for Learn from Examples.",
          "html": "<p>Look at the themed 3D scene. Match the dock text to props you can actually see in the 3D scene.</p><p>Tip: <em>Price guess</em></p>"
        },
        {
          "type": "equation",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Build the idea sentence for intro.",
          "tokens": [
            {
              "id": "t1",
              "html": "intro"
            },
            {
              "id": "t2",
              "html": "explains"
            },
            {
              "id": "t3",
              "html": "Spam filter"
            }
          ]
        },
        {
          "type": "tap",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "📊 Level 1 · Step 8: explore intro (enactive).",
          "html": "<p><strong>Learn from Examples</strong></p><p>Spam filter · Recommend videos · Price guess</p><p>Stage: enactive. Use the interactive panel, then continue.</p>"
        },
        {
          "type": "drag",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Sort ideas about intro.",
          "title": "Sort: Learn from Examples",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Spam filter"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Recommend videos"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About intro",
              "accept": [
                "a",
                "c"
              ]
            },
            {
              "id": "no",
              "label": "Not related",
              "accept": [
                "b",
                "d"
              ]
            }
          ]
        },
        {
          "type": "boss",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Boss check: Learn from Examples",
          "q": "Which best matches “intro” in Machine Learning?",
          "opts": [
            "Spam filter",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        }
      ]
    },
    {
      "kidTitle": "Features",
      "theme": "features",
      "emoji": "📊",
      "rewardName": "Features Scout",
      "intro": "In “Features” you learn features through play - spiral from concrete actions to symbols (Bruner's theory). Props and panel match the idea.",
      "everyday": [
        "Inputs that matter",
        "Height/weight",
        "Pixel values"
      ],
      "scene": "classroomCount",
      "viz": "compare",
      "quiz": [
        {
          "q": "What is a good everyday example of “features”?",
          "opts": [
            "Inputs that matter",
            "Ignoring the idea",
            "Deleting evidence",
            "Random guessing only"
          ],
          "ok": 0
        },
        {
          "q": "Bruner's spiral says we should…",
          "opts": [
            "Revisit ideas from concrete → abstract",
            "Only memorize forever",
            "Skip examples",
            "Never check understanding"
          ],
          "ok": 0
        }
      ],
      "subs": [
        {
          "type": "demo",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "📊 Level 2 · Step 1: explore features (enactive).",
          "html": "<p><strong>Features</strong> - watch the themed scene <em>and</em> the interactive panel.</p><p>Everyday hook: <em>Inputs that matter</em>.</p><p>Brunner stage: <strong>enactive</strong> - start concrete, then build up.</p>"
        },
        {
          "type": "drag",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Sort ideas about features.",
          "title": "Sort: Features",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Inputs that matter"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Height/weight"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About features",
              "accept": [
                "a",
                "c"
              ]
            },
            {
              "id": "no",
              "label": "Not related",
              "accept": [
                "b",
                "d"
              ]
            }
          ]
        },
        {
          "type": "reveal",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Reveal examples for Features.",
          "title": "Features - unfold examples",
          "steps": [
            "Hook: Inputs that matter",
            "Notice: Height/weight connects to features.",
            "Pattern: the same idea shows up in Pixel values.",
            "Takeaway: you can explain features using the props you see."
          ]
        },
        {
          "type": "order",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Order the learning path for features.",
          "items": [
            {
              "id": "1",
              "html": "1) See a concrete example"
            },
            {
              "id": "2",
              "html": "2) Name the idea"
            },
            {
              "id": "3",
              "html": "3) Try a hands-on sort"
            },
            {
              "id": "4",
              "html": "4) Check with a quiz"
            }
          ],
          "correctIds": [
            "1",
            "2",
            "3",
            "4"
          ]
        },
        {
          "type": "quiz",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Quick check: Features",
          "q": "Which best matches “features” in Machine Learning?",
          "opts": [
            "Inputs that matter",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        },
        {
          "type": "scene3d",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Explore the 3D scene for Features.",
          "html": "<p>Look at the themed 3D scene. Match the dock text to props you can actually see in the 3D scene.</p><p>Tip: <em>Pixel values</em></p>"
        },
        {
          "type": "equation",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Build the idea sentence for features.",
          "tokens": [
            {
              "id": "t1",
              "html": "features"
            },
            {
              "id": "t2",
              "html": "explains"
            },
            {
              "id": "t3",
              "html": "Inputs that matter"
            }
          ]
        },
        {
          "type": "tap",
          "scene": "classroom",
          "viz": "compare",
          "coach": "📊 Level 2 · Step 8: explore features (enactive).",
          "html": "<p><strong>Features</strong></p><p>Inputs that matter · Height/weight · Pixel values</p><p>Stage: enactive. Use the interactive panel, then continue.</p>"
        },
        {
          "type": "drag",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Sort ideas about features.",
          "title": "Sort: Features",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Inputs that matter"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Height/weight"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About features",
              "accept": [
                "a",
                "c"
              ]
            },
            {
              "id": "no",
              "label": "Not related",
              "accept": [
                "b",
                "d"
              ]
            }
          ]
        },
        {
          "type": "boss",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Boss check: Features",
          "q": "Which best matches “features” in Machine Learning?",
          "opts": [
            "Inputs that matter",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        }
      ]
    },
    {
      "kidTitle": "Train / Test",
      "theme": "split",
      "emoji": "📊",
      "rewardName": "Train Explorer",
      "intro": "In “Train / Test” you learn split through play - spiral from concrete actions to symbols (Bruner's theory). Props and panel match the idea.",
      "everyday": [
        "Study then exam",
        "Don't peek",
        "Generalize"
      ],
      "scene": "classroom",
      "viz": "compare",
      "quiz": [
        {
          "q": "What is a good everyday example of “split”?",
          "opts": [
            "Study then exam",
            "Ignoring the idea",
            "Deleting evidence",
            "Random guessing only"
          ],
          "ok": 0
        },
        {
          "q": "Bruner's spiral says we should…",
          "opts": [
            "Revisit ideas from concrete → abstract",
            "Only memorize forever",
            "Skip examples",
            "Never check understanding"
          ],
          "ok": 0
        }
      ],
      "subs": [
        {
          "type": "demo",
          "scene": "classroom",
          "viz": "compare",
          "coach": "📊 Level 3 · Step 1: explore split (enactive).",
          "html": "<p><strong>Train / Test</strong> - watch the themed scene <em>and</em> the interactive panel.</p><p>Everyday hook: <em>Study then exam</em>.</p><p>Brunner stage: <strong>enactive</strong> - start concrete, then build up.</p>"
        },
        {
          "type": "drag",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Sort ideas about split.",
          "title": "Sort: Train / Test",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Study then exam"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Don't peek"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About split",
              "accept": [
                "a",
                "c"
              ]
            },
            {
              "id": "no",
              "label": "Not related",
              "accept": [
                "b",
                "d"
              ]
            }
          ]
        },
        {
          "type": "reveal",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Reveal examples for Train / Test.",
          "title": "Train / Test - unfold examples",
          "steps": [
            "Hook: Study then exam",
            "Notice: Don't peek connects to split.",
            "Pattern: the same idea shows up in Generalize.",
            "Takeaway: you can explain split using the props you see."
          ]
        },
        {
          "type": "order",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Order the learning path for split.",
          "items": [
            {
              "id": "1",
              "html": "1) See a concrete example"
            },
            {
              "id": "2",
              "html": "2) Name the idea"
            },
            {
              "id": "3",
              "html": "3) Try a hands-on sort"
            },
            {
              "id": "4",
              "html": "4) Check with a quiz"
            }
          ],
          "correctIds": [
            "1",
            "2",
            "3",
            "4"
          ]
        },
        {
          "type": "quiz",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Quick check: Train / Test",
          "q": "Which best matches “split” in Machine Learning?",
          "opts": [
            "Study then exam",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        },
        {
          "type": "scene3d",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Explore the 3D scene for Train / Test.",
          "html": "<p>Look at the themed 3D scene. Match the dock text to props you can actually see in the 3D scene.</p><p>Tip: <em>Generalize</em></p>"
        },
        {
          "type": "equation",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Build the idea sentence for split.",
          "tokens": [
            {
              "id": "t1",
              "html": "split"
            },
            {
              "id": "t2",
              "html": "explains"
            },
            {
              "id": "t3",
              "html": "Study then exam"
            }
          ]
        },
        {
          "type": "tap",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "📊 Level 3 · Step 8: explore split (enactive).",
          "html": "<p><strong>Train / Test</strong></p><p>Study then exam · Don't peek · Generalize</p><p>Stage: enactive. Use the interactive panel, then continue.</p>"
        },
        {
          "type": "drag",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Sort ideas about split.",
          "title": "Sort: Train / Test",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Study then exam"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Don't peek"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About split",
              "accept": [
                "a",
                "c"
              ]
            },
            {
              "id": "no",
              "label": "Not related",
              "accept": [
                "b",
                "d"
              ]
            }
          ]
        },
        {
          "type": "boss",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Boss check: Train / Test",
          "q": "Which best matches “split” in Machine Learning?",
          "opts": [
            "Study then exam",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        }
      ]
    },
    {
      "kidTitle": "Overfit",
      "theme": "overfit",
      "emoji": "📊",
      "rewardName": "Overfit Builder",
      "intro": "In “Overfit” you learn overfit through play - spiral from concrete actions to symbols (Bruner's theory). Props and panel match the idea.",
      "everyday": [
        "Memorize ≠ learn",
        "Too complex",
        "Simpler wins"
      ],
      "scene": "classroomCount",
      "viz": "compare",
      "quiz": [
        {
          "q": "What is a good everyday example of “overfit”?",
          "opts": [
            "Memorize ≠ learn",
            "Ignoring the idea",
            "Deleting evidence",
            "Random guessing only"
          ],
          "ok": 0
        },
        {
          "q": "Bruner's spiral says we should…",
          "opts": [
            "Revisit ideas from concrete → abstract",
            "Only memorize forever",
            "Skip examples",
            "Never check understanding"
          ],
          "ok": 0
        }
      ],
      "subs": [
        {
          "type": "demo",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "📊 Level 4 · Step 1: explore overfit (iconic).",
          "html": "<p><strong>Overfit</strong> - watch the themed scene <em>and</em> the interactive panel.</p><p>Everyday hook: <em>Memorize ≠ learn</em>.</p><p>Brunner stage: <strong>iconic</strong> - start concrete, then build up.</p>"
        },
        {
          "type": "drag",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Sort ideas about overfit.",
          "title": "Sort: Overfit",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Memorize ≠ learn"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Too complex"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About overfit",
              "accept": [
                "a",
                "c"
              ]
            },
            {
              "id": "no",
              "label": "Not related",
              "accept": [
                "b",
                "d"
              ]
            }
          ]
        },
        {
          "type": "reveal",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Reveal examples for Overfit.",
          "title": "Overfit - unfold examples",
          "steps": [
            "Hook: Memorize ≠ learn",
            "Notice: Too complex connects to overfit.",
            "Pattern: the same idea shows up in Simpler wins.",
            "Takeaway: you can explain overfit using the props you see."
          ]
        },
        {
          "type": "order",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Order the learning path for overfit.",
          "items": [
            {
              "id": "1",
              "html": "1) See a concrete example"
            },
            {
              "id": "2",
              "html": "2) Name the idea"
            },
            {
              "id": "3",
              "html": "3) Try a hands-on sort"
            },
            {
              "id": "4",
              "html": "4) Check with a quiz"
            }
          ],
          "correctIds": [
            "1",
            "2",
            "3",
            "4"
          ]
        },
        {
          "type": "quiz",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Quick check: Overfit",
          "q": "Which best matches “overfit” in Machine Learning?",
          "opts": [
            "Memorize ≠ learn",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        },
        {
          "type": "scene3d",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Explore the 3D scene for Overfit.",
          "html": "<p>Look at the themed 3D scene. Match the dock text to props you can actually see in the 3D scene.</p><p>Tip: <em>Simpler wins</em></p>"
        },
        {
          "type": "equation",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Build the idea sentence for overfit.",
          "tokens": [
            {
              "id": "t1",
              "html": "overfit"
            },
            {
              "id": "t2",
              "html": "explains"
            },
            {
              "id": "t3",
              "html": "Memorize ≠ learn"
            }
          ]
        },
        {
          "type": "tap",
          "scene": "classroom",
          "viz": "compare",
          "coach": "📊 Level 4 · Step 8: explore overfit (iconic).",
          "html": "<p><strong>Overfit</strong></p><p>Memorize ≠ learn · Too complex · Simpler wins</p><p>Stage: iconic. Use the interactive panel, then continue.</p>"
        },
        {
          "type": "drag",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Sort ideas about overfit.",
          "title": "Sort: Overfit",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Memorize ≠ learn"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Too complex"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About overfit",
              "accept": [
                "a",
                "c"
              ]
            },
            {
              "id": "no",
              "label": "Not related",
              "accept": [
                "b",
                "d"
              ]
            }
          ]
        },
        {
          "type": "boss",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Boss check: Overfit",
          "q": "Which best matches “overfit” in Machine Learning?",
          "opts": [
            "Memorize ≠ learn",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        }
      ]
    },
    {
      "kidTitle": "Classification",
      "theme": "class",
      "emoji": "📊",
      "rewardName": "Classification Analyst",
      "intro": "In “Classification” you learn class through play - spiral from concrete actions to symbols (Bruner's theory). Props and panel match the idea.",
      "everyday": [
        "Cat or dog",
        "Spam or not",
        "Disease risk"
      ],
      "scene": "classroom",
      "viz": "compare",
      "quiz": [
        {
          "q": "What is a good everyday example of “class”?",
          "opts": [
            "Cat or dog",
            "Ignoring the idea",
            "Deleting evidence",
            "Random guessing only"
          ],
          "ok": 0
        },
        {
          "q": "Bruner's spiral says we should…",
          "opts": [
            "Revisit ideas from concrete → abstract",
            "Only memorize forever",
            "Skip examples",
            "Never check understanding"
          ],
          "ok": 0
        }
      ],
      "subs": [
        {
          "type": "demo",
          "scene": "classroom",
          "viz": "compare",
          "coach": "📊 Level 5 · Step 1: explore class (iconic).",
          "html": "<p><strong>Classification</strong> - watch the themed scene <em>and</em> the interactive panel.</p><p>Everyday hook: <em>Cat or dog</em>.</p><p>Brunner stage: <strong>iconic</strong> - start concrete, then build up.</p>"
        },
        {
          "type": "drag",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Sort ideas about class.",
          "title": "Sort: Classification",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Cat or dog"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Spam or not"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About class",
              "accept": [
                "a",
                "c"
              ]
            },
            {
              "id": "no",
              "label": "Not related",
              "accept": [
                "b",
                "d"
              ]
            }
          ]
        },
        {
          "type": "reveal",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Reveal examples for Classification.",
          "title": "Classification - unfold examples",
          "steps": [
            "Hook: Cat or dog",
            "Notice: Spam or not connects to class.",
            "Pattern: the same idea shows up in Disease risk.",
            "Takeaway: you can explain class using the props you see."
          ]
        },
        {
          "type": "order",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Order the learning path for class.",
          "items": [
            {
              "id": "1",
              "html": "1) See a concrete example"
            },
            {
              "id": "2",
              "html": "2) Name the idea"
            },
            {
              "id": "3",
              "html": "3) Try a hands-on sort"
            },
            {
              "id": "4",
              "html": "4) Check with a quiz"
            }
          ],
          "correctIds": [
            "1",
            "2",
            "3",
            "4"
          ]
        },
        {
          "type": "quiz",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Quick check: Classification",
          "q": "Which best matches “class” in Machine Learning?",
          "opts": [
            "Cat or dog",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        },
        {
          "type": "scene3d",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Explore the 3D scene for Classification.",
          "html": "<p>Look at the themed 3D scene. Match the dock text to props you can actually see in the 3D scene.</p><p>Tip: <em>Disease risk</em></p>"
        },
        {
          "type": "equation",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Build the idea sentence for class.",
          "tokens": [
            {
              "id": "t1",
              "html": "class"
            },
            {
              "id": "t2",
              "html": "explains"
            },
            {
              "id": "t3",
              "html": "Cat or dog"
            }
          ]
        },
        {
          "type": "tap",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "📊 Level 5 · Step 8: explore class (iconic).",
          "html": "<p><strong>Classification</strong></p><p>Cat or dog · Spam or not · Disease risk</p><p>Stage: iconic. Use the interactive panel, then continue.</p>"
        },
        {
          "type": "drag",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Sort ideas about class.",
          "title": "Sort: Classification",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Cat or dog"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Spam or not"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About class",
              "accept": [
                "a",
                "c"
              ]
            },
            {
              "id": "no",
              "label": "Not related",
              "accept": [
                "b",
                "d"
              ]
            }
          ]
        },
        {
          "type": "boss",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Boss check: Classification",
          "q": "Which best matches “class” in Machine Learning?",
          "opts": [
            "Cat or dog",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        }
      ]
    },
    {
      "kidTitle": "Regression",
      "theme": "reg",
      "emoji": "📊",
      "rewardName": "Regression Strategist",
      "intro": "In “Regression” you learn reg through play - spiral from concrete actions to symbols (Bruner's theory). Props and panel match the idea.",
      "everyday": [
        "Predict price",
        "Temperature",
        "Scores"
      ],
      "scene": "classroomCount",
      "viz": "compare",
      "quiz": [
        {
          "q": "What is a good everyday example of “reg”?",
          "opts": [
            "Predict price",
            "Ignoring the idea",
            "Deleting evidence",
            "Random guessing only"
          ],
          "ok": 0
        },
        {
          "q": "Bruner's spiral says we should…",
          "opts": [
            "Revisit ideas from concrete → abstract",
            "Only memorize forever",
            "Skip examples",
            "Never check understanding"
          ],
          "ok": 0
        }
      ],
      "subs": [
        {
          "type": "demo",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "📊 Level 6 · Step 1: explore reg (iconic).",
          "html": "<p><strong>Regression</strong> - watch the themed scene <em>and</em> the interactive panel.</p><p>Everyday hook: <em>Predict price</em>.</p><p>Brunner stage: <strong>iconic</strong> - start concrete, then build up.</p>"
        },
        {
          "type": "drag",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Sort ideas about reg.",
          "title": "Sort: Regression",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Predict price"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Temperature"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About reg",
              "accept": [
                "a",
                "c"
              ]
            },
            {
              "id": "no",
              "label": "Not related",
              "accept": [
                "b",
                "d"
              ]
            }
          ]
        },
        {
          "type": "reveal",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Reveal examples for Regression.",
          "title": "Regression - unfold examples",
          "steps": [
            "Hook: Predict price",
            "Notice: Temperature connects to reg.",
            "Pattern: the same idea shows up in Scores.",
            "Takeaway: you can explain reg using the props you see."
          ]
        },
        {
          "type": "order",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Order the learning path for reg.",
          "items": [
            {
              "id": "1",
              "html": "1) See a concrete example"
            },
            {
              "id": "2",
              "html": "2) Name the idea"
            },
            {
              "id": "3",
              "html": "3) Try a hands-on sort"
            },
            {
              "id": "4",
              "html": "4) Check with a quiz"
            }
          ],
          "correctIds": [
            "1",
            "2",
            "3",
            "4"
          ]
        },
        {
          "type": "quiz",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Quick check: Regression",
          "q": "Which best matches “reg” in Machine Learning?",
          "opts": [
            "Predict price",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        },
        {
          "type": "scene3d",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Explore the 3D scene for Regression.",
          "html": "<p>Look at the themed 3D scene. Match the dock text to props you can actually see in the 3D scene.</p><p>Tip: <em>Scores</em></p>"
        },
        {
          "type": "equation",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Build the idea sentence for reg.",
          "tokens": [
            {
              "id": "t1",
              "html": "reg"
            },
            {
              "id": "t2",
              "html": "explains"
            },
            {
              "id": "t3",
              "html": "Predict price"
            }
          ]
        },
        {
          "type": "tap",
          "scene": "classroom",
          "viz": "compare",
          "coach": "📊 Level 6 · Step 8: explore reg (iconic).",
          "html": "<p><strong>Regression</strong></p><p>Predict price · Temperature · Scores</p><p>Stage: iconic. Use the interactive panel, then continue.</p>"
        },
        {
          "type": "drag",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Sort ideas about reg.",
          "title": "Sort: Regression",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Predict price"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Temperature"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About reg",
              "accept": [
                "a",
                "c"
              ]
            },
            {
              "id": "no",
              "label": "Not related",
              "accept": [
                "b",
                "d"
              ]
            }
          ]
        },
        {
          "type": "boss",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Boss check: Regression",
          "q": "Which best matches “reg” in Machine Learning?",
          "opts": [
            "Predict price",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        }
      ]
    },
    {
      "kidTitle": "Eval Metrics",
      "theme": "metrics",
      "emoji": "📊",
      "rewardName": "Eval Guardian",
      "intro": "In “Eval Metrics” you learn metrics through play - spiral from concrete actions to symbols (Bruner's theory). Props and panel match the idea.",
      "everyday": [
        "Accuracy",
        "Mistakes cost",
        "Confusion"
      ],
      "scene": "classroom",
      "viz": "compare",
      "quiz": [
        {
          "q": "What is a good everyday example of “metrics”?",
          "opts": [
            "Accuracy",
            "Ignoring the idea",
            "Deleting evidence",
            "Random guessing only"
          ],
          "ok": 0
        },
        {
          "q": "Bruner's spiral says we should…",
          "opts": [
            "Revisit ideas from concrete → abstract",
            "Only memorize forever",
            "Skip examples",
            "Never check understanding"
          ],
          "ok": 0
        }
      ],
      "subs": [
        {
          "type": "demo",
          "scene": "classroom",
          "viz": "compare",
          "coach": "📊 Level 7 · Step 1: explore metrics (symbolic).",
          "html": "<p><strong>Eval Metrics</strong> - watch the themed scene <em>and</em> the interactive panel.</p><p>Everyday hook: <em>Accuracy</em>.</p><p>Brunner stage: <strong>symbolic</strong> - start concrete, then build up.</p>"
        },
        {
          "type": "drag",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Sort ideas about metrics.",
          "title": "Sort: Eval Metrics",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Accuracy"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Mistakes cost"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About metrics",
              "accept": [
                "a",
                "c"
              ]
            },
            {
              "id": "no",
              "label": "Not related",
              "accept": [
                "b",
                "d"
              ]
            }
          ]
        },
        {
          "type": "reveal",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Reveal examples for Eval Metrics.",
          "title": "Eval Metrics - unfold examples",
          "steps": [
            "Hook: Accuracy",
            "Notice: Mistakes cost connects to metrics.",
            "Pattern: the same idea shows up in Confusion.",
            "Takeaway: you can explain metrics using the props you see."
          ]
        },
        {
          "type": "order",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Order the learning path for metrics.",
          "items": [
            {
              "id": "1",
              "html": "1) See a concrete example"
            },
            {
              "id": "2",
              "html": "2) Name the idea"
            },
            {
              "id": "3",
              "html": "3) Try a hands-on sort"
            },
            {
              "id": "4",
              "html": "4) Check with a quiz"
            }
          ],
          "correctIds": [
            "1",
            "2",
            "3",
            "4"
          ]
        },
        {
          "type": "quiz",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Quick check: Eval Metrics",
          "q": "Which best matches “metrics” in Machine Learning?",
          "opts": [
            "Accuracy",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        },
        {
          "type": "scene3d",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Explore the 3D scene for Eval Metrics.",
          "html": "<p>Look at the themed 3D scene. Match the dock text to props you can actually see in the 3D scene.</p><p>Tip: <em>Confusion</em></p>"
        },
        {
          "type": "equation",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Build the idea sentence for metrics.",
          "tokens": [
            {
              "id": "t1",
              "html": "metrics"
            },
            {
              "id": "t2",
              "html": "explains"
            },
            {
              "id": "t3",
              "html": "Accuracy"
            }
          ]
        },
        {
          "type": "tap",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "📊 Level 7 · Step 8: explore metrics (symbolic).",
          "html": "<p><strong>Eval Metrics</strong></p><p>Accuracy · Mistakes cost · Confusion</p><p>Stage: symbolic. Use the interactive panel, then continue.</p>"
        },
        {
          "type": "drag",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Sort ideas about metrics.",
          "title": "Sort: Eval Metrics",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Accuracy"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Mistakes cost"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About metrics",
              "accept": [
                "a",
                "c"
              ]
            },
            {
              "id": "no",
              "label": "Not related",
              "accept": [
                "b",
                "d"
              ]
            }
          ]
        },
        {
          "type": "boss",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Boss check: Eval Metrics",
          "q": "Which best matches “metrics” in Machine Learning?",
          "opts": [
            "Accuracy",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        }
      ]
    },
    {
      "kidTitle": "Pipeline",
      "theme": "pipe",
      "emoji": "📊",
      "rewardName": "Pipeline Scholar",
      "intro": "In “Pipeline” you learn pipe through play - spiral from concrete actions to symbols (Bruner's theory). Props and panel match the idea.",
      "everyday": [
        "Collect → clean → train → check",
        "Iterate",
        "Deploy idea"
      ],
      "scene": "classroomCount",
      "viz": "compare",
      "quiz": [
        {
          "q": "What is a good everyday example of “pipe”?",
          "opts": [
            "Collect → clean → train → check",
            "Ignoring the idea",
            "Deleting evidence",
            "Random guessing only"
          ],
          "ok": 0
        },
        {
          "q": "Bruner's spiral says we should…",
          "opts": [
            "Revisit ideas from concrete → abstract",
            "Only memorize forever",
            "Skip examples",
            "Never check understanding"
          ],
          "ok": 0
        },
        {
          "q": "In Machine Learning, “pipe” most helps you…",
          "opts": [
            "Explain and apply the idea safely",
            "Avoid thinking",
            "Break lab rules",
            "Skip practice"
          ],
          "ok": 0
        }
      ],
      "subs": [
        {
          "type": "demo",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "📊 Level 8 · Step 1: explore pipe (symbolic).",
          "html": "<p><strong>Pipeline</strong> - watch the themed scene <em>and</em> the interactive panel.</p><p>Everyday hook: <em>Collect → clean → train → check</em>.</p><p>Brunner stage: <strong>symbolic</strong> - start concrete, then build up.</p>"
        },
        {
          "type": "drag",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Sort ideas about pipe.",
          "title": "Sort: Pipeline",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Collect → clean → train → check"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Iterate"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About pipe",
              "accept": [
                "a",
                "c"
              ]
            },
            {
              "id": "no",
              "label": "Not related",
              "accept": [
                "b",
                "d"
              ]
            }
          ]
        },
        {
          "type": "reveal",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Reveal examples for Pipeline.",
          "title": "Pipeline - unfold examples",
          "steps": [
            "Hook: Collect → clean → train → check",
            "Notice: Iterate connects to pipe.",
            "Pattern: the same idea shows up in Deploy idea.",
            "Takeaway: you can explain pipe using the props you see."
          ]
        },
        {
          "type": "order",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Order the learning path for pipe.",
          "items": [
            {
              "id": "1",
              "html": "1) See a concrete example"
            },
            {
              "id": "2",
              "html": "2) Name the idea"
            },
            {
              "id": "3",
              "html": "3) Try a hands-on sort"
            },
            {
              "id": "4",
              "html": "4) Check with a quiz"
            }
          ],
          "correctIds": [
            "1",
            "2",
            "3",
            "4"
          ]
        },
        {
          "type": "quiz",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Quick check: Pipeline",
          "q": "Which best matches “pipe” in Machine Learning?",
          "opts": [
            "Collect → clean → train → check",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        },
        {
          "type": "scene3d",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Explore the 3D scene for Pipeline.",
          "html": "<p>Look at the themed 3D scene. Match the dock text to props you can actually see in the 3D scene.</p><p>Tip: <em>Deploy idea</em></p>"
        },
        {
          "type": "equation",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Build the idea sentence for pipe.",
          "tokens": [
            {
              "id": "t1",
              "html": "pipe"
            },
            {
              "id": "t2",
              "html": "explains"
            },
            {
              "id": "t3",
              "html": "Collect → clean →"
            }
          ]
        },
        {
          "type": "tap",
          "scene": "classroom",
          "viz": "compare",
          "coach": "📊 Level 8 · Step 8: explore pipe (symbolic).",
          "html": "<p><strong>Pipeline</strong></p><p>Collect → clean → train → check · Iterate · Deploy idea</p><p>Stage: symbolic. Use the interactive panel, then continue.</p>"
        },
        {
          "type": "drag",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Sort ideas about pipe.",
          "title": "Sort: Pipeline",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Collect → clean → train → check"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Iterate"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About pipe",
              "accept": [
                "a",
                "c"
              ]
            },
            {
              "id": "no",
              "label": "Not related",
              "accept": [
                "b",
                "d"
              ]
            }
          ]
        },
        {
          "type": "boss",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Boss check: Pipeline",
          "q": "Which best matches “pipe” in Machine Learning?",
          "opts": [
            "Collect → clean → train → check",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        }
      ]
    },
    {
      "kidTitle": "Responsible ML",
      "theme": "resp",
      "emoji": "📊",
      "rewardName": "Responsible Mentor",
      "intro": "In “Responsible ML” you learn resp through play - spiral from concrete actions to symbols (Bruner's theory). Props and panel match the idea.",
      "everyday": [
        "Bias",
        "Consent",
        "Human review"
      ],
      "scene": "classroom",
      "viz": "compare",
      "quiz": [
        {
          "q": "What is a good everyday example of “resp”?",
          "opts": [
            "Bias",
            "Ignoring the idea",
            "Deleting evidence",
            "Random guessing only"
          ],
          "ok": 0
        },
        {
          "q": "Bruner's spiral says we should…",
          "opts": [
            "Revisit ideas from concrete → abstract",
            "Only memorize forever",
            "Skip examples",
            "Never check understanding"
          ],
          "ok": 0
        },
        {
          "q": "In Machine Learning, “resp” most helps you…",
          "opts": [
            "Explain and apply the idea safely",
            "Avoid thinking",
            "Break lab rules",
            "Skip practice"
          ],
          "ok": 0
        }
      ],
      "subs": [
        {
          "type": "demo",
          "scene": "classroom",
          "viz": "compare",
          "coach": "📊 Level 9 · Step 1: explore resp (symbolic).",
          "html": "<p><strong>Responsible ML</strong> - watch the themed scene <em>and</em> the interactive panel.</p><p>Everyday hook: <em>Bias</em>.</p><p>Brunner stage: <strong>symbolic</strong> - start concrete, then build up.</p>"
        },
        {
          "type": "drag",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Sort ideas about resp.",
          "title": "Sort: Responsible ML",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Bias"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Consent"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About resp",
              "accept": [
                "a",
                "c"
              ]
            },
            {
              "id": "no",
              "label": "Not related",
              "accept": [
                "b",
                "d"
              ]
            }
          ]
        },
        {
          "type": "reveal",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Reveal examples for Responsible ML.",
          "title": "Responsible ML - unfold examples",
          "steps": [
            "Hook: Bias",
            "Notice: Consent connects to resp.",
            "Pattern: the same idea shows up in Human review.",
            "Takeaway: you can explain resp using the props you see."
          ]
        },
        {
          "type": "order",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Order the learning path for resp.",
          "items": [
            {
              "id": "1",
              "html": "1) See a concrete example"
            },
            {
              "id": "2",
              "html": "2) Name the idea"
            },
            {
              "id": "3",
              "html": "3) Try a hands-on sort"
            },
            {
              "id": "4",
              "html": "4) Check with a quiz"
            }
          ],
          "correctIds": [
            "1",
            "2",
            "3",
            "4"
          ]
        },
        {
          "type": "quiz",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Quick check: Responsible ML",
          "q": "Which best matches “resp” in Machine Learning?",
          "opts": [
            "Bias",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        },
        {
          "type": "scene3d",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Explore the 3D scene for Responsible ML.",
          "html": "<p>Look at the themed 3D scene. Match the dock text to props you can actually see in the 3D scene.</p><p>Tip: <em>Human review</em></p>"
        },
        {
          "type": "equation",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Build the idea sentence for resp.",
          "tokens": [
            {
              "id": "t1",
              "html": "resp"
            },
            {
              "id": "t2",
              "html": "explains"
            },
            {
              "id": "t3",
              "html": "Bias"
            }
          ]
        },
        {
          "type": "tap",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "📊 Level 9 · Step 8: explore resp (symbolic).",
          "html": "<p><strong>Responsible ML</strong></p><p>Bias · Consent · Human review</p><p>Stage: symbolic. Use the interactive panel, then continue.</p>"
        },
        {
          "type": "drag",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Sort ideas about resp.",
          "title": "Sort: Responsible ML",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Bias"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Consent"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About resp",
              "accept": [
                "a",
                "c"
              ]
            },
            {
              "id": "no",
              "label": "Not related",
              "accept": [
                "b",
                "d"
              ]
            }
          ]
        },
        {
          "type": "boss",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Boss check: Responsible ML",
          "q": "Which best matches “resp” in Machine Learning?",
          "opts": [
            "Bias",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        }
      ]
    },
    {
      "kidTitle": "ML Boss",
      "theme": "synthesis",
      "emoji": "📊",
      "rewardName": "ML Champion",
      "intro": "In “ML Boss” you learn synthesis through play - spiral from concrete actions to symbols (Bruner's theory). Props and panel match the idea.",
      "everyday": [
        "Pick a problem",
        "Choose features",
        "Explain a model"
      ],
      "scene": "classroomCount",
      "viz": "compare",
      "quiz": [
        {
          "q": "What is a good everyday example of “synthesis”?",
          "opts": [
            "Pick a problem",
            "Ignoring the idea",
            "Deleting evidence",
            "Random guessing only"
          ],
          "ok": 0
        },
        {
          "q": "Bruner's spiral says we should…",
          "opts": [
            "Revisit ideas from concrete → abstract",
            "Only memorize forever",
            "Skip examples",
            "Never check understanding"
          ],
          "ok": 0
        },
        {
          "q": "In Machine Learning, “synthesis” most helps you…",
          "opts": [
            "Explain and apply the idea safely",
            "Avoid thinking",
            "Break lab rules",
            "Skip practice"
          ],
          "ok": 0
        }
      ],
      "subs": [
        {
          "type": "demo",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "📊 Level 10 · Step 1: explore synthesis (synthesis).",
          "html": "<p><strong>ML Boss</strong> - watch the themed scene <em>and</em> the interactive panel.</p><p>Everyday hook: <em>Pick a problem</em>.</p><p>Brunner stage: <strong>synthesis</strong> - start concrete, then build up.</p>"
        },
        {
          "type": "drag",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Sort ideas about synthesis.",
          "title": "Sort: ML Boss",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Pick a problem"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Choose features"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About synthesis",
              "accept": [
                "a",
                "c"
              ]
            },
            {
              "id": "no",
              "label": "Not related",
              "accept": [
                "b",
                "d"
              ]
            }
          ]
        },
        {
          "type": "reveal",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Reveal examples for ML Boss.",
          "title": "ML Boss - unfold examples",
          "steps": [
            "Hook: Pick a problem",
            "Notice: Choose features connects to synthesis.",
            "Pattern: the same idea shows up in Explain a model.",
            "Takeaway: you can explain synthesis using the props you see."
          ]
        },
        {
          "type": "order",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Order the learning path for synthesis.",
          "items": [
            {
              "id": "1",
              "html": "1) See a concrete example"
            },
            {
              "id": "2",
              "html": "2) Name the idea"
            },
            {
              "id": "3",
              "html": "3) Try a hands-on sort"
            },
            {
              "id": "4",
              "html": "4) Check with a quiz"
            }
          ],
          "correctIds": [
            "1",
            "2",
            "3",
            "4"
          ]
        },
        {
          "type": "quiz",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Quick check: ML Boss",
          "q": "Which best matches “synthesis” in Machine Learning?",
          "opts": [
            "Pick a problem",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        },
        {
          "type": "scene3d",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Explore the 3D scene for ML Boss.",
          "html": "<p>Look at the themed 3D scene. Match the dock text to props you can actually see in the 3D scene.</p><p>Tip: <em>Explain a model</em></p>"
        },
        {
          "type": "equation",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Build the idea sentence for synthesis.",
          "tokens": [
            {
              "id": "t1",
              "html": "synthesis"
            },
            {
              "id": "t2",
              "html": "explains"
            },
            {
              "id": "t3",
              "html": "Pick a problem"
            }
          ]
        },
        {
          "type": "tap",
          "scene": "classroom",
          "viz": "compare",
          "coach": "📊 Level 10 · Step 8: explore synthesis (synthesis).",
          "html": "<p><strong>ML Boss</strong></p><p>Pick a problem · Choose features · Explain a model</p><p>Stage: synthesis. Use the interactive panel, then continue.</p>"
        },
        {
          "type": "drag",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Sort ideas about synthesis.",
          "title": "Sort: ML Boss",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Pick a problem"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Choose features"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About synthesis",
              "accept": [
                "a",
                "c"
              ]
            },
            {
              "id": "no",
              "label": "Not related",
              "accept": [
                "b",
                "d"
              ]
            }
          ]
        },
        {
          "type": "boss",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Boss check: ML Boss",
          "q": "Which best matches “synthesis” in Machine Learning?",
          "opts": [
            "Pick a problem",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        }
      ]
    }
  ]
};
