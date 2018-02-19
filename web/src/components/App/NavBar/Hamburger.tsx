import * as React from 'react';
import styled, { css } from 'react-emotion';

const hamburgerMenuWidth = '60px';
const hamburgerMenuHeight = '45px';

const hamburgerLayerHeight = '9px';
const hamburgerLayerColor = '#d3531a';
const hamburgerLayerBorderRadius = '9px';
const hamburgerLayerExpandRotation = 135;
const hamburgerLayerSpacing = 15;

const hamburgerLayerStyles = css`
    display: block;
    position: absolute;
    height: ${hamburgerLayerHeight};
    width: 100%;
    background: ${hamburgerLayerColor};
    border-radius: ${hamburgerLayerBorderRadius};
    opacity: 1;
    left: 0;
`;

interface HamburgerLayerProps {
    isExpanded: boolean;
}

const HamburgerTop = styled<HamburgerLayerProps, 'span'>('span')`
    ${hamburgerLayerStyles};
    top: ${(props) => props.isExpanded ? hamburgerLayerSpacing : 0}px;
    transform: ${(props) => props.isExpanded ? `rotate(${hamburgerLayerExpandRotation}deg)` : 'none'};
`;

const HamburgerMiddle = styled<HamburgerLayerProps, 'span'>('span')`
    ${hamburgerLayerStyles};
    top: ${hamburgerLayerSpacing}px;
    opacity: ${(props) => props.isExpanded ? 0 : 'inherit'};
    left: ${(props) => props.isExpanded ? '-60px' : 'inherit'};
`;

const HamburgerBottom = styled<HamburgerLayerProps, 'span'>('span')`
    ${hamburgerLayerStyles};
    top: ${hamburgerLayerSpacing * 2}px;
    transform: ${(props) => props.isExpanded ? `rotate(${-1 * hamburgerLayerExpandRotation}deg)` : 'none'};
`;

interface HamburgerMenuProps {
    isExpanded: boolean;
    className?: string;
}

let HamburgerMenu: React.SFC<HamburgerMenuProps> = (props) => (
    <div className={props.className}>
        <HamburgerTop isExpanded={props.isExpanded} />
        <HamburgerMiddle isExpanded={props.isExpanded} />
        <HamburgerBottom isExpanded={props.isExpanded} />
    </div>
);

HamburgerMenu = styled(HamburgerMenu)`
    width: ${hamburgerMenuWidth};
    height: ${hamburgerMenuHeight};
    position: relative;
    transform: rotate(0deg);
    transition: .5s ease-in-out;
    cursor: pointer;
`;

export { HamburgerMenu };
