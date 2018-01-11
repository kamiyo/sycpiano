enum SCHEDULE_ACTIONS {
    FETCH_EVENTS_SUCCESS = 'SCHEDULE--FETCH_EVENTS_SUCCESS',
    FETCH_EVENTS_REQUEST = 'SCHEDULE--FETCH_EVENTS_REQUEST',
    FETCH_EVENTS_ERROR = 'SCHEDULE--FETCH_EVENTS_ERROR',
    FETCH_LAT_LNG_REQUEST = 'SCHEDULE--FETCH_LAT_LNG_REQUEST',
    FETCH_LAT_LNG_SUCCESS = 'SCHEDULE--FETCH_LAT_LNG_SUCCESS',
    FETCH_LAT_LNG_ERROR = 'SCHEDULE--FETCH_LAT_LNG_ERROR',
    SELECT_EVENT = 'SCHEDULE--SELECT_EVENT',
    SWITCH_LIST = 'SCHEDULE--SWITCH_LIST',
    OTHER_ACTION = 'SCHEDULE--OTHER_ACTION',
}

export default SCHEDULE_ACTIONS;
