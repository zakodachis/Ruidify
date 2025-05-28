<template>
    <div id="ctn_library">
        <div class="title">
            歌曲庫
            <div style="flex:1 1 0%"></div>
            <button @click="openSearchModal">搜尋</button>
        </div>
        <div class="list">
            <ComponentStream v-for="(stream, index) in song_library" :key=index :stream_date=stream.stream_date
                :stream_title=stream.stream_title :stream_url=stream.stream_url :songs=stream.songs
                @addSongToPlaylist=addSongToPlaylist @playSong=playSong />
        </div>
    </div>
</template>

<script>
import ComponentStream from './ComponentStream.vue';

export default {
    name: 'LibraryModal',
    components: {
        ComponentStream
    },
    props: {
        song_library: Object
    },
    methods: {
        addSongToPlaylist(song) {
            this.$emit("addSongToPlaylist", song)
        },
        playSong(arg) {
            this.$emit("playSong", arg)
        },
        openSearchModal() {
            this.$emit("openSearchModal")
        }
    }
}
</script>


<style scoped>
#ctn_library {
    display: flex;
    flex-direction: column;
    height: inherit;
    position: absolute;
    height: 100%;
    width: 100%;
}

.title {
    padding: 1rem;
    width: 100%;
    display: flex;
    box-sizing: border-box;
    align-items: center;
    gap: 0.5rem;
    font-size: xx-large;
    color: rgba(255, 255, 255, 0.6);
}

.list {
    overflow-y: scroll;
    height: inherit;
    width: 100%;
}
</style>