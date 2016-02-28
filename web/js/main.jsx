import '@/less/main.less';

import React from 'react';
import ReactDOM from 'react-dom';
import App from '@/js/components/App/App.jsx';

main();

function main() {
    ReactDOM.render(
        <App/>,
        document.getElementById('hero-container')
    );
}