import 'less/App/Front/front-logo.less';

import * as React from 'react';

import { LogoInstance } from 'js/components/LogoSVG';

interface FrontLogoProps {
    hover: boolean;
}

const FrontLogo: React.SFC<FrontLogoProps & React.HTMLAttributes<HTMLElement> > = (props) => {
    const { hover, ...other } = props;
    return (
        <div className='frontLogo' >
            <LogoInstance className={hover ? 'blur-hover' : 'blur'} />
            <LogoInstance className='solid' {...other} />
        </div>
    );
};

export default FrontLogo;
