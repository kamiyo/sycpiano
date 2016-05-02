import React from 'react';
import {Link, IndexLink} from 'react-router';


export default class NavBarLink extends React.Component {
    render() {
        var link = this.props.link;
        var active = 'active';
        return (
            <li className='navBarLink'>
            {(() => {
                if (link === 'home') {
                    return <IndexLink to='/' activeClassName={active}><div>{link}</div></IndexLink>;
                } else {
                    return <Link to={'/' + link} activeClassName={active}><div>{link}</div></Link>;
                }
            })()}
            </li>
        );
    }
};