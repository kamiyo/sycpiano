import * as React from 'react';
import { NavLink } from 'react-router-dom';

import { css } from '@emotion/core';
import styled from '@emotion/styled';

import { darken } from 'polished';
import { lightBlue } from 'src/styles/colors';
import { noHighlight } from 'src/styles/mixins';

interface SubNavLinkProps {
    readonly isHome: boolean;
    readonly basePath: string;
    readonly link: string;
    readonly onClick: () => void;
    readonly isMobile: boolean;
}

const StyledSubNavLink = styled(NavLink, {
    shouldForwardProp: (prop) => (prop !== 'isMobile' && prop !== 'isHome'),
})<{ isMobile: boolean; isHome: boolean }>`
    color: rgba(0, 0, 0, 0.7);
    position: relative;
    width: 100%;
    display: block;
    padding: 10px;
    background-color: white;
    text-align: center;
    box-shadow: 0 6px 11px -5px rgba(0, 0, 0, 0.3);
    transition: all 0.25s;
    line-height: 2rem;

    :hover {
        background-color: ${lightBlue};
        color: white;
    }

    &.active {
        background-color: ${lightBlue};
        color: white;
    }
`;

const mobileStyle = css`
    color: white;
    padding: 20px;
    background-color: transparent;
    box-shadow: none;

    &.active {
        background-color: ${darken(0.05, lightBlue)};
    }
`;

const homeStyle = css`
    color: rgba(200, 200, 200, 1);
    background-color: transparent;
    box-shadow: none;

    :hover {
        color: rgba(255, 255, 255, 1);
        background-color: rgba(53, 53, 53, 0.27);
        box-shadow: 0 6px 11px -5px rgba(0, 0, 0, 0.5);
    }
`;

const StyledLi = styled.li(noHighlight);

const SubNavLink: React.FC<SubNavLinkProps> = ({ basePath, link, onClick, isHome, isMobile }) => (
    <StyledLi>
        <StyledSubNavLink
            css={[isMobile && mobileStyle, isHome && homeStyle]}
            to={`${basePath}/${link}`}
            isMobile={isMobile}
            isHome={isHome}
            activeClassName={'active'}
            onClick={() => { setTimeout(() => onClick(), 250); }}
        >
            {link}
        </StyledSubNavLink>
    </StyledLi>
);

export default SubNavLink;
