
import {Stack, value, suit, alt, type card} from './Stack.svelte';
import {shuffle} from './utils';

export const getStacks = () =>  stacks
export const getDeal = (deal = []) =>  doDeal
export const isReady = async () =>  ready()

let ranks = ["A", "7", "8", "9", "T", "J", "Q", "K"];    
let suits = ["c", "d", "h", "s"];

let deck = [...ranks.map((r) => r + suits[0]), ...ranks.map((r) => r + suits[1]),
            ...ranks.map((r) => r + suits[2]), ...ranks.map((r) => r + suits[3])];

let dy = 14.0;    
let margin = 0.7;

let stacks: Stack[] = [];

let deal2: string[] = [];

const ready = async () => {

    const response = await fetch('/newgame', {
        method: 'POST',
        body: JSON.stringify({ limits: ""}),
        headers: {
            'content-type': 'application/json'
        }
    });
    
    let game = await response.json();

    deal2 = deck;

    if (game.error) {
        console.log("error:", game.error);
    } else {
        console.log("game:", game);
        //deck = game.deal;
        deal2 = game.deal;
    }   
    return game;
}

const doDeal = async (deal = []) => {
    
    console.log("game:", deal2);
    
    deal = deal.reverse(); 
    for (let i = 0; i < deal.length; i++) {
        stacks[i%8 + 4].push(deal[i]);        
    }
    for (let i = 4; i < stacks.length; i++) {
        for (let j = 0; j < stacks[i].cards.length; j++) {
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

for (let i = 0; i < 8; i++) {
    let dirX = (i%2 === 0) ? 2.5 : -2.5;
    let y = Math.floor(i/2)*dy;
    let st = new Stack((i%2 === 0) ? 56 : 34, y + margin, [dirX, 0], 32);
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
