import * as React from 'react';
import { css } from 'react-emotion';
import { connect } from 'react-redux';

import MusicPlaylistItem from 'src/components/Media/Music/MusicPlaylistItem';
import Playlist from 'src/components/Media/Playlist';

import { MusicFileItem, MusicItem } from 'src/components/Media/Music/types';
import { ChildRendererProps } from 'src/components/Media/types';
import { GlobalStateShape } from 'src/types';

import { playlistBackground } from 'src/styles/colors';
import { playlistWidth } from 'src/styles/variables';

interface MusicPlaylistStateToProps {
    readonly items: MusicItem[];
}

interface MusicPlaylistOwnProps {
    readonly baseRoute: string;
    readonly currentTrackId: string;
    readonly onClick: (item: MusicFileItem, autoPlay: boolean) => void;
    readonly audio: HTMLAudioElement;
    readonly userInput: boolean;
    readonly onFirstUserInput: () => void;
}

type MusicPlaylistProps = MusicPlaylistOwnProps & MusicPlaylistStateToProps;

const musicPlaylistStyle = css`
    width: ${playlistWidth}px;
`;

const musicULStyle = css`
    ul {
        background-color: ${playlistBackground};
    }
`;

const MusicPlaylist: React.SFC<MusicPlaylistProps> = (props) => (
    <Playlist
        extraStyles={{ div: musicPlaylistStyle, ul: musicULStyle }}
        isShow={true}
        hasToggler={false}
        items={props.items}
        currentItemId={props.currentTrackId}
        onClick={props.onClick}
        ChildRenderer={(childProps: ChildRendererProps<MusicItem>) =>
            <MusicPlaylistItem
                {...childProps}
                audio={props.audio}
                baseRoute={props.baseRoute}
                userInput={props.userInput}
                onFirstUserInput={props.onFirstUserInput}
            />
        }
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
