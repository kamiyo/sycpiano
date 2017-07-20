import '@/less/Press/press.less';

import React from 'react';
import { Provider } from 'react-redux';

import AcclaimsList from '@/js/components/Press/AcclaimsList.jsx';

const Press = ({ store }) => (
    <Provider store={store}>
        <div className="press">
            <AcclaimsList />
        </div>
    </Provider>
);

export default Press;
