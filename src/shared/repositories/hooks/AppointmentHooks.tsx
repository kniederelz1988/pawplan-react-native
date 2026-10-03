import { useEffect, useMemo, useState } from "react";
import { usePages } from "@/shared/repositories/hooks/GenericHooks";

import { useAppDependencies } from "@/shared/dependencies/hooks/useAppDependencies";

import { Appointment, AppointmentStatus, AppointmentRating } from "@/shared/data/Appointment";
import { AppointmentStatusEnum } from "@/shared/data/enums/AppointmentStatusEnum";
import { setupAppointments } from "@/shared/data/AppointmentMap";

import { Volunteer } from "@/shared/data/Volunteer";

import { Dog } from "@/shared/data/Dog";

import { showCreateAppointmentFailedToast, showCreateAppointmentSuccessToast, showCreateRatingFailedToast, showCreateRatingSuccessToast, showDeleteAppointmentFailedToast, showDeleteAppointmentSuccessToast, showUpdateAppointmentFailedToast, showUpdateAppointmentSuccessToast, showUpdateRatingFailedToast, showUpdateRatingSuccessToast, showUpdateStatusFailedToast, showUpdateStatusSuccessToast } from "@/services/toast/toastEvents";

export function useAppointmentRepository() {
    const { appointmentRepository } = useAppDependencies()

    function createAppointment(appointment: Appointment) {
        appointmentRepository.createAppointment(appointment, (state, result) => {
            switch (state) {
                case "success":
                    showCreateAppointmentSuccessToast()
                    return;
                case "error":
                    showCreateAppointmentFailedToast(result)
                    return;
            }
        })
    }

    async function updateAppointment(appointment: Appointment) {
        await appointmentRepository.updateAppointment(appointment, (state, result) => {
            switch (state) {
                case "success":
                    showUpdateAppointmentSuccessToast()
                    return;
                case "error":
                    showUpdateAppointmentFailedToast(result)
                    return;
            }
        })
    }
    function deleteAppointment(appointment: Appointment) {
        appointmentRepository.deleteAppointment(appointment, (state, result) => {
            switch (state) {
                case "success":
                    showDeleteAppointmentSuccessToast()
                    return;
                case "error":
                    showDeleteAppointmentFailedToast(result)
                    return;
            }
        })
    }

    async function updateStatus(appointment: Appointment, status: AppointmentStatus) {
        await appointmentRepository.updateAppointmentStatus(appointment, status, (state, result) => {
            switch (state) {
                case "success":
                    showUpdateStatusSuccessToast()
                    return;
                case "error":
                    showUpdateStatusFailedToast(result)
                    return;
            }
        })
    }

    function createRating(appointment: Appointment, rating: AppointmentRating) {
        appointmentRepository.createAppointmentRating(appointment, rating, (state, result) => {
            switch (state) {
                case "success":
                    showCreateRatingSuccessToast()
                    return;
                case "error":
                    showCreateRatingFailedToast(result)
                    return;
            }
        })
    }
    async function updateRating(appointment: Appointment, rating: AppointmentRating) {
        appointmentRepository.updateAppointmentRating(appointment, rating, (state, result) => {
            switch (state) {
                case "success":
                    showUpdateRatingSuccessToast()
                    return;
                case "error":
                    showUpdateRatingFailedToast(result)
                    return;
            }
        })
    }

    return { 
        createAppointment, 
        updateAppointment, 
        deleteAppointment, 
        updateStatus, 
        createRating, 
        updateRating
    }
}

export function useAppointmentsFilteredByVolunteer(elementLimit: number) {
    const { appointmentRepository } = useAppDependencies()

    const [volunteer, setVolunteer] = useState<Volunteer | null>(null)

    const { result: appointments, setAppointments }     = useAppointments()
    const { page, pageControls, pageCursor }    = usePages<Appointment>()

    useEffect(() => {
        if (!volunteer) {
            setAppointments(new Map<string, Appointment>())
            return
        }

        const c = pageCursor.get()
        return appointmentRepository.subscribeForVolunteerAppointments(volunteer, c, elementLimit, setAppointments)
    }, [appointmentRepository, elementLimit, pageCursor, setAppointments, volunteer])

    useEffect(() => {
        if (appointments.length >= elementLimit) {
            const t = appointments[appointments.length - 1]
            pageCursor.set(t.data)
        }
    }, [appointments, elementLimit, pageCursor])

    return { appointments, page, ...pageControls, for: setVolunteer }
}
export function useAppointmentRatingsFilteredByDog(elementLimit: number) {
    const { appointmentRepository } = useAppDependencies()

    const [dog, setDog] = useState<Dog | null>(null)

    const [ratings, setRatings]                 = useState<AppointmentRating[]>([])
    const { page, pageControls, pageCursor }    = usePages<AppointmentRating>()

    useEffect(() => {
        if (!dog)
            return

        const c = pageCursor.get()
        return appointmentRepository.subscribeForDogAppointmentRatings(dog, c, elementLimit, (r) => {
            const ratings = Array.from(r.values()) 
            setRatings(ratings) 
        })
    }, [dog, appointmentRepository, elementLimit, pageCursor, page])

    useEffect(() => {
        if (ratings.length >= elementLimit) {
            const t = ratings[ratings.length - 1]
            pageCursor.set(t)
        }
    }, [ratings, elementLimit, pageCursor])

    return { ratings, page, ...pageControls, for: setDog }
}

function useAppointments() {
    const [appointments,    setAppointments]        = useState(new Map<string, Appointment>())
    const [status,          setAppointmentStatus]   = useState(new Map<string, AppointmentStatus>())
    const [ratings,         setAppointmentRatings]  = useState(new Map<string, AppointmentRating>())

    const result = useMemo(
        () => setupAppointments(appointments, status, ratings),
        [appointments, status, ratings]
    )

    return { 
        result, 
        appointments, 
        setAppointments, 
        status, 
        setAppointmentStatus, 
        ratings, 
        setAppointmentRatings
    }
}

export function useAppointmentStatusCollection(states: AppointmentStatusEnum[], elementLimit: number) {
    const { appointmentRepository } = useAppDependencies()

    const [filterByStates,      setFilterByStates]      = useState<AppointmentStatusEnum[]>(states)
    const [filterByVolunteer,   setFilterByVolunteer]   = useState<Volunteer | null>(null)

    const collection                                = useAppointments()
    const { page, pageControls, pageCursor }        = usePages<AppointmentStatus>()

    useEffect(() => {
        if (!filterByStates.length) {
            collection.setAppointmentStatus(new Map<string, AppointmentStatus>())
            return
        }

        const cursor = pageCursor.get()
        return appointmentRepository.subscribeForAppointmentStatus(filterByStates, filterByVolunteer, cursor, elementLimit, collection.setAppointmentStatus)
    }, [filterByStates, filterByVolunteer, page, pageCursor, appointmentRepository, elementLimit, collection])

    useEffect(() => {
        if (!collection.status) {
            collection.setAppointments(new Map<string, Appointment>())
            return
        }

        const keys = Array.from(collection.status.keys())
        return appointmentRepository.subscribeForAppointments(keys, collection.setAppointments)
    }, [appointmentRepository, collection])

    useEffect(() => {
        if (!collection.status) {
            collection.setAppointmentRatings(new Map<string, AppointmentRating>())
            return
        }

        const keys = Array.from(collection.status.keys())
        return appointmentRepository.subscribeForAppointmentRatings(keys, collection.setAppointmentRatings)
    }, [appointmentRepository, collection])

    useEffect(() => {
        if (collection.result.length >= elementLimit) {
            const t = collection.result[collection.result.length - 1]
            if (!t.statusData)
                return

            pageCursor.set(t.statusData)
        }
    }, [collection.result, elementLimit, pageCursor])

    return { appointments: collection.appointments, with: setFilterByStates, for: setFilterByVolunteer, page, ...pageControls }
}