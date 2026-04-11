
<script lang="ts">
    import Card from '../lib/Card.svelte';

    import {Stack, value, suit, alt, type card} from '../routes/Stack.svelte';
    import {rectsIntersection} from '../routes/utils';
    import {getStacks, getDeal, isReady, Meditators} from '../routes/meditators.svelte';
    import {Klondike} from '../routes/klondike';
    import {Meditators2} from '../routes/meditatorsorig';
    import {History} from '../routes/History.svelte';
    import { Confetti } from "svelte-confetti";
    import Resizebutton from "./Resizebutton.svelte";

    import Loading from './Loading.svelte';
	
    import { onMount } from 'svelte';

	onMount(() => {
		if (height > winHeight)
            full = 45;
	});

    
    import { tick } from 'svelte';


    import '@fortawesome/fontawesome-free/css/all.min.css';
	//import { _ } from '$env/static/private';

    let { name, full, deck } = $props();

    let width = $state(0);
	let height = $state(0);
    let offset = $state(0);

    let winWidth = $state(0);
    let winHeight = $state(0);

    let lastHeight = $state(0);
    let lastWidth = $state(0);

    let numInDrag = $state(0);

    let firstTime = $state({klondike: true, meditators: true, meditatorsorig: true});

    let cardSize =  $state(0);

    $effect(() => {
        //full = (winWidth < winHeight) ? 100 : 50;

        if (winWidth < winHeight) {
            full = 100;
        } /*else {
            full = (height > winHeight) ? full - 5 : full;
            full = (height < winHeight + 100) ? full + 5 : full;
        }*/
        full += resize*0.07;

        full = (full > 95) ? 95 : full;
        full = (full < 30) ? 30 : full;

        if (winWidth < winHeight) {
            full = 100;
        }

        //console.log("full:", full);
        //if (lastHeight < winHeight) // || lastWidth < winWidth)
          //  full += 5;

        lastHeight = winHeight;
        lastWidth = winWidth;
        
        if (name === "klondike") {
            //let { deal, stacks, history, cardSize } = Klondike;
            doDeal = Klondike.deal;
            stacks = Klondike.stacks;
            hist = Klondike.history;
            cardSize = Klondike.cardSize;
            if (firstTime.klondike) {
                deal2();
                firstTime.klondike = false;
            }
        }

        if (name === "meditators") {
            doDeal = Meditators.deal;
            stacks = Meditators.stacks;
            hist = Meditators.history;
            cardSize = Meditators.cardSize;
            if (firstTime.meditators) {
                deal2();
                firstTime.meditators = false;
            }
        }

        if (name === "meditatorsorig") {
            doDeal = Meditators2.deal;
            stacks = Meditators2.stacks;
            hist = Meditators2.history;
            cardSize = Meditators2.cardSize;
            if (firstTime.meditatorsorig) {
                deal2();
                firstTime.meditatorsorig = false;
            }
        }
    });

    let doDeal = $state(Meditators.deal);

    let stacks: Stack[] = $state(Meditators.stacks);

    let hist: History = $state(Meditators.history);

    let game = $state({id: -1, deal: [], length: '??', tries: '??', maxId: "0", tip: []});

    let dealing = $state(false);
    
    const gameById = () => {
        random = false;
        deal2();
    }

    const gameByLimits = () => {
        random = true;
        deal2();
    }

    const setSelect = (len: number) => {        
        if (len <= 40)
            selected = "32-40";
        if (len > 40 && len <= 45)
            selected = "41-45";
        if (len > 45 && len <= 50)
            selected = "46-50";
        if (len > 50 && len <= 60)
            selected = "51-60";
        if (len > 60)
            selected = "61-99";
    }

    export const deal2 = async () => {
    
        dealing = true;    
        rerun = false;
        //rerun2 = false;
        tooStack = -1;
        collectCards();
        loading = true;

        if (name === "meditators")
            game = await isReady(selected, gameId, random);

        loading = false;
        
        hist.states = [];
        hist.current = 0;
        gameId = game.id;
        tips = 1;

        if (random === false) {
            setSelect(parseInt(game.length));
            random = true;
        }

        setTimeout(() => {
            rerun = true;
            //rerun2 = true;
            for (let i = 0; i < stacks.length; i++) {
                stacks[i].cards = [];
            }
            doDeal(game.deal);
            for (let i = 0; i < stacks.length; i++) {
                stacks[i].update();
            }
            hist.save(stacks, [0, 0]);
            dealing = false;    
        }, 200);
    }
    
    const collect2 = () => {
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
    const collect = () => {
        if (dealing) 
            return;

        for (let i = 0; i < stacks.length; i++) {
            let top = stacks[i].topCard();
            
            if (stacks[i].type !== "collectable" || !top)
                continue;

            for (let j = 0; j < stacks.length; j++) {
                if (stacks[j].type !== "foundation")
                    continue;

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

    const takeAllBack = () => {
        if (hist.current === 0)
            return;
        takeBack();
        takeAllBack();        
    }

    const takeBack = () => {
        
        pointerdown = true;
        
        console.log("current:", hist.current);

        if (hist.current === 0)
            return;

        let st = hist.back();

        let lastMove = hist.lastMove();

        console.log("st:", st);
        
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

        updateZ();

        //takeBack();

        if (hist.current > 0) {
            setTimeout(()=> {
                if (pointerdown) {
                    time = (time > 200) ? time - 50 : 200;
                    takeBack();
                }
            }, time);
        }

    }

    const goAllForward = () => {

        if (hist.states.length <= hist.current+1)
            return;

        goForward();        
        goAllForward();        
    }

    const goForward = () => {
        
        pointerdown = true;

        let st = hist.forward();

        console.log("st:", st);

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
        
        let types = ["foundation", "collectable"];

        for (let t = 0; t < types.length; t++) {
            for (let i = 0; i < stacks.length; i++) {
                if (i === inStack)
                    continue;
                if (stacks[i].accept(id) === true && inStack !== -1 && stacks[i].type === types[t]) {
                    console.log("dropping to stack:", i);
                    stacks[i].disable();  // prevent click to a card under 
                    stacks[inStack].disable();
                    
                    let cards = stacks[inStack].cards.slice(index);
                    let num = cards.length;
                    
                    if (num > stacks[i].acceptNum)
                        continue;

                    cards = stacks[inStack].cards.splice(index);
                    for (let k = 0; k < cards.length; k++) {
                        stacks[i].pushC(cards[k]);
                    }

                    tooStack = i;

                    hist.save(stacks, [inStack, i]);       
                    return;
                }
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

    let tips = $state(1);
    
    const tip = async (e: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement; }) => {

        const node = e.currentTarget;
        node.disabled = true;
        
        takeAllBack();

        await new Promise(res => setTimeout(res, time));

        let sol = game.tip;
        time = 200;

        for (let m = 0; m < tips*5; m++) {
            
            let from = sol[m][0];
            let to = sol[m][1];

            let card = stacks[from].topCard();

            let index = stacks[from].cards.findIndex((c) => c.id === card.id);

            stacks[from].disable();

            let cards = stacks[from].cards.splice(index);

            for (let k = 0; k < cards.length; k++) {
                stacks[to].pushC(cards[k]);
            }

            tooStack = to;

            hist.save(stacks, [from, to]);

            let speed = (m < tips*5 - 5) ? 0 : 2;

            await new Promise(res => setTimeout(res, time*speed));

        }

        if (tips < 5) tips++;

        node.disabled = false;
    }

    let tooStack = $state(-1);
    let rerun = true;
    let rerun2 = true;

    let lastW = 0;

    $effect(() => {
        console.log("effect!", tooStack);
        console.log("rerun:", rerun);

        //console.log("wwwww:", w, lastW);
        //full += (w - lastW)*0.1;
        /*if (winWidth < winHeight) {
            full = 100;
        } else {
            full += (w - lastW)*0.1;
            lastW = w;
        }*/
    
        if (name === "meditators") {
            if (game.length)
                moves = hist.current.toString() + '/' + game.length;
            else
                moves = "none";
        } else
            moves = hist.current.toString();

        if (rerun) {
            updateCards(tooStack);
        }
        //if (rerun2) {
        for (let i = 0; i < stacks.length; i++) {
            stacks[i].update();
        }
        //}
        
        let str = gameId.toString();

        if (isNaN(gameId)) {
            str = "0";
        }
        
        str.replace(/[^0-9]/g, ""); // leave only digits
        console.log("str", str);

        gameId = parseInt(str);
        let maxId = parseInt(game.maxId);

        if (gameId < 0)
            gameId = 0;
        if (gameId >  maxId)
            gameId = maxId;
        


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
        stacks[index].onClick();
        tooStack = -1; // wierd, but must be after takeback 
        setTimeout(()=> updateCards(index), 200);
    }

    const dblClick = () => {
        console.log("double click");
        //pointerdown = true;
        //takeBack();
    }   

    let moves = $state("0");
    let selected = $state("32-40");
    let gameId = $state(0);
    let random = $state(true);

    let ctrlW = $state(300);
    let resize = $state(0);
    let loading = $state(false);

     const debug = async () => {
        console.log("current", hist.current);
        console.log("hist:", hist);
        //hist.print();
        let someC;
        /*for (let i = 0; i < stacks.length; i++) {
            someC = stacks[i].topCard();
            if (someC) {
                someC.x = 10;
                someC.y = 30;
            }

        }*/
        setTimeout(()=> isVisible = false, 10000);
        //isVisible = false;
		//await tick();
        isVisible = true;

        //isVisible = false;

    }
    //style="width: 5.5rem;"
</script>

<svelte:window bind:innerWidth={winWidth} bind:innerHeight={winHeight}
    on:dblclick={() => console.log('dblclick')}></svelte:window>

<div class="wrapper">
    <div class="control" bind:clientWidth={ctrlW}>
        <span style="max-width: 4rem; min-width: 4rem;">{moves}</span> 
    
        <div class="test">
            <button class="ctrl-button action-button" onclick={collect}>Kerää</button>
            <!-- svelte-ignore a11y_consider_explicit_label -->
            <button class="ctrl-button" onpointerdown={takeAllBack} onpointerup={pointerUp} ondblclick={dblClick}>
                <i class="fa fa-backward-fast" aria-hidden="true"></i>
            </button>
            <!-- svelte-ignore a11y_consider_explicit_label -->
            <button class="ctrl-button" onpointerdown={takeBack} onpointerup={pointerUp} ondblclick={dblClick}>
                <i class="fa fa-backward-step" aria-hidden="true"></i>
            </button>
            <!-- svelte-ignore a11y_consider_explicit_label -->
            <button class="ctrl-button" onpointerdown={goForward} onpointerup={pointerUp}>
                <i class="fa fa-forward-step" aria-hidden="true"></i>
            </button>
            <!-- svelte-ignore a11y_consider_explicit_label -->
            <button class="ctrl-button" onpointerdown={goAllForward} onpointerup={pointerUp}>
                <i class="fa fa-forward-fast" aria-hidden="true"></i>
            </button> 
        </div>

        <Resizebutton bind:resize={resize} visible={ full === 100 ? false : true}/>    
    </div>

    

    <div id="tableu" class="table" bind:offsetHeight={offset} bind:clientWidth={width}
        bind:clientHeight={height} style:--full={full + "vw"}>

        {#each stacks as stack, i}
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div id="st{i}" onclick={() => stackClick(i)}  style:--size={full/100*cardSize + "vw"} class="unselectable stack" 
                style="left: {stack.x*width/100.0}px; top: {stack.y*width/100.0}px"></div>
            {#each stacks[i].cards as card, j}
                <Card left={card.x*width/100} top={card.y*width/100} id={card.id}
                    start={innDrag} end={dropped} inDrag={card.inDrag} index={card.z} size={full/100*cardSize}
                    click={clicked} dir={stacks[i].dir} numInDrag={numInDrag} front={card.front}
                    enabled={card.enabled} deck={deck}/>
            {/each}      
        {/each}
        {#if isVisible}
            <!--{#each stacks as stack, i}
            {#each stacks[i].cards as card, j} x={[0.25, 3]} y={[0, 0.25]} x={[-1.5, 1.5]} y={[0.0, 1.5]}
                <div class="mover" style="left: {card.x*width/100}px; top: {card.y*width/100}px">-->
                    <Confetti amount={52} fallDistance="200px" infinite cone size={50} xSpread={0.1} y={[0.0, 1.5]} colorArray={["url(cards/club.svg)", "url(cards/heart.svg)", "url(cards/spade.svg)", "url(diamond/club.svg)"]}/>
                <!--/div>
            {/each}
            {/each}-->           
        {/if}
    </div>

    <div class={name === "meditators" ? 'control' : 'hide'} bind:clientWidth={ctrlW}>
        <!--span style="width: 5.5rem;">{'tries: ' + game.tries}</span>
        <span style="width: 5.5rem;">{'id: ' + game.id}</span-->
        <div class="test">
            <select class="ctrl-button action-button" bind:value={selected} onchange={gameByLimits} style="float:left">
                <option value="32-40">Siirtoja 32-40</option>
                <option value="41-45">Siirtoja 41-45</option>
                <option value="46-50">Siirtoja 46-50</option>
                <option value="51-60">Siirtoja 51-60</option>
                <option value="61-99">Siirtoja yli 60</option>
                <option value="">Kaikki määrät</option>
            </select>
            <span style="display:inline-block;">&nbsp;&nbsp;Jako:</span>
            <input class="ctrl-button action-button" bind:value={gameId} onchange={gameById} inputmode="numeric"
                id="gameid" minlength="4" maxlength="8" size="5" min="0" max={game.maxId}/>
            <button class="ctrl-button action-button" onclick={(e) => tip(e)}>Vinkki ({tips})</button>
        </div>    
    </div>

</div>

{#if loading}
	<Loading size={ctrlW}/>
{/if}
<!--button onclick={debug}>Debug</button-->

<style>
    .mover {
        position: absolute;
    }
    .wrapper {
        display: grid;
        align-items: center;
        justify-content: center;
    }
    .table {
        position: relative;
        background: #006400; /*#35654d; linear-gradient(250deg, rgb(75, 180, 34), green);*/
        display: flex;
        flex-direction: column;
        --full: 100vw;
        width: var(--full);
        height: calc(0.77*var(--full));
        justify-content: center;
        align-items: center;
        touch-action: none;
        overflow: visible;
    }
    .stack {        
        --size: 10vw;
        --xxx: 0;
        border-radius: calc(0.1*var(--size));
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
        background: rgb(65, 141, 30);
    }
    .ctrl-button {
        /*background-color: rgb(39, 128, 39);
        border-radius: 50%;
        width: 2.5rem;
        height: 2.5rem;
        border: 0.2rem solid black;
        color: black;
        padding: 0.0rem;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 1.3rem;*/
        /*margin: 4px 2px;*/
        background-color: #108f10;
        border-radius: 50%;
        color: black;
        border: none;
        padding: 0px;
        font-size: 1.3rem;
        text-align: center;
        height: 2rem;
        width: 2rem;
        box-shadow: 0 2px 4px #313131;
        cursor: pointer;
        transition: all 0.1s ease;
        margin: 5px;
    }
    .ctrl-button:active {
        /*background-color: #48abe0;*/
        box-shadow: 0 0 2px darkslategray;
        transform: translateY(0.05rem);
    }
    .ctrl-button.action-button {
        border-radius: 5%;
        width: auto;
        height: 1.5rem;
        padding-left: 0.5rem;
        padding-right: 0.5rem;
        font-size: 1rem;
        border: 0.0rem solid black;
    }
    input:focus {
        outline: none !important;
        background-color: rgb(28, 168, 35);
        border: 1rem solid black;
    }
    .ctrl-button:focus {
        outline: none !important;
    }
    .test {
        max-width: max-content;
        margin-inline: auto;
    }
    .test2 {
        max-width: max-content;
        margin-inline-end: 2rem;
    }
    button {
        user-select: none;
    }
    .hide {
        display: none;
    }
    
</style>


