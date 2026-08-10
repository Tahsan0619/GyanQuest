#!/usr/bin/env python3
"""Hand-crafted unique digital books for computing/STEM batch (ASCII-safe)."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GAMES = ROOT / "games"

THEORIES = [
    "cognitive-load",
    "dual-coding",
    "multimedia-learning",
    "constructivism",
    "conceptual-change",
    "spiral-scaffold",
    "retrieval-practice",
]


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def fig(src: str, caption: str, alt: str) -> str:
    return (
        "{\n"
        f'              src: "{src}",\n'
        f'              caption: "{esc(caption)}",\n'
        f'              alt: "{esc(alt)}",\n'
        "            }"
    )


def slides_block(place: str, slides: list[tuple[str, str, str]]) -> str:
    inner = ",\n".join(fig(*s) for s in slides)
    return (
        "      figures: [\n"
        "        {\n"
        f'          place: "{place}",\n'
        "          slides: [\n"
        f"{inner},\n"
        "          ],\n"
        "        },\n"
        "      ],\n"
    )


def p(text: str) -> str:
    return f'        {{\n          type: "p",\n          text: "{esc(text)}",\n        }}'


def ul(items: list[str]) -> str:
    joined = ",\n".join(f'            "{esc(i)}"' for i in items)
    return (
        '        {\n'
        '          type: "ul",\n'
        "          items: [\n"
        f"{joined},\n"
        "          ],\n"
        "        }"
    )


def page(
    title: str,
    layout: str,
    theory: list[str],
    blocks: list[str],
    figures: str = "",
) -> str:
    th = ",\n".join(f'        "{t}"' for t in theory)
    bl = ",\n".join(blocks)
    return (
        "    {\n"
        f'      title: "{esc(title)}",\n'
        f'      layout: "{layout}",\n'
        "      theory: [\n"
        f"{th},\n"
        "      ],\n"
        f"{figures}"
        "      blocks: [\n"
        f"{bl},\n"
        "      ],\n"
        "    }"
    )


def book_js(
    game: str,
    mission_index: int,
    title: str,
    subtitle: str,
    subject: str,
    glossary: list[tuple[str, str]],
    pages: list[str],
    cover_art: str,
) -> str:
    gloss = ",\n".join(
        f'    {{ id: "{gid}", term: "{esc(term)}" }}' for gid, term in glossary
    )
    theories = ",\n".join(f'    "{t}"' for t in THEORIES)
    pages_s = ",\n".join(pages)
    header = (
        f"/**\n"
        f" * Digital book - {subject}\n"
        f" * Theory: cognitive load, dual coding, multimedia learning, constructivism,\n"
        f" * conceptual change, spiral scaffold, retrieval practice.\n"
        f" * Photos: local verified copies under /games/{game}/assets/book/ (see CREDITS-m{mission_index+1}.json).\n"
        f" */\n"
    )
    return (
        header
        + "export const BOOK = {\n"
        f"  missionIndex: {mission_index},\n"
        f'  title: "{esc(title)}",\n'
        f'  subtitle: "{esc(subtitle)}",\n'
        f'  subject: "{esc(subject)}",\n'
        "  theories: [\n"
        f"{theories},\n"
        "  ],\n"
        "  cover: {\n"
        f'    title: "{esc(title)}",\n'
        f'    art: "{cover_art}",\n'
        "  },\n"
        "  glossary: [\n"
        f"{gloss},\n"
        "  ],\n"
        "  pages: [\n"
        f"{pages_s},\n"
        "  ],\n"
        "};\n\n"
        "export default BOOK;\n"
    )


def asset(game: str, level: int, slot: str, ext: str = "jpg") -> str:
    return f"/games/{game}/assets/book/m{level}-{slot}.{ext}"


def write_book(game: str, level: int, content: str) -> Path:
    path = GAMES / game / "books" / f"level{level}.js"
    path.parent.mkdir(parents=True, exist_ok=True)
    # ASCII-only enforce
    content.encode("ascii")
    path.write_text(content, encoding="ascii", newline="\n")
    return path


# ---------------------------------------------------------------------------
# BOOKS
# ---------------------------------------------------------------------------

def ai_lab_1() -> str:
    g = "ai-lab"
    L = 1
    cover = asset(g, L, "cover")
    pages = [
        page(
            "Why What is AI?",
            "text",
            ["constructivism", "dual-coding", "cognitive-load"],
            [
                p("Your phone tags a cat photo. A voice helper guesses your next word. A map app suggests a faster road home."),
                p("None of those tools is a tiny person living in the silicon. They are systems that spot patterns in examples - then guess on new cases."),
                p("Everyday hook in Bangladesh: a shop camera that flags empty shelves learns from many past shelf photos, not from magic."),
            ],
            slides_block("top", [
                (asset(g, L, "hook"), "Figure 1. Rovers and robots follow sensed patterns - a concrete cousin of AI guessing.", "NASA rover on rocky terrain"),
                (cover, "Lab robots remind us: machines act on data, not feelings.", "Industrial-style robot"),
            ]),
        ),
        page(
            "Examples fuel patterns",
            "full-fig",
            ["multimedia-learning", "dual-coding"],
            [
                p("Feed many labeled examples. Patterns emerge. New inputs get a guess."),
                ul([
                    "More varied examples usually mean sturdier patterns",
                    "Messy or biased examples can bend the guess",
                    "A light switch is automation - not pattern learning",
                ]),
            ],
            slides_block("full", [
                (asset(g, L, "model"), "Figure 2. Brains inspire metaphors - but AI is statistics over examples, not a human mind.", "Human brain illustration"),
            ]),
        ),
        page(
            "Pattern dial in the lab",
            "text",
            ["cognitive-load", "dual-coding"],
            [
                p("In the mission you raised a pattern dial. Clarity went up until the guess looked solid."),
                p("Think of that dial as how cleanly the examples line up. Sparse, noisy data keeps the dial low."),
            ],
            slides_block("top", [
                (asset(g, L, "mechanism"), "Figure 3. Autonomous systems stack sensors + patterns + checks.", "Autonomous system hardware"),
                (asset(g, L, "lab"), "A lab bench is where you test guesses against fresh cases.", "Laboratory workspace"),
            ]),
        ),
        page(
            "Sort: AI, not AI, tricky",
            "full-fig",
            ["multimedia-learning", "spiral-scaffold"],
            [
                p("Photo taggers, voice helpers, and route suggesters lean on learned patterns."),
                p("Plain calculators and wall clocks follow fixed rules. A scripted FAQ bot can look smart yet only replay canned lines - tricky."),
            ],
            slides_block("full", [
                (asset(g, L, "mastery"), "Figure 4. A robotic arm repeats trained motions - still pattern + control, not human thought.", "Robotic arm"),
            ]),
        ),
        page(
            "How the 10 steps connect",
            "text",
            ["spiral-scaffold", "cognitive-load"],
            [
                p("Meet -> dial clarity -> sort tools -> stronger lab -> order the guess story -> name the rule -> stretch places -> myth bust -> fluency -> mastery."),
                ul([
                    "Sorting teaches what counts as AI",
                    "The dial links data quality to guess strength",
                    "The rule sentence locks: AI learns patterns from examples",
                ]),
            ],
        ),
        page(
            "Street lab: photo tags",
            "split",
            ["constructivism", "dual-coding", "retrieval-practice"],
            [
                p("Open a gallery app that suggests names. Ask: what examples trained this? What would confuse it?"),
                ul([
                    "Name one AI tool and one non-AI tool at home",
                    "Explain why a wrong tag might happen",
                    "Drag the photos to flip lab vs field views",
                ]),
            ],
            slides_block("right", [
                (asset(g, L, "hook"), "Field rover - sensing then deciding.", "Rover"),
                (asset(g, L, "lab"), "Bench testing - check before you trust.", "Lab"),
                (cover, "Robot hardware - patterns in motion.", "Robot"),
            ]),
        ),
        page(
            "Myths to bust",
            "text",
            ["conceptual-change"],
            [
                p("Myth: AI is a magic brain that thinks like humans. Better: AI spots statistical patterns in examples."),
                p("Myth: AI never needs data. Better: good examples are the fuel for pattern learning."),
                p("Myth: every automated button is AI. Better: simple switches and fixed scripts are not AI."),
                p("Red words are glossary terms. Tap one to ask the tutor."),
            ],
        ),
        page(
            "Mastery",
            "text",
            ["retrieval-practice", "spiral-scaffold"],
            [
                p("Teach a friend in one minute: AI learns patterns from examples, then guesses on new cases - and guesses can be wrong until data and checks improve."),
                ul([
                    "Say the rule out loud once",
                    "Point to a phone feature that uses patterns",
                    "Name one myth you can bust",
                ]),
            ],
            slides_block("top", [
                (asset(g, L, "mastery"), "Figure 5. Keep this arm as your teaching anchor: trained motion, checked outcomes.", "Robotic arm anchor"),
            ]),
        ),
    ]
    gloss = [
        ("pattern", "pattern"),
        ("examples", "examples"),
        ("guess", "guess"),
        ("data", "data"),
        ("model", "model"),
        ("bias", "bias"),
        ("automation", "automation"),
        ("feedback", "feedback"),
        ("input", "input"),
        ("output", "output"),
    ]
    return book_js(g, 0, "What is AI?", "patterns from examples, not magic", "AI Lab / What is AI?", gloss, pages, cover)


def ai_lab_2() -> str:
    g = "ai-lab"
    L = 2
    cover = asset(g, L, "cover")
    pages = [
        page(
            "Why Pattern Predict?",
            "text",
            ["constructivism", "dual-coding", "cognitive-load"],
            [
                p("Bead necklaces, traffic lights, and class timetables all repeat. Once you see the repeat, you can name the next piece before it shows."),
                p("This mission trains prediction as a skill: spot structure, then forecast - not lucky guessing."),
                p("Everyday hook: if lights go green-yellow-red, you already know what comes after green again."),
            ],
            slides_block("top", [
                (asset(g, L, "hook"), "Figure 1. Repeating visual patterns - train your eye before you predict.", "Repeating pattern image"),
                (cover, "Pattern tiles as a warm-up for sequence guessing.", "Pattern graphic"),
            ]),
        ),
        page(
            "Clue vs noise",
            "full-fig",
            ["multimedia-learning", "dual-coding"],
            [
                p("A true clue repeats: same order, same gap, a next slot waiting."),
                p("Noise is a one-off blot or sticker. Tricky near-repeats try to fool you - check twice."),
            ],
            slides_block("full", [
                (asset(g, L, "model"), "Figure 2. Rovers follow planned sequences - each next move rides on the pattern of the plan.", "Curiosity rover"),
            ]),
        ),
        page(
            "Confidence dial",
            "text",
            ["cognitive-load", "dual-coding"],
            [
                p("In the lab you raised prediction confidence. Confidence should rise only when the repeating structure is clear."),
                p("If the sequence twists once, pause and re-map the rule before guessing again."),
            ],
            slides_block("top", [
                (asset(g, L, "mechanism"), "Figure 3. Orbit diagrams are sequential plans - next position follows the rule.", "Orbit diagram"),
                (asset(g, L, "lab"), "Notebooks help you sketch the repeat before you speak the next piece.", "Notebook"),
            ]),
        ),
        page(
            "Predict, then check",
            "full-fig",
            ["multimedia-learning", "spiral-scaffold"],
            [
                p("Say the next piece out loud. Reveal. Match? Keep the rule. Miss? Rebuild the pattern from the start."),
                p("One lucky hit is not mastery. Reliable prediction beats a single cheer."),
            ],
            slides_block("full", [
                (asset(g, L, "mastery"), "Figure 4. Mars paths succeed when the next step matches the plan.", "Mars rover"),
            ]),
        ),
        page(
            "How the 10 steps connect",
            "text",
            ["spiral-scaffold", "cognitive-load"],
            [
                p("Meet sequence -> dial confidence -> sort clues -> stronger lab -> why we predict -> name the rule -> stretch places -> myths -> fluency -> mastery."),
                ul([
                    "Sorting separates pattern clues from noise",
                    "Checking after a guess closes the learning loop",
                    "Rule: see the repeat, then predict the next piece",
                ]),
            ],
        ),
        page(
            "Street lab: lights and beads",
            "split",
            ["constructivism", "dual-coding", "retrieval-practice"],
            [
                p("Watch a traffic light cycle or a friendship bracelet pattern. Pause mid-way and predict the next color."),
                ul([
                    "Write the repeating block (e.g. R-G-B)",
                    "Name what would count as noise",
                    "Flip the carousel to compare plan vs field",
                ]),
            ],
            slides_block("right", [
                (cover, "Abstract repeat.", "Pattern"),
                (asset(g, L, "mechanism"), "Planned path.", "Orbit"),
                (asset(g, L, "hook"), "Visual rhythm.", "Pattern close-up"),
            ]),
        ),
        page(
            "Myths to bust",
            "text",
            ["conceptual-change"],
            [
                p("Myth: predicting means you never need a pattern. Better: predictions ride on the repeating structure you noticed."),
                p("Myth: one lucky guess equals mastery. Better: check against the real next piece."),
                p("Myth: noise is the same as a pattern clue. Better: noise does not reliably repeat."),
                p("Red words are glossary terms. Tap one to ask the tutor."),
            ],
        ),
        page(
            "Mastery",
            "text",
            ["retrieval-practice", "spiral-scaffold"],
            [
                p("Teach a friend: find the repeating block, predict the next piece, then verify. Misses teach you to re-check the pattern."),
                ul([
                    "Build a 6-bead pattern and hide the last bead",
                    "Have a partner predict, then reveal",
                    "Use the word sequence correctly once",
                ]),
            ],
            slides_block("top", [
                (asset(g, L, "mastery"), "Figure 5. Anchor: next step follows the plan.", "Rover anchor"),
            ]),
        ),
    ]
    gloss = [
        ("pattern", "pattern"),
        ("sequence", "sequence"),
        ("predict", "predict"),
        ("repeat", "repeat"),
        ("clue", "clue"),
        ("noise", "noise"),
        ("confidence", "confidence"),
        ("verify", "verify"),
        ("rule", "rule"),
        ("next", "next"),
    ]
    return book_js(g, 1, "Pattern Predict", "see a pattern, predict the next piece", "AI Lab / Pattern Predict", gloss, pages, cover)


def web_1() -> str:
    g = "web-dev-studio"
    L = 1
    cover = asset(g, L, "cover")
    pages = [
        page(
            "Why HTML House?",
            "text",
            ["constructivism", "dual-coding", "cognitive-load"],
            [
                p("A web page is a house. Tags are rooms: <html> wraps the building, <head> holds the blueprints, <body> holds what visitors see."),
                p("School notice pages, family photo blogs, and news headline blocks all start as nested tags - not as random text soup."),
                p("Everyday hook: a BD news site headline sits inside structured tags so browsers know what is title vs story."),
            ],
            slides_block("top", [
                (asset(g, L, "hook"), "Figure 1. Learning spaces need clear rooms - pages need clear tags.", "Education setting"),
                (cover, "Computers render the house you describe with markup.", "Computer workstation"),
            ]),
        ),
        page(
            "Open and close",
            "full-fig",
            ["multimedia-learning", "dual-coding"],
            [
                p("Most tags come in pairs: open, content, close. Nesting order builds the house from outside in."),
                ul([
                    "<html> wraps everything",
                    "<head> stores title and meta",
                    "<body> holds headings, paragraphs, and images you see",
                ]),
            ],
            slides_block("full", [
                (asset(g, L, "model"), "Figure 2. Complex systems still need a clear outer shell - like <html> around a page.", "ISS computer systems"),
            ]),
        ),
        page(
            "Structure dial",
            "text",
            ["cognitive-load", "dual-coding"],
            [
                p("In the mission you opened more rooms until the house felt complete. More clear tags beat one giant unlabeled pile."),
                p("Browsers and people both thank you for tidy nesting."),
            ],
            slides_block("top", [
                (asset(g, L, "mechanism"), "Figure 3. Circuits are structured layers - pages are structured tags.", "Circuit board"),
                (asset(g, L, "lab"), "Classroom pages and school notices share the same HTML bones.", "Classroom science"),
            ]),
        ),
        page(
            "Sort the rooms",
            "full-fig",
            ["multimedia-learning", "spiral-scaffold"],
            [
                p("Headings, paragraphs, and images belong in the body. Titles and meta hints belong in the head."),
                p("CSS will paint later. First, get the walls right."),
            ],
            slides_block("full", [
                (asset(g, L, "mastery"), "Figure 4. Chips pack ordered parts - HTML packs ordered elements.", "Integrated circuit"),
            ]),
        ),
        page(
            "How the 10 steps connect",
            "text",
            ["spiral-scaffold", "cognitive-load"],
            [
                p("Meet the tag house -> open rooms -> sort structure -> build more rooms -> why nest -> name the house rule -> stretch real pages -> myths -> fluency -> mastery."),
                ul([
                    "Sorting teaches head vs body jobs",
                    "Nesting practice prevents broken houses",
                    "Rule: tags structure the page like rooms in a house",
                ]),
            ],
        ),
        page(
            "Street lab: view source",
            "split",
            ["constructivism", "dual-coding", "retrieval-practice"],
            [
                p("With a grown-up, peek at a simple school page. Find <html>, <head>, <body>, and one heading tag."),
                ul([
                    "Sketch a three-room house labeled html / head / body",
                    "Write one open and close pair by hand",
                    "Flip photos: classroom page vs chip structure",
                ]),
            ],
            slides_block("right", [
                (asset(g, L, "lab"), "School-style page context.", "Classroom"),
                (asset(g, L, "mechanism"), "Layered structure metaphor.", "Circuit"),
                (cover, "Where markup becomes a screen.", "Computer"),
            ]),
        ),
        page(
            "Myths to bust",
            "text",
            ["conceptual-change"],
            [
                p("Myth: HTML is only for experts. Better: kids can learn core tags with clear labs."),
                p("Myth: tags can stay open forever. Better: most tags need a matching close tag."),
                p("Myth: CSS and HTML are the same. Better: HTML = structure; CSS = look."),
                p("Red words are glossary terms. Tap one to ask the tutor."),
            ],
        ),
        page(
            "Mastery",
            "text",
            ["retrieval-practice", "spiral-scaffold"],
            [
                p("Teach a friend: a page is a house; tags are rooms; nest carefully; head holds meta, body holds what you see."),
                ul([
                    "Name three tags and their jobs",
                    "Draw nesting as boxes inside boxes",
                    "Use the word element correctly once",
                ]),
            ],
            slides_block("top", [
                (asset(g, L, "mastery"), "Figure 5. Ordered parts - your HTML goal.", "Chip anchor"),
            ]),
        ),
    ]
    gloss = [
        ("html", "html"),
        ("head", "head"),
        ("body", "body"),
        ("tag", "tag"),
        ("element", "element"),
        ("nesting", "nesting"),
        ("markup", "markup"),
        ("browser", "browser"),
        ("structure", "structure"),
        ("attribute", "attribute"),
    ]
    return book_js(g, 0, "HTML House", "structure tags", "Web Dev Studio / HTML House", gloss, pages, cover)


def web_2() -> str:
    g = "web-dev-studio"
    L = 2
    cover = asset(g, L, "cover")
    pages = [
        page(
            "Why CSS Style?",
            "text",
            ["constructivism", "dual-coding", "cognitive-load"],
            [
                p("HTML built the rooms. CSS paints them: color, size, and spacing so a page is clear to read from a phone or a wall screen."),
                p("School posters, shop product cards, and rickshaw ads all fail when text is tiny or colors fight."),
                p("Everyday hook: a market flyer that must read from far uses contrast and gap - the same ideas as CSS."),
            ],
            slides_block("top", [
                (asset(g, L, "hook"), "Figure 1. Experiments tweak one variable - CSS tweaks look without breaking structure.", "Experiment setup"),
                (cover, "Chips are dense; good CSS keeps pages breathable.", "Computer chip"),
            ]),
        ),
        page(
            "Look vs structure",
            "full-fig",
            ["multimedia-learning", "dual-coding"],
            [
                p("HTML says what a heading is. CSS says how big, which color, and how much space around it."),
                ul([
                    "A few clear colors beat a messy rainbow",
                    "Readable size matters on phones",
                    "Gap and margin guide the eye",
                ]),
            ],
            slides_block("full", [
                (asset(g, L, "model"), "Figure 2. Clear signals across distance - pages need the same clarity.", "Satellite communication dish"),
            ]),
        ),
        page(
            "Style dial",
            "text",
            ["cognitive-load", "dual-coding"],
            [
                p("In the lab you dialed style strength. Too little and the page looks raw; too much noise and nothing stands out."),
                p("Aim for hierarchy: one loud headline, quieter body text, steady spacing."),
            ],
            slides_block("top", [
                (asset(g, L, "mechanism"), "Figure 3. Light is a design tool - contrast helps text pop.", "Incandescent light bulb"),
                (asset(g, L, "lab"), "Try changes, then check readability.", "Laboratory"),
            ]),
        ),
        page(
            "Layout that breathes",
            "full-fig",
            ["multimedia-learning", "spiral-scaffold"],
            [
                p("Whitespace is not empty waste. It separates ideas so a shop card or notice can be scanned in a second."),
                p("CSS box ideas - margin, padding, border - are how you carve that air."),
            ],
            slides_block("full", [
                (asset(g, L, "mastery"), "Figure 4. Ordered hardware still leaves pathways - leave pathways on your page.", "Computer workstation"),
            ]),
        ),
        page(
            "How the 10 steps connect",
            "text",
            ["spiral-scaffold", "cognitive-load"],
            [
                p("Meet style -> dial look -> sort style jobs -> stronger layout lab -> why spacing -> name the style rule -> stretch posters -> myths -> fluency -> mastery."),
                ul([
                    "Sorting separates structure jobs from look jobs",
                    "Dial practice links contrast to readability",
                    "Rule: CSS paints HTML rooms with color, size, and space",
                ]),
            ],
        ),
        page(
            "Street lab: poster audit",
            "split",
            ["constructivism", "dual-coding", "retrieval-practice"],
            [
                p("Pick a school poster or shop sign. Score contrast, text size, and spacing from 1 to 5."),
                ul([
                    "Suggest one CSS-like fix (bigger type, more gap, fewer colors)",
                    "Name what should stay HTML structure",
                    "Flip carousel: bulb contrast vs chip density",
                ]),
            ],
            slides_block("right", [
                (asset(g, L, "mechanism"), "Contrast tool.", "Bulb"),
                (asset(g, L, "hook"), "Try and check.", "Experiment"),
                (cover, "Dense vs breathable.", "Chip"),
            ]),
        ),
        page(
            "Myths to bust",
            "text",
            ["conceptual-change"],
            [
                p("Myth: more colors always look better. Better: a few clear colors beat a messy rainbow."),
                p("Myth: CSS and HTML are the same job. Better: HTML structures; CSS styles the look."),
                p("Myth: spacing does not matter. Better: gap and margin guide the eye."),
                p("Red words are glossary terms. Tap one to ask the tutor."),
            ],
        ),
        page(
            "Mastery",
            "text",
            ["retrieval-practice", "spiral-scaffold"],
            [
                p("Teach a friend: structure first, then paint with CSS - contrast, size, spacing."),
                ul([
                    "Say one property you would change on a messy page",
                    "Explain why tiny text fails on phones",
                    "Use the word stylesheet correctly once",
                ]),
            ],
            slides_block("top", [
                (asset(g, L, "mastery"), "Figure 5. Clear pathways - your CSS goal.", "Computer anchor"),
            ]),
        ),
    ]
    gloss = [
        ("css", "css"),
        ("stylesheet", "stylesheet"),
        ("selector", "selector"),
        ("color", "color"),
        ("margin", "margin"),
        ("padding", "padding"),
        ("contrast", "contrast"),
        ("layout", "layout"),
        ("font", "font"),
        ("spacing", "spacing"),
    ]
    return book_js(g, 1, "CSS Style", "look & layout", "Web Dev Studio / CSS Style", gloss, pages, cover)


def web_3() -> str:
    g = "web-dev-studio"
    L = 3
    cover = asset(g, L, "cover")
    pages = [
        page(
            "Why JS Click?",
            "text",
            ["constructivism", "dual-coding", "cognitive-load"],
            [
                p("A click is an event. JavaScript runs code that changes the page - Start buttons, quiz taps, and ticket kiosks wake up."),
                p("HTML alone is a still house. CSS dresses it. JS makes doors open when you knock."),
                p("Everyday hook: a BD ticket kiosk that lights a seat after a tap is event then change."),
            ],
            slides_block("top", [
                (asset(g, L, "hook"), "Figure 1. Arms move when a signal arrives - pages change when an event fires.", "Robotic arm"),
                (cover, "Interactive systems live where software meets controls.", "ISS computer"),
            ]),
        ),
        page(
            "Event then change",
            "full-fig",
            ["multimedia-learning", "dual-coding"],
            [
                p("Listen for an event (click/tap). Run a small clear change (show text, toggle a class, count a score)."),
                ul([
                    "One click can do one clear job",
                    "Forms and quizzes use the same idea as games",
                    "No event means the page stays still",
                ]),
            ],
            slides_block("full", [
                (asset(g, L, "model"), "Figure 2. A chip waits for signals - JS waits for events.", "Computer chip"),
            ]),
        ),
        page(
            "Interaction dial",
            "text",
            ["cognitive-load", "dual-coding"],
            [
                p("In the lab you raised interaction until the button felt alive. Alive means: event hooked, change visible, feedback clear."),
                p("Keep handlers small. Giant mystery scripts are hard to debug and hard to teach."),
            ],
            slides_block("top", [
                (asset(g, L, "mechanism"), "Figure 3. Signals travel - clicks travel from finger to code.", "Satellite communication"),
                (asset(g, L, "lab"), "Test each click path like an experiment trial.", "Experiment"),
            ]),
        ),
        page(
            "Buttons with jobs",
            "full-fig",
            ["multimedia-learning", "spiral-scaffold"],
            [
                p("Game Start, quiz A/B/C, and kiosk Confirm each map to an event plus a change."),
                p("Name the job before you write the code: what should the user see after the tap?"),
            ],
            slides_block("full", [
                (asset(g, L, "mastery"), "Figure 4. Ordered boards still need a trigger path - so do interactive pages.", "Circuit board"),
            ]),
        ),
        page(
            "How the 10 steps connect",
            "text",
            ["spiral-scaffold", "cognitive-load"],
            [
                p("Meet click -> dial interaction -> sort event jobs -> stronger lab -> why events -> name the click rule -> stretch kiosks -> myths -> fluency -> mastery."),
                ul([
                    "Sorting shows HTML cannot react alone",
                    "Labs prove event + change",
                    "Rule: a click is an event; JS runs the change",
                ]),
            ],
        ),
        page(
            "Street lab: button hunt",
            "split",
            ["constructivism", "dual-coding", "retrieval-practice"],
            [
                p("Find three tappable things today (app, site, kiosk). For each, say the event and the visible change."),
                ul([
                    "Sketch event -> change as two boxes",
                    "Invent a quiz button behavior in one sentence",
                    "Flip carousel: arm motion vs signal path",
                ]),
            ],
            slides_block("right", [
                (asset(g, L, "hook"), "Motion after signal.", "Arm"),
                (asset(g, L, "mechanism"), "Signal path.", "Satellite"),
                (cover, "Control surface.", "Computer"),
            ]),
        ),
        page(
            "Myths to bust",
            "text",
            ["conceptual-change"],
            [
                p("Myth: pages never need clicks. Better: many pages wake up when you click or tap."),
                p("Myth: HTML alone makes buttons react. Better: a reaction needs an event plus code."),
                p("Myth: JavaScript is only for games. Better: forms, quizzes, and switches use it too."),
                p("Red words are glossary terms. Tap one to ask the tutor."),
            ],
        ),
        page(
            "Mastery",
            "text",
            ["retrieval-practice", "spiral-scaffold"],
            [
                p("Teach a friend: event then change. Keep each click's job small and visible."),
                ul([
                    "Name one event besides click (e.g. tap, submit)",
                    "Describe a before/after for a Start button",
                    "Use the word handler correctly once",
                ]),
            ],
            slides_block("top", [
                (asset(g, L, "mastery"), "Figure 5. Trigger paths - your JS goal.", "Circuit anchor"),
            ]),
        ),
    ]
    gloss = [
        ("javascript", "javascript"),
        ("event", "event"),
        ("click", "click"),
        ("handler", "handler"),
        ("listener", "listener"),
        ("function", "function"),
        ("button", "button"),
        ("interaction", "interaction"),
        ("dom", "dom"),
        ("feedback", "feedback"),
    ]
    return book_js(g, 2, "JS Click", "interaction", "Web Dev Studio / JS Click", gloss, pages, cover)


def sql_1() -> str:
    g = "database-sql"
    L = 1
    cover = asset(g, L, "cover")
    pages = [
        page(
            "Why Tables & Rows?",
            "text",
            ["constructivism", "dual-coding", "cognitive-load"],
            [
                p("Phone contacts, class registers, and shop inventory sheets are tables: neat rows and columns."),
                p("Each row is one record. Each column is one field - like name, city, or stock count."),
                p("Everyday hook: your contacts list is already a tiny database without the scary name."),
            ],
            slides_block("top", [
                (asset(g, L, "hook"), "Figure 1. Counting tools love grids - databases love rows and columns.", "Abacus"),
                (cover, "Notebook grids preview how tables store facts.", "Notebook"),
            ]),
        ),
        page(
            "Row vs column",
            "full-fig",
            ["multimedia-learning", "dual-coding"],
            [
                p("A row holds one whole story (one student, one product). A column holds the same kind of fact across stories."),
                ul([
                    "id, name, city are columns",
                    "One student across those columns is a row",
                    "Messy piles of notes are not tables yet",
                ]),
            ],
            slides_block("full", [
                (asset(g, L, "model"), "Figure 2. Graphs summarize table numbers - first you need clean fields.", "Data graph"),
            ]),
        ),
        page(
            "Table dial",
            "text",
            ["cognitive-load", "dual-coding"],
            [
                p("In the mission you tightened the grid until rows and columns snapped into place."),
                p("Clear headers beat mystery scribbles. Same column means same kind of value."),
            ],
            slides_block("top", [
                (asset(g, L, "mechanism"), "Figure 3. Computers store tables as structured data, not cake crumbs.", "Computer"),
                (asset(g, L, "lab"), "Class registers are live tables you already read.", "Education setting"),
            ]),
        ),
        page(
            "Read a grid",
            "full-fig",
            ["multimedia-learning", "spiral-scaffold"],
            [
                p("Practice pointing: this cell is row 3, column city. That habit unlocks every later SQL question."),
                p("Apps store people, products, and scores this way - not only math class worksheets."),
            ],
            slides_block("full", [
                (asset(g, L, "mastery"), "Figure 4. Measurement sheets are tables in the wild.", "Measurement chart"),
            ]),
        ),
        page(
            "How the 10 steps connect",
            "text",
            ["spiral-scaffold", "cognitive-load"],
            [
                p("Meet tables -> dial grid -> sort row/column -> stronger lab -> why records -> name the table rule -> stretch sheets -> myths -> fluency -> mastery."),
                ul([
                    "Sorting locks row vs column jobs",
                    "Lab grids build reading fluency",
                    "Rule: rows are records; columns are fields",
                ]),
            ],
        ),
        page(
            "Street lab: inventory",
            "split",
            ["constructivism", "dual-coding", "retrieval-practice"],
            [
                p("Make a 3x3 table for a tiny shop: item, price, stock. Fill three rows."),
                ul([
                    "Circle one row and one column",
                    "Explain why cake is not a column name here",
                    "Flip carousel: abacus grid vs notebook grid",
                ]),
            ],
            slides_block("right", [
                (asset(g, L, "hook"), "Count and grid.", "Abacus"),
                (cover, "Write the headers.", "Notebook"),
                (asset(g, L, "model"), "Later: charts from tables.", "Graph"),
            ]),
        ),
        page(
            "Myths to bust",
            "text",
            ["conceptual-change"],
            [
                p("Myth: tables are only for math class. Better: apps store people, products, and scores in tables."),
                p("Myth: columns and rows are the same. Better: columns are fields; rows are whole records."),
                p("Myth: cake is a database column. Better: columns are fields like name - not desserts."),
                p("Red words are glossary terms. Tap one to ask the tutor."),
            ],
        ),
        page(
            "Mastery",
            "text",
            ["retrieval-practice", "spiral-scaffold"],
            [
                p("Teach a friend with a contact list: point to a row, a column, and one cell."),
                ul([
                    "Define record and field in one sentence each",
                    "Build a 4-row class register on paper",
                    "Use the word table correctly once",
                ]),
            ],
            slides_block("top", [
                (asset(g, L, "mastery"), "Figure 5. Clean fields - your table goal.", "Measurement anchor"),
            ]),
        ),
    ]
    gloss = [
        ("table", "table"),
        ("row", "row"),
        ("column", "column"),
        ("record", "record"),
        ("field", "field"),
        ("cell", "cell"),
        ("header", "header"),
        ("database", "database"),
        ("schema", "schema"),
        ("value", "value"),
    ]
    return book_js(g, 0, "Tables & Rows", "rows columns", "Database SQL / Tables & Rows", gloss, pages, cover)


def sql_2() -> str:
    g = "database-sql"
    L = 2
    cover = asset(g, L, "cover")
    pages = [
        page(
            "Why SELECT Stories?",
            "text",
            ["constructivism", "dual-coding", "cognitive-load"],
            [
                p("Ask the table with SELECT. FROM picks which table. WHERE filters which rows get to answer."),
                p("Find contacts in Dhaka, list class 5 names, show items in stock - all are questions, not rewrites."),
                p("Everyday hook: searching your phone contacts by city is a WHERE in disguise."),
            ],
            slides_block("top", [
                (asset(g, L, "hook"), "Figure 1. Processors run instructions - SELECT is an instruction to read.", "Chip"),
                (cover, "Graphs answer questions that started as SELECT.", "Graph"),
            ]),
        ),
        page(
            "Read, don't smash",
            "full-fig",
            ["multimedia-learning", "dual-coding"],
            [
                p("SELECT mainly reads. It does not rewrite the whole table when you only want a list."),
                ul([
                    "Pick only the columns you need",
                    "WHERE narrows the story",
                    "FROM names the table you are asking",
                ]),
            ],
            slides_block("full", [
                (asset(g, L, "model"), "Figure 2. Lab questions are precise - so are good queries.", "Laboratory"),
            ]),
        ),
        page(
            "Query dial",
            "text",
            ["cognitive-load", "dual-coding"],
            [
                p("In the lab you sharpened the question until the result set felt right - not too wide, not empty."),
                p("A fuzzy question returns noise. A clear WHERE returns a usable story."),
            ],
            slides_block("top", [
                (asset(g, L, "mechanism"), "Figure 3. Planned paths - queries follow a planned ask.", "Orbit diagram"),
                (asset(g, L, "lab"), "Signals carry answers back - like a result set.", "Satellite communication"),
            ]),
        ),
        page(
            "Filter the story",
            "full-fig",
            ["multimedia-learning", "spiral-scaffold"],
            [
                p("WHERE city = 'Dhaka' keeps Dhaka rows. Without WHERE, you get everyone - sometimes useful, often too much."),
                p("Kids can write clear questions; tea is a drink, not a SQL keyword."),
            ],
            slides_block("full", [
                (asset(g, L, "mastery"), "Figure 4. Counting tools reward precise asks.", "Abacus"),
            ]),
        ),
        page(
            "How the 10 steps connect",
            "text",
            ["spiral-scaffold", "cognitive-load"],
            [
                p("Meet SELECT -> dial query -> sort clauses -> stronger lab -> why filter -> name the query rule -> stretch contacts -> myths -> fluency -> mastery."),
                ul([
                    "Sorting separates SELECT / FROM / WHERE jobs",
                    "Labs prove filters change the answer set",
                    "Rule: SELECT asks; WHERE filters; tables stay intact",
                ]),
            ],
        ),
        page(
            "Street lab: contact filter",
            "split",
            ["constructivism", "dual-coding", "retrieval-practice"],
            [
                p("On paper, write SELECT name FROM contacts WHERE city = 'Dhaka'. Circle each clause."),
                ul([
                    "Change WHERE and predict the new list",
                    "Explain why SELECT is not a hammer",
                    "Flip carousel: chip instruction vs result graph",
                ]),
            ],
            slides_block("right", [
                (asset(g, L, "hook"), "Instruction.", "Chip"),
                (cover, "Answer shape.", "Graph"),
                (asset(g, L, "mastery"), "Precise count.", "Abacus"),
            ]),
        ),
        page(
            "Myths to bust",
            "text",
            ["conceptual-change"],
            [
                p("Myth: SELECT always changes the table. Better: SELECT mainly reads - it does not rewrite rows."),
                p("Myth: WHERE is just decoration. Better: WHERE filters which rows answer the question."),
                p("Myth: tea is a SQL keyword. Better: SELECT FROM WHERE are keywords - tea is a drink."),
                p("Red words are glossary terms. Tap one to ask the tutor."),
            ],
        ),
        page(
            "Mastery",
            "text",
            ["retrieval-practice", "spiral-scaffold"],
            [
                p("Teach a friend: ask with SELECT, pick the table with FROM, filter with WHERE."),
                ul([
                    "Write one query for in-stock items",
                    "Say what stays unchanged in the table",
                    "Use the word filter correctly once",
                ]),
            ],
            slides_block("top", [
                (asset(g, L, "mastery"), "Figure 5. Precise asks - your SELECT goal.", "Abacus anchor"),
            ]),
        ),
    ]
    gloss = [
        ("select", "select"),
        ("from", "from"),
        ("where", "where"),
        ("query", "query"),
        ("filter", "filter"),
        ("result", "result"),
        ("clause", "clause"),
        ("column", "column"),
        ("row", "row"),
        ("keyword", "keyword"),
    ]
    return book_js(g, 1, "SELECT Stories", "query basics", "Database SQL / SELECT Stories", gloss, pages, cover)


def sql_3() -> str:
    g = "database-sql"
    L = 3
    cover = asset(g, L, "cover")
    pages = [
        page(
            "Why Keys & Joins?",
            "text",
            ["constructivism", "dual-coding", "cognitive-load"],
            [
                p("Student + class list, order + order items, ticket + seat - related stories live in more than one table."),
                p("Keys link those tables. JOIN matches key values so the story stays connected."),
                p("Everyday hook: a bus ticket number must match a seat row - that match is a join idea."),
            ],
            slides_block("top", [
                (asset(g, L, "hook"), "Figure 1. Structures stand when parts connect - tables stand when keys connect.", "Structure"),
                (cover, "Bridges link two sides - JOINs link two tables.", "Bridge"),
            ]),
        ),
        page(
            "What makes a key",
            "full-fig",
            ["multimedia-learning", "dual-coding"],
            [
                p("A good key uniquely identifies a row. Random scribbles that collide break the link."),
                ul([
                    "Primary ideas: one id per student",
                    "Foreign ideas: class_id pointing to a class row",
                    "Orphan rows lose their story link",
                ]),
            ],
            slides_block("full", [
                (asset(g, L, "model"), "Figure 2. Systems keep IDs consistent across modules - so should your keys.", "ISS computer"),
            ]),
        ),
        page(
            "Join dial",
            "text",
            ["cognitive-load", "dual-coding"],
            [
                p("In the lab you raised link strength until matching keys lined up. JOIN ON is the handshake, not tape or socks."),
                p("If keys do not match, the combined story has holes."),
            ],
            slides_block("top", [
                (asset(g, L, "mechanism"), "Figure 3. Patterns of pairing - join matches are patterned equality checks.", "Pattern"),
                (asset(g, L, "lab"), "Practice linking on paper before typing JOIN.", "Classroom"),
            ]),
        ),
        page(
            "Match across tables",
            "full-fig",
            ["multimedia-learning", "spiral-scaffold"],
            [
                p("JOIN students to classes on class_id. Now each student row can carry a class name without copying the whole class table into every row forever."),
                p("Related stories need links; they do not need duplicate chaos."),
            ],
            slides_block("full", [
                (asset(g, L, "mastery"), "Figure 4. Another bridge view - connection is the point.", "Bridge span"),
            ]),
        ),
        page(
            "How the 10 steps connect",
            "text",
            ["spiral-scaffold", "cognitive-load"],
            [
                p("Meet keys -> dial links -> sort key types -> stronger join lab -> why match -> name the join rule -> stretch tickets -> myths -> fluency -> mastery."),
                ul([
                    "Sorting separates unique ids from random numbers",
                    "Labs show JOIN matches values",
                    "Rule: keys link tables; JOIN matches those keys",
                ]),
            ],
        ),
        page(
            "Street lab: ticket + seat",
            "split",
            ["constructivism", "dual-coding", "retrieval-practice"],
            [
                p("Draw two mini tables: tickets(id, seat_id) and seats(id, row). Draw lines where ids match."),
                ul([
                    "Find an orphan ticket with no seat",
                    "Explain why socks are not join tools",
                    "Flip carousel: bridge vs structure metaphor",
                ]),
            ],
            slides_block("right", [
                (cover, "Link sides.", "Bridge"),
                (asset(g, L, "hook"), "Connected parts.", "Structure"),
                (asset(g, L, "mechanism"), "Match patterns.", "Pattern"),
            ]),
        ),
        page(
            "Myths to bust",
            "text",
            ["conceptual-change"],
            [
                p("Myth: tables never need to link. Better: related stories use keys to stay connected."),
                p("Myth: JOIN glues with tape. Better: JOIN matches key values between tables."),
                p("Myth: socks join tables. Better: keys and JOIN ON match fields - not socks."),
                p("Red words are glossary terms. Tap one to ask the tutor."),
            ],
        ),
        page(
            "Mastery",
            "text",
            ["retrieval-practice", "spiral-scaffold"],
            [
                p("Teach a friend: unique keys identify rows; JOIN matches keys across tables so stories connect."),
                ul([
                    "Invent two tables that should link",
                    "Name the shared key field",
                    "Use the word join correctly once",
                ]),
            ],
            slides_block("top", [
                (asset(g, L, "mastery"), "Figure 5. Connection - your join goal.", "Bridge anchor"),
            ]),
        ),
    ]
    gloss = [
        ("key", "key"),
        ("primary", "primary"),
        ("foreign", "foreign"),
        ("join", "join"),
        ("match", "match"),
        ("link", "link"),
        ("unique", "unique"),
        ("orphan", "orphan"),
        ("table", "table"),
        ("id", "id"),
    ]
    return book_js(g, 2, "Keys & Joins", "linking tables", "Database SQL / Keys & Joins", gloss, pages, cover)


def be_1() -> str:
    g = "backend-builder"
    L = 1
    cover = asset(g, L, "cover")
    pages = [
        page(
            "Why Server Basics?",
            "text",
            ["constructivism", "dual-coding", "cognitive-load"],
            [
                p("A client asks. A server answers. Request goes in - response comes back with data and a status."),
                p("Phone weather apps, school portal pages, and shop checkouts all ride this ask/answer loop."),
                p("Everyday hook: opening weather on your phone sends a request; the cloud replies with today's forecast."),
            ],
            slides_block("top", [
                (asset(g, L, "hook"), "Figure 1. Local machines ask; distant machines answer.", "Computer"),
                (cover, "Signals carry requests and responses across distance.", "Satellite communication"),
            ]),
        ),
        page(
            "Client is not server",
            "full-fig",
            ["multimedia-learning", "dual-coding"],
            [
                p("The browser is usually the client. The server lives elsewhere and sends data - not just pretty colors (CSS handles look)."),
                ul([
                    "Request: what you ask for",
                    "Response: status + body of data",
                    "Useful apps wait for an answer or a clear error",
                ]),
            ],
            slides_block("full", [
                (asset(g, L, "model"), "Figure 2. Earth-scale networks - your app still uses the same ask/answer idea.", "Earth from space"),
            ]),
        ),
        page(
            "Request dial",
            "text",
            ["cognitive-load", "dual-coding"],
            [
                p("In the lab you dialed request clarity until a sensible response returned."),
                p("Cake is not a valid HTTP response. Status codes and data are."),
            ],
            slides_block("top", [
                (asset(g, L, "mechanism"), "Figure 3. Boards route signals - servers route responses.", "Circuit board"),
                (asset(g, L, "lab"), "Test ask/answer like an experiment trial.", "Experiment"),
            ]),
        ),
        page(
            "Status matters",
            "full-fig",
            ["multimedia-learning", "spiral-scaffold"],
            [
                p("A good response says whether the ask worked. Silent failure confuses users; clear status helps everyone."),
                p("Kids can learn: client asks, server answers."),
            ],
            slides_block("full", [
                (asset(g, L, "mastery"), "Figure 4. Mission machines that talk in request/response loops.", "ISS computer"),
            ]),
        ),
        page(
            "How the 10 steps connect",
            "text",
            ["spiral-scaffold", "cognitive-load"],
            [
                p("Meet servers -> dial requests -> sort client/server -> stronger lab -> why responses -> name the loop rule -> stretch apps -> myths -> fluency -> mastery."),
                ul([
                    "Sorting kills the myth that the browser is the server",
                    "Labs show request then response",
                    "Rule: client asks; server answers",
                ]),
            ],
        ),
        page(
            "Street lab: weather ask",
            "split",
            ["constructivism", "dual-coding", "retrieval-practice"],
            [
                p("Open a weather app with a grown-up. Say out loud: request sent, response received, data shown."),
                ul([
                    "Name client and server in that story",
                    "Guess what a failed response might look like",
                    "Flip carousel: dish vs earth-scale net",
                ]),
            ],
            slides_block("right", [
                (cover, "Carry the ask.", "Satellite"),
                (asset(g, L, "model"), "Big network.", "Earth"),
                (asset(g, L, "hook"), "Client machine.", "Computer"),
            ]),
        ),
        page(
            "Myths to bust",
            "text",
            ["conceptual-change"],
            [
                p("Myth: the browser is the server. Better: browser is the client - server answers elsewhere."),
                p("Myth: a request never needs a response. Better: useful apps wait for a response (or a clear error)."),
                p("Myth: cake is a valid HTTP response. Better: responses are status and data - not snacks."),
                p("Red words are glossary terms. Tap one to ask the tutor."),
            ],
        ),
        page(
            "Mastery",
            "text",
            ["retrieval-practice", "spiral-scaffold"],
            [
                p("Teach a friend with a shop checkout: client sends order request; server responds with confirmation or error."),
                ul([
                    "Draw arrows: client -> server -> client",
                    "Name one piece of data in a response",
                    "Use the word request correctly once",
                ]),
            ],
            slides_block("top", [
                (asset(g, L, "mastery"), "Figure 5. Talking machines - your server goal.", "ISS computer anchor"),
            ]),
        ),
    ]
    gloss = [
        ("client", "client"),
        ("server", "server"),
        ("request", "request"),
        ("response", "response"),
        ("status", "status"),
        ("http", "http"),
        ("browser", "browser"),
        ("api", "api"),
        ("endpoint", "endpoint"),
        ("error", "error"),
    ]
    return book_js(g, 0, "Server Basics", "request response", "Backend Builder / Server Basics", gloss, pages, cover)


def be_2() -> str:
    g = "backend-builder"
    L = 2
    cover = asset(g, L, "cover")
    pages = [
        page(
            "Why Routes & APIs?",
            "text",
            ["constructivism", "dual-coding", "cognitive-load"],
            [
                p("URLs are doors. Each route path does a job - /users, /posts, /login, /forecast, /grades, /checkout."),
                p("APIs expose those doors so apps can ask for the right room."),
                p("Everyday hook: a weather app hitting /forecast is knocking on one labeled door, not every door at once."),
            ],
            slides_block("top", [
                (asset(g, L, "hook"), "Figure 1. Dense modules still expose clear ports - routes are clear ports.", "Chip"),
                (cover, "Structures need labeled access points.", "Structure"),
            ]),
        ),
        page(
            "One path, one job",
            "full-fig",
            ["multimedia-learning", "dual-coding"],
            [
                p("Every URL is not the same job. /users lists people; /login checks identity; a wrong path can return 404 - not melted servers."),
                ul([
                    "GET often reads",
                    "POST often sends new data",
                    "Methods are not just colors",
                ]),
            ],
            slides_block("full", [
                (asset(g, L, "model"), "Figure 2. Planned paths in space - planned paths in APIs.", "Orbit diagram"),
            ]),
        ),
        page(
            "Route dial",
            "text",
            ["cognitive-load", "dual-coding"],
            [
                p("In the lab you dialed route clarity until each door had a job label."),
                p("Rice is food, not a valid API route. Paths look like /users."),
            ],
            slides_block("top", [
                (asset(g, L, "mechanism"), "Figure 3. Long-range links still need addresses.", "Satellite communication"),
                (asset(g, L, "lab"), "Sketch doors on paper before coding them.", "Education"),
            ]),
        ),
        page(
            "404 means not found",
            "full-fig",
            ["multimedia-learning", "spiral-scaffold"],
            [
                p("A 404 says that route was not found. It is a map problem, not a volcano."),
                p("Kids can learn /users as a door with a job."),
            ],
            slides_block("full", [
                (asset(g, L, "mastery"), "Figure 4. Cranes move to labeled positions - requests move to labeled routes.", "Crane"),
            ]),
        ),
        page(
            "How the 10 steps connect",
            "text",
            ["spiral-scaffold", "cognitive-load"],
            [
                p("Meet routes -> dial paths -> sort jobs -> stronger lab -> why methods -> name the route rule -> stretch school APIs -> myths -> fluency -> mastery."),
                ul([
                    "Sorting maps paths to jobs",
                    "Labs show 404 vs success",
                    "Rule: each route path usually does one clear job",
                ]),
            ],
        ),
        page(
            "Street lab: door map",
            "split",
            ["constructivism", "dual-coding", "retrieval-practice"],
            [
                p("Draw three doors: /forecast, /grades, /checkout. Write one sentence job on each."),
                ul([
                    "Mark which might use GET vs POST",
                    "Invent a 404 story for a typo path",
                    "Flip carousel: structure vs crane positioning",
                ]),
            ],
            slides_block("right", [
                (cover, "Access points.", "Structure"),
                (asset(g, L, "mastery"), "Labeled move.", "Crane"),
                (asset(g, L, "model"), "Planned path.", "Orbit"),
            ]),
        ),
        page(
            "Myths to bust",
            "text",
            ["conceptual-change"],
            [
                p("Myth: every URL is the same job. Better: each route path usually does one clear job."),
                p("Myth: 404 means the server melted. Better: 404 means that route was not found."),
                p("Myth: rice is a valid API route. Better: routes are paths like /users - not food."),
                p("Red words are glossary terms. Tap one to ask the tutor."),
            ],
        ),
        page(
            "Mastery",
            "text",
            ["retrieval-practice", "spiral-scaffold"],
            [
                p("Teach a friend: URLs are doors; methods say how you ask; 404 means missing door."),
                ul([
                    "Name three real-feeling routes",
                    "Explain GET vs POST in kid words",
                    "Use the word endpoint correctly once",
                ]),
            ],
            slides_block("top", [
                (asset(g, L, "mastery"), "Figure 5. Labeled positions - your route goal.", "Crane anchor"),
            ]),
        ),
    ]
    gloss = [
        ("route", "route"),
        ("path", "path"),
        ("endpoint", "endpoint"),
        ("api", "api"),
        ("get", "get"),
        ("post", "post"),
        ("url", "url"),
        ("method", "method"),
        ("status", "status"),
        ("404", "404"),
    ]
    return book_js(g, 1, "Routes & APIs", "paths & endpoints", "Backend Builder / Routes & APIs", gloss, pages, cover)


def be_3() -> str:
    g = "backend-builder"
    L = 3
    cover = asset(g, L, "cover")
    pages = [
        page(
            "Why Auth Lite?",
            "text",
            ["constructivism", "dual-coding", "cognitive-load"],
            [
                p("Login checks identity before private rooms open. Public pages can stay open."),
                p("School grades portals, bank app PINs, and family photo clouds all separate public from private."),
                p("Everyday hook: anyone may see a school homepage; only you should see your grades after login."),
            ],
            slides_block("top", [
                (asset(g, L, "hook"), "Figure 1. Autonomous systems still gate actions on permission checks.", "Autonomous system"),
                (cover, "Labs lock cabinets - apps lock private data.", "Laboratory"),
            ]),
        ),
        page(
            "Public vs private",
            "full-fig",
            ["multimedia-learning", "dual-coding"],
            [
                p("Public pages do not need your password. Private rooms need proof of who you are."),
                ul([
                    "Auth is not only for banks",
                    "Passwords stay private - never share",
                    "Logout ends the session so others cannot peek",
                ]),
            ],
            slides_block("full", [
                (asset(g, L, "model"), "Figure 2. Identity metaphors start in the brain - auth is a digital ID check.", "Human brain"),
            ]),
        ),
        page(
            "Auth dial",
            "text",
            ["cognitive-load", "dual-coding"],
            [
                p("In the lab you dialed gate strength until private doors stayed shut without login."),
                p("Socks are not login tokens. Tokens are digital proofs."),
            ],
            slides_block("top", [
                (asset(g, L, "mechanism"), "Figure 3. Machines that ask who you are before serving private data.", "Computer"),
                (asset(g, L, "lab"), "Write public vs private lists in a notebook first.", "Notebook"),
            ]),
        ),
        page(
            "Session sense",
            "full-fig",
            ["multimedia-learning", "spiral-scaffold"],
            [
                p("After login, a session remembers you for a while. Logout clears that memory on purpose."),
                p("Sharing a password shares your private rooms - do not."),
            ],
            slides_block("full", [
                (asset(g, L, "mastery"), "Figure 4. Guarded systems - auth is the gate.", "Robot gate metaphor"),
            ]),
        ),
        page(
            "How the 10 steps connect",
            "text",
            ["spiral-scaffold", "cognitive-load"],
            [
                p("Meet auth -> dial gates -> sort public/private -> stronger lab -> why logout -> name the auth rule -> stretch portals -> myths -> fluency -> mastery."),
                ul([
                    "Sorting teaches what stays public",
                    "Labs prove login opens private rooms",
                    "Rule: prove who you are before private data",
                ]),
            ],
        ),
        page(
            "Street lab: grades gate",
            "split",
            ["constructivism", "dual-coding", "retrieval-practice"],
            [
                p("List three public school-site things and three private things that need login."),
                ul([
                    "Explain why logout matters on a shared computer",
                    "Invent a safe password rule (length, not sharing)",
                    "Flip carousel: lab lock vs robot gate",
                ]),
            ],
            slides_block("right", [
                (cover, "Locked bench.", "Lab"),
                (asset(g, L, "mastery"), "Guarded system.", "Robot"),
                (asset(g, L, "lab"), "Plan the rules.", "Notebook"),
            ]),
        ),
        page(
            "Myths to bust",
            "text",
            ["conceptual-change"],
            [
                p("Myth: public pages need your password. Better: public pages can open without login."),
                p("Myth: sharing your password is fine. Better: passwords stay private - never share."),
                p("Myth: socks are login tokens. Better: tokens are digital proofs - not clothing."),
                p("Red words are glossary terms. Tap one to ask the tutor."),
            ],
        ),
        page(
            "Mastery",
            "text",
            ["retrieval-practice", "spiral-scaffold"],
            [
                p("Teach a friend: public stays open; private needs identity proof; logout closes the session."),
                ul([
                    "Name one public and one private page",
                    "Say why PIN/password secrecy matters",
                    "Use the word session correctly once",
                ]),
            ],
            slides_block("top", [
                (asset(g, L, "mastery"), "Figure 5. Gatekeeping - your auth goal.", "Robot anchor"),
            ]),
        ),
    ]
    gloss = [
        ("auth", "auth"),
        ("login", "login"),
        ("password", "password"),
        ("session", "session"),
        ("logout", "logout"),
        ("token", "token"),
        ("public", "public"),
        ("private", "private"),
        ("identity", "identity"),
        ("permission", "permission"),
    ]
    return book_js(g, 2, "Auth Lite", "who are you", "Backend Builder / Auth Lite", gloss, pages, cover)


def mech_1() -> str:
    g = "mechanical-basics"
    L = 1
    cover = asset(g, L, "cover")
    # webp for mechanism and lab
    pages = [
        page(
            "Why Levers & Gears?",
            "text",
            ["constructivism", "dual-coding", "cognitive-load"],
            [
                p("Levers and gears make hard jobs easier by trading force, distance, and turn."),
                p("Seesaws, bottle openers, and bike gears are everyday simple machines - not only factory toys."),
                p("Everyday hook: a bottle opener is a lever that multiplies your hand force at the cap."),
            ],
            slides_block("top", [
                (asset(g, L, "hook"), "Figure 1. Motion you can feel - machines redirect it.", "Skateboard motion"),
                (cover, "Gears mesh to trade speed and force.", "Mechanical gears"),
            ]),
        ),
        page(
            "Lever trade",
            "full-fig",
            ["multimedia-learning", "dual-coding"],
            [
                p("A lever pivots on a fulcrum. Move the fulcrum and the push you need changes."),
                ul([
                    "Long effort arm can mean easier lift",
                    "Fulcrum place matters",
                    "Levers do not create magic infinite force",
                ]),
            ],
            slides_block("full", [
                (asset(g, L, "model"), "Figure 2. Gear teeth - another trade of turn and force.", "Gear close-up"),
            ]),
        ),
        page(
            "Gear dial",
            "text",
            ["cognitive-load", "dual-coding"],
            [
                p("In the lab you dialed mechanical advantage until the job felt easier."),
                p("Gears change speed and turn direction. Bigger gear does not mean infinite force - pairs trade together."),
            ],
            slides_block("top", [
                (asset(g, L, "mechanism", "webp"), "Figure 3. Newton cradle shows force transfer along a linked path.", "Newton cradle"),
                (asset(g, L, "lab", "webp"), "Pushing a cart - feel effort vs distance.", "Pushing cart"),
            ]),
        ),
        page(
            "Simple machines around you",
            "full-fig",
            ["multimedia-learning", "spiral-scaffold"],
            [
                p("Seesaws, crowbars, scissors, and bike gear clusters are lever/gear cousins."),
                p("Name the fulcrum, effort, and load when you can."),
            ],
            slides_block("full", [
                (asset(g, L, "mastery"), "Figure 4. Mechanical assemblies - trades in metal.", "Mechanical assembly"),
            ]),
        ),
        page(
            "How the 10 steps connect",
            "text",
            ["spiral-scaffold", "cognitive-load"],
            [
                p("Meet levers -> dial advantage -> sort machine parts -> stronger lab -> why fulcrums -> name the trade rule -> stretch bikes -> myths -> fluency -> mastery."),
                ul([
                    "Sorting names fulcrum vs gear roles",
                    "Labs show force/distance trades",
                    "Rule: levers and gears trade force, distance, and turn",
                ]),
            ],
        ),
        page(
            "Street lab: bottle opener",
            "split",
            ["constructivism", "dual-coding", "retrieval-practice"],
            [
                p("Use a safe bottle opener or a seesaw photo. Point to fulcrum, effort, and load."),
                ul([
                    "Predict what happens if the fulcrum moves",
                    "Find one gear on a bicycle",
                    "Flip carousel: skate motion vs cradle transfer",
                ]),
            ],
            slides_block("right", [
                (asset(g, L, "hook"), "Everyday motion.", "Skateboard"),
                (asset(g, L, "mechanism", "webp"), "Transfer chain.", "Cradle"),
                (cover, "Gear trade.", "Gears"),
            ]),
        ),
        page(
            "Myths to bust",
            "text",
            ["conceptual-change"],
            [
                p("Myth: levers only make things heavier. Better: levers trade distance for force - they help lift."),
                p("Myth: fulcrum position does not matter. Better: fulcrum place changes how hard you push."),
                p("Myth: bigger gear always means infinite force. Better: gear pairs trade speed and force together."),
                p("Red words are glossary terms. Tap one to ask the tutor."),
            ],
        ),
        page(
            "Mastery",
            "text",
            ["retrieval-practice", "spiral-scaffold"],
            [
                p("Teach a friend: fulcrum + effort + load; gears trade speed and force."),
                ul([
                    "Sketch a lever and label three parts",
                    "Explain one bike gear change",
                    "Use the word fulcrum correctly once",
                ]),
            ],
            slides_block("top", [
                (asset(g, L, "mastery"), "Figure 5. Mechanical trade - your lever/gear goal.", "Mechanical anchor"),
            ]),
        ),
    ]
    gloss = [
        ("lever", "lever"),
        ("gear", "gear"),
        ("fulcrum", "fulcrum"),
        ("effort", "effort"),
        ("load", "load"),
        ("force", "force"),
        ("torque", "torque"),
        ("machine", "machine"),
        ("advantage", "advantage"),
        ("trade", "trade"),
    ]
    return book_js(g, 0, "Levers & Gears", "simple machines", "Mechanical Basics / Levers & Gears", gloss, pages, cover)


def mech_2() -> str:
    g = "mechanical-basics"
    L = 2
    cover = asset(g, L, "cover")
    pages = [
        page(
            "Why Motion Machines?",
            "text",
            ["constructivism", "dual-coding", "cognitive-load"],
            [
                p("Wheels, belts, and chains pass motion along a linked path."),
                p("Bike chains, fan belts, and conveyors succeed when each link stays connected and tight enough."),
                p("Everyday hook: pedal a bike - chain links carry your leg motion to the wheel."),
            ],
            slides_block("top", [
                (asset(g, L, "hook"), "Figure 1. Cranes move loads along planned paths - belts do the same for spin.", "Crane"),
                (cover, "Wheels cut friction and carry motion.", "Skateboard motion"),
            ]),
        ),
        page(
            "Links that carry",
            "full-fig",
            ["multimedia-learning", "dual-coding"],
            [
                p("A belt or chain is a motion messenger. Loose belts slip. Jammed belts block the path."),
                ul([
                    "Wheels and axles reduce rubbing losses",
                    "Brakes intentionally block or slow motion",
                    "Engines are not the only motion source - links pass it along",
                ]),
            ],
            slides_block("full", [
                (asset(g, L, "model", "webp"), "Figure 2. Cart push shows how force becomes travel when links work.", "Pushing cart"),
            ]),
        ),
        page(
            "Transfer dial",
            "text",
            ["cognitive-load", "dual-coding"],
            [
                p("In the lab you dialed transfer quality until motion arrived at the far end."),
                p("If the far wheel stays still, check slip, jam, or a missing link."),
            ],
            slides_block("top", [
                (asset(g, L, "mechanism"), "Figure 3. Gears can sit inside a transfer path too.", "Gears"),
                (asset(g, L, "lab"), "Friction can help grip or steal motion - name which.", "Friction study"),
            ]),
        ),
        page(
            "Brakes are blockers",
            "full-fig",
            ["multimedia-learning", "spiral-scaffold"],
            [
                p("Brakes are not broken belts - they are designed to stop transfer on purpose."),
                p("A jammed belt is an accident; a brake is a choice."),
            ],
            slides_block("full", [
                (asset(g, L, "mastery", "webp"), "Figure 4. When the path is clear, push becomes travel.", "Cart motion"),
            ]),
        ),
        page(
            "How the 10 steps connect",
            "text",
            ["spiral-scaffold", "cognitive-load"],
            [
                p("Meet transfer -> dial links -> sort movers/blockers -> stronger lab -> why belts -> name the transfer rule -> stretch conveyors -> myths -> fluency -> mastery."),
                ul([
                    "Sorting separates wheels, belts, and brakes",
                    "Labs show slip vs solid transfer",
                    "Rule: linked paths pass motion; jams and loose belts break it",
                ]),
            ],
        ),
        page(
            "Street lab: bike chain",
            "split",
            ["constructivism", "dual-coding", "retrieval-practice"],
            [
                p("With a bike (or clear photo), trace pedal -> chain -> rear wheel. Find the brake."),
                ul([
                    "Predict what a loose chain does",
                    "Name one conveyor-like machine at a shop",
                    "Flip carousel: crane lift vs cart push",
                ]),
            ],
            slides_block("right", [
                (asset(g, L, "hook"), "Lift path.", "Crane"),
                (asset(g, L, "model", "webp"), "Push path.", "Cart"),
                (cover, "Wheel path.", "Skateboard"),
            ]),
        ),
        page(
            "Myths to bust",
            "text",
            ["conceptual-change"],
            [
                p("Myth: wheels only look round for fun. Better: wheels and axles cut friction and carry motion."),
                p("Myth: a belt never needs to be tight. Better: loose belts slip - motion fails to transfer."),
                p("Myth: brakes add motion to the chain. Better: brakes block or slow motion on purpose."),
                p("Red words are glossary terms. Tap one to ask the tutor."),
            ],
        ),
        page(
            "Mastery",
            "text",
            ["retrieval-practice", "spiral-scaffold"],
            [
                p("Teach a friend: motion travels along links; keep belts true; brakes stop on purpose."),
                ul([
                    "Sketch a three-part transfer path",
                    "Explain slip in one sentence",
                    "Use the word axle correctly once",
                ]),
            ],
            slides_block("top", [
                (asset(g, L, "mastery", "webp"), "Figure 5. Clear path - your transfer goal.", "Cart anchor"),
            ]),
        ),
    ]
    gloss = [
        ("wheel", "wheel"),
        ("axle", "axle"),
        ("belt", "belt"),
        ("chain", "chain"),
        ("transfer", "transfer"),
        ("friction", "friction"),
        ("brake", "brake"),
        ("slip", "slip"),
        ("jam", "jam"),
        ("conveyor", "conveyor"),
    ]
    return book_js(g, 1, "Motion Machines", "motion transfer", "Mechanical Basics / Motion Machines", gloss, pages, cover)


def mech_3() -> str:
    g = "mechanical-basics"
    L = 3
    cover = asset(g, L, "cover", "webp")
    pages = [
        page(
            "Why Forces at Work?",
            "text",
            ["constructivism", "dual-coding", "cognitive-load"],
            [
                p("Work happens when a force moves something through a distance."),
                p("Push a crate, lift a bag, pull a wagon - if it moves in the force direction, you did mechanical work."),
                p("Everyday hook: holding a heavy bag still tires you, but mechanical work needs distance too."),
            ],
            slides_block("top", [
                (asset(g, L, "hook"), "Figure 1. Force alone is not the whole story.", "Force demonstration"),
                (cover, "Push that travels - work you can see.", "Pushing cart"),
            ]),
        ),
        page(
            "Force times distance",
            "full-fig",
            ["multimedia-learning", "dual-coding"],
            [
                p("Work = force x distance (in the direction of the force). Huge push on an unmoving wall is about zero work."),
                ul([
                    "Moving a box across a floor counts",
                    "Holding still does not add distance",
                    "Kids do real work lifting school bags",
                ]),
            ],
            slides_block("full", [
                (asset(g, L, "model"), "Figure 2. Astronauts feel push/move pairs in orbit training films.", "Astronaut push"),
            ]),
        ),
        page(
            "Work dial",
            "text",
            ["cognitive-load", "dual-coding"],
            [
                p("In the lab you dialed until force and distance both showed up in the story."),
                p("Distance matters. Ignoring it breaks the work idea."),
            ],
            slides_block("top", [
                (asset(g, L, "mechanism"), "Figure 3. Gravity sets the cost of lifts - force against a field.", "Gravity concept imagery"),
                (asset(g, L, "lab"), "Structures stand because forces balance - work appears when things move.", "Structure"),
            ]),
        ),
        page(
            "Not only huge machines",
            "full-fig",
            ["multimedia-learning", "spiral-scaffold"],
            [
                p("Cranes do work. So do you when you slide a chair. Scale changes; the definition stays."),
                p("Name force, distance, and direction whenever you claim work happened."),
            ],
            slides_block("full", [
                (asset(g, L, "mastery"), "Figure 4. Big systems still obey force and motion rules.", "ISS imagery"),
            ]),
        ),
        page(
            "How the 10 steps connect",
            "text",
            ["spiral-scaffold", "cognitive-load"],
            [
                p("Meet work -> dial force/distance -> sort work/no-work -> stronger lab -> why direction -> name the work rule -> stretch wagons -> myths -> fluency -> mastery."),
                ul([
                    "Sorting kills 'any push is work'",
                    "Labs require motion through a distance",
                    "Rule: work needs force AND distance in that direction",
                ]),
            ],
        ),
        page(
            "Street lab: crate slide",
            "split",
            ["constructivism", "dual-coding", "retrieval-practice"],
            [
                p("Slide a light box one meter. Describe the force and the distance. Then press a wall without moving it - compare."),
                ul([
                    "Which case had mechanical work?",
                    "Estimate which took more effort feeling vs formal work",
                    "Flip carousel: cart travel vs astronaut push",
                ]),
            ],
            slides_block("right", [
                (cover, "Traveling push.", "Cart"),
                (asset(g, L, "model"), "Push in micro-g demos.", "Astronaut"),
                (asset(g, L, "hook"), "Force spotlight.", "Force"),
            ]),
        ),
        page(
            "Myths to bust",
            "text",
            ["conceptual-change"],
            [
                p("Myth: any push is always work. Better: work needs force AND distance in that direction."),
                p("Myth: holding a bag still does lots of work. Better: no distance moved = no mechanical work."),
                p("Myth: distance does not matter for work. Better: work = force x distance."),
                p("Red words are glossary terms. Tap one to ask the tutor."),
            ],
        ),
        page(
            "Mastery",
            "text",
            ["retrieval-practice", "spiral-scaffold"],
            [
                p("Teach a friend: force alone is not enough; add distance in the same direction to claim work."),
                ul([
                    "Give one work and one no-work example",
                    "Say the formula in words",
                    "Use the word joule as a work unit once if ready",
                ]),
            ],
            slides_block("top", [
                (asset(g, L, "mastery"), "Figure 5. Motion under forces - your work goal.", "ISS anchor"),
            ]),
        ),
    ]
    gloss = [
        ("force", "force"),
        ("work", "work"),
        ("distance", "distance"),
        ("direction", "direction"),
        ("joule", "joule"),
        ("energy", "energy"),
        ("push", "push"),
        ("lift", "lift"),
        ("newton", "newton"),
        ("mechanical", "mechanical"),
    ]
    return book_js(g, 2, "Forces at Work", "force & work", "Mechanical Basics / Forces at Work", gloss, pages, cover)


def geo_1() -> str:
    g = "geometry-trig"
    L = 1
    cover = asset(g, L, "cover")
    pages = [
        page(
            "Why Shape Studio?",
            "text",
            ["constructivism", "dual-coding", "cognitive-load"],
            [
                p("Shapes have rules: triangles have 3 sides, squares have 4 equal sides and right angles, circles are round with no corners."),
                p("Traffic signs, floor tiles, and rickshaw wheels use those rules in the street."),
                p("Everyday hook: a yield sign's triangle shape is a safety language you can count."),
            ],
            slides_block("top", [
                (asset(g, L, "hook"), "Figure 1. Geometry shows up in engineered forms.", "Geometry imagery"),
                (cover, "Sides and corners - start by counting.", "Geometry forms"),
            ]),
        ),
        page(
            "Count sides first",
            "full-fig",
            ["multimedia-learning", "dual-coding"],
            [
                p("Side count is the first clue to the shape name. Not every 4-sided shape is a square."),
                ul([
                    "Triangle: 3 sides",
                    "Quadrilateral family: 4 sides (rectangle, square, others)",
                    "Circle: round - no corners",
                ]),
            ],
            slides_block("full", [
                (asset(g, L, "model"), "Figure 2. Patterns help you compare shapes side by side.", "Pattern"),
            ]),
        ),
        page(
            "Shape dial",
            "text",
            ["cognitive-load", "dual-coding"],
            [
                p("In the lab you dialed until sides and corners snapped into named shapes."),
                p("Triangles can be tall, wide, or right-angled - still 3 sides."),
            ],
            slides_block("top", [
                (asset(g, L, "mechanism"), "Figure 3. Planet disks remind us: circles are a special round story.", "Planets"),
                (asset(g, L, "lab"), "Classroom tiles and posters are shape museums.", "Classroom"),
            ]),
        ),
        page(
            "Corners and curves",
            "full-fig",
            ["multimedia-learning", "spiral-scaffold"],
            [
                p("Corners (vertices) meet sides. Circles trade corners for a smooth curve."),
                p("Shape names are tools for signs, buildings, and machines - not only art class."),
            ],
            slides_block("full", [
                (asset(g, L, "mastery"), "Figure 4. Measurement habits pair with shape names.", "Measurement"),
            ]),
        ),
        page(
            "How the 10 steps connect",
            "text",
            ["spiral-scaffold", "cognitive-load"],
            [
                p("Meet shapes -> dial sides -> sort polygons -> stronger lab -> why names -> name the shape rule -> stretch street signs -> myths -> fluency -> mastery."),
                ul([
                    "Sorting separates triangles, quads, circles",
                    "Labs make side-counting automatic",
                    "Rule: count sides and corners, then name the shape",
                ]),
            ],
        ),
        page(
            "Street lab: sign hunt",
            "split",
            ["constructivism", "dual-coding", "retrieval-practice"],
            [
                p("Spot three signs or tiles. Count sides. Name the shape. Note equal sides if you see them."),
                ul([
                    "Find one circle that is not a sign (wheel)",
                    "Explain why a rectangle is not always a square",
                    "Flip carousel: geometry forms vs planet disks",
                ]),
            ],
            slides_block("right", [
                (cover, "Forms.", "Geometry"),
                (asset(g, L, "mechanism"), "Round disks.", "Planets"),
                (asset(g, L, "model"), "Compare patterns.", "Pattern"),
            ]),
        ),
        page(
            "Myths to bust",
            "text",
            ["conceptual-change"],
            [
                p("Myth: every 4-sided shape is a square. Better: rectangles and other quads exist - squares need equal sides + right angles."),
                p("Myth: circles have 4 corners. Better: circles are round - no corners."),
                p("Myth: counting sides is useless. Better: side count is the first clue to the shape name."),
                p("Red words are glossary terms. Tap one to ask the tutor."),
            ],
        ),
        page(
            "Mastery",
            "text",
            ["retrieval-practice", "spiral-scaffold"],
            [
                p("Teach a friend: count sides, check corners, then name - square is a special rectangle."),
                ul([
                    "Draw triangle, square, circle and label",
                    "Point to one street shape",
                    "Use the word polygon correctly once",
                ]),
            ],
            slides_block("top", [
                (asset(g, L, "mastery"), "Figure 5. Measure and name - your shape goal.", "Measurement anchor"),
            ]),
        ),
    ]
    gloss = [
        ("polygon", "polygon"),
        ("triangle", "triangle"),
        ("square", "square"),
        ("rectangle", "rectangle"),
        ("circle", "circle"),
        ("side", "side"),
        ("corner", "corner"),
        ("vertex", "vertex"),
        ("quadrilateral", "quadrilateral"),
        ("edge", "edge"),
    ]
    return book_js(g, 0, "Shape Studio", "polygons / sides & corners", "Geometry Trig / Shape Studio", gloss, pages, cover)


def geo_2() -> str:
    g = "geometry-trig"
    L = 2
    cover = asset(g, L, "cover")
    pages = [
        page(
            "Why Angle Adventures?",
            "text",
            ["constructivism", "dual-coding", "cognitive-load"],
            [
                p("An angle is a turn between two rays. Acute is under 90 degrees, right is exactly 90 degrees, obtuse is over 90 but under 180."),
                p("Clock hands, open doors, and roof pitches are angles you already live inside."),
                p("Everyday hook: a door swing from shut to open is a growing angle."),
            ],
            slides_block("top", [
                (asset(g, L, "hook"), "Figure 1. Measurement tools make turns visible.", "Measurement"),
                (cover, "Orbit paths are full of turning angles.", "Orbit diagram"),
            ]),
        ),
        page(
            "Turn, not ray length",
            "full-fig",
            ["multimedia-learning", "dual-coding"],
            [
                p("Bigger looking lines do not mean a bigger angle. Angle is the turn amount."),
                ul([
                    "Compare to a square corner to spot right angles",
                    "Acute is sharp and under 90",
                    "Obtuse is wider than a corner but not a straight line",
                ]),
            ],
            slides_block("full", [
                (asset(g, L, "model"), "Figure 2. Moon phases dance around turning geometry in the sky.", "Full moon"),
            ]),
        ),
        page(
            "Angle dial",
            "text",
            ["cognitive-load", "dual-coding"],
            [
                p("In the lab you dialed turns until acute, right, and obtuse felt distinct."),
                p("Degrees here measure turns - not thermometer weather."),
            ],
            slides_block("top", [
                (asset(g, L, "mechanism"), "Figure 3. Engineered geometry is full of right corners.", "Geometry forms"),
                (asset(g, L, "lab"), "Practice naming angles on classroom objects.", "Education"),
            ]),
        ),
        page(
            "Right angles everywhere",
            "full-fig",
            ["multimedia-learning", "spiral-scaffold"],
            [
                p("Right angles appear in squares, books, tiles, and window frames - not only in triangles."),
                p("You can often compare to a square corner by eye before grabbing a protractor."),
            ],
            slides_block("full", [
                (asset(g, L, "mastery"), "Figure 4. Patterned turns - train recognition.", "Pattern"),
            ]),
        ),
        page(
            "How the 10 steps connect",
            "text",
            ["spiral-scaffold", "cognitive-load"],
            [
                p("Meet angles -> dial turns -> sort acute/right/obtuse -> stronger lab -> why degrees -> name the angle rule -> stretch roofs -> myths -> fluency -> mastery."),
                ul([
                    "Sorting locks the three kid-level angle kinds",
                    "Labs separate turn size from ray length",
                    "Rule: angle measures turn between two rays",
                ]),
            ],
        ),
        page(
            "Street lab: clock hands",
            "split",
            ["constructivism", "dual-coding", "retrieval-practice"],
            [
                p("At 3:00, clock hands make a right angle. At other times, classify acute or obtuse by eye."),
                ul([
                    "Open a book and call the corner a right angle check",
                    "Find one roof that looks obtuse from the side",
                    "Flip carousel: orbit turn vs moon disk",
                ]),
            ],
            slides_block("right", [
                (cover, "Turning paths.", "Orbit"),
                (asset(g, L, "model"), "Sky geometry.", "Moon"),
                (asset(g, L, "hook"), "Measure turns.", "Measurement"),
            ]),
        ),
        page(
            "Myths to bust",
            "text",
            ["conceptual-change"],
            [
                p("Myth: bigger looking lines mean a bigger angle. Better: angle is the turn, not how long the rays are drawn."),
                p("Myth: acute means any angle under 180. Better: acute is under 90 degrees; obtuse is over 90."),
                p("Myth: degrees are only for thermometers. Better: angle degrees measure turns; temperature is a different degree idea."),
                p("Red words are glossary terms. Tap one to ask the tutor."),
            ],
        ),
        page(
            "Mastery",
            "text",
            ["retrieval-practice", "spiral-scaffold"],
            [
                p("Teach a friend: angle = turn; compare to a square corner; name acute, right, obtuse."),
                ul([
                    "Draw all three kinds and label",
                    "Find a right angle in the room",
                    "Use the word degree correctly once",
                ]),
            ],
            slides_block("top", [
                (asset(g, L, "mastery"), "Figure 5. Recognize turns - your angle goal.", "Pattern anchor"),
            ]),
        ),
    ]
    gloss = [
        ("angle", "angle"),
        ("ray", "ray"),
        ("acute", "acute"),
        ("right", "right"),
        ("obtuse", "obtuse"),
        ("degree", "degree"),
        ("turn", "turn"),
        ("protractor", "protractor"),
        ("vertex", "vertex"),
        ("straight", "straight"),
    ]
    return book_js(g, 1, "Angle Adventures", "angles / measuring turns", "Geometry Trig / Angle Adventures", gloss, pages, cover)


def stats_1() -> str:
    g = "statistics-probability"
    L = 1
    cover = asset(g, L, "cover")
    pages = [
        page(
            "Why Mean & Mode?",
            "text",
            ["constructivism", "dual-coding", "cognitive-load"],
            [
                p("Mean balances all values into one typical number. Mode is the value that appears most."),
                p("Class mark lists, cricket run totals, and shop price tags in BD markets all invite averages."),
                p("Everyday hook: if three snacks cost 10, 10, and 40, mode is 10 while mean is pulled upward."),
            ],
            slides_block("top", [
                (asset(g, L, "hook"), "Figure 1. Counting tools make totals honest before you average.", "Abacus"),
                (cover, "Graphs show where typical values sit.", "Graph"),
            ]),
        ),
        page(
            "Balance vs popularity",
            "full-fig",
            ["multimedia-learning", "dual-coding"],
            [
                p("Mean adds then divides by the count. Mode crowns the most common value. They can differ."),
                ul([
                    "Outliers can pull the mean",
                    "Mode allows ties",
                    "Kids use both for marks, scores, and prices",
                ]),
            ],
            slides_block("full", [
                (asset(g, L, "model"), "Figure 2. Another graph view - spot the cluster (mode) vs the balance point (mean).", "Graph alternate"),
            ]),
        ),
        page(
            "Average dial",
            "text",
            ["cognitive-load", "dual-coding"],
            [
                p("In the lab you dialed until mean and mode stories felt different on purpose."),
                p("Mean never ignores how many values you have - the count is the divider."),
            ],
            slides_block("top", [
                (asset(g, L, "mechanism"), "Figure 3. Measurement sheets feed averages.", "Measurement"),
                (asset(g, L, "lab"), "Write the list before you compute.", "Notebook"),
            ]),
        ),
        page(
            "Watch the outlier",
            "full-fig",
            ["multimedia-learning", "spiral-scaffold"],
            [
                p("One huge score can drag the mean while the mode stays with the crowd."),
                p("Say which average you mean before you compare classes or shops."),
            ],
            slides_block("full", [
                (asset(g, L, "mastery"), "Figure 4. Patterns in lists - clusters hint at mode.", "Pattern"),
            ]),
        ),
        page(
            "How the 10 steps connect",
            "text",
            ["spiral-scaffold", "cognitive-load"],
            [
                p("Meet averages -> dial typical -> sort mean/mode -> stronger lab -> why outliers -> name the average rule -> stretch markets -> myths -> fluency -> mastery."),
                ul([
                    "Sorting separates balance from popularity",
                    "Labs show mean move when an outlier appears",
                    "Rule: mean balances; mode is most common",
                ]),
            ],
        ),
        page(
            "Street lab: mark list",
            "split",
            ["constructivism", "dual-coding", "retrieval-practice"],
            [
                p("Use five class marks. Compute mean. Circle the mode. Add one huge outlier and recompute mean."),
                ul([
                    "Did mode change?",
                    "Explain the pull in one sentence",
                    "Flip carousel: abacus totals vs graph shape",
                ]),
            ],
            slides_block("right", [
                (asset(g, L, "hook"), "Total first.", "Abacus"),
                (cover, "See the typical.", "Graph"),
                (asset(g, L, "lab"), "Write the list.", "Notebook"),
            ]),
        ),
        page(
            "Myths to bust",
            "text",
            ["conceptual-change"],
            [
                p("Myth: mean and mode are always the same number. Better: they can differ - mean balances; mode is most common."),
                p("Myth: one outlier never moves the mean. Better: a very large or small value can pull the mean."),
                p("Myth: mean ignores how many values you have. Better: mean divides by the count of values."),
                p("Red words are glossary terms. Tap one to ask the tutor."),
            ],
        ),
        page(
            "Mastery",
            "text",
            ["retrieval-practice", "spiral-scaffold"],
            [
                p("Teach a friend with three prices: show mean vs mode and why shoppers might care about each."),
                ul([
                    "Compute both on a 5-number list",
                    "Point to an outlier effect",
                    "Use the word average carefully (say mean or mode)",
                ]),
            ],
            slides_block("top", [
                (asset(g, L, "mastery"), "Figure 5. Spot clusters - your average goal.", "Pattern anchor"),
            ]),
        ),
    ]
    gloss = [
        ("mean", "mean"),
        ("mode", "mode"),
        ("average", "average"),
        ("outlier", "outlier"),
        ("data", "data"),
        ("value", "value"),
        ("count", "count"),
        ("sum", "sum"),
        ("typical", "typical"),
        ("distribution", "distribution"),
    ]
    return book_js(g, 0, "Mean & Mode", "averages / typical values", "Statistics Probability / Mean & Mode", gloss, pages, cover)


def stats_2() -> str:
    g = "statistics-probability"
    L = 2
    cover = asset(g, L, "cover")
    pages = [
        page(
            "Why Chance Games?",
            "text",
            ["constructivism", "dual-coding", "cognitive-load"],
            [
                p("Probability is a fair share of outcomes. A fair coin is 1/2 heads; a fair die gives each face an equal shot."),
                p("Cricket tosses, board-game dice, and fun-fair spinners are probability labs in disguise."),
                p("Everyday hook: before a cricket match, the coin does not remember the last five tosses."),
            ],
            slides_block("top", [
                (asset(g, L, "hook"), "Figure 1. Worlds of outcomes - chance ideas scale from coins to orbits.", "Planets"),
                (cover, "Patterns of possibility - not promises of the next flip.", "Pattern"),
            ]),
        ),
        page(
            "Fair shares",
            "full-fig",
            ["multimedia-learning", "dual-coding"],
            [
                p("A probability share stays between 0 and 1. Face 7 on a standard die is impossible - not just unlikely."),
                ul([
                    "Fair coin: about 1/2 heads",
                    "Fair die: 1/6 each face",
                    "More fair trials usually settle closer to the true share",
                ]),
            ],
            slides_block("full", [
                (asset(g, L, "model"), "Figure 2. Planned paths still meet uncertainty in measurement - chance has rules too.", "Orbit diagram"),
            ]),
        ),
        page(
            "Chance dial",
            "text",
            ["cognitive-load", "dual-coding"],
            [
                p("In the lab you dialed until fair shares felt intuitive - not mystical."),
                p("Casinos are not the only users; weather and games use chance ideas too."),
            ],
            slides_block("top", [
                (asset(g, L, "mechanism"), "Figure 3. Geometry of outcomes - sample spaces have shapes.", "Geometry"),
                (asset(g, L, "lab"), "Run trials like experiments; tally honestly.", "Experiment"),
            ]),
        ),
        page(
            "No memory myth",
            "full-fig",
            ["multimedia-learning", "spiral-scaffold"],
            [
                p("After five heads, tails is not 'due'. A fair coin has no memory - still about 1/2."),
                p("Record many tosses. Watch the share settle instead of chasing streaks."),
            ],
            slides_block("full", [
                (asset(g, L, "mastery"), "Figure 4. Honest counting beats streak stories.", "Abacus"),
            ]),
        ),
        page(
            "How the 10 steps connect",
            "text",
            ["spiral-scaffold", "cognitive-load"],
            [
                p("Meet chance -> dial fair share -> sort possible/impossible -> stronger lab -> why trials -> name the probability rule -> stretch tosses -> myths -> fluency -> mastery."),
                ul([
                    "Sorting separates impossible from unlikely",
                    "Labs show shares between 0 and 1",
                    "Rule: probability is a fair share of outcomes",
                ]),
            ],
        ),
        page(
            "Street lab: coin tally",
            "split",
            ["constructivism", "dual-coding", "retrieval-practice"],
            [
                p("Toss a fair coin 20 times. Tally heads. Compare your share to 1/2. Discuss streaks without inventing memory."),
                ul([
                    "Explain why face 7 never appears on a standard die",
                    "Name one spinner at a fair and its fair-share idea",
                    "Flip carousel: planet outcomes vs abacus tallies",
                ]),
            ],
            slides_block("right", [
                (asset(g, L, "hook"), "Outcome worlds.", "Planets"),
                (asset(g, L, "mastery"), "Tally true.", "Abacus"),
                (cover, "Possibility pattern.", "Pattern"),
            ]),
        ),
        page(
            "Myths to bust",
            "text",
            ["conceptual-change"],
            [
                p("Myth: after five heads, tails is 'due'. Better: fair coin has no memory - still about 1/2."),
                p("Myth: probability can be bigger than 1. Better: a share stays between 0 and 1."),
                p("Myth: die face 7 is just unlikely. Better: face 7 is impossible on a standard die."),
                p("Red words are glossary terms. Tap one to ask the tutor."),
            ],
        ),
        page(
            "Mastery",
            "text",
            ["retrieval-practice", "spiral-scaffold"],
            [
                p("Teach a friend: fair share between 0 and 1; coins forget; more trials clarify the share."),
                ul([
                    "State P(heads) for a fair coin",
                    "Give one impossible event on a die",
                    "Use the word probability correctly once",
                ]),
            ],
            slides_block("top", [
                (asset(g, L, "mastery"), "Figure 5. Count outcomes - your chance goal.", "Abacus anchor"),
            ]),
        ),
    ]
    gloss = [
        ("probability", "probability"),
        ("outcome", "outcome"),
        ("fair", "fair"),
        ("chance", "chance"),
        ("trial", "trial"),
        ("impossible", "impossible"),
        ("likely", "likely"),
        ("share", "share"),
        ("random", "random"),
        ("sample", "sample"),
    ]
    return book_js(g, 1, "Chance Games", "probability / fair shares of outcomes", "Statistics Probability / Chance Games", gloss, pages, cover)


def main() -> None:
    writers = [
        ("ai-lab", 1, ai_lab_1),
        ("ai-lab", 2, ai_lab_2),
        ("web-dev-studio", 1, web_1),
        ("web-dev-studio", 2, web_2),
        ("web-dev-studio", 3, web_3),
        ("database-sql", 1, sql_1),
        ("database-sql", 2, sql_2),
        ("database-sql", 3, sql_3),
        ("backend-builder", 1, be_1),
        ("backend-builder", 2, be_2),
        ("backend-builder", 3, be_3),
        ("mechanical-basics", 1, mech_1),
        ("mechanical-basics", 2, mech_2),
        ("mechanical-basics", 3, mech_3),
        ("geometry-trig", 1, geo_1),
        ("geometry-trig", 2, geo_2),
        ("statistics-probability", 1, stats_1),
        ("statistics-probability", 2, stats_2),
    ]
    notes = []
    for game, level, fn in writers:
        content = fn()
        path = write_book(game, level, content)
        # uniqueness fingerprint: first page title + glossary ids
        first = content.split('title: "')[2].split('"')[0] if content.count('title: "') > 2 else "?"
        gloss_n = content.count("{ id:")
        notes.append((str(path.relative_to(ROOT)).replace("\\", "/"), first, gloss_n, len(content)))
        print(f"WROTE {path} bytes={len(content)}")
    print("COUNT", len(notes))


if __name__ == "__main__":
    main()
