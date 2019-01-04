import * as React from 'react';
import { connect } from 'react-redux';

import styled from '@emotion/styled';

import PhotoFader from 'src/components/Media/Photos/PhotoFader';
import PhotoList from 'src/components/Media/Photos/PhotoList';

import { createFetchPhotosAction, selectPhoto } from 'src/components/Media/Photos/actions';
import { PhotoItem } from 'src/components/Media/Photos/types';
import { idFromItem } from 'src/components/Media/Photos/utils';
import { GlobalStateShape } from 'src/types';

import { lato1 } from 'src/styles/fonts';
import { pushed } from 'src/styles/mixins';
import { screenM, screenXSorPortrait } from 'src/styles/screens';
import { playlistContainerWidth } from 'src/styles/variables';

interface PhotosStateToProps {
    readonly items: PhotoItem[];
    readonly currentItem: PhotoItem;
}

interface PhotosDispatchToProps {
    readonly createFetchPhotosAction: typeof createFetchPhotosAction;
    readonly selectPhotoAction: typeof selectPhoto;
}

interface PhotosOwnProps {
    readonly isMobile: boolean;
}

type PhotosProps = PhotosStateToProps & PhotosDispatchToProps & PhotosOwnProps;

const StyledPhotos = styled('div')`
    ${pushed}
    width: 100%;
    background-color: black;
    position: relative;

    ${screenXSorPortrait} {
        height: 100%;
        margin-top: 0;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
    }
`;

const StyledPhotoViewer = styled('div')`
    position: relative;
    width: calc(100% - ${playlistContainerWidth.desktop});
    height: 100%;

    ${screenM} {
        width: calc(100% - ${playlistContainerWidth.tablet});
    }

    img {
        position: absolute;
        max-width: 100%;
        max-height: 100%;
        left: 50%;
        top: 50%;
        transform: translate3d(-50%, -50%, 0);
    }
`;

const StyledCredit = styled('div') `
    position: absolute;
    bottom: 0;
    right: 0;
    font-family: ${lato1};
    color: white;
    padding: 20px;
`;

class Photos extends React.Component<PhotosProps> {
    componentDidMount() {
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
                        {this.props.currentItem && <StyledCredit>{`credit: ${this.props.currentItem.credit}`}</StyledCredit>}
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

const mapStateToProps = (state: GlobalStateShape): PhotosStateToProps => ({
    items: state.photo_list.items,
    currentItem: state.photo_viewer.currentItem,
});

const mapDispatchToProps: PhotosDispatchToProps = {
    createFetchPhotosAction,
    selectPhotoAction: selectPhoto,
};

const ConnectedPhotos = connect<PhotosStateToProps, PhotosDispatchToProps>(
    mapStateToProps,
    mapDispatchToProps,
)(Photos);

export type PhotosType = React.Component<PhotosProps>;
export type RequiredProps = PhotosOwnProps;
export default ConnectedPhotos;
