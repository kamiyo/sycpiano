import 'less/Media/Music/audio-info.less';

import * as React from 'react';

import { formatTime } from 'src/utils';

import { MusicItem } from 'src/components/Media/Music/types';

interface AudioInfoProps {
    currentTrack: MusicItem;
    duration: number;
}

const AudioInfo: React.SFC<AudioInfoProps> = ({ currentTrack, duration }) => {
    const {
        piece = '',
        composer = '',
        contributors = '',
        musicFiles = [],
    } = currentTrack;
    const {
        name: movement,
    } = musicFiles[0];
    const composerTitle = composer + ': ' + piece + ((movement) ? (' - ' + movement) : '');
    return (
        <div className='audioInfoContainer no-highlight'>
            <div className='audioInfo composer-title'>{composerTitle}</div>
            <div className='audioInfo contributing'>{(contributors) ? contributors : '- - - -'}</div>
            <div className='audioInfo duration'>{formatTime(duration)}</div>
        </div>
    );
};

export default AudioInfo;
