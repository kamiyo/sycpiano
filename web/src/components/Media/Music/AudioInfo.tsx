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
}

const AudioInfoContainer = styled('div') `
    ${noHighlight}
    width: calc(100% - ${playlistWidth}px);
    height: 100%;
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
    padding-bottom: 50px;
`;

const audioInfoStyle = css`
    padding: 0 10px;
    line-height: 1.5em;
`;

const ComposerTitle = styled('div') `
    ${audioInfoStyle}
    font-size: 30px;
`;

const Movement = styled('div') `
    ${audioInfoStyle}
    font-size: 30px;
`;

const Contributing = styled('div') `
    ${audioInfoStyle}
    font-size: 24px;
`;

const Duration = styled('div') `
    ${audioInfoStyle}
    font-size: 24px;
`;

const AudioInfo: React.SFC<AudioInfoProps> = ({ currentTrack, duration }) => {
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
        <AudioInfoContainer>
            <ComposerTitle>{composerTitle}</ComposerTitle>
            {movement && <Movement>{movement}</Movement>}
            {contributors && <Contributing>{contributors}</Contributing>}
            <Duration>{formatTime(duration)}</Duration>
        </AudioInfoContainer>
    );
};

export default AudioInfo;
