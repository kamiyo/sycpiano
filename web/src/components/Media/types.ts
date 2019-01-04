import { SerializedStyles } from '@emotion/css';

export interface ChildRendererProps<T> {
    readonly key: number | string;
    readonly currentItemId: number | string;
    readonly item: T;
    readonly onClick?: (...args: any[]) => void;
    readonly isMobile?: boolean;
}

export interface PlaylistProps {
    readonly extraStyles?: {
        div?: SerializedStyles;
        ul?: SerializedStyles;
    };
    readonly hasToggler: boolean;
    readonly isShow: boolean;
    readonly togglePlaylist?: (isShow?: boolean) => void;
    readonly shouldAppear: boolean;
    readonly isMobile?: boolean;
    readonly id?: string;
    readonly onScroll?: (event: React.SyntheticEvent<HTMLElement>) => void;
}
