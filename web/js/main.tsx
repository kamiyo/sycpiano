import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux';

import createSycStore from 'js/store';

import App from 'js/components/App/App';

main();

function main() {
    const store = createSycStore();
    ReactDOM.render((
        <Provider store={store}>
            <BrowserRouter>
                <Route path='/' component={App} />
            </BrowserRouter>
        </Provider>
    ), document.getElementById('hero-container') as HTMLElement);
}
