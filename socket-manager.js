import crypto from 'crypto';
import { MATCHMAKE_EVENTS, emitMatchMakeEvent } from './event-manager.js';


const liveSockets = {};
//TODO: limit max connections we can keep open and terminate connections if we exceed the limit;

export function newSocket(ws) {
    const id = crypto.randomUUID();
    if (!liveSockets[id]) {
        liveSockets[id] = ws;
        ws.on('close', () => { destroySocket(id) });
        ws.on('error', () => { destroySocket(id) });
    } else {
        newSocket(ws);
    }
    console.log("new conn", id);
    emitMatchMakeEvent(MATCHMAKE_EVENTS.PLAY, id);

    // console.log(liveSockets);
    return id;
}

function destroySocket(id) {
    if (liveSockets[id]) {
        liveSockets[id].close();
        delete liveSockets[id];
        // console.log(liveSockets);
    }
}
export function writeMessageToPlayer(id, message) {
    if (liveSockets[id]) {
        liveSockets[id].send(message);
    } else {
        // TODO: emit match error, because socket doesn't exist (client disconnected);
    }
}