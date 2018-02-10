import * as React from 'react';
import styled, { css } from 'react-emotion';
import { connect } from 'react-redux';
import { Transition } from 'react-transition-group';

import TweenLite from 'gsap/TweenLite';
import { playVideo } from 'src/components/Media/Videos/actions';
import { bg1 } from 'src/styles/imageUrls';
import { pushed } from 'src/styles/mixins';
import { GlobalStateShape } from 'src/types';

interface PreviewOverlayStateToProps {
    readonly isPreviewOverlay: boolean;
}

interface PreviewOverlayDispatchToProps {
    readonly playVideo: (id?: string) => void;
}

type PreviewOverlayProps = PreviewOverlayStateToProps & PreviewOverlayDispatchToProps;

const StyledPreviewOverlay = styled('div')`
    ${pushed}
    width: 100%;
    height: 100%;
    z-index: 10;
    position: absolute;
    top: 0;
    left: 0;
    background: url(${bg1}) no-repeat;

    &:hover {
        cursor: pointer;
    }

    svg {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
`;

const ytIconStyle = css`
    transition: all 0.2s;

    /* stylelint-disable-next-line rule-empty-line-before, declaration-block-semicolon-newline-after */
    ${StyledPreviewOverlay as any}:hover & {
        fill: #cc181e;
        fill-opacity: 1;
    }
`;

const PreviewOverlay: React.SFC<PreviewOverlayProps> = (props) => (
    <Transition
        in={props.isPreviewOverlay}
        onExit={(el) => { TweenLite.fromTo(el, 0.3, { opacity: 1 }, { opacity: 0 }); }}
        timeout={300}
        unmountOnExit={true}
        mountOnEnter={true}
    >
        <StyledPreviewOverlay
            onClick={() => {
                props.playVideo();
            }}
        >
            <svg viewBox="0 0 68 48" width="68" height="48">
                <path className={ytIconStyle} d="m .66,37.62 c 0,0 .66,4.70 2.70,6.77 2.58,2.71 5.98,2.63 7.49,2.91 5.43,.52 23.10,.68 23.12,.68 .00,-1.3e-5 14.29,-0.02 23.81,-0.71 1.32,-0.15 4.22,-0.17 6.81,-2.89 2.03,-2.07 2.70,-6.77 2.70,-6.77 0,0 .67,-5.52 .67,-11.04 l 0,-5.17 c 0,-5.52 -0.67,-11.04 -0.67,-11.04 0,0 -0.66,-4.70 -2.70,-6.77 C 62.03,.86 59.13,.84 57.80,.69 48.28,0 34.00,0 34.00,0 33.97,0 19.69,0 10.18,.69 8.85,.84 5.95,.86 3.36,3.58 1.32,5.65 .66,10.35 .66,10.35 c 0,0 -0.55,4.50 -0.66,9.45 l 0,8.36 c .10,4.94 .66,9.45 .66,9.45 z" fill="#1f1f1e" fillOpacity="0.81" />
                <path d="m 26.96,13.67 18.37,9.62 -18.37,9.55 -0.00,-19.17 z" fill="#fff" />
                <path d="M 45.02,23.46 45.32,23.28 26.96,13.67 43.32,24.34 45.02,23.46 z" fill="#ccc" />
            </svg>
        </StyledPreviewOverlay>
    </Transition>
);

const mapStateToProps = (state: GlobalStateShape): PreviewOverlayStateToProps => ({
    isPreviewOverlay: state.video_player.isPreviewOverlay,
});

const mapDispatchToProps: PreviewOverlayDispatchToProps = {
    playVideo,
};

export default connect<PreviewOverlayStateToProps, PreviewOverlayDispatchToProps>(
    mapStateToProps,
    mapDispatchToProps,
)(PreviewOverlay);
