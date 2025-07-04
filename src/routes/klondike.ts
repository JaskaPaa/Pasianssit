
import {Stack, value, suit, alt, pipValue} from './Stack.svelte';
import {shuffle, type state} from './utils';

import {History} from './History.svelte';

export const getStacks = () =>  stacks
export const getDeal = () =>  deal

let ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"];    
let suits = ["c", "d", "h", "s"];

let deck = [...ranks.map((r) => r + suits[0]), ...ranks.map((r) => r + suits[1]),
            ...ranks.map((r) => r + suits[2]), ...ranks.map((r) => r + suits[3])
];

let dy = 20.0;    
let margin = 1;
let dx = 11.0;
let test = 101/7;

// 100 / x = 101/7 - 1 => 100 = (101/7 - 1)*x => x = 100/(101/7 - 1)

let stacks: Stack[] = [];
let history = { states : [{stacks: [], move: []}], current: 0 };

let hist = new History();

for (let i = 0; i < 4; i++) {
    let st = new Stack(40 + i*test, margin, [0, 0], 1);
    st.emptyAccept = (card) => pipValue(card) === 1;
    st.topAccept = (card) => {
        return suit(card) === suit(st.topCard().id)
        && pipValue(card) - 1 === pipValue(st.topCard().id);
    };
    st.type = "foundation";
    stacks.push(st);
}

for (let i = 0; i < 7; i++) {
    let st = new Stack(test*i, dy + margin, [0, 4], 52);

    st.emptyAccept = (card) => value(card) === 13;
    st.topAccept = (card) => {
        return alt(card, st.topCard().id)
        && pipValue(card) + 1 === pipValue(st.topCard().id);
    };
    st.type = "collectable";
    stacks.push(st);
}

let waste = new Stack(20, margin, [0, 0], 0);

waste.update = () => {
    if (waste.cards.length === 2)
        waste.cards[waste.cards.length-1].x = waste.x + 2.5;
    if (waste.cards.length > 2) {
        waste.cards[waste.cards.length-1].x = waste.x + 5;
        waste.cards[waste.cards.length-2].x = waste.x + 2.5;
    }
    console.log("waste update...----------");   

    setTimeout(() => waste.updateZs(), 200);
    setTimeout(() => {
            waste.cards.forEach((c) => console.log(c.front) );
            waste.cards.forEach((c) => c.front = true );
            waste.enableOnlyTop();
        }, 200);
};

waste.emptyAccept = () => false;
waste.topAccept = () => false;
waste.type = "collectable";

stacks.push(waste);

let pile = new Stack(5, margin, [0, 0], 0);

pile.update = () => {
    console.log("pile update...----------");   
    for (let j = 0; j < pile.cards.length; j++) {
        pile.cards[j].enabled = false;
        pile.cards[j].front = false;
    }
};

pile.onClick = () => {

    if (pile.cards.length === 0 && waste.cards.length === 0)
        return false;

    if (pile.cards.length === 0) {
        let card = null;
        let count = 0;
        while (card = waste.cards.pop()) {
            card.front = false;
            pile.pushC(card, 0, count < 3);
            count++;
        }
        setTimeout(()=> hist.save(stacks, [11, 12]), 300);
        return; // quit
    }
    
    for (let i = 0; i < 3; i++) {
        let card = pile.cards.pop();
        if (card === undefined)
            break;
        console.log("card z:", card.z);
        setTimeout(() => card.z = 100, 1);
        setTimeout(() => card.front = true, 100);
        setTimeout(() => waste.enableOnlyTop(), 200);
        waste.pushC(card, 100, true);
    }
    setTimeout(()=> hist.save(stacks, [12, 11]), 250);
};

stacks.push(pile);

const deal = () => {
    let deal = shuffle(deck);
    let first = 4;
    let index = 0;
    //hist = new History();

    for (let i = 0; i < 7; i++) {
        for (let j = i; j < 7; j++) {
            stacks[first + j%7].push(deal[index]);
            index++;
        }
    }
    for (let i = index; i < deal.length; i++)
        pile.push(deal[i]);

    //hist.states = [];// new History();
    //hist.save(stacks, [0,0]); (full + 1)/7 - 1
}

export const Klondike = { deal: deal, stacks: stacks, history: hist, cardSize: (100 + 1)/7 - 1 };