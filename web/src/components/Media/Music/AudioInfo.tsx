import * as React from 'react';
import styled, { css } from 'react-emotion';

import TweenLite from 'gsap/TweenLite';

import { formatTime } from 'src/utils';

import { MusicItem } from 'src/components/Media/Music/types';

import { lato1 } from 'src/styles/fonts';
import { noHighlight } from 'src/styles/mixins';
import { navBarHeight, playlistWidth } from 'src/styles/variables';

interface AudioInfoProps {
    currentTrack: MusicItem;
    duration: number;
    currentPosition: number;
    isMobile: boolean;
}

const AudioInfoContainer = styled<{ isMobile: boolean; }, 'div'>('div') `
    ${noHighlight}
    width: ${(props) => props.isMobile ? `100%` : `calc(100% - ${playlistWidth}px)`};
    height: ${(props) => (props.isMobile) ? '450px' : '100%'};
    z-index: 10;
    position: absolute;
    top: ${(props) => props.isMobile ? navBarHeight.mobile : 0}px;
    left: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    text-align: center;
    font-family: ${lato1};
    letter-spacing: 2px;
    color: white;
    padding-bottom: ${(props) => props.isMobile ? '1rem' : '3rem'};
`;

const getAudioInfoStyle = (isMobile: boolean) => css`
    padding: 0 10px;
    line-height: ${isMobile ? '2rem' : '3.2rem'};
`;

const Movement = styled<{ isMobile: boolean; }, 'div'>('div') `
    ${(props) => getAudioInfoStyle(props.isMobile)}
    font-size: ${(props) => props.isMobile ? '1.4rem' : '2.2rem'};
`;

const Contributing = styled<{ isMobile: boolean; }, 'div'>('div') `
    ${(props) => getAudioInfoStyle(props.isMobile)}
    font-size: ${(props) => props.isMobile ? '1.3rem' : '2rem'};
`;

const composerTitleStyle = (isMobile?: boolean) => css`
    ${getAudioInfoStyle(isMobile)}
    font-size: ${isMobile ? '1.4rem' : '2.2rem'};

    /* stylelint-disable */
    ${isMobile && `
        width: 100%;
        white-space: nowrap;
        overflow-x: hidden;

        div {
            width: fit-content;
            position: relative;

            span {
                display: inline-block;
                &:last-child {
                    margin: 0 200px;
                }
            }
        }
    `}
    /* stylelint-enable */
`;

interface ComposerTitleProps {
    composer: string;
    year: number;
    piece: string;
    movement?: string;
    isMobile?: boolean;
    divRef: (div: HTMLDivElement) => void;
    marqueeRef: (div: HTMLDivElement) => void;
}

const ComposerTitle: React.SFC<ComposerTitleProps> = ({ composer, year, piece, movement, divRef, marqueeRef, isMobile }) => {
    const composerTitle = composer + ' ' + piece + (year ? ` (${year})` : '') + (isMobile && movement ? ': ' + movement : '');
    const child = isMobile ? (
        <div ref={marqueeRef}>
            <span>{composerTitle}</span><span>{composerTitle}</span>
        </div>
    ) : composerTitle;
    return (
        <div className={composerTitleStyle(isMobile)} ref={divRef}>{child}</div>
    );
};

const durationStyle = (isMobile?: boolean) => css`
    ${getAudioInfoStyle(isMobile)}
    font-size: ${isMobile ? '1.3rem' : '2rem'};
`;

const Duration: React.SFC<{ currentPosition: number; duration: number, isMobile: boolean; }> = ({ currentPosition, duration, isMobile }) => (
    <div className={durationStyle(isMobile)}>{`${formatTime(currentPosition)} / ${formatTime(duration)}`}</div>
);

class AudioInfo extends React.Component<AudioInfoProps, {}> {
    private tween: any;
    private titleDiv: HTMLDivElement;
    private marquee: HTMLDivElement;

    componentDidUpdate(prevProps: AudioInfoProps) {
        console.log('here');
        if (this.props.isMobile && this.props.currentTrack && (
            !prevProps.currentTrack ||
            prevProps.currentTrack.musicFiles[0].id !== this.props.currentTrack.musicFiles[0].id
        )) {
            this.tween && this.tween.kill();
            this.marquee.removeAttribute('style');
            this.titleDiv.removeAttribute('style');
            const divWidth = this.titleDiv.offsetWidth;
            const spanWidth = (this.marquee.children[0] as HTMLDivElement).offsetWidth;
            console.log(divWidth, spanWidth);
            if (divWidth > spanWidth) {
                this.marquee.style.left = `${(divWidth - spanWidth) / 2}px`;
                this.titleDiv.style.padding = '0';
            } else {
                const dur = this.marquee.offsetWidth / 100;
                this.tween = TweenLite.fromTo(this.marquee, dur, { x: '0%' }, { x: '-50%', ease: 'linear', clearProps: 'transform', delay: 3, onComplete: () => this.tween.restart(true) });
            }
        }
    }

    render() {
        const {
            piece = '',
            composer = '',
            contributors = '',
            year = null,
            musicFiles = [],
        } = this.props.currentTrack || {};

        const { name: movement = '' } = musicFiles[0] || {};
        const { isMobile, currentPosition, duration } = this.props;
        return (
            <AudioInfoContainer isMobile={isMobile}>
                <ComposerTitle
                    composer={composer}
                    piece={piece}
                    year={year}
                    divRef={(div) => this.titleDiv = div}
                    marqueeRef={(div) => this.marquee = div}
                    isMobile={isMobile}
                />
                {movement && !isMobile && <Movement isMobile={isMobile}>{movement}</Movement>}
                {contributors && <Contributing isMobile={isMobile}>{contributors}</Contributing>}
                <Duration
                    currentPosition={currentPosition}
                    duration={duration}
                    isMobile={isMobile}
                />
            </AudioInfoContainer>
        );
    }
}

export default AudioInfo;
