// lib/backgroundNotificationTask.ts
import { Logger } from "../services";
import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import { getCurrentShow, RADIO_SCHEDULE, ScheduleEntry } from "./scheduleData"; // Assuming scheduleData is in the same lib folder
import { triggerNotificationIfEnabled } from "./notificationManager";
import * as Notifications from "expo-notifications"; // Import if needed directly

const BACKGROUND_FETCH_TASK = "background-notification-check";
const NOTIFICATION_LEAD_TIME_MINUTES = 5; // Notify 5 minutes before show starts

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  const now = new Date();
  Logger.debug(
    `[${BACKGROUND_FETCH_TASK}] Task running at: ${now.toISOString()}`
  );

  try {
    // Find shows starting soon
    const upcomingShows = RADIO_SCHEDULE.filter((entry) => {
      const showStartTime = new Date();
      const [hours, minutes] = entry.startTime.split(":").map(Number);

      // Check if it's the correct day
      const currentDayIndex = now.getDay(); // Sunday = 0, Monday = 1, etc.
      const scheduleDayIndex = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ].indexOf(entry.day);
      if (currentDayIndex !== scheduleDayIndex) {
        Logger.debug("skipping day as not the same day");
        return false;
      }

      showStartTime.setHours(hours, minutes, 0, 0);

      // Calculate time difference in minutes
      const diffMinutes =
        (showStartTime.getTime() - now.getTime()) / (1000 * 60);

      // Check if the show starts within the lead time and hasn't already started
      return diffMinutes > 0 && diffMinutes <= NOTIFICATION_LEAD_TIME_MINUTES;
    });

    if (upcomingShows.length > 0) {
      Logger.debug(
        `[${BACKGROUND_FETCH_TASK}] Upcoming shows found:`,
        upcomingShows.map((s) => s.showName)
      );
      for (const show of upcomingShows) {
        // Prepare notification content
        const content: Notifications.NotificationContentInput = {
          title: `${show.showName} starting soon!`,
          body: `Tune in at ${show.startTime} on BurtonRadio.`,
          data: { show: show.showName, time: show.startTime },
          sound: "default",
          priority: Notifications.AndroidNotificationPriority.HIGH,
          vibrate: [100, 150, 100], //random pattern
          color: "#342f56", // Set the color of the notification
          interruptionLevel: "timeSensitive",
        };
        // Check preferences and trigger
        await triggerNotificationIfEnabled(show.showName, content);
      }
    } else {
      Logger.debug(
        `[${BACKGROUND_FETCH_TASK}] No relevant upcoming shows found.`
      );
    }

    // You must return a BackgroundFetchResult
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    Logger.error(`[${BACKGROUND_FETCH_TASK}] Failed:`, error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

// Helper function to register the task
export async function registerBackgroundFetchAsync() {
  Logger.debug("Registering background fetch task...");
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 15 * 60, // Run roughly every 15 minutes (iOS minimum is ~15 min)
    stopOnTerminate: false, // Keep running even if app is terminated (Android only)
    startOnBoot: true, // Start task after device boot (Android only)
  });
}

// Helper function to unregister the task
export async function unregisterBackgroundFetchAsync() {
  Logger.debug("Unregistering background fetch task...");
  return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
}
