import * as React from 'react';
import { Transition } from 'react-transition-group';

import { TweenLite } from 'gsap';

import FrontLogo from 'js/components/App/Front/FrontLogo';
import FrontName from 'js/components/App/Front/FrontName';
import FrontVideo from 'js/components/App/Front/FrontVideo';

const logoEnter = (element: HTMLElement) => {
    TweenLite.fromTo(element, 0.8,
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, ease: 'Power3.easeOut', delay: 0.5 },
    );
};
const logoExit = (element: HTMLElement) => {
    TweenLite.fromTo(element, 0.8,
        { y: 0, opacity: 1 },
        { y: -50, opacity: 0, ease: 'Power3.easeOut' },
    );
};
const videoEnter = (element: HTMLElement) => {
    TweenLite.fromTo(element, 0.5,
        { height: 0 },
        { height: `100%`, ease: 'Power3.easeOut' },
    );
};
const videoExit = (element: HTMLElement) => {
    TweenLite.fromTo(element, 0.5,
        { height: `100%` },
        { height: 0, ease: 'Power3.easeOut' },
    );
};
const nameEnter = (element: HTMLElement) => {
    TweenLite.fromTo(element, 0.8,
        { opacity: 0 },
        { opacity: 1, ease: 'Power3.easeOut', delay: 0.5 },
    );
};
const nameExit = (element: HTMLElement) => {
    TweenLite.fromTo(element, 0.8,
        { opacity: 1 },
        { opacity: 0, ease: 'Power3.easeOut' },
    );
};

interface FrontProps {
    show: boolean;
    onClick: (event: React.MouseEvent<HTMLElement>) => void;
}

interface FrontState {
    isHover: boolean;
}

export default class Front extends React.Component<FrontProps, FrontState> {
    state = {
        isHover: false,
    };
    doMouseOver = () => {
        this.setState({ isHover: true });
    }
    doMouseOut = () => {
        this.setState({ isHover: false });
    }
    render() {
        return (
            <div className='frontContainer'>
                <Transition
                    in={this.props.show}
                    appear={true}
                    mountOnEnter={true}
                    unmountOnExit={true}
                    onEnter={nameEnter}
                    onExit={nameExit}
                    timeout={1000}
                >
                    <FrontName
                        onClick={this.props.onClick}
                        onMouseOver={this.doMouseOver}
                        onMouseOut={this.doMouseOut}
                        hover={this.state.isHover}
                    />
                </Transition>
                <Transition
                    in={this.props.show}
                    appear={true}
                    mountOnEnter={true}
                    unmountOnExit={true}
                    onEnter={logoEnter}
                    onExit={logoExit}
                    timeout={1000}
                >
                    <FrontLogo
                        onClick={this.props.onClick}
                        onMouseOver={this.doMouseOver}
                        onMouseOut={this.doMouseOut}
                        hover={this.state.isHover}
                    />
                </Transition>
                <Transition
                    in={this.props.show}
                    onEnter={videoEnter}
                    onExit={videoExit}
                    appear={true}
                    mountOnEnter={true}
                    unmountOnExit={true}
                    timeout={1000}
                >
                    <FrontVideo />
                </Transition>
            </div>
        );
    }
}
