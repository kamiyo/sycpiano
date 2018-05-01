import * as bluebird from 'bluebird';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import 'babel-polyfill';
global.Promise = bluebird;

import { Provider } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';

import 'src/styles/global';

import store from 'src/store';

import App from 'src/components/App/App';

main();

function main() {
    ReactDOM.render((
        <Provider store={store}>
            <BrowserRouter>
                <Route path="/" component={App} />
            </BrowserRouter>
        </Provider>
    ), document.getElementById('hero-container') as HTMLElement);
}
