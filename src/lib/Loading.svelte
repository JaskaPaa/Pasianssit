
<script lang="ts">

    let { size } = $props();

    const degreeToRadian = (angle: number) => {
        return angle * (Math.PI / 180);
    };

    $effect(() => {
        radius = size/8;
    });

    let radius = $state(size/6);

    const suits = [
                    "club", "heart", "spade", "diamond",
                    "club", "heart", "spade", "diamond", 
                    "club", "heart", "spade", "diamond"
                ];

    const deltaAngle = 360 / suits.length;
    let currentAngle = -90;

    const transform = (i: number) => {
        const xPos = radius * Math.cos(degreeToRadian(currentAngle));
        const yPos = radius * Math.sin(degreeToRadian(currentAngle));

        const transform = `translate(${xPos}px, ${yPos}px)`;
        const rotate = `rotate(${(i * deltaAngle)}deg)`;

        currentAngle += deltaAngle;

        return `${transform} ${rotate}`;
    }

</script>

<div id='circle' style:--size={size + "px"}>
    {#each suits as suit, i}
		<!-- svelte-ignore a11y_missing_attribute -->
		<img src="cards/{suit}.svg" style="transform: {transform(i)}"/>
	{/each}
</div>

<style>

    #circle {
        position: absolute;
        animation: rotate-animation 2s infinite linear;
        background-color: none;
        height: 290px;
        width: 290px;
        margin: 0;
        top: calc(0.38 * var(--size));;
        left: 50vw;
        z-index: 2000;
        transform-origin: 0 0;
    }

    @keyframes rotate-animation {
        from { transform: rotate(0); }
        to { transform: rotate(360deg); }
    }

    img {
        position: absolute;
        top: 0;
        left: 0;
        margin-top: calc(-0.025 * var(--size));
        margin-left: calc(-0.025 * var(--size));
        height: calc(0.05 * var(--size));
        width: calc(0.05 * var(--size));
    }

    @keyframes flip {
        0%,80% {
            transform: rotateY(360deg) 
        }
    }

</style>