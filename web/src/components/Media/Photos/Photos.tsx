import 'less/Media/Photos/photos.less';

import classnames from 'classnames';
import path from 'path';
import * as React from 'react';
import { connect, Dispatch } from 'react-redux';

import { createFetchPhotosAction, selectPhoto } from 'src/components/Media/Photos/actions';
import { PhotoItem } from 'src/components/Media/Photos/types';
import Playlist from 'src/components/Media/Playlist';
import { ChildRendererProps } from 'src/components/Media/types';
import { GlobalStateShape } from 'src/types';

interface PhotosStateToProps {
    readonly items: PhotoItem[];
    readonly currentItem: PhotoItem;
}

interface PhotosDispatchToProps {
    readonly createFetchPhotosAction: () => Promise<void>;
    readonly selectPhotoAction: (item: PhotoItem) => void;
}

type PhotosProps = PhotosStateToProps & PhotosDispatchToProps;

class Photos extends React.Component<PhotosProps, {}> {
    idFromItem = (item: PhotoItem) => {
        return item && path.basename(item.file, '.jpg');
    }

    componentWillMount() {
        this.props.createFetchPhotosAction();
    }

    selectPhoto = (item: PhotoItem) => {
        this.props.selectPhotoAction(item);
    }

    pathFromItem = (item: PhotoItem) => {
        return item && path.join('/images', 'gallery', item.file);
    }

    render() {
        return (
            <div className='mediaContent photos'>
                <div className={'photo-viewer'}>
                    <img src={this.pathFromItem(this.props.currentItem)} />
                </div>
                <Playlist
                    className='photo-list'
                    currentItemId={this.idFromItem(this.props.currentItem)}
                    hasToggler={false}
                    isShow={true}
                    items={this.props.items}
                    onClick={this.selectPhoto}
                    shouldAppear={false}
                    ChildRenderer={this.childRenderer}
                />
            </div>
        );
    }

    childRenderer = ({ item, currentItemId, onClick }: ChildRendererProps<PhotoItem>) => {
        const isActive = (currentItemId === this.idFromItem(item));
        return (
            <div className={classnames('highlight', { active: isActive })}>
                <div className={`photo-row`} onClick={() => onClick(item)}>
                    <img src={`/images/gallery/thumbnails/${item.file}`} />
                </div>
            </div>
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
