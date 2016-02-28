import '@/less/main.less';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory } from 'react-router'
import MainBackground from '@/js/components/App/MainBackground.jsx';
import NavBar from '@/js/components/App/NavBar.jsx';

export default class App extends React.Component {
    render() {
        return (
            <MainBackground>
                <NavBar/>
            </MainBackground>
        )
    }
};

ReactDOM.render((
    <Router history={browserHistory}>
        <Route path='/' component={App}>
        </Route>
    </Router>
), document.getElementById('router'));
