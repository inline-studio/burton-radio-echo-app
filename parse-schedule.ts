import { readFile } from 'node:fs/promises';

const days = [
    "Monday"
    , "Tuesday"
    , "Wednesday"
    , "Thursday"
    , "Friday"
    , "Saturday"
    , "Sunday"
];

type Day =
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";

interface ScheduleTime {
    readonly startTime: string; // Use HH:MM (24-hour format) for clarity
    readonly endTime: string; // Use HH:MM (24-hour format)
}

type ScheduleDay = Partial<Record<Day, ScheduleTime[]>>;

// Define a type for a single schedule entry
type ShowEntry = {
    [name: string]: ScheduleDay;
};

const timePattern = /^(?:LIVE)?\s*?([0-9:]*(?:am|pm)?)\-([0-9:]*(?:am|pm)?)/;
const stupidPattern = /^(?:LIVE)/;

function startCase(str: string) {
    return str.replace(
        /\w\S*/g,
        text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
}

function rotateTime(str: string, rotate = false) {
    // 12pm stays as 12, 12am becomes 0
    if (+str === 12 && rotate) return '12';
    if (+str === 12 && !rotate) return '0';
    return (
        (
            +str
            + (rotate ? 12 : 0)
        ) % 24
    ).toString();
}

function timeClean(str: string, rotate = false) {
    if (str.includes(':')) {
        const [a, b] = str.split(':');
        return rotateTime(a, rotate).padStart(2, '0') + ':' + b.padStart(2, '0');
    } else {
        return rotateTime(str, rotate).padStart(2, '0') + ':00';
    }
}

const parse = async (file: string) => {
    const lines = (await readFile(file))
        .toString()
        .split('\n');

    const data: ShowEntry = {};

    let day: Day | null = null;
    let title: string | null = null;
    for (const line of lines) {
        if (line.trim() === '') {
            console.log('line skip', line);
            continue;
        }
        if (days.includes(startCase(line))) {
            console.log('line day', line);
            day = startCase(line) as Day;

            title = null;
            continue;
        }

        if (day) {
            if (!title) {
                console.log('line title', line);
                title = line;
                continue;
            }

            if (timePattern.test(line)) {
                const matches = timePattern.exec(line);
                if (!matches) {
                    console.error('time matched but gone??', line);
                    continue;
                }
                let [_unused_, start, end] = matches;
                const datum = data[title] ?? {};

                console.log('line time', line);

                let startMeridiem: 'am' | 'pm' | null = null;
                if (start.endsWith('pm')) {
                    startMeridiem = 'pm';
                    start = start.replace(/pm$/, '');
                } else if (start.endsWith('am')) {
                    startMeridiem = 'am';
                    start = start.replace(/am$/, '');
                }

                let rotateStart = startMeridiem === 'pm';
                if (end.endsWith('pm')) {
                    rotateStart = startMeridiem === 'pm'
                        || (startMeridiem === null && end !== '12pm');
                    end = end.replace(/pm$/, '');
                    end = timeClean(end, true);
                } else if (end.endsWith('am')) {
                    end = end.replace(/am$/, '');
                    end = timeClean(end, false);
                }

                start = timeClean(start, rotateStart);

                datum[day] = [{
                    startTime: start,
                    endTime: end,
                }];

                data[title] = datum;
                title = null;
                continue;
            }

            if (stupidPattern.test(line)) {
                console.log('line stupid', line);
                title = null; // stupid ones
                continue;
            }

            console.log('line fail', line);
        }
    }

    return JSON.stringify(data);
};

void parse('data.txt').then((json) => {
    console.log(json);
});
