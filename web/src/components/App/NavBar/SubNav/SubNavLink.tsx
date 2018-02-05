import * as React from 'react';
<<<<<<< HEAD
import { css, cx } from 'react-emotion';
=======
import { css } from 'react-emotion';
>>>>>>> 955740a5fdd097bea33232b11df7b9786953eb16
import { NavLink } from 'react-router-dom';

import { lightBlue, logoBlue } from 'src/styles/colors';
import { noHighlight } from 'src/styles/mixins';

interface SubNavLinkProps {
<<<<<<< HEAD
    readonly isHome: boolean;
=======
    readonly className?: string;
>>>>>>> 955740a5fdd097bea33232b11df7b9786953eb16
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
<<<<<<< HEAD
    background-color: white;
=======
    background-color: rgba(255, 255, 255, 1.0);
>>>>>>> 955740a5fdd097bea33232b11df7b9786953eb16
    text-align: center;
    box-shadow: 0px 6px 11px -5px rgba(0, 0, 0, 0.3);
    transition: all 0.25s;

    &:hover {
        background-color: ${lightBlue};
        color: white;
    }
`;

<<<<<<< HEAD
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
=======
const SubNavLink: React.SFC<SubNavLinkProps> = ({ basePath, link, onClick }) => (
    <li className={noHighlight}>
        <NavLink
            to={`${basePath}/${link}`}
            className={subNavLinkStyle}
>>>>>>> 955740a5fdd097bea33232b11df7b9786953eb16
            activeClassName={css`background-color: ${logoBlue}; color: white;`}
            onClick={() => { setTimeout(() => onClick(), 250); }}
        >
            {link}
        </NavLink>
    </li>
);

export default SubNavLink;
