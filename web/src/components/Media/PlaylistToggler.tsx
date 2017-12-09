import 'less/Media/playlist-toggler.less';

import * as React from 'react';

interface PlaylistTogglerProps {
    readonly onClick: () => void;
    readonly isPlaylistVisible: boolean;
}

const PlaylistToggler: React.SFC<PlaylistTogglerProps> = (props) => (
    <div className='playlistToggler no-highlight' onClick={props.onClick}>
        {props.isPlaylistVisible ? '\u25B6' : '\u25C0'}
    </div>
);

export default PlaylistToggler;
