/** Auto-generated curriculum - 10 levels × 10 subs (Brunner spiral) */
export const curriculum = {
  "levels": [
    {
      "kidTitle": "Why Databases?",
      "theme": "why",
      "emoji": "🗄️",
      "rewardName": "Why Rookie",
      "intro": "In “Why Databases?” you learn why through play - spiral from concrete actions to symbols (Bruner's theory). Props and panel match the idea.",
      "everyday": [
        "School registers",
        "Phone contacts",
        "Shop inventory"
      ],
      "scene": "classroom",
      "viz": "compare",
      "quiz": [
        {
          "q": "What is a good everyday example of “why”?",
          "opts": [
            "School registers",
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
          "coach": "🗄️ Level 1 · Step 1: explore why (enactive).",
          "html": "<p><strong>Why Databases?</strong> - watch the themed scene <em>and</em> the interactive panel.</p><p>Everyday hook: <em>School registers</em>.</p><p>Brunner stage: <strong>enactive</strong> - start concrete, then build up.</p>"
        },
        {
          "type": "drag",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Sort ideas about why.",
          "title": "Sort: Why Databases?",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "School registers"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Phone contacts"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About why",
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
          "coach": "Reveal examples for Why Databases?.",
          "title": "Why Databases? - unfold examples",
          "steps": [
            "Hook: School registers",
            "Notice: Phone contacts connects to why.",
            "Pattern: the same idea shows up in Shop inventory.",
            "Takeaway: you can explain why using the props you see."
          ]
        },
        {
          "type": "order",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Order the learning path for why.",
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
          "coach": "Quick check: Why Databases?",
          "q": "Which best matches “why” in Database & SQL?",
          "opts": [
            "School registers",
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
          "coach": "Explore the 3D scene for Why Databases?.",
          "html": "<p>Look at the themed 3D scene. Match the dock text to props you can actually see in the 3D scene.</p><p>Tip: <em>Shop inventory</em></p>"
        },
        {
          "type": "equation",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Build the idea sentence for why.",
          "tokens": [
            {
              "id": "t1",
              "html": "why"
            },
            {
              "id": "t2",
              "html": "explains"
            },
            {
              "id": "t3",
              "html": "School registers"
            }
          ]
        },
        {
          "type": "tap",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "🗄️ Level 1 · Step 8: explore why (enactive).",
          "html": "<p><strong>Why Databases?</strong></p><p>School registers · Phone contacts · Shop inventory</p><p>Stage: enactive. Use the interactive panel, then continue.</p>"
        },
        {
          "type": "drag",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Sort ideas about why.",
          "title": "Sort: Why Databases?",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "School registers"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Phone contacts"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About why",
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
          "coach": "Boss check: Why Databases?",
          "q": "Which best matches “why” in Database & SQL?",
          "opts": [
            "School registers",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        }
      ]
    },
    {
      "kidTitle": "Tables & Rows",
      "theme": "tables",
      "emoji": "🗄️",
      "rewardName": "Tables Scout",
      "intro": "In “Tables & Rows” you learn tables through play - spiral from concrete actions to symbols (Bruner's theory). Props and panel match the idea.",
      "everyday": [
        "Spreadsheet feel",
        "Primary key",
        "Columns"
      ],
      "scene": "classroomCount",
      "viz": "compare",
      "quiz": [
        {
          "q": "What is a good everyday example of “tables”?",
          "opts": [
            "Spreadsheet feel",
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
          "coach": "🗄️ Level 2 · Step 1: explore tables (enactive).",
          "html": "<p><strong>Tables & Rows</strong> - watch the themed scene <em>and</em> the interactive panel.</p><p>Everyday hook: <em>Spreadsheet feel</em>.</p><p>Brunner stage: <strong>enactive</strong> - start concrete, then build up.</p>"
        },
        {
          "type": "drag",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Sort ideas about tables.",
          "title": "Sort: Tables & Rows",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Spreadsheet feel"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Primary key"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About tables",
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
          "coach": "Reveal examples for Tables & Rows.",
          "title": "Tables & Rows - unfold examples",
          "steps": [
            "Hook: Spreadsheet feel",
            "Notice: Primary key connects to tables.",
            "Pattern: the same idea shows up in Columns.",
            "Takeaway: you can explain tables using the props you see."
          ]
        },
        {
          "type": "order",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Order the learning path for tables.",
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
          "coach": "Quick check: Tables & Rows",
          "q": "Which best matches “tables” in Database & SQL?",
          "opts": [
            "Spreadsheet feel",
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
          "coach": "Explore the 3D scene for Tables & Rows.",
          "html": "<p>Look at the themed 3D scene. Match the dock text to props you can actually see in the 3D scene.</p><p>Tip: <em>Columns</em></p>"
        },
        {
          "type": "equation",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Build the idea sentence for tables.",
          "tokens": [
            {
              "id": "t1",
              "html": "tables"
            },
            {
              "id": "t2",
              "html": "explains"
            },
            {
              "id": "t3",
              "html": "Spreadsheet feel"
            }
          ]
        },
        {
          "type": "tap",
          "scene": "classroom",
          "viz": "compare",
          "coach": "🗄️ Level 2 · Step 8: explore tables (enactive).",
          "html": "<p><strong>Tables & Rows</strong></p><p>Spreadsheet feel · Primary key · Columns</p><p>Stage: enactive. Use the interactive panel, then continue.</p>"
        },
        {
          "type": "drag",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Sort ideas about tables.",
          "title": "Sort: Tables & Rows",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Spreadsheet feel"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Primary key"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About tables",
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
          "coach": "Boss check: Tables & Rows",
          "q": "Which best matches “tables” in Database & SQL?",
          "opts": [
            "Spreadsheet feel",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        }
      ]
    },
    {
      "kidTitle": "SELECT",
      "theme": "select",
      "emoji": "🗄️",
      "rewardName": "SELECT Explorer",
      "intro": "In “SELECT” you learn select through play - spiral from concrete actions to symbols (Bruner's theory). Props and panel match the idea.",
      "everyday": [
        "Pick columns",
        "Filter WHERE",
        "ORDER BY"
      ],
      "scene": "classroom",
      "viz": "compare",
      "quiz": [
        {
          "q": "What is a good everyday example of “select”?",
          "opts": [
            "Pick columns",
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
          "coach": "🗄️ Level 3 · Step 1: explore select (enactive).",
          "html": "<p><strong>SELECT</strong> - watch the themed scene <em>and</em> the interactive panel.</p><p>Everyday hook: <em>Pick columns</em>.</p><p>Brunner stage: <strong>enactive</strong> - start concrete, then build up.</p>"
        },
        {
          "type": "drag",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Sort ideas about select.",
          "title": "Sort: SELECT",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Pick columns"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Filter WHERE"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About select",
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
          "coach": "Reveal examples for SELECT.",
          "title": "SELECT - unfold examples",
          "steps": [
            "Hook: Pick columns",
            "Notice: Filter WHERE connects to select.",
            "Pattern: the same idea shows up in ORDER BY.",
            "Takeaway: you can explain select using the props you see."
          ]
        },
        {
          "type": "order",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Order the learning path for select.",
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
          "coach": "Quick check: SELECT",
          "q": "Which best matches “select” in Database & SQL?",
          "opts": [
            "Pick columns",
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
          "coach": "Explore the 3D scene for SELECT.",
          "html": "<p>Look at the themed 3D scene. Match the dock text to props you can actually see in the 3D scene.</p><p>Tip: <em>ORDER BY</em></p>"
        },
        {
          "type": "equation",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Build the idea sentence for select.",
          "tokens": [
            {
              "id": "t1",
              "html": "select"
            },
            {
              "id": "t2",
              "html": "explains"
            },
            {
              "id": "t3",
              "html": "Pick columns"
            }
          ]
        },
        {
          "type": "tap",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "🗄️ Level 3 · Step 8: explore select (enactive).",
          "html": "<p><strong>SELECT</strong></p><p>Pick columns · Filter WHERE · ORDER BY</p><p>Stage: enactive. Use the interactive panel, then continue.</p>"
        },
        {
          "type": "drag",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Sort ideas about select.",
          "title": "Sort: SELECT",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Pick columns"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Filter WHERE"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About select",
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
          "coach": "Boss check: SELECT",
          "q": "Which best matches “select” in Database & SQL?",
          "opts": [
            "Pick columns",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        }
      ]
    },
    {
      "kidTitle": "INSERT/UPDATE",
      "theme": "mutate",
      "emoji": "🗄️",
      "rewardName": "INSERT/UPDATE Builder",
      "intro": "In “INSERT/UPDATE” you learn mutate through play - spiral from concrete actions to symbols (Bruner's theory). Props and panel match the idea.",
      "everyday": [
        "Add a student",
        "Fix a name",
        "Soft delete"
      ],
      "scene": "classroomCount",
      "viz": "compare",
      "quiz": [
        {
          "q": "What is a good everyday example of “mutate”?",
          "opts": [
            "Add a student",
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
          "coach": "🗄️ Level 4 · Step 1: explore mutate (iconic).",
          "html": "<p><strong>INSERT/UPDATE</strong> - watch the themed scene <em>and</em> the interactive panel.</p><p>Everyday hook: <em>Add a student</em>.</p><p>Brunner stage: <strong>iconic</strong> - start concrete, then build up.</p>"
        },
        {
          "type": "drag",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Sort ideas about mutate.",
          "title": "Sort: INSERT/UPDATE",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Add a student"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Fix a name"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About mutate",
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
          "coach": "Reveal examples for INSERT/UPDATE.",
          "title": "INSERT/UPDATE - unfold examples",
          "steps": [
            "Hook: Add a student",
            "Notice: Fix a name connects to mutate.",
            "Pattern: the same idea shows up in Soft delete.",
            "Takeaway: you can explain mutate using the props you see."
          ]
        },
        {
          "type": "order",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Order the learning path for mutate.",
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
          "coach": "Quick check: INSERT/UPDATE",
          "q": "Which best matches “mutate” in Database & SQL?",
          "opts": [
            "Add a student",
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
          "coach": "Explore the 3D scene for INSERT/UPDATE.",
          "html": "<p>Look at the themed 3D scene. Match the dock text to props you can actually see in the 3D scene.</p><p>Tip: <em>Soft delete</em></p>"
        },
        {
          "type": "equation",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Build the idea sentence for mutate.",
          "tokens": [
            {
              "id": "t1",
              "html": "mutate"
            },
            {
              "id": "t2",
              "html": "explains"
            },
            {
              "id": "t3",
              "html": "Add a student"
            }
          ]
        },
        {
          "type": "tap",
          "scene": "classroom",
          "viz": "compare",
          "coach": "🗄️ Level 4 · Step 8: explore mutate (iconic).",
          "html": "<p><strong>INSERT/UPDATE</strong></p><p>Add a student · Fix a name · Soft delete</p><p>Stage: iconic. Use the interactive panel, then continue.</p>"
        },
        {
          "type": "drag",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Sort ideas about mutate.",
          "title": "Sort: INSERT/UPDATE",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Add a student"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Fix a name"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About mutate",
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
          "coach": "Boss check: INSERT/UPDATE",
          "q": "Which best matches “mutate” in Database & SQL?",
          "opts": [
            "Add a student",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        }
      ]
    },
    {
      "kidTitle": "JOIN Thinking",
      "theme": "join",
      "emoji": "🗄️",
      "rewardName": "JOIN Analyst",
      "intro": "In “JOIN Thinking” you learn join through play - spiral from concrete actions to symbols (Bruner's theory). Props and panel match the idea.",
      "everyday": [
        "Student + class",
        "Order + items",
        "Match keys"
      ],
      "scene": "classroom",
      "viz": "compare",
      "quiz": [
        {
          "q": "What is a good everyday example of “join”?",
          "opts": [
            "Student + class",
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
          "coach": "🗄️ Level 5 · Step 1: explore join (iconic).",
          "html": "<p><strong>JOIN Thinking</strong> - watch the themed scene <em>and</em> the interactive panel.</p><p>Everyday hook: <em>Student + class</em>.</p><p>Brunner stage: <strong>iconic</strong> - start concrete, then build up.</p>"
        },
        {
          "type": "drag",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Sort ideas about join.",
          "title": "Sort: JOIN Thinking",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Student + class"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Order + items"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About join",
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
          "coach": "Reveal examples for JOIN Thinking.",
          "title": "JOIN Thinking - unfold examples",
          "steps": [
            "Hook: Student + class",
            "Notice: Order + items connects to join.",
            "Pattern: the same idea shows up in Match keys.",
            "Takeaway: you can explain join using the props you see."
          ]
        },
        {
          "type": "order",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Order the learning path for join.",
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
          "coach": "Quick check: JOIN Thinking",
          "q": "Which best matches “join” in Database & SQL?",
          "opts": [
            "Student + class",
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
          "coach": "Explore the 3D scene for JOIN Thinking.",
          "html": "<p>Look at the themed 3D scene. Match the dock text to props you can actually see in the 3D scene.</p><p>Tip: <em>Match keys</em></p>"
        },
        {
          "type": "equation",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Build the idea sentence for join.",
          "tokens": [
            {
              "id": "t1",
              "html": "join"
            },
            {
              "id": "t2",
              "html": "explains"
            },
            {
              "id": "t3",
              "html": "Student + class"
            }
          ]
        },
        {
          "type": "tap",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "🗄️ Level 5 · Step 8: explore join (iconic).",
          "html": "<p><strong>JOIN Thinking</strong></p><p>Student + class · Order + items · Match keys</p><p>Stage: iconic. Use the interactive panel, then continue.</p>"
        },
        {
          "type": "drag",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Sort ideas about join.",
          "title": "Sort: JOIN Thinking",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Student + class"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Order + items"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About join",
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
          "coach": "Boss check: JOIN Thinking",
          "q": "Which best matches “join” in Database & SQL?",
          "opts": [
            "Student + class",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        }
      ]
    },
    {
      "kidTitle": "Keys & Relations",
      "theme": "keys",
      "emoji": "🗄️",
      "rewardName": "Keys Strategist",
      "intro": "In “Keys & Relations” you learn keys through play - spiral from concrete actions to symbols (Bruner's theory). Props and panel match the idea.",
      "everyday": [
        "One-to-many",
        "Foreign keys",
        "No orphan rows"
      ],
      "scene": "classroomCount",
      "viz": "compare",
      "quiz": [
        {
          "q": "What is a good everyday example of “keys”?",
          "opts": [
            "One-to-many",
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
          "coach": "🗄️ Level 6 · Step 1: explore keys (iconic).",
          "html": "<p><strong>Keys & Relations</strong> - watch the themed scene <em>and</em> the interactive panel.</p><p>Everyday hook: <em>One-to-many</em>.</p><p>Brunner stage: <strong>iconic</strong> - start concrete, then build up.</p>"
        },
        {
          "type": "drag",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Sort ideas about keys.",
          "title": "Sort: Keys & Relations",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "One-to-many"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Foreign keys"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About keys",
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
          "coach": "Reveal examples for Keys & Relations.",
          "title": "Keys & Relations - unfold examples",
          "steps": [
            "Hook: One-to-many",
            "Notice: Foreign keys connects to keys.",
            "Pattern: the same idea shows up in No orphan rows.",
            "Takeaway: you can explain keys using the props you see."
          ]
        },
        {
          "type": "order",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Order the learning path for keys.",
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
          "coach": "Quick check: Keys & Relations",
          "q": "Which best matches “keys” in Database & SQL?",
          "opts": [
            "One-to-many",
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
          "coach": "Explore the 3D scene for Keys & Relations.",
          "html": "<p>Look at the themed 3D scene. Match the dock text to props you can actually see in the 3D scene.</p><p>Tip: <em>No orphan rows</em></p>"
        },
        {
          "type": "equation",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Build the idea sentence for keys.",
          "tokens": [
            {
              "id": "t1",
              "html": "keys"
            },
            {
              "id": "t2",
              "html": "explains"
            },
            {
              "id": "t3",
              "html": "One-to-many"
            }
          ]
        },
        {
          "type": "tap",
          "scene": "classroom",
          "viz": "compare",
          "coach": "🗄️ Level 6 · Step 8: explore keys (iconic).",
          "html": "<p><strong>Keys & Relations</strong></p><p>One-to-many · Foreign keys · No orphan rows</p><p>Stage: iconic. Use the interactive panel, then continue.</p>"
        },
        {
          "type": "drag",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Sort ideas about keys.",
          "title": "Sort: Keys & Relations",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "One-to-many"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Foreign keys"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About keys",
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
          "coach": "Boss check: Keys & Relations",
          "q": "Which best matches “keys” in Database & SQL?",
          "opts": [
            "One-to-many",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        }
      ]
    },
    {
      "kidTitle": "Normalize Light",
      "theme": "norm",
      "emoji": "🗄️",
      "rewardName": "Normalize Guardian",
      "intro": "In “Normalize Light” you learn norm through play - spiral from concrete actions to symbols (Bruner's theory). Props and panel match the idea.",
      "everyday": [
        "Don't repeat",
        "Split tables",
        "Clean design"
      ],
      "scene": "classroom",
      "viz": "compare",
      "quiz": [
        {
          "q": "What is a good everyday example of “norm”?",
          "opts": [
            "Don't repeat",
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
          "coach": "🗄️ Level 7 · Step 1: explore norm (symbolic).",
          "html": "<p><strong>Normalize Light</strong> - watch the themed scene <em>and</em> the interactive panel.</p><p>Everyday hook: <em>Don't repeat</em>.</p><p>Brunner stage: <strong>symbolic</strong> - start concrete, then build up.</p>"
        },
        {
          "type": "drag",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Sort ideas about norm.",
          "title": "Sort: Normalize Light",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Don't repeat"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Split tables"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About norm",
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
          "coach": "Reveal examples for Normalize Light.",
          "title": "Normalize Light - unfold examples",
          "steps": [
            "Hook: Don't repeat",
            "Notice: Split tables connects to norm.",
            "Pattern: the same idea shows up in Clean design.",
            "Takeaway: you can explain norm using the props you see."
          ]
        },
        {
          "type": "order",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Order the learning path for norm.",
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
          "coach": "Quick check: Normalize Light",
          "q": "Which best matches “norm” in Database & SQL?",
          "opts": [
            "Don't repeat",
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
          "coach": "Explore the 3D scene for Normalize Light.",
          "html": "<p>Look at the themed 3D scene. Match the dock text to props you can actually see in the 3D scene.</p><p>Tip: <em>Clean design</em></p>"
        },
        {
          "type": "equation",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Build the idea sentence for norm.",
          "tokens": [
            {
              "id": "t1",
              "html": "norm"
            },
            {
              "id": "t2",
              "html": "explains"
            },
            {
              "id": "t3",
              "html": "Don't repeat"
            }
          ]
        },
        {
          "type": "tap",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "🗄️ Level 7 · Step 8: explore norm (symbolic).",
          "html": "<p><strong>Normalize Light</strong></p><p>Don't repeat · Split tables · Clean design</p><p>Stage: symbolic. Use the interactive panel, then continue.</p>"
        },
        {
          "type": "drag",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Sort ideas about norm.",
          "title": "Sort: Normalize Light",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Don't repeat"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Split tables"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About norm",
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
          "coach": "Boss check: Normalize Light",
          "q": "Which best matches “norm” in Database & SQL?",
          "opts": [
            "Don't repeat",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        }
      ]
    },
    {
      "kidTitle": "Indexes Idea",
      "theme": "index",
      "emoji": "🗄️",
      "rewardName": "Indexes Scholar",
      "intro": "In “Indexes Idea” you learn index through play - spiral from concrete actions to symbols (Bruner's theory). Props and panel match the idea.",
      "everyday": [
        "Book index",
        "Faster find",
        "Tradeoffs"
      ],
      "scene": "classroomCount",
      "viz": "compare",
      "quiz": [
        {
          "q": "What is a good everyday example of “index”?",
          "opts": [
            "Book index",
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
          "q": "In Database & SQL, “index” most helps you…",
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
          "coach": "🗄️ Level 8 · Step 1: explore index (symbolic).",
          "html": "<p><strong>Indexes Idea</strong> - watch the themed scene <em>and</em> the interactive panel.</p><p>Everyday hook: <em>Book index</em>.</p><p>Brunner stage: <strong>symbolic</strong> - start concrete, then build up.</p>"
        },
        {
          "type": "drag",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Sort ideas about index.",
          "title": "Sort: Indexes Idea",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Book index"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Faster find"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About index",
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
          "coach": "Reveal examples for Indexes Idea.",
          "title": "Indexes Idea - unfold examples",
          "steps": [
            "Hook: Book index",
            "Notice: Faster find connects to index.",
            "Pattern: the same idea shows up in Tradeoffs.",
            "Takeaway: you can explain index using the props you see."
          ]
        },
        {
          "type": "order",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Order the learning path for index.",
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
          "coach": "Quick check: Indexes Idea",
          "q": "Which best matches “index” in Database & SQL?",
          "opts": [
            "Book index",
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
          "coach": "Explore the 3D scene for Indexes Idea.",
          "html": "<p>Look at the themed 3D scene. Match the dock text to props you can actually see in the 3D scene.</p><p>Tip: <em>Tradeoffs</em></p>"
        },
        {
          "type": "equation",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Build the idea sentence for index.",
          "tokens": [
            {
              "id": "t1",
              "html": "index"
            },
            {
              "id": "t2",
              "html": "explains"
            },
            {
              "id": "t3",
              "html": "Book index"
            }
          ]
        },
        {
          "type": "tap",
          "scene": "classroom",
          "viz": "compare",
          "coach": "🗄️ Level 8 · Step 8: explore index (symbolic).",
          "html": "<p><strong>Indexes Idea</strong></p><p>Book index · Faster find · Tradeoffs</p><p>Stage: symbolic. Use the interactive panel, then continue.</p>"
        },
        {
          "type": "drag",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Sort ideas about index.",
          "title": "Sort: Indexes Idea",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Book index"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Faster find"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About index",
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
          "coach": "Boss check: Indexes Idea",
          "q": "Which best matches “index” in Database & SQL?",
          "opts": [
            "Book index",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        }
      ]
    },
    {
      "kidTitle": "SQL Safety",
      "theme": "safety",
      "emoji": "🗄️",
      "rewardName": "SQL Mentor",
      "intro": "In “SQL Safety” you learn safety through play - spiral from concrete actions to symbols (Bruner's theory). Props and panel match the idea.",
      "everyday": [
        "Parameterized queries",
        "Backups",
        "Permissions"
      ],
      "scene": "classroom",
      "viz": "compare",
      "quiz": [
        {
          "q": "What is a good everyday example of “safety”?",
          "opts": [
            "Parameterized queries",
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
          "q": "In Database & SQL, “safety” most helps you…",
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
          "coach": "🗄️ Level 9 · Step 1: explore safety (symbolic).",
          "html": "<p><strong>SQL Safety</strong> - watch the themed scene <em>and</em> the interactive panel.</p><p>Everyday hook: <em>Parameterized queries</em>.</p><p>Brunner stage: <strong>symbolic</strong> - start concrete, then build up.</p>"
        },
        {
          "type": "drag",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Sort ideas about safety.",
          "title": "Sort: SQL Safety",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Parameterized queries"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Backups"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About safety",
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
          "coach": "Reveal examples for SQL Safety.",
          "title": "SQL Safety - unfold examples",
          "steps": [
            "Hook: Parameterized queries",
            "Notice: Backups connects to safety.",
            "Pattern: the same idea shows up in Permissions.",
            "Takeaway: you can explain safety using the props you see."
          ]
        },
        {
          "type": "order",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Order the learning path for safety.",
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
          "coach": "Quick check: SQL Safety",
          "q": "Which best matches “safety” in Database & SQL?",
          "opts": [
            "Parameterized queries",
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
          "coach": "Explore the 3D scene for SQL Safety.",
          "html": "<p>Look at the themed 3D scene. Match the dock text to props you can actually see in the 3D scene.</p><p>Tip: <em>Permissions</em></p>"
        },
        {
          "type": "equation",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Build the idea sentence for safety.",
          "tokens": [
            {
              "id": "t1",
              "html": "safety"
            },
            {
              "id": "t2",
              "html": "explains"
            },
            {
              "id": "t3",
              "html": "Parameterized queries"
            }
          ]
        },
        {
          "type": "tap",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "🗄️ Level 9 · Step 8: explore safety (symbolic).",
          "html": "<p><strong>SQL Safety</strong></p><p>Parameterized queries · Backups · Permissions</p><p>Stage: symbolic. Use the interactive panel, then continue.</p>"
        },
        {
          "type": "drag",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Sort ideas about safety.",
          "title": "Sort: SQL Safety",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Parameterized queries"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Backups"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About safety",
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
          "coach": "Boss check: SQL Safety",
          "q": "Which best matches “safety” in Database & SQL?",
          "opts": [
            "Parameterized queries",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        }
      ]
    },
    {
      "kidTitle": "SQL Boss",
      "theme": "synthesis",
      "emoji": "🗄️",
      "rewardName": "SQL Champion",
      "intro": "In “SQL Boss” you learn synthesis through play - spiral from concrete actions to symbols (Bruner's theory). Props and panel match the idea.",
      "everyday": [
        "Design a schema",
        "Write a query",
        "Explain a plan"
      ],
      "scene": "classroomCount",
      "viz": "compare",
      "quiz": [
        {
          "q": "What is a good everyday example of “synthesis”?",
          "opts": [
            "Design a schema",
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
          "q": "In Database & SQL, “synthesis” most helps you…",
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
          "coach": "🗄️ Level 10 · Step 1: explore synthesis (synthesis).",
          "html": "<p><strong>SQL Boss</strong> - watch the themed scene <em>and</em> the interactive panel.</p><p>Everyday hook: <em>Design a schema</em>.</p><p>Brunner stage: <strong>synthesis</strong> - start concrete, then build up.</p>"
        },
        {
          "type": "drag",
          "scene": "classroom",
          "viz": "compare",
          "coach": "Sort ideas about synthesis.",
          "title": "Sort: SQL Boss",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Design a schema"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Write a query"
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
          "coach": "Reveal examples for SQL Boss.",
          "title": "SQL Boss - unfold examples",
          "steps": [
            "Hook: Design a schema",
            "Notice: Write a query connects to synthesis.",
            "Pattern: the same idea shows up in Explain a plan.",
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
          "coach": "Quick check: SQL Boss",
          "q": "Which best matches “synthesis” in Database & SQL?",
          "opts": [
            "Design a schema",
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
          "coach": "Explore the 3D scene for SQL Boss.",
          "html": "<p>Look at the themed 3D scene. Match the dock text to props you can actually see in the 3D scene.</p><p>Tip: <em>Explain a plan</em></p>"
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
              "html": "Design a schema"
            }
          ]
        },
        {
          "type": "tap",
          "scene": "classroom",
          "viz": "compare",
          "coach": "🗄️ Level 10 · Step 8: explore synthesis (synthesis).",
          "html": "<p><strong>SQL Boss</strong></p><p>Design a schema · Write a query · Explain a plan</p><p>Stage: synthesis. Use the interactive panel, then continue.</p>"
        },
        {
          "type": "drag",
          "scene": "classroomCount",
          "viz": "compare",
          "coach": "Sort ideas about synthesis.",
          "title": "Sort: SQL Boss",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Design a schema"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Write a query"
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
          "coach": "Boss check: SQL Boss",
          "q": "Which best matches “synthesis” in Database & SQL?",
          "opts": [
            "Design a schema",
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
