import moment from 'moment-timezone';
import * as React from 'react';
import styled, { css } from 'react-emotion';

import { VideoItemShape } from 'src/components/Media/Videos/types';
import { lightBlue, playlistBackground } from 'src/styles/colors';
import { lato1, lato2 } from 'src/styles/fonts';
import { playlistWidth } from 'src/styles/variables';

interface VideoPlaylistItemProps {
    readonly item: VideoItemShape;
    readonly currentItemId: number | string;
    readonly onClick: (id: string) => void;
}

const aspectRatio = 4 / 3;
const thumbnailWidth = Math.floor(playlistWidth * 0.2);
const itemHeight = thumbnailWidth / aspectRatio;

const padding = 10;

const section = css`
    vertical-align: middle;
    display: inline-block;
`;

const ImageContainer = styled('div')`
    ${section}
    height: 100%;
    width: ${thumbnailWidth}px;
    position: relative;

    img {
        width: 100%;
        filter: saturate(50%) brightness(60%);
    }
`;

const StyledVideoItem = styled<{ active: boolean; }, 'li'>('li')`
    background-color: ${playlistBackground};
    list-style: none;
    cursor: pointer;
    width: 100%;
    height: ${itemHeight + padding * 2}px;
    padding: ${padding}px 0 ${padding}px 15px;
    border-left: 7px solid transparent;
    border-bottom: 1px solid rgba(120, 120, 120, 0.3);
    transition: all 0.15s;

    &:hover {
        background-color: rgba(255, 255, 255, 1);

        /* stylelint-disable-next-line rule-empty-line-before, declaration-block-semicolon-newline-after */
        ${ImageContainer as any} img {
            filter: brightness(60%);
        }
    }

    /* stylelint-disable comment-empty-line-before */
    ${props => props.active &&
        `border-left-color: ${lightBlue};
        background-color: rgba(255, 255, 255, 1);

        ${ImageContainer} img {
            filter: brightness(60%);
        }`
    }
    /* stylelint-enable comment-empty-line-before */
`;

const Duration = styled<{ active: boolean; children: string; }, 'span'>('span')`
    position: absolute;
    right: 0;
    bottom: 0;
    color: ${props => (props.active) ? '#4E86A4 + #555' : '#fff'};
    font-family: ${props => (props.active) ? lato2 : lato1};
    padding-right: 3px;
`;

const VideoInfo = styled('div')`
    ${section}
    width: calc(80% - 20px);
    height: 100%;
    padding: 0 20px;
    position: relative;
`;

const h4style = css`
    margin: 0;
    color: black;
    font-size: 15px;
    position: absolute;
`;

const TextTop = styled('h4')`
    ${h4style}
    padding-top: 5px;
    top: 0;
`;

const TextBottom = styled('h4')`
    ${h4style}
    padding-bottom: 5px;
    bottom: 0;
`;

const VideoPlaylistItem: React.SFC<VideoPlaylistItemProps> = ({ item, currentItemId, onClick }) => (
    <StyledVideoItem
        active={currentItemId === item.id}
        onClick={() => onClick(item.id)}
    >
        <div className="itemContent">
            <ImageContainer>
                <img src={item.snippet.thumbnails.high.url} />
                <Duration active={currentItemId === item.id}>
                    {videoDurationToDisplay(item.contentDetails.duration)}
                </Duration>
            </ImageContainer>
            <VideoInfo>
                <TextTop>
                    {item.snippet.title}
                </TextTop>
                <TextBottom>
                    {item.statistics.viewCount} views
                        | published on {publishedDateToDisplay(item.snippet.publishedAt)}
                </TextBottom>
            </VideoInfo>
        </div>
    </StyledVideoItem>
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
