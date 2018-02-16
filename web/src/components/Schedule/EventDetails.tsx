import startCase from 'lodash-es/startCase';
import { Moment } from 'moment-timezone';
import { mix } from 'polished';
import * as React from 'react';
import styled, { css, cx } from 'react-emotion';

import { LocationIconInstance } from 'src/components/Schedule/LocationIconSVG';
import { Collaborator, Piece } from 'src/components/Schedule/types';
import { getGoogleMapsSearchUrl } from 'src/components/Schedule/utils';

import { lightBlue, magenta, textGrey } from 'src/styles/colors';
import { lato2 } from 'src/styles/fonts';

const eventDateDimension = '107px';
const locationIconDimension = '30px';

interface EventDateTimeProps { dateTime: Moment; className?: string; }

let EventDate: React.SFC<EventDateTimeProps> = (props) => (
    <div className={props.className}>
        <div className={css({ fontSize: '35px' })}>
            {parseInt(props.dateTime.format('D'), 10)}
        </div>
        <div className={css({ fontSize: '20px' })}>
            {props.dateTime.format('ddd')}
        </div>
    </div>
);

EventDate = styled(EventDate)`
    text-align: center;
    background-color: ${lightBlue};
    color: white;
    height: ${eventDateDimension};
    width: ${eventDateDimension};
    line-height: 43px;
    border-radius: 50%;
    padding: 12px;
`;

interface EventNameProps { name: string; className?: string; }

let EventName: React.SFC<EventNameProps> = (props) => (
    <div className={props.className}>{props.name}</div>
);

EventName = styled(EventName)`
    font-size: 35px;
    font-family: ${lato2};
`;

let EventTime: React.SFC<EventDateTimeProps> = (props) => (
    <div className={props.className}>
        {props.dateTime.format('h:mm a z')}
    </div>
);

EventTime = styled(EventTime)` font-size: 20px; `;

interface EventLocationProps { location: string; className?: string; }

const getVenueName = (location: string): string => {
    if (!location) {
        return '';
    }

    // Example location string:
    // Howard L. Schrott Center for the Arts, 610 W 46th St, Indianapolis, IN 46208, USA
    const locArray = location.split(', ');
    return locArray.length >= 1 ? locArray[0] : '';
};

let EventLocation: React.SFC<EventLocationProps> = (props) => {
    const locationIconStyle = css({
        height: locationIconDimension,
        width: locationIconDimension,
    });

    return (
        <a href={getGoogleMapsSearchUrl(props.location)} className={cx(props.className, css` width: fit-content; `)} target="_blank">
            <LocationIconInstance className={locationIconStyle} />

            <strong
                className={css`
                    color: black;
                    margin-left: 10px;
                `}
            >
                {getVenueName(props.location)}
            </strong>
        </a>
    );
};

EventLocation = styled(EventLocation)`
    font-size: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
`;

interface EventCollaboratorsProps {
    collaborators: Collaborator[];
    className?: string;
}

let EventCollaborators: React.SFC<EventCollaboratorsProps> = (props) => (
    <div className={props.className}>
        {props.collaborators.map((collaborator: Collaborator, i: number) => (
            collaborator.name && collaborator.instrument && (
                <div key={i}>
                    <span><strong>{collaborator.name}</strong></span>{' - '}
                    <span>{startCase(collaborator.instrument)}</span>
                </div>
            )
        ))}
    </div>
);

EventCollaborators = styled(EventCollaborators)`
    list-style: none;
    padding: 0;
    font-family: ${lato2};
`;

interface EventProgramProps {
    program: Piece[];
    className?: string;
}

let EventProgram: React.SFC<EventProgramProps> = (props) => (
    <div className={props.className}>
        {props.program.map(({ composer, piece }: Piece, i: number) => (
            <div key={i}>
                {composer}{piece ? ': ' : ''}<i>{piece}</i>
            </div>
        ))}
    </div>
);

EventProgram = styled(EventProgram)`
    list-style: none;
    padding: 0;
    font-size: 20px;
    font-family: ${lato2};
`;

interface EventWebsiteButtonProps {
    website: string;
    className?: string;
}

let EventWebsiteButton: React.SFC<EventWebsiteButtonProps> = (props) => (
    <a href={props.website} target="_blank" className={props.className}>
        {`Tickets & Info`}
    </a>
);

EventWebsiteButton = styled(EventWebsiteButton)`
    display: block;
    font-size: 20px;
    width: 150px;
    padding: 10px;
    text-align: center;
    border-radius: 4px;
    font-family: ${lato2};
    background-color: ${magenta};
    color: ${textGrey};
    transition: all 0.25s;

    &:hover {
        background-color: ${mix(0.75, magenta, '#FFF')};
        color: white;
        cursor: pointer;
    }
`;

export {
    EventCollaborators,
    EventDate,
    EventLocation,
    EventName,
    EventProgram,
    EventTime,
    EventWebsiteButton,
};
