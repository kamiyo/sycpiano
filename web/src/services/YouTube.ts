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
    private player: YT.Player = undefined;
    private playerReady: Promise<{}> = undefined;
    private apiReady: Promise<{}> = undefined;

    constructor() {
        this.apiReady = new Promise((resolve) => {
            (window as any).onYouTubeIframeAPIReady = () => resolve();

            // load youtube api
            const body = document.body;
            const script = document.createElement('script');
            script.src = 'https://www.youtube.com/iframe_api';
            body.insertBefore(script, body.firstChild);
        });
    }

    public async executeWhenPlayerReady(func: () => void) {
        if (!this.playerReady) {
            throw new Error('initializePlayerOnElement must first be called before calling this function');
        }

        await this.playerReady;
        func();
    }

    public initializePlayerOnElement(el: HTMLElement, id = 'player') {
        // reinitiaize playerReady deferred
        this.playerReady = new Promise(async (resolve) => {
            await this.apiReady;

            // For now, only allow one player at a time.
            this.destroyPlayer();

            // element to be replace by iframe
            const div = document.createElement('div');
            div.id = id;
            el.appendChild(div);

            // create youtube player
            this.player = new YT.Player(id, {
                events: {
                    onReady: () => resolve(),
                },
                playerVars: {
                    autoplay: 0,
                    rel: 0,
                },
                videoId: undefined,
            });
        });
    }

    public async loadVideoById(videoId: string, autoplay?: boolean) {
        await this.playerReady;
        if (autoplay) {
            this.player.loadVideoById(videoId);
        } else {
            this.player.cueVideoById(videoId);
        }
    }

    public playVideo() {
        if (this.player.getPlayerState() === 5) {
            this.player.playVideo();
        } else {
            console.error('No video cued, please use loadVideoById');
        }
    }

    public getPlaylistItems() {
        return axios.get(PLAYLIST_ITEMS_URL, {
            params: {
                key: API_KEY,
                maxResults: MAX_PLAYLIST_ITEMS,
                part: 'id, snippet',
                playlistId: PLAYLIST_ID,
            },
        });
    }

    public getVideos(listOfIds: string[]) {
        return axios.get(VIDEOS_URL, {
            params: {
                id: listOfIds.join(','),
                key: API_KEY,
                part: 'id, contentDetails, statistics',
            },
        });
    }

    public destroyPlayer() {
        if (this.player) {
            this.player.destroy();
            this.player = null;
            this.playerReady = null;
        }
    }
}

const youTube = new YouTube();

export default youTube;
