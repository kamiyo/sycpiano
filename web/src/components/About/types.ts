export interface Blurb {
    paragraph: number;
    text: string;
}

export interface AboutStateShape {
    isFetching: boolean;
    bio: Blurb[];
}
