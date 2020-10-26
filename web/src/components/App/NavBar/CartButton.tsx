import * as React from 'react';
import { ReferenceObject } from 'popper.js'

import { css } from '@emotion/core';
import styled from '@emotion/styled';

import { screenM, screenXSorPortrait } from 'src/styles/screens';
import { playlistWidth, cartWidth } from 'src/styles/variables';
import { magenta, lightBlue, logoBlue } from 'src/styles/colors';
import { mix } from 'polished';
import { noHighlight } from 'src/styles/mixins';
import { useSelector, useDispatch } from 'react-redux';
import { GlobalStateShape } from 'src/types';
import { toggleCartListAction } from 'src/components/Cart/actions';

const cartStyle = css`
    ${noHighlight}
    fill: rgba(0, 0, 0, 0.7);
    text-decoration: none;
    cursor: pointer;
    transition: all 0.5s;
    -webkit-tap-highlight-color: transparent;
    padding-bottom: 12px;

    &:hover {
        cursor: pointer;
        fill: ${mix(0.5, logoBlue, '#444')};
    }
`;

const cartHomeStyle = css`
    fill: white;
    filter: drop-shadow(0 0 1px rgba(0, 0, 0, 0.8));

    &:hover {
        fill: white;
        filter: drop-shadow(0 0 1px rgba(255, 255, 255, 1));
    }
`;

const StyledCart = styled.div<{ isHome: boolean }>(
    cartStyle,
    ({ isHome }) => isHome && cartHomeStyle,
);

const StyledIcon = styled.svg`
    vertical-align: middle;
`;

interface CartButtonProps {
    isHome?: boolean;
    setReferenceElement: React.Dispatch<React.SetStateAction<ReferenceObject>>;
}

const CartButton = (
    { isHome, setReferenceElement }: CartButtonProps,
) => {
    const cartCount = useSelector(({ cart }: GlobalStateShape) => cart.items.length);
    const dispatch = useDispatch();

    return (
        <StyledCart onClick={() => dispatch(toggleCartListAction())} isHome={isHome} ref={(el) => { console.log(el); setReferenceElement(el); }}>

            <StyledIcon
                xmlns="http://www.w3.org/2000/svg"
                viewBox="-4 -5 32 32"
                height="36"
                width="36"
            >
                <path strokeWidth="0" d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 3c0 .55.45 1 1 1h1l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h11c.55 0 1-.45 1-1s-.45-1-1-1H7l1.1-2h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.37-.66-.11-1.48-.87-1.48H5.21l-.67-1.43c-.16-.35-.52-.57-.9-.57H2c-.55 0-1 .45-1 1zm16 15c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
            </StyledIcon>

        </StyledCart>
    );
};

export default CartButton;
