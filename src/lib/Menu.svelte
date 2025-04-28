<script lang='ts'>
    export let toggle = false;
    let dialog: HTMLDialogElement;
</script>

<dialog bind:this={dialog} id="confirmation-dialog">
	<button onclick={() => dialog.close()}>X</button>
    <h2><b> Haluatko lopettaa pelin? </b></h2>
    <p>Pelin lopetus paljastaa oikeat vastaukset, etkä voi enää yhdistää sanoja.</p>
    <button onclick={() => dialog.close()}>Jatka</button>
</dialog>

<style>
    dialog {
        --size: min(95vw, 400px);
        --shadow: calc(0.05 * var(--size));
        max-width: var(--size);
        border-radius: 0.5rem;
        border: 0rem solid gray;
        padding: 2%;
        position: absolute; 
        top: 30%; 
        transform: translateY(-30%);
        filter: drop-shadow(0 0 var(--shadow) gray);
    }
</style>
