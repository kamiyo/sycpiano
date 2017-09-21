import Q from 'q';
import axios from 'axios';

const API_KEY = 'AIzaSyBJm8pj4Ejqw8rHJVgk_0s6w1HlB6RfZ34';
const PLAYLIST_ID = 'PLzauXr_FKIlhzArviStMMK08Xc4iuS0n9';

const YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3';
const PLAYLIST_ITEMS_URL = `${YOUTUBE_BASE_URL}/playlistItems`;
const VIDEOS_URL = `${YOUTUBE_BASE_URL}/videos`;
const MAX_PLAYLIST_ITEMS = 25;

/* NOTE: We might want to consider moving all properties on the YouTube class
** that don't need to be exposed to other modules into variables local to module. */

class YouTube {
    constructor() {
        this.apiReady = Q.defer();
        this.player = null;
        this.playerReady = null;

        window.onYouTubeIframeAPIReady = this.onYouTubeIframeAPIReady.bind(this);

        // load youtube api
        let body = document.body;
        let script = document.createElement('script');
        script.src = "https://www.youtube.com/iframe_api";
        body.insertBefore(script, body.firstChild);
    }

    onPlayerReady() {
        this.playerReady.resolve();
    }

    executeWhenPlayerReady(func) {
        if (!this.playerReady)
            throw "initializePlayerOnElement must first be called before calling this function";

        this.playerReady.promise.then(func);
    }

    initializePlayerOnElement(el, id = 'player') {
        // reinitiaize playerReady deferred
        this.playerReady = Q.defer();

        this.apiReady.promise.then(() => {
            // For now, only allow one player at a time.
            this.destroyPlayer();

            // element to be replace by iframe
            let div = document.createElement('div');
            div.id = id;
            el.appendChild(div);

            // create youtube player
            this.player = new YT.Player(id, {
                playerVars: { 'autoplay': 0 },
                events: {
                    'onReady': this.onPlayerReady.bind(this),
                    // 'onStateChange': onPlayerStateChange
                }
            });
        });
    }

    onYouTubeIframeAPIReady() {
        this.apiReady.resolve();
    }

    loadVideoById(videoId, autoplay) {
        this.playerReady.promise.then(() => {
            if (autoplay)
                this.player.loadVideoById(videoId);
            else
                this.player.cueVideoById(videoId);
        });
    }

    playVideo() {
        if (this.player.getPlayerState === 5) {
            this.player.playVideo();
        } else {
            console.error("No video cued, please use loadVideoById");
        }
    }

    getPlaylistItems() {
        return axios.get(PLAYLIST_ITEMS_URL, {
            params: {
                key: API_KEY,
                part: 'id, snippet',
                playlistId: PLAYLIST_ID,
                maxResults: MAX_PLAYLIST_ITEMS
            }
        });
    }

    //technically not needed; getPlaylistItems response already contains contentDetails and statistics
    getVideos(listOfIds) {
        return axios.get(VIDEOS_URL, {
            params: {
                key: API_KEY,
                part: 'id, contentDetails, statistics',
                id: listOfIds.join(',')
            }
        });
    }

    destroyPlayer() {
        if (this.player) {
            this.player.destroy();
            this.player = null;
            this.playerReady = null;
        }
    }
}

let youTube = new YouTube();

export default youTube;