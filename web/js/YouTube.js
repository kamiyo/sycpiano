import axios from 'axios';

const API_KEY = 'AIzaSyBJm8pj4Ejqw8rHJVgk_0s6w1HlB6RfZ34';
const PLAYLIST_ID = 'PLzauXr_FKIlhzArviStMMK08Xc4iuS0n9';
const PLAYLIST_ITEMS_URL = 'https://www.googleapis.com/youtube/v3/playlistItems';
const MAX_PLAYLIST_ITEMS = 25;

export default class YouTube {
    constructor(onPlayerReady) {
        this.onPlayerReady = onPlayerReady;
        window.onYouTubeIframeAPIReady = this.onYouTubeIframeAPIReady.bind(this);
    }

    initializePlayerOnElement(el) {
        // element to be replace by iframe
        let div = document.createElement('div');
        div.id = 'player';
        el.appendChild(div);

        let body = document.body;
        let script = document.createElement('script');
        script.src = "https://www.youtube.com/iframe_api";
        body.insertBefore(script, body.firstChild);
    }

    onYouTubeIframeAPIReady() {
        this.player = new YT.Player('player', {
            playerVars: { 'autoplay': 0 },
            events: {
                'onReady': this.onPlayerReady,
                // 'onStateChange': onPlayerStateChange
            }
        });
    }

    loadVideoById(videoId, autoplay) {
        if (autoplay)
            this.player.loadVideoById(videoId);
        else
            this.player.cueVideoById(videoId);
    }

    getVideos() {
        return axios.get(PLAYLIST_ITEMS_URL, {
            params: {
                key: API_KEY,
                part: 'id, snippet',
                playlistId: PLAYLIST_ID,
                maxResults: MAX_PLAYLIST_ITEMS
            }
        });
    }
}