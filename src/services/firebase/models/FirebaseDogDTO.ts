import { Timestamp } from "@react-native-firebase/firestore"

declare type FirebaseTimestamp = Timestamp

export declare type FirebaseDogDTO = {
    id?: string
    name: string
    birthday: FirebaseTimestamp
    shelterDate: FirebaseTimestamp
    adoptionDateValid: boolean
    adoptionDate: FirebaseTimestamp
    breed: string
    gender: number
    size: number
    imageURL: string,
    description: string
}

