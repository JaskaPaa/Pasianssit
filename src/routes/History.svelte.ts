import type {Stack, card } from "./Stack.svelte";

type state = {
    stacks: card[][];
    move: number[]; 
};

export class History {
    states: state[];
    current: number; 

    constructor() {
        this.states = [];
        this.current = 0;
    }

    save(stacks: Stack[], move: number[]): void {
        let st: state = {stacks: [], move: []};
        
        for (let i = 0; i < stacks.length; i++) {
            st.stacks.push(JSON.parse(JSON.stringify(stacks[i].cards)));
        }

        st.move = move;
        
        this.states.splice(this.current+1);

        this.states.push(st);
        this.current = this.states.length - 1;
    }

    back(): state {
        this.current = (this.current === 0) ? 0 : this.current - 1;
        return this.states[this.current];
    }

    lastMove() {
        if (this.states.length <= this.current+1)
            return [0,0];
        return this.states[this.current+1].move;
    }

    forward() {
        if (this.current === this.states.length - 1)
            return null;

        this.current = (this.current === this.states.length - 1) ? this.current : this.current + 1;

        return this.states[this.current];
    }

    print() {
        for (let i = 0; i < this.states.length; i++) {
            console.log(this.states[i].stacks);
        }
    }

    diff() {        
        
        console.log("length:", this.states.length );

        let m = this.current;
        let n = this.current - 1;

        let st1 = this.states[m];
        let st2 = this.states[n];

        let diffs = [];

        for (let i = 0; i < st1.stacks.length; i++) {
            for (let j = 0; j < st1.stacks[i].length; j++) {
                if (st2.stacks[i][j] === undefined)
                    diffs.push([i, j]);

            }           
        }
        for (let i = 0; i < st2.stacks.length; i++) {
            for (let j = 0; j < st2.stacks[i].length; j++) {
                if (st1.stacks[i][j] === undefined)
                    diffs.push([i, j]);
            }           
        }
        return diffs;
    }


}