import * as React from 'react';
import styled from 'react-emotion';

import SubNavLink from 'src/components/App/NavBar/SubNav/SubNavLink';

interface SubNavProps {
    readonly className?: string;
    readonly isHome: boolean;
    readonly basePath: string;
    readonly links: string[];
    readonly onClick: () => void;
    readonly isMobile: boolean;
}

let SubNav: React.SFC<SubNavProps> = ({ className, basePath, links, onClick, isHome }) => (
    <ul className={className}>
        {links.map((link, i) => (
            <SubNavLink key={i} basePath={basePath} link={link} onClick={onClick} isHome={isHome} />
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
`;

export default SubNav;
