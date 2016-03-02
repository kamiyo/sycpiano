import '@/less/app.less';

import React from 'react';
import NavBar from '@/js/components/App/NavBar/NavBar.jsx';

export default class App extends React.Component {
    render() {
        return (
            <div className='appContainer'>
                <NavBar/>
                {this.props.children}
            </div>
        )
    }
};
