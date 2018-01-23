import moment from 'moment-timezone';
import * as React from 'react';
import styled, { css } from 'react-emotion';

import { VideoItemShape } from 'src/components/Media/Videos/types';
import { playlistBackground, lightBlue } from 'src/styles/colors';
import { playlistWidth } from 'src/styles/variables';
import { lato2 } from 'src/styles/fonts';

interface VideoPlaylistItemProps {
    readonly item: VideoItemShape;
    readonly currentItemId: number | string;
    readonly onClick: (id: string) => void;
}

const aspectRatio = 4/3;
const thumbnailWidth = Math.floor(playlistWidth * 0.2);
const itemHeight = thumbnailWidth / aspectRatio;

const padding = 10;

const section = css`
    vertical-align: middle;
    display: inline-block;
`;

const ImageContainer = styled('div')`
    height: 100%;
    width: ${thumbnailWidth};
    position: relative;

    img {
        width: 100%;
        filter: saturate(50%) brightness(60%);
    }
    ${section}
`;

const Duration = styled('span')`
    position: absolute;
    right: 0;
    bottom: 0;
    color: #fff;
    padding-right: 3px;
`;

const StyledVideoItem = styled('li')`
    background-color: ${playlistBackground};
    list-style: none;
    cursor: pointer;
    width: 100%;
    height: ${itemHeight + padding * 2}px;
    padding: ${padding}px 0 ${padding}px 15px;
    border-left: 7px solid transparent;
    border-bottom: 1px solid rgba(120, 120, 120, 0.3);

    transition: all 0.15s;

    &:hover, &.active {
        background-color: rgba(255, 255, 255, 1);

        .imageContainer img {
            filter: brightness(60%);
        }
    }

    &.active {
        border-left-color: ${lightBlue};

        .imageContainer .duration {
            color: #4E86A4 + #555;
            font-family: ${lato2};
        }
    }

`;

const VideoPlaylistItem: React.SFC<VideoPlaylistItemProps> = ({ item, currentItemId, onClick }) => (
    <li
        className={`videoPlaylistItem${(currentItemId === item.id) ? ' active' : ''}`}
        onClick={() => onClick(item.id)}
    >
        <div className="itemContent">
            <ImageContainer>
                <img src={item.snippet.thumbnails.high.url} />
                <Duration>
                    {videoDurationToDisplay(item.contentDetails.duration)}
                </Duration>
            </ImageContainer>
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
