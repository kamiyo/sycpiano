import * as React from 'react';
import styled from 'react-emotion';
import { Link } from 'react-router-dom';

import { staticImage } from 'src/styles/imageUrls';
import { screenM, screenXSorPortrait } from 'src/styles/screens';
import { playlistWidth } from 'src/styles/variables';

interface SpotifyButtonProps {
    className?: string;
    isMobile?: boolean;
}

let SpotifyButton: React.SFC<SpotifyButtonProps> = ({ className }) => {
    return (
        <div className={className}>
            <Link style={{ display: 'block' }} to={'https://open.spotify.com/artist/6kMZjx0C2LY2v2fUsaN27y?si=8Uxb9kFTQPisQCvAyOybMQ'} target="_blank">
                <img width={50} height={50} src={staticImage(`/soc-logos/spotify-color.svg`)} />
            </Link>
        </div>
    );
};

SpotifyButton = styled<SpotifyButtonProps, {}>(SpotifyButton) `
    position: fixed;
    bottom: 25px;
    right: calc(${playlistWidth.desktop} * 2 / 3);
    transform: translateX(33.33%);
    z-index: 50;
    filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.3));
    transition: all 0.2s;

    &:hover {
        cursor: pointer;
        filter: drop-shadow(0 5px 5px rgba(0, 0, 0, 0.3));
        transform: translateX(33.33%) translateY(-1px) scale(1.05);
    }

    a img {
        display: block;
    }

    ${/* sc-selector */ screenM} {
        right: calc(${playlistWidth.tablet} / 2);
    }

    /* stylelint-disable-next-line no-duplicate-selectors */
    ${/* sc-selector */ screenXSorPortrait} {
        bottom: 10px;
        right: 66.67%;
    }
`;

export default SpotifyButton;
