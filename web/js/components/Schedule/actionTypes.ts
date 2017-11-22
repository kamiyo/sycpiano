import SCHEDULE_ACTIONS from 'js/components/Schedule/actionTypeKeys';

export interface FetchEventsSuccess {
    readonly type: SCHEDULE_ACTIONS.FETCH_EVENTS_SUCCESS;
    readonly listItems: any[];
    readonly currentItem: any;
}
export interface FetchEventsRequest {
    readonly type: SCHEDULE_ACTIONS.FETCH_EVENTS_REQUEST;
}
export interface FetchEventsError {
    readonly type: SCHEDULE_ACTIONS.FETCH_EVENTS_ERROR;
}
export interface FetchLatLngRequest {
    readonly type: SCHEDULE_ACTIONS.FETCH_LAT_LNG_REQUEST;
}
export interface FetchLatLngSuccess {
    readonly type: SCHEDULE_ACTIONS.FETCH_LAT_LNG_SUCCESS;
    readonly lat: number;
    readonly lng: number;
}
export interface FetchLatLngError {
    readonly type: SCHEDULE_ACTIONS.FETCH_LAT_LNG_ERROR;
}
export interface SelectEvent {
    readonly type: SCHEDULE_ACTIONS.SELECT_EVENT;
    readonly eventItem: any;
}
export interface ScrollStart {
    readonly type: SCHEDULE_ACTIONS.SCROLL_START;
}
export interface ScrollFinish {
    readonly type: SCHEDULE_ACTIONS.SCROLL_FINISH;
}
export interface OtherAction {
    readonly type: SCHEDULE_ACTIONS.OTHER_ACTION;
}
type ScheduleActionsTypes =
    FetchEventsError | FetchEventsRequest | FetchEventsSuccess |
    FetchLatLngError | FetchLatLngRequest | FetchLatLngSuccess |
    SelectEvent | ScrollStart | ScrollFinish | OtherAction;

export default ScheduleActionsTypes;