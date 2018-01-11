import { Moment } from 'moment-timezone';
import { Grid } from 'react-virtualized/dist/es/Grid';
import { List } from 'react-virtualized/dist/es/List';

import { SortedArraySet } from 'collections/sorted-array-set';
import { EventListName } from 'src/components/Schedule/actionTypes';

export type EventType = 'concerto' | 'chamber' | 'solo' | 'masterclass';

export interface GCalEvent {
    readonly description: any;
    readonly id: string;
    readonly location: string;
    readonly start: {
        readonly dateTime?: Moment;
        readonly date?: Moment;
        readonly timeZone?: string;
    };
    readonly summary: string;
    readonly [key: string]: any; // other params
}

export interface CachedEvent {
    readonly id: string;
    readonly location: string;
    readonly dateTime: string;
    readonly timezone: string;
    readonly name: string;
    readonly collaborators: Array<{
        name: string;
    }>;
    readonly pieces: Array<{
        piece: string;
    }>;
    readonly type: EventType;
}

interface DayOrMonth {
    type: 'day' | 'month';
}

export interface DayItemInputShape {
    readonly id: string;
    readonly name: string;
    readonly collaborators: string[];
    readonly eventType: EventType;
    readonly dateTime: Moment;
    readonly location: string;
    readonly program: string[];
}

export interface MonthItemInputShape {
    readonly dateTime: Moment;
    readonly month: string;
    readonly year: number;
}

export type EventItemInputShape = DayItemInputShape | MonthItemInputShape;

export type DayItemShape = DayOrMonth & DayItemInputShape;

export type MonthItemShape = DayOrMonth & MonthItemInputShape;

export type EventItemShape = DayItemShape | MonthItemShape;

export interface ScheduleStateShape {
    activeName: EventListName;
    upcoming: EventItemsStateShape;
    archive: EventItemsStateShape;
}

export interface EventItemsStateShape {
    readonly items: SortedArraySet<EventItemShape>;
    readonly currentItem: DayItemShape;
    readonly currentLatLng: {
        readonly lat: number;
        readonly lng: number;
    };
    readonly hasEventBeenSelected: boolean;
    readonly isFetchingList: boolean;
    readonly isFetchingLatLng: boolean;
    readonly minDate: Moment;
    readonly maxDate: Moment;
    readonly setOfMonths: Set<string>;
    readonly hasMore: boolean;
}

export class GridWithScrollingContainer extends Grid {
    /* tslint:disable:variable-name */
    _scrollingContainer: HTMLElement;
    /* ts-lint:enable:variable-name */
}

export class ListWithGrid extends List {
    Grid?: GridWithScrollingContainer;
}

export interface FetchEventsArguments {
    date?: Moment;
    after?: Moment;
    before?: Moment;
    scrollTo?: boolean;
}

export interface FetchEventsAPIParams {
    date?: string;
    after?: string;
    before?: string;
    limit: number;
}

export interface LatLngLiteral {
    lat: number; lng: number;
}

export declare class LatLng {
    constructor(lat: number, lng: number, noWrap?: boolean);
    /** Comparison function. */
    equals(other: LatLng): boolean;
    /** Returns the latitude in degrees. */
    lat: number;
    /** Returns the longitude in degrees. */
    lng: number;
    /** Converts to string representation. */
    toString(): string;
    /** Returns a string of the form "lat,lng". We round the lat/lng values to 6 decimal places by default. */
    toUrlValue(precision?: number): string;
    /** Converts to JSON representation. This function is intended to be used via JSON.stringify. */
    toJSON(): LatLngLiteral;
}
