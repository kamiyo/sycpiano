import '@/less/logo-image.less';
import React from 'react';


export default class Logo extends React.Component {
    render() {
        return (
            <object className='logoImage' type='image/svg+xml' data='/images/logo_opt.svg'>
                {/* fallback goes here */}
            </object>
        )
    }
};
