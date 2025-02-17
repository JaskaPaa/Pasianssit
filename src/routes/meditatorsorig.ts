
import {Stack, value, suit, alt, type card} from './Stack.svelte';
import {shuffle} from './utils';

export const getStacks = () =>  stacks
export const getDeal = () =>  deal

let ranks = ["A", "7", "8", "9", "T", "J", "Q", "K"];    
let suits = ["c", "d", "h", "s"];

let deck = [...ranks.map((r) => r + suits[0]), ...ranks.map((r) => r + suits[1]),
            ...ranks.map((r) => r + suits[2]), ...ranks.map((r) => r + suits[3])];

let dy = 14.0;    
let margin = 0.7;

let stacks: Stack[] = [];

const deal = async () => {

    let deal = deck; //shuffle(deck);
    for (let i = 0; i < deal.length; i++) {
        stacks[i%8 + 4].push(deal[i]);        
    }
    for (let i = 4; i < stacks.length; i++) {
        for (let j = 0; j < stacks[i].cards.length; j++) {
            if (j === 1 || j === 3)
                stacks[i].cards[j].front = true;
        }
    }
}

for (let i = 0; i < 4; i++) {
    let st = new Stack(45, i*dy + margin, [0, 0]);
    st.emptyAccept = (card) => value(card) === 7;
    st.topAccept = (card) => {
        return suit(card) === suit(st.topCard().id)
        && value(card) - 1 === value(st.topCard().id);
    };
    stacks.push(st);
}

for (let i = 0; i < 4; i++) {
    let st = new Stack(34, i*dy + margin, [-2.5, 0], 32);
    st.emptyAccept = (card) => value(card) === 14;
    st.topAccept = (card) => {
        return alt(card, st.topCard().id)
        && value(card) + 1 === value(st.topCard().id);
    };
    stacks.push(st);
}

for (let i = 0; i < 4; i++) {
    let st = new Stack(56, i*dy + margin, [2.5, 0], 32);
    st.emptyAccept = (card) => value(card) === 14;
    st.topAccept = (card) => {
        return alt(card, st.topCard().id)
        && value(card) + 1 === value(st.topCard().id);
    };
    stacks.push(st);
}

for (let i = 4; i < 12; i++) {
    stacks[i].update = () => stacks[i].enableOnlyTop();
}
