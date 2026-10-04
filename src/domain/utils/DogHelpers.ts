import { Dog } from "@/domain/Dog";
import { DogGenderEnum } from "@/domain/enums/DogGenderEnum";
import { DogSizeEnum } from "@/domain/enums/DogSizeEnum";

import { getDifferenceInYearOrMonth, now } from "@/domain/utils/TimeHelpers";

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
    return getDifferenceInYearOrMonth(dog.birthday, now());
}
