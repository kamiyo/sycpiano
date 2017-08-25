import '@/less/Schedule/event-list.less';

import _ from 'lodash';
import $ from 'cash-dom';
import moment from 'moment-timezone';
import React from 'react';
import { connect } from 'react-redux';
import { AutoSizer, CellMeasurer, CellMeasurerCache, List } from 'react-virtualized';
import EventItem from '@/js/components/Schedule/EventItem.jsx';
import EventMonthItem from '@/js/components/Schedule/EventMonthItem.jsx';

const cache = new CellMeasurerCache({
    fixedWidth: true
});

class ConnectedEventList extends React.Component {
    constructor(props, context) {
        super(props, context);
        this._renderEventItem = this._renderEventItem.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        // want to prevent 'scrollToRow' when transitioning between eventList and eventSingle
        return (
            nextProps.currentScrollIndex !== this.props.currentScrollIndex ||
            nextProps.eventItems !== this.props.eventItems
        );
    }

    componentDidUpdate() {
        this.List.scrollToRow(this.props.currentScrollIndex || 0);
    }

    componentDidMount() {
        //without timeout, scrollToPosition does not work correctly
        setTimeout(() => this.List.scrollToPosition(this.props.scrollTop), 100);
    }

    _renderEventItem(key, index, style, measure) {
        const item = this.props.eventItems[index];
        if (item.type === 'month') {
            return <EventMonthItem month={item.month} key={key} style={style} measure={measure} />;
        }
        return <EventItem event={item} key={key} style={style} measure={measure} gridState={this.List && this.List.Grid.state}/>;
    }

    rowItemRenderer = ({index, isScrolling, isVisible, key, parent, style}) => {
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
                            scrollToAlignment='start'
                        />
                    )}
                </AutoSizer>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    eventItems: state.schedule_eventItems.items,
    currentScrollIndex: state.schedule_eventItems.currentScrollIndex,
    scrollTop: state.schedule_eventItems.scrollTop,
});

export default connect(
    mapStateToProps,
    () => ({})
)(ConnectedEventList);
