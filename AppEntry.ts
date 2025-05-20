import 'react-native-gesture-handler';

import registerRootComponent from 'expo/src/launch/registerRootComponent';
import TrackPlayer from 'react-native-track-player';
import * as Notifications from "expo-notifications";
import * as Sentry from '@sentry/react-native';

import Layout from '@/app/_layout';

import { PlaybackService } from '@/services';

Notifications.setNotificationHandler({
    handleNotification: () => Promise.resolve({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

Sentry.init({
    dsn: "https://7e6eeb67377fd1938efd4b5de1e4afa8@o4509231204794368.ingest.de.sentry.io/4509231212527696",

    // Configure Session Replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1,
    integrations: [Sentry.mobileReplayIntegration()],

    // uncomment the line below to enable Spotlight (https://spotlightjs.com)
    // spotlight: __DEV__,
});

registerRootComponent(Layout);

// Register the playback service right after registering the main component
TrackPlayer.registerPlaybackService(() => PlaybackService);

// export default Sentry.wrap(Layout);