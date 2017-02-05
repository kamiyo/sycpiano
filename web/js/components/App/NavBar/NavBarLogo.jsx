import '@/less/nav-bar-logo.less';
import React from 'react';
import {IndexLink} from 'react-router';
import {LogoInstance} from '@/js/components/LogoSVG.jsx'


export default class NavBarLogo extends React.Component {
    render() {
        return (
            <div className="navBarLogo" {...this.props}>
                <LogoInstance/><div className="navBarLogoText"><span>SEAN CHEN</span></div>
            </div>
        )
    }
};
