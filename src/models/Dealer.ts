import { Deck, type Card } from "./Deck";
import { Player } from "./Player";

export class Dealer extends Player {
    private deck: Deck;
    public hand: Card[];

    constructor() {
        super("Dealer");
        this.deck = new Deck();
        this.deck.shuffle();
        this.hand = [];
    }

    public dealCardTo(player: Player): void {
        const card = this.deck.draw();
        if (card) {
            player.receiveCard(card);
        } else {
            throw new Error('No cards left in the deck');
        }
    }

    public dealHandTo(player: Player, numCards: number): void {
        if (numCards > this.deck.cards.length) {
            throw new Error('Not enough cards in the deck');
        }
        for (let i = 0; i < numCards; i++) {
            this.dealCardTo(player);
        }
    }
}