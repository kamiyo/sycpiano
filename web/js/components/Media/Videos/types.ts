export type VideoItemShape = Youtube.PlaylistItem & Youtube.Video;

export interface VideoPlayerStateShape {
    isPlayerReady: boolean;
    videoId: string;
    isPreviewOverlay: boolean;
    isPlaying: boolean;
}

export interface VideoPlaylistStateShape {
    items: VideoItemShape[];
    isFetching: boolean;
    isShow: boolean;
}
