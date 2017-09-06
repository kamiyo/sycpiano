import '@/less/Schedule/event-list.less';

// should we just use es6 array functions instead of lodash?
import _ from 'lodash';
import moment from 'moment-timezone';
import React from 'react';
import { connect } from 'react-redux';
import { AutoSizer, CellMeasurer, CellMeasurerCache, List } from 'react-virtualized';
import EventItem from '@/js/components/Schedule/EventItem.jsx';
import EventMonthItem from '@/js/components/Schedule/EventMonthItem.jsx';
import { SCHEDULE, selectEvent } from '@/js/components/Schedule/actions.js';

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

    // TODO: change to duration-based animation.
    // TODO: add easing
    _scrollToSelectedRow = () => {
        const targetIndex = this._getScrollIndex();
        const targetOffset = this.List.getOffsetForRow({ index: targetIndex });

        let prevTimestamp = null;
        let currentOffset = this.currentOffset;
        let direction = null;
        const scrollVelocity = 0.5;

        const scrollStep = timestamp => {
            if (currentOffset === targetOffset) return;

            direction = targetOffset < currentOffset ? -1 : 1;

            if (!prevTimestamp) prevTimestamp = timestamp;
            const timeDiff = timestamp - prevTimestamp;

            const prevToGo = targetOffset - currentOffset;
            currentOffset += timeDiff * scrollVelocity * direction;
            const postToGo = targetOffset - currentOffset;

            if (prevToGo * postToGo < 0) {      // negative product means overshoot
                currentOffset = targetOffset;   // if update will cause overshoot, set to target
            }

            this.List.scrollToPosition(currentOffset);

            prevTimestamp = timestamp;
            window.requestAnimationFrame(scrollStep);
        };

        window.requestAnimationFrame(scrollStep);
    }

    _getScrollIndex = () => (
        Math.max(0, _.findIndex(
            this.props.eventItems,
            item => (
                item.type === 'day' &&
                item.dateTime.format('YYYY-MM-DD') === this.props.params.date
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
                this.props.selectEvent(item);
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
    { selectEvent }
)(ConnectedEventList);
