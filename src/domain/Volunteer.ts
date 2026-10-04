import { DateValue } from "@internationalized/date"

export declare type Volunteer = {
    id?: string
    userId: string
    birthday: DateValue
    volunteerSince: DateValue
    name: string
}