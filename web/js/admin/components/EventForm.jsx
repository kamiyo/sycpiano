// date, startTime, type (solo, concerto, masterclass, etc), location, eventName, program, [collaborators (orchestra, conductor, chamber musicians)]
// Also link to website
import 'react-datepicker/dist/react-datepicker.css';
import 'react-select/dist/react-select.css';
import 'less/Admin/components/event-form.less';

import $ from 'cash-dom';
import moment from 'moment';
import 'moment-timezone';
import React from 'react';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import { connect } from 'react-redux';

import Button from 'js/components/_reusable/Button';
import { googleAPI } from 'js/services/GoogleAPI.js'
import { CalendarEvent } from 'js/admin/models.js';
import { eventTypes, TOKEN_KEY } from 'js/admin/constants.js';

class EventForm extends React.Component {
    constructor(props) {
        super(props);
    }

    /**
     * Extracts values needed for event creation from the component's state
     * as well as from input elements in the DOM.
     * @return {object}
     */
    getValuesMap() {
        const date = moment(this.props.date).startOf('day');
        return {
            collaborators: this.props.collaborators,
            date: date,
            eventName: this.props.eventName,
            location: this.props.location,
            program: this.props.program,
            time: this.props.time,
            type: this.props.type,
            website: this.props.website,
            timeTBD: this.props.noTime
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
                calendarEvent.timeTBD,
                this.props.accessToken
            ).then(response => {
                window.location.reload();
            }).catch(response => {
                window.location.reload();
            });
        }).catch(e => {
            this.props.onGeocodeError();
        });
    }

    /**
     * Sends a request to Google to update event with eventId on GCal.
     */
    updateEventObject(eventId) {
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
                this.props.accessToken
            ).then(response => {
                window.location.reload();
            }).catch(response => {
                window.location.reload();
            });
        }).catch(e => {
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
            <form className='EventForm' ref={form => this.form = form}>
                <div className='EventForm__title'>Event Details</div>
                <div className='EventForm__inputs-container'>
                    <div className='EventForm__event-info'>
                        <input
                            className="EventForm__input"
                            type='text'
                            name='eventName'
                            placeholder='What is this event called?'
                            value={this.props.eventName}
                            onChange={this.props.onNameChange} />
                        <DatePicker
                            placeholderText="What day is this event goin' down?"
                            selected={this.props.date}
                            onChange={this.props.onDateChange} />
                        <label>
                            <input
                                className="EventForm__checkbox"
                                type='checkbox'
                                name='noTime'
                                checked={this.props.noTime}
                                onChange={this.props.onNoTimeChange} />
                            Time TBD
                        </label>
                        <input
                            className="EventForm__input"
                            type='text'
                            name='time'
                            placeholder="What time is this event goin' down? (7:00PM, 19:00)"
                            disabled={this.props.noTime}
                            value={this.props.time}
                            onChange={this.props.onTimeChange} />
                        <input
                            className={"EventForm__input" + (this.props.geocodeError ? " error" : "")}
                            type='text'
                            name='location'
                            placeholder="Where is this event goin' down?"
                            value={this.props.location}
                            onChange={this.props.onLocationChange} />
                        <Select
                            name='type'
                            placeholder='What type of event is this?'
                            value={this.props.type}
                            options={eventTypes}
                            onChange={this.props.onTypeChange} />
                        <textarea
                            className="EventForm__input"
                            name='collaborators'
                            rows='4'
                            placeholder="Who are you collaborating with? (newline-separated)"
                            value={this.props.collaborators}
                            onChange={this.props.onCollaboratorsChange} />
                        <textarea
                            className="EventForm__input"
                            name='program'
                            rows='6'
                            placeholder="What tunes will be jammed here? (newline-separated)"
                            value={this.props.program}
                            onChange={this.props.onProgramChange} />
                        <input
                            className="EventForm__input"
                            type='text'
                            name='website'
                            placeholder="Is there an external site to link?"
                            value={this.props.website}
                            onChange={this.props.onWebsiteChange} />
                    </div>
                </div>
                <Button
                    extraClasses='EventForm__submit-button'
                    onClick={this.handleSubmit}>
                    { (this.props.isUpdate) ? 'Update ' : 'Create ' } Event
                </Button>
                <Button
                    extraClasses='EventForm__logout-button'
                    onClick={this.logOut}>
                    Log Out
                </Button>
            </form>
        );
    }
}

const mapStateToProps = (state) => {
    return state.eventForm;
};

const mapDispatchToProps = (dispatch) => {
    return {
        onDateChange: date => dispatch({type: 'UPDATE_DATE', date}),
        onTypeChange: event => dispatch({type: 'UPDATE_TYPE', value: event}),
        onNameChange: event => dispatch({type: 'UPDATE_NAME', value: event.target.value}),
        onTimeChange: event => dispatch({type: 'UPDATE_TIME', value: event.target.value}),
        onLocationChange: event => dispatch({type: 'UPDATE_LOCATION', value: event.target.value}),
        onCollaboratorsChange: event => dispatch({type: 'UPDATE_COLLABORATORS', value: event.target.value}),
        onProgramChange: event => dispatch({type: 'UPDATE_PROGRAM', value: event.target.value}),
        onNoTimeChange: event => dispatch({type: 'UPDATE_NOTIME', value: event.target.checked}),
        onWebsiteChange: event => dispatch({type: 'UPDATE_WEBSITE', value: event.target.value}),
        onGeocodeError: event => dispatch({type: 'GEOCODE_ERROR'})
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EventForm);
