import '@/less/Schedule/event-list.less';

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
        this.maxOffset = 0;
        this.requestId = null;
    }

    componentDidUpdate() {
        if (this.props.eventItems.length !== 0) {
            const outerHeight = Math.floor(document.getElementsByClassName('event-list')[0].clientHeight);
            const innerHeight = this.List.Grid._scrollingContainer.scrollHeight;
            this.maxOffset = innerHeight - outerHeight;
        }
        if (this.props.hasEventBeenSelected) {
            this._scrollToSelectedRow();
            return;
        }
        if (this.props.match.params.date) {
            const scrollIndex = this._getScrollIndex();
            this.currentRow = scrollIndex;
            this.List.scrollToPosition(this.List.getOffsetForRow({ index: scrollIndex }));
        } else {
            this.List.scrollToRow(0);
        }
    }

    animationRequestHandler = (requestId) => {
        this.requestId = requestId;
    }

    _scrollToSelectedRow = () => {
        const targetIndex = this._getScrollIndex();
        const targetOffset = Math.min(this.List.getOffsetForRow({ index: targetIndex }), this.maxOffset);
        this.props.dispatchAnimateStart();
        setTimeout(() => this.requestId = animateFn(
            this.currentOffset,
            targetOffset,
            Math.min(Math.abs(this.currentOffset - targetOffset) / 2, 500),
            (position) => this.List.scrollToPosition(position),
            easeQuadOut,
            () => { this.props.dispatchAnimateFinish(); },
            this.animationRequestHandler
        ), 200);
    }

    _getScrollIndex = () => (
        Math.max(0, this.props.eventItems.findIndex(
            item => (
                item.type === 'day' &&
                // in case we change parameter format, compare using moment
                item.dateTime.isSame(moment(this.props.match.params.date), 'day')
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
            <div className="event-list">
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
                                    window.cancelAnimationFrame(this.requestId);        // if we scroll manually, hijack the animation.
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
