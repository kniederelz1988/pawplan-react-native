import { Appointment, AppointmentRating, AppointmentStatus } from "@/shared/data/Appointment";
import { AppointmentStatusEnum } from "@/shared/data/enums/AppointmentStatusEnum";
import AppointmentRepository, { AppointmentRatingsListener, AppointmentStatesListener, AppointmentsListener } from "@/shared/repositories/AppointmentRepository";
import { RepositoryDateCompareEnum } from "@/shared/repositories/enums/RepositoryDate";
import { RepositoryOperationCallback } from "@/shared/repositories/utils/RepositoryOperationCallback";
import { Volunteer } from "@/shared/data/Volunteer";
import { Dog } from "@/shared/data/Dog";
import { useEffect } from "react";
import { now } from "@/shared/data/utils/TimeHelpers";
import { parseAbsoluteToLocal, toCalendarDateTime } from "@internationalized/date";

type AppointmentUnsubscribe = () => void;
type AppointmentSeed = [
    string,
    string,
    string,
    string,
    AppointmentStatus["status"],
    number?,
    string?,
];

export default function MockAppointmentRepository(): AppointmentRepository {

    const ratingComments = [
        "A wonderful walk.",
        "Friendly and easy to handle.",
        "Great energy throughout the visit.",
        "Calm, happy, and a lovely companion.",
        "Would happily spend time together again.",
    ];

    const seedRows: AppointmentSeed[] = [
        ["appointment-001", "dog-002", "volunteer-001", "2025-01-17T10:00:00.000Z", "completed", 1],
        ["appointment-002", "dog-003", "volunteer-002", "2025-02-02T10:00:00.000Z", "completed", 2],
        ["appointment-003", "dog-003", "volunteer-001", "2025-02-05T10:00:00.000Z", "completed", 3],
        ["appointment-004", "dog-004", "volunteer-002", "2025-02-14T10:00:00.000Z", "completed", 3],
        ["appointment-005", "dog-004", "volunteer-001", "2025-02-17T10:00:00.000Z", "completed", 4],
        ["appointment-006", "dog-004", "volunteer-002", "2025-02-20T10:00:00.000Z", "completed", 5],
        ["appointment-007", "dog-005", "volunteer-001", "2025-03-01T10:00:00.000Z", "completed", 4],
        ["appointment-008", "dog-005", "volunteer-002", "2025-03-04T10:00:00.000Z", "completed", 5],
        ["appointment-009", "dog-005", "volunteer-001", "2025-03-07T10:00:00.000Z", "completed", 1],
        ["appointment-010", "dog-005", "volunteer-002", "2025-03-10T10:00:00.000Z", "completed", 2],
        ["appointment-011", "dog-006", "volunteer-001", "2025-03-19T10:00:00.000Z", "completed", 5],
        ["appointment-012", "dog-006", "volunteer-002", "2025-03-22T10:00:00.000Z", "completed", 1],
        ["appointment-014", "dog-006", "volunteer-002", "2025-03-28T10:00:00.000Z", "completed", 3],
        ["appointment-015", "dog-006", "volunteer-001", "2025-03-31T10:00:00.000Z", "completed", 4],
        ["appointment-016", "dog-007", "volunteer-002", "2025-04-12T10:00:00.000Z", "completed", 2],
        ["appointment-017", "dog-008", "volunteer-001", "2025-04-24T10:00:00.000Z", "completed", 4],
        ["appointment-018", "dog-008", "volunteer-002", "2025-04-27T10:00:00.000Z", "completed", 5],
        ["appointment-019", "dog-008", "volunteer-001", "2025-04-30T10:00:00.000Z", "completed", 1],
        ["appointment-020", "dog-008", "volunteer-002", "2025-05-03T10:00:00.000Z", "completed", 2],
        ["appointment-021", "dog-009", "volunteer-001", "2025-05-15T10:00:00.000Z", "completed", 5],
        ["appointment-022", "dog-009", "volunteer-002", "2025-05-18T10:00:00.000Z", "completed", 1],
        ["appointment-023", "dog-010", "volunteer-001", "2025-05-27T10:00:00.000Z", "completed", 1],
        ["appointment-024", "dog-010", "volunteer-002", "2025-05-30T10:00:00.000Z", "completed", 2],
        ["appointment-025", "dog-010", "volunteer-001", "2025-06-02T10:00:00.000Z", "completed", 3],
        ["appointment-026", "dog-001", "volunteer-002", "2026-10-03T10:00:00.000Z", "confirmed"],
        ["appointment-027", "dog-005", "volunteer-001", "2026-10-07T14:00:00.000Z", "pending"],
        ["appointment-028", "dog-010", "volunteer-002", "2026-10-11T09:30:00.000Z", "pending"],
    ];

    const subscribers = new Set<() => void>();


    const appointments = new Map<string, Appointment>();
    const statuses = new Map<string, AppointmentStatus>();
    const ratings = new Map<string, AppointmentRating>();

    useEffect(() => {
        appointments.clear()
        statuses.clear()
        ratings.clear()

        for (const [id, dogId, volunteerId, dateString, status, rating, comment] of seedRows) {
            const date = toCalendarDateTime(parseAbsoluteToLocal(dateString));
            const appointment: Appointment = {
                id,
                dogId,
                volunteerId,
                createdAt: now(),
                date,
                type: "walk",
            };
            appointments.set(id, appointment);
            statuses.set(id, {
                appointmentId: id,
                dogId,
                volunteerId,
                status,
                updateAt: date,
                updatedBy: volunteerId,
            });
            if (rating !== undefined) {
                ratings.set(id, {
                    appointmentId: id,
                    dogId,
                    volunteerId,
                    updateAt: date,
                    rating,
                    comment: comment ?? ratingComments[rating - 1],
                });
            }
        }  
    }, [])

    function getNextAppointmentId(): string {
        let number = 1;
        let id = `appointment-${String(number).padStart(3, "0")}`;
        while (appointments.has(id)) {
            number++;
            id = `appointment-${String(number).padStart(3, "0")}`;
        }
        return id;
    }

    function subscribe(listener: () => void): AppointmentUnsubscribe {
        subscribers.add(listener);
        listener();
        return () => subscribers.delete(listener);
    }

    function notifySubscribers(): void {
        subscribers.forEach((listener) => listener());
    }

    function mapAppointments(items: Appointment[]): Map<string, Appointment> {
        return new Map(items.flatMap((appointment) =>
            appointment.id ? [[appointment.id, appointment] as const] : []
        ));
    }

    function pageAppointments(
        items: Appointment[],
        queryCursor: Appointment | null,
        queryLimit: number,
        direction: "asc" | "desc",
    ): Appointment[] {
        const sorted = [...items].sort((a, b) =>
            direction === "asc"
                ? a.date.compare(b.date)
                : b.date.compare(a.date)
        );
        const cursorIndex = queryCursor?.id
            ? sorted.findIndex((appointment) => appointment.id === queryCursor.id)
            : -1;
        const remaining = cursorIndex >= 0
            ? sorted.slice(cursorIndex + 1)
            : queryCursor
                ? sorted.filter((appointment) => direction === "asc"
                    ? appointment.date > queryCursor.date
                    : appointment.date < queryCursor.date)
                : sorted;

        return remaining.slice(0, Math.max(0, queryLimit));
    }

    function subscribeForVolunteerAppointments(
        volunteer: Volunteer,
        queryCursor: Appointment | null,
        queryLimit: number,
        listener: AppointmentsListener,
    ): AppointmentUnsubscribe | undefined {
        if (!volunteer.id) return undefined;

        return subscribe(() => {
            const matching = [...appointments.values()].filter(
                (appointment) => appointment.volunteerId === volunteer.id,
            );
            listener(mapAppointments(pageAppointments(matching, queryCursor, queryLimit, "asc")));
        });
    }

    function subscribeForAllAppointments(
        date: RepositoryDateCompareEnum,
        queryCursor: Appointment | null,
        queryLimit: number,
        listener: AppointmentsListener,
    ): AppointmentUnsubscribe {
        return subscribe(() => {
            const matching = [...appointments.values()].filter((appointment) =>
                date === "past" ? appointment.date < now() : appointment.date >= now()
            );
            const direction = date === "past" ? "desc" : "asc";
            listener(mapAppointments(pageAppointments(matching, queryCursor, queryLimit, direction)));
        });
    }

    function subscribeForAllDogAppointments(
        dogId: string,
        listener: AppointmentsListener,
    ): AppointmentUnsubscribe {
        return subscribe(() => listener(mapAppointments([...appointments.values()].filter(
            (appointment) => appointment.dogId === dogId,
        ))));
    }

    function subscribeForAppointments(
        appointmentIds: string[],
        listener: AppointmentsListener,
    ): AppointmentUnsubscribe {
        return subscribe(() => listener(new Map(appointmentIds.flatMap((id) => {
            const appointment = appointments.get(id);
            return appointment ? [[id, appointment] as const] : [];
        }))));
    }

    function subscribeForAppointmentStatus(
        status: AppointmentStatusEnum[],
        volunteer: Volunteer | null,
        queryCursor: AppointmentStatus | null,
        queryLimit: number,
        listener: AppointmentStatesListener,
    ): AppointmentUnsubscribe | undefined {
        if (volunteer && !volunteer.id) return undefined;

        return subscribe(() => {
            const matching = [...statuses.entries()]
                .filter(([, state]) => status.includes(state.status)
                    && (!volunteer?.id || state.volunteerId === volunteer.id))
                .sort(([, a], [, b]) => a.updateAt.compare(b.updateAt))
            const afterCursor = queryCursor
                ? matching.filter(([, state]) => state.updateAt > queryCursor.updateAt)
                : matching;
            listener(new Map<string, AppointmentStatus>(afterCursor.slice(0, Math.max(0, queryLimit))));
        });
    }

    function subscribeForAppointmentStates(
        appointmentIds: string[],
        listener: AppointmentStatesListener,
    ): AppointmentUnsubscribe {
        return subscribe(() => listener(new Map(appointmentIds.flatMap((id) => {
            const state = statuses.get(id);
            return state ? [[id, state] as const] : [];
        }))));
    }

    function subscribeForAppointmentRatings(
        appointmentIds: string[],
        listener: AppointmentRatingsListener,
    ): AppointmentUnsubscribe {
        return subscribe(() => listener(new Map(appointmentIds.flatMap((id) => {
            const rating = ratings.get(id);
            return rating ? [[id, rating] as const] : [];
        }))));
    }

    function subscribeForDogAppointmentRatings(
        dog: Dog,
        queryCursor: AppointmentRating | null,
        queryLimit: number,
        listener: AppointmentRatingsListener,
    ): AppointmentUnsubscribe | undefined {
        if (!dog.id) return undefined;

        return subscribe(() => {
            const matching = [...ratings.entries()]
                .filter(([, rating]) => rating.dogId === dog.id)
                .sort(([, a], [, b]) => b.updateAt.compare(a.updateAt));
            const cursorIndex = queryCursor
                ? matching.findIndex(([, rating]) =>
                    rating.appointmentId === queryCursor.appointmentId
                )
                : -1;
            const remaining = cursorIndex >= 0
                ? matching.slice(cursorIndex + 1)
                : queryCursor
                    ? matching.filter(([, rating]) => rating.updateAt < queryCursor.updateAt)
                    : matching;
            listener(new Map<string, AppointmentRating>(remaining.slice(0, Math.max(0, queryLimit))));
        });
    }

    async function createAppointment(
        appointment: Appointment,
        operationCallback: RepositoryOperationCallback,
    ): Promise<void> {
        const id = appointment.id ?? getNextAppointmentId();
        if (appointments.has(id)) {
            operationCallback("error", "Appointment already exists.");
            return;
        }

        const created = { ...appointment, id };
        appointments.set(id, created);
        statuses.set(id, {
            appointmentId: id,
            dogId: created.dogId,
            volunteerId: created.volunteerId,
            status: "pending",
            updateAt: now(),
            updatedBy: created.volunteerId,
        });
        notifySubscribers();
        operationCallback("success", id);
    }

    async function updateAppointment(
        appointment: Appointment,
        operationCallback: RepositoryOperationCallback,
    ): Promise<void> {
        if (!appointment.id || !appointments.has(appointment.id)) {
            operationCallback("error", "Appointment not found.");
            return;
        }

        appointments.set(appointment.id, appointment);
        notifySubscribers();
        operationCallback("success");
    }

    async function deleteAppointment(
        appointment: Appointment,
        operationCallback: RepositoryOperationCallback,
    ): Promise<void> {
        if (!appointment.id || !appointments.has(appointment.id)) {
            operationCallback("error", "Appointment not found.");
            return;
        }

        appointments.delete(appointment.id);
        statuses.delete(appointment.id);
        ratings.delete(appointment.id);
        notifySubscribers();
        operationCallback("success");
    }

    async function updateAppointmentStatus(
        appointment: Appointment,
        appointmentState: AppointmentStatus,
        operationCallback: RepositoryOperationCallback,
    ): Promise<void> {
        if (!appointment.id || !appointments.has(appointment.id)) {
            operationCallback("error", "Appointment not found.");
            return;
        }

        statuses.set(appointment.id, appointmentState);
        notifySubscribers();
        operationCallback("success");
    }

    async function createAppointmentRating(
        appointment: Appointment,
        rating: AppointmentRating,
        operationCallback: RepositoryOperationCallback,
    ): Promise<void> {
        if (!appointment.id || !appointments.has(appointment.id)) {
            operationCallback("error", "Appointment not found.");
            return;
        }
        if (ratings.has(appointment.id)) {
            operationCallback("error", "Appointment rating already exists.");
            return;
        }

        ratings.set(appointment.id, rating);
        notifySubscribers();
        operationCallback("success");
    }

    async function updateAppointmentRating(
        appointment: Appointment,
        rating: AppointmentRating,
        operationCallback: RepositoryOperationCallback,
    ): Promise<void> {
        if (!appointment.id || !ratings.has(appointment.id)) {
            operationCallback("error", "Appointment rating not found.");
            return;
        }

        ratings.set(appointment.id, rating);
        notifySubscribers();
        operationCallback("success");
    }

    return {
        subscribeForVolunteerAppointments,
        subscribeForAllAppointments,
        subscribeForAllDogAppointments,
        subscribeForAppointments,
        subscribeForAppointmentStatus,
        subscribeForAppointmentStates,
        subscribeForAppointmentRatings,
        subscribeForDogAppointmentRatings,
        createAppointment,
        updateAppointment,
        deleteAppointment,
        updateAppointmentStatus,
        createAppointmentRating,
        updateAppointmentRating,
    };
}