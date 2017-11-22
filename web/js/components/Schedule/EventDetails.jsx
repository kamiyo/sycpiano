import 'less/Schedule/event-details.less';

import React from 'react';
import { connect } from 'react-redux';
import { GoogleMap, Marker, withGoogleMap } from 'react-google-maps';
import withScriptJs from "react-google-maps/lib/async/withScriptjs";

import { googleMapsUrl } from 'js/services/GoogleAPI';
import { createFetchLatLngAction } from 'js/components/Schedule/actions.js';


const EventMap = withScriptJs(
    withGoogleMap(({ lat, lng }) => {
        const position = { lat, lng };
        return (
            <GoogleMap
                defaultZoom={8}
                defaultCenter={position}
            >
                <Marker position={position} />
            </GoogleMap>
        );
    })
);

class EventDetails extends React.Component {
    componentWillUpdate(nextProps) {
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
            eventType,
            location,
            program,
        } = this.props.currentItem;

        return (
            <div className="event-details">
                <h2>{name}</h2>
                <div>{dateTime.format('dddd, MMMM M')}</div>
                <div>{collaborators}</div>

                <div>{location}</div>
                <div>{program}</div>

                {
                    this.props.currentLatLng && !this.props.isAnimatingScroll &&
                    <EventMap
                        containerElement={<div />}
                        mapElement={<div className="event-map" />}
                        googleMapURL={googleMapsUrl}
                        loadingElement={<div />}
                        {...this.props.currentLatLng}
                    />
                }
            </div>
        );
    }
}

const mapStateToProps = state => ({
    currentItem: state.schedule_eventItems.currentItem,
    currentLatLng: state.schedule_eventItems.currentLatLng,
    isAnimatingScroll: state.schedule_eventItems.isAnimatingScroll
});

export default connect(
    mapStateToProps,
    { createFetchLatLngAction }
)(EventDetails);
