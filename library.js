function library_query(query) {
    var ctn_library_list = document.getElementById("ctn_library").getElementsByClassName("ctn_list")[0]
    if (query == "") {
        ctn_library_list.classList.remove("quering")
        Array.from(ctn_library_list.getElementsByClassName("streamtemplate")).forEach((stream) => {
            Array.from(stream.getElementsByClassName("ctn_stream_songlist")[0].children).forEach((song) => {
                song.classList.remove("match")
            })
        })
    }
    else {
        ctn_library_list.classList.add("quering")
        Array.from(ctn_library_list.getElementsByClassName("streamtemplate")).forEach((stream) => {
            Array.from(stream.getElementsByClassName("ctn_stream_songlist")[0].children).forEach((song) => {
                if (song.getElementsByClassName("song_title")[0].innerHTML.includes(query))
                    song.classList.add("match")
                else
                    song.classList.remove("match")
            })
        })
    }
}