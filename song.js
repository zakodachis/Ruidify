class Song {
    /**
     * 
     * @param {string} song_title 
     * @param {string} stream_title 
     * @param {string} start_time 
     * @param {string} end_time 
     */
    constructor(start_time, end_time, stream_title, stream_url, song_title) {
        this.start_time = str_time_to_second(start_time);
        this.end_time = str_time_to_second(end_time);
        this.stream_title = stream_title;
        this.stream_url = stream_url;
        this.song_title = song_title;
    }
    /**
     * 
     * @returns {string}
     */
    get duration_time() {
        var dur = this.end_time - this.start_time
        return (dur / 60 | 0).toString().padStart(2, "0") + ":" + (dur % 60 | 0).toString().padStart(2, "0")
    }

    /**
     * 
     * @returns {string}
     */
    get stream_id(){
        return this.stream_url.match(/youtu(?:.*\/v\/|.*v\=|\.be\/)([A-Za-z0-9_\-]{11})/)[1]
    }

    /**
     * @param {string} template_type
     * @returns {Element}
     */
    to_element(template_type) {
        var element = document.createElement('div');
        element.innerHTML = `
        <div class="songtemplate">
            <div class="nowarp">
                <div class="nowarp song_title">${this.song_title}</div>
                <a class="nowarp">${this.stream_title}</a>
            </div>
            <div style="flex:1 1 0%"></div>
            <div class="time_label">${this.duration_time}</div>
            <div class="ctn_button"></div>
        </div>
        `
        element = element.firstElementChild

        var ctn_btn = element.getElementsByClassName("ctn_button")[0];

        if (template_type == "library") {
            /* add addone button */
            var btn_addlist = document.createElement('button');
            ctn_btn.append(btn_addlist);
            btn_addlist.innerText = "加入清單";
            btn_addlist.addEventListener("click", function () { Player.getInstance().add_to_playlist([this]) }.bind(this))

            /* add playnow button */
            var btn_playnow = document.createElement('button');
            ctn_btn.append(btn_playnow);
            btn_playnow.innerText = "播放";
            btn_playnow.addEventListener("click", function () { Player.getInstance().play_song(this) }.bind(this));
        }
        else if (template_type == "playlist") {
            /* add playnow button */
            var btn_playnow = document.createElement('button');
            ctn_btn.append(btn_playnow);
            btn_playnow.innerText = "播放";
            btn_playnow.addEventListener("click", function () { Player.getInstance().play_song(this, element) }.bind(this));
            /* add remove button */
            var btn_remove = document.createElement('button');
            ctn_btn.append(btn_remove);
            btn_remove.innerText = "清除";
            btn_remove.addEventListener("click", function () { Player.getInstance().remove_from_playlist(this, element) }.bind(this));
        }
        return element
    }
}

/**
 * 
 * @param {string} str_time 
 * @returns {number}
 */
function str_time_to_second(str_time) {
    return str_time.split(':').reverse().reduce((prev, curr, i) => prev + curr * Math.pow(60, i), 0)
}