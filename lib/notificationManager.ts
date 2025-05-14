// /Users/scott/Herd/Dev/inLineStudio/apps/BurtonRadioEcho/lib/notificationManager.ts
import { Logger } from "../services";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { getDayNumberFromName, SHOW_SCHEDULE } from "./showSchedule";

// Use the same key as in settings.tsx
const ASYNC_STORAGE_KEY = "notificationPreferences";
const NOTIFICATION_STORAGE_KEY = "notificationStorageKey";

// Define the type for preferences, matching settings.tsx
type NotificationPreferences = {
    [showName: string]: boolean;
};

type NotificationSetup = {
    [showName in keyof typeof SHOW_SCHEDULE]: string[];
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
        Logger.error("Failed to load notification preferences:", e);
    }
    // Return empty object if nothing stored or error
    return {};
}

export async function getNotificationSetup(): Promise<NotificationSetup | object> {
    try {
        const storedIdentifiers = await AsyncStorage.getItem(NOTIFICATION_STORAGE_KEY);
        if (storedIdentifiers !== null) {
            return JSON.parse(storedIdentifiers);
        }
    } catch (e) {
        Logger.error("Failed to load notification identifiers:", e);
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

export async function setupNotificationsForShows(): Promise<void> {
    const preferences = await getNotificationPreferences();
    const notificationSetup: NotificationSetup = {} as NotificationSetup;

    // clear previoius notifications
    const storedIdentifiers = await getNotificationSetup();
    if (storedIdentifiers) {
        for (const showName in storedIdentifiers) {
            const identifiers = storedIdentifiers[showName];
            if (identifiers) {
                for (const identifier of identifiers) {
                    await Notifications.cancelScheduledNotificationAsync(identifier);
                }
            }
        }
    }
    // setup new notifications
    for (const showName in SHOW_SCHEDULE) {
        // do we have permission to send this notification?
        if (preferences[showName]) {
            // we have permission, setup notifications for each day and time in the show schedule
            const schedule = SHOW_SCHEDULE[showName];
            const scheduledNotificationidentifiers: string[] = [];
            for (const day in schedule) {
                const times = schedule[day];
                const numericDay = getDayNumberFromName(day);
                for (const time of times) {
                    const [hours, minutes] = time.startTime.split(":").map(Number);
                    let trigger = null;
                    if (Platform.OS === "android") {
                        trigger = {
                            type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
                            weekday: numericDay,
                            hour: hours,
                            minute: minutes,
                            repeats: true,
                            channelId: "br-shows"
                        };

                    } else if (Platform.OS === "ios") {
                        trigger = {
                            type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
                            day: numericDay,
                            hour: hours,
                            minute: minutes,
                            repeats: true,
                            channelId: "br-shows"
                        };
                    } else {
                        continue; // Skip if not Android or iOS
                    }
                    const nextRun = await Notifications.getNextTriggerDateAsync(trigger);
                    Logger.debug(`Notification next trigger details for ${showName}: `, trigger, new Date(nextRun));

                    const identifier = await Notifications.scheduleNotificationAsync({
                        content: {
                            title: `${showName} is about to start!`,
                            body: `Tune in now on BurtonRadio.`,
                            data: { show: showName, time: time.startTime },
                            priority: Notifications.AndroidNotificationPriority.HIGH,
                            vibrate: [0, 250, 250, 250], //random pattern
                            color: "#342f56", // Set the color of the notification
                            interruptionLevel: "timeSensitive",
                            sound: "notification.wav"
                        },
                        trigger: trigger
                    });
                    scheduledNotificationidentifiers.push(identifier);
                }
            }

            // capture the scheduled identifiers for this show
            notificationSetup[showName] = scheduledNotificationidentifiers;
        }
    }

    try {
        await AsyncStorage.setItem(
            NOTIFICATION_STORAGE_KEY,
            JSON.stringify(notificationSetup)
        );
        // const details = await Notifications.getAllScheduledNotificationsAsync();
        // Logger.warn("Notification Details:", details);
        // Logger.debug("Notification setup saved successfully: ", notificationSetup);
    } catch (error) {
        Logger.error("Failed to save notification setup:", error);
    }
}

