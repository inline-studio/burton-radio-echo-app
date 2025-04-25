// /Users/scott/Herd/Dev/inLineStudio/apps/BurtonRadioEcho/lib/scheduleData.ts

// Define a type for a single schedule entry
export interface ScheduleEntry {
  day:
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";
  startTime: string; // Use HH:MM (24-hour format) for clarity
  endTime: string; // Use HH:MM (24-hour format)
  showName: string;
}

// Define the schedule data
// Transcribed from https://www.burtonradio.co.uk/schedule (as of time of generation)
// IMPORTANT: This needs manual updating if the official schedule changes.
// Consider fetching from an API if possible in the future.
export const RADIO_SCHEDULE: ScheduleEntry[] = [
  // Monday - Thursday
  {
    day: "Monday",
    startTime: "00:00",
    endTime: "07:00",
    showName: "Non Stop Music",
  },
  {
    day: "Monday",
    startTime: "07:00",
    endTime: "10:00",
    showName: "Breakfast",
  },
  {
    day: "Monday",
    startTime: "10:00",
    endTime: "13:00",
    showName: "Mid Morning",
  },
  {
    day: "Monday",
    startTime: "13:00",
    endTime: "16:00",
    showName: "Afternoon Show",
  },
  {
    day: "Monday",
    startTime: "16:00",
    endTime: "19:00",
    showName: "Drive Time",
  },
  {
    day: "Monday",
    startTime: "19:00",
    endTime: "22:00",
    showName: "Evening Show",
  },
  {
    day: "Monday",
    startTime: "22:00",
    endTime: "24:00",
    showName: "Non Stop Music",
  }, // Ends at midnight

  {
    day: "Tuesday",
    startTime: "00:00",
    endTime: "07:00",
    showName: "Non Stop Music",
  },
  {
    day: "Tuesday",
    startTime: "07:00",
    endTime: "10:00",
    showName: "Breakfast",
  },
  {
    day: "Tuesday",
    startTime: "10:00",
    endTime: "13:00",
    showName: "Mid Morning",
  },
  {
    day: "Tuesday",
    startTime: "13:00",
    endTime: "16:00",
    showName: "Afternoon Show",
  },
  {
    day: "Tuesday",
    startTime: "16:00",
    endTime: "19:00",
    showName: "Drive Time",
  },
  {
    day: "Tuesday",
    startTime: "19:00",
    endTime: "22:00",
    showName: "Evening Show",
  },
  {
    day: "Tuesday",
    startTime: "22:00",
    endTime: "24:00",
    showName: "Non Stop Music",
  },

  {
    day: "Wednesday",
    startTime: "00:00",
    endTime: "07:00",
    showName: "Non Stop Music",
  },
  {
    day: "Wednesday",
    startTime: "07:00",
    endTime: "10:00",
    showName: "Breakfast",
  },
  {
    day: "Wednesday",
    startTime: "10:00",
    endTime: "13:00",
    showName: "Mid Morning",
  },
  {
    day: "Wednesday",
    startTime: "13:00",
    endTime: "16:00",
    showName: "Afternoon Show",
  },
  {
    day: "Wednesday",
    startTime: "16:00",
    endTime: "19:00",
    showName: "Drive Time",
  },
  {
    day: "Wednesday",
    startTime: "19:00",
    endTime: "22:00",
    showName: "Evening Show",
  },
  {
    day: "Wednesday",
    startTime: "22:00",
    endTime: "24:00",
    showName: "Non Stop Music",
  },

  {
    day: "Thursday",
    startTime: "00:00",
    endTime: "07:00",
    showName: "Non Stop Music",
  },
  {
    day: "Thursday",
    startTime: "07:00",
    endTime: "10:00",
    showName: "Breakfast",
  },
  {
    day: "Thursday",
    startTime: "10:00",
    endTime: "13:00",
    showName: "Mid Morning",
  },
  {
    day: "Thursday",
    startTime: "13:00",
    endTime: "16:00",
    showName: "Afternoon Show",
  },
  {
    day: "Thursday",
    startTime: "16:00",
    endTime: "19:00",
    showName: "Drive Time",
  },
  {
    day: "Thursday",
    startTime: "19:00",
    endTime: "22:00",
    showName: "Evening Show",
  },
  {
    day: "Thursday",
    startTime: "22:00",
    endTime: "24:00",
    showName: "Non Stop Music",
  },

  // Friday
  {
    day: "Friday",
    startTime: "00:00",
    endTime: "07:00",
    showName: "Non Stop Music",
  },
  {
    day: "Friday",
    startTime: "07:00",
    endTime: "10:00",
    showName: "Breakfast",
  },
  {
    day: "Friday",
    startTime: "10:00",
    endTime: "13:00",
    showName: "Mid Morning",
  },
  {
    day: "Friday",
    startTime: "13:00",
    endTime: "16:00",
    showName: "Afternoon Show",
  },
  {
    day: "Friday",
    startTime: "16:00",
    endTime: "19:00",
    showName: "Drive Time",
  },
  {
    day: "Friday",
    startTime: "19:00",
    endTime: "22:00",
    showName: "Weekend Warmup",
  },
  {
    day: "Friday",
    startTime: "22:00",
    endTime: "24:00",
    showName: "Non Stop Music",
  },

  // Saturday
  {
    day: "Saturday",
    startTime: "00:00",
    endTime: "07:00",
    showName: "Non Stop Music",
  },
  {
    day: "Saturday",
    startTime: "07:00",
    endTime: "10:00",
    showName: "Saturday Breakfast",
  },
  {
    day: "Saturday",
    startTime: "10:00",
    endTime: "13:00",
    showName: "Weekend Mid Morning",
  },
  {
    day: "Saturday",
    startTime: "13:00",
    endTime: "14:00",
    showName: "Saturday Afternoon",
  }, // Note: 1 hour only
  {
    day: "Saturday",
    startTime: "14:00",
    endTime: "18:00",
    showName: "Saturday Sport",
  },
  {
    day: "Saturday",
    startTime: "18:00",
    endTime: "22:00",
    showName: "Saturday Night Party",
  },
  {
    day: "Saturday",
    startTime: "22:00",
    endTime: "24:00",
    showName: "Non Stop Music",
  },

  // Sunday
  {
    day: "Sunday",
    startTime: "00:00",
    endTime: "07:00",
    showName: "Non Stop Music",
  },
  {
    day: "Sunday",
    startTime: "07:00",
    endTime: "10:00",
    showName: "Sunday Breakfast",
  },
  {
    day: "Sunday",
    startTime: "10:00",
    endTime: "13:00",
    showName: "Weekend Mid Morning",
  },
  {
    day: "Sunday",
    startTime: "13:00",
    endTime: "16:00",
    showName: "Sunday Afternoon",
  },
  {
    day: "Sunday",
    startTime: "16:00",
    endTime: "19:00",
    showName: "Sunday Evening",
  },
  {
    day: "Sunday",
    startTime: "19:00",
    endTime: "24:00",
    showName: "Non Stop Music",
  },
];

// Helper function to get unique show names (useful for settings screen)
export function getUniqueShowNames(schedule: ScheduleEntry[]): string[] {
  const showNames = schedule
    .map((entry) => entry.showName)
    // Filter out generic names if desired, e.g., 'Non Stop Music'
    .filter((name) => name !== "Non Stop Music");
  return [...new Set(showNames)].sort(); // Return unique, sorted list
}

// Example: Get the unique names from our schedule
export const UNIQUE_SHOW_NAMES = getUniqueShowNames(RADIO_SCHEDULE);

// Helper function to find the current show based on Date object
export function getCurrentShow(now: Date = new Date()): ScheduleEntry | null {
  const currentDay = now.toLocaleDateString("en-US", {
    weekday: "long",
  }) as ScheduleEntry["day"];
  // Format current time as HH:MM
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}`;

  for (const entry of RADIO_SCHEDULE) {
    if (entry.day === currentDay) {
      // Simple string comparison works for HH:MM format
      if (currentTime >= entry.startTime && currentTime < entry.endTime) {
        return entry;
      }
      // Handle edge case for shows ending at midnight (24:00)
      if (entry.endTime === "24:00" && currentTime >= entry.startTime) {
        return entry;
      }
    }
  }

  // Could potentially return a default like 'Non Stop Music' if no match found
  // based on how the schedule is structured, but null indicates no specific show matched.
  return null;
}
