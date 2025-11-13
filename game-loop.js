/**
 * 
 * match object structure:
 * {
 *  id: Match-ID,
 *  player-id1: string,
 *  player-id2: string,
 *  status: string (init/progress/done)
 *  winner: string
 * }
 */
import { randomUUID, randomInt } from 'crypto';
import { addMatchEventListener, MATCH_EVENTS } from './event-manager.js';
import { writeMessageToPlayer } from './socket-manager.js';

const matches = {};
const gridMap = {
    0: [0, 0],
    1: [0, 1],
    2: [0, 2],
    3: [1, 0],
    4: [1, 1],
    5: [1, 2],
    6: [2, 0],
    7: [2, 1],
    8: [2, 2]
}
class Match {
    constructor(p1, p2) {
        this.player1 = p1;
        this.player2 = p2;
        this.mark1 = "x";
        this.mark2 = "o";
        this.matchId = randomUUID();
        this.status = "progress";
        this.winner = null;
        this.turn = randomInt(99999) % 2 === 0 ? p1 : p2;
        this.movesCounter = 0;
        this.grid = [["", "", ""], ["", "", ""], ["", "", ""]];
        // console.log("created match for", p1, p2);
    }

    toggleTurn() {
        this.turn = this.turn === this.player1 ? this.player2 : this.player1;
    }

    makeMove(player, sq) {
        if (this.status === "progress" && sq >= 0 && sq < 9 && this.turn === player) {
            let row = gridMap[sq][0];
            let col = gridMap[sq][1];
            let mark = player === this.player1 ? this.mark1 : this.mark2;
            if (this.grid[row][col] === "") {
                this.grid[row][col] = mark;
                this.movesCounter++;
                this.isMatchComplete();
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    isMatchComplete() {
        if (this.movesCounter === 9) {
            this.status = "over";
            if (this.winConditionMet()) {
                this.updateWinner();
            }
        } else {
            this.toggleTurn();
        }
    }

    updateWinner() {
        this.winner = this.turn;
    }

    winConditionMet() {
        if ((this.grid[0][0] === this.grid[0][1] && this.grid[0][1] === this.grid[0][2]) || (this.grid[1][0] === this.grid[1][1] && this.grid[1][1] === this.grid[1][2]) ||
            (this.grid[2][0] === this.grid[2][1] && this.grid[2][1] === this.grid[2][2])) {
            return true;
        } else if ((this.grid[0][0] === this.grid[1][0] && this.grid[1][0] === this.grid[2][0]) || (this.grid[0][1] === this.grid[1][1] && this.grid[1][1] === this.grid[2][1]) ||
            (this.grid[0][2] === this.grid[1][2] && this.grid[1][2] === this.grid[2][2])) {
            return true;
        } else if ((this.grid[0][0] === this.grid[1][1] && this.grid[1][1] === this.grid[2][2]) || (this.grid[0][2] === this.grid[1][1] && this.grid[1][1] === this.grid[2][0])) {
            return true;
        }
        return false;
    }
}


export function newMatch(p1, p2) {
    const m = new Match(p1, p2);
    writeMessageToPlayer(p1, JSON.stringify({ "event": "MATCH_START", "opponent": p2 }));
    writeMessageToPlayer(p2, JSON.stringify({ "event": "MATCH_START", "opponent": p1 }));
    if (matches[m.matchId]) {
        newMatch(p1, p2);
    } else {
        matches[m.matchId] = m;
    }
    console.log(`created match: ${m.matchId} for pl: ${p1}, p2: ${p2}`);
    return m.matchId;
}

export function updateMatchStatus(id, status) {
    if (matches[id]) {
        matches[id].status = status;
        return true;
    }
    return false;
}

export function updateMatchTurn(id) {
    if (matches[id]) {
        matches[id].toggleTurn();
        return true;
    }
    return false;
}

export function updateMatchWinner(id, player) {
    if (matches[id]) {
        matches[id].winner = player;
    }

}

export function updateMatchMove(id, player, sq) {
    if (matches[id]) {
        matches[id].makeMove(player, sq);
    } else {
        return false;
    }
}


function test() {
    const id = newMatch("p1", "p2");
    console.log(matches);
    updateMatchStatus(id, "progress");
    console.log(matches);
    updateMatchTurn(id, matches[id].turn === matches[id].player1 ? matches[id].player2 : matches[id].player1);
    console.log(matches);
    console.log(updateMatchMove(id, matches[id].turn, 2));
    console.log(matches[id].grid);
    updateMatchTurn(id, matches[id].turn === matches[id].player1 ? matches[id].player2 : matches[id].player1);
    console.log(matches);
    console.log(updateMatchMove(id, matches[id].turn, 2));
}

// test()

export function gameLoopInit() {
    console.log("Game loop init");
    addMatchEventListener(MATCH_EVENTS.NEW_MATCH, newMatch);
}


