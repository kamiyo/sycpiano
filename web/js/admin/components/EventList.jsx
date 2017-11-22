// date, startTime, type (solo, concerto, masterclass, etc), location, eventName, program, [collaborators (orchestra, conductor, chamber musicians)]
// Also link to website
import 'react-datepicker/dist/react-datepicker.css';
import 'react-select/dist/react-select.css';
import 'less/Admin/components/event-list.less';

import $ from 'cash-dom';
import moment from 'moment';
import 'moment-timezone';
import React from 'react';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import { connect } from 'react-redux';

import Button from 'js/components/_reusable/Button';
import { googleAPI } from 'js/services/GoogleAPI'
import { CalendarEvent } from 'js/admin/models.js';

class ListItem extends React.Component {

    constructor(props) {
        super(props);
    }

    // Quick parse of 'start' object returned by google calendar GoogleAPI
    parseStartDateTime(start) {
        if (start.dateTime) {
            if (start.timeZone) {
                return moment.tz(start.dateTime, start.timeZone).format('YYYY MMMM DD, HH:mm');
            } else {
                return moment.parseZone(start.dateTime).format('YYYY MMMM DD, HH:mm');
            }
        } else {
            return moment(start.date).format('YYYY MMMM DD, [time TBD]');
        }
    }

    // Quick parse and stringifying of custom JSON description
    parseDescription(description) {
        try {
            return JSON.stringify(JSON.parse(description), null, 4);
        } catch (e) {
            return ((description) ? description : '');
        }
    }

    render() {
        const eventJSON = this.props.eventJSON;
        const dateTime = this.parseStartDateTime(eventJSON.start);
        const description = this.parseDescription(eventJSON.description);
        return (
            <div className="Event">
                <Button
                    extraClasses='EditEvent__submit-button'
                    onClick={() => {this.props.handler(this.props.eventId)}}>
                    Edit Event
                </Button>
                <div className="EventDetails">
                    <div className="start_time">{dateTime}</div>
                    <div className="location">{eventJSON.location}</div>
                    <div className="summary">{eventJSON.summary}</div>
                    <div className="description"><pre>{description}</pre></div>
                </div>
            </div>
        )
    }
}

class EventList extends React.Component {

    componentWillMount() {
        this.props.isFetching();
        googleAPI.getCalendarEvents(moment(0)).then(
            response => this.props.fetchEvents(response.data.items)
        );
    }

    handleClick = (key) => {
        this.props.editEvent(this.props.events[key]);
    }

    render() {
        return (
            <div className="EventList">
                {this.props.events.map((event, i) => {
                    return <ListItem eventJSON={event} key={i} eventId={i} handler={this.handleClick}/>;
                })}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return state.eventList;
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchEvents: events => dispatch({type: 'FETCH_EVENTS_SUCCESS', fetchedEvents: events}),
        isFetching: () => dispatch({ type: 'IS_FETCHING' }),
        editEvent: event => dispatch({ type: 'EDIT_EVENT', event: event })
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EventList);