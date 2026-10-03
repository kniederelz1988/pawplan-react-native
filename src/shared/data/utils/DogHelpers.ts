import { Dog } from "@/shared/data/Dog";
import { DogGenderEnum } from "@/shared/data/enums/DogGenderEnum";
import { DogSizeEnum } from "@/shared/data/enums/DogSizeEnum";
import { getDifferenceInYearOrMonth } from "@/shared/data/utils/TimeHelpers";


export function getBreedTitle(breed: string) {
    if (!breed) {
        return "unknown";
    }

    return breed;
}

export function getGenderTitle(gender: DogGenderEnum) {
    switch (gender) {
        case "female":
            return "Female";
        case "femaleCastrated":
            return "Female (Castrated)";
        case "male":
            return "Male";
        case "maleCastrated":
            return "Male (Castrated)";
    }
}

export function getSizeTitle(size: DogSizeEnum) {
    switch (size) {
        case "small":
            return "Small";
        case "mid":
            return "Mid";
        case "big":
            return "Big";
    }
}

export function getDogAge(dog: Dog): string {
    return getDifferenceInYearOrMonth(dog.birthday, new Date());
}
