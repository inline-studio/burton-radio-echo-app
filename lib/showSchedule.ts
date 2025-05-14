// /Users/scott/Herd/Dev/inLineStudio/apps/BurtonRadioEcho/lib/scheduleData.ts

const events = {
  "THE SNOOZY BREAKFAST SHOW": {
    Monday: [{ startTime: "06:00", endTime: "09:00" }],
    Tuesday: [{ startTime: "06:00", endTime: "09:00" }],
    Wednesday: [{ startTime: "06:00", endTime: "09:00" }],
    Thursday: [{ startTime: "06:00", endTime: "09:00" }],
    Friday: [{ startTime: "06:00", endTime: "09:00" }],
  },
  "MOWTOWN MOMENTS": {
    Monday: [{ startTime: "09:00", endTime: "10:00" }],
  },
  "PAUL BAKER’S SOUNDSCAPES": {
    Monday: [{ startTime: "10:00", endTime: "12:00" }],
  },
  "SWADStyle Show": {
    Monday: [{ startTime: "12:00", endTime: "13:00" }],
  },
  "The Business Hour": {
    Monday: [{ startTime: "13:00", endTime: "14:00" }],
  },
  "GAZ ROCKS": {
    Monday: [{ startTime: "17:00", endTime: "18:00" }],
  },
  "LOCAL SPORTS BREW": {
    Monday: [{ startTime: "18:00", endTime: "19:00" }],
  },
  "ROVERS RETURN": {
    Monday: [{ startTime: "19:00", endTime: "19:30" }],
  },
  "CHALK TALK INTERNATIONAL": {
    Monday: [{ startTime: "20:00", endTime: "21:00" }],
  },
  "KIRKERS RADIO SHOW": {
    Tuesday: [{ startTime: "09:00", endTime: "10:00" }],
  },
  "MORNING BREW": {
    Tuesday: [{ startTime: "10:00", endTime: "12:00" }],
  },
  "THE INDEPENDENT ARTIST CHART SHOW": {
    Tuesday: [{ startTime: "12:00", endTime: "14:00" }],
  },
  "LOCAL QUEERIES": {
    Tuesday: [{ startTime: "17:00", endTime: "18:00" }],
  },
  "THE POLITICS SHOW": {
    Tuesday: [{ startTime: "19:00", endTime: "20:00" }],
  },
  "NOBBS & MILLIGAN’S CLASSICAL MUSIC ADVENTURES": {
    Tuesday: [{ startTime: "20:30", endTime: "22:30" }],
  },
  "THE IAN ST PETERS SHOW": {
    Wednesday: [{ startTime: "10:00", endTime: "12:00" }],
  },
  "HIDDEN WORLDS": {
    Wednesday: [{ startTime: "17:00", endTime: "18:00" }],
  },
  "THE SHOW SHOW": {
    Wednesday: [{ startTime: "18:00", endTime: "19:00" }],
  },
  "WHEELS OF LIFE": {
    Wednesday: [{ startTime: "20:00", endTime: "22:00" }],
  },
  "SOUNDTRACK OF YOUR LIFE": {
    Thursday: [{ startTime: "14:00", endTime: "15:00" }],
  },
  "LIVE WITH JACK": {
    Thursday: [{ startTime: "18:00", endTime: "19:00" }],
  },
  "SAFETY PINS & SPITTING": {
    Thursday: [{ startTime: "21:00", endTime: "22:00" }],
  },
  "THAT FRIDAY FEELING": {
    Friday: [{ startTime: "15:00", endTime: "17:00" }],
  },
  "CHALK TALK": {
    Friday: [{ startTime: "18:00", endTime: "19:00" }],
  },
  "BREWERS BABBLE": {
    Saturday: [{ startTime: "09:00", endTime: "10:00" }],
  },
} as const;

type Day =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export interface ScheduleTime {
  readonly startTime: string; // Use HH:MM (24-hour format) for clarity
  readonly endTime: string; // Use HH:MM (24-hour format)
}

export type ScheduleDay = Partial<Record<Day, readonly ScheduleTime[]>>;

// Define a type for a single schedule entry
export type ShowEntry = {
  readonly [name in keyof typeof events]: ScheduleDay;
};

export const SHOW_SCHEDULE: ShowEntry = events;

// Helper function to get unique show names (useful for settings screen)
export function getUniqueShowNames(): string[] {
  const showNames = Object.entries(SHOW_SCHEDULE)
    .map(([name, schedules]) => name)
    // Filter out generic names if desired, e.g., 'Non Stop Music'
    .filter((name) => name !== "Non Stop Music");
  return [...new Set(showNames)].sort(); // Return unique, sorted list
}

// Example: Get the unique names from our schedule
export const UNIQUE_SHOW_NAMES = getUniqueShowNames();

export function getDayNumberFromName(dayName: Day | string): number {
  switch (dayName) {
    case "Sunday":
      return 1;
    case "Monday":
      return 2;
    case "Tuesday":
      return 3;
    case "Wednesday":
      return 4;
    case "Thursday":
      return 5;
    case "Friday":
      return 6;
    case "Saturday":
      return 7;
    default:
      // Handle cases where the input string might not match the Day type
      console.warn(`Invalid day name provided: "${dayName}"`);
      return -1; // Return -1 to indicate an invalid input
  }
}
