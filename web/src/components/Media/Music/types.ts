export interface MusicItem {
    readonly title: string;
    readonly composer: string;
    readonly contributing: string;
    readonly url: string;
    readonly waveform: string;
    readonly id: string;
    readonly duration: string;
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
