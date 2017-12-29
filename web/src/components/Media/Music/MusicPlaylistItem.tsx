import * as React from 'react';

import path from 'path';

import { Link } from 'react-router-dom';

import { MusicFileItem, MusicItem } from 'src/components/Media/Music/types';
import { formatTime } from 'src/utils';

interface MusicPlaylistItemProps {
    readonly item: MusicItem;
    readonly currentItemId: number | string;
    readonly baseRoute: string;
    readonly onClick: (item: MusicFileItem, autoPlay: boolean) => void;
}

const fileFromPath = (name: string) => path.basename(name, '.mp3');

const MusicPlaylistItem: React.SFC<MusicPlaylistItemProps & React.HTMLProps<HTMLLIElement>> = ({ item, currentItemId, baseRoute, onClick }) => {
    if (!item.musicfiles) {
        return null;
    } else if (item.musicfiles.length === 1) {
        const musicfile = item.musicfiles[0];
        return (
            <li
                className={'musicPlaylistItem'}
            >
                <div className={`highlight${(currentItemId === musicfile.id) ? ' active' : ''}`}>
                    <Link
                        to={path.normalize(`${baseRoute}/${fileFromPath(musicfile.filePath)}`)}
                        onClick={() => onClick(musicfile, true)}
                    >
                        <div className='section audioInfo'>
                            <h4 className='text-top'>
                                {`${item.composer}: ${item.piece}`}
                            </h4>
                            <h4 className='text-bottom'>
                                {formatTime(musicfile.durationSeconds)}
                            </h4>
                        </div>
                    </Link>
                </div>
            </li>
        );
    } else {
        return (
            <li
                className={'musicPlaylistCollection'}
            >
                <div className={'collectionTitle'}>
                    <div className='section audioInfo'>
                        <h4>{`${item.composer}: ${item.piece}`}</h4>
                    </div>
                </div>
                <ul>
                    {item.musicfiles.map((musicfile, index) => (
                        <li
                            key={index}
                            className={'musicPlaylistItem'}
                        >
                            <div className={`highlight${(currentItemId === musicfile.id) ? ' active' : ''}`}>
                                <Link
                                    to={path.normalize(`${baseRoute}/${fileFromPath(musicfile.filePath)}`)}
                                    onClick={() => onClick(musicfile, true)}
                                >
                                    <div className='itemContent'>
                                        <div className='section audioInfo'>
                                            <h4 className='text-top'>
                                                {musicfile.name}
                                            </h4>
                                            <h4 className='text-bottom'>
                                                {formatTime(musicfile.durationSeconds)}
                                            </h4>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </li>
                    ))}
                </ul>
            </li>
        );
    }
};

export default MusicPlaylistItem;
