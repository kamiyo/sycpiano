import 'less/Schedule/event-list.less';

import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { AutoSizer } from 'react-virtualized/dist/es/AutoSizer';
import { CellMeasurer, CellMeasurerCache } from 'react-virtualized/dist/es/CellMeasurer';
import { List, ListRowRenderer } from 'react-virtualized/dist/es/List';

import { easeQuadOut } from 'd3-ease';
import moment from 'moment-timezone';

import { dispatchAnimateFinish, dispatchAnimateStart, dispatchSelectEvent } from 'src/components/Schedule/actions';
import EventItem from 'src/components/Schedule/EventItem';
import EventMonthItem from 'src/components/Schedule/EventMonthItem';
import { DayItemShape, EventItemShape, ListWithGrid, MonthItemShape } from 'src/components/Schedule/types';
import { GlobalStateShape } from 'src/types';

import animateFn from 'src/components/animate';

const cache = new CellMeasurerCache({ fixedWidth: true });

interface EventListStateToProps {
    readonly eventItems: EventItemShape[];
    readonly hasEventBeenSelected: boolean;
}

interface EventListDispatchToProps {
    readonly dispatchSelectEvent: (item: EventItemShape) => void;
    readonly dispatchAnimateStart: () => void;
    readonly dispatchAnimateFinish: () => void;
}

type EventListProps = RouteComponentProps<{ date: string }> & EventListStateToProps & EventListDispatchToProps;

class EventList extends React.Component<EventListProps, {}> {
    private currentOffset = 0;
    private maxOffset = 0;
    private requestId: number;
    private List: ListWithGrid;

    componentDidUpdate() {
        if (this.props.eventItems.length !== 0) {
            const outerHeight = Math.floor(document.getElementsByClassName('event-list')[0].clientHeight);
            const innerHeight = this.List.Grid._scrollingContainer.scrollHeight;        // HACK! Virtualized does not expose this to us =(
            this.maxOffset = innerHeight - outerHeight;
        }
        if (this.props.hasEventBeenSelected) {
            this.scrollToSelectedRow();
            return;
        }
        if (this.props.match.params.date) {
            const scrollIndex = this.getScrollIndex();
            this.List.scrollToPosition(this.List.getOffsetForRow({ index: scrollIndex }));
        } else {
            this.List.scrollToRow(0);
        }
    }

    animationRequestHandler = (requestId: number) => {
        this.requestId = requestId;
    }

    render() {
        return (
            <div className='event-list'>
                {
                    <AutoSizer>
                        {({ height, width }) => (
                            <List
                                ref={(div) => this.List = div}
                                height={height}
                                width={width}
                                rowCount={this.props.eventItems.length}
                                rowHeight={cache.rowHeight}
                                deferredMeasurementCache={cache}
                                rowRenderer={this.rowItemRenderer}
                                scrollToAlignment='start'
                                noRowsRenderer={() => <div />}
                                // react-virtualized needs estimatedRowSize to be a close approximation
                                // to the actual calculated row size:
                                // https://github.com/bvaughn/react-virtualized/blob/master/source/Grid/utils/CellSizeAndPositionManager.js#L152
                                estimatedRowSize={300}
                                onScroll={({ scrollTop }: { scrollTop: number }) => {
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

    private scrollToSelectedRow = () => {
        const targetIndex = this.getScrollIndex();
        const targetOffset = Math.min(this.List.getOffsetForRow({ index: targetIndex }), this.maxOffset);
        this.props.dispatchAnimateStart();
        setTimeout(() => animateFn(
            this.currentOffset,
            targetOffset,
            Math.min(Math.abs(this.currentOffset - targetOffset) / 2, 500),
            (position) => this.List.scrollToPosition(position),
            easeQuadOut,
            () => { this.props.dispatchAnimateFinish(); },
            this.animationRequestHandler,
        ), 200);
    }

    private getScrollIndex = () => (
        Math.max(0, this.props.eventItems.findIndex(
            (item) => (
                item.type === 'day' &&
                // in case we change parameter format, compare using moment
                (item as DayItemShape).dateTime.isSame(moment(this.props.match.params.date), 'day')
            ),
        ))
    )

    private renderEventItem = (index: number, style: React.CSSProperties) => {
        const item = this.props.eventItems[index];
        if (item.type === 'month') {
            return (
                <EventMonthItem
                    month={(item as MonthItemShape).month}
                    style={style}
                />
            );
        }
        return (
            <EventItem
                event={item as DayItemShape}
                style={style}
                handleSelect={() => {
                    this.props.dispatchSelectEvent(item);
                }}
            />
        );
    }

    private rowItemRenderer: ListRowRenderer = ({ index, key, parent, style }) => (
        <CellMeasurer
            cache={cache}
            columnIndex={0}
            key={key}
            rowIndex={index}
            parent={parent}
        >
            {() => this.renderEventItem(index, style)}
        </CellMeasurer>
    )
}

const mapStateToProps = (state: GlobalStateShape) => ({
    eventItems: state.schedule_eventItems.items,
    hasEventBeenSelected: state.schedule_eventItems.hasEventBeenSelected,
});

export default connect<EventListStateToProps, EventListDispatchToProps>(
    mapStateToProps,
    {
        dispatchSelectEvent,
        dispatchAnimateStart,
        dispatchAnimateFinish,
    },
)(EventList);
