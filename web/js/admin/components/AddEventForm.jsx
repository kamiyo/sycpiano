// date, startTime, type (solo, concerto, masterclass, etc), location, eventName, program, [collaborators (orchestra, conductor, chamber musicians)]
// Also link to website
import 'react-datepicker/dist/react-datepicker.css';
import 'react-select/dist/react-select.css';
import '@/less/admin/components/add-event-form.less';

import $ from 'cash-dom';
import moment from 'moment';
import 'moment-timezone';
import React from 'react';
import DatePicker from 'react-datepicker';
import Select from 'react-select';

import Button from '@/js/components/reusable/Button.jsx';
import {googleAPI} from '@/js/services/GoogleAPI.js'
import {CalendarEvent} from '@/js/admin/models.js';

var eventTypes = [
    { value: 'solo', label: 'Solo' },
    { value: 'concerto', label: 'Concerto' },
    { value: 'masterclass', label: 'Masterclass' },
];

export class AddEventForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: moment(),
            type: eventTypes[0].value,
        };
    }

    /**
     * Extracts values needed for event creation from the component's state
     * as well as from input elements in the DOM.
     * @return {object}
     */
    getValuesMap() {
        const $form = $(this.form);
        const date = moment(this.state.date).startOf('day');
        return {
            collaborators: $form.find('input[name=collaborators]').val(),
            date: date,
            eventName: $form.find('input[name=eventName]').val(),
            location: $form.find('input[name=location]').val(),
            program: $form.find('textarea[name=program]').val(),
            time: $form.find('input[name=time]').val(),
            type: this.state.type,
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
                calendarEvent.startDatetime.format(),
                calendarEvent.endDatetime.format(),
                calendarEvent.timezone,
                this.props.accessToken
            ).then(response => {
                window.location.reload();
            });
        });
    }

    handleSubmit() {
        this.createEventObject();
    }

    setDate(date) {
        this.setState({date: date});
    }

    setType(type) {
        this.setState({type: type});
    }

    render() {
        return (
            <form className='AddEventForm' ref={form => this.form = form}>
                <div className='AddEventForm__title'>Event Details</div>
                <div className='AddEventForm__inputs-container'>
                    <div className='AddEventForm__event-info'>
                        <input
                            className="AddEventForm__input"
                            type='text'
                            name='eventName'
                            placeholder='What is this event called?' />
                        <DatePicker
                            placeholderText="What day is this event goin' down?"
                            selected={this.state.date}
                            onChange={this.setDate.bind(this)} />
                        <input
                            className="AddEventForm__input"
                            type='text'
                            name='time'
                            placeholder="What time is this event goin' down? (7:00PM, 19:00)" />
                        <input
                            className="AddEventForm__input"
                            type='text'
                            name='location'
                            placeholder="Where is this event goin' down?" />
                        <Select
                            name='type'
                            placeholder='What type of event is this?'
                            value={this.state.type}
                            options={eventTypes}
                            onChange={this.setType.bind(this)} />
                        <input
                            className="AddEventForm__input"
                            type='text'
                            name='collaborators'
                            placeholder="Who are you collaborating with? (comma-separated)" />
                        <textarea
                            className="AddEventForm__input"
                            name='program'
                            rows='6'
                            placeholder="What tunes will be jammed here? (newline-separated)" />
                    </div>
                </div>
                <Button
                    extraClasses='AddEventForm__submit-button'
                    onClick={this.handleSubmit.bind(this)}>
                    Create Event
                </Button>
            </form>
        );
    }
}
