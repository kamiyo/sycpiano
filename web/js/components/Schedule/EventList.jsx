import '@/less/Schedule/event-list.less';

import _ from 'lodash';
import $ from 'cash-dom';
import moment from 'moment-timezone';
import React from 'react';
import { connect } from 'react-redux';
import { AutoSizer, CellMeasurer, CellMeasurerCache, List } from 'react-virtualized';

import EventItem from '@/js/components/Schedule/EventItem.jsx';
import EventMonthItem from '@/js/components/Schedule/EventMonthItem.jsx';
import { googleAPI } from '@/js/services/GoogleAPI.js';

const cache = new CellMeasurerCache({
    fixedWidth: true
});

class ConnectedEventList extends React.Component {
    constructor(props, context) {
        super(props, context);

        this._renderEventItem = this._renderEventItem.bind(this);
    }

    componentWillMount() {
        this.props.fetchEvents();
    }

    componentDidUpdate() { this.List.scrollToRow(this.props.currentScrollIndex || 0); }

    _renderEventItem(key, index, style, measure) {
        const item = this.props.eventItems[index];
        if (item.type === 'month') {
            return <EventMonthItem month={item.month} key={key} style={style} measure={measure}/>;
        }
        return <EventItem event={item} key={key} style={style} measure={measure}/>;
    }

    rowItemRenderer({index, isScrolling, isVisible, key, parent, style}) {
        return (
            <CellMeasurer
                cache={cache}
                columnIndex={0}
                key={key}
                rowIndex={index}
                parent={parent}
            >
                {({ measure }) => this._renderEventItem(key, index, style, measure)}
            </CellMeasurer>
        );
    }

    render() {
        const numRows = this.props.eventItems.length;
        return (
            <div className="event-list">
                <AutoSizer>
                    {
                        ({height, width}) => (
                            <List
                                ref={div => this.List = div}
                                height={height}
                                width={width}
                                rowCount={numRows}
                                rowHeight={cache.rowHeight}
                                deferredMeasurementCache={cache}
                                rowRenderer={this.rowItemRenderer}
                                scrollToAlignment='start'
                            />
                        )
                    }
                </AutoSizer>
            </div>
        );
    }
}

const getInitialEventItems = () => (
    new Promise((resolve, reject) => (
        googleAPI.getCalendarEvents()
            .then(response => resolve(response.data.items))
    ))
);

const mapStateToProps = state => ({
    eventItems: state.schedule_eventItems.items,
    currentScrollIndex: state.schedule_eventItems.currentScrollIndex,
});

const mapDispatchToProps = dispatch => ({
    fetchEvents: () => {
        getInitialEventItems()
            .then(items => dispatch({
                type: 'SCHEDULE--FETCH_EVENTS_SUCCESS',
                fetchedEvents: items,
            }));

        dispatch({ type: 'SCHEDULE--FETCHING_EVENTS' });
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ConnectedEventList);
