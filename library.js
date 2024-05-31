/**
 * 
 * @returns {Element}
 */
function get_ctn_library() {
    return document.getElementById("ctn_library").getElementsByClassName("ctn_list")[0];
}

/**
 * 
 * @param {Element} element 
 */
function set_ctn_library(stream_element) {
}

function load() {
    var json_url = "https://script.google.com/macros/s/AKfycbwPZA9z-A68ODfDnebxZ_-aY7ykEd2qKv6bsO9E9u-dlXAOt_gObbQz0gLTxUUxfg-N8g/exec";

    $.getJSON(json_url, (json) => {
        var streams = json.map(function (json_stream) {
            var songs = json_stream.songs.map(function (json_song) {
                return new Song(json_song.start_time, json_song.end_time, json_stream.stream_title, json_stream.stream_url, json_song.song_title)
            })
            return new Stream(json_stream.stream_title, json_stream.stream_url, json_stream.stream_date, songs)
        })
        streams.forEach(stream =>get_ctn_library().append(stream.to_element()))
    })
}