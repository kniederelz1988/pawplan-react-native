import { firestore } from "@firebase/FirebaseConfig"
import { collection, DocumentData, FirestoreDataConverter, onSnapshot, query, QueryDocumentSnapshot, where, documentId, addDoc, doc, updateDoc, setDoc, deleteDoc, limit, orderBy, startAfter, Query, Timestamp } from "@react-native-firebase/firestore"

import { FirebaseAppointmentDTO, FirebaseAppointmentRatingDTO, FirebaseAppointmentStatusDTO } from "../models/FirebaseAppointmentDTO";

import { AppointmentStatusEnum } from "@/domain/enums/AppointmentStatusEnum";
import { Appointment, AppointmentRating, AppointmentStatus } from "@/domain/Appointment";
import { Volunteer } from "@/domain/Volunteer";
import { Dog } from "@/domain/Dog";

import AppointmentRepository, { AppointmentRatingsListener, AppointmentsListener, AppointmentStatesListener } from "@/shared/repositories/AppointmentRepository";

import { RepositoryOperationCallback } from "@/shared/repositories/utils/RepositoryOperationCallback";
import { getRepositoryOperationErrorMessage, getRepositoryOperationUndefinedDataMessage } from "@/shared/repositories/utils/RepositoryOperationError";
import { getDateCompareOperator, getDateSortOperator, RepositoryDateCompareEnum } from "@/shared/repositories/enums/RepositoryDate";

import { dateValueToTimestamp, timestampToDateValue } from "@/services/firebase/utils/FirebaseExtensions";
import { now } from "@/domain/utils/TimeHelpers";

const appointmentStatusToNumber = (status: AppointmentStatusEnum): number => {
    const statusMap: Record<AppointmentStatusEnum, number> = {
        pending: 0,
        confirmed: 1,
        canceled: 2,
        completed: 3,
    }

    return statusMap[status]
}

const appointmentStatusFromNumber = (status: number): AppointmentStatusEnum => {
    const statusMap: Record<number, AppointmentStatusEnum> = {
        0: "pending",
        1: "confirmed",
        2: "canceled",
        3: "completed",
    }

    return statusMap[status]
}

const appointmentConverter: FirestoreDataConverter<Appointment, FirebaseAppointmentDTO> = {
    toFirestore: (data: Appointment) => {
        return {
            id: data.id,
            dogId: data.dogId,
            volunteerId: data.volunteerId,
            createdAt: dateValueToTimestamp(data.createdAt),
            date: dateValueToTimestamp(data.date),
            type: data.type
        }
    },
    fromFirestore: (snap: QueryDocumentSnapshot) => {
        const data = snap.data() as FirebaseAppointmentDTO
        return {
            id: snap.id,
            dogId: data.dogId,
            volunteerId: data.volunteerId,
            createdAt: timestampToDateValue(data.createdAt),
            date: timestampToDateValue(data.date),
            type: data.type
        }
    }
}
const statusConverter: FirestoreDataConverter<AppointmentStatus, FirebaseAppointmentStatusDTO> = {
    toFirestore: (data: AppointmentStatus) => {
        return {
            appointmentId: data.appointmentId,
            dogId: data.dogId,
            volunteerId: data.volunteerId,
            status: appointmentStatusToNumber(data.status),
            updateAt: dateValueToTimestamp(data.updateAt),
            updatedBy: data.updatedBy
        }
    },
    fromFirestore: (snap: QueryDocumentSnapshot) => {
        const data = snap.data() as FirebaseAppointmentStatusDTO

        return {
            appointmentId: data.appointmentId,
            dogId: data.dogId,
            volunteerId: data.volunteerId,
            status: appointmentStatusFromNumber(data.status),
            updateAt: timestampToDateValue(data.updateAt),
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
            updateAt: dateValueToTimestamp(data.updateAt),
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
            updateAt: timestampToDateValue(data.updateAt),
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
                collection(firestore, collectionName),
                where("date", getDateCompareOperator(dateCompare), Timestamp.now()),
                orderBy("date", getDateSortOperator(dateCompare)),
                limit(queryLimit)
            )
        }

        return query(
            collection(firestore, collectionName),
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
        const statusValues = status.map((value) => appointmentStatusToNumber(value))

        if (!queryCursor) {
            if (!volunteer?.id) {
                return query(
                    collection(firestore, statusCollectionName),
                    where("status", "in", statusValues),
                    orderBy("updateAt", "asc"),
                    limit(queryLimit)
                )
            }

            return query(
                collection(firestore, statusCollectionName),
                where("status", "in", statusValues),
                where("volunteerId", "==", volunteer.id),
                orderBy("updateAt", "asc"),
                limit(queryLimit)
            )
        }

        if (!volunteer?.id) {
            return query(
                collection(firestore, statusCollectionName),
                where("status", "in", statusValues),
                orderBy("updateAt", "asc"),
                startAfter(queryCursor.updateAt),
                limit(queryLimit)
            )
        }

        return query(
            collection(firestore, statusCollectionName),
            where("status", "in", statusValues),
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
                collection(firestore, collectionName),
                where("volunteerId", "==", volunteer?.id),
                orderBy("date", getDateSortOperator("future")),
                limit(queryLimit)
            )
        }

        return query(
            collection(firestore, collectionName),
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
            collection(firestore, collectionName),
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
            return () => { }

        const q = query(
            collection(firestore, collectionName),
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
            collection(firestore, statusCollectionName),
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
            collection(firestore, ratingCollectionName),
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
                collection(firestore, ratingCollectionName),
                where("dogId", "==", dog.id),
                orderBy("updateAt", getDateSortOperator(dateCompare)),
                limit(queryLimit)
            )
        }

        return query(
            collection(firestore, ratingCollectionName),
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
            return () => { }

        const q = createDogRatingQuery(dog, "past", queryCursor, queryLimit)
            .withConverter(ratingsConverter)

        return onSnapshot(q, (snap) => {
            const data = new Map(snap.docs.map(t => [t.id, t.data()]))
            listener(data)
        })
    }

    async function createAppointment(
        appointment: Appointment
    ): Promise<string> {
        if (!appointment)
            throw new Error(getRepositoryOperationErrorMessage("undefinedData"))

        const appointmentsCollection = collection(firestore, collectionName)
            .withConverter(appointmentConverter)

        const t = await addDoc(appointmentsCollection, appointment)

        const state: AppointmentStatus = {
            appointmentId: t.id,
            volunteerId: appointment.volunteerId,
            dogId: appointment.dogId,
            status: "pending",
            updateAt: now(),
            updatedBy: appointment.volunteerId
        }

        const statusCollection = collection(firestore, statusCollectionName)
            .withConverter(statusConverter)

        await setDoc(doc(statusCollection, t.id), state)
        return t.id
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
            const c = collection(firestore, collectionName)
                .withConverter(appointmentConverter)

            await setDoc(doc(c, appointment.id), appointment)
        } catch (error) {
            const e = getRepositoryOperationErrorMessage(error)
            operationCallback("error", e)
            return;
        }

        operationCallback("success")
    }
    async function updateAppointmentStatus(
        appointment: Appointment,
        status: AppointmentStatus,
        operationCallback: RepositoryOperationCallback
    ) {
        if (!appointment?.id || !status) {
            const e = getRepositoryOperationErrorMessage("")
            operationCallback("error", e)
            return
        }

        try {
            const c = collection(firestore, statusCollectionName)
                .withConverter(statusConverter)

            await setDoc(doc(c, appointment.id), status)
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
            const ratingCollection = collection(firestore, ratingCollectionName)
                .withConverter(ratingsConverter)

            await setDoc(doc(ratingCollection, appointment.id), rating)
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
            const ratingCollection = collection(firestore, ratingCollectionName)
                .withConverter(ratingsConverter)

            await updateDoc(doc(ratingCollection, appointment.id), rating)
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
            const appointmentCollection = collection(firestore, collectionName)
                .withConverter(appointmentConverter)

            await deleteDoc(doc(appointmentCollection, appointment.id))

            const statusCollection = collection(firestore, statusCollectionName)
                .withConverter(statusConverter)

            await deleteDoc(doc(statusCollection, appointment.id))
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