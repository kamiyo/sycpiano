import '@/less/app.less';

import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import NavBar from '@/js/components/App/NavBar/NavBar.jsx';
import '@/less/animations/route-animation.less';

export default class App extends React.Component {
    render() {
        return (
            <div className='appContainer'>
                <NavBar/>
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
