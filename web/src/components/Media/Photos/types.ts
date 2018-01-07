
export interface PhotoListReducerShape {
    items: PhotoItemShape[];
    isFetching: boolean;
}

export interface PhotoItemShape {
    file: string;
    width: number;
    height: number;
    thumbnailWidth: number;
    thumbnailHeight: number;
}
