import * as React from 'react';
import styled from 'react-emotion';
import { connect, Dispatch } from 'react-redux';

import PhotoFader from 'src/components/Media/Photos/PhotoFader';
import PhotoList from 'src/components/Media/Photos/PhotoList';

import { createFetchPhotosAction, selectPhoto } from 'src/components/Media/Photos/actions';
import { PhotoItem } from 'src/components/Media/Photos/types';
import { idFromItem } from 'src/components/Media/Photos/utils';
import { GlobalStateShape } from 'src/types';

import { pushed } from 'src/styles/mixins';
import { screenXS } from 'src/styles/screens';
import { playlistWidth } from 'src/styles/variables';

interface PhotosStateToProps {
    readonly items: PhotoItem[];
    readonly currentItem: PhotoItem;
}

interface PhotosDispatchToProps {
    readonly createFetchPhotosAction: () => Promise<void>;
    readonly selectPhotoAction: (item: PhotoItem) => void;
}

interface PhotosOwnProps {
    readonly isMobile: boolean;
}

type PhotosProps = PhotosStateToProps & PhotosDispatchToProps & PhotosOwnProps;

const StyledPhotos = styled('div') `
    ${pushed}
    width: 100%;
    background-color: black;
    position: relative;

    /* stylelint-disable-next-line */
    ${screenXS} {
        height: 100%;
        margin-top: 0;
    }
`;

const StyledPhotoViewer = styled('div') `
    position: relative;
    width: calc(100% - ${playlistWidth}px);
    height: 100%;

    img {
        position: absolute;
        max-width: 100%;
        max-height: 100%;
        left: 50%;
        top: 50%;
        transform: translate3d(-50%, -50%, 0);
    }
`;

class Photos extends React.Component<PhotosProps, {}> {
    componentWillMount() {
        this.props.createFetchPhotosAction();
    }

    isCurrentItem = (item: PhotoItem) =>
        idFromItem(item) === idFromItem(this.props.currentItem);

    selectPhoto = (item: PhotoItem) => this.props.selectPhotoAction(item);

    render() {
        return (
            <StyledPhotos>
                {!this.props.isMobile &&
                    <StyledPhotoViewer>
                        {this.props.items.map((item, idx) => {
                            const isCurrent = this.isCurrentItem(item);
                            return <PhotoFader key={idx} item={item} isCurrent={isCurrent} />;
                        })}
                    </StyledPhotoViewer>
                }
                <PhotoList
                    items={this.props.items}
                    currentItem={this.props.currentItem}
                    selectPhoto={this.props.selectPhotoAction}
                    isMobile={this.props.isMobile}
                />
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

const ConnectedPhotos = connect<PhotosStateToProps, PhotosDispatchToProps>(
    mapStateToProps,
    mapDispatchToProps,
)(Photos);

export type PhotosType = typeof ConnectedPhotos;
export default ConnectedPhotos;
