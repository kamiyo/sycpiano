import * as React from 'react';
import { Link } from 'react-router-dom';

import styled from '@emotion/styled';

import { staticImage } from 'src/styles/imageUrls';
import { screenM, screenXSorPortrait } from 'src/styles/screens';
import { playlistWidth } from 'src/styles/variables';

const StyledDiv = styled.div`
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

    ${screenM} {
        right: calc(${playlistWidth.tablet} / 2);
    }

    ${screenXSorPortrait} {
        bottom: 10px;
        right: 50%;
    }
`;

const StyledLink = styled(Link)({ display: 'block' });

const StyledImg = styled.img({ display: 'block' });

const DropboxButton: React.FC<{}> = () => (
    <StyledDiv>
        <StyledLink to={'https://www.dropbox.com/sh/pzou7yeukjktznn/AADNCU7fmgUy_vmA3WioLiria?dl=0'} target="_blank" rel="noopener">
            <StyledImg width={50} height={50} src={staticImage(`/soc-logos/dropbox.svg`)} />
        </StyledLink>
    </StyledDiv>
);

export default DropboxButton;
