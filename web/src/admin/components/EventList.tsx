import 'less/Admin/components/event-list.less';

import * as React from 'react';
import { connect } from 'react-redux';

import moment from 'moment';
import 'moment-timezone';

import { AdminStoreShape } from 'src/admin/components/types';
import Button from 'src/components/_reusable/Button';

import {
    createFetchEventsAction,
    editEvent,
} from 'src/admin/components/actions';

interface ListItemProps {
    readonly eventJSON: GoogleCalendar.Event;
    readonly handler: (id: number) => void;
    readonly eventId: number;
}

class ListItem extends React.Component<ListItemProps, {}> {

    // Quick parse of 'start' object returned by google calendar GoogleAPI
    parseStartDateTime(start: {
        date: string;
        dateTime: string;
        timeZone?: string
    }) {
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
    parseDescription(description: string) {
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
            <div className='Event'>
                <Button
                    extraClasses={['EditEvent__submit-button']}
                    onClick={() => { this.props.handler(this.props.eventId); }}
                >
                    Edit Event
                </Button>
                <div className='EventDetails'>
                    <div className='start_time'>{dateTime}</div>
                    <div className='location'>{eventJSON.location}</div>
                    <div className='summary'>{eventJSON.summary}</div>
                    <div className='description'><pre>{description}</pre></div>
                </div>
            </div>
        );
    }
}

interface EventListStateToProps {
    readonly events: GoogleCalendar.Event[];
}

interface EventListDispatchToProps {
    readonly createFetchEventsAction: () => void;
    readonly editEvent: (event: GoogleCalendar.Event) => void;
}

class EventList extends React.Component<EventListStateToProps & EventListDispatchToProps, {}> {
    componentWillMount() {
        this.props.createFetchEventsAction();
    }

    handleClick = (key: number) => {
        this.props.editEvent(this.props.events[key]);
    }

    render() {
        return (
            <div className='EventList'>
                {this.props.events.map((event, i) => {
                    return <ListItem eventJSON={event} key={i} eventId={i} handler={this.handleClick} />;
                })}
            </div>
        );
    }
}

const mapStateToProps = (state: AdminStoreShape) => ({
    events: state.eventList.events,
});

export default connect<EventListStateToProps, EventListDispatchToProps>(
    mapStateToProps,
    {
        createFetchEventsAction,
        editEvent,
    },
)(EventList);
