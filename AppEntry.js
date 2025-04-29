import 'react-native-gesture-handler'; // Must be first
import registerRootComponent from 'expo/src/launch/registerRootComponent';
import TrackPlayer from 'react-native-track-player';
// import * as Sentry from '@sentry/react-native';
import { PlaybackService } from './services';

import Layout from './app/_layout'; // Your main App component

// Sentry.init({
//     dsn: 'YOUR DSN HERE',
//     debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
//     _experiments: {
//         // Enable logs to be sent to Sentry.
//         enableLogs: true,
//       },
// });

registerRootComponent(Layout);

// Register the playback service right after registering the main component
TrackPlayer.registerPlaybackService(() => PlaybackService);

// export default Sentry.wrap(Layout);