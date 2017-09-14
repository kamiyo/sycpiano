import '@/less/Schedule/event-list.less';

// should we just use es6 array functions instead of lodash?
import _ from 'lodash';
import moment from 'moment-timezone';
import React from 'react';
import { connect } from 'react-redux';
import { AutoSizer, CellMeasurer, CellMeasurerCache, List } from 'react-virtualized';
import EventItem from '@/js/components/Schedule/EventItem.jsx';
import EventMonthItem from '@/js/components/Schedule/EventMonthItem.jsx';
import { dispatchSelectEvent, dispatchAnimateStart, dispatchAnimateFinish } from '@/js/components/Schedule/actions.js';
import animateFn from '@/js/components/animate.js';
import { easeQuadOut } from 'd3-ease';

const cache = new CellMeasurerCache({ fixedWidth: true });

class ConnectedEventList extends React.Component {
    constructor(props, context) {
        super(props, context);
        this._renderEventItem = this._renderEventItem.bind(this);

        this.currentOffset = 0;
    }

    componentDidUpdate() {
        if (this.props.hasEventBeenSelected) {
            this._scrollToSelectedRow();
            return;
        }

        if (this.props.params.date) {
            const scrollIndex = this._getScrollIndex();
            this.currentRow = scrollIndex;
            this.List.scrollToPosition(this.List.getOffsetForRow({ index: scrollIndex }));
        } else {
            this.List.scrollToRow(0);
        }
    }

    _scrollToSelectedRow = () => {
        const targetIndex = this._getScrollIndex();
        const targetOffset = this.List.getOffsetForRow({ index: targetIndex });
        this.props.dispatchAnimateStart();
        animateFn(
            this.currentOffset,
            targetOffset,
            500,
            (position) => this.List.scrollToPosition(position),
            easeQuadOut,
            () => {this.props.dispatchAnimateFinish();}
        );
    }

    _getScrollIndex = () => (
        Math.max(0, this.props.eventItems.findIndex(
            item => (
                item.type === 'day' &&
                // in case we change parameter format, compare using moment
                item.dateTime.isSame(moment(this.props.params.date), 'day')
            )
        ))
    );

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
            handleSelect={(e) => {
                this.props.dispatchSelectEvent(item);
            }}
        />;
    }

    rowItemRenderer = ({ index, isScrolling, isVisible, key, parent, style }) => (
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

    render() {
        return (
            <div className="event-list container">
                {
                    <AutoSizer>
                        {({ height, width }) => (
                            <List
                                ref={div => this.List = div}
                                height={height}
                                width={width}
                                rowCount={this.props.eventItems.length}
                                rowHeight={cache.rowHeight}
                                deferredMeasurementCache={cache}
                                rowRenderer={this.rowItemRenderer}
                                scrollToAlignment="start"
                                noRowsRenderer={() => <div />}
                                // react-virtualized needs estimatedRowSize to be a close approximation
                                // to the actual calculated row size:
                                // https://github.com/bvaughn/react-virtualized/blob/master/source/Grid/utils/CellSizeAndPositionManager.js#L152
                                estimatedRowSize={300}
                                onScroll={({ clientHeight, scrollHeight, scrollTop }) => {
                                    this.currentOffset = scrollTop;
                                }}
                            />
                        )}
                    </AutoSizer>
                }
            </div>
        );
    }
}

const mapStateToProps = state => ({
    eventItems: state.schedule_eventItems.items,
    hasEventBeenSelected: state.schedule_eventItems.hasEventBeenSelected,
});

export default connect(
    mapStateToProps,
    {
        dispatchSelectEvent,
        dispatchAnimateStart,
        dispatchAnimateFinish
    }
)(ConnectedEventList);
