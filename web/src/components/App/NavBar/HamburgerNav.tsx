import TweenLite from 'gsap/TweenLite';
import * as React from 'react';
import { css } from 'react-emotion';
import { Transition } from 'react-transition-group';

import { HamburgerMenu } from 'src/components/App/NavBar/HamburgerMenu';
import { links } from 'src/components/App/NavBar/links';
import NavBarLinks from 'src/components/App/NavBar/NavBarLinks';
import { NavBarLinksProps } from 'src/components/App/NavBar/types';

class HamburgerNav extends React.Component<NavBarLinksProps, {}> {
    render() {
        return (
            <div className={css` margin: auto 0; `}>
                <HamburgerMenu
                    isExpanded={this.props.isExpanded}
                    onClick={() => this.props.closeMobileMenu()}
                    layerColor={this.props.currentBasePath === '/' && !this.props.isExpanded ? 'white' : 'black'}
                />
                <Transition
                    in={this.props.isExpanded}
                    onEnter={(el) => TweenLite.to(el, 0.25, { autoAlpha: 1 })}
                    onExit={(el) => TweenLite.to(el, 0.25, { autoAlpha: 0 })}
                    timeout={250}
                >
                    <NavBarLinks
                        links={links}
                        showSubs={this.props.showSubs}
                        toggleSub={this.props.toggleSub}
                        currentBasePath={this.props.currentBasePath}
                        isMobile={this.props.isMobile}
                        isExpanded={this.props.isExpanded}
                        closeMobileMenu={() => this.props.closeMobileMenu(false)}
                    />
                </Transition>
            </div>
        );
    }
}

export { HamburgerNav };
