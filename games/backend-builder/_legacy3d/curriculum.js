/** Auto-generated curriculum - 10 levels × 10 subs (Brunner spiral) */
export const curriculum = {
  "levels": [
    {
      "kidTitle": "Client vs Server",
      "theme": "roles",
      "emoji": "🖥️",
      "rewardName": "Client Rookie",
      "intro": "In “Client vs Server” you learn roles through play - spiral from concrete actions to symbols (Bruner's theory). Props and panel match the idea.",
      "everyday": [
        "Restaurant kitchen",
        "App requesting data",
        "Browser waits"
      ],
      "scene": "factory",
      "viz": "machines",
      "quiz": [
        {
          "q": "What is a good everyday example of “roles”?",
          "opts": [
            "Restaurant kitchen",
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
          "coach": "🖥️ Level 1 · Step 1: explore roles (enactive).",
          "html": "<p><strong>Client vs Server</strong> - watch the themed scene <em>and</em> the interactive panel.</p><p>Everyday hook: <em>Restaurant kitchen</em>.</p><p>Brunner stage: <strong>enactive</strong> - start concrete, then build up.</p>"
        },
        {
          "type": "drag",
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "Sort ideas about roles.",
          "title": "Sort: Client vs Server",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Restaurant kitchen"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "App requesting data"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About roles",
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
          "coach": "Reveal examples for Client vs Server.",
          "title": "Client vs Server - unfold examples",
          "steps": [
            "Hook: Restaurant kitchen",
            "Notice: App requesting data connects to roles.",
            "Pattern: the same idea shows up in Browser waits.",
            "Takeaway: you can explain roles using the props you see."
          ]
        },
        {
          "type": "order",
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "Order the learning path for roles.",
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
          "coach": "Quick check: Client vs Server",
          "q": "Which best matches “roles” in Backend Builder?",
          "opts": [
            "Restaurant kitchen",
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
          "coach": "Explore the 3D scene for Client vs Server.",
          "html": "<p>Look at the themed 3D scene. Match the dock text to props you can actually see in the 3D scene.</p><p>Tip: <em>Browser waits</em></p>"
        },
        {
          "type": "equation",
          "scene": "factory",
          "viz": "machines",
          "coach": "Build the idea sentence for roles.",
          "tokens": [
            {
              "id": "t1",
              "html": "roles"
            },
            {
              "id": "t2",
              "html": "explains"
            },
            {
              "id": "t3",
              "html": "Restaurant kitchen"
            }
          ]
        },
        {
          "type": "tap",
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "🖥️ Level 1 · Step 8: explore roles (enactive).",
          "html": "<p><strong>Client vs Server</strong></p><p>Restaurant kitchen · App requesting data · Browser waits</p><p>Stage: enactive. Use the interactive panel, then continue.</p>"
        },
        {
          "type": "drag",
          "scene": "factory",
          "viz": "machines",
          "coach": "Sort ideas about roles.",
          "title": "Sort: Client vs Server",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Restaurant kitchen"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "App requesting data"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About roles",
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
          "coach": "Boss check: Client vs Server",
          "q": "Which best matches “roles” in Backend Builder?",
          "opts": [
            "Restaurant kitchen",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        }
      ]
    },
    {
      "kidTitle": "Request & Response",
      "theme": "http",
      "emoji": "🖥️",
      "rewardName": "Request Scout",
      "intro": "In “Request & Response” you learn http through play - spiral from concrete actions to symbols (Bruner's theory). Props and panel match the idea.",
      "everyday": [
        "GET a page",
        "POST a form",
        "Status codes"
      ],
      "scene": "factoryFlow",
      "viz": "machines",
      "quiz": [
        {
          "q": "What is a good everyday example of “http”?",
          "opts": [
            "GET a page",
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
          "coach": "🖥️ Level 2 · Step 1: explore http (enactive).",
          "html": "<p><strong>Request & Response</strong> - watch the themed scene <em>and</em> the interactive panel.</p><p>Everyday hook: <em>GET a page</em>.</p><p>Brunner stage: <strong>enactive</strong> - start concrete, then build up.</p>"
        },
        {
          "type": "drag",
          "scene": "factory",
          "viz": "machines",
          "coach": "Sort ideas about http.",
          "title": "Sort: Request & Response",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "GET a page"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "POST a form"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About http",
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
          "coach": "Reveal examples for Request & Response.",
          "title": "Request & Response - unfold examples",
          "steps": [
            "Hook: GET a page",
            "Notice: POST a form connects to http.",
            "Pattern: the same idea shows up in Status codes.",
            "Takeaway: you can explain http using the props you see."
          ]
        },
        {
          "type": "order",
          "scene": "factory",
          "viz": "machines",
          "coach": "Order the learning path for http.",
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
          "coach": "Quick check: Request & Response",
          "q": "Which best matches “http” in Backend Builder?",
          "opts": [
            "GET a page",
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
          "coach": "Explore the 3D scene for Request & Response.",
          "html": "<p>Look at the themed 3D scene. Match the dock text to props you can actually see in the 3D scene.</p><p>Tip: <em>Status codes</em></p>"
        },
        {
          "type": "equation",
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "Build the idea sentence for http.",
          "tokens": [
            {
              "id": "t1",
              "html": "http"
            },
            {
              "id": "t2",
              "html": "explains"
            },
            {
              "id": "t3",
              "html": "GET a page"
            }
          ]
        },
        {
          "type": "tap",
          "scene": "factory",
          "viz": "machines",
          "coach": "🖥️ Level 2 · Step 8: explore http (enactive).",
          "html": "<p><strong>Request & Response</strong></p><p>GET a page · POST a form · Status codes</p><p>Stage: enactive. Use the interactive panel, then continue.</p>"
        },
        {
          "type": "drag",
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "Sort ideas about http.",
          "title": "Sort: Request & Response",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "GET a page"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "POST a form"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About http",
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
          "coach": "Boss check: Request & Response",
          "q": "Which best matches “http” in Backend Builder?",
          "opts": [
            "GET a page",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        }
      ]
    },
    {
      "kidTitle": "API Menus",
      "theme": "api",
      "emoji": "🖥️",
      "rewardName": "API Explorer",
      "intro": "In “API Menus” you learn api through play - spiral from concrete actions to symbols (Bruner's theory). Props and panel match the idea.",
      "everyday": [
        "Menu of endpoints",
        "JSON boxes",
        "Auth token idea"
      ],
      "scene": "factory",
      "viz": "machines",
      "quiz": [
        {
          "q": "What is a good everyday example of “api”?",
          "opts": [
            "Menu of endpoints",
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
          "coach": "🖥️ Level 3 · Step 1: explore api (enactive).",
          "html": "<p><strong>API Menus</strong> - watch the themed scene <em>and</em> the interactive panel.</p><p>Everyday hook: <em>Menu of endpoints</em>.</p><p>Brunner stage: <strong>enactive</strong> - start concrete, then build up.</p>"
        },
        {
          "type": "drag",
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "Sort ideas about api.",
          "title": "Sort: API Menus",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Menu of endpoints"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "JSON boxes"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About api",
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
          "coach": "Reveal examples for API Menus.",
          "title": "API Menus - unfold examples",
          "steps": [
            "Hook: Menu of endpoints",
            "Notice: JSON boxes connects to api.",
            "Pattern: the same idea shows up in Auth token idea.",
            "Takeaway: you can explain api using the props you see."
          ]
        },
        {
          "type": "order",
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "Order the learning path for api.",
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
          "coach": "Quick check: API Menus",
          "q": "Which best matches “api” in Backend Builder?",
          "opts": [
            "Menu of endpoints",
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
          "coach": "Explore the 3D scene for API Menus.",
          "html": "<p>Look at the themed 3D scene. Match the dock text to props you can actually see in the 3D scene.</p><p>Tip: <em>Auth token idea</em></p>"
        },
        {
          "type": "equation",
          "scene": "factory",
          "viz": "machines",
          "coach": "Build the idea sentence for api.",
          "tokens": [
            {
              "id": "t1",
              "html": "api"
            },
            {
              "id": "t2",
              "html": "explains"
            },
            {
              "id": "t3",
              "html": "Menu of endpoints"
            }
          ]
        },
        {
          "type": "tap",
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "🖥️ Level 3 · Step 8: explore api (enactive).",
          "html": "<p><strong>API Menus</strong></p><p>Menu of endpoints · JSON boxes · Auth token idea</p><p>Stage: enactive. Use the interactive panel, then continue.</p>"
        },
        {
          "type": "drag",
          "scene": "factory",
          "viz": "machines",
          "coach": "Sort ideas about api.",
          "title": "Sort: API Menus",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Menu of endpoints"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "JSON boxes"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About api",
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
          "coach": "Boss check: API Menus",
          "q": "Which best matches “api” in Backend Builder?",
          "opts": [
            "Menu of endpoints",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        }
      ]
    },
    {
      "kidTitle": "Routes",
      "theme": "routes",
      "emoji": "🖥️",
      "rewardName": "Routes Builder",
      "intro": "In “Routes” you learn routes through play - spiral from concrete actions to symbols (Bruner's theory). Props and panel match the idea.",
      "everyday": [
        "/users",
        "/posts",
        "404 not found"
      ],
      "scene": "factoryFlow",
      "viz": "machines",
      "quiz": [
        {
          "q": "What is a good everyday example of “routes”?",
          "opts": [
            "/users",
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
          "coach": "🖥️ Level 4 · Step 1: explore routes (iconic).",
          "html": "<p><strong>Routes</strong> - watch the themed scene <em>and</em> the interactive panel.</p><p>Everyday hook: <em>/users</em>.</p><p>Brunner stage: <strong>iconic</strong> - start concrete, then build up.</p>"
        },
        {
          "type": "drag",
          "scene": "factory",
          "viz": "machines",
          "coach": "Sort ideas about routes.",
          "title": "Sort: Routes",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "/users"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "/posts"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About routes",
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
          "coach": "Reveal examples for Routes.",
          "title": "Routes - unfold examples",
          "steps": [
            "Hook: /users",
            "Notice: /posts connects to routes.",
            "Pattern: the same idea shows up in 404 not found.",
            "Takeaway: you can explain routes using the props you see."
          ]
        },
        {
          "type": "order",
          "scene": "factory",
          "viz": "machines",
          "coach": "Order the learning path for routes.",
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
          "coach": "Quick check: Routes",
          "q": "Which best matches “routes” in Backend Builder?",
          "opts": [
            "/users",
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
          "coach": "Explore the 3D scene for Routes.",
          "html": "<p>Look at the themed 3D scene. Match the dock text to props you can actually see in the 3D scene.</p><p>Tip: <em>404 not found</em></p>"
        },
        {
          "type": "equation",
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "Build the idea sentence for routes.",
          "tokens": [
            {
              "id": "t1",
              "html": "routes"
            },
            {
              "id": "t2",
              "html": "explains"
            },
            {
              "id": "t3",
              "html": "/users"
            }
          ]
        },
        {
          "type": "tap",
          "scene": "factory",
          "viz": "machines",
          "coach": "🖥️ Level 4 · Step 8: explore routes (iconic).",
          "html": "<p><strong>Routes</strong></p><p>/users · /posts · 404 not found</p><p>Stage: iconic. Use the interactive panel, then continue.</p>"
        },
        {
          "type": "drag",
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "Sort ideas about routes.",
          "title": "Sort: Routes",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "/users"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "/posts"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About routes",
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
          "coach": "Boss check: Routes",
          "q": "Which best matches “routes” in Backend Builder?",
          "opts": [
            "/users",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        }
      ]
    },
    {
      "kidTitle": "Data Store",
      "theme": "data",
      "emoji": "🖥️",
      "rewardName": "Data Analyst",
      "intro": "In “Data Store” you learn data through play - spiral from concrete actions to symbols (Bruner's theory). Props and panel match the idea.",
      "everyday": [
        "Save a record",
        "Read a list",
        "Update & delete"
      ],
      "scene": "factory",
      "viz": "machines",
      "quiz": [
        {
          "q": "What is a good everyday example of “data”?",
          "opts": [
            "Save a record",
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
          "coach": "🖥️ Level 5 · Step 1: explore data (iconic).",
          "html": "<p><strong>Data Store</strong> - watch the themed scene <em>and</em> the interactive panel.</p><p>Everyday hook: <em>Save a record</em>.</p><p>Brunner stage: <strong>iconic</strong> - start concrete, then build up.</p>"
        },
        {
          "type": "drag",
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "Sort ideas about data.",
          "title": "Sort: Data Store",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Save a record"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Read a list"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About data",
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
          "coach": "Reveal examples for Data Store.",
          "title": "Data Store - unfold examples",
          "steps": [
            "Hook: Save a record",
            "Notice: Read a list connects to data.",
            "Pattern: the same idea shows up in Update & delete.",
            "Takeaway: you can explain data using the props you see."
          ]
        },
        {
          "type": "order",
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "Order the learning path for data.",
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
          "coach": "Quick check: Data Store",
          "q": "Which best matches “data” in Backend Builder?",
          "opts": [
            "Save a record",
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
          "coach": "Explore the 3D scene for Data Store.",
          "html": "<p>Look at the themed 3D scene. Match the dock text to props you can actually see in the 3D scene.</p><p>Tip: <em>Update & delete</em></p>"
        },
        {
          "type": "equation",
          "scene": "factory",
          "viz": "machines",
          "coach": "Build the idea sentence for data.",
          "tokens": [
            {
              "id": "t1",
              "html": "data"
            },
            {
              "id": "t2",
              "html": "explains"
            },
            {
              "id": "t3",
              "html": "Save a record"
            }
          ]
        },
        {
          "type": "tap",
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "🖥️ Level 5 · Step 8: explore data (iconic).",
          "html": "<p><strong>Data Store</strong></p><p>Save a record · Read a list · Update & delete</p><p>Stage: iconic. Use the interactive panel, then continue.</p>"
        },
        {
          "type": "drag",
          "scene": "factory",
          "viz": "machines",
          "coach": "Sort ideas about data.",
          "title": "Sort: Data Store",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Save a record"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Read a list"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About data",
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
          "coach": "Boss check: Data Store",
          "q": "Which best matches “data” in Backend Builder?",
          "opts": [
            "Save a record",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        }
      ]
    },
    {
      "kidTitle": "Auth Basics",
      "theme": "auth",
      "emoji": "🖥️",
      "rewardName": "Auth Strategist",
      "intro": "In “Auth Basics” you learn auth through play - spiral from concrete actions to symbols (Bruner's theory). Props and panel match the idea.",
      "everyday": [
        "Login",
        "Session",
        "Password hash idea"
      ],
      "scene": "factoryFlow",
      "viz": "machines",
      "quiz": [
        {
          "q": "What is a good everyday example of “auth”?",
          "opts": [
            "Login",
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
          "coach": "🖥️ Level 6 · Step 1: explore auth (iconic).",
          "html": "<p><strong>Auth Basics</strong> - watch the themed scene <em>and</em> the interactive panel.</p><p>Everyday hook: <em>Login</em>.</p><p>Brunner stage: <strong>iconic</strong> - start concrete, then build up.</p>"
        },
        {
          "type": "drag",
          "scene": "factory",
          "viz": "machines",
          "coach": "Sort ideas about auth.",
          "title": "Sort: Auth Basics",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Login"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Session"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About auth",
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
          "coach": "Reveal examples for Auth Basics.",
          "title": "Auth Basics - unfold examples",
          "steps": [
            "Hook: Login",
            "Notice: Session connects to auth.",
            "Pattern: the same idea shows up in Password hash idea.",
            "Takeaway: you can explain auth using the props you see."
          ]
        },
        {
          "type": "order",
          "scene": "factory",
          "viz": "machines",
          "coach": "Order the learning path for auth.",
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
          "coach": "Quick check: Auth Basics",
          "q": "Which best matches “auth” in Backend Builder?",
          "opts": [
            "Login",
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
          "coach": "Explore the 3D scene for Auth Basics.",
          "html": "<p>Look at the themed 3D scene. Match the dock text to props you can actually see in the 3D scene.</p><p>Tip: <em>Password hash idea</em></p>"
        },
        {
          "type": "equation",
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "Build the idea sentence for auth.",
          "tokens": [
            {
              "id": "t1",
              "html": "auth"
            },
            {
              "id": "t2",
              "html": "explains"
            },
            {
              "id": "t3",
              "html": "Login"
            }
          ]
        },
        {
          "type": "tap",
          "scene": "factory",
          "viz": "machines",
          "coach": "🖥️ Level 6 · Step 8: explore auth (iconic).",
          "html": "<p><strong>Auth Basics</strong></p><p>Login · Session · Password hash idea</p><p>Stage: iconic. Use the interactive panel, then continue.</p>"
        },
        {
          "type": "drag",
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "Sort ideas about auth.",
          "title": "Sort: Auth Basics",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Login"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Session"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About auth",
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
          "coach": "Boss check: Auth Basics",
          "q": "Which best matches “auth” in Backend Builder?",
          "opts": [
            "Login",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        }
      ]
    },
    {
      "kidTitle": "Errors",
      "theme": "errors",
      "emoji": "🖥️",
      "rewardName": "Errors Guardian",
      "intro": "In “Errors” you learn errors through play - spiral from concrete actions to symbols (Bruner's theory). Props and panel match the idea.",
      "everyday": [
        "Try/catch idea",
        "Helpful messages",
        "Logs"
      ],
      "scene": "factory",
      "viz": "machines",
      "quiz": [
        {
          "q": "What is a good everyday example of “errors”?",
          "opts": [
            "Try/catch idea",
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
          "coach": "🖥️ Level 7 · Step 1: explore errors (symbolic).",
          "html": "<p><strong>Errors</strong> - watch the themed scene <em>and</em> the interactive panel.</p><p>Everyday hook: <em>Try/catch idea</em>.</p><p>Brunner stage: <strong>symbolic</strong> - start concrete, then build up.</p>"
        },
        {
          "type": "drag",
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "Sort ideas about errors.",
          "title": "Sort: Errors",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Try/catch idea"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Helpful messages"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About errors",
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
          "coach": "Reveal examples for Errors.",
          "title": "Errors - unfold examples",
          "steps": [
            "Hook: Try/catch idea",
            "Notice: Helpful messages connects to errors.",
            "Pattern: the same idea shows up in Logs.",
            "Takeaway: you can explain errors using the props you see."
          ]
        },
        {
          "type": "order",
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "Order the learning path for errors.",
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
          "coach": "Quick check: Errors",
          "q": "Which best matches “errors” in Backend Builder?",
          "opts": [
            "Try/catch idea",
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
          "coach": "Explore the 3D scene for Errors.",
          "html": "<p>Look at the themed 3D scene. Match the dock text to props you can actually see in the 3D scene.</p><p>Tip: <em>Logs</em></p>"
        },
        {
          "type": "equation",
          "scene": "factory",
          "viz": "machines",
          "coach": "Build the idea sentence for errors.",
          "tokens": [
            {
              "id": "t1",
              "html": "errors"
            },
            {
              "id": "t2",
              "html": "explains"
            },
            {
              "id": "t3",
              "html": "Try/catch idea"
            }
          ]
        },
        {
          "type": "tap",
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "🖥️ Level 7 · Step 8: explore errors (symbolic).",
          "html": "<p><strong>Errors</strong></p><p>Try/catch idea · Helpful messages · Logs</p><p>Stage: symbolic. Use the interactive panel, then continue.</p>"
        },
        {
          "type": "drag",
          "scene": "factory",
          "viz": "machines",
          "coach": "Sort ideas about errors.",
          "title": "Sort: Errors",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Try/catch idea"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Helpful messages"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About errors",
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
          "coach": "Boss check: Errors",
          "q": "Which best matches “errors” in Backend Builder?",
          "opts": [
            "Try/catch idea",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        }
      ]
    },
    {
      "kidTitle": "Framework Peek",
      "theme": "frameworks",
      "emoji": "🖥️",
      "rewardName": "Framework Scholar",
      "intro": "In “Framework Peek” you learn frameworks through play - spiral from concrete actions to symbols (Bruner's theory). Props and panel match the idea.",
      "everyday": [
        "Node idea",
        "Laravel idea",
        "Same patterns"
      ],
      "scene": "factoryFlow",
      "viz": "machines",
      "quiz": [
        {
          "q": "What is a good everyday example of “frameworks”?",
          "opts": [
            "Node idea",
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
          "q": "In Backend Builder, “frameworks” most helps you…",
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
          "coach": "🖥️ Level 8 · Step 1: explore frameworks (symbolic).",
          "html": "<p><strong>Framework Peek</strong> - watch the themed scene <em>and</em> the interactive panel.</p><p>Everyday hook: <em>Node idea</em>.</p><p>Brunner stage: <strong>symbolic</strong> - start concrete, then build up.</p>"
        },
        {
          "type": "drag",
          "scene": "factory",
          "viz": "machines",
          "coach": "Sort ideas about frameworks.",
          "title": "Sort: Framework Peek",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Node idea"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Laravel idea"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About frameworks",
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
          "coach": "Reveal examples for Framework Peek.",
          "title": "Framework Peek - unfold examples",
          "steps": [
            "Hook: Node idea",
            "Notice: Laravel idea connects to frameworks.",
            "Pattern: the same idea shows up in Same patterns.",
            "Takeaway: you can explain frameworks using the props you see."
          ]
        },
        {
          "type": "order",
          "scene": "factory",
          "viz": "machines",
          "coach": "Order the learning path for frameworks.",
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
          "coach": "Quick check: Framework Peek",
          "q": "Which best matches “frameworks” in Backend Builder?",
          "opts": [
            "Node idea",
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
          "coach": "Explore the 3D scene for Framework Peek.",
          "html": "<p>Look at the themed 3D scene. Match the dock text to props you can actually see in the 3D scene.</p><p>Tip: <em>Same patterns</em></p>"
        },
        {
          "type": "equation",
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "Build the idea sentence for frameworks.",
          "tokens": [
            {
              "id": "t1",
              "html": "frameworks"
            },
            {
              "id": "t2",
              "html": "explains"
            },
            {
              "id": "t3",
              "html": "Node idea"
            }
          ]
        },
        {
          "type": "tap",
          "scene": "factory",
          "viz": "machines",
          "coach": "🖥️ Level 8 · Step 8: explore frameworks (symbolic).",
          "html": "<p><strong>Framework Peek</strong></p><p>Node idea · Laravel idea · Same patterns</p><p>Stage: symbolic. Use the interactive panel, then continue.</p>"
        },
        {
          "type": "drag",
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "Sort ideas about frameworks.",
          "title": "Sort: Framework Peek",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Node idea"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Laravel idea"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About frameworks",
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
          "coach": "Boss check: Framework Peek",
          "q": "Which best matches “frameworks” in Backend Builder?",
          "opts": [
            "Node idea",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        }
      ]
    },
    {
      "kidTitle": "Security Habits",
      "theme": "secure",
      "emoji": "🖥️",
      "rewardName": "Security Mentor",
      "intro": "In “Security Habits” you learn secure through play - spiral from concrete actions to symbols (Bruner's theory). Props and panel match the idea.",
      "everyday": [
        "Never trust input",
        "HTTPS",
        "Secrets stay secret"
      ],
      "scene": "factory",
      "viz": "machines",
      "quiz": [
        {
          "q": "What is a good everyday example of “secure”?",
          "opts": [
            "Never trust input",
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
          "q": "In Backend Builder, “secure” most helps you…",
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
          "coach": "🖥️ Level 9 · Step 1: explore secure (symbolic).",
          "html": "<p><strong>Security Habits</strong> - watch the themed scene <em>and</em> the interactive panel.</p><p>Everyday hook: <em>Never trust input</em>.</p><p>Brunner stage: <strong>symbolic</strong> - start concrete, then build up.</p>"
        },
        {
          "type": "drag",
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "Sort ideas about secure.",
          "title": "Sort: Security Habits",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Never trust input"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "HTTPS"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About secure",
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
          "coach": "Reveal examples for Security Habits.",
          "title": "Security Habits - unfold examples",
          "steps": [
            "Hook: Never trust input",
            "Notice: HTTPS connects to secure.",
            "Pattern: the same idea shows up in Secrets stay secret.",
            "Takeaway: you can explain secure using the props you see."
          ]
        },
        {
          "type": "order",
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "Order the learning path for secure.",
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
          "coach": "Quick check: Security Habits",
          "q": "Which best matches “secure” in Backend Builder?",
          "opts": [
            "Never trust input",
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
          "coach": "Explore the 3D scene for Security Habits.",
          "html": "<p>Look at the themed 3D scene. Match the dock text to props you can actually see in the 3D scene.</p><p>Tip: <em>Secrets stay secret</em></p>"
        },
        {
          "type": "equation",
          "scene": "factory",
          "viz": "machines",
          "coach": "Build the idea sentence for secure.",
          "tokens": [
            {
              "id": "t1",
              "html": "secure"
            },
            {
              "id": "t2",
              "html": "explains"
            },
            {
              "id": "t3",
              "html": "Never trust input"
            }
          ]
        },
        {
          "type": "tap",
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "🖥️ Level 9 · Step 8: explore secure (symbolic).",
          "html": "<p><strong>Security Habits</strong></p><p>Never trust input · HTTPS · Secrets stay secret</p><p>Stage: symbolic. Use the interactive panel, then continue.</p>"
        },
        {
          "type": "drag",
          "scene": "factory",
          "viz": "machines",
          "coach": "Sort ideas about secure.",
          "title": "Sort: Security Habits",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Never trust input"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "HTTPS"
            },
            {
              "id": "d",
              "text": "Random noise"
            }
          ],
          "zones": [
            {
              "id": "yes",
              "label": "About secure",
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
          "coach": "Boss check: Security Habits",
          "q": "Which best matches “secure” in Backend Builder?",
          "opts": [
            "Never trust input",
            "A completely unrelated myth",
            "Turning off gravity forever",
            "Ignoring all evidence"
          ],
          "ok": 0
        }
      ]
    },
    {
      "kidTitle": "Backend Boss",
      "theme": "synthesis",
      "emoji": "🖥️",
      "rewardName": "Backend Champion",
      "intro": "In “Backend Boss” you learn synthesis through play - spiral from concrete actions to symbols (Bruner's theory). Props and panel match the idea.",
      "everyday": [
        "Design an API",
        "Trace a request",
        "Ship safely"
      ],
      "scene": "factoryFlow",
      "viz": "machines",
      "quiz": [
        {
          "q": "What is a good everyday example of “synthesis”?",
          "opts": [
            "Design an API",
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
          "q": "In Backend Builder, “synthesis” most helps you…",
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
          "coach": "🖥️ Level 10 · Step 1: explore synthesis (synthesis).",
          "html": "<p><strong>Backend Boss</strong> - watch the themed scene <em>and</em> the interactive panel.</p><p>Everyday hook: <em>Design an API</em>.</p><p>Brunner stage: <strong>synthesis</strong> - start concrete, then build up.</p>"
        },
        {
          "type": "drag",
          "scene": "factory",
          "viz": "machines",
          "coach": "Sort ideas about synthesis.",
          "title": "Sort: Backend Boss",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Design an API"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Trace a request"
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
          "coach": "Reveal examples for Backend Boss.",
          "title": "Backend Boss - unfold examples",
          "steps": [
            "Hook: Design an API",
            "Notice: Trace a request connects to synthesis.",
            "Pattern: the same idea shows up in Ship safely.",
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
          "coach": "Quick check: Backend Boss",
          "q": "Which best matches “synthesis” in Backend Builder?",
          "opts": [
            "Design an API",
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
          "coach": "Explore the 3D scene for Backend Boss.",
          "html": "<p>Look at the themed 3D scene. Match the dock text to props you can actually see in the 3D scene.</p><p>Tip: <em>Ship safely</em></p>"
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
              "html": "Design an API"
            }
          ]
        },
        {
          "type": "tap",
          "scene": "factory",
          "viz": "machines",
          "coach": "🖥️ Level 10 · Step 8: explore synthesis (synthesis).",
          "html": "<p><strong>Backend Boss</strong></p><p>Design an API · Trace a request · Ship safely</p><p>Stage: synthesis. Use the interactive panel, then continue.</p>"
        },
        {
          "type": "drag",
          "scene": "factoryFlow",
          "viz": "machines",
          "coach": "Sort ideas about synthesis.",
          "title": "Sort: Backend Boss",
          "instructions": "Drag each chip into the matching zone.",
          "chips": [
            {
              "id": "a",
              "text": "Design an API"
            },
            {
              "id": "b",
              "text": "Totally unrelated magic"
            },
            {
              "id": "c",
              "text": "Trace a request"
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
          "coach": "Boss check: Backend Boss",
          "q": "Which best matches “synthesis” in Backend Builder?",
          "opts": [
            "Design an API",
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
