import styled from '@emotion/styled';
import * as React from 'react';

import { LinkShape, NavBarLinksProps } from 'src/components/App/NavBar/types';

import { links } from 'src/components/App/NavBar/links';
import NavBarLink from 'src/components/App/NavBar/NavBarLink';

import { noHighlight, pushedDesktop, pushedMobile } from 'src/styles/mixins';
import { screenMorPortrait, screenXSorPortrait } from 'src/styles/screens';

const StyledUL = styled.ul`
    padding: 0;
    margin: 0;

    ${screenMorPortrait} {
        display: flex;
        flex-direction: column;
        width: 100%;
        padding-top: 1.8rem;
        overflow-y: auto;
        overflow-x: hidden;
        align-items: flex-end;
    }
`;

const LinksDiv = styled.div<{ isHome: boolean }>`
    ${noHighlight}
    text-transform: uppercase;

    ${screenMorPortrait} {
        ${pushedDesktop}
        position: fixed;
        background: ${props => props.isHome ? 'transparent' : 'linear-gradient(90deg, transparent 0% 25%, white 55%)'};
        left: 0;
        top: 0;
        width: 100%;
        padding-left: calc(100vw - 100%);
        display: flex;
        justify-content: center;
        box-shadow: inset 0 7px 6px -5px rgba(0, 0, 0, 0.25);

        ${screenXSorPortrait} {
            ${pushedMobile}
        }
    }
`;

const NavBarLinks: React.FC<NavBarLinksProps> = (props) => (
    <LinksDiv isHome={props.currentBasePath === '/'}>
        <StyledUL>
            {links.map((link: LinkShape, i: number): JSX.Element => {
                return (
                    <NavBarLink
                        key={i}
                        link={link}
                        subNavLinks={link.subLinks}
                        active={link.path === props.currentBasePath}
                        isHome={props.currentBasePath === '/'}
                        isMobile={props.isMobile}
                    />
                );
            })}
        </StyledUL>
    </LinksDiv>
);

export default React.memo(NavBarLinks);
