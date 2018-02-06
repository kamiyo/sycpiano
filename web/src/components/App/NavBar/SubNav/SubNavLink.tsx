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
}

const subNavLinkStyle = css`
    color: rgba(0, 0, 0, 0.7);
    position: relative;
    width: 100%;
    height: 50px;
    display: block;
    padding: 10px;
    background-color: white;
    text-align: center;
    box-shadow: 0px 6px 11px -5px rgba(0, 0, 0, 0.3);
    transition: all 0.25s;

    &:hover {
        background-color: ${lightBlue};
        color: white;
    }
`;

const subNavHomeStyle = css`
    color: rgba(200, 200, 200, 1);
    background-color: transparent;
    box-shadow: none;

    &:hover {
        color: rgba(255, 255, 255, 1);
        background-color: rgba(53, 53, 53, 0.27);
        box-shadow: 0px 6px 11px -5px rgba(0, 0, 0, 0.5);
    }
`;

const SubNavLink: React.SFC<SubNavLinkProps> = ({ basePath, link, onClick, isHome }) => (
    <li className={noHighlight}>
        <NavLink
            to={`${basePath}/${link}`}
            className={cx(
                subNavLinkStyle,
                { [subNavHomeStyle]: isHome },
            )}
            activeClassName={css`background-color: ${logoBlue}; color: white;`}
            onClick={() => { setTimeout(() => onClick(), 250); }}
        >
            {link}
        </NavLink>
    </li>
);

export default SubNavLink;
