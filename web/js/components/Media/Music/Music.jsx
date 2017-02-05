import '@/less/media/media-content.less';
import '@/less/media/music/music.less';

import React from 'react';
import ReactDOM from 'react-dom';
import { max, shuffle, sum } from 'lodash';
import $ from 'cash-dom';
import MusicList from '@/js/components/Media/Music/MusicList.jsx';

// const url = 'http://seanchenpiano.com/musicfiles/composing/improv.mp3';
const url = '/music/spellbound.mp3';

class Music extends React.Component {
    componentDidMount() {
        this.$el = $(ReactDOM.findDOMNode(this));
        this.$audio = this.$el.find('audio').first();
        this.audio = this.$audio.get(0);
        this.audio.src = url;

        this.$audio.on('loadeddata', () => {
            const audioCtx = new AudioContext();
            const audioSrc = audioCtx.createMediaElementSource(this.audio);
            this.analyser = audioCtx.createAnalyser();
            // we have to connect the MediaElementSource with the analyser 
            audioSrc.connect(this.analyser);
            this.analyser.connect(audioCtx.destination);
            this.analyser.fftSize = 32;

            // frequencyBinCount tells you how many values you'll receive from the analyser
            this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);

            this.audio.volume = 1;

            window.audio = this.audio;
        });
    }

    render() {
        return (
            <div className="mediaContent music">
                <MusicList musicItems={['blah', 'blah']} />
                <audio id="audio" crossOrigin="anonymous"/>
            </div>
            );
    }
}

export default Music;