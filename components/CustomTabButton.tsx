import * as React from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TabTriggerSlotProps } from "expo-router/ui";

interface CustomTabButtonProps extends React.PropsWithChildren, TabTriggerSlotProps {
	icon: keyof typeof Ionicons.glyphMap;
}

export const CustomTabButton = React.forwardRef<View, CustomTabButtonProps>(
	(props, ref) => {
		return (
			<Pressable
				ref={ref}
				{...props}
				style={[styles.button, props.isFocused && styles.focusedButton]}
			>
				<Ionicons
					name={props.icon}
					size={24}
					color={props.isFocused ? "#fff" : "#64748B"}
				/>
				<Text
					style={[styles.text, props.isFocused && styles.focusedText]}
				>
					{props.children}
				</Text>
			</Pressable>
		);
	}
);

CustomTabButton.displayName = "CustomTabButton";

const styles = StyleSheet.create({
	button: {
		width: "50%",
		height: 75,
		justifyContent: "center",
		alignItems: "center",
		// borderRadius: 32.5,
		// borderWidth: 1,
		borderColor: "#000",
        borderTopWidth: 1,
		backgroundColor: "#342f56",
	},
	focusedButton: {
		backgroundColor: "#413b6a"
	},
	focusedText: {
		color: "#fff",
		fontSize: 12,
		fontWeight: "500"
	},
	text: {
		color: "#64748B",
		fontSize: 12,
		marginTop: 4,
		fontWeight: "500"
	}
});