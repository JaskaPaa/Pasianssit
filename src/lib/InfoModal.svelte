<script>
	let { showModal = $bindable(), name } = $props();

	let dialog = $state(); // HTMLDialogElement

	$effect(() => {
		if (showModal) dialog.showModal();
        dialog.scrollTop = 0;
	});
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<dialog
	bind:this={dialog}
	onclose={() => (showModal = false)}
	onclick={(e) => { if (e.target === dialog) dialog.close(); }}
	
>	
	<div class="sticky">
		<!-- svelte-ignore a11y_consider_explicit_label -->
		<button onclick={() => dialog.close()}><i class="fa-solid fa-xmark"></i></button>
	</div>
	<div class="content">
        {#if name === "meditators"}
	        <h2>Mietiskelijän pasianssi eli maailman vaikein pasianssi</h2>
            <p><b>Alkuperä</b></p>
            <p>
                Mietiskelijän pasianssi, toiselta nimeltään "maailman vaikein pasianssi", esitellään ainakin Ilmo Kurki-Suonion
                kirjassa "Pasianssit" vuodelta 1987. Tarkempaa tietoa alkuperästä ei ole.
            </p>
            <p><b>Säännöt</b></p>
            <p>Vain yhtä korttia voi siirtää kerrallaan.</p>
            <p>Seiskat menevät tyhjiin keskipinoihin, joiden päälle rakennetaan maan mukaan ylöspäin.</p>
            <p>Sivupinoihin rakennetaan vuorovärein alaspäin. Tyhjään sivupinoon käy vain ässä.</p>
            <p>Peli on läpi, kun kaikki kortit ovat keskipinoissaan.</p>
            <p><b>Ratkaisut</b></p>
            <p>
                Tässä olevat ratkaisut ovat satunnaisista jaoista tietokonealgoritmilla etsittyjä.
                Kaikki ovat siis mahdollisia ratkaista, vaikka jotkut ovat melkolailla epäinhimillisen vaikeita.
            </p>
            <p>
                Siirtomäärät näkyvät esimerkiksi muodossa "45/42", jolloin 42 on algoritmin ratkaisema siirtomäärä ja 45 pelaajan tekemät siirrot.
                Pelaajan ratkaisu <b>voi ylittää tai alittaa</b> algoritmilla ratkaistun siirtomäärän. Ratkaisut eivät siis ole välttämättä lyhyimpiä mahdollisia tai ainoita oikeita. 
            </p>
            <p>
                Pudotusvalikosta voi valita haluamansa siirtomäärän vaihteluvälin.
                Suurempi siirtomäärä on yleensä huomattavasti vaikeampi kuin pienempi.
                Yli 60 siirron ratkaisut sisältävät usein turhia siirtoja algoritmin
                hölmöilyn takia ja ovat monesti pelattavissa alle 60 siirron.
            </p>            
        {/if}

        {#if name === "meditatorsorig"}
	        <h2>Mietiskelijän pasianssi - alkuperäinen</h2>
        {/if}

        {#if name === "klondike"}
	        <h2>Klondike-pasianssi</h2>
        {/if}
		
	</div>
</dialog>

<style>
	dialog {
		max-width: 32em;
		border-radius: 0.2em;
		border: none;
		padding: 0;
        max-height: 80vh;
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
	.content {
		overflow-y: scroll;
	}

	button {
		float: right;
		top: 0;
	}
	.sticky {
		display: block;
		background-color: white;
		border-bottom: solid gray;
		position: sticky;
  		top: 0;
		height: 1rem;
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
	

</style>
