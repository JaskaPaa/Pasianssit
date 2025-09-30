
import {Stack, value, suit, alt, type card} from './Stack.svelte';
import {shuffle, type state} from './utils';

import {History} from './History.svelte';

export const getStacks = () =>  stacks
export const getDeal = (deal = []) =>  doDeal
export const isReady = async (limit = "", gameId: number, random: boolean) =>  ready(limit, gameId, random)

let ranks = ["A", "7", "8", "9", "T", "J", "Q", "K"];    
let suits = ["c", "d", "h", "s"];

let deck = [...ranks.map((r) => r + suits[0]), ...ranks.map((r) => r + suits[1]),
            ...ranks.map((r) => r + suits[2]), ...ranks.map((r) => r + suits[3])];

let dy = 19.0;    
let margin = 1;

let stacks: Stack[] = [];

let deal2: string[] = [];

let history = { states : [{stacks: [], move: []}], current: 0 };

let hist = new History();

const ready = async (limit= "", gameId: number, random: boolean) => {

    const response = await fetch('/newgame', {
        method: 'POST',
        body: JSON.stringify({ limits: limit, id: gameId, random: random}),
        headers: {
            'content-type': 'application/json'
        }
    });
    
    let game = await response.json();

    deal2 = deck;

    if (game.error) {
        console.log("error:", game.error);
    } else {
        console.log("--- game:", game);
        //deck = game.deal;
        deal2 = game.deal;
    }   
    return game;
}

const doDeal = (deal = []) => {
    
    console.log("game:", deal2);
    //hist = new History();

    deal = deal.reverse(); 
    for (let i = 0; i < deal.length; i++) {
        stacks[i%8 + 4].push(deal[i]);        
    }
    for (let i = 4; i < stacks.length; i++) {
        for (let j = 0; j < stacks[i].cards.length; j++) {
            stacks[i].cards[j].front = true;
        }
    }
    //hist.states = []; //hist = new History();
    //hist.save(stacks, [0,0]);
}

for (let i = 0; i < 4; i++) {
    let st = new Stack(43, i*dy + margin, [0, 0]);
    st.emptyAccept = (card) => value(card) === 7;
    st.topAccept = (card) => {
        return suit(card) === suit(st.topCard().id)
        && value(card) - 1 === value(st.topCard().id);
    };
    st.type = "foundation";
    stacks.push(st);
}

for (let i = 0; i < 8; i++) {
    let dirX = (i%2 === 0) ? 3.5 : -3.5;
    let y = Math.floor(i/2)*dy;
    let st = new Stack((i%2 === 0) ? 58 : 28, y + margin, [dirX, 0], 32);
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

export const Meditators = { deal: doDeal, stacks: stacks, history: hist, cardSize: 14 };

