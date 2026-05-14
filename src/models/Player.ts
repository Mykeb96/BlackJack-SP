import type { Card } from "./Deck";

export function blackjackScore(hand: Card[]): number {
    let score = 0;
    let aces = 0;

    for (const card of hand) {
        if (card.rank === 'A') {
            aces += 1;
        } else if (['K', 'Q', 'J'].includes(card.rank)) {
            score += 10;
        } else {
            score += parseInt(card.rank, 10);
        }
    }

    for (let i = 0; i < aces; i++) {
        if (score + 11 <= 21) {
            score += 11;
        } else {
            score += 1;
        }
    }

    return score;
}

export class Player {
    public name: string;
    public hand: Card[];
    public chips: number;

    constructor(name: string) {
        this.name = name;
        this.hand = [];
        this.chips = 100;
    }

    receiveCard(card: Card): void {
        this.hand.push(card);
    }

    receiveHand(cards: Card[]): void {
        this.hand.push(...cards);
    }

    placeBet(amount: number): void {
        this.chips -= amount;
    }

    winBet(amount: number): void {
        this.chips += amount * 2;
    }

    pushBet(amount: number): void {
        this.chips += amount;
    }
    
    get score(): number {
        return blackjackScore(this.hand);
    }
}
