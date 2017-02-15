import '@/less/App/Front/front-video.less';

import React from 'react';

export default class FrontVideo extends React.Component {
    render() {
        return (
            <div className='frontVideo'>
                <video autoPlay loop>
                    <source src="/videos/front_video.mp4" type="video/mp4" />
                    <source src="/videos/front_video.ogv" type="video/ogg" />
                    <source src="/videos/front_video.webm" type="video/webm" />
                </video>
            </div>
        )
    }
}
