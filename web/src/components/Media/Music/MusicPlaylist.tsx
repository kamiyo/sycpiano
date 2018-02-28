import * as React from 'react';
import styled, { css } from 'react-emotion';
import { connect } from 'react-redux';

import MusicPlaylistItem from 'src/components/Media/Music/MusicPlaylistItem';
import Playlist from 'src/components/Media/Playlist';

import { MusicFileItem, MusicItem, MusicListItem } from 'src/components/Media/Music/types';
import { ChildRendererProps } from 'src/components/Media/types';
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

    /* stylelint-disable-next-line */
    ${isMobile && `
        top: 450px;
        position: relative;
        overflow: visible;

    `};
`;

const getMusicULStyle = (isMobile: boolean) => css`
    background-color: ${playlistBackground};
    ${isMobile && 'padding-bottom: 20px;'}
`;

const StyledPlaylistContainer = styled<{ isMobile: boolean }, 'div'>('div') `
    width: 100%;
    height: ${props => props.isMobile ? 'auto' : '100%'};
`;

const MusicPlaylist: React.SFC<MusicPlaylistProps> = (props) => (
    <StyledPlaylistContainer isMobile={props.isMobile}>
        <Playlist
            extraStyles={{ div: getMusicPlaylistStyle(props.isMobile), ul: getMusicULStyle(props.isMobile) }}
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
            isMobile={props.isMobile}
        />
    </StyledPlaylistContainer>
);

const mapStateToProps = (state: GlobalStateShape) => ({
    items: state.audio_playlist.items,
});

export default connect<MusicPlaylistStateToProps, {}>(
    mapStateToProps,
    null,
)(MusicPlaylist);
