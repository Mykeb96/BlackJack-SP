import { Dealer } from "./Dealer";
import { Player } from "./Player";

export type GameState = {
    dealer: Dealer;
    player: Player;
    status: 'betting' | 'playerTurn' | 'dealerTurn' | 'finished';
    winner: string;
}

export class Game {
    public dealer: Dealer;
    public player: Player;
    public status: 'betting' | 'playerTurn' | 'dealerTurn' | 'finished';
    public betAmount: number;

    constructor(playerName: string) {
        this.dealer = new Dealer();
        this.player = new Player(playerName);
        this.status = 'betting';
        this.betAmount = 0;
    }

    startNewRound(): void {
        this.player.hand = [];
        this.dealer.hand = [];

        this.dealer.dealHandTo(this.player, 2);
        this.dealer.dealHandTo(this.dealer, 2);
        
        this.status = 'playerTurn';
    }

    playerHit(): void {
        if (this.status !== 'playerTurn') return;
        
        this.dealer.dealCardTo(this.player);
        if (this.player.score > 21) {
            this.status = 'finished';
        }
    }

    playerStand(): void {
        if (this.status !== 'playerTurn') return;
        
        this.status = 'dealerTurn';
        this.dealerPlay();
    }

    placeBet(amount: number): void {
        this.player.placeBet(amount);
        this.betAmount = amount;
    }

    private dealerPlay(): void {
        while (this.dealer.score < 17 && this.dealer.score <= this.player.score) {
            this.dealer.dealCardTo(this.dealer);
        }
        this.status = 'finished';
        this.processGameResult();
    }

    public getGameState() {
        return {
            player: this.player,
            dealer: this.dealer,
            status: this.status,
            winner: this.checkStatus()
        };
    }

    setBettingStatus(): void {
        this.status = 'betting';
        this.betAmount = 0;
    }

    private checkStatus(): string {
        if (this.status !== 'finished') return 'Game in progress';
        if (this.player.score > 21) return 'Dealer wins';
        if (this.dealer.score > 21) return 'Player wins';
        if (this.player.score === this.dealer.score) return 'Push';
        if (this.player.score > this.dealer.score) return 'Player wins';
        return 'Dealer wins';
    }

    public processGameResult(): void {
        const result = this.checkStatus();
        if (result === 'Player wins') this.player.winBet(this.betAmount);
        if (result === 'Push') this.player.pushBet(this.betAmount);
    }
}