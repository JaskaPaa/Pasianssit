
<script lang='ts'>

    let { resize = $bindable(), visible } = $props();

    let started = false;

    function startDrag() {    
        started = true;
    }

    const move = (e) => {
        if (started) {
            resize = e.movementX;
        }
    }

    function endDrag() {    
        started = false;
    }

</script>

<svelte:window onpointermove={move} onpointerup={endDrag}/>

{#if visible}
    <button onpointerdown={startDrag} >
        <!--i class="fa fa-forward" aria-hidden="true"></i-->
        <i class="fa-solid fa-left-right"></i>
        <!--i class="fa-solid fa-arrows-left-right-to-line"></i-->
    </button>
{/if}


<style>
    button {
        width: 24px;
        height: 24px;
        margin-right: -12px;
        border-radius: 50%;
        padding: 0%;
        background: rgb(159, 185, 13);
        border: none;
    }    
    /*button {
        position: absolute;
        border: none;
        background: none;
        margin: 0;
        padding: 0;
        border-radius: 0;
        line-height: 0; 
        cursor: nwse-resize;
    }
    button:active{
        background: none;
        cursor: nwse-resize;
    }*/
</style>