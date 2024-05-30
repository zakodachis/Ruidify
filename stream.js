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
     * @returns {Element}
     */
    to_element(){
        var element = document.createElement('div')
        element.innerHTML = `
        <div class="streamtemplate">
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
        
        var ctn_btn = element.getElementsByClassName("ctn_stream_title")[0].getElementsByClassName("ctn_button")[0];

        /* add addall button */
        var btn_addall = document.createElement('button');
        ctn_btn.append(btn_addall);
        btn_addall.innerText = "加入清單";
        btn_addall.addEventListener("click", function (){
            Player.getInstance().add_to_playlist(this.songs);
        }.bind(this))
        
        /* add toggle button */
        var btn_toggle = document.createElement('button');
        ctn_btn.append(btn_toggle);
        btn_toggle.innerText = "▼";
        btn_toggle.addEventListener("click", function (){
            ctn_stream_songlist.style.display = ctn_stream_songlist.style.display == '' ? 'none' : '';
            btn_toggle.style.rotate = ctn_stream_songlist.style.display == '' ? '' : '90deg';
        })

        var ctn_stream_songlist = element.getElementsByClassName("ctn_stream_songlist")[0];
        this.songs.forEach(song => ctn_stream_songlist.append(song.to_element("library")))

        return element;
    }
}