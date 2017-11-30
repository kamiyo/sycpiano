import { Moment } from 'moment-timezone';
import { Grid, List } from 'react-virtualized';

export interface DayItemInputShape {
    id: string;
    name: string;
    collaborators: string[];
    eventType: 'concerto' | 'chamber' | 'solo' | 'masterclass';
    dateTime: Moment;
    location: string;
    program: string[];
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
    items: any[];
    currentItem: any;
    currentLatLng: {
        lat: number;
        lng: number;
    };
    hasEventBeenSelected: boolean;
    isFetching: boolean;
    isFetchingLatLng: boolean;
    isAnimatingScroll: boolean;
}

export interface GridWithScrolllingContainer extends Grid {
    _scrollingContainer: HTMLElement;
}

export interface ListWithGrid extends List {
    Grid?: GridWithScrolllingContainer;
}
