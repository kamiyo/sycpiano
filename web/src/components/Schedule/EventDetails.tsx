import 'less/Schedule/event-details.less';

import * as React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { Moment } from 'moment-timezone';

import { createFetchLatLngAction } from 'src/components/Schedule/actions';
import { EventListName } from 'src/components/Schedule/actionTypes';

import { DayItemShape } from 'src/components/Schedule/types';
import { GlobalStateShape } from 'src/types';

import { EventDetailsContentRow } from 'src/components/Schedule/EventDetailsContent';
import { ClockIconInstance } from 'src/components/Schedule/ClockIconSVG';
import { DateIconInstance } from 'src/components/Schedule/DateIconSVG';
import { LocationIconInstance } from 'src/components/Schedule/LocationIconSVG';
import { TrebleIconInstance } from 'src/components/Schedule/TrebleIconSVG';

interface CollaboratorsProps { collaborators: string[]; }

const Collaborators = ({ collaborators }: CollaboratorsProps) => (
    <div className="collaborators">
        {collaborators.length ? <div>with</div> : null}
        {
            collaborators.length ? (
                collaborators.map((collab, idx) => (
                    <div key={idx} className='collaborator__item'>{collab}</div>
                ))
            ) : <div>Solo Concert</div>
        }
    </div>
);

interface DateTimeDetailsProps { className?: string, dateTime: Moment; }

const DateDetails = (props: DateTimeDetailsProps) => (
    <div className={classNames('dateDetails', props.className)}>
        <div className="dayOfWeek">{props.dateTime.format('dddd')}</div>
        <div className="dayOfMonth">{props.dateTime.format('MMMM D')}</div>
    </div>
);

const TimeDetails = (props: DateTimeDetailsProps) => (
    <div className={classNames('timeDetails', props.className)}>
        {props.dateTime.format('h:mmA z')}
    </div>
);

interface FormattedLocationShape {
    venue: string;
    street: string;
    stateZipCountry: string;
}

interface LocationDetailsProps {
    className?: string;
    location: FormattedLocationShape;
}

const LocationDetails = (props: LocationDetailsProps) => (
    <div className={classNames('locationDetails', props.className)}>
        <div className="venue">{props.location.venue}</div>
        <div className="street">{props.location.street}</div>
        <div className="stateZipCountry">{props.location.stateZipCountry}</div>
    </div>
);

interface ProgramDetailsProps {
    className?: string;
    program: Array<string>;
}

const ProgramDetails = (props: ProgramDetailsProps) => (
    <div className={classNames('programDetails', props.className)}>
        {
            props.program.map((piece: string, index: number) => (
                <div className="programDetails__piece" key={index}>
                    {piece}
                </div>
            ))
        }
    </div>
);

interface EventDetailsStateToProps {
    readonly currentItem: DayItemShape;
    readonly currentLatLng: {
        readonly lat: number;
        readonly lng: number;
    };
    readonly isFetchingLatLng: boolean;
    readonly type: EventListName;
}

interface EventDetailsDispatchToProps {
    readonly createFetchLatLngAction: (location: string) => any;
}

type EventDetailsProps = EventDetailsStateToProps & EventDetailsDispatchToProps;

class EventDetails extends React.Component<EventDetailsProps, {}> {
    private formatLocation(location: string) : FormattedLocationShape {
        // Example location string:
        // Howard L. Schrott Center for the Arts, 610 W 46th St, Indianapolis, IN 46208, USA
        const [ venue, street, ...rest ] = location.split(', ');
        const stateZipCountry = `${rest[1]}, ${rest[2]}`;

        return { venue, street, stateZipCountry };
    }

    componentWillUpdate(nextProps: EventDetailsProps) {
        if (nextProps.currentItem && nextProps.currentItem !== this.props.currentItem) {
            this.props.createFetchLatLngAction(nextProps.currentItem.location);
        }
    }

    render() {
        if (!this.props.currentItem) {
            return null;
        }

        const {
            name,
            dateTime,
            collaborators,
            location,
            program,
        } = this.props.currentItem;

        const formattedLocation = this.formatLocation(location);

        console.log(program);

        return (
            <div className="event-details">
                <h1 className="event-details__name">{name}</h1>

                <Collaborators collaborators={collaborators} />

                <EventDetailsContentRow
                    icon={<DateIconInstance className="date-icon" date={dateTime} />}
                    content={<DateDetails dateTime={dateTime} />}
                />

                <EventDetailsContentRow
                    icon={<ClockIconInstance className="clock-icon" date={dateTime} />}
                    content={<TimeDetails dateTime={dateTime} />}
                />

                <EventDetailsContentRow
                    icon={<LocationIconInstance className="location-icon" />}
                    content={<LocationDetails location={formattedLocation} />}
                />

                <EventDetailsContentRow
                    className="eventLocation"
                    icon={<TrebleIconInstance className="location-icon" />}
                    content={<ProgramDetails program={program} />}
                />
            </div>
        );
    }
}

const mapStateToProps = (state: GlobalStateShape) => {
    const name = state.schedule_eventItems.activeName;
    return {
        currentItem: state.schedule_eventItems[name].currentItem,
        currentLatLng: state.schedule_eventItems[name].currentLatLng,
        isFetchingLatLng: state.schedule_eventItems[name].isFetchingLatLng,
        type: name,
    };
};

const mapDispatchToProps: EventDetailsDispatchToProps = {
    createFetchLatLngAction,
};

export default connect<EventDetailsStateToProps, EventDetailsDispatchToProps>(
    mapStateToProps,
    mapDispatchToProps,
)(EventDetails);
