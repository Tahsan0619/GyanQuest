/** Auto-generated curriculum - 10 levels × 10 subs (Brunner spiral) */
export const curriculum = {
  "levels": [
    {
      "kidTitle": "Ask a Question",
      "theme": "ask",
      "emoji": "📈",
      "rewardName": "Ask Rookie",
      "intro": "In “Ask a Question” you learn ask through play - spiral from concrete actions to symbols (Bruner's theory). Props and panel match the idea.",
      "everyday": [
        "Class survey",
        "Rain vs sales",
        "Who is late?"
      ],
      "scene": "classroom",
      "viz": "compare",
      "quiz": [
        {
          "q": "What is a good everyday example of “ask”?",
          "opts": [
            "Class survey",
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
          "coach": "📈 Level 1 · Step 1: explore ask (enactive).",
          "html": "<p><strong>Ask a Question</strong> - watch the themed scene <em>and</em> the interactive panel.</p><p>Everyday hook: <em>Class survey</em>.</p><p>Brunner stage: <strong>enactive</strong> - start concrete, then build up.</p>"
        },
        {
          "type": "drag",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Sort ideas about ask.",
          "title": "Sort: Ask a Question",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Class survey"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Rain vs sales"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About ask",
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
          "coach": "Reveal examples for Ask a Question.",
          "title": "Ask a Question - unfold examples",
          "steps": [
            "Hook: Class survey",
            "Notice: Rain vs sales connects to ask.",
            "Pattern: the same idea shows up in Who is late?.",
            "Takeaway: you can explain ask using the props you see."
          ]
        },
        {
          "type": "order",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Order the learning path for ask.",
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
          "coach": "Quick check: Ask a Question",
          "q": "Which best matches “ask” in Data Science?",
          "opts": [
            "Class survey",
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
          "coach": "Explore the 3D scene for Ask a Question.",
          "html": "<p>Look at the themed 3D scene. Match the dock text to props you can actually see in the 3D scene.</p><p>Tip: <em>Who is late?</em></p>"
        },
        {
          "type": "equation",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Build the idea sentence for ask.",
          "tokens": [
            {
              "id": "t1",
              "html": "ask"
            },
            {
              "id": "t2",
              "html": "explains"
            },
            {
              "id": "t3",
              "html": "Class survey"
            }
          ]
        },
        {
          "type": "tap",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "📈 Level 1 · Step 8: explore ask (enactive).",
          "html": "<p><strong>Ask a Question</strong></p><p>Class survey · Rain vs sales · Who is late?</p><p>Stage: enactive. Use the interactive panel, then continue.</p>"
        },
        {
          "type": "drag",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Sort ideas about ask.",
          "title": "Sort: Ask a Question",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Class survey"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Rain vs sales"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About ask",
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
          "coach": "Boss check: Ask a Question",
          "q": "Which best matches “ask” in Data Science?",
          "opts": [
            "Class survey",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        }
      ]
    },
    {
      "kidTitle": "Collect Data",
      "theme": "collect",
      "emoji": "📈",
      "rewardName": "Collect Scout",
      "intro": "In “Collect Data” you learn collect through play - spiral from concrete actions to symbols (Bruner's theory). Props and panel match the idea.",
      "everyday": [
        "Forms",
        "Sensors",
        "Open data"
      ],
      "scene": "classroomCount",
      "viz": "compare",
      "quiz": [
        {
          "q": "What is a good everyday example of “collect”?",
          "opts": [
            "Forms",
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
          "coach": "📈 Level 2 · Step 1: explore collect (enactive).",
          "html": "<p><strong>Collect Data</strong> - watch the themed scene <em>and</em> the interactive panel.</p><p>Everyday hook: <em>Forms</em>.</p><p>Brunner stage: <strong>enactive</strong> - start concrete, then build up.</p>"
        },
        {
          "type": "drag",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Sort ideas about collect.",
          "title": "Sort: Collect Data",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Forms"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Sensors"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About collect",
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
          "coach": "Reveal examples for Collect Data.",
          "title": "Collect Data - unfold examples",
          "steps": [
            "Hook: Forms",
            "Notice: Sensors connects to collect.",
            "Pattern: the same idea shows up in Open data.",
            "Takeaway: you can explain collect using the props you see."
          ]
        },
        {
          "type": "order",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Order the learning path for collect.",
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
          "coach": "Quick check: Collect Data",
          "q": "Which best matches “collect” in Data Science?",
          "opts": [
            "Forms",
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
          "coach": "Explore the 3D scene for Collect Data.",
          "html": "<p>Look at the themed 3D scene. Match the dock text to props you can actually see in the 3D scene.</p><p>Tip: <em>Open data</em></p>"
        },
        {
          "type": "equation",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Build the idea sentence for collect.",
          "tokens": [
            {
              "id": "t1",
              "html": "collect"
            },
            {
              "id": "t2",
              "html": "explains"
            },
            {
              "id": "t3",
              "html": "Forms"
            }
          ]
        },
        {
          "type": "tap",
          "scene": "classroom",
          "viz": "compare",
          "coach": "📈 Level 2 · Step 8: explore collect (enactive).",
          "html": "<p><strong>Collect Data</strong></p><p>Forms · Sensors · Open data</p><p>Stage: enactive. Use the interactive panel, then continue.</p>"
        },
        {
          "type": "drag",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Sort ideas about collect.",
          "title": "Sort: Collect Data",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Forms"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Sensors"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About collect",
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
          "coach": "Boss check: Collect Data",
          "q": "Which best matches “collect” in Data Science?",
          "opts": [
            "Forms",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        }
      ]
    },
    {
      "kidTitle": "Clean Data",
      "theme": "clean",
      "emoji": "📈",
      "rewardName": "Clean Explorer",
      "intro": "In “Clean Data” you learn clean through play - spiral from concrete actions to symbols (Bruner's theory). Props and panel match the idea.",
      "everyday": [
        "Missing values",
        "Typos",
        "Duplicates"
      ],
      "scene": "classroom",
      "viz": "compare",
      "quiz": [
        {
          "q": "What is a good everyday example of “clean”?",
          "opts": [
            "Missing values",
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
          "coach": "📈 Level 3 · Step 1: explore clean (enactive).",
          "html": "<p><strong>Clean Data</strong> - watch the themed scene <em>and</em> the interactive panel.</p><p>Everyday hook: <em>Missing values</em>.</p><p>Brunner stage: <strong>enactive</strong> - start concrete, then build up.</p>"
        },
        {
          "type": "drag",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Sort ideas about clean.",
          "title": "Sort: Clean Data",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Missing values"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Typos"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About clean",
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
          "coach": "Reveal examples for Clean Data.",
          "title": "Clean Data - unfold examples",
          "steps": [
            "Hook: Missing values",
            "Notice: Typos connects to clean.",
            "Pattern: the same idea shows up in Duplicates.",
            "Takeaway: you can explain clean using the props you see."
          ]
        },
        {
          "type": "order",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Order the learning path for clean.",
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
          "coach": "Quick check: Clean Data",
          "q": "Which best matches “clean” in Data Science?",
          "opts": [
            "Missing values",
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
          "coach": "Explore the 3D scene for Clean Data.",
          "html": "<p>Look at the themed 3D scene. Match the dock text to props you can actually see in the 3D scene.</p><p>Tip: <em>Duplicates</em></p>"
        },
        {
          "type": "equation",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Build the idea sentence for clean.",
          "tokens": [
            {
              "id": "t1",
              "html": "clean"
            },
            {
              "id": "t2",
              "html": "explains"
            },
            {
              "id": "t3",
              "html": "Missing values"
            }
          ]
        },
        {
          "type": "tap",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "📈 Level 3 · Step 8: explore clean (enactive).",
          "html": "<p><strong>Clean Data</strong></p><p>Missing values · Typos · Duplicates</p><p>Stage: enactive. Use the interactive panel, then continue.</p>"
        },
        {
          "type": "drag",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Sort ideas about clean.",
          "title": "Sort: Clean Data",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Missing values"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Typos"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About clean",
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
          "coach": "Boss check: Clean Data",
          "q": "Which best matches “clean” in Data Science?",
          "opts": [
            "Missing values",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        }
      ]
    },
    {
      "kidTitle": "Describe",
      "theme": "describe",
      "emoji": "📈",
      "rewardName": "Describe Builder",
      "intro": "In “Describe” you learn describe through play - spiral from concrete actions to symbols (Bruner's theory). Props and panel match the idea.",
      "everyday": [
        "Mean",
        "Median",
        "Spread"
      ],
      "scene": "classroomCount",
      "viz": "compare",
      "quiz": [
        {
          "q": "What is a good everyday example of “describe”?",
          "opts": [
            "Mean",
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
          "coach": "📈 Level 4 · Step 1: explore describe (iconic).",
          "html": "<p><strong>Describe</strong> - watch the themed scene <em>and</em> the interactive panel.</p><p>Everyday hook: <em>Mean</em>.</p><p>Brunner stage: <strong>iconic</strong> - start concrete, then build up.</p>"
        },
        {
          "type": "drag",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Sort ideas about describe.",
          "title": "Sort: Describe",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Mean"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Median"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About describe",
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
          "coach": "Reveal examples for Describe.",
          "title": "Describe - unfold examples",
          "steps": [
            "Hook: Mean",
            "Notice: Median connects to describe.",
            "Pattern: the same idea shows up in Spread.",
            "Takeaway: you can explain describe using the props you see."
          ]
        },
        {
          "type": "order",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Order the learning path for describe.",
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
          "coach": "Quick check: Describe",
          "q": "Which best matches “describe” in Data Science?",
          "opts": [
            "Mean",
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
          "coach": "Explore the 3D scene for Describe.",
          "html": "<p>Look at the themed 3D scene. Match the dock text to props you can actually see in the 3D scene.</p><p>Tip: <em>Spread</em></p>"
        },
        {
          "type": "equation",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Build the idea sentence for describe.",
          "tokens": [
            {
              "id": "t1",
              "html": "describe"
            },
            {
              "id": "t2",
              "html": "explains"
            },
            {
              "id": "t3",
              "html": "Mean"
            }
          ]
        },
        {
          "type": "tap",
          "scene": "classroom",
          "viz": "compare",
          "coach": "📈 Level 4 · Step 8: explore describe (iconic).",
          "html": "<p><strong>Describe</strong></p><p>Mean · Median · Spread</p><p>Stage: iconic. Use the interactive panel, then continue.</p>"
        },
        {
          "type": "drag",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Sort ideas about describe.",
          "title": "Sort: Describe",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Mean"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Median"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About describe",
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
          "coach": "Boss check: Describe",
          "q": "Which best matches “describe” in Data Science?",
          "opts": [
            "Mean",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        }
      ]
    },
    {
      "kidTitle": "Visualize",
      "theme": "viz",
      "emoji": "📈",
      "rewardName": "Visualize Analyst",
      "intro": "In “Visualize” you learn viz through play - spiral from concrete actions to symbols (Bruner's theory). Props and panel match the idea.",
      "everyday": [
        "Bar chart",
        "Line trend",
        "Pie caution"
      ],
      "scene": "classroom",
      "viz": "compare",
      "quiz": [
        {
          "q": "What is a good everyday example of “viz”?",
          "opts": [
            "Bar chart",
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
          "coach": "📈 Level 5 · Step 1: explore viz (iconic).",
          "html": "<p><strong>Visualize</strong> - watch the themed scene <em>and</em> the interactive panel.</p><p>Everyday hook: <em>Bar chart</em>.</p><p>Brunner stage: <strong>iconic</strong> - start concrete, then build up.</p>"
        },
        {
          "type": "drag",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Sort ideas about viz.",
          "title": "Sort: Visualize",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Bar chart"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Line trend"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About viz",
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
          "coach": "Reveal examples for Visualize.",
          "title": "Visualize - unfold examples",
          "steps": [
            "Hook: Bar chart",
            "Notice: Line trend connects to viz.",
            "Pattern: the same idea shows up in Pie caution.",
            "Takeaway: you can explain viz using the props you see."
          ]
        },
        {
          "type": "order",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Order the learning path for viz.",
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
          "coach": "Quick check: Visualize",
          "q": "Which best matches “viz” in Data Science?",
          "opts": [
            "Bar chart",
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
          "coach": "Explore the 3D scene for Visualize.",
          "html": "<p>Look at the themed 3D scene. Match the dock text to props you can actually see in the 3D scene.</p><p>Tip: <em>Pie caution</em></p>"
        },
        {
          "type": "equation",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Build the idea sentence for viz.",
          "tokens": [
            {
              "id": "t1",
              "html": "viz"
            },
            {
              "id": "t2",
              "html": "explains"
            },
            {
              "id": "t3",
              "html": "Bar chart"
            }
          ]
        },
        {
          "type": "tap",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "📈 Level 5 · Step 8: explore viz (iconic).",
          "html": "<p><strong>Visualize</strong></p><p>Bar chart · Line trend · Pie caution</p><p>Stage: iconic. Use the interactive panel, then continue.</p>"
        },
        {
          "type": "drag",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Sort ideas about viz.",
          "title": "Sort: Visualize",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Bar chart"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Line trend"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About viz",
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
          "coach": "Boss check: Visualize",
          "q": "Which best matches “viz” in Data Science?",
          "opts": [
            "Bar chart",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        }
      ]
    },
    {
      "kidTitle": "Correlate",
      "theme": "corr",
      "emoji": "📈",
      "rewardName": "Correlate Strategist",
      "intro": "In “Correlate” you learn corr through play - spiral from concrete actions to symbols (Bruner's theory). Props and panel match the idea.",
      "everyday": [
        "Related ≠ cause",
        "Scatter idea",
        "Confounders"
      ],
      "scene": "classroomCount",
      "viz": "compare",
      "quiz": [
        {
          "q": "What is a good everyday example of “corr”?",
          "opts": [
            "Related ≠ cause",
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
          "coach": "📈 Level 6 · Step 1: explore corr (iconic).",
          "html": "<p><strong>Correlate</strong> - watch the themed scene <em>and</em> the interactive panel.</p><p>Everyday hook: <em>Related ≠ cause</em>.</p><p>Brunner stage: <strong>iconic</strong> - start concrete, then build up.</p>"
        },
        {
          "type": "drag",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Sort ideas about corr.",
          "title": "Sort: Correlate",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Related ≠ cause"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Scatter idea"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About corr",
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
          "coach": "Reveal examples for Correlate.",
          "title": "Correlate - unfold examples",
          "steps": [
            "Hook: Related ≠ cause",
            "Notice: Scatter idea connects to corr.",
            "Pattern: the same idea shows up in Confounders.",
            "Takeaway: you can explain corr using the props you see."
          ]
        },
        {
          "type": "order",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Order the learning path for corr.",
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
          "coach": "Quick check: Correlate",
          "q": "Which best matches “corr” in Data Science?",
          "opts": [
            "Related ≠ cause",
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
          "coach": "Explore the 3D scene for Correlate.",
          "html": "<p>Look at the themed 3D scene. Match the dock text to props you can actually see in the 3D scene.</p><p>Tip: <em>Confounders</em></p>"
        },
        {
          "type": "equation",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Build the idea sentence for corr.",
          "tokens": [
            {
              "id": "t1",
              "html": "corr"
            },
            {
              "id": "t2",
              "html": "explains"
            },
            {
              "id": "t3",
              "html": "Related ≠ cause"
            }
          ]
        },
        {
          "type": "tap",
          "scene": "classroom",
          "viz": "compare",
          "coach": "📈 Level 6 · Step 8: explore corr (iconic).",
          "html": "<p><strong>Correlate</strong></p><p>Related ≠ cause · Scatter idea · Confounders</p><p>Stage: iconic. Use the interactive panel, then continue.</p>"
        },
        {
          "type": "drag",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Sort ideas about corr.",
          "title": "Sort: Correlate",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Related ≠ cause"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Scatter idea"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About corr",
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
          "coach": "Boss check: Correlate",
          "q": "Which best matches “corr” in Data Science?",
          "opts": [
            "Related ≠ cause",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        }
      ]
    },
    {
      "kidTitle": "Probability Lite",
      "theme": "prob",
      "emoji": "📈",
      "rewardName": "Probability Guardian",
      "intro": "In “Probability Lite” you learn prob through play - spiral from concrete actions to symbols (Bruner's theory). Props and panel match the idea.",
      "everyday": [
        "Chance rain",
        "Dice",
        "Uncertainty"
      ],
      "scene": "classroom",
      "viz": "compare",
      "quiz": [
        {
          "q": "What is a good everyday example of “prob”?",
          "opts": [
            "Chance rain",
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
          "coach": "📈 Level 7 · Step 1: explore prob (symbolic).",
          "html": "<p><strong>Probability Lite</strong> - watch the themed scene <em>and</em> the interactive panel.</p><p>Everyday hook: <em>Chance rain</em>.</p><p>Brunner stage: <strong>symbolic</strong> - start concrete, then build up.</p>"
        },
        {
          "type": "drag",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Sort ideas about prob.",
          "title": "Sort: Probability Lite",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Chance rain"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Dice"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About prob",
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
          "coach": "Reveal examples for Probability Lite.",
          "title": "Probability Lite - unfold examples",
          "steps": [
            "Hook: Chance rain",
            "Notice: Dice connects to prob.",
            "Pattern: the same idea shows up in Uncertainty.",
            "Takeaway: you can explain prob using the props you see."
          ]
        },
        {
          "type": "order",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Order the learning path for prob.",
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
          "coach": "Quick check: Probability Lite",
          "q": "Which best matches “prob” in Data Science?",
          "opts": [
            "Chance rain",
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
          "coach": "Explore the 3D scene for Probability Lite.",
          "html": "<p>Look at the themed 3D scene. Match the dock text to props you can actually see in the 3D scene.</p><p>Tip: <em>Uncertainty</em></p>"
        },
        {
          "type": "equation",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Build the idea sentence for prob.",
          "tokens": [
            {
              "id": "t1",
              "html": "prob"
            },
            {
              "id": "t2",
              "html": "explains"
            },
            {
              "id": "t3",
              "html": "Chance rain"
            }
          ]
        },
        {
          "type": "tap",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "📈 Level 7 · Step 8: explore prob (symbolic).",
          "html": "<p><strong>Probability Lite</strong></p><p>Chance rain · Dice · Uncertainty</p><p>Stage: symbolic. Use the interactive panel, then continue.</p>"
        },
        {
          "type": "drag",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Sort ideas about prob.",
          "title": "Sort: Probability Lite",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Chance rain"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Dice"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About prob",
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
          "coach": "Boss check: Probability Lite",
          "q": "Which best matches “prob” in Data Science?",
          "opts": [
            "Chance rain",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        }
      ]
    },
    {
      "kidTitle": "Insight",
      "theme": "insight",
      "emoji": "📈",
      "rewardName": "Insight Scholar",
      "intro": "In “Insight” you learn insight through play - spiral from concrete actions to symbols (Bruner's theory). Props and panel match the idea.",
      "everyday": [
        "What changed?",
        "Who benefits?",
        "Action"
      ],
      "scene": "classroomCount",
      "viz": "compare",
      "quiz": [
        {
          "q": "What is a good everyday example of “insight”?",
          "opts": [
            "What changed?",
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
          "q": "In Data Science, “insight” most helps you…",
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
          "coach": "📈 Level 8 · Step 1: explore insight (symbolic).",
          "html": "<p><strong>Insight</strong> - watch the themed scene <em>and</em> the interactive panel.</p><p>Everyday hook: <em>What changed?</em>.</p><p>Brunner stage: <strong>symbolic</strong> - start concrete, then build up.</p>"
        },
        {
          "type": "drag",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Sort ideas about insight.",
          "title": "Sort: Insight",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "What changed?"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Who benefits?"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About insight",
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
          "coach": "Reveal examples for Insight.",
          "title": "Insight - unfold examples",
          "steps": [
            "Hook: What changed?",
            "Notice: Who benefits? connects to insight.",
            "Pattern: the same idea shows up in Action.",
            "Takeaway: you can explain insight using the props you see."
          ]
        },
        {
          "type": "order",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Order the learning path for insight.",
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
          "coach": "Quick check: Insight",
          "q": "Which best matches “insight” in Data Science?",
          "opts": [
            "What changed?",
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
          "coach": "Explore the 3D scene for Insight.",
          "html": "<p>Look at the themed 3D scene. Match the dock text to props you can actually see in the 3D scene.</p><p>Tip: <em>Action</em></p>"
        },
        {
          "type": "equation",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Build the idea sentence for insight.",
          "tokens": [
            {
              "id": "t1",
              "html": "insight"
            },
            {
              "id": "t2",
              "html": "explains"
            },
            {
              "id": "t3",
              "html": "What changed?"
            }
          ]
        },
        {
          "type": "tap",
          "scene": "classroom",
          "viz": "compare",
          "coach": "📈 Level 8 · Step 8: explore insight (symbolic).",
          "html": "<p><strong>Insight</strong></p><p>What changed? · Who benefits? · Action</p><p>Stage: symbolic. Use the interactive panel, then continue.</p>"
        },
        {
          "type": "drag",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Sort ideas about insight.",
          "title": "Sort: Insight",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "What changed?"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Who benefits?"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About insight",
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
          "coach": "Boss check: Insight",
          "q": "Which best matches “insight” in Data Science?",
          "opts": [
            "What changed?",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        }
      ]
    },
    {
      "kidTitle": "Communicate",
      "theme": "comms",
      "emoji": "📈",
      "rewardName": "Communicate Mentor",
      "intro": "In “Communicate” you learn comms through play - spiral from concrete actions to symbols (Bruner's theory). Props and panel match the idea.",
      "everyday": [
        "Clear title",
        "Honest axis",
        "Audience"
      ],
      "scene": "classroom",
      "viz": "compare",
      "quiz": [
        {
          "q": "What is a good everyday example of “comms”?",
          "opts": [
            "Clear title",
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
          "q": "In Data Science, “comms” most helps you…",
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
          "coach": "📈 Level 9 · Step 1: explore comms (symbolic).",
          "html": "<p><strong>Communicate</strong> - watch the themed scene <em>and</em> the interactive panel.</p><p>Everyday hook: <em>Clear title</em>.</p><p>Brunner stage: <strong>symbolic</strong> - start concrete, then build up.</p>"
        },
        {
          "type": "drag",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Sort ideas about comms.",
          "title": "Sort: Communicate",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Clear title"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Honest axis"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About comms",
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
          "coach": "Reveal examples for Communicate.",
          "title": "Communicate - unfold examples",
          "steps": [
            "Hook: Clear title",
            "Notice: Honest axis connects to comms.",
            "Pattern: the same idea shows up in Audience.",
            "Takeaway: you can explain comms using the props you see."
          ]
        },
        {
          "type": "order",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Order the learning path for comms.",
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
          "coach": "Quick check: Communicate",
          "q": "Which best matches “comms” in Data Science?",
          "opts": [
            "Clear title",
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
          "coach": "Explore the 3D scene for Communicate.",
          "html": "<p>Look at the themed 3D scene. Match the dock text to props you can actually see in the 3D scene.</p><p>Tip: <em>Audience</em></p>"
        },
        {
          "type": "equation",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Build the idea sentence for comms.",
          "tokens": [
            {
              "id": "t1",
              "html": "comms"
            },
            {
              "id": "t2",
              "html": "explains"
            },
            {
              "id": "t3",
              "html": "Clear title"
            }
          ]
        },
        {
          "type": "tap",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "📈 Level 9 · Step 8: explore comms (symbolic).",
          "html": "<p><strong>Communicate</strong></p><p>Clear title · Honest axis · Audience</p><p>Stage: symbolic. Use the interactive panel, then continue.</p>"
        },
        {
          "type": "drag",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Sort ideas about comms.",
          "title": "Sort: Communicate",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Clear title"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Honest axis"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About comms",
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
          "coach": "Boss check: Communicate",
          "q": "Which best matches “comms” in Data Science?",
          "opts": [
            "Clear title",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        }
      ]
    },
    {
      "kidTitle": "Data Boss",
      "theme": "synthesis",
      "emoji": "📈",
      "rewardName": "Data Champion",
      "intro": "In “Data Boss” you learn synthesis through play - spiral from concrete actions to symbols (Bruner's theory). Props and panel match the idea.",
      "everyday": [
        "End-to-end mini project",
        "Critique a chart",
        "Decide with data"
      ],
      "scene": "classroomCount",
      "viz": "compare",
      "quiz": [
        {
          "q": "What is a good everyday example of “synthesis”?",
          "opts": [
            "End-to-end mini project",
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
          "q": "In Data Science, “synthesis” most helps you…",
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
          "coach": "📈 Level 10 · Step 1: explore synthesis (synthesis).",
          "html": "<p><strong>Data Boss</strong> - watch the themed scene <em>and</em> the interactive panel.</p><p>Everyday hook: <em>End-to-end mini project</em>.</p><p>Brunner stage: <strong>synthesis</strong> - start concrete, then build up.</p>"
        },
        {
          "type": "drag",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Sort ideas about synthesis.",
          "title": "Sort: Data Boss",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "End-to-end mini project"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Critique a chart"
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
          "coach": "Reveal examples for Data Boss.",
          "title": "Data Boss - unfold examples",
          "steps": [
            "Hook: End-to-end mini project",
            "Notice: Critique a chart connects to synthesis.",
            "Pattern: the same idea shows up in Decide with data.",
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
          "coach": "Quick check: Data Boss",
          "q": "Which best matches “synthesis” in Data Science?",
          "opts": [
            "End-to-end mini project",
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
          "coach": "Explore the 3D scene for Data Boss.",
          "html": "<p>Look at the themed 3D scene. Match the dock text to props you can actually see in the 3D scene.</p><p>Tip: <em>Decide with data</em></p>"
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
              "html": "End-to-end mini project"
            }
          ]
        },
        {
          "type": "tap",
          "scene": "classroom",
          "viz": "compare",
          "coach": "📈 Level 10 · Step 8: explore synthesis (synthesis).",
          "html": "<p><strong>Data Boss</strong></p><p>End-to-end mini project · Critique a chart · Decide with data</p><p>Stage: synthesis. Use the interactive panel, then continue.</p>"
        },
        {
          "type": "drag",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Sort ideas about synthesis.",
          "title": "Sort: Data Boss",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "End-to-end mini project"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Critique a chart"
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
          "coach": "Boss check: Data Boss",
          "q": "Which best matches “synthesis” in Data Science?",
          "opts": [
            "End-to-end mini project",
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
