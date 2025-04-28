
import {Stack, value, suit, alt, type card} from './Stack.svelte';
import {shuffle, type state} from './utils';

import {History} from './History.svelte';

export const getStacks = () =>  stacks
export const getDeal = () =>  deal

let ranks = ["A", "7", "8", "9", "T", "J", "Q", "K"];    
let suits = ["c", "d", "h", "s"];

let deck = [...ranks.map((r) => r + suits[0]), ...ranks.map((r) => r + suits[1]),
            ...ranks.map((r) => r + suits[2]), ...ranks.map((r) => r + suits[3])];

let dy = 18.0;    
let margin = 1;

let stacks: Stack[] = [];
let history = { states : [{stacks: [], move: []}], current: 0 };

let hist = new History();

const deal = async () => {

    let deal = shuffle(deck);
    for (let i = 0; i < deal.length; i++) {
        stacks[i%8 + 4].push(deal[i]);        
    }
    for (let i = 4; i < stacks.length; i++) {
        for (let j = 0; j < stacks[i].cards.length; j++) {
            if (j === 1 || j === 3)
                stacks[i].cards[j].front = true;
        }
    }
    //hist.states = []; //hist = new History();
    //hist.save(stacks, [0,0]); 
}

for (let i = 0; i < 4; i++) {
    let st = new Stack(45, i*dy + margin, [0, 0]);
    st.emptyAccept = (card) => value(card) === 7;
    st.topAccept = (card) => {
        return suit(card) === suit(st.topCard().id)
        && value(card) - 1 === value(st.topCard().id);
    };
    st.type = "foundation";
    stacks.push(st);
}

for (let i = 0; i < 4; i++) {
    let st = new Stack(30, i*dy + margin, [-3, 0], 32);
    st.emptyAccept = (card) => value(card) === 14;
    st.topAccept = (card) => {
        return alt(card, st.topCard().id)
        && value(card) + 1 === value(st.topCard().id);
    };
    st.type = "collectable";
    stacks.push(st);
}

for (let i = 0; i < 4; i++) {
    let st = new Stack(60, i*dy + margin, [3, 0], 32);
    st.emptyAccept = (card) => value(card) === 14;
    st.topAccept = (card) => {
        return alt(card, st.topCard().id)
        && value(card) + 1 === value(st.topCard().id);
    };
    st.type = "collectable";
    stacks.push(st);
}

for (let i = 4; i < 12; i++) {
    stacks[i].update = () => stacks[i].enableOnlyTop();
}

export const Meditators2 = { deal: deal, stacks: stacks, history: hist };
