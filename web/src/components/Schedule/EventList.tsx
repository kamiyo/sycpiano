import * as React from 'react';
import { css } from 'react-emotion';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { AutoSizer } from 'react-virtualized/dist/es/AutoSizer';
import { CellMeasurer, CellMeasurerCache } from 'react-virtualized/dist/es/CellMeasurer';
import { List, ListRowRenderer } from 'react-virtualized/dist/es/List';

import debounce from 'lodash-es/debounce';
import { default as moment, Moment } from 'moment-timezone';

import { createFetchEventsAction, selectEvent, switchList } from 'src/components/Schedule/actions';
import { EventListName } from 'src/components/Schedule/actionTypes';
import EventItem from 'src/components/Schedule/EventItem';
import EventMonthItem from 'src/components/Schedule/EventMonthItem';
import {
    DayItem,
    EventItemType,
    FetchEventsArguments,
    ListWithGrid,
} from 'src/components/Schedule/types';
import { GlobalStateShape } from 'src/types';

const cache = new CellMeasurerCache({ fixedWidth: true });

interface EventListStateToProps {
    readonly eventItems: EventItemType[];
    readonly hasEventBeenSelected: boolean;
    readonly minDate: Moment;
    readonly maxDate: Moment;
    readonly currentItem: DayItem;
    readonly isFetchingList: boolean;
    readonly activeName: EventListName;
}

interface EventListDispatchToProps {
    readonly selectEvent: (item: EventItemType) => void;
    readonly createFetchEventsAction: (args: FetchEventsArguments) => void;
    readonly switchList: (name: EventListName) => void;
}

interface EventListOwnProps {
    readonly type: EventListName;
}

type EventListProps = RouteComponentProps<ParamProps> & EventListOwnProps & EventListStateToProps & EventListDispatchToProps;

interface ParamProps {
    readonly date: string;
}

interface EventListState {
    scrollUpdater: boolean;
}

class EventList extends React.Component<EventListProps, EventListState> {
    private List: ListWithGrid;
    private updateReason: 'listChange' | 'selectItem' | 'typeChange' | 'activeChange' | 'initialList' | 'unsetScroll';
    state = {
        scrollUpdater: false,
    };

    componentWillMount() {
        // enforce if date is after now, use upcoming
        // or if date is before now, use archive
        const date = this.props.match.params.date;
        if (date) {
            if (moment(date).isSameOrAfter(moment(), 'day') && this.props.type === 'archive') {
                this.props.history.replace(`/schedule/upcoming/${date}`);
            } else if (moment(date).isBefore(moment(), 'day') && this.props.type === 'upcoming') {
                this.props.history.replace(`/schedule/archive/${date}`);
            }
        }

        // activate redux state for current type
        this.props.switchList(this.props.type);
        let params;
        if (date) {
            params = { date: moment(date, 'YYYY-MM-DD'), scrollTo: true };
        } else if (this.props.type === 'upcoming') {
            params = { after: moment(), scrollTo: true };
        } else if (this.props.type === 'archive') {
            params = { before: moment(), scrollTo: true };
        }
        this.props.createFetchEventsAction({ ...params });
    }

    componentWillUpdate(nextProps: EventListProps) {
        if (this.updateReason === 'typeChange') {
            nextProps.switchList(nextProps.type);
            return;
        }

        if (this.updateReason === 'activeChange') {
            const date = nextProps.match.params.date;
            let params;
            if (nextProps.eventItems.length === 0) {
                if (date) {
                    params = { date: moment(date, 'YYYY-MM-DD'), scrollTo: true };
                } else if (nextProps.activeName === 'upcoming') {
                    params = { after: moment(), scrollTo: true };
                } else if (nextProps.activeName === 'archive') {
                    params = { before: moment(), scrollTo: true };
                }
            } else if (
                date &&
                nextProps.eventItems.find(
                    (value) => value.dateTime.isSame(moment(date), 'day'))
            ) {
                params = { date: moment(date, 'YYYY-MM-DD'), scrollTo: true };
            } else {
                return;
            }
            nextProps.createFetchEventsAction({ ...params });
        }
    }

    // used to force List component to unset scrollToIndex prop on List
    // after successful update of any non-unset-scroll type, because
    // bug in library causes upwards scroll to lock if the prop is set.
    componentDidUpdate() {
        if (this.updateReason !== 'unsetScroll') {
            this.setState({ scrollUpdater: !this.state.scrollUpdater });
        }
    }

    shouldComponentUpdate(nextProps: EventListProps, nextState: any) {
        if (nextProps.type !== this.props.type) {
            this.updateReason = 'typeChange';
            return true;
        }
        if (nextProps.activeName !== this.props.activeName) {
            this.updateReason = 'activeChange';
            return true;
        }
        if (!this.props.eventItems.length && nextProps.eventItems.length) {
            this.updateReason = 'initialList';
            return true;
        }
        if (nextProps.eventItems.length !== this.props.eventItems.length) {
            this.updateReason = 'listChange';
            return true;
        }
        if (nextProps.currentItem !== this.props.currentItem) {
            this.updateReason = 'selectItem';
            return true;
        }
        if (nextState.scrollUpdater !== this.state.scrollUpdater) {
            this.updateReason = 'unsetScroll';
            return true;
        }
        this.updateReason = null;
        return false;
    }

    onScroll = ({ clientHeight, scrollTop, scrollHeight }: { scrollTop: number; scrollHeight: number; clientHeight: number }) => {
        if (this.props.isFetchingList) {
            return;
        }
        debounce(() => {
            if (scrollTop + clientHeight > scrollHeight - 400) {
                if (this.props.type === 'upcoming') {
                    this.props.createFetchEventsAction({
                        after: this.props.maxDate,
                    });
                } else if (this.props.type === 'archive') {
                    this.props.createFetchEventsAction({
                        before: this.props.minDate,
                    });
                }
            }
        }, 1000, { leading: true })();
    }

    getScrollTarget = () => {
        if (this.updateReason === 'initialList' ||
            this.updateReason === 'activeChange') {
            if (this.props.currentItem) {
                return this.getScrollIndex(this.props.currentItem);
            } else {
                return 0;
            }
        } else {
            return -1;
        }
    }

    render() {
        return (
            <div className={css`width: 100%; height: 100%;`}>
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
                                scrollToAlignment="center"
                                noRowsRenderer={() => <div />}
                                estimatedRowSize={200}
                                onScroll={this.onScroll as any}
                                scrollToIndex={this.getScrollTarget()}
                            />
                        )}
                    </AutoSizer>
                }
            </div>
        );
    }

    private getScrollIndex = (currentItem: DayItem) => (
        Math.max(0, this.props.eventItems.findIndex(
            (item) => (
                item && item.type === 'day' &&
                // in case we change parameter format, compare using moment
                (item as DayItem).dateTime.isSame(currentItem.dateTime, 'day')
            ),
        ))
    )

    public renderEventItem = (
        index: number,
        style: React.CSSProperties,
        measure: () => void,
    ) => {
        const item = this.props.eventItems[index];
        if (item.type === 'month') {
            return (
                <EventMonthItem
                    measure={measure}
                    month={item.month}
                    year={item.year}
                    style={style}
                />
            );
        }
        return (
            <EventItem
                measure={measure}
                event={item as DayItem}
                style={style}
                handleSelect={() => this.props.selectEvent(item)}
                type={this.props.type}
                active={item.id === this.props.currentItem.id}
            />
        );
    }

    private rowItemRenderer: ListRowRenderer = ({ index, key, parent, style }) => (
        <CellMeasurer
            cache={cache}
            columnIndex={0}
            key={key}
            rowIndex={index}
            parent={parent as any}
        >
            {({ measure }) => this.renderEventItem(index, style, measure)}
        </CellMeasurer>
    )
}

const mapStateToProps = (state: GlobalStateShape): EventListStateToProps => {
    const name = state.schedule_eventItems.activeName;
    const reducer = state.schedule_eventItems[name];
    return {
        eventItems: reducer.items.toArray(),
        hasEventBeenSelected: reducer.hasEventBeenSelected,
        minDate: reducer.minDate,
        maxDate: reducer.maxDate,
        currentItem: reducer.currentItem,
        isFetchingList: reducer.isFetchingList,
        activeName: name,
    };
};

const mapDispatchToProps: EventListDispatchToProps = {
    selectEvent,
    createFetchEventsAction,
    switchList,
};

export default connect<EventListStateToProps, EventListDispatchToProps, EventListOwnProps>(
    mapStateToProps,
    mapDispatchToProps,
)(EventList);
