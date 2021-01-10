import * as React from 'react';
import { NavLink } from 'react-router-dom';

import { css } from '@emotion/core';
import styled from '@emotion/styled';

import { darken } from 'polished';
import { lightBlue, logoBlue, navFontColor } from 'src/styles/colors';
import { noHighlight } from 'src/styles/mixins';

import { LinkShape } from 'src/components/App/NavBar/types';

interface SubNavLinkProps {
    readonly isHome: boolean;
    readonly basePath: LinkShape;
    readonly link: LinkShape;
    readonly onClick: () => void;
    readonly isMobile: boolean;
}

const StyledSubNavLink = styled(NavLink, {
    shouldForwardProp: (prop) => (prop !== 'isMobile' && prop !== 'isHome'),
})<{ isMobile: boolean; isHome: boolean }>`
    color: ${navFontColor};
    position: relative;
    width: 100%;
    display: block;
    padding: 10px;
    background-color: white;
    text-align: center;
    box-shadow: 0 6px 11px -5px rgba(0, 0, 0, 0.3);
    transition: all 0.25s;
    line-height: 2rem;

    // :hover {
    //     background-color: ${lightBlue};
    //     color: white;
    // }

    &.active {
        color: ${lightBlue};
    }
`;

const mobileStyle = css`
    color: ${navFontColor};
    padding: 0.5rem 1rem 0.5rem;
    background-color: transparent;
    box-shadow: none;
    text-align: right;
`;

const homeStyle = css`
    color: white;
    background-color: transparent;
    box-shadow: none;

    :hover {
        text-shadow: 0 0 1px rgba(255, 255, 255, 1);
        background-color: rgba(53, 53, 53, 0.27);
        box-shadow: 0 6px 11px -5px rgba(0, 0, 0, 0.5);
    }
`;

const StyledLi = styled.li(noHighlight);

const SubNavLink: React.FC<SubNavLinkProps> = ({ basePath, link, onClick, isHome, isMobile }) => (
    <StyledLi className={basePath.name}>
        <StyledSubNavLink
            css={[isMobile && mobileStyle, isHome && homeStyle]}
            to={`${basePath.path}${link.path}`}
            isMobile={isMobile}
            isHome={isHome}
            activeClassName={'active'}
            onClick={() => { setTimeout(() => onClick(), 250); }}
        >
            {link.name}
        </StyledSubNavLink>
    </StyledLi>
);

export default SubNavLink;
