import crypto from 'crypto';
import { MATCHMAKE_EVENTS, MATCH_EVENTS, emitMatchMakeEvent } from './event-manager.js';


const liveSockets = {};
//TODO: limit max connections we can keep open and terminate connections if we exceed the limit;

export function newSocket(ws) {
    const id = crypto.randomUUID();
    if (!liveSockets[id]) {
        liveSockets[id] = ws;
    } else {
        newSocket(ws);
    }
    console.log("new conn", id);
    emitMatchMakeEvent(MATCHMAKE_EVENTS.PLAY, id);
    return id;
}