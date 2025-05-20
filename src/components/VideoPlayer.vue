<template>
    <div id="ctn_player">
        <YouTube id="ytplayer" src="mxdpi7IDOM4" key="player" ref="youtube" width="100%" height :vars="{
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            rel: 0,
            playsinline: 1
        }" @state-change="state_change" @error="on_error" @ready="on_ready" />
        <div id="playinfo" style="padding: 1rem;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="color: rgba(255, 255, 255, 0.6); font-size: xx-large;">現正播放</div>
                <div id="volume">
                    <div id="volume_value" style="width: 1rem; text-align: center;">{{ volumn }}</div>
                    <input id="volume_slider" type="range" v-model="volumn" style="width: 6rem" min="0" max="100"
                        step="1" />
                    <div id="volume_icon">🔈</div>
                </div>
            </div>
            <div class="title">{{ this.video_title }}</div>
            <div id="progressbar">
                <input id="progressbar_slider" type="range" style="width: 100%;" v-model="progress" :min="video_start"
                    :max="video_end" @input="progress_input" />
                <div class="time_label" style="left:0%;">
                    {{ `${(video_start <= this.progress && this.progress <= video_end) ? parseInt((this.progress -
                        video_start) / 60).toString().padStart(2, "0") : "00"}:${(video_start <= this.progress &&
                            this.progress <= video_end) ? parseInt((this.progress - video_start) %
                        60).toString().padStart(2, "0" ) : "00" }` }} </div>
                        <div class="time_label" style="left:100%; margin-left: -1.75rem;">{{ this.song_duration }}</div>
                </div>
                <div class="ctn_button">
                    <button @click="toggleEndlessRandom"
                        :class="is_endless_random ? 'activated' : ''">無限<br />隨機</button>
                    <button @click="toggle_repeat" :class="this.is_loop ? 'activated' : ''">重複<br />{{ (this.is_loop) ?
                        "開啟":"關閉"}}</button>
                    <button @click="play_prev_song">上首</button>
                    <button @click="toggle_play">{{ (this.is_playing) ? "暫停" : "播放" }}</button>
                    <button @click="play_next_song">下首</button>
                    <a :href="`https://youtu.be/${video_id}?t=${video_start}`" target="_blank"
                        @click="this.$refs.youtube.pauseVideo"><button>You<br>Tube</button></a>
                </div>
            </div>
        </div>
</template>

<script>
import YouTube from 'vue3-youtube';

export default {
    components: {
        YouTube
    },
    methods: {
        toggle_repeat() {
            this.is_loop = (this.is_loop + 1) % 2
        },
        state_change() {
            const youtube = this.$refs.youtube
            const state = youtube.getPlayerState()
            const [unstarted, ended, playing, paused, buffering, cued] = [-1, 0, 1, 2, 3, 5]

            if (state == this.state) return
            if (state == unstarted) return
            this.state = state

            if (state == ended) {
                this.on_ended()
            }
            else if (state == playing) {
                this.trigger_playing()
                youtube.unMute()
                youtube.setVolume(this.volumn)
            }
            else if (state == paused) {
                //if (this.is_playing) youtube.playVideo()
                this.is_playing = false
            }
            else if (state == buffering) {
                return
            }
            else if (state == cued) {
                return
            }
        },
        trigger_playing() {
            const youtube = this.$refs.youtube
            const playing = 1
            try {
                if (youtube.getPlayerState() == playing) {
                    this.progress = youtube.getCurrentTime()
                    if (this.progress > this.video_end) this.on_ended()
                    setTimeout(this.trigger_playing, 100);
                }
            }
            catch (error) {
                if (!(error instanceof TypeError)) console.error(error)
            }
        },
        on_error() {
            console.log("on_error")
            this.play_next_song()
        },
        on_ready() {
            this.$refs.youtube.playVideo()
        },
        onAutoplayBlocked() {
            console.error("autoplay_blocked")
        },
        on_ended() {
            if (this.is_loop)
                this.seek_to(this.video_start)
            else {
                this.play_next_song()
            }
        },
        progress_input(event) {
            this.seek_to(event.target.value)
        },
        seek_to(value) {
            this.$refs.youtube.seekTo(value)
        },
        toggle_play() {
            this.is_playing = !this.is_playing
            if (this.is_playing)
                this.$refs.youtube.playVideo()
            else
                this.$refs.youtube.pauseVideo()
        },
        play_next_song() {
            this.$emit("play_next_song")
        },

        play_prev_song() {
            this.$emit("play_prev_song")
        },
        play_song(song) {
            this.video_id = song.video_id,
                this.video_title = song.video_title
            this.video_start = song.video_start,
                this.video_end = song.video_end,
                this.is_playing = true
            this.$refs.youtube.loadVideoById({
                videoId: this.video_id,
                startSeconds: this.video_start,
                endSeconds: this.video_end,
            })
        },
        getStreamList() {
            this.$emit("getStreamList")
        },
        toggleEndlessRandom() {
            this.$emit('toggleEndlessRandom')
        },
    },
    data() {
        return {
            video_id: "mxdpi7IDOM4",
            video_title: "仗著",
            video_start: 0,
            video_end: 213,
            volumn: 50,
            progress: 0,
            state: -1,
            is_playing: 0,
            is_loop: 0,
        }
    },
    watch: {
        volumn(value) {
            this.$refs.youtube.setVolume(value);
        }
    },
    computed: {
        song_duration() {
            const dur = this.video_end - this.video_start
            return ((dur) / 60 | 0).toString().padStart(2, "0") + ":" + ((dur) % 60 | 0).toString().padStart(2, "0")
        }
    },
    props: {
        is_endless_random: Boolean,
    }
}
</script>

<style scoped>
#ytplayer {
    flex: auto;
    display: flex;
    width: 100%;
    height: -webkit-fill-available;
}

.title {
    margin: 0.5rem 0;
    font-size: x-large;
}

#progressbar {
    position: relative;
}

#progressbar>div {
    position: absolute;
}

#volume {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    gap: 0.5rem;
    color: rgba(255, 255, 255, 0.75);
}

.time_label {
    color: rgba(255, 255, 255, 0.75);
    font-size: medium;
}

.ctn_button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 1rem;
    margin-left: 2rem;
    margin-right: 2rem;
}

button {
    height: 3rem;
    gap: 1rem;
}
</style>
