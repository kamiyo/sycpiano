import React from 'react';

export default class FrontVideo extends React.Component {
    render() {
        return (
            <video autoPlay loop>
                <source src="/videos/front_fade.mp4" type="video/mp4" />
            </video>
        )
    }
}