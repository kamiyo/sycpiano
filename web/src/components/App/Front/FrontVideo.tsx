import 'less/App/Front/front-video.less';

import * as React from 'react';

const FrontVideo: React.SFC<React.HTMLAttributes<HTMLDivElement> > = () => (
    <div className="frontVideo">
        <video autoPlay={true} loop={true}>
            <source src={`${VIDEOS_PATH}/videos/front_video.mp4`} type="video/mp4" />
            <source src={`${VIDEOS_PATH}/videos/front_video.ogv`} type="video/ogg" />
            <source src={`${VIDEOS_PATH}/videos/front_video.webm`} type="video/webm" />
        </video>
    </div>
);

export default FrontVideo;
