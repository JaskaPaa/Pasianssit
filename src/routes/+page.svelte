
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

    import InfoModal from '../lib/InfoModal.svelte';

    import Loading from '../lib/Loading.svelte';

    
    import Patience from '../lib/Patience.svelte';
	//import { _ } from '$env/static/private'; ????? mistä tullut

    let full = $state(60);

    let patience: Patience;

    let game = $state(null);

    let patName = $state("Mietiskelijän pasianssi");

    game = data.game;

    let name = $state("meditators");
    let deck = $state("mittelalter");

    let color = $state("#9ED485");
    let clickCount = $state(0);
    let dealText = $state("Uusi jako");
    let timeoutID = $state(undefined);
    let blink = $state("");

    const dealing = async () => {
        color = "#3C3";
        dealText = "Vahvista";
        clickCount += 1;
        blink = "blink-me";

        if (clickCount === 1) {
            timeoutID = setTimeout(function() {
                color = "#9ED485";
                clickCount = 0;
                dealText = "Uusi jako";
                blink = "";
            }, 2000);
        }

        if (clickCount > 1) {
            patience.deal2();
            color = "#9ED485";
            dealText = "Uusi jako";
            clickCount = 0;
            clearTimeout(timeoutID);
            blink = "";    
        }
    }

    $effect(() => {
        if (name === "meditators")
            patName = "Mietiskelijän pasianssi";
        if (name === "klondike")
            patName = "Klondike-pasianssi";
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

    function handleClick() {
        showModal = true;
        //modals.open(InfoModal, { name: "Jonkun pitäisi laittaa tähän peliohjeet yms." });
    }

    let showModal = $state(false);

</script>

<!--div class="topbar">{"-"}</div-->
<div class="wrap">
    <div class="gamebar">
        <button style="--color: {color}" onclick={() => dealing()} class="ctrl-button action-button"><span class={blink}>{dealText}</span></button>
        <!--button onclick={()=> full += 5 }>+</button>
        <button onclick={()=> full -= 5}>-</button-->
        <span class="patname">{patName}</span>
        <!-- svelte-ignore a11y_consider_explicit_label -->
        <button class="round" onclick={handleClick}><i class="fa-solid fa-info"></i></button>
        <span style="float:right"><Burger bind:patience={name} bind:deck={deck}></Burger></span>
    </div>

    <div class="pats">
        <Patience bind:this={patience} name={name} full={full} deck={deck}/>
    </div>
</div>

<InfoModal bind:showModal name={name}></InfoModal>

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
    .ctrl-button {
        display: inline-block;
        background-color: var(--color, rgb(158, 212, 133));
        /*background-color: rgb(158, 212, 133);*/
        border-radius: 50%;
        color: black;
        border: none;
        padding: 0px;
        font-size: 1.3rem;
        text-align: center;
        height: 2rem;
        min-width: 6rem;
        box-shadow: 0 2px 4px #313131;
        cursor: pointer;
        transition: all 0.1s ease;
        margin: 5px;
    }
    
    .ctrl-button:active {
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

    @keyframes blink {
        0% {
            opacity: 1;
        }

        50% {
            opacity: 0;
        }

        100% {
            opacity: 1;
        }
    }

    .blink-me {
        animation: blink 1s infinite;
    }
   
</style>