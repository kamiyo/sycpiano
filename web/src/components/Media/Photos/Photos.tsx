import 'less/Media/Photos/photos.less';

import * as React from 'react';
import { connect } from 'react-redux';
import { AutoSizer, List, ListRowRenderer } from 'react-virtualized';

import { createFetchPhotosAction } from 'src/components/Media/Photos/actions';
import { GlobalStateShape } from 'src/types';

const ITEMS_PER_ROW = 5;

interface PhotosStateToProps {
    readonly items: string[];
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
        return (
            <div className='photos container'>
                <AutoSizer>
                    {({ height, width }) => (
                        <List
                            height={height}
                            width={width}
                            rowCount={Math.ceil(this.props.items.length / ITEMS_PER_ROW)}
                            rowHeight={300}
                            rowRenderer={this.rowItemRenderer}
                        />

                    )}
                </AutoSizer>
            </div>
        );
    }

    private rowItemRenderer: ListRowRenderer = ({ index, key, style }) => {
        const startIndex = ITEMS_PER_ROW * index;
        return (
        <div
            className='photo-row'
            key={key}
            style={style}
        >
            {[...Array(ITEMS_PER_ROW).keys()].map((_, i) => {
                const adjIndex = startIndex + i;
                if (adjIndex < this.props.items.length) {
                    return <img key={adjIndex} src={`/images/${this.props.items[adjIndex]}`} />;
                }
            })}
        </div>);
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
