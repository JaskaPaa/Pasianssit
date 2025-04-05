<script lang='ts'>

    export let toggle = true;
    
</script>

<svg class="hamburger" class:is-opened={toggle}>
    <line x1="0" y1="50%" x2="100%" y2="50%" class="hamburger__bar hamburger__bar--top" />
    <line x1="0" y1="50%" x2="100%" y2="50%" class="hamburger__bar hamburger__bar--mid" />
    <line x1="0" y1="50%" x2="100%" y2="50%" class="hamburger__bar hamburger__bar--bot" />
</svg>

<style>

.hamburger {
    width: 1.5rem;
    height: 1.5rem;
}

.hamburger__bar {
    transition-property: all;
    transition-duration: 0.5s;
    transform-origin: center;
    stroke: currentColor;
    stroke-width: 10%;
}

.hamburger__bar--top {
    transform: translateY(-40%);
}

.hamburger__bar--bot {
    transform: translateY(40%);
}

.is-opened .hamburger__bar--top {
    transform: rotate(45deg);
    rotate: 1turn;
}

.is-opened .hamburger__bar--mid {
    transform: scaleX(0.1);
}

.is-opened .hamburger__bar--bot {
    transform: rotate(-45deg);
    rotate: 1turn;
}
</style>

