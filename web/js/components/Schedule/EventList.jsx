import '@/less/Schedule/event-list.less';

import _ from 'lodash';
import $ from 'cash-dom';
import moment from 'moment-timezone';
import React from 'react';
import { connect } from 'react-redux';
import { AutoSizer, CellMeasurer, List } from 'react-virtualized';

import EventItem from '@/js/components/Schedule/EventItem.jsx';
import EventMonthItem from '@/js/components/Schedule/EventMonthItem.jsx';
import { googleAPI } from '@/js/services/GoogleAPI.js';

class EventListPresentation extends React.Component {
    componentWillMount() { this.props.fetchEvents(); }

    componentDidUpdate() { this.List.scrollToRow(this.props.currentScrollIndex || 0); }

    _renderEventItem(key, index, style) {
        const item = this.props.eventItems[index];
        if (item.type === 'month') {
            return <EventMonthItem month={item.month} key={key} style={style} />;
        }
        return <EventItem event={item} key={key} style={style} />;
    }

    cellItemRenderer({columnIndex, rowIndex}) {
        return this._renderEventItem(rowIndex, rowIndex);
    }

    rowItemRenderer({key, index, isScrolling, isVisible, style}) {
        return this._renderEventItem(key, index, style);
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
        );
    }
}

function getInitialEventItems() {
    return new Promise((resolve, reject) => googleAPI.getCalendarEvents().then(
        response => resolve(response.data.items)
    ));
}

const mapStateToProps = state => {
    return {
        eventItems: state.schedule_eventItems.items,
        currentScrollIndex: state.schedule_eventItems.currentScrollIndex,
    };
};

const mapDispatchToProps = dispatch => {
    return { fetchEvents: () => {
        getInitialEventItems().then(items => {
            dispatch({ type: 'SCHEDULE--FETCH_EVENTS_SUCCESS', fetchedEvents: items });
        });
        dispatch({ type: 'SCHEDULE--FETCHING_EVENTS' });
    }};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EventListPresentation);
