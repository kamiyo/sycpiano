import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, IndexRedirect, browserHistory } from 'react-router';

import App from '@/js/components/App/App.jsx';
import Home from '@/js/components/Home/Home.jsx';
import About from '@/js/components/About/About.jsx';
import Contact from '@/js/components/Contact/Contact.jsx';
import Media from '@/js/components/Media/Media.jsx';
import Videos from '@/js/components/Media/Videos.jsx';

main();

function main() {
    ReactDOM.render((
        <Router history={browserHistory}>
            <Route path='/' component={App}>
                <IndexRoute component={Home} />
                <Route path='about' component={About} />
                <Route path='contact' component={Contact} />
                <Route path='media' component={Media}>
                    <IndexRedirect to='videos' />
                    <Route path='videos' component={Videos} />
                </Route>
            </Route>
        </Router>
    ), document.getElementById('hero-container'));
}