import * as React from 'react';
import styled, { css } from 'react-emotion';

import path from 'path';

import { Link } from 'react-router-dom';

import { MusicFileItem, MusicItem } from 'src/components/Media/Music/types';
import { formatTime } from 'src/utils';

import { lightBlue, playlistBackground } from 'src/styles/colors';

interface MusicPlaylistItemProps {
    readonly item: MusicItem;
    readonly currentItemId: number | string;
    readonly baseRoute: string;
    readonly onClick: (item: MusicFileItem, autoPlay: boolean) => void;
}

const fileFromPath = (name: string) => path.basename(name, '.mp3');

const listBottomBorder = '1px solid rgb(222, 222, 222)';

const baseItemStyle = css`
    background-color: ${playlistBackground};
    list-style: none;
    cursor: pointer;
    width: 100%;
    border-bottom: ${listBottomBorder};

    &:hover {
        background-color: white;
    }
`;

const StyledMusicItem = styled('li')`
    ${baseItemStyle}
`;

const StyledCollectionItem = styled('li')`
    ${baseItemStyle}
    margin-left: 15px;
    width: auto;
    border: none;

    &:not(:first-child) {
        border-top: ${listBottomBorder};
    }
`;

const Highlight = styled<{ active: boolean; }, 'div'>('div')`
    padding: 10px 10px 10px 15px;
    border-left: 7px solid transparent;
    ${(props) => props.active && `border-left-color: ${lightBlue};`}
    transition: all 0.15s;

    /* stylelint-disable-next-line rule-empty-line-before, declaration-block-semicolon-newline-after, no-duplicate-selectors */
    ${StyledCollectionItem} & {
        border-left: none;
        ${(props) => props.active && `border-left: 7px solid ${lightBlue};`}
    }
`;

const section = css`
    vertical-align: middle;
    display: inline-block;
`;

const StyledInfo = styled('div')`
    ${section}
    width: 100%;
    height: 100%;
    position: relative;
`;

const h4style = css`
    margin: 0;
    color: black;
    font-size: 15px;
    display: inline-block;
`;

const TextLeft = styled('h4')`
    ${h4style}
    float: left;
`;

const TextRight = styled('h4')`
    ${h4style}
    font-size: 12px;
    float: right;
`;

const StyledCollectionContainer = styled('li')`
    border-bottom: ${listBottomBorder};
`;

const StyledCollectionList = styled('ul')`
    padding: 0;
`;

const StyledCollectionTitleContainer = styled('div')`
    position: relative;
    height: 100%;
    background-color: ${playlistBackground};
    padding: 10px 0 10px 25px;
    border-bottom: ${listBottomBorder};
`;

const MusicPlaylistItem: React.SFC<MusicPlaylistItemProps & React.HTMLProps<HTMLLIElement>> = ({ item, currentItemId, onClick, baseRoute }) => {
    if (!item.musicFiles) {
        return null;
    } else if (item.musicFiles.length === 1) {
        const musicFile = item.musicFiles[0];
        return (
            <StyledMusicItem>
                <Highlight active={currentItemId === musicFile.id}>
                    <Link
                        to={path.normalize(`${baseRoute}/${fileFromPath(musicFile.audioFile)}`)}
                        onClick={() => onClick(musicFile, true)}
                    >
                        <StyledInfo>
                            <TextLeft>
                                {`${item.composer}: ${item.piece}`}
                            </TextLeft>
                            <TextRight>
                                {formatTime(musicFile.durationSeconds)}
                            </TextRight>
                        </StyledInfo>
                    </Link>
                </Highlight>
            </StyledMusicItem>
        );
    } else {
        return (
            <StyledCollectionContainer>
                <StyledCollectionTitleContainer>
                    <StyledInfo>
                        <h4 className={h4style}>{`${item.composer}: ${item.piece}`}</h4>
                    </StyledInfo>
                </StyledCollectionTitleContainer>
                <StyledCollectionList>
                    {item.musicFiles.map((musicFile, index) => (
                        <StyledCollectionItem
                            key={index}
                        >
                            <Highlight active={currentItemId === musicFile.id}>
                                <Link
                                    to={path.normalize(`${baseRoute}/${fileFromPath(musicFile.audioFile)}`)}
                                    onClick={() => onClick(musicFile, true)}
                                >
                                    <div>
                                        <StyledInfo>
                                            <TextLeft>
                                                {musicFile.name}
                                            </TextLeft>
                                            <TextRight>
                                                {formatTime(musicFile.durationSeconds)}
                                            </TextRight>
                                        </StyledInfo>
                                    </div>
                                </Link>
                            </Highlight>
                        </StyledCollectionItem>
                    ))}
                </StyledCollectionList>
            </StyledCollectionContainer>
        );
    }
};

export default MusicPlaylistItem;
