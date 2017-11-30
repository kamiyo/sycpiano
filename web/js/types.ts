import { AudioPlaylistStateShape, AudioUIStateShape, AudioVisualizerStateShape } from 'js/components/Media/Music/types';
import { VideoPlayerStateShape, VideoPlaylistStateShape } from 'js/components/Media/Videos/types';
import { AcclaimsListStateShape } from 'js/components/Press/types';
import { EventItemsStateShape } from 'js/components/Schedule/types';

export interface GlobalStateShape {
    audio_playlist: AudioPlaylistStateShape;
    audio_ui: AudioUIStateShape;
    audio_visualizer: AudioVisualizerStateShape;
    press_acclaimsList: AcclaimsListStateShape;
    schedule_eventItems: EventItemsStateShape;
    video_player: VideoPlayerStateShape;
    video_playlist: VideoPlaylistStateShape;
}
