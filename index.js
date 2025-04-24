// index.js (or your main entry point)
import { AppRegistry } from 'react-native';
import App from './App/index'; // Your main App component
import { name as appName } from './app.json';
import TrackPlayer from 'react-native-track-player';
import { playbackService } from './service'; // Import the service function

AppRegistry.registerComponent(appName, () => App);

// Register the playback service right after registering the main component
TrackPlayer.registerPlaybackService(() => playbackService);