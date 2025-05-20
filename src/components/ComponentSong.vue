<template>
    <transition>
        <div ref="content" class="songtemplate" :class="{ is_playing: is_playing }">
            <div class="nowarp">
                <span class="nowarp song_title">{{ song_title }}</span>
                <br>
                <span class="nowarp stream_title">{{ stream_title }}</span>
            </div>
            <div style="flex:1 1 0%"></div>
            <div class="time_label">{{ song_duration }}</div>
            <div class="ctn_button">
                <button v-if="appendable" @click="addToPlaylist">加入清單</button>
                <button @click="playSong">播放</button>
                <button v-if="removeable" @click="removeSongFromPlaylist">移除</button>
            </div>
        </div>
    </transition>
</template>

<script>



export default {
    name: 'SongTemplate',
    data() {
        return {
            height: 100
        }
    },
    props: {
        song_title: String,
        start_time: String,
        end_time: String,
        stream_title: String,
        stream_date: String,
        stream_url: String,
        appendable: Boolean,
        removeable: Boolean,
        serial: Number,
        is_playing: Boolean
    },
    computed: {
        song_duration() {
            try {
                const endtime = this.end_time.split(':').reverse().reduce((prev, curr, i) => prev + curr * Math.pow(60, i), 0)
                const starttime = this.start_time.split(':').reverse().reduce((prev, curr, i) => prev + curr * Math.pow(60, i), 0)
                const dur = endtime - starttime
                return (dur / 60 | 0).toString().padStart(2, "0") + ":" + (dur % 60 | 0).toString().padStart(2, "0")
            }
            catch {
                return 0
            }
        }
    },
    methods: {
        beforeEnter() {
            alert(0)
            this.$nextTick(() => {
                console.log(this.$refs.content)
                this.height = this.$refs.content.getBoundingClientRect().height;
            })
        },
        beforeLeave() {
            alert(0)
            this.height = 0;
        },
        addToPlaylist() {
            this.$emit('addSongToPlaylist', {
                song_title: this.song_title,
                start_time: this.start_time,
                end_time: this.end_time,
                stream_title: this.stream_title,
                stream_date: this.stream_date,
                stream_url: this.stream_url,
            })
        },
        removeSongFromPlaylist() {
            this.$emit('removeSongFromPlaylist', this.serial)
        },
        playSong() {
            this.$emit('playSong', {
                song_title: this.song_title,
                start_time: this.start_time,
                end_time: this.end_time,
                stream_title: this.stream_title,
                stream_date: this.stream_date,
                stream_url: this.stream_url,
                serial: this.serial
            })
        }
    }
}
</script>

<style scoped>
.songtemplate {
    transition: all 0.61s;
    padding-left: 1rem;
    padding-right: 0.5rem;
    align-items: center;
    height: 3.5rem;
    display: flex;
    gap: 0.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.4);
    overflow: hidden;
}

.songtemplate.is_playing {
    background-color: rgba(251, 203, 41, 0.3);
}

.songtemplate:hover {
    background-color: rgba(41, 202, 251, 0.3);
}

.stream_title,
.time_label {
    color: rgba(255, 255, 255, 0.4);
}

.v-enter-active,
.v-leave-active {
    transition: all 0.61s;
}
</style>