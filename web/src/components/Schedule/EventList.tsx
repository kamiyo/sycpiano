import * as React from 'react';
import styled, { css } from 'react-emotion';
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
    FetchEventsArguments,
    itemIsDay,
    itemIsMonth,
    itemNotLoading,
    ListWithGrid,
} from 'src/components/Schedule/types';
import { lightBlue } from 'src/styles/colors';
import { GlobalStateShape } from 'src/types';

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
    readonly selectEvent: (item: EventItemType) => void;
    readonly createFetchEventsAction: (args: FetchEventsArguments) => void;
    readonly switchList: (name: EventListName) => void;
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
    private List: ListWithGrid;
    state = {
        updatedCurrent: false,
    };

    keyMapper = (rowIndex: number) => {
        return this.props.eventItems.length && this.props.eventItems[rowIndex] ? this.props.eventItems[rowIndex].dateTime.format() : '';
    }

    cache = new CellMeasurerCache({ fixedWidth: true, keyMapper: this.keyMapper});

    componentWillMount() {
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

    componentWillUpdate(nextProps: EventListProps & { [key: string]: any }) {
        const date = moment(nextProps.match.params.date, 'YYYY-MM-DD');
        if (nextProps.type !== this.props.type) {
            nextProps.switchList(nextProps.type);
            return;
        } else if (nextProps.eventItems.length === 0 && nextProps.hasMore && !nextProps.isFetchingList) {
            let params;
            if (nextProps.match.params.date) {
                params = { date, scrollTo: true };
            } else if (nextProps.activeName === 'upcoming') {
                params = { after: moment(), scrollTo: false };
            } else if (nextProps.activeName === 'archive') {
                params = { before: moment(), scrollTo: false };
            }
            nextProps.createFetchEventsAction(params);
            return;
        } else if (nextProps.activeName !== this.props.activeName) {
            let params;
            if (nextProps.eventItems.length === 0) {
                if (nextProps.match.params.date) {
                    params = { date, scrollTo: true };
                } else if (nextProps.activeName === 'upcoming') {
                    params = { after: moment(), scrollTo: false };
                } else if (nextProps.activeName === 'archive') {
                    params = { before: moment(), scrollTo: false };
                }
            } else if (
                nextProps.match.params.date &&
                !nextProps.eventItems.find(
                    (value) => itemNotLoading(value) && value.dateTime.isSame(moment(date), 'day'))
            ) {
                params = { date, scrollTo: true };
            } else {
                this.setState({ updatedCurrent: true });
                return;
            }
            nextProps.createFetchEventsAction({ ...params });
            return;
        } else if (nextProps.currentItem !== this.props.currentItem) {
            this.setState({ updatedCurrent: true });
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
        if (this.state.updatedCurrent) {
            if (this.props.currentItem) {
                this.setState({updatedCurrent: false});
                return this.getScrollIndex(this.props.currentItem);
            } else {
                this.setState({updatedCurrent: false});
                return 0;
            }
        } else {
            return -1;
        }
    }

    render() {
        return (
            <div className={fullWidthHeight}>
                {
                    <AutoSizer>
                        {({ height, width }) => (
                            <List
                                ref={(div) => this.List = div}
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

            const permaLink = `${window.location.host}/schedule/${this.props.type}/${item.dateTime.format('YYYY-MM-DD')}`;
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
