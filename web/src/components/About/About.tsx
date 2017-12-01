import 'less/About/about.less';

import * as React from 'react';

import * as moment from 'moment-timezone';

import blurbs from 'src/components/About/blurbs';

const About: React.SFC<{}> = () => (
    <div className='aboutContainer container'>
        <div className='leftContainer' />
        <div className='rightContainer'>
            {blurbs.map((blurb, i) => {
                if (i === 0) {
                    const firstLetter = blurb[0];
                    const age = moment().diff('1988-08-27', 'year');
                    blurb = blurb.replace(/##/, age.toString());
                    const withoutFirstLetter = blurb.slice(1);
                    const nameLocation = withoutFirstLetter.indexOf('Sean Chen');
                    const name = withoutFirstLetter.slice(nameLocation, nameLocation + 9);
                    const beforeName = withoutFirstLetter.slice(0, nameLocation);
                    const afterName = withoutFirstLetter.slice(nameLocation + 9);
                    return (
                        <p key={i}>
                            <span className='firstLetter'>
                                {firstLetter}
                            </span>
                            {beforeName}
                            <span className='name'>
                                {name}
                            </span>
                            {afterName}
                        </p>
                    );
                }
                return <p key={i}>{blurb}</p>;
            })}
        </div>
    </div>
);

export default About;
