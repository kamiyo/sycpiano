import SCHEDULE_ACTIONS from 'src/components/Schedule/actionTypeKeys';
import { EventItemShape } from 'src/components/Schedule/types';

export interface FetchEventsSuccess {
    readonly type: typeof SCHEDULE_ACTIONS.FETCH_EVENTS_SUCCESS;
    readonly listItems: EventItemShape[];
    readonly currentItem: EventItemShape;
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
    readonly lat: () => number;
    readonly lng: () => number;
}

export interface FetchLatLngError {
    readonly type: typeof SCHEDULE_ACTIONS.FETCH_LAT_LNG_ERROR;
}

export interface SelectEvent {
    readonly type: typeof SCHEDULE_ACTIONS.SELECT_EVENT;
    readonly eventItem: EventItemShape;
}

export interface ScrollStart {
    readonly type: typeof SCHEDULE_ACTIONS.SCROLL_START;
}

export interface ScrollFinish {
    readonly type: typeof SCHEDULE_ACTIONS.SCROLL_FINISH;
}

export interface OtherAction {
    readonly type: typeof SCHEDULE_ACTIONS.OTHER_ACTION;
}

type ScheduleActionsTypes =
    FetchEventsError | FetchEventsRequest | FetchEventsSuccess |
    FetchLatLngError | FetchLatLngRequest | FetchLatLngSuccess |
    SelectEvent | ScrollStart | ScrollFinish | OtherAction;

export default ScheduleActionsTypes;
