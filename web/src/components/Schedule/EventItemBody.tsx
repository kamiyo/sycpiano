import * as React from 'react';
import styled, { css } from 'react-emotion';

import {
    EventCollaborators,
    EventDate,
    EventLocation,
    EventName,
    EventProgram,
    EventTime,
    EventWebsiteButton,
} from 'src/components/Schedule/EventDetails';
import { DayItem } from 'src/components/Schedule/types';

import { lato1 } from 'src/styles/fonts';

const FlexEventDate = styled(EventDate)` flex: 0 0 100px; `;

const FlexEventInfoContainer = styled('div')`
    flex: 1 1 auto;
    padding: 0 0 0 35px;
`;

type EventItemBodyProps = DayItem & { className?: string, isMobile?: boolean; permaLink: string; };

const detailSectionMargin = (extra?: number) => css` margin-bottom: ${20 + (extra || 0)}px; `;

let EventItemBody: React.SFC<EventItemBodyProps> = (props) => (
    <div className={props.className}>
        <div><FlexEventDate dateTime={props.dateTime} isMobile={props.isMobile}/></div>

        <FlexEventInfoContainer>
            <EventName className={detailSectionMargin()} name={props.name} isMobile={props.isMobile} permaLink={props.permaLink} />

            <EventTime
                className={detailSectionMargin()}
                dateTime={props.dateTime}
            />

            <EventLocation location={props.location} className={detailSectionMargin()} isMobile={props.isMobile}/>
            <EventCollaborators collaborators={props.collaborators} className={detailSectionMargin()} />
            <EventProgram program={props.program} className={detailSectionMargin(5)} />

            {props.website && <EventWebsiteButton website={props.website} />}
        </FlexEventInfoContainer>
    </div>
);

EventItemBody = styled<EventItemBodyProps, typeof EventItemBody>(EventItemBody)`
    display: flex;
    padding: ${props => props.isMobile ? '30px 0' : '30px 0 30px 30px'};
    font-family: ${lato1};
    align-items: top;
    color: black;
    transition: 0.2s all;
    width: ${props => props.isMobile ? 90 : 80}%;
    max-width: 1240px;
    margin: 0 auto;
`;

export { EventItemBody };
