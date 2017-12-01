export interface AcclaimItemShape {
    readonly ID: string;
    readonly quote: string;
    readonly short: string;
    readonly author: string;
    readonly shortAuthor: string;
    readonly date: string;
}

export interface AcclaimsListStateShape {
    readonly isFetching: boolean;
    readonly items: AcclaimItemShape[];
}
