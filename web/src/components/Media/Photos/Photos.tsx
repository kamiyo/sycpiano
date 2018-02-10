import * as React from 'react';
import styled, { css } from 'react-emotion';
import { connect, Dispatch } from 'react-redux';
import { Transition } from 'react-transition-group';

import TweenLite from 'gsap/TweenLite';
import path from 'path';

import { createFetchPhotosAction, selectPhoto } from 'src/components/Media/Photos/actions';
import { PhotoItem } from 'src/components/Media/Photos/types';
import Playlist from 'src/components/Media/Playlist';
import { ChildRendererProps } from 'src/components/Media/types';
import { GlobalStateShape } from 'src/types';

import { lightBlue } from 'src/styles/colors';
import { pushed } from 'src/styles/mixins';
import { playlistWidth } from 'src/styles/variables';

const fadeOnEnter = (element: HTMLElement) => {
    TweenLite.fromTo(element, 0.6, { opacity: 0 }, { opacity: 1 });
};

const fadeOnExit = (element: HTMLElement) => {
    TweenLite.fromTo(element, 0.6, { opacity: 1 }, { opacity: 0 });
};

interface PhotosStateToProps {
    readonly items: PhotoItem[];
    readonly currentItem: PhotoItem;
}

interface PhotosDispatchToProps {
    readonly createFetchPhotosAction: () => Promise<void>;
    readonly selectPhotoAction: (item: PhotoItem) => void;
}

type PhotosProps = PhotosStateToProps & PhotosDispatchToProps;

const StyledPhotos = styled('div')`
    ${pushed}
    width: 100%;
    background-color: black;
`;

const StyledPhotoViewer = styled('div')`
    position: absolute;
    width: calc(100% - ${playlistWidth}px);
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
        position: absolute;
        max-width: 100%;
        max-height: 100%;
        opacity: 0;
    }
`;

const photoListStyle = css`
    padding-left: 5px;
    background-color: black;
`;

const photoULStyle = css`
    background-color: black;
`;

const Highlight = styled<{ active: boolean; }, 'div'>('div')`
    padding-left: 15px;
    transition: border 0.15s;
    border-left: 7px solid ${props => props.active ? lightBlue : 'transparent'};
`;

const PhotoRow = styled('div')`
    height: 300px;
    border: 1px solid transparent;
    transition: all 0.2s;
    border-radius: 10px;

    img {
        width: 100%;
    }

    &:hover {
        cursor: pointer;
        border: 1px solid ${lightBlue};
    }

    cursor: default;
    margin: 10px;
    overflow: hidden;
`;

class Photos extends React.Component<PhotosProps, {}> {
    idFromItem = (item: PhotoItem) =>
        item && path.basename(item.file, '.jpg');

    componentWillMount() {
        this.props.createFetchPhotosAction();
    }

    selectPhoto = (item: PhotoItem) => this.props.selectPhotoAction(item);

    pathFromItem = (item: PhotoItem) =>
        item && path.join('/static/images', 'gallery', item.file);

    isCurrentItem = (item: PhotoItem) =>
        this.idFromItem(item) === this.idFromItem(this.props.currentItem);

    createPhotoElement = (item: PhotoItem, index: number) => {
        const isCurrent = this.isCurrentItem(item);
        return (
            <Transition
                key={index}
                in={isCurrent}
                onEntering={fadeOnEnter}
                onExiting={fadeOnExit}
                appear={true}
                timeout={600}
            >
                <img alt="Sean Chen Pianist Photo" src={this.pathFromItem(item)} />
            </Transition>
        );
    }

    render() {
        return (
            <StyledPhotos>
                <StyledPhotoViewer>
                    {this.props.items.map((item, idx) =>
                        this.createPhotoElement(item, idx))}
                </StyledPhotoViewer>
                <Playlist
                    extraStyles={{
                        div: photoListStyle,
                        ul: photoULStyle,
                    }}
                    currentItemId={this.idFromItem(this.props.currentItem)}
                    hasToggler={false}
                    isShow={true}
                    items={this.props.items}
                    onClick={this.selectPhoto}
                    shouldAppear={false}
                    ChildRenderer={this.childRenderer}
                />
            </StyledPhotos>
        );
    }

    childRenderer = ({ item, currentItemId, onClick }: ChildRendererProps<PhotoItem>) => {
        const isActive = (currentItemId === this.idFromItem(item));
        return (
            <Highlight active={isActive}>
                <PhotoRow onClick={() => onClick(item)}>
                    <img src={`/static/images/gallery/thumbnails/${item.file}`} />
                </PhotoRow>
            </Highlight>
        );
    }
}

const mapStateToProps = (state: GlobalStateShape) => ({
    items: state.photo_list.items,
    currentItem: state.photo_viewer.currentItem,
});

const mapDispatchToProps = (dispatch: Dispatch<GlobalStateShape>): PhotosDispatchToProps => ({
    createFetchPhotosAction: () => dispatch(createFetchPhotosAction()),
    selectPhotoAction: (item: PhotoItem) => dispatch(selectPhoto(item)),
});

export default connect<PhotosStateToProps, PhotosDispatchToProps>(
    mapStateToProps,
    mapDispatchToProps,
)(Photos);
