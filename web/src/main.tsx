import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';

import createSycStore from 'src/store';

import App from 'src/components/App/App';

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
