import 'less/Home/home.less';

import * as React from 'react';

class Home extends React.Component<{}, {}> {
    render() {
        return (
            <div className="homeContainer container">
                <img
                    src="/images/syc_chair_bg_1920.jpg"
                />
            </div>
        );
    }
}

export default Home;
