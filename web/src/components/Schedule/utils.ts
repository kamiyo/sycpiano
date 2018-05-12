import { default as moment } from 'moment-timezone';

import { CachedEvent, EventItemType, MonthItem } from 'src/components/Schedule/types';

const GOOGLE_MAPS_SEARCH_URL = 'https://www.google.com/maps/search/?api=1';

export const transformCachedEventsToListItems = (
    events: CachedEvent[],
    monthsSeen: Set<string>,
): EventItemType[] => (
    events.reduce((runningEventsArr: EventItemType[], event) => {
        let eventDateTime = moment(event.dateTime);
        if (event.timezone) {
            eventDateTime = eventDateTime.tz(event.timezone);
        }

        const month = eventDateTime.format('MMMM');
        const year = eventDateTime.year();

        const nextEventsArr: EventItemType[] = [];
        const monthYearString = `${month} ${year}`;
        if (!monthsSeen.has(monthYearString)) {
            monthsSeen.add(monthYearString);
            const monthMoment = moment(monthYearString, 'MMMM YYYY');
            nextEventsArr.push({
                type: 'month',
                dateTime: monthMoment,
                month,
                year,
            } as MonthItem);
        }

        const endDate = moment(event.endDate).isValid() ? moment(event.endDate) : undefined;

        nextEventsArr.push({
            type: 'day',
            id: event.id,
            name: event.name,
            dateTime: eventDateTime,
            endDate,
            allDay: event.allDay,
            collaborators: event.collaborators,
            eventType: event.type,
            location: event.location,
            program: event.pieces,
            website: event.website,
        });

        return [ ...runningEventsArr, ...nextEventsArr ];
    }, [])
);

export const getGoogleMapsSearchUrl = (query: string) => `
    ${GOOGLE_MAPS_SEARCH_URL}&query=${encodeURIComponent(query)}
`;
