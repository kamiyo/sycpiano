import 'less/Schedule/event-details.less';

import classNames from 'classnames';
import * as React from 'react';
import { connect } from 'react-redux';

import { createFetchLatLngAction } from 'src/components/Schedule/actions';
import { EventListName } from 'src/components/Schedule/actionTypes';
import { LocationIconInstance } from 'src/components/Schedule/LocationIconSVG';
import { TrebleIconInstance } from 'src/components/Schedule/TrebleIconSVG';
import { DayItemShape, Piece, Pieces } from 'src/components/Schedule/types';
import { GlobalStateShape } from 'src/types';

interface CollaboratorsProps { collaborators: Array<{ name: string; instrument: string }>; }

const Collaborators: React.SFC<CollaboratorsProps> = ({ collaborators }) => (
    <div className="collaborators">
        {collaborators.length ? <div>with</div> : null}
        {
            collaborators.length ? (
                collaborators.map((collab, idx) => (
                    <div key={idx} className="collaborator__item">{[collab.name, collab.instrument].filter((val) => val).join(', ')}</div>
                ))
            ) : <div>Solo Concert</div>
        }
    </div>
);

interface LocationDetailsProps {
    className?: string;
    venueName: string;
}

const LocationDetails: React.SFC<LocationDetailsProps> = (props) => (
    <div className={classNames('locationDetails', props.className)}>
        <LocationIconInstance className="location-icon" />
        <div className="venueName">
            {props.venueName}
        </div>
    </div>
);

interface ProgramDetailsProps {
    className?: string;
    program: Pieces;
}

const ProgramDetails: React.SFC<ProgramDetailsProps> = (props) => (
    <div className={classNames('programDetails', props.className)}>
        {
            props.program.map((piece: Piece, index: number) => (
                <div className="programDetails__piece" key={index}>
                    <span className="dash">{`${String.fromCharCode(0x2013)}`}</span>
                    <span>{`${piece}`}</span>
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
    private getVenueName(location: string): string {
        if (!location) {
            return '';
        }

        // Example location string:
        // Howard L. Schrott Center for the Arts, 610 W 46th St, Indianapolis, IN 46208, USA
        const locArray = location.split(', ');
        return locArray.length >= 1 ? locArray[0] : '';
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

        console.log('CURRENT ITEM');
        console.log(this.props.currentItem);

        const {
            name,
            collaborators,
            location,
            program,
        } = this.props.currentItem;

        const venueName = this.getVenueName(location);

        return (
            <div className="event-details">
                <h1 className="event-details__name">{name}</h1>

                {venueName && <LocationDetails venueName={venueName} />}

                {
                    collaborators && collaborators.length > 0 &&
                    <Collaborators collaborators={collaborators} />
                }

                {
                    program && program.length > 0 && <div>
                        <TrebleIconInstance className="treble-icon" />
                        <ProgramDetails program={program} />
                    </div>
                }
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
