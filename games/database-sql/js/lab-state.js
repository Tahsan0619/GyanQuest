/**
 * database-sql shared lab state (Chem / ICT pattern).
 */
export const labState = {
 heat: 0.12,
 heatTarget: 0.12,
 energy: 0.55,
 energyTarget: 0.55,
 phase: "desk",
 mode: "home",
 myth: 0,
 mythPhase: "claim",
 mythBusted: false,
 bustedAt: 0,
 reveal: false,
 prompt: "Table drill",
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
 /** Living or Not */
 lifeScore: 0,
 sprout: 0,
 /** Cell City */
 cellZoom: 0.2,
 organelle: "membrane",
 /** Plant Power */
 sun: 0.3,
 rootWater: 0.2,
 beeVisit: 0,
 /** Tables & Rows (Mission 1 storage room) */
 dbMode: "open",
 dbDoorOpen: false,
 dbOpenReady: false,
 dbSearchPhase: "chaos",
 dbChaosClicks: 0,
 dbFoundRivera: false,
 dbOrganizedReady: false,
 dbOrganizedFound: false,
 dbHeaders: [],
 dbRows: [],
 dbRejected: false,
 dbAcceptedRow: false,
 dbSchemaName: "",
 dbSchemaEmail: "",
 dbSchemaPhoneVal: "",
 dbQueryParts: {},
 dbQueryCity: "Austin",
 dbQueryCityAlt: "",
 dbQueryResubmitted: false,
 dbCloseU: 0,
 spiralStop: 0,
 spiralUntil: 0,
 spiralFinish: false,
};

export const chemLabState = labState;

export const LAB_ASSET_PATHS = {
 "rule": "/games/database-sql/assets/rule.svg",
 "myth": "/games/database-sql/assets/myth.svg",
 "m1": "/games/database-sql/assets/m1.svg",
 "m2": "/games/database-sql/assets/m2.svg",
 "m3": "/games/database-sql/assets/m3.svg"
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

export function resetTablesRowsState() {
 initDbSub(0);
 labState.dbDoorOpen = false;
 labState.dbOpenReady = false;
 labState.dbSearchPhase = "chaos";
 labState.dbChaosClicks = 0;
 labState.dbFoundRivera = false;
 labState.dbOrganizedReady = false;
 labState.dbOrganizedFound = false;
 labState.dbHeaders = [];
 labState.dbRows = [];
 labState.dbRejected = false;
 labState.dbAcceptedRow = false;
 labState.dbSchemaName = "";
 labState.dbSchemaEmail = "";
 labState.dbSchemaPhoneVal = "";
 labState.dbQueryParts = {};
 labState.dbQueryCity = "Austin";
 labState.dbQueryCityAlt = "";
 labState.dbQueryResubmitted = false;
 labState.dbCloseU = 0;
 labState.spiralStop = 0;
 labState.spiralUntil = 0;
 labState.spiralFinish = false;
}

/** Prepare lab state for one substep without wiping the whole mission. */
export function initDbSub(subIndex) {
 switch (subIndex) {
 case 0:
 labState.dbMode = "open";
 labState.dbDoorOpen = false;
 labState.dbOpenReady = false;
 break;
 case 1:
 labState.dbMode = "search";
 labState.dbSearchPhase = "chaos";
 labState.dbChaosClicks = 0;
 labState.dbFoundRivera = false;
 labState.dbOrganizedReady = false;
 labState.dbOrganizedFound = false;
 break;
 case 2:
 labState.dbMode = "shelves1";
 break;
 case 3:
 labState.dbMode = "build2";
 labState.dbHeaders = [];
 labState.dbRows = [];
 break;
 case 4:
 labState.dbMode = "grid2";
 break;
 case 5:
 labState.dbMode = "schema3";
 labState.dbRejected = false;
 labState.dbAcceptedRow = false;
 labState.dbSchemaName = "";
 labState.dbSchemaEmail = "";
 labState.dbSchemaPhoneVal = "";
 break;
 case 6:
 labState.dbMode = "blueprint3";
 break;
 case 7:
 labState.dbMode = "query4";
 labState.dbQueryParts = {};
 labState.dbQueryCity = "Austin";
 labState.dbQueryCityAlt = "";
 labState.dbQueryResubmitted = false;
 break;
 case 8:
 labState.dbMode = "morph4";
 break;
 case 9:
 labState.dbMode = "close";
 labState.dbDoorOpen = true;
 labState.dbCloseU = 0;
 labState.spiralStop = 0;
 labState.spiralUntil = 0;
 labState.spiralFinish = false;
 break;
 default:
 break;
 }
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
