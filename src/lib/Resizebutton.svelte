
<script lang='ts'>

    let { resize = $bindable() } = $props();

    let started = false;

    function startDrag() {    
        started = true;
    }

    const move = (e) => {
        if (started) {
            console.log("Move:", e.movementX);
            resize = e.movementX;
        }
    }

    function endDrag() {    
        started = false;
    }




</script>

<svelte:window onpointermove={move} onpointerup={endDrag}/>

<button onpointerdown={startDrag} >
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <!--path d="M12 0l5 5-12 12-5-5v12h12l-5-5 12-12 5 5v-12h-12z" /-->
        <!--path d="M0 0h12 l-5 5 12 12 5 -5 v12h-12l5-5 -12 -12 -5 5z " fill={$gameBackground}/-->
        <line  opacity="0.6" stroke="blue" stroke-width="12%" x1="10%" y1="90%" x2="90%" y2="10%"/>
        <line  opacity="0.6" stroke="red" stroke-width="12%" x1="40%" y1="90%" x2="90%" y2="40%"/>
        <line  opacity="0.6" stroke="green" stroke-width="12%" x1="70%" y1="90%" x2="90%" y2="70%"/>
    </svg>
</button>


<style>
    button {
        width: 20px;
        margin-right: -10px;
        border-radius: 50%;
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