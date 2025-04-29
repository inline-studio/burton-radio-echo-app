// notificationTask.js
import { Logger } from "../services";
import * as Notifications from "expo-notifications";
import { getCurrentShow, RADIO_SCHEDULE, ScheduleEntry } from "./scheduleData";
import { triggerNotificationIfEnabled } from "./notificationManager";

const NOTIFICATION_LEAD_TIME_MINUTES = 5; // Notify 5 minutes before show starts

export const BACKGROUND_FETCH_TASK = "background-notification-check";
export const notificationTask = async () => {
  const now = new Date();
  Logger.debug(
    `[${BACKGROUND_FETCH_TASK}] Task running at: ${now.toISOString()}`
  );
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
    const diffMinutes = (showStartTime.getTime() - now.getTime()) / (1000 * 60);

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
};
