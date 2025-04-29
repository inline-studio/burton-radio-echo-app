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
  // Monday
  {
    day: "Monday",
    startTime: "12:50",
    endTime: "13:00",
    showName: "Test Show",
  },
  {
    day: "Monday",
    startTime: "13:00",
    endTime: "13:15",
    showName: "Test Show",
  },
  {
    day: "Monday",
    startTime: "13:15",
    endTime: "13:30",
    showName: "Test Show",
  },
  {
    day: "Monday",
    startTime: "13:30",
    endTime: "13:45",
    showName: "Test Show",
  },
  {
    day: "Monday",
    startTime: "13:45",
    endTime: "14:00",
    showName: "Test Show",
  },
  {
    day: "Monday",
    startTime: "14:00",
    endTime: "14:15",
    showName: "Test Show",
  },
  {
    day: "Monday",
    startTime: "06:00",
    endTime: "09:00",
    showName: "THE SNOOZY BREAKFAST SHOW",
  },
  {
    day: "Monday",
    startTime: "09:00",
    endTime: "10:00",
    showName: "MOWTOWN MOMENTS",
  },
  {
    day: "Monday",
    startTime: "10:00",
    endTime: "12:00",
    showName: "PAUL BAKER’S SOUNDSCAPES",
  },
  {
    day: "Monday",
    startTime: "12:00",
    endTime: "13:00",
    showName: "SWADStyle Show",
  },
  {
    day: "Monday",
    startTime: "13:00",
    endTime: "14:00",
    showName: "The Business Hour",
  },
  {
    day: "Monday",
    startTime: "17:00",
    endTime: "18:00",
    showName: "GAZ ROCKS",
  },
  {
    day: "Monday",
    startTime: "18:00",
    endTime: "19:00",
    showName: "LOCAL SPORTS BREW",
  },
  {
    day: "Monday",
    startTime: "19:00",
    endTime: "19:30",
    showName: "ROVERS RETURN",
  },
  {
    day: "Monday",
    startTime: "20:00",
    endTime: "21:00",
    showName: "CHALK TALK INTERNATIONAL",
  },
  // Tuesday
  {
    day: "Tuesday",
    startTime: "06:00",
    endTime: "09:00",
    showName: "THE SNOOZY BREAKFAST SHOW",
  },
  {
    day: "Tuesday",
    startTime: "09:00",
    endTime: "10:00",
    showName: "KIRKERS RADIO SHOW",
  },
  {
    day: "Tuesday",
    startTime: "10:00",
    endTime: "12:00",
    showName: "MORNING BREW",
  },
  {
    day: "Tuesday",
    startTime: "12:00",
    endTime: "14:00",
    showName: "THE INDEPENDENT ARTIST CHART SHOW",
  },
  {
    day: "Tuesday",
    startTime: "17:00",
    endTime: "18:00",
    showName: "LOCAL QUEERIES",
  },
  {
    day: "Tuesday",
    startTime: "19:00",
    endTime: "20:00",
    showName: "THE POLITICS SHOW",
  },
  {
    day: "Tuesday",
    startTime: "20:30",
    endTime: "22:30",
    showName: "NOBBS & MILLIGAN’S CLASSICAL MUSIC ADVENTURES",
  },

  // Wednesday
  {
    day: "Wednesday",
    startTime: "06:00",
    endTime: "09:00",
    showName: "THE SNOOZY BREAKFAST SHOW",
  },
  {
    day: "Wednesday",
    startTime: "10:00",
    endTime: "12:00",
    showName: "THE IAN ST PETERS SHOW",
  },
  {
    day: "Wednesday",
    startTime: "17:00",
    endTime: "18:00",
    showName: "HIDDEN WORLDS",
  },
  {
    day: "Wednesday",
    startTime: "18:00",
    endTime: "19:00",
    showName: "THE SHOW SHOW",
  },
  {
    day: "Wednesday",
    startTime: "20:00",
    endTime: "22:00",
    showName: "WHEELS OF LIFE",
  },
  // Thursday
  {
    day: "Thursday",
    startTime: "06:00",
    endTime: "09:00",
    showName: "THE SNOOZY BREAKFAST SHOW",
  },
  {
    day: "Thursday",
    startTime: "14:00",
    endTime: "15:00",
    showName: "SOUNDTRACK OF YOUR LIFE",
  },
  {
    day: "Thursday",
    startTime: "18:00",
    endTime: "19:00",
    showName: "LIVE WITH JACK",
  },
  {
    day: "Thursday",
    startTime: "21:00",
    endTime: "22:00",
    showName: "SAFETY PINS & SPITTING",
  },

  // Friday
  {
    day: "Friday",
    startTime: "06:00",
    endTime: "09:00",
    showName: "THE SNOOZY BREAKFAST SHOW",
  },
  {
    day: "Friday",
    startTime: "15:00",
    endTime: "17:00",
    showName: "THAT FRIDAY FEELING",
  },
  {
    day: "Friday",
    startTime: "18:00",
    endTime: "19:00",
    showName: "CHALK TALK",
  },

  // Saturday
  {
    day: "Saturday",
    startTime: "09:00",
    endTime: "10:00",
    showName: "BREWERS BABBLE",
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
