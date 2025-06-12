
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
	//import { _ } from '$env/static/private'; ????? mistä tullut

    let full = $state(60);

    let patience: Patience;

    let game = $state(null);

    let patName = $state("Mietiskelijän pasianssi");

    game = data.game;

    let name = $state("meditators");

    const dealing = async () => {
        patience.deal2();
    }

    $effect(() => {
        if (name === "meditators")
            patName = "Mietiskelijän pasianssi";
        if (name === "klondike")
            patName = "Klondike pasianssi";
        if (name === "meditatorsorig")
            patName = "Mietiskelijän pasianssi";
    });

    //  id: 1286, length: 59 helppo ? testaa...    

    /*'san-felix': {
    '50': '#e9ffe0',
    '100': '#ccffbb',
    '200': '#9dff80',
    '300': '#5eff37',
    '400': '#27ff00',
    '500': '#06ff00',
    '600': '#00d305',
    '700': '#009f04',
    '800': '#007b00',
    '900': '#006400',
    '950': '#003b06',
    },*/

</script>

<!--div class="topbar">{"-"}</div-->
<div class="wrap">
    <div class="gamebar">
        <button onclick={() => dealing()}>Uusi jako</button>
        <!--button onclick={()=> full += 5 }>+</button>
        <button onclick={()=> full -= 5}>-</button-->
        <span class="patname">{patName}</span>
        <!-- svelte-ignore a11y_consider_explicit_label -->
        <button class="round" onclick={() => alert("Jonku pitäisi laittaa tähän peliohjeet yms.")}><i class="fa-solid fa-info"></i></button>
        <span style="float:right"><Burger bind:patience={name}></Burger></span>
    </div>

    <div class="pats">
        <Patience bind:this={patience} name={name} full={full}/>
    </div>
</div>

<style>
    :global(body) { 
        margin: 0; padding: 0;
        display: grid;
        justify-content: center;
        align-items: center;
        background: #006400;
    } 
    .wrap {
        margin: 0; padding: 0;
        display: grid;
        justify-content: center;
        align-items: center;
        background: #006400;
    }
    .topbar {
        display: block;
        width: 100%;
        background: rgb(158, 212, 133);
        font-size: larger;
        text-align: center;
    }
    .gamebar {
        display: block;
        padding-top: 0.5rem;
        width: 100%;
        align-items:baseline;
        float: left;
        /*justify-content: left;*/
        background: rgb(158, 212, 133);
    }
    .patname {
        font-size: larger;
        text-align: center;
    }
    .pats {
        display: flex;
        flex-direction: column;
    }
    .round {
        width: 1.5rem;
        border-radius: 50%;
        aspect-ratio: 1 / 1;
        height: 100%;
        padding: 0%;
        background: rgb(151, 170, 44);
        border: none;
    }

   
</style>