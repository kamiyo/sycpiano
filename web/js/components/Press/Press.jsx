import '@/less/Press/press.less';

import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import AcclaimsList from '@/js/components/Press/AcclaimsList.jsx';
import { acclaimsListReducer } from '@/js/components/Press/reducers.js';

const store = createStore(acclaimsListReducer);

const Press = () => {
    return (
        <Provider store={store}>
            <div className="press">
                <AcclaimsList />
            </div>
        </Provider>
    );
};

export default Press;
