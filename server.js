import { WebSocketServer } from 'ws';
import { newSocket } from './socket-manager.js';
import { matchMakeInit } from './matchmake.js';
import { gameLoopInit } from './game-loop.js';

const wss = new WebSocketServer({
    port: 8080,
    autoPong: true,
    path: "/tictactoe",
    maxPayload: 1000
}, () => {
    console.log("server started at 8080");
});

matchMakeInit();
gameLoopInit();

wss.on('connection', (ws, req) => {
    const conId = newSocket(ws);
    ws.send("connected");
    console.log(req.socket.remoteAddress);
});


