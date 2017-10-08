import '@/less/Media/Music/audio-info.less';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { formatTime } from '@/js/Components/Media/Music/VisualizationUtils.js';

const AudioInfo = (props) => {
    const { title, composer, contributing, ...rest } = props.currentTrack;
    return (
        <div className="audioInfoContainer">
            <div className="audioInfo">
                {`${composer} | ${title} ${(contributing) ? '| ' : ''} ${contributing} ${(props.duration) ? '| ' : ''}${formatTime(props.duration)}`}
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