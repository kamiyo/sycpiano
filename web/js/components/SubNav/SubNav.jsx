import React from 'react';
import ReactDOM from 'react-dom';
import SubNavLink from '@/js/components/SubNav/SubNavLink.jsx';
import {velocityHelpers, VelocityTransitionGroup} from 'velocity-react';
import Velocity from 'velocity-animate/velocity';

const Animations = {
    RightIn: velocityHelpers.registerEffect({
        calls: [
            [
                { translateX: [0, 150], opacity: 1 },
                1,
                { easing: 'ease-out', display: 'block' },
            ],
        ],
    }),
    HeightIn: velocityHelpers.registerEffect({
        calls: [
            [
                { scaleY: [1, 0] },
                1,
                { easing: 'ease-out', display: 'block' },
            ],
        ]
    })

};

export default class SubNav extends React.Component {
    componentDidMount() {
        const component = ReactDOM.findDOMNode(this);
        const subs = component.getElementsByClassName('subNavLink');
        Velocity(component, Animations.HeightIn, {
            duration: 250,
            delay: 200,
            display: 'block'
        });
        Velocity(subs, Animations.RightIn, {
            delay: 250,
            stagger: 250,
            duration: 500,
            drag: true,
            display: 'block',
        });
    }

    render() {
        return (
            <ul className='subNav' style={this.props.position}>
                {this.props.links.map(link => <SubNavLink key={link} link={link} />) }
            </ul>
        );
    }
};
