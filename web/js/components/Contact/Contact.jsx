import '@/less/contact.less'
import React from 'react';
import Manager from '@/js/components/Contact/Manager.jsx';
import managers from '@/js/components/Contact/managers.js';

export default class Contact extends React.Component {
    render() {
        return (
            <div className='contactContainer'>
                <div>
                    <div className='emailContainer'>
                        <a href='mailto:seanchen@seanchenpiano.com'>seanchen@seanchenpiano.com</a>
                    </div>
                    <div className='managersContainer'>
                        {managers.map(function(manager, i) {
                            return <Manager {...manager} key={i} />;
                        })}
                    </div>
                </div>
            </div>
        )
    }
};