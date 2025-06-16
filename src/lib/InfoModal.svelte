<script>
	let { showModal = $bindable(), name } = $props();

	let dialog = $state(); // HTMLDialogElement

	$effect(() => {
		if (showModal) dialog.showModal();
	});
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<dialog
	bind:this={dialog}
	onclose={() => (showModal = false)}
	onclick={(e) => { if (e.target === dialog) dialog.close(); }}
>
	<div>
        {#if name === "meditators"}
	        <h2>Mietiskelijän pasianssi</h2>
            <p><b>Säännöt</b></p>
            <p>Vain yhtä korttia voi siirtää kerrallaan.</p>
            <p>Seiskat menevät tyhjiin keskipinoihin, joiden päälle rakennetaan maan mukaan ylöspäin.</p>
            <p>Sivupinoihin rakennetaan vuorovärein alaspäin. Tyhjään sivupinoon käy vain ässä.</p>
            <p>Peli on läpi, kun kaikki kortit ovat keskipinoissaan.</p>
            <p><b>Ratkaisut</b></p>
            <p>
                Ratkaisut ovat satunnaisista jaoista tietokonealgoritmilla etsittyjä.
                Siirtomäärät näkyvät esimerkiksi muodossa "45/42", jolloin 42 on algoritmin ratkaisema siirtomäärä ja 45 pelaajan tekemät siirrot.
                Algoritmin siirtomäärän <b>saa ylittää tai alittaa</b>. Ratkaisut eivät siis ole välttämättä lyhyimpiä mahdollisia. 
            </p>
            <p>
                Pudotusvalikosta voi valita haluamansa siirtomäärän vaihteluvälin.
                Suurempi siirtomäärä on yleensä huomattavasti vaikeampi kuin pienempi.
                Yli 60 siirron ratkaisut sisältävät usein turhia siirtoja algoritmin
                hölmöilyn takia ja ovat monesti pelattavissa alle 60 siirron.
            </p>
            <p><b>Alkuperä</b></p>
            <p>
                Pasianssi esitellään ainakin Ilmo Kurki-Suonion kirjassa "Pasianssit" vuodelta 1987. Tarkempaa tietoa alkuperästä ei ole.
            </p>
        {/if}
        {#if name === "meditatorsorig"}
	        <h2>Mietiskelijän pasianssi - alkuperäinen</h2>
        {/if}
        {#if name === "klondike"}
	        <h2>Klondike-pasianssi</h2>
        {/if}
		<!-- svelte-ignore a11y_autofocus -->
		<button autofocus onclick={() => dialog.close()}>Sulje</button>
	</div>
</dialog>

<style>
	dialog {
		max-width: 32em;
		border-radius: 0.2em;
		border: none;
		padding: 0;
	}
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.5);
	}
	dialog > div {
		padding: 1em;
	}
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	button {
		display: block;
	}
</style>
