import startCase from 'lodash-es/startCase';
import * as React from 'react';
import styled, { css } from 'react-emotion';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { AutoSizer } from 'react-virtualized/dist/es/AutoSizer';
import { CellMeasurer, CellMeasurerCache } from 'react-virtualized/dist/es/CellMeasurer';
import { List, ListRowRenderer } from 'react-virtualized/dist/es/List';

import debounce from 'lodash-es/debounce';
import { default as moment, Moment } from 'moment-timezone';

import { LoadingInstance } from 'src/components/LoadingSVG';
import { createFetchEventsAction, selectEvent, switchList } from 'src/components/Schedule/actions';
import { EventListName } from 'src/components/Schedule/actionTypes';
import EventItem from 'src/components/Schedule/EventItem';
import EventMonthItem from 'src/components/Schedule/EventMonthItem';
import {
    DayItem,
    EventItemType,
    itemIsDay,
    itemIsMonth,
    itemNotLoading,
} from 'src/components/Schedule/types';
import { lightBlue } from 'src/styles/colors';
import { GlobalStateShape } from 'src/types';
import { metaDescriptions, titleStringBase } from 'src/utils';

interface EventListStateToProps {
    readonly eventItems: EventItemType[];
    readonly hasEventBeenSelected: boolean;
    readonly minDate: Moment;
    readonly maxDate: Moment;
    readonly currentItem: DayItem;
    readonly isFetchingList: boolean;
    readonly activeName: EventListName;
    readonly hasMore: boolean;
}

interface EventListDispatchToProps {
    readonly selectEvent: typeof selectEvent;
    readonly createFetchEventsAction: typeof createFetchEventsAction;
    readonly switchList: typeof switchList;
}

interface EventListOwnProps {
    readonly date: string;
    readonly type: EventListName;
    readonly isMobile?: boolean;
}

type EventListProps = RouteComponentProps<ParamProps> & EventListOwnProps & EventListStateToProps & EventListDispatchToProps;

interface ParamProps {
    readonly type: string;
    readonly date: string;
}

interface OnScrollProps {
    scrollTop: number;
    scrollHeight: number;
    clientHeight: number;
}

const StyledLoadingInstance = styled(LoadingInstance) `
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    padding: 10px;
    fill: none;
    stroke: ${lightBlue};
`;

const fullWidthHeight = css`
    width: 100%;
    height: 100%;
`;

class EventList extends React.Component<EventListProps, { updatedCurrent?: boolean; }> {
    private List: React.RefObject<List> = React.createRef();
    private updatedCurrent = true;

    keyMapper = (rowIndex: number) => {
        return this.props.eventItems.length && this.props.eventItems[rowIndex] ? this.props.eventItems[rowIndex].dateTime.format() : '';
    }

    cache = new CellMeasurerCache({ fixedWidth: true, keyMapper: this.keyMapper });

    componentDidMount() {
        // enforce if date is after now, use upcoming
        // or if date is before now, use archive
        const strDate = this.props.match.params.date;
        const date = moment(this.props.match.params.date, 'YYYY-MM-DD');
        if (strDate) {
            if (date.isSameOrAfter(moment(), 'day') && this.props.type === 'archive') {
                this.props.history.replace(`/schedule/upcoming/${strDate}`);
            } else if (date.isBefore(moment(), 'day') && this.props.type === 'upcoming') {
                this.props.history.replace(`/schedule/archive/${strDate}`);
            }
        }

        // activate redux state for current type
        this.props.switchList(this.props.type);
    }

    componentDidUpdate(prevProps: EventListProps & { [key: string]: any }) {
        const date = moment(this.props.match.params.date, 'YYYY-MM-DD');
        if (prevProps.type !== this.props.type) {
            this.props.switchList(this.props.type);
            return;
        } else if (this.props.eventItems.length === 0 && this.props.hasMore && !this.props.isFetchingList) {
            let params;
            if (this.props.match.params.date) {
                params = { date, scrollTo: true };
            } else if (this.props.activeName === 'upcoming') {
                params = { after: moment(), scrollTo: false };
            } else if (this.props.activeName === 'archive') {
                params = { before: moment(), scrollTo: false };
            }
            this.props.createFetchEventsAction(params);
            return;
        } else if (prevProps.activeName !== this.props.activeName) {
            let params;
            if (this.props.eventItems.length === 0) {
                if (this.props.match.params.date) {
                    params = { date, scrollTo: true };
                } else if (this.props.activeName === 'upcoming') {
                    params = { after: moment(), scrollTo: false };
                } else if (this.props.activeName === 'archive') {
                    params = { before: moment(), scrollTo: false };
                }
            } else if (
                this.props.match.params.date &&
                !this.props.eventItems.find(
                    (value) => itemNotLoading(value) && value.dateTime.isSame(moment(date), 'day'))
            ) {
                params = { date, scrollTo: true };
            } else {
                this.updatedCurrent = true;
                this.List.current.recomputeRowHeights();
                return;
            }
            this.props.createFetchEventsAction({ ...params });
            return;
        } else if (prevProps.currentItem !== this.props.currentItem) {
            this.updatedCurrent = true;
            return;
        }
    }

    onScroll = ({ clientHeight, scrollTop, scrollHeight }: OnScrollProps) => {
        if (scrollTop + clientHeight > scrollHeight - 400 && this.props.hasMore && !this.props.isFetchingList && this.props.maxDate && this.props.minDate) {
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
    }

    debouncedFetch = debounce(this.onScroll, 500, { leading: true });

    getScrollTarget = () => {
        if (this.updatedCurrent && this.props.eventItems.length) {
            if (this.props.currentItem) {
                this.updatedCurrent = false;
                return this.getScrollIndex(this.props.currentItem);
            } else {
                this.updatedCurrent = false;
                return 0;
            }
        } else {
            return -1;
        }
    }

    render() {
        const item: DayItem = this.props.eventItems.length && this.props.eventItems.find((event) =>
            itemIsDay(event) && moment(this.props.match.params.date).isSame(event.dateTime, 'day'),
        ) as DayItem;

        const title = `${titleStringBase} | Schedule` + (item
            ? ` | ${item.dateTime.format('dddd MMMM DD, YYYY, HH:mm zz')}`
            : ` | ${this.props.type === 'upcoming' ? 'Upcoming' : 'Archived'} Events`);

        const description = item
            ? `${startCase(this.props.type)} ${startCase(item.eventType)}: ${item.name}`
            : metaDescriptions[this.props.type];

        return (
            <>
                <Helmet>
                    <title>{title}</title>
                    <meta name="description" content={description} />
                </Helmet>
                <div className={fullWidthHeight}>
                    {
                        <AutoSizer>
                            {({ height, width }) => (
                                <List
                                    ref={this.List}
                                    height={height}
                                    width={width}
                                    rowCount={this.props.eventItems.length + 1}
                                    rowHeight={this.cache.rowHeight}
                                    deferredMeasurementCache={this.cache}
                                    rowRenderer={this.rowItemRenderer}
                                    scrollToAlignment="center"
                                    noRowsRenderer={() => <div />}
                                    estimatedRowSize={200}
                                    onScroll={this.debouncedFetch}
                                    scrollToIndex={this.getScrollTarget()}
                                />
                            )}
                        </AutoSizer>
                    }
                </div>
            </>
        );
    }

    private getScrollIndex = (currentItem: DayItem) => (
        Math.max(0, this.props.eventItems.findIndex(
            (item) => (
                item && itemIsDay(item) &&
                // in case we change parameter format, compare using moment
                item.dateTime.isSame(currentItem.dateTime, 'day')
            ),
        ))
    )

    public renderEventItem = (
        index: number,
        style: React.CSSProperties,
        measure: () => void,
    ) => {
        if (index === this.props.eventItems.length) {
            return (
                <div style={style} >
                    {this.props.hasMore && this.props.isFetchingList ?
                        <StyledLoadingInstance width={80} height={80} /> :
                        <div className={css` height: 100px; `} />
                    }
                </div>
            );
        }
        const item = this.props.eventItems[index];
        if (itemIsMonth(item)) {
            return (
                <EventMonthItem
                    measure={measure}
                    month={item.month}
                    year={item.year}
                    style={style}
                />
            );
        } else {
            const permaLink = `/schedule/${this.props.type}/${item.dateTime.format('YYYY-MM-DD')}`;
            return (
                <EventItem
                    measure={measure}
                    event={item}
                    style={style}
                    handleSelect={() => this.props.selectEvent(item)}
                    type={this.props.type}
                    active={this.props.currentItem && item.id === this.props.currentItem.id}
                    isMobile={this.props.isMobile}
                    permaLink={permaLink}
                />
            );
        }
    }

    private rowItemRenderer: ListRowRenderer = ({ index, key, parent, style }) => (
        <CellMeasurer
            cache={this.cache}
            columnIndex={0}
            key={`${key}_${this.props.activeName}`}
            rowIndex={index}
            parent={parent}
        >
            {({ measure }) => this.renderEventItem(index, style, measure)}
        </CellMeasurer>
    )
}

const mapStateToProps = (state: GlobalStateShape): EventListStateToProps => {
    const name = state.schedule_eventItems.activeName || 'upcoming';
    const reducer = state.schedule_eventItems[name];
    return {
        eventItems: reducer.itemArray,
        hasEventBeenSelected: reducer.hasEventBeenSelected,
        minDate: reducer.minDate,
        maxDate: reducer.maxDate,
        currentItem: reducer.currentItem,
        isFetchingList: reducer.isFetchingList,
        activeName: name,
        hasMore: reducer.hasMore,
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
