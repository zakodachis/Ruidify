<template>
    <div id="ctn_search">
        <div class="title">
            找歌曲？
            <input v-model="query" />
            <button @click="closeModal">關閉</button>
        </div>
        <div class="list">
            <transition-group>
                <ComponentSong v-for="(song, index) in this.song_library
                    .map(stream => stream.songs
                        .map(song => {
                            return {
                                ...song,
                                stream_title: stream.stream_title,
                                stream_date: stream.stream_date,
                                stream_url: stream.stream_url
                            }
                        })
                    )
                    .flat()" :key=index :song_title=song.song_title :start_time=song.start_time :end_time=song.end_time
                    :stream_title=song.stream_title :stream_date=song.stream_date :stream_url=song.stream_url
                    :appendable=true v-show="this.query != '' && song.song_title.includes(this.query)"
                    @addSongToPlaylist=addSongToPlaylist @playSong=playSong />
            </transition-group>
        </div>
    </div>
</template>

<script>
import ComponentSong from './ComponentSong.vue';

export default {
    components: {
        ComponentSong
    },
    data() {
        return {
            query: "",
            song_array: []
        }
    },
    methods: {
        addSongToPlaylist(song) {
            this.$emit('addSongToPlaylist', song)
        },
        playSong(song) {
            this.$emit("playSong", song)
        },
        closeModal() {
            this.$emit("closeSearchModal")
        },
    },
    props: {
        song_library: Array
    }
}
</script>

<style scoped>
#ctn_search {
    display: flex;
    flex-direction: column;
    height: inherit;
    position: absolute;
    height: 100%;
    width: 100%;
}

.title {
    padding: 1rem;
    gap: 1rem;
    width: 100%;
    display: flex;
    align-items: center;
    font-size: xx-large;
    color: rgba(255, 255, 255, 0.6);
    box-sizing: border-box;
}

.list {
    overflow-y: scroll;
    height: inherit;
    width: 100%;
}

input {
    flex: 1 1 0%;
    height: 2rem;
    border-radius: 0.5rem;
    color: black;
    font-size: 16px;
}

.v-enter-active,
.v-leave-active {
    transition: all 0.61s;
}

.v-enter-from,
.v-leave-to {
    height: 0;
    opacity: 0;
}

.v-enter-to,
.v-leave-from {
    height: 3.5rem;
    opacity: 1;
}
</style>