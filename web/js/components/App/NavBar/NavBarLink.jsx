import '@/less/App/NavBar/sub-nav.less';

import React from 'react';
import ReactDOM from 'react-dom';
import { Link, IndexLink, withRouter } from 'react-router';
import SubNav from '@/js/components/SubNav/SubNav.jsx';

const Highlight = ({ highlightClass, link }) => (
    <div>
        <div className={highlightClass}></div>
        <div className="hyperlink">{link}</div>
    </div>
);

const NavBarLink = (props) => {
    const link = props.link;
    let highlightClass = "highlight";
    let active = '';
    if (link === 'home') {
        if (props.router.isActive('/', true) && !props.showSub) {
            highlightClass += " active";
            active = 'active';
        }
    } else if (link === 'media') {
        if (props.showSub) {
            highlightClass += " active";
            active = 'active';
        }
    } else {
        if (props.link === props.router.location.pathname.split('/')[1] && !props.showSub) {
            highlightClass += " active";
            active = 'active';
        }
    }

    return (
        <li className='navBarLink'>
            {
                (link === 'home')
                    ? <IndexLink to='/' onClick={() => props.toggleSub(false)} className={active}>
                        <Highlight highlightClass={highlightClass} link={link} />
                    </IndexLink>

                    : ((link === 'media')
                        ? <a onClick={() => props.toggleSub()} className={active}>
                            <Highlight highlightClass={highlightClass} link={link} />
                        </a>

                        : (
                            <Link
                                to={'/' + link}
                                onClick={() => props.toggleSub(false)}
                                className={active}
                            >
                                <Highlight highlightClass={highlightClass} link={link} />
                            </Link>
                        )
<<<<<<< 8dab8d5a4be659c0279157cb5b2b690a2ed90e27
                }
                {
                    (this.props.subNavLinks && this.props.showSub)
                        ? <SubNav links={this.props.subNavLinks}
                        //position={this.state.subNavPosition}
                        />
                        : null
                }
            </li>
        );
    }
};
=======
                    )
            }
            {
                (props.subNavLinks && props.showSub)
                    ? <SubNav links={props.subNavLinks} />
                    : null
            }
        </li>
    );
}
>>>>>>> convert NavBarLink to stateless class, clean up unneeded code

export default withRouter(NavBarLink);
