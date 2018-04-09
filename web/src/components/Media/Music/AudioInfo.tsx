import * as React from 'react';
import styled from 'react-emotion';
import { connect } from 'react-redux';

import TweenLite from 'gsap/TweenLite';

import { formatTime } from 'src/utils';

import { MusicItem } from 'src/components/Media/Music/types';

import { lato1 } from 'src/styles/fonts';
import { noHighlight } from 'src/styles/mixins';
import { screenXSorPortrait } from 'src/styles/screens';
import { navBarHeight, playlistWidth } from 'src/styles/variables';

interface AudioInfoProps {
    currentTrack: MusicItem;
    duration: number;
    currentPosition: number;
    isMobile: boolean;
    dispatch: any;
}

const AudioInfoContainer = styled('div') `
    ${noHighlight}
    width: calc(100% - ${playlistWidth}px);
    height: 100%;
    z-index: 10;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    text-align: center;
    font-family: ${lato1};
    letter-spacing: 2px;
    color: white;
    padding-bottom: 3rem;

    ${/* sc-selector */ screenXSorPortrait} {
        width: 100%;
        height: 450px;
        top: ${navBarHeight.mobile}px;
        padding-bottom: 1rem;
    }
`;

const ComposerTitle = styled('div') `
    padding: 0 10px;
    font-size: 2.2rem;
    line-height: 3.2rem;

    ${/* sc-selector */ screenXSorPortrait} {
        width: 100%;
        white-space: nowrap;
        overflow-x: hidden;
        font-size: 1.4rem;
        line-height: 2rem;
    }
`;

const Marquee = styled('div') `
    width: fit-content;
    position: relative;

    span {
        display: inline-block;

        &:last-child {
            margin: 0 200px;
        }
    }
`;

const Movement = styled('div') `
    padding: 0 10px;
    font-size: 2.2rem;
    line-height: 3.2rem;
`;

const ContributingOrDuration = styled('div') `
    padding: 0 10px;
    font-size: 2rem;
    line-height: 3.2rem;

    ${/* sc-selector */ screenXSorPortrait} {
        font-size: 1.1rem;
        line-height: 1.5rem;
    }
`;

class AudioInfo extends React.Component<AudioInfoProps> {
    private tween: any;
    private titleDiv: HTMLDivElement;
    private marquee: HTMLDivElement;

    componentDidUpdate(prevProps: AudioInfoProps) {
        if (
            this.props.isMobile && (
                !prevProps.isMobile ||
                this.props.currentTrack && (
                    !prevProps.currentTrack ||
                    prevProps.currentTrack.musicFiles[0].id !== this.props.currentTrack.musicFiles[0].id
                )
            )
        ) {
            this.tween && this.tween.kill();
            this.marquee.removeAttribute('style');
            this.titleDiv.removeAttribute('style');
            const divWidth = this.titleDiv.offsetWidth;
            const spanWidth = (this.marquee.children[0] as HTMLDivElement).offsetWidth;
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

        const contribArray = contributors && contributors.split(', ');
        const { name: movement = '' } = musicFiles[0] || {};
        const { isMobile, currentPosition, duration } = this.props;
        const composerTitle = composer + ' ' + piece + (year ? ` (${year})` : '') + (isMobile && movement ? ': ' + movement : '');
        return (
            <AudioInfoContainer>
                <ComposerTitle innerRef={(div) => this.titleDiv = div}>
                    {
                        isMobile ? (
                            <Marquee innerRef={(div) => this.marquee = div}>
                                <span>{composerTitle}</span><span>{composerTitle}</span>
                            </Marquee>
                        ) : (
                                composerTitle
                            )
                    }
                </ComposerTitle>
                {movement && !isMobile && <Movement>{movement}</Movement>}
                {contributors &&
                    (isMobile ? contribArray.map((contributor, index) => (
                        <ContributingOrDuration key={index}>
                            {contributor}
                        </ContributingOrDuration>
                    )) : <ContributingOrDuration>
                            {contributors}
                        </ContributingOrDuration>
                    )
                }
                <ContributingOrDuration>{`${formatTime(currentPosition)} / ${formatTime(duration)}`}</ContributingOrDuration>
            </AudioInfoContainer>
        );
    }
}

export default connect()(AudioInfo);
