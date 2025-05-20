import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
        height: 60, // Adjust as needed
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