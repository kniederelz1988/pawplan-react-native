import { Timestamp } from "@firebase/firestore"

declare type FirebaseTimestamp = Timestamp

export declare type FirebaseVolunteerDTO = {
    id?: string
    userId: string
    birthday: FirebaseTimestamp
    volunteerSince: FirebaseTimestamp
    name: string
}