import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, IndexRedirect, browserHistory } from 'react-router';
import 'velocity-animate';
import 'velocity-animate/velocity.ui';

import App from '@/js/components/App/App.jsx';
import Home from '@/js/components/Home/Home.jsx';
import About from '@/js/components/About/About.jsx';
import Contact from '@/js/components/Contact/Contact.jsx';
import Schedule from '@/js/components/Schedule/Schedule.jsx';
import Press from '@/js/components/Press/Press.jsx';

import Media from '@/js/components/Media/Media.jsx';
import Videos from '@/js/components/Media/Videos/Videos.jsx';
import Music from '@/js/components/Media/Music/Music.jsx';
import Photos from '@/js/components/Media/Photos/Photos.jsx';

main();

function main() {
    ReactDOM.render((
        <Router history={browserHistory}>
            <Route path='/' component={App}>
                <IndexRoute component={Home} />
                <Route path='about' component={About} />
                <Route path='contact' component={Contact} />
                <Route path='schedule' component={Schedule} />
                <Route path='media' component={Media}>
                    <Route path='videos' component={Videos} />
                    <Route path='music' component={Music} />
                    <Route path='photos' component={Photos} />
                </Route>
                <Route path='press' component={Press} />
            </Route>
        </Router>
    ), document.getElementById('hero-container'));
}
