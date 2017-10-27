import '@/less/Media/Music/audio-info.less';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { formatTime } from '@/js/Components/Media/Music/VisualizationUtils.js';

const AudioInfo = ({ currentTrack, duration }) => {
    const { title, composer, contributing } = currentTrack;
    return (
        <div className="audioInfoContainer">
            <div className="audioInfo">
                {`${composer} | ${title} ${(contributing) ? '| ' : ''} ${contributing} ${(duration) ? '| ' : ''}${formatTime(duration)}`}
            </div>
        </div>
    );
};

AudioInfo.PropTypes = {
    currentTrack: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    currentTrack: state.audio_player.currentTrack,
    duration: state.audio_player.duration
});

export default connect(
    mapStateToProps,
    null
)(AudioInfo);