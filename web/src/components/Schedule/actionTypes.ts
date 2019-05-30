import SCHEDULE_ACTIONS from 'src/components/Schedule/actionTypeKeys';
import { DayItem, EventItemType, EventListName } from 'src/components/Schedule/types';

interface EventsBaseAction {
    readonly name: EventListName;
}

export interface FetchEventsSuccess extends EventsBaseAction {
    readonly type: typeof SCHEDULE_ACTIONS.FETCH_EVENTS_SUCCESS;
    readonly listItems: EventItemType[];
    readonly currentItem: DayItem;
    readonly hasMore: boolean;
    readonly setOfMonths?: Set<string>;
    readonly lastQuery?: string;
}

export interface FetchEventsRequest extends EventsBaseAction {
    readonly type: typeof SCHEDULE_ACTIONS.FETCH_EVENTS_REQUEST;
}

export interface FetchEventsError extends EventsBaseAction {
    readonly type: typeof SCHEDULE_ACTIONS.FETCH_EVENTS_ERROR;
}

export interface FetchLatLngRequest extends EventsBaseAction {
    readonly type: typeof SCHEDULE_ACTIONS.FETCH_LAT_LNG_REQUEST;
}

export interface FetchLatLngSuccess extends EventsBaseAction {
    readonly type: typeof SCHEDULE_ACTIONS.FETCH_LAT_LNG_SUCCESS;
    readonly lat: number;
    readonly lng: number;
}

export interface FetchLatLngError extends EventsBaseAction {
    readonly type: typeof SCHEDULE_ACTIONS.FETCH_LAT_LNG_ERROR;
}

export interface SelectEvent extends EventsBaseAction {
    readonly type: typeof SCHEDULE_ACTIONS.SELECT_EVENT;
    readonly eventItem: DayItem;
}

export interface ClearList extends EventsBaseAction {
    readonly type: typeof SCHEDULE_ACTIONS.CLEAR_LIST;
}

export interface OtherAction extends EventsBaseAction {
    readonly type: typeof SCHEDULE_ACTIONS.OTHER_ACTION;
}

type ScheduleActionsTypes = FetchEventsError | FetchEventsRequest | ClearList |
    FetchEventsSuccess | FetchLatLngError | FetchLatLngRequest | FetchLatLngSuccess |
    SelectEvent | OtherAction;

export default ScheduleActionsTypes;
