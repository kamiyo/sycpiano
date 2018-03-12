import * as React from 'react';
import { css, cx } from 'react-emotion';
import { NavLink } from 'react-router-dom';

import { lightBlue, logoBlue } from 'src/styles/colors';
import { noHighlight } from 'src/styles/mixins';

interface SubNavLinkProps {
    readonly isHome: boolean;
    readonly basePath: string;
    readonly link: string;
    readonly onClick: () => void;
    readonly isMobile: boolean;
}

const getSubNavLinkStyle = (isMobile: boolean) => css`
    color: rgba(0, 0, 0, 0.7);
    position: relative;
    width: 100%;
    display: block;
    padding: ${isMobile ? '20' : '10'}px;
    background-color: ${isMobile ? 'transparent' : 'white'};
    text-align: center;
    box-shadow: ${isMobile ? 'none' : '0 6px 11px -5px rgba(0, 0, 0, 0.3)'};
    transition: all 0.25s;

    /* stylelint-disable */
    ${!isMobile && `
        line-height: 2rem;
        &:hover {
            background-color: ${lightBlue};
            color: white;
        }
    `}
    /* stylelint-enable */
`;

const subNavHomeStyle = css`
    color: rgba(200, 200, 200, 1);
    background-color: transparent;
    box-shadow: none;

    &:hover {
        color: rgba(255, 255, 255, 1);
        background-color: rgba(53, 53, 53, 0.27);
        box-shadow: 0 6px 11px -5px rgba(0, 0, 0, 0.5);
    }
`;

const activeCSS = css`
    background-color: ${logoBlue};
    color: white;
`;

const SubNavLink: React.SFC<SubNavLinkProps> = ({ basePath, link, onClick, isHome, isMobile }) => (
    <li className={noHighlight}>
        <NavLink
            to={`${basePath}/${link}`}
            className={cx(
                getSubNavLinkStyle(isMobile),
                { [subNavHomeStyle]: isHome && !isMobile },
            )}
            activeClassName={activeCSS}
            onClick={() => { setTimeout(() => onClick(), 250); }}
        >
            {link}
        </NavLink>
    </li>
);

export default SubNavLink;
