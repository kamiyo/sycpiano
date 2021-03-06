import { BioStateShape } from 'src/components/About/Bio/types';
import { DiscsStateShape } from 'src/components/About/Discs/types';
import { AcclaimsListStateShape } from 'src/components/About/Press/types';
import { NavBarStateShape } from 'src/components/App/NavBar/types';
import { AudioPlaylistStateShape } from 'src/components/Media/Music/types';
import { PhotoListReducerShape, PhotoViewerReducerShape } from 'src/components/Media/Photos/types';
import { VideoPlayerStateShape, VideoPlaylistStateShape } from 'src/components/Media/Videos/types';
import { ScheduleStateShape } from 'src/components/Schedule/types';
import { ShopStateShape } from './components/Shop/types';

import { bioReducer } from 'src/components/About/Bio/reducers';
import { discsReducer } from 'src/components/About/Discs/reducers';
import { acclaimsListReducer } from 'src/components/About/Press/reducers';
import { audioPlaylistReducer } from 'src/components/Media/Music/reducers';
import { photoListReducer, photoViewerReducer } from 'src/components/Media/Photos/reducers';
import { videoPlayerReducer, videoPlaylistReducer } from 'src/components/Media/Videos/reducers';
import { scheduleReducer } from 'src/components/Schedule/reducers';
import { shopReducer } from 'src/components/Shop/reducers';

import { Store } from 'redux';
import { CartStateShape } from './components/Cart/types';
import { cartReducer } from './components/Cart/reducers';

export interface GlobalStateShape {
    readonly bio?: BioStateShape;
    readonly discs?: DiscsStateShape;
    readonly audioPlaylist?: AudioPlaylistStateShape;
    readonly photoList?: PhotoListReducerShape;
    readonly photoViewer?: PhotoViewerReducerShape;
    readonly pressAcclaimsList?: AcclaimsListStateShape;
    readonly scheduleEventItems?: ScheduleStateShape;
    readonly shop?: ShopStateShape;
    readonly videoPlayer?: VideoPlayerStateShape;
    readonly videoPlaylist?: VideoPlaylistStateShape;
    readonly navbar: NavBarStateShape;
    readonly cart: CartStateShape;
}

export type AnyReducerType = typeof bioReducer | typeof discsReducer | typeof audioPlaylistReducer |
    typeof photoListReducer | typeof photoViewerReducer | typeof acclaimsListReducer | typeof cartReducer |
    typeof scheduleReducer | typeof videoPlayerReducer | typeof videoPlaylistReducer | typeof shopReducer;

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
    readonly shop?: typeof shopReducer;
    readonly [key: string]: AnyReducerType;
}

export type AnyComponent<P> = React.ComponentClass<P> | React.FunctionComponent<P>;

export type AsyncStore = Store<GlobalStateShape | Record<string, unknown>> & { async?: Reducers };

export interface AsyncModule<P> {
    Component: AnyComponent<P>;
    reducers?: {
        [key: string]: AnyReducerType;
    };
}
