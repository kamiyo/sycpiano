import { BioStateShape } from 'src/components/About/Bio/types';
import { DiscsStateShape } from 'src/components/About/Discs/types';
import { AcclaimsListStateShape } from 'src/components/About/Press/types';
import { NavBarStateShape } from 'src/components/App/NavBar/types';
import { AudioPlaylistStateShape } from 'src/components/Media/Music/types';
import { PhotoListReducerShape, PhotoViewerReducerShape } from 'src/components/Media/Photos/types';
import { VideoPlayerStateShape, VideoPlaylistStateShape } from 'src/components/Media/Videos/types';
import { ScheduleStateShape } from 'src/components/Schedule/types';
import { CartStateShape, SycStoreStateShape } from 'src/components/SycStore/types';

import { bioReducer } from 'src/components/About/Bio/reducers';
import { discsReducer } from 'src/components/About/Discs/reducers';
import { acclaimsListReducer } from 'src/components/About/Press/reducers';
import { audioPlaylistReducer } from 'src/components/Media/Music/reducers';
import { photoListReducer, photoViewerReducer } from 'src/components/Media/Photos/reducers';
import { videoPlayerReducer, videoPlaylistReducer } from 'src/components/Media/Videos/reducers';
import { scheduleReducer } from 'src/components/Schedule/reducers';
import { cartReducer, sycStoreReducer } from 'src/components/SycStore/reducers';

import { Store } from 'redux';

export interface GlobalStateShape {
    readonly bio?: BioStateShape;
    readonly discs?: DiscsStateShape;
    readonly audioPlaylist?: AudioPlaylistStateShape;
    readonly photoList?: PhotoListReducerShape;
    readonly photoViewer?: PhotoViewerReducerShape;
    readonly pressAcclaimsList?: AcclaimsListStateShape;
    readonly scheduleEventItems?: ScheduleStateShape;
    readonly sycStore?: SycStoreStateShape;
    readonly cart?: CartStateShape;
    readonly videoPlayer?: VideoPlayerStateShape;
    readonly videoPlaylist?: VideoPlaylistStateShape;
    readonly navbar: NavBarStateShape;
}

export type AnyReducerType = typeof bioReducer | typeof discsReducer | typeof audioPlaylistReducer |
    typeof photoListReducer | typeof photoViewerReducer | typeof acclaimsListReducer | typeof cartReducer |
    typeof scheduleReducer | typeof videoPlayerReducer | typeof videoPlaylistReducer | typeof sycStoreReducer;

export interface Reducers {
    readonly bio?: typeof bioReducer;
    readonly discs?: typeof discsReducer;
    readonly audioPlaylist?: typeof audioPlaylistReducer;
    readonly photoList?: typeof photoListReducer;
    readonly photoViewer?: typeof photoViewerReducer;
    readonly pressAcclaimsList?: typeof acclaimsListReducer;
    readonly scheduleEventItems?: typeof scheduleReducer;
    readonly videoPlayer?: typeof videoPlayerReducer;
    readonly videoPlaylist?: typeof videoPlaylistReducer;
    readonly sycStore?: typeof sycStoreReducer;
    readonly cart?: typeof cartReducer;
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
