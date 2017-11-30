export interface MusicItem {
    title: string;
    composer: string;
    contributing: string;
    url: string;
    waveform: string;
    id: string;
    duration: string;
}

export interface AudioVisualizerStateShape {
    innerRadius: number;
    outerRadius: number;
}

export interface AudioUIStateShape {
    isHoverSeekring: boolean;
    isHoverPlaypause: boolean;
    isMouseMove: boolean;
    angle: number;
}

export interface AudioPlaylistStateShape {
    isFetching: boolean;
    items: MusicItem[];
}
