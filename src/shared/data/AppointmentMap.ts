import { Appointment, AppointmentRating, AppointmentStatus } from "./Appointment"

export declare type AppointmentMap = {
    data: Appointment,
    statusData?: AppointmentStatus,
    ratingData?: AppointmentRating
}

export function setupAppointments(
    modelMap: Map<string, Appointment>, 
    statusMap: Map<string, AppointmentStatus>,
    ratingMap: Map<string, AppointmentRating>
) : AppointmentMap[] {
    const appointments: AppointmentMap[] = []

    modelMap.forEach((data, id) => {
        appointments.push({ 
            data: data, 
            statusData: statusMap.get(id), 
            ratingData: ratingMap.get(id)
        })
    })

    return appointments
}