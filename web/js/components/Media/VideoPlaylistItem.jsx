import React from 'react';
import moment from 'moment';

export default class VideoPlaylistItem extends React.Component {
    onClick() {
        this.props.onClick(this.props.video.snippet.resourceId.videoId);
    }

    render() {
        let video = this.props.video;

        return (
            <li className={`videoPlaylistItem${this.props.isActive ? ' active' : ''}`} onClick={this.onClick.bind(this)}>
                <div className="itemContent">
                    <div className="imageContainer section">
                        <img src={video.snippet.thumbnails.high.url}></img>
                        <span className="duration">
                            {videoDurationToDisplay(video.contentDetails.duration)}
                        </span>
                    </div>
                    <div className="section videoInfo">
                        <h4 className="text-top">
                            {video.snippet.title}
                        </h4>
                        <h4 className="text-bottom">
                            {video.statistics.viewCount} views
                            | published on {publishedDateToDisplay(video.snippet.publishedAt)}
                        </h4>
                    </div>
                </div>
            </li>
            );
    }
}


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