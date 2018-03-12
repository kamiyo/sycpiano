import * as React from 'react';
import styled, { css } from 'react-emotion';

const hamburgerLayerHeight = 3;
const hamburgerLayerBorderRadius = '0px';
const hamburgerLayerExpandRotation = 135;
const hamburgerLayerOffsetMultiple = 10;

const hamburgerMenuWidth = '35px';
const hamburgerMenuHeight = `${hamburgerLayerOffsetMultiple * 2 + hamburgerLayerHeight}px`;

const hamburgerLayerStyles = ({ backgroundColor }: { backgroundColor: string; }) => css`
    display: block;
    position: absolute;
    height: ${hamburgerLayerHeight}px;
    width: 100%;
    background-color: ${backgroundColor};
    border-radius: ${hamburgerLayerBorderRadius};
    opacity: 1;
    left: 0;
    transform: rotate(0deg);
    transition:
        transform 0.25s ease-in-out,
        left 0.25s ease-in-out,
        top 0.25s ease-in-out,
        opacity 0.25s ease-in-out,
        background-color 0.25s;
`;

interface HamburgerLayerProps {
    isExpanded: boolean;
    backgroundColor: string;
}

const HamburgerTop = styled<HamburgerLayerProps, 'span'>('span')`
    ${(props) => hamburgerLayerStyles({ backgroundColor: props.backgroundColor })};
    top: ${(props) => props.isExpanded ? hamburgerLayerOffsetMultiple : 0}px;
    transform: ${(props) => props.isExpanded ? `rotate(-${hamburgerLayerExpandRotation}deg)` : 'none'};
`;

const HamburgerMiddle = styled<HamburgerLayerProps, 'span'>('span')`
    ${(props) => hamburgerLayerStyles({ backgroundColor: props.backgroundColor })};
    top: ${hamburgerLayerOffsetMultiple}px;
    opacity: ${(props) => props.isExpanded ? 0 : 1};
    left: ${(props) => props.isExpanded ? '60px' : '0'};
`;

const HamburgerBottom = styled<HamburgerLayerProps, 'span'>('span')`
    ${(props) => hamburgerLayerStyles({ backgroundColor: props.backgroundColor })};
    top: ${(props) => props.isExpanded ? hamburgerLayerOffsetMultiple : hamburgerLayerOffsetMultiple * 2}px;
    transform: ${(props) => props.isExpanded ? `rotate(${hamburgerLayerExpandRotation}deg)` : 'none'};
`;

interface HamburgerMenuProps {
    isExpanded: boolean;
    className?: string;
    onClick: () => void;
    layerColor: string;
}

let HamburgerMenu: React.SFC<HamburgerMenuProps> = (props) => (
    <div className={props.className} onClick={props.onClick}>
        <HamburgerTop isExpanded={props.isExpanded} backgroundColor={props.layerColor} />
        <HamburgerMiddle isExpanded={props.isExpanded} backgroundColor={props.layerColor} />
        <HamburgerBottom isExpanded={props.isExpanded} backgroundColor={props.layerColor} />
    </div>
);

HamburgerMenu = styled(HamburgerMenu)`
    width: ${hamburgerMenuWidth};
    height: ${hamburgerMenuHeight};
    position: relative;
    transform: rotate(0deg);
    transition: 0.5s ease-in-out;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
`;

export { HamburgerMenu };
