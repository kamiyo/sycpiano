import SCHEDULE_ACTIONS from 'src/components/Schedule/actionTypeKeys';
import { DayItem, EventItemType } from 'src/components/Schedule/types';

export type EventListName = 'upcoming' | 'archive';

export interface SwitchList {
    readonly type: typeof SCHEDULE_ACTIONS.SWITCH_LIST;
    readonly name: EventListName;
}

export interface FetchEventsSuccess {
    readonly type: typeof SCHEDULE_ACTIONS.FETCH_EVENTS_SUCCESS;
    readonly listItems: EventItemType[];
    readonly currentItem: DayItem;
    readonly hasMore: boolean;
}

export interface FetchEventsRequest {
    readonly type: typeof SCHEDULE_ACTIONS.FETCH_EVENTS_REQUEST;
}

export interface FetchEventsError {
    readonly type: typeof SCHEDULE_ACTIONS.FETCH_EVENTS_ERROR;
}

export interface FetchLatLngRequest {
    readonly type: typeof SCHEDULE_ACTIONS.FETCH_LAT_LNG_REQUEST;
}

export interface FetchLatLngSuccess {
    readonly type: typeof SCHEDULE_ACTIONS.FETCH_LAT_LNG_SUCCESS;
    readonly lat: number;
    readonly lng: number;
}

export interface FetchLatLngError {
    readonly type: typeof SCHEDULE_ACTIONS.FETCH_LAT_LNG_ERROR;
}

export interface SelectEvent {
    readonly type: typeof SCHEDULE_ACTIONS.SELECT_EVENT;
    readonly eventItem: DayItem;
}

export interface OtherAction {
    readonly type: typeof SCHEDULE_ACTIONS.OTHER_ACTION;
}

type ScheduleActionsTypes = SwitchList |
    FetchEventsError | FetchEventsRequest | FetchEventsSuccess |
    FetchLatLngError | FetchLatLngRequest | FetchLatLngSuccess |
    SelectEvent | OtherAction;

export default ScheduleActionsTypes;
