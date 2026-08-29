/**
 * AI Lab shared lab state (Chem / Force pattern).
 */
export const labState = {
 heat: 0.12,
 heatTarget: 0.12,
 energy: 0.55,
 energyTarget: 0.55,
 phase: "desk",
 mode: "home",
 labMode: "clarity",
 guessStep: 0,
 myth: 0,
 mythPhase: "claim",
 mythBusted: false,
 bustedAt: 0,
 reveal: false,
 prompt: "AI drill!",
 flashColor: 0x22c55e,
 animDuration: 3200,
 failPulse: 0,
 successPulse: 0,
 tokenProgress: 0,
 sortPlaced: 0,
 placed: {},
 selectedId: null,
 masteryStep: 0,
 scale: 0,
 reducedMotion: false,
 _placedVersion: 0,
 // Mission 1: What is AI? (apprentice metaphor)
 aiMode: "open",
 aiOpenReady: false,
 aiRulePhase: "pick",
 aiRulePatches: 0,
 aiRulesFailed: false,
 aiExamplesFed: 0,
 aiApprenticeTrained: false,
 aiTrainingRound: 0,
 aiRoundRevealed: false,
 aiLastGuess: "",
 aiConfidence: 0.2,
 aiTrainingDone: false,
 aiTestDone: false,
 aiPeekInside: false,
 aiMatches: {},
 aiCloseU: 0,
 spiralStop: 0,
 spiralUntil: 0,
 spiralFinish: false,
};

export function resetWhatIsAiState() {
 initAiSub(0);
 labState.aiRulePhase = "pick";
 labState.aiRulePatches = 0;
 labState.aiRulesFailed = false;
 labState.aiExamplesFed = 0;
 labState.aiApprenticeTrained = false;
 labState.aiTrainingRound = 0;
 labState.aiRoundRevealed = false;
 labState.aiLastGuess = "";
 labState.aiConfidence = 0.2;
 labState.aiTrainingDone = false;
 labState.aiTestDone = false;
 labState.aiPeekInside = false;
 labState.aiMatches = {};
 labState.aiCloseU = 0;
 labState.spiralStop = 0;
 labState.spiralUntil = 0;
 labState.spiralFinish = false;
}

/** Prepare lab state for one substep without wiping the whole mission. */
export function initAiSub(subIndex) {
 switch (subIndex) {
 case 0:
 labState.aiMode = "open";
 labState.aiOpenReady = false;
 break;
 case 1:
 labState.aiMode = "rules1";
 labState.aiRulePhase = "pick";
 labState.aiRulePatches = 0;
 labState.aiRulesFailed = false;
 labState.aiExamplesFed = 0;
 labState.aiApprenticeTrained = false;
 break;
 case 2:
 labState.aiMode = "split1";
 break;
 case 3:
 labState.aiMode = "train2";
 labState.aiTrainingRound = 0;
 labState.aiRoundRevealed = false;
 labState.aiLastGuess = "";
 labState.aiConfidence = 0.2;
 labState.aiTrainingDone = false;
 break;
 case 4:
 labState.aiMode = "graph2";
 break;
 case 5:
 labState.aiMode = "test3";
 labState.aiTestDone = false;
 labState.aiPeekInside = false;
 break;
 case 6:
 labState.aiMode = "exam3";
 break;
 case 7:
 labState.aiMode = "match4";
 labState.aiMatches = {};
 break;
 case 8:
 labState.aiMode = "montage4";
 break;
 case 9:
 labState.aiMode = "close";
 labState.aiCloseU = 0;
 labState.spiralStop = 0;
 labState.spiralUntil = 0;
 labState.spiralFinish = false;
 break;
 default:
 break;
 }
}

export const chemLabState = labState;

export const LAB_ASSET_PATHS = {
 rule: "/games/ai-lab/assets/rule.svg",
 myth: "/games/ai-lab/assets/myth.svg",
 m1: "/games/ai-lab/assets/m1.svg",
 m2: "/games/ai-lab/assets/m2.svg",
};

export const ATOM_ASSET_PATHS = LAB_ASSET_PATHS;

export function setHeatTarget(v) {
 labState.heatTarget = Math.max(0, Math.min(1, v));
}

export function pulseFailFeedback(ms = 420) {
 labState.failPulse = performance.now() + ms;
}

export function pulseSuccessFeedback(ms = 320) {
 labState.successPulse = performance.now() + ms;
}

if (typeof window !== "undefined") {
 window.__chemMirror = (s) => {
 if (!s) return;
 if (s.heat != null) {
 labState.heat = s.heat;
 labState.heatTarget = s.heat;
 }
 if (s.energy != null) {
 labState.energy = s.energy;
 labState.energyTarget = s.energy;
 }
 if (s.placed != null && s.placedVersion != null && s.placedVersion !== labState._placedVersion) {
 labState.placed = { ...s.placed };
 labState.sortPlaced = Object.keys(s.placed).length;
 labState._placedVersion = s.placedVersion;
 }
 if (s.selectedId !== undefined) labState.selectedId = s.selectedId;
 if (s.reveal != null) labState.reveal = s.reveal;
 if (s.tokenOrder) labState.tokenProgress = s.tokenOrder.length;
 if (s.masteryOrder) labState.masteryStep = s.masteryOrder.length;
 };
}
