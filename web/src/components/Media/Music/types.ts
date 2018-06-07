export interface MusicItem {
    readonly id: string;
    readonly piece: string;
    readonly composer: string;
    readonly contributors?: string;
    readonly type: MusicCategories;
    readonly year?: number;
    readonly musicFiles?: MusicFileItem[];
}

export interface MusicFileItem {
    readonly id: string;
    readonly name: string;
    readonly audioFile: string;
    readonly waveformFile: string;
    readonly durationSeconds: number;
    readonly musicId: string;
    readonly musicItem?: MusicItem;
}

export type MusicCategories = 'concerto' | 'solo' | 'chamber' | 'composition' | 'videogame';

export interface MusicCategoryItem {
    readonly id: MusicCategories;
    readonly type: MusicCategories;
}

export type MusicResponse = {
    readonly [k in MusicCategories]: MusicItem[];
};

export type MusicListItem = MusicItem | MusicCategoryItem;

export const isMusicItem = (item: MusicListItem): item is MusicItem => {
    const test = item as MusicItem;
    return !!(test.piece || test.composer || test.contributors || test.musicFiles);
};

export interface AudioUIStateShape {
    readonly isHoverSeekring: boolean;
    readonly isMouseMove: boolean;
    readonly angle: number;
}

export interface AudioPlaylistStateShape {
    readonly isFetching: boolean;
    readonly items: MusicListItem[];
    readonly flatItems: MusicFileItem[];
}
