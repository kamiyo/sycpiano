import * as React from 'react';
import styled from 'react-emotion';

import { playlistBackground } from 'src/styles/colors';
import { noHighlight } from 'src/styles/mixins';
import { playlistTogglerWidth } from 'src/styles/variables';

const playlistTogglerHeight = playlistTogglerWidth * 2;

const StyledToggler = styled('div')`
    flex-basis: ${playlistTogglerWidth}px;
    align-self: center;
    @height: ${playlistTogglerHeight}px;

    border-top-left-radius: ${playlistTogglerHeight}px;
    border-bottom-left-radius: ${playlistTogglerHeight}px;
    line-height: ${playlistTogglerHeight + 1}px;
    height: ${playlistTogglerHeight}px;
    text-align: right;
    background-color: ${playlistBackground};
    color: #000;
    transition: all 0.15s;
    &:hover {
        background-color: rgba(255, 255, 255, 1);
        cursor: pointer;
    }
    z-index: 50;
    ${noHighlight}
`;

interface PlaylistTogglerProps {
    readonly onClick: () => void;
    readonly isPlaylistVisible: boolean;
}

const PlaylistToggler: React.SFC<PlaylistTogglerProps> = (props) => (
    <StyledToggler onClick={props.onClick}>
        {props.isPlaylistVisible ? '\u25B6' : '\u25C0'}
    </StyledToggler>
);

export default PlaylistToggler;
