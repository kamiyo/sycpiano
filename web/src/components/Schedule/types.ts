import { Moment } from 'moment-timezone';

import { SortedArraySet } from 'collections/sorted-array-set';
import { EventListName } from 'src/components/Schedule/actionTypes';

export type EventType = 'concerto' | 'chamber' | 'solo' | 'masterclass';

export interface Collaborator {
    name: string;
    instrument: string;
}

export interface Piece {
    composer: string;
    piece: string;
}

export type Collaborators = Collaborator[];
export type Pieces = Piece[];

export interface CachedEvent {
    readonly id: string;
    readonly location: string;
    readonly dateTime: string;
    readonly timezone: string;
    readonly name: string;
    readonly collaborators: Collaborators;
    readonly pieces: Pieces;
    readonly type: EventType;
    readonly website?: string;
}

export interface DayItem {
    readonly type: 'day';
    readonly id: string;
    readonly name: string;
    readonly collaborators: Collaborators;
    readonly eventType: EventType;
    readonly dateTime: Moment;
    readonly location: string;
    readonly program: Pieces;
    readonly website?: string;
}

export interface MonthItem {
    readonly type: 'month';
    readonly dateTime: Moment;
    readonly month: string;
    readonly year: number;
}

export interface LoadingItem {
    readonly type: 'loading';
}

export type EventItemType = DayItem | MonthItem;

export const itemIsDay = (item: EventItemType | LoadingItem): item is DayItem => (
    item.type === 'day'
);

export const itemIsMonth = (item: EventItemType | LoadingItem): item is MonthItem => (
    item.type === 'month'
);

export const itemIsLoading = (item: EventItemType | LoadingItem): item is LoadingItem => (
    item.type === 'loading'
);

export const itemNotLoading = (item: EventItemType | LoadingItem): item is DayItem | MonthItem => (
    item.type !== 'loading'
);

export interface ScheduleStateShape {
    activeName: EventListName;
    upcoming: EventItemsStateShape;
    archive: EventItemsStateShape;
}

export interface EventItemsStateShape {
    readonly itemArray: EventItemType[];
    readonly items: SortedArraySet<EventItemType>;
    readonly currentItem: DayItem;
    readonly currentLatLng: LatLngLiteral;
    readonly hasEventBeenSelected: boolean;
    readonly isFetchingList: boolean;
    readonly isFetchingLatLng: boolean;
    readonly minDate: Moment;
    readonly maxDate: Moment;
    readonly setOfMonths: Set<string>;
    readonly hasMore: boolean;
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
