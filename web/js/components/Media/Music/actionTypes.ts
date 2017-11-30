import AUDIO_ACTIONS from 'js/components/Media/Music/actionTypeKeys';
import { MusicItem } from 'js/components/Media/Music/types';

export interface StoreRadii {
    type: AUDIO_ACTIONS.STORE_RADII;
    innerRadius: number;
    outerRadius: number;
}

export interface SetHoverSeekring {
    type: AUDIO_ACTIONS.IS_HOVER_SEEKRING;
    isHoverSeekring: boolean;
    angle: number;
}

export interface SetHoverPlaypause {
    type: AUDIO_ACTIONS.IS_HOVER_PLAYPAUSE;
    isHoverPlaypause: boolean;
}

export interface SetMouseMove {
    type: AUDIO_ACTIONS.IS_MOUSE_MOVE;
    isMouseMove: boolean;
}

export interface FetchPlaylistRequest {
    type: AUDIO_ACTIONS.FETCH_PLAYLIST_REQUEST;
}

export interface FetchPlaylistError {
    type: AUDIO_ACTIONS.FETCH_PLAYLIST_ERROR;
}

export interface FetchPlaylistSuccess {
    type: AUDIO_ACTIONS.FETCH_PLAYLIST_SUCCESS;
    items: MusicItem[];
}

export interface OtherActions {
    type: AUDIO_ACTIONS.OTHER_ACTIONS;
}

type ActionTypes = StoreRadii | SetHoverPlaypause | SetHoverSeekring | SetMouseMove |
                   FetchPlaylistError | FetchPlaylistRequest | FetchPlaylistSuccess |
                   OtherActions;

export default ActionTypes;
