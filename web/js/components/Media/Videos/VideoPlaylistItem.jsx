import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const VideoPlaylistItem = ({ item, ...props }) => (
    <li
        className={`videoPlaylistItem${props.isActive ? ' active' : ''}`}
        onClick={() => props.onClick(item.id)}
    >
        <div className="itemContent">
            <div className="imageContainer section">
                <img src={item.snippet.thumbnails.high.url}></img>
                <span className="duration">
                    {videoDurationToDisplay(item.contentDetails.duration)}
                </span>
            </div>
            <div className="section videoInfo">
                <h4 className="text-top">
                    {item.snippet.title}
                </h4>
                <h4 className="text-bottom">
                    {item.statistics.viewCount} views
                        | published on {publishedDateToDisplay(item.snippet.publishedAt)}
                </h4>
            </div>
        </div>
    </li>
)

VideoPlaylistItem.propTypes = {
    isActive: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired
};

export default VideoPlaylistItem;

// Helper functions

function videoDurationToDisplay(durationString) {
    let duration = moment.duration(durationString);
    let s = duration.seconds();
    let m = duration.minutes();
    let h = duration.hours();

    let sString = `${s < 10 ? '0' : ''}${s}`;
    let mString = `${m < 10 ? '0' : ''}${m}`;
    let hString = h > 0 ? `${h}:` : '';

    return `${hString}${mString}:${sString}`
}

function publishedDateToDisplay(publishedAt) {
    return moment(publishedAt).format('MMMM D, YYYY');
}