import * as React from "react";
import { StyleSheet } from "react-native";
import { Tabs, TabList, TabTrigger, TabSlot } from 'expo-router/ui';
import { CustomTabButton } from "@/components/CustomTabButton";
import { PlayButton } from "@/components/PlayButton";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { StatusBar } from 'expo-status-bar';

export default function Layout() {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [sound, setSound] = React.useState();

	function togglePlayingHandler() {
		setIsPlaying(!isPlaying);
	}

  async function playStream() {
    console.log('Loading Sound');
    await Audio.setAudioModeAsync({ 
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      interruptionModeIOS: InterruptionModeIOS.DuckOthers,
      interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
    const { sound } = await Audio.Sound.createAsync(
      { uri: 'https://s9.citrus3.com:8370/stream'},
      { shouldPlay: true },
      null,
      false
    );
    setSound(sound);

    console.log('Playing Sound');
    await sound.playAsync();
  }

  async function stopStream() {
    console.log('Unloading Sound');
    if (sound) {
      await sound.unloadAsync();
    }
  }

  React.useEffect(() => {
    if (isPlaying) {
      playStream();
    } else {
      stopStream();
    }
  }, [isPlaying]);

  return (
      <Tabs>
        <StatusBar backgroundColor="#342f56" />
        <TabSlot 
        />
        <TabList>
          <TabTrigger name="radio" href="/" style={styles.tabTrigger} asChild>
            <CustomTabButton icon="radio">Radio</CustomTabButton>
            {/* <Text>Radio</Text> */}
          </TabTrigger>
          <PlayButton
            onPress={togglePlayingHandler}
            isPlaying={isPlaying}
          />
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
		justifyContent: "center"
	},
  main: {
    backgroundColor: "#342f56",
  }
});