import '@/less/Media/Music/audio-info.less';

import React from 'react';
import PropTypes from 'prop-types';
import { formatTime } from '@/js/Components/Media/Music/VisualizationUtils.js';

const AudioInfo = ({ currentTrack, duration }) => {
    const { title = "", composer = "", contributing = null } = currentTrack;
    return (
        <div className="audioInfoContainer no-highlight">
            <div className="audioInfo composer-title">{`${composer}: ${title}`}</div>
            <div className="audioInfo contributing">{(contributing) ? contributing : "- - - -"}</div>
            <div className="audioInfo duration">{formatTime(duration)}</div>
        </div>
    );
};

AudioInfo.propTypes = {
    currentTrack: PropTypes.object.isRequired,
    duration: PropTypes.number.isRequired
};

export default AudioInfo;