import '@/less/about.less';
import React from 'react';
import blurbs from '@/js/components/About/blurbs.js';

export default class About extends React.Component {
    render() {
        return (
            <div className='aboutContainer container'>
                <div className='leftContainer'></div>
                <div className='rightContainer'>
                    {blurbs.map((blurb, i) => {
                        if (i == 0) {
                            let firstLetter = blurb[0];
                            let withoutFirstLetter = blurb.slice(1);
                            let nameLocation = withoutFirstLetter.indexOf('Sean Chen');
                            let name = withoutFirstLetter.slice(nameLocation, nameLocation + 9);
                            let beforeName = withoutFirstLetter.slice(0, nameLocation);
                            let afterName = withoutFirstLetter.slice(nameLocation + 9);
                            return (
                                <p key={i}><span className='firstLetter'>{firstLetter}</span>{beforeName}<span className='name'>{name}</span>{afterName}</p>
                            )
                        }
                        return <p key={i}>{blurb}</p>;
                    })}
                </div>
            </div>
        )
    }
};
