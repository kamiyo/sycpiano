import 'less/Media/Music/audio-info.less';

import * as React from 'react';

import { formatTime } from 'src/utils';

import { MusicItem } from 'src/components/Media/Music/types';

interface AudioInfoProps {
    currentTrack: MusicItem;
    duration: number;
}

const AudioInfo: React.SFC<AudioInfoProps> = ({ currentTrack, duration }) => {
    const { title = '', composer = '', contributing = null } = currentTrack;
    return (
        <div className='audioInfoContainer no-highlight'>
            <div className='audioInfo composer-title'>{`${composer}: ${title}`}</div>
            <div className='audioInfo contributing'>{(contributing) ? contributing : '- - - -'}</div>
            <div className='audioInfo duration'>{formatTime(duration)}</div>
        </div>
    );
};

export default AudioInfo;
