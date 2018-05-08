import * as React from 'react';
import styled from 'react-emotion';
import { Link } from 'react-router-dom';

import { staticImage } from 'src/styles/imageUrls';
import { screenM, screenXSorPortrait } from 'src/styles/screens';
import { playlistWidth } from 'src/styles/variables';

interface DropboxButtonProps {
    className?: string;
    isMobile?: boolean;
}

let DropboxButton: React.SFC<DropboxButtonProps> = ({ className }) => {
    return (
        <div className={className}>
            <Link style={{ display: 'block' }} to={'https://www.dropbox.com/sh/pzou7yeukjktznn/AADNCU7fmgUy_vmA3WioLiria?dl=0'} target="_blank">
                <img width={50} height={50} src={staticImage(`/soc-logos/dropbox.svg`)} />
            </Link>
        </div>
    );
};

DropboxButton = styled<{ isMobile?: boolean; }, typeof DropboxButton>(DropboxButton) `
    position: fixed;
    bottom: 25px;
    right: calc(${playlistWidth.desktop} / 2);
    transform: translateX(50%);
    z-index: 50;
    filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.3));
    transition: all 0.1s;

    &:hover {
        cursor: pointer;
        filter: drop-shadow(0 5px 5px rgba(0, 0, 0, 0.3));
        transform: translateX(50%) translateY(-1px) scale(1.05);
    }

    a img {
        display: block;
    }

    ${/* sc-selector */ screenM} {
        right: calc(${playlistWidth.tablet} / 2);
    }

    ${/* sc-selector */ screenXSorPortrait} {
        bottom: 10px;
        right: 50%;
    }
`;

export default DropboxButton;
