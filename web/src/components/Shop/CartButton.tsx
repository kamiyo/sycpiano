import * as React from 'react';

import styled from '@emotion/styled';

import { screenM, screenXSorPortrait } from 'src/styles/screens';
import { playlistWidth, cartWidth } from 'src/styles/variables';
import { magenta, lightBlue, logoBlue } from 'src/styles/colors';
import { mix } from 'polished';

const StyledDiv = styled.div`
    width: 50px;
    height: 50px;
    position: fixed;
    bottom: 25px;
    right: calc(${cartWidth}px * 0.5);
    transform: translateX(calc(100% / 2));
    z-index: 50;
    filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.3));
    transition: all 0.2s;
    border-radius: 50%;
    background-color: ${mix(0.75, logoBlue, '#FFF')};
    fill: white;
    stroke: white;
    perspective: 500px;

    &:hover {
        cursor: pointer;
        filter: drop-shadow(0 5px 5px rgba(0, 0, 0, 0.3));
        transform: translateX(calc(100% / 2)) translateY(-1px) scale(1.05);
    }

    ${screenM} {
        right: calc(${playlistWidth.tablet} * 0.5);
    }

    ${screenXSorPortrait} {
        bottom: 10px;
        right: calc(100% * 0.5);
    }
`;

const StyledIcon = styled.svg`
    vertical-align: middle;
`;

const Flipper = styled.div({
    position: 'absolute',
    backfaceVisibility: 'hidden',
});

const FlipGroup = styled.div<{ cartOpen: boolean }>(
    {
        position: 'relative',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.25s',
        transform: 'rotateY(0)',
    },
    props => props.cartOpen ? {
        transform: 'rotateY(180deg)',
    } : {}
);

interface ButtonProps {
    onClick: () => void;
    cartOpen: boolean;
}

const CartButton: React.FC<ButtonProps> = ({ onClick, cartOpen }) => (
    <StyledDiv onClick={onClick}>
        <FlipGroup cartOpen={cartOpen}>
            <Flipper css={{ transform: 'rotateY(0)' }}>
                <StyledIcon
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="-4 -5 32 32"
                    height="50"
                    width="50"
                >
                    <path strokeWidth="0" d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 3c0 .55.45 1 1 1h1l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h11c.55 0 1-.45 1-1s-.45-1-1-1H7l1.1-2h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.37-.66-.11-1.48-.87-1.48H5.21l-.67-1.43c-.16-.35-.52-.57-.9-.57H2c-.55 0-1 .45-1 1zm16 15c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
                </StyledIcon>
            </Flipper>
            <Flipper css={{ transform: 'rotateY(180deg)' }}>
                <StyledIcon
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 120 120"
                    height="50"
                    width="50"
                >
                    <path d="M40 40L80 80M40 80L80 40" strokeLinecap="round" strokeWidth="12" />
                </StyledIcon>
            </Flipper>
        </FlipGroup>
    </StyledDiv>
);

export default CartButton;
