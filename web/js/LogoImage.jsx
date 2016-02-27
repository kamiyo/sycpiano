import '../less/logo-image.less';
import React from 'react';


export default class Logo extends React.Component {
    render() {
        return (
            <img className='logoImage' src='/images/logo.svg' />
        )
    }
};
