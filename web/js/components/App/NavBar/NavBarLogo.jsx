import '@/less/nav-bar-logo.less';
import React from 'react';
import {Link, IndexLink} from 'react-router';
import {LogoInstance} from '@/js/components/LogoSVG.jsx'


export default class NavBarLogo extends React.Component {
    render() {
        return (
            <IndexLink to="/" className="navBarLogo" onClick={this.props.onClick}>
                <LogoInstance/><div className="navBarLogoText">SEAN CHEN</div>
            </IndexLink>
        )
    }
};
