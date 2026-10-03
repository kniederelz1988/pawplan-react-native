import { firebaseDatabase } from "@firebase/FirebaseConfig"
import { collection, FirestoreDataConverter, onSnapshot, query, QueryDocumentSnapshot, where, documentId, addDoc, doc, updateDoc } from "firebase/firestore"

import { Dog } from "@/shared/data/Dog";

import DogRepository, { DogRepositoryListener } from "@/shared/repositories/DogRepository";

import { RepositoryOperationCallback } from "@/shared/repositories/utils/RepositoryOperationCallback";
import { getRepositoryOperationErrorMessage, getRepositoryOperationUndefinedDataMessage } from "@/shared/repositories/utils/RepositoryOperationError";
import { FirebaseDogDTO } from "../models/FirebaseDogDTO";
import { dateToTimestamp, timestampToDate } from "../utils/FirebaseExtensions";

import { DogGenderEnum } from "@/shared/data/enums/DogGenderEnum";
import { DogSizeEnum } from "@/shared/data/enums/DogSizeEnum";

const dogConverter: FirestoreDataConverter<Dog, FirebaseDogDTO> = {

    toFirestore: (data: Dog) => {
        const genderMap: Record<string, number> = {
            "female": 0,
            "femaleCastrated": 1,
            "male": 2,
            "maleCastrated": 3
        }
        const sizeMap: Record<string, number> = {
            small: 0,
            mid: 1,
            big: 2
        }

        return {
            id: data.id,
            name: data.name,
            birthday: dateToTimestamp(data.birthday),
            shelterDate: dateToTimestamp(data.shelterDate),
            adoptionDateValid: data.adoptionDateValid,
            adoptionDate: dateToTimestamp(data.adoptionDate),
            breed: data.breed,
            gender: genderMap[data.gender],
            size: sizeMap[data.size],
            imageURL: data.imageURL,
            description: data.description
        }
    },
    fromFirestore: (snap: QueryDocumentSnapshot) => {
        const data = snap.data() as FirebaseDogDTO

        const genderMap: Record<number, DogGenderEnum> = {
            0: "female",
            1: "femaleCastrated",
            2: "male",
            3: "maleCastrated"
        }
        const sizeMap: Record<number, DogSizeEnum> = {
            0: "small",
            1: "mid",
            2: "big"
        }
        return {
            id: data.id,
            name: data.name,
            birthday: timestampToDate(data.birthday),
            shelterDate: timestampToDate(data.shelterDate),
            adoptionDateValid: data.adoptionDateValid,
            adoptionDate: timestampToDate(data.adoptionDate),
            breed: "",
            gender: genderMap[data.gender],
            size: sizeMap[data.size],
            imageURL: data.imageURL,
            description: data.description
        }
    }
}

export default function FirebaseDogRepository(): DogRepository {
    const collectionName = "dogs"

    function subscribeForAllDogs(listener: DogRepositoryListener) {
        const q = query(
            collection(firebaseDatabase, "dogs")
        )
            .withConverter(dogConverter)

        return onSnapshot(q, (snap) => {
            const data = snap.docs.map(t => t.data())
            listener(data)
        })
    }

    function subscribeForDogs(dogIds: string[], listener: DogRepositoryListener) {
        if (dogIds.length === 0)
            return () => {}

        const q = query(
            collection(firebaseDatabase, "dogs"),
            where(documentId(), "in", dogIds)
        )
            .withConverter(dogConverter)

        return onSnapshot(q, (snap) => {
            const data = snap.docs.map(t => t.data())
            listener(data)
        })
    }

    async function createDog(dog: Dog, operationCallback: RepositoryOperationCallback) {
        if (dog.id) {
            const e = getRepositoryOperationUndefinedDataMessage()
            operationCallback("error", e)
            return
        }

        try {
            await addDoc(collection(firebaseDatabase, collectionName), dog)
        } catch (error) {
            const e = getRepositoryOperationErrorMessage(error)
            operationCallback("error", e)
            return;
        }

        operationCallback("success")
    }
    async function updateDog(dog: Dog, operationCallback: RepositoryOperationCallback) {
        if (!dog?.id) {
            const e = getRepositoryOperationUndefinedDataMessage()
            operationCallback("error", e)
            return
        }

        try {
            const d = doc(collection(firebaseDatabase, "dogs"), dog.id)
            await updateDoc(d, dog)
        } catch (error) {
            const e = getRepositoryOperationErrorMessage(error)
            operationCallback("error", e)
            return;
        }

        operationCallback("success")
    }

    return {
        subscribeForAllDogs,
        subscribeForDogs,
        createDog,
        updateDog
    }
}