import '@/less/sub-nav.less';

import React from 'react';
import ReactDOM from 'react-dom';
import {Link, IndexLink} from 'react-router';
import SubNav from '@/js/components/SubNav/SubNav.jsx';


export default class NavBarLink extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            subNavPosition: { top: 0, right: 0 }
        };
    }

    componentDidMount() {
        if (this.props.subNavLinks) {
            // TODO: find a way to do this without timeout
            setTimeout(() => {
                let dims = ReactDOM.findDOMNode(this).getBoundingClientRect();
                this.setState({ subNavPosition:
                    {
                        top: dims.top + dims.height,
                        right: 0,
                        width: window.outerWidth - dims.left
                    }
                });
            }, 100);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.subNavPosition.top !== this.state.subNavPosition.top
            || nextState.subNavPosition.right !== this.state.subNavPosition.right
            || nextState.subNavPosition.width !== this.state.subNavPosition.width;
    }

    render() {
        var link = this.props.link;
        var active = 'active';
        return (
            <li className='navBarLink'>
                {
                    (link === 'home')
                        ? <IndexLink to='/' activeClassName={active}><div>{link}</div></IndexLink>
                        : <Link to={'/' + link} activeClassName={active}><div>{link}</div></Link>
                }
                {
                    this.props.subNavLinks
                        ? <SubNav links={this.props.subNavLinks} position={this.state.subNavPosition} />
                        : null
                }
            </li>
        );
    }
};