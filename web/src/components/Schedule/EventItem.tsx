import 'less/Schedule/event-item.less';

import Flexbox from 'flexbox-react';
import { startCase } from 'lodash/string';
import { Moment } from 'moment-timezone';
import * as React from 'react';
import { Link } from 'react-router-dom';

import * as classNames from 'classnames';

import { EventListName } from 'src/components/Schedule/actionTypes';
import { DayItemShape } from 'src/components/Schedule/types';

const DateContainer: React.SFC<{ readonly dateTime: Moment }> = ({ dateTime }) => (
    <div className="event-item__date-container">
        <div className="event-item__date">
            <div className="event-item__day">
                {parseInt(dateTime.format('D'), 10)}
            </div>
            <div className="event-item__day-of-week">
                {dateTime.format('ddd')}
            </div>
        </div>
    </div>
);

interface EventNameProps {
    // readonly dateTime: Moment;
    readonly name: string;
    // readonly handleSelect: () => void;
    // readonly type: EventListName;
}

const EventName: React.SFC<EventNameProps> = ({ name }) => (
    <div className="event-item__info-name">{name}</div>
);
// const EventName: React.SFC<EventNameProps> = ({ dateTime, name, handleSelect, type }) => (
//     <Link
//         to={`/schedule/${type}/${dateTime.format('YYYY-MM-DD')}`}
//         onClick={handleSelect}
//     >
//         <div className='event-item__info-name'>
//             {name}
//         </div>
//     </Link>
// );

// interface EventBodyProps {
//     program: {
//         [key: string]: string;
//     };
//     collaborators: {
//         [key: string]: string;
//     };
// }

// const EventBody: React.SFC<EventBodyProps> = ({ program, collaborators }) => (
//     <div className='event-item__info-body'>
//         <ul className='event-item__info-program'>
//             {
//                 Object.keys(program).map(key => (
//                     <li key={key}>{program[key]}</li>
//                 ))
//             }
//         </ul>
//         <ul className='event-item__info-collaborators'>
//             {
//                 Object.keys(collaborators).map(key => (
//                     <li key={key}>{collaborators[key]}</li>
//                 ))
//             }
//         </ul>
//     </div>
// )

interface EventItemProps {
    readonly event: DayItemShape;
    readonly style: React.CSSProperties;
    readonly handleSelect: () => void;
    readonly measure: () => void;
    readonly active: boolean;
    readonly type: EventListName;
}

class EventItem extends React.Component<EventItemProps, {}> {
    private getVenueName(location: string): string {
        if (!location) {
            return '';
        }

        // Example location string:
        // Howard L. Schrott Center for the Arts, 610 W 46th St, Indianapolis, IN 46208, USA
        const locArray = location.split(', ');
        return locArray.length >= 1 ? locArray[0] : '';
    }

    componentDidMount() {
        this.props.measure();
    }

    render() {
        const {
            event,
            style,
            handleSelect,
            active,
            type,
        } = this.props;

        const time = event.dateTime.format('h:mm a z');

        return (
            <Link
                to={`/schedule/${type}/${event.dateTime.format('YYYY-MM-DD')}`}
                onClick={handleSelect}
                style={style}
            >
                <Flexbox className={classNames('event-item', { active })}>
                    <Flexbox display="block" flex="0 0 100px">
                        <DateContainer dateTime={event.dateTime} />
                    </Flexbox>
                    <Flexbox
                        className="event-item__info"
                        display="block"
                        flex="1 1 auto"
                    >
                        <EventName name={event.name} />

                        <div className="event-item__info-time">
                            {time}
                        </div>

                        <div className="event-item__info-other">
                            <strong>{this.getVenueName(event.location)}</strong>
                        </div>

                        <div className="event-item__info-other" style={{marginTop: '15px'}}>
                            {
                                event.collaborators.map((collaborator, i) => (
                                    collaborator.name && collaborator.instrument && (
                                        <div key={i}>
                                            <span><strong>{collaborator.name}</strong></span>{' - '}
                                            <span>{startCase(collaborator.instrument)}</span>
                                        </div>
                                    )
                                ))
                            }
                        </div>

                        <div className="event-item__info-other" style={{marginTop: '15px'}}>
                            {event.program.map((piece, i) => <div key={i}><i>{piece}</i></div>)}
                        </div>

                        <div className="buy-tickets"><strong>Buy Tickets</strong></div>
                    </Flexbox>
                </Flexbox>
            </Link>
        );
    }
}

export default EventItem;
