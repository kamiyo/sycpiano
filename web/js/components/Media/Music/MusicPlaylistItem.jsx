import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';

const MusicPlaylistItem = ({ item, ...props }) => (
    <li
        className={`musicPlaylistItem${props.isActive ? ' active' : ''}`}
        onClick={() => props.onClick(item, true)}
    >
        <div className="itemContent">
            <div className="section audioInfo">
                <h4 className="text-top">
                    {`${item.composer} - ${item.title}`}
                </h4>
                <h4 className="text-bottom">
                    {durationToDisplay(item.duration)}
                </h4>
            </div>
        </div>
    </li>
)

MusicPlaylistItem.propTypes = {
    isActive: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired
};

export default MusicPlaylistItem;

// Helper functions

function durationToDisplay(durationString) {
    let duration = moment.duration(durationString);
    let s = duration.seconds();
    let m = duration.minutes();
    let h = duration.hours();

    let sString = `${s < 10 ? '0' : ''}${s}`;
    let mString = `${m < 10 ? '0' : ''}${m}`;
    let hString = h > 0 ? `${h}:` : '';

    return `${hString}${mString}:${sString}`
}