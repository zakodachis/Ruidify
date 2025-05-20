<template>
    <LoadingMask v-if="is_loading" />
    <BackGround />
    <VideoPlayer ref="player" :is_endless_random=is_endless_random @toggleEndlessRandom=toggleEndlessRandom
        @play_next_song=play_next_song @play_prev_song=play_prev_song />
    <PlayList :play_list=play_list :player_serial=player_serial @clearPlaylist=clearPlaylist
        @removeSongFromPlaylist=removeSongFromPlaylist @shufflePlaylist=shufflePlaylist @playSong=playSong
        @addRandomSong=addRandomSong />
    <SongLibrary :song_library=song_library @addSongToPlaylist=addSongToPlaylist @playSong=playSong />
</template>

<script>
import LoadingMask from './components/LoadingMask.vue'
import BackGround from './components/BackGround.vue'
import VideoPlayer from './components/VideoPlayer.vue'
import PlayList from './components/PlayList.vue'
import SongLibrary from './components/SongLibrary.vue'

export default {
    name: 'App',
    components: {
        LoadingMask,
        BackGround,
        VideoPlayer,
        PlayList,
        SongLibrary
    },
    data() {
        return {
            is_loading: false,
            is_endless_random: true,
            song_library: [],
            play_list: [],
            playlist_serial: 0,
            player_serial: 0,
        }
    },
    async mounted() {
        await this.getStreamList()
        this.parseUrlParams()
    },
    methods: {
        async getStreamList() {
            this.is_loading = true;
            this.song_library = [];

            const res = await fetch('https://script.google.com/macros/s/AKfycbwPZA9z-A68ODfDnebxZ_-aY7ykEd2qKv6bsO9E9u-dlXAOt_gObbQz0gLTxUUxfg-N8g/exec')
            .then((res) => {
                if (res.status != 200) {
                    throw new Error('Failed to fetch stream list')
                }
                return res.json()
            })

            this.is_loading = false;
            this.song_library = Array.from(res);
        },
        parseUrlParams() {
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);

            const playlist = urlParams.get('playlist')
            if (!playlist) return
            var result = playlist.match(/^random([0-9]*)$/)
            if (result) {
                var nums_of_song = parseInt(result[1])
                this.addRandomSong(nums_of_song)
            }
            result = playlist.match(/^([-A-Za-z0-9_]{11})$/)
            if (result) {
                // eslint-disable-next-line
                const stream = this.song_library.find((stream) => stream.stream_url.match(/youtu(?:.*\/v\/|.*v\=|\.be\/)([-A-Za-z0-9_]{11})/)[1] == result[1])
                if (!stream) return
                stream.songs.forEach((song) => {
                    this.addSongToPlaylist({ ...song, stream_title: stream.stream_title, stream_date: stream.stream_date, stream_url: stream.stream_url })
                })
            }
        },
        addSongToPlaylist(song) {
            this.play_list.push({ ...song, serial: ++this.playlist_serial })
        },
        removeSongFromPlaylist(serial) {
            const index = this.play_list.map(song => song.serial).indexOf(serial)
            this.play_list.splice(index, 1)
        },
        shufflePlaylist() {
            this.play_list.sort(() => Math.random() - 0.5)
        },
        clearPlaylist() {
            this.play_list = []
        },
        toggleEndlessRandom() {
            this.is_endless_random = !this.is_endless_random
        },
        playSong(song) {
            this.player_serial = song.serial
            const seconds_start = song.start_time.split(':').reverse().reduce((prev, curr, i) => prev + curr * Math.pow(60, i), 0)
            const seconds_end = song.end_time.split(':').reverse().reduce((prev, curr, i) => prev + curr * Math.pow(60, i), 0)
            this.$refs.player.play_song({
                video_start: seconds_start,
                video_end: seconds_end,
                video_id: song.stream_url.slice(-11),
                video_title: song.song_title,
            })
        },
        play_next_song() {
            //if endless random is off
            if (!this.is_endless_random) {
                //playlist is empty, do nothing
                if (!this.play_list.length) return
                //get current song index
                const index = this.play_list.map(song => song.serial).indexOf(this.player_serial)
                //play first song if current song is not in playlist (index = -1)
                //play first song if current song is last song in playlist (index = length - 1)
                //play next song otherwise (index not -1 and index not length - 1)
                const next_song = this.play_list[(index + 1) % this.play_list.length]
                this.playSong(next_song)
            }
            //if endless random is on
            else {
                //playlist is empty, add a random song and play it
                if (!this.play_list.length) {
                    this.addRandomSong(1)
                    const next_song = this.play_list[0]
                    this.playSong(next_song)
                    return
                }
                //get current song index
                const index = this.play_list.map(song => song.serial).indexOf(this.player_serial)
                //play first song if current song is not in playlist (index = -1)
                if (index == -1) {
                    const next_song = this.play_list[0]
                    this.playSong(next_song)
                    return
                }
                //add a random song if current song is last song in playlist (index = length - 1)
                else if (index == this.play_list.length - 1) {
                    this.addRandomSong(1)
                    const song = this.play_list[this.play_list.length - 1]
                    this.playSong(song)
                    return
                }
                //play next song otherwise (index not -1 and index not length - 1)
                else {
                    const next_song = this.play_list[index + 1]
                    this.playSong(next_song)
                }
            }
        },
        play_prev_song() {
            if (!this.play_list.length) return //playlist is empty, do nothing
            const index = this.play_list.map(song => song.serial).indexOf(this.player_serial)
            const song = this.play_list[(((index == -1) ? 0 : index) + this.play_list.length - 1) % this.play_list.length]
            this.playSong(song)
        },
        addRandomSong(amount) {
            var pool = this.song_library
                .map(stream => stream.songs
                    .map(song => {
                        return {
                            ...song,
                            stream_title: stream.stream_title,
                            stream_date: stream.stream_date,
                            stream_url: stream.stream_url
                        }
                    })
                ).flat()
            for (let i = 0; i < amount && pool.length > 0; i++) {
                const randomIndex = Math.floor(Math.random() * pool.length);
                this.addSongToPlaylist(pool[randomIndex]);
                pool.splice(randomIndex, 1);
            }
        },
    }
}
</script>

<style>
* {
    color: white;
}

html,
body {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
}

::-webkit-scrollbar {
    width: 0.5rem;
}

::-webkit-scrollbar-track {
    border: 1px;
    border-radius: 0.5rem;
    background-color: rgba(255, 255, 255, 0);
}

::-webkit-scrollbar-thumb {
    border-radius: 0.5rem;
    background-color: rgba(0, 0, 0, 0.20);
}

::-webkit-scrollbar-thumb:hover {
    border-radius: 0.5rem;
    background-color: rgba(0, 0, 0, 0.61);
}

#app {
    color: white;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    grid-template-rows: repeat(1, 1fr);
    column-gap: 1.5rem;
    height: -webkit-fill-available;
    padding: 2rem 3rem;
}

#app>div {
    flex-direction: column;
    height: inherit;
    overflow-y: hidden;
    display: flex;
}

@media(max-width:1000px) {
    #app {
        padding: 0;
        display: flex;
        flex-direction: row;
        overflow-x: scroll;
        scroll-snap-type: x mandatory;
    }

    #app>div {
        scroll-snap-align: center;
        width: 100vw;
        /*height: 100vh;*/
        flex-shrink: 0;
    }
}

.nowarp {
    text-wrap: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    margin: 0;
    height: 2.5rem;
    aspect-ratio: 1;
    border-width: 0.1rem;
    border-radius: 0.5rem;
    border-color: rgba(255, 255, 255, 0.5);
    background-color: rgba(0, 0, 0, 0.15);
    box-shadow: 1px 1px 3px 0px #0006;
}

button.activated {
    box-shadow: inset 2px 2px 4px 0px #0006;
}

button:hover {
    background-color: rgba(0, 0, 0, 0.2);
}

.ctn_button {
    display: flex;
    gap: 0.5em;
}
</style>