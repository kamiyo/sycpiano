import TweenLite from 'gsap/TweenLite';
import * as React from 'react';
import { css } from 'react-emotion';
import { Transition } from 'react-transition-group';

import { HamburgerMenu } from 'src/components/App/NavBar/HamburgerMenu';
import { links } from 'src/components/App/NavBar/links';
import NavBarLinks from 'src/components/App/NavBar/NavBarLinks';
import { NavBarLinksProps } from 'src/components/App/NavBar/types';

class HamburgerNav extends React.Component<NavBarLinksProps, { isExpanded: boolean }> {
    state = { isExpanded: false };

    setExpandedState = (toExpand?: boolean) => this.setState({
        isExpanded: (toExpand || !this.state.isExpanded),
    });

    render() {
        return (
            <div className={css`margin: auto 0;`}>
                <HamburgerMenu
                    isExpanded={this.state.isExpanded}
                    onClick={() => this.setExpandedState()}
                    layerColor={this.props.currentBasePath === '/' ? 'white' : 'black'}
                />
                <Transition
                    mountOnEnter={true}
                    unmountOnExit={true}
                    in={this.state.isExpanded}
                    onEnter={(el) => TweenLite.fromTo(el, 0.25, { opacity: 0 }, { opacity: 1 })}
                    onExit={(el) => TweenLite.fromTo(el, 0.25, { opacity: 1 }, { opacity: 0 })}
                    timeout={250}
                >
                    <NavBarLinks
                        links={links}
                        showSub={this.props.showSub}
                        toggleSub={this.props.toggleSub}
                        currentBasePath={this.props.currentBasePath}
                        isMobile={this.props.isMobile}
                        closeMobileMenu={() => this.setExpandedState(false)}
                    />
                </Transition>
            </div>
        );
    }
}

export { HamburgerNav };
