import { AboutStateShape } from 'src/components/About/types';
import { AudioPlaylistStateShape, AudioUIStateShape, AudioVisualizerStateShape } from 'src/components/Media/Music/types';
import { PhotoListReducerShape, PhotoViewerReducerShape } from 'src/components/Media/Photos/types';
import { VideoPlayerStateShape, VideoPlaylistStateShape } from 'src/components/Media/Videos/types';
import { AcclaimsListStateShape } from 'src/components/Press/types';
import { ScheduleStateShape } from 'src/components/Schedule/types';

import { aboutReducer } from 'src/components/About/reducers';
import { audioPlaylistReducer, audioUIReducer, audioVisualizerReducer } from 'src/components/Media/Music/reducers';
import { photoListReducer, photoViewerReducer } from 'src/components/Media/Photos/reducers';
import { videoPlayerReducer, videoPlaylistReducer } from 'src/components/Media/Videos/reducers';
import { acclaimsListReducer } from 'src/components/Press/reducers';
import { scheduleReducer } from 'src/components/Schedule/reducers';

import { Store } from 'react-redux';

import { AboutType } from 'src/components/About/About';
import { NavBarStateShape } from 'src/components/App/NavBar/types';
import { ContactType } from 'src/components/Contact/Contact';
import { HomeType } from 'src/components/Home/Home';
import { MediaType } from 'src/components/Media/Media';
import { MusicType } from 'src/components/Media/Music/Music';
import { PhotosType } from 'src/components/Media/Photos/Photos';
import { VideosType } from 'src/components/Media/Videos/Videos';
import { PressType } from 'src/components/Press/Press';
import { ScheduleType } from 'src/components/Schedule/Schedule';

export interface GlobalStateShape {
    readonly about?: AboutStateShape;
    readonly audio_playlist?: AudioPlaylistStateShape;
    readonly audio_ui?: AudioUIStateShape;
    readonly audio_visualizer?: AudioVisualizerStateShape;
    readonly photo_list?: PhotoListReducerShape;
    readonly photo_viewer?: PhotoViewerReducerShape;
    readonly press_acclaimsList?: AcclaimsListStateShape;
    readonly schedule_eventItems?: ScheduleStateShape;
    readonly video_player?: VideoPlayerStateShape;
    readonly video_playlist?: VideoPlaylistStateShape;
    readonly navbar: NavBarStateShape;
}

export type AnyReducerType = typeof aboutReducer | typeof audioPlaylistReducer | typeof audioUIReducer | typeof audioVisualizerReducer |
    typeof photoListReducer | typeof photoViewerReducer | typeof acclaimsListReducer |
    typeof scheduleReducer | typeof videoPlayerReducer | typeof videoPlaylistReducer;

export interface Reducers {
    readonly about?: typeof aboutReducer;
    readonly audio_playlist?: typeof audioPlaylistReducer;
    readonly audio_ui?: typeof audioUIReducer;
    readonly audio_visualizer?: typeof audioVisualizerReducer;
    readonly photo_list?: typeof photoListReducer;
    readonly photo_viewer?: typeof photoViewerReducer;
    readonly press_acclaimsList?: typeof acclaimsListReducer;
    readonly schedule_eventItems?: typeof scheduleReducer;
    readonly video_player?: typeof videoPlayerReducer;
    readonly video_playlist?: typeof videoPlaylistReducer;
    readonly [key: string]: AnyReducerType;
}

export type AnyComponentType = AboutType | PressType | ScheduleType | HomeType | MediaType | ContactType |
                                MusicType | PhotosType | VideosType;

export type AsyncStore = Store<GlobalStateShape | {}> & { async?: Reducers };

export interface AsyncModule {
    Component: AnyComponentType;
    reducers?: {
        [key: string]: AnyReducerType;
    };
}
