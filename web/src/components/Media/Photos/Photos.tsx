import 'less/Media/Photos/photos.less';

import * as React from 'react';
import { connect } from 'react-redux';

import { createFetchPhotosAction } from 'src/components/Media/Photos/actions';
import { PhotoItemShape } from 'src/components/Media/Photos/types';
import Playlist from 'src/components/Media/Playlist';
import { ChildRendererProps } from 'src/components/Media/types';
import { GlobalStateShape } from 'src/types';

// const ITEMS_PER_ROW = 5;

interface PhotosStateToProps {
    readonly items: PhotoItemShape[];
}

interface PhotosDispatchToProps {
    readonly createFetchPhotosAction: () => void;
}

type PhotosProps = PhotosStateToProps & PhotosDispatchToProps;

class Photos extends React.Component<PhotosProps, {}> {
    componentWillMount() {
        this.props.createFetchPhotosAction();
    }

    render() {
        console.log(this.props.items);
        return (
            <div className='mediaContent photos'>
                <Playlist
                    className='photo-list'
                    currentItemId=''
                    hasToggler={false}
                    isShow={true}
                    items={this.props.items}
                    onClick={null}
                    shouldAppear={false}
                    ChildRenderer={this.childRenderer}
                />
            </div>
        );
    }

    childRenderer = ({ item }: ChildRendererProps<PhotoItemShape>) => {
        const portrait: boolean = (item.thumbnailWidth > item.thumbnailHeight) ? false : true;
        return (
            <div className={`photo-row ${(portrait) ? 'portrait' : 'landscape'}`}>
                <img src={`/images/gallery/thumbnails/${item.file}`} />
            </div>
        );
    }
}

const mapStateToProps = (state: GlobalStateShape) => ({
    items: state.photo_list.items,
});

const mapDispatchToProps: PhotosDispatchToProps = {
    createFetchPhotosAction,
};

export default connect<PhotosStateToProps, PhotosDispatchToProps>(
    mapStateToProps,
    mapDispatchToProps,
)(Photos);
