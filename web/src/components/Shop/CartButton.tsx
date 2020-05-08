import * as React from 'react';

import styled from '@emotion/styled';

import { screenM, screenXSorPortrait } from 'src/styles/screens';
import { playlistWidth } from 'src/styles/variables';

const StyledDiv = styled.div`
    position: fixed;
    bottom: 25px;
    right: calc(${playlistWidth.desktop} * 2 / 3);
    transform: translateX(calc(100% / 3));
    z-index: 50;
    filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.3));
    transition: all 0.2s;

    &:hover {
        cursor: pointer;
        filter: drop-shadow(0 5px 5px rgba(0, 0, 0, 0.3));
        transform: translateX(calc(100% / 3)) translateY(-1px) scale(1.05);
    }

    ${screenM} {
        right: calc(${playlistWidth.tablet} * 2 / 3);
    }

    ${screenXSorPortrait} {
        bottom: 10px;
        right: calc(100% * 2 / 3);
    }
`;
interface ButtonProps {
    onClick: () => void;
}

const CartButton: React.FC<ButtonProps> = () => (
    <StyledDiv>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 120 120"
            height="50"
            width="50"
        >

        </svg>
    </StyledDiv>
);

export default CartButton;
