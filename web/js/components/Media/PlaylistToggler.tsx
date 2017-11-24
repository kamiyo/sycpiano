import 'less/Media/playlist-toggler.less';

import * as React from 'react';

interface PlaylistTogglerProps {
    onClick: () => void;
    isPlaylistVisible: boolean;
}

const PlaylistToggler = (props: PlaylistTogglerProps) => (
    <div className='playlistToggler no-highlight' onClick={props.onClick}>
        {props.isPlaylistVisible ? '\u25B6' : '\u25C0'}
    </div>
);

export default PlaylistToggler;
