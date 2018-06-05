import * as React from 'react';
import styled, { css } from 'react-emotion';

import {
    EventCollaborators,
    EventDate,
    EventLocation,
    EventNameWithRouter,
    EventProgram,
    EventTime,
    EventWebsiteButton,
} from 'src/components/Schedule/EventDetails';
import { DayItem } from 'src/components/Schedule/types';

import { lightBlue } from 'src/styles/colors';
import { lato1 } from 'src/styles/fonts';
import { screenXSorPortrait } from 'src/styles/screens';

const FlexEventDate = styled(EventDate)` flex: 0 0 auto; `;

const FlexEventInfoContainer = styled('div')`
    flex: 0 1 auto;
    padding: 0 0 0 35px;
`;

const DateContainer = styled('div')`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const Connector = styled('div')`
    flex: 1 1 auto;
    min-height: 2rem;
    transform: scaleY(1.2);
    background:
        linear-gradient(
            to right,
            ${lightBlue} 0%,
            ${lightBlue} calc(50% - 0.81px),
            white calc(50% - 0.8px),
            white calc(50% + 0.8px),
            ${lightBlue} calc(50% + 0.81px),
            ${lightBlue} 100%
        );
`;

type EventItemBodyProps = DayItem & { className?: string, isMobile?: boolean; permaLink: string; };

const detailSectionMargin = (extra?: number) => css` margin-bottom: ${20 + (extra || 0)}px; `;

let EventItemBody: React.SFC<EventItemBodyProps> = ({
    className,
    dateTime,
    endDate,
    allDay,
    isMobile,
    name,
    location,
    collaborators,
    eventType,
    program,
    website,
    permaLink,
}) => (
        <div className={className}>
            <DateContainer>
                {endDate && <FlexEventDate dateTime={endDate} isMobile={isMobile} rounded={'top'} />}
                {endDate && <Connector />}
                <FlexEventDate dateTime={dateTime} isMobile={isMobile} rounded={endDate ? 'bottom' : 'both'} />
            </DateContainer>

            <FlexEventInfoContainer>
                <EventNameWithRouter className={detailSectionMargin()} name={name} isMobile={isMobile} permaLink={permaLink} eventType={eventType} />

                {!allDay && <EventTime
                    className={detailSectionMargin()}
                    dateTime={dateTime}
                />}

                <EventLocation location={location} className={detailSectionMargin()} isMobile={isMobile} />
                <EventCollaborators collaborators={collaborators} className={detailSectionMargin()} />
                <EventProgram program={program} className={detailSectionMargin(5)} />

                {website && <EventWebsiteButton website={website} />}
            </FlexEventInfoContainer>
        </div>
    );

EventItemBody = styled<EventItemBodyProps, typeof EventItemBody>(EventItemBody)`
    display: flex;
    padding: 30px 0 30px 30px;
    font-family: ${lato1};
    align-items: top;
    color: black;
    transition: 0.2s all;
    width: 80%;
    max-width: 1240px;
    margin: 0 auto;

    ${/* sc-selector */ screenXSorPortrait} {
        padding: 30px 0;
        width: 90%;
    }
`;

export { EventItemBody };
