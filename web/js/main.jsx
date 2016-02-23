import React from 'react';
import ReactDOM from 'react-dom';
import '../less/main.less';
import Header from './component.jsx';

main();

function main() {
    ReactDOM.render(<Header />, document.getElementById('header'));
}