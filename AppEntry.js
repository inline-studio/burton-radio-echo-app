import 'react-native-gesture-handler'; // Must be first
import registerRootComponent from 'expo/src/launch/registerRootComponent';
import TrackPlayer from 'react-native-track-player';
import { PlaybackService } from './services';

import Layout from './app/_layout'; // Your main App component

registerRootComponent(Layout);

// Register the playback service right after registering the main component
TrackPlayer.registerPlaybackService(() => PlaybackService);
