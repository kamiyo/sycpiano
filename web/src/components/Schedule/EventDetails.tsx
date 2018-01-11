import 'less/Schedule/event-details.less';

import * as React from 'react';
import { connect } from 'react-redux';

import { GoogleMap/*, Marker, withGoogleMap, withScriptjs*/ } from 'react-google-maps';

import { createFetchLatLngAction } from 'src/components/Schedule/actions';
// import { googleMapsUrl } from 'src/services/GoogleAPI';

import { DayItemShape } from 'src/components/Schedule/types';
import { GlobalStateShape } from 'src/types';

import { EventListName } from 'src/components/Schedule/actionTypes';
// import { ClockIcon } from 'src/components/Schedule/ClockIconSVG';
// import { DateIconInstance } from 'src/components/Schedule/DateIconSVG';
// import { LocationIconInstance } from 'src/components/Schedule/LocationIconSVG';
// import { TrebleIconInstance } from 'src/components/Schedule/TrebleIconSVG';

// // TODO make map persistent, and not reload everytime
// interface EventMapProps {
//     lat?: number;
//     lng?: number;
//     setRef: (map: GoogleMap) => void;
// }

// const EventMap = withScriptjs(
//     withGoogleMap(({ lat, lng, setRef }: EventMapProps) => {
//         const position = { lat, lng };
//         return (
//             <GoogleMap
//                 ref={(map: GoogleMap) => setRef(map)}
//                 zoom={8}
//                 defaultCenter={position}
//             >
//                 <Marker position={position} />
//             </GoogleMap>
//         );
//     }),
// );

const Collaborators = ({ collaborators }: { collaborators: any[] }) => (
    <div className='collaborators'>
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
    mapComponent: GoogleMap;

    componentWillUpdate(nextProps: EventDetailsProps) {
        if (nextProps.currentItem && nextProps.currentItem !== this.props.currentItem) {
            this.props.createFetchLatLngAction(nextProps.currentItem.location);
        }
        if (nextProps.currentLatLng !== this.props.currentLatLng) {
            this.mapComponent && this.mapComponent.panTo(nextProps.currentLatLng);
        }
    }

    render() {
        if (!this.props.currentItem) {
            return null;
        }

        const {
            name,
            // dateTime,
            collaborators,
            // location,
            // program,
        } = this.props.currentItem;

        return (
            <div className='event-details'>
                <h1 className='event-details__name'>{name}</h1>

                <Collaborators collaborators={collaborators} />

                {/* <div>{dateTime.format('dddd, MMMM D, YYYY')}</div>
                <div>{collaborators}</div>

                <div>{location}</div>
                <div>{program}</div>

                <EventMap
                    setRef={(map: GoogleMap) => this.mapComponent = map}
                    containerElement={<div />}
                    mapElement={<div className='event-map' />}
                    googleMapURL={googleMapsUrl}
                    loadingElement={<div />}
                    {...this.props.currentLatLng}
                />

                <DateIconInstance className='date-icon' date={dateTime} />
                <LocationIconInstance className='location-icon' />
                <ClockIcon className='clock-icon' date={dateTime} />
                <TrebleIconInstance className='treble-icon' />        */}
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
