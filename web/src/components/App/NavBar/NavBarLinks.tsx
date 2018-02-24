import * as React from 'react';
import styled from 'react-emotion';

import { LinkShape, NavBarLinksProps } from 'src/components/App/NavBar/types';

import NavBarLink from 'src/components/App/NavBar/NavBarLink';

import { noHighlight } from 'src/styles/mixins';
import { pushed } from 'src/styles/mixins';
import { screenPortrait, screenXS } from 'src/styles/screens';

let NavBarLinks: React.SFC<NavBarLinksProps> = (props) => (
    <div className={props.className}>
        <ul>
            {props.links.map((link: LinkShape, i: number): JSX.Element => {
                return (
                    <NavBarLink
                        key={i}
                        link={link.name}
                        to={link.path}
                        subNavLinks={link.subPaths}
                        showSub={props.showSub}
                        toggleSub={props.toggleSub}
                        active={link.path === props.currentBasePath}
                        isHome={props.currentBasePath === '/'}
                        isMobile={props.isMobile}
                        closeMobileMenu={props.closeMobileMenu}
                    />
                );
            })}
        </ul>
    </div>
);

NavBarLinks = styled(NavBarLinks)`
    ${noHighlight}
    text-transform: uppercase;

    ul {
        padding: 0;
        margin: 0;
    }

    /* stylelint-disable-next-line */
    ${screenPortrait}, ${screenXS} {
        ${pushed};
        position: fixed;
        background-color: white;
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
    }
`;

export default NavBarLinks;
