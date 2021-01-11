import { default as moment } from 'moment-timezone';

import { CachedEvent, EventItemType, MonthItem } from 'src/components/Schedule/types';

const GOOGLE_MAPS_SEARCH_URL = 'https://www.google.com/maps/search/?api=1';

/*
 * We want to convert an array of EventItemType, which is raw data from api response
 * to one that has Month items injected in.
 * params:
 *  events - events to parse
 *  monthsSeen - immutable cache of months, should contain previous months seen, of the format '[month] [year]'.
 *
 * returns: map of {
 *  events: EventItemType[]
 *  monthsSeens: Set<string>
 * }
 */
export const transformCachedEventsToListItems = (
    events: CachedEvent[],
    monthsSeen: Set<string>,
): { events: EventItemType[]; monthsSeen: Set<string> } => {
    const monthsSet = new Set<string>(monthsSeen);
    const eventsList = events.reduce((runningEventsArr: EventItemType[], event) => {
        let eventDateTime = moment(event.dateTime);
        if (event.timezone) {
            eventDateTime = eventDateTime.tz(event.timezone);
        }

        const month = eventDateTime.format('MMMM');
        const year = eventDateTime.year();

        const nextEventsArr: EventItemType[] = [];
        const monthYearString = `${month} ${year}`;
        if (!monthsSet.has(monthYearString)) {
            monthsSet.add(monthYearString);
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
    }, []);

    return {
        events: eventsList,
        monthsSeen: monthsSet,
    };
};

export const getGoogleMapsSearchUrl = (query: string): string => `
    ${GOOGLE_MAPS_SEARCH_URL}&query=${encodeURIComponent(query)}
`;
