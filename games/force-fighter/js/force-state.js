/**
 * Force Fighter shared lab state + feedback helpers (Chem pattern).
 */
export const forceLabState = {
 heat: 0.12,
 heatTarget: 0.12,
 energy: 0.55,
 energyTarget: 0.55,
 phase: "desk",
 mode: "door",
 myth: 0,
 mythPhase: "claim",
 mythBusted: false,
 bustedAt: 0,
 reveal: false,
 prompt: "Force drill!",
 flashColor: 0xfbbf24,
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
 /** Lazy Rock */
 rockAwake: false,
 rockVx: 0,
 rockX: 0.35,
 wallHit: 0,
 rockNudged: false,
 rockTapTried: false,
 rockPushed: false,
 rockBallPushed: false,
 rockKind: "rock",
 rockBallX: 0.35,
 rockBallVx: 0,
 rockDust: 0,
 rockPushI: 0,
 rockPushDone: [false, false, false],
 rockStopI: 0,
 rockStopDone: [false, false, false],
 rockCharge: 0,
 rockBraking: false,
 rockStopTick: 0,
 rockIce: true,
 rockIcePushed: false,
 rockGravelOn: false,
 rockWorld: 0,
 rockBeltOn: false,
 rockCrashGo: false,
 rockCrashHit: false,
 rockCrashBeltRun: false,
 rockSawNoBelt: false,
 rockCrashT0: 0,
 rockClothYank: false,
 rockCloseU: 0,
 rockBusMode: "idle",
 rockBusT0: 0,
 rockBusStarted: false,
 rockBusBraked: false,
 rockWhyPick: 0,
 rockWhyTried: [false, false, false],
 rockCardYank: false,
 rockNudgeSpace: false,
 rockNudgeTable: false,
 rockSpaceX: 0.2,
 rockTableX: 0.68,
 rockSpaceVx: 0,
 rockTableVx: 0,
 rockSatNudge: false,
 spiralStop: 0,
 spiralUntil: 0,
 spiralFinish: false,
 /** Push Power (force vs power, not F=ma) */
 pushForce: 0.35,
 massKg: 100,
 accel: 0,
 raceDone: false,
 ppNudged: false,
 ppAimStep: 0,
 ppAimDone: [false, false, false],
 ppLastAng: 0,
 ppStr: 0,
 ppAng: 0,
 ppRx: 0.5,
 ppRy: 0.5,
 ppRvx: 0,
 ppRvy: 0,
 ppRaceWho: "turtle",
 ppTurtleDone: false,
 ppRabbitDone: false,
 ppTurtleT: 0,
 ppRabbitT: 0,
 ppRaceT0: 0,
 ppCrateX: 0.18,
 ppTurtleX: 0.18,
 ppRabbitX: 0.18,
 ppPushing: false,
 ppForceShow: 0.72,
 ppGuessed: false,
 ppReveal: false,
 ppGear: "low",
 ppDest: "hill",
 ppGearGo: false,
 ppGearT0: 0,
 ppLowHill: false,
 ppHighHill: false,
 ppHighFlat: false,
 ppLowFlat: false,
 ppCarX: 0,
 ppStalled: false,
 ppFriends: 1,
 ppPushCar: false,
 ppCarPos: 0.2,
 ppCarAloneDone: false,
 ppCarFriendsDone: false,
 ppLiftFast: false,
 ppCloseU: 0,
 /** Pairs (legacy fields kept) */
 pairGap: 1,
 recoil: 0,
 ropeT: 0.5,
 walkStep: 0,
 /** Push & Pull: two directions of force */
 plDoorOpen: false,
 plDoorDir: 0,
 plDoorAng: 0,
 plDoorBlend: 0,
 plSpringX: 0.52,
 plSpringDrag: false,
 plSpringPushed: false,
 plSpringPulled: false,
 plRopeMode: "push",
 plRopePushTried: false,
 plRopePullDone: false,
 plRodTried: false,
 plCartX: 0.28,
 plRopeEnd: 0.72,
 plRopeCrumple: 0.15,
 plSkateMode: "push",
 plSkateGo: false,
 plSkateT0: 0,
 plPushOffDone: false,
 plPullTogetherDone: false,
 plSkateL: 0.34,
 plSkateR: 0.66,
 plSkateLv: 0,
 plSkateRv: 0,
 plBridgeCables: false,
 plBridgePillars: false,
 plBridgeWrong: false,
 plBridgeOk: false,
 plBridgeCar: 0,
 plArm: 0.5,
 plCloseU: 0,
};

/** Alias so force-activities (Chem mount copy) keeps working */
export const chemLabState = forceLabState;

export const FORCE_ASSET_PATHS = {
 rock: "/games/force-fighter/assets/lazy-rock.svg",
 push: "/games/force-fighter/assets/push-power.svg",
 pair: "/games/force-fighter/assets/force-pairs.svg",
 arrow: "/games/force-fighter/assets/force-arrow.svg",
 race: "/games/force-fighter/assets/mass-race.svg",
 rocket: "/games/force-fighter/assets/rocket-pair.svg",
 myth: "/games/force-fighter/assets/force-myth.svg",
 rule: "/games/force-fighter/assets/force-rule.svg",
};

export const ATOM_ASSET_PATHS = FORCE_ASSET_PATHS;

export function setHeatTarget(v) {
 forceLabState.heatTarget = Math.max(0, Math.min(1, v));
}

export function pulseFailFeedback(ms = 420) {
 forceLabState.failPulse = performance.now() + ms;
}

export function pulseSuccessFeedback(ms = 320) {
 forceLabState.successPulse = performance.now() + ms;
}

export function resetLazyRockState() {
 forceLabState.rockAwake = false;
 forceLabState.rockVx = 0;
 forceLabState.rockX = 0.38;
 forceLabState.wallHit = 0;
 forceLabState.rockNudged = false;
 forceLabState.rockTapTried = false;
 forceLabState.rockPushed = false;
 forceLabState.rockBallPushed = false;
 forceLabState.rockKind = "rock";
 forceLabState.rockBallX = 0.38;
 forceLabState.rockBallVx = 0;
 forceLabState.rockDust = 0;
 forceLabState.rockPushI = 0;
 forceLabState.rockPushDone = [false, false, false];
 forceLabState.rockStopI = 0;
 forceLabState.rockStopDone = [false, false, false];
 forceLabState.rockCharge = 0;
 forceLabState.rockBraking = false;
 forceLabState.rockStopTick = 0;
 forceLabState.rockIce = true;
 forceLabState.rockIcePushed = false;
 forceLabState.rockGravelOn = false;
 forceLabState.rockWorld = 0;
 forceLabState.rockBeltOn = false;
 forceLabState.rockCrashGo = false;
 forceLabState.rockCrashHit = false;
 forceLabState.rockCrashBeltRun = false;
 forceLabState.rockSawNoBelt = false;
 forceLabState.rockCrashT0 = 0;
 forceLabState.rockClothYank = false;
 forceLabState.rockCloseU = 0;
 forceLabState.rockBusMode = "idle";
 forceLabState.rockBusT0 = 0;
 forceLabState.rockBusStarted = false;
 forceLabState.rockBusBraked = false;
 forceLabState.rockWhyPick = 0;
 forceLabState.rockWhyTried = [false, false, false];
 forceLabState.rockCardYank = false;
 forceLabState.rockNudgeSpace = false;
 forceLabState.rockNudgeTable = false;
 forceLabState.rockSpaceX = 0.2;
 forceLabState.rockTableX = 0.68;
 forceLabState.rockSpaceVx = 0;
 forceLabState.rockTableVx = 0;
 forceLabState.rockSatNudge = false;
 forceLabState.spiralStop = 0;
 forceLabState.spiralUntil = 0;
 forceLabState.spiralFinish = false;
 forceLabState.phase = "open";
 forceLabState.scale = 0;
 forceLabState.placed = {};
 forceLabState.selectedId = null;
 forceLabState.reveal = false;
}

export function resetPushPowerState() {
 forceLabState.ppNudged = false;
 forceLabState.ppAimStep = 0;
 forceLabState.ppAimDone = [false, false, false];
 forceLabState.ppLastAng = 0;
 forceLabState.ppStr = 0;
 forceLabState.ppAng = 0;
 forceLabState.ppRx = 0.5;
 forceLabState.ppRy = 0.5;
 forceLabState.ppRvx = 0;
 forceLabState.ppRvy = 0;
 forceLabState.ppRaceWho = "turtle";
 forceLabState.ppTurtleDone = false;
 forceLabState.ppRabbitDone = false;
 forceLabState.ppTurtleT = 0;
 forceLabState.ppRabbitT = 0;
 forceLabState.ppRaceT0 = 0;
 forceLabState.ppCrateX = 0.18;
 forceLabState.ppTurtleX = 0.18;
 forceLabState.ppRabbitX = 0.18;
 forceLabState.ppPushing = false;
 forceLabState.ppForceShow = 0.72;
 forceLabState.ppGuessed = false;
 forceLabState.ppReveal = false;
 forceLabState.ppGear = "low";
 forceLabState.ppDest = "hill";
 forceLabState.ppGearGo = false;
 forceLabState.ppGearT0 = 0;
 forceLabState.ppLowHill = false;
 forceLabState.ppHighHill = false;
 forceLabState.ppHighFlat = false;
 forceLabState.ppLowFlat = false;
 forceLabState.ppCarX = 0;
 forceLabState.ppStalled = false;
 forceLabState.ppFriends = 1;
 forceLabState.ppPushCar = false;
 forceLabState.ppCarPos = 0.2;
 forceLabState.ppCarAloneDone = false;
 forceLabState.ppCarFriendsDone = false;
 forceLabState.ppLiftFast = false;
 forceLabState.ppCloseU = 0;
 forceLabState.spiralStop = 0;
 forceLabState.spiralUntil = 0;
 forceLabState.spiralFinish = false;
 forceLabState.phase = "open";
 forceLabState.raceDone = false;
 forceLabState.pushForce = 0.35;
}

export function resetPushPullState() {
 forceLabState.plDoorOpen = false;
 forceLabState.plDoorDir = 0;
 forceLabState.plDoorAng = 0;
 forceLabState.plDoorBlend = 0;
 forceLabState.plSpringX = 0.52;
 forceLabState.plSpringDrag = false;
 forceLabState.plSpringPushed = false;
 forceLabState.plSpringPulled = false;
 forceLabState.plRopeMode = "push";
 forceLabState.plRopePushTried = false;
 forceLabState.plRopePullDone = false;
 forceLabState.plRodTried = false;
 forceLabState.plCartX = 0.28;
 forceLabState.plRopeEnd = 0.72;
 forceLabState.plRopeCrumple = 0.15;
 forceLabState.plSkateMode = "push";
 forceLabState.plSkateGo = false;
 forceLabState.plSkateT0 = 0;
 forceLabState.plPushOffDone = false;
 forceLabState.plPullTogetherDone = false;
 forceLabState.plSkateL = 0.34;
 forceLabState.plSkateR = 0.66;
 forceLabState.plSkateLv = 0;
 forceLabState.plSkateRv = 0;
 forceLabState.plBridgeCables = false;
 forceLabState.plBridgePillars = false;
 forceLabState.plBridgeWrong = false;
 forceLabState.plBridgeOk = false;
 forceLabState.plBridgeCar = 0;
 forceLabState.plArm = 0.5;
 forceLabState.plCloseU = 0;
 forceLabState.prompt = "";
 forceLabState.spiralStop = 0;
 forceLabState.spiralUntil = 0;
 forceLabState.spiralFinish = false;
 forceLabState.phase = "open";
 forceLabState.pairGap = 1;
 forceLabState.recoil = 0;
 forceLabState.ropeT = 0.5;
 forceLabState.walkStep = 0;
}

if (typeof window !== "undefined") {
 window.__chemMirror = (s) => {
 if (!s) return;
 if (s.heat != null) {
 forceLabState.heat = s.heat;
 forceLabState.heatTarget = s.heat;
 }
 if (s.energy != null) {
 forceLabState.energy = s.energy;
 forceLabState.energyTarget = s.energy;
 }
 if (s.placed != null && s.placedVersion != null && s.placedVersion !== forceLabState._placedVersion) {
 forceLabState.placed = { ...s.placed };
 forceLabState.sortPlaced = Object.keys(s.placed).length;
 forceLabState._placedVersion = s.placedVersion;
 }
 if (s.selectedId !== undefined) forceLabState.selectedId = s.selectedId;
 if (s.reveal != null) forceLabState.reveal = s.reveal;
 if (s.tokenOrder) forceLabState.tokenProgress = s.tokenOrder.length;
 if (s.masteryOrder) forceLabState.masteryStep = s.masteryOrder.length;
 };
}
