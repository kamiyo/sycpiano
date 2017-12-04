import { Moment } from 'moment-timezone';
import { Grid } from 'react-virtualized/dist/es/Grid';
import { List } from 'react-virtualized/dist/es/List';

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

export interface DayItemInputShape {
    readonly id: string;
    readonly name: string;
    readonly collaborators: string[];
    readonly eventType: 'concerto' | 'chamber' | 'solo' | 'masterclass';
    readonly dateTime: Moment;
    readonly location: string;
    readonly program: string[];
}

export interface MonthItemInputShape {
    month: string;
}

export interface DayItemShape extends DayItemInputShape {
    type: 'day' | 'month';
}

export interface MonthItemShape extends MonthItemInputShape {
    type: 'day' | 'month';
}

export type EventItemShape = DayItemShape | MonthItemShape;

export interface EventItemsStateShape {
    readonly items: any[];
    readonly currentItem: any;
    readonly currentLatLng: {
        readonly lat: number;
        readonly lng: number;
    };
    readonly hasEventBeenSelected: boolean;
    readonly isFetching: boolean;
    readonly isFetchingLatLng: boolean;
    readonly isAnimatingScroll: boolean;
}

export interface GridWithScrolllingContainer extends Grid {
    _scrollingContainer: HTMLElement;
}

export interface ListWithGrid extends List {
    Grid?: GridWithScrolllingContainer;
}
