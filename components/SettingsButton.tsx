import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SettingsButtonProps {
  onPress: () => void;
}

export function SettingsButton(props: SettingsButtonProps) {
  let icon = <Ionicons name="options" size={24} color="#342f56" />;
  return (
    <TouchableOpacity style={styles.mainButton} onPress={props.onPress}>
      <View>{icon}</View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  mainButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    position: "absolute",
    bottom: 50,
    right: "5%",
    borderColor: "#000",
    borderWidth: 1,
  },
});
