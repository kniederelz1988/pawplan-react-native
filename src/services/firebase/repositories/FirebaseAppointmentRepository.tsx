import { firebaseDatabase } from "@firebase/FirebaseConfig"
import { collection, DocumentData, FirestoreDataConverter, onSnapshot, query, QueryDocumentSnapshot, where, documentId, addDoc, doc, updateDoc, setDoc, deleteDoc, limit, orderBy, startAfter, Query, Timestamp } from "firebase/firestore"

import { FirebaseAppointmentDTO, FirebaseAppointmentRatingDTO, FirebaseAppointmentStatusDTO } from "../models/FirebaseAppointmentDTO";

import { Appointment, AppointmentRating, AppointmentStatus } from "@/shared/data/Appointment";
import { Volunteer } from "@/shared/data/Volunteer";
import { Dog } from "@/shared/data/Dog";

import AppointmentRepository, { AppointmentRatingsListener, AppointmentsListener, AppointmentStatesListener } from "@/shared/repositories/AppointmentRepository";

import { RepositoryOperationCallback } from "@/shared/repositories/utils/RepositoryOperationCallback";
import { getRepositoryOperationErrorMessage, getRepositoryOperationUndefinedDataMessage } from "@/shared/repositories/utils/RepositoryOperationError";
import { getDateCompareOperator, getDateSortOperator, RepositoryDateCompareEnum } from "@/shared/repositories/enums/RepositoryDate";
import { dateToTimestamp, timestampToDate } from "../utils/FirebaseExtensions";

import { AppointmentStatusEnum } from "@/shared/data/enums/AppointmentStatusEnum";

const appointmentConverter: FirestoreDataConverter<Appointment, FirebaseAppointmentDTO> = {
    toFirestore: (data: Appointment) => {
        return {
            id: data.id,
            dogId: data.dogId,
            volunteerId: data.volunteerId,
            createdAt: dateToTimestamp(data.createdAt),
            date: dateToTimestamp(data.date),
            type: data.type
        }
    },
    fromFirestore: (snap: QueryDocumentSnapshot) => {
        const data = snap.data() as FirebaseAppointmentDTO
        return {
            id: data.id,
            dogId: data.dogId,
            volunteerId: data.volunteerId,
            createdAt: timestampToDate(data.createdAt),
            date: timestampToDate(data.date),
            type: data.type
        }
    }
}
const statusConverter: FirestoreDataConverter<AppointmentStatus, FirebaseAppointmentStatusDTO> = {
    toFirestore: (data: AppointmentStatus) => {
        const statusMap: Record<string, number> = {
            pending: 0,
            confirmed: 1,
            canceled: 2,
            completed: 3,
        }

        return {
            appointmentId: data.appointmentId,
            dogId: data.dogId,
            volunteerId: data.volunteerId,
            status: statusMap[data.status],
            updateAt: dateToTimestamp(data.updateAt),
            updatedBy: data.updatedBy
        }
    },
    fromFirestore: (snap: QueryDocumentSnapshot) => {
        const data = snap.data() as FirebaseAppointmentStatusDTO
        const statusMap: Record<number, AppointmentStatus["status"]> = {
            0: "pending",
            1: "confirmed",
            2: "canceled",
            3: "completed",
        }

        return {
            appointmentId: data.appointmentId,
            dogId: data.dogId,
            volunteerId: data.volunteerId,
            status: statusMap[data.status],
            updateAt: timestampToDate(data.updateAt),
            updatedBy: data.updatedBy
        }
    }
}
const ratingsConverter: FirestoreDataConverter<AppointmentRating, FirebaseAppointmentRatingDTO> = {
    toFirestore: (data: AppointmentRating) => {
        return {
            appointmentId: data.appointmentId,
            dogId: data.dogId,
            volunteerId: data.volunteerId,
            updateAt: dateToTimestamp(data.updateAt),
            rating: data.rating,
            comment: data.comment
        }
    },
    fromFirestore: (snap: QueryDocumentSnapshot) => {
        const data = snap.data() as FirebaseAppointmentRatingDTO
        return {
            appointmentId: data.appointmentId,
            dogId: data.dogId,
            volunteerId: data.volunteerId,
            updateAt: timestampToDate(data.updateAt),
            rating: data.rating,
            comment: data.comment
        }
    }
}

export default function FirebaseAppointmentRepository(): AppointmentRepository {
    const collectionName = "appointments2";
    const statusCollectionName = "appointmentsStatus"
    const ratingCollectionName = "appointmentsRating"

    function createAllAppointmentQuery(
        dateCompare: RepositoryDateCompareEnum,
        queryCursor: Appointment | null,
        queryLimit: number
    ): Query<DocumentData, DocumentData> {
        if (!queryCursor?.id) {
            return query(
                collection(firebaseDatabase, collectionName),
                where("date", getDateCompareOperator(dateCompare), Timestamp.now()),
                orderBy("date", getDateSortOperator(dateCompare)),
                limit(queryLimit)
            )
        }

        return query(
            collection(firebaseDatabase, collectionName),
            where("date", getDateCompareOperator(dateCompare), Timestamp.now()),
            orderBy("date", getDateSortOperator(dateCompare)),
            startAfter(queryCursor.date),
            limit(queryLimit)
        )
    }
    function subscribeForAllAppointments(
        date: RepositoryDateCompareEnum,
        queryCursor: Appointment | null,
        queryLimit: number,
        listener: AppointmentsListener
    ) {
        const q = createAllAppointmentQuery(date, queryCursor, queryLimit)
            .withConverter(appointmentConverter)
  
        return onSnapshot(q, (snap) => {
            const data = new Map(snap.docs.map(t => [t.id, t.data()]))
            listener(data)
        })
    }

    function createAppointmentStatusQuery(
        status: AppointmentStatusEnum[],
        volunteer: Volunteer | null,
        queryCursor: AppointmentStatus | null,
        queryLimit: number
    ): Query<DocumentData, DocumentData> {
        if (!queryCursor) {
            if (!volunteer?.id) {
                return query(
                    collection(firebaseDatabase, statusCollectionName),
                    where("status", "in", status),
                    orderBy("updateAt", "asc"),
                    limit(queryLimit)
                )
            }

            return query(
                collection(firebaseDatabase, statusCollectionName),
                where("status", "in", status),
                where("volunteerId", "==", volunteer.id),
                orderBy("updateAt", "asc"),
                limit(queryLimit)
            )
        }

        if (!volunteer?.id) {
            return query(
                collection(firebaseDatabase, statusCollectionName),
                where("status", "in", status),
                orderBy("updateAt", "asc"),
                startAfter(queryCursor.updateAt),
                limit(queryLimit)
            )
        }

        return query(
            collection(firebaseDatabase, statusCollectionName),
            where("status", "in", status),
            where("volunteerId", "==", volunteer.id),
            orderBy("updateAt", "asc"),
            startAfter(queryCursor.updateAt),
            limit(queryLimit)
        )
    }
    function subscribeForAppointmentStatus(
        status: AppointmentStatusEnum[],
        volunteer: Volunteer | null,
        queryCursor: AppointmentStatus | null,
        queryLimit: number,
        listener: AppointmentStatesListener
    ) {
        const q = createAppointmentStatusQuery(status, volunteer, queryCursor, queryLimit)
            .withConverter(statusConverter)

        return onSnapshot(q, (snap) => {
            const data = new Map(snap.docs.map(t => [t.id, t.data()]))
            listener(data)
        })
    }

    function createVolunteerAppointmentQuery(
        volunteer: Volunteer,
        queryCursor: Appointment | null,
        queryLimit: number
    ): Query<DocumentData, DocumentData> {
        if (!queryCursor?.id) {
            return query(
                collection(firebaseDatabase, collectionName),
                where("volunteerId", "==", volunteer?.id),
                orderBy("date", getDateSortOperator("future")),
                limit(queryLimit)
            )
        }

        return query(
            collection(firebaseDatabase, collectionName),
            where("volunteerId", "==", volunteer?.id),
            orderBy("date", getDateSortOperator("future")),
            startAfter(queryCursor.date),
            limit(queryLimit)
        )
    }
    function subscribeForVolunteerAppointments(
        volunteer: Volunteer,
        queryCursor: Appointment | null,
        queryLimit: number,
        listener: AppointmentsListener
    ) {
        if (!volunteer?.id)
            return

        const q = createVolunteerAppointmentQuery(volunteer, queryCursor, queryLimit)
            .withConverter(appointmentConverter)

        return onSnapshot(q, (snap) => {
            const data = new Map(snap.docs.map(t => [t.id, t.data()]))
            listener(data)
        })
    }

    function subscribeForAllDogAppointments(
        dogId: string,
        listener: AppointmentsListener
    ) {
        const q = query(
            collection(firebaseDatabase, collectionName),
            where("dogId", "==", dogId),
        )
            .withConverter(appointmentConverter)

        return onSnapshot(q, (snap) => {
            const data = new Map(snap.docs.map(t => [t.id, t.data()]))
            listener(data)
        })
    }

    function subscribeForAppointments(
        appointmentIds: string[],
        listener: AppointmentsListener
    ) {
        if (!appointmentIds.length)
            return () => {}

        const q = query(
            collection(firebaseDatabase, collectionName),
            where(documentId(), "in", appointmentIds)
        )
            .withConverter(appointmentConverter)

        return onSnapshot(q, (snap) => {
            const data = new Map(snap.docs.map(t => [t.id, t.data()]))
            listener(data)
        })
    }
    function subscribeForAppointmentStates(
        appoinmentIds: string[],
        listener: AppointmentStatesListener
    ) {
        if (!appoinmentIds.length)
            return () => { }

        const q = query(
            collection(firebaseDatabase, statusCollectionName),
            where(documentId(), "in", appoinmentIds)
        )
            .withConverter(statusConverter)

        return onSnapshot(q, (snap) => {
            const data = new Map(snap.docs.map(t => [t.id, t.data()]))
            listener(data)
        })
    }
    function subscribeForAppointmentRatings(
        appoinmentIds: string[],
        listener: AppointmentRatingsListener
    ) {
        if (!appoinmentIds.length)
            return () => { }

        const q = query(
            collection(firebaseDatabase, ratingCollectionName),
            where(documentId(), "in", appoinmentIds)
        )
            .withConverter(ratingsConverter)

        return onSnapshot(q, (snap) => {
            const data = new Map(snap.docs.map(t => [t.id, t.data()]))
            listener(data)
        })
    }

    function createDogRatingQuery(
        dog: Dog,
        dateCompare: RepositoryDateCompareEnum,
        queryCursor: AppointmentRating | null,
        queryLimit: number
    ): Query<DocumentData, DocumentData> {

        if (!queryCursor?.updateAt) {
            return query(
                collection(firebaseDatabase, ratingCollectionName),
                where("dogId", "==", dog.id),
                orderBy("updateAt", getDateSortOperator(dateCompare)),
                limit(queryLimit)
            )
        }

        return query(
            collection(firebaseDatabase, ratingCollectionName),
            where("dogId", "==", dog.id),
            orderBy("updateAt", getDateSortOperator(dateCompare)),
            startAfter(queryCursor.updateAt),
            limit(queryLimit)
        )
    }
    function subscribeForDogAppointmentRatings(
        dog: Dog,
        queryCursor: AppointmentRating | null,
        queryLimit: number,
        listener: AppointmentRatingsListener
    ) {
        if (!dog?.id)
            return () => {}

        const q = createDogRatingQuery(dog, "past", queryCursor, queryLimit)
            .withConverter(ratingsConverter)

        return onSnapshot(q, (snap) => {
            const data = new Map(snap.docs.map(t => [t.id, t.data()]))
            listener(data)
        })
    }

    async function createAppointment(
        appointment: Appointment,
        operationCallback: RepositoryOperationCallback
    ) {
        if (!appointment) {
            const e = getRepositoryOperationErrorMessage("undefinedData")
            operationCallback("error", e)
            return
        }

        try {
            const t = await addDoc(collection(firebaseDatabase, collectionName), appointment)

            const state: AppointmentStatus = {
                appointmentId: t.id,
                volunteerId: appointment.volunteerId,
                dogId: appointment.dogId,
                status: "pending",
                updateAt: new Date(),
                updatedBy: appointment.volunteerId
            }
            await setDoc(doc(collection(firebaseDatabase, statusCollectionName), t.id), state)
        } catch (error) {
            const e = getRepositoryOperationErrorMessage(error)
            operationCallback("error", e)
            return;
        }

        operationCallback("success")
    }

    async function updateAppointment(
        appointment: Appointment,
        operationCallback: RepositoryOperationCallback
    ) {
        if (!appointment?.id) {
            const e = getRepositoryOperationErrorMessage("undefinedData")
            operationCallback("error", e)
            return
        }

        try {
            const c = collection(firebaseDatabase, collectionName)
            const d = doc(c, appointment.id)
            await updateDoc(d, appointment)
        } catch (error) {
            const e = getRepositoryOperationErrorMessage(error)
            operationCallback("error", e)
            return;
        }

        operationCallback("success")
    }
    async function updateAppointmentStatus(
        appointment: Appointment,
        appointmentState: AppointmentStatus,
        operationCallback: RepositoryOperationCallback
    ) {
        if (!appointment?.id || !appointmentState) {
            const e = getRepositoryOperationErrorMessage("")
            operationCallback("error", e)
            return
        }

        try {
            const c = collection(firebaseDatabase, statusCollectionName)
            const d = doc(c, appointment.id)
            await updateDoc(d, appointmentState)
        } catch (error) {
            const e = getRepositoryOperationErrorMessage(error)
            operationCallback("error", e)
            return;
        }

        operationCallback("success")
    }

    async function createAppointmentRating(
        appointment: Appointment,
        rating: AppointmentRating,
        operationCallback: RepositoryOperationCallback
    ) {
        if (!appointment?.id || !rating) {
            const e = getRepositoryOperationUndefinedDataMessage()
            operationCallback("error", e)
            return
        }

        try {
            const t = await doc(collection(firebaseDatabase, collectionName), appointment.id)
            await setDoc(doc(collection(firebaseDatabase, ratingCollectionName), t.id), rating)
        } catch (error) {
            const e = getRepositoryOperationErrorMessage(error)
            operationCallback("error", e)
            return;
        }

        operationCallback("success")
    }
    async function updateAppointmentRating(
        appointment: Appointment,
        rating: AppointmentRating,
        operationCallback: RepositoryOperationCallback
    ) {
        if (!appointment?.id || !rating) {
            const e = getRepositoryOperationUndefinedDataMessage()
            operationCallback("error", e)
            return
        }

        try {
            const c = collection(firebaseDatabase, collectionName)
            const t = await doc(c, appointment.id)
            await updateDoc(doc(collection(firebaseDatabase, ratingCollectionName), t.id), rating)
        } catch (error) {
            const e = getRepositoryOperationErrorMessage(error)
            operationCallback("error", e)
            return;
        }

        operationCallback("success")
    }

    async function deleteAppointment(
        appointment: Appointment,
        operationCallback: RepositoryOperationCallback
    ) {
        if (!appointment?.id) {
            const e = getRepositoryOperationUndefinedDataMessage()
            operationCallback("error", e)
            return
        }

        try {
            await deleteDoc(doc(collection(firebaseDatabase, collectionName), appointment.id))
            await deleteDoc(doc(collection(firebaseDatabase, statusCollectionName), appointment.id))
        } catch (error) {
            const e = getRepositoryOperationErrorMessage(error)
            operationCallback("error", e)
            return;
        }

        operationCallback("success")
    }

    return {
        subscribeForAllAppointments,
        subscribeForAppointmentStatus,
        subscribeForVolunteerAppointments,
        subscribeForAllDogAppointments,
        subscribeForAppointments,
        subscribeForAppointmentStates,
        subscribeForAppointmentRatings,
        subscribeForDogAppointmentRatings,
        createAppointment,
        updateAppointment,
        updateAppointmentStatus,
        createAppointmentRating,
        updateAppointmentRating,
        deleteAppointment
    }
}