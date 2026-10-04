import { firestore } from "@firebase/FirebaseConfig"
import { addDoc, collection, deleteDoc, doc, DocumentData, documentId, FirestoreDataConverter, limit, onSnapshot, orderBy, Query, query, QueryDocumentSnapshot, setDoc, startAfter, updateDoc, where } from "firebase/firestore";

import { Volunteer } from "@/domain/Volunteer";
import { VolunteerRole } from "@/domain/VolunteerRole";
import { VolunteerRoleEnum } from "@/domain/enums/VolunteerRoleEnum";
import { today } from "@/domain/utils/TimeHelpers";

import { FirebaseVolunteerDTO } from "@/services/firebase/models/FirebaseVolunteerDTO";
import { FirebaseVolunteerRoleDTO } from "@/services/firebase/models/FirebaseVolunteerRoleDTO";

import VolunteerRepository, { VolunteerRepositoryListener, VolunteerRoleRepositoryListener } from "@/shared/repositories/VolunteerRepository";

import { RepositoryOperationCallback } from "@/shared/repositories/utils/RepositoryOperationCallback";
import { getRepositoryOperationErrorMessage, getRepositoryOperationUndefinedDataMessage } from "@/shared/repositories/utils/RepositoryOperationError";
import { dateValueToTimestamp, timestampToDateValue } from "@/services/firebase/utils/FirebaseExtensions";

const volunteerConverter: FirestoreDataConverter<Volunteer, FirebaseVolunteerDTO> = {
    toFirestore: (data: Volunteer) => {
        return {
            id: data.id,
            userId: data.userId,
            birthday: dateValueToTimestamp(data.birthday),
            volunteerSince: dateValueToTimestamp(data.volunteerSince),
            name: data.name
        }
    },
    fromFirestore: (snap: QueryDocumentSnapshot) => {
        const d = snap.data() as FirebaseVolunteerDTO
        d.id = snap.id

        return {
            id: d.id,
            userId: d.userId,
            birthday: timestampToDateValue(d.birthday),
            volunteerSince: timestampToDateValue(d.volunteerSince),
            name: d.name
        }
    }
}
const roleConverter: FirestoreDataConverter<VolunteerRole, FirebaseVolunteerRoleDTO> = {
    toFirestore: (data: VolunteerRole) => {
        return {
            role: data.role,
        }
    },
    fromFirestore: (snap: QueryDocumentSnapshot) => {
        const data = snap.data() as FirebaseVolunteerRoleDTO 
        return {
            role: data.role as VolunteerRoleEnum
        }
    }       
}

export default function FirebaseVolunteerRepository(): VolunteerRepository {
    const collectionName = "volunteers2";
    const roleCollectionName = "volunteerRoles"

    function subscribeForVolunteerByUserId(userId: string, listener: VolunteerRepositoryListener) {
        const q = query(
            collection(firestore, collectionName),
            where("userId", "==", userId),
            limit(1)
        )
            .withConverter(volunteerConverter)

        return onSnapshot(q, (snap) => {
            if (snap.empty)
                return

            listener([snap.docs[0].data()])
        })
    }
    function subscribeForVolunteer(volunteerId: string, listener: VolunteerRepositoryListener) {
        const q = query(
            collection(firestore, collectionName),
            where(documentId(), "==", volunteerId),
            limit(1)
        )
            .withConverter(volunteerConverter)

        return onSnapshot(q, (snap) => {
            if (snap.empty)
                return
            
            listener([snap.docs[0].data()])
        })
    }
    function subscribeForVolunteerRole(volunteerId: string, listener: VolunteerRoleRepositoryListener) {
        const q = query(
            collection(firestore, roleCollectionName),
            where(documentId(), "==", volunteerId),
            limit(1)
        )
            .withConverter(roleConverter)

        return onSnapshot(q, (snap) => {
            if (snap.empty)
                return

            listener(snap.docs[0].data())
        })
    }
        
    function createVolunteerQuery(queryCursor: Volunteer | null, queryLimit: number)
        : Query<DocumentData, DocumentData>
    {
        if (!queryCursor?.id) {
            return query(
                collection(firestore, collectionName),
                orderBy("name", "desc"),
                limit(queryLimit)
            )
        }

        return query(
            collection(firestore, collectionName),
            orderBy("name", "desc"),
            startAfter(queryCursor.name),
            limit(queryLimit)
        )
    }

    function subscribeForAllVolunteers(queryCursor: Volunteer | null, queryLimit: number, listener: VolunteerRepositoryListener) {
        const q = createVolunteerQuery(queryCursor, queryLimit)
            .withConverter(volunteerConverter)

        return onSnapshot(q, (snap) => {
            listener(snap.docs.map(t => t.data()))
        })
    }


    async function createVolunteer(volunteer: Volunteer, operationCallback: RepositoryOperationCallback) {
        if (volunteer.id) {
            const e = getRepositoryOperationUndefinedDataMessage()
            operationCallback("error", e)
            return
        }
            
        try {
            const role = { role: "observer" }

            const t = await addDoc(collection(firestore, collectionName), volunteer)
            await setDoc(doc(collection(firestore, roleCollectionName), t.id), role)
        } catch (error) {
            const e = getRepositoryOperationErrorMessage(error)
            operationCallback("error", e)
            return;
        }

        operationCallback("success")
    }
    async function updateVolunteer(volunteer: Volunteer, operationCallback: RepositoryOperationCallback) {
        if (!volunteer?.id) {
            const e = getRepositoryOperationUndefinedDataMessage()
            operationCallback("error", e)
            return
        }

        try {
            await updateDoc(doc(collection(firestore, collectionName), volunteer.id), volunteer)
        } catch (error) {
            const e = getRepositoryOperationErrorMessage(error)
            operationCallback("error", e)
            return;
        }

        operationCallback("success")
    }
    async function updateVolunteerRole(volunteer: Volunteer, role: VolunteerRole, operationCallback: RepositoryOperationCallback) {
        if (!volunteer?.id) {
            const e = getRepositoryOperationUndefinedDataMessage()
            operationCallback("error", e)
            return
        }

        try {
            const t = { role: role }
            await updateDoc(doc(collection(firestore, roleCollectionName), volunteer.id), t)
        } catch (error) {
            const e = getRepositoryOperationErrorMessage(error)
            operationCallback("error", e)
            return;
        }

        operationCallback("success")
    }

    async function deleteVolunteer(volunteer: Volunteer, operationCallback: RepositoryOperationCallback) {
        if (!volunteer?.id) {
            const e = getRepositoryOperationUndefinedDataMessage()
            operationCallback("error", e)
            return
        }
        
        try {
            await deleteDoc(doc(collection(firestore, collectionName), volunteer.id))
            await deleteDoc(doc(collection(firestore, roleCollectionName), volunteer.id))
        } catch (error) {
            const e = getRepositoryOperationErrorMessage(error)
            operationCallback("error", e)
            return;
        }

        operationCallback("success")
    }
    
    async function createVolunteerIfNonExistant(userID: string, name: string, operationCallback: RepositoryOperationCallback) {
        const unsubcribe = subscribeForVolunteerByUserId(userID, (result) => {
            unsubcribe()

            if (result?.length) {
                const volunteer = result[0]
                volunteer.name = name

                updateVolunteer(volunteer, operationCallback)
                return
            }
            
            const volunteer = { 
                userId: userID,
                birthday: today(),
                volunteerSince: today(),
                name: name,
            }
            createVolunteer(volunteer, operationCallback)
        })
    }

    return {
        subscribeForAllVolunteers,
        subscribeForVolunteerByUserId, 
        subscribeForVolunteer, 
        subscribeForVolunteerRole, 
        createVolunteer,
        updateVolunteer, 
        updateVolunteerRole,
        deleteVolunteer, 
        createVolunteerIfNonExistant
    }
}