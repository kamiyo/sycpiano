import * as React from 'react';

import { default as moment, Moment } from 'moment-timezone';
import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { googleAPI } from 'src/services/GoogleAPI';

import ADMIN_ACTIONS from 'src/admin/components/actionTypeKeys';
import * as ActionTypes from 'src/admin/components/actionTypes';
import { AdminStoreShape } from 'src/admin/components/types';

const fetchEventsRequest = (): ActionTypes.FetchEventsRequest => ({
    type: ADMIN_ACTIONS.FETCH_EVENTS_REQUEST,
});

const fetchEventsSuccess = (events: GoogleCalendar.Event[]): ActionTypes.FetchEventsSuccess => ({
    type: ADMIN_ACTIONS.FETCH_EVENTS_SUCCESS,
    fetchedEvents: events,
});

export const fetchEventsError = (): ActionTypes.FetchEventsError => ({
    type: ADMIN_ACTIONS.FETCH_EVENTS_ERROR,
});

export const fetchEvents = (): ThunkAction<void, AdminStoreShape, void> => async (dispatch) => {
    try {
        dispatch(fetchEventsRequest());
        const response = await googleAPI.getCalendarEvents(moment(0));
        dispatch(fetchEventsSuccess(response.data.items));
    } catch (e) {
        console.log('admin fetch events error', e);
        dispatch(fetchEventsError());
    }
};

export const createFetchEventsAction = (): ThunkAction<void, AdminStoreShape, void> => (dispatch, getState) => {
    if (getState().eventList.isFetching) {
        return;
    } else {
        dispatch(fetchEvents());
    }
};

export const editEvent = (event: GoogleCalendar.Event) => (dispatch: Dispatch<AdminStoreShape>) => {
    dispatch({
        type: ADMIN_ACTIONS.EDIT_EVENT,
        event,
    } as ActionTypes.EditEvent);
};

export const onDateChange = (date: Moment) => (dispatch: Dispatch<AdminStoreShape>) => {
    dispatch({
        type: ADMIN_ACTIONS.UPDATE_DATE,
        date,
    } as ActionTypes.UpdateDate);
};

export const onTypeChange = (event: { value: string; label: string; }) => (dispatch: Dispatch<AdminStoreShape>) => {
    dispatch({
        type: ADMIN_ACTIONS.UPDATE_TYPE,
        value: event,
    } as ActionTypes.UpdateType);
};

export const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => (dispatch: Dispatch<AdminStoreShape>) => {
    dispatch({
        type: ADMIN_ACTIONS.UPDATE_NAME,
        value: event.target.value,
    } as ActionTypes.UpdateName);
};

export const onTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => (dispatch: Dispatch<AdminStoreShape>) => {
    dispatch({
        type: ADMIN_ACTIONS.UPDATE_TIME,
        value: event.target.value,
    } as ActionTypes.UpdateTime);
};

export const onLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => (dispatch: Dispatch<AdminStoreShape>) => {
    dispatch({
        type: ADMIN_ACTIONS.UPDATE_LOCATION,
        value: event.target.value,
    } as ActionTypes.UpdateLocation);
};

export const onCollaboratorsChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => (dispatch: Dispatch<AdminStoreShape>) => {
    dispatch({
        type: ADMIN_ACTIONS.UPDATE_COLLABORATORS,
        value: event.target.value,
    } as ActionTypes.UpdateCollaborators);
};

export const onProgramChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => (dispatch: Dispatch<AdminStoreShape>) => {
    dispatch({
        type: ADMIN_ACTIONS.UPDATE_PROGRAM,
        value: event.target.value,
    } as ActionTypes.UpdateProgram);
};

export const onNoTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => (dispatch: Dispatch<AdminStoreShape>) => {
    dispatch({
        type: ADMIN_ACTIONS.UPDATE_NOTIME,
        value: event.target.checked,
    } as ActionTypes.UpdateNotime);
};

export const onWebsiteChange = (event: React.ChangeEvent<HTMLInputElement>) => (dispatch: Dispatch<AdminStoreShape>) => {
    dispatch({
        type: ADMIN_ACTIONS.UPDATE_WEBSITE,
        value: event.target.value,
    } as ActionTypes.UpdateWebsite);
};

export const onGeocodeError = () => (dispatch: Dispatch<AdminStoreShape>) => {
    dispatch({
        type: ADMIN_ACTIONS.GEOCODE_ERROR,
    } as ActionTypes.GeocodeError);
};
