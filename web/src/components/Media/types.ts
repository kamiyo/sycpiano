export interface ChildRendererProps<T> {
    readonly key: number | string;
    readonly currentItemId: number | string;
    readonly item: T;
    readonly onClick: (...args: any[]) => void;
}

export interface PlaylistProps<T> {
    readonly ChildRenderer: (childrenProps: ChildRendererProps<T>) => JSX.Element;
    readonly extraStyles?: {
        div?: string;
        ul?: string
    };
    readonly currentItemId: number | string;
    readonly hasToggler: boolean;
    readonly isShow: boolean;
    readonly items: T[];
    readonly onClick: (...args: any[]) => void;
    readonly togglePlaylist?: (isShow?: boolean) => void;
    readonly shouldAppear: boolean;
    readonly isMobile?: boolean;
}
