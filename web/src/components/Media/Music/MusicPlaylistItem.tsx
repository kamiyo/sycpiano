import * as React from 'react';
import styled, { css } from 'react-emotion';

import path from 'path';

import { Link } from 'react-router-dom';

import { MusicFileItem, MusicItem } from 'src/components/Media/Music/types';
import { formatTime } from 'src/utils';

import { lightBlue, playlistBackground } from 'src/styles/colors';

interface MusicPlaylistItemProps {
    readonly audio: HTMLAudioElement;
    readonly userInput: boolean;
    readonly item: MusicItem;
    readonly currentItemId: number | string;
    readonly baseRoute: string;
    readonly onClick: (item: MusicFileItem, autoPlay: boolean) => void;
    readonly onFirstUserInput: () => void;
}

const fileFromPath = (name: string) => path.basename(name, '.mp3');

const baseItemStyle = css`
    background-color: ${playlistBackground};
    list-style: none;
    cursor: pointer;
    width: 100%;

    &:hover {
        background-color: white;
    }
`;

const StyledMusicItem = styled('li') `
    ${baseItemStyle}
`;

const StyledCollectionItem = styled('li') `
    ${baseItemStyle}
    margin-left: 15px;
    width: auto;
    border: none;
`;

const Highlight = styled<{ active: boolean; }, 'div'>('div') `
    padding: 10px 10px 10px 15px;
    border-left: 7px solid transparent;
    ${(props) => props.active && `border-left-color: ${lightBlue};`}
    transition: all 0.15s;

    /* stylelint-disable-next-line rule-empty-line-before, declaration-block-semicolon-newline-after, no-duplicate-selectors */
    ${StyledCollectionItem} & {
        border-left: 7px solid transparent;
        ${(props) => props.active && `border-left: 7px solid ${lightBlue};`}
    }
`;

const section = css`
    vertical-align: middle;
    display: inline-block;
`;

const h4style = css`
    margin: 0;
    color: black;
    font-size: 15px;
    display: inline-block;
`;

const TextLeft = styled('h4') `
    ${h4style}
    float: left;
`;

const TextRight = styled('h4') `
    ${h4style}
    font-size: 12px;
    float: right;
`;

const StyledCollectionContainer = styled('li') `
    padding: 10px 0;
`;

const StyledCollectionList = styled('ul') `
    padding: 0;
`;

const StyledCollectionTitleContainer = styled('div') `
    position: relative;
    height: 100%;
    background-color: ${playlistBackground};
    padding: 10px 0 10px 22px;
`;

const StyledInfo = styled('div') `
    ${section as any}
    width: 100%;
    height: 100%;
    position: relative;
    padding: 10px 0;

    /* stylelint-disable-next-line rule-empty-line-before, declaration-block-semicolon-newline-after, no-duplicate-selectors */
    ${StyledCollectionItem} & {
        padding: 0;
    }

    /* stylelint-disable-next-line rule-empty-line-before, declaration-block-semicolon-newline-after, no-duplicate-selectors */
    ${StyledCollectionTitleContainer} & {
        padding-bottom: 0;
    }
`;

const MusicPlaylistItem: React.SFC<MusicPlaylistItemProps & React.HTMLProps<HTMLLIElement>> = ({
    audio,
    item,
    currentItemId,
    onClick,
    baseRoute,
    userInput,
    onFirstUserInput,
}) => {
    if (!item.musicFiles) {
        return null;
    } else if (item.musicFiles.length === 1) {
        const musicFile = item.musicFiles[0];
        return (
            <StyledMusicItem>
                <Link
                    to={path.normalize(`${baseRoute}/${fileFromPath(musicFile.audioFile)}`)}
                    onClick={() => {
                        // mobile: play needs to be called by user interaction at least once
                        if (!userInput) {
                            audio.play();
                            onFirstUserInput();
                        }
                        onClick(musicFile, true);
                    }}
                >
                    <Highlight active={currentItemId === musicFile.id}>
                        <StyledInfo>
                            <TextLeft>
                                {`${item.composer}: ${item.piece}`}
                            </TextLeft>
                            <TextRight>
                                {formatTime(musicFile.durationSeconds)}
                            </TextRight>
                        </StyledInfo>
                    </Highlight>
                </Link>
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
                            <Link
                                to={path.normalize(`${baseRoute}/${fileFromPath(musicFile.audioFile)}`)}
                                onClick={() => {
                                    if (!userInput) {
                                        audio.play();
                                        onFirstUserInput();
                                    }
                                    onClick(musicFile, true);
                                    // mobile: play needs to be called by user interaction at least once
                                }}
                            >
                                <Highlight active={currentItemId === musicFile.id}>

                                    <StyledInfo>
                                        <TextLeft>
                                            {musicFile.name}
                                        </TextLeft>
                                        <TextRight>
                                            {formatTime(musicFile.durationSeconds)}
                                        </TextRight>
                                    </StyledInfo>
                                </Highlight>
                            </Link>
                        </StyledCollectionItem>
                    ))}
                </StyledCollectionList>
            </StyledCollectionContainer>
        );
    }
};

export default MusicPlaylistItem;
