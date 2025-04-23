import * as React from "react";
import { StyleSheet } from "react-native";
import { Tabs, TabList, TabTrigger, TabSlot } from "expo-router/ui";
import { CustomTabButton } from "@/components/CustomTabButton";
import { PlayButton } from "@/components/PlayButton";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import { StatusBar } from "expo-status-bar";
import * as Notifications from "expo-notifications";

export default function Layout() {
  const [sound, setSound] = React.useState(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const isMounted = React.useRef(true); // Ref to track component mount status
  const stream = "https://s9.citrus3.com:8370/stream";

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  // --- Configuration Effect ---
  React.useEffect(() => {
    isMounted.current = true; // Component did mount
    Notifications.requestPermissionsAsync();
    console.log("Configuring Audio Mode...");
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: InterruptionModeIOS.DuckOthers, // or DoNotMix
      playsInSilentModeIOS: true, // Play even if silent switch is on (iOS)
      staysActiveInBackground: true, // *** Crucial for background playback ***
      interruptionModeAndroid: InterruptionModeAndroid.DuckOthers, // or DoNotMix
      shouldDuckAndroid: true, // Lower volume for notifications etc.
      playThroughEarpieceAndroid: false, // Use main speaker
    })
      .then(() => console.log("Audio Mode configured successfully."))
      .catch((err) => {
        console.error("Failed to set audio mode:", err);
        setError("Failed to configure audio playback.");
      });

    // --- Cleanup Function ---
    return () => {
      isMounted.current = false; // Component will unmount
      console.log("Unmounting component, unloading sound...");
      // Unload the sound when the component unmounts
      if (sound) {
        sound
          .unloadAsync()
          .then(() => console.log("Sound unloaded on unmount."))
          .catch((err) =>
            console.error("Error unloading sound on unmount:", err)
          );
      }
      // Optional: Reset audio mode if desired when app closes fully,
      // but usually not necessary for background playback persistence.
      // Audio.setAudioModeAsync({ staysActiveInBackground: false });
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  async function loadAndPlaySound() {
    console.log("loadAndPlaySound");
    if (isPlaying) return; // Already playing
    if (isLoading) return; // Already loading

    console.log("Loading Sound...");
    setIsLoading(true);
    setError(null); // Clear previous errors

    try {
      console.log("Setting Notification");
      Notifications.scheduleNotificationAsync({
        content: {
          title: "Playing Live Burton Radio",
          body: "Burton Radio is playing in the background.",
          sticky: true, // Make it persistent? Check API docs
          // You might add playback controls here using notification actions
        },
        trigger: null, // Show immediately
      });
      console.log("Notification set");
      // If a sound object exists, unload it first before loading a new one
      if (sound) {
        console.log("Unloading previous sound instance...");
        await sound.unloadAsync();
        setSound(null); // Clear the state
        setIsPlaying(false); // Ensure playing state is reset
      }

      console.log("Creating new sound instance...");
      const { sound: newSound, status } = await Audio.Sound.createAsync(
        { uri: stream }, // Use {uri: ...} for network URLs
        // AUDIO_ASSET,        // Use require for local assets
        { shouldPlay: true } // Start playing immediately after loading
        // You can add onPlaybackStatusUpdate here if needed for more granular status
        // onPlaybackStatusUpdate: (status) => { /* handle status updates */ }
      );

      if (isMounted.current) {
        // Check if component is still mounted
        console.log("Sound loaded and playing.");
        setSound(newSound);
        setIsPlaying(true);
        setIsLoading(false);

        // Optional: Add a listener for when playback finishes naturally
        newSound.setOnPlaybackStatusUpdate((playbackStatus) => {
          // console.log("Playback Status:", JSON.stringify(playbackStatus)); // Log everything
          if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
            console.log("Playback finished!");
            if (isMounted.current) {
              setIsPlaying(false);
              // Optionally unload or reset here if you don't want to replay
              // newSound.unloadAsync();
              // setSound(null);
            }
          }
          // Handle errors during playback
          if (playbackStatus.error) {
            console.error("Playback Error:", playbackStatus.error);
            if (isMounted.current) {
              setError(`Playback Error: ${playbackStatus.error}`);
              setIsPlaying(false);
              setIsLoading(false);
            }
          }
        });
      } else {
        // Component unmounted before loading finished, unload sound
        console.log("Component unmounted during load, unloading sound.");
        newSound.unloadAsync();
      }
    } catch (error) {
      console.error("Error loading or playing sound:", error);
      if (isMounted.current) {
        // Check if component is still mounted
        setError(`Failed to load/play sound: ${error.message}`);
        setIsLoading(false);
        setIsPlaying(false); // Ensure state is correct on error
        setSound(null); // Clear sound object on error
      }
    }
  }

  async function stopAndUnloadSound() {
    console.log("stopAndUnloadSound");
    if (!sound) return;

    console.log("Stopping and Unloading Sound");
    try {
      await sound.unloadAsync(); // Stops playback and releases resources
      await Notifications.dismissAllNotificationsAsync();
      if (isMounted.current) {
        setSound(null);
        setIsPlaying(false);
        setIsLoading(false); // Ensure loading is reset
        setError(null); // Clear any errors
      }
    } catch (error) {
      console.error("Error stopping/unloading sound:", error);
      if (isMounted.current) {
        setError("Failed to stop sound.");
      }
    }
  }

  React.useEffect(() => {
    if (isPlaying) {
      loadAndPlaySound();
    } else {
      stopAndUnloadSound();
    }
  }, [isPlaying]);

  return (
    <Tabs>
      <StatusBar backgroundColor="#342f56" />
      <TabSlot />
      <TabList>
        <TabTrigger name="radio" href="/" style={styles.tabTrigger} asChild>
          <CustomTabButton icon="radio">Radio</CustomTabButton>
          {/* <Text>Radio</Text> */}
        </TabTrigger>
        {!isPlaying && !sound && (
          <PlayButton onPress={loadAndPlaySound} isPlaying={isPlaying} />
        )}
        {isPlaying && (
          <PlayButton onPress={stopAndUnloadSound} isPlaying={isPlaying} />
        )}

        <TabTrigger name="echo" href="/echo" style={styles.tabTrigger} asChild>
          <CustomTabButton icon="newspaper">Echo</CustomTabButton>
          {/* <Text>Echo</Text> */}
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
