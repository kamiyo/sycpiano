import { AudioPlaylistStateShape, AudioUIStateShape, AudioVisualizerStateShape } from 'src/components/Media/Music/types';
import { PhotoListReducerShape } from 'src/components/Media/Photos/types';
import { VideoPlayerStateShape, VideoPlaylistStateShape } from 'src/components/Media/Videos/types';
import { AcclaimsListStateShape } from 'src/components/Press/types';
import { ScheduleStateShape } from 'src/components/Schedule/types';

export interface GlobalStateShape {
    readonly audio_playlist: AudioPlaylistStateShape;
    readonly audio_ui: AudioUIStateShape;
    readonly audio_visualizer: AudioVisualizerStateShape;
    readonly photo_list: PhotoListReducerShape;
    readonly press_acclaimsList: AcclaimsListStateShape;
    readonly schedule_eventItems: ScheduleStateShape;
    readonly video_player: VideoPlayerStateShape;
    readonly video_playlist: VideoPlaylistStateShape;
}
