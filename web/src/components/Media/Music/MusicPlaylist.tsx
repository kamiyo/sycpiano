import * as React from 'react';
import { css } from 'react-emotion';
import { connect } from 'react-redux';

import MusicPlaylistItem from 'src/components/Media/Music/MusicPlaylistItem';
import SpotifyButton from 'src/components/Media/Music/SpotifyButton';
import Playlist from 'src/components/Media/Playlist';

import { MusicFileItem, MusicListItem } from 'src/components/Media/Music/types';
import { GlobalStateShape } from 'src/types';

import { playlistBackground } from 'src/styles/colors';
import { screenXS } from 'src/styles/screens';

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

const musicPlaylistStyle = css`
    position: initial;

    ${/* sc-selector */ screenXS} {
        top: 450px;
        position: relative;
        overflow: visible;
    }
`;

const musicULStyle = css`
    background-color: ${playlistBackground};
    padding-bottom: 60px;
`;

const playlistContainerStyle = css `
    width: fit-content;
    height: 100%;
    right: 0;
    position: absolute;

    ${/* sc-selector */ screenXS} {
        width: 100%;
        height: auto;
        position: unset;
        right: unset;
    }
`;

const MusicPlaylist: React.SFC<MusicPlaylistProps> = ({
    isMobile,
    items,
    onClick,
    currentTrackId,
    audio,
    baseRoute,
    userInput,
    onFirstUserInput,
}) => (
        <div className={playlistContainerStyle}>
            <Playlist
                extraStyles={{ div: musicPlaylistStyle, ul: musicULStyle }}
                isShow={true}
                hasToggler={false}
                shouldAppear={false}
                isMobile={isMobile}
            >
                {items.map((item) => (
                    <MusicPlaylistItem
                        key={item.id}
                        item={item}
                        onClick={onClick}
                        currentItemId={currentTrackId}
                        audio={audio}
                        baseRoute={baseRoute}
                        userInput={userInput}
                        onFirstUserInput={onFirstUserInput}
                    />
                ))}
            </Playlist>
            <SpotifyButton isMobile={isMobile} />
        </div>
    );

const mapStateToProps = (state: GlobalStateShape) => ({
    items: state.audio_playlist.items,
});

export default connect<MusicPlaylistStateToProps>(
    mapStateToProps,
    null,
)(MusicPlaylist);
