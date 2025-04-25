// /Users/scott/Herd/Dev/inLineStudio/apps/BurtonRadioEcho/lib/notificationManager.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Use the same key as in settings.tsx
const ASYNC_STORAGE_KEY = "notificationPreferences";

// Define the type for preferences, matching settings.tsx
type NotificationPreferences = {
  [showName: string]: boolean;
};

/**
 * Loads notification preferences from AsyncStorage.
 * Returns an empty object if no preferences are found or an error occurs.
 */
export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  try {
    const storedPreferences = await AsyncStorage.getItem(ASYNC_STORAGE_KEY);
    if (storedPreferences !== null) {
      return JSON.parse(storedPreferences);
    }
  } catch (e) {
    console.error("Failed to load notification preferences:", e);
  }
  // Return empty object if nothing stored or error
  return {};
}

/**
 * Checks if notifications are enabled for a specific show based on stored preferences.
 * @param showName The name of the show to check.
 * @returns Promise<boolean> True if notifications are enabled for the show, false otherwise.
 */
export async function isNotificationEnabledForShow(
  showName: string
): Promise<boolean> {
  const preferences = await getNotificationPreferences();
  return preferences[showName] ?? false; // Default to false if showName not found
}

/**
 * Checks notification permissions and requests them if necessary.
 * @returns Promise<boolean> True if permission is granted, false otherwise.
 */
export async function checkAndRequestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === "android") {
    // Android doesn't require explicit permission request beforehand for basic notifications,
    // but channels might need setup. Let's assume basic permission is implicitly granted
    // unless specific channel management is needed.
    // For Android 13+, POST_NOTIFICATIONS permission is needed. Expo handles this automatically
    // if included in app.json permissions and Notifications.requestPermissionsAsync is called.
    // Let's request just in case for newer Android versions.
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    return finalStatus === "granted";
  } else if (Platform.OS === "ios") {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      // Request permissions for alert, badge, and sound
      const { status } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
        },
      });
      finalStatus = status;
    }
    return finalStatus === "granted";
  }
  return false; // Default for other platforms
}

/**
 * Example function: Triggers a local notification for a show *if* enabled in preferences.
 * You would call this function when you detect a specific show is starting.
 *
 * @param showName The name of the show starting.
 * @param notificationContent The content for the notification (title, body, data).
 */
export async function triggerNotificationIfEnabled(
  showName: string,
  notificationContent: Notifications.NotificationContentInput
): Promise<void> {
  console.log(`Checking if notification should be sent for: ${showName}`);

  // 1. Check Permissions
  const hasPermission = await checkAndRequestNotificationPermissions();
  if (!hasPermission) {
    console.log("Notification permissions not granted.");
    // Optionally inform the user they need to enable permissions in settings
    return;
  }

  // 2. Check User Preference
  const isEnabled = await isNotificationEnabledForShow(showName);
  if (!isEnabled) {
    console.log(`Notifications disabled for show: ${showName}`);
    return;
  }

  // 3. Schedule Notification
  try {
    console.log(`Scheduling notification for: ${showName}`);
    await Notifications.scheduleNotificationAsync({
      content: notificationContent,
      trigger: null, // Send immediately (or set a specific time/interval)
    });
    console.log(`Notification scheduled successfully for: ${showName}`);
  } catch (error) {
    console.error(`Failed to schedule notification for ${showName}:`, error);
  }
}

// --- Example Usage (Illustrative - Integrate this where needed) ---
/*
async function onShowStarts(currentShowName: string) {
    // Example notification content
    const content: Notifications.NotificationContentInput = {
        title: `${currentShowName} is starting!`,
        body: 'Tune in now on BurtonRadio.',
        data: { show: currentShowName }, // Optional data payload
        sound: 'default', // Or a custom sound file
    };

    await triggerNotificationIfEnabled(currentShowName, content);
}

// Somewhere in your app logic where you detect the show starting:
// onShowStarts('Breakfast');
*/
