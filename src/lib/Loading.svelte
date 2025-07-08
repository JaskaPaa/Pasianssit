
<script lang="ts">
    let { size } = $props();
</script>

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

    @keyframes flip {
        0%,80% {
            transform: rotateY(360deg) 
        }
    }
    .loader {
        position: absolute;
        height: calc(0.05 * var(--size));
        width: calc(0.05 * var(--size));
        margin: auto;
        top: calc(0.5 * var(--size));
        left: calc(50vw - 0.025 * var(--size));
        z-index: 2000;
        transform-origin: 50% calc(-0.1 * var(--size));
    }
    .heart {
        -webkit-animation: spin 1s linear infinite; /* Safari */
        animation: spin 1s linear infinite;
    }
    .diamond {
        -webkit-animation: spin3 1s linear infinite; /* Safari */
        animation: spin3 1s linear infinite;
    }
    .club {
        -webkit-animation: spin4 1s linear infinite; /* Safari */
        animation: spin4 1s linear infinite;
    }
    .diamond {
        -webkit-animation: spin3 1s linear infinite; /* Safari */
        animation: spin3 1s linear infinite;
    }    
    .spade {
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