<script lang='ts'>
    import { clickOutside } from "svelte-outside";
    
    let { patience = $bindable(),  deck = $bindable()} = $props();
    
    let toggle = $state(false);

    let checkmark = '&check;';

    let showMenu = () => {
        //console.log("toggle---:", toggle);
        
        let elem2 = document.getElementById("burger");
        let elem1 = document.getElementById("menu");
        if (elem2 && elem1) {     
            let rect2 = elem2.getBoundingClientRect();
            top = rect2.bottom;
            right = window.innerWidth - rect2.right;
            let rect1 = elem1.getBoundingClientRect();
        }        

    }

    let selectPat = (name: string) => {
        patience = name;
        toggle = !toggle;
    }

    let selectDeck = (selection: string) => {
        deck = selection;
        toggle = !toggle;
    }

    let top = $state(100);
    let right = $state(100);
    
    $effect(() => {        
        if (toggle)
            showMenu();
    });
    
    // Use this for a new deck of cards, if preserveAspectRatio="none" is missing from svg files:
    // sed -i '7i  \ \ \ preserveAspectRatio="none"' *.svg

</script>

<div class="wrap" use:clickOutside={(e) => toggle = false } >
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <svg onclick={()=> toggle = !toggle } id="burger" class="hamburger" class:is-opened={toggle}>
        <line x1="10%" y1="50%" x2="90%" y2="50%" class="hamburger__bar hamburger__bar--top" />
        <line x1="10%" y1="50%" x2="90%" y2="50%" class="hamburger__bar hamburger__bar--mid" />
        <line x1="10%" y1="50%" x2="90%" y2="50%" class="hamburger__bar hamburger__bar--bot" />
    </svg>

    <div class="menu" class:show={toggle} id="menu" style="right: {right}px; top: {top}px">
        <p><b>Pasianssit</b></p>
        <button onclick={() => selectPat("meditators")}>Mietiskelijän (ratkaistavissa)</button>
        <button onclick={() => selectPat("meditatorsorig")}>Mietiskelijän (satunnainen)</button>
        <button onclick={() => selectPat("klondike")}>Klondike (satunnainen)</button>
        <p><b>Pakat</b></p>
        <button onclick={() => selectDeck("anglo")}>Anglo {@html deck === "anglo" ? checkmark : ""}</button>
        <button onclick={() => selectDeck("clubkarte")}>Clubkarte {@html deck === "clubkarte" ? checkmark : ""}</button>        
        <button onclick={() => selectDeck("mittelalter")}>Mittelalter {@html deck === "mittelalter" ? checkmark : ""}</button>
        <button onclick={() => selectDeck("ornamental")}>Ornamental {@html deck === "ornamental" ? checkmark : ""}</button>
        <button onclick={() => selectDeck("tragy")}>Tragy {@html deck === "tragy" ? checkmark : ""}</button>
    </div>
</div>

<style>
    .wrap {
        right: 0;
        float: right;
    }
    .hamburger {
        width: 2.5rem;
        height: 2.5rem;
        position: relative;
        background: none;
    }

    .hamburger__bar {
        transition-property: all;
        transition-duration: 0.5s;
        transform-origin: center;
        stroke: rgb(44, 44, 44); /*currentColor;*/
        stroke-width: 15%;
        stroke-linecap: round;
    }

    .hamburger__bar--top {
        transform: translateY(-30%);
    }
    .hamburger__bar--mid {
        transform: translateY(0%);
    }
    .hamburger__bar--bot {
        transform: translateY(30%);
    }
    .is-opened {
        background-color: rgb(100, 200, 100);
    }
    .is-opened .hamburger__bar--top {
        transform: rotate(45deg);
        rotate: 1turn;
    }

    .is-opened .hamburger__bar--mid {
        transform: scaleX(0.1);
    }

    .is-opened .hamburger__bar--bot {
        transform: rotate(90deg) rotate(90deg) rotate(135deg);
        rotate: 1turn;
        animation: foo 1s;
    }

    .menu {
        /*--size: min(95vw, 400px);*/
        --shadow: calc(0.05 * var(--size));
        /*max-width: var(--size);*/
        display: none;
        background-color: rgb(100, 200, 100);
        /*border-radius: 0.5rem;*/
        border: 0rem solid gray;
        padding: 0%;
        position: absolute;
        /*left: 700px;*/ 
        /*top: 50px;*/ 
        /*transform: translateY(-30%);*/
        filter: drop-shadow(0 0 var(--shadow) gray);
        z-index: 1000;
    }

    button {
        background-color: rgb(40, 143, 14);
        border: 0;
        display: flex;
        font-size: 1.2em;
    }
    button:hover {
        background-color: rgb(65, 204, 10);
    }

    .show {
        display: grid;
    }

    @keyframes foo {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(315deg);
        }
    }
</style>

