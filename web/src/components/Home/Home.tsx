import 'less/Home/home.less';

import * as React from 'react';

const Home: React.SFC<{}> = () => {
    return (
        <div className="homeContainer container">
            <div className="background-cover" />
            <div className="seanchen">
                <div className="fullname">Sean Chen</div>
                <div className="skills">pianist / composer / arranger</div>
                <div className="handle">@seanchenpiano</div>
            </div>
        </div>
    );
};

export default Home;
