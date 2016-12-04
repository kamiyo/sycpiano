import '@/less/event-list.less';

import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { AutoSizer, CellMeasurer, List } from 'react-virtualized';

import EventItem from '@/js/components/Schedule/EventItem.jsx';
import EventMonthItem from '@/js/components/Schedule/EventMonthItem.jsx';

let scrolling = false;

class EventListPresentation extends React.Component {
    _renderEventItem(key, index) {
        const item = this.props.eventItems[index];
        if (item.type === 'month') {
            return <EventMonthItem month={item.month} key={key} />;
        }
        return <EventItem event={item} key={key} />;
    }

    rowItemRenderer({key, index, isScrolling, isVisible, style}) {
        if (!scrolling && isScrolling) console.log('===SCROLL START===');
        if (scrolling && !isScrolling) console.log('===SCROLL END===');

        scrolling = isScrolling;
        console.log('in row item renderer: ' + index + ',' + isScrolling + ',' + isVisible);
        return this._renderEventItem(key, index);
    }

    cellItemRenderer({columnIndex, rowIndex}) {
        return this._renderEventItem(rowIndex, rowIndex);
    }

    render() {
        const numRows = this.props.eventItems.length;
        return (
            <div className="event-list">
                <AutoSizer>
                    {
                        ({height, width}) => {
                            return (
                                <CellMeasurer
                                    cellRenderer={this.cellItemRenderer.bind(this)}
                                    columnCount={1}
                                    rowCount={numRows}
                                    width={width}
                                >
                                    {
                                        ({getRowHeight}) => {
                                            return <List
                                                height={height}
                                                width={width}
                                                rowCount={numRows}
                                                rowHeight={getRowHeight}
                                                rowRenderer={this.rowItemRenderer.bind(this)}
                                            />;
                                        }
                                    }
                                </CellMeasurer>
                            );
                        }
                    }
                </AutoSizer>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {eventItems: state.eventItems};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EventListPresentation);
