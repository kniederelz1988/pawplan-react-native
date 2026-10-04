import { firestore } from "@firebase/FirebaseConfig"
import { addDoc, collection, deleteDoc, doc, FirestoreDataConverter, getDocs, onSnapshot, query, QueryDocumentSnapshot, where } from "firebase/firestore";

import { Dog } from "@/domain/Dog";
import { Volunteer } from "@/domain/Volunteer";
import { VolunteerDogLike } from "@/domain/VolunteerDogLike";

import { FirebaseVolunteerLikeDTO } from "@/services/firebase/models/FirebaseVolunteerDogLikeDTO";

import VolunteerDogLikeRepository, { VolunteerDogLikesRepositoryListener } from "@/shared/repositories/VolunteerDogLikeRepository";

import { RepositoryOperationCallback } from "@/shared/repositories/utils/RepositoryOperationCallback";
import { getRepositoryOperationErrorMessage } from "@/shared/repositories/utils/RepositoryOperationError";

const modelConverter: FirestoreDataConverter<VolunteerDogLike, FirebaseVolunteerLikeDTO> = {
    toFirestore: (data: VolunteerDogLike) => {
        return {
            volunteerId: data.volunteerId,
            dogId: data.dogId
        }
    },
    fromFirestore: (snap: QueryDocumentSnapshot) => {
        const data = snap.data() as FirebaseVolunteerLikeDTO
        return {
            volunteerId: data.volunteerId,
            dogId: data.dogId
        }
    }
}

export default function FirebaseVolunteerDogLikesRepository(): VolunteerDogLikeRepository {
    const collectionName = "volunteerDogLikes";

    function subscribeForVolunteerLikes(volunteerId: string, listener: VolunteerDogLikesRepositoryListener) {
        const q = query(
            collection(firestore, collectionName),
            where("volunteerId", "==", volunteerId),
        )
            .withConverter(modelConverter)

        return onSnapshot(q, (snap) => listener(snap.docs.map(t => t.data())))
    }
    function subscribeForDogLikes(dogId: string, listener: VolunteerDogLikesRepositoryListener) {
        const q = query(
            collection(firestore, collectionName),
            where("dogId", "==", dogId),
        )
            .withConverter(modelConverter)

        return onSnapshot(q, (snap) => listener(snap.docs.map(t => t.data())))
    }

    async function addLike(volunteer: Volunteer, dog: Dog, operationCallback: RepositoryOperationCallback) {
        if (!volunteer?.id || !dog?.id)
            return

        try {
            await addDoc(collection(firestore, collectionName), {
                volunteerId: volunteer.id,
                dogId: dog.id
            })
        } catch (error) {
            const e = getRepositoryOperationErrorMessage(error)
            operationCallback("error", e)
            return;
        }

        operationCallback("success")
    }
    async function removeLike(volunteer: Volunteer, dog: Dog, operationCallback: RepositoryOperationCallback) {
        if (!volunteer?.id || !dog?.id)
            return

        try {
            const q = query(
                collection(firestore, collectionName),
                where("volunteerId", "==", volunteer.id),
                where("dogId", "==", dog.id)
            )

            const snap = await getDocs(q)
            if (!snap.empty) {
                const deletePromises = snap.docs.map((t) => deleteDoc(doc(firestore, collectionName, t.id)))
                await Promise.all(deletePromises)
            }
        } catch (error) {
            const e = getRepositoryOperationErrorMessage(error)
            operationCallback("error", e)
            return
        }

        operationCallback("success")
    }

    return { 
        subscribeForVolunteerLikes, 
        subscribeForDogLikes, 
        addLike, 
        removeLike 
    }
}