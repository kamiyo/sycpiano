import * as React from 'react';
import styled, { css } from 'react-emotion';
import { connect } from 'react-redux';

import MusicPlaylistItem from 'src/components/Media/Music/MusicPlaylistItem';
import SpotifyButton from 'src/components/Media/Music/SpotifyButton';
import Playlist from 'src/components/Media/Playlist';

import { MusicFileItem, MusicListItem } from 'src/components/Media/Music/types';
import { GlobalStateShape } from 'src/types';

import { playlistBackground } from 'src/styles/colors';
import { playlistWidth } from 'src/styles/variables';

interface MusicPlaylistStateToProps {
    readonly items: MusicListItem[];
}

interface MusicPlaylistOwnProps {
    readonly baseRoute: string;
    readonly currentTrackId: string;
    readonly onClick: (item: MusicFileItem, autoPlay: boolean) => void;
    readonly audio: HTMLAudioElement;
    readonly userInput: boolean;
    readonly onFirstUserInput: () => void;
    readonly isMobile: boolean;
}

type MusicPlaylistProps = MusicPlaylistOwnProps & MusicPlaylistStateToProps;

const getMusicPlaylistStyle = (isMobile: boolean) => css`
    width: ${isMobile ? '100%' : `${playlistWidth}px`};
    position: initial;

    /* stylelint-disable-next-line */
    ${isMobile && `
        top: 450px;
        position: relative;
        overflow: visible;

    `};
`;

const getMusicULStyle = (_: boolean) => css`
    background-color: ${playlistBackground};
    padding-bottom: 60px;
`;

const StyledPlaylistContainer = styled<{ isMobile: boolean }, 'div'>('div') `
    /* stylelint-disable */
    ${props => props.isMobile ? `
        width: 100%;
        height: auto;
    ` : `
        width: fit-content;
        height: 100%;
        right: 0;
        position: absolute;
    `}
    /* stylelint-enable */
`;

const MusicPlaylist: React.SFC<MusicPlaylistProps> = (props) => (
    <StyledPlaylistContainer isMobile={props.isMobile}>
        <Playlist
            extraStyles={{ div: getMusicPlaylistStyle(props.isMobile), ul: getMusicULStyle(props.isMobile) }}
            isShow={true}
            hasToggler={false}
            shouldAppear={false}
            isMobile={props.isMobile}
        >
            {props.items.map((item) => (
                <MusicPlaylistItem
                    key={item.id}
                    item={item}
                    onClick={props.onClick}
                    currentItemId={props.currentTrackId}
                    audio={props.audio}
                    baseRoute={props.baseRoute}
                    userInput={props.userInput}
                    onFirstUserInput={props.onFirstUserInput}
                />
            ))}
        </Playlist>
        <SpotifyButton isMobile={props.isMobile} />
    </StyledPlaylistContainer>
);

const mapStateToProps = (state: GlobalStateShape) => ({
    items: state.audio_playlist.items,
});

export default connect<MusicPlaylistStateToProps, {}>(
    mapStateToProps,
    null,
)(MusicPlaylist);
