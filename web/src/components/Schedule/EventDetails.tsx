import 'less/Schedule/event-details.less';

import React from 'react';
import { connect } from 'react-redux';
// temporary workaround for untyped react-google-maps
/* tslint:disable:no-var-requires */
const googleMaps: any = require('react-google-maps');
const withScriptjs = googleMaps.withScriptjs;
const GoogleMap = googleMaps.GoogleMap;
const Marker = googleMaps.Marker;
const withGoogleMap = googleMaps.withGoogleMap;
/* tslint:enable:no-var-requires */
// import { withScriptjs, GoogleMap, Marker, withGoogleMap } from 'react-google-maps';  wait for types to be published

import { createFetchLatLngAction } from 'src/components/Schedule/actions';
import { googleMapsUrl } from 'src/services/GoogleAPI';

import { DayItemShape } from 'src/components/Schedule/types';
import { GlobalStateShape } from 'src/types';

// TODO make map persistent, and not reload everytime
const EventMap = withScriptjs(
    withGoogleMap(({ lat, lng }: { lat: number; lng: number; }) => {
        const position = { lat, lng };
        return (
            <GoogleMap
                defaultZoom={8}
                defaultCenter={position}
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
                <div>{dateTime.format('dddd, MMMM M')}</div>
                <div>{collaborators}</div>

                <div>{location}</div>
                <div>{program}</div>

                {
                    !this.props.isFetchingLatLng && this.props.currentLatLng && !this.props.isAnimatingScroll &&
                    <EventMap
                        containerElement={<div />}
                        mapElement={<div className='event-map' />}
                        googleMapURL={googleMapsUrl}
                        loadingElement={<div />}
                        {...this.props.currentLatLng}
                    />
                }
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
