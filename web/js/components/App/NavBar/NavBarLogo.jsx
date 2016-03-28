import '@/less/nav-bar-logo.less';
import React from 'react';
import {Link, IndexLink} from 'react-router';
import LogoImage from '@/js/components/App/NavBar/LogoImage.jsx';


export default class NavBarLogo extends React.Component {
    render() {
        return (
            <IndexLink to="/" className="navBarLogo" onClick={this.props.onClick}>
                <LogoImage /><div className="navBarLogoText">SEAN CHEN</div>
            </IndexLink>
        )
    }
};
