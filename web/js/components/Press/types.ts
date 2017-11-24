export interface AcclaimItemShape {
    ID: string;
    quote: string;
    short: string;
    author: string;
    shortAuthor: string;
    date: string;
}

export interface AcclaimsListStateShape {
    isFetching: boolean;
    items: AcclaimItemShape[];
}
