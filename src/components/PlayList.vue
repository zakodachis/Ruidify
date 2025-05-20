<template>
    <div id="ctn_playlist">
        <div class="title">
            播放清單
            <div style="flex:1 1 0%"></div>
            <button @click="addRandomSong(10)">隨機10曲</button>
            <button @click="shufflePlaylist">隨機排序</button>
            <button @click="clearPlaylist">清除全部</button>
        </div>
        <div class="list">
            <transition-group @before-enter="onBeforeEnter" @before-leave="onBeforeLeave" @after-enter="onAfterEnter">
                <ComponentSong v-for="song in play_list" :key=song.serial :serial=song.serial
                    :song_title=song.song_title :start_time=song.start_time :end_time=song.end_time
                    :stream_title=song.stream_title :stream_date=song.stream_date :stream_url=song.stream_url
                    :removeable=true @removeSongFromPlaylist=removeSongFromPlaylist(song.serial) @playSong=playSong
                    :is_playing="song.serial === player_serial" />
            </transition-group>
        </div>
    </div>
</template>

<script>
import ComponentSong from './ComponentSong.vue';

export default {
    name: 'PlayList',
    components: {
        ComponentSong
    },
    data() {
        return {
            num_of_songs_added_this_tick: 0,
            num_of_songs_removd_this_tick: 0,
        }
    },
    props: {
        play_list: Object,
        player_serial: Number,
    },
    methods: {
        removeSongFromPlaylist(serial) {
            this.$emit('removeSongFromPlaylist', serial)
        },
        clearPlaylist() {
            this.$emit('clearPlaylist')
        },
        shufflePlaylist() {
            this.$emit('shufflePlaylist')
        },
        onBeforeEnter(el) {
            el.style.transitionDelay = `${this.num_of_songs_added_this_tick++ * 0.061}s`
            this.$nextTick(() => {
                this.num_of_songs_added_this_tick = 0;
                el.style.height = el.getBoundingClientRect().height;
            })
        },
        onBeforeLeave(el) {
            el.style.transitionDelay = `${this.num_of_songs_removd_this_tick++ * 0.0305}s`
            this.$nextTick(() => {
                this.num_of_songs_removd_this_tick = 0
                el.style.height = 0
            })
        },
        onAfterEnter(el) {
            el.style.transitionDelay = '0s'
        },
        playSong(arg) {
            this.$emit("playSong", arg)
        },
        addRandomSong(amount) {
            this.$emit("addRandomSong", amount)
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.title {
    padding: 1rem;
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: xx-large;
    color: rgba(255, 255, 255, 0.6);
    box-sizing: border-box;
}

.list {
    overflow-y: scroll;
    height: inherit;
    width: 100%;
}

.v-enter-active,
.v-leave-active {
    transition: all 0.61s;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
    transform: translateY(-100%);
}

.v-enter-to,
.v-leave-from {
    opacity: 100%;
    transform: translateY(0);
}

.v-move {
    transition: all 0.61s
}
</style>
