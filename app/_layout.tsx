import * as React from "react";
import { StyleSheet } from "react-native";
import { Tabs, TabList, TabTrigger, TabSlot } from "expo-router/ui";
import { CustomTabButton } from "@/components/CustomTabButton";
import { PlayButton } from "@/components/PlayButton";
import { StatusBar } from "expo-status-bar";
import * as Notifications from "expo-notifications";
import TrackPlayer, {
  Capability,
  Event,
  State,
  usePlaybackState,
  // useProgress, // Keep if you need progress updates
  useTrackPlayerEvents,
  RepeatMode, // Import RepeatMode
  AppKilledPlaybackBehavior, // Import for background behavior
  PlaybackState, // Import for type checking state
} from "react-native-track-player";

const track = {
  id: "liveStream",
  url: "https://s9.citrus3.com:8370/stream", // Your stream URL
  title: "BurtonRadio Live",
  artist: "Burton Radio",
  artwork: require("../assets/images/icon.png"), // Replace with your actual icon path
  isLiveStream: true, // Important for live streams
};

// --- Track Player Setup ---
// Needs to be outside the component or memoized to avoid re-running setup unnecessarily
// It's recommended to run setupPlayer only once for the app's lifetime.
// You might move this to your app's entry point (e.g., App.tsx or index.js)
// if you have one, but doing it in the root layout is also common.
let playerInitialized = false;
async function setupPlayer() {
  if (playerInitialized) {
    console.log("Player already initialized.");
    // Optional: Check if tracks need updating or re-adding
    // const currentTracks = await TrackPlayer.getQueue();
    // if (!currentTracks || currentTracks.length === 0 || currentTracks[0].id !== track.id) {
    //   await TrackPlayer.reset(); // Reset if queue is wrong
    //   await TrackPlayer.add(track);
    //   console.log("Tracks re-added.");
    // }
    return;
  }
  try {
    console.log("Setting up Track Player...");
    // You might want 'await TrackPlayer.setupPlayer({ waitForBuffer: true })' for streams
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
      // --- Capabilities define what controls appear (lock screen, notification) ---
      capabilities: [
        Capability.Play,
        // Capability.Pause,
        Capability.Stop,
      ],
      compactCapabilities: [Capability.Play, Capability.Stop], // For compact view like Android Auto

      // --- How playback behaves when app is closed ---
      // This is crucial for background audio persistence
      android: {
        // Continue playback when app is killed
        appKilledPlaybackBehavior: AppKilledPlaybackBehavior.ContinuePlayback,
      },
      // iOS automatically continues playback in the background if configured correctly
      // (Ensure 'Audio, AirPlay, and Picture in Picture' is enabled in Background Modes in Xcode)
    });

    await TrackPlayer.add(track);
    // Don't set repeat mode for a live stream, it doesn't make sense
    // await TrackPlayer.setRepeatMode(RepeatMode.Queue);
    playerInitialized = true;
    console.log("Track Player setup complete and track added.");
  } catch (e) {
    console.error("Error setting up Track Player:", e);
  }
}

// --- Notification Permissions (Keep if needed for other notifications) ---
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false, // Usually false for playback notifications
    shouldSetBadge: false,
  }),
});

export default function Layout() {
  // --- State ---
  // Get the current playback state
  const playbackState = usePlaybackState() as PlaybackState; // Cast for better type checking
  const isPlaying = React.useMemo(
    () =>
      playbackState.state === State.Playing ||
      playbackState.state === State.Buffering,
    [playbackState.state]
  );

  // --- Effects ---
  // Setup player on mount
  React.useEffect(() => {
    setupPlayer(); // Initialize player and add track
    Notifications.requestPermissionsAsync(); // Request notification permissions

    // Optional: Handle AppState changes if needed for specific logic,
    // though TrackPlayer often handles background transitions well with capabilities.
    // const subscription = AppState.addEventListener('change', handleAppStateChange);
    // return () => {
    //   subscription.remove();
    // };
  }, []); // Runs once on mount

  // --- Optional: Listen for Track Player Events (e.g., errors) ---
  useTrackPlayerEvents([Event.PlaybackError, Event.PlaybackState], (event) => {
    if (event.type === Event.PlaybackError) {
      console.warn("An error occurred during playback:", event);
      // You could show an error message to the user here
    }
    if (event.type === Event.PlaybackState) {
      console.log("Playback State:", event.state);
      // You could add specific logic here based on state changes if needed
    }
  });

  // --- Control Functions ---
  const togglePlayback = React.useCallback(async () => {
    console.log("Toggle Playback. Current state:", playbackState.state);
    if (isPlaying) {
      await TrackPlayer.pause();
    } else {
      // If stopped or ready, start playing. If paused, resume.
      await TrackPlayer.play();
    }
  }, [isPlaying, playbackState.state]); // Depend on isPlaying and the raw state

  return (
    <Tabs>
      <StatusBar backgroundColor="#342f56" />
      <TabSlot />
      <TabList>
        <TabTrigger name="radio" href="/" style={styles.tabTrigger} asChild>
          <CustomTabButton icon="radio">Radio</CustomTabButton>
        </TabTrigger>
        <PlayButton onPress={togglePlayback} isPlaying={isPlaying} />

        <TabTrigger name="echo" href="/echo" style={styles.tabTrigger} asChild>
          <CustomTabButton icon="newspaper">Echo</CustomTabButton>
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabList: {
    display: "flex",
    position: "absolute",
    bottom: 32,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "red",
    padding: 8,
    width: "100%",
  },
  tabTrigger: {
    flex: 1,
    borderWidth: 1,
    borderColor: "blue",
    alignItems: "center",
    justifyContent: "center",
  },
  main: {
    backgroundColor: "#342f56",
  },
});
