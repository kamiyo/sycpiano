import * as React from 'react';

import SubNavLink from 'src/components/SubNav/SubNavLink';

interface SubNavProps {
    readonly basePath: string;
    readonly links: string[];
    readonly onClick: () => void;
}

const SubNav: React.SFC<SubNavProps> = ({ basePath, links, onClick }) => (
    <ul className='subNav'>
        {links.map((link, i) => (
            <SubNavLink key={i} basePath={basePath} link={link} onClick={onClick} />
        ))}
    </ul>
);

export default SubNav;
