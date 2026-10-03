import { DateValue } from "@internationalized/date"
import { AppointmentStatusEnum } from "./enums/AppointmentStatusEnum"
import { AppointmentTypeEnum } from "./enums/AppointmentTypeEnum"

export declare type Appointment = {
    id?             : string
    dogId           : string,
    volunteerId     : string,
    createdAt       : DateValue,
    date            : DateValue
    type            : AppointmentTypeEnum
}
export declare type AppointmentStatus = {
    appointmentId   : string
    dogId           : string
    volunteerId     : string
    status          : AppointmentStatusEnum
    updateAt        : DateValue
    updatedBy       : string
}
export declare type AppointmentRating = {
    appointmentId   : string
    dogId           : string
    volunteerId     : string
    updateAt        : DateValue
    rating          : number
    comment         : string
}

export declare type AppointmentCollection = { 
    all:        Appointment[]
}
export declare type PagedAppointmentCollection = {
    appointments: Appointment[],
    page: number,
    previousPage: () => void, 
    previousPageActive: boolean, 
    nextPage: () => void, 
    nextPageActive: boolean
}