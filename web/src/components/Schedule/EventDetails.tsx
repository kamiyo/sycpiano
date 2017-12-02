import 'less/Schedule/event-details.less';

import React from 'react';
import { connect } from 'react-redux';

import { GoogleMap, Marker, withGoogleMap, withScriptjs } from 'react-google-maps';

import { createFetchLatLngAction } from 'src/components/Schedule/actions';
import { googleMapsUrl } from 'src/services/GoogleAPI';

import { DayItemShape } from 'src/components/Schedule/types';
import { GlobalStateShape } from 'src/types';

import { ClockIcon } from 'src/components/Schedule/ClockIconSVG';
import { DateIconInstance } from 'src/components/Schedule/DateIconSVG';
import { LocationIconInstance } from 'src/components/Schedule/LocationIconSVG';

// TODO make map persistent, and not reload everytime
interface EventMapProps {
    lat?: number;
    lng?: number;
}

const EventMap = withScriptjs(
    withGoogleMap(({ lat = 39.0997, lng = -94.5786 }: EventMapProps) => {
        const position = { lat, lng };
        return (
            <GoogleMap
                zoom={8}
                center={position}
            >
                <Marker position={position} />
            </GoogleMap>
        );
    }),
);

interface EventDetailsStateToProps {
    readonly currentItem: DayItemShape;
    readonly currentLatLng: {
        readonly lat: number;
        readonly lng: number;
    };
    readonly isAnimatingScroll: boolean;
    readonly isFetchingLatLng: boolean;
}

interface EventDetailsDispatchToProps {
    readonly createFetchLatLngAction: (location: string) => void;
}

type EventDetailsProps = EventDetailsStateToProps & EventDetailsDispatchToProps;

class EventDetails extends React.Component<EventDetailsProps, {}> {
    componentWillUpdate(nextProps: EventDetailsProps) {
        if (nextProps.currentItem && !nextProps.currentLatLng) {
            nextProps.createFetchLatLngAction(nextProps.currentItem.location);
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

        return (
            <div className='event-details'>
                <h2>{name}</h2>
                <div>{dateTime.format('dddd, MMMM D, YYYY')}</div>
                <div>{collaborators}</div>

                <div>{location}</div>
                <div>{program}</div>

                <EventMap
                    containerElement={<div />}
                    mapElement={<div className='event-map' />}
                    googleMapURL={googleMapsUrl}
                    loadingElement={<div />}
                    {...this.props.currentLatLng}
                />

                <DateIconInstance className='date-icon' date={dateTime} />
                <LocationIconInstance className='location-icon' />
                <ClockIcon className='clock-icon' date={dateTime} />
            </div>
        );
    }
}

const mapStateToProps = (state: GlobalStateShape) => ({
    currentItem: state.schedule_eventItems.currentItem,
    currentLatLng: state.schedule_eventItems.currentLatLng,
    isAnimatingScroll: state.schedule_eventItems.isAnimatingScroll,
    isFetchingLatLng: state.schedule_eventItems.isFetchingLatLng,
});

export default connect<EventDetailsStateToProps, EventDetailsDispatchToProps>(
    mapStateToProps,
    { createFetchLatLngAction },
)(EventDetails);
