
<script lang="ts">
    import Card from '../lib/Card.svelte';

    import {Stack, value, suit, alt, type card} from '../routes/Stack.svelte';
    import {rectsIntersection} from '../routes/utils';
    import {getStacks, getDeal, isReady, Meditators} from '../routes/meditators.svelte';
    import {Klondike} from '../routes/klondike';
    import {History} from '../routes/History.svelte';
    import { Confetti } from "svelte-confetti"
    import { tick } from 'svelte';

    let { foo, boo, goo } = $props();

    let width = $state(0);
	let height = $state(0);
    let offset = $state(0);

    let winWidth = $state(0);
    let winHeight = $state(0);

    let full = $state(100);

    let numInDrag = $state(0);

    $effect(() => {
        full = ( winWidth < winHeight) ? 100 : 60;
        stacks = foo;
        doDeal = boo;
        hist = goo;       
    });

    let doDeal = $state(boo);

    let stacks: Stack[] = $state(foo);

    let hist: History = $state(goo);

    //stacks = getStacks();

    const collect = () => {
        for (let i = 4; i < stacks.length; i++) {
            let top = stacks[i].topCard();
            if (!top)
                continue;
            for (let j = 0; j < 4; j++) {
                if (stacks[j].accept(top.id) === true) {
                    stacks[j].pushC(stacks[i].cards.pop());
                    tooStack = j;
                    hist.save(stacks, [i, j]);
                    setTimeout(collect, 300);
                    return;
                }
            }
        }
    }

    let pointerdown = $state(false);
    let time = $state(400);

    const pointerUp = () => {
        pointerdown = false;
        time = 400;
    }

    const takeBack = () => {
        
        pointerdown = true;

        let st = hist.back();

        let lastMove = hist.lastMove();
        console.log("last move:", lastMove);

        if (st === undefined)
            return;

        for (let i = 0; i < st.stacks.length; i++) {
            for (let j = 0; j < st.stacks[i].length; j++) {
                let pos = posById(st.stacks[i][j].id);
                let cardMoved = false;
                if (st.stacks[i][j].x !== pos.x || st.stacks[i][j].y !== pos.y)
                    cardMoved = true;
                
                st.stacks[i][j].x = pos.x;
                st.stacks[i][j].y = pos.y;
                st.stacks[i][j].z = pos.z;
                st.stacks[i][j].inDrag = false;
                //st.stacks[i][j].front = pos.front;

                if (lastMove[0] === i && cardMoved)
                    st.stacks[i][j].inDrag = true;
                
            }
        }

        for (let i = 0; i < stacks.length; i++) {
            /*stacks[i].cards = [];
            for (let j = 0; j < st.stacks[i].length; j++) 
                stacks[i].pushC(st.stacks[i][j]);*/
            stacks[i].cards = st.stacks[i];
        }
        tooStack = lastMove[0];

        if (hist.current > 0) {
            setTimeout(()=> {
                if (pointerdown) {
                    time = (time > 200) ? time - 50 : 200;
                    takeBack();
                }
            }, time);
        }

    }

    const goForward = () => {
        
        pointerdown = true;

        let st = hist.forward();

        if (st === null)
            return;

        for (let i = 0; i < st.stacks.length; i++) {
            for (let j = 0; j < st.stacks[i].length; j++) {
                let pos = posById(st.stacks[i][j].id);

                let cardMoved = false;
                if (st.stacks[i][j].x !== pos.x || st.stacks[i][j].y !== pos.y)
                    cardMoved = true;

                st.stacks[i][j].x = pos.x;
                st.stacks[i][j].y = pos.y;
                st.stacks[i][j].z = pos.z;
                st.stacks[i][j].inDrag = false;

                if (st.move[1] === i && cardMoved)
                    st.stacks[i][j].inDrag = true;
            }
        }

        for (let i = 0; i < st.stacks.length; i++) {
            stacks[i].cards = st.stacks[i];
        }
        
        tooStack = st.move[1];

        if (hist.current < hist.states.length-1) {
            setTimeout(()=> {
                if (pointerdown) {
                    time = (time > 200) ? time - 50 : 200;
                    goForward();
                }
            }, time);
        }
    }

    const posById = (id: string) => {
        for (let i = 0; i < stacks.length; i++) {
            for (let j = 0; j < stacks[i].cards.length; j++) {
                if (stacks[i].cards[j].id === id)
                    return stacks[i].cards[j];
                            /*[stacks[i].cards[j].x, 
                            stacks[i].cards[j].y,
                            stacks[i].cards[j].z];*/ 
            }
        }
        return {id: "", x: 0, y:0, z:0, inDrag: false, front: false, enabled: false};
    }

    const collectCards = () => {
        let shadowCount = 0;
        let deck = new Stack();
        for (let i = 0; i < stacks.length; i++) {
            for (let j = 0; j < stacks[i].cards.length; j++) {
                stacks[i].cards[j].x = 0;
                stacks[i].cards[j].y = 0;
                stacks[i].cards[j].z = j;
                stacks[i].cards[j].inDrag = false;//shadowCount < 3;
                stacks[i].cards[j].enabled = false;
                stacks[i].cards[j].front = false;
                //deck.pushC(stacks[i].cards[j]);
                shadowCount++;                                 
            }
        }
        deck.update();
    }
    
    let isVisible = $state(false);

    const debug = async () => {
        console.log("current", hist.current);
        console.log("hist:", hist);
        //hist.print();
        let someC;
        for (let i = 0; i < stacks.length; i++) {
            someC = stacks[i].topCard();
            if (someC) {
                someC.x = 10;
                someC.y = 30;
            }

        }
        //setTimeout(()=> debug(), 400);
        //isVisible = false;
		//await tick();
        //isVisible = true

    }

    export const deal2 = async () => {
    
        rerun = false;
        //rerun2 = false;
        tooStack = -1;
        collectCards();

        let res = await isReady();
        console.log("res:", res);

        setTimeout(() => {
            rerun = true;
            //rerun2 = true;
            for (let i = 0; i < stacks.length; i++) {
                stacks[i].cards = [];
            }
            doDeal(res.deal);
            for (let i = 0; i < stacks.length; i++) {
                stacks[i].update();
            }
            hist.save(stacks, [0, 0]);
        }, 200);
    }

    function innDrag(id: string) {
        updateZ();
        let num = 0;
        for (let i = 0; i < stacks.length; i++) {
            let found = findStack(id);
            if (found !== -1) {
                num = stacks[found].setDrags(id);
            }
        }

        console.log("num", num);
        numInDrag = num;        
    }

    const updateZ = () => {
        for (let i = 0; i < stacks.length; i++) {
            for (let j = 0; j < stacks[i].cards.length; j++) {
                stacks[i].cards[j].z = j;
            }
        }
    }

    function dropped(id: string, rect: DOMRect) {

        let inStack = -1;
        let index = -1;    
        for (let i = 0; i < stacks.length; i++) {
            index = stacks[i].cards.findIndex((c) => c.id === id);
            if (index !== -1) {
                inStack = i;
                break;
            }
        }

        let res = dropOrNot(id, inStack, index, rect);
        console.log("res", res);
        console.log("rect:", rect.x, rect.y);
        console.log("rect:", rect.x/width*100, rect.y/width*100);

        if (res.cards.length === 0)
            updateCards(inStack);

        if (res.cards.length !== 0) { // delay update
            console.log("Delayed update   ++++++++++++++++++++");
            stacks[res.ind].disable();
            setTimeout(() => {
                let cards = stacks[inStack].cards.splice(index);
                tooStack = res.ind;
                for (let k = 0; k < cards.length; k++)
                    stacks[res.ind].pushC(cards[k]);

                hist.save(stacks, [inStack, res.ind]);
            }, 400);
    
        }

        return [0,0]; //[toStack.getX(ind)*w/100.0, toStack.getY(ind)*h/100.0];

    }

    const dropOrNot = (id: string, inStack: number, index: number, p: DOMRect) => {
        for (let i = 0; i < stacks.length; i++) {
            if (i == inStack)
                continue;

            for (let j = -1; j < stacks[i].cards.length; j++) {
                // -1 is empty stack
                let id2 = (j === -1) ? "st" + i : stacks[i].cards[j].id;
                
                let elem2 = document.getElementById(id2);

                if (elem2) {
                    let rect2 = elem2.getBoundingClientRect();
                    let res = rectsIntersection(p, rect2);

                    if (res) {
                        if (stacks[i].accept(id) === true) {

                            let cards = stacks[inStack].cards.slice(index);
                            let num = cards.length;
                
                            if (num > stacks[i].acceptNum)
                                continue;

                            calcPosition(stacks[inStack], stacks[i], num, index);
                            return {cards: cards, ind: i};
                        }
                    } 
                }
            }
        }
        return {cards: [], ind: -1};        
    }

    function calcPosition(st1: Stack, st2: Stack, num: number, index: number) {
        let ind = st2.cards.length;
        for (let k = 0; k < num; k++) {
            st1.cards[index+k].x = st2.getX(ind+k);
            st1.cards[index+k].y = st2.getY(ind+k);
            st1.cards[index+k].z = ind+k + 200;
            st1.cards[index+k].inDrag = false;
        }     
    }

    const clicked = (id: string) => {
        console.log("klikki ----------------:", id);
        let inStack = findStack(id);
        let index = stacks[inStack].cards.findIndex((c) => c.id === id);        

        for (let i = 0; i < stacks.length; i++) {
            if (i === inStack)
                continue;
            if (stacks[i].accept(id) === true && inStack !== -1) {
                console.log("dropping to stack:", i);
                stacks[i].disable();  // prevent click to acard under 
                stacks[inStack].disable();
                
                let cards = stacks[inStack].cards.slice(index);
                let num = cards.length;
                
                if (num > stacks[i].acceptNum)
                    continue;
                
                //tooStack = i;

                cards = stacks[inStack].cards.splice(index);
                for (let k = 0; k < cards.length; k++) {
                    stacks[i].pushC(cards[k]);
                }

                tooStack = i;

                //setTimeout(()=> hist.save(stacks, [inStack, i]), 400);
                hist.save(stacks, [inStack, i]);       
                return;
            }
        }
        updateCards();
    }

    const updateCards = (inStack = -1) => {

        for (let i = 0; i < stacks.length; i++) {
            let lift = (inStack === i) ? true : false;
            for (let j = 0; j < stacks[i].cards.length; j++) {
                stacks[i].cards[j].x = stacks[i].getX(j);
                stacks[i].cards[j].y = stacks[i].getY(j);
                stacks[i].cards[j].z = lift ? 100 + j : j;
                stacks[i].cards[j].inDrag = false; 
                //stacks[i].cards[j].enabled = true;                                 
            }
        }
        for (let i = 0; i < stacks.length; i++) {
            stacks[i].update();
        }
    }

    let tooStack = $state(-1);
    let rerun = true;
    let rerun2 = true;

    $effect(() => {
        console.log("effect!", tooStack);
        console.log("rerun:", rerun);

        if (rerun) {
            updateCards(tooStack);
        }
        //if (rerun2) {
            for (let i = 0; i < stacks.length; i++) {
                stacks[i].update();
            }
        //}
        
    });

    const findStack = (id: string) => {
        let inStack = -1;
        let index = -1;

        for (let i = 0; i < stacks.length; i++) {
            index = stacks[i].cards.findIndex((c) => c.id === id);
            if (index !== -1) {
                inStack = i;
                break;
            }
        }
        return inStack;
    }

    const stackClick = (index: number) => {
        if (stacks[index].onClick())
            setTimeout(()=> hist.save(stacks, [index, index]), 300); // fix this
        //updateCards();
        //updateZ();
    }

    

</script>

<svelte:window bind:innerWidth={winWidth} bind:innerHeight={winHeight}
    on:dblclick={() => console.log('dblclick')}></svelte:window>

<div class="control">
    <button onclick={collect}>Kerää</button>
    <button onpointerdown={takeBack} onpointerup={pointerUp}>&lt;&lt;</button>
    <button onpointerdown={goForward} onpointerup={pointerUp}>&gt;&gt;</button>
    <button onclick={debug}>Debug</button>
</div>
<div id="tableu" class="table" bind:offsetHeight={offset} bind:clientWidth={width}
    bind:clientHeight={height} style:--full={full + "vw"}>

    {#each stacks as stack, i}
         <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div id="st{i}" onclick={() => stackClick(i)}  style:--size={(full + 1)/7 - 1 + "vw"} class="unselectable stack" 
            style="left: {stack.x*width/100.0}px; top: {stack.y*width/100.0}px"></div>    
        {#each stacks[i].cards as card, j}
            <Card left={card.x*width/100} top={card.y*width/100} id={card.id}
                start={innDrag} end={dropped} inDrag={card.inDrag} index={card.z} size={full}
                click={clicked} dir={stacks[i].dir} numInDrag={numInDrag} front={card.front}
                enabled={card.enabled} />
        {/each}      
    {/each}
    {#if isVisible}
        {#each stacks as stack, i}
        {#each stacks[i].cards as card, j}
            <div class="mover" style="left: {card.x*width/100}px; top: {card.y*width/100}px">
                <Confetti amount={3} size={100} x={[0.25, 3]} y={[0, 0.25]} colorArray={["url(cards/Qs.svg)", "url(https://github.githubassets.com/favicons/favicon-dark.png)"]}/>
            </div>
        {/each}
        {/each}           
    {/if}
</div>


<style>
    .mover {
        position: absolute;
    }
    .table {
        position: relative;
        background: green; /* #006400; /*#35654d; linear-gradient(250deg, rgb(75, 180, 34), green);*/
        display: flex;
        flex-direction: column;
        --full: 100vw;
        width: var(--full);
        height: calc(0.57*var(--full));
        justify-content: center;
        align-items: center;
        touch-action: none;
        overflow: visible;
    }
    .stack {        
        --size: 10vw;
        --xxx: 0;
        border-radius: .5vw; /*calc(0.1*var(--size));*/
        width: var(--size);
        height: calc(1.3*var(--size));
        position: absolute;
        top: 0; /*calc(50% - 150px / 2);*/
        left: 0;
        margin: 0;
        padding: 0;
        background-color: #33333355;
        /*pointer-events: none;*/
    }

    .unselectable {
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    .control {
        display: flex;
        align-items:center;
        justify-content:center;
        background: rgb(55, 90, 39);
    }
    
</style>


