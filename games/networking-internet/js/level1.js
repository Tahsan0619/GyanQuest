/**
 * Networking & Internet - Mission 1: Packets Travel (deepened)
 */
import { labState, LAB_ASSET_PATHS } from "./lab-state.js";
import {
  mountMotionChain, mountDragSort, mountHeatLab, mountEquationBuild,
  mountQuiz, mountSpeedDrill, mountMythCards, mountTapContinue, mountOrderSteps, badgeHtml,
} from "./lab-activities.js";

export const L1_META = {
  objective: "By the end of this mission, you'll be able to explain messages split into packets and find a path in your own words.",
  bdHook: "Bangladesh everyday: notice messages split into packets and find a path around you — then connect it to Packets Travel.",
  predict: {
    q: "Before we start — what do you think matters most in Packets Travel?",
    options: [
      "Guessing without checking",
      "Looking for a clear pattern or rule",
      "Skipping the practice steps",
    ],
    ok: 1,
  },

  kidTitle: "Packets Travel",
  theme: "messages split into packets and find a path",
  emoji: "\ud83d\udce6",
  rewardName: "Packet Pilot",
  intro: "Internet messages split into packets that travel paths and reassemble at the end.",
  everyday: [
    "Sending a chat",
    "Loading a photo",
    "Video call bits"
  ],
  subTitles: [
    "Meet Packets",
    "Watch Path Dial",
    "Sort Packet Parts",
    "Clearer Path Lab",
    "Why Packets Move",
    "Name the Packet Rule",
    "Stretch: Places",
    "Myth Bust",
    "Fluency Drill",
    "Packet Pilot Mastery"
  ],
};

export function runL1Sub(subIndex, api) {
  const { registerTryAgain } = api;
  labState.reveal = false; labState.tokenProgress = 0; labState.masteryStep = 0;
  labState.placed = {}; labState.selectedId = null; labState.mythPhase = "claim";
  labState.heat = 0.25; labState.phase = "desk"; labState.mode = "home";
  const runners = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10];
  const fn = runners[subIndex] || runners[0];
  registerTryAgain(() => { api.overlay.innerHTML = ""; fn(api); });
  fn(api);
}

function s1({ overlay, setCoach, completeSub }) {
  setCoach("Hook: big messages split into packets on a path.");
  mountMotionChain(overlay, {
    title: "Meet Packets",
    beats: [
      { scene: "packetMeet", sceneArgs: { phase: "desk" }, dwellMs: 4000, html: `${badgeHtml(LAB_ASSET_PATHS.m1, "packet")}<p><strong>Act 1:</strong> A big message sits on the desk - too large to send as one lump.</p>` },
      { scene: "packetMeet", sceneArgs: { phase: "glow" }, dwellMs: 4200, html: `<p><strong>Act 2:</strong> It splits into labeled packets that hop along a path.</p>` },
      { scene: "packetMeet", sceneArgs: { phase: "settle" }, dwellMs: 4000, html: `<p><strong>Act 3:</strong> Packets reassemble into the full message at the end.</p>` }
    ],
    onDone: () => mountQuiz(overlay, {
      scene: "packetMeet", sceneArgs: { phase: "settle" }, title: "Exit check",
      q: "Why do we split messages into packets?",
      opts: ["So pieces can travel paths and rebuild later", "So the message disappears forever", "So routers eat the whole file at once only", "So labels are never needed"],
      ok: 0, onDone: () => mountTapContinue(overlay, {
        scene: "packetMeet", badge: LAB_ASSET_PATHS.m1,
        html: `<h3>Packets ready</h3><p>Next: dial path openness.</p>`,
        onDone: completeSub, advanceAfterDone: true,
      }),
    }),
  });
}

function s2({ overlay, setCoach, completeSub }) {
  setCoach("Open the path until packets flow well.");
  labState.heat = 0.25;
  mountHeatLab(overlay, {
    scene: "packetLab", title: "Watch Path Dial",
    html: `<p>Drag until path flow &gt;= 60%.</p>`,
    goalText: "Goal >= 60%", doneLabel: "Dial checked", threshold: 0.6, startHeat: 0.25,
    axis: "x", canvasAction: "stretch", sliderLabel: "Path", badge: LAB_ASSET_PATHS.m1,
    onDone: completeSub,
  });
}

function s3({ overlay, setCoach, completeSub }) {
  setCoach("Sort packet parts, not-packets, and tricky.");
  mountTapContinue(overlay, {
    scene: "packetSort",
    html: `<h3>Guide</h3><p><strong>Packet:</strong> address, payload, order number.<br><strong>Not:</strong> random rock, blank sticky.<br><strong>Tricky:</strong> unlabeled scrap.</p>`,
    onDone: () => mountDragSort(overlay, {
      scene: "packetSort", title: "Sort Packet Parts",
      instructions: "Drag into Packet part / Not a packet / Tricky.",
      successText: "Packet parts sorted!",
      chips: [
        { id: "addr", text: "To/from address", short: "Address", color: 8490232 },
        { id: "pay", text: "Payload bits", short: "Payload", color: 10859772 },
        { id: "ord", text: "Order number", short: "Order", color: 3718648 },
        { id: "check", text: "Check bits", short: "Check", color: 2278750 },
        { id: "rock", text: "Random rock", short: "Rock", color: 9741240 },
        { id: "blank", text: "Blank sticky", short: "Blank", color: 7893356 },
        { id: "scrap", text: "Unlabeled scrap", short: "Scrap", color: 16347926 },
        { id: "hop", text: "Next-hop hint", short: "Hop", color: 16498468 }
      ],
      zones: [
        { id: "part", label: "Packet part", accept: ["addr", "pay", "ord", "check", "hop"] },
        { id: "not", label: "Not a packet", accept: ["rock", "blank"] },
        { id: "tricky", label: "Tricky", accept: ["scrap"] }
      ],
      onDone: completeSub,
    }),
  });
}

function s4({ overlay, setCoach, completeSub }) {
  setCoach("Push path clarity higher.");
  labState.heat = 0.4;
  mountHeatLab(overlay, {
    scene: "packetLab", title: "Clearer Path Lab", html: `<p>Reach path flow &gt;= 75%.</p>`,
    goalText: "Goal >= 75%", doneLabel: "Lab done", threshold: 0.75, startHeat: 0.4,
    axis: "x", canvasAction: "stretch", sliderLabel: "Path", badge: LAB_ASSET_PATHS.m1,
    onDone: completeSub,
  });
}

function s5({ overlay, setCoach, completeSub }) {
  setCoach("Order how a message travels.");
  mountOrderSteps(overlay, {
    scene: "packetMeet", sceneArgs: { phase: "settle" }, title: "Why Packets Move",
    instructions: "Order the story.",
    items: [
      { id: "split", html: "Split the message" },
      { id: "label", html: "Label each packet" },
      { id: "travel", html: "Travel along a path" },
      { id: "join", html: "Reassemble at the end" }
    ],
    correctIds: ["split", "label", "travel", "join"],
    onDone: () => mountQuiz(overlay, {
      scene: "packetMeet", title: "Check",
      q: "If one packet is missing, the message may...",
      opts: ["Be incomplete until it is resent", "Always be perfect anyway", "Turn into a rock", "Delete the address forever"],
      ok: 0, onDone: completeSub,
    }),
  });
}

function s6({ overlay, setCoach, completeSub }) {
  setCoach("Lock: split -> travel -> reassemble.");
  mountEquationBuild(overlay, {
    scene: "packetRule", title: "Name the Packet Rule", instructions: "Tap in order.",
    tokens: [ { id: "a", html: "Split" }, { id: "b", html: "-> travel" }, { id: "c", html: "->" }, { id: "d", html: "reassemble" } ],
    correctIds: ["a", "b", "c", "d"], badge: LAB_ASSET_PATHS.rule,
    onDone: () => mountTapContinue(overlay, {
      scene: "packetRule", badge: LAB_ASSET_PATHS.rule,
      html: `<h3>Rule locked</h3><p>Split into packets -> travel a path -> reassemble.</p>`,
      onDone: completeSub, advanceAfterDone: true,
    }),
  });
}

function s7({ overlay, setCoach, completeSub }) {
  setCoach("Chat, photo, call, BD cafe Wi-Fi, lab.");
  mountTapContinue(overlay, {
    scene: "packetStretch", html: `<h3>Places</h3><p>Tap each mode - same core idea.</p>`,
    onDone: () => mountQuiz(overlay, {
      scene: "packetStretch", title: "Transfer",
      q: "A photo loads in pieces because...",
      opts: ["Packets arrive and rebuild the image", "The whole file must be one atom forever", "Paths never carry packets", "Addresses are optional always"],
      ok: 0, onDone: completeSub,
    }),
  });
}

function s8({ overlay, setCoach, completeSub }) {
  setCoach("Bust packet myths.");
  mountMythCards(overlay, {
    scene: "packetMyth", title: "Myth Bust", badge: LAB_ASSET_PATHS.myth,
    myths: [
      { claim: "The whole file always rides as one single lump", truth: "Big messages usually travel as many packets", sceneMyth: 0 },
      { claim: "Packets never need addresses", truth: "Addresses help packets find the destination", sceneMyth: 1 },
      { claim: "Order numbers are useless", truth: "Order helps reassemble the message correctly", sceneMyth: 2 },
      { claim: "Only experts use packet ideas", truth: "Kids use packet paths every chat and photo load", sceneMyth: 3 },
      { claim: "A broken path means the internet ends forever", truth: "Packets can try other paths or resend", sceneMyth: 4 }
    ],
    onDone: completeSub,
  });
}

function s9({ overlay, setCoach, completeSub }) {
  setCoach("Quick packet fluency.");
  mountSpeedDrill(overlay, {
    scene: "packetDrill", title: "Fluency Drill", passScene: "packetMastery",
    items: [
      { q: "Messages can split?", opts: ["Yes", "No"], ok: 0, prompt: "Split?" },
      { q: "Need addresses?", opts: ["Yes", "Never"], ok: 0, prompt: "Addr?" },
      { q: "Rock is a packet?", opts: ["No", "Yes"], ok: 0, prompt: "Rock?" },
      { q: "Reassemble at end?", opts: ["Yes", "No"], ok: 0, prompt: "Join?" },
      { q: "Order numbers help?", opts: ["Yes", "No"], ok: 0, prompt: "Order?" },
      { q: "Missing packet = always fine?", opts: ["No", "Yes"], ok: 0, prompt: "Miss?" }
    ],
    onDone: completeSub,
  });
}

function s10({ overlay, setCoach, completeSub }) {
  setCoach("Mastery - Packet Pilot.");
  mountOrderSteps(overlay, {
    scene: "packetMastery", title: "Packet Pilot Mastery", instructions: "Order your journey.",
    items: [ { id: "meet", html: "Meet" }, { id: "sort", html: "Sort" }, { id: "lab", html: "Lab" }, { id: "rule", html: "Rule" }, { id: "myth", html: "Myth" }, { id: "net", html: "Net" } ],
    correctIds: ["meet", "sort", "lab", "rule", "myth", "net"],
    onDone: () => mountTapContinue(overlay, {
      scene: "packetMastery", badge: LAB_ASSET_PATHS.m1,
      html: `<h3>\ud83d\udce6 Packet Pilot!</h3><p>You can explain how packets travel and reassemble.</p>`,
      onDone: completeSub, advanceAfterDone: true,
    }),
  });
}
