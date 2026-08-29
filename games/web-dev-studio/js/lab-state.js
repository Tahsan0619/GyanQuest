/**
 * Web Dev Studio shared lab state (Chem / ICT pattern).
 */
export const labState = {
 heat: 0.2,
 heatTarget: 0.2,
 energy: 0.55,
 energyTarget: 0.55,
 phase: "desk",
 mode: "home",
 myth: 0,
 mythPhase: "claim",
 mythBusted: false,
 bustedAt: 0,
 reveal: false,
 prompt: "Web drill!",
 flashColor: 0xea580c,
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
 /** HTML House - how many tag-rooms are open */
 tagBuild: 0.2,
 /** CSS Style - style dial strength */
 styleHeat: 0.2,
 /** JS Click - tap / energy counter */
 clickCount: 0,
 /** HTML House (Mission 1 Bruner spirals) */
 htmlMode: "lot",
 htmlPhase: 0,
 htmlOpenReady: false,
 htmlRoomBuilt: false,
 htmlRoomFailed: false,
 htmlNestBuilt: false,
 htmlNestFailed: false,
 htmlFurnishCount: 0,
 htmlIframeDone: false,
 htmlCloseU: 0,
 htmlPlaced: {},
 htmlOrder: [],
 spiralStop: 0,
 spiralUntil: 0,
 spiralFinish: false,
 /** CSS Style (Mission 2 Bruner spirals) */
 cssMode: "unstyled",
 cssPhase: 0,
 cssOpenReady: false,
 cssPointerOn: false,
 cssSelectedRoom: "",
 cssRoomColors: {},
 cssPaintMain: false,
 cssPaintHeader: false,
 cssPadding: 0,
 cssBorder: 0,
 cssMargin: 0,
 cssPaddingTouched: false,
 cssBorderTouched: false,
 cssMarginTouched: false,
 cssWidth: 280,
 cssHeight: 160,
 cssAlign: "left",
 cssAlignTried: { left: false, center: false, right: false },
 cssSizeTouched: false,
 cssCozyRooms: [],
 cssOverrideNook: false,
 cssSheetColor: "#fff7ed",
 cssCloseU: 0,
 /** JS Clicks (Mission 3 Bruner spirals) */
 jsMode: "open",
 jsPhase: 0,
 jsOpenReady: false,
 jsOpenTriedSwitch: false,
 jsWireDropped: false,
 jsConnectorDropped: false,
 jsBulbLit: false,
 jsWired: false,
 jsWireTriedUnwired: false,
 jsRecipeSteps: [],
 jsRecipeNamed: false,
 jsFunctionConnected: [],
 jsRoomLit: {},
 jsRingCount: 0,
 jsRingReset: false,
 jsTogglePieces: {},
 jsIsOn: false,
 jsToggleFlips: 0,
 jsCloseU: 0,
};

export const chemLabState = labState;

export const LAB_ASSET_PATHS = {
 rule: "/games/web-dev-studio/assets/rule.svg",
 myth: "/games/web-dev-studio/assets/myth.svg",
 m1: "/games/web-dev-studio/assets/m1.svg",
 m2: "/games/web-dev-studio/assets/m2.svg",
 m3: "/games/web-dev-studio/assets/m3.svg",
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

export function resetHtmlHouseState() {
 initHtmlSub(0);
 labState.htmlPhase = 0;
 labState.htmlOpenReady = false;
 labState.htmlRoomBuilt = false;
 labState.htmlRoomFailed = false;
 labState.htmlNestBuilt = false;
 labState.htmlNestFailed = false;
 labState.htmlFurnishCount = 0;
 labState.htmlIframeDone = false;
 labState.htmlCloseU = 0;
 labState.htmlPlaced = {};
 labState.htmlOrder = [];
 labState.spiralStop = 0;
 labState.spiralUntil = 0;
 labState.spiralFinish = false;
}

/** Prepare lab state for one substep without wiping the whole mission. */
export function initHtmlSub(subIndex) {
 switch (subIndex) {
 case 0:
 labState.htmlMode = "lot";
 labState.htmlPhase = 0;
 labState.htmlOpenReady = false;
 break;
 case 1:
 labState.htmlMode = "room";
 labState.htmlPhase = 0;
 labState.htmlRoomBuilt = false;
 labState.htmlRoomFailed = false;
 labState.htmlPlaced = {};
 labState.htmlOrder = [];
 break;
 case 2:
 labState.htmlMode = "blueprint";
 break;
 case 3:
 labState.htmlMode = "nest";
 labState.htmlPhase = 0;
 labState.htmlNestBuilt = false;
 labState.htmlNestFailed = false;
 labState.htmlPlaced = {};
 labState.htmlOrder = [];
 labState.prompt = "";
 break;
 case 4:
 labState.htmlMode = "dolls";
 break;
 case 5:
 labState.htmlMode = "furnish";
 labState.htmlFurnishCount = 0;
 labState.htmlPlaced = {};
 break;
 case 6:
 labState.htmlMode = "layout";
 break;
 case 7:
 labState.htmlMode = "iframe";
 labState.htmlIframeDone = false;
 labState.htmlPlaced = {};
 break;
 case 8:
 labState.htmlMode = "montage";
 break;
 case 9:
 labState.htmlMode = "close";
 labState.htmlCloseU = 0;
 labState.spiralStop = 0;
 labState.spiralUntil = 0;
 labState.spiralFinish = false;
 break;
 default:
 break;
 }
}

export function resetCssStyleState() {
 labState.cssMode = "unstyled";
 labState.cssPhase = 0;
 labState.cssOpenReady = false;
 labState.cssPointerOn = false;
 labState.cssSelectedRoom = "";
 labState.cssRoomColors = {};
 labState.cssPaintMain = false;
 labState.cssPaintHeader = false;
 labState.cssPadding = 0;
 labState.cssBorder = 0;
 labState.cssMargin = 0;
 labState.cssPaddingTouched = false;
 labState.cssBorderTouched = false;
 labState.cssMarginTouched = false;
 labState.cssWidth = 280;
 labState.cssHeight = 160;
 labState.cssAlign = "left";
 labState.cssAlignTried = { left: false, center: false, right: false };
 labState.cssSizeTouched = false;
 labState.cssCozyRooms = [];
 labState.cssOverrideNook = false;
 labState.cssSheetColor = "#fff7ed";
 labState.cssCloseU = 0;
 labState.spiralStop = 0;
 labState.spiralUntil = 0;
 labState.spiralFinish = false;
}

export function resetJsClickState() {
 labState.jsMode = "open";
 labState.jsPhase = 0;
 labState.jsOpenReady = false;
 labState.jsOpenTriedSwitch = false;
 labState.jsWireDropped = false;
 labState.jsConnectorDropped = false;
 labState.jsBulbLit = false;
 labState.jsWired = false;
 labState.jsWireTriedUnwired = false;
 labState.jsRecipeSteps = [];
 labState.jsRecipeNamed = false;
 labState.jsFunctionConnected = [];
 labState.jsRoomLit = {};
 labState.jsRingCount = 0;
 labState.jsRingReset = false;
 labState.jsTogglePieces = {};
 labState.jsIsOn = false;
 labState.jsToggleFlips = 0;
 labState.jsCloseU = 0;
 labState.spiralStop = 0;
 labState.spiralUntil = 0;
 labState.spiralFinish = false;
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
