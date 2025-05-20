<template>
    <div ref="content">
        <transition>
            <div id="ctn_library" v-show="mode == 'library'" :style="{ height: `${height1}` }">
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
        </transition>
        <transition @before-enter="beforeEnter" @before-leave="beforeLeave" @transitionend="onAnimationend">
            <SearchModal v-show="mode == 'search'" ref="search_modal" :song_library=song_library
                :style="{ height: `${height2}` }" @addSongToPlaylist=addSongToPlaylist @playSong=playSong
                @closeSearchModal=closeSearchModal @animationend="onAnimationend" />
        </transition>
    </div>
</template>

<script>
import ComponentStream from './ComponentStream.vue';
import SearchModal from './SearchModal.vue'

export default {
    name: 'SongLibrary',
    components: {
        ComponentStream,
        SearchModal
    },
    data() {
        return {
            height1: '-webkit-fill-available',
            height2: 0,
            mode: "library"
        }
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
            this.mode = "search"
        },
        closeSearchModal() {
            this.mode = "library"
        },
        beforeEnter() {
            this.height1 = `${this.$refs.content.getBoundingClientRect().height}px`;
            this.height2 = '0px';
            this.$nextTick(() => {
                this.height1 = '0px';
                this.height2 = `${this.$refs.content.getBoundingClientRect().height}px`;
            })
        },
        beforeLeave() {
            this.height1 = '0px';
            this.height2 = `${this.$refs.content.getBoundingClientRect().height}px`
            this.$nextTick(() => {
                this.height1 = `${this.$refs.content.getBoundingClientRect().height}px`;
                this.height2 = '0px';
            })
        },
        onAnimationend() {
            this.height1 = this.height1 == '0px' ? '0px' : '-webkit-fill-available';
            this.height2 = this.height2 == '0px' ? '0px' : '-webkit-fill-available';
        }
    }
}
</script>


<style scoped>
#ctn_library {
    display: flex;
    flex-direction: column;
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

.v-enter-active,
.v-leave-active {
    transition: all 0.61s;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}

.v-enter-to,
.v-leave-from {
    opacity: 100%;
}
</style>