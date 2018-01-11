import 'less/Media/Music/music-playlist.less';

import * as React from 'react';
import { connect } from 'react-redux';

import MusicPlaylistItem from 'src/components/Media/Music/MusicPlaylistItem';
import Playlist from 'src/components/Media/Playlist';

import { MusicFileItem, MusicItem } from 'src/components/Media/Music/types';
import { ChildRendererProps } from 'src/components/Media/types';
import { GlobalStateShape } from 'src/types';

interface MusicPlaylistStateToProps {
    readonly items: MusicItem[];
}

interface MusicPlaylistOwnProps {
    readonly baseRoute: string;
    readonly currentTrackId: string;
    readonly onClick: (item: MusicFileItem, autoPlay: boolean) => void;
}

type MusicPlaylistProps = MusicPlaylistOwnProps & MusicPlaylistStateToProps;

const MusicPlaylist: React.SFC<MusicPlaylistProps> = (props) => (
    <Playlist
        className='musicPlaylist'
        isShow={true}
        hasToggler={false}
        items={props.items}
        currentItemId={props.currentTrackId}
        onClick={props.onClick}
        ChildRenderer={(childProps: ChildRendererProps<MusicItem>) => <MusicPlaylistItem {...childProps} baseRoute={props.baseRoute} />}
        shouldAppear={false}
    />
);

const mapStateToProps = (state: GlobalStateShape) => ({
    items: state.audio_playlist.items,
});

export default connect<MusicPlaylistStateToProps, {}>(
    mapStateToProps,
    null,
)(MusicPlaylist);
