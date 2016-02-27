import '../less/nav-bar-links.less';
import React from 'react';


export default class NavBarLinks extends React.Component {
    render() {
        return (
            <div className='navBarLinks'>
                {this.props.links.map(function(link, i) {
                    return (
                        <div className='navLink' key={i} href={link.href}>
                        {link.name}
                        </div>
                    );
                })}
            </div>
        )
    }
};
