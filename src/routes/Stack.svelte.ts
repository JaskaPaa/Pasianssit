export type card = {
    id: string;
    x: number;
    y: number;
    z: number;
    inDrag: boolean;
    front: boolean;
    enabled: boolean;
};

export class Stack {
    x = 0;
    y = 0;
    cards: card[] = $state([]);
    dir = [0,0];
    acceptNum = 1;

    constructor(x = 0, y = 0, dir = [0,0], acceptNum = 1) {
        this.x = x;
        this.y = y;
        this.dir = dir;
        this.acceptNum = acceptNum;
    }

    push(card: string): void {
        let i = this.cards.length;
        this.cards.push(
            {
                id: card,
                x: this.x + this.dir[0]*i, y: this.y + this.dir[1]*i,
                z: i, inDrag: false, front: false, enabled: false
            });
    }

    pushC(card: card | undefined, z = 0, inDrag = true): void {
        if (card === undefined)
            return;
        let i = this.cards.length;
        //card.x += 0.001;
        //card.y += 0.001;
        //card.x = this.x + this.dir[0]*i;
        //card.y = this.y + this.dir[1]*i;
        card.z = i + z;
        card.inDrag = inDrag;
        this.cards.push(card);
    }
    
    getX(i: number) {
        return this.x + i*this.dir[0];   
    }

    getY(i: number) {
        return this.y + i*this.dir[1];   
    }

    update() {
        console.log("Stack update:");
        for (let j = 0; j < this.cards.length; j++) {
            this.cards[j].enabled = false;

            if (this.cards[j].front === true)
                this.cards[j].enabled = true;
        }
        if (this.topCard()) {
            this.topCard().enabled = true;
            this.topCard().front = true;           
        }
    }

    updateZs() {
        for (let j = 0; j < this.cards.length; j++) {
            this.cards[j].z = j;
        }
    } 

    onClick() { return false; }

    topCard() {
        /*if (this.cards.length === 0)
            return {id: "none"};*/
        return this.cards[this.cards.length-1];
    }

    accept(card: string): boolean {

        if (!this.topCard()) { // empty statck
            return this.emptyAccept(card);
        } else {
            return this.topAccept(card);
        }
    }

    emptyAccept(card: string): boolean {
        return false;
    }

    topAccept(card: string): boolean {
        return false;
    }

    disable() {
        for (let j = 0; j < this.cards.length; j++) {
            this.cards[j].enabled = false;
        }
    }

    enableOnlyTop() {
        for (let j = 0; j < this.cards.length; j++) {
            this.cards[j].enabled = false;
            //this.cards[j].z = j;
            if (j === this.cards.length - 1) {
                this.cards[j].enabled = true;
                this.cards[j].front = true;
            }
        }
    }

    setDrags(id: string) {
        let found = false;
        let count = 0;
        for (let j = 0; j < this.cards.length; j++) {
            if (id === this.cards[j].id)
                found = true;
            if (found) {
                let card = this.cards[j];
                card.x += .001;
                card.y += .001;
                card.inDrag = true;
                count++;
            }
        }
        return count;
    }
}

export const value = (card: string) => {
    return rank.indexOf(card[0], 2);
}
export const pipValue = (card: string) => {
    return rank.indexOf(card[0]);
}
export const suit = (card: string) => {
    return card[1];
}
export const color = (card: string) => {
    if (card[1] === 's' || card[1] === 'c')
        return 'black';
    return 'red';
}

export const alt = (card1: string, card2: string) => {
    if (color(card1) == color(card2))
        return false;
    return true;
}

const rank = ['none', 'A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
