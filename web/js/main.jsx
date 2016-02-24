import React from 'react';
import ReactDOM from 'react-dom';
import '../less/main.less';
import MainBackground from './MainBackground.jsx';

main();

function main() {
    ReactDOM.render(<MainBackground />, document.getElementById('hero-container'));
}