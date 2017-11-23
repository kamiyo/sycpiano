import { AcclaimsListStateShape } from 'js/components/Press/reducers';
import { EventItemsStateShape } from 'js/components/Schedule/reducers';

export interface GlobalStateShape {
    audio_playlist: any;
    audio_ui: any;
    audio_visualizer: any;
    press_acclaimsList: AcclaimsListStateShape;
    schedule_eventItems: EventItemsStateShape;
    video_player: any;
    video_playlist: any;
}
