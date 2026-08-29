/**
 * backend-builder shared lab state (Chem / ICT pattern).
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
 prompt: "Server drill!",
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
 /** Server Basics (Mission 1 restaurant metaphor) */
 srvMode: "open",
 srvLoadPhase: 0,
 srvOpenReady: false,
 srvKitchenPlaced: false,
 srvHallwayConnected: false,
 srvCallTriedEmpty: false,
 srvCallWorked: false,
 srvOrderSuccess: false,
 srvOrder404: false,
 srvTicketFlying: false,
 srvServiceStarted: false,
 srvOrdersHandled: 0,
 srvQueue: 0,
 srvSecondChef: false,
 srvDomainEntered: false,
 srvDnsStep: 0,
 srvDnsDone: false,
 srvCloseU: 0,
 spiralStop: 0,
 spiralUntil: 0,
 spiralFinish: false,
};

export const chemLabState = labState;

export const LAB_ASSET_PATHS = {
 "rule": "/games/backend-builder/assets/rule.svg",
 "myth": "/games/backend-builder/assets/myth.svg",
 "m1": "/games/backend-builder/assets/m1.svg",
 "m2": "/games/backend-builder/assets/m2.svg",
 "m3": "/games/backend-builder/assets/m3.svg"
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

export function resetServerBasicsState() {
 initSrvSub(0);
 labState.srvLoadPhase = 0;
 labState.srvOpenReady = false;
 labState.srvKitchenPlaced = false;
 labState.srvHallwayConnected = false;
 labState.srvCallTriedEmpty = false;
 labState.srvCallWorked = false;
 labState.srvOrderSuccess = false;
 labState.srvOrder404 = false;
 labState.srvTicketFlying = false;
 labState.srvServiceStarted = false;
 labState.srvOrdersHandled = 0;
 labState.srvQueue = 0;
 labState.srvSecondChef = false;
 labState.srvDomainEntered = false;
 labState.srvDnsStep = 0;
 labState.srvDnsDone = false;
 labState.srvCloseU = 0;
 labState.spiralStop = 0;
 labState.spiralUntil = 0;
 labState.spiralFinish = false;
}

/** Prepare lab state for one substep without wiping the whole mission. */
export function initSrvSub(subIndex) {
 switch (subIndex) {
 case 0:
 labState.srvMode = "open";
 labState.srvLoadPhase = 0;
 labState.srvOpenReady = false;
 break;
 case 1:
 labState.srvMode = "kitchen1";
 labState.srvKitchenPlaced = false;
 labState.srvHallwayConnected = false;
 labState.srvCallTriedEmpty = false;
 labState.srvCallWorked = false;
 break;
 case 2:
 labState.srvMode = "split1";
 break;
 case 3:
 labState.srvMode = "order2";
 labState.srvOrderSuccess = false;
 labState.srvOrder404 = false;
 labState.srvTicketFlying = false;
 break;
 case 4:
 labState.srvMode = "loop2";
 break;
 case 5:
 labState.srvMode = "busy3";
 labState.srvServiceStarted = false;
 labState.srvOrdersHandled = 0;
 labState.srvQueue = 0;
 break;
 case 6:
 labState.srvMode = "scale3";
 labState.srvSecondChef = false;
 break;
 case 7:
 labState.srvMode = "dns4";
 labState.srvDomainEntered = false;
 labState.srvDnsStep = 0;
 labState.srvDnsDone = false;
 break;
 case 8:
 labState.srvMode = "montage4";
 break;
 case 9:
 labState.srvMode = "close";
 labState.srvCloseU = 0;
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
