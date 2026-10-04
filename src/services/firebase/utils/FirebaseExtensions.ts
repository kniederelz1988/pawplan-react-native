import { Timestamp } from "@react-native-firebase/firestore"

import { dateToDateValue, dateValueToDate } from "@/domain/utils/TimeHelpers"
import { DateValue } from "@internationalized/date"

export function timestampToDateValue(timestamp: Timestamp) : DateValue {
    // how to convert from timestamp to date value? 
    const date = timestamp.toDate()
    return dateToDateValue(date)
}
export function dateValueToTimestamp(dateValue: DateValue) : Timestamp {
    const date = dateValueToDate(dateValue)
    return Timestamp.fromDate(date)
}

