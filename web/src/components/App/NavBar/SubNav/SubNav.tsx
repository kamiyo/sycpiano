import * as React from 'react';
import styled from 'react-emotion';

import SubNavLink from 'src/components/App/NavBar/SubNav/SubNavLink';

interface SubNavProps {
    readonly className?: string;
<<<<<<< HEAD
    readonly isHome: boolean;
=======
>>>>>>> 955740a5fdd097bea33232b11df7b9786953eb16
    readonly basePath: string;
    readonly links: string[];
    readonly onClick: () => void;
}

<<<<<<< HEAD
let SubNav: React.SFC<SubNavProps> = ({ className, basePath, links, onClick, isHome }) => (
    <ul className={className}>
        {links.map((link, i) => (
            <SubNavLink key={i} basePath={basePath} link={link} onClick={onClick} isHome={isHome} />
=======
let SubNav: React.SFC<SubNavProps> = ({ className, basePath, links, onClick }) => (
    <ul className={className}>
        {links.map((link, i) => (
            <SubNavLink key={i} basePath={basePath} link={link} onClick={onClick} />
>>>>>>> 955740a5fdd097bea33232b11df7b9786953eb16
        ))}
    </ul>
);

SubNav = styled(SubNav)`
    z-index: 10;
    position: absolute;
    list-style: none;
    padding-left: 0;
    margin-top: 0;
    display: inline-block;
    transform-origin: top;
    transform: translateX(-50%);
`;

export default SubNav;
