// forergroundNotificationTask.ts
import { Logger } from "../services";
import { notificationTask, BACKGROUND_FETCH_TASK } from "./notificationTask";

let interval: NodeJS.Timeout | undefined;
const CHECK_INTERVAL = 1000 * 60 * 5; // Check every 5 minutes

export async function startForegroundNotificationTask() {
  Logger.debug("Creating Foreground notification task.");
  interval = setInterval(() => {
    Logger.debug("Running foreground notification task.");
    void notificationTask();
  }, CHECK_INTERVAL); // Run every 5 minutes
}

export async function stopForegroundNotificationTask() {
  if (interval) {
    Logger.debug("Clearing foreground notification task.");
    clearInterval(interval);
    interval = undefined;
  }
}
