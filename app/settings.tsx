// /Users/scott/Herd/Dev/inLineStudio/apps/BurtonRadioEcho/app/settings.tsx
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Switch,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Import Notifications if you need to interact with permissions etc. here
// import * as Notifications from 'expo-notifications';
import { UNIQUE_SHOW_NAMES } from "../lib/scheduleData";

// --- Configuration ---
const ASYNC_STORAGE_KEY = "notificationPreferences";

// Manually derived list of unique show names from the schedule URL
// Ideally, fetch this from an API you control for easier updates.
const SHOW_NAMES = UNIQUE_SHOW_NAMES;

// Define the type for our preferences state
type NotificationPreferences = {
  [showName: string]: boolean;
};

export default function SettingsScreen() {
  const [preferences, setPreferences] = useState<NotificationPreferences>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Load Preferences ---
  useEffect(() => {
    const loadPreferences = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const storedPreferences = await AsyncStorage.getItem(ASYNC_STORAGE_KEY);
        if (storedPreferences !== null) {
          setPreferences(JSON.parse(storedPreferences));
        } else {
          // Initialize with all off if nothing is stored
          const initialPrefs: NotificationPreferences = {};
          SHOW_NAMES.forEach((name) => {
            initialPrefs[name] = false;
          });
          setPreferences(initialPrefs);
        }
      } catch (e) {
        console.error("Failed to load notification preferences:", e);
        setError("Failed to load settings. Please try again.");
        // Initialize with default state on error
        const initialPrefs: NotificationPreferences = {};
        SHOW_NAMES.forEach((name) => {
          initialPrefs[name] = false;
        });
        setPreferences(initialPrefs);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, []); // Empty dependency array means run once on mount

  // --- Save Preferences ---
  const savePreferences = useCallback(
    async (newPrefs: NotificationPreferences) => {
      try {
        await AsyncStorage.setItem(ASYNC_STORAGE_KEY, JSON.stringify(newPrefs));
      } catch (e) {
        console.error("Failed to save notification preferences:", e);
        // Optionally show an error to the user
      }
    },
    []
  );

  // --- Handle Toggle ---
  const handleToggle = (showName: string, value: boolean) => {
    const newPreferences = {
      ...preferences,
      [showName]: value,
    };
    setPreferences(newPreferences);
    savePreferences(newPreferences); // Save whenever a toggle changes
  };

  // --- Render Logic ---
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Loading Settings...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Notifications Settings</Text>
      <Text style={styles.subHeader}>
        Select which shows you'd like to receive notifications for.
      </Text>

      {SHOW_NAMES.map((showName) => (
        <View key={showName} style={styles.row}>
          <Text style={styles.label}>{showName}</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={preferences[showName] ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={(value) => handleToggle(showName, value)}
            value={preferences[showName] ?? false} // Default to false if undefined
          />
        </View>
      ))}
      {/* Add a little space at the bottom */}
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#342f56",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#fff",
    marginTop: 50,
  },
  subHeader: {
    marginTop: 25,
    fontSize: 16,
    color: "#fff",
    marginBottom: 25,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  label: {
    fontSize: 16,
    flex: 1, // Allow label to take up space
    marginRight: 10, // Add space between label and switch
    color: "#fff",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
});
