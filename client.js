import WebSocket from 'ws';

const ws = new WebSocket("ws://localhost:8080/tictactoe", {autoPong: true});

ws.on('open', () => {
    ws.send("check");
    console.log("open");
})

ws.on('message',(e) => {
    console.log("message:", e.toString('ascii'));
})

ws.on('error', (e) => {
    console.log("error: ", e);
})

