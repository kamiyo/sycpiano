import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router'

import App from '@/js/components/App/App.jsx';
import Home from '@/js/components/Home/Home.jsx';
import About from '@/js/components/About/About.jsx';

main();

function main() {
    ReactDOM.render((
        <Router history={browserHistory}>
            <Route path='/' component={App}>
                <IndexRoute component={Home}/>
                <Route path='about' component={About}/>
            </Route>
        </Router>
    ), document.getElementById('hero-container'));
}