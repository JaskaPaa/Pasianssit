
<script lang="ts">
    import type { PageProps } from './$types';

    let { data }: PageProps = $props();

	//import { pushState } from '$app/navigation';
    import Card from '../lib/Card.svelte';
    import {Stack, value, suit, alt, type card} from './Stack.svelte';
    import {rectsIntersection} from './utils';
    import {getStacks, getDeal, isReady} from './meditators';
    import {loadPatience} from './loader';

    
    
    let width = $state(0);
	let height = $state(0);
    let offset = $state(0);

    let winWidth = $state(0);
    let winHeight = $state(0);

    let full = $state(100);

    let numInDrag = $state(0);

    $effect(() => {
        full = ( winWidth < winHeight) ? 100 : 70;
    });

    let doDeal = getDeal();

    let stacks: Stack[] = $state([]);
    let drags: Stack = $state(new Stack);

    let game = $state(null);

    game = data.game;

    stacks = getStacks();

    const deal = async () => {
    
        rerun = false;
        collectCards();

        //roll();
        let res = await isReady();
        console.log("res:", res);

        setTimeout(() => {
            for (let i = 0; i < stacks.length; i++) {
                stacks[i].cards = [];
            }
            doDeal(res.deal);
            //updateCards();
            rerun = true;
        }, 500);
    }

    const switchPat = async (name: string) => {
        let pat = await loadPatience(name);

        doDeal = pat.deal;
        stacks = pat.stacks;
        //deal();

        console.log("loaded!");
        
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

        let tableu = document.getElementById("tableu");
        let tabY = (tableu) ? tableu.getBoundingClientRect().y : 0;
        console.log("tableu:", tabY );
        
        /*for (let k = 0; k < res.cards.length; k++) {
            stacks[inStack].cards[index+k].x = rect.x/width*100 + stacks[inStack].dir[0]*k;
            stacks[inStack].cards[index+k].y = (rect.y - tabY)/width*100 + stacks[inStack].dir[1]*k;
        }*/        

        if (res.cards.length === 0)
            updateCards(inStack);

        if (res.cards.length !== 0) { // delay update
            console.log("Delayed update   ++++++++++++++++++++");
            stacks[res.ind].disable();
            /*let cards = stacks[inStack].cards.splice(index);
            tooStack = res.ind;
            for (let k = 0; k < cards.length; k++)
                stacks[res.ind].pushC(cards[k]);*/
            setTimeout(() => {
                let cards = stacks[inStack].cards.splice(index);
                tooStack = res.ind;
                for (let k = 0; k < cards.length; k++)
                    stacks[res.ind].pushC(cards[k]);
            }, 300);
            
        }

        return [0,0]; //[toStack.getX(ind)*w/100.0, toStack.getY(ind)*h/100.0];

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

    const collectCards = () => {
        for (let i = 0; i < stacks.length; i++) {
            for (let j = 0; j < stacks[i].cards.length; j++) {
                stacks[i].cards[j].x = 0;
                stacks[i].cards[j].y = 40;
                stacks[i].cards[j].z = j;
                stacks[i].cards[j].inDrag = false;
                stacks[i].cards[j].enabled = false;
                stacks[i].cards[j].front = false;                                 
            }
        }
    }

    let tooStack = $state(-1);
    let rerun = true;

    $effect(() => {
        console.log("effect!", tooStack);
        console.log("rerun:", rerun);

        if (rerun) {
		    updateCards(tooStack);
	    }

        for (let i = 0; i < stacks.length; i++) {
            stacks[i].update();
        }
    });

    const updateZ = () => {
        for (let i = 0; i < stacks.length; i++) {
            for (let j = 0; j < stacks[i].cards.length; j++) {
                stacks[i].cards[j].z = j;
            }
        }
    }

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

    const clicked = (id: string) => {
        console.log("klikki ----------------:", id);
        let inStack = findStack(id);
        let index = stacks[inStack].cards.findIndex((c) => c.id === id);        

        for (let i = 0; i < stacks.length; i++) {
            if (i === inStack)
                continue;
            if (stacks[i].accept(id) === true && inStack !== -1) {
                console.log("dropping to stack:", i);
                stacks[i].disable();
                stacks[inStack].disable();
                
                let cards = stacks[inStack].cards.slice(index);
                let num = cards.length;
                
                if (num > stacks[i].acceptNum)
                    continue;

                cards = stacks[inStack].cards.splice(index);
                for (let k = 0; k < cards.length; k++)
                        stacks[i].pushC(cards[k]);

                tooStack = i;                
                return;
            }
        }
        updateCards();
    }
    const stackClick = (index: number) => {
        stacks[index].onClick();
        //updateCards();
    }

    //deal();
    updateCards();
    
    async function roll() {
		//const response = await fetch('/newgame');

        const response = await fetch('/newgame', {
			method: 'POST',
			body: JSON.stringify({ limits: ""}),
			headers: {
				'content-type': 'application/json'
			}
		});
		
        game = await response.json();

        //console.log("selected:", selected);

        if (game.error) {
            console.log("error:", game.error);
        } else {
            //console.log("game:", game.deal);
            console.log("game:", $state.snapshot(game));
        }
	}

</script>

<svelte:window bind:innerWidth={winWidth} bind:innerHeight={winHeight}
    on:dblclick={() => console.log('dblclick')}></svelte:window>

<div class="topbar">Mietiskelijän pasianssi</div>

<div id="tableu" class="table" bind:offsetHeight={offset} bind:clientWidth={width} bind:clientHeight={height} style:--full={full + "vw"}>    
    {#each stacks as stack, i}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div id="st{i}" onclick={() => stackClick(i)}  style:--size={full/10 + "vw"} class="unselectable stack" 
            style="left: {stack.x*width/100.0}px; top: {stack.y*width/100.0}px"></div>
    {/each}

    {#each stacks as stack, i}
        {#each stacks[i].cards as card, j}
            <div class="box">
            <Card left={card.x*width/100} top={card.y*width/100} id={card.id}
                start={innDrag} end={dropped} inDrag={card.inDrag} index={card.z} size={full}
                click={clicked} dir={stacks[i].dir} numInDrag={numInDrag} front={card.front}
                enabled={card.enabled} />
            </div>
        {/each}      
    {/each}
</div>

<div class="topbar">
    <button onclick={() => deal()}>Jaa</button>
    <button onclick={()=> updateCards()}>Päivitä</button>
    <button onclick={()=> switchPat("klondike")}>Vaihda</button>
    <button onclick={()=> switchPat("meditators")}>Vaihda</button>
</div>

<style>
    :global(body) { 
        margin: 0; padding: 0;
        display: grid;
        justify-content: center;
        align-items: center;
        background: #006400;
    } 
    .topbar {
        display: flex;
        align-items:center;
        justify-content:center;
        background: rgb(158, 212, 133);
    }
    .table {
        position: relative;
        background: #006400; /*#35654d; linear-gradient(250deg, rgb(75, 180, 34), green);*/
        display: flex;
        flex-direction: column;
        --full: 100vw;
        width: var(--full);
        height: calc(0.57*var(--full));
        justify-content: center;
        align-items: center;
        touch-action: none;
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
    .box {
        background: transparent;
		/*position: absolute;*/
		/*perspective: 10px;*/
        /*perspective: 10cm; */
	}

    .unselectable {
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    .boo {
        /*box-shadow: 0 20px 20px -10px #00000088;*/
        background: transparent;
        height: 200px;
        margin: 0;
        position: relative;
        width: 300px;
        
        &:after {
            content: '';
            display: block;
            position: absolute;
            top: 0; right: 0; bottom: 0; left: 0;
            z-index: 5;
            box-shadow: 20px 20px 20px #00000088;
  }
    }
</style>