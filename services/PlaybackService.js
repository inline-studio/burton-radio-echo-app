// service.js
import TrackPlayer, { Event } from 'react-native-track-player';
import { Logger } from "./Logger";

// This is the entry point for the playback service
export async function PlaybackService() {

    TrackPlayer.addEventListener(Event.RemotePlay, () => {
        Logger.debug('RemotePlay event');
        TrackPlayer.play();
    });

    TrackPlayer.addEventListener(Event.RemotePause, () => {
        Logger.debug('RemotePause event');
        TrackPlayer.stop();
    });

    TrackPlayer.addEventListener(Event.RemoteStop, () => {
        Logger.debug('RemoteStop event');
        TrackPlayer.destroy(); // Stops playback and removes notification
    });

    // This event is needed for background playback to continue playing.
    TrackPlayer.addEventListener(Event.RemoteDuck, async (e) => {
        // Handle audio ducking (e.g., lower volume during notifications)
        // Logger.debug('Remote Duck:', e);
        // TrackPlayer.setVolume(e.paused ? 1 : e.ducking ? 0.5 : 1);
    });

    // Add other event listeners as needed, e.g., RemoteSeek, RemoteDuck

    // Optional: Handle playback ending automatically
    TrackPlayer.addEventListener(Event.PlaybackQueueEnded, (data) => {
      Logger.debug('PlaybackQueueEnded event', data);
      // You could stop the service here if desired
      // TrackPlayer.destroy();
    });

    //  TrackPlayer.addEventListener(Event.PlaybackState, (state) => {
    //     Logger.debug('Playback State:', state);
    //  });

    //   TrackPlayer.addEventListener(Event.PlaybackTrackChanged, (data) => {
    //       Logger.debug('Track changed:', data);
    //   });

    //   TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, (data) => {
    //        // This fires frequently, only log if debugging progress
    //        // Logger.debug('Progress updated:', data);
    //   });

       TrackPlayer.addEventListener(Event.PlaybackError, (error) => {
           Logger.error('Playback Error:', error);
       });
};