import 'less/Media/Music/music-playlist.less';

import * as React from 'react';
import { connect } from 'react-redux';

import MusicPlaylistItem from 'js/components/Media/Music/MusicPlaylistItem';
import Playlist from 'js/components/Media/Playlist';

import { MusicItem } from 'js/components/Media/Music/types';
import { GlobalStateShape } from 'js/types';

interface MusicPlaylistStateToProps {
    items: MusicItem[];
}

interface MusicPlaylistProps {
    baseRoute: string;
    currentTrackId: string;
    onClick: (item: MusicItem, autoPlay: boolean) => void;
}

type MusicPlaylistPropsMerged = MusicPlaylistProps & MusicPlaylistStateToProps;

const MusicPlaylist = (props: MusicPlaylistPropsMerged) => (
    <Playlist
        className='musicPlaylist'
        isShow={true}
        hasToggler={false}
        items={props.items}
        currentItemId={props.currentTrackId}
        onClick={props.onClick}
        ChildRenderer={(childProps) => <MusicPlaylistItem {...childProps} baseRoute={props.baseRoute} />}
    />
);

const mapStateToProps = (state: GlobalStateShape) => ({
    items: state.audio_playlist.items,
});

export default connect<MusicPlaylistStateToProps, {}>(
    mapStateToProps,
    null,
)(MusicPlaylist);
