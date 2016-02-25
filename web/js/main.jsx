import React from 'react';
import ReactDOM from 'react-dom';
import '../less/main.less';
import MainBackground from './MainBackground.jsx';
import NavBar from './NavBar.jsx';

main();

function main() {
    ReactDOM.render(
        <MainBackground>
            <NavBar/>
        </MainBackground>,
        document.getElementById('hero-container')
    );
}