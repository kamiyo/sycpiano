import 'less/App/Front/front-name.less';

import * as React from 'react';

interface FrontNameProps {
    readonly hover: boolean;
}

const FrontName: React.SFC<FrontNameProps & React.HTMLAttributes<HTMLDivElement> > = (props) => {
    const { hover, ...other } = props;
    return (
        <div className="frontName">
            <div className={hover ? 'blur-hover' : 'blur'}>
                <div className="left">
                    SEAN
                    </div>
                <div className="right">
                    CHEN
                    </div>
            </div>
            <div className="solid">
                <div className="left">
                    <span {...other}>
                        SEAN
                        </span>
                </div>
                <div className="right">
                    <span {...other}>
                        CHEN
                        </span>
                </div>
            </div>
        </div>
    );
};

export default FrontName;
