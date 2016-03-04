import '@/less/about.less';
import React from 'react';
import blurbs from '@/js/components/About/blurbs.js';

export default class About extends React.Component {
    render() {
        return (
            <div className='aboutContainer'>
                <div className='leftContainer'></div>
                <div className='rightContainer'>
                    {blurbs.map(function(blurb, i) {
                        return <p key={i}>{blurb}</p>;
                    })}
                </div>
            </div>
        )
    }
};
