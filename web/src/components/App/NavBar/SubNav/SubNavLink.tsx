import * as React from 'react';
import { css } from 'react-emotion';
import { NavLink } from 'react-router-dom';

import { lightBlue, logoBlue } from 'src/styles/colors';
import { noHighlight } from 'src/styles/mixins';

interface SubNavLinkProps {
    readonly className?: string;
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
    background-color: rgba(255, 255, 255, 1.0);
    text-align: center;
    box-shadow: 0px 6px 11px -5px rgba(0, 0, 0, 0.3);
    transition: all 0.25s;

    &:hover {
        background-color: ${lightBlue};
        color: white;
    }
`;

const SubNavLink: React.SFC<SubNavLinkProps> = ({ basePath, link, onClick }) => (
    <li className={noHighlight}>
        <NavLink
            to={`${basePath}/${link}`}
            className={subNavLinkStyle}
            activeClassName={css`background-color: ${logoBlue}; color: white;`}
            onClick={() => { setTimeout(() => onClick(), 250); }}
        >
            {link}
        </NavLink>
    </li>
);

export default SubNavLink;
