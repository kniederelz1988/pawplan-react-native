import { DateValue, CalendarDate, CalendarDateTime, getLocalTimeZone, today as todayDate, now as nowDate, parseDateTime, toZoned } from "@internationalized/date";

export function dateToDateValue(date: Date): CalendarDateTime {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")

    const hour = String(date.getHours()).padStart(2, "0")
    const minute = String(date.getMinutes()).padStart(2, "0")
    const second = String(date.getSeconds()).padStart(2, "0")

    return parseDateTime(
        `${year}-${month}-${day}T${hour}:${minute}:${second}`
    )
}
export function dateValueToDate(dateValue: DateValue): Date {
    const timezone = getLocalTimeZone()
  return toZoned(dateValue, timezone).toDate()
}

export function now(): DateValue {
    const timezone = getLocalTimeZone()
    return nowDate(timezone)
}
export function today(): DateValue {
    const timezone = getLocalTimeZone()
    return todayDate(timezone)
}

export function getDateFromToday(dayOffset: number): CalendarDate {
    const timezone = getLocalTimeZone()
    return todayDate(timezone).add({ days: dayOffset })
}
export function getDateTime(date: CalendarDate, hour: number, minutes: number,): CalendarDateTime {
    return new CalendarDateTime(date.year, date.month, date.day, hour, minutes)
}

export function getDifferenceInYearOrMonth(date: DateValue, referenceDate: DateValue): string {
    const dateAsDate = dateValueToDate(date)
    const referenceAsDate = dateValueToDate(referenceDate)

    const years = referenceAsDate.getFullYear() - dateAsDate.getFullYear()
    const months = referenceAsDate.getMonth() - dateAsDate.getMonth()

    const totalMonths = years * 12 + months

    if (totalMonths >= 12) {
        const yearCount = Math.max(0, Math.floor(totalMonths / 12))
        return `${yearCount} year${yearCount === 1 ? "" : "s"}`
    }

    return `${Math.max(0, totalMonths)} month${totalMonths === 1 ? "" : "s"}`
}

export function getDayAsString(date: CalendarDate): string {
    const timezone = getLocalTimeZone()
    return date.toDate(timezone).toLocaleDateString()
}
export function getTimeAsString(date: CalendarDateTime): string {
    const timezone = getLocalTimeZone()
    return date.toDate(timezone).toLocaleTimeString()
}
