import React from 'react';
import {VelocityTransitionGroup} from 'velocity-react';
import FrontVideo from '@/js/components/App/Front/FrontVideo.jsx';
import LogoGroup from '@/js/components/App/Front/LogoGroup.jsx';

export default class Front extends React.Component {
    render() {
        let logoEnter = {
            duration: 500,
            animation: {
                translateY: 0,
                opacity: 1
            },
            delay: 500
        };
        let logoLeave = {
            duration: 500,
            animation: {
                translateY: -50,
                opacity: 0
            }
        };
        let videoEnter = {
            duration: 500,
            animation: {
                height: `100%`
            }
        };
        let videoLeave = {
            duration: 500,
            animation: {
                height: 0
            }
        };

        return (
            <div className='frontContainer'>
                <VelocityTransitionGroup
                    runOnMount={true}
                    enter={logoEnter}
                    leave={logoLeave}
                >
                    {this.props.show && <LogoGroup/>}
                </VelocityTransitionGroup>
                <VelocityTransitionGroup
                    enter={videoEnter}
                    leave={videoLeave}
                >
                    {this.props.show && <FrontVideo/>}
                </VelocityTransitionGroup>
            </div>
        )
    }
}