import '@/less/event-list.less';

import _ from 'lodash';
import $ from 'cash-dom';
import moment from 'moment-timezone';
import React from 'react';
import { connect } from 'react-redux';
import { AutoSizer, CellMeasurer, List } from 'react-virtualized';

import EventItem from '@/js/components/Schedule/EventItem.jsx';
import EventMonthItem from '@/js/components/Schedule/EventMonthItem.jsx';
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

/**
 * Transforms events returned by the Google API into event items the EventList can actually render.
 * This function assumes that the events are sorted in order of startTime.
 *
 * @param {array<object>} events - Array of object representation of Google Calendar events
 * @return {array<object>} Array of object representations of event items.
 */
function transformToEventItems(events) {
    console.log('===in transformToEventItems===');
    console.log(events);
    const eventItems = [];
    const datesSeen = new Set();
    _.forEach(events, (event, index) => {
        // datetime transforms
        const startDateTime = event.start.dateTime;
        const timeZone = event.start.timeZone;
        const eventDateTime = moment(startDateTime).tz(timeZone);
        const month = eventDateTime.format('MMMM');
        if (!datesSeen.has(month)) {
            datesSeen.add(month);
            eventItems.push({type: 'month', month: month});
        }
        const description = event.description ? JSON.parse(event.description) : {};
        // program transform
        const program = description.program;
        // collaborators transform
        const collaborators = description.collaborators;
        eventItems.push({
            // TODO(ayc): extract fields from event returned by google
            type: 'day',
            name: event.summary,
            day: parseInt(eventDateTime.format('D')),
            time: eventDateTime.format('h:mm z'),
            program: description.program,
            collaborators: description.collaborators,
            eventType: description.type.value,
        });
    });
    return eventItems;
}

const mapStateToProps = (state) => {
    console.log('===in mapStateToProps===');
    console.log(state);
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
