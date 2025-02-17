
import {Stack, value, suit, alt, pipValue, type card} from './Stack.svelte';
import {shuffle} from './utils';

export const getStacks = () =>  stacks
export const getDeal = () =>  deal

let ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"];    
let suits = ["c", "d", "h", "s"];

let deck = [...ranks.map((r) => r + suits[0]), ...ranks.map((r) => r + suits[1]),
            ...ranks.map((r) => r + suits[2]), ...ranks.map((r) => r + suits[3])
];

let dy = 14.0;    
let margin = 1;
let dx = 11.0;

let stacks: Stack[] = [];

for (let i = 0; i < 4; i++) {
    let st = new Stack(40 + i*dx, margin, [0, 0], 1);
    st.emptyAccept = (card) => pipValue(card) === 1;
    st.topAccept = (card) => {
        return suit(card) === suit(st.topCard().id)
        && pipValue(card) - 1 === pipValue(st.topCard().id);
    };
    stacks.push(st);
}

for (let i = 0; i < 7; i++) {
    let st = new Stack(10 + i*dx, 14 + margin, [0, 2.5], 52);
    st.emptyAccept = (card) => value(card) === 13;
    st.topAccept = (card) => {
        return alt(card, st.topCard().id)
        && pipValue(card) + 1 === pipValue(st.topCard().id);
    };
    stacks.push(st);
}

let waste = new Stack(22, margin, [0, 0], 0);

waste.update = () => {
    if (waste.cards.length === 2)
        waste.cards[waste.cards.length-1].x = waste.x + 2.5;
    if (waste.cards.length > 2) {
        waste.cards[waste.cards.length-1].x = waste.x + 5;
        waste.cards[waste.cards.length-2].x = waste.x + 2.5;
    }
    waste.enableOnlyTop();
};

waste.emptyAccept = (card) => false;
waste.topAccept = (card) => false;
stacks.push(waste);

let pile = new Stack(10, margin, [0, 0], 0);

pile.update = () => {
    for (let j = 0; j < pile.cards.length; j++)
        pile.cards[j].enabled = false;
};

pile.onClick = () => {
    if (pile.cards.length === 0) {
        let card = null;
        while (card = waste.cards.pop()) {
            card.front = false;
            pile.pushC(card);
        }
        return;
    }
    
    for (let i = 0; i < 1; i++) {
        let card = pile.cards.pop();
        if (card === undefined)
            break;
        setTimeout(() => card.z = 100, 1);
        setTimeout(() => card.front = true, 100);
        waste.pushC(card);
    }
    
};

stacks.push(pile);

const deal = () => {
    let deal = shuffle(deck); //deck.reverse(); 
    let first = 4;
    let index = 0;
    for (let i = 0; i < 7; i++) {
        for (let j = i; j < 7; j++) {
            stacks[first + j%7].push(deal[index]);
            index++;
        }
    }
    for (let i = index; i < deal.length; i++)
        pile.push(deal[i]);
}