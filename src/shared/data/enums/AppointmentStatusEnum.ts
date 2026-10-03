export type AppointmentStatusEnum = "pending" | "confirmed" | "canceled" | "completed"

export const AppointmentStatusAll = ["pending", "confirmed", "canceled", "completed"]

export function getAppointmentStatusTitle(
    status: AppointmentStatusEnum
): string {
    switch (status) {
        case "pending":
            return "Pending"
        case "confirmed":
            return "Confirmed"
        case "completed":
            return "Completed"
        case "canceled":
            return "Canceled"
    }
}
export function getAppointmentStatusColor(
    status: AppointmentStatusEnum
): string {
    switch (status) {
        case "pending":
            return "yellow"
        case "confirmed":
            return "gray"
        case "completed":
            return "green"
        case "canceled":
            return "red"
    }
}