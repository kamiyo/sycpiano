import '@/less/app.less';

import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import NavBar from '@/js/components/App/NavBar/NavBar.jsx';
import '@/less/animations/route-animation.less';
import '@/less/animations/navbar-animation.less';

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {isNav: false};
        this.addNav = this.addNav.bind(this);
    }
    addNav() {
        console.log('addNav');
        this.setState({isNav: !this.state.isNav});
    }
    componentDidMount() {
        window.addEventListener('wheel', this.addNav);
    }
    render() {
        var navbar = this.state.isNav ? <NavBar/> : null;
        return (
            <div className='appContainer'>
                <ReactCSSTransitionGroup
                    transitionName='navbar'
                    transitionAppear={true}
                    transitionAppearTimeout={500}
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={500}
                >
                    {navbar}
                </ReactCSSTransitionGroup>
                <ReactCSSTransitionGroup
                    transitionName='route'
                    transitionAppear={true}
                    transitionAppearTimeout={500}
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={500}
                >
                    {React.cloneElement(this.props.children, {
                        key: this.props.location.pathname
                    })}
                </ReactCSSTransitionGroup>
            </div>
        )
    }
};
