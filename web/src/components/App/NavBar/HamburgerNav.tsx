import TweenLite from 'gsap/TweenLite';
import * as React from 'react';
import { css } from 'react-emotion';
import { connect } from 'react-redux';
import { Transition } from 'react-transition-group';

import { toggleExpanded } from 'src/components/App/NavBar/actions';
import HamburgerMenu from 'src/components/App/NavBar/HamburgerMenu';
import { links } from 'src/components/App/NavBar/links';
import NavBarLinks from 'src/components/App/NavBar/NavBarLinks';
import { NavBarLinksProps } from 'src/components/App/NavBar/types';

import { GlobalStateShape } from 'src/types';

interface HamburgerNavStateToProps {
    isExpanded: boolean;
}

interface HamburgerNavDispatchToProps {
    toggleExpanded: typeof toggleExpanded;
}

class HamburgerNav extends React.Component<NavBarLinksProps & HamburgerNavDispatchToProps & HamburgerNavStateToProps, {}> {
    render() {
        return (
            <div className={css` margin: auto 0; `}>
                <HamburgerMenu
                    isExpanded={this.props.isExpanded}
                    onClick={() => this.props.toggleExpanded()}
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
                        currentBasePath={this.props.currentBasePath}
                        isMobile={this.props.isMobile}
                    />
                </Transition>
            </div>
        );
    }
}

const mapStateToProps = ({ navbar }: GlobalStateShape) => ({
    isExpanded: navbar.isExpanded,
});

export default connect<HamburgerNavStateToProps, HamburgerNavDispatchToProps>(
    mapStateToProps,
    { toggleExpanded },
)(HamburgerNav);
