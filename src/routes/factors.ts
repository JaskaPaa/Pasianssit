
import {Stack, value, suit, alt, pipValue, type card} from './Stack.svelte';
import {shuffle} from './utils';

export const getStacks = () =>  stacks
export const getDeal = () =>  deal

let ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"];    
let suits = ["c", "d", "h", "s"];

const primes = ["2", "3", "5", "7"];
const nonprimes = ["4", "6", "8", "9", "T", "Q", "A"];

let priDeck = [...primes.map((r) => r + suits[0]), ...primes.map((r) => r + suits[1]),
            ...primes.map((r) => r + suits[2]), ...primes.map((r) => r + suits[3])
];

priDeck = [...priDeck, ...suits.map((s) => 2 + s + '#')];


let nonDeck = [...nonprimes.map((r) => r + suits[0]), ...nonprimes.map((r) => r + suits[1]),
            ...nonprimes.map((r) => r + suits[2]), ...nonprimes.map((r) => r + suits[3])
];

let dy = 14.0;    
let margin = 1;
let dx = 11.0;

let stacks: Stack[] = [];

const deal = () => {
    let deal = shuffle(priDeck);
    for (let i = 0; i < deal.length; i++) {
        stacks[4 + i%7].push(deal[i]);
    }
    deal = shuffle(nonDeck);
    for (let i = 0; i < deal.length; i++) {
        stacks[i%4].push(deal[i]);
    }
}

for (let i = 0; i < 4; i++) {
    let st = new Stack(40 + i*dx, margin, [0, 2.5]);
    st.emptyAccept = (card) => pipValue(card) === 1;
    st.topAccept = (card) => {
        return suit(card) === suit(st.topCard().id)
        && pipValue(card) - 1 === pipValue(st.topCard().id);
    };
    stacks.push(st);
}

for (let i = 0; i < 7; i++) {
    let st = new Stack(10 + i*dx, 30 + margin, [0, 2.5], 52);
    st.emptyAccept = (card) => true;
    st.topAccept = (card) => {
        return alt(card, st.topCard().id)
        && pipValue(card) + 1 === pipValue(st.topCard().id);
    };
    stacks.push(st);
}

let st = new Stack(10, margin, [0, 0]);
st.emptyAccept = (card) => true;
st.topAccept = (card) => true;
stacks.push(st);

/*for (let i = 0; i < 4; i++) {
    let st = new Stack(56, i*dy + margin, [2.5, 0]);
    st.emptyAccept = (card) => value(card) === 14;
    st.topAccept = (card) => {
        return alt(card, st.topCard().id)
        && value(card) + 1 === value(st.topCard().id);
    };
    stacks.push(st);
}*/
