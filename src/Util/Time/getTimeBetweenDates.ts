import msMapper from './TimeMapping';

type TimeAmounts = {
    months: number;
    weeks: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

// If later date is not specified, the current date time will be used for laterDate, i.e. time from earlier date until now
// Note both params should be Vanilla Javascript Date objects
function getTimeBetweenDates(earlierDate: Date, laterDate = new Date()): TimeAmounts {
    let timeDifferenceMS = laterDate.getTime() - earlierDate.getTime();

    const timePayload: TimeAmounts = {
        months: 0,
        weeks: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    };

    // Months
    timePayload.months = Math.floor(timeDifferenceMS / msMapper.month);
    timeDifferenceMS = Math.floor(timeDifferenceMS % msMapper.month);

    // Weeks
    const weekInMS = msMapper.day * 7;
    timePayload.weeks = Math.floor(timeDifferenceMS / weekInMS);
    timeDifferenceMS = Math.floor(timeDifferenceMS % weekInMS);

    // Days
    timePayload.days = Math.floor(timeDifferenceMS / msMapper.day);
    timeDifferenceMS = Math.floor(timeDifferenceMS % msMapper.day);

    // Hours
    timePayload.hours = Math.floor(timeDifferenceMS / msMapper.hour);
    timeDifferenceMS = Math.floor(timeDifferenceMS % msMapper.hour);

    // Minutes
    timePayload.minutes = Math.floor(timeDifferenceMS / msMapper.minute);
    timeDifferenceMS = Math.floor(timeDifferenceMS % msMapper.minute);

    // Seconds
    timePayload.seconds = Math.floor(timeDifferenceMS / msMapper.second);

    return timePayload;
}

export default getTimeBetweenDates;