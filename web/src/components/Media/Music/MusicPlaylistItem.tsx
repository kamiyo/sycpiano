import * as React from 'react';

import moment from 'moment-timezone';
import { Link, withRouter } from 'react-router-dom';

import { MusicItem } from 'src/components/Media/Music/types';

interface MusicPlaylistItemProps {
    readonly item: MusicItem;
    readonly isActive: boolean;
    readonly baseRoute: string;
    readonly onClick: (item: MusicItem, autoPlay: boolean) => void;
}

const MusicPlaylistItem: React.SFC<MusicPlaylistItemProps & React.HTMLProps<HTMLLIElement> > = ({ item, isActive, baseRoute, onClick }) => (
    <li
        className={`musicPlaylistItem${isActive ? ' active' : ''}`}
    >
        <Link
            to={`${baseRoute}/${item.id}`}
            onClick={() => onClick(item, true)}
        >
            <div className='itemContent'>
                <div className='section audioInfo'>
                    <h4 className='text-top'>
                        {`${item.composer} - ${item.title}`}
                    </h4>
                    <h4 className='text-bottom'>
                        {durationToDisplay(item.duration)}
                    </h4>
                </div>
            </div>
        </Link>
    </li>
);

export default withRouter(MusicPlaylistItem);

// Helper functions

function durationToDisplay(durationString: string) {
    const duration = moment.duration(durationString);
    const s = duration.seconds();
    const m = duration.minutes();
    const h = duration.hours();

    const sString = `${s < 10 ? '0' : ''}${s}`;
    const mString = `${m < 10 ? '0' : ''}${m}`;
    const hString = h > 0 ? `${h}:` : '';

    return `${hString}${mString}:${sString}`;
}
