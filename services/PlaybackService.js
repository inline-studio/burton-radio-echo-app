// service.js
import TrackPlayer, { Event } from 'react-native-track-player';

// This is the entry point for the playback service
export async function PlaybackService() {

    TrackPlayer.addEventListener(Event.RemotePlay, () => {
        console.log('RemotePlay event');
        TrackPlayer.play();
    });

    TrackPlayer.addEventListener(Event.RemotePause, () => {
        console.log('RemotePause event');
        TrackPlayer.pause();
    });

    TrackPlayer.addEventListener(Event.RemoteStop, () => {
        console.log('RemoteStop event');
        TrackPlayer.destroy(); // Stops playback and removes notification
    });

    // This event is needed for background playback to continue playing.
    TrackPlayer.addEventListener(Event.RemoteDuck, async (e) => {
        // Handle audio ducking (e.g., lower volume during notifications)
        // console.log('Remote Duck:', e);
        // TrackPlayer.setVolume(e.paused ? 1 : e.ducking ? 0.5 : 1);
    });

    // Add other event listeners as needed, e.g., RemoteSeek, RemoteDuck

    // Optional: Handle playback ending automatically
    TrackPlayer.addEventListener(Event.PlaybackQueueEnded, (data) => {
      console.log('PlaybackQueueEnded event', data);
      // You could stop the service here if desired
      // TrackPlayer.destroy();
    });

    //  TrackPlayer.addEventListener(Event.PlaybackState, (state) => {
    //     console.log('Playback State:', state);
    //  });

    //   TrackPlayer.addEventListener(Event.PlaybackTrackChanged, (data) => {
    //       console.log('Track changed:', data);
    //   });

    //   TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, (data) => {
    //        // This fires frequently, only log if debugging progress
    //        // console.log('Progress updated:', data);
    //   });

       TrackPlayer.addEventListener(Event.PlaybackError, (error) => {
           console.error('Playback Error:', error);
       });
};