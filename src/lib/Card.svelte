<script>
    import { Tween } from 'svelte/motion';
	import { cubicOut, elasticIn, cubicIn, quadIn, sineInOut } from 'svelte/easing';

    let { left, top, id, start, end, inDrag, index, size, click, dir, numInDrag, front, enabled } = $props();
	
	let cardInDrag = false;
    let zIndex = $state(index);
	let shadow = $state(false);
	let shadowdown = $state(false);
	let shadowleft = $state(false);
	let dur = 300;
	let disabled =  $state(!enabled);
	let face =  $state(front);

    let progT = $state(new Tween(top));
	let progL = $state(new Tween(left));

	progT = new Tween(top, {duration: dur, easing: sineInOut});
	progL = new Tween(left, {duration: dur, easing: sineInOut});

	//console.log("id left top index inDrag:", id, left, top, index, inDrag);

	$effect(() => {
		progL.target = left;
		progT.target = top;

		//console.log("face:", face, id);
		let current = face;

		disabled = !enabled;
		face = front;
		
		if (current !== face)
			shadow = true;
		console.log("flipped face:", face, id);

		/*if (dir[0] < 0 && cardInDrag) 
			shadow = true;
		if (dir[0] > 0 && inDrag)
			shadow = true;

		if (dir[1] < 0 && cardInDrag) 
			shadow = true;
		
		shadowdown = (dir[0] < 0 && inDrag) ? true : false;
		shadowleft = (dir[1] < 0 && inDrag) ? true : false;

		if (dir[1] > 0 && inDrag)
			shadow = true;

		if (dir[0] == 0 && dir[1] === 0 && inDrag)
			shadow = true;*/

		if (inDrag)
			shadow = true;	

		//shadow = (dir[1] > 0) ? true : false;

		if (shadow)
			setTimeout(() => shadow = false, 700);  

		zIndex = inDrag ? 100 + index : index;
		dur = inDrag ? 0 : 400;
		shadowW = 1 + (numInDrag-1)*Math.abs(dir[0])/10 - 0.04;
		shadowH = 1.3 + (numInDrag-1)*Math.abs(dir[1])/10 - 0.04;
		
		dirX = (dir[0] < 0) ? (numInDrag-1)/4 : 0;
		dirY = (dir[1] < 0) ? (numInDrag-1)/4 : 0;
		shadowW = (Math.abs(dir[0]) > 0) ? shadowW : 1;
		shadowH = (Math.abs(dir[1]) > 0) ? shadowH : 1.3;

		if (inDrag) {
			progL.set(left, { duration: 0});
			progT.set(top, { duration: 0});
		}
		//shadow = (Math.abs(progL.current - progL.target) < 1) ? true : false;
	});	

	function startDrag() {
		console.log("startDrag -------------------------------", id);
		cardInDrag = true;
		left = progL.current;
		top = progT.current;

		mouseMoveCounter = 0;

        if (inDrag)
            return;

		inDrag = true;

        start(id);
        
	}

	function stop(e) {

		if (inDrag && cardInDrag && mouseMoveCounter >= 3) {
		
			let elem = document.getElementById(id);
            let rect = elem.getBoundingClientRect();
			console.log("mouse up  --------------------", id);
			zIndex = index + 100;

            let pos = end(id, rect);
			shadow = true;
			//setTimeout(() => shadow = false, 1000);
			//progL.target = 500; //pos[0];	//progT.target = 500; //pos[1];
		}
		if (inDrag)
			console.log("inDrag stop ++++++++++++++++++++", id);
		inDrag = false;
		//shadow = true;
		//setTimeout(() => shadow = false, 1000);
        zIndex = index;
		cardInDrag = false;	
	}

	let mouseMoveCounter = 0;

	function move(e) {
		mouseMoveCounter++;
		//console.log("mouseMoveCounter:", mouseMoveCounter);
		if (inDrag) {
			left += e.movementX;
			top += e.movementY;
		}
    }

	function info(e) {
		//console.log("id----------------:", id);
		//console.log("mouseMoveCounter:", mouseMoveCounter);

		if ( mouseMoveCounter > 3) {
            return;
        }
		//inDrag = false;
		console.log("Clicked ----------------:", id);
		shadow = true;
		click(id);
    }

	let shadowW = $state(0);
	let shadowH = $state(0);

	let dirX = $state(0);
	let dirY = $state(0);
	
</script>

<svelte:window onpointermove={move} onpointerup={stop}/>

<!--img class="hidden" class:shadow style:--size={size/10 + "vw"} style:--width={shadowW}
	style:--height={shadowH} style:--dirx={dirX} draggable="false"
    style="left: {progL.current}px; top: {inDrag ? top : progT.current}px; z-index: {zIndex}"
    src="cards/shadow.svg" alt="shadow" /-->

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_missing_attribute -->
<!--img class="card" class:disabled class:flip={!face} class:back={!face} class:shadow class:shadowdown 
	class:shadowleft style:--size={size/10 + "vw"} draggable="false" id={id}
    onpointerup={stop} onpointerdown={startDrag} onclick={info}
    style="left: {progL.current}px; top: {inDrag ? top : progT.current}px; z-index: {zIndex}"
    src="cards/{(face) ? id[0] + id[1] : "Blue_Back"}.svg" /-->

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_missing_attribute -->
<!--img class="card" class:disabled class:flip={face} class:shadow class:shadowdown 
	class:shadowleft style:--size={size/10 + "vw"} draggable="false" id={id}
    onpointerup={stop} onpointerdown={startDrag} onclick={info}
    style="left: {progL.current}px; top: {inDrag ? top : progT.current}px; z-index: {zIndex}"
    src="cards/Blue_Back.svg" /-->

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="flip-card" class:disabled class:shadow class:shadowdown 
	class:shadowleft style:--size={size/10 + "vw"} draggable="false" id={id}
	onpointerup={stop} onpointerdown={startDrag} onclick={info}
	style="left: {progL.current}px; top: {inDrag ? top : progT.current}px; z-index: {zIndex}">
	<div class="flip-card-inner" class:flip={!face} class:flip-card-back={!face}>
		<div class="flip-card-front" >
			<img draggable="false" src="cards/{id[0] + id[1]}.svg" style:--size={size/10 + "vw"} alt="Avatar">
		</div>
		<div class="flip-card-back"  >
			<img draggable="false" src="cards/Blue_Back.svg" style:--size={size/10 + "vw"} alt="Avatar">
		</div>
	</div>
</div>

<style>
	.card {
		user-select: none;
		position: absolute;
		border: solid 0px gray;
		cursor: move;
        border-radius: calc(0.05 * var(--size));
		padding: 0em;
        margin: 0 0 0 0;
        --size: 10vw;
        width: var(--size);
        height: calc(1.3 * var(--size));
		background-color: transparent;
		/*clip-path: polygon(0% 0%, 100% 0%, 100% 210%, 0% 210%);
  		filter: drop-shadow(10px 10px 10px rgba(0, 0, 0, 0.9));*/
		transition: transform 0.7s;
		transform-style: preserve-3d;
		backface-visibility: hidden;
	}
	.back {
		transform: rotateY(180deg);
	}

	.flip {
		transform: rotateY(-180deg);
	}
	
	.shadowdown {
  		box-shadow: 0 20px 20px -10px #00000088;
	}
	.shadowleft {
  		box-shadow: 20px 0px 20px -10px #00000088;
	}
	.shadow {
		/*filter: drop-shadow(16px 16px 20px #000000aa);*/
		box-shadow: 20px 20px 20px #00000055;
		color: transparent;
	}
	.disabled {
        pointer-events: none;
    }

	.flip-card {
		background-color: transparent;
		position: absolute;
		user-select: none;
		--size: 10vw;
        width: var(--size);
        height: calc(1.3 * var(--size));
		perspective: 10cm;
	}

	.flip-card-inner {
		position: relative;
		width: 100%;
		height: 100%;
		text-align: center;
		transition: transform 0.5s;
		transform-style: preserve-3d;
		backface-visibility: hidden;
	}

	/*.flip-card-inner {
		transform: rotateY(180deg);
	}*/

	.flip-card-front, .flip-card-back {
		position: absolute;
		width: 100%;
		height: 100%;
		-webkit-backface-visibility: hidden;
		backface-visibility: hidden;
	}

	.flip-card-front {
		background-color: transparent;
	}

	.flip-card-back {
		background-color:transparent;
		transform: rotateY(-180deg);
	}

	img {
		--size: 10vw;
        width: var(--size);
        height: calc(1.3 * var(--size));
	}


	.hidden {
		visibility: hidden;	
	}
	.shadow2 {
		--width: var(--width);
		--height: var(--height);
		--offset: calc(0.15 * var(--size));
		visibility: visible;
		position: absolute;
		color: transparent;
		border: 0px solid;
		padding: 0px;
		margin-left: calc(-1*var(--dirx) * var(--size));
		border-radius: 0;
		box-shadow: var(--offset) var(--offset) var(--offset) #000000aa;
		width: calc(var(--width) * var(--size));
		height: calc(var(--height) * var(--size)); /*calc(1.3 * var(--size));*/
		/*transform: scale(1.3, 1);*/
	}
	/*.shadow + .shadow {
  		transform: scale(2);
	}*/
</style>