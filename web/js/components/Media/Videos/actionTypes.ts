import VIDEO_ACTIONS from 'js/components/Media/Videos/actionTypeKeys';
import { VideoItemShape } from 'js/components/Media/Videos/types';
import { OtherAction } from 'js/components/Press/actionTypes';

export interface FetchPlaylistRequest {
    type: VIDEO_ACTIONS.FETCH_PLAYLIST_REQUEST;
}

export interface FetchPlaylistSuccess {
    type: VIDEO_ACTIONS.FETCH_PLAYLIST_SUCCESS;
    videos: VideoItemShape[];
    videoId: string;
}

export interface FetchPlaylistError {
    type: VIDEO_ACTIONS.FETCH_PLAYLIST_ERROR;
}

export interface PlayItem {
    type: VIDEO_ACTIONS.PLAY_ITEM;
    videoId: string;
}

export interface TogglePlaylist {
    type: VIDEO_ACTIONS.TOGGLE_PLAYLIST;
    isShow: boolean;
}

export interface PlayerIsReady {
    type: VIDEO_ACTIONS.PLAYER_IS_READY;
}

export interface ResetPlayer {
    type: VIDEO_ACTIONS.RESET_PLAYER;
}

export interface OtherActions {
    type: VIDEO_ACTIONS.OTHER_ACTIONS;
}

type ActionTypes = FetchPlaylistError | FetchPlaylistRequest | FetchPlaylistSuccess |
                  PlayItem | TogglePlaylist | PlayerIsReady | ResetPlayer | OtherAction;

export default ActionTypes;
