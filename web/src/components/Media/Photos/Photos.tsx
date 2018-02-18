import * as React from 'react';
import styled, { css } from 'react-emotion';
import ReactMedia from 'react-media';
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
import { xs } from 'src/styles/screens';
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

const getPhotoListStyle = (isMobile: boolean) => css`
    padding-left: ${isMobile ? 0 : 5}px;
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

const photoRowHover = (isMobile: boolean): string => (
    isMobile ? css({}) : css`
        &:hover {
            cursor: pointer;
            border-color: ${lightBlue};
        }
    `
);

const PhotoRow = styled<{ isMobile: boolean; }, 'div'>('div')`
    height: ${props => props.isMobile ? 'auto' : '300px'};
    border: 1px solid transparent;
    transition: all 0.2s;
    border-radius: 10px;
    line-height: ${props => props.isMobile ? 0 : 'inherit'};

    img {
        width: 100%;
    }

    /* tslint:disable:declaration-empty-line-before */

    ${props => photoRowHover(props.isMobile)}

    /* tslint:enable:declaration-empty-line-before */

    cursor: default;
    margin: 10px;
    overflow: hidden;
`;

class Photos extends React.Component<PhotosProps, {}> {
    idFromItem = (item: PhotoItem) =>
        item && path.basename(item.file, '.jpg');

    getPlaylistExtraStyles = (isMobile: boolean) => ({
        div: getPhotoListStyle(isMobile),
        ul: photoULStyle,
    })

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

    getChildRenderer = (isMobile: boolean): (props: ChildRendererProps<PhotoItem>) => JSX.Element => (
        ({ item, currentItemId, onClick }) => {
            const isActive = currentItemId === this.idFromItem(item);
            const photoRow = (
                <PhotoRow onClick={() => onClick(item)} isMobile={isMobile}>
                    <img src={`/static/images/gallery/thumbnails/${item.file}`} />
                </PhotoRow>
            );
            // Only wrap with Highlight component in non-mobile width/layout,
            // since photos aren't selectable in mobile width/layout
            // (i.e. the user doesn't need to know which photo is currently selected).
            return isMobile ? photoRow : (
                <Highlight active={isActive}>
                    {photoRow}
                </Highlight>
            );
        }
    )

    render() {
        return (
            <StyledPhotos>
                <ReactMedia query={`(orientation: landscape) and (min-width: ${parseInt(xs, 10) + 1}px)`}>
                    {(matches: boolean) => {
                        const isMobile = !matches;
                        return isMobile ? (
                            <Playlist
                                extraStyles={this.getPlaylistExtraStyles(isMobile)}
                                currentItemId={null}
                                hasToggler={false}
                                isShow={true}
                                items={this.props.items}
                                onClick={() => {
                                    /* If there's just a photos list and no viewer,
                                    we don't want the photos to be clickable. */
                                }}
                                shouldAppear={false}
                                ChildRenderer={this.getChildRenderer(isMobile)}
                                isMobile={isMobile}
                            />
                        ) : (
                            <div>
                                <StyledPhotoViewer>
                                    {this.props.items.map((item, idx) =>
                                        this.createPhotoElement(item, idx))}
                                </StyledPhotoViewer>
                                <Playlist
                                    extraStyles={this.getPlaylistExtraStyles(isMobile)}
                                    currentItemId={this.idFromItem(this.props.currentItem)}
                                    hasToggler={false}
                                    isShow={true}
                                    items={this.props.items}
                                    onClick={this.selectPhoto}
                                    shouldAppear={false}
                                    ChildRenderer={this.getChildRenderer(isMobile)}
                                    isMobile={isMobile}
                                />
                            </div>
                        );
                    }}
                </ReactMedia>
            </StyledPhotos>
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
