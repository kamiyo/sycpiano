import '@/less/App/NavBar/sub-nav.less';

import React from 'react';
import ReactDOM from 'react-dom';
import { NavLink, Link, IndexLink, withRouter} from 'react-router';
import SubNav from '@/js/components/SubNav/SubNav.jsx';

const Highlight = ({ highlightClass, link }) => (
    <div>
        <div className={highlightClass}></div>
        <div className="hyperlink">{link}</div>
    </div>
);

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
            if (this.props.link == this.props.router.location.pathname.split('/')[1] && !this.props.showSub) {
                highlightClass += " active";
                active = 'active';
            }
        }

        return (
            <li className='navBarLink'>
                {
                    (link === 'home')
                        ? <IndexLink to='/' onClick={() => this.props.toggleSub(false)} className={active}>
                            <Highlight highlightClass={highlightClass} link={link} />
                        </IndexLink>

                        : ((link === 'media')
                            ? <a onClick={() => this.props.toggleSub()} className={active}>
                                <Highlight highlightClass={highlightClass} link={link} />
                            </a>

                            : (
                                <Link
                                    to={'/' + link}
                                    onClick={() => this.props.toggleSub(false)}
                                    className={active}
                                >
                                    <Highlight highlightClass={highlightClass} link={link} />
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
