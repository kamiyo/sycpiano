import * as React from 'react';
import styled from 'react-emotion';

import { LinkShape, NavBarLinksProps } from 'src/components/App/NavBar/types';

import NavBarLink from 'src/components/App/NavBar/NavBarLink';

import { noHighlight } from 'src/styles/mixins';
import { pushed } from 'src/styles/mixins';
import { screenMorPortrait } from 'src/styles/screens';

const StyledUL = styled('ul')`
    padding: 0;
    margin: 0;

    ${/* sc-selector */ screenMorPortrait} {
        display: flex;
        flex-direction: column;
        width: 100%;
        padding-top: 1.8rem;
        overflow-y: auto;
    }
`;

let NavBarLinks: React.SFC<NavBarLinksProps> = (props) => (
    <div className={props.className}>
        <StyledUL>
            {props.links.map((link: LinkShape, i: number): JSX.Element => {
                return (
                    <NavBarLink
                        key={i}
                        link={link.name}
                        to={link.path}
                        subNavLinks={link.subPaths}
                        active={link.path === props.currentBasePath}
                        isHome={props.currentBasePath === '/'}
                        isMobile={props.isMobile}
                    />
                );
            })}
        </StyledUL>
    </div>
);

NavBarLinks = styled(NavBarLinks)`
    ${noHighlight}
    text-transform: uppercase;

    /* stylelint-disable-next-line */
    ${/* sc-selector */ screenMorPortrait} {
        ${pushed};
        position: fixed;
        background-color: white;
        left: 0;
        top: 0;
        width: 100%;
        padding-left: calc(100vw - 100%);
        display: flex;
        justify-content: center;
        box-shadow: inset 0 7px 6px -5px rgba(0, 0, 0, 0.25);
        visibility: hidden;
    }
`;

export default NavBarLinks;
