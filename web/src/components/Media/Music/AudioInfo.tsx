import * as React from 'react';
import styled from 'react-emotion';
import { connect } from 'react-redux';

import TweenLite from 'gsap/TweenLite';

import { formatTime } from 'src/utils';

import { MusicItem } from 'src/components/Media/Music/types';

import { lato1 } from 'src/styles/fonts';
import { noHighlight } from 'src/styles/mixins';
import { screenXS } from 'src/styles/screens';
import { navBarHeight, playlistWidth } from 'src/styles/variables';

interface AudioInfoProps {
    currentTrack: MusicItem;
    duration: number;
    currentPosition: number;
    isMobile: boolean;
    dispatch: any;
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

const ComposerTitle = styled<{ isMobile: boolean; }, 'div'>('div') `
    padding: 0 10px;
    font-size: ${(props) => props.isMobile ? '1.4rem' : '2.2rem'};
    line-height: ${(props) => props.isMobile ? '2rem' : '3.2rem'};

    ${/* sc-selector */ screenXS} {
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
    }
`;

const Movement = styled('div') `
    padding: 0 10px;
    font-size: 2.2rem;
    line-height: 3.2rem;
`;

const ContributingOrDuration = styled<{ isMobile: boolean; }, 'div'>('div') `
    padding: 0 10px;
    font-size: ${(props) => props.isMobile ? '1.1rem' : '2rem'};
    line-height: ${(props) => props.isMobile ? '1.5rem' : '3.2rem'};
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
            <AudioInfoContainer isMobile={isMobile}>
                <ComposerTitle innerRef={(div) => this.titleDiv = div} isMobile={isMobile}>
                    {
                        isMobile ? (
                            <div ref={(div) => this.marquee = div}>
                                <span>{composerTitle}</span><span>{composerTitle}</span>
                            </div>
                        ) : (
                                composerTitle
                            )
                    }
                </ComposerTitle>
                {movement && !isMobile && <Movement>{movement}</Movement>}
                {contributors &&
                    (isMobile ? contribArray.map((contributor, index) => (
                        <ContributingOrDuration key={index} isMobile={isMobile}>
                            {contributor}
                        </ContributingOrDuration>
                    )) : <ContributingOrDuration isMobile={isMobile}>
                            {contributors}
                        </ContributingOrDuration>
                    )
                }
                <ContributingOrDuration isMobile={isMobile}>{`${formatTime(currentPosition)} / ${formatTime(duration)}`}</ContributingOrDuration>
            </AudioInfoContainer>
        );
    }
}

export default connect()(AudioInfo);
