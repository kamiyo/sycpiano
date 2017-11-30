import 'less/Media/Music/audio-info.less';

import * as React from 'react';

import { formatTime } from 'js/components/Media/Music/VisualizationUtils';

import { MusicItem } from 'js/components/Media/Music/types';

const AudioInfo = ({ currentTrack, duration }: { currentTrack: MusicItem; duration: number }) => {
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
