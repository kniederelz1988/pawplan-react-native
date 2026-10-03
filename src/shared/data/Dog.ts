import { DogGenderEnum } from "@/shared/data/enums/DogGenderEnum"
import { DogSizeEnum } from "@/shared/data/enums/DogSizeEnum"

export declare type Dog = {
    id?: string
    name: string
    birthday: Date
    shelterDate: Date
    adoptionDateValid: boolean
    adoptionDate: Date
    breed: string
    gender: DogGenderEnum
    size: DogSizeEnum
    imageURL: string
    description: string
}