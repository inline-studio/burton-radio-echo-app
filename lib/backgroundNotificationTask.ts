// lib/backgroundNotificationTask.ts
import { Logger } from "../services";
import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import { notificationTask, BACKGROUND_FETCH_TASK } from "./notificationTask";

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    await notificationTask();
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
export async function checkBackgroundFetchStatus() {
  return await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
}
// Helper function to unregister the task
export async function unregisterBackgroundFetchAsync() {
  Logger.debug("Unregistering background fetch task...");
  return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
}
