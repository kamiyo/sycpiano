import '@/less/Schedule/event-list.less';

import _ from 'lodash';
import $ from 'cash-dom';
import moment from 'moment-timezone';
import React from 'react';
import { connect } from 'react-redux';
import { AutoSizer, CellMeasurer, CellMeasurerCache, List } from 'react-virtualized';
import EventItem from '@/js/components/Schedule/EventItem.jsx';
import EventMonthItem from '@/js/components/Schedule/EventMonthItem.jsx';

const cache = new CellMeasurerCache({ fixedWidth: true });

class ConnectedEventList extends React.Component {
    constructor(props, context) {
        super(props, context);
        this._renderEventItem = this._renderEventItem.bind(this);
    }

    componentDidUpdate() {
        const scrollIndex = _.findIndex(
            this.props.eventItems,
            item => (
                item.type === 'day' &&
                item.dateTime.format('YYYY-MM-DD') === this.props.params.date
            )
        );

        if (!this.props.hasEventBeenSelected) {
            // Only scroll to the index of the current event if the user hasn't manually selected
            // an event (meaning, right after the events are initially loaded).
            this.List.scrollToRow(scrollIndex || 0);
        }
    }

    _renderEventItem(key, index, style, measure) {
        const item = this.props.eventItems[index];
        if (item.type === 'month') {
            return <EventMonthItem
                month={item.month}
                key={key}
                style={style}
                measure={measure}
            />;
        }
        return <EventItem
            event={item}
            key={key}
            style={style}
            measure={measure}
            gridState={this.List && this.List.Grid.state}
            handleSelect={this.props.dispatchSelectEventAction(item)}
        />;
    }

    rowItemRenderer = ({ index, isScrolling, isVisible, key, parent, style }) => {
        return (
            <CellMeasurer
                cache={cache}
                columnIndex={0}
                key={key}
                rowIndex={index}
                parent={parent}
            >
                {({ measure }) => { return this._renderEventItem(key, index, style, measure); }}
            </CellMeasurer>
        )
    }

    render() {
        const numRows = this.props.eventItems.length;
        return (
            <div className="event-list container">
                <AutoSizer>
                    {({ height, width }) => (
                        <List
                            ref={div => this.List = div}
                            height={height}
                            width={width}
                            rowCount={numRows}
                            rowHeight={cache.rowHeight}
                            deferredMeasurementCache={cache}
                            rowRenderer={this.rowItemRenderer}
                            scrollToAlignment="start"
                        />
                    )}
                </AutoSizer>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    eventItems: state.schedule_eventItems.items,
    hasEventBeenSelected: state.schedule_eventItems.hasEventBeenSelected,
});

const mapDispatchToProps = dispatch => ({
    dispatchSelectEventAction: eventItem => (
        () => dispatch({
            type: 'SCHEDULE--SELECT_EVENT',
            eventItem,
        })
    ),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ConnectedEventList);
