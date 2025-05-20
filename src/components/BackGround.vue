<template>
    <div class="background"></div>
</template>

<script>
export default {
    name: 'BackGround'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.background {
    position: fixed;
    inset: 0;
    background-image: linear-gradient(#dfdfdd, #26627c);
    z-index: -1;
}
</style>