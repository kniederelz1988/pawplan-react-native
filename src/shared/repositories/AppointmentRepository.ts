import { Appointment, AppointmentRating, AppointmentStatus } from "@/domain/Appointment"
import { AppointmentStatusEnum } from "@/domain/enums/AppointmentStatusEnum"

import { Volunteer } from "@/domain/Volunteer"
import { Dog } from "@/domain/Dog"

import { RepositoryDateCompareEnum } from "@/shared/repositories/enums/RepositoryDate"
import { RepositoryOperationCallback } from "@/shared/repositories/utils/RepositoryOperationCallback"

export type AppointmentsListener = (appointments: Map<string, Appointment>) => void
export type AppointmentStatesListener = (appointmentStates: Map<string, AppointmentStatus>) => void
export type AppointmentRatingsListener = (appointmentRatings: Map<string, AppointmentRating>) => void

type Unsubscribe = () => void

export default interface AppointmentRepository {

    subscribeForVolunteerAppointments(
        volunteer: Volunteer,
        queryCursor: Appointment | null,
        queryLimit: number,
        listener: AppointmentsListener
    ): Unsubscribe | undefined


    subscribeForAllAppointments(
        date: RepositoryDateCompareEnum,
        queryCursor: Appointment | null,
        queryLimit: number,
        listener: AppointmentsListener
    ): Unsubscribe

    subscribeForAllDogAppointments(
        dogId: string,
        listener: AppointmentsListener
    ): Unsubscribe


    subscribeForAppointments(
        appointmentIds: string[],
        listener: AppointmentsListener
    ): Unsubscribe | undefined

    subscribeForAppointmentStatus(
        status: AppointmentStatusEnum[],
        volunteer: Volunteer | null,
        queryCursor: AppointmentStatus | null,
        queryLimit: number,
        listener: AppointmentStatesListener
    ): Unsubscribe | undefined


    subscribeForAppointmentStates(
        appoinmentIds: string[],
        listener: AppointmentStatesListener
    ): Unsubscribe | undefined

    subscribeForAppointmentRatings(
        appoinmentIds: string[],
        listener: AppointmentRatingsListener
    ): Unsubscribe | undefined

    subscribeForDogAppointmentRatings(
        dog: Dog,
        queryCursor: AppointmentRating | null,
        queryLimit: number,
        listener: AppointmentRatingsListener
    ): Unsubscribe | undefined

    createAppointment(
        appointment: Appointment,
        operationCallback?: RepositoryOperationCallback
    ): Promise<string>

    updateAppointment(
        appointment: Appointment,
        operationCallback: RepositoryOperationCallback
    ): Promise<void>

    deleteAppointment(
        appointment: Appointment,
        operationCallback: RepositoryOperationCallback
    ): Promise<void>

    updateAppointmentStatus(
        appointment: Appointment,
        appointmentState: AppointmentStatus,
        operationCallback: RepositoryOperationCallback
    ): Promise<void>

    createAppointmentRating(
        appointment: Appointment,
        rating: AppointmentRating,
        operationCallback: RepositoryOperationCallback
    ): Promise<void>
    updateAppointmentRating(
        appointment: Appointment,
        rating: AppointmentRating,
        operationCallback: RepositoryOperationCallback
    ): Promise<void>
}