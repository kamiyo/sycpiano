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

let EventItemBody: React.SFC<EventItemBodyProps> = ({
    className,
    dateTime,
    isMobile,
    name,
    location,
    collaborators,
    program,
    website,
    permaLink,
}) => (
    <div className={className}>
        <div><FlexEventDate dateTime={dateTime} isMobile={isMobile}/></div>

        <FlexEventInfoContainer>
            <EventName className={detailSectionMargin()} name={name} isMobile={isMobile} permaLink={permaLink} />

            <EventTime
                className={detailSectionMargin()}
                dateTime={dateTime}
            />

            <EventLocation location={location} className={detailSectionMargin()} isMobile={isMobile}/>
            <EventCollaborators collaborators={collaborators} className={detailSectionMargin()} />
            <EventProgram program={program} className={detailSectionMargin(5)} />

            {website && <EventWebsiteButton website={website} />}
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
