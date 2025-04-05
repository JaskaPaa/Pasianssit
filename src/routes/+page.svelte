
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

    let game = $state(null);

    game = data.game;

    let name = $state("meditators");

    const dealing = async () => {
        patience.deal2();
    }

    const switchPat = async (n: string) => {
        //let pat = await loadPatience(name);

        if (n === "klondike") {
            name = "klondike";
        }

        if (n === "meditators") {
            name = "meditators";
        }

        if (n === "meditatorsorig") {
            name = "meditatorsorig";
        }
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
    <Patience bind:this={patience} name={name}/>
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