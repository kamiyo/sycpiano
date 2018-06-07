import AUDIO_ACTIONS from 'src/components/Media/Music/actionTypeKeys';
import { MusicFileItem, MusicListItem } from 'src/components/Media/Music/types';

export interface SetHoverSeekring {
    readonly type: typeof AUDIO_ACTIONS.IS_HOVER_SEEKRING;
    readonly isHoverSeekring: boolean;
    readonly angle: number;
}

export interface SetMouseMove {
    readonly type: typeof AUDIO_ACTIONS.IS_MOUSE_MOVE;
    readonly isMouseMove: boolean;
}

export interface FetchPlaylistRequest {
    readonly type: typeof AUDIO_ACTIONS.FETCH_PLAYLIST_REQUEST;
}

export interface FetchPlaylistError {
    readonly type: typeof AUDIO_ACTIONS.FETCH_PLAYLIST_ERROR;
}

export interface FetchPlaylistSuccess {
    readonly type: typeof AUDIO_ACTIONS.FETCH_PLAYLIST_SUCCESS;
    readonly items: MusicListItem[];
    readonly flatItems: MusicFileItem[];
}

export interface OtherActions {
    readonly type: typeof AUDIO_ACTIONS.OTHER_ACTIONS;
}

type ActionTypes = SetHoverSeekring | SetMouseMove |
    FetchPlaylistError | FetchPlaylistRequest | FetchPlaylistSuccess |
    OtherActions;

export default ActionTypes;
