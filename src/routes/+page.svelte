
<script lang="ts">
    import type { PageProps } from './$types';

    let { data }: PageProps = $props();

	//import { pushState } from '$app/navigation';
    import Card from '../lib/Card.svelte';
    import {Stack, value, suit, alt, type card} from './Stack.svelte';
    import {rectsIntersection, type state} from './utils';
    import {getStacks, getDeal, isReady, Meditators} from './meditators.svelte';
    import {Klondike} from './klondike';
    import {Meditators2} from './meditatorsorig';
    import {loadPatience} from './loader';
    import {History} from './History.svelte';
    import Burger from '$lib/Burger.svelte';

    
    import Patience from '../lib/Patience.svelte';

    let full = $state(100);

    let patience: Patience;

    let deal = $state(getDeal());

    let stacks: Stack[] = $state([]);

    let hist: History = $state(null);

    let game = $state(null);

    game = data.game;

    //stacks = getStacks();

    const dealing = async () => {   
        hist = new History();
        patience.deal2();
        //console.log("histooo:", hist);
    }

    const switchPat = async (name: string) => {
        //let pat = await loadPatience(name);

        if (name === "klondike") {
            deal = Klondike.deal;
            stacks = Klondike.stacks;
            hist = Klondike.history;
        }

        if (name === "meditators") {
            deal = Meditators.deal;
            stacks = Meditators.stacks;
            hist = Meditators.history;
            console.log("meditators hist:", hist);
        }

        if (name === "meditatorsorig") {
            deal = Meditators2.deal;
            stacks = Meditators2.stacks;
            hist = Meditators2.history;
        }

        console.log("loaded!");
        console.log("hist:", hist);

        //  id: 1286, length: 59 helppo ? testaa...
        
    }

    let burg = $state(false);

</script>

<div class="topbar">Mietiskelijän pasianssi</div>
<div class="topbar">
    <button onclick={() => dealing()}>Jaa</button>
    <button onclick={()=> switchPat("klondike")}>Klondike</button>
    <button onclick={()=> switchPat("meditators")}>Mietiskelijän</button>
    <button onclick={()=> switchPat("meditatorsorig")}>Mietiskelijän2</button>
    <button onclick={()=> full += 5 }>+</button>
    <button onclick={()=> full -= 5}>-</button>
    <button onclick={()=> burg = !burg }><Burger toggle={burg}></Burger></button>
</div>

<div class="pats">
    <Patience bind:this={patience} foo={stacks} boo={deal} goo={hist} />
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
    .pats {
        display: flex;
        flex-direction: column;
    }

   
</style>