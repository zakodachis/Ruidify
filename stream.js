class Stream {
    /**
     * 
     * @param {string} title 
     * @param {string} url 
     * @param {string} date 
     * @param {Song[]} songs 
     */
    constructor(title, url, date, songs) {
        this.title = title;
        this.url = url;
        this.date = date;
        this.songs = songs
    }

    /**
     * 
     * @returns {string}
     */
    get stream_id() {
        return this.url.match(/youtu(?:.*\/v\/|.*v\=|\.be\/)([A-Za-z0-9_\-]{11})/)[1]
    }

    /**
     * 
     * @returns {Element}
     */
    to_element() {
        var element = document.createElement('div')
        element.innerHTML = `
        <div class="streamtemplate collapse">
            <div class="ctn_stream_title">
                <div class="nowarp">${this.title}</div>
                <div style="flex:1 1 0%"></div>
                <div class="date_label">${this.date}</div>
                <div class="ctn_button">
                </div>
            </div>
            <div class="ctn_stream_songlist">
            </div>
        </div>
        `
        element = element.firstElementChild
        var ctn_stream_title = element.getElementsByClassName("ctn_stream_title")[0];
        var ctn_btn = ctn_stream_title.getElementsByClassName("ctn_button")[0];
        var ctn_stream_songlist = element.getElementsByClassName("ctn_stream_songlist")[0];


        /* add addall button */
        var btn_addall = document.createElement('button');
        ctn_btn.append(btn_addall);
        btn_addall.innerText = "加入清單";
        btn_addall.addEventListener("click", function () {
            Player.getInstance().add_to_playlist(this.songs);
        }.bind(this))

        /* add toggle button */
        var btn_toggle = document.createElement('button');
        ctn_btn.append(btn_toggle);
        btn_toggle.innerText = "▼";
        btn_toggle.classList.add("toggle_collapse")
        btn_toggle.addEventListener("click", function () {
            if (element.classList.contains("collapse")) element.classList.remove("collapse")
            else element.classList.add("collapse")
        })


        this.songs.forEach(song => ctn_stream_songlist.append(song.to_element("library")))

        return element;
    }
}