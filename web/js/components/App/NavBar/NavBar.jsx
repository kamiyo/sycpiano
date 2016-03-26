import '@/less/nav-bar.less';
import '@/less/nav-bar-layout.less';
import React from 'react';

import NavBarLogo from '@/js/components/App/NavBar/NavBarLogo.jsx';
import NavBarLinks from '@/js/components/App/NavBar/NavBarLinks.jsx';


export default class NavBar extends React.Component {
    constructor() {
        super();
        this.state = {show: false};
        this.addNav = this.addNav.bind(this);
        this.removeNav = this.removeNav.bind(this);
    }
    addNav() {
        this.setState({show: true});
    }
    removeNav() {
        this.setState({show: false});
    }
    componentDidMount() {
        window.addEventListener('wheel', this.addNav);
    }
    render() {
        var cname = this.state.show ? "show" : "hide";
        cname = "navBar " + cname;
        
        var links = ['home', 'about', 'schedule', 'media', 'press', 'contact']
        return (
            <div className={cname}>
                <NavBarLogo onSubClicked={this.removeNav} />
                <NavBarLinks links={links} />
            </div>
        )
    }
};