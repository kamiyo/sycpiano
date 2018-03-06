import * as React from 'react';
import styled from 'react-emotion';

import { tint } from 'polished';

import SubNavLink from 'src/components/App/NavBar/SubNav/SubNavLink';
import { logoBlue } from 'src/styles/colors';

interface SubNavProps {
    readonly className?: string;
    readonly isHome: boolean;
    readonly basePath: string;
    readonly links: string[];
    readonly onClick: () => void;
    readonly isMobile: boolean;
}

let SubNav: React.SFC<SubNavProps> = ({ className, links, ...props }) => (
    <ul className={className}>
        {links.map((link, i) => (
            <SubNavLink key={i} link={link} {...props} />
        ))}
    </ul>
);

SubNav = styled<SubNavProps, 'SubNav'>(SubNav)`
    z-index: 10;
    position: ${(props) => props.isMobile ? 'relative' : 'absolute'};
    list-style: none;
    padding-left: 0;
    margin-top: 0;
    display: inline-block;
    transform-origin: top;
    transform: ${(props) => props.isMobile ? 'none' : 'translateX(-50%)'};
    overflow: ${(props) => props.isMobile ? 'hidden' : 'visible'};

    /* stylelint-disable */
    ${(props) => props.isMobile && `
        width: 100%;
        padding: 10px 0;
        background-color: ${tint(0.2, logoBlue)};
        box-shadow: inset 0 4px 5px -2px rgba(0, 0, 0, 0.2);
    `}
    /* stylelint-enable */
`;

export default SubNav;
