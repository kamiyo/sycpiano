import styled from 'react-emotion';

import { storeRadii } from 'src/components/Media/Music/actions';

import { screenM, screenXSorPortrait } from 'src/styles/screens';
import { navBarHeight, playlistContainerWidth } from 'src/styles/variables';

export const TWO_PI = 2 * Math.PI;
export const HALF_PI = Math.PI / 2;
export const SCALE_DESKTOP = 40;
export const SCALE_MOBILE = 20;
export const HEIGHT_ADJUST_MOBILE = -45;
export const HEIGHT_ADJUST_DESKTOP = -100;
export const HIGH_FREQ_SCALE = 10;
export const MOBILE_MSPF = 1000 / 30;

export interface AudioVisualizerStateToProps {
    readonly isHoverSeekring: boolean;
    readonly hoverAngle: number;
}

export interface AudioVisualizerDispatchToProps {
    readonly storeRadii: typeof storeRadii;
}

export interface AudioVisualizerOwnProps {
    readonly analyzers: AnalyserNode[];
    readonly currentPosition: number;
    readonly duration: number;
    readonly isPlaying: boolean;
    readonly prevTimestamp: number;
    readonly volume: number;
    readonly isMobile: boolean;
}

export type AudioVisualizerProps = AudioVisualizerStateToProps & AudioVisualizerDispatchToProps & AudioVisualizerOwnProps;

export const VisualizerContainer = styled<{ isMobile: boolean; }, 'div'>('div')`
    position: absolute;
    left: 0;
    top: 0;
    width: calc(100% - ${playlistContainerWidth.desktop});
    height: 100%;

    ${/* sc-selector */ screenM} {
        width: calc(100% - ${playlistContainerWidth.tablet});
    }

    /* stylelint-disable-next-line no-duplicate-selectors */
    ${/* sc-selector */ screenXSorPortrait} {
        width: 100%;
        height: 360px;
        top: ${navBarHeight.mobile}px;
    }
`;

export const VisualizerCanvas = styled('canvas')`
    position: absolute;
    width: 100%;
    height: 100%;
`;

export type AudioVisualizerType = React.ComponentClass<Pick<AudioVisualizerProps, 'isMobile' | 'analyzers' | 'currentPosition' | 'duration' | 'isPlaying' | 'prevTimestamp' | 'volume' >> & {
    WrappedComponent: React.ComponentType<AudioVisualizerProps>;
};
