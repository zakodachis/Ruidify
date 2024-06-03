class Player {
    static instance = null;

    /**
     * 
     * @returns {Player}
     */
    static getInstance() {
        if (!Player.instance) {
            Player.instance = new Player();
        }
        return Player.instance;
    }

    constructor() {
        if (Player.instance) throw new Error("This class is a Singleton!");
        this.playlist = []
        this.isReady = 0
        this.repeat = 0
        this.ctn_playlist_list = document.getElementById("ctn_playlist").getElementsByClassName("ctn_list")[0]
        document.getElementById("progressbar_slider").addEventListener("change", this.timeline_change.bind(this))
        document.getElementById("progressbar_slider").addEventListener("input", this.timeline_input.bind(this))
        document.getElementById("volume_slider").addEventListener("input", this.set_volume.bind(this))
    }

    onYouTubeIframeAPIReady() {
        this.ytplayer = new YT.Player('ytplayer', {
            width: "480",
            height: "270",
            videoId: "5uM9Vu3T8jg",
            playerVars: {
                autoplay: 0,
                controls: 1,
                disablekb: 1,
                fs: 0,
                rel: 0,
                playsinline: 1
            },
            events: {
                'onStateChange': this.onPlayerStateChange.bind(this)
            }
        });
    }

    /**
     * 
     * @param {Song[]} songs
     */
    add_to_playlist(songs) {
        songs.forEach(song => this.ctn_playlist_list.append(song.to_element("playlist")));
    }

    /**
     * 
     * @param {Song[]} songs
     * @param {Element} element 
     */
    remove_from_playlist(songs, element) {
        element.remove()
    }


    clear_playlist() {
        this.ctn_playlist_list.innerHTML = ""
        this.current_song_element = undefined
    }

    shuffle_playlist() {
        for (let i = this.ctn_playlist_list.children.length - 1; i > 0; i--) {
            this.ctn_playlist_list.appendChild(this.ctn_playlist_list.children[Math.random() * i | 0])
        }
    }

    /**
     * 
     * @param {Song} song
     * @param {Element} element
     */
    play_song(song, element) {
        this.isReady = 0;
        this.current_song = song;
        this.current_song_element = element;

        this.ytplayer.loadVideoById(song.stream_id)

        this.ui_refresh_playinfo();
        this.ui_refresh_playlist();
    }

    onPlayerStateChange() {
        if (this.isReady) {
            if (this.ytplayer.getPlayerState() == YT.PlayerState.PLAYING) {
                document.getElementById("pauseplay").innerHTML = "暫停"
                if (this.isReady) this.trigger_playing()
            }
            else {
                document.getElementById("pauseplay").innerHTML = "播放"
            }
        }
        else {
            if (this.ytplayer.getPlayerState() == YT.PlayerState.PLAYING) {
                this.ytplayer.seekTo(this.current_song.start_time)
                this.ytplayer.unMute()
                document.getElementById("volume_slider").value = this.ytplayer.getVolume()
                document.getElementById("volume_value").innerText = this.ytplayer.getVolume() | 0
                this.isReady = 1
            }
            else {
                if (!this.ytplayer.isMuted()) this.ytplayer.mute()
            }
        }
    }

    trigger_playing() {
        if (!this.isReady || !this.ytplayer) return
        if (this.ytplayer.getPlayerState() == YT.PlayerState.PLAYING) {
            this.timeline_checker()
            this.ui_update_progressbar()
            setTimeout(this.trigger_playing.bind(this), 100);
        }
    }


    timeline_input() {
        var p = document.getElementById("progressbar_slider").value;
        var t = (this.current_song.start_time * (100 - p) + this.current_song.end_time * p) / 100
        this.ytplayer.seekTo(t, false)
    }


    timeline_change() {
        var p = document.getElementById("progressbar_slider").value;
        var t = (this.current_song.start_time * (100 - p) + this.current_song.end_time * p) / 100
        this.ytplayer.seekTo(t).playVideo()
    }

    timeline_checker() {
        var t = this.ytplayer.getCurrentTime()
        if (t < this.current_song.start_time) {
            this.ytplayer.seekTo(this.current_song.start_time)
        }
        else if (t > this.current_song.end_time) {
            if (this.repeat)
                this.ytplayer.seekTo(this.current_song.start_time)
            else
                this.play_next_song()
        }
    }

    toggle_repeat() {
        this.repeat = !this.repeat
        document.getElementById("Repeat").innerText = this.repeat ? "重複開啟" : "重複關閉"
    }

    toggle_play() {
        if (this.current_song == undefined) this.play_next_song()
        else if (this.ytplayer.getPlayerState() == YT.PlayerState.PLAYING) this.ytplayer.pauseVideo()
        else if (this.ytplayer.getPlayerState() == YT.PlayerState.PAUSED) this.ytplayer.playVideo()
    }

    play_next_song() {
        if (this.current_song_element) {
            if (this.ctn_playlist_list.lastElementChild == this.current_song_element) {
                //reach last song, stop player
                this.ytplayer.pauseVideo()
            }
            else {
                //play next song
                var index = [...this.ctn_playlist_list.children].indexOf(this.current_song_element)
                this.ctn_playlist_list.children[index + 1].getElementsByTagName("button")[0].click()
            }
        }
        else if (this.ctn_playlist_list.childElementCount) {
            //playlist is not empty, play first song in playlist
            this.ctn_playlist_list.children[0].getElementsByTagName("button")[0].click()
        }
        else {
            //playlist is empty, stop player
            this.ytplayer.pauseVideo()
        }
    }

    play_prev_song() {
        if (this.current_song_element) {
            var index = [...this.ctn_playlist_list.children].indexOf(this.current_song_element)
            this.ctn_playlist_list.children[index ? index - 1 : index].getElementsByTagName("button")[0].click()
        }
        else if (this.ctn_playlist_list.childElementCount) {
            //playlist is not empty, play first song in playlist
            this.ctn_playlist_list.children[0].getElementsByTagName("button")[0].click()
        }
        else {
            //playlist is empty, stop player
            this.ytplayer.pauseVideo()
        }
    }

    set_volume() {
        this.ytplayer.setVolume(document.getElementById("volume_slider").value);
        document.getElementById("volume_value").innerText = document.getElementById("volume_slider").value | 0;
    }

    open_stream_url() {
        this.ytplayer.pauseVideo()
        if (this.current_song) window.open(this.current_song.stream_url + "&t=" + this.current_song.start_time + "s", '_blank');
    }


    ui_refresh_playlist() {
        [...this.ctn_playlist_list.children].forEach(
            element => {
                if (element == this.current_song_element)
                    element.classList.add("isplaying")
                else
                    element.classList.remove("isplaying")
            }
        )
    }

    ui_refresh_playinfo() {
        var playinfo = document.getElementById("playinfo");
        var title = playinfo.getElementsByClassName("title")[0];
        title.innerHTML = this.current_song.song_title
        document.getElementById("progressbar_end").innerHTML = this.current_song.duration_time
    }

    ui_update_progressbar() {
        var t = this.ytplayer.getCurrentTime()
        t -= this.current_song.start_time
        document.getElementById("progressbar_start").innerHTML = (t / 60 >> 0).toString().padStart(2, "0") + ":" + (t % 60 >> 0).toString().padStart(2, "0")
        document.getElementById("progressbar_slider").value = t / (this.current_song.end_time - this.current_song.start_time) * 100
    }
}

var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubeIframeAPIReady() {
    Player.getInstance().onYouTubeIframeAPIReady()
}
