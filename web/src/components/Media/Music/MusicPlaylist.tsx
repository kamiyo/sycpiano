import * as React from 'react';
import { css } from 'react-emotion';
import { connect } from 'react-redux';

import MusicPlaylistItem from 'src/components/Media/Music/MusicPlaylistItem';
import { ShuffleButton } from 'src/components/Media/Music/ShuffleButton';
import SpotifyButton from 'src/components/Media/Music/SpotifyButton';
import Playlist from 'src/components/Media/Playlist';

import { MusicFileItem, MusicListItem } from 'src/components/Media/Music/types';
import { GlobalStateShape } from 'src/types';

import { playlistBackground } from 'src/styles/colors';
import { screenXSorPortrait } from 'src/styles/screens';

interface MusicPlaylistStateToProps {
    readonly items: MusicListItem[];
}

interface MusicPlaylistOwnProps {
    readonly baseRoute: string;
    readonly currentTrackId: string;
    readonly onClick: (item: MusicFileItem) => void;
    readonly play: () => void;
    readonly isMobile: boolean;
    readonly userInteracted: boolean;
    readonly toggleShuffle: () => void;
    readonly isShuffle: boolean;
}

type MusicPlaylistProps = MusicPlaylistOwnProps & MusicPlaylistStateToProps;

const musicPlaylistStyle = css`
    position: initial;

    ${/* sc-selector */ screenXSorPortrait} {
        top: 360px;
        position: relative;
        overflow: visible;
    }
`;

const musicULStyle = css`
    background-color: ${playlistBackground};
    padding-bottom: 80px;

    ${/* sc-selector */ screenXSorPortrait} {
        padding-bottom: 60px;
    }
`;

const playlistContainerStyle = css`
    width: fit-content;
    height: 100%;
    right: 0;
    position: absolute;

    ${/* sc-selector */ screenXSorPortrait} {
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
    play,
    baseRoute,
    userInteracted,
    isShuffle,
    toggleShuffle,
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
                        play={play}
                        baseRoute={baseRoute}
                        userInteracted={userInteracted}
                    />
                ))}
            </Playlist>
            <SpotifyButton isMobile={isMobile} />
            <ShuffleButton isMobile={isMobile} onClick={toggleShuffle} on={isShuffle} />
        </div>
    );

const mapStateToProps = ({ audio_playlist }: GlobalStateShape) => ({
    items: audio_playlist.items,
});

export default connect<MusicPlaylistStateToProps, {}, MusicPlaylistOwnProps>(
    mapStateToProps,
    null,
)(MusicPlaylist);
