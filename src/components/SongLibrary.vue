<template>
    <div style="position: relative">
        <transition name="library">
            <LibraryModal v-show="mode == 'library'" :song_library=song_library @addSongToPlaylist=addSongToPlaylist
                @playSong=playSong @openSearchModal=openSearchModal />
        </transition>
        <transition name="search">
            <SearchModal v-show="mode == 'search'" :song_library=song_library @addSongToPlaylist=addSongToPlaylist
                @playSong=playSong @closeSearchModal=closeSearchModal />
        </transition>
    </div>
</template>

<script>
import SearchModal from './SearchModal.vue'
import LibraryModal from './LibraryModal.vue';

export default {
    name: 'SongLibrary',
    components: {
        SearchModal,
        LibraryModal
    },
    data() {
        return {
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
        }
    }
}
</script>


<style scoped>
.library-enter-active,
.library-leave-active,
.search-enter-active,
.search-leave-active {
    transition: all 0.61s;
}

.library-enter-from,
.library-leave-to {
    opacity: 0%;
}

.library-enter-to,
.library-leave-from {
    opacity: 100%;
}

.search-enter-from,
.search-leave-to {
    opacity: 0;
    transform: translateY(100%);
}

.search-enter-to,
.search-leave-from {
    opacity: 100%;
    transform: translateY(0%);
}
</style>