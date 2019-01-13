import VIDEO_ACTIONS from 'src/components/Media/Videos/actionTypeKeys';
import { VideoItemShape } from 'src/components/Media/Videos/types';

export interface FetchPlaylistRequest {
    readonly type: typeof VIDEO_ACTIONS.FETCH_PLAYLIST_REQUEST;
}

export interface FetchPlaylistSuccess {
    readonly type: typeof VIDEO_ACTIONS.FETCH_PLAYLIST_SUCCESS;
    readonly videos: VideoItemShape[];
    readonly videoId: string;
}

export interface FetchPlaylistError {
    readonly type: typeof VIDEO_ACTIONS.FETCH_PLAYLIST_ERROR;
}

export interface PlayItem {
    readonly type: typeof VIDEO_ACTIONS.PLAY_ITEM;
    readonly videoId: string;
}

export interface TogglePlaylist {
    readonly type: typeof VIDEO_ACTIONS.TOGGLE_PLAYLIST;
    readonly isShow: boolean;
}

export interface PlayerIsReady {
    readonly type: typeof VIDEO_ACTIONS.PLAYER_IS_READY;
}

export interface ResetPlayer {
    readonly type: typeof VIDEO_ACTIONS.RESET_PLAYER;
}

export interface OtherActions {
    readonly type: typeof VIDEO_ACTIONS.OTHER_ACTIONS;
}

type ActionTypes = FetchPlaylistError | FetchPlaylistRequest | FetchPlaylistSuccess |
                  PlayItem | TogglePlaylist | PlayerIsReady | ResetPlayer | OtherActions;

export default ActionTypes;
