<script>
    import { Tween } from 'svelte/motion';
	import { cubicOut, elasticIn, cubicIn, quadIn, sineInOut, linear } from 'svelte/easing';

    let { left, top, id, start, end, inDrag, index, size, click, dir, numInDrag, front, enabled, deck } = $props();
	
	let cardInDrag = false;
    let zIndex = $state(index);
	let shadow = $state(false);
	let shadowdown = $state(false);
	let shadowleft = $state(false);
	let dur = 200;
	let disabled =  $state(!enabled);
	let face =  $state(front);

    let progT = $state(new Tween(top));
	let progL = $state(new Tween(left));

	progT = new Tween(top, {duration: dur, easing: cubicOut});
	progL = new Tween(left, {duration: dur, easing: sineInOut});

	//console.log("id left top index inDrag:", id, left, top, index, inDrag);

	$effect(() => {
		progL.target = left;
		progT.target = top;

		//console.log("face:", face, id);
		let current = face;

		disabled = !enabled;
		face = front;
		
		//if (current !== face)
		//	shadow = true;

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
		//dur = inDrag ? 0 : 300;
		shadowW = 1 + (numInDrag-1)*Math.abs(dir[0])/10 - 0.04;
		shadowH = 1.3 + (numInDrag-1)*Math.abs(dir[1])/10 - 0.04;
		
		dirX = (dir[0] < 0) ? (numInDrag-1)/4 : 0;
		dirY = (dir[1] < 0) ? (numInDrag-1)/4 : 0;
		shadowW = (Math.abs(dir[0]) > 0) ? shadowW : 1;
		shadowH = (Math.abs(dir[1]) > 0) ? shadowH : 1.3;

		//console.log("Effect numInDrag - zIndex:", id, numInDrag, zIndex);
		//console.log("Effect inDrag ---------------:", inDrag);

		if (inDrag) {
			progL.set(left, { duration: 0});
			progT.set(top, { duration: 0});
		}

		//console.log("Effect ----------------:", id, zIndex);
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

		if (inDrag && cardInDrag && mouseMoveCounter > maxMoves) {
		
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
			console.log("inDrag stop ++++++++++++++++++++", id, zIndex);
		inDrag = false;
		//shadow = true;
		//setTimeout(() => shadow = false, 1000);
        zIndex = index;
		cardInDrag = false;	
	}

	let mouseMoveCounter = $state(0);
	const maxMoves = 7;

	function move(e) {
		mouseMoveCounter++;
		//console.log("mouseMoveCounter:", mouseMoveCounter);
		if (inDrag) {
			left += e.movementX;
			top += e.movementY;
		}
    }
	
	function clicked(e) {
		//console.log("id----------------:", id);
		console.log("mouseMoveCounter:", mouseMoveCounter);

		if ( mouseMoveCounter > maxMoves) {
			mouseMoveCounter = 0;
            return;
        }
		//inDrag = false;
		zIndex += 200; 
		shadow = true;
		console.log("Clicked ----------------:", id, zIndex);
		click(id);
    }

	let shadowW = $state(0);
	let shadowH = $state(0);

	let dirX = $state(0);
	let dirY = $state(0);

	let imgSrc = ['c', 'd', 'h', 's'].includes(id[1]) ? `cards/${id[0] + id[1]}.svg` : `number-cards/${id}.svg`;
	//console.log(imgSrc);
	
	// sed -i '6 a \   preserveAspectRatio="none"' *.svg
	
</script>

<svelte:window onpointermove={move} onpointerup={stop} />

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="flip-card unselectable" class:disabled class:shadowdown class:shadow
	class:shadowleft style:--size={size + "vw"} draggable="false" id={id}
	onpointerup={stop} onpointerdown={startDrag} onclick={clicked}
	style="left: {progL.current}px; top: {inDrag ? top : progT.current}px; z-index: {zIndex}">
	<div class="flip-card-inner" class:flip={!face} class:flip-card-back={!face}>
		<div class="flip-card-front" >
			<!-- svelte-ignore a11y_missing_attribute -->
			<img class="unselectable" draggable="false" src="{deck}/{id[0] + id[1]}.svg" style:--size={size + "vw"}  >
		</div>
		<div class="flip-card-back"  >
			<!-- svelte-ignore a11y_missing_attribute -->
			<img class="unselectable" draggable="false" src="{deck}/back.svg" style:--size={size + "vw"} >
		</div>
	</div>
</div>

<style>

	.flip {
		transform: rotateY(180deg);
	}

	.disabled {
        pointer-events: none;
    }

	.flip-card {
		background-color: transparent;
		position: absolute;
		user-select: none;
		--size: 10vw;
        width: calc(1.0 * var(--size));
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
		transform: rotateY(-180deg) rotateZ(0deg);
	}

	img {
		--size: 10vw;
        width: calc(1.002 * var(--size));
        height: calc(1.3 * var(--size));
		border-radius: calc(0.03 * var(--size));
	}

	.shadowdown {
  		box-shadow: 0 20px 20px -10px #00000088;
	}

	.shadowleft {
  		box-shadow: 20px 0px 20px -10px #00000088;
	}
	.shadow {
		/*filter: drop-shadow(16px 16px 20px #000000aa);*/
		/*box-shadow: 20px 20px 20px #00000055;*/
		color: transparent;
		border-radius: calc(0.1 * var(--size));
		--shacolor: #00000055;
		/*filter: drop-shadow(20px 20px 20px var(--shacolor));*/
		box-shadow: 20px 20px 20px var(--shacolor);
		width: calc(0.98 * var(--size)); /* shadow problem */
		height: calc(1.3*0.98 * var(--size));
		/*position: absolute;
		z-index: -1000;*/
	}

    .unselectable {
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
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