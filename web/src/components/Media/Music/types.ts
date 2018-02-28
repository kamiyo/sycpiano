export interface MusicItem {
    readonly id: string;
    readonly piece: string;
    readonly composer: string;
    readonly contributors: string;
    readonly musicFiles?: MusicFileItem[];
}

export interface MusicFileItem {
    readonly id: string;
    readonly name: string;
    readonly audioFile: string;
    readonly waveformFile: string;
    readonly durationSeconds: number;
    readonly musicId: string;
}
export type MusicCategories = 'concerto' | 'solo' | 'chamber' | 'composition';

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

export interface AudioVisualizerStateShape {
    readonly innerRadius: number;
    readonly outerRadius: number;
    readonly baseRadius: number;
    readonly verticalOffset: number;
}

export interface AudioUIStateShape {
    readonly isHoverSeekring: boolean;
    readonly isHoverPlaypause: boolean;
    readonly isMouseMove: boolean;
    readonly angle: number;
}

export interface AudioPlaylistStateShape {
    readonly isFetching: boolean;
    readonly items: MusicListItem[];
}
