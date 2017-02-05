import '@/less/sub-nav.less';

import React from 'react';
import ReactDOM from 'react-dom';
import {Link, IndexLink, withRouter} from 'react-router';
import SubNav from '@/js/components/SubNav/SubNav.jsx';


class NavBarLink extends React.Component {
    state = {
        subNavPosition: { top: 0, right: 0 },
    };

    componentDidMount() {
        if (this.props.subNavLinks) {
            // TODO: find a way to do this without timeout
            setTimeout(() => {
                const dims = ReactDOM.findDOMNode(this).getBoundingClientRect();
                this.setState({
                    subNavPosition: {
                        top: dims.top + dims.height,
                        right: window.outerWidth - dims.left - dims.width,
                        width: dims.width
                    }
                });
            }, 100);

        }
    }

    // breaks route updating
    /*shouldComponentUpdate(nextProps, nextState) {
        return nextState.subNavPosition.top !== this.state.subNavPosition.top
            || nextState.subNavPosition.right !== this.state.subNavPosition.right
            || nextState.subNavPosition.width !== this.state.subNavPosition.width;
    }*/

    render() {
        const link = this.props.link;
        let highlightClass = "highlight";
        let active = '';
        if (link === 'home') {
            if (this.props.router.isActive('/', true) && !this.props.showSub) {
                highlightClass += " active";
                active = 'active';
            }
        } else if (link === 'media') {
            if (this.props.showSub) {
                highlightClass += " active";
                active = 'active';
            }
        } else {
            if (this.props.router.isActive(link, false) && !this.props.showSub) {
                highlightClass += " active";
                active = 'active';

            }
        }

        return (
            <li className='navBarLink'>
                {
                    (link === 'home')
                        ? <IndexLink to='/' onClick={() => this.props.toggleSub(false)} className={active}>
                            <div className={highlightClass}></div>
                            <div className="hyperlink">{link}</div>
                        </IndexLink>

                        : ((link === 'media')
                            ? <a onClick={() => this.props.toggleSub()} className={active}>
                                <div className={highlightClass}></div>
                                <div className="hyperlink">{link}</div>
                            </a>

                            : (
                                <Link to={'/' + link} onClick={() => this.props.toggleSub(false)} className={active}>
                                    <div className={highlightClass}></div>
                                    <div className="hyperlink">{link}</div>
                                </Link>
                            )
                        )
                }
                {
                    (this.props.subNavLinks && this.props.showSub)
                        ? <SubNav links={this.props.subNavLinks} position={this.state.subNavPosition} />
                        : null
                }
            </li>
        );
    }
};

export default withRouter(NavBarLink);