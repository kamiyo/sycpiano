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

export interface AudioVisualizerStateShape {
    readonly innerRadius: number;
    readonly outerRadius: number;
}

export interface AudioUIStateShape {
    readonly isHoverSeekring: boolean;
    readonly isHoverPlaypause: boolean;
    readonly isMouseMove: boolean;
    readonly angle: number;
}

export interface AudioPlaylistStateShape {
    readonly isFetching: boolean;
    readonly items: MusicItem[];
}
