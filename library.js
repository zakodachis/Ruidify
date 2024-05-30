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
    var json_url = "https://script.googleusercontent.com/macros/echo?user_content_key=9bNsqJLnOhey8-CARukPxeQQK6xnQ4rc2XdwSRFhN4WfIKVOPa8MCUyxwo2JxPVSwWnHDX9QLJCkRa8Qd0aF_k603NOyAOtbm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnIfyEo-5iq3MinW8At8E3PHnmgWORXCogGt02YGVoqJQlWeyRyB74HE8qwc8zgEChu09xm9DM23lUE3gEPvACMHJ_BMbj4xJd9z9Jw9Md8uu&lib=MRZoVmBZOgCzHDvRzFM1OMwWa-E8PuSjQ";

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