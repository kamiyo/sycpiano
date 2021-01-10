import * as React from 'react';

import styled from '@emotion/styled';
import tint from 'polished/lib/color/tint';

import SubNavLink from 'src/components/App/NavBar/SubNav/SubNavLink';
import { LinkShape } from 'src/components/App/NavBar/types';
import { lightBlue } from 'src/styles/colors';
import { screenMorPortrait } from 'src/styles/screens';

interface SubNavProps {
    readonly className?: string;
    readonly isHome: boolean;
    readonly basePath: LinkShape;
    readonly links: LinkShape[];
    readonly onClick: () => void;
    readonly isMobile: boolean;
}

const SubNavContainer = styled.ul`
    z-index: 10;
    position: absolute;
    list-style: none;
    padding-left: 0;
    margin-top: 0;
    display: inline-block;
    transform-origin: top;
    transform: translateX(-50%);
    overflow: visible;

    ${screenMorPortrait} {
        width: 100%;
        // padding: 10px 0;
        // background-color: ${tint(0.5, lightBlue)};
        // box-shadow: inset 0 4px 5px -2px rgba(0, 0, 0, 0.2);
        position: relative;
        transform: unset;
        overflow: hidden;
    }
`;

const SubNav: React.FC<SubNavProps> = ({ links, ...props }) => (
    <SubNavContainer>
        {links.map((link, i) => (
            <SubNavLink key={i} link={link} {...props} />
        ))}
    </SubNavContainer>
);

export default React.memo(SubNav);
