import * as React from 'react';
import styled, { css } from 'react-emotion';

import { formatTime } from 'src/utils';

import { MusicItem } from 'src/components/Media/Music/types';

import { lato1 } from 'src/styles/fonts';
import { noHighlight } from 'src/styles/mixins';
import { playlistWidth } from 'src/styles/variables';

interface AudioInfoProps {
    currentTrack: MusicItem;
    duration: number;
    currentPosition: number;
    isMobile: boolean;
}

const AudioInfoContainer = styled<{ isMobile: boolean; }, 'div'>('div') `
    ${noHighlight}
    width: ${(props) => props.isMobile ? `100%` : `calc(100% - ${playlistWidth}px)`};
    height: ${(props) => (props.isMobile) ? '450px' : '100%'};
    z-index: 10;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    text-align: center;
    font-family: ${lato1};
    letter-spacing: 2px;
    color: white;
    padding-bottom: ${(props) => props.isMobile ? '1rem' : '3rem'};
`;

const getAudioInfoStyle = (isMobile: boolean) => css`
    padding: 0 10px;
    line-height: ${isMobile ? '2.5rem' : '3.2rem'};
`;

const ComposerTitle = styled<{ isMobile: boolean; }, 'div'>('div') `
    ${(props) => getAudioInfoStyle(props.isMobile)}
    font-size: ${(props) => props.isMobile ? '1.4rem' : '2.2rem' };
`;

const Movement = styled<{ isMobile: boolean; }, 'div'>('div') `
    ${(props) => getAudioInfoStyle(props.isMobile)}
    font-size: ${(props) => props.isMobile ? '1.4rem' : '2.2rem' };
`;

const Contributing = styled<{ isMobile: boolean; }, 'div'>('div') `
    ${(props) => getAudioInfoStyle(props.isMobile)}
    font-size: ${(props) => props.isMobile ? '1.3rem' : '2rem' };
`;

const Duration = styled<{ isMobile: boolean; }, 'div'>('div') `
    ${(props) => getAudioInfoStyle(props.isMobile)}
    font-size: ${(props) => props.isMobile ? '1.3rem' : '2rem' };
`;

const AudioInfo: React.SFC<AudioInfoProps> = ({ currentTrack, currentPosition, duration, isMobile }) => {
    const {
        piece = '',
        composer = '',
        contributors = '',
        musicFiles = [],
    } = currentTrack || {};

    const {
        name: movement = '',
    } = musicFiles[0] || {};
    const composerTitle = composer + ' ' + piece;
    return (
        <AudioInfoContainer isMobile={isMobile}>
            <ComposerTitle isMobile={isMobile}>{composerTitle}</ComposerTitle>
            {movement && <Movement isMobile={isMobile}>{movement}</Movement>}
            {contributors && <Contributing isMobile={isMobile}>{contributors}</Contributing>}
            <Duration isMobile={isMobile}>{`${formatTime(currentPosition)} / ${formatTime(duration)}`}</Duration>
        </AudioInfoContainer>
    );
};

export default AudioInfo;
