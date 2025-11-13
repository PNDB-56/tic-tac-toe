import { MATCHMAKE_EVENTS, MATCH_EVENTS, addMatchMakeEventListener, emitMatchEvent } from './event-manager.js';


class MatchMake {
    constructor() {
        this.playersAvailable = [];
        this.matchMakingInProgress = false;
        this.dlq = [];
        setInterval(() => {
            this.pairUpPlayers()
        }, 3000);
    }

    queuePlayer(player) {
        if (!this.matchMakingInProgress) {
            this.playersAvailable.push(player);
        } else {
            this.dlq.push(player);
        }
        console.log("Queueing player", player, "current queue:", this.playersAvailable.length);
    }

    pairUpPlayers() {
        // console.log(this.playersAvailable);
        this.matchMakingInProgress = true;
        let playersCount = this.playersAvailable.length;
        let playerLastMatchIndex = -1;
        if (playersCount >= 2) {
            for (let i = 0; i < playersCount - 1; i += 2) {
                if (this.playersAvailable.length != playersCount) {
                    console.log("WARN: playersAvailable queue size increased while matchmaking");
                }

                if (i + 1 < playersCount) {
                    playerLastMatchIndex = i + 1;
                    emitMatchEvent(MATCH_EVENTS.NEW_MATCH, this.playersAvailable[i], this.playersAvailable[i + 1]);
                }
            }
            console.log("match make done for", playerLastMatchIndex + 1, "players");
            this.playersAvailable.splice(0, playerLastMatchIndex + 1);
        } else {
            // console.log("Can't matchmake, playersAvailable queue size < 2", this.playersAvailable.length, this.dlq.length);
        }
        if (this.dlq.length > 0) {
            Array.prototype.push.apply(this.playersAvailable, this.dlq);
            this.dlq.length = 0;
        }
        this.matchMakingInProgress = false;
    }
}

export function matchMakeInit() {
    const mm = new MatchMake();
    console.log("matchmake init");
    addMatchMakeEventListener(MATCHMAKE_EVENTS.PLAY, (id) => { mm.queuePlayer(id) });
}