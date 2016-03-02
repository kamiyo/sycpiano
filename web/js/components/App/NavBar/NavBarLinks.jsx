import '@/less/nav-bar-links.less';
import React from 'react';
import {Link, IndexLink} from 'react-router';


export default class NavBarLinks extends React.Component {
    render() {
        return (
            <div className='navBarLinks'>
                <ul>
                {this.props.links.map(function(link, i) {
                    return (
                        <li className='navLink' key={i}>
                        {(() => {
                            if (link === 'home') {
                                return <IndexLink to='/'>{link}</IndexLink>
                            } else {
                                return <Link to={'/' + link}>{link}</Link>
                            }
                        })()}
                        </li>
                    );
                })}
                </ul>
            </div>
        )
    }
};
