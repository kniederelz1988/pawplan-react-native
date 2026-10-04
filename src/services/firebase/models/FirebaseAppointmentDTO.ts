import { Timestamp } from "@react-native-firebase/firestore"

declare type FirebaseTimestamp = Timestamp

export declare type FirebaseAppointmentDTO = {
    id?: string
    dogId: string,
    volunteerId: string,
    createdAt: FirebaseTimestamp,
    date: FirebaseTimestamp
    type: any
}
export declare type FirebaseAppointmentStatusDTO = {
    appointmentId: string
    dogId: string
    volunteerId: string
    status: number
    updateAt: FirebaseTimestamp
    updatedBy: string
}
export declare type FirebaseAppointmentRatingDTO = {
    appointmentId: string
    dogId: string
    volunteerId: string
    updateAt: FirebaseTimestamp
    rating: number
    comment: string
}