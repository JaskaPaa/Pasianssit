

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
    <div class="loader"></div>
</div>

<style>
    * {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
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
    .waviy {
        position: relative;
    }
    .waviy span {
        background-color: #00000099;
        position: relative;
        display: inline-block;
        font-size: 4rem;
        color: white;
        text-transform: uppercase;
        animation: flip 1s infinite;
        animation-delay: calc(.2s * var(--i))
    }
    @keyframes flip {
        0%,80% {
            transform: rotateY(360deg) 
        }
    }
    .loader {
        position: absolute;
        border: 16px solid #f3f3f3;
        border-radius: 50%;
        border-top: 16px solid #3498db;
        width: 120px;
        height: 120px;
        -webkit-animation: spin 2s linear infinite; /* Safari */
        animation: spin 1s linear infinite;
        margin: auto;
        top: 30vh;
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
</style>