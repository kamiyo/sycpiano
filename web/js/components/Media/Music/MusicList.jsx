import React from 'react';
import { AutoSizer, CellMeasurer, List } from 'react-virtualized';
import MusicNav from '@/js/components/Media/Music/MusicNav.jsx';

const musicCategories = ['Concerti', 'Soli', 'Chamber', 'Arrangements', 'Compositions', 'VideoGame'];

export default class MusicList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeCategory: musicCategories[0]
        };
    }

    setActiveCategory(category) {
        this.setState({ activeCategory: category });
    }

    renderMusicItem(key, index, style) {
        return <div>Test</div>;
    }

    rowItemRenderer({ key, index, isScrolling, isVisible, style}) {
        return this.renderMusicItem(key, index, style);
    }

    cellItemRenderer({ columnIndex, rowIndex }) {
        return this.renderMusicItem(rowIndex, rowIndex);
    }

    render() {
        const numRows = this.props.musicItems.length;

        return (
            <div className='music-list'>
                <MusicNav musicCategories={musicCategories} setActiveCategory={category => this.setActiveCategory(category)} />
                <AutoSizer>
                    {
                        ({height, width}) => {
                            return (
                                <CellMeasurer
                                    cellRenderer={this.cellItemRenderer.bind(this)}
                                    columnCount={1}
                                    rowCount={numRows}
                                    width={width}>
                                    {
                                        ({getRowHeight}) => {
                                            return <List
                                                ref={div => this.List = div}
                                                height={height}
                                                width={width}
                                                rowCount={numRows}
                                                rowHeight={getRowHeight}
                                                rowRenderer={this.rowItemRenderer.bind(this)}
                                                scrollToAlignment='start'
                                            />;
                                        }
                                    }
                                </CellMeasurer>
                            );
                        }
                    }
                </AutoSizer>
            </div>
        )
    }
}