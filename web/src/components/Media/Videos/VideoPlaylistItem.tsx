import moment from 'moment-timezone';
import * as React from 'react';

import { VideoItemShape } from 'src/components/Media/Videos/types';

interface VideoPlaylistItemProps {
    readonly item: VideoItemShape;
    readonly currentItemId: number | string;
    readonly onClick: (id: string) => void;
}

const VideoPlaylistItem: React.SFC<VideoPlaylistItemProps> = ({ item, currentItemId, onClick }) => (
    <li
        className={`videoPlaylistItem${(currentItemId === item.id) ? ' active' : ''}`}
        onClick={() => onClick(item.id)}
    >
        <div className='itemContent'>
            <div className='imageContainer section'>
                <img src={item.snippet.thumbnails.high.url} />
                <span className='duration'>
                    {videoDurationToDisplay(item.contentDetails.duration)}
                </span>
            </div>
            <div className='section videoInfo'>
                <h4 className='text-top'>
                    {item.snippet.title}
                </h4>
                <h4 className='text-bottom'>
                    {item.statistics.viewCount} views
                        | published on {publishedDateToDisplay(item.snippet.publishedAt)}
                </h4>
            </div>
        </div>
    </li>
);

export default VideoPlaylistItem;

// Helper functions

function videoDurationToDisplay(durationString: string) {
    const duration = moment.duration(durationString);
    const s = duration.seconds();
    const m = duration.minutes();
    const h = duration.hours();

    const sString = `${s < 10 ? '0' : ''}${s}`;
    const mString = `${m < 10 ? '0' : ''}${m}`;
    const hString = h > 0 ? `${h}:` : '';

    return `${hString}${mString}:${sString}`;
}

function publishedDateToDisplay(publishedAt: string) {
    return moment(publishedAt).format('MMMM D, YYYY');
}
