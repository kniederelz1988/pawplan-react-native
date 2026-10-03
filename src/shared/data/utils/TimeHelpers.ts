import { differenceInMonths, differenceInYears, min } from "date-fns";

import { DateValue, CalendarDate, CalendarDateTime, getLocalTimeZone, today, now as nowDate, parseDate } from "@internationalized/date";

export function dateToDateValue(date: Date): DateValue {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")

    return parseDate(`${year}-${month}-${day}`)
}
export function dateValueToDate(dateValue: DateValue): Date {
    const timezone = getLocalTimeZone()
    return dateValue.toDate(timezone)
}

export function now(): DateValue {
    const timezone = getLocalTimeZone()
    return nowDate(timezone)
}

export function getDateFromToday(dayOffset: number): CalendarDate {
    const timezone = getLocalTimeZone()
    return today(timezone).add({ days: dayOffset })
}
export function getDateTime(date: CalendarDate, hour: number, minutes: number,): CalendarDateTime {
    return new CalendarDateTime(date.year, date.month, date.day, hour, minutes)
}
export function dateToday(): Date {
    const dateValue = getDateFromToday(0)
    return dateValueToDate(dateValue)
}

export function getDifferenceInYearOrMonth(date: Date, referenceDate: Date): string {
    const years = differenceInYears(referenceDate, date)
    if (years > 0) {
        return `${years} year${years === 1 ? "" : "s"}`;
    }

    const months = differenceInMonths(referenceDate, date)
    return `${months} month${months === 1 ? "" : "s"}`;
}

export function getDayAsString(date: CalendarDate): string {
    const timezone = getLocalTimeZone()
    return date.toDate(timezone).toLocaleDateString()
}
export function getTimeAsString(date: CalendarDateTime): string {
    const timezone = getLocalTimeZone()
    return date.toDate(timezone).toLocaleTimeString()
}
