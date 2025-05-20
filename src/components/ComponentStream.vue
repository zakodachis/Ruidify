<template>
    <div class="streamtemplate">
        <div class="ctn_stream_title" @click="toggle()">
            <div class="nowarp">{{ stream_title }}</div>
            <div style="flex:1 1 0%"></div>
            <div class="date_label">{{ stream_date }}</div>
            <div class="ctn_button">
                <button @click.stop="addStreamToPlaylist">加入清單</button>
                <button class="toggle_collapse" @click.stop="toggle()" :class="isExpand? 'activated':''">
                    <transition name="rotate">
                        <div class="btn_expand" :class="isExpand? '':'expanded'">▼</div>
                    </transition>
                </button>
            </div>
        </div>
        <transition @before-enter="beforeEnter" @before-leave="beforeLeave">
            <div class="ctn_stream_songlist" v-show="isExpand" :style="{height: `${height}px`}">
                <div ref="content">
                    <ComponentSong
                        v-for="(song, index) in songs"
                        :key=index
                        :song_title=song.song_title
                        :start_time=song.start_time
                        :end_time=song.end_time
                        :stream_title=stream_title
                        :appendable=true
                        @addSongToPlaylist=addSongToPlaylist
                        @playSong=playSong
                    />
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import ComponentSong from './ComponentSong.vue';

export default {
    name: 'App',
    components: {
        ComponentSong
    },
    props: {
        stream_title: String,
        stream_date: String,
        stream_url: String,
        songs: Object
    },
    data() {
        return {
            isExpand: false,
            height: 0
        }
    },
    methods: {
        toggle() {
            this.isExpand = !this.isExpand;
        },
        beforeEnter() {
            this.$nextTick(() => { 
                this.height = this.$refs.content.getBoundingClientRect().height;
            })
        },
        beforeLeave(){
            this.height = 0;
        },
        addSongToPlaylist(song){
            this.$emit('addSongToPlaylist',{
                ...song,
                stream_title: this.stream_title,
                stream_date: this.stream_date,
                stream_url: this.stream_url
            })
        },
        addStreamToPlaylist(){
            this.songs.forEach(song => this.addSongToPlaylist(song));
        },
        playSong(song){
            this.$emit("playSong", {
                ...song,
                stream_title: this.stream_title,
                stream_date: this.stream_date,
                stream_url: this.stream_url
            })
        }
    }
}


</script>



<style scoped>
.streamtemplate {
    padding-left: 1rem;
    padding-right: 0.5rem;
    align-items: center;
    gap: 0.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.4);
}

.ctn_stream_title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    height: 3.5rem;
}

.ctn_stream_songlist {
    background-color: rgba(48, 85, 185, 0.1);
    overflow: hidden;
}

.v-enter-active, .v-leave-active {
  transition: all 0.61s;
}

.v-enter-from, .v-leave-to {
    opacity: 0;
}

.v-enter-to, .v-leave-from {
    opacity: 1;
}

.btn_expand{
    transition: all 0.305s;
}

.btn_expand.expanded{
    rotate: -90deg
}

</style>