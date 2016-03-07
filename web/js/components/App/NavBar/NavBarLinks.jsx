import '@/less/nav-bar-links.less';
import React from 'react';

import NavBarLink from '@/js/components/App/NavBar/NavBarLink.jsx';


export default class NavBarLinks extends React.Component {
    render() {
        return (
            <div className='navBarLinks'>
                <ul>
                {this.props.links.map(function(link, i) {
                    return (
                        <NavBarLink key={i} link={link} />
                    );
                })}
                </ul>
            </div>
        )
    }
};
