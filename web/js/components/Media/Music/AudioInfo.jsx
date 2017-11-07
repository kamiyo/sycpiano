import '@/less/Media/Music/audio-info.less';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { formatTime } from '@/js/Components/Media/Music/VisualizationUtils.js';

const AudioInfo = ({ currentTrack, duration }) => {
    const { title, composer, contributing } = currentTrack;
    return (
        <div className="audioInfoContainer">
            <div className="audioInfo composer-title">{`${composer}: ${title}`}</div>
            <div className="audioInfo contributing">{contributing}</div>
            <div className="audioInfo duration">{formatTime(duration)}</div>
        </div>
    );
};

AudioInfo.PropTypes = {
    currentTrack: PropTypes.object.isRequired,
};

export default AudioInfo;