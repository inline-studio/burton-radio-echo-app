// /Users/scott/Herd/Dev/inLineStudio/apps/BurtonRadioEcho/app/_layout.tsx
import "react-native-gesture-handler"; // Needs to be at the top
import { Logger } from "../services";
import * as React from "react";
import { StyleSheet, View, Text } from "react-native";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import {
  createBottomTabNavigator,
  BottomTabBarProps,
} from "@react-navigation/bottom-tabs";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"; // Import SafeArea components

// --- Your existing imports ---
import { CustomTabButton } from "@/components/CustomTabButton";
import { PlayButton } from "@/components/PlayButton";
import { SettingsButton } from "@/components/SettingsButton";
import * as Notifications from "expo-notifications";
import TrackPlayer, {
  Capability,
  Event,
  State,
  usePlaybackState,
  useTrackPlayerEvents,
  AppKilledPlaybackBehavior,
  PlaybackState,
  Track,
} from "react-native-track-player";

// --- Import screen components ---
import RadioScreen from "./index";
import EchoScreen from "./echo";
import SettingsScreen from "./settings";
import * as Sentry from "@sentry/react-native";
import { setupNotificationsForShows } from "@/lib/notificationManager";

Sentry.init({
  dsn: "https://7e6eeb67377fd1938efd4b5de1e4afa8@o4509231204794368.ingest.de.sentry.io/4509231212527696",

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

// --- Track Player Setup (Keep as is) ---
const track = {
  id: 1,
  url: "https://s9.citrus3.com:8370/stream",
  title: "BurtonRadio Live",
  artist: "Burton Radio",
  artwork: require("../assets/images/icon.png"),
  isLiveStream: true,
};

let playerInitialized = false;
async function setupPlayer() {
  // ... (Keep your existing setupPlayer function)
  Logger.debug("player state", playerInitialized);
//   if (State.) {

//   }
  if (playerInitialized) {
    Logger.warn("Player already initialized.");
    return;
  }
  try {
    Logger.debug("Setting up Track Player...");
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
      capabilities: [Capability.Play, Capability.Stop],
      compactCapabilities: [Capability.Play, Capability.Stop],
      android: {
        appKilledPlaybackBehavior:
          AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
      },
    });
    await TrackPlayer.add(track);
    playerInitialized = true;
    Logger.debug("Track Player setup complete and track added.");
  } catch (e) {
    Logger.error("Error setting up Track Player:", e);
  }
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// --- Create Tab Navigator ---
const Tab = createBottomTabNavigator();

// --- Custom Tab Bar Component ---
function CustomTabBar({
  state,
  descriptors,
  navigation,
  isPlaying,
  togglePlayback,
  openSettings,
}: BottomTabBarProps & {
  isPlaying: boolean;
  togglePlayback: () => void;
  openSettings: () => void;
}) {
  // Define icons for each route name
  const routeIcons: { [key: string]: string } = {
    Radio: "radio",
    Echo: "newspaper",
    Settings: "options", // Or 'cog', 'options', etc. depending on your icon set
  };

  return (
    <SafeAreaView edges={["bottom"]} style={styles.tabBarContainer}>
      <View style={styles.tabBarInnerContainer}>
        {/* Render Radio Tab */}
        <CustomTabButtonWrapper
          route={state.routes.find((r) => r.name === "Radio")}
          descriptor={
            descriptors[state.routes.find((r) => r.name === "Radio")?.key || ""]
          }
          navigation={navigation}
          isFocused={
            state.index === state.routes.findIndex((r) => r.name === "Radio")
          }
          iconName={routeIcons["Radio"]}
        />

        {/* Render Play Button */}
        <PlayButton onPress={togglePlayback} isPlaying={isPlaying} />

        {/* Render Settings Button */}
        <SettingsButton onPress={openSettings} />

        {/* Render Echo Tab */}
        <CustomTabButtonWrapper
          route={state.routes.find((r) => r.name === "Echo")}
          descriptor={
            descriptors[state.routes.find((r) => r.name === "Echo")?.key || ""]
          }
          navigation={navigation}
          isFocused={
            state.index === state.routes.findIndex((r) => r.name === "Echo")
          }
          iconName={routeIcons["Echo"]}
        />
      </View>
    </SafeAreaView>
  );
}

// Helper component to render each tab button consistently
function CustomTabButtonWrapper({
  route,
  descriptor,
  navigation,
  isFocused,
  iconName,
}: any) {
  if (!route || !descriptor) return null; // Handle cases where route/descriptor might be missing

  const { options } = descriptor;
  const label =
    options.tabBarLabel !== undefined
      ? options.tabBarLabel
      : options.title !== undefined
      ? options.title
      : route.name;

  const onPress = () => {
    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name, route.params);
    }
  };

  const onLongPress = () => {
    navigation.emit({
      type: "tabLongPress",
      target: route.key,
    });
  };

  return (
    <CustomTabButton
      key={route.key}
      icon={iconName}
      isFocused={isFocused}
      onPress={onPress}
      onLongPress={onLongPress}
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      testID={options.tabBarTestID}
      style={styles.tabButton} // Added style for flex distribution
    >
      {/* Ensure label is wrapped in Text */}
      <Text>{label as string}</Text>
    </CustomTabButton>
  );
}

// --- Main Layout Component ---
export default Sentry.wrap(function Layout() {
  // --- State & Effects (Keep as is) ---
  const playbackState = usePlaybackState() as PlaybackState;
  const isPlaying = React.useMemo(
    () =>
      playbackState.state === State.Playing ||
      playbackState.state === State.Buffering,
    [playbackState.state]
  );

  // Create the navigation ref
  const navigationRef = useNavigationContainerRef();
  // State for the metadata display text
  const [nowPlayingText, setNowPlayingText] = React.useState("Live Stream"); // Default text

  React.useEffect(() => {
    setupPlayer();
    // re-setup notifications for if the schedule has changed
    setupNotificationsForShows();
    Notifications.requestPermissionsAsync();
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
      Event.PlaybackMetadataReceived, // this is depricated and should be swapped for the new ones below
      Event.MetadataCommonReceived,
    ],
    async (event) => {
      // Make the callback async
      if (event.type === Event.PlaybackError) {
        Logger.warn("An error occurred during playback:", event);
      }
      if (event.type === Event.PlaybackState) {
        Logger.debug("Playback State:", event.state);
      }

      // --- Handle Metadata Updates ---
      if (
        event.type === Event.PlaybackMetadataReceived ||
        event.type === Event.MetadataCommonReceived
      ) {
        Logger.debug("Metadata received:", event); // Good for debugging what the stream sends

        const currentTrackId = track.id; // The ID of the track we initially added

        // Prepare the metadata object based on what the event provides
        // Use Partial<Track> to only update specific fields
        // for v5 future release
        // const metadataToUpdate: Partial<Track> = {};
        let nowPlaying: string = "Live Stream";

        if (event.title && event.title !== "Unknown") {
          // for v5 future release
          // metadataToUpdate.title = "BurtonRadio Live - " + event.title;
          nowPlaying = event.title;

          if (event.artist) {
            // for v5 future release
            // metadataToUpdate.artist = event.artist;
            nowPlaying += " - " + event.artist;
          }
        }

        setNowPlayingText(nowPlaying);
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
      navigationRef.navigate("Settings"); // <-- Use ref here
    } else {
      // Handle case where navigator isn't ready (optional)
      Logger.warn("Navigation not ready when trying to open settings.");
    }
  }, []);

  const togglePlayback = React.useCallback(async () => {
    const currentPlaybackState = await TrackPlayer.getPlaybackState();
    Logger.debug("Toggle Playback. Current state:", currentPlaybackState.state);
    if (
      currentPlaybackState.state === State.Playing ||
      currentPlaybackState.state === State.Buffering
    ) {
      await TrackPlayer.stop();
    } else {
      if (
        currentPlaybackState.state === State.Ready ||
        currentPlaybackState.state === State.Paused ||
        currentPlaybackState.state === State.Stopped
      ) {
        await TrackPlayer.play();
      } else {
        Logger.debug(
          "Player not in a state to play, current state:",
          currentPlaybackState.state
        );
        // Consider adding logic here if needed, e.g., TrackPlayer.reset() then TrackPlayer.play()
      }
    }
  }, []);

  // --- Render ---
  return (
    // Use SafeAreaProvider at the root
    <SafeAreaProvider>
      {/* <StatusBar backgroundColor="#342f56" style="light" /> */}
      <SafeAreaView style={styles.safeArea} edges={["left", "right", "bottom"]}>
        {/* Metadata Bar */}
        <View style={styles.metadataBar}>
          <Text
            style={styles.metadataText}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {nowPlayingText}
          </Text>
        </View>
        <View style={styles.layoutContainer}>
          <NavigationContainer
            independent={true}
            ref={navigationRef}
            style={styles.navigationContainer}
          >
            {/* Use independent if nested */}
            <Tab.Navigator
              // Use the custom tabBar component
              tabBar={(props) => (
                <CustomTabBar
                  {...props}
                  isPlaying={isPlaying}
                  togglePlayback={togglePlayback}
                  openSettings={openSettings}
                />
              )}
              screenOptions={{
                headerShown: false, // Hide default headers if you have custom ones in screens
              }}
            >
              <Tab.Screen
                name="Radio" // This name is used for navigation and in the tab bar label
                component={RadioScreen}
                // options={{ tabBarLabel: 'Radio' }} // Optional: customize label if needed
              />
              <Tab.Screen
                name="Echo"
                component={EchoScreen}
                // options={{ tabBarLabel: 'Echo' }} // Optional: customize label if needed
              />
              <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                // options={{ tabBarLabel: 'Settings' }} // Optional: Set label explicitly
              />
            </Tab.Navigator>
          </NavigationContainer>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
});

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#342f56", // Background for safe area edges
  },
  layoutContainer: {
    flex: 1, // Make layout container fill the safe area
    backgroundColor: "#fff", // Default background for screen area (optional)
  },
  navigationContainer: {
    flex: 1, // Ensure NavigationContainer fills space above metadata bar
  },
  metadataBar: {
    height: 25, // Adjust height as needed
    backgroundColor: "#2a2545", // Choose a background color
    paddingHorizontal: 15,
    justifyContent: "center", // Center text vertically
    alignItems: "center", // Center text horizontally
  },
  metadataText: {
    color: "#ccc", // Choose text color
    fontSize: 12,
  },
  tabBarContainer: {
    backgroundColor: "#342f56", // Example background for the safe area part
    // position: 'absolute', // If you want it floating over content
    // bottom: 0,
    // left: 0,
    // right: 0,
  },
  tabBarInnerContainer: {
    flexDirection: "row",
    height: 80, // Adjust as needed
    alignItems: "center",
    backgroundColor: "#342f56",
    // Add other styles like borders, shadows etc.
    // borderTopWidth: 1,
    // borderTopColor: '#ccc',
  },
  tabButton: {
    flex: 1, // Allow tab buttons to take up space
    alignItems: "center", // Center content within the button
    justifyContent: "center",
  },
});
