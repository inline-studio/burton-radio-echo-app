import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface PlayButtonProps {
	onPress: () => void;
    isPlaying: boolean;
}

export function PlayButton(props: PlayButtonProps) {
    let icon = <Ionicons name="play" size={24} color="#342f56" />
    if (props.isPlaying) {
        icon = <Ionicons name="stop" size={24} color="#342f56" />
    }
	return (
		<TouchableOpacity style={styles.mainButton} onPress={props.onPress}>
			<View>
				{ icon }
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	mainButton: {
		width: 100,
		height: 100,
		borderRadius: 50,
		backgroundColor: "#fff",
		justifyContent: "center",
		alignItems: "center",
		zIndex: 10,
		position: "absolute",
        bottom:0,
        left: "40%",
        borderColor: "#000",
        borderWidth: 1,
	}
});