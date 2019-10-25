import startCase from 'lodash-es/startCase';
import { parse } from 'qs';
import * as React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { AutoSizer } from 'react-virtualized/dist/es/AutoSizer';
import { CellMeasurer, CellMeasurerCache } from 'react-virtualized/dist/es/CellMeasurer';
import { List, ListRowRenderer } from 'react-virtualized/dist/es/List';

import { css } from '@emotion/core';
import styled from '@emotion/styled';

import debounce from 'lodash-es/debounce';
import { default as moment, Moment } from 'moment-timezone';

import { LoadingInstance } from 'src/components/LoadingSVG';
import { createFetchEventsAction, createSearchEventsAction, selectEvent } from 'src/components/Schedule/actions';
import EventItem from 'src/components/Schedule/EventItem';
import EventMonthItem from 'src/components/Schedule/EventMonthItem';
import {
    DayItem,
    EventItemType,
    EventListName,
    FetchEventsArguments,
    itemIsDay,
    itemIsMonth,
    itemNotLoading,
} from 'src/components/Schedule/types';
import { lightBlue } from 'src/styles/colors';
import { lato2 } from 'src/styles/fonts';
import { screenXSorPortrait } from 'src/styles/screens';
import { GlobalStateShape } from 'src/types';
import { metaDescriptions, titleStringBase } from 'src/utils';

interface EventListStateToProps {
    readonly eventItems: EventItemType[];
    readonly hasEventBeenSelected: boolean;
    readonly minDate: Moment;
    readonly maxDate: Moment;
    readonly currentItem: DayItem;
    readonly isFetchingList: boolean;
    readonly hasMore: boolean;
}

interface EventListDispatchToProps {
    readonly selectEvent: typeof selectEvent;
    readonly createFetchEventsAction: typeof createFetchEventsAction;
    readonly createSearchEventsAction: typeof createSearchEventsAction;
}

interface EventListOwnProps {
    readonly date?: string;
    readonly type: EventListName;
    readonly isMobile?: boolean;
    readonly search?: string;
}

type EventListProps = RouteComponentProps<ParamProps> & EventListOwnProps & EventListStateToProps & EventListDispatchToProps;

interface ParamProps {
    readonly date?: string;
    readonly search?: string;
}

interface OnScrollProps {
    scrollTop: number;
    scrollHeight: number;
    clientHeight: number;
}

const StyledLoadingInstance = styled(LoadingInstance)`
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

const placeholderStyle = css`
    width: 80%;
    height: 100%;
    min-height: 6.5rem;
    max-width: 1240px;
    margin: 0 auto;
    font-family: ${lato2};
    font-size: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;

    ${screenXSorPortrait} {
        width: 90%;
        font-size: 1.5rem;
    }
`;

const firstElementStyle = css`
    ${placeholderStyle}
    padding-top: 85px;
    justify-content: unset;
    padding-left: 28px;
    min-height: 4.5rem;
`;

class EventList extends React.Component<EventListProps> {
    private List: React.RefObject<List> = React.createRef();
    private updatedCurrent = true;
    private currentQuery: {
        q: string;
    } = {
            q: undefined,
        };

    constructor(props: EventListProps) {
        super(props);
    }

    fetchDateParam = (type: string) => type === 'upcoming' ? 'after' : 'before';

    // we are inserting an item at the front and one at the back of the list
    // total length of List will be eventItems.length + 2
    keyMapper = (rowIndex: number) => {
        const temp =
            rowIndex ?
                (this.props.eventItems.length && this.props.eventItems[rowIndex - 1] ?
                    this.props.type + '_' + this.props.eventItems[rowIndex - 1].dateTime.format() :
                    this.props.type + '_loading'
                ) :
                'placeholder_' + decodeURI(this.props.location.search);
        return temp;
    }

    cache = new CellMeasurerCache({ fixedWidth: true, keyMapper: this.keyMapper });

    onMountOrUpdate() {
        const date = moment(this.props.match.params.date, 'YYYY-MM-DD');
        this.currentQuery = parse(this.props.location.search, { ignoreQueryPrefix: true });
        if (this.currentQuery.q) {
            this.props.createSearchEventsAction('search', { q: this.currentQuery.q });
        } else {
            if (this.props.eventItems.length === 0) {
                let params: FetchEventsArguments;
                if (this.props.match.params.date) {
                    params = {
                        date,
                        scrollTo: true,
                    };
                } else {
                    params = {
                        [this.fetchDateParam(this.props.type)]: moment(),
                        scrollTo: false,
                    };
                }
                this.props.createFetchEventsAction(this.props.type, params);
                return;
            } else if (
                this.props.match.params.date &&
                !this.props.eventItems.find(
                    (value) => itemNotLoading(value) && value.dateTime.utc().isSame(date.utc(), 'day'),
                )
            ) {
                const params: FetchEventsArguments = {
                    date,
                    scrollTo: true,
                };
                this.props.createFetchEventsAction(this.props.type, params);
                return;
            }
        }
    }

    componentDidMount() {
        // enforce if date is after now, use upcoming
        // or if date is before now, use archive
        const strDate = this.props.match.params.date;
        const date = moment(this.props.match.params.date, 'YYYY-MM-DD');
        if (strDate) {
            if (date.isSameOrAfter(moment(), 'day') && this.props.type === 'archive') {
                this.props.history.replace(`/schedule/upcoming/${strDate}`);
                return;
            } else if (date.isBefore(moment(), 'day') && this.props.type === 'upcoming') {
                this.props.history.replace(`/schedule/archive/${strDate}`);
                return;
            }
        }

        this.onMountOrUpdate();
    }

    componentDidUpdate(prevProps: EventListProps) {
        this.onMountOrUpdate();
        if (prevProps.currentItem !== this.props.currentItem) {
            this.updatedCurrent = true;
        }
        if (prevProps.type !== this.props.type) {
            this.props.currentItem && this.props.selectEvent(this.props.type, undefined);
            this.cache.clearAll();
        }
    }

    getScrollFetchParams: {
        [key: string]: () => FetchEventsArguments;
    } = {
            upcoming: () => ({
                after: this.props.maxDate,
            }),
            archive: () => ({
                before: this.props.minDate,
            }),
        };

    onScroll = ({ clientHeight, scrollTop, scrollHeight }: OnScrollProps) => {
        if (scrollTop + clientHeight > scrollHeight - 600 &&
            this.props.hasMore &&
            !this.props.isFetchingList &&
            this.props.maxDate &&
            this.props.minDate
        ) {
            if (this.props.type !== 'search') {
                this.props.createFetchEventsAction(this.props.type, this.getScrollFetchParams[this.props.type]());
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
            : ` | ${this.props.type === 'archive' ? 'Archived' : startCase(this.props.type)} Events${
            this.props.location.search ? ': ' + decodeURI(this.currentQuery.q) : ''
            }`);

        const description = item
            ? `${startCase(this.props.type)} ${startCase(item.eventType)}: ${item.name}`
            : metaDescriptions[this.props.type];

        return (
            <React.Fragment>
                <Helmet
                    title={title}
                    meta={[
                        {
                            name: 'description',
                            content: description,
                        },
                    ]}
                />
                <div css={fullWidthHeight}>
                    {(
                        <AutoSizer>
                            {({ height, width }) => (
                                <List
                                    ref={this.List}
                                    height={height}
                                    width={width}
                                    rowCount={this.props.eventItems.length + 2}
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
                    )}
                </div>
            </React.Fragment>
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
        if (index === this.props.eventItems.length + 1) {
            return (
                <div style={style} >
                    {this.props.hasMore && this.props.isFetchingList ?
                        <StyledLoadingInstance width={80} height={80} />
                        : (
                            <div css={placeholderStyle}>
                                {this.props.eventItems.length === 0 ? 'No Events Fetched' : ''}
                            </div>
                        )}
                </div>
            );
        }
        if (index === 0) {
            const count = this.props.eventItems.filter((ev) => itemIsDay(ev)).length;
            return (
                <div style={style}>
                    <div css={firstElementStyle}>
                        {this.props.type === 'search' ?
                            `Search results for "${decodeURI(this.currentQuery.q)}": ${count} results` :
                            ''
                        }
                    </div>
                </div>
            );
        }
        const item = this.props.eventItems[index - 1];
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
            const permaLink = `/schedule/${item.dateTime.format('YYYY-MM-DD')}`;
            return (
                <EventItem
                    measure={measure}
                    event={item}
                    style={style}
                    handleSelect={() => this.props.selectEvent(this.props.type, item)}
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
            key={`${key}_${this.props.type}`}
            rowIndex={index}
            parent={parent}
        >
            {({ measure }) => this.renderEventItem(index, style, measure)}
        </CellMeasurer>
    )
}

const mapStateToProps = (state: GlobalStateShape, ownProps: EventListOwnProps): EventListStateToProps => {
    const reducer = state.schedule_eventItems[ownProps.type];
    return {
        eventItems: reducer.itemArray,
        hasEventBeenSelected: reducer.hasEventBeenSelected,
        minDate: reducer.minDate,
        maxDate: reducer.maxDate,
        currentItem: reducer.currentItem,
        isFetchingList: reducer.isFetchingList,
        hasMore: reducer.hasMore,
    };
};

const mapDispatchToProps: EventListDispatchToProps = {
    selectEvent,
    createFetchEventsAction,
    createSearchEventsAction,
};

export default connect<EventListStateToProps, EventListDispatchToProps, EventListOwnProps>(
    mapStateToProps,
    mapDispatchToProps,
)(EventList);
