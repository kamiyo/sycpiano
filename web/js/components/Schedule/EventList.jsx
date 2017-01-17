import '@/less/event-list.less';

import _ from 'lodash';
import $ from 'cash-dom';
import moment from 'moment-timezone';
import React from 'react';
import { connect } from 'react-redux';
import { AutoSizer, CellMeasurer, List } from 'react-virtualized';

import EventItem from '@/js/components/Schedule/EventItem.jsx';
import EventMonthItem from '@/js/components/Schedule/EventMonthItem.jsx';
import {transformToEventItems} from '@/js/components/Schedule/events-transform.js';
import {googleAPI} from '@/js/services/GoogleAPI.js';

class EventListPresentation extends React.Component {
    componentWillMount() {
        this.props.fetchEvents();
    }

    _renderEventItem(key, index, style) {
        const item = this.props.eventItems[index];
        if (item.type === 'month') {
            return <EventMonthItem month={item.month} key={key} style={style} />;
        }
        return <EventItem event={item} key={key} style={style} />;
    }

    rowItemRenderer({key, index, isScrolling, isVisible, style}) {
        return this._renderEventItem(key, index, style);
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

function getInitialEventItems() {
    return new Promise((resolve, reject) => googleAPI.getCalendarEvents().then(
        response => resolve(response.data.items)
    ));
}

const mapStateToProps = (state) => {
    return { eventItems: state.eventItems.items };
};

const mapDispatchToProps = (dispatch) => {
    getInitialEventItems().then(items => {
        dispatch({
            type: 'FETCH_EVENTS_SUCCESS',
            fetchedEvents: transformToEventItems(items),
        });
    });
    return { fetchEvents: () => dispatch({ type: 'FETCH_EVENTS' }) };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EventListPresentation);
