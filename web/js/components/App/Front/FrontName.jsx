import '@/less/App/Front/front-name.less';

import React from 'react';

const FrontName = (props) => {
    let { hover, ...other } = props;
    return (
        <div className='frontName'>
            <div className={hover ? 'blur-hover' : 'blur'}>
                <div className='left'>
                    SEAN
                    </div>
                <div className='right'>
                    CHEN
                    </div>
            </div>
            <div className='solid'>
                <div className='left'>
                    <span {...other}>
                        SEAN
                        </span>
                </div>
                <div className='right'>
                    <span {...other}>
                        CHEN
                        </span>
                </div>
            </div>
        </div>
    )
};

export default FrontName;