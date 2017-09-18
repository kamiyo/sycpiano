import '@/less/App/Front/front-logo.less';

import React from 'react';
import { LogoInstance } from '@/js/components/LogoSVG.jsx';

const FrontLogo = (props) => {
    let { hover, ...other } = props;
    return (
        <div className='frontLogo' >
            <LogoInstance className={hover ? 'blur-hover' : 'blur'} />
            <LogoInstance className='solid' {...other} />
        </div>
    )
};

export default FrontLogo;