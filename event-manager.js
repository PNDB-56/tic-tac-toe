import { EventEmitter } from 'events'

const MatchEE = new EventEmitter();
const MatchMakeEE = new EventEmitter();

export const MATCH_EVENTS = {
    "NEW_MATCH": "NEW_MATCH",
    "MATCH_BROADCAST": "MATCH_BROADCAST",
    "MATCH_MAKE_MOVE": "MATCH_MAKE_MOVE"
}

export const MATCHMAKE_EVENTS = {
    "PLAY": "play"
}


export function emitMatchMakeEvent(event, ...args) {
    if (!MatchMakeEE.emit(event, ...args)) {
        console.log("failed to emit event: ", event, ...args);
    };
}

export function addMatchMakeEventListener(event, fn) {
    MatchMakeEE.on(event, fn);
}

export function emitMatchEvent(event, ...args) {
    if (!MatchEE.emit(event, ...args)) {
        console.log("failed to emit event: ", event, ...args);
    }
}

export function addMatchEventListener(event, fn) {
    MatchEE.on(event, fn);
}