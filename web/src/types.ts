import { AboutStateShape } from 'src/components/About/types';
import { AudioPlaylistStateShape } from 'src/components/Media/Music/types';
import { PhotoListReducerShape, PhotoViewerReducerShape } from 'src/components/Media/Photos/types';
import { VideoPlayerStateShape, VideoPlaylistStateShape } from 'src/components/Media/Videos/types';
import { AcclaimsListStateShape } from 'src/components/Press/types';
import { ScheduleStateShape } from 'src/components/Schedule/types';
import { SycStoreStateShape } from 'src/components/SycStore/types';

import { aboutReducer } from 'src/components/About/reducers';
import { audioPlaylistReducer } from 'src/components/Media/Music/reducers';
import { photoListReducer, photoViewerReducer } from 'src/components/Media/Photos/reducers';
import { videoPlayerReducer, videoPlaylistReducer } from 'src/components/Media/Videos/reducers';
import { acclaimsListReducer } from 'src/components/Press/reducers';
import { scheduleReducer } from 'src/components/Schedule/reducers';
import { sycStoreReducer } from 'src/components/SycStore/reducers';

import { Store } from 'redux';

import { NavBarStateShape } from 'src/components/App/NavBar/types';

export interface GlobalStateShape {
    readonly about?: AboutStateShape;
    readonly audio_playlist?: AudioPlaylistStateShape;
    readonly photo_list?: PhotoListReducerShape;
    readonly photo_viewer?: PhotoViewerReducerShape;
    readonly press_acclaimsList?: AcclaimsListStateShape;
    readonly schedule_eventItems?: ScheduleStateShape;
    readonly sycStore?: SycStoreStateShape;
    readonly video_player?: VideoPlayerStateShape;
    readonly video_playlist?: VideoPlaylistStateShape;
    readonly navbar: NavBarStateShape;
}

export type AnyReducerType = typeof aboutReducer | typeof audioPlaylistReducer |
    typeof photoListReducer | typeof photoViewerReducer | typeof acclaimsListReducer |
    typeof scheduleReducer | typeof videoPlayerReducer | typeof videoPlaylistReducer | typeof sycStoreReducer;

export interface Reducers {
    readonly about?: typeof aboutReducer;
    readonly audio_playlist?: typeof audioPlaylistReducer;
    readonly photo_list?: typeof photoListReducer;
    readonly photo_viewer?: typeof photoViewerReducer;
    readonly press_acclaimsList?: typeof acclaimsListReducer;
    readonly schedule_eventItems?: typeof scheduleReducer;
    readonly video_player?: typeof videoPlayerReducer;
    readonly video_playlist?: typeof videoPlaylistReducer;
    readonly sycStore?: typeof sycStoreReducer;
    readonly [key: string]: AnyReducerType;
}

export type AnyComponent = (new (props: any) => React.Component<any>) | React.FunctionComponent<any>;

export type AsyncStore = Store<GlobalStateShape | {}> & { async?: Reducers };

export interface AsyncModule {
    Component: AnyComponent;
    reducers?: {
        [key: string]: AnyReducerType;
    };
}
