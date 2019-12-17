import * as React from 'react';

import { css } from '@emotion/core';
import styled from '@emotion/styled';

import {
    EventCollaborators,
    EventDate,
    EventLocation,
    EventNameWithRouter,
    EventProgram,
    EventTime,
    EventWebsiteButton,
} from 'src/components/Schedule/EventDetails';
import { DayItem, EventListName } from 'src/components/Schedule/types';

import { lightBlue } from 'src/styles/colors';
import { lato1 } from 'src/styles/fonts';
import { screenXSorPortrait } from 'src/styles/screens';

const FlexEventInfoContainer = styled.div`
    flex: 0 1 auto;
    padding: 0 0 0 35px;
`;

const DateContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const Connector = styled.div`
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

type EventItemBodyProps = DayItem & { className?: string; isMobile?: boolean; permaLink: string; listType: EventListName };

const detailSectionMargin = (extra?: number) => css` margin-bottom: ${20 + (extra || 0)}px; `;

const StyledItemBody = styled.div`
    display: flex;
    padding: 30px 0 30px 30px;
    font-family: ${lato1};
    align-items: top;
    color: black;
    transition: 0.2s all;
    width: 80%;
    max-width: 1240px;
    margin: 0 auto;

    ${screenXSorPortrait} {
        padding: 30px 0;
        width: 90%;
    }
`;

const EventItemBody: React.FC<EventItemBodyProps> = ({
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
    listType,
}) => {
    const firstDate = listType === 'archive' ? endDate : dateTime;
    const secondDate = listType === 'archive' ? dateTime : endDate;
    const DateChildren = endDate ? (
        <React.Fragment>
            <EventDate dateTime={firstDate} isMobile={isMobile} rounded={'top'} />
            <Connector />
            <EventDate dateTime={secondDate} isMobile={isMobile} rounded={'bottom'} />
        </React.Fragment>
    ) : <EventDate dateTime={dateTime} isMobile={isMobile} rounded={'both'} />;
    return (
        <StyledItemBody>
            <DateContainer>
                {DateChildren}
            </DateContainer>

            <FlexEventInfoContainer>
                <EventNameWithRouter css={detailSectionMargin()} name={name} isMobile={isMobile} permaLink={permaLink} eventType={eventType} />

                {!allDay && (
                    <EventTime
                        css={detailSectionMargin()}
                        dateTime={dateTime}
                    />
                )}

                <EventLocation location={location} css={detailSectionMargin()} isMobile={isMobile} />
                <EventCollaborators collaborators={collaborators} css={detailSectionMargin()} />
                <EventProgram program={program} css={detailSectionMargin(5)} />

                {website && <EventWebsiteButton website={website} />}
            </FlexEventInfoContainer>
        </StyledItemBody>
    );
};

export { EventItemBody };
