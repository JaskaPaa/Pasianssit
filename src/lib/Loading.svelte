
<script lang="ts">
    let { size } = $props();
</script>

<!--div class="wrap">
    <div class="waviy">
        <span style="--i:1">L</span>
        <span style="--i:2">a</span>
        <span style="--i:3">t</span>
        <span style="--i:4">a</span>
        <span style="--i:5">a</span>
        <span style="--i:6">.</span>
        <span style="--i:7">.</span>
        <span style="--i:8">.</span>
    </div>
</div-->
<div class="wrap">
    <!-- svelte-ignore a11y_missing_attribute -->
    <!--div class="loader"><img src="cards/suits2.svg" /></div-->
    <!-- svelte-ignore a11y_missing_attribute -->
</div>
<!-- svelte-ignore a11y_missing_attribute -->
<!--img class="loader" src="cards/suits2.svg" /-->

<!-- svelte-ignore a11y_missing_attribute -->
<img class="loader club" style:--size={size + "vw"} src="cards/club.svg" />
<!-- svelte-ignore a11y_missing_attribute -->
<img class="loader diamond" style:--size={size + "vw"} src="cards/diamond.svg" />
<!-- svelte-ignore a11y_missing_attribute -->
<img class="loader heart" style:--size={size + "vw"} src="cards/heart.svg" />
<!-- svelte-ignore a11y_missing_attribute -->
<img class="loader spade" style:--size={size + "vw"} src="cards/spade.svg" />
<style>
    * {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
    }

    img {
        position: absolute;
        top: 0;
        left: 0;
        margin-top: -25px;
        margin-left: -25px;
        height: calc(1.3 * var(--size));
    }

    .wrap {
        background-color: transparent;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        /*position: absolute;*/
        left: 40vw;
        z-index: 1000;
    }
    @keyframes flip {
        0%,80% {
            transform: rotateY(360deg) 
        }
    }
    .loader {
        position: absolute;
        /*border: 5px solid white;
        border-radius: 50%;*/
        /*border-top: 25px solid #f3f3f3;*/
        background-color: none;/*rgb(137, 137, 248);*/
        width: 3vw;
        height: 3vw;
        height: calc(0.05 * var(--size));
        width: calc(0.05 * var(--size));
        /*-webkit-animation: spin2 2s linear infinite; /* Safari */
        /*animation: spin2 3s linear infinite;*/
        /*transform-origin:0%;*/
        margin: auto;
        top: calc(0.5 * var(--size));
        left: calc(50vw - 0.025 * var(--size));
        z-index: 2000;
        transform-origin: 50% calc(-0.1 * var(--size));
    }
    .club {
        /*transform-origin: 50% 0%;*/
        -webkit-animation: spin4 1s linear infinite; /* Safari */
        animation: spin4 1s linear infinite;
    }
    .diamond {
        /*transform-origin: 100% 50%;*/
        -webkit-animation: spin3 1s linear infinite; /* Safari */
        animation: spin3 1s linear infinite;
    }
    .heart {
        /*transform-origin: 0% 50%;*/
        -webkit-animation: spin 1s linear infinite; /* Safari */
        animation: spin 1s linear infinite;
    }
    .spade {
        /*transform: translate(300px, 20px);*/
        /*transform: rotate(0.25turn);
        transform-origin: 50% 100%;*/
        -webkit-animation: spin2 1s linear infinite; /* Safari */
        animation: spin2 1s linear infinite;        
    }
    /* Safari */
    @-webkit-keyframes spin {
        0% { -webkit-transform: rotate(0deg); }
        100% { -webkit-transform: rotate(360deg); }
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    @keyframes spin2 {
        0% { transform: rotate(45deg); }
        100% { transform: rotate(405deg); }
    }
    @keyframes spin3 {
        0% { transform: rotate(90deg); }
        100% { transform: rotate(450deg); }
    }
     @keyframes spin4 {
        0% { transform: rotate(135deg); }
        100% { transform: rotate(495deg); }
    }
</style>