// deck of cards library

// deck class for shuffling, dealing
module.exports = class Deck {
    constructor() {
        this.deck = []
        this.bot_dealt_cards = []
        this.player_dealt_cards = []
        this.playerCards = []
        this.botCards = []
    }

    // generates a deck of cards
    generate_deck() {

        // creates card generator function
        let card = (suit, card, value) => {
            let name = card + ' of ' + suit;
            //returns key and values into each instance of the this.deck array
            return [name, card, suit, value]
        }

        let values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', '10', '10', '10', '11']
        let cards = ['2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '🇯', '🇶', '🇰', '🇦']
        let suits = ["♠", "♥", "♦", "♣"]

        for (let s = 0; s < suits.length; s++) {
            for (let c = 0; c < cards.length; c++) {
                this.deck.push(card(suits[s], cards[c], values[c]))
            }
        }
    }

    // prints the deck of card objects
    print_deck() {
        if (this.deck.length === 0) {
            console.log('Deck has not been generated. Call generate_deck() on deck object before continuing.')
        } else {
            for (let c = 0; c < this.deck.length; c++) {
                console.log(this.deck[c])
            }
        }
    }

    // shuffle the deck
    shuffle() {
        for (let c = this.deck.length - 1; c >= 0; c--) {
            let tempval = this.deck[c];
            let randomindex = Math.floor(Math.random() * this.deck.length);

            //ensures that the randome index isn't the same as the current index. It runs the function again if this returns as true
            while (randomindex == c) {
                randomindex = Math.floor(Math.random() * this.deck.length)
            }
            this.deck[c] = this.deck[randomindex];
            this.deck[randomindex] = tempval;
        }
    }

    // deal a number cards
    Playerdeal(num_cards) {
        this.playerCards = []
        for (let c = 0; c < num_cards; c++) {
            let playerCard = this.deck.shift()
            this.playerCards.push(playerCard);

            this.player_dealt_cards.push(playerCard)
        }
    }

    Botdeal(num_cards) {
        this.botCards = []
        for (let c = 0; c < num_cards; c++) {
            let botCard = this.deck.shift()
            this.botCards.push(botCard);

            this.bot_dealt_cards.push(botCard)
        }
    }

    replace() {
        this.deck.unshift(this.bot_dealt_cards.shift())
        this.deck.unshift(this.player_dealt_cards.shift())
    }

    clear_deck() {
        this.deck = []
    }
}

/*deck = new Deck()
deck.generate_deck()
deck.shuffle()
deck.Playerdeal(2)
deck.Botdeal(2)
console.log(deck.playerCards)
console.log(deck.botCards)*/
//deck.print_deck()