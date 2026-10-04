import { Dog } from "@/domain/Dog";
import { dateToDateValue } from "@/domain/utils/TimeHelpers";
import DogRepository, { DogRepositoryListener } from "@/shared/repositories/DogRepository";
import { RepositoryOperationCallback } from "@/shared/repositories/utils/RepositoryOperationCallback";
import { Unsubscribe } from "@react-native-firebase/firestore";

export default function MockDogRepository(): DogRepository {
    const dogs: Dog[] = [
        {
            id: "dog-001",
            name: "Biscuit",
            birthday: dateToDateValue(new Date("2020-04-12")),
            shelterDate: dateToDateValue(new Date("2024-01-18")),
            adoptionDateValid: true,
            adoptionDate: dateToDateValue(new Date("2024-02-03")),
            breed: "Golden Retriever",
            gender: "maleCastrated",
            size: "big",
            imageURL: "https://images.unsplash.com/photo-1552053831-71594a27632d",
            description: "A gentle, playful dog who loves long walks and people.",
        },
        {
            id: "dog-002",
            name: "Luna",
            birthday: dateToDateValue(new Date("2021-08-25")),
            shelterDate: dateToDateValue(new Date("2024-03-06")),
            adoptionDateValid: false,
            adoptionDate: dateToDateValue(new Date("2024-03-06")),
            breed: "Border Collie",
            gender: "female",
            size: "mid",
            imageURL: "https://images.unsplash.com/photo-1517849845537-4d257902454a",
            description: "An energetic and clever companion who enjoys learning tricks.",
        },
        {
            id: "dog-003",
            name: "Milo",
            birthday: dateToDateValue(new Date("2019-11-03")),
            shelterDate: dateToDateValue(new Date("2023-11-21")),
            adoptionDateValid: true,
            adoptionDate: dateToDateValue(new Date("2023-12-10")),
            breed: "Beagle",
            gender: "male",
            size: "small",
            imageURL: "https://images.unsplash.com/photo-1505628346881-b72b27e84530",
            description: "A curious, friendly dog with an excellent nose for adventure.",
        },
        {
            id: "dog-004",
            name: "Nala",
            birthday: dateToDateValue(new Date("2022-02-14")),
            shelterDate: dateToDateValue(new Date("2024-04-02")),
            adoptionDateValid: false,
            adoptionDate: dateToDateValue(new Date("2024-04-02")),
            breed: "Labrador Mix",
            gender: "femaleCastrated",
            size: "big",
            imageURL: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d",
            description: "A patient and affectionate dog who settles quickly into new routines.",
        },
        {
            id: "dog-005",
            name: "Teddy",
            birthday: dateToDateValue(new Date("2021-06-30")),
            shelterDate: dateToDateValue(new Date("2024-02-27")),
            adoptionDateValid: true,
            adoptionDate: dateToDateValue(new Date("2024-03-15")),
            breed: "Cocker Spaniel",
            gender: "maleCastrated",
            size: "mid",
            imageURL: "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6",
            description: "A cheerful, cuddly dog who enjoys gentle games and quiet evenings.",
        },
        {
            id: "dog-006",
            name: "Zoe",
            birthday: dateToDateValue(new Date("2020-09-19")),
            shelterDate: dateToDateValue(new Date("2023-10-12")),
            adoptionDateValid: true,
            adoptionDate: dateToDateValue(new Date("2023-11-01")),
            breed: "Jack Russell Terrier",
            gender: "female",
            size: "small",
            imageURL: "https://images.unsplash.com/photo-1558788353-f76d92427f16",
            description: "A lively little dog with a big personality and a soft spot for treats.",
        },
        {
            id: "dog-007",
            name: "Bruno",
            birthday: dateToDateValue(new Date("2018-12-07")),
            shelterDate: dateToDateValue(new Date("2024-01-05")),
            adoptionDateValid: false,
            adoptionDate: dateToDateValue(new Date("2024-01-05")),
            breed: "German Shepherd Mix",
            gender: "maleCastrated",
            size: "big",
            imageURL: "https://images.unsplash.com/photo-1568572933382-74d440642117",
            description: "A steady, loyal dog who enjoys sniffing walks and patient handlers.",
        },
        {
            id: "dog-008",
            name: "Poppy",
            birthday: dateToDateValue(new Date("2022-05-22")),
            shelterDate: dateToDateValue(new Date("2024-03-19")),
            adoptionDateValid: false,
            adoptionDate: dateToDateValue(new Date("2024-03-19")),
            breed: "French Bulldog Mix",
            gender: "femaleCastrated",
            size: "small",
            imageURL: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e",
            description: "A sweet, sociable dog who loves attention and short neighborhood walks.",
        },
        {
            id: "dog-009",
            name: "Otis",
            birthday: dateToDateValue(new Date("2020-01-16")),
            shelterDate: dateToDateValue(new Date("2023-12-14")),
            adoptionDateValid: true,
            adoptionDate: dateToDateValue(new Date("2024-01-02")),
            breed: "Siberian Husky",
            gender: "male",
            size: "big",
            imageURL: "https://images.unsplash.com/photo-1605568427561-40dd23c2acea",
            description: "A bright, athletic dog who thrives with active companions.",
        },
        {
            id: "dog-010",
            name: "Cleo",
            birthday: dateToDateValue(new Date("2021-03-11")),
            shelterDate: dateToDateValue(new Date("2024-04-11")),
            adoptionDateValid: false,
            adoptionDate: dateToDateValue(new Date("2024-04-11")),
            breed: "Australian Shepherd Mix",
            gender: "female",
            size: "mid",
            imageURL: "https://images.unsplash.com/photo-1558788353-f76d92427f16",
            description: "A devoted and observant dog who enjoys training and outdoor time.",
        },
    ]

    function subscribeForAllDogs(listener: DogRepositoryListener): Unsubscribe {
        listener(dogs)

        return () => {}
    }
    function subscribeForDogs(dogIds: string[], listener: DogRepositoryListener): Unsubscribe {
        listener(dogs.filter((dog) => dog.id && dogIds.includes(dog.id)))

        return () => {}
    }

    async function createDog(dog: Dog, operationCallback: RepositoryOperationCallback): Promise<void> {
        dogs.push(dog)
        operationCallback("success")
    }
    async function updateDog(dog: Dog, operationCallback: RepositoryOperationCallback): Promise<void> {
        const index = dogs.findIndex((t) => dog.id === t.id)
        dogs[index] = dog
        operationCallback("success")
    }  

    return {
        subscribeForAllDogs,
        subscribeForDogs,
        createDog,
        updateDog
    }
}