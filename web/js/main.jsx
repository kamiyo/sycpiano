import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import 'velocity-animate';
import 'velocity-animate/velocity.ui';

import createSycStore from '@/js/store.js';

import App from '@/js/components/App/App.jsx';

main();

function main() {
    const store = createSycStore();
    ReactDOM.render((
        <Provider store={store}>
            <BrowserRouter>
                <Switch>
                    <Route path='/' component={App} />
                </Switch>
            </BrowserRouter>
        </Provider>
    ), document.getElementById('hero-container'));
}
