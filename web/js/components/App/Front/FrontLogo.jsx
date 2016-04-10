import React from 'react';
import '@/less/front-logo.less';
import {LogoInstance} from '@/js/components/LogoSVG.jsx';


export default class FrontLogo extends React.Component {
    render() {
        let {hover, ...other} = this.props;
        return (
            <div className='frontLogo' >
                <LogoInstance className={hover ? 'blur-hover' : 'blur'}/>
                <LogoInstance className='solid' {...other} />
            </div>
        )
    }
}