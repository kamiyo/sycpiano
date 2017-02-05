import '@/less/media/music/music-nav.less';

import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'cash-dom';
import Velocity from 'velocity-animate/velocity';
import { velocityHelpers } from 'velocity-react';
import MusicNavLink from '@/js/components/Media/Music/MusicNavLink.jsx';

export default class MusicNav extends React.Component {
    initializeZIndices() {
        this.links.each((el, idx) => el.style.zIndex = this.props.musicCategories.length - idx);
    }

    calculateWidths() {
        const widths = [];
        this.links.each(el => widths.push(el.offsetWidth));

        this.offsets = [0];

        for (let i = 0; i < widths.length; i++) {
            this.offsets.push(this.offsets[i] + widths[i]);
        }
    }

    initializeAnimations() {
        this.animations = {};
        this.animations.LeftIn = this.props.musicCategories.map((c, i) => velocityHelpers.registerEffect({
            calls: [
                [{
                    translateX: [0, -this.offsets[i]],
                    opacity: 1
                }, 1, {
                        easing: 'ease-out',
                        display: 'inline-block'
                }]
            ]
        }));

        this.links.each((el, idx) => {
            Velocity(el, this.animations.LeftIn[idx], {
                delay: 250,
                duration: 600,
                display: 'inline-block'
            });
        });
    }

    componentDidMount() {
        this.links = $('.music-nav-link', ReactDOM.findDOMNode(this));
        this.initializeZIndices();
        this.calculateWidths();
        this.initializeAnimations();
    }

    render() {
        const items = this.props.musicCategories.map(category =>
            <MusicNavLink category={category} onClick={this.props.setActiveCategory} key={category} />)

        return (
            <ul className="music-nav">
                {items}
            </ul>
        );
    }
}