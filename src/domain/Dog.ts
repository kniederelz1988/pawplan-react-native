import { DogGenderEnum } from "@/domain/enums/DogGenderEnum"
import { DogSizeEnum } from "@/domain/enums/DogSizeEnum"

import { DateValue } from "@internationalized/date"

export declare type Dog = {
    id?: string
    name: string
    birthday: DateValue
    shelterDate: DateValue
    adoptionDateValid: boolean
    adoptionDate: DateValue
    breed: string
    gender: DogGenderEnum
    size: DogSizeEnum
    imageURL: string
    description: string
}