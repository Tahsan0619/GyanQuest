/** Auto-generated curriculum - 10 levels × 10 subs (Brunner spiral) */
export const curriculum = {
  "levels": [
    {
      "kidTitle": "Inside the Box",
      "theme": "hw",
      "emoji": "⚙️",
      "rewardName": "Inside Rookie",
      "intro": "In “Inside the Box” you learn hw through play - spiral from concrete actions to symbols (Bruner's theory). Props and panel match the idea.",
      "everyday": [
        "CPU brain",
        "RAM desk",
        "Storage shelf"
      ],
      "scene": "factory",
      "viz": "machines",
      "quiz": [
        {
          "q": "What is a good everyday example of “hw”?",
          "opts": [
            "CPU brain",
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
          "scene": "factory",
          "viz": "machines",
          "coach": "⚙️ Level 1 · Step 1: explore hw (enactive).",
          "html": "<p><strong>Inside the Box</strong> - watch the themed scene <em>and</em> the interactive panel.</p><p>Everyday hook: <em>CPU brain</em>.</p><p>Brunner stage: <strong>enactive</strong> - start concrete, then build up.</p>"
        },
        {
          "type": "drag",
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "Sort ideas about hw.",
          "title": "Sort: Inside the Box",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "CPU brain"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "RAM desk"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About hw",
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
          "scene": "factory",
          "viz": "machines",
          "coach": "Reveal examples for Inside the Box.",
          "title": "Inside the Box - unfold examples",
          "steps": [
            "Hook: CPU brain",
            "Notice: RAM desk connects to hw.",
            "Pattern: the same idea shows up in Storage shelf.",
            "Takeaway: you can explain hw using the props you see."
          ]
        },
        {
          "type": "order",
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "Order the learning path for hw.",
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
          "scene": "factory",
          "viz": "machines",
          "coach": "Quick check: Inside the Box",
          "q": "Which best matches “hw” in OS & Hardware?",
          "opts": [
            "CPU brain",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        },
        {
          "type": "scene3d",
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "Explore the 3D scene for Inside the Box.",
          "html": "<p>Look at the themed 3D scene. Match the dock text to props you can actually see in the 3D scene.</p><p>Tip: <em>Storage shelf</em></p>"
        },
        {
          "type": "equation",
          "scene": "factory",
          "viz": "machines",
          "coach": "Build the idea sentence for hw.",
          "tokens": [
            {
              "id": "t1",
              "html": "hw"
            },
            {
              "id": "t2",
              "html": "explains"
            },
            {
              "id": "t3",
              "html": "CPU brain"
            }
          ]
        },
        {
          "type": "tap",
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "⚙️ Level 1 · Step 8: explore hw (enactive).",
          "html": "<p><strong>Inside the Box</strong></p><p>CPU brain · RAM desk · Storage shelf</p><p>Stage: enactive. Use the interactive panel, then continue.</p>"
        },
        {
          "type": "drag",
          "scene": "factory",
          "viz": "machines",
          "coach": "Sort ideas about hw.",
          "title": "Sort: Inside the Box",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "CPU brain"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "RAM desk"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About hw",
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
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "Boss check: Inside the Box",
          "q": "Which best matches “hw” in OS & Hardware?",
          "opts": [
            "CPU brain",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        }
      ]
    },
    {
      "kidTitle": "What OS Does",
      "theme": "os",
      "emoji": "⚙️",
      "rewardName": "What Scout",
      "intro": "In “What OS Does” you learn os through play - spiral from concrete actions to symbols (Bruner's theory). Props and panel match the idea.",
      "everyday": [
        "Traffic manager",
        "File keeper",
        "App launcher"
      ],
      "scene": "factoryFlow",
      "viz": "machines",
      "quiz": [
        {
          "q": "What is a good everyday example of “os”?",
          "opts": [
            "Traffic manager",
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
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "⚙️ Level 2 · Step 1: explore os (enactive).",
          "html": "<p><strong>What OS Does</strong> - watch the themed scene <em>and</em> the interactive panel.</p><p>Everyday hook: <em>Traffic manager</em>.</p><p>Brunner stage: <strong>enactive</strong> - start concrete, then build up.</p>"
        },
        {
          "type": "drag",
          "scene": "factory",
          "viz": "machines",
          "coach": "Sort ideas about os.",
          "title": "Sort: What OS Does",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Traffic manager"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "File keeper"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About os",
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
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "Reveal examples for What OS Does.",
          "title": "What OS Does - unfold examples",
          "steps": [
            "Hook: Traffic manager",
            "Notice: File keeper connects to os.",
            "Pattern: the same idea shows up in App launcher.",
            "Takeaway: you can explain os using the props you see."
          ]
        },
        {
          "type": "order",
          "scene": "factory",
          "viz": "machines",
          "coach": "Order the learning path for os.",
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
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "Quick check: What OS Does",
          "q": "Which best matches “os” in OS & Hardware?",
          "opts": [
            "Traffic manager",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        },
        {
          "type": "scene3d",
          "scene": "factory",
          "viz": "machines",
          "coach": "Explore the 3D scene for What OS Does.",
          "html": "<p>Look at the themed 3D scene. Match the dock text to props you can actually see in the 3D scene.</p><p>Tip: <em>App launcher</em></p>"
        },
        {
          "type": "equation",
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "Build the idea sentence for os.",
          "tokens": [
            {
              "id": "t1",
              "html": "os"
            },
            {
              "id": "t2",
              "html": "explains"
            },
            {
              "id": "t3",
              "html": "Traffic manager"
            }
          ]
        },
        {
          "type": "tap",
          "scene": "factory",
          "viz": "machines",
          "coach": "⚙️ Level 2 · Step 8: explore os (enactive).",
          "html": "<p><strong>What OS Does</strong></p><p>Traffic manager · File keeper · App launcher</p><p>Stage: enactive. Use the interactive panel, then continue.</p>"
        },
        {
          "type": "drag",
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "Sort ideas about os.",
          "title": "Sort: What OS Does",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Traffic manager"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "File keeper"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About os",
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
          "scene": "factory",
          "viz": "machines",
          "coach": "Boss check: What OS Does",
          "q": "Which best matches “os” in OS & Hardware?",
          "opts": [
            "Traffic manager",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        }
      ]
    },
    {
      "kidTitle": "Processes",
      "theme": "proc",
      "emoji": "⚙️",
      "rewardName": "Processes Explorer",
      "intro": "In “Processes” you learn proc through play - spiral from concrete actions to symbols (Bruner's theory). Props and panel match the idea.",
      "everyday": [
        "Apps as workers",
        "Multitasking",
        "Freeze & kill"
      ],
      "scene": "factory",
      "viz": "machines",
      "quiz": [
        {
          "q": "What is a good everyday example of “proc”?",
          "opts": [
            "Apps as workers",
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
          "scene": "factory",
          "viz": "machines",
          "coach": "⚙️ Level 3 · Step 1: explore proc (enactive).",
          "html": "<p><strong>Processes</strong> - watch the themed scene <em>and</em> the interactive panel.</p><p>Everyday hook: <em>Apps as workers</em>.</p><p>Brunner stage: <strong>enactive</strong> - start concrete, then build up.</p>"
        },
        {
          "type": "drag",
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "Sort ideas about proc.",
          "title": "Sort: Processes",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Apps as workers"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Multitasking"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About proc",
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
          "scene": "factory",
          "viz": "machines",
          "coach": "Reveal examples for Processes.",
          "title": "Processes - unfold examples",
          "steps": [
            "Hook: Apps as workers",
            "Notice: Multitasking connects to proc.",
            "Pattern: the same idea shows up in Freeze & kill.",
            "Takeaway: you can explain proc using the props you see."
          ]
        },
        {
          "type": "order",
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "Order the learning path for proc.",
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
          "scene": "factory",
          "viz": "machines",
          "coach": "Quick check: Processes",
          "q": "Which best matches “proc” in OS & Hardware?",
          "opts": [
            "Apps as workers",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        },
        {
          "type": "scene3d",
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "Explore the 3D scene for Processes.",
          "html": "<p>Look at the themed 3D scene. Match the dock text to props you can actually see in the 3D scene.</p><p>Tip: <em>Freeze & kill</em></p>"
        },
        {
          "type": "equation",
          "scene": "factory",
          "viz": "machines",
          "coach": "Build the idea sentence for proc.",
          "tokens": [
            {
              "id": "t1",
              "html": "proc"
            },
            {
              "id": "t2",
              "html": "explains"
            },
            {
              "id": "t3",
              "html": "Apps as workers"
            }
          ]
        },
        {
          "type": "tap",
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "⚙️ Level 3 · Step 8: explore proc (enactive).",
          "html": "<p><strong>Processes</strong></p><p>Apps as workers · Multitasking · Freeze & kill</p><p>Stage: enactive. Use the interactive panel, then continue.</p>"
        },
        {
          "type": "drag",
          "scene": "factory",
          "viz": "machines",
          "coach": "Sort ideas about proc.",
          "title": "Sort: Processes",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Apps as workers"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Multitasking"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About proc",
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
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "Boss check: Processes",
          "q": "Which best matches “proc” in OS & Hardware?",
          "opts": [
            "Apps as workers",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        }
      ]
    },
    {
      "kidTitle": "Memory",
      "theme": "mem",
      "emoji": "⚙️",
      "rewardName": "Memory Builder",
      "intro": "In “Memory” you learn mem through play - spiral from concrete actions to symbols (Bruner's theory). Props and panel match the idea.",
      "everyday": [
        "Short-term desk",
        "Full RAM lag",
        "Swap idea"
      ],
      "scene": "factoryFlow",
      "viz": "machines",
      "quiz": [
        {
          "q": "What is a good everyday example of “mem”?",
          "opts": [
            "Short-term desk",
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
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "⚙️ Level 4 · Step 1: explore mem (iconic).",
          "html": "<p><strong>Memory</strong> - watch the themed scene <em>and</em> the interactive panel.</p><p>Everyday hook: <em>Short-term desk</em>.</p><p>Brunner stage: <strong>iconic</strong> - start concrete, then build up.</p>"
        },
        {
          "type": "drag",
          "scene": "factory",
          "viz": "machines",
          "coach": "Sort ideas about mem.",
          "title": "Sort: Memory",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Short-term desk"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Full RAM lag"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About mem",
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
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "Reveal examples for Memory.",
          "title": "Memory - unfold examples",
          "steps": [
            "Hook: Short-term desk",
            "Notice: Full RAM lag connects to mem.",
            "Pattern: the same idea shows up in Swap idea.",
            "Takeaway: you can explain mem using the props you see."
          ]
        },
        {
          "type": "order",
          "scene": "factory",
          "viz": "machines",
          "coach": "Order the learning path for mem.",
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
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "Quick check: Memory",
          "q": "Which best matches “mem” in OS & Hardware?",
          "opts": [
            "Short-term desk",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        },
        {
          "type": "scene3d",
          "scene": "factory",
          "viz": "machines",
          "coach": "Explore the 3D scene for Memory.",
          "html": "<p>Look at the themed 3D scene. Match the dock text to props you can actually see in the 3D scene.</p><p>Tip: <em>Swap idea</em></p>"
        },
        {
          "type": "equation",
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "Build the idea sentence for mem.",
          "tokens": [
            {
              "id": "t1",
              "html": "mem"
            },
            {
              "id": "t2",
              "html": "explains"
            },
            {
              "id": "t3",
              "html": "Short-term desk"
            }
          ]
        },
        {
          "type": "tap",
          "scene": "factory",
          "viz": "machines",
          "coach": "⚙️ Level 4 · Step 8: explore mem (iconic).",
          "html": "<p><strong>Memory</strong></p><p>Short-term desk · Full RAM lag · Swap idea</p><p>Stage: iconic. Use the interactive panel, then continue.</p>"
        },
        {
          "type": "drag",
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "Sort ideas about mem.",
          "title": "Sort: Memory",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Short-term desk"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Full RAM lag"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About mem",
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
          "scene": "factory",
          "viz": "machines",
          "coach": "Boss check: Memory",
          "q": "Which best matches “mem” in OS & Hardware?",
          "opts": [
            "Short-term desk",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        }
      ]
    },
    {
      "kidTitle": "Storage",
      "theme": "disk",
      "emoji": "⚙️",
      "rewardName": "Storage Analyst",
      "intro": "In “Storage” you learn disk through play - spiral from concrete actions to symbols (Bruner's theory). Props and panel match the idea.",
      "everyday": [
        "SSD vs HDD idea",
        "Files on disk",
        "Free space"
      ],
      "scene": "factory",
      "viz": "machines",
      "quiz": [
        {
          "q": "What is a good everyday example of “disk”?",
          "opts": [
            "SSD vs HDD idea",
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
          "scene": "factory",
          "viz": "machines",
          "coach": "⚙️ Level 5 · Step 1: explore disk (iconic).",
          "html": "<p><strong>Storage</strong> - watch the themed scene <em>and</em> the interactive panel.</p><p>Everyday hook: <em>SSD vs HDD idea</em>.</p><p>Brunner stage: <strong>iconic</strong> - start concrete, then build up.</p>"
        },
        {
          "type": "drag",
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "Sort ideas about disk.",
          "title": "Sort: Storage",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "SSD vs HDD idea"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Files on disk"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About disk",
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
          "scene": "factory",
          "viz": "machines",
          "coach": "Reveal examples for Storage.",
          "title": "Storage - unfold examples",
          "steps": [
            "Hook: SSD vs HDD idea",
            "Notice: Files on disk connects to disk.",
            "Pattern: the same idea shows up in Free space.",
            "Takeaway: you can explain disk using the props you see."
          ]
        },
        {
          "type": "order",
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "Order the learning path for disk.",
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
          "scene": "factory",
          "viz": "machines",
          "coach": "Quick check: Storage",
          "q": "Which best matches “disk” in OS & Hardware?",
          "opts": [
            "SSD vs HDD idea",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        },
        {
          "type": "scene3d",
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "Explore the 3D scene for Storage.",
          "html": "<p>Look at the themed 3D scene. Match the dock text to props you can actually see in the 3D scene.</p><p>Tip: <em>Free space</em></p>"
        },
        {
          "type": "equation",
          "scene": "factory",
          "viz": "machines",
          "coach": "Build the idea sentence for disk.",
          "tokens": [
            {
              "id": "t1",
              "html": "disk"
            },
            {
              "id": "t2",
              "html": "explains"
            },
            {
              "id": "t3",
              "html": "SSD vs HDD idea"
            }
          ]
        },
        {
          "type": "tap",
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "⚙️ Level 5 · Step 8: explore disk (iconic).",
          "html": "<p><strong>Storage</strong></p><p>SSD vs HDD idea · Files on disk · Free space</p><p>Stage: iconic. Use the interactive panel, then continue.</p>"
        },
        {
          "type": "drag",
          "scene": "factory",
          "viz": "machines",
          "coach": "Sort ideas about disk.",
          "title": "Sort: Storage",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "SSD vs HDD idea"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Files on disk"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About disk",
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
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "Boss check: Storage",
          "q": "Which best matches “disk” in OS & Hardware?",
          "opts": [
            "SSD vs HDD idea",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        }
      ]
    },
    {
      "kidTitle": "Drivers",
      "theme": "drivers",
      "emoji": "⚙️",
      "rewardName": "Drivers Strategist",
      "intro": "In “Drivers” you learn drivers through play - spiral from concrete actions to symbols (Bruner's theory). Props and panel match the idea.",
      "everyday": [
        "Translators",
        "Printer needs driver",
        "Updates"
      ],
      "scene": "factoryFlow",
      "viz": "machines",
      "quiz": [
        {
          "q": "What is a good everyday example of “drivers”?",
          "opts": [
            "Translators",
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
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "⚙️ Level 6 · Step 1: explore drivers (iconic).",
          "html": "<p><strong>Drivers</strong> - watch the themed scene <em>and</em> the interactive panel.</p><p>Everyday hook: <em>Translators</em>.</p><p>Brunner stage: <strong>iconic</strong> - start concrete, then build up.</p>"
        },
        {
          "type": "drag",
          "scene": "factory",
          "viz": "machines",
          "coach": "Sort ideas about drivers.",
          "title": "Sort: Drivers",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Translators"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Printer needs driver"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About drivers",
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
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "Reveal examples for Drivers.",
          "title": "Drivers - unfold examples",
          "steps": [
            "Hook: Translators",
            "Notice: Printer needs driver connects to drivers.",
            "Pattern: the same idea shows up in Updates.",
            "Takeaway: you can explain drivers using the props you see."
          ]
        },
        {
          "type": "order",
          "scene": "factory",
          "viz": "machines",
          "coach": "Order the learning path for drivers.",
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
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "Quick check: Drivers",
          "q": "Which best matches “drivers” in OS & Hardware?",
          "opts": [
            "Translators",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        },
        {
          "type": "scene3d",
          "scene": "factory",
          "viz": "machines",
          "coach": "Explore the 3D scene for Drivers.",
          "html": "<p>Look at the themed 3D scene. Match the dock text to props you can actually see in the 3D scene.</p><p>Tip: <em>Updates</em></p>"
        },
        {
          "type": "equation",
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "Build the idea sentence for drivers.",
          "tokens": [
            {
              "id": "t1",
              "html": "drivers"
            },
            {
              "id": "t2",
              "html": "explains"
            },
            {
              "id": "t3",
              "html": "Translators"
            }
          ]
        },
        {
          "type": "tap",
          "scene": "factory",
          "viz": "machines",
          "coach": "⚙️ Level 6 · Step 8: explore drivers (iconic).",
          "html": "<p><strong>Drivers</strong></p><p>Translators · Printer needs driver · Updates</p><p>Stage: iconic. Use the interactive panel, then continue.</p>"
        },
        {
          "type": "drag",
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "Sort ideas about drivers.",
          "title": "Sort: Drivers",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Translators"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Printer needs driver"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About drivers",
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
          "scene": "factory",
          "viz": "machines",
          "coach": "Boss check: Drivers",
          "q": "Which best matches “drivers” in OS & Hardware?",
          "opts": [
            "Translators",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        }
      ]
    },
    {
      "kidTitle": "Permissions",
      "theme": "perms",
      "emoji": "⚙️",
      "rewardName": "Permissions Guardian",
      "intro": "In “Permissions” you learn perms through play - spiral from concrete actions to symbols (Bruner's theory). Props and panel match the idea.",
      "everyday": [
        "User accounts",
        "Admin power",
        "Least privilege"
      ],
      "scene": "factory",
      "viz": "machines",
      "quiz": [
        {
          "q": "What is a good everyday example of “perms”?",
          "opts": [
            "User accounts",
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
          "scene": "factory",
          "viz": "machines",
          "coach": "⚙️ Level 7 · Step 1: explore perms (symbolic).",
          "html": "<p><strong>Permissions</strong> - watch the themed scene <em>and</em> the interactive panel.</p><p>Everyday hook: <em>User accounts</em>.</p><p>Brunner stage: <strong>symbolic</strong> - start concrete, then build up.</p>"
        },
        {
          "type": "drag",
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "Sort ideas about perms.",
          "title": "Sort: Permissions",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "User accounts"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Admin power"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About perms",
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
          "scene": "factory",
          "viz": "machines",
          "coach": "Reveal examples for Permissions.",
          "title": "Permissions - unfold examples",
          "steps": [
            "Hook: User accounts",
            "Notice: Admin power connects to perms.",
            "Pattern: the same idea shows up in Least privilege.",
            "Takeaway: you can explain perms using the props you see."
          ]
        },
        {
          "type": "order",
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "Order the learning path for perms.",
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
          "scene": "factory",
          "viz": "machines",
          "coach": "Quick check: Permissions",
          "q": "Which best matches “perms” in OS & Hardware?",
          "opts": [
            "User accounts",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        },
        {
          "type": "scene3d",
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "Explore the 3D scene for Permissions.",
          "html": "<p>Look at the themed 3D scene. Match the dock text to props you can actually see in the 3D scene.</p><p>Tip: <em>Least privilege</em></p>"
        },
        {
          "type": "equation",
          "scene": "factory",
          "viz": "machines",
          "coach": "Build the idea sentence for perms.",
          "tokens": [
            {
              "id": "t1",
              "html": "perms"
            },
            {
              "id": "t2",
              "html": "explains"
            },
            {
              "id": "t3",
              "html": "User accounts"
            }
          ]
        },
        {
          "type": "tap",
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "⚙️ Level 7 · Step 8: explore perms (symbolic).",
          "html": "<p><strong>Permissions</strong></p><p>User accounts · Admin power · Least privilege</p><p>Stage: symbolic. Use the interactive panel, then continue.</p>"
        },
        {
          "type": "drag",
          "scene": "factory",
          "viz": "machines",
          "coach": "Sort ideas about perms.",
          "title": "Sort: Permissions",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "User accounts"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Admin power"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About perms",
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
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "Boss check: Permissions",
          "q": "Which best matches “perms” in OS & Hardware?",
          "opts": [
            "User accounts",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        }
      ]
    },
    {
      "kidTitle": "Boot Sequence",
      "theme": "boot",
      "emoji": "⚙️",
      "rewardName": "Boot Scholar",
      "intro": "In “Boot Sequence” you learn boot through play - spiral from concrete actions to symbols (Bruner's theory). Props and panel match the idea.",
      "everyday": [
        "Power on",
        "POST idea",
        "Login"
      ],
      "scene": "factoryFlow",
      "viz": "machines",
      "quiz": [
        {
          "q": "What is a good everyday example of “boot”?",
          "opts": [
            "Power on",
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
          "q": "In OS & Hardware, “boot” most helps you…",
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
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "⚙️ Level 8 · Step 1: explore boot (symbolic).",
          "html": "<p><strong>Boot Sequence</strong> - watch the themed scene <em>and</em> the interactive panel.</p><p>Everyday hook: <em>Power on</em>.</p><p>Brunner stage: <strong>symbolic</strong> - start concrete, then build up.</p>"
        },
        {
          "type": "drag",
          "scene": "factory",
          "viz": "machines",
          "coach": "Sort ideas about boot.",
          "title": "Sort: Boot Sequence",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Power on"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "POST idea"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About boot",
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
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "Reveal examples for Boot Sequence.",
          "title": "Boot Sequence - unfold examples",
          "steps": [
            "Hook: Power on",
            "Notice: POST idea connects to boot.",
            "Pattern: the same idea shows up in Login.",
            "Takeaway: you can explain boot using the props you see."
          ]
        },
        {
          "type": "order",
          "scene": "factory",
          "viz": "machines",
          "coach": "Order the learning path for boot.",
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
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "Quick check: Boot Sequence",
          "q": "Which best matches “boot” in OS & Hardware?",
          "opts": [
            "Power on",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        },
        {
          "type": "scene3d",
          "scene": "factory",
          "viz": "machines",
          "coach": "Explore the 3D scene for Boot Sequence.",
          "html": "<p>Look at the themed 3D scene. Match the dock text to props you can actually see in the 3D scene.</p><p>Tip: <em>Login</em></p>"
        },
        {
          "type": "equation",
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "Build the idea sentence for boot.",
          "tokens": [
            {
              "id": "t1",
              "html": "boot"
            },
            {
              "id": "t2",
              "html": "explains"
            },
            {
              "id": "t3",
              "html": "Power on"
            }
          ]
        },
        {
          "type": "tap",
          "scene": "factory",
          "viz": "machines",
          "coach": "⚙️ Level 8 · Step 8: explore boot (symbolic).",
          "html": "<p><strong>Boot Sequence</strong></p><p>Power on · POST idea · Login</p><p>Stage: symbolic. Use the interactive panel, then continue.</p>"
        },
        {
          "type": "drag",
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "Sort ideas about boot.",
          "title": "Sort: Boot Sequence",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Power on"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "POST idea"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About boot",
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
          "scene": "factory",
          "viz": "machines",
          "coach": "Boss check: Boot Sequence",
          "q": "Which best matches “boot” in OS & Hardware?",
          "opts": [
            "Power on",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        }
      ]
    },
    {
      "kidTitle": "Performance",
      "theme": "perf",
      "emoji": "⚙️",
      "rewardName": "Performance Mentor",
      "intro": "In “Performance” you learn perf through play - spiral from concrete actions to symbols (Bruner's theory). Props and panel match the idea.",
      "everyday": [
        "Too many tabs",
        "Background apps",
        "Cooling"
      ],
      "scene": "factory",
      "viz": "machines",
      "quiz": [
        {
          "q": "What is a good everyday example of “perf”?",
          "opts": [
            "Too many tabs",
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
          "q": "In OS & Hardware, “perf” most helps you…",
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
          "scene": "factory",
          "viz": "machines",
          "coach": "⚙️ Level 9 · Step 1: explore perf (symbolic).",
          "html": "<p><strong>Performance</strong> - watch the themed scene <em>and</em> the interactive panel.</p><p>Everyday hook: <em>Too many tabs</em>.</p><p>Brunner stage: <strong>symbolic</strong> - start concrete, then build up.</p>"
        },
        {
          "type": "drag",
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "Sort ideas about perf.",
          "title": "Sort: Performance",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Too many tabs"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Background apps"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About perf",
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
          "scene": "factory",
          "viz": "machines",
          "coach": "Reveal examples for Performance.",
          "title": "Performance - unfold examples",
          "steps": [
            "Hook: Too many tabs",
            "Notice: Background apps connects to perf.",
            "Pattern: the same idea shows up in Cooling.",
            "Takeaway: you can explain perf using the props you see."
          ]
        },
        {
          "type": "order",
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "Order the learning path for perf.",
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
          "scene": "factory",
          "viz": "machines",
          "coach": "Quick check: Performance",
          "q": "Which best matches “perf” in OS & Hardware?",
          "opts": [
            "Too many tabs",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        },
        {
          "type": "scene3d",
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "Explore the 3D scene for Performance.",
          "html": "<p>Look at the themed 3D scene. Match the dock text to props you can actually see in the 3D scene.</p><p>Tip: <em>Cooling</em></p>"
        },
        {
          "type": "equation",
          "scene": "factory",
          "viz": "machines",
          "coach": "Build the idea sentence for perf.",
          "tokens": [
            {
              "id": "t1",
              "html": "perf"
            },
            {
              "id": "t2",
              "html": "explains"
            },
            {
              "id": "t3",
              "html": "Too many tabs"
            }
          ]
        },
        {
          "type": "tap",
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "⚙️ Level 9 · Step 8: explore perf (symbolic).",
          "html": "<p><strong>Performance</strong></p><p>Too many tabs · Background apps · Cooling</p><p>Stage: symbolic. Use the interactive panel, then continue.</p>"
        },
        {
          "type": "drag",
          "scene": "factory",
          "viz": "machines",
          "coach": "Sort ideas about perf.",
          "title": "Sort: Performance",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Too many tabs"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Background apps"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About perf",
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
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "Boss check: Performance",
          "q": "Which best matches “perf” in OS & Hardware?",
          "opts": [
            "Too many tabs",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        }
      ]
    },
    {
      "kidTitle": "OS Boss",
      "theme": "synthesis",
      "emoji": "⚙️",
      "rewardName": "OS Champion",
      "intro": "In “OS Boss” you learn synthesis through play - spiral from concrete actions to symbols (Bruner's theory). Props and panel match the idea.",
      "everyday": [
        "Explain a freeze",
        "Upgrade wisely",
        "Secure the machine"
      ],
      "scene": "factoryFlow",
      "viz": "machines",
      "quiz": [
        {
          "q": "What is a good everyday example of “synthesis”?",
          "opts": [
            "Explain a freeze",
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
          "q": "In OS & Hardware, “synthesis” most helps you…",
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
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "⚙️ Level 10 · Step 1: explore synthesis (synthesis).",
          "html": "<p><strong>OS Boss</strong> - watch the themed scene <em>and</em> the interactive panel.</p><p>Everyday hook: <em>Explain a freeze</em>.</p><p>Brunner stage: <strong>synthesis</strong> - start concrete, then build up.</p>"
        },
        {
          "type": "drag",
          "scene": "factory",
          "viz": "machines",
          "coach": "Sort ideas about synthesis.",
          "title": "Sort: OS Boss",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Explain a freeze"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Upgrade wisely"
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
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "Reveal examples for OS Boss.",
          "title": "OS Boss - unfold examples",
          "steps": [
            "Hook: Explain a freeze",
            "Notice: Upgrade wisely connects to synthesis.",
            "Pattern: the same idea shows up in Secure the machine.",
            "Takeaway: you can explain synthesis using the props you see."
          ]
        },
        {
          "type": "order",
          "scene": "factory",
          "viz": "machines",
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
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "Quick check: OS Boss",
          "q": "Which best matches “synthesis” in OS & Hardware?",
          "opts": [
            "Explain a freeze",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        },
        {
          "type": "scene3d",
          "scene": "factory",
          "viz": "machines",
          "coach": "Explore the 3D scene for OS Boss.",
          "html": "<p>Look at the themed 3D scene. Match the dock text to props you can actually see in the 3D scene.</p><p>Tip: <em>Secure the machine</em></p>"
        },
        {
          "type": "equation",
          "scene": "factoryFlow",
          "viz": "machines",
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
              "html": "Explain a freeze"
            }
          ]
        },
        {
          "type": "tap",
          "scene": "factory",
          "viz": "machines",
          "coach": "⚙️ Level 10 · Step 8: explore synthesis (synthesis).",
          "html": "<p><strong>OS Boss</strong></p><p>Explain a freeze · Upgrade wisely · Secure the machine</p><p>Stage: synthesis. Use the interactive panel, then continue.</p>"
        },
        {
          "type": "drag",
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "Sort ideas about synthesis.",
          "title": "Sort: OS Boss",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Explain a freeze"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Upgrade wisely"
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
          "scene": "factory",
          "viz": "machines",
          "coach": "Boss check: OS Boss",
          "q": "Which best matches “synthesis” in OS & Hardware?",
          "opts": [
            "Explain a freeze",
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
