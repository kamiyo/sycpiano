import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, IndexRedirect, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import 'velocity-animate';
import 'velocity-animate/velocity.ui';

import createSycStore from '@/js/store.js';

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

import EventList from '@/js/components/Schedule/EventList.jsx';
import EventSingle from '@/js/components/Schedule/EventSingle.jsx';


main();

function main() {
    const store = createSycStore();
    ReactDOM.render((
        <Provider store={store}>
            <Router history={browserHistory}>
                <Route path='/' component={App}>
                    <IndexRoute component={Home} />
                    <Route path='about' component={About} />
                    <Route path='contact' component={Contact} />
                    <Route path='schedule' component={Schedule} >
                        <IndexRoute component={EventList} />
                        <Route path=':id' component={(match) => <EventSingle id={match.params.id} />} />
                    </Route>
                    <Route path='media' component={Media}>
                        <Route path='videos' component={Videos} />
                        <Route path='music' component={Music} />
                        <Route path='photos' component={Photos} />
                    </Route>
                    <Route path='press' component={() => <Press />} />
                </Route>
            </Router>
        </Provider>
    ), document.getElementById('hero-container'));
}
