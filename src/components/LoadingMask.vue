<template>
    <div class="LoadingMask">
        <video src="loading.mp4" autoplay loop muted></video>
        <p>Loading...</p>
    </div>
</template>

<script>
export default {
    name: 'LoadingMask'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.LoadingMask {
    position: fixed;
    inset: 0;
    background-image: linear-gradient(#dfdfdd, #26627c);
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}

video {
    max-width: 20rem;
    height: auto;
    border-radius: 10rem;
    mask-image: radial-gradient(circle, rgba(0, 0, 0, 1) 60%, rgba(0, 0, 0, 0) 80%);
    -webkit-mask-image: radial-gradient(circle, rgba(0, 0, 0, 1) 60%, rgba(0, 0, 0, 0) 80%);
}
</style>