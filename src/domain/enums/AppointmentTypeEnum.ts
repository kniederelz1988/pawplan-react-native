export type AppointmentTypeEnum = "walk"

export function getAppointmentTypeTitle(role: AppointmentTypeEnum) {
    switch (role) {
        case "walk":
            return "Walk"
    }
}