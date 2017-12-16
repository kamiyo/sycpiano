// date, startTime, type (solo, concerto, masterclass, etc), location, eventName, program, [collaborators (orchestra, conductor, chamber musicians)]
// Also link to website
import 'less/Admin/components/event-form.less';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-select/dist/react-select.css';

import * as React from 'react';

import { default as moment, Moment } from 'moment-timezone';
import DatePicker from 'react-datepicker';
import { connect } from 'react-redux';
import Select from 'react-select';

import { AdminEventFormStateShape, AdminStoreShape } from 'src/admin/components/types';
import { eventTypes, TOKEN_KEY } from 'src/admin/constants';
import { CalendarEvent } from 'src/admin/models';
import Button from 'src/components/_reusable/Button';
import { googleAPI } from 'src/services/GoogleAPI';

import {
    onCollaboratorsChange,
    onDateChange,
    onGeocodeError,
    onLocationChange,
    onNameChange,
    onNoTimeChange,
    onProgramChange,
    onTimeChange,
    onTypeChange,
    onWebsiteChange,
} from 'src/admin/components/actions';

interface EventFormDispatchToProps {
    readonly onDateChange: (date: Moment) => void;
    readonly onTypeChange: (event: { value: string; label: string; }) => void;
    readonly onNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    readonly onTimeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    readonly onLocationChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    readonly onCollaboratorsChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    readonly onProgramChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    readonly onNoTimeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    readonly onWebsiteChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    readonly onGeocodeError: () =>  void;
}

type EventFormStateToProps = AdminEventFormStateShape;

interface EventFormOwnProps {
    accessToken: string;
}

type EventFormProps = EventFormStateToProps & EventFormDispatchToProps & EventFormOwnProps;

class EventForm extends React.Component<EventFormProps, {}> {
    form: HTMLFormElement;
    /**
     * Extracts values needed for event creation from the component's state
     * as well as from input elements in the DOM.
     * @return {object}
     */
    getValuesMap() {
        const date = moment(this.props.date).startOf('day');
        return {
            collaborators: this.props.collaborators,
            date,
            eventName: this.props.eventName,
            location: this.props.location,
            program: this.props.program,
            time: this.props.time,
            type: this.props.type,
            website: this.props.website,
            timeTBD: this.props.noTime,
        };
    }

    /**
     * Sends a request to Google to create the event on GCal.
     */
    createEventObject() {
        const calendarEventPromise = CalendarEvent.createPromise(this.getValuesMap());
        calendarEventPromise.then((calendarEvent) => {
            googleAPI.createEvent(
                calendarEvent.eventName,
                calendarEvent.description,
                calendarEvent.location,
                calendarEvent.startDatetime,
                calendarEvent.endDatetime,
                calendarEvent.timezone,
                this.props.accessToken,
                calendarEvent.timeTBD,
            ).then(() => {
                window.location.reload();
            }).catch(() => {
                window.location.reload();
            });
        }).catch(() => {
            this.props.onGeocodeError();
        });
    }

    /**
     * Sends a request to Google to update event with eventId on GCal.
     */
    updateEventObject(eventId: string) {
        const calendarEventPromise = CalendarEvent.createPromise(this.getValuesMap());
        calendarEventPromise.then((calendarEvent) => {
            googleAPI.updateEvent(
                eventId,
                calendarEvent.eventName,
                calendarEvent.description,
                calendarEvent.location,
                calendarEvent.startDatetime,
                calendarEvent.endDatetime,
                calendarEvent.timezone,
                calendarEvent.timeTBD,
                this.props.accessToken,
            ).then(() => {
                window.location.reload();
            }).catch(() => {
                window.location.reload();
            });
        }).catch(() => {
            this.props.onGeocodeError();
        });
    }

    handleSubmit = () => {
        if (this.props.isUpdate) {
            this.updateEventObject(this.props.eventId);
        } else {
            this.createEventObject();
        }
    }

    logOut = () => {
        if (localStorage.getItem(TOKEN_KEY)) {
            localStorage.removeItem(TOKEN_KEY);
        }
        location.hash = '';
        window.location.reload();
    }

    render() {
        return (
            <form className='EventForm' ref={(form) => this.form = form}>
                <div className='EventForm__title'>Event Details</div>
                <div className='EventForm__inputs-container'>
                    <div className='EventForm__event-info'>
                        <input
                            className='EventForm__input'
                            type='text'
                            name='eventName'
                            placeholder='What is this event called?'
                            value={this.props.eventName}
                            onChange={this.props.onNameChange}
                        />
                        <DatePicker
                            placeholderText='What day is this event going down?'
                            selected={this.props.date}
                            onChange={this.props.onDateChange}
                        />
                        <label>
                            <input
                                className='EventForm__checkbox'
                                type='checkbox'
                                name='noTime'
                                checked={this.props.noTime}
                                onChange={this.props.onNoTimeChange}
                            />
                            Time TBD
                        </label>
                        <input
                            className='EventForm__input'
                            type='text'
                            name='time'
                            placeholder='What time is this event going down? (7:00PM, 19:00)'
                            disabled={this.props.noTime}
                            value={this.props.time}
                            onChange={this.props.onTimeChange}
                        />
                        <input
                            className={'EventForm__input' + (this.props.geocodeError ? ' error' : '')}
                            type='text'
                            name='location'
                            placeholder='Where is this event going down?'
                            value={this.props.location}
                            onChange={this.props.onLocationChange}
                        />
                        <Select
                            name='type'
                            placeholder='What type of event is this?'
                            value={this.props.type}
                            options={eventTypes}
                            onChange={this.props.onTypeChange}
                        />
                        <textarea
                            className='EventForm__input'
                            name='collaborators'
                            rows={4}
                            placeholder='Who are you collaborating with? (newline-separated)'
                            value={this.props.collaborators}
                            onChange={this.props.onCollaboratorsChange}
                        />
                        <textarea
                            className='EventForm__input'
                            name='program'
                            rows={6}
                            placeholder='What tunes will be jammed here? (newline-separated)'
                            value={this.props.program}
                            onChange={this.props.onProgramChange}
                        />
                        <input
                            className='EventForm__input'
                            type='text'
                            name='website'
                            placeholder='Is there an external site to link?'
                            value={this.props.website}
                            onChange={this.props.onWebsiteChange}
                        />
                    </div>
                </div>
                <Button
                    extraClasses={['EventForm__submit-button']}
                    onClick={this.handleSubmit}
                >
                    {(this.props.isUpdate) ? 'Update ' : 'Create '} Event
                </Button>
                <Button
                    extraClasses={['EventForm__logout-button']}
                    onClick={this.logOut}
                >
                    Log Out
                </Button>
            </form>
        );
    }
}

const mapStateToProps = (state: AdminStoreShape): EventFormStateToProps => {
    return state.eventForm;
};

const mapDispatchToProps: EventFormDispatchToProps = {
    onCollaboratorsChange,
    onDateChange,
    onGeocodeError,
    onLocationChange,
    onNameChange,
    onNoTimeChange,
    onProgramChange,
    onTimeChange,
    onTypeChange,
    onWebsiteChange,
};

export default connect<EventFormStateToProps, EventFormDispatchToProps, EventFormOwnProps>(
    mapStateToProps,
    mapDispatchToProps,
)(EventForm);
