import * as React from 'react';
import styled from 'react-emotion';
import { Link } from 'react-router-dom';

import { staticImage } from 'src/styles/imageUrls';
import { screenXSorPortrait } from 'src/styles/screens';
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

SpotifyButton = styled<SpotifyButtonProps, typeof SpotifyButton>(SpotifyButton) `
    position: fixed;
    bottom: 10px;
    right: ${playlistWidth / 2}px;
    transform: translateX(50%);
    z-index: 50;
    filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.3));
    transition: all 0.1s;

    &:hover {
        cursor: pointer;
        filter: drop-shadow(0 3px 3px rgba(0, 0, 0, 0.3));
        transform: translateX(50%) translateY(-1px);
    }

    a img {
        display: block;
    }

    ${/* sc-selector */ screenXSorPortrait} {
        right: 50%;
    }
`;

export default SpotifyButton;
