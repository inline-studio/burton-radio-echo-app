import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import * as Sentry from '@sentry/react-native';
import * as Notifications from 'expo-notifications';
import * as React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'; // Import SafeArea components
import TrackPlayer, { Event, State, usePlaybackState, useTrackPlayerEvents } from 'react-native-track-player';

import EchoScreen from '@/components/screens/EchoScreen';
import RadioScreen from '@/components/screens/RadioScreen';
import SettingsScreen from '@/components/screens/SettingsScreen';

import { CustomTabBar } from '@/components/CustomTabBar';
import { styles } from '@/constants/Styles';
import { Tabs } from '@/lib/navigation';
import { setupNotificationsForShows } from '@/lib/notificationManager';
import { ingestMetadata, setupPlayer, shutdownPlayer } from '@/lib/track';
import { Logger } from '@/services';

export default Sentry.wrap(function Layout() {
    // --- State & Effects (Keep as is) ---
    const playbackState = usePlaybackState();

    // Create the navigation ref
    const navigationRef = useNavigationContainerRef();
    // State for the metadata display text
    const [nowPlayingText, setNowPlayingText] = React.useState('Live Stream'); // Default text

    React.useEffect(() => {
        void setupPlayer();
        // re-setup notifications for if the schedule has changed
        void setupNotificationsForShows();
        void Notifications.requestPermissionsAsync();

        return () => {
            void shutdownPlayer();
        };
    }, []);

    // useTrackPlayerEvents([Event.PlaybackError, Event.PlaybackState], (event) => {
    //   if (event.type === Event.PlaybackError) {
    //     console.warn("An error occurred during playback:", event);
    //   }
    //   if (event.type === Event.PlaybackState) {
    //     console.log("Playback State:", event.state);
    //   }
    // });

    useTrackPlayerEvents(
        [
            Event.PlaybackError,
            Event.PlaybackState,
            // eslint-disable-next-line @typescript-eslint/no-deprecated
            Event.PlaybackMetadataReceived, // this is deprecated and should be swapped for the new ones below
            // Event.MetadataCommonReceived,
        ],
        async (event) => {
            // Make the callback async
            if (event.type === Event.PlaybackError) {
                Logger.warn('An error occurred during playback:', event);
            }
            if (event.type === Event.PlaybackState) {
                Logger.debug('Playback State:', event.state);
            }

            // --- Handle Metadata Updates ---
            // eslint-disable-next-line @typescript-eslint/no-deprecated
            if (event.type === Event.PlaybackMetadataReceived) {
                Logger.debug('Metadata received:', event); // Good for debugging what the stream sends

                // const currentTrackId = track.id; // The ID of the track we initially added

                // Prepare the metadata object based on what the event provides
                // Use Partial<Track> to only update specific fields
                // for v5 future release
                // const metadataToUpdate: Partial<Track> = {};
                let nowPlaying = 'Live Stream';

                if (event.title && event.title !== 'Unknown') {
                    // for v5 future release
                    // metadataToUpdate.title = "BurtonRadio Live - " + event.title;
                    nowPlaying = event.title;

                    if (event.artist) {
                        // for v5 future release
                        // metadataToUpdate.artist = event.artist;
                        nowPlaying += ' - ' + event.artist;
                    }
                }

                Logger.debug('nowPlaying', nowPlaying);
                setNowPlayingText(nowPlaying);
                await ingestMetadata({ artist: nowPlaying });
                // for v5 future release
                // You could potentially update artwork if the stream provides a URL
                // if (event.artwork) {
                //   metadataToUpdate.artwork = event.artwork; // Needs to be a URI string or require()
                // }

                // for v5 future release
                // Only update if we have something new
                /* if (Object.keys(metadataToUpdate).length > 0) {
          try {
            console.log(
              `Updating metadata for track ${currentTrackId}:`,
              metadataToUpdate
            );
            // Update the metadata for the specific track ID
            // for v5 future release
            // await TrackPlayer.updateMetadataForTrack(
            //   currentTrackId,
            //   metadataToUpdate
            // );
            console.log("Metadata updated successfully for lock screen.");
          } catch (error) {
            console.error("Error updating track metadata:", error);
          }
        } */
            }
            // --- End Metadata Update Handling ---
        }
    );

    const openSettings = React.useCallback(() => {
        // Check if the navigation container is ready and navigate
        if (navigationRef.isReady()) {
            // Use the ref to navigate
            navigationRef.navigate('Settings'); // <-- Use ref here
        } else {
            // Handle case where navigator isn't ready (optional)
            Logger.warn('Navigation not ready when trying to open settings.');
        }
    }, [navigationRef]);

    const togglePlayback = React.useCallback(async () => {
        const currentPlaybackState = await TrackPlayer.getPlaybackState();
        Logger.debug('Toggle Playback. Current state:', currentPlaybackState.state);
        if (currentPlaybackState.state === State.Playing || currentPlaybackState.state === State.Buffering) {
            await TrackPlayer.stop();
        } else {
            if (
                currentPlaybackState.state === State.Ready ||
                currentPlaybackState.state === State.Paused ||
                currentPlaybackState.state === State.Stopped
            ) {
                await TrackPlayer.play();
            } else {
                Logger.debug('Player not in a state to play, current state:', currentPlaybackState.state);
                // Consider adding logic here if needed, e.g., TrackPlayer.reset() then TrackPlayer.play()
            }
        }
    }, []);

    // --- Render ---
    return (
        // Use SafeAreaProvider at the root
        <SafeAreaProvider>
            {/* <StatusBar backgroundColor="#342f56" style="light" /> */}
            <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'top']}>
                {/* Metadata Bar */}
                <View style={styles.metadataBar}>
                    <Text style={styles.metadataText} numberOfLines={1} ellipsizeMode="tail">
                        {nowPlayingText}
                    </Text>
                </View>
                <View style={styles.layoutContainer}>
                    <NavigationContainer ref={navigationRef} style={styles.navigationContainer}>
                        {/* Use independent if nested */}
                        <Tabs.Navigator
                            // Use the custom tabBar component
                            tabBar={(props) => (
                                <CustomTabBar {...props} playbackState={playbackState} togglePlayback={togglePlayback} openSettings={openSettings} />
                            )}
                            screenOptions={{
                                headerShown: false, // Hide default headers if you have custom ones in screens
                            }}
                        >
                            <Tabs.Screen
                                name="Radio" // This name is used for navigation and in the tab bar label
                                component={RadioScreen}
                                // options={{ tabBarLabel: 'Radio' }} // Optional: customize label if needed
                            />
                            <Tabs.Screen
                                name="Echo"
                                component={EchoScreen}
                                // options={{ tabBarLabel: 'Echo' }} // Optional: customize label if needed
                            />
                            <Tabs.Screen
                                name="Settings"
                                component={SettingsScreen}
                                // options={{ tabBarLabel: 'Settings' }} // Optional: Set label explicitly
                            />
                        </Tabs.Navigator>
                    </NavigationContainer>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
});
