import { dateToDateValue, dateValueToDate } from "@/shared/data/utils/TimeHelpers"
import { DateValue, getLocalTimeZone } from "@internationalized/date"
import { Timestamp } from "@firebase/firestore"

export function timestampToDateValue(timestamp: Timestamp) : DateValue {
    return dateToDateValue(timestamp.toDate())
}
export function dateValueToTimestamp(dateValue: DateValue) : Timestamp {
    const date = dateValueToDate(dateValue)
    return Timestamp.fromDate(date)
}

export function dateToTimestamp(date: Date) : Timestamp {
    const dateValue = dateToDateValue(date)
    return dateValueToTimestamp(dateValue)
}
export function timestampToDate(timestamp: Timestamp) : Date {
    const timezone = getLocalTimeZone()
    const dateValue = timestampToDateValue(timestamp)
    return dateValue.toDate(timezone)
}
