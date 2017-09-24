import '@/less/Media/Music/audio-info.less';

import React from 'react';
import PropTypes from 'prop-types';

const AudioInfo = ({ title, composer, contributing }) => (
    <div className="audioInfoContainer">
        <div className="audioInfo">{`${composer} | ${title} ${(contributing)?'| ':''}${contributing}`}</div>
    </div>
);

AudioInfo.PropTypes = {
    title: PropTypes.string.isRequired,
    composer: PropTypes.string.isRequired,
    contributing: PropTypes.string.isOptional
};

export default AudioInfo;