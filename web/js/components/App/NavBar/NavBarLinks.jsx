import '@/less/nav-bar-links.less';
import React from 'react';
import {Link} from 'react-router';


export default class NavBarLinks extends React.Component {
    render() {
        return (
            <div className='navBarLinks'>
                {this.props.links.map(function(link, i) {
                    return (
                        <div className='navLink' key={i}>
                            <Link to={'/' + link}>{link}</Link>
                        </div>
                    );
                })}
            </div>
        )
    }
};
