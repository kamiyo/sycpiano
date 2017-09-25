import '@/less/Media/Music/audio-info.less';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const AudioInfo = (props) => {
    const { title, composer, contributing, ...rest } = this.props.currentTrack;
    return (
        <div className="audioInfoContainer">
            <div className="audioInfo">{`${composer} | ${title} ${(contributing) ? '| ' : ''}${contributing}`}</div>
        </div>
    );
};

AudioInfo.PropTypes = {
    currentTrack: PropTypes.object.isRequired,
};

mapStateToProps = state => ({
    currentTrack: state.audio_player.currentTrack
})

export default connect(
    mapStateToProps,
    null
)(AudioInfo);