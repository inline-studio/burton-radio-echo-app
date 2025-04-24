import registerRootComponent from 'expo/src/launch/registerRootComponent';
import TrackPlayer from 'react-native-track-player';
import { playbackService } from './service'; // Import the service function

import App from './app/_layout'; // Your main App component

registerRootComponent(App);

// Register the playback service right after registering the main component
TrackPlayer.registerPlaybackService(() => playbackService);