//import '@/less/contact.less'
import React from 'react';
import blurbs from '@/js/components/Contact/managers.js';

export default class Contact extends React.Component {
    render() {
        return (
            <div className='contactContainer'>
                <div className='emailContainer'>
                </div>
                <div className='managersContainer'>
                    {managers.map(function(manager, i) {
                        return <div className='managerContainer' key={i}>{manager}</div>;
                    })}
                </div>
            </div>
        )
    }
}